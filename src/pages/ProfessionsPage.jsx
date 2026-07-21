// import { useMemo, useState,useEffect } from 'react';
// import {
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Chip,
//   Divider,
//   Grid,
//   IconButton,
//   InputAdornment,
//   MenuItem,
//   Stack,
//   TextField,
//   Typography,
// } from '@mui/material';
// import AddRoundedIcon from '@mui/icons-material/AddRounded';
// import WorkIcon from '@mui/icons-material/Work';
// import GroupsIcon from '@mui/icons-material/Groups';
// import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
// import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
// import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
// import SearchIcon from '@mui/icons-material/Search';
// import { useNavigate } from 'react-router-dom';
// import PageHeader from '../components/PageHeader';
// import ProfessionDialog from '../components/ProfessionDialog';
// import { useAppContext } from '../context/AppContext';
// import { useTranslation } from 'react-i18next';
// import api from '../utils/axiosInstance';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
// import ToggleOnIcon from '@mui/icons-material/ToggleOn';
// import ToggleOffIcon from '@mui/icons-material/ToggleOff';
// import { Menu } from '@mui/material';
// import { Dialog, DialogContent, DialogActions } from '@mui/material';

// import { CircularProgress } from '@mui/material';
// import { useRef } from 'react';
// function ProfessionsPage() {
//   const navigate = useNavigate();
//   const { professions, Providers, addProfession, updateProfession ,setProfessions, notify } = useAppContext();
//   const { t, i18n } = useTranslation();
//   const isRtl = i18n.dir() === 'rtl';
//   const [dialogOpen, setDialogOpen] = useState(false);
//   const [activeProfession, setActiveProfession] = useState(null);
//   const [search, setSearch] = useState('');
// const [loading, setLoading] = useState(false);

// const [loadingAction, setLoadingAction] = useState(null);
// const [searchLoading, setSearchLoading] = useState(false);
// const debounceRef = useRef(null);
// const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
// const [displayProfessions, setDisplayProfessions] = useState([]);
//   // عدّل الـ enrichedProfessions
// const enrichedProfessions = useMemo(
//   () =>
//     displayProfessions.map((p) => ({
//       ...p,
//      ProviderCount: Providers.filter((w) => w.category_id === p.id).length,
//       // ProviderCount: Providers.filter((w) => w.professionId === p.id).length,
//     })),
//   [displayProfessions, Providers],
// );

 
//   const summaryCards = useMemo(() => {
//     const totalProviders = Providers.length;
//     const avgCommission = professions.length ? `${(professions.reduce((s, x) => s + Number(x.commission || 0), 0) / professions.length).toFixed(1)}%` : '—';

//     return [
//       { label: t('professions.summary.total', { defaultValue: 'Total professions' }), value: professions.length, helper: t('professions.summary.totalHelp', { defaultValue: 'Categories available' }) },
//       { label: t('professions.summary.Providers', { defaultValue: 'Total Providers' }), value: totalProviders, helper: t('professions.summary.ProvidersHelp', { defaultValue: 'Providers across categories' }) },
//       { label: t('professions.summary.avgCommission', { defaultValue: 'Average commission' }), value: avgCommission, helper: t('professions.summary.avgCommissionHelp', { defaultValue: 'Across all professions' }) },
//     ];
//   }, [professions, Providers, t]);

//   function openAddDialog() {
//     setActiveProfession(null);
//     setDialogOpen(true);
//   }

//   function openEditDialog(profession) {
//     setActiveProfession(profession);
//     setDialogOpen(true);
//   }

//   async function handleSubmit(values) {
//     setLoadingAction({ type: activeProfession ? 'edit' : 'add' });
//   try {
//     const formData = new FormData();
//     formData.append('name', values.name);
//     formData.append('commission', Number(values.commission));
//     if (values.imageFile) {
//       formData.append('image', values.imageFile); // ← File object مو base64
//     }
//         console.log('imageFile:', values.imageFile); // ← تحقق إذا واصل

//  for (let [key, value] of formData.entries()) {
//       console.log(key, value);
//     }
   
//     if (activeProfession) {
//       // UPDATE
//       const updateForm = new FormData();
//       updateForm.append('category_id', activeProfession.id);
//       updateForm.append('name', values.name);
//       if (values.commission) updateForm.append('commission', Number(values.commission));
//       if (values.imageFile) updateForm.append('image', values.imageFile);

//       const response = await api.post('/admin/category/update-category', updateForm, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       const data = response.data.data;
//       updateProfession(activeProfession.id, {
//         name: data.name,
//         commission: data.commission,
//         image: data.image_url,
//         is_active: data.is_active,
//       });
//     }
//     // creat 
//     else {
//       const response = await api.post('/admin/category/create-category', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       const data = response.data.data;
//       setProfessions((prev) => [
//   {
//     id: Number(data.id),
//     name: data.name,
//     commission: Number(data.commission),
//     image: data.image_url,
//     is_active: data.is_active ?? true,
//   },
//   ...prev,
// ]);

