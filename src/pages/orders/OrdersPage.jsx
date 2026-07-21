// import { useEffect, useState, useCallback } from 'react';
// import { Box, Card, CardContent, Pagination, Stack, Typography } from '@mui/material';
// import PageHeader from '../../components/PageHeader';
// import OrdersSummaryCards from '../../components/orders/OrdersSummaryCards';
// import OrdersTable from '../../components/orders/OrdersTable';
// import OrderDetailsDialog from '../../components/orders/OrderDetailsDialog';
// import { useTranslation } from 'react-i18next';
// import api from '../../utils/axiosInstance';

// const EMPTY_FILTERS = { search: '', status: 'all' };

// function OrdersPage() {
//   const { t, i18n } = useTranslation();
//   const isRtl = i18n.dir() === 'rtl';

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [lastPage, setLastPage] = useState(1);
//   const [total, setTotal] = useState(0);

//   const [filters] = useState(EMPTY_FILTERS);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [detailLoading, setDetailLoading] = useState(false);

 

//   const fetchOrders = useCallback(async (p = 1) => {
//     try {
//       setLoading(true);
//       const res = await api.get(`/admin/orders?page=${p}`);
//       const d = res.data.data;
//       setOrders(d.data || []);
//       setTotal(d.total || 0);
//       setLastPage(d.last_page || 1);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchOrders(page);
//   }, [page, fetchOrders]);

//   async function handleViewOrder(order) {
//     try {
//       setDetailLoading(true);
//       setSelectedOrder({ _loading: true });
//       const res = await api.get(`/admin/orders/${order.id}`);
//       setSelectedOrder(res.data.data);
//     } catch (err) {
//       console.error(err);
//       setSelectedOrder(null);
//     } finally {
//       setDetailLoading(false);
//     }
//   }

//   // فلترة client-side على البيانات الموجودة بالصفحة الحالية
//   const filteredOrders = orders.filter((order) => {
//     const searchTerm = filters.search.trim().toLowerCase();
//     const matchesSearch = !searchTerm ||
//       String(order.order_number).includes(searchTerm) ||
//       (order.title || '').toLowerCase().includes(searchTerm) ||
//       (order.providers || []).some((p) => p.name.toLowerCase().includes(searchTerm));
//     const matchesStatus = filters.status === 'all' || order.status === filters.status;
//     return matchesSearch && matchesStatus;
//   });

//   const summary = {
//     totalOrders: total,
//     activeOrders: orders.filter((o) => o.status === 'pending').length,
//     revenue: 0, // ما في price بقائمة الـ orders
//     completionRate: total > 0
//       ? Math.round((orders.filter((o) => o.status === 'completed').length / orders.length) * 100)
//       : 0,
//   };

//   return (
//     <Stack spacing={3} dir={isRtl ? 'rtl' : 'ltr'}>
//       <PageHeader title={t('orders.title')} subtitle={t('orders.subtitle')} />

//       <OrdersSummaryCards summary={summary} />

//       <Card elevation={0} sx={(theme) => ({ borderRadius: 4, border: `1px solid ${theme.palette.divider}` })}>
//         <CardContent sx={{ p: { xs: 2, md: 3 } }}>
//           <Stack spacing={2.5}>
//             <Box>
//               <Typography variant="h6" sx={{ fontWeight: 800 }}>{t('orders.listTitle')}</Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
//                 {total} total orders
//               </Typography>
//             </Box>

          

//             <OrdersTable
//               orders={filteredOrders}
//               loading={loading}
//               onViewOrder={handleViewOrder}
//             />

//             <Stack direction="row" justifyContent="space-between" alignItems="center">
//               <Typography variant="body2" color="text.secondary">
//                 Showing {filteredOrders.length} of {total}
//               </Typography>
//               {lastPage > 1 && (
//                 <Pagination
//                   count={lastPage}
//                   page={page}
//                   onChange={(_, v) => setPage(v)}
//                   color="primary"
//                   shape="rounded"
//                 />
//               )}
//             </Stack>
//           </Stack>
//         </CardContent>
//       </Card>

//       <OrderDetailsDialog
//         open={Boolean(selectedOrder)}
//         order={selectedOrder}
//         loading={detailLoading}
//         onClose={() => setSelectedOrder(null)}
//       />
//     </Stack>
//   );
// }

// export default OrdersPage;



import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Collapse,
  Divider,
  Pagination,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import FilterListIcon from '@mui/icons-material/FilterList';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import PageHeader from '../../components/PageHeader';
