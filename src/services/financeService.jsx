export const FINANCE_RANGE_OPTIONS = [
  { label: 'Last 7 days', value: '7' },
  { label: 'Last 15 days', value: '15' },
  { label: 'Last 30 days', value: '30' },
  { label: 'Custom range', value: 'custom' },
];

function pad(value) {
  return String(value).padStart(2, '0');
}

function parseDateValue(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return new Date(value.getTime());
  }

  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function getLocalStartOfDayTimestamp(value) {
  const parsed = parseDateValue(value);

  if (!parsed) {
    return NaN;
  }

  parsed.setHours(0, 0, 0, 0);
  return parsed.getTime();
}

function getLocalEndOfDayTimestamp(value) {
  const parsed = parseDateValue(value);

  if (!parsed) {
    return NaN;
  }

  parsed.setHours(23, 59, 59, 999);
  return parsed.getTime();
}

function getRecordTimestamp(value) {
  const parsed = parseDateValue(value);
  return parsed ? parsed.getTime() : NaN;
}

export function toDateInputValue(value) {
  if (!value) {
    return '';
  }

  const parsed = parseDateValue(value);

  if (!parsed) {
    return '';
  }

  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}`;
}

export function getPresetFinanceRange(days, referenceDate = new Date()) {
  const start = new Date(referenceDate);
  const end = new Date(referenceDate);

  start.setDate(start.getDate() - Math.max(Number(days) - 1, 0));

  return {
    startDate: toDateInputValue(start),
    endDate: toDateInputValue(end),
  };
}

export function normalizeRecords(records) {
  return [...(records || [])].sort((left, right) => getRecordTimestamp(left.date) - getRecordTimestamp(right.date));
}

export function filterFinanceRecords(records, rangeType, customStartDate, customEndDate) {
  const normalizedRecords = normalizeRecords(records);

  if (rangeType === 'custom') {
    if (!customStartDate || !customEndDate) {
      return [];
    }

    const rangeStart = Math.min(getLocalStartOfDayTimestamp(customStartDate), getLocalStartOfDayTimestamp(customEndDate));
    const rangeEnd = Math.max(getLocalEndOfDayTimestamp(customStartDate), getLocalEndOfDayTimestamp(customEndDate));

    return normalizedRecords.filter((record) => {
      const recordTimestamp = getRecordTimestamp(record.date);
      return recordTimestamp >= rangeStart && recordTimestamp <= rangeEnd;
    });
  }

  const days = Number(rangeType) || 30;
  const { startDate, endDate } = getPresetFinanceRange(days);
  const rangeStart = getLocalStartOfDayTimestamp(startDate);
  const rangeEnd = getLocalEndOfDayTimestamp(endDate);

  return normalizedRecords.filter((record) => {
    const recordTimestamp = getRecordTimestamp(record.date);
    return recordTimestamp >= rangeStart && recordTimestamp <= rangeEnd;
  });
}

export function sortFinanceRecords(records, orderBy, order) {
  const sorted = normalizeRecords(records);

  return sorted.sort((left, right) => {
    let comparison = 0;

    if (orderBy === 'date') {
      comparison = getRecordTimestamp(left.date) - getRecordTimestamp(right.date);
    } else {
      comparison = Number(left[orderBy] || 0) - Number(right[orderBy] || 0);
    }

    return order === 'asc' ? comparison : -comparison;
  });
}

export function summarizeFinanceRecords(allRecords, filteredRecords) {
  const safeAllRecords = Array.isArray(allRecords) ? allRecords : [];
  const safeFilteredRecords = Array.isArray(filteredRecords) ? filteredRecords : [];

  const totalRevenue = safeAllRecords.reduce((sum, record) => sum + Number(record.revenue || 0), 0);
  const selectedRevenue = safeFilteredRecords.reduce((sum, record) => sum + Number(record.revenue || 0), 0);
  const totalOrders = safeAllRecords.reduce((sum, record) => sum + Number(record.ordersCount || 0), 0);
  const selectedOrders = safeFilteredRecords.reduce((sum, record) => sum + Number(record.ordersCount || 0), 0);
  const totalDeposits = safeAllRecords.reduce((sum, record) => sum + Number(record.deposits || 0), 0);
  const selectedDeposits = safeFilteredRecords.reduce((sum, record) => sum + Number(record.deposits || 0), 0);
  const totalProfit = safeAllRecords.reduce((sum, record) => sum + Number(record.profit || 0), 0);
  const selectedProfit = safeFilteredRecords.reduce((sum, record) => sum + Number(record.profit || 0), 0);

  return {
    totalRevenue,
    selectedRevenue,
    totalOrders,
    selectedOrders,
    averageOrderValue: selectedOrders > 0 ? selectedRevenue / selectedOrders : 0,
    totalDeposits,
    selectedDeposits,
    totalProfit,
    selectedProfit,
  };
}

export function buildFinanceChartSeries(records) {
  return normalizeRecords(records).map((record) => ({
    ...record,
    label: new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(record.date)),
  }));
}

export function getFinanceRangeDescription(rangeType, customStartDate, customEndDate) {
  if (rangeType === 'custom') {
    if (!customStartDate || !customEndDate) {
      return 'Select a custom date range to update the dashboard.';
    }

    return `${customStartDate} to ${customEndDate}`;
  }

  const option = FINANCE_RANGE_OPTIONS.find((item) => item.value === rangeType);
  return option ? option.label : 'Last 30 days';
}