// notify({
//   severity: 'success',
//   title: 'Profession added',
//   message: `${data.name} was added to the system.`,
// });
//     }

//     setDialogOpen(false);
//   } catch (err) {
//      console.error('Error details:', err.response?.data);
//     notify({ severity: 'error', message: 'Something went wrong.' });

//     }finally {
//     setLoadingAction(null);
//   }
// }
// useEffect(() => {
//   async function fetchCategories() {
//     try {
//       setLoading(true);
//       const response = await api.get('/admin/category/all-categories');
//       const mapped = response.data.data.map((cat) => ({
//         id: cat.id,
//         name: cat.name,
//         commission: cat.commission,
//         image: cat.image_url,
//         is_active: cat.is_active,
//       }));
//       setProfessions(mapped);
//       setDisplayProfessions(mapped); // ← أضف هذا
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }
//   fetchCategories();
// }, []);

// // useEffect(() => {
// //   if (!search.trim()) {
// //     setDisplayProfessions(professions); // ← رجع الكل
// //     return;
// //   }

// //   const timeout = setTimeout(async () => {
// //     try {
// //       const response = await api.get(`/admin/category/search?query=${search.trim()}`);
// //       const mapped = response.data.data.map((cat) => ({
// //         id: cat.id,
// //         name: cat.name,
// //         commission: cat.commission,
// //         image: cat.image_url,
// //         is_active: cat.is_active,
// //       }));
// //       setDisplayProfessions(mapped); // ← حدث العرض بس مو الـ professions
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   }, 500);

// //   return () => clearTimeout(timeout);
// // }, [search, professions]);

// useEffect(() => {
//   if (debounceRef.current) clearTimeout(debounceRef.current);
//   if (!search.trim()) {
//     setDisplayProfessions(professions);
//     setSearchLoading(false);
//     return;
//   }
//   setSearchLoading(true);
//   debounceRef.current = setTimeout(async () => {
//     try {
//       const response = await api.get(`/admin/category/search?query=${search.trim()}`);
//       const mapped = response.data.data.map((cat) => ({
//         id: cat.id,
//         name: cat.name,
//         commission: cat.commission,
//         image: cat.image_url,
//         is_active: cat.is_active,
//       }));
//       setDisplayProfessions(mapped);
//     } catch (err) {
//       console.error(err);
//     } finally {
//       setSearchLoading(false);
//     }
//   }, 500);
//   return () => clearTimeout(debounceRef.current);
// }, [search, professions]);

// const [menuAnchor, setMenuAnchor] = useState(null);
// const [menuProfession, setMenuProfession] = useState(null);

// function handleMenuOpen(event, profession) {
//   setMenuAnchor(event.currentTarget);
//   setMenuProfession(profession);
// }

// function handleMenuClose() {
//   setMenuAnchor(null);
//   setMenuProfession(null);
// }

// if (loading) {
//   return (
//     <Box
//       sx={{
//         position: 'fixed',
//         inset: 0,
//         zIndex: 9999,
//         backgroundColor: 'rgba(15, 23, 42, 0.45)',
//         backdropFilter: 'blur(4px)',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         gap: 2,
//       }}
//     >
//       <CircularProgress size={64} thickness={4} sx={{ color: '#ffffff' }} />
//       <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
//         {t('professions.loading', { defaultValue: 'Loading professions...' })}
//       </Typography>
//     </Box>
//   );
// }
//   return (
//     <Stack spacing={3.5} dir={isRtl ? 'rtl' : 'ltr'}>
//       {loadingAction && (
//   <Box
//     sx={{
//       position: 'fixed',
//       inset: 0,
//       zIndex: 9999,
//       backgroundColor: 'rgba(15, 23, 42, 0.45)',
//       backdropFilter: 'blur(4px)',
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       gap: 2,
//     }}
//   >
//     <CircularProgress size={64} thickness={4} sx={{ color: '#ffffff' }} />
//     <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
//       {loadingAction.type === 'activate' && t('professions.activating', { defaultValue: 'Activating profession...' })}
//       {loadingAction.type === 'deactivate' && t('professions.deactivating', { defaultValue: 'Deactivating profession...' })}
//       {loadingAction.type === 'delete' && t('professions.deleting', { defaultValue: 'Deleting profession...' })}
//       {loadingAction.type === 'edit' && t('professions.editing', { defaultValue: 'Saving changes...' })}
// {loadingAction.type === 'add' && t('professions.adding', { defaultValue: 'Creating profession...' })}
//     </Typography>
//   </Box>
// )}
//       <PageHeader
//         title={t('professions.title')}
//         subtitle={t('professions.subtitle')}
//         actions={
//           <Button startIcon={<AddRoundedIcon />} variant="contained" size="large" onClick={openAddDialog}>
//             {t('professions.add')}
//           </Button>
//         }
//       />

