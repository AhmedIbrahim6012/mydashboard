// import { useEffect, useState, useCallback, useRef } from 'react';
// import {
//   Box, Button, Card, CardContent, Chip, CircularProgress,
//   Divider, MenuItem, Skeleton, Stack,
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//   TextField, Typography, Pagination,
//   Dialog, DialogContent, DialogTitle, DialogActions, IconButton, Collapse, alpha, useTheme,
//   Tooltip, Avatar,
// } from '@mui/material';
// import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import CloseIcon from '@mui/icons-material/Close';
// import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
// import SearchIcon from '@mui/icons-material/Search';
// import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
// import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
// import PageHeader from '../components/PageHeader';
// import { useTranslation } from 'react-i18next';
// import {
//   fetchOffers, suspendOffer, unsuspendOffer, extractApiErrorMessage, OFFER_STATUS_OPTIONS,
// } from '../services/offersService';
// import { fetchAllProviders, searchProviders } from '../services/accountsService';
// import { useAppContext } from '../context/AppContext';

// const EMPTY_FILTERS = {
//   status: '',
//   is_active: '',
//   provider_id: '',
// };

// // ── date helpers (same pattern used across Complaints/Restrictions/Transactions) ──
// function toUTC3(dateStr) {
//   if (!dateStr) return '—';
//   const date = new Date(dateStr.replace(' ', 'T') + 'Z');
//   if (isNaN(date)) return dateStr;
//   return new Intl.DateTimeFormat('en-GB', {
//     timeZone: 'Asia/Riyadh',
//     year: 'numeric', month: '2-digit', day: '2-digit',
//     hour: '2-digit', minute: '2-digit', second: '2-digit',
//     hour12: false,
//   }).format(date);
// }

// function formatDateOnly(dateStr) {
//   if (!dateStr) return '—';
//   const date = new Date(`${dateStr}T00:00:00Z`);
//   if (isNaN(date)) return dateStr;
//   return new Intl.DateTimeFormat('en-GB', {
//     timeZone: 'Asia/Riyadh', year: 'numeric', month: '2-digit', day: '2-digit',
//   }).format(date);
// }

// function getAccountName(acc) {
//   if (!acc) return '';
//   if (acc.name) return acc.name;
//   if (acc.full_name) return acc.full_name;
//   const combined = `${acc.first_name || ''} ${acc.last_name || ''}`.trim();
//   return combined || acc.username || acc.email || `#${acc.id}`;
// }

// // ── Status chip (dark-mode aware, same tokens as complaintStatus.js) ──
// const STATUS_STYLES = {
//   active: {
//     color: '#0f9d58',
//     background: '#e6f7ee', border: '#b7ebd2',
//     darkBackground: alpha('#22c55e', 0.18), darkBorder: alpha('#22c55e', 0.4),
//   },
//   upcoming: {
//     color: '#2563eb',
//     background: '#eaf1ff', border: '#c3d9ff',
//     darkBackground: alpha('#3b82f6', 0.18), darkBorder: alpha('#3b82f6', 0.4),
//   },
//   expired: {
//     color: '#64748b',
//     background: '#f1f5f9', border: '#e2e8f0',
//     darkBackground: alpha('#94a3b8', 0.16), darkBorder: alpha('#94a3b8', 0.35),
//   },
// };
// function getOfferStatusStyle(status) {
//   return STATUS_STYLES[status] || STATUS_STYLES.expired;
// }

// function StatusChip({ status, t }) {
//   const theme = useTheme();
//   const isDark = theme.palette.mode === 'dark';
//   const style = getOfferStatusStyle(status);
//   return (
//     <Chip
//       label={t(`offers.statusValues.${status}`, status)}
//       size="small"
//       sx={{
//         fontWeight: 700,
//         borderRadius: '8px',
//         backgroundColor: isDark ? style.darkBackground : style.background,
//         color: style.color,
//         border: `1px solid ${isDark ? style.darkBorder : style.border}`,
//         px: 0.5,
//       }}
//     />
//   );
// }

// function SuspendedChip({ isSuspended, t }) {
//   const theme = useTheme();
//   const isDark = theme.palette.mode === 'dark';
//   if (!isSuspended) {
//     return (
//       <Chip
//         label={t('offers.notSuspended', 'Active')}
//         size="small"
//         sx={{
//           fontWeight: 700, borderRadius: '8px', px: 0.5,
//           backgroundColor: isDark ? alpha(theme.palette.success.main, 0.18) : alpha(theme.palette.success.main, 0.1),
//           color: theme.palette.success.main,
//           border: `1px solid ${isDark ? alpha(theme.palette.success.main, 0.4) : alpha(theme.palette.success.main, 0.3)}`,
//         }}
//       />
//     );
//   }
//   return (
//     <Chip
//       label={t('offers.suspended', 'Suspended')}
//       size="small"
//       sx={{
//         fontWeight: 700, borderRadius: '8px', px: 0.5,
//         backgroundColor: isDark ? alpha(theme.palette.error.main, 0.18) : alpha(theme.palette.error.main, 0.1),
//         color: theme.palette.error.main,
//         border: `1px solid ${isDark ? alpha(theme.palette.error.main, 0.4) : alpha(theme.palette.error.main, 0.3)}`,
//       }}
//     />
//   );
// }

// // ── Page ─────────────────────────────────────────────
// function OffersPage() {
//   const { t, i18n } = useTranslation();
//   const isRtl = i18n.dir() === 'rtl';
//   const { notify } = useAppContext();
//   const theme = useTheme();
//   const isDark = theme.palette.mode === 'dark';

//   // ── Offers ────────────────────────────────────────
//   const [offers, setOffers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [lastPage, setLastPage] = useState(1);
//   const [total, setTotal] = useState(0);

//   // ── Filters ───────────────────────────────────────
//   const [filters, setFilters] = useState(EMPTY_FILTERS);
//   const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
//   const [filtersOpen, setFiltersOpen] = useState(false);
//   const [selectedProvider, setSelectedProvider] = useState(null); // { id, name }

//   // ── Details dialog ────────────────────────────────
//   const [detailsOpen, setDetailsOpen] = useState(false);
//   const [selectedOffer, setSelectedOffer] = useState(null);

//   // ── Suspend / Unsuspend confirm dialog ─────────────
//   const [confirmTarget, setConfirmTarget] = useState(null); // offer row
//   const [confirmAction, setConfirmAction] = useState(null); // 'suspend' | 'unsuspend'
//   const [confirmLoading, setConfirmLoading] = useState(false);

//   // ── Provider picker dialog ─────────────────────────
//   const [pickerOpen, setPickerOpen] = useState(false);
//   const [pickerList, setPickerList] = useState([]);
//   const [pickerPage, setPickerPage] = useState(1);
//   const [pickerLastPage, setPickerLastPage] = useState(1);
//   const [pickerLoading, setPickerLoading] = useState(false);
//   const [pickerSearch, setPickerSearch] = useState('');
//   const [pickerSearchResults, setPickerSearchResults] = useState([]);
//   const [pickerSearchLoading, setPickerSearchLoading] = useState(false);
//   const [pickerIsSearchMode, setPickerIsSearchMode] = useState(false);
//   const pickerSearchRef = useRef(null);

//   // ── Fetch Offers ──────────────────────────────────
//   const loadOffers = useCallback(async (p = 1, f = appliedFilters) => {
//     try {
//       setLoading(true);
//       const res = await fetchOffers({
//         status: f.status,
//         isActive: f.is_active,
//         providerId: f.provider_id,
//         page: p,
//       });
//       const payload = res?.data;
//       const list = Array.isArray(payload) ? payload : (payload?.data ?? []);
//       setOffers(list);
//       setTotal(payload?.total ?? list.length);
//       setLastPage(payload?.last_page ?? 1);
//       setPage(payload?.current_page ?? p);
//     } catch (err) {
//       notify({ severity: 'error', title: t('offers.loadError', 'Failed to load offers'), message: extractApiErrorMessage(err, '') });
//       setOffers([]);
//     } finally {
//       setLoading(false);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [appliedFilters]);

