import {
  filterFinanceRecords,
  getPresetFinanceRange,
  sortFinanceRecords,
  summarizeFinanceRecords,
} from './financeService';

describe('financeService', () => {
  const records = [
    {
      id: 'finance-1',
      date: '2026-03-31T10:00:00.000Z',
      ordersCount: 5,
      revenue: 500,
      deposits: 100,
      profit: 400,
    },
    {
      id: 'finance-2',
      date: '2026-04-01T10:00:00.000Z',
      ordersCount: 7,
      revenue: 700,
      deposits: 150,
      profit: 550,
    },
    {
      id: 'finance-3',
      date: '2026-04-24T10:00:00.000Z',
      ordersCount: 9,
      revenue: 900,
      deposits: 200,
      profit: 700,
    },
    {
      id: 'finance-4',
      date: '2026-04-30T10:00:00.000Z',
      ordersCount: 11,
      revenue: 1100,
      deposits: 250,
      profit: 850,
    },
  ];

  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-04-30T12:00:00.000Z'));
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  test('computes preset ranges from the current date', () => {
    expect(getPresetFinanceRange(7)).toEqual({
      startDate: '2026-04-24',
      endDate: '2026-04-30',
    });
  });

  test('filters preset ranges using timestamp comparison', () => {
    const last7Days = filterFinanceRecords(records, '7');
    const last30Days = filterFinanceRecords(records, '30');

    expect(last7Days.map((record) => record.id)).toEqual(['finance-3', 'finance-4']);
    expect(last30Days.map((record) => record.id)).toEqual(['finance-2', 'finance-3', 'finance-4']);
  });

  test('filters custom ranges regardless of date order', () => {
    const filtered = filterFinanceRecords(records, 'custom', '2026-04-30', '2026-04-01');

    expect(filtered.map((record) => record.id)).toEqual(['finance-2', 'finance-3', 'finance-4']);
  });

  test('sorts and summarizes the selected records', () => {
    const selected = filterFinanceRecords(records, '30');
    const sortedByRevenue = sortFinanceRecords(selected, 'revenue', 'desc');
    const summary = summarizeFinanceRecords(records, selected);

    expect(sortedByRevenue[0].id).toBe('finance-4');
    expect(summary.selectedRevenue).toBe(2700);
    expect(summary.selectedProfit).toBe(2100);
    expect(summary.totalProfit).toBe(2500);
  });
});