//       <Grid container spacing={2.25}>
//         {summaryCards.map((card) => (
//           <Grid key={card.label} item xs={12} sm={6}>
//             <Card
//               elevation={0}
//               sx={(theme) => ({
//                 borderRadius: 2,
//                 border: `1px solid ${theme.palette.divider}`,
//                 background: `linear-gradient(180deg, ${theme.palette.background.paper}, ${theme.palette.action.hover})`,
//               })}
//             >
//               <CardContent sx={{ p: 2.5 }}>
//                 <Stack spacing={0.75}>
//                   <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
//                     {card.label}
//                   </Typography>
//                   <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.03em' }}>
//                     {card.value}
//                   </Typography>
//                   <Typography variant="body2" color="text.secondary">
//                     {card.helper}
//                   </Typography>
//                 </Stack>
//               </CardContent>
//             </Card>
//           </Grid>
//         ))}
//       </Grid>

//       <Card
//         elevation={0}
//         sx={(theme) => ({
//           borderRadius: 2,
//           border: `1px solid ${theme.palette.divider}`,
//           overflow: 'hidden',
//         })}
//       >
//         <CardContent sx={{ p: { xs: 2, md: 3 } }}>
//           <Stack spacing={2.5}>
//             <Grid container spacing={2} alignItems="center">
//               <Grid item xs={12} lg={7}>
//                 <TextField
//                   value={search}
//                   onChange={(event) => setSearch(event.target.value)}
//                   placeholder={t('professions.searchPlaceholder', { defaultValue: 'Search professions or commission...' })}
//                   fullWidth
//                   InputProps={{
//                     startAdornment: (
//                       <InputAdornment position="start">
//                         <SearchIcon fontSize="small" />
//                       </InputAdornment>
//                     ),
//                   }}
//                 />
//               </Grid>
//               <Grid item xs={12} lg={5}>
//                 {/* reserved for future filters */}
//               </Grid>
//             </Grid>

//             <Divider />
// {searchLoading && (
//   <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 1 }}>
//     <CircularProgress size={18} thickness={4} sx={{ color: '#2563eb' }} />
//     <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#64748b' }}>
//       {t('professions.searching', { defaultValue: 'Searching...' })}
//     </Typography>
//   </Stack>
// )}
//             <Stack spacing={1.75}>
//              {enrichedProfessions.length ? (
//   enrichedProfessions.map((profession) => (
//                   <Card
//                     key={profession.id}
//                     elevation={0}
//                     sx={(theme) => ({
//                       borderRadius: 2,
//                       border: `1px solid ${theme.palette.divider}`,
//                       backgroundColor: theme.palette.background.default,
//                       transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease',
//                       '&:hover': {
//                         transform: 'translateY(-2px)',
//                         boxShadow: theme.shadows[6],
//                         borderColor: theme.palette.primary.light,
//                       },
//                     })}
//                   >
//                     <CardContent sx={{ p: { xs: 2.25, md: 3 } }}>
//                       <Stack spacing={2.25} direction={{ xs: 'column', md: 'row' }} alignItems="center" justifyContent="space-between">
//                         <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
//                           <Avatar
//                             sx={(theme) => ({
//                               width: 72,
//                               height: 72,
//                               fontSize: 28,
//                               bgcolor: theme.palette.primary.light,
//                               color: theme.palette.primary.dark,
//                               fontWeight: 800,
//                             })}
//                           >
//                             {profession.image ? (
//                               // eslint-disable-next-line jsx-a11y/img-redundant-alt
//                               <img src={profession.image} alt="profession" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
//                             ) : (
//                               (profession.name || '').slice(0, 1)
//                             )}
//                           </Avatar>

//                           <Box>
//                             <Stack spacing={0.75}>
//                               <Box>
//                                 <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
//                                   {profession.name}
//                                 </Typography>
//                                 <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
//                                   {profession.ProviderCount} {t('professions.ProvidersShort', { defaultValue: 'Providers' })}
//                                 </Typography>
//                               </Box>

//                               <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
//                                 <Chip size="small" icon={<GroupsIcon />} label={`${profession.ProviderCount} ${t('professions.ProvidersShort', { defaultValue: 'Providers' })}`} />
//                                 <Chip size="small" label={`${Number(profession.commission || 0)} ${t('professions.commission')}`} />
//                               </Stack>
//                             </Stack>
//                           </Box>
//                         </Stack>

