import fs from 'fs';
import path from 'path';

export interface RegistrationRecord {
  id: string;
  year: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  street?: string;
  street2?: string;
  zip?: string;
  city: string;
  state: string;
  country: string;
  church: string;
  designation: string;
  planId: string;
  planTitle: string;
  amount: number;
  paymentStatus: 'pending' | 'confirmed' | 'cancelled';
  paymentReference?: string;
  notes?: string;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const REGISTRATIONS_FILE = path.join(DATA_DIR, 'registrations.json');

const INITIAL_REGISTRATIONS: RegistrationRecord[] = [
  {
    id: 'AIPC-2026-001',
    year: '2026',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    firstName: 'Samuel',
    lastName: 'Raj',
    email: 'samuel.raj@gracechurch.in',
    phone: '+91 98201 45678',
    age: '42',
    gender: 'Male',
    street: '14 Chapel Road, Bandra West',
    zip: '400050',
    city: 'Mumbai',
    state: 'Maharashtra',
    country: 'India',
    church: 'Grace Reformed Church Mumbai',
    designation: 'Senior Pastor',
    planId: 'triple',
    planTitle: 'Triple Sharing',
    amount: 5999,
    paymentStatus: 'confirmed',
    paymentReference: 'UPI-9820145678-01',
    notes: 'Paid via GPay, confirmed by accounts team.',
  },
  {
    id: 'AIPC-2026-002',
    year: '2026',
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    firstName: 'Benjamin',
    lastName: 'Kurian',
    email: 'b.kurian@covenantblr.org',
    phone: '+91 98450 12345',
    age: '38',
    gender: 'Male',
    street: '5th Main, Indiranagar',
    zip: '560038',
    city: 'Bengaluru',
    state: 'Karnataka',
    country: 'India',
    church: 'Covenant Baptist Fellowship',
    designation: 'Elder / Teacher',
    planId: 'double',
    planTitle: 'Double Sharing',
    amount: 9999,
    paymentStatus: 'confirmed',
    paymentReference: 'NEFT-HDFC-99238',
    notes: 'Requested room sharing with Pastor Mathew.',
  },
  {
    id: 'AIPC-2026-003',
    year: '2026',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    firstName: 'David',
    lastName: 'Lal',
    email: 'davidlal.delhi@gmail.com',
    phone: '+91 98110 87654',
    age: '33',
    gender: 'Male',
    street: 'B-44 Green Park',
    zip: '110016',
    city: 'New Delhi',
    state: 'Delhi',
    country: 'India',
    church: 'Bethel Bible Church',
    designation: 'Associate Pastor',
    planId: 'quadruple',
    planTitle: 'Quadruple Sharing',
    amount: 3999,
    paymentStatus: 'pending',
    paymentReference: '',
    notes: 'Awaiting bank transfer confirmation slip.',
  },
  {
    id: 'AIPC-2026-004',
    year: '2026',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    firstName: 'Timothy',
    lastName: 'Fernandez',
    email: 'timothy.f@cityfellowship.in',
    phone: '+91 94220 33445',
    age: '45',
    gender: 'Male',
    street: 'Lane 7, Koregaon Park',
    zip: '411001',
    city: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    church: 'City Bible Fellowship',
    designation: 'Lead Pastor',
    planId: 'triple',
    planTitle: 'Triple Sharing',
    amount: 5999,
    paymentStatus: 'confirmed',
    paymentReference: 'UPI-77441199',
    notes: 'Arriving by cab from Borivali station.',
  },
  {
    id: 'AIPC-2026-005',
    year: '2026',
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    firstName: 'Paul',
    lastName: 'Sunderraj',
    email: 'paul.sunder@chennaichurch.org',
    phone: '+91 94440 88211',
    age: '51',
    gender: 'Male',
    street: 'Anna Nagar West',
    zip: '600040',
    city: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    church: 'Emmanuel Reformed Baptist Church',
    designation: 'Senior Pastor',
    planId: 'double',
    planTitle: 'Double Sharing',
    amount: 9999,
    paymentStatus: 'pending',
    paymentReference: '',
    notes: 'Requested airport pickup info.',
  },
];

// In-memory cache for serverless environments (like Vercel)
let inMemoryRegistrations: RegistrationRecord[] | null = null;

// Ensure data directory exists safely
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  // Read-only filesystem in serverless environments
}

