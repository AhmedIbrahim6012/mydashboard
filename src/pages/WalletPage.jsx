

// import { useEffect, useState, useRef } from 'react';
// import {
//   Box, Button, Card, CardContent, CircularProgress,
//   Divider, Skeleton, Stack,
//   TextField, Typography, Avatar, Pagination,
//   Dialog, DialogContent, DialogTitle, IconButton,
//   alpha, useTheme, InputAdornment, Chip,
// } from '@mui/material';
// import AddIcon from '@mui/icons-material/Add';
// import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
// import CloseIcon from '@mui/icons-material/Close';
// import SearchIcon from '@mui/icons-material/Search';
// import ReplayIcon from '@mui/icons-material/Replay';
// import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
// import PageHeader from '../components/PageHeader';
// import { useTranslation } from 'react-i18next';
// import api from '../utils/axiosInstance';
// import { useAppContext } from '../context/AppContext';

// // ── Locally-defined inline SVG icons ────────────────
// // These avoid deep-import / barrel-import resolution issues with
// // @mui/icons-material seen in this project's build setup.
// function makeIcon(path) {
//   return function IconCmp({ sx, style, ...rest }) {
//     const size = sx?.fontSize ?? 20;
//     return (
//       <svg
//         viewBox="0 0 24 24"
//         width={size}
//         height={size}
//         fill="currentColor"
//         style={{ display: 'inline-block', flexShrink: 0, verticalAlign: 'middle', ...style }}
//         {...rest}
//       >
//         <path d={path} />
//       </svg>
//     );
//   };
// }

// const VisibilityIcon = makeIcon('M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z');
// const CheckCircleIcon = makeIcon('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z');
// const CancelIcon = makeIcon('M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z');
// const FilterListIcon = makeIcon('M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z');
// const PersonIcon = makeIcon('M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z');
// const CalendarMonthIcon = makeIcon('M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z');
// const AccessTimeIcon = makeIcon('M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm.5 5H11v6l5.25 3.15.75-1.23-4.5-2.67z');
// const BadgeIcon = makeIcon('M20 6h-3V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9 4h6v2H9V4zm3 7c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 8H8v-.57c0-1.5 3-2.33 4-2.33s4 .83 4 2.33V19z');
// const ToggleOnIcon = makeIcon('M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z');
// const ToggleOffIcon = makeIcon('M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zM7 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z');
// const AccountBalanceIcon = makeIcon('M4 10h3v7H4zm6.5 0h3v7h-3zM2 19h20v3H2zm15-9h3v7h-3zm-5-9L2 6v2h20V6z');
// const RemoveCircleOutlineIcon = makeIcon('M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z');

// // ── Extract readable API error message ─────────────
// function extractApiErrorMessage(err, fallback) {
//   const data = err?.response?.data;
//   if (data?.errors && typeof data.errors === 'object') {
//     const messages = Object.values(data.errors).flat();
//     if (messages.length) return messages.join(' — ');
//   }
//   return data?.message || err.message || fallback;
// }

// function WalletPage() {
//   const { t, i18n } = useTranslation();
//   const isRtl = i18n.dir() === 'rtl';
//   const { notify } = useAppContext();
//   const theme = useTheme();
//   const isDark = theme.palette.mode === 'dark';

//   // ── Providers ─────────────────────────────────────
//   const [providers, setProviders] = useState([]);
//   const [providersLoading, setProvidersLoading] = useState(true);
//   const [providerPage, setProviderPage] = useState(1);
//   const [providerLastPage, setProviderLastPage] = useState(1);

//   // ── Provider Search ────────────────────────────────
//   const [searchQuery, setSearchQuery] = useState('');
//   const [searchResults, setSearchResults] = useState([]);
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [isSearchMode, setIsSearchMode] = useState(false);
//   const searchDebounceRef = useRef(null);

//   // ── Provider Picker — shared between Deposit & Refund
//   // pickerFor: 'deposit' | 'refund'
//   const [pickerOpen, setPickerOpen] = useState(false);
//   const [pickerFor, setPickerFor] = useState('deposit');

//   // ── Deposit Form ──────────────────────────────────
//   const [depositProviderId, setDepositProviderId] = useState('');
//   const [amount, setAmount] = useState('');
//   const [depositLoading, setDepositLoading] = useState(false);

//   // ── Refund Form ───────────────────────────────────
//   const [refundProviderId, setRefundProviderId] = useState('');
//   const [orderNumber, setOrderNumber] = useState('');
//   const [orderSearchLoading, setOrderSearchLoading] = useState(false);
//   const [foundOrder, setFoundOrder] = useState(null);
//   const [orderError, setOrderError] = useState('');
//   const [refundLoading, setRefundLoading] = useState(false);
//   const orderDebounceRef = useRef(null);

//   // ── All Wallets ───────────────────────────────────
//   const [wallets, setWallets] = useState([]);
//   const [walletsLoading, setWalletsLoading] = useState(true);
//   const [walletPageNum, setWalletPageNum] = useState(1);
//   const [walletLastPage, setWalletLastPage] = useState(1);
//   const [walletActiveFilter, setWalletActiveFilter] = useState('all'); // 'all' | '1' | '0'
//   const [toggleLoadingId, setToggleLoadingId] = useState(null);

//   // ── Wallet filter: pick a Provider (any status) ────
//   const [walletProviderIdInput, setWalletProviderIdInput] = useState(''); // the id actually sent to the API
//   const [walletFilterProvider, setWalletFilterProvider] = useState(null); // full provider object, for display

//   const [walletPickerOpen, setWalletPickerOpen] = useState(false);
//   const [walletFilterProviders, setWalletFilterProviders] = useState([]);
//   const [walletFilterProvidersLoading, setWalletFilterProvidersLoading] = useState(false);
//   const [walletFilterProviderPage, setWalletFilterProviderPage] = useState(1);
//   const [walletFilterProviderLastPage, setWalletFilterProviderLastPage] = useState(1);

//   const [walletFilterSearchQuery, setWalletFilterSearchQuery] = useState('');
//   const [walletFilterSearchResults, setWalletFilterSearchResults] = useState([]);
//   const [walletFilterSearchLoading, setWalletFilterSearchLoading] = useState(false);
//   const [walletFilterIsSearchMode, setWalletFilterIsSearchMode] = useState(false);
//   const walletFilterSearchDebounceRef = useRef(null);

//   // ── Withdraw Dialog (shared: provider wallet + platform revenue wallet)
//   const [withdrawOpen, setWithdrawOpen] = useState(false);
//   const [withdrawTarget, setWithdrawTarget] = useState(null); // wallet object
//   const [withdrawAmount, setWithdrawAmount] = useState('');
//   const [withdrawLoading, setWithdrawLoading] = useState(false);

//   // ── Wallet Details Dialog ───────────────────────────
//   const [detailsOpen, setDetailsOpen] = useState(false);
//   const [detailsWallet, setDetailsWallet] = useState(null);

//   // ── Fetch Providers (paginated) ───────────────────
//   async function fetchProviders(p = 1) {
//     try {
//       setProvidersLoading(true);
//       const res = await api.get(`/admin/provider/all-providers?is_active=1&page=${p}`);
//       const raw = res.data.data;
//       const list = Array.isArray(raw) ? raw : (raw?.data ?? []);
//       setProviders(list);
//       setProviderPage(raw?.current_page ?? p);
//       setProviderLastPage(raw?.last_page ?? 1);
//       if (list.length > 0 && p === 1 && !depositProviderId) {
//         setDepositProviderId(list[0].id);
//       }
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setProvidersLoading(false);
//     }
//   }

//   // ── Fetch Wallets (paginated + is_active filter + provider_id search) ──
//   async function fetchWallets(p = 1, activeFilter = walletActiveFilter, providerId = walletProviderIdInput) {
//     try {
//       setWalletsLoading(true);
//       const params = new URLSearchParams();
//       params.set('page', p);
//       if (activeFilter !== 'all') params.set('is_active', activeFilter);
//       if (providerId && providerId.toString().trim() !== '') {
//         params.set('provider_id', providerId.toString().trim());
//       }
//       const res = await api.get(`/admin/wallet/all-wallets?${params.toString()}`);
//       const raw = res.data.data;
//       const list = Array.isArray(raw) ? raw : (raw?.data ?? []);
//       setWallets(list);
//       setWalletPageNum(raw?.current_page ?? p);
//       setWalletLastPage(raw?.last_page ?? 1);
//     } catch (err) {
//       console.error(err);
//       notify({ severity: 'error', message: extractApiErrorMessage(err, 'Failed to load wallets.') });
//     } finally {
//       setWalletsLoading(false);
//     }
//   }

//   useEffect(() => {
//     fetchProviders(1);
//     fetchWallets(1, 'all');
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   // ── Provider Search (debounced 400ms) ─────────────
//   function handleSearchChange(query) {
//     setSearchQuery(query);
//     if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
//     if (!query.trim()) {
//       setIsSearchMode(false);
//       setSearchResults([]);
//       return;
//     }
//     searchDebounceRef.current = setTimeout(async () => {
//       try {
//         setSearchLoading(true);
//         setIsSearchMode(true);
//         const res = await api.get(`/admin/provider/search?query=${encodeURIComponent(query.trim())}`);
//         const raw = res.data.data;
//         const list = Array.isArray(raw) ? raw : (raw?.data ?? []);
//         setSearchResults(list);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setSearchLoading(false);
//       }
//     }, 400);
//   }

//   // ── Order Search (debounced 500ms) ────────────────
//   function handleOrderNumberChange(val) {
//     setOrderNumber(val);
//     setFoundOrder(null);
//     setOrderError('');
//     if (orderDebounceRef.current) clearTimeout(orderDebounceRef.current);
//     if (!val.trim()) return;
//     orderDebounceRef.current = setTimeout(async () => {
//       try {
//         setOrderSearchLoading(true);
//         const res = await api.get(`/admin/orders?order_number=${encodeURIComponent(val.trim())}`);
//         const raw = res.data.data;
//         const list = Array.isArray(raw) ? raw : (raw?.data ?? []);
//         if (list.length > 0) {
//           setFoundOrder(list[0]);
//           setOrderError('');
//         } else {
//           setFoundOrder(null);
//           setOrderError('No order found with this number.');
//         }
//       } catch (err) {
//         console.error(err);
//         setOrderError('Failed to search for order.');
//       } finally {
//         setOrderSearchLoading(false);
//       }
//     }, 500);
//   }

//   // ── Open Picker ───────────────────────────────────
//   function openPicker(forForm) {
//     setPickerFor(forForm);
//     setPickerOpen(true);
//   }

//   // ── Close Picker ──────────────────────────────────
//   function closePicker() {
//     setPickerOpen(false);
//     setSearchQuery('');
//     setIsSearchMode(false);
//     setSearchResults([]);
//   }

//   // ── Select Provider from Picker ───────────────────
//   function selectProvider(id) {
//     if (pickerFor === 'deposit') setDepositProviderId(id);
//     else setRefundProviderId(id);
//     closePicker();
//   }

//   // ── Deposit Submit ────────────────────────────────
//   async function handleDeposit() {
//     if (!depositProviderId || !amount || Number(amount) <= 0) {
//       notify({ severity: 'warning', message: 'Please select a provider and enter a valid amount.' });
//       return;
//     }
//     try {
//       setDepositLoading(true);
//       await api.post('/admin/wallet/deposit', {
//         provider_id: depositProviderId,
//         amount: Number(amount),
//       });
//       notify({ severity: 'success', title: 'Deposit successful', message: `$${amount} deposited successfully.` });
//       setAmount('');
//       fetchWallets(walletPageNum);
//     } catch (err) {
//       console.error(err);
//       notify({ severity: 'error', message: extractApiErrorMessage(err, 'Deposit failed. Please try again.') });
//     } finally {
//       setDepositLoading(false);
//     }
//   }

//   // ── Refund Submit ─────────────────────────────────
//   async function handleRefund() {
//     if (!refundProviderId) {
//       notify({ severity: 'warning', message: 'Please select a provider.' });
//       return;
//     }
//     if (!foundOrder) {
//       notify({ severity: 'warning', message: 'Please enter a valid order number.' });
//       return;
//     }
//     try {
//       setRefundLoading(true);
//       await api.post('/admin/wallet/refund', {
//         provider_id: refundProviderId,
//         order_id: foundOrder.id,
//       });
//       notify({ severity: 'success', title: 'Refund successful', message: `Refund for order #${orderNumber} processed.` });
//       setOrderNumber('');
//       setFoundOrder(null);
//       setOrderError('');
//       setRefundProviderId('');
//       fetchWallets(walletPageNum);
//     } catch (err) {
//       console.error(err);
//       notify({ severity: 'error', message: extractApiErrorMessage(err, 'Refund failed. Please try again.') });
//     } finally {
//       setRefundLoading(false);
//     }
//   }

