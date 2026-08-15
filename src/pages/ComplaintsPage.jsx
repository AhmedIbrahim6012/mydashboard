

// import { useEffect, useState, useCallback, useRef } from 'react';
// import {
//   Box, Button, Card, CardContent, Chip, CircularProgress,
//   Divider, MenuItem, Skeleton, Stack,
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
//   TextField, Typography, Pagination,
//   Dialog, DialogContent, DialogTitle, IconButton, Collapse, alpha, useTheme,
//   Tooltip, Avatar, InputAdornment,
// } from '@mui/material';
// import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
// import FilterListIcon from '@mui/icons-material/FilterList';
// import CloseIcon from '@mui/icons-material/Close';
// import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
// import SearchIcon from '@mui/icons-material/Search';
// import PageHeader from '../components/PageHeader';
// import { useTranslation } from 'react-i18next';
// import { fetchComplaints, extractApiErrorMessage } from '../services/complaintsService';
// import { fetchAllUsers, searchUsers, fetchAllProviders, searchProviders } from '../services/accountsService';
// import { STATUS_OPTIONS, getStatusStyle, toUTC3 } from '../components/complaints/complaintStatus';
// import ComplaintDetailsDialog from '../components/complaints/ComplaintDetailsDialog';
// import { useAppContext } from '../context/AppContext';

// const PER_PAGE = 10;

// const EMPTY_FILTERS = {
//   query: '',
//   status: '',
//   complaint_number: '',
//   complainant_type: '',
//   complainant_id: '',
//   respondent_type: '',
//   respondent_id: '',
// };

// // Endpoints used by the account picker dialog (mirrors RestrictionsPage's PICKER_ENDPOINTS)
// const PICKER_SOURCES = {
//   user: { list: fetchAllUsers, search: searchUsers },
//   provider: { list: fetchAllProviders, search: searchProviders },
// };

// function getAccountName(acc) {
//   if (!acc) return '';
//   if (acc.name) return acc.name;
//   if (acc.full_name) return acc.full_name;
//   const combined = `${acc.first_name || ''} ${acc.last_name || ''}`.trim();
//   return combined || acc.username || acc.email || `#${acc.id}`;
// }

// // ── Status Chip (dark-mode aware, same pattern as RestrictionsPage's chips) ──
// function StatusChip({ status, t }) {
//   const theme = useTheme();
//   const isDark = theme.palette.mode === 'dark';
//   const style = getStatusStyle(status);
//   return (
//     <Chip
//       label={t(`complaints.statusValues.${status}`, status)}
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

// // ── Page ─────────────────────────────────────────────
// function ComplaintsPage() {
//   const { t, i18n } = useTranslation();
//   const isRtl = i18n.dir() === 'rtl';
//   const { notify } = useAppContext();
//   const theme = useTheme();
//   const isDark = theme.palette.mode === 'dark';

//   // ── Complaints ────────────────────────────────────
//   const [complaints, setComplaints] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [page, setPage] = useState(1);
//   const [lastPage, setLastPage] = useState(1);
//   const [total, setTotal] = useState(0);

//   // ── Filters ───────────────────────────────────────
//   const [filters, setFilters] = useState(EMPTY_FILTERS);
//   const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
//   const [filtersOpen, setFiltersOpen] = useState(false);
//   const queryDebounceRef = useRef(null);

//   // ── Details dialog ────────────────────────────────
//   const [selectedComplaintId, setSelectedComplaintId] = useState(null);
//   const [detailsOpen, setDetailsOpen] = useState(false);

//   // ── Account Picker (shared dialog, used for both Complainant & Respondent) ──
//   const [selectedComplainant, setSelectedComplainant] = useState(null); // { id, name }
//   const [selectedRespondent, setSelectedRespondent] = useState(null); // { id, name }
//   const [pickerTarget, setPickerTarget] = useState(null); // 'complainant' | 'respondent' | null
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

//   const pickerMode = pickerTarget ? filters[`${pickerTarget}_type`] : null; // 'user' | 'provider'

//   // ── Fetch Complaints ──────────────────────────────
//   const loadComplaints = useCallback(async (p = 1, f = appliedFilters) => {
//     try {
//       setLoading(true);
//       const res = await fetchComplaints({
//         query: f.query,
//         status: f.status,
//         complaintNumber: f.complaint_number,
//         complainantId: f.complainant_id,
//         complainantType: f.complainant_type,
//         respondentId: f.respondent_id,
//         respondentType: f.respondent_type,
//         page: p,
//       });
//       const list = Array.isArray(res?.data) ? res.data : (res?.data?.data ?? []);
//       setComplaints(list);
//       setTotal(res?.total ?? res?.data?.total ?? list.length);

//       const meta = res?.data?.meta || res?.meta;
//       if (meta?.last_page) {
//         setLastPage(meta.last_page);
//         setPage(meta.current_page ?? p);
//       } else {
//         setLastPage(list.length < PER_PAGE && p === 1 ? 1 : Math.max(p, lastPage));
//         setPage(p);
//       }
//     } catch (err) {
//       notify({ severity: 'error', title: t('complaints.loadError', 'Failed to load complaints'), message: extractApiErrorMessage(err, '') });
//       setComplaints([]);
//     } finally {
//       setLoading(false);
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [appliedFilters]);

//   useEffect(() => {
//     loadComplaints(page, appliedFilters);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [page, appliedFilters]);

