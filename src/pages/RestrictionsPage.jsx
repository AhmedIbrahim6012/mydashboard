import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Box, Button, Card, CardContent, Chip, CircularProgress,
  Divider, MenuItem, Skeleton, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography, Pagination,
  Dialog, DialogContent, DialogTitle, IconButton, Collapse, alpha, useTheme,
  Alert, Tooltip, Avatar,
} from '@mui/material';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SearchIcon from '@mui/icons-material/Search';
import PageHeader from '../components/PageHeader';
import { useTranslation } from 'react-i18next';
import { fetchRestrictions, liftRestriction } from '../services/restrictionsService';
import { useAppContext } from '../context/AppContext';
import api from '../utils/axiosInstance';

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

function isExpired(expiresAt) {
  return expiresAt ? new Date(expiresAt) < new Date() : false;
}

function getStatus(r) {
  if (r.lifted_at) return { key: 'lifted', label: 'Lifted' };
  if (isExpired(r.expires_at)) return { key: 'expired', label: 'Expired' };
  return { key: 'active', label: 'Active' };
}

const EMPTY_FILTERS = {
  account_type: '',
  account_id: '',
  type: '',
  scope: '',
};

const ACCOUNT_TYPES = ['user', 'provider', 'admin'];
const TYPES = ['ban', 'suspend', 'warning', 'limit'];
const SCOPES = ['orders', 'services', 'reviews', 'chat', 'notifications', 'offers'];

// Endpoints used by the account picker dialog (provider / user search)
const PICKER_ENDPOINTS = {
  provider: { list: '/admin/provider/all-providers', search: '/admin/provider/search' },
  user:     { list: '/admin/user/all-users',         search: '/admin/user/search' },
};

// Decide which domain the account picker searches in.
// - account_type === 'provider'  -> search providers
// - anything else ('', 'user', 'admin') -> default to searching users
//   ('admin' is intentionally NOT given its own search mode: the system
//   currently supports a single admin only, so the field is hidden for it)
function getEffectivePickerMode(accountType) {
  return accountType === 'provider' ? 'provider' : 'user';
}

const typeStyles = {
  ban:     { color: '#ef4444', background: '#fef2f2', darkBackground: '#2d0a0a', border: '#fecaca', darkBorder: '#7f1d1d', label: 'Ban' },
  suspend: { color: '#8b5cf6', background: '#f5f3ff', darkBackground: '#1e1040', border: '#ddd6fe', darkBorder: '#5b21b6', label: 'Suspend' },
  warning: { color: '#f59e0b', background: '#fffbeb', darkBackground: '#2d1b00', border: '#fde68a', darkBorder: '#92400e', label: 'Warning' },
  limit:   { color: '#0284c7', background: '#f0f9ff', darkBackground: '#082f49', border: '#bae6fd', darkBorder: '#075985', label: 'Limit' },
};

const statusStyles = {
  active: { color: '#f59e0b', background: '#fffbeb', darkBackground: '#2d1b00', border: '#fde68a', darkBorder: '#92400e', label: 'Active' },
  lifted: { color: '#10b981', background: '#ecfdf5', darkBackground: '#052e16', border: '#a7f3d0', darkBorder: '#166534', label: 'Lifted' },
  expired:{ color: '#64748b', background: '#f1f5f9', darkBackground: '#1e293b', border: '#cbd5e1', darkBorder: '#334155', label: 'Expired' },
};

function TypeChip({ type }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const style = typeStyles[type] || typeStyles.ban;
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

function StatusChip({ statusKey }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const style = statusStyles[statusKey] || statusStyles.active;
  return (
    <Chip
      label={style.label}
      size="small"
      sx={{
        fontWeight: 700,
        borderRadius: '8px',
        backgroundColor: isDark ? style.darkBackground : style.background,
        color: style.color,
        border: `1px solid ${isDark ? style.darkBorder : style.border}`,
        px: 0.5,
      }}
    />
  );
}

// ── Detail Row (for View dialog) ──────────────────────
function DetailRow({ label, value, valueColor }) {
  return (
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, flexShrink: 0 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 700, color: valueColor || 'text.primary', textAlign: 'right', wordBreak: 'break-word' }}>
        {value}
      </Typography>
    </Stack>
  );
}