//                       <Stack direction="row" spacing={0.75} alignItems="center">
//   <Chip
//     size="small"
//     label={profession.is_active ? 'Active' : 'Inactive'}
//     color={profession.is_active ? 'success' : 'default'}
//     sx={{ fontWeight: 700 }}
//   />
//   <IconButton
//     onClick={() => navigate(`/professions/${profession.id}`, { state: { profession } })}
//   >
//     <VisibilityOutlinedIcon fontSize="small" />
//   </IconButton>
//   <IconButton onClick={() => openEditDialog(profession)}>
//     <EditOutlinedIcon fontSize="small" />
//   </IconButton>
//   <IconButton onClick={(e) => handleMenuOpen(e, profession)}>
//     <MoreVertIcon fontSize="small" />
//   </IconButton>
// </Stack>
//                       </Stack>
//                     </CardContent>
//                   </Card>
//                 ))
//               ) : (
//                 <Card elevation={0} sx={(theme) => ({ borderRadius: 4, border: `1px solid ${theme.palette.divider}` })}>
//                   <CardContent>
//                     <Box sx={{ py: 4, textAlign: 'center' }}>
//                       <Typography variant="h6" sx={{ fontWeight: 800 }}>
//                         {t('professions.emptyTitle', { defaultValue: 'No job categories yet' })}
//                       </Typography>
//                       <Typography color="text.secondary" sx={{ mt: 1 }}>
//                         {t('professions.emptySubtitle', { defaultValue: 'Create your first profession to start grouping Providers.' })}
//                       </Typography>
//                     </Box>
//                   </CardContent>
//                 </Card>
//               )}
//             </Stack>
//           </Stack>
//         </CardContent>
//       </Card>
//       <Menu
//   anchorEl={menuAnchor}
//   open={Boolean(menuAnchor)}
//   onClose={handleMenuClose}
//   PaperProps={{ sx: { borderRadius: 3, minWidth: 180 } }}
// >
//   <MenuItem
//   onClick={async () => {
//       handleMenuClose();
//   setLoadingAction({ type: menuProfession.is_active ? 'deactivate' : 'activate' });
//     try {
//       const action = menuProfession.is_active ? 'deactivate' : 'activate';
//       await api.post(`/admin/category/${menuProfession.id}/${action}`);
      
//       setProfessions((prev) =>
//         prev.map((p) =>
//           p.id === menuProfession.id ? { ...p, is_active: !p.is_active } : p
//         )
//       );

//       notify({
//         severity: 'success',
//         title: menuProfession.is_active ? 'Deactivated' : 'Activated',
//         message: `${menuProfession.name} has been ${menuProfession.is_active ? 'deactivated' : 'activated'} successfully.`,
//       });
//     } catch (err) {
//       console.error('Toggle error:', err.response?.data);
//       notify({ severity: 'error', title: 'Error', message: 'Failed to update status.' });
//     } finally {
//     setLoadingAction(null);
//   }

//   }}
//   sx={{ gap: 1.5 }}
// >
//   {menuProfession?.is_active ? (
//     <><ToggleOffIcon color="warning" /> Deactivate</>
//   ) : (
//     <><ToggleOnIcon color="success" /> Activate</>
//   )}
// </MenuItem>

//   <MenuItem
//   onClick={() => {
//     setDeleteDialogOpen(true);
//   }}
//   sx={{ gap: 1.5, color: 'error.main' }}
// >
//   <DeleteOutlineIcon fontSize="small" /> Delete
// </MenuItem>
// </Menu>
// <Dialog
//   open={deleteDialogOpen}
//   onClose={() => setDeleteDialogOpen(false)}
//   PaperProps={{ sx: { borderRadius: 4, p: 1, minWidth: 360 } }}
// >
//   <DialogContent>
//     <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
//       <Box sx={(theme) => ({
//         width: 64, height: 64, borderRadius: '50%',
//         bgcolor: theme.palette.error.light + '22',
//         display: 'grid', placeItems: 'center',
//       })}>
//         <DeleteOutlineIcon sx={{ fontSize: 32, color: 'error.main' }} />
//       </Box>
//       <Typography variant="h6" fontWeight={800}>Delete Profession</Typography>
//       <Typography color="text.secondary" textAlign="center">
//         Are you sure you want to delete <strong>{menuProfession?.name}</strong>? This action cannot be undone.
//       </Typography>
//     </Stack>
//   </DialogContent>
//   <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
//     <Button
//       fullWidth
//       variant="outlined"
//       onClick={() => setDeleteDialogOpen(false)}
//       sx={{ borderRadius: 3 }}
//     >
//       Cancel
//     </Button>
//     <Button
//       fullWidth
//       variant="contained"
//       color="error"
//       sx={{ borderRadius: 3 }}
//       onClick={async () => {
//          setDeleteDialogOpen(false);
//   setLoadingAction({ type: 'delete' });
//         try {
//           await api.delete(`/admin/category/delete-category/${menuProfession.id}`);
//           setProfessions((prev) => prev.filter((p) => p.id !== menuProfession.id));
//           notify({ severity: 'success', title: 'Deleted', message: `${menuProfession.name} was deleted successfully.` });
//         } catch (err) {
//           console.error('Delete error:', err.response?.data);
//           notify({ severity: 'error', title: 'Error', message: 'Failed to delete profession.' });
//         } finally {
//     setLoadingAction(null);
//     handleMenuClose();
//   }
//       }}
//     >
//       Delete
//     </Button>
//   </DialogActions>
// </Dialog>

