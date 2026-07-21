import { useEffect, useState, useCallback } from 'react';
import {
  Box, Card, CardContent, CircularProgress, Stack, Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Cell,
  Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip as RechartsTooltip, XAxis, YAxis,
} from 'recharts';
import api from '../../utils/axiosInstance';

// ─── helpers ────────────────────────────────────────────────────────────────

function fmt(v) { return `$${Number(v || 0).toLocaleString()}`; }
function num(v) { return Number(v || 0).toLocaleString(); }

// Build the last N month-period strings: ['this_month','1m','2m',...'Nm']
// We'll call  ?period=this_month  and  ?period=1m … ?period=5m
function buildMonthPeriods(count = 6) {
  // API supports Xm = last X months
  // 'this_month' = current month
  // '1m' = last 1 month ago, '2m' = last 2 months ago …
  const list = [];
  for (let i = count - 1; i >= 0; i--) {
    list.push(i === 0 ? 'this_month' : `${i}m`);
  }
  return list;                // oldest → newest
}

// Month label from index: "6 months ago" … "This month"
function monthLabel(periodsArray, index) {
  const now = new Date();
  const offset = periodsArray.length - 1 - index;   // 0 = this month
  if (offset === 0) return 'This month';
  const d = new Date(now.getFullYear(), now.getMonth() - offset, 1);
  return d.toLocaleString('en-US', { month: 'short', year: '2-digit' });
}

// Custom tooltip
function ChartTip({ active, payload, label, money }) {
  if (!active || !payload?.length) return null;
  return (
    <Box sx={{
      bgcolor: '#fff', borderRadius: 2,
      border: '1px solid rgba(148,163,184,0.2)',
      boxShadow: '0 14px 30px rgba(15,23,42,0.14)',
      px: 1.75, py: 1.25, minWidth: 140,
    }}>
      <Typography sx={{ mb: 0.5, fontWeight: 700, fontSize: '0.88rem', color: '#0f172a' }}>{label}</Typography>
      {payload.map((e) => (
        <Typography key={e.dataKey} sx={{ fontSize: '0.82rem', color: e.color }}>
          {e.name}: {money ? fmt(e.value) : num(e.value)}
        </Typography>
      ))}
    </Box>
  );
}