// ── Page ─────────────────────────────────────────────
function RestrictionsPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const { notify } = useAppContext();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // ── Restrictions ──────────────────────────────────
  const [restrictions, setRestrictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // ── Filters ───────────────────────────────────────
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // ── Lift dialog ───────────────────────────────────
  const [liftTarget, setLiftTarget] = useState(null);
  const [liftReason, setLiftReason] = useState('');
  const [liftSubmitting, setLiftSubmitting] = useState(false);
  const [liftError, setLiftError] = useState(null);

  // ── View (details) dialog ──────────────────────────
  const [viewOpen, setViewOpen] = useState(false);
  const [viewTarget, setViewTarget] = useState(null);

  // ── Account Picker (provider / user search for Account) ──
  const [selectedAccount, setSelectedAccount] = useState(null); // { id, name }
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerMode, setPickerMode] = useState('user'); // 'provider' | 'user'
  const [pickerList, setPickerList] = useState([]);
  const [pickerPage, setPickerPage] = useState(1);
  const [pickerLastPage, setPickerLastPage] = useState(1);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerSearchResults, setPickerSearchResults] = useState([]);
  const [pickerSearchLoading, setPickerSearchLoading] = useState(false);
  const [pickerIsSearchMode, setPickerIsSearchMode] = useState(false);
  const pickerSearchRef = useRef(null);

  // ── Fetch Restrictions ────────────────────────────
  const loadRestrictions = useCallback(async (p = 1, f = appliedFilters) => {
    try {
      setLoading(true);
      // IMPORTANT: only pass a key when it actually has a value.
      // If f.account_type is '' -> we intentionally omit accountType entirely
      // so the backend returns ALL account types (no default should ever be
      // injected here or inside fetchRestrictions()).
      const params = { page: p };
      if (f.account_type) params.accountType = f.account_type;
      if (f.account_id)   params.accountId = Number(f.account_id);
      if (f.type)          params.type = f.type;
      if (f.scope)          params.scope = f.scope;

      const result = await fetchRestrictions(params);
      setRestrictions(result.data ?? []);
      setTotal(result.total ?? 0);
      setLastPage(result.last_page ?? 1);
      setPage(result.current_page ?? p);
    } catch (err) {
      console.error(err);
      notify({ severity: 'error', message: 'Failed to load restrictions.' });
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters]);

  useEffect(() => {
    loadRestrictions(page, appliedFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, appliedFilters]);

  // ── Account Picker helpers ─────────────────────────
  async function fetchPickerList(mode, p = 1) {
    const endpoint = PICKER_ENDPOINTS[mode]?.list;
    if (!endpoint) return;
    try {
      setPickerLoading(true);
      const res = await api.get(`${endpoint}?page=${p}`);
      const raw = res.data.data;
      const list = Array.isArray(raw) ? raw : (raw?.data ?? []);
      setPickerList(list);
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
      const endpoint = PICKER_ENDPOINTS[pickerMode]?.search;
      if (!endpoint) return;
      try {
        setPickerSearchLoading(true);
        setPickerIsSearchMode(true);
        const res = await api.get(`${endpoint}?query=${encodeURIComponent(query.trim())}`);
        const raw = res.data.data;
        setPickerSearchResults(Array.isArray(raw) ? raw : (raw?.data ?? []));
      } catch (err) {
        console.error(err);
      } finally {
        setPickerSearchLoading(false);
      }
    }, 400);
  }

  function openAccountPicker() {
    // Admin has no picker — system supports a single admin only
    if (filters.account_type === 'admin') return;
    const mode = getEffectivePickerMode(filters.account_type); // '' or 'user' -> user, 'provider' -> provider
    setPickerMode(mode);
    setPickerOpen(true);
    setPickerSearch('');
    setPickerIsSearchMode(false);
    setPickerSearchResults([]);
    fetchPickerList(mode, 1);
  }

  function closeAccountPicker() {
    setPickerOpen(false);
    setPickerSearch('');
    setPickerIsSearchMode(false);
    setPickerSearchResults([]);
  }

  function selectPickerAccount(account) {
    const name = `${account.first_name || ''} ${account.last_name || ''}`.trim() || `#${account.id}`;
    setSelectedAccount({ id: account.id, name });
    // Sync the Account Type dropdown with whichever domain was actually searched
    setFilters((f) => ({ ...f, account_type: pickerMode, account_id: account.id }));
    closeAccountPicker();
  }

  function clearSelectedAccount() {
    setSelectedAccount(null);
    setFilters((f) => ({ ...f, account_id: '' }));
  }

  function handleAccountTypeChange(newType) {
    setFilters((f) => ({ ...f, account_type: newType, account_id: '' }));
    setSelectedAccount(null);
  }

  // ── Apply / Clear Filters ─────────────────────────
  function handleApplyFilters() {
    setAppliedFilters({ ...filters });
    setPage(1);
  }

  function handleClearFilters() {
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setSelectedAccount(null);
    setPage(1);
  }

  const activeFilterCount = Object.values(appliedFilters).filter(Boolean).length;

  // ── Lift Restriction ──────────────────────────────
  function openLiftDialog(id) {
    setLiftTarget(id);
    setLiftReason('');
    setLiftError(null);
  }

  function closeLiftDialog() {
    setLiftTarget(null);
    setLiftReason('');
    setLiftError(null);
  }

  async function handleLiftSubmit() {
    setLiftSubmitting(true);
    setLiftError(null);
    try {
      await liftRestriction({ restrictionId: liftTarget, liftReason });
      notify({ severity: 'success', message: 'Restriction lifted successfully.' });
      closeLiftDialog();
      loadRestrictions(page, appliedFilters);
    } catch (err) {
      const data = err?.response?.data;
      const messages = data?.errors ? Object.values(data.errors).flat().join(' — ') : null;
      setLiftError(messages || data?.message || err.message || 'Something went wrong');
    } finally {
      setLiftSubmitting(false);
    }
  }

  // ── View Restriction Details ──────────────────────
  function openViewDialog(record) {
    setViewTarget(record);
    setViewOpen(true);
  }

  function closeViewDialog() {
    setViewOpen(false);
    setViewTarget(null);
  }

  // ── Theme tokens ──────────────────────────────────
  const surfaceBg    = isDark ? theme.palette.background.paper : '#ffffff';
  const subtleBg     = isDark ? alpha(theme.palette.common.white, 0.04) : '#f8fafc';
  const borderColor  = isDark ? alpha(theme.palette.common.white, 0.09) : '#e2e8f0';
  const headingColor = theme.palette.text.primary;
  const mutedColor   = theme.palette.text.secondary;

  const isAdminSelected = filters.account_type === 'admin';
  const viewStatus = viewTarget ? getStatus(viewTarget) : null;

  return (
    <Stack
      spacing={4}
      dir={isRtl ? 'rtl' : 'ltr'}
      sx={{ p: { xs: 1, md: 3 }, bgcolor: 'background.default', minHeight: '100vh' }}
    >
      <PageHeader
        title={t('restrictions.title', { defaultValue: 'Restrictions' })}
        subtitle={t('restrictions.subtitle', { defaultValue: 'Browse and manage all account restrictions' })}
      />

      {/* ── Restrictions Card ──────────────────────── */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
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
                width: 44, height: 44, borderRadius: 2.5,
                bgcolor: alpha(theme.palette.error.main, isDark ? 0.2 : 0.1),
                display: 'grid', placeItems: 'center', color: 'error.dark',
              }}>
                <GavelRoundedIcon />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: headingColor }}>
                  Restrictions
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
              sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
            >
              Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
          </Stack>

          {/* Filter Panel */}
          <Collapse in={filtersOpen}>
            <Box sx={{
              p: 3, borderRadius: 3,
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
                    Restriction Filters
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      select label="Account Type" value={filters.account_type}
                      onChange={(e) => handleAccountTypeChange(e.target.value)}
                      size="small" sx={{ flex: 1 }}
                      variant="filled" InputProps={{ disableUnderline: true, sx: { borderRadius: 2 } }}
                    >
                      <MenuItem value="">All Account Types</MenuItem>
                      {ACCOUNT_TYPES.map((v) => (
                        <MenuItem key={v} value={v}>{v}</MenuItem>
                      ))}
                    </TextField>

                    {/* Account search — always defaults to searching users unless "provider" is
                        explicitly selected. Hidden for "admin": the system supports a single
                        admin only, so there is nothing meaningful to search for. */}
                    {!isAdminSelected && (
                      <Box sx={{ flex: 1 }}>
                        <Box
                          onClick={openAccountPicker}
                          sx={{
                            px: 2, py: 1.2, borderRadius: 0, cursor: 'pointer',
                            bgcolor: isDark ? alpha(theme.palette.common.white, 0.06) : '#f0f4f8',
                            border: `1px solid ${selectedAccount ? theme.palette.primary.main : borderColor}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            '&:hover': { borderColor: 'primary.main' },
                            transition: 'border-color 0.2s',
                            minHeight: 40,
                          }}
                        >
                          <Stack direction="row" spacing={1} alignItems="center">
                            {selectedAccount ? (
                              <Avatar sx={{
                                width: 22, height: 22, fontSize: 10, fontWeight: 700,
                                bgcolor: alpha(theme.palette.primary.main, 0.15), color: 'primary.main',
                              }}>
                                {selectedAccount.name.slice(0, 1)}
                              </Avatar>
                            ) : (
                              <SearchIcon sx={{ fontSize: 16, color: mutedColor }} />
                            )}
                            <Typography variant="body2" sx={{ fontWeight: 600, color: selectedAccount ? headingColor : mutedColor, fontSize: '0.82rem' }}>
                              {selectedAccount
                                ? selectedAccount.name
                                : `Search ${getEffectivePickerMode(filters.account_type) === 'provider' ? 'Provider' : 'User'}...`}
                            </Typography>
                          </Stack>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            {selectedAccount && (
                              <IconButton
                                size="small"
                                onClick={(e) => { e.stopPropagation(); clearSelectedAccount(); }}
                                sx={{ p: 0.3 }}
                              >
                                <CloseIcon sx={{ fontSize: 14 }} />
                              </IconButton>
                            )}
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.72rem' }}>
                              {selectedAccount ? `#${selectedAccount.id}` : '›'}
                            </Typography>
                          </Stack>
                        </Box>
                      </Box>
                    )}

                    <TextField
                      select label="Type" value={filters.type}
                      onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
                      size="small" sx={{ flex: 1 }}
                      variant="filled" InputProps={{ disableUnderline: true, sx: { borderRadius: 2 } }}
                    >
                      <MenuItem value="">All Types</MenuItem>
                      {TYPES.map((v) => (
                        <MenuItem key={v} value={v}>{typeStyles[v]?.label ?? v}</MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      select label="Scope" value={filters.scope}
                      onChange={(e) => setFilters((f) => ({ ...f, scope: e.target.value }))}
                      size="small" sx={{ flex: 1 }}
                      variant="filled" InputProps={{ disableUnderline: true, sx: { borderRadius: 2 } }}
                    >
                      <MenuItem value="">All Scopes</MenuItem>
                      {SCOPES.map((v) => (
                        <MenuItem key={v} value={v}>{v}</MenuItem>
                      ))}
                    </TextField>
                  </Stack>
                </Box>

                <Divider sx={{ borderColor }} />

                <Stack direction="row" spacing={1.5}>
                  <Button
                    variant="contained" size="small"
                    onClick={handleApplyFilters}
                    sx={{ borderRadius: 2, fontWeight: 700, px: 3, textTransform: 'none' }}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="outlined" size="small"
                    onClick={handleClearFilters}
                    sx={{ borderRadius: 2, fontWeight: 700, px: 3, textTransform: 'none', bgcolor: surfaceBg }}
                  >
                    Clear All
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Collapse>

          {/* Table */}
          {loading ? (
            <Stack spacing={1.5}>
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} variant="rounded" height={60} sx={{ borderRadius: 2 }} />
              ))}
            </Stack>
          ) : restrictions.length === 0 ? (
            <Box sx={{
              py: 8, textAlign: 'center',
              bgcolor: subtleBg, borderRadius: 4,
              border: `1px dashed ${borderColor}`,
            }}>
              <GavelRoundedIcon sx={{ fontSize: 54, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: headingColor }}>No restrictions found</Typography>
              <Typography variant="body2" color="text.secondary">Try adjusting your filters.</Typography>
            </Box>
          ) : (
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 780 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: subtleBg }}>
                    {['#', 'Account', 'Type', 'Scope', 'Reason', 'Status', 'Expires At', 'Created At', 'Actions'].map((h, i) => (
                      <TableCell
                        key={i}
                        align={h === 'Actions' ? 'right' : 'left'}
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
                  {restrictions.map((r) => {
                    const status = getStatus(r);
                    const canLift = status.key === 'active';
                    return (
                      <TableRow
                        key={r.id}
                        hover
                        sx={{ '&:last-child td': { border: 0 }, transition: 'background 0.2s' }}
                      >
                        <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem', fontWeight: 600 }}>{r.id}</TableCell>
                        <TableCell>
                          <Chip
                            label={r.account_type}
                            size="small"
                            variant="outlined"
                            sx={{ borderRadius: '8px', textTransform: 'capitalize', fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>
                          <TypeChip type={r.type} />
                        </TableCell>
                        <TableCell>
                          <Chip label={r.scope} size="small" variant="outlined" sx={{ borderRadius: '8px' }} />
                        </TableCell>
                        <TableCell sx={{ maxWidth: 220 }}>
                          <Tooltip title={r.reason || ''}>
                            <Typography variant="body2" color="text.secondary" noWrap sx={{ fontWeight: 500 }}>
                              {r.reason || '—'}
                            </Typography>
                          </Tooltip>
                        </TableCell>
                        <TableCell>
                          <StatusChip statusKey={status.key} />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                            {r.expires_at ? toUTC3(r.expires_at) : '—'}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                            {toUTC3(r.created_at)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Stack direction="row" spacing={1} justifyContent="flex-end">
                            <IconButton
                              size="small"
                              onClick={() => openViewDialog(r)}
                              sx={{
                                color: 'primary.main',
                                bgcolor: isDark ? alpha(theme.palette.primary.main, 0.15) : '#f0f7ff',
                                '&:hover': { bgcolor: isDark ? alpha(theme.palette.primary.main, 0.25) : '#e0effe' },
                                borderRadius: 1.5,
                              }}
                            >
                              <VisibilityOutlinedIcon fontSize="small" />
                            </IconButton>
                            {canLift && (
                              <Button
                                size="small" variant="outlined" color="success"
                                startIcon={<LockOpenRoundedIcon fontSize="small" />}
                                onClick={() => openLiftDialog(r.id)}
                                sx={{ borderRadius: 1.5, fontWeight: 700, textTransform: 'none' }}
                              >
                                Lift
                              </Button>
                            )}
                          </Stack>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination */}
          {!loading && restrictions.length > 0 && (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
              sx={{ mt: 3, pt: 2, borderTop: `1px solid ${borderColor}` }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                Showing <b>{restrictions.length}</b> of <b>{total}</b> restrictions
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

      {/* ── Lift Restriction Dialog ───────────────────── */}
      <Dialog
        open={Boolean(liftTarget)}
        onClose={closeLiftDialog}
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
          Lift Restriction
          <IconButton
            onClick={closeLiftDialog}
            sx={{ bgcolor: subtleBg, border: `1px solid ${borderColor}` }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <Divider sx={{ borderColor }} />

        <DialogContent sx={{ p: 4 }}>
          <Stack spacing={2.5}>
            {liftError && <Alert severity="error">{liftError}</Alert>}
            <TextField
              label="Lift reason"
              value={liftReason}
              onChange={(e) => setLiftReason(e.target.value)}
              fullWidth multiline minRows={3}
              variant="outlined"
              sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
            />
            <Stack direction="row" spacing={1.5} justifyContent="flex-end">
              <Button onClick={closeLiftDialog} disabled={liftSubmitting} sx={{ textTransform: 'none', fontWeight: 700 }}>
                Cancel
              </Button>
              <Button
                onClick={handleLiftSubmit}
                variant="contained" color="success"
                disabled={liftSubmitting || !liftReason}
                sx={{ borderRadius: 2, fontWeight: 700, px: 3, textTransform: 'none' }}
              >
                {liftSubmitting ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Confirm'}
              </Button>
            </Stack>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* ── View Restriction Details Dialog ───────────── */}
      <Dialog
        open={viewOpen}
        onClose={closeViewDialog}
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
          Restriction Details
          <IconButton
            onClick={closeViewDialog}
            sx={{ bgcolor: subtleBg, border: `1px solid ${borderColor}` }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <Divider sx={{ borderColor }} />

        <DialogContent sx={{ p: 4 }}>
          {viewTarget && (
            <Stack spacing={3}>

              {/* Top chips */}
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <TypeChip type={viewTarget.type} />
                <StatusChip statusKey={viewStatus.key} />
                <Chip label={viewTarget.account_type} size="small" variant="outlined" sx={{ borderRadius: '8px', textTransform: 'capitalize', fontWeight: 600 }} />
                <Chip label={viewTarget.scope} size="small" variant="outlined" sx={{ borderRadius: '8px' }} />
              </Stack>

              {/* Core info */}
              <Box sx={{ p: 3, borderRadius: 3, bgcolor: subtleBg, border: `1px solid ${borderColor}` }}>
                <Stack spacing={1.75}>
                  <DetailRow label="Restriction #" value={viewTarget.id} />
                  <DetailRow label="Account" value={`${viewTarget.account_type} · #${viewTarget.account_id}`} />
                  <DetailRow label="Restricted By" value={viewTarget.restricted_by ? `Admin #${viewTarget.restricted_by}` : '—'} />
                  <DetailRow label="Reason" value={viewTarget.reason || '—'} />
                  <DetailRow label="Created At" value={toUTC3(viewTarget.created_at)} />
                  <DetailRow label="Expires At" value={viewTarget.expires_at ? toUTC3(viewTarget.expires_at) : 'Never'} />
                </Stack>
              </Box>

              {/* Lift info — only relevant once the restriction was lifted */}
              {viewTarget.lifted_at && (
                <Box sx={{
                  p: 3, borderRadius: 3,
                  bgcolor: isDark ? alpha(theme.palette.success.main, 0.08) : '#ecfdf5',
                  border: `1px solid ${isDark ? alpha(theme.palette.success.main, 0.3) : '#a7f3d0'}`,
                }}>
                  <Typography variant="caption" sx={{
                    fontWeight: 700, color: 'success.main',
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    display: 'block', mb: 1.5,
                  }}>
                    Lift Information
                  </Typography>
                  <Stack spacing={1.75}>
                    <DetailRow label="Lifted At" value={toUTC3(viewTarget.lifted_at)} />
                    <DetailRow label="Lifted By" value={viewTarget.lifted_by ? `Admin #${viewTarget.lifted_by}` : '—'} />
                    <DetailRow label="Lift Reason" value={viewTarget.lift_reason || '—'} />
                  </Stack>
                </Box>
              )}
            </Stack>
          )}
        </DialogContent>
      </Dialog>

      {/* ── Account Picker Dialog (Provider / User) ───── */}
      <Dialog
        open={pickerOpen}
        onClose={closeAccountPicker}
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
          {pickerMode === 'provider' ? 'Select Provider' : 'Select User'}
          <IconButton onClick={closeAccountPicker} size="small" sx={{ bgcolor: subtleBg, border: `1px solid ${borderColor}` }}>
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
              ) : (pickerIsSearchMode ? pickerSearchResults : pickerList).length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {pickerIsSearchMode ? 'No results found' : 'No records available'}
                  </Typography>
                </Box>
              ) : (
                (pickerIsSearchMode ? pickerSearchResults : pickerList).map((acc) => {
                  const name = `${acc.first_name || ''} ${acc.last_name || ''}`.trim() || `#${acc.id}`;
                  const isSelected = acc.id === filters.account_id;
                  return (
                    <Box
                      key={acc.id}
                      onClick={() => selectPickerAccount(acc)}
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
                          {(acc.first_name || '').slice(0, 1)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: headingColor, lineHeight: 1.3 }}>
                            {name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: mutedColor, fontSize: '0.72rem' }}>
                            ID #{acc.id} · {acc.phone || acc.email || '—'}
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

            {/* Pagination (only in "list all" mode, not while searching) */}
            {!pickerIsSearchMode && pickerLastPage > 1 && (
              <>
                <Divider sx={{ borderColor }} />
                <Stack direction="row" justifyContent="center">
                  <Pagination
                    count={pickerLastPage} page={pickerPage} size="small"
                    onChange={(_, v) => fetchPickerList(pickerMode, v)}
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

export default RestrictionsPage;