//   useEffect(() => {
//     loadOffers(page, appliedFilters);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [page, appliedFilters]);

//   // ── Provider Picker helpers ────────────────────────
//   async function fetchPickerList(p = 1) {
//     try {
//       setPickerLoading(true);
//       const { list, currentPage, lastPage: lp } = await fetchAllProviders(p);
//       setPickerList(list);
//       setPickerPage(currentPage);
//       setPickerLastPage(lp);
//     } catch (err) {
//       notify({ severity: 'error', title: t('offers.pickerLoadError', 'Failed to load providers'), message: extractApiErrorMessage(err, '') });
//     } finally {
//       setPickerLoading(false);
//     }
//   }

//   function handlePickerSearchChange(query) {
//     setPickerSearch(query);
//     if (pickerSearchRef.current) clearTimeout(pickerSearchRef.current);
//     if (!query.trim()) {
//       setPickerIsSearchMode(false);
//       setPickerSearchResults([]);
//       return;
//     }
//     pickerSearchRef.current = setTimeout(async () => {
//       try {
//         setPickerSearchLoading(true);
//         setPickerIsSearchMode(true);
//         const results = await searchProviders(query.trim());
//         setPickerSearchResults(results || []);
//       } catch (err) {
//         notify({ severity: 'error', title: t('offers.pickerSearchError', 'Search failed'), message: extractApiErrorMessage(err, '') });
//       } finally {
//         setPickerSearchLoading(false);
//       }
//     }, 400);
//   }

//   function openProviderPicker() {
//     setPickerOpen(true);
//     setPickerSearch('');
//     setPickerIsSearchMode(false);
//     setPickerSearchResults([]);
//     fetchPickerList(1);
//   }

//   function closeProviderPicker() {
//     setPickerOpen(false);
//     setPickerSearch('');
//     setPickerIsSearchMode(false);
//     setPickerSearchResults([]);
//   }

//   function selectPickerProvider(acc) {
//     const name = getAccountName(acc);
//     setSelectedProvider({ id: acc.id, name });
//     setFilters((f) => ({ ...f, provider_id: acc.id }));
//     closeProviderPicker();
//   }

//   function clearSelectedProvider(e) {
//     if (e) e.stopPropagation();
//     setSelectedProvider(null);
//     setFilters((f) => ({ ...f, provider_id: '' }));
//   }

//   // ── Apply / Clear Filters ─────────────────────────
//   function handleApplyFilters() {
//     setAppliedFilters({ ...filters });
//     setPage(1);
//   }

//   function handleClearFilters() {
//     setFilters(EMPTY_FILTERS);
//     setAppliedFilters(EMPTY_FILTERS);
//     setSelectedProvider(null);
//     setPage(1);
//   }

//   const activeFilterCount = Object.values(appliedFilters).filter(Boolean).length;

//   // ── Details dialog ────────────────────────────────
//   function openDetails(offer) {
//     setSelectedOffer(offer);
//     setDetailsOpen(true);
//   }
//   function closeDetails() {
//     setDetailsOpen(false);
//     setSelectedOffer(null);
//   }

//   // ── Suspend / Unsuspend ────────────────────────────
//   function askSuspend(offer, e) {
//     if (e) e.stopPropagation();
//     setConfirmTarget(offer);
//     setConfirmAction('suspend');
//   }
//   function askUnsuspend(offer, e) {
//     if (e) e.stopPropagation();
//     setConfirmTarget(offer);
//     setConfirmAction('unsuspend');
//   }
//   function closeConfirm() {
//     if (confirmLoading) return;
//     setConfirmTarget(null);
//     setConfirmAction(null);
//   }
//   async function runConfirmAction() {
//     if (!confirmTarget || !confirmAction) return;
//     try {
//       setConfirmLoading(true);
//       if (confirmAction === 'suspend') {
//         await suspendOffer(confirmTarget.id);
//         notify({ severity: 'success', title: t('offers.suspendSuccess', 'Offer suspended successfully') });
//       } else {
//         await unsuspendOffer(confirmTarget.id);
//         notify({ severity: 'success', title: t('offers.unsuspendSuccess', 'Offer unsuspended successfully') });
//       }
//       setConfirmTarget(null);
//       setConfirmAction(null);
//       loadOffers(page, appliedFilters);
//     } catch (err) {
//       notify({
//         severity: 'error',
//         title: t('offers.actionError', 'Action failed'),
//         message: extractApiErrorMessage(err, ''),
//       });
//     } finally {
//       setConfirmLoading(false);
//     }
//   }

//   // ── Theme tokens (identical to Complaints/Restrictions) ──
//   const surfaceBg    = isDark ? theme.palette.background.paper : '#ffffff';
//   const subtleBg     = isDark ? alpha(theme.palette.common.white, 0.04) : '#f8fafc';
//   const borderColor  = isDark ? alpha(theme.palette.common.white, 0.09) : '#e2e8f0';
//   const headingColor = theme.palette.text.primary;
//   const mutedColor   = theme.palette.text.secondary;

//   const filledInputProps = { disableUnderline: true, sx: { borderRadius: 2 } };

//   return (
//     <Stack
//       spacing={4}
//       dir={isRtl ? 'rtl' : 'ltr'}
//       sx={{ p: { xs: 1, md: 3 }, bgcolor: 'background.default', minHeight: '100vh' }}
//     >
//       <PageHeader
//         title={t('offers.title', 'Offers')}
//         subtitle={t('offers.subtitle', 'Review provider offers and manage their suspension status')}
//       />

//       {/* ── Offers Card ─────────────────────────────── */}
//       <Card
//         elevation={0}
//         sx={{
//           borderRadius: 2,
//           boxShadow: isDark ? '0 4px 20px 0 rgba(0,0,0,0.3)' : '0 4px 20px 0 rgba(0,0,0,0.05)',
//           bgcolor: surfaceBg,
//           border: `1px solid ${borderColor}`,
//           overflow: 'hidden',
//         }}
//       >
//         <CardContent sx={{ p: 4 }}>

//           {/* Header + Filter Toggle */}
//           <Stack
//             direction={{ xs: 'column', sm: 'row' }}
//             alignItems={{ xs: 'flex-start', sm: 'center' }}
//             justifyContent="space-between"
//             spacing={2}
//             sx={{ mb: 3 }}
//           >
//             <Stack direction="row" spacing={2} alignItems="center">
//               <Box sx={{
//                 width: 44, height: 44, borderRadius: 2.5,
//                 bgcolor: alpha(theme.palette.warning.main, isDark ? 0.2 : 0.1),
//                 display: 'grid', placeItems: 'center', color: 'warning.dark',
//               }}>
//                 <LocalOfferRoundedIcon />
//               </Box>
//               <Box>
//                 <Typography variant="h6" sx={{ fontWeight: 800, color: headingColor }}>
//                   {t('offers.title', 'Offers')}
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
//                   {total} {t('offers.totalRecords', 'total records available')}
//                 </Typography>
//               </Box>
//             </Stack>

//             <Button
//               startIcon={<FilterListIcon />}
//               variant={filtersOpen ? 'contained' : 'outlined'}
//               onClick={() => setFiltersOpen((v) => !v)}
//               size="medium"
//               sx={{ borderRadius: 1, fontWeight: 700, textTransform: 'none' }}
//             >
//               {t('common.filters', 'Filters')} {activeFilterCount > 0 && `(${activeFilterCount})`}
//             </Button>
//           </Stack>

//           {/* Filter Panel */}
//           <Collapse in={filtersOpen}>
//             <Box sx={{ p: 3, borderRadius: 2, bgcolor: subtleBg, border: `1px solid ${borderColor}`, mb: 3 }}>
//               <Stack spacing={3}>