//   // Free-text search stays independent — it debounces itself straight into
//   // appliedFilters, without waiting for the "Apply Filters" button.
//   const handleQueryChange = (value) => {
//     setFilters((f) => ({ ...f, query: value }));
//     if (queryDebounceRef.current) clearTimeout(queryDebounceRef.current);
//     queryDebounceRef.current = setTimeout(() => {
//       setAppliedFilters((f) => ({ ...f, query: value }));
//       setPage(1);
//     }, 400);
//   };

//   // ── Account Picker helpers ─────────────────────────
//   async function fetchPickerList(mode, target, p = 1) {
//     const source = PICKER_SOURCES[mode];
//     if (!source) return;
//     try {
//       setPickerLoading(true);
//       const { list, currentPage, lastPage: lp } = await source.list(p);
//       setPickerList(list);
//       setPickerPage(currentPage);
//       setPickerLastPage(lp);
//     } catch (err) {
//       notify({ severity: 'error', title: t('complaints.pickerLoadError', 'Failed to load accounts'), message: extractApiErrorMessage(err, '') });
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
//       const source = PICKER_SOURCES[pickerMode];
//       if (!source) return;
//       try {
//         setPickerSearchLoading(true);
//         setPickerIsSearchMode(true);
//         const results = await source.search(query.trim());
//         setPickerSearchResults(results || []);
//       } catch (err) {
//         notify({ severity: 'error', title: t('complaints.pickerSearchError', 'Search failed'), message: extractApiErrorMessage(err, '') });
//       } finally {
//         setPickerSearchLoading(false);
//       }
//     }, 400);
//   }

//   function openAccountPicker(target) {
//     const mode = filters[`${target}_type`];
//     if (!mode) return; // must choose Complainant/Respondent Type first
//     setPickerTarget(target);
//     setPickerOpen(true);
//     setPickerSearch('');
//     setPickerIsSearchMode(false);
//     setPickerSearchResults([]);
//     fetchPickerList(mode, target, 1);
//   }

//   function closeAccountPicker() {
//     setPickerOpen(false);
//     setPickerTarget(null);
//     setPickerSearch('');
//     setPickerIsSearchMode(false);
//     setPickerSearchResults([]);
//   }

//   function selectPickerAccount(acc) {
//     const name = getAccountName(acc);
//     if (pickerTarget === 'complainant') {
//       setSelectedComplainant({ id: acc.id, name });
//       setFilters((f) => ({ ...f, complainant_id: acc.id }));
//     } else if (pickerTarget === 'respondent') {
//       setSelectedRespondent({ id: acc.id, name });
//       setFilters((f) => ({ ...f, respondent_id: acc.id }));
//     }
//     closeAccountPicker();
//   }

//   function clearSelectedAccount(target, e) {
//     if (e) e.stopPropagation();
//     if (target === 'complainant') {
//       setSelectedComplainant(null);
//       setFilters((f) => ({ ...f, complainant_id: '' }));
//     } else {
//       setSelectedRespondent(null);
//       setFilters((f) => ({ ...f, respondent_id: '' }));
//     }
//   }

//   function handleComplainantTypeChange(newType) {
//     setFilters((f) => ({ ...f, complainant_type: newType, complainant_id: '' }));
//     setSelectedComplainant(null);
//   }

//   function handleRespondentTypeChange(newType) {
//     setFilters((f) => ({ ...f, respondent_type: newType, respondent_id: '' }));
//     setSelectedRespondent(null);
//   }

//   // ── Apply / Clear Filters ─────────────────────────
//   function handleApplyFilters() {
//     setAppliedFilters({ ...filters });
//     setPage(1);
//   }

//   function handleClearFilters() {
//     setFilters(EMPTY_FILTERS);
//     setAppliedFilters(EMPTY_FILTERS);
//     setSelectedComplainant(null);
//     setSelectedRespondent(null);
//     setPage(1);
//   }

//   const activeFilterCount = Object.entries(appliedFilters).filter(
//     ([key, val]) => key !== 'query' && val,
//   ).length;

//   // ── Details dialog ────────────────────────────────
//   function openDetails(complaintId) {
//     setSelectedComplaintId(complaintId);
//     setDetailsOpen(true);
//   }

//   function closeDetails(didChange) {
//     setDetailsOpen(false);
//     setSelectedComplaintId(null);
//     if (didChange) loadComplaints(page, appliedFilters);
//   }

//   // ── Theme tokens (identical to RestrictionsPage) ──
//   const surfaceBg    = isDark ? theme.palette.background.paper : '#ffffff';
//   const subtleBg     = isDark ? alpha(theme.palette.common.white, 0.04) : '#f8fafc';
//   const borderColor  = isDark ? alpha(theme.palette.common.white, 0.09) : '#e2e8f0';
//   const headingColor = theme.palette.text.primary;
//   const mutedColor   = theme.palette.text.secondary;

//   const filledInputProps = { disableUnderline: true, sx: { borderRadius: 2 } };

