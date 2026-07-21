import { useEffect, useState, useCallback } from 'react';
import {
  Box, Card, CardContent, Chip, CircularProgress,
   Stack, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import TrendingUpRoundedIcon    from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon  from '@mui/icons-material/TrendingDownRounded';
import TrendingFlatRoundedIcon  from '@mui/icons-material/TrendingFlatRounded';
import api from '../../utils/axiosInstance';

// ─── helpers ────────────────────────────────────────────────────────────────

function fmt(v)    { return `$${Number(v || 0).toLocaleString()}`; }
function fmtN(v)   { return Number(v || 0).toLocaleString(); }
function fmtPct(v) { return `${Number(v || 0).toFixed(1)}%`; }

/** Map a period string to the "previous" period for comparison */
function prevPeriod(period) {
  const presetMap = {
    today:        'yesterday',
    yesterday:    '2d',
    this_week:    'last_week',
    last_week:    '2w',
    this_month:   'last_month',
    last_month:   '2m',
    this_year:    'last_year',
    last_year:    '2y',
  };
  if (presetMap[period]) return presetMap[period];

  // dynamic: "3d" → "6d", "2w" → "4w", etc. (double the window)
  const match = period.match(/^(\d+)([dwmy])$/);
  if (match) return `${Number(match[1]) * 2}${match[2]}`;

  return 'last_month';
}

function GrowthCell({ value }) {
  const v = Number(value ?? 0);
  const color  = v > 0 ? '#16a34a' : v < 0 ? '#dc2626' : '#94a3b8';
  const Icon   = v > 0 ? TrendingUpRoundedIcon : v < 0 ? TrendingDownRoundedIcon : TrendingFlatRoundedIcon;
  return (
    <Stack direction="row" alignItems="center" spacing={0.4} justifyContent="flex-end">
      <Icon sx={{ fontSize: 14, color }} />
      <Typography sx={{ fontSize: '0.82rem', fontWeight: 700, color }}>
        {v > 0 ? '+' : ''}{v}%
      </Typography>
    </Stack>
  );
}

function SectionHeader({ children }) {
  return (
    <TableRow>
      <TableCell colSpan={4} sx={{ bgcolor: '#f8fbff', py: 1, px: 2.5 }}>
        <Typography sx={{ fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.06em', textTransform: 'uppercase', color: '#64748b' }}>
          {children}
        </Typography>
      </TableCell>
    </TableRow>
  );
}

function DataRow({ label, current, previous, format = fmtN, highlight = false }) {
  const cur  = format(current);
  const prev = format(previous);
  const diff = Number(previous) > 0
    ? (((Number(current) - Number(previous)) / Number(previous)) * 100).toFixed(1)
    : Number(current) > 0 ? 100 : 0;

  return (
    <TableRow hover sx={highlight ? { bgcolor: (t) => alpha(t.palette.primary.main, 0.03) } : {}}>
      <TableCell sx={{ color: '#475467', fontSize: '0.88rem', pl: 2.5 }}>{label}</TableCell>
      <TableCell align="right" sx={{ fontWeight: highlight ? 700 : 500, color: '#0f172a', fontSize: '0.9rem' }}>{cur}</TableCell>
      <TableCell align="right" sx={{ color: '#94a3b8', fontSize: '0.88rem' }}>{prev}</TableCell>
      <TableCell align="right"><GrowthCell value={diff} /></TableCell>
    </TableRow>
  );
}

function RateRow({ label, value }) {
  const v = Number(value ?? 0);
  const color = v > 60 ? '#16a34a' : v > 30 ? '#f59e0b' : v > 0 ? '#ef4444' : '#94a3b8';
  return (
    <TableRow hover>
      <TableCell sx={{ color: '#475467', fontSize: '0.88rem', pl: 2.5 }}>{label}</TableCell>
      <TableCell align="right" colSpan={3}>
        <Stack direction="row" alignItems="center" spacing={1.5} justifyContent="flex-end">
          <Box sx={{ width: 80, height: 6, borderRadius: 99, bgcolor: '#f1f5f9', overflow: 'hidden' }}>
            <Box sx={{ height: '100%', width: `${Math.min(v, 100)}%`, borderRadius: 99, bgcolor: color, transition: 'width 0.5s' }} />
          </Box>
          <Typography sx={{ fontSize: '0.85rem', fontWeight: 700, color, minWidth: 44, textAlign: 'right' }}>
            {v.toFixed(1)}%
          </Typography>
        </Stack>
      </TableCell>
    </TableRow>
  );
}

// ─── main ────────────────────────────────────────────────────────────────────

/**
 * AnalyticsTables
 * Props:
 *   period {string} — active period from AnalyticsPage
 */
function AnalyticsTables({ period }) {
  const [cur,  setCur]  = useState(null);   // { general, orders, users, providers }
  const [prev, setPrev] = useState(null);
  const [loading, setLoading] = useState(true);
  const [prevLabel, setPrevLabel] = useState('');

  const fetchBoth = useCallback(async (p) => {
    setLoading(true);
    const pp = prevPeriod(p);
    try {
      const [cG, cO, cU, cP, pG, pO, pU, pP] = await Promise.all([
        api.get('/admin/analytics',           { params: { period: p  } }).then((r) => r.data?.data ?? {}),
        api.get('/admin/analytics/orders',    { params: { period: p  } }).then((r) => r.data?.data ?? {}),
        api.get('/admin/analytics/users',     { params: { period: p  } }).then((r) => r.data?.data ?? {}),
        api.get('/admin/analytics/providers', { params: { period: p  } }).then((r) => r.data?.data ?? {}),
        api.get('/admin/analytics',           { params: { period: pp } }).then((r) => r.data?.data ?? {}),
        api.get('/admin/analytics/orders',    { params: { period: pp } }).then((r) => r.data?.data ?? {}),
        api.get('/admin/analytics/users',     { params: { period: pp } }).then((r) => r.data?.data ?? {}),
        api.get('/admin/analytics/providers', { params: { period: pp } }).then((r) => r.data?.data ?? {}),
      ]);
      setCur({ general: cG, orders: cO, users: cU, providers: cP });
      setPrev({ general: pG, orders: pO, users: pU, providers: pP });
      setPrevLabel(pG?.meta?.display_message ?? pp);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBoth(period); }, [period, fetchBoth]);

  if (loading) {
    return (
      <Card elevation={0} sx={(t) => ({
        borderRadius: 3, border: `1px solid ${alpha(t.palette.divider, 0.85)}`,
        boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
      })}>
        <Box sx={{ py: 6, display: 'grid', placeItems: 'center' }}>
          <CircularProgress size={32} thickness={3} />
        </Box>
      </Card>
    );
  }

  const cG = cur?.general   ?? {};
  const cO = cur?.orders    ?? {};
  const cU = cur?.users     ?? {};
  const cP = cur?.providers ?? {};
  const pG = prev?.general  ?? {};
  const pO = prev?.orders   ?? {};
  const pU = prev?.users    ?? {};
  const pP = prev?.providers ?? {};

  const thStyle = {
    fontWeight: 800, fontSize: '0.75rem', letterSpacing: '0.05em',
    textTransform: 'uppercase', color: '#64748b',
    bgcolor: '#f8fbff', borderBottom: '1px solid #e4ebf4', py: 1.5,
  };

  return (
    <Stack spacing={2.5}>

      {/* ── Comparison header ── */}
      <Stack direction="row" alignItems="center" spacing={1.5} flexWrap="wrap">
        <Typography sx={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>
          Period Comparison
        </Typography>
        <Chip size="small" label="Current" sx={{ bgcolor: '#dbeafe', color: '#2563eb', fontWeight: 700, fontSize: '0.72rem' }} />
        <Typography sx={{ color: '#94a3b8', fontSize: '0.8rem' }}>vs</Typography>
        <Chip size="small" label={`Previous (${prevLabel})`} sx={{ bgcolor: '#f1f5f9', color: '#64748b', fontWeight: 600, fontSize: '0.72rem' }} />
      </Stack>

      {/* ── Main comparison table ── */}
      <Card elevation={0} sx={(t) => ({
        borderRadius: 3, border: `1px solid ${alpha(t.palette.divider, 0.85)}`,
        boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
        overflow: 'hidden',
      })}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ ...thStyle, pl: 2.5, width: '35%' }}>Metric</TableCell>
                <TableCell align="right" sx={thStyle}>Current</TableCell>
                <TableCell align="right" sx={thStyle}>Previous</TableCell>
                <TableCell align="right" sx={{ ...thStyle, pr: 2.5 }}>Change</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>

              {/* Revenue & Orders */}
              <SectionHeader>Revenue & Orders</SectionHeader>
              <DataRow label="Revenue"       current={cG.revenue?.amount}       previous={pG.revenue?.amount}       format={fmt} highlight />
              <DataRow label="Total Orders"  current={cG.orders?.count}         previous={pG.orders?.count} />
              <DataRow label="Completed Orders" current={cO['Completed Orders']?.period?.count} previous={pO['Completed Orders']?.period?.count} />
              <DataRow label="Pending Orders"   current={cO['Pending Orders']?.period?.count}   previous={pO['Pending Orders']?.period?.count} />
              <DataRow label="Cancelled Orders" current={cO['Cancelled Orders']?.period?.count} previous={pO['Cancelled Orders']?.period?.count} />

              {/* Rates */}
              <SectionHeader>Order Rates (Current Period)</SectionHeader>
              <RateRow label="Acceptance Rate"   value={cO.periodAcceptenecRate} />
              <RateRow label="Pending Rate"      value={cO.periodPendingRate} />
              <RateRow label="Cancellation Rate" value={cO.periodCancellationRate} />

              {/* Users */}
              <SectionHeader>Users</SectionHeader>
              <DataRow label="Total Users"   current={cU.total_users}          previous={pU.total_users}          highlight />
              <DataRow label="New Users"     current={cU.new_users?.count}     previous={pU.new_users?.count} />
              <DataRow label="Active Users"  current={cU.active_users?.count}  previous={pU.active_users?.count} />
              <RateRow label="Active User Rate (current)" value={cU.active_user_rate} />

              {/* Providers */}
              <SectionHeader>Providers</SectionHeader>
              <DataRow label="Total Providers"     current={cP.total_providers}           previous={pP.total_providers}           highlight />
              <DataRow label="New Providers"       current={cP.new_providers?.count}      previous={pP.new_providers?.count} />
              <DataRow label="Active Providers"    current={cP.active_providers?.count}   previous={pP.active_providers?.count} />
              <DataRow label="Available Now"       current={cP.available_providers}       previous={pP.available_providers} />
              <RateRow label="Active Provider Rate (current)" value={cP.active_providers_rate} />

            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* ── All-time totals table ── */}
      <Card elevation={0} sx={(t) => ({
        borderRadius: 3, border: `1px solid ${alpha(t.palette.divider, 0.85)}`,
        boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
        overflow: 'hidden',
      })}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Typography sx={{ fontWeight: 800, fontSize: '1rem', color: '#0f172a', mb: 2 }}>
            All-Time Totals
          </Typography>
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: 'repeat(2,1fr)', sm: 'repeat(4,1fr)' },
            gap: 1.5,
          }}>
            {[
              { label: 'Total Orders',    value: fmtN(cO['Total Orders']?.general),    color: '#2563eb' },
              { label: 'Completed',       value: fmtN(cO['Completed Orders']?.general), color: '#16a34a' },
              { label: 'Pending',         value: fmtN(cO['Pending Orders']?.general),   color: '#f59e0b' },
              { label: 'Cancelled',       value: fmtN(cO['Cancelled Orders']?.general), color: '#ef4444' },
              { label: 'Total Users',     value: fmtN(cU.total_users),                  color: '#a855f7' },
              { label: 'Total Providers', value: fmtN(cP.total_providers),              color: '#0891b2' },
              { label: 'Available Now',   value: fmtN(cP.available_providers),          color: '#059669' },
              { label: 'Acceptance Rate', value: fmtPct(cO.generalAcceptenecRate),      color: '#16a34a' },
            ].map((item) => (
              <Box key={item.label} sx={(t) => ({
                p: 1.75, borderRadius: 2,
                border: `1px solid ${alpha(t.palette.divider, 0.6)}`,
                bgcolor: alpha(item.color, 0.04),
              })}>
                <Typography sx={{ fontSize: '1.35rem', fontWeight: 800, color: item.color, lineHeight: 1, letterSpacing: '-0.02em' }}>
                  {item.value}
                </Typography>
                <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', mt: 0.5 }}>
                  {item.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

    </Stack>
  );
}

export default AnalyticsTables;