//       <ProfessionDialog open={dialogOpen} profession={activeProfession} onClose={() => setDialogOpen(false)} onSubmit={handleSubmit} 
//           loading={loadingAction?.type === 'edit' || loadingAction?.type === 'add'}
// />
//     </Stack>
//   );
// }

// export default ProfessionsPage;

import { useMemo, useState, useEffect, useRef } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import GroupsIcon from '@mui/icons-material/Groups';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import SearchIcon from '@mui/icons-material/Search';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import ProfessionDialog from '../components/ProfessionDialog';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import api from '../utils/axiosInstance';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutlined';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { Menu } from '@mui/material';
import { Dialog, DialogContent, DialogActions } from '@mui/material';
import { CircularProgress } from '@mui/material';
import DashboardMetricCard from '../components/dashboard/DashboardMetricCard';
import CategoryIcon from '@mui/icons-material/Category';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
function ProfessionsPage() {
  const navigate = useNavigate();
  const { professions, Providers, setProfessions, notify } = useAppContext();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeProfession, setActiveProfession] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceRef = useRef(null);
  const isFirstRun = useRef(true);
const initialLoadRef = useRef(true);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [displayProfessions, setDisplayProfessions] = useState([]);

  // ---- Status filter (Chips: all / active / inactive) ----
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'active' | 'inactive'

  // ---- Pagination ----
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
const [analytics, setAnalytics] = useState({ total: 0, active: 0, inactive: 0 });
 const [providerCounts, setProviderCounts] = useState({});

useEffect(() => {
  if (!displayProfessions.length) return;
  displayProfessions.forEach(async (p) => {
    try {
      const res = await api.get('/admin/provider/all-providers', {
        params: { category_id: p.id, page: 1, per_page: 1 },
      });
      const total = res.data.data?.total ?? 0;
      setProviderCounts((prev) => ({ ...prev, [p.id]: total }));
    } catch {
      // keep whatever count we had
    }
  });
}, [displayProfessions]);

const enrichedProfessions = useMemo(
  () =>
    displayProfessions.map((p) => ({
      ...p,
      ProviderCount: providerCounts[p.id] ?? '…',
    })),
  [displayProfessions, providerCounts],
);

  

  function openAddDialog() {
    setActiveProfession(null);
    setDialogOpen(true);
  }

  function openEditDialog(profession) {
    setActiveProfession(profession);
    setDialogOpen(true);
  }

  // ---- Core fetch function: handles all-categories + search, with is_active + pagination ----
  async function fetchCategories({ pageNum = page, status = statusFilter, query = search, silent = false } = {}) {
    try {
      const hasQuery = query.trim().length > 0;

      if (!silent) {
        if (initialLoadRef.current) {
          setLoading(true);       // overlay كامل الشاشة، فقط بأول تحميل
        } else {
          setSearchLoading(true); // spinner صغير تحت الفلاتر، لأي تغيير بعدها (بحث/فلتر/باجينيشن)
        }
      }

      const params = { page: pageNum };
      if (status !== 'all') {
        params.is_active = status === 'active' ? 1 : 0;
      }

      let response;
      if (hasQuery) {
        response = await api.get('/admin/category/search', {
          params: { query: query.trim(), ...params },
        });
      } else {
        response = await api.get('/admin/category/all-categories', { params });
      }

      const payload = response.data.data;
      // Supports both paginated shape ({ data, total, ... }) and a plain array fallback
      const list = Array.isArray(payload) ? payload : payload.data ?? [];

      const mapped = list.map((cat) => ({
        id: cat.id,
        name: cat.name,
        commission: cat.commission,
  image: typeof cat.image === 'string' ? cat.image : cat.image?.image_url || null,
        is_active: cat.is_active,
      }));

      setDisplayProfessions(mapped);
      if (!hasQuery) {
        setProfessions(mapped);
      }

      if (!Array.isArray(payload)) {
        setTotal(payload.total ?? mapped.length);
        setLastPage(payload.last_page ?? 1);
        setPage(payload.current_page ?? pageNum);
      } else {
        setTotal(mapped.length);
        setLastPage(1);
        setPage(1);
      }
} catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
      setSearchLoading(false);
      initialLoadRef.current = false;
    }
  }

  async function fetchAnalytics() {
  try {
    const res = await api.get('/admin/analytics/categories');
    const d = res.data.data;
    setAnalytics({
      total: d.total_categories ?? 0,
      active: d.active_categories ?? 0,
      inactive: d.inactive_categories ?? 0,
    });
  } catch (err) {
    console.error('Analytics fetch error:', err);
  }
}

  // Reset to page 1 whenever the search text or status filter changes (skip on first mount)
  useEffect(() => {
    if (isFirstRun.current) return;
    setPage(1);
  }, [search, statusFilter]);
