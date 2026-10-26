import fs from 'fs';
import path from 'path';

export interface ContactQuery {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: 'pending' | 'replied' | 'archived';
  replyNotes?: string;
  repliedAt?: string;
  repliedBy?: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const QUERIES_FILE = path.join(DATA_DIR, 'queries.json');

const INITIAL_QUERIES: ContactQuery[] = [
  {
    id: 'QRY-2026-001',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    name: 'Anand Varghese',
    email: 'anand.varghese@keralachurch.org',
    phone: '+91 94471 22334',
    message: 'Greetings in Christ! My train arrives at Borivali early around 10:30 AM on Sep 29. Can I complete early registration and wait in the hotel lobby before the 12:00 noon check-in?',
    status: 'pending',
    replyNotes: '',
  },
  {
    id: 'QRY-2026-002',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    name: 'Kiran Das',
    email: 'kiran.das@calcuttafellowship.in',
    phone: '+91 98300 55667',
    message: 'Hello, our church in Kolkata has two young evangelists who want to attend. They understand English well but speak moderately. Are they eligible to attend?',
    status: 'replied',
    replyNotes: 'Replied via email explaining that all expositions and panels are conducted in English, and comfortable comprehension is sufficient.',
    repliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    repliedBy: 'AIPC Secretariat',
  },
  {
    id: 'QRY-2026-003',
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
    name: 'George Thomas',
    email: 'george.thomas@gracehyd.org',
    phone: '+91 98490 88776',
    message: 'We are a delegation of 4 pastors coming from Hyderabad. Can we request to be placed together in the Quadruple Sharing room?',
    status: 'pending',
    replyNotes: '',
  },
  {
    id: 'QRY-2026-004',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    name: 'Manoj Sharma',
    email: 'm.sharma@delhicovenant.org',
    phone: '+91 98100 44332',
    message: 'Regarding the free book packages: are they provided physically at the conference registration counter? What is the weight so we can plan luggage accordingly?',
    status: 'replied',
    replyNotes: 'Replied via WhatsApp: physical book parcel approx 3.5kg given during registration packet pickup.',
    repliedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    repliedBy: 'AIPC Secretariat',
  },
];

// In-memory cache for serverless environments (like Vercel)
let inMemoryQueries: ContactQuery[] | null = null;

// Ensure directory exists safely
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  // Read-only filesystem in serverless environments
}

// Ensure queries file exists safely
try {
  if (!fs.existsSync(QUERIES_FILE)) {
    fs.writeFileSync(QUERIES_FILE, JSON.stringify(INITIAL_QUERIES, null, 2), 'utf-8');
  }
} catch (err) {
  // Ignore EROFS in serverless environments
}

/**
 * Get all contact queries
 */
export function getQueries(): ContactQuery[] {
  if (inMemoryQueries) return inMemoryQueries;
  try {
    if (fs.existsSync(QUERIES_FILE)) {
      const content = fs.readFileSync(QUERIES_FILE, 'utf-8');
      inMemoryQueries = JSON.parse(content);
      return inMemoryQueries;
    }
  } catch (err) {
    console.error('Error reading queries.json:', err);
  }
  return INITIAL_QUERIES;
}

/**
 * Save queries atomically to disk
 */
export function saveQueries(records: ContactQuery[]): { success: boolean; error?: string } {
  inMemoryQueries = records;
  try {
    const tempFile = `${QUERIES_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(records, null, 2), 'utf-8');
    fs.renameSync(tempFile, QUERIES_FILE);
    return { success: true };
  } catch (err: any) {
    console.warn('Filesystem write notice (expected in read-only serverless):', err.message);
    return { success: true };
  }
}

/**
 * Create a new visitor query
 */
export function createQuery(
  data: Omit<ContactQuery, 'id' | 'createdAt' | 'status'> & { id?: string }
): ContactQuery {
  const records = getQueries();
  const nextSeq = records.length + 1;
  const id = data.id || `QRY-${new Date().getFullYear()}-${String(nextSeq).padStart(3, '0')}`;

  const newRecord: ContactQuery = {
    ...data,
    id,
    createdAt: new Date().toISOString(),
    status: 'pending',
    replyNotes: '',
  };

  records.unshift(newRecord);
  saveQueries(records);
  return newRecord;
}

/**
 * Update a query status or reply note
 */
export function updateQuery(
  id: string,
  updates: Partial<ContactQuery>
): ContactQuery | null {
  const records = getQueries();
  const index = records.findIndex((q) => q.id === id);
  if (index === -1) return null;

  records[index] = { ...records[index], ...updates };
  saveQueries(records);
  return records[index];
}

/**
 * Delete a query
 */
export function deleteQuery(id: string): boolean {
  const records = getQueries();
  const filtered = records.filter((q) => q.id !== id);
  if (filtered.length === records.length) return false;

  saveQueries(filtered);
  return true;
}

/**
 * Get query metrics
 */
export function getQueryStats() {
  const records = getQueries();
  const total = records.length;
  const pending = records.filter((q) => q.status === 'pending').length;
  const replied = records.filter((q) => q.status === 'replied').length;
  const archived = records.filter((q) => q.status === 'archived').length;

  return {
    total,
    pending,
    replied,
    archived,
  };
}