//   // Reusable "account search box" — opens the shared picker dialog.
//   function AccountSearchBox({ target, typeValue, selected }) {
//     const disabled = !typeValue;
//     return (
//       <Box
//         onClick={() => openAccountPicker(target)}
//         sx={{
//           px: 2, py: 1.2, borderRadius: 0, cursor: disabled ? 'not-allowed' : 'pointer',
//           opacity: disabled ? 0.6 : 1,
//           bgcolor: isDark ? alpha(theme.palette.common.white, 0.06) : '#f0f4f8',
//           border: `1px solid ${selected ? theme.palette.primary.main : borderColor}`,
//           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
//           '&:hover': disabled ? undefined : { borderColor: 'primary.main' },
//           transition: 'border-color 0.2s',
//           minHeight: 40,
//         }}
//       >
//         <Stack direction="row" spacing={1} alignItems="center">
//           {selected ? (
//             <Avatar sx={{
//               width: 22, height: 22, fontSize: 10, fontWeight: 700,
//               bgcolor: alpha(theme.palette.primary.main, 0.15), color: 'primary.main',
//             }}>
//               {selected.name.slice(0, 1)}
//             </Avatar>
//           ) : (
//             <SearchIcon sx={{ fontSize: 16, color: mutedColor }} />
//           )}
//           <Typography variant="body2" sx={{ fontWeight: 600, color: selected ? headingColor : mutedColor, fontSize: '0.82rem' }}>
//             {selected
//               ? selected.name
//               : disabled
//                 ? t('complaints.pickTypeFirst', 'Choose a type first')
//                 : t('complaints.searchAccount', `Search ${typeValue === 'provider' ? 'Provider' : 'User'}...`)}
//           </Typography>
//         </Stack>
//         <Stack direction="row" spacing={0.5} alignItems="center">
//           {selected && (
//             <IconButton size="small" onClick={(e) => clearSelectedAccount(target, e)} sx={{ p: 0.3 }}>
//               <CloseIcon sx={{ fontSize: 14 }} />
//             </IconButton>
//           )}
//           <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.72rem' }}>
//             {selected ? `#${selected.id}` : '›'}
//           </Typography>
//         </Stack>
//       </Box>
//     );
//   }

//   return (
//     <Stack
//       spacing={4}
//       dir={isRtl ? 'rtl' : 'ltr'}
//       sx={{ p: { xs: 1, md: 3 }, bgcolor: 'background.default', minHeight: '100vh' }}
//     >
//       <PageHeader
//         title={t('complaints.title', 'Complaints')}
//         subtitle={t('complaints.subtitle', 'Review and resolve complaints between users and providers')}
//       />

//       {/* ── Complaints Card ─────────────────────────── */}
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
//                 bgcolor: alpha(theme.palette.error.main, isDark ? 0.2 : 0.1),
//                 display: 'grid', placeItems: 'center', color: 'error.dark',
//               }}>
//                 <ReportProblemRoundedIcon />
//               </Box>
//               <Box>
//                 <Typography variant="h6" sx={{ fontWeight: 800, color: headingColor }}>
//                   {t('complaints.title', 'Complaints')}
//                 </Typography>
//                 <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
//                   {total} {t('complaints.totalRecords', 'total records available')}
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

//                 {/* Free-text search — applies itself independently */}
//                 <Box>
//                   <Typography variant="caption" sx={{
//                     fontWeight: 700, color: mutedColor,
//                     textTransform: 'uppercase', letterSpacing: '0.05em',
//                     display: 'block', mb: 1.5,
//                   }}>
//                     {t('complaints.searchLabel', 'Search')}
//                   </Typography>
//                   <TextField
//                     placeholder={t('complaints.searchPlaceholder', 'Search by title or description…')}
//                     value={filters.query}
//                     onChange={(e) => handleQueryChange(e.target.value)}
//                     size="small" fullWidth variant="filled"
//                     InputProps={{
//                       ...filledInputProps,
//                       startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: mutedColor }} /></InputAdornment>,
//                     }}
//                   />
//                 </Box>

//                 <Divider sx={{ borderColor }} />

//                 <Box>
//                   <Typography variant="caption" sx={{
//                     fontWeight: 700, color: mutedColor,
//                     textTransform: 'uppercase', letterSpacing: '0.05em',
//                     display: 'block', mb: 1.5,
//                   }}>
//                     {t('complaints.complaintFilters', 'Complaint Filters')}
//                   </Typography>
//                   <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
//                     <TextField
//                       select label={t('complaints.status', 'Status')} value={filters.status}
//                       onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
//                       size="small" sx={{ flex: 1 }}
//                       variant="filled" InputProps={filledInputProps}
//                     >
//                       <MenuItem value="">{t('complaints.allStatuses', 'All Statuses')}</MenuItem>
//                       {STATUS_OPTIONS.map((s) => (
//                         <MenuItem key={s} value={s}>{t(`complaints.statusValues.${s}`, s)}</MenuItem>
//                       ))}
//                     </TextField>

//                     <TextField
//                       label={t('complaints.complaintNumber', 'Complaint #')}
//                       value={filters.complaint_number}
//                       onChange={(e) => setFilters((f) => ({ ...f, complaint_number: e.target.value }))}
//                       size="small" sx={{ flex: 1 }}
//                       variant="filled" InputProps={filledInputProps}
//                     />
//                   </Stack>
//                 </Box>

//                 <Divider sx={{ borderColor }} />

