import { Alert, Box, Card, CardContent, Stack, Typography } from '@mui/material';
import PageHeader from '../../components/PageHeader';
import FinanceCards from '../../components/finance/FinanceCards';
import FinanceFilters from '../../components/finance/FinanceFilters';
import FinanceCharts from '../../components/finance/FinanceCharts';
import FinanceRecordsTable from '../../components/finance/FinanceRecordsTable.jsx';
import { useFinance } from '../../hooks/useFinance';
import { useAppContext } from '../../context/AppContext';
import { getFinanceRangeDescription, getPresetFinanceRange } from '../../services/financeService';

function FinancePage() {
  const { updateFinanceRecord, deleteFinanceRecord } = useAppContext();
  const {
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
  } = useFinance();

  function handleRangeTypeChange(nextRangeType) {
    setRangeType(nextRangeType);

    if (nextRangeType === 'custom') {
      const presetRange = getPresetFinanceRange(30);
      setCustomStartDate(presetRange.startDate);
      setCustomEndDate(presetRange.endDate);
    }
  }

  const rangeDescription = getFinanceRangeDescription(rangeType, customStartDate, customEndDate);

  return (
    <Stack spacing={3.5}>
      <PageHeader
        title="Financial Analytics"
        subtitle="Analyze revenue, orders, deposits, and profit trends with a responsive analytics workspace."
      />

      <FinanceCards summary={summary} rangeDescription={rangeDescription} />

      <Card elevation={0} sx={(theme) => ({ borderRadius: 2, border: `1px solid ${theme.palette.divider}` })}>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Filters
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Change the dashboard window to instantly update the charts and table.
              </Typography>
            </Box>
            <FinanceFilters
              rangeType={rangeType}
              customStartDate={customStartDate}
              customEndDate={customEndDate}
              onRangeTypeChange={handleRangeTypeChange}
              onCustomStartDateChange={setCustomStartDate}
              onCustomEndDateChange={setCustomEndDate}
            />
          </Stack>
        </CardContent>
      </Card>

      {errorMessage ? (
        <Alert severity="info" sx={{ borderRadius: 3 }}>
          {errorMessage}
        </Alert>
      ) : (
        <FinanceCharts chartSeries={chartSeries} />
      )}

      <FinanceRecordsTable
        records={filteredRecords}
        onUpdateRecord={updateFinanceRecord}
        onDeleteRecord={deleteFinanceRecord}
      />
    </Stack>
  );
}

export default FinancePage;