//   // ── Withdraw Dialog open/close ─────────────────────
//   function openWithdraw(wallet) {
//     setWithdrawTarget(wallet);
//     setWithdrawAmount('');
//     setWithdrawOpen(true);
//   }
//   function closeWithdraw() {
//     setWithdrawOpen(false);
//     setWithdrawTarget(null);
//     setWithdrawAmount('');
//   }

//   // ── Withdraw Submit (routes to correct endpoint based on wallet type)
//   async function handleWithdrawSubmit() {
//     if (!withdrawAmount || Number(withdrawAmount) <= 0) {
//       notify({ severity: 'warning', message: 'Please enter a valid amount.' });
//       return;
//     }
//     const isPlatformWallet = withdrawTarget?.type === 'Platform Revenue Wallet';
//     try {
//       setWithdrawLoading(true);
//       if (isPlatformWallet) {
//         await api.post('/admin/wallet/withdraw-from-platform-revenue', {
//           amount: Number(withdrawAmount),
//         });
//       } else {
//         await api.post('/admin/wallet/withdraw', {
//           provider_id: withdrawTarget.provider?.id,
//           amount: Number(withdrawAmount),
//         });
//       }
//       notify({ severity: 'success', title: 'Withdrawal successful', message: `$${withdrawAmount} withdrawn successfully.` });
//       closeWithdraw();
//       fetchWallets(walletPageNum);
//     } catch (err) {
//       console.error(err);
//       notify({ severity: 'error', message: extractApiErrorMessage(err, 'Withdrawal failed. Please try again.') });
//     } finally {
//       setWithdrawLoading(false);
//     }
//   }

//   // ── Activate / Deactivate a wallet ─────────────────
//   async function handleToggleWalletActive(wallet) {
//     try {
//       setToggleLoadingId(wallet.id);
//       const endpoint = wallet.is_active ? '/admin/wallet/deactivate-wallet' : '/admin/wallet/activate-wallet';
//       await api.post(endpoint, { wallet_id: wallet.id });
//       notify({
//         severity: 'success',
//         message: `Wallet ${wallet.is_active ? 'deactivated' : 'activated'} successfully.`,
//       });
//       fetchWallets(walletPageNum);
//     } catch (err) {
//       console.error(err);
//       notify({ severity: 'error', message: extractApiErrorMessage(err, 'Action failed. Please try again.') });
//     } finally {
//       setToggleLoadingId(null);
//     }
//   }

//   // ── Wallet active filter change ────────────────────
//   function handleWalletFilterChange(_, val) {
//     if (val === null) return; // ignore un-toggle
//     setWalletActiveFilter(val);
//     fetchWallets(1, val, walletProviderIdInput);
//   }

//   // ── Wallet filter Provider Picker: fetch all providers (any status) ──
//   async function fetchWalletFilterProviders(p = 1) {
//     try {
//       setWalletFilterProvidersLoading(true);
//       const res = await api.get(`/admin/provider/all-providers?page=${p}`);
//       const raw = res.data.data;
//       const list = Array.isArray(raw) ? raw : (raw?.data ?? []);
//       setWalletFilterProviders(list);
//       setWalletFilterProviderPage(raw?.current_page ?? p);
//       setWalletFilterProviderLastPage(raw?.last_page ?? 1);
//     } catch (err) {
//       console.error(err);
//       notify({ severity: 'error', message: extractApiErrorMessage(err, 'Failed to load providers.') });
//     } finally {
//       setWalletFilterProvidersLoading(false);
//     }
//   }

//   // ── Wallet filter Provider search (debounced 400ms) ──
//   function handleWalletFilterSearchChange(query) {
//     setWalletFilterSearchQuery(query);
//     if (walletFilterSearchDebounceRef.current) clearTimeout(walletFilterSearchDebounceRef.current);
//     if (!query.trim()) {
//       setWalletFilterIsSearchMode(false);
//       setWalletFilterSearchResults([]);
//       return;
//     }
//     walletFilterSearchDebounceRef.current = setTimeout(async () => {
//       try {
//         setWalletFilterSearchLoading(true);
//         setWalletFilterIsSearchMode(true);
//         const res = await api.get(`/admin/provider/search?query=${encodeURIComponent(query.trim())}`);
//         const raw = res.data.data;
//         const list = Array.isArray(raw) ? raw : (raw?.data ?? []);
//         setWalletFilterSearchResults(list);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setWalletFilterSearchLoading(false);
//       }
//     }, 400);
//   }

//   // ── Open / Close the wallet filter Provider Picker ──
//   function openWalletPicker() {
//     setWalletPickerOpen(true);
//     if (walletFilterProviders.length === 0) fetchWalletFilterProviders(1);
//   }
//   function closeWalletPicker() {
//     setWalletPickerOpen(false);
//     setWalletFilterSearchQuery('');
//     setWalletFilterIsSearchMode(false);
//     setWalletFilterSearchResults([]);
//   }

//   // ── Pick a provider to filter wallets by ────────────
//   function selectWalletFilterProvider(provider) {
//     setWalletFilterProvider(provider);
//     setWalletProviderIdInput(String(provider.id));
//     fetchWallets(1, walletActiveFilter, provider.id);
//     closeWalletPicker();
//   }

//   // ── Clear the wallet provider filter ────────────────
//   function clearWalletFilterProvider() {
//     setWalletFilterProvider(null);
//     setWalletProviderIdInput('');
//     fetchWallets(1, walletActiveFilter, '');
//   }

//   // ── Wallet Details Dialog open/close ───────────────
//   function openDetails(wallet) {
//     setDetailsWallet(wallet);
//     setDetailsOpen(true);
//   }
//   function closeDetails() {
//     setDetailsOpen(false);
//     setDetailsWallet(null);
//   }

//   // ── Derived ───────────────────────────────────────
//   const allKnownProviders = [...providers, ...searchResults];
//   const depositProvider = allKnownProviders.find((p) => p.id === depositProviderId);
//   const refundProvider  = allKnownProviders.find((p) => p.id === refundProviderId);
//   const displayList = isSearchMode ? searchResults : providers;
//   const walletFilterDisplayList = walletFilterIsSearchMode ? walletFilterSearchResults : walletFilterProviders;

//   // ── Theme tokens ──────────────────────────────────
//   const surfaceBg    = isDark ? theme.palette.background.paper : '#ffffff';
//   const subtleBg     = isDark ? alpha(theme.palette.common.white, 0.04) : '#f8fafc';
//   const borderColor  = isDark ? alpha(theme.palette.common.white, 0.09) : '#e2e8f0';
//   const headingColor = theme.palette.text.primary;
//   const mutedColor   = theme.palette.text.secondary;

//   // ── Reusable Provider Selector Button ─────────────
//   function ProviderSelectorBtn({ provider, onOpen, loading }) {
//     return loading && !provider ? (
//       <Skeleton variant="rounded" height={56} sx={{ borderRadius: 2 }} />
//     ) : (
//       <Box
//         onClick={onOpen}
//         sx={{
//           p: 2, borderRadius: 1, cursor: 'pointer',
//           bgcolor: subtleBg,
//           border: `1px solid ${provider ? theme.palette.primary.main : borderColor}`,
//           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//           '&:hover': { borderColor: 'primary.main' },
//           transition: 'border-color 0.2s',
//         }}
//       >
//         <Stack direction="row" spacing={1.5} alignItems="center">
//           {provider ? (
//             <Avatar sx={{
//               width: 30, height: 30, fontSize: 12, fontWeight: 700,
//               bgcolor: alpha(theme.palette.primary.main, 0.15),
//               color: 'primary.main',
//             }}>
//               {(provider.first_name || '').slice(0, 1)}
//             </Avatar>
//           ) : (
//             <Box sx={{
//               width: 30, height: 30, borderRadius: '50%',
//               bgcolor: subtleBg, border: `1px dashed ${borderColor}`,
//               display: 'grid', placeItems: 'center',
//             }}>
//               <SearchIcon sx={{ fontSize: 14, color: mutedColor }} />
//             </Box>
//           )}
//           <Typography variant="body2" sx={{ fontWeight: 600, color: provider ? headingColor : mutedColor }}>
//             {provider
//               ? `${provider.first_name || ''} ${provider.last_name || ''}`.trim()
//               : 'Select Provider'}
//           </Typography>
//         </Stack>
//         <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
//           Click to choose ›
//         </Typography>
//       </Box>
//     );
//   }

//   // ── Reusable Detail Row (wallet details dialog) ────
//   function DetailRow({ icon, label, value, valueColor, chip }) {
//     return (
//       <Stack
//         direction="row"
//         alignItems="center"
//         justifyContent="space-between"
//         sx={{
//           py: 1.4, px: 0.5,
//           borderBottom: `1px solid ${borderColor}`,
//           '&:last-of-type': { borderBottom: 'none' },
//         }}
//       >
//         <Stack direction="row" spacing={1.2} alignItems="center">
//           <Box sx={{
//             width: 30, height: 30, borderRadius: 1.5,
//             bgcolor: alpha(theme.palette.text.primary, isDark ? 0.06 : 0.04),
//             display: 'grid', placeItems: 'center', color: mutedColor, flexShrink: 0,
//           }}>
//             {icon}
//           </Box>
//           <Typography variant="body2" sx={{ color: mutedColor, fontWeight: 500 }}>
//             {label}
//           </Typography>
//         </Stack>
//         {chip ? chip : (
//           <Typography variant="body2" sx={{ fontWeight: 700, color: valueColor || headingColor, textAlign: isRtl ? 'left' : 'right' }}>
//             {value}
//           </Typography>
//         )}
//       </Stack>
//     );
//   }

//   return (
//     <Stack
//       spacing={4}
//       dir={isRtl ? 'rtl' : 'ltr'}
//       sx={{ p: { xs: 1, md: 3 }, bgcolor: 'background.default', minHeight: '100vh' }}
//     >
//       <PageHeader title={t('wallet.title')} subtitle={t('wallet.subtitle')} />

//       {/* ── Top Row: Deposit | Refund ────────────── */}
//       <Stack direction={{ xs: 'column', lg: 'row' }} spacing={4}>

//         {/* ── Deposit Card ─────────────────────────── */}
//         <Card
//           elevation={0}
//           sx={{
//             flex: 1, borderRadius: 2,
//             boxShadow: isDark ? '0 4px 20px 0 rgba(0,0,0,0.3)' : '0 4px 20px 0 rgba(0,0,0,0.05)',
//             bgcolor: surfaceBg,
//             border: `1px solid ${borderColor}`,
//           }}
//         >
//           <CardContent sx={{ p: 4 }}>
//             <Stack spacing={3}>
//               <Stack direction="row" spacing={2} alignItems="center">
//                 <Box sx={{
//                   width: 44, height: 44, borderRadius: 2.5,
//                   bgcolor: alpha(theme.palette.primary.main, isDark ? 0.2 : 0.1),
//                   display: 'grid', placeItems: 'center', color: 'primary.main',
//                 }}>
//                   <AddIcon />
//                 </Box>
//                 <Box>
//                   <Typography variant="h6" sx={{ fontWeight: 800, color: headingColor }}>
//                     Deposit Funds
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
//                     Add balance to provider wallet
//                   </Typography>
//                 </Box>
//               </Stack>

//               <Divider sx={{ borderColor }} />

//               <ProviderSelectorBtn
//                 provider={depositProvider}
//                 onOpen={() => openPicker('deposit')}
//                 loading={providersLoading}
//               />

//               <TextField
//                 label="Amount"
//                 type="number"
//                 value={amount}
//                 onChange={(e) => {
//                   const val = e.target.value;
//                   if (val === '' || /^\d+(\.\d{0,2})?$/.test(val)) setAmount(val);
//                 }}
//                 inputProps={{ min: 1, step: 1 }}
//                 InputProps={{
//                   disableUnderline: true,
//                   sx: { borderRadius: 2 },
//                   startAdornment: (
//                     <InputAdornment position="start">
//                       <Typography sx={{ color: mutedColor, fontWeight: 700 }}>$</Typography>
//                     </InputAdornment>
//                   ),
//                 }}
//                 variant="filled"
//                 fullWidth
//               />