//                 <Box>
//                   <Typography variant="caption" sx={{
//                     fontWeight: 700, color: mutedColor,
//                     textTransform: 'uppercase', letterSpacing: '0.05em',
//                     display: 'block', mb: 1.5,
//                   }}>
//                     {t('offers.offerFilters', 'Offer Filters')}
//                   </Typography>
//                   <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
//                     <TextField
//                       select label={t('offers.status', 'Status')} value={filters.status}
//                       onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
//                       size="small" sx={{ flex: 1 }}
//                       variant="filled" InputProps={filledInputProps}
//                     >
//                       <MenuItem value="">{t('offers.allStatuses', 'All Statuses')}</MenuItem>
//                       {OFFER_STATUS_OPTIONS.map((s) => (
//                         <MenuItem key={s} value={s}>{t(`offers.statusValues.${s}`, s)}</MenuItem>
//                       ))}
//                     </TextField>

//                     <TextField
//                       select label={t('offers.activeState', 'Active')} value={filters.is_active}
//                       onChange={(e) => setFilters((f) => ({ ...f, is_active: e.target.value }))}
//                       size="small" sx={{ flex: 1 }}
//                       variant="filled" InputProps={filledInputProps}
//                     >
//                       <MenuItem value="">{t('offers.any', 'Any')}</MenuItem>
//                       <MenuItem value="1">{t('common.yes', 'Yes')}</MenuItem>
//                       <MenuItem value="0">{t('common.no', 'No')}</MenuItem>
//                     </TextField>
//                   </Stack>
//                 </Box>

//                 <Divider sx={{ borderColor }} />

//                 {/* Provider */}
//                 <Box>
//                   <Typography variant="caption" sx={{
//                     fontWeight: 700, color: mutedColor,
//                     textTransform: 'uppercase', letterSpacing: '0.05em',
//                     display: 'block', mb: 1.5,
//                   }}>
//                     {t('offers.provider', 'Provider')}
//                   </Typography>
//                   <Box
//                     onClick={openProviderPicker}
//                     sx={{
//                       px: 2, py: 1.2, borderRadius: 0, cursor: 'pointer',
//                       bgcolor: isDark ? alpha(theme.palette.common.white, 0.06) : '#f0f4f8',
//                       border: `1px solid ${selectedProvider ? theme.palette.primary.main : borderColor}`,
//                       display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                       '&:hover': { borderColor: 'primary.main' },
//                       transition: 'border-color 0.2s',
//                       minHeight: 40,
//                     }}
//                   >
//                     <Stack direction="row" spacing={1} alignItems="center">
//                       {selectedProvider ? (
//                         <Avatar sx={{
//                           width: 22, height: 22, fontSize: 10, fontWeight: 700,
//                           bgcolor: alpha(theme.palette.primary.main, 0.15), color: 'primary.main',
//                         }}>
//                           {selectedProvider.name.slice(0, 1)}
//                         </Avatar>
//                       ) : (
//                         <SearchIcon sx={{ fontSize: 16, color: mutedColor }} />
//                       )}
//                       <Typography variant="body2" sx={{ fontWeight: 600, color: selectedProvider ? headingColor : mutedColor, fontSize: '0.82rem' }}>
//                         {selectedProvider ? selectedProvider.name : t('offers.searchProvider', 'Search Provider...')}
//                       </Typography>
//                     </Stack>
//                     <Stack direction="row" spacing={0.5} alignItems="center">
//                       {selectedProvider && (
//                         <IconButton size="small" onClick={clearSelectedProvider} sx={{ p: 0.3 }}>
//                           <CloseIcon sx={{ fontSize: 14 }} />
//                         </IconButton>
//                       )}
//                       <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.72rem' }}>
//                         {selectedProvider ? `#${selectedProvider.id}` : '›'}
//                       </Typography>
//                     </Stack>
//                   </Box>
//                 </Box>

//                 <Divider sx={{ borderColor }} />

//                 <Stack direction="row" spacing={1.5}>
//                   <Button
//                     variant="contained" size="small"
//                     onClick={handleApplyFilters}
//                     sx={{ borderRadius: 0.5, fontWeight: 700, px: 3, textTransform: 'none' }}
//                   >
//                     {t('offers.applyFilters', 'Apply Filters')}
//                   </Button>
//                   <Button
//                     variant="outlined" size="small"
//                     onClick={handleClearFilters}
//                     sx={{ borderRadius: 0.5, fontWeight: 700, px: 3, textTransform: 'none', bgcolor: surfaceBg }}
//                   >
//                     {t('common.clearAll', 'Clear All')}
//                   </Button>
//                 </Stack>
//               </Stack>
//             </Box>
//           </Collapse>

//           {/* Table */}
//           {loading ? (
//             <Stack spacing={1.5}>
//               {[1, 2, 3, 4, 5].map((i) => (
//                 <Skeleton key={i} variant="rounded" height={60} sx={{ borderRadius: 2 }} />
//               ))}
//             </Stack>
//           ) : offers.length === 0 ? (
//             <Box sx={{ py: 8, textAlign: 'center', bgcolor: subtleBg, borderRadius: 4, border: `1px dashed ${borderColor}` }}>
//               <LocalOfferRoundedIcon sx={{ fontSize: 54, color: 'text.disabled', mb: 2 }} />
//               <Typography variant="h6" sx={{ fontWeight: 700, color: headingColor }}>
//                 {t('offers.empty', 'No offers found')}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 {t('offers.tryAdjusting', 'Try adjusting your filters.')}
//               </Typography>
//             </Box>
//           ) : (
//             <TableContainer sx={{ overflowX: 'auto' }}>
//               <Table sx={{ minWidth: 900 }}>
//                 <TableHead>
//                   <TableRow sx={{ bgcolor: subtleBg }}>
//                     {[
//                       t('offers.service', 'Service'),
//                       t('offers.provider', 'Provider'),
//                       t('offers.discount', 'Discount'),
//                       t('offers.starts', 'Starts'),
//                       t('offers.ends', 'Ends'),
//                       t('offers.status', 'Status'),
//                       t('offers.suspendedCol', 'Suspension'),
//                       t('common.actions', 'Actions'),
//                     ].map((h, i, arr) => (
//                       <TableCell
//                         key={i}
//                         align={i === arr.length - 1 ? 'right' : 'left'}
//                         sx={{ fontWeight: 700, color: mutedColor, fontSize: '0.85rem', py: 2, borderBottom: `1px solid ${borderColor}` }}
//                       >
//                         {h}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {offers.map((o) => (
//                     <TableRow key={o.id} hover sx={{ '&:last-child td': { border: 0 }, transition: 'background 0.2s', cursor: 'pointer' }} onClick={() => openDetails(o)}>
//                       <TableCell sx={{ maxWidth: 220 }}>
//                         <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>{o.service?.title || '—'}</Typography>
//                       </TableCell>
//                       <TableCell sx={{ maxWidth: 180 }}>
//                         <Stack direction="row" spacing={1} alignItems="center">
//                           <Avatar src={o.provider?.image || undefined} sx={{ width: 24, height: 24, fontSize: 11, fontWeight: 700 }}>
//                             {(o.provider?.name || '?').slice(0, 1)}
//                           </Avatar>
//                           <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>{o.provider?.name || '—'}</Typography>
//                         </Stack>
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2" sx={{ fontWeight: 700 }}>{o.discount_percentage}</Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
//                           {formatDateOnly(o.starts_at)}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
//                           {formatDateOnly(o.ends_at)}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <StatusChip status={o.status} t={t} />
//                       </TableCell>
//                       <TableCell>
//                         <SuspendedChip isSuspended={o.is_suspended} t={t} />
//                       </TableCell>
//                       <TableCell align="right">
//                         <Stack direction="row" spacing={0.5} justifyContent="flex-end">
//                           <Tooltip title={t('common.viewDetails', 'View details')}>
//                             <IconButton
//                               size="small"
//                               onClick={(e) => { e.stopPropagation(); openDetails(o); }}
//                               sx={{
//                                 color: 'primary.main',
//                                 bgcolor: isDark ? alpha(theme.palette.primary.main, 0.15) : '#f0f7ff',
//                                 '&:hover': { bgcolor: isDark ? alpha(theme.palette.primary.main, 0.25) : '#e0effe' },
//                                 borderRadius: 1.5,
//                               }}
//                             >
//                               <VisibilityOutlinedIcon fontSize="small" />
//                             </IconButton>
//                           </Tooltip>
//                           {o.is_suspended ? (
//                             <Tooltip title={t('offers.unsuspend', 'Unsuspend')}>
//                               <IconButton
//                                 size="small"
//                                 onClick={(e) => askUnsuspend(o, e)}
//                                 sx={{
//                                   color: 'success.main',
//                                   bgcolor: isDark ? alpha(theme.palette.success.main, 0.15) : alpha(theme.palette.success.main, 0.1),
//                                   '&:hover': { bgcolor: isDark ? alpha(theme.palette.success.main, 0.25) : alpha(theme.palette.success.main, 0.18) },
//                                   borderRadius: 1.5,
//                                 }}
//                               >
//                                 <PlayCircleOutlineRoundedIcon fontSize="small" />
//                               </IconButton>
//                             </Tooltip>
//                           ) : (
//                             <Tooltip title={t('offers.suspend', 'Suspend')}>
//                               <IconButton
//                                 size="small"
//                                 onClick={(e) => askSuspend(o, e)}
//                                 sx={{
//                                   color: 'error.main',
//                                   bgcolor: isDark ? alpha(theme.palette.error.main, 0.15) : alpha(theme.palette.error.main, 0.1),
//                                   '&:hover': { bgcolor: isDark ? alpha(theme.palette.error.main, 0.25) : alpha(theme.palette.error.main, 0.18) },
//                                   borderRadius: 1.5,
//                                 }}
//                               >
//                                 <BlockRoundedIcon fontSize="small" />
//                               </IconButton>
//                             </Tooltip>
//                           )}
//                         </Stack>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )}

