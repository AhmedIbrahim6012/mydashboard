


import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  Skeleton,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import PieChartOutlineRoundedIcon from '@mui/icons-material/PieChartOutlineRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import EmojiEventsOutlinedIcon from '@mui/icons-material/EmojiEventsOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import { useTranslation } from 'react-i18next';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, ComposedChart, CartesianGrid,
  LineChart, Line,
} from 'recharts';
import PageHeader from '../components/PageHeader';
import DashboardMetricCard from '../components/dashboard/DashboardMetricCard';
import api from '../utils/axiosInstance';

// ── Constants ────────────────────────────────────────────────────────────────
const PRESET_PERIODS = [
  'today', 'yesterday', 'this_week', 'last_week',
  'this_month', 'last_month', 'this_year', 'last_year',
];
const UNITS = ['d', 'w', 'm', 'y'];

// ── Helpers ──────────────────────────────────────────────────────────────────
function growthCaption(growth) {
  if (growth == null) return null;
  const sign = growth > 0 ? '+' : '';
  return `${sign}${Number(growth).toFixed(1)}% vs prev period`;
}
function growthTone(growth) {
  if (growth == null) return undefined;
  return growth >= 0 ? 'positive' : 'warning';
}

// ── Donut chart colors ────────────────────────────────────────────────────────
const STATUS_COLORS = {
  completed: '#16a34a',
  pending:   '#d97706',
  cancelled: '#dc2626',
};

