

import { useEffect, useState, useRef } from 'react';
import {
  Box, Button, Card, CardContent, CircularProgress,
  Divider, Skeleton, Stack,
  TextField, Typography, Avatar, Pagination,
  Dialog, DialogContent, DialogTitle, IconButton,
  alpha, useTheme, InputAdornment,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import ReplayIcon from '@mui/icons-material/Replay';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PageHeader from '../components/PageHeader';
import { useTranslation } from 'react-i18next';
import api from '../utils/axiosInstance';
import { useAppContext } from '../context/AppContext';

function WalletPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const { notify } = useAppContext();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // ── Providers ─────────────────────────────────────
  const [providers, setProviders] = useState([]);
  const [providersLoading, setProvidersLoading] = useState(true);
  const [providerPage, setProviderPage] = useState(1);
  const [providerLastPage, setProviderLastPage] = useState(1);

  // ── Provider Search ────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const searchDebounceRef = useRef(null);

  // ── Provider Picker — shared between Deposit & Refund
  // pickerFor: 'deposit' | 'refund'
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerFor, setPickerFor] = useState('deposit');

  // ── Deposit Form ──────────────────────────────────
  const [depositProviderId, setDepositProviderId] = useState('');
  const [amount, setAmount] = useState('');
  const [depositLoading, setDepositLoading] = useState(false);

  // ── Refund Form ───────────────────────────────────
  const [refundProviderId, setRefundProviderId] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [orderSearchLoading, setOrderSearchLoading] = useState(false);
  const [foundOrder, setFoundOrder] = useState(null);
  const [orderError, setOrderError] = useState('');
  const [refundLoading, setRefundLoading] = useState(false);
  const orderDebounceRef = useRef(null);

  // ── Fetch Providers (paginated) ───────────────────
  async function fetchProviders(p = 1) {
    try {
      setProvidersLoading(true);
      const res = await api.get(`/admin/provider/all-providers?is_active=1&page=${p}`);
      const raw = res.data.data;
      const list = Array.isArray(raw) ? raw : (raw?.data ?? []);
      setProviders(list);
      setProviderPage(raw?.current_page ?? p);
      setProviderLastPage(raw?.last_page ?? 1);
      if (list.length > 0 && p === 1 && !depositProviderId) {
        setDepositProviderId(list[0].id);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setProvidersLoading(false);
    }
  }

  useEffect(() => {
    fetchProviders(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Provider Search (debounced 400ms) ─────────────
  function handleSearchChange(query) {
    setSearchQuery(query);
    if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    if (!query.trim()) {
      setIsSearchMode(false);
      setSearchResults([]);
      return;
    }
    searchDebounceRef.current = setTimeout(async () => {
      try {
        setSearchLoading(true);
        setIsSearchMode(true);
        const res = await api.get(`/admin/provider/search?query=${encodeURIComponent(query.trim())}`);
        const raw = res.data.data;
        const list = Array.isArray(raw) ? raw : (raw?.data ?? []);
        setSearchResults(list);
      } catch (err) {
        console.error(err);
      } finally {
        setSearchLoading(false);
      }
    }, 400);
  }

  // ── Order Search (debounced 500ms) ────────────────
  function handleOrderNumberChange(val) {
    setOrderNumber(val);
    setFoundOrder(null);
    setOrderError('');
    if (orderDebounceRef.current) clearTimeout(orderDebounceRef.current);
    if (!val.trim()) return;
    orderDebounceRef.current = setTimeout(async () => {
      try {
        setOrderSearchLoading(true);
        const res = await api.get(`/admin/orders?order_number=${encodeURIComponent(val.trim())}`);
        const raw = res.data.data;
        const list = Array.isArray(raw) ? raw : (raw?.data ?? []);
        if (list.length > 0) {
          setFoundOrder(list[0]);
          setOrderError('');
        } else {
          setFoundOrder(null);
          setOrderError('No order found with this number.');
        }
      } catch (err) {
        console.error(err);
        setOrderError('Failed to search for order.');
      } finally {
        setOrderSearchLoading(false);
      }
    }, 500);
  }

  // ── Open Picker ───────────────────────────────────
  function openPicker(forForm) {
    setPickerFor(forForm);
    setPickerOpen(true);
  }

  // ── Close Picker ──────────────────────────────────
  function closePicker() {
    setPickerOpen(false);
    setSearchQuery('');
    setIsSearchMode(false);
    setSearchResults([]);
  }

  // ── Select Provider from Picker ───────────────────
  function selectProvider(id) {
    if (pickerFor === 'deposit') setDepositProviderId(id);
    else setRefundProviderId(id);
    closePicker();
  }

  // ── Deposit Submit ────────────────────────────────
  async function handleDeposit() {
    if (!depositProviderId || !amount || Number(amount) <= 0) {
      notify({ severity: 'warning', message: 'Please select a provider and enter a valid amount.' });
      return;
    }
    try {
      setDepositLoading(true);
      await api.post('/admin/wallet/deposit', {
        provider_id: depositProviderId,
        amount: Number(amount),
      });
      notify({ severity: 'success', title: 'Deposit successful', message: `$${amount} deposited successfully.` });
      setAmount('');
    } catch (err) {
      console.error(err);
      notify({ severity: 'error', message: 'Deposit failed. Please try again.' });
    } finally {
      setDepositLoading(false);
    }
  }

  // ── Refund Submit ─────────────────────────────────
  async function handleRefund() {
    if (!refundProviderId) {
      notify({ severity: 'warning', message: 'Please select a provider.' });
      return;
    }
    if (!foundOrder) {
      notify({ severity: 'warning', message: 'Please enter a valid order number.' });
      return;
    }
    try {
      setRefundLoading(true);
      await api.post('/admin/wallet/refund', {
        provider_id: refundProviderId,
        order_id: foundOrder.id,
      });
      notify({ severity: 'success', title: 'Refund successful', message: `Refund for order #${orderNumber} processed.` });
      setOrderNumber('');
      setFoundOrder(null);
      setOrderError('');
      setRefundProviderId('');
    } catch (err) {
      console.error(err);
      notify({ severity: 'error', message: 'Refund failed. Please try again.' });
    } finally {
      setRefundLoading(false);
    }
  }

  // ── Derived ───────────────────────────────────────
  const allKnownProviders = [...providers, ...searchResults];
  const depositProvider = allKnownProviders.find((p) => p.id === depositProviderId);
  const refundProvider  = allKnownProviders.find((p) => p.id === refundProviderId);
  const displayList = isSearchMode ? searchResults : providers;

  // selected provider for the preview card = whichever was used last
  // show deposit provider by default, fallback to refund
  const previewProvider = depositProvider || refundProvider;

  // ── Theme tokens ──────────────────────────────────
  const surfaceBg    = isDark ? theme.palette.background.paper : '#ffffff';
  const subtleBg     = isDark ? alpha(theme.palette.common.white, 0.04) : '#f8fafc';
  const borderColor  = isDark ? alpha(theme.palette.common.white, 0.09) : '#e2e8f0';
  const headingColor = theme.palette.text.primary;
  const mutedColor   = theme.palette.text.secondary;

  // ── Reusable Provider Selector Button ─────────────
  function ProviderSelectorBtn({ provider, onOpen, loading }) {
    return loading && !provider ? (
      <Skeleton variant="rounded" height={56} sx={{ borderRadius: 2 }} />
    ) : (
      <Box
        onClick={onOpen}
        sx={{
          p: 2, borderRadius: 1, cursor: 'pointer',
          bgcolor: subtleBg,
          border: `1px solid ${provider ? theme.palette.primary.main : borderColor}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          '&:hover': { borderColor: 'primary.main' },
          transition: 'border-color 0.2s',
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          {provider ? (
            <Avatar sx={{
              width: 30, height: 30, fontSize: 12, fontWeight: 700,
              bgcolor: alpha(theme.palette.primary.main, 0.15),
              color: 'primary.main',
            }}>
              {(provider.first_name || '').slice(0, 1)}
            </Avatar>
          ) : (
            <Box sx={{
              width: 30, height: 30, borderRadius: '50%',
              bgcolor: subtleBg, border: `1px dashed ${borderColor}`,
              display: 'grid', placeItems: 'center',
            }}>
              <SearchIcon sx={{ fontSize: 14, color: mutedColor }} />
            </Box>
          )}
          <Typography variant="body2" sx={{ fontWeight: 600, color: provider ? headingColor : mutedColor }}>
            {provider
              ? `${provider.first_name || ''} ${provider.last_name || ''}`.trim()
              : 'Select Provider'}
          </Typography>
        </Stack>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
          Click to choose ›
        </Typography>
      </Box>
    );
  }

  return (
    <Stack
      spacing={4}
      dir={isRtl ? 'rtl' : 'ltr'}
      sx={{ p: { xs: 1, md: 3 }, bgcolor: 'background.default', minHeight: '100vh' }}
    >
      <PageHeader title={t('wallet.title')} subtitle={t('wallet.subtitle')} />

      {/* ── Top Row: Deposit | Refund | Preview ──── */}
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4}>

        {/* ── Deposit Card ─────────────────────────── */}
        <Card
          elevation={0}
          sx={{
            flex: 1, borderRadius: 2,
            boxShadow: isDark ? '0 4px 20px 0 rgba(0,0,0,0.3)' : '0 4px 20px 0 rgba(0,0,0,0.05)',
            bgcolor: surfaceBg,
            border: `1px solid ${borderColor}`,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{
                  width: 44, height: 44, borderRadius: 2.5,
                  bgcolor: alpha(theme.palette.primary.main, isDark ? 0.2 : 0.1),
                  display: 'grid', placeItems: 'center', color: 'primary.main',
                }}>
                  <AddIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: headingColor }}>
                    Deposit Funds
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Add balance to provider wallet
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ borderColor }} />

              <ProviderSelectorBtn
                provider={depositProvider}
                onOpen={() => openPicker('deposit')}
                loading={providersLoading}
              />

              <TextField
                label="Amount"
                type="number"
                value={amount}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '' || /^\d+(\.\d{0,2})?$/.test(val)) setAmount(val);
                }}
                inputProps={{ min: 1, step: 1 }}
                InputProps={{
                  disableUnderline: true,
                  sx: { borderRadius: 2 },
                  startAdornment: (
                    <InputAdornment position="start">
                      <Typography sx={{ color: mutedColor, fontWeight: 700 }}>$</Typography>
                    </InputAdornment>
                  ),
                }}
                variant="filled"
                fullWidth
              />

              <Button
                variant="contained"
                size="large"
                startIcon={depositLoading ? <CircularProgress size={18} color="inherit" /> : <AddIcon />}
                onClick={handleDeposit}
                disabled={depositLoading || !depositProviderId}
                sx={{
                  borderRadius: 1, fontWeight: 700, py: 1.5,
                  boxShadow: '0 4px 12px 0 rgba(25,118,210,0.2)',
                  textTransform: 'none',
                }}
              >
                {depositLoading ? 'Processing...' : 'Deposit Funds'}
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {/* ── Refund Card ──────────────────────────── */}
        <Card
          elevation={0}
          sx={{
            flex: 1, borderRadius:2,
            boxShadow: isDark ? '0 4px 20px 0 rgba(0,0,0,0.3)' : '0 4px 20px 0 rgba(0,0,0,0.05)',
            bgcolor: surfaceBg,
            border: `1px solid ${borderColor}`,
          }}
        >
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{
                  width: 44, height: 44, borderRadius: 2.5,
                  bgcolor: alpha(theme.palette.warning.main, isDark ? 0.2 : 0.1),
                  display: 'grid', placeItems: 'center', color: 'warning.dark',
                }}>
                  <ReplayIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: headingColor }}>
                    Refund Order
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Reverse a transaction by order
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ borderColor }} />

              <ProviderSelectorBtn
                provider={refundProvider}
                onOpen={() => openPicker('refund')}
                loading={providersLoading}
              />

              {/* Order Number Search */}
              <TextField
                label="Order Number"
                value={orderNumber}
                onChange={(e) => handleOrderNumberChange(e.target.value)}
                variant="filled"
                fullWidth
                placeholder="e.g. 140174113490"
                InputProps={{
                  disableUnderline: true,
                  sx: { borderRadius: 1 },
                  endAdornment: orderSearchLoading
                    ? <CircularProgress size={16} />
                    : orderNumber && (
                      <IconButton size="small" onClick={() => { setOrderNumber(''); setFoundOrder(null); setOrderError(''); }}>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    ),
                }}
              />

              {/* Order Preview */}
              {foundOrder && (
                <Box sx={{
                  p: 2, borderRadius: 1,
                  bgcolor: alpha(theme.palette.success.main, isDark ? 0.12 : 0.06),
                  border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                }}>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <ReceiptLongIcon sx={{ color: 'success.main', fontSize: 20 }} />
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: headingColor }}>
                        Order #{foundOrder.order_number || orderNumber}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        ID: {foundOrder.id}
                        {foundOrder.total_price != null && ` · $${Number(foundOrder.total_price).toFixed(2)}`}
                        {foundOrder.status && ` · ${foundOrder.status}`}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              )}

              {/* Order Error */}
              {orderError && (
                <Box sx={{
                  p: 2, borderRadius: 1,
                  bgcolor: alpha(theme.palette.error.main, isDark ? 0.12 : 0.06),
                  border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
                }}>
                  <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 600 }}>
                    {orderError}
                  </Typography>
                </Box>
              )}

              <Button
                variant="contained"
                size="large"
                color="warning"
                startIcon={refundLoading ? <CircularProgress size={18} color="inherit" /> : <ReplayIcon />}
                onClick={handleRefund}
                disabled={refundLoading || !refundProviderId || !foundOrder}
                sx={{
                  borderRadius: 1, fontWeight: 700, py: 1.5,
                  textTransform: 'none',
                  boxShadow: '0 4px 12px 0 rgba(237,108,2,0.2)',
                }}
              >
                {refundLoading ? 'Processing...' : 'Process Refund'}
              </Button>
            </Stack>
          </CardContent>
        </Card>

      
      </Stack>

      {/* ── Shared Provider Picker Dialog ─────────── */}
      <Dialog
        open={pickerOpen}
        onClose={closePicker}
        maxWidth="xs"
        fullWidth
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
          Select Provider
          <IconButton
            onClick={closePicker}
            size="small"
            sx={{ bgcolor: subtleBg, border: `1px solid ${borderColor}` }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <Divider sx={{ borderColor }} />

        <DialogContent sx={{ p: 2.5 }}>
          <Stack spacing={2}>

            {/* Search */}
            <TextField
              placeholder="Search by name..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              size="small"
              fullWidth
              autoFocus
              variant="filled"
              InputProps={{
                disableUnderline: true,
                sx: { borderRadius: 2 },
                startAdornment: <SearchIcon sx={{ fontSize: 18, color: mutedColor, mr: 1 }} />,
                endAdornment: searchLoading ? <CircularProgress size={16} /> : null,
              }}
            />

            {/* List */}
            <Stack spacing={0.5} sx={{ maxHeight: 340, overflowY: 'auto', pr: 0.5 }}>
              {searchLoading ? (
                [1, 2, 3].map((i) => (
                  <Skeleton key={i} variant="rounded" height={48} sx={{ borderRadius: 2 }} />
                ))
              ) : displayList.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {isSearchMode ? 'No providers found' : 'No providers available'}
                  </Typography>
                </Box>
              ) : (
                displayList.map((p) => {
                  const name = `${p.first_name || ''} ${p.last_name || ''}`.trim() || `Provider #${p.id}`;
                  const currentId = pickerFor === 'deposit' ? depositProviderId : refundProviderId;
                  const isSelected = p.id === currentId;
                  return (
                    <Box
                      key={p.id}
                      onClick={() => selectProvider(p.id)}
                      sx={{
                        p: 1.5, borderRadius: 2, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        bgcolor: isSelected ? alpha(theme.palette.primary.main, isDark ? 0.2 : 0.08) : 'transparent',
                        border: `1px solid ${isSelected ? theme.palette.primary.main : 'transparent'}`,
                        '&:hover': {
                          bgcolor: isSelected
                            ? alpha(theme.palette.primary.main, isDark ? 0.25 : 0.12)
                            : subtleBg,
                        },
                        transition: 'all 0.15s',
                      }}
                    >
                      <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar sx={{
                          width: 32, height: 32, fontSize: 12, fontWeight: 700,
                          bgcolor: isSelected
                            ? alpha(theme.palette.primary.main, 0.2)
                            : alpha(theme.palette.common.white, isDark ? 0.08 : 0),
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
                            ID #{p.id}   phone : {p.phone || '—'}
                          </Typography>
                        </Box>
                      </Stack>
                      {isSelected && (
                        <Box sx={{
                          width: 20, height: 20, borderRadius: '50%',
                          bgcolor: 'primary.main',
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
            {!isSearchMode && providerLastPage > 1 && (
              <>
                <Divider sx={{ borderColor }} />
                <Stack direction="row" justifyContent="center">
                  <Pagination
                    count={providerLastPage}
                    page={providerPage}
                    size="small"
                    onChange={(_, v) => fetchProviders(v)}
                    color="primary"
                    shape="rounded"
                    disabled={providersLoading}
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

export default WalletPage;