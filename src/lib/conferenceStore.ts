import fs from 'fs';
import path from 'path';
import { conferenceData as defaultData } from '@/data/conferenceData';
import { put } from '@vercel/blob';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'conference.json');
const TMP_FILE = path.join('/tmp', 'conference.json');
const BLOB_URL = 'https://rc7k52a2g5kulnhr.public.blob.vercel-storage.com/data/conference.json';

// In-memory cache for ultra-fast response within the same lambda instance
let inMemoryData: any = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 1500; // 1.5 seconds in-memory TTL to avoid repeated network hits within a single burst

// Ensure directory exists safely
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  // Read-only filesystem in Vercel serverless environment
}

/**
 * Get current conference data from Vercel Blob, /tmp, or local disk
 */
export async function getConferenceData(forceFresh = false): Promise<any> {
  const now = Date.now();
  if (inMemoryData && !forceFresh && now - lastFetchTime < CACHE_TTL_MS) {
    return inMemoryData;
  }

  // 1. Fetch live from Vercel Blob (centralized store across all serverless instances)
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
  } catch (blobErr) {
    // If offline / network error, fall through to local caches
  }

  // 2. Active in-memory fallback
  if (inMemoryData) {
    return inMemoryData;
  }

  // 3. /tmp fallback
  try {
    if (fs.existsSync(TMP_FILE)) {
      const content = fs.readFileSync(TMP_FILE, 'utf-8');
      inMemoryData = JSON.parse(content);
      lastFetchTime = now;
      return inMemoryData;
    }
  } catch (err) {}

  // 4. Bundled file fallback
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
 * Synchronous getter for any emergency sync fallback
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
 * Save updated conference data atomically to Vercel Blob, in-memory, /tmp, and disk
 */
export async function saveConferenceData(newData: any): Promise<{ success: boolean; error?: string }> {
  inMemoryData = newData;
  lastFetchTime = Date.now();

  // 1. Write to /tmp for serverless container fast access
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(newData, null, 2), 'utf-8');
  } catch (_) {}

  // 2. Write to local project directory if writable
  try {
    const tempFile = `${DATA_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(newData, null, 2), 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);
  } catch (_) {}

  // 3. Write to Vercel Blob store (persists across ALL serverless instances and deploys)
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
      return { success: false, error: `Blob storage error: ${blobErr.message}` };
    }
  }

  return { success: true };
}

/**
 * Reset conference data back to initial default
 */
export async function resetConferenceData(): Promise<{ success: boolean; error?: string }> {
  return await saveConferenceData(defaultData);
}