//           {/* Pagination */}
//           {!loading && offers.length > 0 && (
//             <Stack
//               direction={{ xs: 'column', sm: 'row' }}
//               justifyContent="space-between"
//               alignItems="center"
//               spacing={2}
//               sx={{ mt: 3, pt: 2, borderTop: `1px solid ${borderColor}` }}
//             >
//               <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
//                 {t('offers.showingCount', 'Showing')} <b>{offers.length}</b> {t('offers.of', 'of')} <b>{total}</b> {t('offers.title', 'offers').toLowerCase()}
//               </Typography>
//               {lastPage > 1 && (
//                 <Pagination
//                   count={lastPage} page={page}
//                   onChange={(_, v) => setPage(v)}
//                   color="primary" shape="rounded" size="medium"
//                   sx={{ '& .MuiPaginationItem-root': { fontWeight: 700, borderRadius: 1.5 } }}
//                 />
//               )}
//             </Stack>
//           )}
//         </CardContent>
//       </Card>

//       {/* ── Provider Picker Dialog ─────────────────────── */}
//       <Dialog
//         open={pickerOpen}
//         onClose={closeProviderPicker}
//         maxWidth="xs"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: 4, backgroundImage: 'none',
//             bgcolor: surfaceBg, border: `1px solid ${borderColor}`,
//             boxShadow: isDark ? '0 20px 25px -5px rgba(0,0,0,0.5)' : '0 20px 25px -5px rgba(0,0,0,0.1)',
//           },
//         }}
//       >
//         <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 800, pb: 2, pt: 3, color: headingColor }}>
//           {t('offers.selectProvider', 'Select Provider')}
//           <IconButton onClick={closeProviderPicker} size="small" sx={{ bgcolor: subtleBg, border: `1px solid ${borderColor}` }}>
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </DialogTitle>

//         <Divider sx={{ borderColor }} />

//         <DialogContent sx={{ p: 2.5 }}>
//           <Stack spacing={2}>
//             <TextField
//               placeholder={t('complaints.searchByName', 'Search by name...')}
//               value={pickerSearch}
//               onChange={(e) => handlePickerSearchChange(e.target.value)}
//               size="small" fullWidth autoFocus variant="filled"
//               InputProps={{
//                 disableUnderline: true,
//                 sx: { borderRadius: 2 },
//                 startAdornment: <SearchIcon sx={{ fontSize: 18, color: mutedColor, mr: 1 }} />,
//                 endAdornment: pickerSearchLoading ? <CircularProgress size={16} /> : null,
//               }}
//             />

//             <Stack spacing={0.5} sx={{ maxHeight: 340, overflowY: 'auto', pr: 0.5 }}>
//               {pickerLoading ? (
//                 [1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" height={48} sx={{ borderRadius: 2 }} />)
//               ) : (pickerIsSearchMode ? pickerSearchResults : pickerList).length === 0 ? (
//                 <Box sx={{ py: 4, textAlign: 'center' }}>
//                   <Typography variant="body2" color="text.secondary">
//                     {pickerIsSearchMode ? t('complaints.noResultsFound', 'No results found') : t('complaints.noRecordsAvailable', 'No records available')}
//                   </Typography>
//                 </Box>
//               ) : (
//                 (pickerIsSearchMode ? pickerSearchResults : pickerList).map((acc) => {
//                   const name = getAccountName(acc);
//                   const isSelected = acc.id === filters.provider_id;
//                   return (
//                     <Box
//                       key={acc.id}
//                       onClick={() => selectPickerProvider(acc)}
//                       sx={{
//                         p: 1.5, borderRadius: 2, cursor: 'pointer',
//                         display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//                         bgcolor: isSelected ? alpha(theme.palette.primary.main, isDark ? 0.2 : 0.08) : 'transparent',
//                         border: `1px solid ${isSelected ? theme.palette.primary.main : 'transparent'}`,
//                         '&:hover': { bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.12) : subtleBg },
//                         transition: 'all 0.15s',
//                       }}
//                     >
//                       <Stack direction="row" spacing={1.5} alignItems="center">
//                         <Avatar sx={{
//                           width: 32, height: 32, fontSize: 12, fontWeight: 700,
//                           bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.2) : alpha(theme.palette.common.white, isDark ? 0.08 : 0),
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
//                             ID #{acc.id} · {acc.phone || acc.email || '—'}
//                           </Typography>
//                         </Box>
//                       </Stack>
//                       {isSelected && (
//                         <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: 'primary.main', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
//                           <Typography sx={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>✓</Typography>
//                         </Box>
//                       )}
//                     </Box>
//                   );
//                 })
//               )}
//             </Stack>

//             {!pickerIsSearchMode && pickerLastPage > 1 && (
//               <>
//                 <Divider sx={{ borderColor }} />
//                 <Stack direction="row" justifyContent="center">
//                   <Pagination
//                     count={pickerLastPage} page={pickerPage} size="small"
//                     onChange={(_, v) => fetchPickerList(v)}
//                     color="primary" shape="rounded" disabled={pickerLoading}
//                   />
//                 </Stack>
//               </>
//             )}
//           </Stack>
//         </DialogContent>
//       </Dialog>

//       {/* ── Offer Details Dialog (data already in the row, no extra fetch) ── */}
//       <Dialog
//         open={detailsOpen}
//         onClose={closeDetails}
//         maxWidth="sm"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: 4, backgroundImage: 'none',
//             bgcolor: surfaceBg, border: `1px solid ${borderColor}`,
//             boxShadow: isDark ? '0 20px 25px -5px rgba(0,0,0,0.5)' : '0 20px 25px -5px rgba(0,0,0,0.1)',
//           },
//         }}
//       >
//         <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 800, pb: 2, pt: 3, color: headingColor }}>
//           {t('offers.offerDetails', 'Offer Details')}
//           <IconButton onClick={closeDetails} size="small" sx={{ bgcolor: subtleBg, border: `1px solid ${borderColor}` }}>
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </DialogTitle>
//         <Divider sx={{ borderColor }} />
//         {selectedOffer && (
//           <DialogContent sx={{ p: 3 }}>
//             <Stack spacing={2.5}>
//               <Stack direction="row" spacing={1} flexWrap="wrap">
//                 <StatusChip status={selectedOffer.status} t={t} />
//                 <SuspendedChip isSuspended={selectedOffer.is_suspended} t={t} />
//               </Stack>

