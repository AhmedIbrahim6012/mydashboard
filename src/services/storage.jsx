import { generateId } from '../utils/id';

export const STORAGE_KEYS = {
  themeMode: 'mydashboard-theme-mode',
  language: 'mydashboard-language',
  auth: 'mydashboard-auth',
  workers: 'mydashboard-workers',
  professions: 'mydashboard-professions',
  customers: 'mydashboard-customers',
  financeRecords: 'mydashboard-finance-records',
};

function safeRead(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (error) {
    return fallback;
  }
}

function safeWrite(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Ignore storage failures and keep the app functional.
  }
}

export function readThemeMode() {
  return safeRead(STORAGE_KEYS.themeMode, 'light');
}

export function writeThemeMode(mode) {
  safeWrite(STORAGE_KEYS.themeMode, mode);
}

export function readLanguage() {
  return safeRead(STORAGE_KEYS.language, 'en');
}

export function writeLanguage(language) {
  safeWrite(STORAGE_KEYS.language, language);
}

export function readAuth() {
  // أولاً تحقق من التوكن الجديد
  const accessToken = localStorage.getItem('access_token');
  if (accessToken) {
    const admin = localStorage.getItem('admin');
    return admin ? JSON.parse(admin) : { loggedInAt: new Date().toISOString() };
  }
  // بعدين تحقق من الـ auth القديم
  return safeRead(STORAGE_KEYS.auth, null);
}

export function writeAuth(auth) {
  if (auth) {
    safeWrite(STORAGE_KEYS.auth, auth);
    return;
  }

  try {
    window.localStorage.removeItem(STORAGE_KEYS.auth);
  } catch (error) {
    // Ignore storage failures.
  }
}

export function createSeedWorkers() {
  const now = new Date().toISOString();

  return [
    {
      id: 'worker-1',
      name: 'Ava Johnson',
      phone: '+1 (555) 210-8890',
      experience: '6 years',
      professionId: 'profession-1',
      balance: 12400,
      createdAt: now,
      history: [
        {
          id: generateId('activity'),
          type: 'deposit',
          amount: 2400,
          note: 'Monthly incentive deposit',
          date: now,
        },
        {
          id: generateId('activity'),
          type: 'payment',
          amount: -1800,
          note: 'Equipment purchase deduction',
          date: now,
        },
      ],
    },
    {
      id: 'worker-2',
      name: 'Marcus Reed',
      phone: '+1 (555) 418-9901',
      experience: '4 years',
      professionId: 'profession-2',
      balance: 9800,
      createdAt: now,
      history: [
        {
          id: generateId('activity'),
          type: 'deposit',
          amount: 1800,
          note: 'Wallet top-up',
          date: now,
        },
      ],
    },
    {
      id: 'worker-3',
      name: 'Sophia Lee',
      phone: '+1 (555) 761-3320',
      experience: '8 years',
      professionId: 'profession-1',
      balance: 15350,
      createdAt: now,
      history: [
        {
          id: generateId('activity'),
          type: 'bonus',
          amount: 3500,
          note: 'Quarterly performance bonus',
          date: now,
        },
      ],
    },
    {
      id: 'worker-4',
      name: 'Noah Patel',
      phone: '+1 (555) 332-7741',
      experience: '3 years',
      professionId: 'profession-2',
      balance: 7100,
      createdAt: now,
      history: [],
    },
  ];
}

export function createSeedProfessions() {
  return [
    { id: 'profession-1', name: 'Electrician', commissionPercent: 12 },
    { id: 'profession-2', name: 'Plumber', commissionPercent: 8 },
  ];
}

export function createSeedCustomers() {
  const now = new Date().toISOString();

  return [
    {
      id: 'customer-1',
      fullName: 'Jordan Miles',
      phone: '+1 (555) 102-3344',
      email: 'jordan.miles@example.com',
      balance: 48.5,
      createdAt: now,
    },
    {
      id: 'customer-2',
      fullName: 'Riley Thompson',
      phone: '+1 (555) 778-9911',
      email: null,
      balance: 0,
      createdAt: now,
    },
  ];
}

export function createSeedFinanceRecords() {
  const records = [];
  const today = new Date();

  for (let index = 0; index < 60; index += 1) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() - (59 - index));

    const ordersCount = 24 + ((index * 3) % 18);
    const revenue = 18000 + index * 420 + (index % 6) * 760;
    const deposits = 4800 + (index % 5) * 260 + ordersCount * 18;
    const profit = revenue - deposits - ordersCount * 55;

    records.push({
      id: `finance-${currentDate.toISOString().slice(0, 10)}`,
      date: currentDate.toISOString(),
      ordersCount,
      revenue,
      deposits,
      profit,
    });
  }

  return records;
}

export function readWorkers() {
  const workers = safeRead(STORAGE_KEYS.workers, null);
  return Array.isArray(workers) && workers.length > 0 ? workers : createSeedWorkers();
}

export function writeWorkers(workers) {
  safeWrite(STORAGE_KEYS.workers, workers);
}

export function readProfessions() {
  const professions = safeRead(STORAGE_KEYS.professions, null);
  return Array.isArray(professions) && professions.length > 0 ? professions : createSeedProfessions();
}

export function writeProfessions(professions) {
  safeWrite(STORAGE_KEYS.professions, professions);
}

export function readCustomers() {
  const customers = safeRead(STORAGE_KEYS.customers, null);
  return Array.isArray(customers) && customers.length > 0 ? customers : createSeedCustomers();
}

export function writeCustomers(customers) {
  safeWrite(STORAGE_KEYS.customers, customers);
}

export function readFinanceRecords() {
  const records = safeRead(STORAGE_KEYS.financeRecords, null);
  return Array.isArray(records) && records.length > 0 ? records : createSeedFinanceRecords();
}

export function writeFinanceRecords(records) {
  safeWrite(STORAGE_KEYS.financeRecords, records);
}