// ── Main Page ─────────────────────────────────────────────────────────────────
function DashboardPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // ── Derived theme-aware values ────────────────────────────────────────────
  // These replace all hardcoded hex/rgba values throughout the file
  const colors = {
    // Surfaces
    cardBorder:       theme.palette.divider,
    filterPanelBg:    isDark ? theme.palette.action.hover : 'rgba(248,250,252,0.9)',
    filterPanelInset: isDark ? 'none' : 'inset 0 1px 0 rgba(255,255,255,0.8)',
    tooltipBg:        isDark ? theme.palette.background.paper : 'rgba(255, 255, 255, 0.96)',
    tooltipBorder:    theme.palette.divider,

    // Text
    titleText:     theme.palette.text.primary,
    subtitleText:  theme.palette.text.secondary,
    disabledText:  theme.palette.text.disabled,

    // Accent (brand blue)
    accent:        '#2563eb',
    accentBg:      isDark ? 'rgba(37,99,235,0.15)' : 'rgba(37,99,235,0.08)',
    accentHover:   '#1d4ed8',

    // Card gradient background
    cardGradient:  isDark
      ? `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`
      : 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)',

    // Progress bar track
    barTrack: isDark ? theme.palette.action.selected : 'rgba(15,23,42,0.06)',

    // Icon backgrounds
    iconBlueBg: isDark ? 'rgba(37,99,235,0.18)' : 'rgba(37,99,235,0.14)',
    iconCyanBg: isDark ? 'rgba(6,182,212,0.16)'  : 'rgba(6,182,212,0.12)',

    // Chip (period selector) unselected
    chipUnselectedBg:     theme.palette.background.paper,
    chipUnselectedBorder: isDark ? theme.palette.divider : 'rgba(148,163,184,0.35)',
    chipUnselectedColor:  theme.palette.text.primary,
    chipUnselectedHover:  isDark ? theme.palette.action.hover : '#f1f5f9',

    // Period toggle buttons (daily/monthly)
    toggleBg:            isDark ? theme.palette.action.selected : theme.palette.action.hover,
    toggleSelectedColor: '#2563eb',

    // Chart grid / axes
    gridStroke: isDark ? 'rgba(148,163,184,0.14)' : 'rgba(71,85,105,0.22)',
    axisColor:  theme.palette.text.secondary,
  };

  const [analytics, setAnalytics]               = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsPeriod, setAnalyticsPeriod]   = useState('this_month');
  const [customNum, setCustomNum]               = useState('');
  const [customUnit, setCustomUnit]             = useState('d');
  const [analyticsOpen, setAnalyticsOpen]       = useState(false);

  const [revenueTrend, setRevenueTrend]               = useState([]);
  const [revenueTrendLoading, setRevenueTrendLoading] = useState(false);
  const [revenueTrendPeriod, setRevenueTrendPeriod]   = useState('days');
  const [orderTrend, setOrderTrend]                   = useState([]);
  const [orderTrendLoading, setOrderTrendLoading]     = useState(false);

  // ── Fetch ─────────────────────────────────────────────────────────────────
  const fetchAnalytics = useCallback(async (period) => {
    try {
      setAnalyticsLoading(true);
      const res = await api.get('/admin/analytics', { params: { period } });
      setAnalytics(res.data.data);
    } catch (err) {
      console.error('Failed to fetch dashboard analytics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics(analyticsPeriod);
  }, [analyticsPeriod, fetchAnalytics]);

  const fetchRevenueTrend = useCallback(async (period) => {
    try {
      setRevenueTrendLoading(true);
      const res = await api.get('/admin/analytics/revenue-trend', { params: { period } });
      setRevenueTrend(res.data.data ?? []);
    } catch (err) {
      console.error('Failed to fetch revenue trend:', err);
    } finally {
      setRevenueTrendLoading(false);
    }
  }, []);

  const fetchOrderTrend = useCallback(async (period) => {
    try {
      setOrderTrendLoading(true);
      const res = await api.get('/admin/analytics/order-trend', { params: { period } });
      setOrderTrend(res.data.data ?? []);
    } catch (err) {
      console.error('Failed to fetch order trend:', err);
    } finally {
      setOrderTrendLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRevenueTrend(revenueTrendPeriod);
    fetchOrderTrend(revenueTrendPeriod);
  }, [revenueTrendPeriod, fetchRevenueTrend, fetchOrderTrend]);

  // ── KPI cards ─────────────────────────────────────────────────────────────
  const kpiCards = analytics ? [
    {
      title: t('dashboard.kpi.orders', { defaultValue: 'Orders' }),
      value: analytics.kpis?.orders?.count ?? '—',
      caption: growthCaption(analytics.kpis?.orders?.growth) ?? '—',
      captionTone: growthTone(analytics.kpis?.orders?.growth),
      icon: <ReceiptLongOutlinedIcon fontSize="small" />,
    },
    {
      title: t('dashboard.kpi.users', { defaultValue: 'New Users' }),
      value: analytics.kpis?.users?.count ?? '—',
      caption: growthCaption(analytics.kpis?.users?.growth) ?? '—',
      captionTone: growthTone(analytics.kpis?.users?.growth),
      icon: <GroupOutlinedIcon fontSize="small" />,
    },
    {
      title: t('dashboard.kpi.providers', { defaultValue: 'New Providers' }),
      value: analytics.kpis?.providers?.count ?? '—',
      caption: growthCaption(analytics.kpis?.providers?.growth) ?? '—',
      captionTone: growthTone(analytics.kpis?.providers?.growth),
      icon: <BuildOutlinedIcon fontSize="small" />,
    },
    {
      title: t('dashboard.kpi.revenue', { defaultValue: 'Revenue' }),
      value: analytics.kpis?.revenue?.amount != null
        ? `$${Number(analytics.kpis.revenue.amount).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
        : '—',
      caption: growthCaption(analytics.kpis?.revenue?.growth) ?? '—',
      captionTone: growthTone(analytics.kpis?.revenue?.growth),
      icon: <AttachMoneyRoundedIcon fontSize="small" />,
    },
  ] : [];

  // ── Distribution cards ────────────────────────────────────────────────────
  const dist = analytics?.chart_data?.order_status_distribution;
  const distTotal = dist
    ? dist.completed.count + dist.pending.count + dist.cancelled.count
    : 0;

  const distCards = dist ? [
    {
      title: t('dashboard.dist.completed', { defaultValue: 'Completed' }),
      value: dist.completed.count.toLocaleString(),
      caption: `${dist.completed.percentage.toFixed(1)}% of orders`,
      captionTone: 'positive',
      icon: <CheckCircleOutlineRoundedIcon fontSize="small" />,
    },
    {
      title: t('dashboard.dist.pending', { defaultValue: 'Pending' }),
      value: dist.pending.count.toLocaleString(),
      caption: `${dist.pending.percentage.toFixed(1)}% of orders`,
      captionTone: 'neutral',
      icon: <AccessTimeRoundedIcon fontSize="small" />,
    },
    {
      title: t('dashboard.dist.cancelled', { defaultValue: 'Cancelled' }),
      value: dist.cancelled.count.toLocaleString(),
      caption: `${dist.cancelled.percentage.toFixed(1)}% of orders`,
      captionTone: 'warning',
      icon: <CancelOutlinedIcon fontSize="small" />,
    },
    {
      title: t('dashboard.dist.total', { defaultValue: 'Total Orders' }),
      value: distTotal.toLocaleString(),
      caption: analytics?.meta?.display_message ?? '',
      captionTone: 'neutral',
      icon: <PieChartOutlineRoundedIcon fontSize="small" />,
    },
  ] : [];

  // ── Chart data ─────────────────────────────────────────────────────────────
  const donutData = dist ? [
    { name: 'Completed', value: dist.completed.count,  color: STATUS_COLORS.completed },
    { name: 'Pending',   value: dist.pending.count,    color: STATUS_COLORS.pending },
    { name: 'Cancelled', value: dist.cancelled.count,  color: STATUS_COLORS.cancelled },
  ] : [];

  const revenueData = (analytics?.chart_data?.revenue_by_category ?? []).map((c) => ({
    name: c.name,
    revenue: parseFloat(c.total_revenue),
  }));

  const topCategories = analytics?.chart_data?.top_categories_by_orders ?? [];
  const topProviders  = analytics?.chart_data?.top_providers_by_orders ?? [];
  const maxCatCount   = topCategories[0]?.completed_count ?? 1;
  const maxProvOrders = topProviders[0]?.total_orders ?? 1;

  return (
    <Stack spacing={3} dir={isRtl ? 'rtl' : 'ltr'}>
      <PageHeader
        title={t('dashboard.title', { defaultValue: 'Dashboard' })}
        subtitle={t('dashboard.welcome', { defaultValue: "Welcome back! Here's what's happening." })}
      />

      {/* ── KPI Cards ───────────────────────────────────────────────────── */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
        gap: 2,
      }}>
        {analyticsLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} variant="rounded" height={120} sx={{ borderRadius: 2 }} />
            ))
          : kpiCards.map((card) => (
              <DashboardMetricCard key={card.title} {...card} />
            ))
        }
      </Box>

      {/* ── Analytics Panel ──────────────────────────────────────────────── */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 2.5,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: isDark
            ? '0 18px 45px rgba(0,0,0,0.35)'
            : '0 18px 45px rgba(15,23,42,0.08)',
          background: colors.cardGradient,
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
          {/* Header + Toggle */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            spacing={2}
            sx={{ mb: analyticsOpen ? 3 : 2 }}
          >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ minHeight: 52 }}>
              <Box sx={{
                width: 48, height: 48, borderRadius: 2,
                background: `linear-gradient(135deg, ${colors.iconBlueBg}, ${colors.iconCyanBg})`,
                display: 'grid', placeItems: 'center', color: colors.accent,
                boxShadow: `inset 0 0 0 1px ${isDark ? 'rgba(37,99,235,0.2)' : 'rgba(37,99,235,0.12)'}`,
                alignSelf: 'center',
              }}>
                <TrendingUpRoundedIcon />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em', lineHeight: 1.2, mb: 0.5 }}>
                  {t('dashboard.analytics.title', { defaultValue: 'Period Analytics' })}
                </Typography>
                {analytics?.meta && (
                  <Typography variant="caption" sx={{
                    display: 'inline-flex', alignItems: 'center',
                    px: 1.1, py: 0.35, borderRadius: 2,
                    bgcolor: 'action.hover', color: 'text.secondary',
                    fontFamily: 'monospace', fontWeight: 700, alignSelf: 'flex-start',
                  }}>
                    📅 {analytics.meta.display_message} · {analytics.meta.from_date?.slice(0, 10)} → {analytics.meta.to_date?.slice(0, 10)}
                  </Typography>
                )}
              </Box>
            </Stack>

            <Button
              startIcon={<FilterListIcon />}
              variant={analyticsOpen ? 'contained' : 'outlined'}
              onClick={() => setAnalyticsOpen((v) => !v)}
              size="medium"
              sx={{
                borderRadius: 1, fontWeight: 800, textTransform: 'none', px: 2.4, height: 42,
                boxShadow: analyticsOpen ? '0 10px 22px rgba(37,99,235,0.22)' : 'none',
              }}
            >
              {analyticsPeriod.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </Button>
          </Stack>

          {/* Filter Panel */}
          <Collapse in={analyticsOpen}>
            <Box sx={{
              p: { xs: 2, md: 3 }, borderRadius: 2,
              bgcolor: colors.filterPanelBg,
              border: '1px solid',
              borderColor: 'divider',
              mb: 3,
              boxShadow: colors.filterPanelInset,
            }}>
              <Stack spacing={2.2}>
                <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Select Period
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ rowGap: 1 }}>
                  {PRESET_PERIODS.map((p) => {
                    const selected = analyticsPeriod === p;
                    const label = p.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
                    return (
                      <Chip key={p} label={label} clickable
                        onClick={() => { setAnalyticsPeriod(p); setCustomNum(''); }}
                        size="small"
                        sx={{
                          height: 36, borderRadius: 1, fontWeight: 800, fontSize: '0.8rem', border: '1px solid',
                          borderColor: selected ? colors.accent : colors.chipUnselectedBorder,
                          bgcolor: selected ? colors.accent : colors.chipUnselectedBg,
                          color: selected ? '#fff' : 'text.primary',
                          boxShadow: selected ? '0 8px 18px rgba(37,99,235,0.24)' : isDark ? 'none' : '0 2px 8px rgba(15,23,42,0.04)',
                          transition: 'all 180ms ease',
                          '& .MuiChip-label': { px: 1.5 },
                          '&:hover': {
                            bgcolor: selected ? colors.accentHover : colors.chipUnselectedHover,
                            transform: 'translateY(-1px)',
                          },
                        }}
                      />
                    );
                  })}
                </Stack>

                <Divider />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
                  <TextField
                    value={customNum}
                    onChange={(e) => { const val = e.target.value; if (val === '' || /^\d+$/.test(val)) setCustomNum(val); }}
                    placeholder="4"
                    size="small"
                    sx={{
                      width: { xs: '100%', sm: 90 },
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                        fontSize: '0.9rem',
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        bgcolor: 'background.paper',
                      },
                    }}
                  />
                  <Stack direction="row" spacing={1}>
                    {UNITS.map((u) => (
                      <Box key={u} onClick={() => setCustomUnit(u)} sx={{
                        height: 40, width: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: 1,
                        border: '1px solid',
                        borderColor: customUnit === u ? colors.accent : 'divider',
                        bgcolor: customUnit === u
                          ? (isDark ? 'rgba(37,99,235,0.2)' : '#eff6ff')
                          : 'background.paper',
                        color: customUnit === u ? colors.accent : 'text.secondary',
                        fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'monospace',
                        transition: 'all 160ms ease',
                        '&:hover': { borderColor: colors.accent, color: colors.accent, transform: 'translateY(-1px)' },
                      }}>
                        {u}
                      </Box>
                    ))}
                  </Stack>
                  <Button
                    onClick={() => { if (!customNum) return; setAnalyticsPeriod(`${customNum}${customUnit}`); }}
                    variant="contained" size="small" disabled={!customNum}
                    sx={{ borderRadius: 1, fontWeight: 800, textTransform: 'none', height: 40, px: 3, boxShadow: '0 8px 18px rgba(37,99,235,0.22)' }}>
                    Apply
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Collapse>

          {/* Distribution Cards */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2,
          }}>
            {analyticsLoading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} variant="rounded" height={120} sx={{ borderRadius: 2 }} />
                ))
              : distCards.map((card) => (
                  <DashboardMetricCard key={card.title} {...card} />
                ))
            }
          </Box>
        </CardContent>
      </Card>

      {/* ── Charts Row ──────────────────────────────────────────────────────── */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) minmax(0, 1fr)' },
        gap: 2.5,
      }}>
        {/* Donut — Status Distribution */}
        <Card elevation={0} sx={{ borderRadius: 2.5, border: '1px solid', borderColor: 'divider', p: 2.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2 }}>
            {t('dashboard.charts.statusDistribution', { defaultValue: 'Order Status Distribution' })}
          </Typography>
          {analyticsLoading
            ? <Skeleton variant="rounded" height={220} />
            : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={donutData} dataKey="value" cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {donutData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => value.toLocaleString()}
                    contentStyle={{
                      backgroundColor: colors.tooltipBg,
                      border: `1px solid ${colors.tooltipBorder}`,
                      borderRadius: 12,
                      color: theme.palette.text.primary,
                    }}
                  />
                  <Legend iconType="square" iconSize={10} />
                </PieChart>
              </ResponsiveContainer>
            )
          }
        </Card>

        {/* Bar — Revenue by Category */}
        <Card elevation={0} sx={{ borderRadius: 2.5, border: '1px solid', borderColor: 'divider', p: 2.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2 }}>
            {t('dashboard.charts.revenueByCategory', { defaultValue: 'Revenue by Category' })}
          </Typography>
          {analyticsLoading
            ? <Skeleton variant="rounded" height={220} />
            : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={revenueData} margin={{ top: 4, right: 8, bottom: 4, left: 8 }}>
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: colors.axisColor }} />
                  <YAxis
                    tick={{ fontSize: 11, fill: colors.axisColor }}
                    tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                  />
                  <Tooltip
                    formatter={(v) => [`$${Number(v).toLocaleString(undefined, { maximumFractionDigits: 0 })}`, 'Revenue']}
                    contentStyle={{
                      backgroundColor: colors.tooltipBg,
                      border: `1px solid ${colors.tooltipBorder}`,
                      borderRadius: 12,
                      color: theme.palette.text.primary,
                    }}
                  />
                  <Bar dataKey="revenue" fill="#185FA5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )
          }
        </Card>
      </Box>

      {/* ── Revenue + Order Trend ─────────────────────────────────────────── */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          p: 3,
          bgcolor: 'background.paper',
          boxShadow: isDark ? '0 4px 20px 0 rgba(0,0,0,0.25)' : '0 4px 20px 0 rgba(0,0,0,0.02)',
        }}
      >
        {/* Header */}
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          sx={{ mb: 4 }}
        >
          <Stack direction="row" alignItems="center" spacing={3}>
            {/* Title */}
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box sx={{
                p: 0.75,
                borderRadius: 2,
                display: 'flex',
                bgcolor: colors.accentBg,
                color: colors.accent,
              }}>
                <TrendingUpRoundedIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {t('dashboard.charts.trend', { defaultValue: 'Revenue & Order Trend' })}
              </Typography>
            </Stack>

            {/* Legends */}
            <Stack direction="row" spacing={2}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ width: 8, height: 8, bgcolor: '#2563eb', borderRadius: '50%' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Revenue
                </Typography>
              </Stack>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Box sx={{ width: 8, height: 8, bgcolor: '#16a34a', borderRadius: '50%' }} />
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  Orders
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          {/* Period toggle */}
          <Stack
            direction="row"
            spacing={0.5}
            sx={{
              bgcolor: colors.toggleBg,
              p: 0.5,
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            {['days', 'months'].map((opt) => (
              <Button
                key={opt}
                variant="text"
                size="small"
                onClick={() => setRevenueTrendPeriod(opt)}
                sx={{
                  borderRadius: 0.5,
                  fontWeight: 600,
                  textTransform: 'none',
                  fontSize: '0.75rem',
                  height: 28,
                  px: 2,
                  minWidth: 70,
                  color: revenueTrendPeriod === opt ? colors.accent : 'text.secondary',
                  bgcolor: revenueTrendPeriod === opt ? 'background.paper' : 'transparent',
                  boxShadow: revenueTrendPeriod === opt ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                  '&:hover': {
                    bgcolor: revenueTrendPeriod === opt ? 'background.paper' : 'action.selected',
                  },
                }}
              >
                {opt === 'days' ? 'Daily' : 'Monthly'}
              </Button>
            ))}
          </Stack>
        </Stack>

        {/* Chart */}
        {revenueTrendLoading || orderTrendLoading ? (
          <Skeleton variant="rounded" height={300} sx={{ borderRadius: 2 }} />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={revenueTrend.map((r, i) => ({
                period: r.period,
                revenue: parseFloat(r.total),
                orders: orderTrend[i]?.count ?? null,
              }))}
              margin={{ top: 10, right: 20, bottom: 0, left: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke={colors.gridStroke}
              />

              <XAxis
                dataKey="period"
                tick={{ fontSize: 12, fill: colors.axisColor, fontWeight: 700 }}
                axisLine={{ stroke: colors.axisColor, strokeWidth: 1.4 }}
                tickLine={{ stroke: colors.axisColor, strokeWidth: 1.2 }}
                dy={10}
              />

              <YAxis
                yAxisId="revenue"
                orientation="left"
                tick={{ fontSize: 12, fill: colors.axisColor, fontWeight: 700 }}
                axisLine={{ stroke: colors.axisColor, strokeWidth: 1.4 }}
                tickLine={{ stroke: colors.axisColor, strokeWidth: 1.2 }}
                tickFormatter={(v) =>
                  `$${Number(v).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
                }
              />

              <YAxis
                yAxisId="orders"
                orientation="right"
                tick={{ fontSize: 12, fill: colors.axisColor, fontWeight: 700 }}
                axisLine={{ stroke: colors.axisColor, strokeWidth: 1.4 }}
                tickLine={{ stroke: colors.axisColor, strokeWidth: 1.2 }}
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: colors.tooltipBg,
                  border: `1px solid ${colors.tooltipBorder}`,
                  borderRadius: '12px',
                  boxShadow: isDark
                    ? '0 10px 25px -5px rgba(0,0,0,0.4)'
                    : '0 10px 25px -5px rgba(0,0,0,0.08)',
                  color: theme.palette.text.primary,
                }}
                labelStyle={{ color: theme.palette.text.primary, fontWeight: 700 }}
                itemStyle={{ fontWeight: 600, color: theme.palette.text.primary }}
                formatter={(value, name) =>
                  name === 'revenue'
                    ? [`$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 'Revenue']
                    : [Number(value).toLocaleString(), 'Orders']
                }
              />

              <Line
                yAxisId="revenue"
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ r: 0 }}
                activeDot={{ r: 6, strokeWidth: 0, fill: '#2563eb' }}
              />

              <Line
                yAxisId="orders"
                type="monotone"
                dataKey="orders"
                stroke="#16a34a"
                strokeWidth={2}
                dot={{ r: 0 }}
                activeDot={{ r: 5, strokeWidth: 0, fill: '#16a34a' }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </Card>

      {/* ── Top Lists Row ───────────────────────────────────────────────────── */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) minmax(0, 1fr)' },
        gap: 2.5,
      }}>
        {/* Top Categories */}
        <Card elevation={0} sx={{ borderRadius: 2.5, border: '1px solid', borderColor: 'divider', p: 2.5 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <EmojiEventsOutlinedIcon sx={{ color: '#d97706', fontSize: 20 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              {t('dashboard.charts.topCategories', { defaultValue: 'Top Categories by Orders' })}
            </Typography>
          </Stack>
          {analyticsLoading
            ? <Stack spacing={1.5}>{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} variant="rounded" height={12} />)}</Stack>
            : topCategories.map((item, index) => (
                <Stack key={item.name} direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                  <Typography variant="caption" sx={{ color: 'text.disabled', width: 16, textAlign: 'right', flexShrink: 0 }}>
                    {index + 1}
                  </Typography>
                  <Typography variant="body2" sx={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name}
                  </Typography>
                  <Box sx={{ flex: 1, height: 6, bgcolor: colors.barTrack, borderRadius: 3 }}>
                    <Box sx={{
                      width: `${(item.completed_count / maxCatCount) * 100}%`,
                      height: '100%',
                      bgcolor: '#2563eb',
                      borderRadius: 3,
                      transition: 'width .4s',
                    }} />
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', width: 36, textAlign: 'right', flexShrink: 0 }}>
                    {item.completed_count}
                  </Typography>
                </Stack>
              ))
          }
        </Card>

        {/* Top Providers */}
        <Card elevation={0} sx={{ borderRadius: 2.5, border: '1px solid', borderColor: 'divider', p: 2.5 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
            <GroupOutlinedIcon sx={{ color: '#16a34a', fontSize: 20 }} />
            <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
              {t('dashboard.charts.topProviders', { defaultValue: 'Top Providers by Orders' })}
            </Typography>
          </Stack>
          {analyticsLoading
            ? <Stack spacing={1.5}>{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} variant="rounded" height={12} />)}</Stack>
            : topProviders.map((item, index) => (
                <Stack key={item.name} direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                  <Typography variant="caption" sx={{ color: 'text.disabled', width: 16, textAlign: 'right', flexShrink: 0 }}>
                    {index + 1}
                  </Typography>

                  <Stack sx={{ flex: 1, overflow: 'hidden', minWidth: 0 }}>
                    <Typography variant="body2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {item.name}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={0.8} sx={{ mt: 0.4 }}>
                      <Box sx={{ flex: 1, height: 5, bgcolor: colors.barTrack, borderRadius: 3 }}>
                        <Box sx={{
                          width: `${(item.total_orders / maxProvOrders) * 100}%`,
                          height: '100%',
                          bgcolor: '#16a34a',
                          borderRadius: 3,
                          transition: 'width .4s',
                        }} />
                      </Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', flexShrink: 0 }}>
                        {item.total_orders} orders
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack alignItems="flex-end" sx={{ flexShrink: 0, ml: 1 }}>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.2 }}>
                      {item.accepted_orders} accepted
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.68rem', lineHeight: 1.2 }}>
                      {item.acceptance_rate}% acc. rate
                    </Typography>
                  </Stack>
                </Stack>
              ))
          }
        </Card>
      </Box>
    </Stack>
  );
}

export default DashboardPage;