function ChartCard({ title, subtitle, loading, children, minH = 280 }) {
  return (
    <Card elevation={0} sx={(t) => ({
      borderRadius: 3,
      border: `1px solid ${alpha(t.palette.divider, 0.85)}`,
      boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
      background: t.palette.background.paper,
    })}>
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Typography sx={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a' }}>{title}</Typography>
        {subtitle && (
          <Typography sx={{ fontSize: '0.8rem', color: '#94a3b8', mt: 0.25, mb: 2 }}>{subtitle}</Typography>
        )}
        {!subtitle && <Box sx={{ mb: 2 }} />}
        {loading ? (
          <Box sx={{ minHeight: minH, display: 'grid', placeItems: 'center' }}>
            <CircularProgress size={32} thickness={3} />
          </Box>
        ) : (
          <Box sx={{ minHeight: minH }}>{children}</Box>
        )}
      </CardContent>
    </Card>
  );
}

const ORDER_PIE_COLORS = ['#16a34a', '#f59e0b', '#ef4444'];

// ─── main component ──────────────────────────────────────────────────────────

/**
 * AnalyticsCharts
 * Fetches the last 6 months in parallel across all 4 endpoints to build
 * time-series data for charts, using only the available API.
 */
function AnalyticsCharts() {
  const [series, setSeries]   = useState([]);   // [{label, revenue, orders, newUsers, newProviders}]
  const [ordersSnap, setOrdersSnap] = useState(null);  // latest orders breakdown
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState('');

  const MONTHS = 6;

  const fetchSeries = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const periods = buildMonthPeriods(MONTHS);

      // Fire all requests in parallel: 4 endpoints × 6 months = 24 requests
      const [generalResults, ordersResults, usersResults, providersResults] = await Promise.all([
        Promise.all(periods.map((p) => api.get('/admin/analytics',           { params: { period: p } }).then((r) => r.data?.data ?? {}))),
        Promise.all(periods.map((p) => api.get('/admin/analytics/orders',    { params: { period: p } }).then((r) => r.data?.data ?? {}))),
        Promise.all(periods.map((p) => api.get('/admin/analytics/users',     { params: { period: p } }).then((r) => r.data?.data ?? {}))),
        Promise.all(periods.map((p) => api.get('/admin/analytics/providers', { params: { period: p } }).then((r) => r.data?.data ?? {}))),
      ]);

      const built = periods.map((_, i) => ({
        label:        monthLabel(periods, i),
        revenue:      Number(generalResults[i]?.revenue?.amount      ?? 0),
        orders:       Number(generalResults[i]?.orders?.count        ?? 0),
        newUsers:     Number(usersResults[i]?.new_users?.count       ?? 0),
        activeUsers:  Number(usersResults[i]?.active_users?.count    ?? 0),
        newProviders: Number(providersResults[i]?.new_providers?.count ?? 0),
        completed:    Number(ordersResults[i]?.['Completed Orders']?.period?.count ?? 0),
        pending:      Number(ordersResults[i]?.['Pending Orders']?.period?.count   ?? 0),
        cancelled:    Number(ordersResults[i]?.['Cancelled Orders']?.period?.count ?? 0),
      }));

      setSeries(built);

      // Save latest month's orders breakdown for the pie
      const latest = ordersResults[ordersResults.length - 1];
      setOrdersSnap(latest);
    } catch (e) {
      console.error(e);
      setError('Failed to load chart data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSeries(); }, [fetchSeries]);

  // Pie data from latest month
  const orderPieData = ordersSnap
    ? [
        { name: 'Completed', value: Number(ordersSnap['Completed Orders']?.period?.count ?? 0) },
        { name: 'Pending',   value: Number(ordersSnap['Pending Orders']?.period?.count   ?? 0) },
        { name: 'Cancelled', value: Number(ordersSnap['Cancelled Orders']?.period?.count ?? 0) },
      ].filter((d) => d.value > 0)
    : [];

  const axisStyle = { tick: { fill: '#94a3b8', fontSize: 11 }, tickLine: false, axisLine: false };

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center', color: '#ef4444' }}>
        <Typography>{error}</Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={2.5}>

      {/* ── Row 1: Revenue (area) + Orders stacked bar ── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' }, gap: 2.5 }}>

        <ChartCard title="Revenue — Last 6 Months" subtitle="Monthly revenue trend" loading={loading}>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 4" stroke="#e2e8f0" />
              <XAxis dataKey="label" {...axisStyle} />
              <YAxis tickFormatter={(v) => `$${v / 1000}k`} {...axisStyle} />
              <RechartsTooltip content={(p) => <ChartTip {...p} money />} />
              <Area type="monotone" dataKey="revenue" name="Revenue"
                stroke="#3b82f6" strokeWidth={2.5} fill="url(#revGrad)"
                dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Orders by Status — Last 6 Months" subtitle="Completed, pending, cancelled per month" loading={loading}>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 4" stroke="#e2e8f0" />
              <XAxis dataKey="label" {...axisStyle} />
              <YAxis allowDecimals={false} {...axisStyle} />
              <RechartsTooltip content={(p) => <ChartTip {...p} />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
              <Bar dataKey="completed" name="Completed" stackId="a" fill="#16a34a" radius={[0, 0, 0, 0]} />
              <Bar dataKey="pending"   name="Pending"   stackId="a" fill="#f59e0b" />
              <Bar dataKey="cancelled" name="Cancelled" stackId="a" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

      </Box>

      {/* ── Row 2: Users line + Orders line + Pie ── */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr 320px' }, gap: 2.5 }}>

        <ChartCard title="New vs Active Users" subtitle="Last 6 months" loading={loading}>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 4" stroke="#e2e8f0" />
              <XAxis dataKey="label" {...axisStyle} />
              <YAxis allowDecimals={false} {...axisStyle} />
              <RechartsTooltip content={(p) => <ChartTip {...p} />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
              <Line type="monotone" dataKey="newUsers"    name="New Users"    stroke="#a855f7" strokeWidth={2.5}
                dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="activeUsers" name="Active Users" stroke="#3b82f6" strokeWidth={2.5}
                dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} strokeDasharray="5 3" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Orders & New Providers" subtitle="Last 6 months" loading={loading}>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={series} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 4" stroke="#e2e8f0" />
              <XAxis dataKey="label" {...axisStyle} />
              <YAxis allowDecimals={false} {...axisStyle} />
              <RechartsTooltip content={(p) => <ChartTip {...p} />} />
              <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
              <Line type="monotone" dataKey="orders"       name="Orders"        stroke="#16a34a" strokeWidth={2.5}
                dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
              <Line type="monotone" dataKey="newProviders" name="New Providers" stroke="#f59e0b" strokeWidth={2.5}
                dot={{ r: 4, fill: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} strokeDasharray="5 3" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="This Month Orders" subtitle="Distribution by status" loading={loading} minH={260}>
          {orderPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={orderPieData} dataKey="value" nameKey="name"
                  innerRadius={60} outerRadius={95} paddingAngle={3} strokeWidth={0}>
                  {orderPieData.map((_, i) => (
                    <Cell key={i} fill={ORDER_PIE_COLORS[i % ORDER_PIE_COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(v) => [num(v), 'Orders']}
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(15,23,42,0.12)' }}
                />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 11, color: '#64748b' }} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <Box sx={{ height: 260, display: 'grid', placeItems: 'center' }}>
              <Typography sx={{ color: '#cbd5e1', fontSize: '0.85rem' }}>No data for this month</Typography>
            </Box>
          )}
        </ChartCard>

      </Box>

    </Stack>
  );
}

export default AnalyticsCharts;