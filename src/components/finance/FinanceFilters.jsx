import { Box, Stack, ToggleButton, ToggleButtonGroup, TextField, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FINANCE_RANGE_OPTIONS } from '../../services/financeService';

function FinanceFilters({ rangeType, customStartDate, customEndDate, onRangeTypeChange, onCustomStartDateChange, onCustomEndDateChange }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  const rangeOptionLabels = {
    '7': t('finance.range.last7'),
    '15': t('finance.range.last15'),
    '30': t('finance.range.last30'),
    custom: t('finance.range.custom'),
  };

  return (
    <Stack spacing={2.25}>
      <Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
          {t('finance.range.title')}
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
            <ToggleButton key={option.value} value={option.value} aria-label={rangeOptionLabels[option.value]}>
              {rangeOptionLabels[option.value]}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Box>

      {rangeType === 'custom' ? (
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <TextField
            label={t('finance.range.startDate')}
            type="date"
            fullWidth
            value={customStartDate}
            onChange={(event) => onCustomStartDateChange(event.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ dir: isRtl ? 'rtl' : 'ltr' }}
          />
          <TextField
            label={t('finance.range.endDate')}
            type="date"
            fullWidth
            value={customEndDate}
            onChange={(event) => onCustomEndDateChange(event.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ dir: isRtl ? 'rtl' : 'ltr' }}
          />
        </Stack>
      ) : null}
    </Stack>
  );
}

function LanguageSwitch({ value, onChange }) {
  const { t } = useTranslation();

  return (
    <ToggleButtonGroup
      exclusive
      size="small"
      value={value}
      onChange={(_, nextValue) => {
        if (nextValue) {
          onChange(nextValue);
        }
      }}
      sx={{
        '& .MuiToggleButton-root': {
          borderRadius: 999,
          minWidth: 92,
          textTransform: 'none',
        },
      }}
    >
      <ToggleButton value="en">{t('common.english')}</ToggleButton>
      <ToggleButton value="ar">{t('common.arabic')}</ToggleButton>
    </ToggleButtonGroup>
  );
}

FinanceFilters.LanguageSwitch = LanguageSwitch;

export default FinanceFilters;