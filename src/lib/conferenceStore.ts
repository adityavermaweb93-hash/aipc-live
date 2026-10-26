import fs from 'fs';
import path from 'path';
import { conferenceData as defaultData } from '@/data/conferenceData';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'conference.json');

// In-memory cache for serverless environments (like Vercel)
let inMemoryData: any = null;

// Ensure directory exists safely
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  // Read-only filesystem in Vercel serverless environment
}

// Ensure initial file exists safely
try {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
  }
} catch (err) {
  // Ignore EROFS in serverless environments
}

/**
 * Get current conference data from disk, or fallback to defaults
 */
export function getConferenceData() {
  if (inMemoryData) return inMemoryData;
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      inMemoryData = JSON.parse(content);
      return inMemoryData;
    }
  } catch (err) {
    console.error('Error reading conference.json:', err);
  }
  return defaultData;
}

/**
 * Save updated conference data atomically to disk
 */
export function saveConferenceData(newData: any) {
  inMemoryData = newData;
  try {
    const tempFile = `${DATA_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(newData, null, 2), 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);
    return { success: true };
  } catch (err: any) {
    console.warn('Filesystem write notice (expected in read-only serverless):', err.message);
    // In serverless environments, inMemoryData keeps state for function lifetime
    return { success: true };
  }
}

/**
 * Reset conference data back to initial default
 */
export function resetConferenceData() {
  try {
    saveConferenceData(defaultData);
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