//               <Button
//                 variant="contained"
//                 size="large"
//                 startIcon={depositLoading ? <CircularProgress size={18} color="inherit" /> : <AddIcon />}
//                 onClick={handleDeposit}
//                 disabled={depositLoading || !depositProviderId}
//                 sx={{
//                   borderRadius: 1, fontWeight: 700, py: 1.5,
//                   boxShadow: '0 4px 12px 0 rgba(25,118,210,0.2)',
//                   textTransform: 'none',
//                 }}
//               >
//                 {depositLoading ? 'Processing...' : 'Deposit Funds'}
//               </Button>
//             </Stack>
//           </CardContent>
//         </Card>

//         {/* ── Refund Card ──────────────────────────── */}
//         <Card
//           elevation={0}
//           sx={{
//             flex: 1, borderRadius:2,
//             boxShadow: isDark ? '0 4px 20px 0 rgba(0,0,0,0.3)' : '0 4px 20px 0 rgba(0,0,0,0.05)',
//             bgcolor: surfaceBg,
//             border: `1px solid ${borderColor}`,
//           }}
//         >
//           <CardContent sx={{ p: 4 }}>
//             <Stack spacing={3}>
//               <Stack direction="row" spacing={2} alignItems="center">
//                 <Box sx={{
//                   width: 44, height: 44, borderRadius: 2.5,
//                   bgcolor: alpha(theme.palette.warning.main, isDark ? 0.2 : 0.1),
//                   display: 'grid', placeItems: 'center', color: 'warning.dark',
//                 }}>
//                   <ReplayIcon />
//                 </Box>
//                 <Box>
//                   <Typography variant="h6" sx={{ fontWeight: 800, color: headingColor }}>
//                     Refund Order
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
//                     Reverse a transaction by order
//                   </Typography>
//                 </Box>
//               </Stack>

//               <Divider sx={{ borderColor }} />

//               <ProviderSelectorBtn
//                 provider={refundProvider}
//                 onOpen={() => openPicker('refund')}
//                 loading={providersLoading}
//               />

//               {/* Order Number Search */}
//               <TextField
//                 label="Order Number"
//                 value={orderNumber}
//                 onChange={(e) => handleOrderNumberChange(e.target.value)}
//                 variant="filled"
//                 fullWidth
//                 placeholder="e.g. 140174113490"
//                 InputProps={{
//                   disableUnderline: true,
//                   sx: { borderRadius: 1 },
//                   endAdornment: orderSearchLoading
//                     ? <CircularProgress size={16} />
//                     : orderNumber && (
//                       <IconButton size="small" onClick={() => { setOrderNumber(''); setFoundOrder(null); setOrderError(''); }}>
//                         <CloseIcon fontSize="small" />
//                       </IconButton>
//                     ),
//                 }}
//               />

//               {/* Order Preview */}
//               {foundOrder && (
//                 <Box sx={{
//                   p: 2, borderRadius: 1,
//                   bgcolor: alpha(theme.palette.success.main, isDark ? 0.12 : 0.06),
//                   border: `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
//                 }}>
//                   <Stack direction="row" spacing={1.5} alignItems="center">
//                     <ReceiptLongIcon sx={{ color: 'success.main', fontSize: 20 }} />
//                     <Box>
//                       <Typography variant="body2" sx={{ fontWeight: 700, color: headingColor }}>
//                         Order #{foundOrder.order_number || orderNumber}
//                       </Typography>
//                       <Typography variant="caption" color="text.secondary">
//                         ID: {foundOrder.id}
//                         {foundOrder.total_price != null && ` · $${Number(foundOrder.total_price).toFixed(2)}`}
//                         {foundOrder.status && ` · ${foundOrder.status}`}
//                       </Typography>
//                     </Box>
//                   </Stack>
//                 </Box>
//               )}

//               {/* Order Error */}
//               {orderError && (
//                 <Box sx={{
//                   p: 2, borderRadius: 1,
//                   bgcolor: alpha(theme.palette.error.main, isDark ? 0.12 : 0.06),
//                   border: `1px solid ${alpha(theme.palette.error.main, 0.3)}`,
//                 }}>
//                   <Typography variant="body2" sx={{ color: 'error.main', fontWeight: 600 }}>
//                     {orderError}
//                   </Typography>
//                 </Box>
//               )}

//               <Button
//                 variant="contained"
//                 size="large"
//                 color="warning"
//                 startIcon={refundLoading ? <CircularProgress size={18} color="inherit" /> : <ReplayIcon />}
//                 onClick={handleRefund}
//                 disabled={refundLoading || !refundProviderId || !foundOrder}
//                 sx={{
//                   borderRadius: 1, fontWeight: 700, py: 1.5,
//                   textTransform: 'none',
//                   boxShadow: '0 4px 12px 0 rgba(237,108,2,0.2)',
//                 }}
//               >
//                 {refundLoading ? 'Processing...' : 'Process Refund'}
//               </Button>
//             </Stack>
//           </CardContent>
//         </Card>

//       </Stack>

//       {/* ── All Wallets Card ──────────────────────── */}
//       <Card
//         elevation={0}
//         sx={{
//           borderRadius: 2,
//           boxShadow: isDark ? '0 4px 20px 0 rgba(0,0,0,0.3)' : '0 4px 20px 0 rgba(0,0,0,0.05)',
//           bgcolor: surfaceBg,
//           border: `1px solid ${borderColor}`,
//         }}
//       >
//         <CardContent sx={{ p: 4 }}>
//           <Stack spacing={3}>
//             <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
//               <Stack direction="row" spacing={2} alignItems="center">
//                 <Box sx={{
//                   width: 44, height: 44, borderRadius: 2.5,
//                   bgcolor: alpha(theme.palette.info.main, isDark ? 0.2 : 0.1),
//                   display: 'grid', placeItems: 'center', color: 'info.main',
//                 }}>
//                   <AccountBalanceWalletIcon />
//                 </Box>
//                 <Box>
//                   <Typography variant="h6" sx={{ fontWeight: 800, color: headingColor }}>
//                     All Wallets
//                   </Typography>
//                   <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
//                     Provider wallets and platform revenue wallet
//                   </Typography>
//                 </Box>
//               </Stack>

//               <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }} sx={{ width: { xs: '100%', md: 'auto' } }}>
//                 {/* Provider picker trigger — pick from list or search by name */}
//                 <Box
//                   onClick={openWalletPicker}
//                   sx={{
//                     display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                     gap: 1, cursor: 'pointer',
//                     px: 1.75, py: 1, borderRadius: 1,
//                     minWidth: { xs: '100%', sm: 240 },
//                     bgcolor: subtleBg,
//                     border: `1px solid ${walletFilterProvider ? theme.palette.primary.main : borderColor}`,
//                     '&:hover': { borderColor: 'primary.main' },
//                     transition: 'border-color 0.2s',
//                   }}
//                 >
//                   <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
//                     {walletFilterProvider ? (
//                       <Avatar sx={{
//                         width: 24, height: 24, fontSize: 11, fontWeight: 700,
//                         bgcolor: alpha(theme.palette.primary.main, 0.15), color: 'primary.main',
//                       }}>
//                         {(walletFilterProvider.first_name || walletFilterProvider.name || '?').slice(0, 1)}
//                       </Avatar>
//                     ) : (
//                       <SearchIcon sx={{ fontSize: 18, color: mutedColor }} />
//                     )}
//                     <Typography
//                       variant="body2"
//                       noWrap
//                       sx={{ fontWeight: 600, color: walletFilterProvider ? headingColor : mutedColor }}
//                     >
//                       {walletFilterProvider
//                         ? (walletFilterProvider.name || `${walletFilterProvider.first_name || ''} ${walletFilterProvider.last_name || ''}`.trim())
//                         : 'Search by Provider'}
//                     </Typography>
//                   </Stack>
//                   {walletFilterProvider && (
//                     <IconButton
//                       size="small"
//                       onClick={(e) => { e.stopPropagation(); clearWalletFilterProvider(); }}
//                       sx={{ p: 0.3 }}
//                     >
//                       <CloseIcon sx={{ fontSize: 15 }} />
//                     </IconButton>
//                   )}
//                 </Box>

//                 {/* Active / Inactive pill filter */}
//                 <Stack
//                   direction="row"
//                   sx={{
//                     p: 0.5, borderRadius: 1,
//                     bgcolor: subtleBg,
//                     border: `1px solid ${borderColor}`,
//                     width: 'fit-content',
//                   }}
//                 >
//                   {[
//                     { value: 'all', label: 'All', icon: <FilterListIcon sx={{ fontSize: 16 }} /> },
//                     { value: '1', label: 'Active', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> },
//                     { value: '0', label: 'Inactive', icon: <CancelIcon sx={{ fontSize: 16 }} /> },
//                   ].map((opt) => {
//                     const selected = walletActiveFilter === opt.value;
//                     return (
//                       <Box
//                         key={opt.value}
//                         onClick={() => handleWalletFilterChange(null, opt.value)}
//                         sx={{
//                           display: 'flex', alignItems: 'center', gap: 0.6,
//                           px: 1.75, py: 0.75, borderRadius: 1, cursor: 'pointer',
//                           fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap',
//                           color: selected ? '#fff' : mutedColor,
//                           bgcolor: selected
//                             ? (opt.value === '1' ? 'success.main' : opt.value === '0' ? 'error.main' : 'primary.main')
//                             : 'transparent',
//                           transition: 'all 0.15s',
//                           '&:hover': { bgcolor: selected ? undefined : alpha(theme.palette.text.primary, isDark ? 0.06 : 0.04) },
//                         }}
//                       >
//                         {opt.icon}
//                         {opt.label}
//                       </Box>
//                     );
//                   })}
//                 </Stack>
//               </Stack>
//             </Stack>

//             <Divider sx={{ borderColor }} />

//             <Stack spacing={1.5}>
//               {walletsLoading ? (
//                 [1, 2, 3, 4].map((i) => (
//                   <Skeleton key={i} variant="rounded" height={72} sx={{ borderRadius: 2 }} />
//                 ))
//               ) : wallets.length === 0 ? (
//                 <Box sx={{ py: 5, textAlign: 'center' }}>
//                   <Typography variant="body2" color="text.secondary">
//                     No wallets found.
//                   </Typography>
//                 </Box>
//               ) : (
//                 wallets.map((wallet) => {
//                   const isPlatform = wallet.type === 'Platform Revenue Wallet';
//                   const name = isPlatform
//                     ? 'Platform Revenue Wallet'
//                     : (wallet.provider?.name || `Provider #${wallet.provider?.id ?? '—'}`);
//                   const balanceNum = Number(wallet.balance);
//                   const isNegative = balanceNum < 0;
//                   const isToggling = toggleLoadingId === wallet.id;

//                   return (
//                     <Box
//                       key={wallet.id}
//                       sx={{
//                         p: 2, borderRadius: 2,
//                         bgcolor: subtleBg,
//                         border: `1px solid ${borderColor}`,
//                         display: 'flex', flexWrap: 'wrap', rowGap: 1.5,
//                         alignItems: 'center', justifyContent: 'space-between',
//                       }}
//                     >
//                       {/* Identity */}
//                       <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 220, flex: 1 }}>
//                         {isPlatform ? (
//                           <Box sx={{
//                             width: 36, height: 36, borderRadius: '50%',
//                             bgcolor: alpha(theme.palette.secondary.main, 0.15),
//                             display: 'grid', placeItems: 'center', color: 'secondary.main', flexShrink: 0,
//                           }}>
//                             <AccountBalanceIcon sx={{ fontSize: 18 }} />
//                           </Box>
//                         ) : wallet.provider?.image?.image_url ? (
//                           <Avatar src={wallet.provider.image.image_url} sx={{ width: 36, height: 36 }} />
//                         ) : (
//                           <Avatar sx={{
//                             width: 36, height: 36, fontSize: 13, fontWeight: 700,
//                             bgcolor: alpha(theme.palette.primary.main, 0.15), color: 'primary.main',
//                           }}>
//                             {name.slice(0, 1)}
//                           </Avatar>
//                         )}
//                         <Box sx={{ minWidth: 0 }}>
//                           <Typography variant="body2" sx={{ fontWeight: 700, color: headingColor }} noWrap>
//                             {name}
//                           </Typography>
//                           <Typography variant="caption" color="text.secondary">
//                             {/* Wallet #{wallet.id} */}
//                             {!isPlatform && wallet.provider?.id != null 
//                             // && ` · Provider #${wallet.provider.id}`
//                             }
//                             {wallet.last_used && `  Last used ${wallet.last_used}`}
//                           </Typography>
//                         </Box>
//                       </Stack>

