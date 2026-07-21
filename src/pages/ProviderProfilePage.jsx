// import { useState, useEffect } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import {
//   Avatar, Box, Button, Card, CardContent,
//   Chip, Divider, Grid, Stack, Typography, CircularProgress,
// } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
// import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
// import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
// import StarRoundedIcon from '@mui/icons-material/StarRounded';
// import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
// import MailRoundedIcon from '@mui/icons-material/MailRounded';
// import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
// import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
// import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
// import ConfirmDialog from '../components/ConfirmDialog';
// import { useAppContext } from '../context/AppContext';
// import { useTranslation } from 'react-i18next';
// import api from '../utils/axiosInstance';

// function ProviderProfilePage() {
// const { ProviderId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const returnTo = location.state?.returnTo || '/Providers';
//   const { notify, activateProvider, deactivateProvider, deleteProvider } = useAppContext();
//   const { t, i18n } = useTranslation();
//   const isRtl = i18n.dir() === 'rtl';

//   const [provider, setProvider] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [loadingAction, setLoadingAction] = useState(null);

//   useEffect(() => {
//   setLoading(true);
//   api.get(`/admin/provider/providers/${ProviderId}`)
//     .then(res => setProvider(res.data.data))
//     .catch(() => setProvider(null))
//     .finally(() => setLoading(false));
// }, [ProviderId]);

//   async function handleActivate() {
//       setLoadingAction({ type: 'activate' });

//     try {
//       await activateProvider(provider.id);
//       setProvider(prev => ({ ...prev, is_active: true }));
//       notify({ severity: 'success', message: 'Provider activated successfully' });
//     } catch (err) {
//       notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to activate' });
//     }finally {
//     setLoadingAction(null);
//   }
//   }

//   async function handleDeactivate() {
//   setLoadingAction({ type: 'deactivate' });

//     try {
//       await deactivateProvider(provider.id);
//       setProvider(prev => ({ ...prev, is_active: false }));
//       notify({ severity: 'success', message: 'Provider deactivated successfully' });
//     } catch (err) {
//       notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to deactivate' });
//     }finally {
//     setLoadingAction(null);
//   }
//   }

//   async function handleDelete() {
//       setLoadingAction({ type: 'delete' });

//     try {
//       await deleteProvider(provider.id);
//       notify({ severity: 'success', message: 'Provider deleted successfully' });
//       navigate(returnTo);
//     } catch (err) {
//       notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to delete' });
//     }finally {
//     setLoadingAction(null);}
//   }

//   if (loading) {
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
//         {t('Providers.loading', { defaultValue: 'Loading provider...' })}
//       </Typography>
//     </Box>
//   );
// }

//   if (!provider) {
//     return (
//       <Card elevation={0} sx={{ borderRadius: 4, border: '1px solid rgba(15,23,42,0.08)' }}>
//         <CardContent sx={{ p: 4 }}>
//           <Stack spacing={2} alignItems="flex-start">
//             <Typography sx={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>Provider not found</Typography>
//             <Button startIcon={<ArrowBackIcon />} variant="contained" onClick={() => navigate(returnTo)}>Back</Button>
//           </Stack>
//         </CardContent>
//       </Card>
//     );
//   }

//   const initials = `${provider.first_name?.[0] || ''}${provider.last_name?.[0] || ''}`.toUpperCase();

//   return (
//     <Stack spacing={3} dir={isRtl ? 'rtl' : 'ltr'}>
// {loadingAction && (
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
//       {loadingAction.type === 'activate' && t('Providers.actions.activating', { defaultValue: 'Activating provider...' })}
//       {loadingAction.type === 'deactivate' && t('Providers.actions.deactivating', { defaultValue: 'Deactivating provider...' })}
//       {loadingAction.type === 'delete' && t('Providers.actions.deleting', { defaultValue: 'Deleting provider...' })}
//     </Typography>
//   </Box>
// )}
//       {/* Header */}
//       <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" spacing={2}>
//         <Button startIcon={<ArrowBackIcon />} variant="outlined" onClick={() => navigate(returnTo)}
//           sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600 }}>
//           {t('Providers.profile.back', { defaultValue: 'Back to Providers' })}
//         </Button>

//         <Stack direction="row" spacing={1}>
//           {provider.is_active ? (
//             <Button startIcon={<BlockRoundedIcon />} onClick={handleDeactivate}
//               sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, color: '#c2410c', borderColor: '#fed7aa', border: '1px solid' }}>
//               {t('Providers.actions.deactivate', { defaultValue: 'Deactivate' })}
//             </Button>
//           ) : (
//             <Button startIcon={<CheckCircleRoundedIcon />} onClick={handleActivate}
//               sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, color: '#15803d', borderColor: '#bbf7d0', border: '1px solid' }}>
//               {t('Providers.actions.activate', { defaultValue: 'Activate' })}
//             </Button>
//           )}
//           <Button startIcon={<DeleteOutlineRoundedIcon />} onClick={() => setDeleteOpen(true)}
//             sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, color: '#dc2626', borderColor: '#fecaca', border: '1px solid' }}>
//             {t('Providers.actions.delete', { defaultValue: 'Delete' })}
//           </Button>
//         </Stack>
//       </Stack>

//       {/* بطاقة الملف الشخصي */}
//       <Card elevation={0} sx={{ borderRadius: '20px', border: '1px solid rgba(226,232,240,0.8)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
//         <CardContent sx={{ p: { xs: 2.5, sm: 4 } }}>
//           <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>

//             {/* Avatar */}
//             <Box sx={{ position: 'relative', flexShrink: 0 }}>
//               <Avatar src={provider.image_url || undefined}
//                 sx={{ width: 90, height: 90, borderRadius: '20px', bgcolor: '#eff6ff', color: '#2563eb', fontSize: '1.8rem', fontWeight: 700, border: '3px solid #f8fafc' }}>
//                 {!provider.image_url && initials}
//               </Avatar>
//               <Box sx={{ position: 'absolute', bottom: 4, right: 4, width: 14, height: 14, borderRadius: '50%', backgroundColor: provider.is_active ? '#22c55e' : '#94a3b8', border: '2px solid #fff' }} />
//             </Box>

//             {/* الاسم والمعلومات الأساسية */}
//             <Box sx={{ flex: 1 }}>
//               <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.2 }}>
//                 {provider.first_name} {provider.last_name}
//               </Typography>
//               <Typography sx={{ mt: 0.3, fontSize: '0.95rem', color: '#64748b' }}>
//                 ID: #{provider.id}
//               </Typography>

//               <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 1.2 }}>
//                 {/* المهنة */}
//                 <Chip label={provider.service_category_name || 'Service Provider'}
//                   size="small"
//                   sx={{ backgroundColor: '#f0fdf4', color: '#15803d', fontWeight: 600, border: '1px solid #dcfce7', borderRadius: '8px' }} />

//                 {/* is_active */}
//                 <Chip
//                   label={provider.is_active ? t('Providers.status.active', { defaultValue: 'Active' }) : t('Providers.status.inactive', { defaultValue: 'Inactive' })}
//                   size="small"
//                   sx={{ backgroundColor: provider.is_active ? '#f0fdf4' : '#f8fafc', color: provider.is_active ? '#15803d' : '#64748b', fontWeight: 600, borderRadius: '8px' }} />

//                 {/* is_available */}
//                 <Chip
//                   label={provider.is_available ? t('Providers.status.available', { defaultValue: 'Available' }) : t('Providers.status.unavailable', { defaultValue: 'Unavailable' })}
//                   size="small"
//                   sx={{ backgroundColor: provider.is_available ? '#eff6ff' : '#fff1f2', color: provider.is_available ? '#1d4ed8' : '#dc2626', fontWeight: 600, borderRadius: '8px' }} />
//               </Stack>
//             </Box>

//             {/* Rating */}
//             <Stack spacing={0.5} alignItems="center"
//               sx={{ px: 2.5, py: 1.5, borderRadius: '14px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', flexShrink: 0 }}>
//               <StarRoundedIcon sx={{ fontSize: 28, color: '#f59e0b' }} />
//               <Typography sx={{ fontSize: '1.5rem', fontWeight: 800, color: '#92400e', lineHeight: 1 }}>
//                 {Number(provider.rating).toFixed(1)}
//               </Typography>
//               <Typography sx={{ fontSize: '0.78rem', color: '#a16207' }}>
//                 {provider.rating_count} {t('Providers.card.reviews', { defaultValue: 'reviews' })}
//               </Typography>
//             </Stack>
//           </Stack>
//         </CardContent>
//       </Card>

//       {/* تفاصيل */}
//       <Grid container spacing={2.5}>

//         {/* معلومات الاتصال */}
//         <Grid item xs={12} md={6}>
//           <Card elevation={0} sx={{ borderRadius: '20px', border: '1px solid rgba(226,232,240,0.8)', height: '100%' }}>
//             <CardContent sx={{ p: 3 }}>
//               <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', mb: 2 }}>
//                 {t('Providers.profile.contactInfo', { defaultValue: 'Contact Information' })}
//               </Typography>
//               <Stack spacing={2}>
//                 <InfoRow icon={<LocalPhoneRoundedIcon sx={{ fontSize: 18, color: '#64748b' }} />} label={t('Providers.profile.fields.phone', { defaultValue: 'Phone' })} value={provider.phone} />
//                 <Divider sx={{ borderColor: 'rgba(15,23,42,0.06)' }} />
//                 <InfoRow icon={<MailRoundedIcon sx={{ fontSize: 18, color: '#64748b' }} />} label={t('Providers.profile.fields.email', { defaultValue: 'Email' })} value={provider.email || '—'} />
//               </Stack>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* معلومات المهنة */}
//         <Grid item xs={12} md={6}>
//           <Card elevation={0} sx={{ borderRadius: '20px', border: '1px solid rgba(226,232,240,0.8)', height: '100%' }}>
//             <CardContent sx={{ p: 3 }}>
//               <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', mb: 2 }}>
//                 {t('Providers.profile.professionalInfo', { defaultValue: 'Professional Information' })}
//               </Typography>
//               <Stack spacing={2}>
//                 <InfoRow icon={<WorkRoundedIcon sx={{ fontSize: 18, color: '#64748b' }} />} label={t('Providers.profile.fields.category', { defaultValue: 'Category' })} value={provider.service_category_name || '—'} />
//                 <Divider sx={{ borderColor: 'rgba(15,23,42,0.06)' }} />
//                 <InfoRow icon={<AccessTimeRoundedIcon sx={{ fontSize: 18, color: '#64748b' }} />} label={t('Providers.profile.fields.experience', { defaultValue: 'Experience' })} value={`${provider.experience_years} ${t('Providers.card.years', { defaultValue: 'yrs' })}`} />
//                 <Divider sx={{ borderColor: 'rgba(15,23,42,0.06)' }} />
//                 <InfoRow icon={<CalendarMonthRoundedIcon sx={{ fontSize: 18, color: '#64748b' }} />} label={t('Providers.profile.fields.joinDate', { defaultValue: 'Join Date' })} value={provider.created_at ? new Date(provider.created_at).toISOString().slice(0, 10) : '—'} />
//               </Stack>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* الوصف */}
//         {provider.description && (
//           <Grid item xs={12}>
//             <Card elevation={0} sx={{ borderRadius: '20px', border: '1px solid rgba(226,232,240,0.8)' }}>
//               <CardContent sx={{ p: 3 }}>
//                 <Typography sx={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a', mb: 1.5 }}>
//                   {t('Providers.profile.description', { defaultValue: 'Description' })}
//                 </Typography>
//                 <Typography sx={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.7 }}>
//                   {provider.description}
//                 </Typography>
//               </CardContent>
//             </Card>
//           </Grid>
//         )}
//       </Grid>

//       <ConfirmDialog
//         open={deleteOpen}
//         title={t('Providers.confirm.title', { defaultValue: 'Delete Provider' })}
//         description={t('Providers.profile.deleteConfirm', { defaultValue: `Are you sure you want to delete ${provider.first_name} ${provider.last_name}?`, name: `${provider.first_name} ${provider.last_name}` })}
//         confirmLabel={t('common.delete', { defaultValue: 'Delete' })}
//         onClose={() => setDeleteOpen(false)}
//         onConfirm={handleDelete}
//       />
//     </Stack>
//   );
// }

// function InfoRow({ icon, label, value }) {
//   return (
//     <Stack direction="row" spacing={1.5} alignItems="center">
//       <Box sx={{ width: 36, height: 36, borderRadius: '10px', backgroundColor: '#f8fafc', display: 'grid', placeItems: 'center', flexShrink: 0 }}>
//         {icon}
//       </Box>
//       <Box>
//         <Typography sx={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
//           {label}
//         </Typography>
//         <Typography sx={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 600 }}>
//           {value}
//         </Typography>
//       </Box>
//     </Stack>
//   );
// }

// export default ProviderProfilePage;


// import { useState, useEffect } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import {
//   Avatar, Box, Button, Card, CardContent,
//   Chip, Divider, Grid, Stack, Typography, CircularProgress,
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
// } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
// import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
// import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
// import StarRoundedIcon from '@mui/icons-material/StarRounded';
// import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
// import MailRoundedIcon from '@mui/icons-material/MailRounded';
// import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
// import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
// import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
// import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
// import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
// import PercentRoundedIcon from '@mui/icons-material/PercentRounded';
// import MiscellaneousServicesRoundedIcon from '@mui/icons-material/MiscellaneousServicesRounded';
// import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
// import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
// import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
// import LocationCityRoundedIcon from '@mui/icons-material/LocationCityRounded';
// import SignpostRoundedIcon from '@mui/icons-material/SignpostRounded';
// import ConfirmDialog from '../components/ConfirmDialog';
// import { useAppContext } from '../context/AppContext';
// import { useTranslation } from 'react-i18next';
// import api from '../utils/axiosInstance';

// function ProviderProfilePage() {
//   const { ProviderId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const returnTo = location.state?.returnTo || '/Providers';
//   const { notify, activateProvider, deactivateProvider, deleteProvider } = useAppContext();
//   const { t, i18n } = useTranslation();
//   const isRtl = i18n.dir() === 'rtl';

