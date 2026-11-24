import fs from 'fs';
import path from 'path';
import { conferenceData as defaultData } from '@/data/conferenceData';
import { put } from '@vercel/blob';
import prisma from '@/lib/prisma';
import { getActiveEdition, formatEditionToConferenceData } from '@/lib/editionService';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'conference.json');
const TMP_FILE = path.join('/tmp', 'conference.json');
const BLOB_URL = 'https://rc7k52a2g5kulnhr.public.blob.vercel-storage.com/data/conference.json';

// In-memory cache for ultra-fast response within the same lambda instance
let inMemoryData: any = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 1000;

// Ensure directory exists safely
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {}

/**
 * Get current conference data from PostgreSQL (Neon), Vercel Blob, or local cache
 */
export async function getConferenceData(forceFresh = false): Promise<any> {
  const now = Date.now();
  if (inMemoryData && !forceFresh && now - lastFetchTime < CACHE_TTL_MS) {
    return inMemoryData;
  }

  // 1. Primary Store: PostgreSQL via Prisma (multi-edition active published edition)
  if (process.env.DATABASE_URL) {
    try {
      const activeEdition = await getActiveEdition();
      if (activeEdition) {
        const formatted = formatEditionToConferenceData(activeEdition);
        if (formatted) {
          if (inMemoryData?.header?.logo) {
            formatted.header = { ...formatted.header, ...inMemoryData.header };
          }
          inMemoryData = formatted;
          lastFetchTime = now;
          try {
            fs.writeFileSync(TMP_FILE, JSON.stringify(formatted, null, 2), 'utf-8');
          } catch (_) {}
          return formatted;
        }
      }
    } catch (dbErr) {
      console.error('PostgreSQL fetch error, falling through to Blob store:', dbErr);
    }
  }

  // 2. Secondary Store: Vercel Blob
  try {
    const res = await fetch(`${BLOB_URL}?t=${now}`, {
      cache: 'no-store',
      headers: { 'Cache-Control': 'no-cache, no-store' },
    });
    if (res.ok) {
      const liveData = await res.json();
      if (liveData && typeof liveData === 'object' && liveData.meta) {
        inMemoryData = liveData;
        lastFetchTime = now;
        try {
          fs.writeFileSync(TMP_FILE, JSON.stringify(liveData, null, 2), 'utf-8');
        } catch (_) {}
        return liveData;
      }
    }
  } catch (blobErr) {}

  // 3. In-memory fallback
  if (inMemoryData) {
    return inMemoryData;
  }

  // 4. /tmp fallback
  try {
    if (fs.existsSync(TMP_FILE)) {
      const content = fs.readFileSync(TMP_FILE, 'utf-8');
      inMemoryData = JSON.parse(content);
      lastFetchTime = now;
      return inMemoryData;
    }
  } catch (err) {}

  // 5. Bundled file fallback
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      inMemoryData = JSON.parse(content);
      lastFetchTime = now;
      return inMemoryData;
    }
  } catch (err) {}

  return defaultData;
}

/**
 * Synchronous getter for emergency fallback
 */
export function getConferenceDataSync(): any {
  if (inMemoryData) return inMemoryData;
  try {
    if (fs.existsSync(TMP_FILE)) {
      return JSON.parse(fs.readFileSync(TMP_FILE, 'utf-8'));
    }
  } catch (_) {}
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
    }
  } catch (_) {}
  return defaultData;
}

/**
 * Save updated conference data atomically to PostgreSQL, Vercel Blob, in-memory, /tmp, and disk
 */
export async function saveConferenceData(newData: any): Promise<{ success: boolean; error?: string }> {
  inMemoryData = newData;
  lastFetchTime = Date.now();

  // 1. Write to PostgreSQL if available
  if (process.env.DATABASE_URL) {
    try {
      const active = await prisma.conferenceEdition.findFirst({
        where: { isActivePublic: true },
      });
      if (active) {
        await prisma.conferenceEdition.update({
          where: { id: active.id },
          data: {
            year: newData.meta?.year || active.year,
            datesDisplay: newData.meta?.dates || active.datesDisplay,
            themeTitle: newData.theme?.mainHeadingSpan || active.themeTitle,
            themeSubtitle: newData.theme?.subtitle || active.themeSubtitle,
            themeScripture: newData.theme?.quoteText || active.themeScripture,
            themeReference: newData.theme?.quoteRef || active.themeReference,
            themeSummary: newData.theme?.p1 || active.themeSummary,
            heroPreTitle: newData.hero?.preTitle || active.heroPreTitle,
            heroTagline: newData.hero?.tagline || active.heroTagline,
            heroBgImageUrl: newData.hero?.bgImage || active.heroBgImageUrl,
            aboutPreTitle: newData.about?.preTitle || active.aboutPreTitle,
            aboutP1: newData.about?.p1 || active.aboutP1,
            aboutP2: newData.about?.p2 || active.aboutP2,
            aboutStats: newData.about?.stats || active.aboutStats,
            aboutSlides: newData.about?.slides || active.aboutSlides,
          },
        });
      }
    } catch (dbErr: any) {
      console.error('PostgreSQL update error:', dbErr);
    }
  }

  // 2. Write to Vercel Blob store
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    try {
      await put('data/conference.json', JSON.stringify(newData, null, 2), {
        access: 'public',
        addRandomSuffix: false,
        allowOverwrite: true,
        cacheControlMaxAge: 0,
      });
    } catch (blobErr: any) {
      console.error('Failed to put conference.json to Blob:', blobErr);
    }
  }

  // 3. Write to /tmp
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(newData, null, 2), 'utf-8');
  } catch (_) {}

  // 4. Write to local file
  try {
    const tempFile = `${DATA_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(newData, null, 2), 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);
  } catch (_) {}

  return { success: true };
}

/**
 * Reset conference data back to initial default
 */
export async function resetConferenceData(): Promise<{ success: boolean; error?: string }> {
  return await saveConferenceData(defaultData);
}