//                 {/* Complainant */}
//                 <Box>
//                   <Typography variant="caption" sx={{
//                     fontWeight: 700, color: mutedColor,
//                     textTransform: 'uppercase', letterSpacing: '0.05em',
//                     display: 'block', mb: 1.5,
//                   }}>
//                     {t('complaints.complainant', 'Complainant')}
//                   </Typography>
//                   <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
//                     <TextField
//                       select label={t('complaints.complainantType', 'Complainant Type')} value={filters.complainant_type}
//                       onChange={(e) => handleComplainantTypeChange(e.target.value)}
//                       size="small" sx={{ flex: 1 }}
//                       variant="filled" InputProps={filledInputProps}
//                     >
//                       <MenuItem value="user">{t('common.user', 'User')}</MenuItem>
//                       <MenuItem value="provider">{t('common.provider', 'Provider')}</MenuItem>
//                     </TextField>
//                     <Box sx={{ flex: 1 }}>
//                       <AccountSearchBox target="complainant" typeValue={filters.complainant_type} selected={selectedComplainant} />
//                     </Box>
//                   </Stack>
//                 </Box>

//                 {/* Respondent */}
//                 <Box>
//                   <Typography variant="caption" sx={{
//                     fontWeight: 700, color: mutedColor,
//                     textTransform: 'uppercase', letterSpacing: '0.05em',
//                     display: 'block', mb: 1.5,
//                   }}>
//                     {t('complaints.respondent', 'Respondent')}
//                   </Typography>
//                   <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
//                     <TextField
//                       select label={t('complaints.respondentType', 'Respondent Type')} value={filters.respondent_type}
//                       onChange={(e) => handleRespondentTypeChange(e.target.value)}
//                       size="small" sx={{ flex: 1 }}
//                       variant="filled" InputProps={filledInputProps}
//                     >
//                       <MenuItem value="user">{t('common.user', 'User')}</MenuItem>
//                       <MenuItem value="provider">{t('common.provider', 'Provider')}</MenuItem>
//                     </TextField>
//                     <Box sx={{ flex: 1 }}>
//                       <AccountSearchBox target="respondent" typeValue={filters.respondent_type} selected={selectedRespondent} />
//                     </Box>
//                   </Stack>
//                 </Box>

//                 <Divider sx={{ borderColor }} />

//                 <Stack direction="row" spacing={1.5}>
//                   <Button
//                     variant="contained" size="small"
//                     onClick={handleApplyFilters}
//                     sx={{ borderRadius: 0.5, fontWeight: 700, px: 3, textTransform: 'none' }}
//                   >
//                     {t('complaints.applyFilters', 'Apply Filters')}
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
//           ) : complaints.length === 0 ? (
//             <Box sx={{ py: 8, textAlign: 'center', bgcolor: subtleBg, borderRadius: 4, border: `1px dashed ${borderColor}` }}>
//               <ReportProblemRoundedIcon sx={{ fontSize: 54, color: 'text.disabled', mb: 2 }} />
//               <Typography variant="h6" sx={{ fontWeight: 700, color: headingColor }}>
//                 {t('complaints.empty', 'No complaints found')}
//               </Typography>
//               <Typography variant="body2" color="text.secondary">
//                 {t('complaints.tryAdjusting', 'Try adjusting your filters.')}
//               </Typography>
//             </Box>
//           ) : (
//             <TableContainer sx={{ overflowX: 'auto' }}>
//               <Table sx={{ minWidth: 780 }}>
//                 <TableHead>
//                   <TableRow sx={{ bgcolor: subtleBg }}>
//                     {[
//                       t('complaints.number', 'Complaint #'),
//                       t('complaints.titleCol', 'Title'),
//                       t('complaints.status', 'Status'),
//                       t('complaints.createdAt', 'Created At'),
//                       t('complaints.resolvedAt', 'Resolved At'),
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
//                   {complaints.map((c) => (
//                     <TableRow key={c.id} hover sx={{ '&:last-child td': { border: 0 }, transition: 'background 0.2s', cursor: 'pointer' }} onClick={() => openDetails(c.id)}>
//                       <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace' }}>
//                         #{c.complaint_number}
//                       </TableCell>
//                       <TableCell sx={{ maxWidth: 260 }}>
//                         <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>{c.title}</Typography>
//                       </TableCell>
//                       <TableCell>
//                         <StatusChip status={c.status} t={t} />
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
//                           {toUTC3(c.created_at)}
//                         </Typography>
//                       </TableCell>
//                       <TableCell>
//                         <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
//                           {c.resolved_at ? toUTC3(c.resolved_at) : '—'}
//                         </Typography>
//                       </TableCell>
//                       <TableCell align="right">
//                         <Tooltip title={t('common.viewDetails', 'View details')}>
//                           <IconButton
//                             size="small"
//                             onClick={(e) => { e.stopPropagation(); openDetails(c.id); }}
//                             sx={{
//                               color: 'primary.main',
//                               bgcolor: isDark ? alpha(theme.palette.primary.main, 0.15) : '#f0f7ff',
//                               '&:hover': { bgcolor: isDark ? alpha(theme.palette.primary.main, 0.25) : '#e0effe' },
//                               borderRadius: 1.5,
//                             }}
//                           >
//                             <VisibilityOutlinedIcon fontSize="small" />
//                           </IconButton>
//                         </Tooltip>
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           )}

//           {/* Pagination */}
//           {!loading && complaints.length > 0 && (
//             <Stack
//               direction={{ xs: 'column', sm: 'row' }}
//               justifyContent="space-between"
//               alignItems="center"
//               spacing={2}
//               sx={{ mt: 3, pt: 2, borderTop: `1px solid ${borderColor}` }}
//             >
//               <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
//                 {t('complaints.showingCount', 'Showing')} <b>{complaints.length}</b> {t('complaints.of', 'of')} <b>{total}</b> {t('complaints.title', 'complaints').toLowerCase()}
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