//               <Box>
//                 <Typography variant="caption" sx={{ fontWeight: 700, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
//                   {t('offers.service', 'Service')}
//                 </Typography>
//                 <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>{selectedOffer.service?.title || '—'}</Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{selectedOffer.service?.description || '—'}</Typography>
//                 <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
//                   {t('offers.price', 'Price')}: {selectedOffer.service?.price ?? '—'}
//                 </Typography>
//               </Box>

//               <Divider sx={{ borderColor }} />

//               <Box>
//                 <Typography variant="caption" sx={{ fontWeight: 700, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
//                   {t('offers.provider', 'Provider')}
//                 </Typography>
//                 <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
//                   <Avatar src={selectedOffer.provider?.image || undefined} sx={{ width: 32, height: 32 }}>
//                     {(selectedOffer.provider?.name || '?').slice(0, 1)}
//                   </Avatar>
//                   <Box>
//                     <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedOffer.provider?.name || '—'}</Typography>
//                     <Typography variant="caption" color="text.secondary">ID #{selectedOffer.provider?.id}</Typography>
//                   </Box>
//                 </Stack>
//               </Box>

//               <Divider sx={{ borderColor }} />

//               <Stack direction="row" spacing={4} flexWrap="wrap">
//                 <Box>
//                   <Typography variant="caption" sx={{ fontWeight: 700, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
//                     {t('offers.discount', 'Discount')}
//                   </Typography>
//                   <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>{selectedOffer.discount_percentage}</Typography>
//                 </Box>
//                 <Box>
//                   <Typography variant="caption" sx={{ fontWeight: 700, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
//                     {t('offers.starts', 'Starts')}
//                   </Typography>
//                   <Typography variant="body2" sx={{ mt: 0.5 }}>{formatDateOnly(selectedOffer.starts_at)}</Typography>
//                 </Box>
//                 <Box>
//                   <Typography variant="caption" sx={{ fontWeight: 700, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
//                     {t('offers.ends', 'Ends')}
//                   </Typography>
//                   <Typography variant="body2" sx={{ mt: 0.5 }}>{formatDateOnly(selectedOffer.ends_at)}</Typography>
//                 </Box>
//                 <Box>
//                   <Typography variant="caption" sx={{ fontWeight: 700, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
//                     {t('offers.createdAt', 'Created At')}
//                   </Typography>
//                   <Typography variant="body2" sx={{ mt: 0.5 }}>{toUTC3(selectedOffer.created_at)}</Typography>
//                 </Box>
//               </Stack>
//             </Stack>
//           </DialogContent>
//         )}
//         <Divider sx={{ borderColor }} />
//         <DialogActions sx={{ p: 2 }}>
//           {selectedOffer && (
//             selectedOffer.is_suspended ? (
//               <Button
//                 variant="contained" color="success" size="small"
//                 onClick={() => { closeDetails(); askUnsuspend(selectedOffer); }}
//                 sx={{ fontWeight: 700, textTransform: 'none', borderRadius: 1 }}
//               >
//                 {t('offers.unsuspend', 'Unsuspend')}
//               </Button>
//             ) : (
//               <Button
//                 variant="contained" color="error" size="small"
//                 onClick={() => { closeDetails(); askSuspend(selectedOffer); }}
//                 sx={{ fontWeight: 700, textTransform: 'none', borderRadius: 1 }}
//               >
//                 {t('offers.suspend', 'Suspend')}
//               </Button>
//             )
//           )}
//         </DialogActions>
//       </Dialog>

//       {/* ── Suspend / Unsuspend confirmation dialog ────── */}
//       <Dialog
//         open={!!confirmTarget}
//         onClose={closeConfirm}
//         maxWidth="xs"
//         fullWidth
//         PaperProps={{
//           sx: {
//             borderRadius: 4, backgroundImage: 'none',
//             bgcolor: surfaceBg, border: `1px solid ${borderColor}`,
//           },
//         }}
//       >
//         <DialogTitle sx={{ fontWeight: 800, color: headingColor }}>
//           {confirmAction === 'suspend'
//             ? t('offers.confirmSuspendTitle', 'Suspend this offer?')
//             : t('offers.confirmUnsuspendTitle', 'Unsuspend this offer?')}
//         </DialogTitle>
//         <DialogContent>
//           <Typography variant="body2" color="text.secondary">
//             {confirmAction === 'suspend'
//               ? t('offers.confirmSuspendBody', 'The offer will stop being visible/usable until it is unsuspended.')
//               : t('offers.confirmUnsuspendBody', 'The offer will become active again (subject to its own status/dates).')}
//           </Typography>
//         </DialogContent>
//         <DialogActions sx={{ p: 2 }}>
//           <Button onClick={closeConfirm} disabled={confirmLoading} sx={{ textTransform: 'none', fontWeight: 700 }}>
//             {t('common.cancel', 'Cancel')}
//           </Button>
//           <Button
//             variant="contained"
//             color={confirmAction === 'suspend' ? 'error' : 'success'}
//             onClick={runConfirmAction}
//             disabled={confirmLoading}
//             sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 1 }}
//             startIcon={confirmLoading ? <CircularProgress size={16} color="inherit" /> : null}
//           >
//             {confirmAction === 'suspend' ? t('offers.suspend', 'Suspend') : t('offers.unsuspend', 'Unsuspend')}
//           </Button>
//         </DialogActions>
//       </Dialog>
//     </Stack>
//   );
// }

// export default OffersPage;

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Box, Button, Card, CardContent, Chip, CircularProgress,
  Divider, MenuItem, Skeleton, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography, Pagination,
  Dialog, DialogContent, DialogTitle, DialogActions, IconButton, Collapse, alpha, useTheme,
  Tooltip, Avatar,
} from '@mui/material';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SearchIcon from '@mui/icons-material/Search';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import PlayCircleOutlineRoundedIcon from '@mui/icons-material/PlayCircleOutlineRounded';
import PageHeader from '../components/PageHeader';
import { useTranslation } from 'react-i18next';
import {
  fetchOffers, suspendOffer, unsuspendOffer, extractApiErrorMessage, OFFER_STATUS_OPTIONS,
} from '../services/offersService';
import { fetchAllProviders, searchProviders } from '../services/accountsService';
import { useAppContext } from '../context/AppContext';

const EMPTY_FILTERS = {
  status: '',
  is_active: '',
  is_suspended: '',
  provider_id: '',
};

// ── date helpers (same pattern used across Complaints/Restrictions/Transactions) ──
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

function formatDateOnly(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(`${dateStr}T00:00:00Z`);
  if (isNaN(date)) return dateStr;
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Riyadh', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(date);
}

function getAccountName(acc) {
  if (!acc) return '';
  if (acc.name) return acc.name;
  if (acc.full_name) return acc.full_name;
  const combined = `${acc.first_name || ''} ${acc.last_name || ''}`.trim();
  return combined || acc.username || acc.email || `#${acc.id}`;
}

// ── Status chip (dark-mode aware, same tokens as complaintStatus.js) ──
const STATUS_STYLES = {
  active: {
    color: '#0f9d58',
    background: '#e6f7ee', border: '#b7ebd2',
    darkBackground: alpha('#22c55e', 0.18), darkBorder: alpha('#22c55e', 0.4),
  },
  upcoming: {
    color: '#2563eb',
    background: '#eaf1ff', border: '#c3d9ff',
    darkBackground: alpha('#3b82f6', 0.18), darkBorder: alpha('#3b82f6', 0.4),
  },
  expired: {
    color: '#64748b',
    background: '#f1f5f9', border: '#e2e8f0',
    darkBackground: alpha('#94a3b8', 0.16), darkBorder: alpha('#94a3b8', 0.35),
  },
};
function getOfferStatusStyle(status) {
  return STATUS_STYLES[status] || STATUS_STYLES.expired;
}