//                       {/* Type chip */}
//                       <Chip
//                         size="small"
//                         label={wallet.type}
//                         sx={{
//                           fontWeight: 600, fontSize: '0.7rem',
//                           bgcolor: isPlatform
//                             ? alpha(theme.palette.secondary.main, 0.12)
//                             : alpha(theme.palette.primary.main, 0.1),
//                           color: isPlatform ? 'secondary.main' : 'primary.main',
//                         }}
//                       />

//                       {/* Balance */}
//                       <Box sx={{ minWidth: 110, textAlign: isRtl ? 'left' : 'right' }}>
//                         <Typography
//                           variant="body2"
//                           sx={{ fontWeight: 800, color: isNegative ? 'error.main' : headingColor }}
//                         >
//                           {balanceNum.toFixed(2)} {wallet.currency}
//                         </Typography>
//                         <Typography variant="caption" color="text.secondary">
//                           Overdraft : {wallet.overdraft_limit}
//                         </Typography>
//                       </Box>

//                       {/* Active status */}
//                       <Chip
//                         size="small"
//                         label={wallet.is_active ? 'Active' : 'Inactive'}
//                         sx={{
//                           fontWeight: 700, fontSize: '0.7rem',
//                           bgcolor: wallet.is_active
//                             ? alpha(theme.palette.success.main, 0.12)
//                             : alpha(theme.palette.error.main, 0.1),
//                           color: wallet.is_active ? 'success.main' : 'error.main',
//                         }}
//                       />

//                       {/* Actions */}
//                       <Stack direction="row" spacing={1}>
//                         <IconButton
//                           size="small"
//                           onClick={() => openDetails(wallet)}
//                           sx={{
//                             bgcolor: subtleBg,
//                             border: `1px solid ${borderColor}`,
//                             '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
//                           }}
//                         >
//                           <VisibilityIcon sx={{ fontSize: 18 }} />
//                         </IconButton>
//                         <Button
//                           size="small"
//                           variant="outlined"
//                           color="warning"
//                           startIcon={<RemoveCircleOutlineIcon sx={{ fontSize: 16 }} />}
//                           onClick={() => openWithdraw(wallet)}
//                           disabled={!wallet.is_active}
//                           sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5 }}
//                         >
//                           Withdraw
//                         </Button>
//                         <Button
//                           size="small"
//                           variant="outlined"
//                           color={wallet.is_active ? 'error' : 'success'}
//                           startIcon={
//                             isToggling
//                               ? <CircularProgress size={14} color="inherit" />
//                               : wallet.is_active
//                                 ? <ToggleOffIcon sx={{ fontSize: 16 }} />
//                                 : <ToggleOnIcon sx={{ fontSize: 16 }} />
//                           }
//                           onClick={() => handleToggleWalletActive(wallet)}
//                           disabled={isToggling}
//                           sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5 }}
//                         >
//                           {wallet.is_active ? 'Deactivate' : 'Activate'}
//                         </Button>
//                       </Stack>
//                     </Box>
//                   );
//                 })
//               )}
//             </Stack>

//             {walletLastPage > 1 && (
//               <Stack direction="row" justifyContent="center" sx={{ pt: 1 }}>
//                 <Pagination
//                   count={walletLastPage}
//                   page={walletPageNum}
//                   size="small"
//                   onChange={(_, v) => fetchWallets(v)}
//                   color="primary"
//                   shape="rounded"
//                   disabled={walletsLoading}
//                 />
//               </Stack>
//             )}
//           </Stack>
//         </CardContent>
//       </Card>

//       {/* ── Shared Provider Picker Dialog ─────────── */}
//       <Dialog
//         open={pickerOpen}
//         onClose={closePicker}
//         maxWidth="xs"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: 4,
//             backgroundImage: 'none',
//             bgcolor: surfaceBg,
//             border: `1px solid ${borderColor}`,
//             boxShadow: isDark
//               ? '0 20px 25px -5px rgba(0,0,0,0.5)'
//               : '0 20px 25px -5px rgba(0,0,0,0.1)',
//           },
//         }}
//       >
//         <DialogTitle sx={{
//           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//           fontWeight: 800, pb: 2, pt: 3, color: headingColor,
//         }}>
//           Select Provider
//           <IconButton
//             onClick={closePicker}
//             size="small"
//             sx={{ bgcolor: subtleBg, border: `1px solid ${borderColor}` }}
//           >
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </DialogTitle>

//         <Divider sx={{ borderColor }} />

//         <DialogContent sx={{ p: 2.5 }}>
//           <Stack spacing={2}>

//             {/* Search */}
//             <TextField
//               placeholder="Search by name..."
//               value={searchQuery}
//               onChange={(e) => handleSearchChange(e.target.value)}
//               size="small"
//               fullWidth
//               autoFocus
//               variant="filled"
//               InputProps={{
//                 disableUnderline: true,
//                 sx: { borderRadius: 2 },
//                 startAdornment: <SearchIcon sx={{ fontSize: 18, color: mutedColor, mr: 1 }} />,
//                 endAdornment: searchLoading ? <CircularProgress size={16} /> : null,
//               }}
//             />

//             {/* List */}
//             <Stack spacing={0.5} sx={{ maxHeight: 340, overflowY: 'auto', pr: 0.5 }}>
//               {searchLoading ? (
//                 [1, 2, 3].map((i) => (
//                   <Skeleton key={i} variant="rounded" height={48} sx={{ borderRadius: 2 }} />
//                 ))
//               ) : displayList.length === 0 ? (
//                 <Box sx={{ py: 4, textAlign: 'center' }}>
//                   <Typography variant="body2" color="text.secondary">
//                     {isSearchMode ? 'No providers found' : 'No providers available'}
//                   </Typography>
//                 </Box>
//               ) : (
//                 displayList.map((p) => {
//                   const name = `${p.first_name || ''} ${p.last_name || ''}`.trim() || `Provider #${p.id}`;
//                   const currentId = pickerFor === 'deposit' ? depositProviderId : refundProviderId;
//                   const isSelected = p.id === currentId;
//                   return (
//                     <Box
//                       key={p.id}
//                       onClick={() => selectProvider(p.id)}
//                       sx={{
//                         p: 1.5, borderRadius: 2, cursor: 'pointer',
//                         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                         bgcolor: isSelected ? alpha(theme.palette.primary.main, isDark ? 0.2 : 0.08) : 'transparent',
//                         border: `1px solid ${isSelected ? theme.palette.primary.main : 'transparent'}`,
//                         '&:hover': {
//                           bgcolor: isSelected
//                             ? alpha(theme.palette.primary.main, isDark ? 0.25 : 0.12)
//                             : subtleBg,
//                         },
//                         transition: 'all 0.15s',
//                       }}
//                     >
//                       <Stack direction="row" spacing={1.5} alignItems="center">
//                         <Avatar sx={{
//                           width: 32, height: 32, fontSize: 12, fontWeight: 700,
//                           bgcolor: isSelected
//                             ? alpha(theme.palette.primary.main, 0.2)
//                             : alpha(theme.palette.common.white, isDark ? 0.08 : 0),
//                           color: isSelected ? 'primary.main' : mutedColor,
//                           border: `1px solid ${isSelected ? theme.palette.primary.main : borderColor}`,
//                         }}>
//                           {(p.first_name || '').slice(0, 1)}
//                         </Avatar>
//                         <Box>
//                           <Typography variant="body2" sx={{ fontWeight: 600, color: headingColor, lineHeight: 1.3 }}>
//                             {name}
//                           </Typography>
//                           <Typography variant="caption" sx={{ color: mutedColor, fontSize: '0.72rem' }}>
//                             ID #{p.id}   phone : {p.phone || '—'}
//                           </Typography>
//                         </Box>
//                       </Stack>
//                       {isSelected && (
//                         <Box sx={{
//                           width: 20, height: 20, borderRadius: '50%',
//                           bgcolor: 'primary.main',
//                           display: 'grid', placeItems: 'center', flexShrink: 0,
//                         }}>
//                           <Typography sx={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>✓</Typography>
//                         </Box>
//                       )}
//                     </Box>
//                   );
//                 })
//               )}
//             </Stack>

//             {/* Pagination */}
//             {!isSearchMode && providerLastPage > 1 && (
//               <>
//                 <Divider sx={{ borderColor }} />
//                 <Stack direction="row" justifyContent="center">
//                   <Pagination
//                     count={providerLastPage}
//                     page={providerPage}
//                     size="small"
//                     onChange={(_, v) => fetchProviders(v)}
//                     color="primary"
//                     shape="rounded"
//                     disabled={providersLoading}
//                   />
//                 </Stack>
//               </>
//             )}
//           </Stack>
//         </DialogContent>
//       </Dialog>

//       {/* ── Wallet Filter Provider Picker Dialog (any status) ─── */}
//       <Dialog
//         open={walletPickerOpen}
//         onClose={closeWalletPicker}
//         maxWidth="xs"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: 4,
//             backgroundImage: 'none',
//             bgcolor: surfaceBg,
//             border: `1px solid ${borderColor}`,
//             boxShadow: isDark
//               ? '0 20px 25px -5px rgba(0,0,0,0.5)'
//               : '0 20px 25px -5px rgba(0,0,0,0.1)',
//           },
//         }}
//       >
//         <DialogTitle sx={{
//           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//           fontWeight: 800, pb: 2, pt: 3, color: headingColor,
//         }}>
//           Select Provider
//           <IconButton
//             onClick={closeWalletPicker}
//             size="small"
//             sx={{ bgcolor: subtleBg, border: `1px solid ${borderColor}` }}
//           >
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </DialogTitle>

//         <Divider sx={{ borderColor }} />

//         <DialogContent sx={{ p: 2.5 }}>
//           <Stack spacing={2}>

//             {/* Search */}
//             <TextField
//               placeholder="Search by name..."
//               value={walletFilterSearchQuery}
//               onChange={(e) => handleWalletFilterSearchChange(e.target.value)}
//               size="small"
//               fullWidth
//               autoFocus
//               variant="filled"
//               InputProps={{
//                 disableUnderline: true,
//                 sx: { borderRadius: 2 },
//                 startAdornment: <SearchIcon sx={{ fontSize: 18, color: mutedColor, mr: 1 }} />,
//                 endAdornment: walletFilterSearchLoading ? <CircularProgress size={16} /> : null,
//               }}
//             />

//             {/* List */}
//             <Stack spacing={0.5} sx={{ maxHeight: 340, overflowY: 'auto', pr: 0.5 }}>
//               {walletFilterProvidersLoading || walletFilterSearchLoading ? (
//                 [1, 2, 3].map((i) => (
//                   <Skeleton key={i} variant="rounded" height={48} sx={{ borderRadius: 2 }} />
//                 ))
//               ) : walletFilterDisplayList.length === 0 ? (
//                 <Box sx={{ py: 4, textAlign: 'center' }}>
//                   <Typography variant="body2" color="text.secondary">
//                     {walletFilterIsSearchMode ? 'No providers found' : 'No providers available'}
//                   </Typography>
//                 </Box>
//               ) : (
//                 walletFilterDisplayList.map((p) => {
//                   const name = p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || `Provider #${p.id}`;
//                   const isSelected = p.id === walletFilterProvider?.id;
//                   return (
//                     <Box
//                       key={p.id}
//                       onClick={() => selectWalletFilterProvider(p)}
//                       sx={{
//                         p: 1.5, borderRadius: 2, cursor: 'pointer',
//                         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                         bgcolor: isSelected ? alpha(theme.palette.primary.main, isDark ? 0.2 : 0.08) : 'transparent',
//                         border: `1px solid ${isSelected ? theme.palette.primary.main : 'transparent'}`,
//                         '&:hover': {
//                           bgcolor: isSelected
//                             ? alpha(theme.palette.primary.main, isDark ? 0.25 : 0.12)
//                             : subtleBg,
//                         },
//                         transition: 'all 0.15s',
//                       }}
//                     >
//                       <Stack direction="row" spacing={1.5} alignItems="center">
//                         <Avatar sx={{
//                           width: 32, height: 32, fontSize: 12, fontWeight: 700,
//                           bgcolor: isSelected
//                             ? alpha(theme.palette.primary.main, 0.2)
//                             : alpha(theme.palette.common.white, isDark ? 0.08 : 0),
//                           color: isSelected ? 'primary.main' : mutedColor,
//                           border: `1px solid ${isSelected ? theme.palette.primary.main : borderColor}`,
//                         }}>
//                           {name.slice(0, 1)}
//                         </Avatar>
//                         <Box>
//                           <Typography variant="body2" sx={{ fontWeight: 600, color: headingColor, lineHeight: 1.3 }}>
//                             {name}
//                           </Typography>
//                           <Typography variant="caption" sx={{ color: mutedColor, fontSize: '0.72rem' }}>
//                             ID #{p.id}   phone : {p.phone || '—'}
//                             {p.is_active === false && '  ·  Inactive'}
//                           </Typography>
//                         </Box>
//                       </Stack>
//                       {isSelected && (
//                         <Box sx={{
//                           width: 20, height: 20, borderRadius: '50%',
//                           bgcolor: 'primary.main',
//                           display: 'grid', placeItems: 'center', flexShrink: 0,
//                         }}>
//                           <Typography sx={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>✓</Typography>
//                         </Box>
//                       )}
//                     </Box>
//                   );
//                 })
//               )}
//             </Stack>