//   const [provider, setProvider] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [loadingAction, setLoadingAction] = useState(null);

//   useEffect(() => {
//     setLoading(true);
//     api.get(`/admin/provider/providers/${ProviderId}`)
//       .then(res => setProvider(res.data.data))
//       .catch(() => setProvider(null))
//       .finally(() => setLoading(false));
//   }, [ProviderId]);

//   async function handleActivate() {
//     setLoadingAction({ type: 'activate' });
//     try {
//       await activateProvider(provider.provider.id);
//       setProvider(prev => ({ ...prev, provider: { ...prev.provider, is_active: true } }));
//       notify({ severity: 'success', message: 'Provider activated successfully' });
//     } catch (err) {
//       notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to activate' });
//     } finally {
//       setLoadingAction(null);
//     }
//   }

//   async function handleDeactivate() {
//     setLoadingAction({ type: 'deactivate' });
//     try {
//       await deactivateProvider(provider.provider.id);
//       setProvider(prev => ({ ...prev, provider: { ...prev.provider, is_active: false } }));
//       notify({ severity: 'success', message: 'Provider deactivated successfully' });
//     } catch (err) {
//       notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to deactivate' });
//     } finally {
//       setLoadingAction(null);
//     }
//   }

//   async function handleDelete() {
//     setLoadingAction({ type: 'delete' });
//     try {
//       await deleteProvider(provider.provider.id);
//       notify({ severity: 'success', message: 'Provider deleted successfully' });
//       navigate(returnTo);
//     } catch (err) {
//       notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to delete' });
//     } finally {
//       setLoadingAction(null);
//     }
//   }

//   if (loading) {
//     return (
//       <Box sx={{
//         position: 'fixed', inset: 0, zIndex: 9999,
//         backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)',
//         display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
//       }}>
//         <CircularProgress size={50} thickness={4} sx={{ color: '#3b82f6' }} />
//         <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff', letterSpacing: '0.02em' }}>
//           {t('Providers.loading', { defaultValue: 'Loading provider...' })}
//         </Typography>
//       </Box>
//     );
//   }

//   if (!provider) {
//     return (
//       <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', p: 3, textAlign: 'center' }}>
//         <CardContent>
//           <Stack spacing={3} alignItems="center">
//             <Typography variant="h5" sx={{ fontWeight: 700, color: '#1e293b' }}>Provider not found</Typography>
//             <Button
//               startIcon={<ArrowBackIcon sx={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />}
//               variant="contained"
//               onClick={() => navigate(returnTo)}
//               sx={{ borderRadius: '10px', px: 4, py: 1, textTransform: 'none', boxShadow: 'none', '&:hover': { boxShadow: 'none' } }}
//             >
//               Back
//             </Button>
//           </Stack>
//         </CardContent>
//       </Card>
//     );
//   }

//   const { provider: p, address, services, category, reviews } = provider;
//   const initials = `${p.first_name?.[0] || ''}${p.last_name?.[0] || ''}`.toUpperCase();

//   return (
//     <Stack spacing={4} dir={isRtl ? 'rtl' : 'ltr'} sx={{ pb: 5 }}>

//       {/* Loading Overlay */}
//       {loadingAction && (
//         <Box sx={{
//           position: 'fixed', inset: 0, zIndex: 9999,
//           backgroundColor: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(8px)',
//           display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
//         }}>
//           <CircularProgress size={50} thickness={4} sx={{ color: '#3b82f6' }} />
//           <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: '#ffffff' }}>
//             {loadingAction.type === 'activate' && t('Providers.actions.activating', { defaultValue: 'Activating provider...' })}
//             {loadingAction.type === 'deactivate' && t('Providers.actions.deactivating', { defaultValue: 'Deactivating provider...' })}
//             {loadingAction.type === 'delete' && t('Providers.actions.deleting', { defaultValue: 'Deleting provider...' })}
//           </Typography>
//         </Box>
//       )}

//       {/* Top Header / Actions Bar */}
//       <Stack direction="row" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
//         <Button
//           startIcon={<ArrowBackIcon sx={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />}
//           variant="text"
//           onClick={() => navigate(returnTo)}
//           sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600, color: '#64748b', '&:hover': { backgroundColor: '#f1f5f9', color: '#1e293b' } }}
//         >
//           {t('Providers.profile.back', { defaultValue: 'Back to Providers' })}
//         </Button>

//         <Stack direction="row" spacing={1.5}>
//           {p.is_active ? (
//             <Button
//               startIcon={<BlockRoundedIcon />}
//               variant="outlined"
//               onClick={handleDeactivate}
//               sx={{
//                 borderRadius: '10px', textTransform: 'none', fontWeight: 600,
//                 color: '#dc2626', borderColor: '#fca5a5',
//                 backgroundColor: '#fef2f2',
//                 '&:hover': { backgroundColor: '#fee2e2', borderColor: '#ef4444' }
//               }}
//             >
//               {t('Providers.actions.deactivate', { defaultValue: 'Deactivate' })}
//             </Button>
//           ) : (
//             <Button
//               startIcon={<CheckCircleRoundedIcon />}
//               variant="outlined"
//               onClick={handleActivate}
//               sx={{
//                 borderRadius: '10px', textTransform: 'none', fontWeight: 600,
//                 color: '#16a34a', borderColor: '#86efac',
//                 backgroundColor: '#f0fdf4',
//                 '&:hover': { backgroundColor: '#dcfce7', borderColor: '#22c55e' }
//               }}
//             >
//               {t('Providers.actions.activate', { defaultValue: 'Activate' })}
//             </Button>
//           )}
//           <Button
//             startIcon={<DeleteOutlineRoundedIcon />}
//             variant="contained"
//             onClick={() => setDeleteOpen(true)}
//             sx={{
//               borderRadius: '10px', textTransform: 'none', fontWeight: 600,
//               backgroundColor: '#ef4444', color: '#ffffff', boxShadow: 'none',
//               '&:hover': { backgroundColor: '#dc2626', boxShadow: 'none' }
//             }}
//           >
//             {t('Providers.actions.delete', { defaultValue: 'Delete' })}
//           </Button>
//         </Stack>
//       </Stack>

//       {/* ── Profile Hero Card ── */}
//       <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', background: 'linear-gradient(to right, #ffffff, #f8fafc)' }}>
//         <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
//           <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }} justifyContent="space-between">

//             <Stack direction="row" spacing={3} alignItems="center" flexWrap="wrap" gap={2}>
//               {/* Avatar Frame */}
//               <Box sx={{ position: 'relative' }}>
//                 <Avatar
//                   src={p.image_url || undefined}
//                   sx={{
//                     width: 96, height: 96, borderRadius: '24px',
//                     bgcolor: '#e0f2fe', color: '#0284c7',
//                     fontSize: '2rem', fontWeight: 700,
//                     border: '4px solid #ffffff',
//                     boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
//                   }}
//                 >
//                   {!p.image_url && initials}
//                 </Avatar>
//                 <Box sx={{
//                   position: 'absolute', bottom: 2, right: 2,
//                   width: 16, height: 16, borderRadius: '50%',
//                   backgroundColor: p.is_active ? '#22c55e' : '#94a3b8',
//                   border: '3px solid #fff',
//                 }} />
//               </Box>

//               {/* Identity Details */}
//               <Box>
//                 <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.02em' }}>
//                   {p.first_name} {p.last_name}
//                 </Typography>
//                 <Typography sx={{ mt: 0.5, fontSize: '0.875rem', color: '#64748b', fontWeight: 500 }}>
//                   ID: <span style={{ color: '#0f172a', fontWeight: 600 }}>#{p.id}</span>
//                 </Typography>

//                 <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mt: 2 }} gap={1}>
//                   <Chip
//                     label={category?.name || 'Service Provider'}
//                     size="small"
//                     sx={{ backgroundColor: '#eff6ff', color: '#1d4ed8', fontWeight: 600, borderRadius: '6px' }}
//                   />
//                   <Chip
//                     label={p.is_active ? t('Providers.status.active', { defaultValue: 'Active' }) : t('Providers.status.inactive', { defaultValue: 'Inactive' })}
//                     size="small"
//                     sx={{
//                       backgroundColor: p.is_active ? '#dcfce7' : '#f1f5f9',
//                       color: p.is_active ? '#15803d' : '#475569',
//                       fontWeight: 600, borderRadius: '6px',
//                     }}
//                   />
//                   <Chip
//                     label={p.is_available ? t('Providers.status.available', { defaultValue: 'Available' }) : t('Providers.status.unavailable', { defaultValue: 'Unavailable' })}
//                     size="small"
//                     sx={{
//                       backgroundColor: p.is_available ? '#e0f2fe' : '#fee2e2',
//                       color: p.is_available ? '#0369a1' : '#b91c1c',
//                       fontWeight: 600, borderRadius: '6px',
//                     }}
//                   />
//                 </Stack>
//               </Box>
//             </Stack>

//             {/* Rating Badge */}
//             <Stack direction="row" alignItems="center" spacing={1.5} sx={{
//               px: 3, py: 2, borderRadius: '16px',
//               backgroundColor: '#fffbeb', border: '1px solid #fef08a',
//               alignSelf: { xs: 'stretch', sm: 'center' }, justifyContent: 'center'
//             }}>
//               <StarRoundedIcon sx={{ fontSize: 32, color: '#eab308' }} />
//               <Box>
//                 <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#854d0e', lineHeight: 1 }}>
//                   {Number(p.rating).toFixed(1)}
//                 </Typography>
//                 <Typography sx={{ fontSize: '0.75rem', color: '#a16207', mt: 0.5, fontWeight: 500 }}>
//                   {p.rating_count} {t('Providers.card.reviews', { defaultValue: 'reviews' })}
//                 </Typography>
//               </Box>
//             </Stack>
//           </Stack>
//         </CardContent>
//       </Card>

//       {/* ── Details Grid ── */}
//       <Grid container spacing={3}>

//         {/* Contact Info */}
//         <Grid item xs={12} md={6}>
//           <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', height: '100%' }}>
//             <CardContent sx={{ p: 3 }}>
//               <SectionTitle>{t('Providers.profile.contactInfo', { defaultValue: 'Contact Information' })}</SectionTitle>
//               <Stack spacing={2.5}>
//                 <InfoRow icon={<LocalPhoneRoundedIcon sx={{ fontSize: 20, color: '#3b82f6' }} />}
//                   label={t('Providers.profile.fields.phone', { defaultValue: 'Phone' })}
//                   value={p.phone} />
//                 <Divider sx={{ borderColor: '#f1f5f9' }} />
//                 <InfoRow icon={<MailRoundedIcon sx={{ fontSize: 20, color: '#3b82f6' }} />}
//                   label={t('Providers.profile.fields.email', { defaultValue: 'Email' })}
//                   value={p.email || '—'} />
//               </Stack>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Professional Info */}
//         <Grid item xs={12} md={6}>
//           <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', height: '100%' }}>
//             <CardContent sx={{ p: 3 }}>
//               <SectionTitle>{t('Providers.profile.professionalInfo', { defaultValue: 'Professional Information' })}</SectionTitle>
//               <Stack spacing={2}>
//                 <InfoRow icon={<WorkRoundedIcon sx={{ fontSize: 20, color: '#10b981' }} />}
//                   label={t('Providers.profile.fields.category', { defaultValue: 'Category' })}
//                   value={category?.name || '—'} />
//                 <Divider sx={{ borderColor: '#f1f5f9' }} />
//                 <InfoRow icon={<PercentRoundedIcon sx={{ fontSize: 20, color: '#10b981' }} />}
//                   label={t('Providers.profile.fields.commission', { defaultValue: 'Commission' })}
//                   value={category?.commission ? `${category.commission}%` : '—'} />
//                 <Divider sx={{ borderColor: '#f1f5f9' }} />
//                 <InfoRow icon={<AccessTimeRoundedIcon sx={{ fontSize: 20, color: '#10b981' }} />}
//                   label={t('Providers.profile.fields.experience', { defaultValue: 'Experience' })}
//                   value={`${p.experience_years} ${t('Providers.card.years', { defaultValue: 'yrs' })}`} />
//                 <Divider sx={{ borderColor: '#f1f5f9' }} />
//                 <InfoRow icon={<CalendarMonthRoundedIcon sx={{ fontSize: 20, color: '#10b981' }} />}
//                   label={t('Providers.profile.fields.joinDate', { defaultValue: 'Join Date' })}
//                   value={p.created_at ? p.created_at.slice(0, 10) : '—'} />
//               </Stack>
//             </CardContent>
//           </Card>
//         </Grid>

//         {/* Address */}
//         {address && (
//           <Grid item xs={12} md={p.description ? 6 : 12}>
//             <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', height: '100%' }}>
//               <CardContent sx={{ p: 3 }}>
//                 <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
//                   <Box sx={{ width: 40, height: 40, borderRadius: '12px', backgroundColor: '#f0f9ff', display: 'grid', placeItems: 'center' }}>
//                     <LocationOnRoundedIcon sx={{ fontSize: 20, color: '#6366f1' }} />
//                   </Box>
//                   <Box sx={{ flex: 1 }}>
//                     <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' }}>
//                       {t('Providers.profile.address', { defaultValue: 'Address' })}
//                     </Typography>
//                     {address.title && (
//                       <Typography sx={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }}>
//                         {address.title}
//                       </Typography>
//                     )}
//                   </Box>
//                 </Stack>

//                 {/* Full address string */}
//                 <Box sx={{ backgroundColor: '#f8fafc', border: '1px solid #f1f5f9', borderRadius: '10px', px: 2, py: 1.5, mb: 2.5 }}>
//                   <Stack direction="row" spacing={1} alignItems="flex-start">
//                     <HomeRoundedIcon sx={{ fontSize: 16, color: '#94a3b8', mt: 0.2, flexShrink: 0 }} />
//                     <Typography sx={{ fontSize: '0.875rem', color: '#475569', lineHeight: 1.6 }}>
//                       {address.display_address || '—'}
//                     </Typography>
//                   </Stack>
//                 </Box>

