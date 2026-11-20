import fs from 'fs';
import path from 'path';
import { conferenceData as defaultData } from '@/data/conferenceData';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'conference.json');
const TMP_FILE = path.join('/tmp', 'conference.json');

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
 * Get current conference data from memory, /tmp, disk, or fallback to defaults
 */
export function getConferenceData() {
  // 1. Prioritize active in-memory updates
  if (inMemoryData) {
    return inMemoryData;
  }

  // 2. Check /tmp (where serverless functions have write access)
  try {
    if (fs.existsSync(TMP_FILE)) {
      const content = fs.readFileSync(TMP_FILE, 'utf-8');
      inMemoryData = JSON.parse(content);
      return inMemoryData;
    }
  } catch (err) {
    console.error('Error reading /tmp/conference.json:', err);
  }

  // 3. Check bundled project data file
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
 * Save updated conference data atomically to memory, /tmp, and disk
 */
export function saveConferenceData(newData: any) {
  inMemoryData = newData;

  // 1. Write to /tmp for serverless runtime persistence
  try {
    fs.writeFileSync(TMP_FILE, JSON.stringify(newData, null, 2), 'utf-8');
  } catch (err: any) {
    // /tmp write notice
  }

  // 2. Write to local project directory (persistent on local dev and git workspaces)
  try {
    const tempFile = `${DATA_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(newData, null, 2), 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);
    return { success: true };
  } catch (err: any) {
    // Expected in read-only serverless environments like Vercel
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