//             {/* Pagination */}
//             {!walletFilterIsSearchMode && walletFilterProviderLastPage > 1 && (
//               <>
//                 <Divider sx={{ borderColor }} />
//                 <Stack direction="row" justifyContent="center">
//                   <Pagination
//                     count={walletFilterProviderLastPage}
//                     page={walletFilterProviderPage}
//                     size="small"
//                     onChange={(_, v) => fetchWalletFilterProviders(v)}
//                     color="primary"
//                     shape="rounded"
//                     disabled={walletFilterProvidersLoading}
//                   />
//                 </Stack>
//               </>
//             )}
//           </Stack>
//         </DialogContent>
//       </Dialog>

//       {/* ── Withdraw Dialog (Provider Wallet & Platform Revenue Wallet) ─── */}
//       <Dialog
//         open={withdrawOpen}
//         onClose={withdrawLoading ? undefined : closeWithdraw}
//         maxWidth="xs"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: 4,
//             backgroundImage: 'none',
//             bgcolor: surfaceBg,
//             border: `1px solid ${borderColor}`,
//             boxShadow: isDark
//               ? '0 20px 25px -5px rgba(0,0,0,0.5)'
//               : '0 20px 25px -5px rgba(0,0,0,0.1)',
//           },
//         }}
//       >
//         <DialogTitle sx={{
//           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//           fontWeight: 800, pb: 2, pt: 3, color: headingColor,
//         }}>
//           Withdraw Funds
//           <IconButton
//             onClick={closeWithdraw}
//             size="small"
//             disabled={withdrawLoading}
//             sx={{ bgcolor: subtleBg, border: `1px solid ${borderColor}` }}
//           >
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </DialogTitle>

//         <Divider sx={{ borderColor }} />

//         <DialogContent sx={{ p: 3 }}>
//           <Stack spacing={2.5}>
//             {withdrawTarget && (
//               <Box sx={{
//                 p: 2, borderRadius: 2, bgcolor: subtleBg,
//                 border: `1px solid ${borderColor}`,
//               }}>
//                 <Typography variant="body2" sx={{ fontWeight: 700, color: headingColor }}>
//                   {withdrawTarget.type === 'Platform Revenue Wallet'
//                     ? 'Platform Revenue Wallet'
//                     : (withdrawTarget.provider?.name || `Provider #${withdrawTarget.provider?.id}`)}
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary">
//                   Wallet #{withdrawTarget.id} · Current balance: {Number(withdrawTarget.balance).toFixed(2)} {withdrawTarget.currency}
//                 </Typography>
//               </Box>
//             )}

//             <TextField
//               label="Amount"
//               type="number"
//               value={withdrawAmount}
//               onChange={(e) => {
//                 const val = e.target.value;
//                 if (val === '' || /^\d+(\.\d{0,2})?$/.test(val)) setWithdrawAmount(val);
//               }}
//               inputProps={{ min: 1, step: 1 }}
//               InputProps={{
//                 disableUnderline: true,
//                 sx: { borderRadius: 2 },
//                 startAdornment: (
//                   <InputAdornment position="start">
//                     <Typography sx={{ color: mutedColor, fontWeight: 700 }}>$</Typography>
//                   </InputAdornment>
//                 ),
//               }}
//               variant="filled"
//               fullWidth
//               autoFocus
//             />

//             <Button
//               variant="contained"
//               size="large"
//               color="warning"
//               startIcon={withdrawLoading ? <CircularProgress size={18} color="inherit" /> : <RemoveCircleOutlineIcon />}
//               onClick={handleWithdrawSubmit}
//               disabled={withdrawLoading || !withdrawAmount}
//               sx={{
//                 borderRadius: 1, fontWeight: 700, py: 1.5,
//                 textTransform: 'none',
//                 boxShadow: '0 4px 12px 0 rgba(237,108,2,0.2)',
//               }}
//             >
//               {withdrawLoading ? 'Processing...' : 'Confirm Withdrawal'}
//             </Button>
//           </Stack>
//         </DialogContent>
//       </Dialog>

//       {/* ── Wallet Details Dialog ("Eye" button) ─── */}
//       <Dialog
//         open={detailsOpen}
//         onClose={closeDetails}
//         maxWidth="xs"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: 4,
//             backgroundImage: 'none',
//             bgcolor: surfaceBg,
//             border: `1px solid ${borderColor}`,
//             boxShadow: isDark
//               ? '0 20px 25px -5px rgba(0,0,0,0.5)'
//               : '0 20px 25px -5px rgba(0,0,0,0.1)',
//           },
//         }}
//       >
//         {detailsWallet && (() => {
//           const isPlatform = detailsWallet.type === 'Platform Revenue Wallet';
//           const name = isPlatform
//             ? 'Platform Revenue Wallet'
//             : (detailsWallet.provider?.name || `Provider #${detailsWallet.provider?.id ?? '—'}`);
//           const balanceNum = Number(detailsWallet.balance);
//           const isNegative = balanceNum < 0;

//           return (
//             <>
//               {/* Header banner with avatar + name + balance */}
//               <Box
//                 sx={{
//                   p: 3, pb: 2.5,
//                   background: isPlatform
//                     ? `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, isDark ? 0.25 : 0.12)}, ${alpha(theme.palette.secondary.main, 0)})`
//                     : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, isDark ? 0.25 : 0.12)}, ${alpha(theme.palette.primary.main, 0)})`,
//                 }}
//               >
//                 <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
//                   <Stack direction="row" spacing={1.75} alignItems="center">
//                     {isPlatform ? (
//                       <Box sx={{
//                         width: 52, height: 52, borderRadius: '50%',
//                         bgcolor: alpha(theme.palette.secondary.main, 0.2),
//                         display: 'grid', placeItems: 'center', color: 'secondary.main',
//                       }}>
//                         <AccountBalanceIcon sx={{ fontSize: 26 }} />
//                       </Box>
//                     ) : detailsWallet.provider?.image?.image_url ? (
//                       <Avatar src={detailsWallet.provider.image.image_url} sx={{ width: 52, height: 52 }} />
//                     ) : (
//                       <Avatar sx={{
//                         width: 52, height: 52, fontSize: 20, fontWeight: 700,
//                         bgcolor: alpha(theme.palette.primary.main, 0.2), color: 'primary.main',
//                       }}>
//                         {name.slice(0, 1)}
//                       </Avatar>
//                     )}
//                     <Box>
//                       <Typography variant="subtitle1" sx={{ fontWeight: 800, color: headingColor, lineHeight: 1.25 }}>
//                         {name}
//                       </Typography>
//                       <Chip
//                         size="small"
//                         label={detailsWallet.type}
//                         sx={{
//                           mt: 0.5, fontWeight: 600, fontSize: '0.68rem', height: 20,
//                           bgcolor: isPlatform
//                             ? alpha(theme.palette.secondary.main, 0.15)
//                             : alpha(theme.palette.primary.main, 0.12),
//                           color: isPlatform ? 'secondary.main' : 'primary.main',
//                         }}
//                       />
//                     </Box>
//                   </Stack>
//                   <IconButton
//                     onClick={closeDetails}
//                     size="small"
//                     sx={{ bgcolor: surfaceBg, border: `1px solid ${borderColor}` }}
//                   >
//                     <CloseIcon fontSize="small" />
//                   </IconButton>
//                 </Stack>

//                 <Box sx={{ mt: 2.5 }}>
//                   <Typography variant="caption" sx={{ color: mutedColor, fontWeight: 600 }}>
//                     Current Balance
//                   </Typography>
//                   <Typography
//                     variant="h4"
//                     sx={{ fontWeight: 900, lineHeight: 1.2, color: isNegative ? 'error.main' : headingColor }}
//                   >
//                     {balanceNum.toFixed(2)} <Typography component="span" variant="h6" sx={{ fontWeight: 700, color: mutedColor }}>{detailsWallet.currency}</Typography>
//                   </Typography>
//                 </Box>
//               </Box>

//               <Divider sx={{ borderColor }} />

//               <DialogContent sx={{ p: 3 }}>
//                 <Stack>
//                   {/* <DetailRow
//                     icon={<BadgeIcon sx={{ fontSize: 16 }} />}
//                     label="Wallet ID"
//                     value={`#${detailsWallet.id}`}
//                   />
//                   {!isPlatform && (
//                     <DetailRow
//                       icon={<PersonIcon sx={{ fontSize: 16 }} />}
//                       label="Provider ID"
//                       value={detailsWallet.provider?.id != null ? `#${detailsWallet.provider.id}` : '—'}
//                     />
//                   )} */}
//                   <DetailRow
//                     icon={<AccountBalanceWalletIcon sx={{ fontSize: 16 }} />}
//                     label="Overdraft Limit : "
//                     value={`${detailsWallet.overdraft_limit} ${detailsWallet.currency}`}
//                   />
//                   <DetailRow
//                     icon={detailsWallet.is_active ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : <CancelIcon sx={{ fontSize: 16 }} />}
//                     label="Status :"
//                     chip={
//                       <Chip
//                         size="small"
//                         label={detailsWallet.is_active ? 'Active' : 'Inactive'}
//                         sx={{
//                           fontWeight: 700, fontSize: '0.7rem',
//                           bgcolor: detailsWallet.is_active
//                             ? alpha(theme.palette.success.main, 0.12)
//                             : alpha(theme.palette.error.main, 0.1),
//                           color: detailsWallet.is_active ? 'success.main' : 'error.main',
//                         }}
//                       />
//                     }
//                   />
//                   <DetailRow
//                     icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
//                     label="Last Used : "
//                     value={detailsWallet.last_used || ' —'}
//                   />
//                   <DetailRow
//                     icon={<CalendarMonthIcon sx={{ fontSize: 16 }} />}
//                     label="Created At : "
//                     value={detailsWallet.created_at || '—'}
//                   />
//                   <DetailRow
//                     icon={<CalendarMonthIcon sx={{ fontSize: 16 }} />}
//                     label="Updated At :"
//                     value={detailsWallet.updated_at || '—'}
//                   />
//                 </Stack>

//                 <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
//                   <Button
//                     fullWidth
//                     variant="contained"
//                     color="warning"
//                     startIcon={<RemoveCircleOutlineIcon sx={{ fontSize: 18 }} />}
//                     disabled={!detailsWallet.is_active}
//                     onClick={() => { closeDetails(); openWithdraw(detailsWallet); }}
//                     sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 1.5, py: 1.2 }}
//                   >
//                     Withdraw
//                   </Button>
//                   <Button
//                     fullWidth
//                     variant="outlined"
//                     color={detailsWallet.is_active ? 'error' : 'success'}
//                     startIcon={detailsWallet.is_active ? <ToggleOffIcon sx={{ fontSize: 18 }} /> : <ToggleOnIcon sx={{ fontSize: 18 }} />}
//                     onClick={() => handleToggleWalletActive(detailsWallet)}
//                     sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 1.5, py: 1.2 }}
//                   >
//                     {detailsWallet.is_active ? 'Deactivate' : 'Activate'}
//                   </Button>
//                 </Stack>
//               </DialogContent>
//             </>
//           );
//         })()}
//       </Dialog>
//     </Stack>
//   );
// }

// export default WalletPage;