//                 {/* Responsive address fields grid */}
//                 <Grid container spacing={1.5}>
//                   <AddressField
//                     icon={<PublicRoundedIcon sx={{ fontSize: 15, color: '#6366f1' }} />}
//                     label={t('Providers.profile.fields.country', { defaultValue: 'Country' })}
//                     value={address.country}
//                     xs={6} sm={6}
//                   />
//                   <AddressField
//                     icon={<LocationCityRoundedIcon sx={{ fontSize: 15, color: '#6366f1' }} />}
//                     label={t('Providers.profile.fields.city', { defaultValue: 'City' })}
//                     value={address.city}
//                     xs={6} sm={6}
//                   />
//                   <AddressField
//                     icon={<SignpostRoundedIcon sx={{ fontSize: 15, color: '#6366f1' }} />}
//                     label={t('Providers.profile.fields.area', { defaultValue: 'Area' })}
//                     value={address.area}
//                     xs={12} sm={6}
//                   />
//                   <AddressField
//                     icon={<HomeRoundedIcon sx={{ fontSize: 15, color: '#6366f1' }} />}
//                     label={t('Providers.profile.fields.street', { defaultValue: 'Street' })}
//                     value={address.street}
//                     xs={12} sm={6}
//                   />
//                   <AddressField
//                     label={t('Providers.profile.fields.building', { defaultValue: 'Building' })}
//                     value={address.building}
//                     xs={4} sm={4}
//                   />
//                   <AddressField
//                     label={t('Providers.profile.fields.floor', { defaultValue: 'Floor' })}
//                     value={address.floor}
//                     xs={4} sm={4}
//                   />
//                   <AddressField
//                     label={t('Providers.profile.fields.apartment', { defaultValue: 'Apt.' })}
//                     value={address.apartment}
//                     xs={4} sm={4}
//                   />
//                 </Grid>
//               </CardContent>
//             </Card>
//           </Grid>
//         )}

//         {/* Description */}
//         {p.description && (
//           <Grid item xs={12} md={address ? 6 : 12}>
//             <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', height: '100%', display: 'flex', flexDirection: 'column' }}>
//               <CardContent sx={{ p: 3, flexGrow: 1 }}>
//                 <SectionTitle>{t('Providers.profile.description', { defaultValue: 'Description' })}</SectionTitle>
//                 <Box sx={{ backgroundColor: '#f8fafc', p: 2.5, borderRadius: '12px', border: '1px solid #f1f5f9' }}>
//                   <Typography sx={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.7, fontWeight: 400 }}>
//                     {p.description}
//                   </Typography>
//                 </Box>
//               </CardContent>
//             </Card>
//           </Grid>
//         )}

//         {/* Services Table */}
//         {services && services.length > 0 && (
//           <Grid item xs={12}>
//             <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
//               <CardContent sx={{ p: 3 }}>
//                 <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 3 }}>
//                   <Box sx={{ width: 40, height: 40, borderRadius: '12px', backgroundColor: '#e0f2fe', display: 'grid', placeItems: 'center' }}>
//                     <MiscellaneousServicesRoundedIcon sx={{ fontSize: 20, color: '#0369a1' }} />
//                   </Box>
//                   <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>
//                     {t('Providers.profile.services', { defaultValue: 'Services' })}
//                   </Typography>
//                   <Chip
//                     label={services.length}
//                     size="small"
//                     sx={{ backgroundColor: '#0284c7', color: '#ffffff', fontWeight: 700, borderRadius: '6px', px: 0.5 }}
//                   />
//                 </Stack>

//                 <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #f1f5f9', borderRadius: '12px' }}>
//                   <Table>
//                     <TableHead sx={{ backgroundColor: '#f8fafc' }}>
//                       <TableRow>
//                         {['#', 'Title', 'Description', 'Price', 'Status'].map(col => (
//                           <TableCell
//                             key={col}
//                             sx={{
//                               fontWeight: 700, fontSize: '0.75rem',
//                               color: '#64748b', textTransform: 'uppercase',
//                               letterSpacing: '0.05em', py: 2
//                             }}
//                           >
//                             {t(`Providers.profile.serviceTable.${col.toLowerCase()}`, { defaultValue: col })}
//                           </TableCell>
//                         ))}
//                       </TableRow>
//                     </TableHead>
//                     <TableBody>
//                       {services.map((svc, idx) => (
//                         <TableRow
//                           key={svc.id}
//                           sx={{
//                             '&:last-child td': { border: 0 },
//                             '&:hover': { backgroundColor: '#f8fafc' },
//                             transition: 'background 0.2s ease',
//                           }}
//                         >
//                           <TableCell sx={{ color: '#94a3b8', fontSize: '0.85rem', fontWeight: 600 }}>
//                             {idx + 1}
//                           </TableCell>
//                           <TableCell sx={{ fontWeight: 600, color: '#0f172a', fontSize: '0.9rem' }}>
//                             {svc.title}
//                           </TableCell>
//                           <TableCell sx={{ color: '#475569', fontSize: '0.875rem', maxWidth: 350 }}>
//                             {svc.description}
//                           </TableCell>
//                           <TableCell sx={{ fontWeight: 700, color: '#0f172a', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>
//                             ${Number(svc.price).toFixed(2)}
//                           </TableCell>
//                           <TableCell>
//                             <Chip
//                               icon={svc.is_active
//                                 ? <CheckRoundedIcon style={{ color: '#16a34a' }} />
//                                 : <CloseRoundedIcon style={{ color: '#94a3b8' }} />}
//                               label={svc.is_active
//                                 ? t('Providers.status.active', { defaultValue: 'Active' })
//                                 : t('Providers.status.inactive', { defaultValue: 'Inactive' })}
//                               variant="outlined"
//                               size="small"
//                               sx={{
//                                 backgroundColor: svc.is_active ? '#f0fdf4' : '#f8fafc',
//                                 color: svc.is_active ? '#16a34a' : '#64748b',
//                                 borderColor: svc.is_active ? '#bbf7d0' : '#e2e8f0',
//                                 fontWeight: 600,
//                                 borderRadius: '8px',
//                                 '& .MuiChip-icon': {
//                                   marginLeft: isRtl ? '4px' : '-4px',
//                                   marginRight: isRtl ? '-4px' : '4px'
//                                 }
//                               }}
//                             />
//                           </TableCell>
//                         </TableRow>
//                       ))}
//                     </TableBody>
//                   </Table>
//                 </TableContainer>
//               </CardContent>
//             </Card>
//           </Grid>
//         )}

//         {/* Reviews empty state */}
//         {reviews !== undefined && reviews.length === 0 && (
//           <Grid item xs={12}>
//             <Card elevation={0} sx={{ borderRadius: '16px', border: '1px solid #e2e8f0' }}>
//               <CardContent sx={{ p: 4, textAlign: 'center' }}>
//                 <SectionTitle>{t('Providers.profile.reviews', { defaultValue: 'Reviews' })}</SectionTitle>
//                 <Stack alignItems="center" justifyContent="center" sx={{ py: 4, backgroundColor: '#f8fafc', borderRadius: '12px', mt: 2 }}>
//                   <StarRoundedIcon sx={{ fontSize: 40, color: '#cbd5e1', mb: 1 }} />
//                   <Typography sx={{ fontSize: '0.95rem', color: '#64748b', fontWeight: 500 }}>
//                     {t('Providers.profile.noReviews', { defaultValue: 'No reviews yet' })}
//                   </Typography>
//                 </Stack>
//               </CardContent>
//             </Card>
//           </Grid>
//         )}
//       </Grid>

//       <ConfirmDialog
//         open={deleteOpen}
//         title={t('Providers.confirm.title', { defaultValue: 'Delete Provider' })}
//         description={t('Providers.profile.deleteConfirm', {
//           defaultValue: `Are you sure you want to delete ${p.first_name} ${p.last_name}?`,
//           name: `${p.first_name} ${p.last_name}`,
//         })}
//         confirmLabel={t('common.delete', { defaultValue: 'Delete' })}
//         onClose={() => setDeleteOpen(false)}
//         onConfirm={handleDelete}
//       />
//     </Stack>
//   );
// }

// // ── Sub-components ──────────────────────────────────────────────

// function SectionTitle({ children }) {
//   return (
//     <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', mb: 2.5, letterSpacing: '-0.01em' }}>
//       {children}
//     </Typography>
//   );
// }

// function InfoRow({ icon, label, value }) {
//   return (
//     <Stack direction="row" spacing={2} alignItems="center">
//       <Box sx={{
//         width: 40, height: 40, borderRadius: '10px',
//         backgroundColor: '#f8fafc', display: 'grid', placeItems: 'center', flexShrink: 0,
//         border: '1px solid #f1f5f9'
//       }}>
//         {icon}
//       </Box>
//       <Box>
//         <Typography sx={{
//           fontSize: '0.72rem', color: '#94a3b8', fontWeight: 700,
//           textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.2
//         }}>
//           {label}
//         </Typography>
//         <Typography sx={{ fontSize: '0.95rem', color: '#1e293b', fontWeight: 600 }}>
//           {value}
//         </Typography>
//       </Box>
//     </Stack>
//   );
// }

// // Responsive address field tile — used inside Grid
// function AddressField({ icon, label, value, xs, sm }) {
//   return (
//     <Grid item xs={xs} sm={sm}>
//       <Box sx={{
//         backgroundColor: '#f8fafc',
//         border: '1px solid #f1f5f9',
//         borderRadius: '10px',
//         px: 1.5, py: 1.2,
//         height: '100%',
//       }}>
//         <Stack direction="row" spacing={0.6} alignItems="center" sx={{ mb: 0.4 }}>
//           {icon}
//           <Typography sx={{
//             fontSize: '0.7rem', color: '#94a3b8', fontWeight: 700,
//             textTransform: 'uppercase', letterSpacing: '0.05em',
//           }}>
//             {label}
//           </Typography>
//         </Stack>
//         <Typography sx={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: 600 }}>
//           {value || '—'}
//         </Typography>
//       </Box>
//     </Grid>
//   );
// }

// export default ProviderProfilePage;

// import { useState, useEffect } from 'react';
// import { useParams, useNavigate, useLocation } from 'react-router-dom';
// import {
//   Avatar, Box, Button, Card, CardContent,
//   Chip, Divider, Grid, Stack, Typography, CircularProgress,
//   Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
//   LinearProgress,
//   useTheme,
// } from '@mui/material';
// import { alpha } from '@mui/material/styles';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
// import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
// import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
// import StarRoundedIcon from '@mui/icons-material/StarRounded';
// import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
// import MailRoundedIcon from '@mui/icons-material/MailRounded';
// import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
// import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
// import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
// import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
// import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
// import PercentRoundedIcon from '@mui/icons-material/PercentRounded';
// import MiscellaneousServicesRoundedIcon from '@mui/icons-material/MiscellaneousServicesRounded';
// import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
// import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
// import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
// import LocationCityRoundedIcon from '@mui/icons-material/LocationCityRounded';
// import SignpostRoundedIcon from '@mui/icons-material/SignpostRounded';
// import ConfirmDialog from '../components/ConfirmDialog';
// import { useAppContext } from '../context/AppContext';
// import { useTranslation } from 'react-i18next';
// import api from '../utils/axiosInstance';

// function ProviderProfilePage() {
//   const { ProviderId } = useParams();
//   const navigate = useNavigate();
//   const location = useLocation();
//   const returnTo = location.state?.returnTo || '/Providers';
//   const { notify, activateProvider, deactivateProvider, deleteProvider } = useAppContext();
//   const { t, i18n } = useTranslation();
//   const isRtl = i18n.dir() === 'rtl';
//   const theme = useTheme();
//   const isDark = theme.palette.mode === 'dark';

//   const [provider, setProvider] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [deleteOpen, setDeleteOpen] = useState(false);
//   const [loadingAction, setLoadingAction] = useState(null);

//   useEffect(() => {
//     setLoading(true);
//     api.get(`/admin/provider/providers/${ProviderId}`)
//       .then(res => setProvider(res.data.data))
//       .catch(() => setProvider(null))
//       .finally(() => setLoading(false));
//   }, [ProviderId]);

//   async function handleActivate() {
//     setLoadingAction({ type: 'activate' });
//     try {
//       await activateProvider(provider.provider.id);
//       setProvider(prev => ({ ...prev, provider: { ...prev.provider, is_active: true } }));
//       notify({ severity: 'success', message: 'Provider activated successfully' });
//     } catch (err) {
//       notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to activate' });
//     } finally {
//       setLoadingAction(null);
//     }
//   }

//   async function handleDeactivate() {
//     setLoadingAction({ type: 'deactivate' });
//     try {
//       await deactivateProvider(provider.provider.id);
//       setProvider(prev => ({ ...prev, provider: { ...prev.provider, is_active: false } }));
//       notify({ severity: 'success', message: 'Provider deactivated successfully' });
//     } catch (err) {
//       notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to deactivate' });
//     } finally {
//       setLoadingAction(null);
//     }
//   }

//   async function handleDelete() {
//     setLoadingAction({ type: 'delete' });
//     try {
//       await deleteProvider(provider.provider.id);
//       notify({ severity: 'success', message: 'Provider deleted successfully' });
//       navigate(returnTo);
//     } catch (err) {
//       notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to delete' });
//     } finally {
//       setLoadingAction(null);
//     }
//   }

//   const overlayBg = isDark ? 'rgba(2,6,23,0.78)' : 'rgba(15,23,42,0.62)';

//   if (loading) {
//     return (
//       <PageLoader
//         overlayBg={overlayBg}
//         text={t('Providers.loading', { defaultValue: 'Loading provider...' })}
//       />
//     );
//   }

