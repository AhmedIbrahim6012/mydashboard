import { Box, Stack, ToggleButton, ToggleButtonGroup, TextField, Typography } from '@mui/material';
import { FINANCE_RANGE_OPTIONS } from '../../services/financeService';

function FinanceFilters({ rangeType, customStartDate, customEndDate, onRangeTypeChange, onCustomStartDateChange, onCustomEndDateChange }) {
  return (
    <Stack spacing={2.25}>
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          Date Range
        </Typography>
        <ToggleButtonGroup
          exclusive
          value={rangeType}
          onChange={(_, nextValue) => {
            if (nextValue) {
              onRangeTypeChange(nextValue);
            }
          }}
          sx={{
            flexWrap: 'wrap',
            gap: 1,
            '& .MuiToggleButton-root': {
              borderRadius: 999,
              px: 2,
              textTransform: 'none',
            },
          }}
        >
          {FINANCE_RANGE_OPTIONS.map((option) => (
            <ToggleButton key={option.value} value={option.value} aria-label={option.label}>
              {option.label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {rangeType === 'custom' ? (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label="Start date"
            type="date"
            fullWidth
            value={customStartDate}
            onChange={(event) => onCustomStartDateChange(event.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="End date"
            type="date"
            fullWidth
            value={customEndDate}
            onChange={(event) => onCustomEndDateChange(event.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      ) : null}
    </Stack>
  );
}

export default FinanceFilters;