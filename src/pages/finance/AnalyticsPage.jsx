import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Box, Snackbar, Stack, Typography } from '@mui/material';
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import api from '../../utils/axiosInstance'; // adjust path if needed

import AnalyticsPeriodSelector  from '../../components/finance/AnalyticsPeriodSelector';
import AnalyticsOverviewCards   from '../../components/finance/AnalyticsOverviewCards';
import AnalyticsOrdersSection   from '../../components/finance/AnalyticsOrdersSection';
import AnalyticsUsersSection    from '../../components/finance/AnalyticsUsersSection';
import AnalyticsProvidersSection from '../../components/finance/AnalyticsProvidersSection';
import AnalyticsCharts           from '../../components/finance/AnalyticsCharts';
import AnalyticsTables           from '../../components/finance/AnalyticsTables';
import {  Divider } from '@mui/material';


const DEFAULT_PERIOD = 'this_month';

function SectionLabel({ children }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 0.5 }}>
      <Typography sx={{ fontWeight: 800, fontSize: '1.15rem', color: '#0f172a', whiteSpace: 'nowrap' }}>
        {children}
      </Typography>
      <Divider sx={{ flex: 1 }} />
    </Stack>
  );
}

function AnalyticsPage() {
  const [period, setPeriod]                 = useState(DEFAULT_PERIOD);
  const [displayMessage, setDisplayMessage] = useState('');

  const [overviewData,   setOverviewData]   = useState(null);
  const [ordersData,     setOrdersData]     = useState(null);
  const [usersData,      setUsersData]      = useState(null);
  const [providersData,  setProvidersData]  = useState(null);
  const [loading, setLoading]               = useState(false);
  const [errorMsg, setErrorMsg]             = useState('');

  const abortRef = useRef(null);

  const fetchAll = useCallback(async (p) => {
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setErrorMsg('');
    try {
      const signal = controller.signal;
      const [generalRes, ordersRes, usersRes, providersRes] = await Promise.all([
        api.get('/admin/analytics',           { params: { period: p }, signal }),
        api.get('/admin/analytics/orders',    { params: { period: p }, signal }),
        api.get('/admin/analytics/users',     { params: { period: p }, signal }),
        api.get('/admin/analytics/providers', { params: { period: p }, signal }),
      ]);
      const generalData = generalRes.data?.data ?? {};
      setOverviewData(generalData);
      setDisplayMessage(generalData?.meta?.display_message ?? '');
      setOrdersData(ordersRes.data?.data     ?? null);
      setUsersData(usersRes.data?.data       ?? null);
      setProvidersData(providersRes.data?.data ?? null);
    } catch (err) {
      if (err.name === 'CanceledError' || err.name === 'AbortError') return;
      setErrorMsg('Failed to load analytics data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchAll(period); }, [period, fetchAll]);

  return (
    <Stack spacing={4}>

      {/* ── Header ── */}
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap={1.5}>
        <Box>
          <Typography sx={{
            color: '#0f172a', fontSize: { xs: '1.75rem', md: '2.1rem' },
            fontWeight: 800, lineHeight: 1.1, letterSpacing: '-0.04em',
          }}>
            Analytics
          </Typography>
          <Typography sx={{ mt: 0.75, color: '#55657b', fontSize: '1rem' }}>
            Platform performance across all metrics.
          </Typography>
        </Box>
        <Tooltip title="Refresh">
          <span>
            <IconButton onClick={() => fetchAll(period)} disabled={loading} sx={{ mt: 0.5 }}>
              <RefreshRoundedIcon sx={{
                transition: 'transform 0.5s ease',
                ...(loading && { animation: 'spin 1s linear infinite' }),
                '@keyframes spin': { '0%': { transform: 'rotate(0deg)' }, '100%': { transform: 'rotate(360deg)' } },
              }} />
            </IconButton>
          </span>
        </Tooltip>
      </Stack>

      {/* ── Period selector ── */}
      <AnalyticsPeriodSelector
        period={period}
        displayMessage={displayMessage}
        onChange={setPeriod}
      />

      {/* ── KPI cards ── */}
      <Box>
        <SectionLabel>Overview</SectionLabel>
        <AnalyticsOverviewCards data={overviewData} loading={loading} />
      </Box>

      {/* ── Orders breakdown ── */}
      <Box>
        <SectionLabel>Orders</SectionLabel>
        <AnalyticsOrdersSection data={ordersData} loading={loading} />
      </Box>

      {/* ── Users + Providers ── */}
      <Box>
        <SectionLabel>Users & Providers</SectionLabel>
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' },
          gap: 2.5, alignItems: 'start',
        }}>
          <AnalyticsUsersSection    data={usersData}     loading={loading} />
          <AnalyticsProvidersSection data={providersData} loading={loading} />
        </Box>
      </Box>

      {/* ── Charts (6-month time series) ── */}
      <Box>
        <SectionLabel>Trends — Last 6 Months</SectionLabel>
        <AnalyticsCharts />
      </Box>

      {/* ── Tables (current vs previous period) ── */}
      <Box>
        <SectionLabel>Detailed Comparison</SectionLabel>
        <AnalyticsTables period={period} />
      </Box>

      {/* ── Error snackbar ── */}
      <Snackbar
        open={Boolean(errorMsg)}
        autoHideDuration={6000}
        onClose={() => setErrorMsg('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="error" onClose={() => setErrorMsg('')} variant="filled" sx={{ borderRadius: 2 }}>
          {errorMsg}
        </Alert>
      </Snackbar>

    </Stack>
  );
}

export default AnalyticsPage;