//   if (!provider) {
//     return (
//       <Box dir={isRtl ? 'rtl' : 'ltr'} sx={{ p: { xs: 2, md: 3 } }}>
//         <Card
//           elevation={0}
//           sx={{
//             borderRadius: '28px',
//             border: '1px solid',
//             borderColor: 'divider',
//             overflow: 'hidden',
//             background: isDark
//               ? `linear-gradient(135deg, ${theme.palette.background.paper}, ${alpha('#020617', 0.85)})`
//               : 'linear-gradient(135deg, #ffffff, #f8fafc)',
//           }}
//         >
//           <CardContent sx={{ p: { xs: 4, md: 6 }, textAlign: 'center' }}>
//             <Stack spacing={3} alignItems="center">
//               <Box
//                 sx={{
//                   width: 82,
//                   height: 82,
//                   borderRadius: '26px',
//                   display: 'grid',
//                   placeItems: 'center',
//                   bgcolor: isDark ? alpha('#ef4444', 0.15) : '#fef2f2',
//                   color: '#ef4444',
//                 }}
//               >
//                 <CloseRoundedIcon sx={{ fontSize: 40 }} />
//               </Box>

//               <Box>
//                 <Typography sx={{ fontSize: { xs: '1.5rem', md: '1.9rem' }, fontWeight: 900, color: 'text.primary' }}>
//                   {t('Providers.profile.notFound', { defaultValue: 'Provider not found' })}
//                 </Typography>
//                 <Typography sx={{ mt: 1, color: 'text.secondary', fontWeight: 500 }}>
//                   {t('Providers.profile.notFoundHint', {
//                     defaultValue: 'The provider profile could not be loaded or does not exist.',
//                   })}
//                 </Typography>
//               </Box>

//               <Button
//                 startIcon={<ArrowBackIcon sx={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />}
//                 variant="contained"
//                 onClick={() => navigate(returnTo)}
//                 sx={{
//                   borderRadius: '14px',
//                   px: 4,
//                   py: 1.2,
//                   textTransform: 'none',
//                   fontWeight: 800,
//                   boxShadow: 'none',
//                   '&:hover': { boxShadow: 'none' },
//                 }}
//               >
//                 {t('Providers.profile.back', { defaultValue: 'Back to Providers' })}
//               </Button>
//             </Stack>
//           </CardContent>
//         </Card>
//       </Box>
//     );
//   }

//   const {
//     provider: p = {},
//     address = null,
//     services = [],
//     category = null,
//     reviews = [],
//     ...otherPayload
//   } = provider;

//   const servicesList = Array.isArray(services) ? services : [];
//   const reviewsList = Array.isArray(reviews) ? reviews : [];
//   const providerName = `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Provider';
//   const initials = `${p.first_name?.[0] || ''}${p.last_name?.[0] || ''}`.toUpperCase() || 'P';
//   const ratingValue = safeNumber(p.rating);
//   const commissionValue = category?.commission ?? p.commission;
//   const serviceColumns = getOrderedKeys(servicesList, [
//     'id',
//     'title',
//     'description',
//     'price',
//     'is_active',
//     'created_at',
//     'updated_at',
//   ]);
//   const hasOtherPayload = Object.keys(otherPayload || {}).length > 0;

//   return (
//     <Box
//       dir={isRtl ? 'rtl' : 'ltr'}
//       sx={{
//         pb: 6,
//         position: 'relative',
//         minHeight: '100%',
//       }}
//     >
//       {loadingAction && (
//         <PageLoader
//           overlayBg={overlayBg}
//           text={
//             <>
//               {loadingAction.type === 'activate' && t('Providers.actions.activating', { defaultValue: 'Activating provider...' })}
//               {loadingAction.type === 'deactivate' && t('Providers.actions.deactivating', { defaultValue: 'Deactivating provider...' })}
//               {loadingAction.type === 'delete' && t('Providers.actions.deleting', { defaultValue: 'Deleting provider...' })}
//             </>
//           }
//         />
//       )}

//       <Stack spacing={3.2}>
//         {/* Top bar */}
//         <Stack
//           direction={{ xs: 'column', sm: 'row' }}
//           justifyContent="space-between"
//           alignItems={{ xs: 'stretch', sm: 'center' }}
//           gap={2}
//         >
//           <Button
//             startIcon={<ArrowBackIcon sx={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />}
//             variant="outlined"
//             onClick={() => navigate(returnTo)}
//             sx={{
//               width: { xs: '100%', sm: 'auto' },
//               justifyContent: 'center',
//               borderRadius: '14px',
//               px: 2.4,
//               py: 1.1,
//               textTransform: 'none',
//               fontWeight: 800,
//               borderColor: 'divider',
//               color: 'text.primary',
//               bgcolor: 'background.paper',
//               boxShadow: isDark ? 'none' : '0 10px 24px rgba(15,23,42,0.04)',
//               '&:hover': {
//                 borderColor: alpha(theme.palette.primary.main, 0.35),
//                 bgcolor: alpha(theme.palette.primary.main, 0.04),
//               },
//             }}
//           >
//             {t('Providers.profile.back', { defaultValue: 'Back to Providers' })}
//           </Button>

//           <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.2}>
//             {p.is_active ? (
//               <Button
//                 startIcon={<BlockRoundedIcon />}
//                 variant="outlined"
//                 onClick={handleDeactivate}
//                 sx={{
//                   borderRadius: '14px',
//                   py: 1.1,
//                   px: 2.4,
//                   textTransform: 'none',
//                   fontWeight: 800,
//                   color: '#dc2626',
//                   borderColor: isDark ? alpha('#ef4444', 0.45) : '#fecaca',
//                   backgroundColor: isDark ? alpha('#ef4444', 0.1) : '#fff1f2',
//                   '&:hover': {
//                     backgroundColor: isDark ? alpha('#ef4444', 0.16) : '#fee2e2',
//                     borderColor: '#ef4444',
//                   },
//                 }}
//               >
//                 {t('Providers.actions.deactivate', { defaultValue: 'Deactivate' })}
//               </Button>
//             ) : (
//               <Button
//                 startIcon={<CheckCircleRoundedIcon />}
//                 variant="outlined"
//                 onClick={handleActivate}
//                 sx={{
//                   borderRadius: '14px',
//                   py: 1.1,
//                   px: 2.4,
//                   textTransform: 'none',
//                   fontWeight: 800,
//                   color: '#16a34a',
//                   borderColor: isDark ? alpha('#22c55e', 0.45) : '#bbf7d0',
//                   backgroundColor: isDark ? alpha('#22c55e', 0.1) : '#f0fdf4',
//                   '&:hover': {
//                     backgroundColor: isDark ? alpha('#22c55e', 0.16) : '#dcfce7',
//                     borderColor: '#22c55e',
//                   },
//                 }}
//               >
//                 {t('Providers.actions.activate', { defaultValue: 'Activate' })}
//               </Button>
//             )}

//             <Button
//               startIcon={<DeleteOutlineRoundedIcon />}
//               variant="contained"
//               onClick={() => setDeleteOpen(true)}
//               sx={{
//                 borderRadius: '14px',
//                 py: 1.1,
//                 px: 2.4,
//                 textTransform: 'none',
//                 fontWeight: 800,
//                 background: 'linear-gradient(135deg, #ef4444, #dc2626)',
//                 color: '#ffffff',
//                 boxShadow: isDark ? 'none' : '0 14px 28px rgba(220,38,38,0.22)',
//                 '&:hover': {
//                   background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
//                   boxShadow: isDark ? 'none' : '0 16px 34px rgba(220,38,38,0.28)',
//                 },
//               }}
//             >
//               {t('Providers.actions.delete', { defaultValue: 'Delete' })}
//             </Button>
//           </Stack>
//         </Stack>

//         {/* Hero */}
//         <Card
//           elevation={0}
//           sx={{
//             borderRadius: '30px',
//             overflow: 'hidden',
//             position: 'relative',
//             border: '1px solid',
//             borderColor: isDark ? alpha('#94a3b8', 0.14) : alpha('#0f172a', 0.08),
//             background: isDark
//               ? `linear-gradient(135deg, ${alpha('#0f172a', 0.98)} 0%, ${alpha('#111827', 0.96)} 50%, ${alpha('#1e293b', 0.9)} 100%)`
//               : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 48%, #eef6ff 100%)',
//             boxShadow: isDark ? 'none' : '0 24px 70px rgba(15,23,42,0.08)',
//             '&::before': {
//               content: '""',
//               position: 'absolute',
//               width: 320,
//               height: 320,
//               borderRadius: '999px',
//               background: alpha(theme.palette.primary.main, isDark ? 0.16 : 0.12),
//               top: -130,
//               right: isRtl ? 'auto' : -90,
//               left: isRtl ? -90 : 'auto',
//               filter: 'blur(2px)',
//             },
//             '&::after': {
//               content: '""',
//               position: 'absolute',
//               width: 220,
//               height: 220,
//               borderRadius: '999px',
//               background: alpha('#22c55e', isDark ? 0.12 : 0.08),
//               bottom: -120,
//               left: isRtl ? 'auto' : '32%',
//               right: isRtl ? '32%' : 'auto',
//             },
//           }}
//         >
//           <CardContent sx={{ p: { xs: 3, md: 4.5 }, position: 'relative', zIndex: 1 }}>
//             <Stack
//               direction={{ xs: 'column', lg: 'row' }}
//               justifyContent="space-between"
//               alignItems={{ xs: 'stretch', lg: 'center' }}
//               gap={4}
//             >
//               <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'center', sm: 'center' }}>
//                 <Box sx={{ position: 'relative' }}>
//                   <Avatar
//                     src={p.image_url || undefined}
//                     sx={{
//                       width: { xs: 112, sm: 132 },
//                       height: { xs: 112, sm: 132 },
//                       borderRadius: '34px',
//                       bgcolor: isDark ? alpha(theme.palette.primary.main, 0.22) : '#dbeafe',
//                       color: theme.palette.primary.main,
//                       fontSize: '2.35rem',
//                       fontWeight: 900,
//                       border: '6px solid',
//                       borderColor: isDark ? alpha('#ffffff', 0.08) : '#ffffff',
//                       boxShadow: isDark ? '0 22px 40px rgba(0,0,0,0.28)' : '0 22px 40px rgba(15,23,42,0.14)',
//                     }}
//                   >
//                     {!p.image_url && initials}
//                   </Avatar>

//                   <Box
//                     sx={{
//                       position: 'absolute',
//                       bottom: 8,
//                       right: isRtl ? 'auto' : 8,
//                       left: isRtl ? 8 : 'auto',
//                       width: 22,
//                       height: 22,
//                       borderRadius: '50%',
//                       backgroundColor: p.is_active ? '#22c55e' : '#94a3b8',
//                       border: '4px solid',
//                       borderColor: isDark ? '#0f172a' : '#ffffff',
//                     }}
//                   />
//                 </Box>

//                 <Box sx={{ textAlign: { xs: 'center', sm: 'start' } }}>
//                   <Stack
//                     direction="row"
//                     spacing={1}
//                     alignItems="center"
//                     justifyContent={{ xs: 'center', sm: 'flex-start' }}
//                     flexWrap="wrap"
//                     gap={1}
//                   >
//                     <Typography
//                       sx={{
//                         fontSize: { xs: '1.8rem', md: '2.35rem' },
//                         fontWeight: 950,
//                         color: 'text.primary',
//                         letterSpacing: '-0.045em',
//                         lineHeight: 1.08,
//                       }}
//                     >
//                       {providerName}
//                     </Typography>

//                     <Chip
//                       label={`#${formatValue(p.id)}`}
//                       size="small"
//                       sx={{
//                         borderRadius: '10px',
//                         fontWeight: 900,
//                         bgcolor: isDark ? alpha('#ffffff', 0.08) : '#ffffff',
//                         border: '1px solid',
//                         borderColor: 'divider',
//                         color: 'text.secondary',
//                       }}
//                     />
//                   </Stack>

//                   <Typography
//                     sx={{
//                       mt: 1,
//                       color: 'text.secondary',
//                       fontWeight: 700,
//                       fontSize: '0.98rem',
//                     }}
//                   >
//                     {category?.name || p.service_category_name || t('Providers.profile.serviceProvider', { defaultValue: 'Service Provider' })}
//                   </Typography>

//                   <Stack
//                     direction="row"
//                     spacing={1}
//                     flexWrap="wrap"
//                     justifyContent={{ xs: 'center', sm: 'flex-start' }}
//                     sx={{ mt: 2.2 }}
//                     gap={1}
//                   >
//                     <StatusChip
//                       active={Boolean(p.is_active)}
//                       activeLabel={t('Providers.status.active', { defaultValue: 'Active' })}
//                       inactiveLabel={t('Providers.status.inactive', { defaultValue: 'Inactive' })}
//                       isDark={isDark}
//                     />

//                     <AvailabilityChip
//                       available={Boolean(p.is_available)}
//                       availableLabel={t('Providers.status.available', { defaultValue: 'Available' })}
//                       unavailableLabel={t('Providers.status.unavailable', { defaultValue: 'Unavailable' })}
//                       isDark={isDark}
//                     />

//                     <Chip
//                       icon={<WorkRoundedIcon sx={{ fontSize: 17 }} />}
//                       label={`${formatValue(p.experience_years)} ${t('Providers.card.years', { defaultValue: 'yrs' })}`}
//                       size="small"
//                       sx={{
//                         height: 32,
//                         borderRadius: '10px',
//                         fontWeight: 800,
//                         bgcolor: isDark ? alpha('#6366f1', 0.15) : '#eef2ff',
//                         color: isDark ? '#a5b4fc' : '#4338ca',
//                         '& .MuiChip-icon': { color: 'inherit' },
//                       }}
//                     />
//                   </Stack>
//                 </Box>
//               </Stack>

//               <Stack
//                 direction={{ xs: 'column', sm: 'row' }}
//                 spacing={1.5}
//                 sx={{ minWidth: { lg: 380 } }}
//               >
//                 <HeroMiniCard
//                   icon={<StarRoundedIcon />}
//                   label={t('Providers.profile.rating', { defaultValue: 'Rating' })}
//                   value={ratingValue.toFixed(1)}
//                   sub={`${formatValue(p.rating_count)} ${t('Providers.card.reviews', { defaultValue: 'reviews' })}`}
//                   color="#f59e0b"
//                   isDark={isDark}
//                 />

