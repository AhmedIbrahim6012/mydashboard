import { useState } from 'react';
import {
  Box,
  Button,
  ButtonGroup,
  Chip,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';

// Preset periods mapped to API values
const PRESET_PERIODS = [
  { label: 'Today', value: 'today' },
  { label: 'Yesterday', value: 'yesterday' },
  { label: 'This Week', value: 'this_week' },
  { label: 'Last Week', value: 'last_week' },
  { label: 'This Month', value: 'this_month' },
  { label: 'Last Month', value: 'last_month' },
  { label: 'This Year', value: 'this_year' },
  { label: 'Last Year', value: 'last_year' },
];

const UNIT_OPTIONS = [
  { value: 'd', label: 'Days' },
  { value: 'w', label: 'Weeks' },
  { value: 'm', label: 'Months' },
  { value: 'y', label: 'Years' },
];

/**
 * AnalyticsPeriodSelector
 * Props:
 *   period {string}           — current period string (e.g. "this_month", "3d")
 *   displayMessage {string}   — human-readable label returned by API
 *   onChange (period) => void — called with new period string
 */
function AnalyticsPeriodSelector({ period, displayMessage, onChange }) {
  // Detect if current period is a custom dynamic one (e.g. "3d", "2w")
  const isDynamic = period && /^\d+[dwmy]$/.test(period);
  const [mode, setMode] = useState(isDynamic ? 'dynamic' : 'preset');
  const [dynamicNum, setDynamicNum] = useState(() => {
    if (isDynamic) return period.slice(0, -1);
    return '7';
  });
  const [dynamicUnit, setDynamicUnit] = useState(() => {
    if (isDynamic) return period.slice(-1);
    return 'd';
  });

  function handlePresetClick(value) {
    setMode('preset');
    onChange(value);
  }

  function handleDynamicApply() {
    const num = Math.max(1, parseInt(dynamicNum, 10) || 1);
    onChange(`${num}${dynamicUnit}`);
  }

  // const isPreset = PRESET_PERIODS.some((p) => p.value === period);

  return (
    <Box
      sx={(theme) => ({
        p: { xs: 2, md: 2.5 },
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
        background: theme.palette.background.paper,
        boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
      })}
    >
      <Stack spacing={2}>
        {/* Header */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={1}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <CalendarMonthRoundedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Time Period
            </Typography>
          </Stack>
          {displayMessage ? (
            <Chip
              size="small"
              label={displayMessage}
              sx={{ fontWeight: 500, bgcolor: (t) => alpha(t.palette.primary.main, 0.08), color: 'primary.main', border: 'none' }}
            />
          ) : null}
        </Stack>

        {/* Mode toggle */}
        <ButtonGroup size="small" variant="outlined" sx={{ alignSelf: 'flex-start' }}>
          <Button
            onClick={() => setMode('preset')}
            variant={mode === 'preset' ? 'contained' : 'outlined'}
            disableElevation
          >
            Presets
          </Button>
          <Button
            onClick={() => setMode('dynamic')}
            variant={mode === 'dynamic' ? 'contained' : 'outlined'}
            disableElevation
          >
            Custom Range
          </Button>
        </ButtonGroup>

        {/* Preset chips */}
        {mode === 'preset' ? (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
            {PRESET_PERIODS.map((p) => (
              <Chip
                key={p.value}
                label={p.label}
                clickable
                onClick={() => handlePresetClick(p.value)}
                variant={period === p.value ? 'filled' : 'outlined'}
                color={period === p.value ? 'primary' : 'default'}
                sx={{ fontWeight: period === p.value ? 700 : 400 }}
              />
            ))}
          </Box>
        ) : (
          /* Dynamic range input */
          <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
            <Stack direction="row" spacing={1} alignItems="center">
              <AccessTimeRoundedIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
              <Typography variant="body2" color="text.secondary">
                Last
              </Typography>
            </Stack>
            <TextField
              size="small"
              type="number"
              value={dynamicNum}
              onChange={(e) => setDynamicNum(e.target.value)}
              inputProps={{ min: 1, max: 999 }}
              sx={{ width: 80 }}
            />
            <Select
              size="small"
              value={dynamicUnit}
              onChange={(e) => setDynamicUnit(e.target.value)}
              sx={{ minWidth: 110 }}
            >
              {UNIT_OPTIONS.map((u) => (
                <MenuItem key={u.value} value={u.value}>
                  {u.label}
                </MenuItem>
              ))}
            </Select>
            <Button variant="contained" disableElevation size="small" onClick={handleDynamicApply}>
              Apply
            </Button>
            {isDynamic && period && (
              <Chip size="small" label={`Active: ${period}`} color="primary" variant="outlined" />
            )}
          </Stack>
        )}
      </Stack>
    </Box>
  );
}

export default AnalyticsPeriodSelector;