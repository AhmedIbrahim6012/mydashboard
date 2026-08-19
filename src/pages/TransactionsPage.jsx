import { useEffect, useState ,useRef  } from 'react';
import {
  Box, Button, Card, CardContent, Chip, CircularProgress,
  Divider, MenuItem, Skeleton, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography, Pagination,
  Dialog, DialogContent, DialogTitle, IconButton, Collapse, alpha, useTheme
} from '@mui/material';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PageHeader from '../components/PageHeader';
import { useTranslation } from 'react-i18next';
import api from '../utils/axiosInstance';
import { useAppContext } from '../context/AppContext';
import SearchIcon from '@mui/icons-material/Search';
import { Avatar } from '@mui/material';
// ── Helpers ───────────────────────────────────────────
function toUTC3(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr.replace(' ', 'T') + 'Z');
  if (isNaN(date)) return dateStr;
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Riyadh',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false,
  }).format(date);
}

const EMPTY_FILTERS = {
  type: '',
  wallet_type: '',
  provider_id: '',
  date: '',
  date_from: '',
  date_to: '',
};

const typeStyles = {
  charge:     { color: '#10b981', background: '#ecfdf5', darkBackground: '#052e16', border: '#a7f3d0', darkBorder: '#166534', label: 'Charge' },
  refund:     { color: '#f59e0b', background: '#fffbeb', darkBackground: '#2d1b00', border: '#fde68a', darkBorder: '#92400e', label: 'Refund' },
  commission: { color: '#8b5cf6', background: '#f5f3ff', darkBackground: '#1e1040', border: '#ddd6fe', darkBorder: '#5b21b6', label: 'Commission' },
};

function TypeChip({ type }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const style = typeStyles[type] || typeStyles.charge;
  return (
    <Chip
      label={style.label}
      size="small"
      sx={{
        fontWeight: 600,
        borderRadius: '8px',
        backgroundColor: isDark ? style.darkBackground : style.background,
        color: style.color,
        border: `1px solid ${isDark ? style.darkBorder : style.border}`,
        px: 0.5,
      }}
    />
  );
}

// ── Page ─────────────────────────────────────────────
function TransactionsPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const { notify } = useAppContext();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // ── Providers (for filter dropdown) ───────────────
  const [providers, setProviders] = useState([]);
  const [providersLoading, setProvidersLoading] = useState(true);

  // ── Transactions ──────────────────────────────────
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // ── Filters ───────────────────────────────────────
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
// ── Provider Picker (for filter) ──────────────────
const [pickerOpen, setPickerOpen]           = useState(false);
const [pickerProviders, setPickerProviders] = useState([]);
const [pickerPage, setPickerPage]           = useState(1);
const [pickerLastPage, setPickerLastPage]   = useState(1);
const [pickerLoading, setPickerLoading]     = useState(false);
const [pickerSearch, setPickerSearch]       = useState('');
const [pickerSearchResults, setPickerSearchResults] = useState([]);
const [pickerSearchLoading, setPickerSearchLoading] = useState(false);
const [pickerIsSearchMode, setPickerIsSearchMode]   = useState(false);
const pickerSearchRef = useRef(null);