//                 <HeroMiniCard
//                   icon={<MiscellaneousServicesRoundedIcon />}
//                   label={t('Providers.profile.services', { defaultValue: 'Services' })}
//                   value={servicesList.length}
//                   sub={t('Providers.profile.totalServices', { defaultValue: 'Total services' })}
//                   color="#0284c7"
//                   isDark={isDark}
//                 />
//               </Stack>
//             </Stack>
//           </CardContent>
//         </Card>

//         {/* Metrics */}
//         <Grid container spacing={2.2}>
//           <Grid item xs={12} sm={6} lg={3}>
//             <MetricCard
//               icon={<AccessTimeRoundedIcon />}
//               label={t('Providers.profile.fields.experience', { defaultValue: 'Experience' })}
//               value={`${formatValue(p.experience_years)} ${t('Providers.card.years', { defaultValue: 'yrs' })}`}
//               helper={t('Providers.profile.professionalYears', { defaultValue: 'Professional years' })}
//               color="#2563eb"
//               isDark={isDark}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6} lg={3}>
//             <MetricCard
//               icon={<PercentRoundedIcon />}
//               label={t('Providers.profile.fields.commission', { defaultValue: 'Commission' })}
//               value={formatPercent(commissionValue)}
//               helper={category?.name || t('Providers.profile.categoryRate', { defaultValue: 'Category rate' })}
//               color="#10b981"
//               isDark={isDark}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6} lg={3}>
//             <MetricCard
//               icon={<MiscellaneousServicesRoundedIcon />}
//               label={t('Providers.profile.services', { defaultValue: 'Services' })}
//               value={servicesList.length}
//               helper={t('Providers.profile.registeredServices', { defaultValue: 'Registered services' })}
//               color="#7c3aed"
//               isDark={isDark}
//             />
//           </Grid>

//           <Grid item xs={12} sm={6} lg={3}>
//             <MetricCard
//               icon={<StarRoundedIcon />}
//               label={t('Providers.profile.reviews', { defaultValue: 'Reviews' })}
//               value={reviewsList.length}
//               helper={`${ratingValue.toFixed(1)} ${t('Providers.profile.averageRating', { defaultValue: 'average rating' })}`}
//               color="#f59e0b"
//               isDark={isDark}
//             />
//           </Grid>
//         </Grid>

//         {/* Main details */}
//         <Grid container spacing={2.4}>
//           <Grid item xs={12} lg={4}>
//             <SectionCard
//               title={t('Providers.profile.contactInfo', { defaultValue: 'Contact Information' })}
//               subtitle={t('Providers.profile.contactSubtitle', { defaultValue: 'Primary communication details' })}
//               icon={<LocalPhoneRoundedIcon />}
//               color="#2563eb"
//               isDark={isDark}
//             >
//               <Stack spacing={2.2}>
//                 <InfoRow
//                   icon={<LocalPhoneRoundedIcon sx={{ fontSize: 20 }} />}
//                   label={t('Providers.profile.fields.phone', { defaultValue: 'Phone' })}
//                   value={p.phone}
//                   color="#2563eb"
//                   isDark={isDark}
//                 />

//                 <Divider />

//                 <InfoRow
//                   icon={<MailRoundedIcon sx={{ fontSize: 20 }} />}
//                   label={t('Providers.profile.fields.email', { defaultValue: 'Email' })}
//                   value={p.email}
//                   color="#2563eb"
//                   isDark={isDark}
//                 />

//                 <Divider />

//                 <InfoRow
//                   icon={<CalendarMonthRoundedIcon sx={{ fontSize: 20 }} />}
//                   label={t('Providers.profile.fields.joinDate', { defaultValue: 'Join Date' })}
//                   value={formatDateTime(p.created_at)}
//                   color="#2563eb"
//                   isDark={isDark}
//                 />

//                 <Divider />

//                 <InfoRow
//                   icon={<AccessTimeRoundedIcon sx={{ fontSize: 20 }} />}
//                   label={t('Providers.profile.fields.updatedAt', { defaultValue: 'Updated At' })}
//                   value={formatDateTime(p.updated_at)}
//                   color="#2563eb"
//                   isDark={isDark}
//                 />
//               </Stack>
//             </SectionCard>
//           </Grid>

//           <Grid item xs={12} lg={4}>
//             <SectionCard
//               title={t('Providers.profile.professionalInfo', { defaultValue: 'Professional Information' })}
//               subtitle={t('Providers.profile.professionalSubtitle', { defaultValue: 'Category, commission and work status' })}
//               icon={<WorkRoundedIcon />}
//               color="#10b981"
//               isDark={isDark}
//             >
//               <Stack spacing={2.2}>
//                 <InfoRow
//                   icon={<WorkRoundedIcon sx={{ fontSize: 20 }} />}
//                   label={t('Providers.profile.fields.category', { defaultValue: 'Category' })}
//                   value={category?.name || p.service_category_name}
//                   color="#10b981"
//                   isDark={isDark}
//                 />

//                 <Divider />

//                 <InfoRow
//                   icon={<PercentRoundedIcon sx={{ fontSize: 20 }} />}
//                   label={t('Providers.profile.fields.commission', { defaultValue: 'Commission' })}
//                   value={formatPercent(commissionValue)}
//                   color="#10b981"
//                   isDark={isDark}
//                 />

//                 <Box>
//                   <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
//                     <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
//                       {t('Providers.profile.commissionProgress', { defaultValue: 'Commission Progress' })}
//                     </Typography>
//                     <Typography sx={{ fontSize: '0.85rem', color: 'text.primary', fontWeight: 900 }}>
//                       {formatPercent(commissionValue)}
//                     </Typography>
//                   </Stack>

//                   <LinearProgress
//                     variant="determinate"
//                     value={clampPercent(commissionValue)}
//                     sx={{
//                       height: 9,
//                       borderRadius: '999px',
//                       bgcolor: isDark ? alpha('#ffffff', 0.08) : '#e5e7eb',
//                       '& .MuiLinearProgress-bar': {
//                         borderRadius: '999px',
//                         background: 'linear-gradient(90deg, #10b981, #22c55e)',
//                       },
//                     }}
//                   />
//                 </Box>

//                 <Divider />

//                 <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
//                   <StatusChip
//                     active={Boolean(p.is_active)}
//                     activeLabel={t('Providers.status.active', { defaultValue: 'Active' })}
//                     inactiveLabel={t('Providers.status.inactive', { defaultValue: 'Inactive' })}
//                     isDark={isDark}
//                   />

//                   <AvailabilityChip
//                     available={Boolean(p.is_available)}
//                     availableLabel={t('Providers.status.available', { defaultValue: 'Available' })}
//                     unavailableLabel={t('Providers.status.unavailable', { defaultValue: 'Unavailable' })}
//                     isDark={isDark}
//                   />
//                 </Stack>
//               </Stack>
//             </SectionCard>
//           </Grid>

//           <Grid item xs={12} lg={4}>
//             <SectionCard
//               title={t('Providers.profile.description', { defaultValue: 'Description' })}
//               subtitle={t('Providers.profile.descriptionSubtitle', { defaultValue: 'Provider bio and notes' })}
//               icon={<HomeRoundedIcon />}
//               color="#7c3aed"
//               isDark={isDark}
//             >
//               <Box
//                 sx={{
//                   minHeight: 205,
//                   borderRadius: '18px',
//                   border: '1px solid',
//                   borderColor: 'divider',
//                   bgcolor: isDark ? alpha('#ffffff', 0.035) : '#f8fafc',
//                   p: 2.2,
//                 }}
//               >
//                 <Typography
//                   sx={{
//                     color: p.description ? 'text.primary' : 'text.secondary',
//                     fontWeight: p.description ? 600 : 500,
//                     lineHeight: 1.85,
//                     whiteSpace: 'pre-wrap',
//                   }}
//                 >
//                   {formatValue(p.description)}
//                 </Typography>
//               </Box>
//             </SectionCard>
//           </Grid>
//         </Grid>

//         {/* Address */}
//         <SectionCard
//           title={t('Providers.profile.address', { defaultValue: 'Address' })}
//           subtitle={t('Providers.profile.addressSubtitle', { defaultValue: 'Location and full address data' })}
//           icon={<LocationOnRoundedIcon />}
//           color="#6366f1"
//           isDark={isDark}
//         >
//           {address ? (
//             <Stack spacing={2.4}>
//               <Box
//                 sx={{
//                   p: 2.2,
//                   borderRadius: '20px',
//                   bgcolor: isDark ? alpha('#6366f1', 0.1) : '#eef2ff',
//                   border: '1px solid',
//                   borderColor: isDark ? alpha('#818cf8', 0.22) : '#c7d2fe',
//                 }}
//               >
//                 <Stack direction="row" spacing={1.4} alignItems="flex-start">
//                   <Box
//                     sx={{
//                       width: 42,
//                       height: 42,
//                       borderRadius: '14px',
//                       display: 'grid',
//                       placeItems: 'center',
//                       color: '#6366f1',
//                       bgcolor: isDark ? alpha('#6366f1', 0.16) : '#ffffff',
//                       flexShrink: 0,
//                     }}
//                   >
//                     <HomeRoundedIcon sx={{ fontSize: 22 }} />
//                   </Box>

//                   <Box>
//                     <Typography sx={{ fontWeight: 900, color: 'text.primary', mb: 0.4 }}>
//                       {address.title || t('Providers.profile.fullAddress', { defaultValue: 'Full Address' })}
//                     </Typography>
//                     <Typography sx={{ color: 'text.secondary', lineHeight: 1.75, fontWeight: 600 }}>
//                       {formatValue(address.display_address)}
//                     </Typography>
//                   </Box>
//                 </Stack>
//               </Box>

//               <Grid container spacing={1.5}>
//                 <AddressField
//                   icon={<PublicRoundedIcon sx={{ fontSize: 16 }} />}
//                   label={t('Providers.profile.fields.country', { defaultValue: 'Country' })}
//                   value={address.country}
//                   xs={12}
//                   sm={6}
//                   md={3}
//                   isDark={isDark}
//                 />

//                 <AddressField
//                   icon={<LocationCityRoundedIcon sx={{ fontSize: 16 }} />}
//                   label={t('Providers.profile.fields.city', { defaultValue: 'City' })}
//                   value={address.city}
//                   xs={12}
//                   sm={6}
//                   md={3}
//                   isDark={isDark}
//                 />

//                 <AddressField
//                   icon={<SignpostRoundedIcon sx={{ fontSize: 16 }} />}
//                   label={t('Providers.profile.fields.area', { defaultValue: 'Area' })}
//                   value={address.area}
//                   xs={12}
//                   sm={6}
//                   md={3}
//                   isDark={isDark}
//                 />

//                 <AddressField
//                   icon={<HomeRoundedIcon sx={{ fontSize: 16 }} />}
//                   label={t('Providers.profile.fields.street', { defaultValue: 'Street' })}
//                   value={address.street}
//                   xs={12}
//                   sm={6}
//                   md={3}
//                   isDark={isDark}
//                 />

//                 <AddressField
//                   label={t('Providers.profile.fields.building', { defaultValue: 'Building' })}
//                   value={address.building}
//                   xs={12}
//                   sm={4}
//                   isDark={isDark}
//                 />

//                 <AddressField
//                   label={t('Providers.profile.fields.floor', { defaultValue: 'Floor' })}
//                   value={address.floor}
//                   xs={12}
//                   sm={4}
//                   isDark={isDark}
//                 />

//                 <AddressField
//                   label={t('Providers.profile.fields.apartment', { defaultValue: 'Apt.' })}
//                   value={address.apartment}
//                   xs={12}
//                   sm={4}
//                   isDark={isDark}
//                 />
//               </Grid>

//               <Divider />

//               <KeyValueGrid
//                 title={t('Providers.profile.allAddressData', { defaultValue: 'All Address Data' })}
//                 data={address}
//                 isDark={isDark}
//               />
//             </Stack>
//           ) : (
//             <EmptyState
//               icon={<LocationOnRoundedIcon />}
//               title={t('Providers.profile.noAddress', { defaultValue: 'No address data' })}
//               description={t('Providers.profile.noAddressHint', { defaultValue: 'No address information was returned from the backend.' })}
//               isDark={isDark}
//             />
//           )}
//         </SectionCard>

//         {/* Category */}
//         <SectionCard
//           title={t('Providers.profile.categoryDetails', { defaultValue: 'Category Details' })}
//           subtitle={t('Providers.profile.categorySubtitle', { defaultValue: 'Full category information returned from backend' })}
//           icon={<WorkRoundedIcon />}
//           color="#0ea5e9"
//           isDark={isDark}
//         >
//           {category ? (
//             <KeyValueGrid data={category} isDark={isDark} />
//           ) : (
//             <EmptyState
//               icon={<WorkRoundedIcon />}
//               title={t('Providers.profile.noCategory', { defaultValue: 'No category data' })}
//               description={t('Providers.profile.noCategoryHint', { defaultValue: 'No category information was returned from the backend.' })}
//               isDark={isDark}
//             />
//           )}
//         </SectionCard>

//         {/* Complete Provider Data */}
//         <SectionCard
//           title={t('Providers.profile.completeProviderData', { defaultValue: 'Complete Provider Data' })}
//           subtitle={t('Providers.profile.completeProviderDataSubtitle', { defaultValue: 'Every field returned inside provider object' })}
//           icon={<CheckCircleRoundedIcon />}
//           color="#14b8a6"
//           isDark={isDark}
//         >
//           <KeyValueGrid
//             data={p}
//             isDark={isDark}
//             priority={[
//               'id',
//               'first_name',
//               'last_name',
//               'phone',
//               'email',
//               'category_id',
//               'service_category_name',
//               'experience_years',
//               'rating',
//               'rating_count',
//               'is_active',
//               'is_available',
//               'description',
//               'image_url',
//               'created_at',
//               'updated_at',
//             ]}
//           />
//         </SectionCard>