useEffect(() => {
  fetchAnalytics();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
  // Fetch on page / statusFilter / search change (debounced when typing a search query)
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const delay = search.trim() ? 500 : 0;
    debounceRef.current = setTimeout(() => {
      fetchCategories({ pageNum: page, status: statusFilter, query: search });
      isFirstRun.current = false;
    }, delay);

    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, search]);

 async function handleSubmit(values) {
  setLoadingAction({ type: activeProfession ? 'edit' : 'add' });
  let result = null;
  try {
    if (activeProfession) {
      // UPDATE
      const updateForm = new FormData();
      updateForm.append('category_id', activeProfession.id);
      updateForm.append('name', values.name);
      if (values.commission) updateForm.append('commission', Number(values.commission));
      if (values.imageFile) updateForm.append('image', values.imageFile);

      await api.post('/admin/category/update-category', updateForm, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      result = {
        severity: 'success',
        title: 'Profession updated',
        message: `${values.name} was updated successfully.`,
      };
    } else {
      // CREATE
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('commission', Number(values.commission));
      if (values.imageFile) {
        formData.append('image', values.imageFile);
      }

      await api.post('/admin/category/create-category', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      result = {
        severity: 'success',
        title: 'Profession added',
        message: `${values.name} was added to the system.`,
      };
    }

   setDialogOpen(false);
await Promise.all([
  fetchCategories({ pageNum: page, status: statusFilter, query: search, silent: true }),
  fetchAnalytics(),
]);
  } catch (err) {
    console.error('Error details:', err.response?.data);
    result = { severity: 'error', message: 'Something went wrong.' };
  } finally {
    setLoadingAction(null);
    if (result) notify(result);
  }
}

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuProfession, setMenuProfession] = useState(null);

  function handleMenuOpen(event, profession) {
    setMenuAnchor(event.currentTarget);
    setMenuProfession(profession);
  }

  function handleMenuClose() {
    setMenuAnchor(null);
    setMenuProfession(null);
  }

  if (loading) {
    return (
      <Box
        sx={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          backgroundColor: 'rgba(15, 23, 42, 0.45)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
        }}
      >
        <CircularProgress size={64} thickness={4} sx={{ color: '#ffffff' }} />
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
          {t('professions.loading', { defaultValue: 'Loading professions...' })}
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3.5} dir={isRtl ? 'rtl' : 'ltr'}>
      {loadingAction && (
        <Box
          sx={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(15, 23, 42, 0.45)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <CircularProgress size={64} thickness={4} sx={{ color: '#ffffff' }} />
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
            {loadingAction.type === 'activate' && t('professions.activating', { defaultValue: 'Activating profession...' })}
            {loadingAction.type === 'deactivate' && t('professions.deactivating', { defaultValue: 'Deactivating profession...' })}
            {loadingAction.type === 'delete' && t('professions.deleting', { defaultValue: 'Deleting profession...' })}
            {loadingAction.type === 'edit' && t('professions.editing', { defaultValue: 'Saving changes...' })}
            {loadingAction.type === 'add' && t('professions.adding', { defaultValue: 'Creating profession...' })}
          </Typography>
        </Box>
      )}

      <PageHeader
        title={t('professions.title')}
        subtitle={t('professions.subtitle')}
        actions={
          <Button startIcon={<AddRoundedIcon />} variant="contained" size="large" onClick={openAddDialog}>
            {t('professions.add')}
          </Button>
        }
      />

     <Grid container spacing={2.25}>
  <Grid item xs={12} sm={6} md={4}>
    <DashboardMetricCard
      title={t('professions.summary.total', { defaultValue: 'Total Professions' })}
      value={analytics.total}
      caption={t('professions.summary.totalHelp', { defaultValue: 'Categories available' })}
      icon={<CategoryIcon />}
      captionTone="neutral"
    />
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <DashboardMetricCard
      title={t('professions.summary.active', { defaultValue: 'Active Professions' })}
      value={analytics.active}
      caption={t('professions.summary.activeHelp', { defaultValue: 'Currently active' })}
      icon={<CheckCircleOutlineIcon />}
      captionTone="positive"
    />
  </Grid>
  <Grid item xs={12} sm={6} md={4}>
    <DashboardMetricCard
      title={t('professions.summary.inactive', { defaultValue: 'Inactive Professions' })}
      value={analytics.inactive}
      caption={t('professions.summary.inactiveHelp', { defaultValue: 'Currently inactive' })}
      icon={<HighlightOffIcon />}
      captionTone="warning"
    />
  </Grid>
</Grid>
      <Card
        elevation={0}
        sx={(theme) => ({
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
        })}
      >
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Stack spacing={2.5}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} lg={7}>
                <TextField
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={t('professions.searchPlaceholder', { defaultValue: 'Search professions or commission...' })}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} lg={5}>
                <Stack direction="row" spacing={1} justifyContent={{ xs: 'flex-start', lg: 'flex-end' }} sx={{ flexWrap: 'wrap', gap: 1 }}>
                  <Chip
                    label={t('professions.filter.all', { defaultValue: 'All' })}
                    onClick={() => setStatusFilter('all')}
                    color={statusFilter === 'all' ? 'primary' : 'default'}
                    variant={statusFilter === 'all' ? 'filled' : 'outlined'}
                    clickable
                     sx={{
    borderRadius: 0.8,
  }}
                  />
                  <Chip
                    label={t('professions.filter.active', { defaultValue: 'Active' })}
                    onClick={() => setStatusFilter('active')}
                    color={statusFilter === 'active' ? 'success' : 'default'}
                    variant={statusFilter === 'active' ? 'filled' : 'outlined'}
                    clickable
                     sx={{
    borderRadius: 0.8,
  }}
                  />
                  <Chip
                    label={t('professions.filter.inactive', { defaultValue: 'Inactive' })}
                    onClick={() => setStatusFilter('inactive')}
                    color={statusFilter === 'inactive' ? 'warning' : 'default'}
                    variant={statusFilter === 'inactive' ? 'filled' : 'outlined'}
                    clickable
                     sx={{
    borderRadius: 0.8,
  }}
                  />
                </Stack>
              </Grid>
            </Grid>

            <Divider />

           <Stack spacing={1.75}>
              {searchLoading ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, gap: 2 }}>
                  <CircularProgress size={48} thickness={4} sx={{ color: '#2563eb' }} />
                  <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748b' }}>
                    {t('professions.loading', { defaultValue: 'Loading...' })}
                  </Typography>
                </Box>
              ) : enrichedProfessions.length ? (
                enrichedProfessions.map((profession) => (
                  <Card
                    key={profession.id}
                    elevation={0}
                    sx={(theme) => ({
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                      backgroundColor: theme.palette.background.default,
                      transition: 'transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[6],
                        borderColor: theme.palette.primary.light,
                      },
                    })}
                  >
                    <CardContent sx={{ p: { xs: 2.25, md: 3 } }}>
                      <Stack spacing={2.25} direction={{ xs: 'column', md: 'row' }} alignItems="center" justifyContent="space-between">
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
                          <Avatar
                            sx={(theme) => ({
                              width: 72,
                              height: 72,
                              fontSize: 28,
                              bgcolor: theme.palette.primary.light,
                              color: theme.palette.primary.dark,
                              fontWeight: 800,
                            })}
                          >
                            {profession.image ? (
                              // eslint-disable-next-line jsx-a11y/img-redundant-alt
                              <img src={profession.image} alt="profession" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                              (profession.name || '').slice(0, 1)
                            )}
                          </Avatar>

                          <Box>
                            <Stack spacing={0.75}>
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 900, lineHeight: 1.1 }}>
                                  {profession.name}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
                                  {profession.ProviderCount} {t('professions.ProvidersShort', { defaultValue: 'Providers' })}
                                </Typography>
                              </Box>

                              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                                <Chip size="small" icon={<GroupsIcon />} label={`${profession.ProviderCount} ${t('professions.ProvidersShort', { defaultValue: 'Providers' })}`} />
                                <Chip size="small" label={`${Number(profession.commission || 0)} ${t('professions.commission')}`} />
                              </Stack>
                            </Stack>
                          </Box>
                        </Stack>

                        <Stack direction="row" spacing={0.75} alignItems="center">
                          <Chip
                            size="small"
                            label={profession.is_active ? 'Active' : 'Inactive'}
                            color={profession.is_active ? 'success' : 'default'}
                            sx={{ fontWeight: 700 ,borderRadius: 0.5}}
                          />
                          <IconButton
                            onClick={() => navigate(`/professions/${profession.id}`, { state: { profession } })}
                          >
                            <VisibilityOutlinedIcon fontSize="small" />
                          </IconButton>
                          <IconButton onClick={() => openEditDialog(profession)}>
                            <EditOutlinedIcon fontSize="small" />
                          </IconButton>
                          <IconButton onClick={(e) => handleMenuOpen(e, profession)}>
                            <MoreVertIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card elevation={0} sx={(theme) => ({ borderRadius: 4, border: `1px solid ${theme.palette.divider}` })}>
                  <CardContent>
                    <Box sx={{ py: 4, textAlign: 'center' }}>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {t('professions.emptyTitle', { defaultValue: 'No job categories yet' })}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mt: 1 }}>
                        {t('professions.emptySubtitle', { defaultValue: 'Create your first profession to start grouping Providers.' })}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              )}
            </Stack>

            {/* Pagination footer */}
            {total > 0 && (
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                alignItems="center"
                justifyContent="space-between"
                sx={{ pt: 1 }}
              >
                <Typography variant="body2" color="text.secondary">
                  {t('professions.showing', {
                    defaultValue: 'Showing {{count}} of {{total}}',
                    count: enrichedProfessions.length,
                    total,
                  })}
                </Typography>

                {lastPage > 1 && (
                  <Pagination
                    count={lastPage}
                    page={page}
                    onChange={(_, value) => setPage(value)}
                    color="primary"
                    shape="rounded"
                  />
                )}
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        PaperProps={{ sx: { borderRadius: 3, minWidth: 180 } }}
      >
        <MenuItem
          onClick={async () => {
  handleMenuClose();
  setLoadingAction({ type: menuProfession.is_active ? 'deactivate' : 'activate' });
  let result = null;
  try {
    const action = menuProfession.is_active ? 'deactivate' : 'activate';
   await api.post(`/admin/category/${menuProfession.id}/${action}`);
await Promise.all([
  fetchCategories({ pageNum: page, status: statusFilter, query: search, silent: true }),
  fetchAnalytics(),
]);

    result = {
      severity: 'success',
      title: menuProfession.is_active ? 'Deactivated' : 'Activated',
      message: `${menuProfession.name} has been ${menuProfession.is_active ? 'deactivated' : 'activated'} successfully.`,
    };
  } catch (err) {
    console.error('Toggle error:', err.response?.data);
    result = { severity: 'error', title: 'Error', message: 'Failed to update status.' };
  } finally {
    setLoadingAction(null);
    if (result) notify(result);
  }
}}
          sx={{ gap: 1.5 }}
        >
          {menuProfession?.is_active ? (
            <><ToggleOffIcon color="warning" /> Deactivate</>
          ) : (
            <><ToggleOnIcon color="success" /> Activate</>
          )}
        </MenuItem>

        <MenuItem
          onClick={() => {
            setDeleteDialogOpen(true);
          }}
          sx={{ gap: 1.5, color: 'error.main' }}
        >
          <DeleteOutlineIcon fontSize="small" /> Delete
        </MenuItem>
      </Menu>

      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        PaperProps={{ sx: { borderRadius: 4, p: 1, minWidth: 360 } }}
      >
        <DialogContent>
          <Stack spacing={2} alignItems="center" sx={{ py: 2 }}>
            <Box sx={(theme) => ({
              width: 64, height: 64, borderRadius: '50%',
              bgcolor: theme.palette.error.light + '22',
              display: 'grid', placeItems: 'center',
            })}>
              <DeleteOutlineIcon sx={{ fontSize: 32, color: 'error.main' }} />
            </Box>
            <Typography variant="h6" fontWeight={800}>Delete Profession</Typography>
            <Typography color="text.secondary" textAlign="center">
              Are you sure you want to delete <strong>{menuProfession?.name}</strong>? This action cannot be undone.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
          <Button
            fullWidth
            variant="outlined"
            onClick={() => setDeleteDialogOpen(false)}
            sx={{ borderRadius: 3 }}
          >
            Cancel
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="error"
            sx={{ borderRadius: 3 }}
            onClick={async () => {
  setDeleteDialogOpen(false);
  setLoadingAction({ type: 'delete' });
  let result = null;
  try {
    await api.delete(`/admin/category/delete-category/${menuProfession.id}`);
    result = { severity: 'success', title: 'Deleted', message: `${menuProfession.name} was deleted successfully.` };

    // If this was the last item on the page (and not page 1), step back a page; otherwise refetch current page
    const willBeEmpty = enrichedProfessions.length === 1 && page > 1;
    const targetPage = willBeEmpty ? page - 1 : page;
    if (willBeEmpty) {
  setPage(targetPage);
} else {
  await fetchCategories({ pageNum: targetPage, status: statusFilter, query: search, silent: true });
}
await fetchAnalytics();
  } catch (err) {
    console.error('Delete error:', err.response?.data);
    result = { severity: 'error', title: 'Error', message: 'Failed to delete profession.' };
  } finally {
    setLoadingAction(null);
    handleMenuClose();
    if (result) notify(result);
  }
}}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <ProfessionDialog
        open={dialogOpen}
        profession={activeProfession}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSubmit}
        loading={loadingAction?.type === 'edit' || loadingAction?.type === 'add'}
      />
    </Stack>
  );
}

export default ProfessionsPage;