// selected provider object (for display)
const [selectedProvider, setSelectedProvider] = useState(null);
  // ── Transaction Detail Modal ──────────────────────
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // ── Fetch Providers ───────────────────────────────
  useEffect(() => {
    async function fetchProviders() {
      try {
        setProvidersLoading(true);
        const res = await api.get('/admin/provider/all-providers?is_active=1');
        const raw = res.data.data;
        const list = Array.isArray(raw) ? raw : (raw?.data ?? []);
        setProviders(list);
      } catch (err) {
        console.error(err);
      } finally {
        setProvidersLoading(false);
      }
    }
    fetchProviders();
  }, []);

  // ── Fetch Transactions ────────────────────────────
  async function fetchTransactions(p = 1, f = appliedFilters) {
    try {
      setTxLoading(true);
      const params = new URLSearchParams({ page: p });
      if (f.type)        params.append('type', f.type);
      if (f.wallet_type) params.append('wallet_type', f.wallet_type);
      if (f.provider_id) params.append('provider_id', f.provider_id);
      if (f.date)        params.append('date', f.date);
      if (f.date_from)   params.append('date_from', f.date_from);
      if (f.date_to)     params.append('date_to', f.date_to);

      const res = await api.get(`/admin/wallet/transactions?${params.toString()}`);
      const d = res.data.data;
      setTransactions(d.data || []);
      setTotal(d.total || 0);
      setLastPage(d.last_page || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setTxLoading(false);
    }
  }

  useEffect(() => {
    fetchTransactions(page, appliedFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, appliedFilters]);

  // ── Apply / Clear Filters ─────────────────────────
  function handleApplyFilters() {
    setAppliedFilters({ ...filters });
    setPage(1);
  }

  function handleClearFilters() {
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setPage(1);
  }

  const activeFilterCount = Object.values(appliedFilters).filter(Boolean).length;

  // ── Transaction Detail ────────────────────────────
  async function handleViewDetail(txId) {
    try {
      setDetailLoading(true);
      setDetailOpen(true);
      setDetailData(null);
      const res = await api.get(`/admin/wallet/transactions/${txId}`);
      setDetailData(res.data.data);
    } catch (err) {
      console.error(err);
      notify({ severity: 'error', message: 'Failed to load transaction details.' });
    } finally {
      setDetailLoading(false);
    }
  }


  // ── Fetch providers for picker (no active filter) ──
async function fetchPickerProviders(p = 1) {
  try {
    setPickerLoading(true);
    const res = await api.get(`/admin/provider/all-providers?page=${p}`);
    const raw = res.data.data;
    const list = Array.isArray(raw) ? raw : (raw?.data ?? []);
    setPickerProviders(list);
    setPickerPage(raw?.current_page ?? p);
    setPickerLastPage(raw?.last_page ?? 1);
  } catch (err) {
    console.error(err);
  } finally {
    setPickerLoading(false);
  }
}

function handlePickerSearchChange(query) {
  setPickerSearch(query);
  if (pickerSearchRef.current) clearTimeout(pickerSearchRef.current);
  if (!query.trim()) {
    setPickerIsSearchMode(false);
    setPickerSearchResults([]);
    return;
  }
  pickerSearchRef.current = setTimeout(async () => {
    try {
      setPickerSearchLoading(true);
      setPickerIsSearchMode(true);
      const res = await api.get(`/admin/provider/search?query=${encodeURIComponent(query.trim())}`);
      const raw = res.data.data;
      setPickerSearchResults(Array.isArray(raw) ? raw : (raw?.data ?? []));
    } catch (err) {
      console.error(err);
    } finally {
      setPickerSearchLoading(false);
    }
  }, 400);
}

function openProviderPicker() {
  setPickerOpen(true);
  fetchPickerProviders(1);
}

function closeProviderPicker() {
  setPickerOpen(false);
  setPickerSearch('');
  setPickerIsSearchMode(false);
  setPickerSearchResults([]);
}

function selectPickerProvider(provider) {
  setSelectedProvider(provider);
  setFilters((f) => ({ ...f, provider_id: provider.id }));
  closeProviderPicker();
}

function clearPickerProvider() {
  setSelectedProvider(null);
  setFilters((f) => ({ ...f, provider_id: '' }));
}

  // ── Theme tokens ──────────────────────────────────
  const surfaceBg    = isDark ? theme.palette.background.paper : '#ffffff';
  const subtleBg     = isDark ? alpha(theme.palette.common.white, 0.04) : '#f8fafc';
  const borderColor  = isDark ? alpha(theme.palette.common.white, 0.09) : '#e2e8f0';
  const headingColor = theme.palette.text.primary;
  const mutedColor   = theme.palette.text.secondary;

  return (
    <Stack
      spacing={4}
      dir={isRtl ? 'rtl' : 'ltr'}
      sx={{ p: { xs: 1, md: 3 }, bgcolor: 'background.default', minHeight: '100vh' }}
    >
      <PageHeader
        title={t('transactions.title', { defaultValue: 'Transactions' })}
        subtitle={t('transactions.subtitle', { defaultValue: 'View and filter all wallet transactions' })}
      />

      {/* ── Transactions Card ──────────────────────── */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          boxShadow: isDark
            ? '0 4px 20px 0 rgba(0,0,0,0.3)'
            : '0 4px 20px 0 rgba(0,0,0,0.05)',
          bgcolor: surfaceBg,
          border: `1px solid ${borderColor}`,
          overflow: 'hidden',
        }}
      >
        <CardContent sx={{ p: 4 }}>

          {/* Header + Filter Toggle */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            justifyContent="space-between"
            spacing={2}
            sx={{ mb: 3 }}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Box sx={{
                width: 44, height: 44, borderRadius: 2,
                bgcolor: alpha(theme.palette.warning.main, isDark ? 0.2 : 0.1),
                display: 'grid', placeItems: 'center', color: 'warning.dark',
              }}>
                <ReceiptLongIcon />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: headingColor }}>
                  Transactions History
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {total} total records available
                </Typography>
              </Box>
            </Stack>

            <Button
              startIcon={<FilterListIcon />}
              variant={filtersOpen ? 'contained' : 'outlined'}
              onClick={() => setFiltersOpen((v) => !v)}
              size="medium"
              sx={{ borderRadius: 1, fontWeight: 700, textTransform: 'none' }}
            >
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
          </Stack>

          {/* Filter Panel */}
          <Collapse in={filtersOpen}>
            <Box sx={{
              p: 3, borderRadius: 2,
              bgcolor: subtleBg,
              border: `1px solid ${borderColor}`,
              mb: 3,
            }}>
              <Stack spacing={3}>

                <Box>
                  <Typography variant="caption" sx={{
                    fontWeight: 700, color: mutedColor,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    display: 'block', mb: 1.5,
                  }}>
                    Transaction Filters
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      select label="Type" value={filters.type}
                      onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
                      size="small" sx={{ flex: 1 }}
                      variant="filled" InputProps={{ disableUnderline: true, sx: { borderRadius: 2 } }}
                    >
                      <MenuItem value="">All Types</MenuItem>
                      <MenuItem value="charge">💳 Charge</MenuItem>
                      <MenuItem value="refund">↩️ Refund</MenuItem>
                      <MenuItem value="commission">💼 Commission</MenuItem>
                    </TextField>

                    <TextField
                      select label="Wallet Type" value={filters.wallet_type}
                      onChange={(e) => setFilters((f) => ({ ...f, wallet_type: e.target.value }))}
                      size="small" sx={{ flex: 1 }}
                      variant="filled" InputProps={{ disableUnderline: true, sx: { borderRadius: 2 } }}
                    >
                      <MenuItem value="">All Wallets</MenuItem>
                      <MenuItem value="provider">👷 Provider</MenuItem>
                      <MenuItem value="platform_revenue">🏢 Platform Revenue</MenuItem>
                      <MenuItem value="system_cash">💰 System Cash</MenuItem>
                    </TextField>

                  <Box sx={{ flex: 1 }}>
  <Box
    onClick={openProviderPicker}
    sx={{
      px: 2, py: 1.2, borderRadius: 0, cursor: 'pointer',
      bgcolor: isDark ? alpha(theme.palette.common.white, 0.06) : '#f0f4f8',
      border: `1px solid ${selectedProvider ? theme.palette.primary.main : borderColor}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      '&:hover': { borderColor: 'primary.main' },
      transition: 'border-color 0.2s',
      minHeight: 40,
    }}
  >
    <Stack direction="row" spacing={1} alignItems="center">
      {selectedProvider ? (
        <Avatar sx={{
          width: 22, height: 22, fontSize: 10, fontWeight: 700,
          bgcolor: alpha(theme.palette.primary.main, 0.15), color: 'primary.main',
        }}>
          {(selectedProvider.first_name || '').slice(0, 1)}
        </Avatar>
      ) : (
        <SearchIcon sx={{ fontSize: 16, color: mutedColor }} />
      )}
      <Typography variant="body2" sx={{ fontWeight: 600, color: selectedProvider ? headingColor : mutedColor, fontSize: '0.82rem' }}>
        {selectedProvider
          ? `${selectedProvider.first_name || ''} ${selectedProvider.last_name || ''}`.trim()
          : 'All Providers'}
      </Typography>
    </Stack>
    <Stack direction="row" spacing={0.5} alignItems="center">
      {selectedProvider && (
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); clearPickerProvider(); }}
          sx={{ p: 0.3 }}
        >
          <CloseIcon sx={{ fontSize: 14 }} />
        </IconButton>
      )}
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.72rem' }}>
        {selectedProvider ? `#${selectedProvider.id}` : '›'}
      </Typography>
    </Stack>
  </Box>
</Box>
                  </Stack>
                </Box>

                <Divider sx={{ borderColor }} />

                <Box>
                  <Typography variant="caption" sx={{
                    fontWeight: 700, color: mutedColor,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    display: 'block', mb: 1.5,
                  }}>
                    Date Range
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: mutedColor, display: 'block', mb: 0.5, ml: 0.5 }}>
                        Specific Date
                      </Typography>
                      <TextField
                        type="date"
                        value={filters.date}
                        onChange={(e) => setFilters((f) => ({ ...f, date: e.target.value }))}
                        size="small" fullWidth variant="outlined"
  sx={{
      '& .MuiOutlinedInput-root': { borderRadius: 0.8 },
      '& input': {
        color: isDark ? '#FFFFFF' : 'inherit',
      },
      '& input::-webkit-calendar-picker-indicator': {
        filter: isDark ? 'invert(1)' : 'none',
        cursor: 'pointer',
      },
    }}                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: mutedColor, display: 'block', mb: 0.5, ml: 0.5 }}>
                        From
                      </Typography>
                      <TextField
                        type="datetime-local"
                        value={filters.date_from}
                        onChange={(e) => setFilters((f) => ({ ...f, date_from: e.target.value }))}
                        size="small" fullWidth variant="outlined"
  sx={{
      '& .MuiOutlinedInput-root': { borderRadius: 0.8 },
      '& input': {
        color: isDark ? '#FFFFFF' : 'inherit',
      },
      '& input::-webkit-calendar-picker-indicator': {
        filter: isDark ? 'invert(1)' : 'none',
        cursor: 'pointer',
      },
    }}                      />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="caption" sx={{ fontWeight: 600, color: mutedColor, display: 'block', mb: 0.5, ml: 0.5 }}>
                        To
                      </Typography>
                      <TextField
                        type="datetime-local"
                        value={filters.date_to}
                        onChange={(e) => setFilters((f) => ({ ...f, date_to: e.target.value }))}
                        size="small" fullWidth variant="outlined"
  sx={{
      '& .MuiOutlinedInput-root': { borderRadius: 0.8 },
      '& input': {
        color: isDark ? '#FFFFFF' : 'inherit',
      },
      '& input::-webkit-calendar-picker-indicator': {
        filter: isDark ? 'invert(1)' : 'none',
        cursor: 'pointer',
      },
    }}                      />
                    </Box>
                  </Stack>
                </Box>

                <Divider sx={{ borderColor }} />

                <Stack direction="row" spacing={1.5}>
                  <Button
                    variant="contained" size="small"
                    onClick={handleApplyFilters}
                    sx={{ borderRadius: 0.5, fontWeight: 700, px: 3, textTransform: 'none' }}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="outlined" size="small"
                    onClick={handleClearFilters}
                    sx={{ borderRadius: 0.5, fontWeight: 700, px: 3, textTransform: 'none', bgcolor: surfaceBg }}
                  >
                    Clear All
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Collapse>

          {/* Table */}
          {txLoading ? (
            <Stack spacing={1.5}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} variant="rounded" height={60} sx={{ borderRadius: 2 }} />
              ))}
            </Stack>
          ) : transactions.length === 0 ? (
            <Box sx={{
              py: 8, textAlign: 'center',
              bgcolor: subtleBg, borderRadius: 4,
              border: `1px dashed ${borderColor}`,
            }}>
              <ReceiptLongIcon sx={{ fontSize: 54, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: headingColor }}>No transactions found</Typography>
              <Typography variant="body2" color="text.secondary">Try adjusting your filters or search criteria.</Typography>
            </Box>
          ) : (
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: subtleBg }}>
                    {[
                      // '#',
                     'Transaction No.', 'Amount', 'Type', 'Notes', 'Date', 'Actions'].map((h, i) => (
                      <TableCell
                        key={i}
                        sx={{
                          fontWeight: 700, color: mutedColor,
                          fontSize: '0.85rem', py: 2,
                          borderBottom: `1px solid ${borderColor}`,
                        }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((tx) => (
                    <TableRow
                      key={tx.id}
                      hover
                      sx={{ '&:last-child td': { border: 0 }, transition: 'background 0.2s' }}
                    >
                      {/* <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem', fontWeight: 600 }}>{tx.id}</TableCell> */}
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: headingColor }}>
                          {tx.transaction_number}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#10b981' }}>
                          {Number(tx.amount).toFixed(2)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <TypeChip type={tx.type} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 220, fontWeight: 500 }}>
                          {tx.notes || '—'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                          {toUTC3(tx.transaction_date)}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={() => handleViewDetail(tx.id)}
                          sx={{
                            color: 'primary.main',
                            bgcolor: isDark ? alpha(theme.palette.primary.main, 0.15) : '#f0f7ff',
                            '&:hover': { bgcolor: isDark ? alpha(theme.palette.primary.main, 0.25) : '#e0effe' },
                            borderRadius: 1.5,
                          }}
                        >
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination */}
          {!txLoading && transactions.length > 0 && (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
              sx={{ mt: 3, pt: 2, borderTop: `1px solid ${borderColor}` }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Showing <b>{transactions.length}</b> of <b>{total}</b> transactions
              </Typography>
              {lastPage > 1 && (
                <Pagination
                  count={lastPage} page={page}
                  onChange={(_, v) => setPage(v)}
                  color="primary" shape="rounded" size="medium"
                  sx={{ '& .MuiPaginationItem-root': { fontWeight: 700, borderRadius: 1.5 } }}
                />
              )}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* ── Transaction Detail Modal ───────────────── */}
      <Dialog
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        maxWidth="sm" fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4,
            backgroundImage: 'none',
            bgcolor: surfaceBg,
            border: `1px solid ${borderColor}`,
            boxShadow: isDark
              ? '0 20px 25px -5px rgba(0,0,0,0.5)'
              : '0 20px 25px -5px rgba(0,0,0,0.1)',
          },
        }}
      >
        <DialogTitle sx={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          fontWeight: 800, pb: 2, pt: 3, color: headingColor,
        }}>
          Transaction Details
          <IconButton
            onClick={() => setDetailOpen(false)}
            sx={{ bgcolor: subtleBg, border: `1px solid ${borderColor}` }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <Divider sx={{ borderColor }} />

        <DialogContent sx={{ p: 4 }}>
          {detailLoading ? (
            <Stack spacing={2} sx={{ py: 2 }}>
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} variant="rounded" height={60} sx={{ borderRadius: 2 }} />
              ))}
            </Stack>
          ) : detailData ? (
            <Stack spacing={3.5}>

              {/* Main Info */}
              <Box sx={{ p: 3, borderRadius: 3, bgcolor: subtleBg, border: `1px solid ${borderColor}` }}>
                <Stack spacing={2}>
                  {[
                    { label: 'Transaction #', value: detailData.transaction_number, isMono: true },
                    { label: 'Amount = ',         value: `${Number(detailData.amount).toFixed(2)}`, isBold: true },
                    { label: 'Date : ',           value: toUTC3(detailData.transaction_date) },
                    { label: 'Notes  : ',          value: detailData.notes || '—' },
                    // { label: 'Order ID : ',       value: detailData.order_id || '—', isMono: true },
                  ].map(({ label, value, isMono, isBold }) => (
                    <Stack key={label} direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>{label}</Typography>
                      <Typography variant="body2" sx={{
                        fontWeight: (isBold || isMono) ? 800 : 600,
                        fontFamily: isMono ? 'monospace' : 'inherit',
                        color: isBold ? '#10b981' : headingColor,
                      }}>
                        {value}
                      </Typography>
                    </Stack>
                  ))}
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>Type</Typography>
                    <TypeChip type={detailData.type} />
                  </Stack>
                </Stack>
              </Box>

              {/* Ledger Entries */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 800, color: headingColor, mb: 2, px: 0.5 }}>
                  Ledger Entries
                </Typography>
                <Stack spacing={1.5}>
                  {detailData.ledger_entries?.map((entry) => (
                    <Box
                      key={entry.id}
                      sx={{
                        p: 2.5, borderRadius: 3,
                        bgcolor: surfaceBg,
                        border: `1px solid ${borderColor}`,
                        borderLeft: `5px solid ${entry.type === 'DEBIT' ? theme.palette.error.main : theme.palette.success.main}`,
                        boxShadow: isDark ? 'none' : '0 2px 4px 0 rgba(0,0,0,0.02)',
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack spacing={0.5}>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: headingColor }}>
                            Wallet #{entry.wallet_id}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                            {toUTC3(entry.entry_date)}
                          </Typography>
                        </Stack>
                        <Stack alignItems="flex-end" spacing={1}>
                          <Chip
                            label={entry.type}
                            size="small"
                            color={entry.type === 'DEBIT' ? 'error' : 'success'}
                            sx={{ fontWeight: 700, borderRadius: '6px', fontSize: '0.7rem' }}
                          />
                          <Typography variant="body2" sx={{
                            fontWeight: 800,
                            color: entry.type === 'DEBIT' ? 'error.main' : 'success.main',
                          }}>
                            {Number(entry.amount).toFixed(2)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              </Box>

            </Stack>
          ) : null}
        </DialogContent>
      </Dialog>
      {/* ── Provider Picker Dialog ────────────────────── */}
<Dialog
  open={pickerOpen}
  onClose={closeProviderPicker}
  maxWidth="xs"
  fullWidth
  PaperProps={{
    sx: {
      borderRadius: 4, backgroundImage: 'none',
      bgcolor: surfaceBg, border: `1px solid ${borderColor}`,
      boxShadow: isDark ? '0 20px 25px -5px rgba(0,0,0,0.5)' : '0 20px 25px -5px rgba(0,0,0,0.1)',
    },
  }}
>
  <DialogTitle sx={{
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    fontWeight: 800, pb: 2, pt: 3, color: headingColor,
  }}>
    Select Provider
    <IconButton onClick={closeProviderPicker} size="small" sx={{ bgcolor: subtleBg, border: `1px solid ${borderColor}` }}>
      <CloseIcon fontSize="small" />
    </IconButton>
  </DialogTitle>

  <Divider sx={{ borderColor }} />

  <DialogContent sx={{ p: 2.5 }}>
    <Stack spacing={2}>
      {/* Search */}
      <TextField
        placeholder="Search by name..."
        value={pickerSearch}
        onChange={(e) => handlePickerSearchChange(e.target.value)}
        size="small" fullWidth autoFocus variant="filled"
        InputProps={{
          disableUnderline: true,
          sx: { borderRadius: 2 },
          startAdornment: <SearchIcon sx={{ fontSize: 18, color: mutedColor, mr: 1 }} />,
          endAdornment: pickerSearchLoading ? <CircularProgress size={16} /> : null,
        }}
      />

      {/* List */}
      <Stack spacing={0.5} sx={{ maxHeight: 340, overflowY: 'auto', pr: 0.5 }}>
        {pickerLoading ? (
          [1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" height={48} sx={{ borderRadius: 2 }} />)
        ) : (pickerIsSearchMode ? pickerSearchResults : pickerProviders).length === 0 ? (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {pickerIsSearchMode ? 'No providers found' : 'No providers available'}
            </Typography>
          </Box>
        ) : (
          (pickerIsSearchMode ? pickerSearchResults : pickerProviders).map((p) => {
            const name = `${p.first_name || ''} ${p.last_name || ''}`.trim() || `Provider #${p.id}`;
            const isSelected = p.id === filters.provider_id;
            return (
              <Box
                key={p.id}
                onClick={() => selectPickerProvider(p)}
                sx={{
                  p: 1.5, borderRadius: 2, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  bgcolor: isSelected ? alpha(theme.palette.primary.main, isDark ? 0.2 : 0.08) : 'transparent',
                  border: `1px solid ${isSelected ? theme.palette.primary.main : 'transparent'}`,
                  '&:hover': { bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.12) : subtleBg },
                  transition: 'all 0.15s',
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{
                    width: 32, height: 32, fontSize: 12, fontWeight: 700,
                    bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.common.white, isDark ? 0.08 : 0),
                    color: isSelected ? 'primary.main' : mutedColor,
                    border: `1px solid ${isSelected ? theme.palette.primary.main : borderColor}`,
                  }}>
                    {(p.first_name || '').slice(0, 1)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: headingColor, lineHeight: 1.3 }}>
                      {name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: mutedColor, fontSize: '0.72rem' }}>
                      {/* ID #{p.id} */}
                       Phone :  {p.phone || '—'}
                    </Typography>
                  </Box>
                </Stack>
                {isSelected && (
                  <Box sx={{
                    width: 20, height: 20, borderRadius: '50%', bgcolor: 'primary.main',
                    display: 'grid', placeItems: 'center', flexShrink: 0,
                  }}>
                    <Typography sx={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>✓</Typography>
                  </Box>
                )}
              </Box>
            );
          })
        )}
      </Stack>

      {/* Pagination */}
      {!pickerIsSearchMode && pickerLastPage > 1 && (
        <>
          <Divider sx={{ borderColor }} />
          <Stack direction="row" justifyContent="center">
            <Pagination
              count={pickerLastPage} page={pickerPage} size="small"
              onChange={(_, v) => fetchPickerProviders(v)}
              color="primary" shape="rounded" disabled={pickerLoading}
            />
          </Stack>
        </>
      )}
    </Stack>
  </DialogContent>
</Dialog>
    </Stack>
  );
}

export default TransactionsPage;