//       {/* ── Account Picker Dialog (shared: Complainant / Respondent) ── */}
//       <Dialog
//         open={pickerOpen}
//         onClose={closeAccountPicker}
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
//           {pickerTarget === 'complainant'
//             ? (pickerMode === 'provider' ? t('complaints.selectComplainantProvider', 'Select Complainant Provider') : t('complaints.selectComplainantUser', 'Select Complainant User'))
//             : (pickerMode === 'provider' ? t('complaints.selectRespondentProvider', 'Select Respondent Provider') : t('complaints.selectRespondentUser', 'Select Respondent User'))}
//           <IconButton onClick={closeAccountPicker} size="small" sx={{ bgcolor: subtleBg, border: `1px solid ${borderColor}` }}>
//             <CloseIcon fontSize="small" />
//           </IconButton>
//         </DialogTitle>

//         <Divider sx={{ borderColor }} />

//         <DialogContent sx={{ p: 2.5 }}>
//           <Stack spacing={2}>
//             {/* Search */}
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

//             {/* List */}
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
//                   const currentId = pickerTarget === 'complainant' ? filters.complainant_id : filters.respondent_id;
//                   const isSelected = acc.id === currentId;
//                   return (
//                     <Box
//                       key={acc.id}
//                       onClick={() => selectPickerAccount(acc)}
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

//             {/* Pagination (only in "list all" mode, not while searching) */}
//             {!pickerIsSearchMode && pickerLastPage > 1 && (
//               <>
//                 <Divider sx={{ borderColor }} />
//                 <Stack direction="row" justifyContent="center">
//                   <Pagination
//                     count={pickerLastPage} page={pickerPage} size="small"
//                     onChange={(_, v) => fetchPickerList(pickerMode, pickerTarget, v)}
//                     color="primary" shape="rounded" disabled={pickerLoading}
//                   />
//                 </Stack>
//               </>
//             )}
//           </Stack>
//         </DialogContent>
//       </Dialog>

//       <ComplaintDetailsDialog
//         open={detailsOpen}
//         complaintId={selectedComplaintId}
//         onClose={closeDetails}
//       />
//     </Stack>
//   );
// }

// export default ComplaintsPage;

import { useEffect, useState, useCallback, useRef } from 'react';
import {
  Box, Button, Card, CardContent, Chip, CircularProgress,
  Divider, MenuItem, Skeleton, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Typography, Pagination,
  Dialog, DialogContent, DialogTitle, IconButton, Collapse, alpha, useTheme,
  Tooltip, Avatar, InputAdornment,
} from '@mui/material';
import ReportProblemRoundedIcon from '@mui/icons-material/ReportProblemRounded';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SearchIcon from '@mui/icons-material/Search';
import PageHeader from '../components/PageHeader';
import { useTranslation } from 'react-i18next';
import { fetchComplaints, extractApiErrorMessage } from '../services/complaintsService';
import { fetchAllUsers, searchUsers, fetchAllProviders, searchProviders } from '../services/accountsService';
import { STATUS_OPTIONS, getStatusStyle, toUTC3 } from '../components/complaints/complaintStatus';
import ComplaintDetailsDialog from '../components/complaints/ComplaintDetailsDialog';
import { useAppContext } from '../context/AppContext';

const EMPTY_FILTERS = {
  query: '',
  status: '',
  complaint_number: '',
  complainant_type: '',
  complainant_id: '',
  respondent_type: '',
  respondent_id: '',
};

// Endpoints used by the account picker dialog (mirrors RestrictionsPage's PICKER_ENDPOINTS)
const PICKER_SOURCES = {
  user: { list: fetchAllUsers, search: searchUsers },
  provider: { list: fetchAllProviders, search: searchProviders },
};

function getAccountName(acc) {
  if (!acc) return '';
  if (acc.name) return acc.name;
  if (acc.full_name) return acc.full_name;
  const combined = `${acc.first_name || ''} ${acc.last_name || ''}`.trim();
  return combined || acc.username || acc.email || `#${acc.id}`;
}