// Ensure registrations file exists safely
try {
  if (!fs.existsSync(REGISTRATIONS_FILE)) {
    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(INITIAL_REGISTRATIONS, null, 2), 'utf-8');
  }
} catch (err) {
  // Ignore EROFS in serverless environments
}

/**
 * Get all registrations from disk or memory
 */
export function getRegistrations(): RegistrationRecord[] {
  try {
    if (fs.existsSync(REGISTRATIONS_FILE)) {
      const content = fs.readFileSync(REGISTRATIONS_FILE, 'utf-8');
      inMemoryRegistrations = JSON.parse(content);
      return inMemoryRegistrations;
    }
  } catch (err) {
    console.error('Error reading registrations.json:', err);
  }
  if (inMemoryRegistrations) return inMemoryRegistrations;
  return INITIAL_REGISTRATIONS;
}

/**
 * Save registrations atomically to disk or memory
 */
export function saveRegistrations(records: RegistrationRecord[]): { success: boolean; error?: string } {
  inMemoryRegistrations = records;
  try {
    const tempFile = `${REGISTRATIONS_FILE}.tmp`;
    fs.writeFileSync(tempFile, JSON.stringify(records, null, 2), 'utf-8');
    fs.renameSync(tempFile, REGISTRATIONS_FILE);
    return { success: true };
  } catch (err: any) {
    console.warn('Filesystem write notice (expected in read-only serverless):', err.message);
    return { success: true };
  }
}

/**
 * Create a new attendee registration
 */
export function createRegistration(
  data: Omit<RegistrationRecord, 'id' | 'createdAt'> & { id?: string }
): RegistrationRecord {
  const records = getRegistrations();
  const nextSeq = records.length + 1;
  const year = data.year || '2026';
  const id = data.id || `AIPC-${year}-${String(nextSeq).padStart(3, '0')}`;

  const newRecord: RegistrationRecord = {
    ...data,
    id,
    year,
    createdAt: new Date().toISOString(),
    paymentStatus: data.paymentStatus || 'pending',
  };

  records.unshift(newRecord); // Add to beginning of array
  saveRegistrations(records);
  return newRecord;
}

/**
 * Update a registration by ID
 */
export function updateRegistration(
  id: string,
  updates: Partial<RegistrationRecord>
): RegistrationRecord | null {
  const records = getRegistrations();
  const index = records.findIndex((r) => r.id === id);
  if (index === -1) return null;

  records[index] = { ...records[index], ...updates };
  saveRegistrations(records);
  return records[index];
}

/**
 * Delete a registration by ID
 */
export function deleteRegistration(id: string): boolean {
  const records = getRegistrations();
  const filtered = records.filter((r) => r.id !== id);
  if (filtered.length === records.length) return false;

  saveRegistrations(filtered);
  return true;
}

/**
 * Get registration metrics
 */
export function getRegistrationStats() {
  const records = getRegistrations();
  const total = records.length;
  const confirmed = records.filter((r) => r.paymentStatus === 'confirmed').length;
  const pending = records.filter((r) => r.paymentStatus === 'pending').length;
  const cancelled = records.filter((r) => r.paymentStatus === 'cancelled').length;

  const totalRevenue = records
    .filter((r) => r.paymentStatus === 'confirmed')
    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const pendingRevenue = records
    .filter((r) => r.paymentStatus === 'pending')
    .reduce((sum, r) => sum + (Number(r.amount) || 0), 0);

  const byPlan: Record<string, number> = {};
  records.forEach((r) => {
    byPlan[r.planTitle || r.planId] = (byPlan[r.planTitle || r.planId] || 0) + 1;
  });

  return {
    total,
    confirmed,
    pending,
    cancelled,
    totalRevenue,
    pendingRevenue,
    byPlan,
  };
}