import { useEffect, useState, useRef } from 'react';
import {
  Box, Button, Card, CardContent, CircularProgress,
  Divider, Skeleton, Stack,
  TextField, Typography, Avatar, Pagination,
  Dialog, DialogContent, DialogTitle, IconButton,
  alpha, useTheme, InputAdornment, Chip,
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

// ── Locally-defined inline SVG icons ────────────────
// These avoid deep-import / barrel-import resolution issues with
// @mui/icons-material seen in this project's build setup.
function makeIcon(path) {
  return function IconCmp({ sx, style, ...rest }) {
    const size = sx?.fontSize ?? 20;
    return (
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill="currentColor"
        style={{ display: 'inline-block', flexShrink: 0, verticalAlign: 'middle', ...style }}
        {...rest}
      >
        <path d={path} />
      </svg>
    );
  };
}

const VisibilityIcon = makeIcon('M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12.5c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z');
const CheckCircleIcon = makeIcon('M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z');
const CancelIcon = makeIcon('M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z');
const FilterListIcon = makeIcon('M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z');
const PersonIcon = makeIcon('M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z');
const CalendarMonthIcon = makeIcon('M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z');
const AccessTimeIcon = makeIcon('M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm.5 5H11v6l5.25 3.15.75-1.23-4.5-2.67z');
const BadgeIcon = makeIcon('M20 6h-3V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9 4h6v2H9V4zm3 7c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm4 8H8v-.57c0-1.5 3-2.33 4-2.33s4 .83 4 2.33V19z');
const ToggleOnIcon = makeIcon('M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zm0 8c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z');
const ToggleOffIcon = makeIcon('M17 7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h10c2.76 0 5-2.24 5-5s-2.24-5-5-5zM7 15c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z');
const AccountBalanceIcon = makeIcon('M4 10h3v7H4zm6.5 0h3v7h-3zM2 19h20v3H2zm15-9h3v7h-3zm-5-9L2 6v2h20V6z');
const RemoveCircleOutlineIcon = makeIcon('M7 11v2h10v-2H7zm5-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z');
const EditIcon = makeIcon('M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 00-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z');

// ── Extract readable API error message ─────────────
function extractApiErrorMessage(err, fallback) {
  const data = err?.response?.data;
  if (data?.errors && typeof data.errors === 'object') {
    const messages = Object.values(data.errors).flat();
    if (messages.length) return messages.join(' — ');
  }
  return data?.message || err.message || fallback;
}

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

  // ── All Wallets ───────────────────────────────────
  const [wallets, setWallets] = useState([]);
  const [walletsLoading, setWalletsLoading] = useState(true);
  const [walletPageNum, setWalletPageNum] = useState(1);
  const [walletLastPage, setWalletLastPage] = useState(1);
  const [walletActiveFilter, setWalletActiveFilter] = useState('all'); // 'all' | '1' | '0'
  const [toggleLoadingId, setToggleLoadingId] = useState(null);

  // ── Wallet filter: pick a Provider (any status) ────
  const [walletProviderIdInput, setWalletProviderIdInput] = useState(''); // the id actually sent to the API
  const [walletFilterProvider, setWalletFilterProvider] = useState(null); // full provider object, for display

  const [walletPickerOpen, setWalletPickerOpen] = useState(false);
  const [walletFilterProviders, setWalletFilterProviders] = useState([]);
  const [walletFilterProvidersLoading, setWalletFilterProvidersLoading] = useState(false);
  const [walletFilterProviderPage, setWalletFilterProviderPage] = useState(1);
  const [walletFilterProviderLastPage, setWalletFilterProviderLastPage] = useState(1);

  const [walletFilterSearchQuery, setWalletFilterSearchQuery] = useState('');
  const [walletFilterSearchResults, setWalletFilterSearchResults] = useState([]);
  const [walletFilterSearchLoading, setWalletFilterSearchLoading] = useState(false);
  const [walletFilterIsSearchMode, setWalletFilterIsSearchMode] = useState(false);
  const walletFilterSearchDebounceRef = useRef(null);

  // ── Withdraw Dialog (shared: provider wallet + platform revenue wallet)
  const [withdrawOpen, setWithdrawOpen] = useState(false);
  const [withdrawTarget, setWithdrawTarget] = useState(null); // wallet object
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawLoading, setWithdrawLoading] = useState(false);

  // ── Wallet Details Dialog ───────────────────────────
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsWallet, setDetailsWallet] = useState(null);

  // ── Overdraft Limit Dialog (global — applies to all wallets) ──
  const [overdraftOpen, setOverdraftOpen] = useState(false);
  const [overdraftLimit, setOverdraftLimit] = useState('');
  const [overdraftLoading, setOverdraftLoading] = useState(false);

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

  // ── Fetch Wallets (paginated + is_active filter + provider_id search) ──
  async function fetchWallets(p = 1, activeFilter = walletActiveFilter, providerId = walletProviderIdInput) {
    try {
      setWalletsLoading(true);
      const params = new URLSearchParams();
      params.set('page', p);
      if (activeFilter !== 'all') params.set('is_active', activeFilter);
      if (providerId && providerId.toString().trim() !== '') {
        params.set('provider_id', providerId.toString().trim());
      }
      const res = await api.get(`/admin/wallet/all-wallets?${params.toString()}`);
      const raw = res.data.data;
      const list = Array.isArray(raw) ? raw : (raw?.data ?? []);
      setWallets(list);
      setWalletPageNum(raw?.current_page ?? p);
      setWalletLastPage(raw?.last_page ?? 1);
    } catch (err) {
      console.error(err);
      notify({ severity: 'error', message: extractApiErrorMessage(err, 'Failed to load wallets.') });
    } finally {
      setWalletsLoading(false);
    }
  }

  useEffect(() => {
    fetchProviders(1);
    fetchWallets(1, 'all');
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
      fetchWallets(walletPageNum);
    } catch (err) {
      console.error(err);
      notify({ severity: 'error', message: extractApiErrorMessage(err, 'Deposit failed. Please try again.') });
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
      fetchWallets(walletPageNum);
    } catch (err) {
      console.error(err);
      notify({ severity: 'error', message: extractApiErrorMessage(err, 'Refund failed. Please try again.') });
    } finally {
      setRefundLoading(false);
    }
  }

  // ── Withdraw Dialog open/close ─────────────────────
  function openWithdraw(wallet) {
    setWithdrawTarget(wallet);
    setWithdrawAmount('');
    setWithdrawOpen(true);
  }
  function closeWithdraw() {
    setWithdrawOpen(false);
    setWithdrawTarget(null);
    setWithdrawAmount('');
  }

  // ── Withdraw Submit (routes to correct endpoint based on wallet type)
  async function handleWithdrawSubmit() {
    if (!withdrawAmount || Number(withdrawAmount) <= 0) {
      notify({ severity: 'warning', message: 'Please enter a valid amount.' });
      return;
    }
    const isPlatformWallet = withdrawTarget?.type === 'Platform Revenue Wallet';
    try {
      setWithdrawLoading(true);
      if (isPlatformWallet) {
        await api.post('/admin/wallet/withdraw-from-platform-revenue', {
          amount: Number(withdrawAmount),
        });
      } else {
        await api.post('/admin/wallet/withdraw', {
          provider_id: withdrawTarget.provider?.id,
          amount: Number(withdrawAmount),
        });
      }
      notify({ severity: 'success', title: 'Withdrawal successful', message: `$${withdrawAmount} withdrawn successfully.` });
      closeWithdraw();
      fetchWallets(walletPageNum);
    } catch (err) {
      console.error(err);
      notify({ severity: 'error', message: extractApiErrorMessage(err, 'Withdrawal failed. Please try again.') });
    } finally {
      setWithdrawLoading(false);
    }
  }

  // ── Activate / Deactivate a wallet ─────────────────
  async function handleToggleWalletActive(wallet) {
    try {
      setToggleLoadingId(wallet.id);
      const endpoint = wallet.is_active ? '/admin/wallet/deactivate-wallet' : '/admin/wallet/activate-wallet';
      await api.post(endpoint, { wallet_id: wallet.id });
      notify({
        severity: 'success',
        message: `Wallet ${wallet.is_active ? 'deactivated' : 'activated'} successfully.`,
      });
      fetchWallets(walletPageNum);
    } catch (err) {
      console.error(err);
      notify({ severity: 'error', message: extractApiErrorMessage(err, 'Action failed. Please try again.') });
    } finally {
      setToggleLoadingId(null);
    }
  }

  // ── Wallet active filter change ────────────────────
  function handleWalletFilterChange(_, val) {
    if (val === null) return; // ignore un-toggle
    setWalletActiveFilter(val);
    fetchWallets(1, val, walletProviderIdInput);
  }

  // ── Overdraft Limit Dialog open/close ───────────────
  function openOverdraft() {
    // pre-fill with the current limit taken from any known wallet, if available
    const sample = wallets.find((w) => w.overdraft_limit != null);
    setOverdraftLimit(sample ? String(sample.overdraft_limit) : '');
    setOverdraftOpen(true);
  }
  function closeOverdraft() {
    setOverdraftOpen(false);
    setOverdraftLimit('');
  }

  // ── Overdraft Limit Submit (applies to ALL wallets) ──
  async function handleOverdraftSubmit() {
    if (overdraftLimit === '' || Number(overdraftLimit) < 0) {
      notify({ severity: 'warning', message: 'Please enter a valid limit.' });
      return;
    }
    try {
      setOverdraftLoading(true);
      await api.post('/admin/wallet/update-overdraft-limit', {
        new_limit: Number(overdraftLimit),
      });
      notify({
        severity: 'success',
        title: 'Overdraft limit updated',
        message: `New overdraft limit (${overdraftLimit}) applied to all wallets.`,
      });
      closeOverdraft();
      fetchWallets(walletPageNum);
    } catch (err) {
      console.error(err);
      notify({ severity: 'error', message: extractApiErrorMessage(err, 'Failed to update overdraft limit.') });
    } finally {
      setOverdraftLoading(false);
    }
  }

  // ── Wallet filter Provider Picker: fetch all providers (any status) ──
  async function fetchWalletFilterProviders(p = 1) {
    try {
      setWalletFilterProvidersLoading(true);
      const res = await api.get(`/admin/provider/all-providers?page=${p}`);
      const raw = res.data.data;
      const list = Array.isArray(raw) ? raw : (raw?.data ?? []);
      setWalletFilterProviders(list);
      setWalletFilterProviderPage(raw?.current_page ?? p);
      setWalletFilterProviderLastPage(raw?.last_page ?? 1);
    } catch (err) {
      console.error(err);
      notify({ severity: 'error', message: extractApiErrorMessage(err, 'Failed to load providers.') });
    } finally {
      setWalletFilterProvidersLoading(false);
    }
  }

  // ── Wallet filter Provider search (debounced 400ms) ──
  function handleWalletFilterSearchChange(query) {
    setWalletFilterSearchQuery(query);
    if (walletFilterSearchDebounceRef.current) clearTimeout(walletFilterSearchDebounceRef.current);
    if (!query.trim()) {
      setWalletFilterIsSearchMode(false);
      setWalletFilterSearchResults([]);
      return;
    }
    walletFilterSearchDebounceRef.current = setTimeout(async () => {
      try {
        setWalletFilterSearchLoading(true);
        setWalletFilterIsSearchMode(true);
        const res = await api.get(`/admin/provider/search?query=${encodeURIComponent(query.trim())}`);
        const raw = res.data.data;
        const list = Array.isArray(raw) ? raw : (raw?.data ?? []);
        setWalletFilterSearchResults(list);
      } catch (err) {
        console.error(err);
      } finally {
        setWalletFilterSearchLoading(false);
      }
    }, 400);
  }

  // ── Open / Close the wallet filter Provider Picker ──
  function openWalletPicker() {
    setWalletPickerOpen(true);
    if (walletFilterProviders.length === 0) fetchWalletFilterProviders(1);
  }
  function closeWalletPicker() {
    setWalletPickerOpen(false);
    setWalletFilterSearchQuery('');
    setWalletFilterIsSearchMode(false);
    setWalletFilterSearchResults([]);
  }

  // ── Pick a provider to filter wallets by ────────────
  function selectWalletFilterProvider(provider) {
    setWalletFilterProvider(provider);
    setWalletProviderIdInput(String(provider.id));
    fetchWallets(1, walletActiveFilter, provider.id);
    closeWalletPicker();
  }

  // ── Clear the wallet provider filter ────────────────
  function clearWalletFilterProvider() {
    setWalletFilterProvider(null);
    setWalletProviderIdInput('');
    fetchWallets(1, walletActiveFilter, '');
  }

  // ── Wallet Details Dialog open/close ───────────────
  function openDetails(wallet) {
    setDetailsWallet(wallet);
    setDetailsOpen(true);
  }
  function closeDetails() {
    setDetailsOpen(false);
    setDetailsWallet(null);
  }

  // ── Derived ───────────────────────────────────────
  const allKnownProviders = [...providers, ...searchResults];
  const depositProvider = allKnownProviders.find((p) => p.id === depositProviderId);
  const refundProvider  = allKnownProviders.find((p) => p.id === refundProviderId);
  const displayList = isSearchMode ? searchResults : providers;
  const walletFilterDisplayList = walletFilterIsSearchMode ? walletFilterSearchResults : walletFilterProviders;

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

  // ── Reusable Detail Row (wallet details dialog) ────
  function DetailRow({ icon, label, value, valueColor, chip }) {
    return (
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{
          py: 1.4, px: 0.5,
          borderBottom: `1px solid ${borderColor}`,
          '&:last-of-type': { borderBottom: 'none' },
        }}
      >
        <Stack direction="row" spacing={1.2} alignItems="center">
          <Box sx={{
            width: 30, height: 30, borderRadius: 1.5,
            bgcolor: alpha(theme.palette.text.primary, isDark ? 0.06 : 0.04),
            display: 'grid', placeItems: 'center', color: mutedColor, flexShrink: 0,
          }}>
            {icon}
          </Box>
          <Typography variant="body2" sx={{ color: mutedColor, fontWeight: 500 }}>
            {label}
          </Typography>
        </Stack>
        {chip ? chip : (
          <Typography variant="body2" sx={{ fontWeight: 700, color: valueColor || headingColor, textAlign: isRtl ? 'left' : 'right' }}>
            {value}
          </Typography>
        )}
      </Stack>
    );
  }

  return (
    <Stack
      spacing={4}
      dir={isRtl ? 'rtl' : 'ltr'}
      sx={{ p: { xs: 1, md: 3 }, bgcolor: 'background.default', minHeight: '100vh' }}
    >
      <PageHeader title={t('wallet.title')} subtitle={t('wallet.subtitle')} />

      {/* ── Top Row: Deposit | Refund ────────────── */}
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

      {/* ── All Wallets Card ──────────────────────── */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          boxShadow: isDark ? '0 4px 20px 0 rgba(0,0,0,0.3)' : '0 4px 20px 0 rgba(0,0,0,0.05)',
          bgcolor: surfaceBg,
          border: `1px solid ${borderColor}`,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={3}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ xs: 'flex-start', md: 'center' }} justifyContent="space-between">
              <Stack direction="row" spacing={2} alignItems="center">
                <Box sx={{
                  width: 44, height: 44, borderRadius: 2.5,
                  bgcolor: alpha(theme.palette.info.main, isDark ? 0.2 : 0.1),
                  display: 'grid', placeItems: 'center', color: 'info.main',
                }}>
                  <AccountBalanceWalletIcon />
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: headingColor }}>
                    All Wallets
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                    Provider wallets and platform revenue wallet
                  </Typography>
                </Box>
                <Button
                  size="small"
                  variant="outlined"
                  startIcon={<EditIcon sx={{ fontSize: 16 }} />}
                  onClick={openOverdraft}
                  sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1, ml: 1 }}
                >
                  Overdraft Limit
                </Button>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ xs: 'stretch', sm: 'center' }} sx={{ width: { xs: '100%', md: 'auto' } }}>
                {/* Provider picker trigger — pick from list or search by name */}
                <Box
                  onClick={openWalletPicker}
                  sx={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    gap: 1, cursor: 'pointer',
                    px: 1.75, py: 1, borderRadius: 1,
                    minWidth: { xs: '100%', sm: 240 },
                    bgcolor: subtleBg,
                    border: `1px solid ${walletFilterProvider ? theme.palette.primary.main : borderColor}`,
                    '&:hover': { borderColor: 'primary.main' },
                    transition: 'border-color 0.2s',
                  }}
                >
                  <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                    {walletFilterProvider ? (
                      <Avatar sx={{
                        width: 24, height: 24, fontSize: 11, fontWeight: 700,
                        bgcolor: alpha(theme.palette.primary.main, 0.15), color: 'primary.main',
                      }}>
                        {(walletFilterProvider.first_name || walletFilterProvider.name || '?').slice(0, 1)}
                      </Avatar>
                    ) : (
                      <SearchIcon sx={{ fontSize: 18, color: mutedColor }} />
                    )}
                    <Typography
                      variant="body2"
                      noWrap
                      sx={{ fontWeight: 600, color: walletFilterProvider ? headingColor : mutedColor }}
                    >
                      {walletFilterProvider
                        ? (walletFilterProvider.name || `${walletFilterProvider.first_name || ''} ${walletFilterProvider.last_name || ''}`.trim())
                        : 'Search by Provider'}
                    </Typography>
                  </Stack>
                  {walletFilterProvider && (
                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); clearWalletFilterProvider(); }}
                      sx={{ p: 0.3 }}
                    >
                      <CloseIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                  )}
                </Box>

                {/* Active / Inactive pill filter */}
                <Stack
                  direction="row"
                  sx={{
                    p: 0.5, borderRadius: 1,
                    bgcolor: subtleBg,
                    border: `1px solid ${borderColor}`,
                    width: 'fit-content',
                  }}
                >
                  {[
                    { value: 'all', label: 'All', icon: <FilterListIcon sx={{ fontSize: 16 }} /> },
                    { value: '1', label: 'Active', icon: <CheckCircleIcon sx={{ fontSize: 16 }} /> },
                    { value: '0', label: 'Inactive', icon: <CancelIcon sx={{ fontSize: 16 }} /> },
                  ].map((opt) => {
                    const selected = walletActiveFilter === opt.value;
                    return (
                      <Box
                        key={opt.value}
                        onClick={() => handleWalletFilterChange(null, opt.value)}
                        sx={{
                          display: 'flex', alignItems: 'center', gap: 0.6,
                          px: 1.75, py: 0.75, borderRadius: 1, cursor: 'pointer',
                          fontSize: '0.8rem', fontWeight: 700, whiteSpace: 'nowrap',
                          color: selected ? '#fff' : mutedColor,
                          bgcolor: selected
                            ? (opt.value === '1' ? 'success.main' : opt.value === '0' ? 'error.main' : 'primary.main')
                            : 'transparent',
                          transition: 'all 0.15s',
                          '&:hover': { bgcolor: selected ? undefined : alpha(theme.palette.text.primary, isDark ? 0.06 : 0.04) },
                        }}
                      >
                        {opt.icon}
                        {opt.label}
                      </Box>
                    );
                  })}
                </Stack>
              </Stack>
            </Stack>

            <Divider sx={{ borderColor }} />

            <Stack spacing={1.5}>
              {walletsLoading ? (
                [1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} variant="rounded" height={72} sx={{ borderRadius: 2 }} />
                ))
              ) : wallets.length === 0 ? (
                <Box sx={{ py: 5, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    No wallets found.
                  </Typography>
                </Box>
              ) : (
                wallets.map((wallet) => {
                  const isPlatform = wallet.type === 'Platform Revenue Wallet';
                  const name = isPlatform
                    ? 'Platform Revenue Wallet'
                    : (wallet.provider?.name || `Provider #${wallet.provider?.id ?? '—'}`);
                  const balanceNum = Number(wallet.balance);
                  const isNegative = balanceNum < 0;
                  const isToggling = toggleLoadingId === wallet.id;

                  return (
                    <Box
                      key={wallet.id}
                      sx={{
                        p: 2, borderRadius: 2,
                        bgcolor: subtleBg,
                        border: `1px solid ${borderColor}`,
                        display: 'flex', flexWrap: 'wrap', rowGap: 1.5,
                        alignItems: 'center', justifyContent: 'space-between',
                      }}
                    >
                      {/* Identity */}
                      <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 220, flex: 1 }}>
                        {isPlatform ? (
                          <Box sx={{
                            width: 36, height: 36, borderRadius: '50%',
                            bgcolor: alpha(theme.palette.secondary.main, 0.15),
                            display: 'grid', placeItems: 'center', color: 'secondary.main', flexShrink: 0,
                          }}>
                            <AccountBalanceIcon sx={{ fontSize: 18 }} />
                          </Box>
                        ) : wallet.provider?.image?.image_url ? (
                          <Avatar src={wallet.provider.image.image_url} sx={{ width: 36, height: 36 }} />
                        ) : (
                          <Avatar sx={{
                            width: 36, height: 36, fontSize: 13, fontWeight: 700,
                            bgcolor: alpha(theme.palette.primary.main, 0.15), color: 'primary.main',
                          }}>
                            {name.slice(0, 1)}
                          </Avatar>
                        )}
                        <Box sx={{ minWidth: 0 }}>
                          <Typography variant="body2" sx={{ fontWeight: 700, color: headingColor }} noWrap>
                            {name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {/* Wallet #{wallet.id} */}
                            {!isPlatform && wallet.provider?.id != null 
                            // && ` · Provider #${wallet.provider.id}`
                            }
                            {wallet.last_used && `  Last used ${wallet.last_used}`}
                          </Typography>
                        </Box>
                      </Stack>

                      {/* Type chip */}
                      <Chip
                        size="small"
                        label={wallet.type}
                        sx={{
                          fontWeight: 600, fontSize: '0.7rem',
                          bgcolor: isPlatform
                            ? alpha(theme.palette.secondary.main, 0.12)
                            : alpha(theme.palette.primary.main, 0.1),
                          color: isPlatform ? 'secondary.main' : 'primary.main',
                        }}
                      />

                      {/* Balance */}
                      <Box sx={{ minWidth: 110, textAlign: isRtl ? 'left' : 'right' }}>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 800, color: isNegative ? 'error.main' : headingColor }}
                        >
                          {balanceNum.toFixed(2)} {wallet.currency}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Overdraft : {wallet.overdraft_limit}
                        </Typography>
                      </Box>

                      {/* Active status */}
                      <Chip
                        size="small"
                        label={wallet.is_active ? 'Active' : 'Inactive'}
                        sx={{
                          fontWeight: 700, fontSize: '0.7rem',
                          bgcolor: wallet.is_active
                            ? alpha(theme.palette.success.main, 0.12)
                            : alpha(theme.palette.error.main, 0.1),
                          color: wallet.is_active ? 'success.main' : 'error.main',
                        }}
                      />

                      {/* Actions */}
                      <Stack direction="row" spacing={1}>
                        <IconButton
                          size="small"
                          onClick={() => openDetails(wallet)}
                          sx={{
                            bgcolor: subtleBg,
                            border: `1px solid ${borderColor}`,
                            '&:hover': { borderColor: 'primary.main', color: 'primary.main' },
                          }}
                        >
                          <VisibilityIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                        <Button
                          size="small"
                          variant="outlined"
                          color="warning"
                          startIcon={<RemoveCircleOutlineIcon sx={{ fontSize: 16 }} />}
                          onClick={() => openWithdraw(wallet)}
                          disabled={!wallet.is_active}
                          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5 }}
                        >
                          Withdraw
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color={wallet.is_active ? 'error' : 'success'}
                          startIcon={
                            isToggling
                              ? <CircularProgress size={14} color="inherit" />
                              : wallet.is_active
                                ? <ToggleOffIcon sx={{ fontSize: 16 }} />
                                : <ToggleOnIcon sx={{ fontSize: 16 }} />
                          }
                          onClick={() => handleToggleWalletActive(wallet)}
                          disabled={isToggling}
                          sx={{ textTransform: 'none', fontWeight: 600, borderRadius: 1.5 }}
                        >
                          {wallet.is_active ? 'Deactivate' : 'Activate'}
                        </Button>
                      </Stack>
                    </Box>
                  );
                })
              )}
            </Stack>

            {walletLastPage > 1 && (
              <Stack direction="row" justifyContent="center" sx={{ pt: 1 }}>
                <Pagination
                  count={walletLastPage}
                  page={walletPageNum}
                  size="small"
                  onChange={(_, v) => fetchWallets(v)}
                  color="primary"
                  shape="rounded"
                  disabled={walletsLoading}
                />
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

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

      {/* ── Wallet Filter Provider Picker Dialog (any status) ─── */}
      <Dialog
        open={walletPickerOpen}
        onClose={closeWalletPicker}
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
            onClick={closeWalletPicker}
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
              value={walletFilterSearchQuery}
              onChange={(e) => handleWalletFilterSearchChange(e.target.value)}
              size="small"
              fullWidth
              autoFocus
              variant="filled"
              InputProps={{
                disableUnderline: true,
                sx: { borderRadius: 2 },
                startAdornment: <SearchIcon sx={{ fontSize: 18, color: mutedColor, mr: 1 }} />,
                endAdornment: walletFilterSearchLoading ? <CircularProgress size={16} /> : null,
              }}
            />

            {/* List */}
            <Stack spacing={0.5} sx={{ maxHeight: 340, overflowY: 'auto', pr: 0.5 }}>
              {walletFilterProvidersLoading || walletFilterSearchLoading ? (
                [1, 2, 3].map((i) => (
                  <Skeleton key={i} variant="rounded" height={48} sx={{ borderRadius: 2 }} />
                ))
              ) : walletFilterDisplayList.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {walletFilterIsSearchMode ? 'No providers found' : 'No providers available'}
                  </Typography>
                </Box>
              ) : (
                walletFilterDisplayList.map((p) => {
                  const name = p.name || `${p.first_name || ''} ${p.last_name || ''}`.trim() || `Provider #${p.id}`;
                  const isSelected = p.id === walletFilterProvider?.id;
                  return (
                    <Box
                      key={p.id}
                      onClick={() => selectWalletFilterProvider(p)}
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
                          {name.slice(0, 1)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: headingColor, lineHeight: 1.3 }}>
                            {name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: mutedColor, fontSize: '0.72rem' }}>
                            ID #{p.id}   phone : {p.phone || '—'}
                            {p.is_active === false && '  ·  Inactive'}
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
            {!walletFilterIsSearchMode && walletFilterProviderLastPage > 1 && (
              <>
                <Divider sx={{ borderColor }} />
                <Stack direction="row" justifyContent="center">
                  <Pagination
                    count={walletFilterProviderLastPage}
                    page={walletFilterProviderPage}
                    size="small"
                    onChange={(_, v) => fetchWalletFilterProviders(v)}
                    color="primary"
                    shape="rounded"
                    disabled={walletFilterProvidersLoading}
                  />
                </Stack>
              </>
            )}
          </Stack>
        </DialogContent>
      </Dialog>

      {/* ── Withdraw Dialog (Provider Wallet & Platform Revenue Wallet) ─── */}
      <Dialog
        open={withdrawOpen}
        onClose={withdrawLoading ? undefined : closeWithdraw}
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
          Withdraw Funds
          <IconButton
            onClick={closeWithdraw}
            size="small"
            disabled={withdrawLoading}
            sx={{ bgcolor: subtleBg, border: `1px solid ${borderColor}` }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <Divider sx={{ borderColor }} />

        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            {withdrawTarget && (
              <Box sx={{
                p: 2, borderRadius: 2, bgcolor: subtleBg,
                border: `1px solid ${borderColor}`,
              }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: headingColor }}>
                  {withdrawTarget.type === 'Platform Revenue Wallet'
                    ? 'Platform Revenue Wallet'
                    : (withdrawTarget.provider?.name || `Provider #${withdrawTarget.provider?.id}`)}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Wallet #{withdrawTarget.id} · Current balance: {Number(withdrawTarget.balance).toFixed(2)} {withdrawTarget.currency}
                </Typography>
              </Box>
            )}

            <TextField
              label="Amount"
              type="number"
              value={withdrawAmount}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || /^\d+(\.\d{0,2})?$/.test(val)) setWithdrawAmount(val);
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
              autoFocus
            />

            <Button
              variant="contained"
              size="large"
              color="warning"
              startIcon={withdrawLoading ? <CircularProgress size={18} color="inherit" /> : <RemoveCircleOutlineIcon />}
              onClick={handleWithdrawSubmit}
              disabled={withdrawLoading || !withdrawAmount}
              sx={{
                borderRadius: 1, fontWeight: 700, py: 1.5,
                textTransform: 'none',
                boxShadow: '0 4px 12px 0 rgba(237,108,2,0.2)',
              }}
            >
              {withdrawLoading ? 'Processing...' : 'Confirm Withdrawal'}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* ── Overdraft Limit Dialog ─── */}
      <Dialog
        open={overdraftOpen}
        onClose={overdraftLoading ? undefined : closeOverdraft}
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
          Update Overdraft Limit
          <IconButton
            onClick={closeOverdraft}
            size="small"
            disabled={overdraftLoading}
            sx={{ bgcolor: subtleBg, border: `1px solid ${borderColor}` }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <Divider sx={{ borderColor }} />

        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <Box sx={{
              p: 2, borderRadius: 2,
              bgcolor: alpha(theme.palette.warning.main, isDark ? 0.12 : 0.08),
              border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
            }}>
              <Typography variant="body2" sx={{ fontWeight: 700, color: 'warning.dark' }}>
                This applies to ALL wallets
              </Typography>
              <Typography variant="caption" color="text.secondary">
                The new limit will replace the overdraft limit currently set on every provider and platform wallet.
              </Typography>
            </Box>

            <TextField
              label="New Overdraft Limit"
              type="number"
              value={overdraftLimit}
              onChange={(e) => {
                const val = e.target.value;
                if (val === '' || /^\d+(\.\d{0,2})?$/.test(val)) setOverdraftLimit(val);
              }}
              inputProps={{ min: 0, step: 1 }}
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
              autoFocus
            />

            <Button
              variant="contained"
              size="large"
              startIcon={overdraftLoading ? <CircularProgress size={18} color="inherit" /> : <EditIcon />}
              onClick={handleOverdraftSubmit}
              disabled={overdraftLoading || overdraftLimit === ''}
              sx={{
                borderRadius: 1, fontWeight: 700, py: 1.5,
                textTransform: 'none',
                boxShadow: '0 4px 12px 0 rgba(25,118,210,0.2)',
              }}
            >
              {overdraftLoading ? 'Processing...' : 'Update Limit'}
            </Button>
          </Stack>
        </DialogContent>
      </Dialog>

      {/* ── Wallet Details Dialog ("Eye" button) ─── */}
      <Dialog
        open={detailsOpen}
        onClose={closeDetails}
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
        {detailsWallet && (() => {
          const isPlatform = detailsWallet.type === 'Platform Revenue Wallet';
          const name = isPlatform
            ? 'Platform Revenue Wallet'
            : (detailsWallet.provider?.name || `Provider #${detailsWallet.provider?.id ?? '—'}`);
          const balanceNum = Number(detailsWallet.balance);
          const isNegative = balanceNum < 0;

          return (
            <>
              {/* Header banner with avatar + name + balance */}
              <Box
                sx={{
                  p: 3, pb: 2.5,
                  background: isPlatform
                    ? `linear-gradient(135deg, ${alpha(theme.palette.secondary.main, isDark ? 0.25 : 0.12)}, ${alpha(theme.palette.secondary.main, 0)})`
                    : `linear-gradient(135deg, ${alpha(theme.palette.primary.main, isDark ? 0.25 : 0.12)}, ${alpha(theme.palette.primary.main, 0)})`,
                }}
              >
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between">
                  <Stack direction="row" spacing={1.75} alignItems="center">
                    {isPlatform ? (
                      <Box sx={{
                        width: 52, height: 52, borderRadius: '50%',
                        bgcolor: alpha(theme.palette.secondary.main, 0.2),
                        display: 'grid', placeItems: 'center', color: 'secondary.main',
                      }}>
                        <AccountBalanceIcon sx={{ fontSize: 26 }} />
                      </Box>
                    ) : detailsWallet.provider?.image?.image_url ? (
                      <Avatar src={detailsWallet.provider.image.image_url} sx={{ width: 52, height: 52 }} />
                    ) : (
                      <Avatar sx={{
                        width: 52, height: 52, fontSize: 20, fontWeight: 700,
                        bgcolor: alpha(theme.palette.primary.main, 0.2), color: 'primary.main',
                      }}>
                        {name.slice(0, 1)}
                      </Avatar>
                    )}
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, color: headingColor, lineHeight: 1.25 }}>
                        {name}
                      </Typography>
                      <Chip
                        size="small"
                        label={detailsWallet.type}
                        sx={{
                          mt: 0.5, fontWeight: 600, fontSize: '0.68rem', height: 20,
                          bgcolor: isPlatform
                            ? alpha(theme.palette.secondary.main, 0.15)
                            : alpha(theme.palette.primary.main, 0.12),
                          color: isPlatform ? 'secondary.main' : 'primary.main',
                        }}
                      />
                    </Box>
                  </Stack>
                  <IconButton
                    onClick={closeDetails}
                    size="small"
                    sx={{ bgcolor: surfaceBg, border: `1px solid ${borderColor}` }}
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Stack>

                <Box sx={{ mt: 2.5 }}>
                  <Typography variant="caption" sx={{ color: mutedColor, fontWeight: 600 }}>
                    Current Balance
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{ fontWeight: 900, lineHeight: 1.2, color: isNegative ? 'error.main' : headingColor }}
                  >
                    {balanceNum.toFixed(2)} <Typography component="span" variant="h6" sx={{ fontWeight: 700, color: mutedColor }}>{detailsWallet.currency}</Typography>
                  </Typography>
                </Box>
              </Box>

              <Divider sx={{ borderColor }} />

              <DialogContent sx={{ p: 3 }}>
                <Stack>
                  {/* <DetailRow
                    icon={<BadgeIcon sx={{ fontSize: 16 }} />}
                    label="Wallet ID"
                    value={`#${detailsWallet.id}`}
                  /> */}
                  {/* {!isPlatform && (
                    <DetailRow
                      icon={<PersonIcon sx={{ fontSize: 16 }} />}
                      label="Provider ID"
                      value={detailsWallet.provider?.id != null ? `#${detailsWallet.provider.id}` : '—'}
                    />
                  )} */}
                  <DetailRow
                    icon={<AccountBalanceWalletIcon sx={{ fontSize: 16 }} />}
                    label="Overdraft Limit : "
                    value={`${detailsWallet.overdraft_limit} ${detailsWallet.currency}`}
                  />
                  <DetailRow
                    icon={detailsWallet.is_active ? <CheckCircleIcon sx={{ fontSize: 16 }} /> : <CancelIcon sx={{ fontSize: 16 }} />}
                    label="Status "
                    chip={
                      <Chip
                        size="small"
                        label={detailsWallet.is_active ? 'Active' : 'Inactive'}
                        sx={{
                          fontWeight: 700, fontSize: '0.7rem',
                          bgcolor: detailsWallet.is_active
                            ? alpha(theme.palette.success.main, 0.12)
                            : alpha(theme.palette.error.main, 0.1),
                          color: detailsWallet.is_active ? 'success.main' : 'error.main',
                        }}
                      />
                    }
                  />
                  <DetailRow
                    icon={<AccessTimeIcon sx={{ fontSize: 16 }} />}
                    label="Last Used : "
                    value={detailsWallet.last_used || '—'}
                  />
                  <DetailRow
                    icon={<CalendarMonthIcon sx={{ fontSize: 16 }} />}
                    label="Created At : "
                    value={ detailsWallet.created_at || '—'}
                  />
                  <DetailRow
                    icon={<CalendarMonthIcon sx={{ fontSize: 16 }} />}
                    label="Updated At : "
                    value={detailsWallet.updated_at || '—'}
                  />
                </Stack>

                <Stack direction="row" spacing={1.5} sx={{ mt: 3 }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="warning"
                    startIcon={<RemoveCircleOutlineIcon sx={{ fontSize: 18 }} />}
                    disabled={!detailsWallet.is_active}
                    onClick={() => { closeDetails(); openWithdraw(detailsWallet); }}
                    sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 1.5, py: 1.2 }}
                  >
                    Withdraw
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color={detailsWallet.is_active ? 'error' : 'success'}
                    startIcon={detailsWallet.is_active ? <ToggleOffIcon sx={{ fontSize: 18 }} /> : <ToggleOnIcon sx={{ fontSize: 18 }} />}
                    onClick={() => handleToggleWalletActive(detailsWallet)}
                    sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 1.5, py: 1.2 }}
                  >
                    {detailsWallet.is_active ? 'Deactivate' : 'Activate'}
                  </Button>
                </Stack>
              </DialogContent>
            </>
          );
        })()}
      </Dialog>
    </Stack>
  );
}

export default WalletPage;