// ── Status Chip (dark-mode aware, same pattern as RestrictionsPage's chips) ──
function StatusChip({ status, t }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const style = getStatusStyle(status);
  return (
    <Chip
      label={t(`complaints.statusValues.${status}`, status)}
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

// ── Page ─────────────────────────────────────────────
function ComplaintsPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const { notify } = useAppContext();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  // ── Complaints ────────────────────────────────────
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // ── Filters ───────────────────────────────────────
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [appliedFilters, setAppliedFilters] = useState(EMPTY_FILTERS);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const queryDebounceRef = useRef(null);

  // ── Details dialog ────────────────────────────────
  const [selectedComplaintId, setSelectedComplaintId] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // ── Account Picker (shared dialog, used for both Complainant & Respondent) ──
  const [selectedComplainant, setSelectedComplainant] = useState(null); // { id, name }
  const [selectedRespondent, setSelectedRespondent] = useState(null); // { id, name }
  const [pickerTarget, setPickerTarget] = useState(null); // 'complainant' | 'respondent' | null
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

  const pickerMode = pickerTarget ? filters[`${pickerTarget}_type`] : null; // 'user' | 'provider'

  // ── Fetch Complaints ──────────────────────────────
  const loadComplaints = useCallback(async (p = 1, f = appliedFilters) => {
    try {
      setLoading(true);
      const res = await fetchComplaints({
        query: f.query,
        status: f.status,
        complaintNumber: f.complaint_number,
        complainantId: f.complainant_id,
        complainantType: f.complainant_type,
        respondentId: f.respondent_id,
        respondentType: f.respondent_type,
        page: p,
      });
      const payload = res?.data;
      const list = Array.isArray(payload) ? payload : (payload?.data ?? []);
      setComplaints(list);
      setTotal(payload?.total ?? list.length);
      setLastPage(payload?.last_page ?? 1);
      setPage(payload?.current_page ?? p);
    } catch (err) {
      notify({ severity: 'error', title: t('complaints.loadError', 'Failed to load complaints'), message: extractApiErrorMessage(err, '') });
      setComplaints([]);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appliedFilters]);

  useEffect(() => {
    loadComplaints(page, appliedFilters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, appliedFilters]);

  // Free-text search stays independent — it debounces itself straight into
  // appliedFilters, without waiting for the "Apply Filters" button.
  const handleQueryChange = (value) => {
    setFilters((f) => ({ ...f, query: value }));
    if (queryDebounceRef.current) clearTimeout(queryDebounceRef.current);
    queryDebounceRef.current = setTimeout(() => {
      setAppliedFilters((f) => ({ ...f, query: value }));
      setPage(1);
    }, 400);
  };

  // ── Account Picker helpers ─────────────────────────
  async function fetchPickerList(mode, target, p = 1) {
    const source = PICKER_SOURCES[mode];
    if (!source) return;
    try {
      setPickerLoading(true);
      const { list, currentPage, lastPage: lp } = await source.list(p);
      setPickerList(list);
      setPickerPage(currentPage);
      setPickerLastPage(lp);
    } catch (err) {
      notify({ severity: 'error', title: t('complaints.pickerLoadError', 'Failed to load accounts'), message: extractApiErrorMessage(err, '') });
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
      const source = PICKER_SOURCES[pickerMode];
      if (!source) return;
      try {
        setPickerSearchLoading(true);
        setPickerIsSearchMode(true);
        const results = await source.search(query.trim());
        setPickerSearchResults(results || []);
      } catch (err) {
        notify({ severity: 'error', title: t('complaints.pickerSearchError', 'Search failed'), message: extractApiErrorMessage(err, '') });
      } finally {
        setPickerSearchLoading(false);
      }
    }, 400);
  }

  function openAccountPicker(target) {
    const mode = filters[`${target}_type`];
    if (!mode) return; // must choose Complainant/Respondent Type first
    setPickerTarget(target);
    setPickerOpen(true);
    setPickerSearch('');
    setPickerIsSearchMode(false);
    setPickerSearchResults([]);
    fetchPickerList(mode, target, 1);
  }

  function closeAccountPicker() {
    setPickerOpen(false);
    setPickerTarget(null);
    setPickerSearch('');
    setPickerIsSearchMode(false);
    setPickerSearchResults([]);
  }

  function selectPickerAccount(acc) {
    const name = getAccountName(acc);
    if (pickerTarget === 'complainant') {
      setSelectedComplainant({ id: acc.id, name });
      setFilters((f) => ({ ...f, complainant_id: acc.id }));
    } else if (pickerTarget === 'respondent') {
      setSelectedRespondent({ id: acc.id, name });
      setFilters((f) => ({ ...f, respondent_id: acc.id }));
    }
    closeAccountPicker();
  }

  function clearSelectedAccount(target, e) {
    if (e) e.stopPropagation();
    if (target === 'complainant') {
      setSelectedComplainant(null);
      setFilters((f) => ({ ...f, complainant_id: '' }));
    } else {
      setSelectedRespondent(null);
      setFilters((f) => ({ ...f, respondent_id: '' }));
    }
  }

  function handleComplainantTypeChange(newType) {
    setFilters((f) => ({ ...f, complainant_type: newType, complainant_id: '' }));
    setSelectedComplainant(null);
  }

  function handleRespondentTypeChange(newType) {
    setFilters((f) => ({ ...f, respondent_type: newType, respondent_id: '' }));
    setSelectedRespondent(null);
  }

  // ── Apply / Clear Filters ─────────────────────────
  function handleApplyFilters() {
    setAppliedFilters({ ...filters });
    setPage(1);
  }

  function handleClearFilters() {
    setFilters(EMPTY_FILTERS);
    setAppliedFilters(EMPTY_FILTERS);
    setSelectedComplainant(null);
    setSelectedRespondent(null);
    setPage(1);
  }

  const activeFilterCount = Object.entries(appliedFilters).filter(
    ([key, val]) => key !== 'query' && val,
  ).length;

  // ── Details dialog ────────────────────────────────
  function openDetails(complaintId) {
    setSelectedComplaintId(complaintId);
    setDetailsOpen(true);
  }

  function closeDetails(didChange) {
    setDetailsOpen(false);
    setSelectedComplaintId(null);
    if (didChange) loadComplaints(page, appliedFilters);
  }

  // ── Theme tokens (identical to RestrictionsPage) ──
  const surfaceBg    = isDark ? theme.palette.background.paper : '#ffffff';
  const subtleBg     = isDark ? alpha(theme.palette.common.white, 0.04) : '#f8fafc';
  const borderColor  = isDark ? alpha(theme.palette.common.white, 0.09) : '#e2e8f0';
  const headingColor = theme.palette.text.primary;
  const mutedColor   = theme.palette.text.secondary;

  const filledInputProps = { disableUnderline: true, sx: { borderRadius: 2 } };

  // Reusable "account search box" — opens the shared picker dialog.
  function AccountSearchBox({ target, typeValue, selected }) {
    const disabled = !typeValue;
    return (
      <Box
        onClick={() => openAccountPicker(target)}
        sx={{
          px: 2, py: 1.2, borderRadius: 0, cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1,
          bgcolor: isDark ? alpha(theme.palette.common.white, 0.06) : '#f0f4f8',
          border: `1px solid ${selected ? theme.palette.primary.main : borderColor}`,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          '&:hover': disabled ? undefined : { borderColor: 'primary.main' },
          transition: 'border-color 0.2s',
          minHeight: 40,
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {selected ? (
            <Avatar sx={{
              width: 22, height: 22, fontSize: 10, fontWeight: 700,
              bgcolor: alpha(theme.palette.primary.main, 0.15), color: 'primary.main',
            }}>
              {selected.name.slice(0, 1)}
            </Avatar>
          ) : (
            <SearchIcon sx={{ fontSize: 16, color: mutedColor }} />
          )}
          <Typography variant="body2" sx={{ fontWeight: 600, color: selected ? headingColor : mutedColor, fontSize: '0.82rem' }}>
            {selected
              ? selected.name
              : disabled
                ? t('complaints.pickTypeFirst', 'Choose a type first')
                : t('complaints.searchAccount', `Search ${typeValue === 'provider' ? 'Provider' : 'User'}...`)}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={0.5} alignItems="center">
          {selected && (
            <IconButton size="small" onClick={(e) => clearSelectedAccount(target, e)} sx={{ p: 0.3 }}>
              <CloseIcon sx={{ fontSize: 14 }} />
            </IconButton>
          )}
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.72rem' }}>
            {selected ? `#${selected.id}` : '›'}
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <Stack
      spacing={4}
      dir={isRtl ? 'rtl' : 'ltr'}
      sx={{ p: { xs: 1, md: 3 }, bgcolor: 'background.default', minHeight: '100vh' }}
    >
      <PageHeader
        title={t('complaints.title', 'Complaints')}
        subtitle={t('complaints.subtitle', 'Review and resolve complaints between users and providers')}
      />

      {/* ── Complaints Card ─────────────────────────── */}
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
                bgcolor: alpha(theme.palette.error.main, isDark ? 0.2 : 0.1),
                display: 'grid', placeItems: 'center', color: 'error.dark',
              }}>
                <ReportProblemRoundedIcon />
              </Box>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: headingColor }}>
                  {t('complaints.title', 'Complaints')}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
                  {total} {t('complaints.totalRecords', 'total records available')}
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

                {/* Free-text search — applies itself independently */}
                <Box>
                  <Typography variant="caption" sx={{
                    fontWeight: 700, color: mutedColor,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    display: 'block', mb: 1.5,
                  }}>
                    {t('complaints.searchLabel', 'Search')}
                  </Typography>
                  <TextField
                    placeholder={t('complaints.searchPlaceholder', 'Search by title or description…')}
                    value={filters.query}
                    onChange={(e) => handleQueryChange(e.target.value)}
                    size="small" fullWidth variant="filled"
                    InputProps={{
                      ...filledInputProps,
                      startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 18, color: mutedColor }} /></InputAdornment>,
                    }}
                  />
                </Box>

                <Divider sx={{ borderColor }} />

                <Box>
                  <Typography variant="caption" sx={{
                    fontWeight: 700, color: mutedColor,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    display: 'block', mb: 1.5,
                  }}>
                    {t('complaints.complaintFilters', 'Complaint Filters')}
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      select label={t('complaints.status', 'Status')} value={filters.status}
                      onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))}
                      size="small" sx={{ flex: 1 }}
                      variant="filled" InputProps={filledInputProps}
                    >
                      <MenuItem value="">{t('complaints.allStatuses', 'All Statuses')}</MenuItem>
                      {STATUS_OPTIONS.map((s) => (
                        <MenuItem key={s} value={s}>{t(`complaints.statusValues.${s}`, s)}</MenuItem>
                      ))}
                    </TextField>

                    <TextField
                      label={t('complaints.complaintNumber', 'Complaint #')}
                      value={filters.complaint_number}
                      onChange={(e) => setFilters((f) => ({ ...f, complaint_number: e.target.value }))}
                      size="small" sx={{ flex: 1 }}
                      variant="filled" InputProps={filledInputProps}
                    />
                  </Stack>
                </Box>

                <Divider sx={{ borderColor }} />

                {/* Complainant */}
                <Box>
                  <Typography variant="caption" sx={{
                    fontWeight: 700, color: mutedColor,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    display: 'block', mb: 1.5,
                  }}>
                    {t('complaints.complainant', 'Complainant')}
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      select label={t('complaints.complainantType', 'Complainant Type')} value={filters.complainant_type}
                      onChange={(e) => handleComplainantTypeChange(e.target.value)}
                      size="small" sx={{ flex: 1 }}
                      variant="filled" InputProps={filledInputProps}
                    >
                      <MenuItem value="user">{t('common.user', 'User')}</MenuItem>
                      <MenuItem value="provider">{t('common.provider', 'Provider')}</MenuItem>
                    </TextField>
                    <Box sx={{ flex: 1 }}>
                      <AccountSearchBox target="complainant" typeValue={filters.complainant_type} selected={selectedComplainant} />
                    </Box>
                  </Stack>
                </Box>

                {/* Respondent */}
                <Box>
                  <Typography variant="caption" sx={{
                    fontWeight: 700, color: mutedColor,
                    textTransform: 'uppercase', letterSpacing: '0.05em',
                    display: 'block', mb: 1.5,
                  }}>
                    {t('complaints.respondent', 'Respondent')}
                  </Typography>
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                    <TextField
                      select label={t('complaints.respondentType', 'Respondent Type')} value={filters.respondent_type}
                      onChange={(e) => handleRespondentTypeChange(e.target.value)}
                      size="small" sx={{ flex: 1 }}
                      variant="filled" InputProps={filledInputProps}
                    >
                      <MenuItem value="user">{t('common.user', 'User')}</MenuItem>
                      <MenuItem value="provider">{t('common.provider', 'Provider')}</MenuItem>
                    </TextField>
                    <Box sx={{ flex: 1 }}>
                      <AccountSearchBox target="respondent" typeValue={filters.respondent_type} selected={selectedRespondent} />
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
                    {t('complaints.applyFilters', 'Apply Filters')}
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
          ) : complaints.length === 0 ? (
            <Box sx={{ py: 8, textAlign: 'center', bgcolor: subtleBg, borderRadius: 4, border: `1px dashed ${borderColor}` }}>
              <ReportProblemRoundedIcon sx={{ fontSize: 54, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 700, color: headingColor }}>
                {t('complaints.empty', 'No complaints found')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {t('complaints.tryAdjusting', 'Try adjusting your filters.')}
              </Typography>
            </Box>
          ) : (
            <TableContainer sx={{ overflowX: 'auto' }}>
              <Table sx={{ minWidth: 780 }}>
                <TableHead>
                  <TableRow sx={{ bgcolor: subtleBg }}>
                    {[
                      t('complaints.number', 'Complaint #'),
                      t('complaints.titleCol', 'Title'),
                      t('complaints.status', 'Status'),
                      t('complaints.createdAt', 'Created At'),
                      t('complaints.resolvedAt', 'Resolved At'),
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
                  {complaints.map((c) => (
                    <TableRow key={c.id} hover sx={{ '&:last-child td': { border: 0 }, transition: 'background 0.2s', cursor: 'pointer' }} onClick={() => openDetails(c.id)}>
                      <TableCell sx={{ color: 'text.secondary', fontSize: '0.85rem', fontWeight: 600, fontFamily: 'monospace' }}>
                        #{c.complaint_number}
                      </TableCell>
                      <TableCell sx={{ maxWidth: 260 }}>
                        <Typography variant="body2" noWrap sx={{ fontWeight: 500 }}>{c.title}</Typography>
                      </TableCell>
                      <TableCell>
                        <StatusChip status={c.status} t={t} />
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                          {toUTC3(c.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, whiteSpace: 'nowrap' }}>
                          {c.resolved_at ? toUTC3(c.resolved_at) : '—'}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Tooltip title={t('common.viewDetails', 'View details')}>
                          <IconButton
                            size="small"
                            onClick={(e) => { e.stopPropagation(); openDetails(c.id); }}
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
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {/* Pagination */}
          {!loading && complaints.length > 0 && (
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              justifyContent="space-between"
              alignItems="center"
              spacing={2}
              sx={{ mt: 3, pt: 2, borderTop: `1px solid ${borderColor}` }}
            >
              <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
                {t('complaints.showingCount', 'Showing')} <b>{complaints.length}</b> {t('complaints.of', 'of')} <b>{total}</b> {t('complaints.title', 'complaints').toLowerCase()}
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

      {/* ── Account Picker Dialog (shared: Complainant / Respondent) ── */}
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
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 800, pb: 2, pt: 3, color: headingColor }}>
          {pickerTarget === 'complainant'
            ? (pickerMode === 'provider' ? t('complaints.selectComplainantProvider', 'Select Complainant Provider') : t('complaints.selectComplainantUser', 'Select Complainant User'))
            : (pickerMode === 'provider' ? t('complaints.selectRespondentProvider', 'Select Respondent Provider') : t('complaints.selectRespondentUser', 'Select Respondent User'))}
          <IconButton onClick={closeAccountPicker} size="small" sx={{ bgcolor: subtleBg, border: `1px solid ${borderColor}` }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>

        <Divider sx={{ borderColor }} />

        <DialogContent sx={{ p: 2.5 }}>
          <Stack spacing={2}>
            {/* Search */}
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

            {/* List */}
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
                  const currentId = pickerTarget === 'complainant' ? filters.complainant_id : filters.respondent_id;
                  const isSelected = acc.id === currentId;
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
                          {name.slice(0, 1)}
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
                        <Box sx={{ width: 20, height: 20, borderRadius: '50%', bgcolor: 'primary.main', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
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
                    onChange={(_, v) => fetchPickerList(pickerMode, pickerTarget, v)}
                    color="primary" shape="rounded" disabled={pickerLoading}
                  />
                </Stack>
              </>
            )}
          </Stack>
        </DialogContent>
      </Dialog>

      <ComplaintDetailsDialog
        open={detailsOpen}
        complaintId={selectedComplaintId}
        onClose={closeDetails}
      />
    </Stack>
  );
}

export default ComplaintsPage;