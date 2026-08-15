import { useCallback, useEffect,  useState,useRef  } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  
  Grid,
  InputAdornment,
  Stack,
  TextField,
  Typography,
    useTheme,
alpha
} from '@mui/material';

import SearchIcon from '@mui/icons-material/Search';
import PageHeader from '../../components/PageHeader';
import CustomersTable from '../../components/customers/CustomersTable';
import { useTranslation } from 'react-i18next';
// أضف هذا السطر بعد import useTranslation
import { fetchCustomers, activateCustomer, deactivateCustomer ,searchCustomers} from '../../services/customersService';
import {  Pagination } from '@mui/material';

// أضف هذه للـ imports الموجودة:
import { Collapse, Divider, Skeleton } from '@mui/material';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import FilterListIcon from '@mui/icons-material/FilterList';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import DashboardMetricCard from '../../components/dashboard/DashboardMetricCard';
import api from '../../utils/axiosInstance';


// ─── Status derivation from API fields ───────────────────────────────────────


//const STATUS_FILTERS = ['all', 'active', 'pending', 'suspended', 'inactive'];

const PRESET_PERIODS = [
  'today','yesterday','this_week','last_week',
  'this_month','last_month','this_year','last_year',
];
const UNITS = ['d', 'w', 'm', 'y'];
// ─── Summary card component ───────────────────────────────────────────────────


// ─── Main page ────────────────────────────────────────────────────────────────
function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
const [analyticsPeriod, setAnalyticsPeriod] = useState('this_month');
const [customNum, setCustomNum]             = useState('');
const [customUnit, setCustomUnit]           = useState('d');
const [analytics, setAnalytics]             = useState(null);
const [analyticsLoading, setAnalyticsLoading] = useState(false);
const [analyticsOpen, setAnalyticsOpen]     = useState(false);

const searchTimeoutRef = useRef(null);
  const theme = useTheme();

  const isDark = theme.palette.mode === 'dark';

  const [search, setSearch] = useState('');
async function fetchAnalytics(period) {
  try {
    setAnalyticsLoading(true);
    const res = await api.get('/admin/analytics/users', { params: { period } });
    setAnalytics(res.data.data);
  } catch (err) {
    console.error('Failed to fetch user analytics:', err);
  } finally {
    setAnalyticsLoading(false);
  }
}