import OrdersTable from '../../components/orders/OrdersTable';
import OrderDetailsDialog from '../../components/orders/OrderDetailsDialog';
import DashboardMetricCard from '../../components/dashboard/DashboardMetricCard';
import { useTranslation } from 'react-i18next';
import api from '../../utils/axiosInstance';

// ── Constants ────────────────────────────────────────────────────────────────
const PRESET_PERIODS = [
  'today', 'yesterday', 'this_week', 'last_week',
  'this_month', 'last_month', 'this_year', 'last_year',
];
const UNITS = ['d', 'w', 'm', 'y'];
const STATUS_FILTERS = ['all', 'pending', 'completed', 'cancelled'];

// ── Helper: format growth caption ─────────────────────────────────────────────
// growth مثلاً: -30.55 → "-30.6% vs prev"  |  +12 → "+12.0% vs prev"
function growthCaption(growth) {
  if (growth == null) return null;
  const sign = growth > 0 ? '+' : '';
  return `${sign}${Number(growth).toFixed(1)}% vs prev period`;
}

// captionTone بناءً على القيمة: positive إذا growth > 0، warning إذا < 0
function growthTone(growth) {
  if (growth == null) return undefined;
  return growth >= 0 ? 'positive' : 'warning';
}

// ── Main page ────────────────────────────────────────────────────────────────
function OrdersPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  // ── Orders list state ─────────────────────────────────────────────────────
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ── Analytics state ───────────────────────────────────────────────────────
  const [analyticsPeriod, setAnalyticsPeriod] = useState('this_month');
  const [customNum, setCustomNum] = useState('');
  const [customUnit, setCustomUnit] = useState('d');
  const [analytics, setAnalytics] = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  // ── Fetch analytics ───────────────────────────────────────────────────────
  async function fetchAnalytics(period) {
    try {
      setAnalyticsLoading(true);
      const res = await api.get('/admin/analytics/orders', { params: { period } });
      setAnalytics(res.data.data);
    } catch (err) {
      console.error('Failed to fetch order analytics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  }

  useEffect(() => {
    fetchAnalytics(analyticsPeriod);
  }, [analyticsPeriod]);

  // ── Fetch orders list ─────────────────────────────────────────────────────
  const fetchOrders = useCallback(async (p = 1, status = 'all') => {
    try {
      setLoading(true);
      const params = { page: p };
      if (status !== 'all') params.status = status;
      const res = await api.get('/admin/orders', { params });
      const d = res.data.data;
      setOrders(d.data || []);
      setTotal(d.total || 0);
      setLastPage(d.last_page || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders(page, statusFilter);
  }, [page, statusFilter, fetchOrders]);

  // ── View order detail ─────────────────────────────────────────────────────
  async function handleViewOrder(order) {
    try {
      setDetailLoading(true);
      setSelectedOrder({ _loading: true });
      const res = await api.get(`/admin/orders/${order.id}`);
      setSelectedOrder(res.data.data);
    } catch (err) {
      console.error(err);
      setSelectedOrder(null);
    } finally {
      setDetailLoading(false);
    }
  }

  // ── Analytics cards config ────────────────────────────────────────────────
  // كل كارد يعرض:
  //   value   → period.count
  //   caption → growth% vs prev period  (مع general كـ fallback)
  //   captionTone → positive إذا growth >= 0 ، warning إذا < 0
  const totalGrowth    = analytics?.['Total Orders']?.period?.growth;
  const pendingGrowth  = analytics?.['Pending Orders']?.period?.growth;
  const completedGrowth= analytics?.['Completed Orders']?.period?.growth;
  const cancelledGrowth= analytics?.['Cancelled Orders']?.period?.growth;

  const analyticsCards = [
    // 1 ── Total Orders
    {
      title: t('orders.analytics.total', { defaultValue: 'Total Orders' }),
      value: analytics?.['Total Orders']?.period?.count ?? '—',
      // الـ general هو المجموع الكلي — نعرضه كـ sub-info
      caption:
        growthCaption(totalGrowth) ??
        (analytics?.['Total Orders']?.general != null
          ? `${analytics['Total Orders'].general.toLocaleString()} overall`
          : '—'),
      captionTone: growthTone(totalGrowth),
      icon: <AssignmentOutlinedIcon />,
    },

    // 2 ── Pending Orders
    {
      title: t('orders.analytics.pending', { defaultValue: 'Pending Orders' }),
      value: analytics?.['Pending Orders']?.period?.count ?? '—',
      caption:
        growthCaption(pendingGrowth) ??
        (analytics?.['Pending Orders']?.general != null
          ? `${analytics['Pending Orders'].general.toLocaleString()} overall`
          : '—'),
      captionTone: growthTone(pendingGrowth),
      icon: <AccessTimeRoundedIcon />,
    },

    // 3 ── Completed Orders
    {
      title: t('orders.analytics.completed', { defaultValue: 'Completed Orders' }),
      value: analytics?.['Completed Orders']?.period?.count ?? '—',
      caption:
        growthCaption(completedGrowth) ??
        (analytics?.['Completed Orders']?.general != null
          ? `${analytics['Completed Orders'].general.toLocaleString()} overall`
          : '—'),
      captionTone: growthTone(completedGrowth),
      icon: <CheckCircleOutlineRoundedIcon />,
    },

    // 4 ── Cancelled Orders
    {
      title: t('orders.analytics.cancelled', { defaultValue: 'Cancelled Orders' }),
      value: analytics?.['Cancelled Orders']?.period?.count ?? '—',
      caption:
        growthCaption(cancelledGrowth) ??
        (analytics?.['Cancelled Orders']?.general != null
          ? `${analytics['Cancelled Orders'].general.toLocaleString()} overall`
          : '—'),
      // للـ cancelled: growth سالب = إيجابي (أقل إلغاءات)، موجب = تحذير
      captionTone: cancelledGrowth != null
        ? (cancelledGrowth <= 0 ? 'positive' : 'warning')
        : undefined,
      icon: <CancelOutlinedIcon />,
    },

    // 5 ── Completion Rate (period vs general)
    {
      title: t('orders.analytics.completionRate', { defaultValue: 'Completion Rate' }),
      value: analytics?.periodAcceptenecRate != null
        ? `${Number(analytics.periodAcceptenecRate).toFixed(1)}%`
        : '—',
      // مقارنة الـ period rate بالـ general rate
      caption: analytics?.generalAcceptenecRate != null
        ? `${Number(analytics.generalAcceptenecRate).toFixed(1)}% all-time avg`
        : 'completion rate',
      captionTone: analytics?.periodAcceptenecRate != null && analytics?.generalAcceptenecRate != null
        ? (analytics.periodAcceptenecRate >= analytics.generalAcceptenecRate ? 'positive' : 'warning')
        : undefined,
      icon: <TrendingUpRoundedIcon />,
    },

    // 6 ── Cancellation Rate (period vs general)
    {
      title: t('orders.analytics.cancellationRate', { defaultValue: 'Cancellation Rate' }),
      value: analytics?.periodCancellationRate != null
        ? `${Number(analytics.periodCancellationRate).toFixed(1)}%`
        : '—',
      caption: analytics?.generalCancellationRate != null
        ? `${Number(analytics.generalCancellationRate).toFixed(1)}% all-time avg`
        : 'cancellation rate',
      // أقل إلغاءات من المعدل العام = إيجابي
      captionTone: analytics?.periodCancellationRate != null && analytics?.generalCancellationRate != null
        ? (analytics.periodCancellationRate <= analytics.generalCancellationRate ? 'positive' : 'warning')
        : undefined,
      icon: <CancelOutlinedIcon />,
    },

    // 7 ── Pending Rate (period) — موجود بالـ API ومو معروض قبل
    {
      title: t('orders.analytics.pendingRate', { defaultValue: 'Pending Rate' }),
      value: analytics?.periodPendingRate != null
        ? `${Number(analytics.periodPendingRate).toFixed(1)}%`
        : '—',
      caption: analytics?.generalPendingRate != null
        ? `${Number(analytics.generalPendingRate).toFixed(1)}% all-time avg`
        : 'pending rate',
      captionTone: analytics?.periodPendingRate != null && analytics?.generalPendingRate != null
        ? (analytics.periodPendingRate <= analytics.generalPendingRate ? 'positive' : 'warning')
        : undefined,
      icon: <AccessTimeRoundedIcon />,
    },
  ];

  return (
    <Stack spacing={3} dir={isRtl ? 'rtl' : 'ltr'}>
      <PageHeader
        title={t('orders.title')}
        subtitle={t('orders.subtitle')}
      />

      {/* ── Analytics Card ──────────────────────────────────────────────── */}
 {/* ── General Stats (ثابتة مو متأثرة بالـ period) ──────── */}
<Box sx={{
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
  gap: 2,
}}>
  {[
    {
      title: t('orders.analytics.totalGeneral', { defaultValue: 'Total Orders (All Time)' }),
      value: analytics?.['Total Orders']?.general ?? '—',
      caption: 'All registered orders',
      icon: <AssignmentOutlinedIcon />,
    },
    {
      title: t('orders.analytics.pendingGeneral', { defaultValue: 'Pending (All Time)' }),
      value: analytics?.['Pending Orders']?.general ?? '—',
      caption: `${analytics?.generalPendingRate != null ? Number(analytics.generalPendingRate).toFixed(1) + '% pending rate' : 'of total orders'}`,
      icon: <AccessTimeRoundedIcon />,
    },
    {
      title: t('orders.analytics.completedGeneral', { defaultValue: 'Completed (All Time)' }),
      value: analytics?.['Completed Orders']?.general ?? '—',
      caption: `${analytics?.generalAcceptenecRate != null ? Number(analytics.generalAcceptenecRate).toFixed(1) + '% completion rate' : 'of total orders'}`,
      captionTone: 'positive',
      icon: <CheckCircleOutlineRoundedIcon />,
    },
    {
      title: t('orders.analytics.cancelledGeneral', { defaultValue: 'Cancelled (All Time)' }),
      value: analytics?.['Cancelled Orders']?.general ?? '—',
      caption: `${analytics?.generalCancellationRate != null ? Number(analytics.generalCancellationRate).toFixed(1) + '% cancellation rate' : 'of total orders'}`,
      captionTone: 'warning',
      icon: <CancelOutlinedIcon />,
    },
  ].map((card) =>
    analyticsLoading ? (
      <Skeleton key={card.title} variant="rounded" height={132} sx={{ borderRadius: 2 }} />
    ) : (
      <DashboardMetricCard key={card.title} {...card} />
    )
  )}
</Box>

{/* ── Analytics Card (period) ─────────────────────────── */}
<Card
  elevation={0}
  sx={{
    borderRadius: 2.5,
    border: '1px solid rgba(148,163,184,0.22)',
    boxShadow: '0 18px 45px rgba(15,23,42,0.08)',
    background: 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)',
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
      sx={{ mb: analyticsOpen ? 3 : 0 }}
    >
      <Stack direction="row" spacing={2} alignItems="center" sx={{ minHeight: 52 }}>
        <Box sx={{
          width: 48, height: 48, borderRadius: 2,
          background: 'linear-gradient(135deg, rgba(37,99,235,0.14), rgba(6,182,212,0.12))',
          display: 'grid', placeItems: 'center', color: '#2563eb',
          boxShadow: 'inset 0 0 0 1px rgba(37,99,235,0.12)', alignSelf: 'center',
        }}>
          <TrendingUpRoundedIcon />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2, mb: 0.5 }}>
            {t('orders.analytics.title', { defaultValue: 'Orders Analytics' })}
          </Typography>
          {analytics?.meta && (
            <Typography variant="caption" sx={{
              display: 'inline-flex', alignItems: 'center',
              px: 1.1, py: 0.35, borderRadius: 2,
              bgcolor: 'rgba(15,23,42,0.04)', color: '#64748b',
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
          borderRadius: 2, fontWeight: 800, textTransform: 'none', px: 2.4, height: 42,
          boxShadow: analyticsOpen ? '0 10px 22px rgba(37,99,235,0.22)' : 'none',
        }}
      >
        {analyticsPeriod.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
      </Button>
    </Stack>

    {/* Filter Panel */}
    <Collapse in={analyticsOpen}>
      <Box sx={{
        p: { xs: 2, md: 3 }, borderRadius: 2.5,
        bgcolor: 'rgba(248,250,252,0.9)', border: '1px solid rgba(148,163,184,0.22)',
        mb: 3, boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
      }}>
        <Stack spacing={2.2}>
          <Typography variant="caption" sx={{ fontWeight: 900, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
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
                    height: 36, borderRadius: 2, fontWeight: 800, fontSize: '0.8rem', border: '1px solid',
                    borderColor: selected ? '#2563eb' : 'rgba(148,163,184,0.35)',
                    bgcolor: selected ? '#2563eb' : '#fff', color: selected ? '#fff' : '#334155',
                    boxShadow: selected ? '0 8px 18px rgba(37,99,235,0.24)' : '0 2px 8px rgba(15,23,42,0.04)',
                    transition: 'all 180ms ease', '& .MuiChip-label': { px: 1.5 },
                    '&:hover': { bgcolor: selected ? '#1d4ed8' : '#f1f5f9', transform: 'translateY(-1px)' },
                  }}
                />
              );
            })}
          </Stack>

          <Divider sx={{ borderColor: 'rgba(148,163,184,0.22)' }} />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
            <TextField
              value={customNum}
              onChange={(e) => { const val = e.target.value; if (val === '' || /^\d+$/.test(val)) setCustomNum(val); }}
              placeholder="4" size="small"
              sx={{ width: { xs: '100%', sm: 90 },
                '& .MuiOutlinedInput-root': { borderRadius: 2, fontSize: '0.9rem', fontFamily: 'monospace', fontWeight: 800, bgcolor: '#fff' } }}
            />
            <Stack direction="row" spacing={1}>
              {UNITS.map((u) => (
                <Box key={u} onClick={() => setCustomUnit(u)} sx={{
                  height: 40, width: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  borderRadius: 2, border: `1px solid ${customUnit === u ? '#2563eb' : 'rgba(148,163,184,0.35)'}`,
                  bgcolor: customUnit === u ? '#eff6ff' : '#fff', color: customUnit === u ? '#2563eb' : '#475569',
                  fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'monospace',
                  transition: 'all 160ms ease',
                  '&:hover': { borderColor: '#2563eb', color: '#2563eb', transform: 'translateY(-1px)' },
                }}>
                  {u}
                </Box>
              ))}
            </Stack>
            <Button
              onClick={() => { if (!customNum) return; setAnalyticsPeriod(`${customNum}${customUnit}`); }}
              variant="contained" size="small" disabled={!customNum}
              sx={{ borderRadius: 2, fontWeight: 800, textTransform: 'none', height: 40, px: 3, boxShadow: '0 8px 18px rgba(37,99,235,0.22)' }}>
              Apply
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Collapse>

    {/* Period Analytics Cards Grid */}
    <Box sx={{
      display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', xl: 'repeat(7, 1fr)' },
      gap: 2,
    }}>
      {analyticsCards.map((card) =>
        analyticsLoading ? (
          <Skeleton key={card.title} variant="rounded" height={132} sx={{ borderRadius: 2 }} />
        ) : (
          <DashboardMetricCard key={card.title} {...card} />
        )
      )}
    </Box>
  </CardContent>
</Card>

      {/* ── Status Filter Chips ─────────────────────────────────────────────── */}
      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ rowGap: 1 }}>
        {STATUS_FILTERS.map((status) => {
          const selected = statusFilter === status;
          const labelMap = {
            all: t('orders.filters.all', { defaultValue: 'All' }),
            pending: t('orders.filters.pending', { defaultValue: 'Pending' }),
            completed: t('orders.filters.completed', { defaultValue: 'Completed' }),
            cancelled: t('orders.filters.cancelled', { defaultValue: 'Cancelled' }),
          };
          return (
            <Chip
              key={status}
              label={labelMap[status]}
              onClick={() => { setStatusFilter(status); setPage(1); }}
              clickable
              variant={selected ? 'filled' : 'outlined'}
              color={selected ? 'primary' : 'default'}
              sx={{
                height: 44, px: 0.5, borderRadius: 999, fontWeight: 800, fontSize: '0.92rem',
                borderColor: selected ? '#2563eb' : 'rgba(15,23,42,0.1)',
                backgroundColor: selected ? '#2563eb' : '#ffffff',
                color: selected ? '#ffffff' : '#0f172a',
                '& .MuiChip-label': { px: 1.4 },
                boxShadow: selected ? '0 10px 20px rgba(37,99,235,0.2)' : 'none',
                transition: 'transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease',
                '&:hover': { backgroundColor: selected ? '#1d4ed8' : '#f8fafc', transform: 'translateY(-1px)' },
              }}
            />
          );
        })}
      </Stack>

      {/* ── Orders Table Card ───────────────────────────────────────────────── */}
      <Card
        elevation={0}
        sx={(theme) => ({
          borderRadius: 4,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: '0 1px 2px rgba(15,23,42,0.03), 0 18px 40px rgba(15,23,42,0.05)',
          overflow: 'hidden',
        })}
      >
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Stack spacing={2.5}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {t('orders.listTitle', { defaultValue: 'Orders List' })}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {t('orders.totalCount', { defaultValue: '{{total}} total orders', total })}
              </Typography>
            </Box>

            <OrdersTable
              orders={orders}
              loading={loading}
              onViewOrder={handleViewOrder}
            />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="body2" color="text.secondary">
                {t('orders.showing', {
                  defaultValue: 'Showing {{count}} of {{total}}',
                  count: orders.length,
                  total,
                })}
              </Typography>
              {lastPage > 1 && (
                <Pagination
                  count={lastPage}
                  page={page}
                  onChange={(_, v) => setPage(v)}
                  color="primary"
                  shape="rounded"
                />
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* ── Order Details Dialog ────────────────────────────────────────────── */}
      <OrderDetailsDialog
        open={Boolean(selectedOrder)}
        order={selectedOrder}
        loading={detailLoading}
        onClose={() => setSelectedOrder(null)}
      />
    </Stack>
  );
}

export default OrdersPage;