function StatusChip({ status, t }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const style = getOfferStatusStyle(status);
  return (
    <Chip
      label={t(`offers.statusValues.${status}`, status)}
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

function SuspendedChip({ isSuspended, t }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  if (!isSuspended) {
    return (
      <Chip
        label={t('offers.notSuspended', 'Unsuspended')}
        size="small"
        sx={{
          fontWeight: 700, borderRadius: '8px', px: 0.5,
          backgroundColor: isDark ? alpha(theme.palette.success.main, 0.18) : alpha(theme.palette.success.main, 0.1),
          color: theme.palette.success.main,
          border: `1px solid ${isDark ? alpha(theme.palette.success.main, 0.4) : alpha(theme.palette.success.main, 0.3)}`,
        }}
      />
    );
  }
  return (
    <Chip
      label={t('offers.suspended', 'Suspended')}
      size="small"
      sx={{
        fontWeight: 700, borderRadius: '8px', px: 0.5,
        backgroundColor: isDark ? alpha(theme.palette.error.main, 0.18) : alpha(theme.palette.error.main, 0.1),
        color: theme.palette.error.main,
        border: `1px solid ${isDark ? alpha(theme.palette.error.main, 0.4) : alpha(theme.palette.error.main, 0.3)}`,
      }}
    />
  );
}

// ── Page ─────────────────────────────────────────────
function OffersPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const { notify } = useAppContext();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // ── Offers ────────────────────────────────────────
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // ── Filters ───────────────────────────────────────
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filtersResetKey, setFiltersResetKey] = useState(0);
  const [selectedProvider, setSelectedProvider] = useState(null); // { id, name }

  // ── Details dialog ────────────────────────────────
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  // ── Suspend / Unsuspend confirm dialog ─────────────
  const [confirmTarget, setConfirmTarget] = useState(null); // offer row
  const [confirmAction, setConfirmAction] = useState(null); // 'suspend' | 'unsuspend'
  const [confirmLoading, setConfirmLoading] = useState(false);

  // ── Provider picker dialog ─────────────────────────
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerList, setPickerList] = useState([]);
  const [pickerPage, setPickerPage] = useState(1);
  const [pickerLastPage, setPickerLastPage] = useState(1);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerSearchResults, setPickerSearchResults] = useState([]);
  const [pickerSearchLoading, setPickerSearchLoading] = useState(false);
  const [pickerIsSearchMode, setPickerIsSearchMode] = useState(false);
  const pickerSearchRef = useRef(null);

  // ── Fetch Offers ──────────────────────────────────
  const loadOffers = useCallback(async (p = 1, f = appliedFilters) => {
    try {
      setLoading(true);
      const res = await fetchOffers({
        status: f.status,
        isActive: f.is_active,
        isSuspended: f.is_suspended,
        providerId: f.provider_id,
        page: p,
      });
      const payload = res?.data;
      const list = Array.isArray(payload) ? payload : (payload?.data ?? []);
      setOffers(list);
      setTotal(payload?.total ?? list.length);
      setLastPage(payload?.last_page ?? 1);
      setPage(payload?.current_page ?? p);
    } catch (err) {
      notify({ severity: 'error', title: t('offers.loadError', 'Failed to load offers'), message: extractApiErrorMessage(err, '') });
      setOffers([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters]);

  useEffect(() => {
    loadOffers(page, appliedFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, appliedFilters]);

  // ── Provider Picker helpers ────────────────────────
  async function fetchPickerList(p = 1) {
    try {
      setPickerLoading(true);
      const { list, currentPage, lastPage: lp } = await fetchAllProviders(p);
      setPickerList(list);
      setPickerPage(currentPage);
      setPickerLastPage(lp);
    } catch (err) {
      notify({ severity: 'error', title: t('offers.pickerLoadError', 'Failed to load providers'), message: extractApiErrorMessage(err, '') });
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
        const results = await searchProviders(query.trim());
        setPickerSearchResults(results || []);
      } catch (err) {
        notify({ severity: 'error', title: t('offers.pickerSearchError', 'Search failed'), message: extractApiErrorMessage(err, '') });
      } finally {
        setPickerSearchLoading(false);
      }
    }, 400);
  }

  function openProviderPicker() {
    setPickerOpen(true);
    setPickerSearch('');
    setPickerIsSearchMode(false);
    setPickerSearchResults([]);
    fetchPickerList(1);
  }

  function closeProviderPicker() {
    setPickerOpen(false);
    setPickerSearch('');
    setPickerIsSearchMode(false);
    setPickerSearchResults([]);
  }

  function selectPickerProvider(acc) {
    const name = getAccountName(acc);
    setSelectedProvider({ id: acc.id, name });
    setFilters((f) => ({ ...f, provider_id: acc.id }));
    closeProviderPicker();
  }

  function clearSelectedProvider(e) {
    if (e) e.stopPropagation();
    setSelectedProvider(null);
    setFilters((f) => ({ ...f, provider_id: '' }));
  }

  // ── Apply / Clear Filters ─────────────────────────
  function handleApplyFilters() {
    setAppliedFilters({ ...filters });
    setPage(1);
  }

  function handleClearFilters() {
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setSelectedProvider(null);
    setPage(1);
    setFiltersResetKey((k) => k + 1);
  }

  const activeFilterCount = Object.values(appliedFilters).filter(Boolean).length;

  // ── Details dialog ────────────────────────────────
  function openDetails(offer) {
    setSelectedOffer(offer);
    setDetailsOpen(true);
  }
  function closeDetails() {
    setDetailsOpen(false);
    setSelectedOffer(null);
  }

  // ── Suspend / Unsuspend ────────────────────────────
  function askSuspend(offer, e) {
    if (e) e.stopPropagation();
    setConfirmTarget(offer);
    setConfirmAction('suspend');
  }
  function askUnsuspend(offer, e) {
    if (e) e.stopPropagation();
    setConfirmTarget(offer);
    setConfirmAction('unsuspend');
  }
  function closeConfirm() {
    if (confirmLoading) return;
    setConfirmTarget(null);
    setConfirmAction(null);
  }
  async function runConfirmAction() {
    if (!confirmTarget || !confirmAction) return;
    try {
      setConfirmLoading(true);
      if (confirmAction === 'suspend') {
        await suspendOffer(confirmTarget.id);
        notify({ severity: 'success', title: t('offers.suspendSuccess', 'Offer suspended successfully') });
      } else {
        await unsuspendOffer(confirmTarget.id);
        notify({ severity: 'success', title: t('offers.unsuspendSuccess', 'Offer unsuspended successfully') });
      }
      setConfirmTarget(null);
      setConfirmAction(null);
      loadOffers(page, appliedFilters);
    } catch (err) {
      notify({
        severity: 'error',
        title: t('offers.actionError', 'Action failed'),
        message: extractApiErrorMessage(err, ''),
      });
    } finally {
      setConfirmLoading(false);
    }
  }

  // ── Theme tokens (identical to Complaints/Restrictions) ──
  const surfaceBg    = isDark ? theme.palette.background.paper : '#ffffff';
  const subtleBg     = isDark ? alpha(theme.palette.common.white, 0.04) : '#f8fafc';
  const borderColor  = isDark ? alpha(theme.palette.common.white, 0.09) : '#e2e8f0';
  const headingColor = theme.palette.text.primary;
  const mutedColor   = theme.palette.text.secondary;

  const filledInputProps = { disableUnderline: true, sx: { borderRadius: 2 } };

  return (
    <Stack
      spacing={4}
      dir={isRtl ? 'rtl' : 'ltr'}
      sx={{ p: { xs: 1, md: 3 }, bgcolor: 'background.default', minHeight: '100vh' }}
    >
      <PageHeader
        title={t('offers.title', 'Offers')}
        subtitle={t('offers.subtitle', 'Review provider offers and manage their suspension status')}
      />

      {/* ── Offers Card ─────────────────────────────── */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          boxShadow: isDark ? '0 4px 20px 0 rgba(0,0,0,0.3)' : '0 4px 20px 0 rgba(0,0,0,0.05)',
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
                bgcolor: alpha(theme.palette.warning.main, isDark ? 0.2 : 0.1),
                display: 'grid', placeItems: 'center', color: 'warning.dark',
              }}>
                <LocalOfferRoundedIcon />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: headingColor }}>
                  {t('offers.title', 'Offers')}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {total} {t('offers.totalRecords', 'total records available')}
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
              {t('common.filters', 'Filters')} {activeFilterCount > 0 && `(${activeFilterCount})`}
            </Button>
          </Stack>

          {/* Filter Panel */}
          <Collapse in={filtersOpen}>
            <Box sx={{ p: 3, borderRadius: 2, bgcolor: subtleBg, border: `1px solid ${borderColor}`, mb: 3 }}>
              <Stack spacing={3}>

                <Box>
                  <Typography variant="caption" sx={{
                    fontWeight: 700, color: mutedColor,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    display: 'block', mb: 1.5,
                  }}>
                    {t('offers.offerFilters', 'Offer Filters')}
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      key={`status-${filtersResetKey}`}
                      select label={t('offers.status', 'Status')} value={filters.status}
                      onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                      size="small" sx={{ flex: 1 }}
                      variant="filled" InputProps={filledInputProps}
                    >
                      <MenuItem value="">{t('offers.allStatuses', 'All Statuses')}</MenuItem>
                      {OFFER_STATUS_OPTIONS.map((s) => (
                        <MenuItem key={s} value={s}>{t(`offers.statusValues.${s}`, s)}</MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      key={`is_active-${filtersResetKey}`}
                      select label={t('offers.activeState', 'Active')} value={filters.is_active}
                      onChange={(e) => setFilters((f) => ({ ...f, is_active: e.target.value }))}
                      size="small" sx={{ flex: 1 }}
                      variant="filled" InputProps={filledInputProps}
                    >
                      <MenuItem value="">{t('offers.any', 'Any')}</MenuItem>
                      <MenuItem value="1">{t('offers.activeLabel', 'Active')}</MenuItem>
                      <MenuItem value="0">{t('offers.inactiveLabel', 'Inactive')}</MenuItem>
                    </TextField>

                    <TextField
                      key={`is_suspended-${filtersResetKey}`}
                      select label={t('offers.suspendedCol', 'Suspension')} value={filters.is_suspended}
                      onChange={(e) => setFilters((f) => ({ ...f, is_suspended: e.target.value }))}
                      size="small" sx={{ flex: 1 }}
                      variant="filled" InputProps={filledInputProps}
                    >
                      <MenuItem value="">{t('offers.any', 'Any')}</MenuItem>
                      <MenuItem value="1">{t('offers.suspended', 'Suspended')}</MenuItem>
                      <MenuItem value="0">{t('offers.unsuspended', 'Unsuspended')}</MenuItem>
                    </TextField>
                  </Stack>
                </Box>

                <Divider sx={{ borderColor }} />

                {/* Provider */}
                <Box>
                  <Typography variant="caption" sx={{
                    fontWeight: 700, color: mutedColor,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    display: 'block', mb: 1.5,
                  }}>
                    {t('offers.provider', 'Provider')}
                  </Typography>
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
                          {selectedProvider.name.slice(0, 1)}
                        </Avatar>
                      ) : (
                        <SearchIcon sx={{ fontSize: 16, color: mutedColor }} />
                      )}
                      <Typography variant="body2" sx={{ fontWeight: 600, color: selectedProvider ? headingColor : mutedColor, fontSize: '0.82rem' }}>
                        {selectedProvider ? selectedProvider.name : t('offers.searchProvider', 'Search Provider...')}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      {selectedProvider && (
                        <IconButton size="small" onClick={clearSelectedProvider} sx={{ p: 0.3 }}>
                          <CloseIcon sx={{ fontSize: 14 }} />
                        </IconButton>
                      )}
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.72rem' }}>
                        {selectedProvider ? `#${selectedProvider.id}` : '›'}
                      </Typography>
                    </Stack>
                  </Box>
                </Box>

                <Divider sx={{ borderColor }} />

                <Stack direction="row" spacing={1.5}>
                  <Button
                    variant="contained" size="small"
                    onClick={handleApplyFilters}
                    sx={{ borderRadius: 0.5, fontWeight: 700, px: 3, textTransform: 'none' }}
                  >
                    {t('offers.applyFilters', 'Apply Filters')}
                  </Button>
                  <Button
                    variant="outlined" size="small"
                    onClick={handleClearFilters}
                    sx={{ borderRadius: 0.5, fontWeight: 700, px: 3, textTransform: 'none', bgcolor: surfaceBg }}
                  >
                    {t('common.clearAll', 'Clear All')}
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
          ) : offers.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center', bgcolor: subtleBg, borderRadius: 4, border: `1px dashed ${borderColor}` }}>
              <LocalOfferRoundedIcon sx={{ fontSize: 54, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: headingColor }}>
                {t('offers.empty', 'No offers found')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('offers.tryAdjusting', 'Try adjusting your filters.')}
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 900 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: subtleBg }}>
                    {[
                      t('offers.service', 'Service'),
                      t('offers.provider', 'Provider'),
                      t('offers.discount', 'Discount'),
                      t('offers.starts', 'Starts'),
                      t('offers.ends', 'Ends'),
                      t('offers.status', 'Status'),
                      t('offers.suspendedCol', 'Suspension'),
                      t('common.actions', 'Actions'),
                    ].map((h, i, arr) => (
                      <TableCell
                        key={i}
                        align={i === arr.length - 1 ? 'right' : 'left'}
                        sx={{ fontWeight: 700, color: mutedColor, fontSize: '0.85rem', py: 2, borderBottom: `1px solid ${borderColor}` }}
                      >
                        {h}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {offers.map((o) => (
                    <TableRow key={o.id} hover sx={{ '&:last-child td': { border: 0 }, transition: 'background 0.2s', cursor: 'pointer' }} onClick={() => openDetails(o)}>
                      <TableCell sx={{ maxWidth: 220 }}>
                        <Typography variant="body2" noWrap sx={{ fontWeight: 600 }}>{o.service?.title || '—'}</Typography>
                      </TableCell>
                      <TableCell sx={{ maxWidth: 180 }}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar src={o.provider?.image || undefined} sx={{ width: 24, height: 24, fontSize: 11, fontWeight: 700 }}>
                            {(o.provider?.name || '?').slice(0, 1)}
                          </Avatar>
                          <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>{o.provider?.name || '—'}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{o.discount_percentage}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                          {formatDateOnly(o.starts_at)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                          {formatDateOnly(o.ends_at)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={o.status} t={t} />
                      </TableCell>
                      <TableCell>
                        <SuspendedChip isSuspended={o.is_suspended} t={t} />
                      </TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <Tooltip title={t('common.viewDetails', 'View details')}>
                            <IconButton
                              size="small"
                              onClick={(e) => { e.stopPropagation(); openDetails(o); }}
                              sx={{
                                color: 'primary.main',
                                bgcolor: isDark ? alpha(theme.palette.primary.main, 0.15) : '#f0f7ff',
                                '&:hover': { bgcolor: isDark ? alpha(theme.palette.primary.main, 0.25) : '#e0effe' },
                                borderRadius: 1.5,
                              }}
                            >
                              <VisibilityOutlinedIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                          {o.is_suspended ? (
                            <Tooltip title={t('offers.unsuspend', 'Unsuspend')}>
                              <IconButton
                                size="small"
                                onClick={(e) => askUnsuspend(o, e)}
                                sx={{
                                  color: 'success.main',
                                  bgcolor: isDark ? alpha(theme.palette.success.main, 0.15) : alpha(theme.palette.success.main, 0.1),
                                  '&:hover': { bgcolor: isDark ? alpha(theme.palette.success.main, 0.25) : alpha(theme.palette.success.main, 0.18) },
                                  borderRadius: 1.5,
                                }}
                              >
                                <PlayCircleOutlineRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          ) : (
                            <Tooltip title={t('offers.suspend', 'Suspend')}>
                              <IconButton
                                size="small"
                                onClick={(e) => askSuspend(o, e)}
                                sx={{
                                  color: 'error.main',
                                  bgcolor: isDark ? alpha(theme.palette.error.main, 0.15) : alpha(theme.palette.error.main, 0.1),
                                  '&:hover': { bgcolor: isDark ? alpha(theme.palette.error.main, 0.25) : alpha(theme.palette.error.main, 0.18) },
                                  borderRadius: 1.5,
                                }}
                              >
                                <BlockRoundedIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination */}
          {!loading && offers.length > 0 && (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
              sx={{ mt: 3, pt: 2, borderTop: `1px solid ${borderColor}` }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {t('offers.showingCount', 'Showing')} <b>{offers.length}</b> {t('offers.of', 'of')} <b>{total}</b> {t('offers.title', 'offers').toLowerCase()}
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

      {/* ── Provider Picker Dialog ─────────────────────── */}
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
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 800, pb: 2, pt: 3, color: headingColor }}>
          {t('offers.selectProvider', 'Select Provider')}
          <IconButton onClick={closeProviderPicker} size="small" sx={{ bgcolor: subtleBg, border: `1px solid ${borderColor}` }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <Divider sx={{ borderColor }} />

        <DialogContent sx={{ p: 2.5 }}>
          <Stack spacing={2}>
            <TextField
              placeholder={t('complaints.searchByName', 'Search by name...')}
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

            <Stack spacing={0.5} sx={{ maxHeight: 340, overflowY: 'auto', pr: 0.5 }}>
              {pickerLoading ? (
                [1, 2, 3].map((i) => <Skeleton key={i} variant="rounded" height={48} sx={{ borderRadius: 2 }} />)
              ) : (pickerIsSearchMode ? pickerSearchResults : pickerList).length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    {pickerIsSearchMode ? t('complaints.noResultsFound', 'No results found') : t('complaints.noRecordsAvailable', 'No records available')}
                  </Typography>
                </Box>
              ) : (
                (pickerIsSearchMode ? pickerSearchResults : pickerList).map((acc) => {
                  const name = getAccountName(acc);
                  const isSelected = acc.id === filters.provider_id;
                  return (
                    <Box
                      key={acc.id}
                      onClick={() => selectPickerProvider(acc)}
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
                          {name.slice(0, 1)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 600, color: headingColor, lineHeight: 1.3 }}>
                            {name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: mutedColor, fontSize: '0.72rem' }}>
                            {/* ID #{acc.id} · */}
                             phone : {acc.phone || acc.email || '—'}
                          </Typography>
                        </Box>
                      </Stack>
                      {isSelected && (
                        <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: 'primary.main', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
                          <Typography sx={{ color: '#fff', fontSize: 11, fontWeight: 800 }}>✓</Typography>
                        </Box>
                      )}
                    </Box>
                  );
                })
              )}
            </Stack>

            {!pickerIsSearchMode && pickerLastPage > 1 && (
              <>
                <Divider sx={{ borderColor }} />
                <Stack direction="row" justifyContent="center">
                  <Pagination
                    count={pickerLastPage} page={pickerPage} size="small"
                    onChange={(_, v) => fetchPickerList(v)}
                    color="primary" shape="rounded" disabled={pickerLoading}
                  />
                </Stack>
              </>
            )}
          </Stack>
        </DialogContent>
      </Dialog>

      {/* ── Offer Details Dialog (data already in the row, no extra fetch) ── */}
      <Dialog
        open={detailsOpen}
        onClose={closeDetails}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4, backgroundImage: 'none',
            bgcolor: surfaceBg, border: `1px solid ${borderColor}`,
            boxShadow: isDark ? '0 20px 25px -5px rgba(0,0,0,0.5)' : '0 20px 25px -5px rgba(0,0,0,0.1)',
          },
        }}
      >
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 800, pb: 2, pt: 3, color: headingColor }}>
          {t('offers.offerDetails', 'Offer Details')}
          <IconButton onClick={closeDetails} size="small" sx={{ bgcolor: subtleBg, border: `1px solid ${borderColor}` }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <Divider sx={{ borderColor }} />
        {selectedOffer && (
          <DialogContent sx={{ p: 3 }}>
            <Stack spacing={2.5}>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <StatusChip status={selectedOffer.status} t={t} />
                <SuspendedChip isSuspended={selectedOffer.is_suspended} t={t} />
              </Stack>

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t('offers.service', 'Service')}
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>{selectedOffer.service?.title || '—'}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>{selectedOffer.service?.description || '—'}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.5 }}>
                  {t('offers.price', 'Price')}: {selectedOffer.service?.price ?? '—'}
                </Typography>
              </Box>

              <Divider sx={{ borderColor }} />

              <Box>
                <Typography variant="caption" sx={{ fontWeight: 700, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {t('offers.provider', 'Provider')}
                </Typography>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
                  <Avatar src={selectedOffer.provider?.image || undefined} sx={{ width: 32, height: 32 }}>
                    {(selectedOffer.provider?.name || '?').slice(0, 1)}
                  </Avatar>
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{selectedOffer.provider?.name || '—'}</Typography>
                    {/* <Typography variant="caption" color="text.secondary">ID #{selectedOffer.provider?.id}</Typography> */}
                  </Box>
                </Stack>
              </Box>

              <Divider sx={{ borderColor }} />

              <Stack direction="row" spacing={4} flexWrap="wrap">
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {t('offers.discount', 'Discount')}
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 700, mt: 0.5 }}>{selectedOffer.discount_percentage}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {t('offers.starts', 'Starts')}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>{formatDateOnly(selectedOffer.starts_at)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {t('offers.ends', 'Ends')}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>{formatDateOnly(selectedOffer.ends_at)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {t('offers.createdAt', 'Created At')}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5 }}>{toUTC3(selectedOffer.created_at)}</Typography>
                </Box>
              </Stack>
            </Stack>
          </DialogContent>
        )}
        <Divider sx={{ borderColor }} />
        <DialogActions sx={{ p: 2 }}>
          {selectedOffer && (
            selectedOffer.is_suspended ? (
              <Button
                variant="contained" color="success" size="small"
                onClick={() => { closeDetails(); askUnsuspend(selectedOffer); }}
                sx={{ fontWeight: 700, textTransform: 'none', borderRadius: 1 }}
              >
                {t('offers.unsuspend', 'Unsuspend')}
              </Button>
            ) : (
              <Button
                variant="contained" color="error" size="small"
                onClick={() => { closeDetails(); askSuspend(selectedOffer); }}
                sx={{ fontWeight: 700, textTransform: 'none', borderRadius: 1 }}
              >
                {t('offers.suspend', 'Suspend')}
              </Button>
            )
          )}
        </DialogActions>
      </Dialog>

      {/* ── Suspend / Unsuspend confirmation dialog ────── */}
      <Dialog
        open={!!confirmTarget}
        onClose={closeConfirm}
        maxWidth="xs"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 4, backgroundImage: 'none',
            bgcolor: surfaceBg, border: `1px solid ${borderColor}`,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: 800, color: headingColor }}>
          {confirmAction === 'suspend'
            ? t('offers.confirmSuspendTitle', 'Suspend this offer?')
            : t('offers.confirmUnsuspendTitle', 'Unsuspend this offer?')}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            {confirmAction === 'suspend'
              ? t('offers.confirmSuspendBody', 'The offer will stop being visible/usable until it is unsuspended.')
              : t('offers.confirmUnsuspendBody', 'The offer will become active again (subject to its own status/dates).')}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={closeConfirm} disabled={confirmLoading} sx={{ textTransform: 'none', fontWeight: 700 }}>
            {t('common.cancel', 'Cancel')}
          </Button>
          <Button
            variant="contained"
            color={confirmAction === 'suspend' ? 'error' : 'success'}
            onClick={runConfirmAction}
            disabled={confirmLoading}
            sx={{ textTransform: 'none', fontWeight: 700, borderRadius: 1 }}
            startIcon={confirmLoading ? <CircularProgress size={16} color="inherit" /> : null}
          >
            {confirmAction === 'suspend' ? t('offers.suspend', 'Suspend') : t('offers.unsuspend', 'Unsuspend')}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}

export default OffersPage;