import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { buildFinanceChartSeries, filterFinanceRecords, summarizeFinanceRecords } from '../services/financeService';
import { useFinanceFilters } from './useFinanceFilters';

export function useFinance() {
  const { financeRecords } = useAppContext();
  const { rangeType, setRangeType, customStartDate, setCustomStartDate, customEndDate, setCustomEndDate } = useFinanceFilters();

  const filteredRecords = useMemo(
    () => filterFinanceRecords(financeRecords, rangeType, customStartDate, customEndDate),
    [financeRecords, rangeType, customStartDate, customEndDate],
  );

  const summary = useMemo(() => summarizeFinanceRecords(filteredRecords), [filteredRecords]);

  const chartSeries = useMemo(() => buildFinanceChartSeries(filteredRecords), [filteredRecords]);

  const hasData = chartSeries.length > 0;
  const errorMessage = !hasData ? 'No finance data found for the selected date range.' : null;

  return {
    rangeType,
    setRangeType,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
    errorMessage,
    filteredRecords,
    chartSeries,
    summary,
  };
}
