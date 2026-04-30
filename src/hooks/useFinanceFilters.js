import { useState } from 'react';
import { getPresetFinanceRange } from '../services/financeService';

export function useFinanceFilters(initialRangeType = '30') {
  const presetRange = getPresetFinanceRange(Number(initialRangeType) || 30);
  const [rangeType, setRangeType] = useState(initialRangeType);
  const [customStartDate, setCustomStartDate] = useState(presetRange.startDate);
  const [customEndDate, setCustomEndDate] = useState(presetRange.endDate);

  return {
    rangeType,
    setRangeType,
    customStartDate,
    setCustomStartDate,
    customEndDate,
    setCustomEndDate,
  };
}