//         {/* Services */}
//         <SectionCard
//           title={t('Providers.profile.services', { defaultValue: 'Services' })}
//           subtitle={t('Providers.profile.servicesSubtitle', { defaultValue: 'All provider services returned from backend' })}
//           icon={<MiscellaneousServicesRoundedIcon />}
//           color="#0284c7"
//           isDark={isDark}
//           endAdornment={
//             <Chip
//               label={servicesList.length}
//               size="small"
//               sx={{
//                 borderRadius: '10px',
//                 fontWeight: 900,
//                 bgcolor: '#0284c7',
//                 color: '#ffffff',
//               }}
//             />
//           }
//         >
//           {servicesList.length > 0 ? (
//             <TableContainer
//               component={Paper}
//               elevation={0}
//               sx={{
//                 border: '1px solid',
//                 borderColor: 'divider',
//                 borderRadius: '20px',
//                 bgcolor: 'background.paper',
//                 overflowX: 'auto',
//               }}
//             >
//               <Table sx={{ minWidth: 900 }}>
//                 <TableHead>
//                   <TableRow
//                     sx={{
//                       bgcolor: isDark ? alpha('#ffffff', 0.04) : '#f8fafc',
//                     }}
//                   >
//                     <TableCell sx={tableHeadSx}>#</TableCell>

//                     {serviceColumns.map((key) => (
//                       <TableCell key={key} sx={tableHeadSx}>
//                         {prettyKey(key)}
//                       </TableCell>
//                     ))}
//                   </TableRow>
//                 </TableHead>

//                 <TableBody>
//                   {servicesList.map((svc, index) => (
//                     <TableRow
//                       key={svc.id || index}
//                       sx={{
//                         '&:last-child td': { border: 0 },
//                         '&:hover': {
//                           bgcolor: isDark ? alpha('#ffffff', 0.035) : '#f8fafc',
//                         },
//                         transition: 'background-color 0.2s ease',
//                       }}
//                     >
//                       <TableCell sx={{ fontWeight: 900, color: 'text.disabled' }}>
//                         {index + 1}
//                       </TableCell>

//                       {serviceColumns.map((key) => (
//                         <TableCell key={key} sx={{ minWidth: key === 'description' ? 280 : 140 }}>
//                           {renderFieldValue(svc[key], { isDark, table: true, keyName: key })}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           ) : (
//             <EmptyState
//               icon={<MiscellaneousServicesRoundedIcon />}
//               title={t('Providers.profile.noServices', { defaultValue: 'No services yet' })}
//               description={t('Providers.profile.noServicesHint', { defaultValue: 'No service records were returned from the backend.' })}
//               isDark={isDark}
//             />
//           )}
//         </SectionCard>

//         {/* Reviews */}
//         <SectionCard
//           title={t('Providers.profile.reviews', { defaultValue: 'Reviews' })}
//           subtitle={t('Providers.profile.reviewsSubtitle', { defaultValue: 'Customer feedback and rating records' })}
//           icon={<StarRoundedIcon />}
//           color="#f59e0b"
//           isDark={isDark}
//           endAdornment={
//             <Chip
//               label={reviewsList.length}
//               size="small"
//               sx={{
//                 borderRadius: '10px',
//                 fontWeight: 900,
//                 bgcolor: '#f59e0b',
//                 color: '#ffffff',
//               }}
//             />
//           }
//         >
//           {reviewsList.length > 0 ? (
//             <Grid container spacing={1.6}>
//               {reviewsList.map((review, index) => (
//                 <Grid item xs={12} md={6} key={review.id || index}>
//                   <ReviewCard review={review} isDark={isDark} />
//                 </Grid>
//               ))}
//             </Grid>
//           ) : (
//             <EmptyState
//               icon={<StarRoundedIcon />}
//               title={t('Providers.profile.noReviews', { defaultValue: 'No reviews yet' })}
//               description={t('Providers.profile.noReviewsHint', { defaultValue: 'No review records were returned from the backend.' })}
//               isDark={isDark}
//             />
//           )}
//         </SectionCard>

//         {/* Other top-level backend data */}
//         {hasOtherPayload && (
//           <SectionCard
//             title={t('Providers.profile.otherBackendData', { defaultValue: 'Other Backend Data' })}
//             subtitle={t('Providers.profile.otherBackendDataSubtitle', { defaultValue: 'Additional top-level fields returned from API response' })}
//             icon={<CheckRoundedIcon />}
//             color="#64748b"
//             isDark={isDark}
//           >
//             <KeyValueGrid data={otherPayload} isDark={isDark} />
//           </SectionCard>
//         )}
//       </Stack>

//       <ConfirmDialog
//         open={deleteOpen}
//         title={t('Providers.confirm.title', { defaultValue: 'Delete Provider' })}
//         description={t('Providers.profile.deleteConfirm', {
//           defaultValue: `Are you sure you want to delete ${p.first_name} ${p.last_name}?`,
//           name: `${p.first_name} ${p.last_name}`,
//         })}
//         confirmLabel={t('common.delete', { defaultValue: 'Delete' })}
//         onClose={() => setDeleteOpen(false)}
//         onConfirm={handleDelete}
//       />
//     </Box>
//   );
// }

// /* ───────────────────────────── Sub Components ───────────────────────────── */

// function PageLoader({ overlayBg, text }) {
//   return (
//     <Box
//       sx={{
//         position: 'fixed',
//         inset: 0,
//         zIndex: 9999,
//         backgroundColor: overlayBg,
//         backdropFilter: 'blur(10px)',
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         justifyContent: 'center',
//         gap: 2.2,
//       }}
//     >
//       <Box
//         sx={{
//           width: 88,
//           height: 88,
//           borderRadius: '28px',
//           display: 'grid',
//           placeItems: 'center',
//           bgcolor: 'rgba(255,255,255,0.1)',
//           border: '1px solid rgba(255,255,255,0.14)',
//           boxShadow: '0 24px 70px rgba(0,0,0,0.22)',
//         }}
//       >
//         <CircularProgress size={48} thickness={4} sx={{ color: '#ffffff' }} />
//       </Box>

//       <Typography
//         sx={{
//           fontSize: '1rem',
//           fontWeight: 800,
//           color: '#ffffff',
//           letterSpacing: '0.01em',
//         }}
//       >
//         {text}
//       </Typography>
//     </Box>
//   );
// }

// function SectionCard({ title, subtitle, icon, color, isDark, children, endAdornment }) {
//   return (
//     <Card
//       elevation={0}
//       sx={{
//         borderRadius: '24px',
//         border: '1px solid',
//         borderColor: isDark ? alpha('#94a3b8', 0.14) : alpha('#0f172a', 0.08),
//         bgcolor: 'background.paper',
//         boxShadow: isDark ? 'none' : '0 18px 48px rgba(15,23,42,0.055)',
//         overflow: 'hidden',
//       }}
//     >
//       <CardContent sx={{ p: { xs: 2.4, md: 3 } }}>
//         <Stack
//           direction={{ xs: 'column', sm: 'row' }}
//           justifyContent="space-between"
//           alignItems={{ xs: 'flex-start', sm: 'center' }}
//           gap={1.5}
//           sx={{ mb: 2.6 }}
//         >
//           <Stack direction="row" spacing={1.5} alignItems="center">
//             <Box
//               sx={{
//                 width: 46,
//                 height: 46,
//                 borderRadius: '16px',
//                 display: 'grid',
//                 placeItems: 'center',
//                 bgcolor: isDark ? alpha(color, 0.16) : alpha(color, 0.1),
//                 color,
//                 flexShrink: 0,
//               }}
//             >
//               {icon}
//             </Box>

//             <Box>
//               <Typography
//                 sx={{
//                   fontSize: '1.08rem',
//                   fontWeight: 950,
//                   color: 'text.primary',
//                   letterSpacing: '-0.02em',
//                 }}
//               >
//                 {title}
//               </Typography>

//               {subtitle && (
//                 <Typography
//                   sx={{
//                     mt: 0.25,
//                     color: 'text.secondary',
//                     fontSize: '0.84rem',
//                     fontWeight: 600,
//                   }}
//                 >
//                   {subtitle}
//                 </Typography>
//               )}
//             </Box>
//           </Stack>

//           {endAdornment}
//         </Stack>

//         {children}
//       </CardContent>
//     </Card>
//   );
// }

// function HeroMiniCard({ icon, label, value, sub, color, isDark }) {
//   return (
//     <Box
//       sx={{
//         flex: 1,
//         minWidth: 160,
//         p: 2,
//         borderRadius: '22px',
//         bgcolor: isDark ? alpha('#ffffff', 0.055) : alpha('#ffffff', 0.78),
//         border: '1px solid',
//         borderColor: isDark ? alpha('#ffffff', 0.09) : alpha('#0f172a', 0.06),
//         backdropFilter: 'blur(12px)',
//       }}
//     >
//       <Stack direction="row" spacing={1.2} alignItems="center">
//         <Box
//           sx={{
//             width: 42,
//             height: 42,
//             borderRadius: '15px',
//             display: 'grid',
//             placeItems: 'center',
//             bgcolor: alpha(color, isDark ? 0.18 : 0.12),
//             color,
//             flexShrink: 0,
//           }}
//         >
//           {icon}
//         </Box>

//         <Box>
//           <Typography sx={{ color: 'text.secondary', fontSize: '0.75rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
//             {label}
//           </Typography>
//           <Typography sx={{ mt: 0.2, fontSize: '1.45rem', color: 'text.primary', fontWeight: 950, lineHeight: 1 }}>
//             {value}
//           </Typography>
//           <Typography sx={{ mt: 0.45, color: 'text.secondary', fontSize: '0.78rem', fontWeight: 700 }}>
//             {sub}
//           </Typography>
//         </Box>
//       </Stack>
//     </Box>
//   );
// }

// function MetricCard({ icon, label, value, helper, color, isDark }) {
//   return (
//     <Card
//       elevation={0}
//       sx={{
//         height: '100%',
//         borderRadius: '22px',
//         border: '1px solid',
//         borderColor: isDark ? alpha('#94a3b8', 0.14) : alpha('#0f172a', 0.08),
//         bgcolor: 'background.paper',
//         boxShadow: isDark ? 'none' : '0 16px 42px rgba(15,23,42,0.05)',
//       }}
//     >
//       <CardContent sx={{ p: 2.3 }}>
//         <Stack direction="row" spacing={1.5} alignItems="center">
//           <Box
//             sx={{
//               width: 48,
//               height: 48,
//               borderRadius: '17px',
//               display: 'grid',
//               placeItems: 'center',
//               bgcolor: alpha(color, isDark ? 0.17 : 0.1),
//               color,
//               flexShrink: 0,
//             }}
//           >
//             {icon}
//           </Box>

//           <Box sx={{ minWidth: 0 }}>
//             <Typography sx={{ color: 'text.secondary', fontSize: '0.78rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.055em' }}>
//               {label}
//             </Typography>

//             <Typography sx={{ mt: 0.35, color: 'text.primary', fontSize: '1.35rem', fontWeight: 950, lineHeight: 1.15 }}>
//               {value}
//             </Typography>

//             <Typography sx={{ mt: 0.35, color: 'text.secondary', fontSize: '0.78rem', fontWeight: 650 }} noWrap>
//               {helper}
//             </Typography>
//           </Box>
//         </Stack>
//       </CardContent>
//     </Card>
//   );
// }

// function InfoRow({ icon, label, value, color, isDark }) {
//   return (
//     <Stack direction="row" spacing={1.6} alignItems="center">
//       <Box
//         sx={{
//           width: 42,
//           height: 42,
//           borderRadius: '14px',
//           backgroundColor: isDark ? alpha(color, 0.14) : alpha(color, 0.08),
//           color,
//           display: 'grid',
//           placeItems: 'center',
//           flexShrink: 0,
//           border: '1px solid',
//           borderColor: isDark ? alpha(color, 0.18) : alpha(color, 0.12),
//         }}
//       >
//         {icon}
//       </Box>

//       <Box sx={{ minWidth: 0 }}>
//         <Typography
//           sx={{
//             fontSize: '0.72rem',
//             color: 'text.secondary',
//             fontWeight: 900,
//             textTransform: 'uppercase',
//             letterSpacing: '0.06em',
//             mb: 0.25,
//           }}
//         >
//           {label}
//         </Typography>

//         <Typography
//           sx={{
//             fontSize: '0.96rem',
//             color: 'text.primary',
//             fontWeight: 800,
//             wordBreak: 'break-word',
//           }}
//         >
//           {formatValue(value)}
//         </Typography>
//       </Box>
//     </Stack>
//   );
// }

// function AddressField({ icon, label, value, xs, sm, md, isDark }) {
//   return (
//     <Grid item xs={xs} sm={sm} md={md}>
//       <Box
//         sx={{
//           backgroundColor: isDark ? alpha('#ffffff', 0.035) : '#f8fafc',
//           border: '1px solid',
//           borderColor: 'divider',
//           borderRadius: '16px',
//           px: 1.6,
//           py: 1.4,
//           height: '100%',
//         }}
//       >
//         <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.55 }}>
//           {icon && (
//             <Box sx={{ color: '#6366f1', display: 'flex', alignItems: 'center' }}>
//               {icon}
//             </Box>
//           )}

//           <Typography
//             sx={{
//               fontSize: '0.7rem',
//               color: 'text.secondary',
//               fontWeight: 900,
//               textTransform: 'uppercase',
//               letterSpacing: '0.055em',
//             }}
//           >
//             {label}
//           </Typography>
//         </Stack>

//         <Typography
//           sx={{
//             fontSize: '0.92rem',
//             color: 'text.primary',
//             fontWeight: 850,
//             wordBreak: 'break-word',
//           }}
//         >
//           {formatValue(value)}
//         </Typography>
//       </Box>
//     </Grid>
//   );
// }

// function KeyValueGrid({ data, isDark, priority = [] }) {
//   const entries = orderedEntries(data, priority);

//   if (!entries.length) {
//     return (
//       <EmptyState
//         icon={<CheckRoundedIcon />}
//         title="No data"
//         description="No fields were returned in this object."
//         isDark={isDark}
//       />
//     );
//   }