useEffect(() => {
  fetchAnalytics(analyticsPeriod);
}, [analyticsPeriod]);

  const loadCustomers = useCallback(async (pageNumber = 1, searchQuery = '') => {
  setLoading(true);
  setError(null);

  try {
    const q = searchQuery.trim();

    const result = q
      ? await searchCustomers(q, pageNumber)
      : await fetchCustomers(pageNumber);

    const list = Array.isArray(result) ? result : (result.data ?? []);

    setCustomers(list);

    setPagination(
      result && !Array.isArray(result) && result.last_page
        ? {
            total: result.total,
            perPage: result.per_page,
            currentPage: result.current_page,
            lastPage: result.last_page,
          }
        : null
    );
  } catch (err) {
    setError(err.message || 'Failed to load customers');
  } finally {
    setLoading(false);
  }
}, []);

 useEffect(() => {
  clearTimeout(searchTimeoutRef.current);

  searchTimeoutRef.current = setTimeout(() => {
    loadCustomers(page, search);
  }, search.trim() ? 600 : 0);

  return () => clearTimeout(searchTimeoutRef.current);
}, [page, search, loadCustomers]);

  // async function handleToggleActive(customer) {
  //   try {
  //     if (customer.is_active) {
  //       await deactivateCustomer(customer.id);
  //     } else {
  //       await activateCustomer(customer.id);
  //     }
  //   await Promise.all([loadCustomers(), fetchAnalytics(analyticsPeriod)]);
  //   } catch (err) {
  //     console.error('Failed to toggle customer status', err);
  //   }
  // }

  async function handleToggleActive(customer) {
  setLoading(true);
  try {
    if (customer.is_active) {
      await deactivateCustomer(customer.id);
    } else {
      await activateCustomer(customer.id);
    }
    await Promise.all([loadCustomers(page, search), fetchAnalytics(analyticsPeriod)]);
  } catch (err) {
    console.error('Failed to toggle customer status', err);
    setLoading(false);
  }
}
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const locale = i18n.language === 'ar' ? 'ar-EG' : 'en-US';

 

 
  


  



  return (
    <Stack spacing={3.5} dir={isRtl ? 'rtl' : 'ltr'} sx={{ p: { xs: 1, md: 0 } }}>
      <PageHeader
        title={t('customers.title', { defaultValue: 'Customers' })}
        subtitle={t('customers.subtitle', { defaultValue: 'Manage and view all registered customers' })}
       
      />
{/* ── Analytics ─────────────────────────────────────────── */}
 <Card
        elevation={0}
        sx={{
          borderRadius: 2.5,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: isDark ? '0 18px 45px rgba(0,0,0,0.35)' : '0 18px 45px rgba(15,23,42,0.08)',
          background: isDark
            ? `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${theme.palette.background.default} 100%)`
            : 'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)',
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
                background: `linear-gradient(135deg, ${isDark ? 'rgba(255,107,38,0.22)' : 'rgba(255,107,38,0.14)'}, ${isDark ? 'rgba(255,107,38,0.18)' : 'rgba(255,107,38,0.12)'})`,
                display: 'grid', placeItems: 'center', color: '#FF6B26',
                boxShadow: `inset 0 0 0 1px ${isDark ? 'rgba(255,107,38,0.2)' : 'rgba(255,107,38,0.12)'}`,
                alignSelf: 'center',
              }}>
          <TrendingUpRoundedIcon  />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2, mb: 0.5 }}>
            Customers Analytics
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
        sx={{ borderRadius: 2, fontWeight: 800, textTransform: 'none', px: 2.4, height: 42,
          boxShadow: analyticsOpen ? '0 10px 22px rgba(37,99,235,0.22)' : 'none' }}
      >
        {analyticsPeriod.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
      </Button>
    </Stack>

    {/* Filter Panel */}
    <Collapse in={analyticsOpen}>
    <Box sx={{
              p: { xs: 2, md: 3 }, borderRadius: 2,
              bgcolor: isDark ? '#07111F' : 'rgba(248,250,252,0.9)',
              border: '1px solid', borderColor: 'divider',
              mb: 3,
              boxShadow: isDark ? 'none' : 'inset 0 1px 0 rgba(255,255,255,0.8)',
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
                          height: 36, borderRadius: 1, fontWeight: 800, fontSize: '0.8rem', border: '1px solid',
                          borderColor: selected ? '#FF6B26' : 'divider',
                          bgcolor: selected ? '#FF6B26' : 'background.paper',
                          color: selected ? '#fff' : 'text.primary',
                          boxShadow: selected ? '0 8px 18px rgba(255,107,38,0.24)' : 'none',
                          transition: 'all 180ms ease',
                          '& .MuiChip-label': { px: 1.5 },
                          '&:hover': { bgcolor: selected ? '#FF6B26' : 'action.hover', transform: 'translateY(-1px)' },
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
                '& .MuiOutlinedInput-root': { borderRadius: 1, fontSize: '0.9rem', fontFamily: 'monospace', fontWeight: 800, bgcolor: 'background.paper' } }}
            />
            <Stack direction="row" spacing={1}>
              {UNITS.map((u) => (
                <Box key={u} onClick={() => setCustomUnit(u)} sx={{
                                        height: 40, width: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                                        borderRadius: 1, border: '1px solid',
                                        borderColor: customUnit === u ? '#FF6B26' : 'divider',
                                        bgcolor: customUnit === u ? (isDark ? alpha('#FF6B26', 0.18) : '#eff6ff') : 'background.paper',
                                        color: customUnit === u ? '#FF6B26' : 'text.secondary',
                                        fontWeight: 900, fontSize: '0.85rem', cursor: 'pointer', fontFamily: 'monospace',
                                        transition: 'all 160ms ease',
                                        '&:hover': { borderColor: '#FF6B26', color: '#FF6B26', transform: 'translateY(-1px)' },
                                      }}>
                  {u}
                </Box>
              ))}
            </Stack>
            <Button onClick={() => { if (!customNum) return; setAnalyticsPeriod(`${customNum}${customUnit}`); }}
              variant="contained" size="small" disabled={!customNum}
              sx={{ borderRadius: 1, fontWeight: 800, textTransform: 'none', height: 40, px: 3, boxShadow: '0 8px 18px rgba(255,107,38,0.22)' }}>
              Apply
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Collapse>

    {/* Analytics Cards */}
    <Box sx={{ display: 'grid',
      gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', xl: 'repeat(5, 1fr)' },
      gap: 2 }}>
      {[
        { title: 'Total Users', value: analytics?.total_users ?? '—', caption: 'All registered', icon: <Groups2RoundedIcon /> },
        { title: 'New Users', value: analytics?.new_users?.count ?? '—',
          caption: analytics?.new_users?.growth != null
            ? `${analytics.new_users.growth > 0 ? '+' : ''}${analytics.new_users.growth}% growth`
            : 'vs previous period',
          captionTone: (analytics?.new_users?.growth ?? 0) >= 0 ? 'positive' : 'warning',
          icon: <TrendingUpRoundedIcon /> },
        { title: 'Active Users', value: analytics?.active_users ?? '—', caption: 'Account active', captionTone: 'positive', icon: <CheckCircleOutlineRoundedIcon /> },
        { title: 'Inactive Users', value: analytics?.inactive_users ?? '—', caption: 'Not activated', captionTone: 'warning', icon: <PersonOffOutlinedIcon /> },
        { title: 'Orders Rate', value: analytics?.user_orders_rate != null ? `${analytics.user_orders_rate}%` : '—', caption: 'Users with orders', icon: <TrendingUpRoundedIcon /> },
      ].map((card) =>
        analyticsLoading ? (
          <Skeleton key={card.title} variant="rounded" height={132} sx={{ borderRadius: 2 }} />
        ) : (
          <DashboardMetricCard key={card.title} {...card} />
        )
      )}
    </Box>
  </CardContent>
</Card>
      {/* Summary cards */}
     

   

      {/* Table card */}
      <Card
        elevation={0}
        sx={(theme) => ({
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
          overflow: 'hidden',
        })}
      >
        <CardContent sx={{ p: { xs: 2, md: 3 }, pb: 0 }}>
          <Stack spacing={2.5}>
            {/* Search + actions row */}
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} lg={7}>
                <TextField
                  value={search}
               onChange={(e) => {
  const val = e.target.value;
  setSearch(val);
  setPage(1);
}}      placeholder={t('customers.searchPlaceholder', {
                    defaultValue: 'Search by name',
                  })}
                  fullWidth
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" sx={{ color: 'text.disabled', ml: 0.5 }} />
                      </InputAdornment>
                    ),
                    sx: { borderRadius: 2.5, bgcolor: 'background.paper' }
                  }}
                />
              </Grid>
              <Grid item xs={12} lg={5}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="flex-end">
              
             
                </Stack>
              </Grid>
            </Grid>

            {/* Advanced filters */}
         

            {/* Result count */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ pb: 1 }}>
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {t('customers.overview.showing', {
                  defaultValue: 'Showing {{visible}} of {{total}} customers',
                  visible: customers.length,
total: pagination?.total ?? customers.length,                })}
              </Typography>
             
            </Stack>

            {customers.length === 0 && customers.length > 0 && (
              <Alert severity="info" sx={{ borderRadius: 2.5, mb: 2 }}>
                {t('customers.emptyState', { defaultValue: 'No customers match the current filters.' })}
              </Alert>
            )}
          </Stack>
        </CardContent>

        <CustomersTable
          customers={customers}
          loading={loading}
          onToggleActive={handleToggleActive}
          onDelete={(id) => {
            console.log('Delete - endpoint غير متوفر بعد', id);
          }}
        />
        {pagination && pagination.lastPage > 1 && (
  <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
    <Pagination
      count={pagination.lastPage}
      page={page}
      onChange={(_, val) => setPage(val)}
      color="primary"
      shape="rounded"
    />
  </Box>
)}
      </Card>
    </Stack>
  );
}

export default CustomersPage;