//   return (
//     <Grid container spacing={1.4}>
//       {entries.map(([key, value]) => (
//         <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
//           <Box
//             sx={{
//               height: '100%',
//               p: 1.7,
//               borderRadius: '17px',
//               bgcolor: isDark ? alpha('#ffffff', 0.035) : '#f8fafc',
//               border: '1px solid',
//               borderColor: 'divider',
//             }}
//           >
//             <Typography
//               sx={{
//                 fontSize: '0.7rem',
//                 color: 'text.secondary',
//                 fontWeight: 950,
//                 textTransform: 'uppercase',
//                 letterSpacing: '0.06em',
//                 mb: 0.7,
//               }}
//             >
//               {prettyKey(key)}
//             </Typography>

//             {renderFieldValue(value, { isDark, keyName: key })}
//           </Box>
//         </Grid>
//       ))}
//     </Grid>
//   );
// }

// function ReviewCard({ review, isDark }) {
//   const rating = getFirstValue(review, ['rating', 'rate', 'stars']);
//   const comment = getFirstValue(review, ['comment', 'review', 'description', 'notes', 'message']);
//   const createdAt = getFirstValue(review, ['created_at', 'createdAt', 'date']);
//   const customerName = getNestedName(review.customer) || getNestedName(review.user) || getFirstValue(review, ['customer_name', 'user_name', 'name']);

//   return (
//     <Box
//       sx={{
//         height: '100%',
//         p: 2,
//         borderRadius: '20px',
//         border: '1px solid',
//         borderColor: 'divider',
//         bgcolor: isDark ? alpha('#ffffff', 0.035) : '#f8fafc',
//       }}
//     >
//       <Stack spacing={1.5}>
//         <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1.5}>
//           <Stack direction="row" spacing={1.2} alignItems="center">
//             <Avatar
//               sx={{
//                 width: 42,
//                 height: 42,
//                 borderRadius: '14px',
//                 bgcolor: isDark ? alpha('#f59e0b', 0.15) : '#fffbeb',
//                 color: '#f59e0b',
//                 fontWeight: 900,
//               }}
//             >
//               {(customerName || 'U')?.[0]?.toUpperCase()}
//             </Avatar>

//             <Box>
//               <Typography sx={{ color: 'text.primary', fontWeight: 900 }}>
//                 {formatValue(customerName)}
//               </Typography>

//               <Typography sx={{ color: 'text.secondary', fontSize: '0.78rem', fontWeight: 700 }}>
//                 {formatDateTime(createdAt)}
//               </Typography>
//             </Box>
//           </Stack>

//           <Chip
//             icon={<StarRoundedIcon sx={{ fontSize: 16 }} />}
//             label={isEmpty(rating) ? '—' : Number(rating).toFixed(1)}
//             size="small"
//             sx={{
//               height: 30,
//               borderRadius: '10px',
//               fontWeight: 900,
//               bgcolor: isDark ? alpha('#f59e0b', 0.14) : '#fffbeb',
//               color: '#b45309',
//               '& .MuiChip-icon': { color: '#f59e0b' },
//             }}
//           />
//         </Stack>

//         <Typography
//           sx={{
//             color: comment ? 'text.primary' : 'text.secondary',
//             fontWeight: comment ? 650 : 500,
//             lineHeight: 1.75,
//             minHeight: 48,
//             whiteSpace: 'pre-wrap',
//           }}
//         >
//           {formatValue(comment)}
//         </Typography>

//         <Divider />

//         <KeyValueGrid data={review} isDark={isDark} />
//       </Stack>
//     </Box>
//   );
// }

// function EmptyState({ icon, title, description, isDark }) {
//   return (
//     <Stack
//       alignItems="center"
//       justifyContent="center"
//       spacing={1}
//       sx={{
//         py: 5,
//         px: 2,
//         borderRadius: '20px',
//         border: '1px dashed',
//         borderColor: 'divider',
//         bgcolor: isDark ? alpha('#ffffff', 0.03) : '#f8fafc',
//         textAlign: 'center',
//       }}
//     >
//       <Box
//         sx={{
//           width: 58,
//           height: 58,
//           borderRadius: '20px',
//           display: 'grid',
//           placeItems: 'center',
//           color: 'text.disabled',
//           bgcolor: isDark ? alpha('#ffffff', 0.05) : '#ffffff',
//           border: '1px solid',
//           borderColor: 'divider',
//         }}
//       >
//         {icon}
//       </Box>

//       <Typography sx={{ color: 'text.primary', fontWeight: 900, fontSize: '1rem' }}>
//         {title}
//       </Typography>

//       <Typography sx={{ color: 'text.secondary', fontWeight: 600, maxWidth: 460 }}>
//         {description}
//       </Typography>
//     </Stack>
//   );
// }

// function StatusChip({ active, activeLabel, inactiveLabel, isDark }) {
//   return (
//     <Chip
//       icon={active ? <CheckRoundedIcon /> : <CloseRoundedIcon />}
//       label={active ? activeLabel : inactiveLabel}
//       size="small"
//       sx={{
//         height: 32,
//         borderRadius: '10px',
//         fontWeight: 850,
//         bgcolor: active
//           ? (isDark ? alpha('#22c55e', 0.15) : '#dcfce7')
//           : (isDark ? alpha('#94a3b8', 0.14) : '#f1f5f9'),
//         color: active ? '#16a34a' : 'text.secondary',
//         '& .MuiChip-icon': {
//           color: active ? '#16a34a' : 'text.secondary',
//         },
//       }}
//     />
//   );
// }

// function AvailabilityChip({ available, availableLabel, unavailableLabel, isDark }) {
//   return (
//     <Chip
//       icon={available ? <CheckCircleRoundedIcon /> : <BlockRoundedIcon />}
//       label={available ? availableLabel : unavailableLabel}
//       size="small"
//       sx={{
//         height: 32,
//         borderRadius: '10px',
//         fontWeight: 850,
//         bgcolor: available
//           ? (isDark ? alpha('#0284c7', 0.15) : '#e0f2fe')
//           : (isDark ? alpha('#ef4444', 0.12) : '#fee2e2'),
//         color: available ? '#0369a1' : '#b91c1c',
//         '& .MuiChip-icon': {
//           color: available ? '#0369a1' : '#b91c1c',
//         },
//       }}
//     />
//   );
// }

// /* ───────────────────────────── Helpers ───────────────────────────── */

// const tableHeadSx = {
//   fontWeight: 950,
//   fontSize: '0.72rem',
//   color: 'text.secondary',
//   textTransform: 'uppercase',
//   letterSpacing: '0.06em',
//   py: 1.9,
//   whiteSpace: 'nowrap',
// };

// function isEmpty(value) {
//   return value === null || value === undefined || value === '';
// }

// function formatValue(value) {
//   if (isEmpty(value)) return '—';

//   if (typeof value === 'boolean') {
//     return value ? 'Yes' : 'No';
//   }

//   if (Array.isArray(value)) {
//     return value.length ? JSON.stringify(value, null, 2) : '—';
//   }

//   if (typeof value === 'object') {
//     return JSON.stringify(value, null, 2);
//   }

//   return String(value);
// }

// function safeNumber(value) {
//   const number = Number(value);
//   return Number.isFinite(number) ? number : 0;
// }

// function formatPercent(value) {
//   if (isEmpty(value)) return '—';

//   const number = Number(value);
//   if (!Number.isFinite(number)) return String(value);

//   return `${number}%`;
// }

// function clampPercent(value) {
//   const number = Number(value);
//   if (!Number.isFinite(number)) return 0;

//   return Math.max(0, Math.min(100, number));
// }

// function formatMoney(value) {
//   if (isEmpty(value)) return '—';

//   const number = Number(value);
//   if (!Number.isFinite(number)) return String(value);

//   return `$${number.toFixed(2)}`;
// }

// function formatDateTime(value) {
//   if (isEmpty(value)) return '—';

//   const raw = String(value);
//   if (/^\d{4}-\d{2}-\d{2}/.test(raw)) {
//     return raw.replace('T', ' ').slice(0, 19);
//   }

//   return raw;
// }

// function prettyKey(key) {
//   return String(key)
//     .replace(/_/g, ' ')
//     .replace(/([a-z])([A-Z])/g, '$1 $2')
//     .replace(/\b\w/g, char => char.toUpperCase());
// }

// function orderedEntries(data, priority = []) {
//   if (!data || typeof data !== 'object') return [];

//   const entries = Object.entries(data);
//   const used = new Set();

//   const ordered = priority
//     .filter(key => Object.prototype.hasOwnProperty.call(data, key))
//     .map(key => {
//       used.add(key);
//       return [key, data[key]];
//     });

//   entries.forEach(([key, value]) => {
//     if (!used.has(key)) ordered.push([key, value]);
//   });

//   return ordered;
// }

// function getOrderedKeys(items, priority = []) {
//   const allKeys = Array.from(
//     new Set(
//       items.flatMap(item => (
//         item && typeof item === 'object' ? Object.keys(item) : []
//       )),
//     ),
//   );

//   return [
//     ...priority.filter(key => allKeys.includes(key)),
//     ...allKeys.filter(key => !priority.includes(key)),
//   ];
// }

// function getFirstValue(obj, keys) {
//   if (!obj || typeof obj !== 'object') return null;

//   for (const key of keys) {
//     if (!isEmpty(obj[key])) return obj[key];
//   }

//   return null;
// }

// function getNestedName(obj) {
//   if (!obj || typeof obj !== 'object') return null;

//   const fullName = `${obj.first_name || ''} ${obj.last_name || ''}`.trim();
//   return fullName || obj.name || null;
// }

// function renderFieldValue(value, { isDark, table = false, keyName = '' } = {}) {
//   if (typeof value === 'boolean') {
//     return (
//       <Chip
//         icon={value ? <CheckRoundedIcon /> : <CloseRoundedIcon />}
//         label={value ? 'Yes' : 'No'}
//         size="small"
//         sx={{
//           height: 28,
//           borderRadius: '9px',
//           fontWeight: 850,
//           bgcolor: value
//             ? (isDark ? alpha('#22c55e', 0.14) : '#dcfce7')
//             : (isDark ? alpha('#94a3b8', 0.13) : '#f1f5f9'),
//           color: value ? '#16a34a' : 'text.secondary',
//           '& .MuiChip-icon': {
//             color: value ? '#16a34a' : 'text.secondary',
//           },
//         }}
//       />
//     );
//   }

//   if (keyName === 'price') {
//     return (
//       <Typography sx={{ color: 'text.primary', fontWeight: 950, whiteSpace: 'nowrap' }}>
//         {formatMoney(value)}
//       </Typography>
//     );
//   }

//   if (keyName.includes('date') || keyName.endsWith('_at') || keyName.endsWith('At')) {
//     return (
//       <Typography sx={{ color: 'text.primary', fontWeight: 750, wordBreak: 'break-word' }}>
//         {formatDateTime(value)}
//       </Typography>
//     );
//   }

//   if (typeof value === 'object' && value !== null) {
//     return (
//       <Box
//         component="pre"
//         sx={{
//           m: 0,
//           p: 1.2,
//           maxHeight: table ? 130 : 220,
//           overflow: 'auto',
//           borderRadius: '12px',
//           bgcolor: isDark ? alpha('#000000', 0.22) : '#ffffff',
//           border: '1px solid',
//           borderColor: 'divider',
//           color: 'text.primary',
//           fontFamily: 'monospace',
//           fontSize: '0.75rem',
//           lineHeight: 1.6,
//           whiteSpace: 'pre-wrap',
//           wordBreak: 'break-word',
//         }}
//       >
//         {formatValue(value)}
//       </Box>
//     );
//   }

//   return (
//     <Typography
//       sx={{
//         color: isEmpty(value) ? 'text.secondary' : 'text.primary',
//         fontWeight: isEmpty(value) ? 600 : 800,
//         fontSize: table ? '0.875rem' : '0.9rem',
//         lineHeight: 1.65,
//         whiteSpace: 'pre-wrap',
//         wordBreak: 'break-word',
//       }}
//     >
//       {formatValue(value)}
//     </Typography>
//   );
// }

// export default ProviderProfilePage;

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Avatar, Box, Button, Card, CardContent, Chip, CircularProgress,
  Divider, Grid, IconButton, Rating, Skeleton, Stack, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import MiscellaneousServicesRoundedIcon from '@mui/icons-material/MiscellaneousServicesRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import CustomerRestrictionActions from '../components/customers/CustomerRestrictionActions';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import api from '../utils/axiosInstance';

function getInitials(firstName = '', lastName = '') {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function isEmpty(value) {
  return value === null || value === undefined || value === '';
}

function formatDateTime(value) {
  if (isEmpty(value)) return '—';
  const raw = String(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.replace('T', ' ').slice(0, 19);
  return raw;
}

function formatMoney(value) {
  if (isEmpty(value)) return '—';
  const number = Number(value);
  return Number.isFinite(number) ? `$${number.toFixed(2)}` : String(value);
}

function formatPercent(value) {
  if (isEmpty(value)) return '—';
  const number = Number(value);
  return Number.isFinite(number) ? `${number}%` : String(value);
}

function SectionCard({ title, subtitle, icon, endAdornment, children }) {
  return (
    <Card elevation={0} sx={(theme) => ({ borderRadius: 3, border: `1px solid ${theme.palette.divider}` })}>
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={1.5}
          sx={{ mb: 2.5 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            {icon && (
              <Box sx={{
                width: 40, height: 40, borderRadius: 2, display: 'grid', placeItems: 'center',
                bgcolor: 'action.hover', color: 'primary.main', flexShrink: 0,
              }}>
                {icon}
              </Box>
            )}
            <Box>
              <Typography variant="subtitle2" fontWeight={800}>{title}</Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
              )}
            </Box>
          </Stack>
          {endAdornment}
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
}

function InfoField({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.3, wordBreak: 'break-word' }}>
        {isEmpty(value) ? '—' : String(value)}
      </Typography>
    </Box>
  );
}

function EmptyState({ icon, title, description }) {
  return (
    <Stack alignItems="center" spacing={1} sx={{ py: 4, textAlign: 'center' }}>
      <Box sx={{ color: 'text.disabled' }}>{icon}</Box>
      <Typography variant="body2" fontWeight={700}>{title}</Typography>
      <Typography variant="caption" color="text.secondary">{description}</Typography>
    </Stack>
  );
}

function ProviderProfilePage() {
  const { ProviderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || '/Providers';
  const { notify, activateProvider, deactivateProvider, deleteProvider } = useAppContext();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null); // 'activate' | 'deactivate' | 'delete' | null

  const loadProvider = useCallback(() => {
    setLoading(true);
    setError(null);
    api.get(`/admin/provider/providers/${ProviderId}`)
      .then((res) => setProvider(res.data.data))
      .catch((err) => setError(err.message || 'Failed to load provider'))
      .finally(() => setLoading(false));
  }, [ProviderId]);

  useEffect(() => { loadProvider(); }, [loadProvider]);

  async function handleActivate() {
    setLoadingAction('activate');
    try {
      await activateProvider(provider.provider.id);
      setProvider((prev) => ({ ...prev, provider: { ...prev.provider, is_active: true } }));
      notify({ severity: 'success', message: 'Provider activated successfully' });
    } catch (err) {
      notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to activate' });
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleDeactivate() {
    setLoadingAction('deactivate');
    try {
      await deactivateProvider(provider.provider.id);
      setProvider((prev) => ({ ...prev, provider: { ...prev.provider, is_active: false } }));
      notify({ severity: 'success', message: 'Provider deactivated successfully' });
    } catch (err) {
      notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to deactivate' });
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleDelete() {
    setLoadingAction('delete');
    try {
      await deleteProvider(provider.provider.id);
      notify({ severity: 'success', message: 'Provider deleted successfully' });
      navigate(returnTo);
    } catch (err) {
      notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to delete' });
    } finally {
      setLoadingAction(null);
      setDeleteOpen(false);
    }
  }

  if (loading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={60} />
        <Skeleton variant="rounded" height={220} />
        <Skeleton variant="rounded" height={160} />
      </Stack>
    );
  }

  if (error || !provider) {
    return (
      <Stack spacing={2} alignItems="center" sx={{ py: 6 }}>
        <Typography color="error">{error || t('Providers.profile.notFound', { defaultValue: 'Provider not found' })}</Typography>
        <Button onClick={() => navigate(returnTo)}>{t('common.back', { defaultValue: 'Back' })}</Button>
      </Stack>
    );
  }

  const {
    provider: p = {},
    addresses = [],
    services = [],
    category = null,
    reviews = [],
  } = provider;

  const addressesList = Array.isArray(addresses) ? addresses : [];
  const servicesList = Array.isArray(services) ? services : [];
  const reviewsList = Array.isArray(reviews) ? reviews : [];
  const providerName = `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Provider';
  const ratingValue = Number(p.rating) || 0;
  const commissionValue = category?.commission ?? p.commission;

  return (
    <Stack spacing={3} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton onClick={() => navigate(returnTo)}>
            <ArrowBackIcon sx={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
          </IconButton>
          <PageHeader
            title={providerName}
            subtitle={t('Providers.profile.subtitle', { defaultValue: 'Provider details' })}
          />
        </Stack>

        <Stack direction="row" spacing={1.2}>
          {p.is_active ? (
            <Button
              startIcon={loadingAction === 'deactivate' ? <CircularProgress size={16} /> : <BlockRoundedIcon />}
              variant="outlined" color="error"
              disabled={loadingAction === 'deactivate'}
              onClick={handleDeactivate}
            >
              {t('Providers.actions.deactivate', { defaultValue: 'Deactivate' })}
            </Button>
          ) : (
            <Button
              startIcon={loadingAction === 'activate' ? <CircularProgress size={16} /> : <CheckCircleRoundedIcon />}
              variant="outlined" color="success"
              disabled={loadingAction === 'activate'}
              onClick={handleActivate}
            >
              {t('Providers.actions.activate', { defaultValue: 'Activate' })}
            </Button>
          )}

          <Button
            startIcon={loadingAction === 'delete' ? <CircularProgress size={16} /> : <DeleteOutlineRoundedIcon />}
            variant="contained" color="error"
            disabled={loadingAction === 'delete'}
            onClick={() => setDeleteOpen(true)}
          >
            {t('Providers.actions.delete', { defaultValue: 'Delete' })}
          </Button>
        </Stack>
      </Stack>

      {/* Main info card */}
      <Card elevation={0} sx={(theme) => ({ borderRadius: 3, border: `1px solid ${theme.palette.divider}` })}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm="auto">
              <Avatar src={p.image_url || undefined} sx={{ width: 96, height: 96, fontSize: '1.8rem', fontWeight: 700 }}>
                {getInitials(p.first_name, p.last_name)}
              </Avatar>
            </Grid>
            <Grid item xs={12} sm>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                  <Typography variant="h6" fontWeight={800}>{providerName}</Typography>
                  <Chip
                    label={p.is_active
                      ? t('Providers.status.active', { defaultValue: 'Active' })
                      : t('Providers.status.inactive', { defaultValue: 'Inactive' })}
                    color={p.is_active ? 'success' : 'default'}
                    size="small"
                  />
                  <Chip
                    label={p.is_available
                      ? t('Providers.status.available', { defaultValue: 'Available' })
                      : t('Providers.status.unavailable', { defaultValue: 'Unavailable' })}
                    color={p.is_available ? 'info' : 'default'}
                    variant="outlined"
                    size="small"
                  />
                </Stack>

                <Typography variant="body2" color="text.secondary">{p.email}</Typography>
                <Typography variant="body2" color="text.secondary">{p.phone}</Typography>

                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Rating value={ratingValue} precision={0.1} readOnly size="small" />
                  <Typography variant="caption" color="text.secondary">
                    {ratingValue.toFixed(1)} · {p.rating_count ?? 0} {t('Providers.card.reviews', { defaultValue: 'reviews' })}
                  </Typography>
                </Stack>

                <Typography variant="caption" color="text.secondary">
                  {t('customers.details.registeredAt', { defaultValue: 'Registered at' })}: {formatDateTime(p.created_at)}
                </Typography>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <InfoField label={t('Providers.profile.fields.experience', { defaultValue: 'Experience' })} value={`${p.experience_years ?? '—'} ${t('Providers.card.years', { defaultValue: 'yrs' })}`} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <InfoField label={t('Providers.profile.fields.commission', { defaultValue: 'Commission' })} value={formatPercent(commissionValue)} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <InfoField label={t('Providers.profile.services', { defaultValue: 'Services' })} value={servicesList.length} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <InfoField label={t('Providers.profile.fields.updatedAt', { defaultValue: 'Updated At' })} value={formatDateTime(p.updated_at)} />
            </Grid>
          </Grid>

          {p.description && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('Providers.profile.description', { defaultValue: 'Description' })}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
                {p.description}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>

      {/* Category */}
      <SectionCard
        title={t('Providers.profile.categoryDetails', { defaultValue: 'Category' })}
        subtitle={t('Providers.profile.categorySubtitle', { defaultValue: 'Assigned service category' })}
        icon={<WorkRoundedIcon />}
      >
        {category ? (
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4}><InfoField label={t('Providers.profile.fields.category', { defaultValue: 'Category' })} value={category.name} /></Grid>
            <Grid item xs={6} sm={4}><InfoField label={t('Providers.profile.fields.commission', { defaultValue: 'Commission' })} value={formatPercent(category.commission)} /></Grid>
            <Grid item xs={6} sm={4}>
              <InfoField
                label={t('customers.table.status', { defaultValue: 'Status' })}
                value={category.is_active
                  ? t('Providers.status.active', { defaultValue: 'Active' })
                  : t('Providers.status.inactive', { defaultValue: 'Inactive' })}
              />
            </Grid>
          </Grid>
        ) : (
          <EmptyState
            icon={<WorkRoundedIcon />}
            title={t('Providers.profile.noCategory', { defaultValue: 'No category data' })}
            description={t('Providers.profile.noCategoryHint', { defaultValue: 'No category information was returned from the backend.' })}
          />
        )}
      </SectionCard>

      {/* Addresses (array — a provider can have more than one) */}
      <SectionCard
        title={t('Providers.profile.address', { defaultValue: 'Addresses' })}
        subtitle={t('Providers.profile.addressSubtitle', { defaultValue: 'Registered location data' })}
        icon={<LocationOnRoundedIcon />}
        endAdornment={
          <Chip label={addressesList.length} size="small" sx={{ fontWeight: 800 }} />
        }
      >
        {addressesList.length > 0 ? (
          <Stack spacing={2} divider={<Divider />}>
            {addressesList.map((addr) => (
              <Box key={addr.id}>
                <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>
                  {addr.title || addr.display_address || `${addr.city || ''}, ${addr.country || ''}`}
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={6} sm={3}><InfoField label={t('Providers.profile.fields.country', { defaultValue: 'Country' })} value={addr.country} /></Grid>
                  <Grid item xs={6} sm={3}><InfoField label={t('Providers.profile.fields.city', { defaultValue: 'City' })} value={addr.city} /></Grid>
                  <Grid item xs={6} sm={3}><InfoField label={t('Providers.profile.fields.area', { defaultValue: 'Area' })} value={addr.area} /></Grid>
                  {addr.street && <Grid item xs={6} sm={3}><InfoField label={t('Providers.profile.fields.street', { defaultValue: 'Street' })} value={addr.street} /></Grid>}
                  {addr.building && <Grid item xs={6} sm={3}><InfoField label={t('Providers.profile.fields.building', { defaultValue: 'Building' })} value={addr.building} /></Grid>}
                  {addr.floor && <Grid item xs={6} sm={3}><InfoField label={t('Providers.profile.fields.floor', { defaultValue: 'Floor' })} value={addr.floor} /></Grid>}
                  {addr.apartment && <Grid item xs={6} sm={3}><InfoField label={t('Providers.profile.fields.apartment', { defaultValue: 'Apt.' })} value={addr.apartment} /></Grid>}
                </Grid>
              </Box>
            ))}
          </Stack>
        ) : (
          <EmptyState
            icon={<LocationOnRoundedIcon />}
            title={t('Providers.profile.noAddress', { defaultValue: 'No address data' })}
            description={t('Providers.profile.noAddressHint', { defaultValue: 'No address information was returned from the backend.' })}
          />
        )}
      </SectionCard>

      {/* Services */}
      <SectionCard
        title={t('Providers.profile.services', { defaultValue: 'Services' })}
        subtitle={t('Providers.profile.servicesSubtitle', { defaultValue: 'All services registered by this provider' })}
        icon={<MiscellaneousServicesRoundedIcon />}
        endAdornment={<Chip label={servicesList.length} size="small" sx={{ fontWeight: 800 }} />}
      >
        {servicesList.length > 0 ? (
          <TableContainer component={Paper} elevation={0} sx={(theme) => ({ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 })}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'action.hover' }}>
                  <TableCell sx={{ fontWeight: 800 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>{t('Providers.table.title', { defaultValue: 'Title' })}</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>{t('Providers.table.description', { defaultValue: 'Description' })}</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>{t('Providers.table.price', { defaultValue: 'Price' })}</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>{t('customers.table.status', { defaultValue: 'Status' })}</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>{t('Providers.table.createdAt', { defaultValue: 'Created At' })}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {servicesList.map((svc, index) => (
                  <TableRow key={svc.id || index} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{svc.title || '—'}</TableCell>
                    <TableCell sx={{ maxWidth: 320 }}>
                      <Typography variant="body2" color="text.secondary" noWrap>{svc.description || '—'}</Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{formatMoney(svc.price)}</TableCell>
                    <TableCell>
                      <Chip
                        label={svc.is_active ? t('Providers.status.active', { defaultValue: 'Active' }) : t('Providers.status.inactive', { defaultValue: 'Inactive' })}
                        color={svc.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDateTime(svc.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <EmptyState
            icon={<MiscellaneousServicesRoundedIcon />}
            title={t('Providers.profile.noServices', { defaultValue: 'No services yet' })}
            description={t('Providers.profile.noServicesHint', { defaultValue: 'No service records were returned from the backend.' })}
          />
        )}
      </SectionCard>

      {/* Reviews */}
      <SectionCard
        title={t('Providers.profile.reviews', { defaultValue: 'Reviews' })}
        subtitle={t('Providers.profile.reviewsSubtitle', { defaultValue: 'Customer feedback for this provider' })}
        icon={<StarRoundedIcon />}
        endAdornment={<Chip label={reviewsList.length} size="small" sx={{ fontWeight: 800 }} />}
      >
        {reviewsList.length > 0 ? (
          <Stack spacing={2} divider={<Divider />}>
            {reviewsList.map((review) => (
              <Box key={review.id}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Rating value={review.stars ?? 0} readOnly size="small" />
                  <Typography variant="caption" color="text.secondary">
                    {formatDateTime(review.created_at)}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {review.comment || '—'}
                </Typography>
              </Box>
            ))}
          </Stack>
        ) : (
          <EmptyState
            icon={<StarRoundedIcon />}
            title={t('Providers.profile.noReviews', { defaultValue: 'No reviews yet' })}
            description={t('Providers.profile.noReviewsHint', { defaultValue: 'No review records were returned from the backend.' })}
          />
        )}
      </SectionCard>

      {/* Restrictions */}
      <SectionCard
        title={t('Providers.profile.restrictions', { defaultValue: 'Account Restrictions' })}
        subtitle={t('Providers.profile.restrictionsSubtitle', { defaultValue: 'Ban, suspend, limit, or warn this provider' })}
        icon={<GavelRoundedIcon />}
      >
        <CustomerRestrictionActions accountId={p.id} accountType="provider" />
      </SectionCard>

      <ConfirmDialog
        open={deleteOpen}
        title={t('Providers.confirm.title', { defaultValue: 'Delete Provider' })}
        description={t('Providers.profile.deleteConfirm', {
          defaultValue: `Are you sure you want to delete ${p.first_name} ${p.last_name}?`,
          name: `${p.first_name} ${p.last_name}`,
        })}
        confirmLabel={t('common.delete', { defaultValue: 'Delete' })}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </Stack>
  );
}

export default ProviderProfilePage;