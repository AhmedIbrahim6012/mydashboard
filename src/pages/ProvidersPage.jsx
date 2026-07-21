// // عدّل هاد السطر
// import { useMemo, useState, useEffect, useRef } from 'react';
// import {
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Chip,
//   Divider,
//   InputAdornment,
//   Stack,
//   TextField,
//   Typography,
// } from '@mui/material';
// import { alpha } from '@mui/material/styles';
// import AddRoundedIcon from '@mui/icons-material/AddRounded';
// import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
// import StarRoundedIcon from '@mui/icons-material/StarRounded';
// import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
// import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
// import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
// import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
// import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
// import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
// import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
// import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
// import ProviderDialog from '../components/ProviderDialog';
// import { useAppContext } from '../context/AppContext';
// import { useTranslation } from 'react-i18next';
// import { formatCurrency } from '../utils/format';
// import { useNavigate } from 'react-router-dom';
// import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
// import MailRoundedIcon from '@mui/icons-material/MailRounded';
// import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
// import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
// import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
// import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
// import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
// import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText,CircularProgress } from '@mui/material';
// // عدّل هاد السطر
// import api from '../utils/axiosInstance';

// const STATUS_FILTERS = ['all', 'Available', 'Unavailable', 'Active','Inactive'];
// const Provider_LOCATIONS = ['Riyadh', 'Dubai', 'Jeddah', 'Abu Dhabi', 'Doha', 'Kuwait City'];


// function parseExperienceYears(experience) {
//   const match = String(experience || '').match(/\d+/);
//   return Number(match?.[0] || 0);
// }

// function getInitials(name) {
//   return String(name || '')
//     .split(/\s+/)
//     .filter(Boolean)
//     .slice(0, 2)
//     .map((part) => part.slice(0, 1))
//     .join('')
//     .toUpperCase();
// }

// function buildEmail(name) {
//   const slug = String(name || '')
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, '.')
//     .replace(/^\.+|\.+$/g, '');

//   return `${slug || 'Provider'}@mydashboard.app`;
// }

// function getStatusMeta(status, t) {
//   const normalized = status === 'busy' || status === 'offline' ? status : 'active';

//   if (normalized === 'busy') {
//     return {
//       label: t('Providers.status.busy', { defaultValue: 'Busy' }),
//       color: '#b45309',
//       backgroundColor: 'rgba(245, 158, 11, 0.12)',
//       icon: <AccessTimeRoundedIcon sx={{ fontSize: 16 }} />,
//     };
//   }

//   if (normalized === 'offline') {
//     return {
//       label: t('Providers.status.offline', { defaultValue: 'Offline' }),
//       color: '#ef4444',
//       backgroundColor: 'rgba(239, 68, 68, 0.12)',
//       icon: <FiberManualRecordRoundedIcon sx={{ fontSize: 12 }} />,
//     };
//   }

//   return {
//     label: t('Providers.status.active', { defaultValue: 'Active' }),
//     color: '#15803d',
//     backgroundColor: 'rgba(34, 197, 94, 0.12)',
//     icon: <CheckCircleOutlineRoundedIcon sx={{ fontSize: 16 }} />,
//   };
// }

// function getProviderDisplay(Provider, index, professionName, t) {
//   const experienceYears = parseExperienceYears(Provider.experience);
//   const balance = Number(Provider.balance || 0);
//   const status = Provider.status || (experienceYears >= 7 ? 'active' : experienceYears >= 4 ? 'busy' : 'offline');
//   const location = Provider.location || Provider_LOCATIONS[index % Provider_LOCATIONS.length];
//   const rating = Math.min(5, 4.4 + Math.min(experienceYears, 9) * 0.07 + (balance > 10000 ? 0.12 : 0));
//   const completedJobs = Math.max(14, experienceYears * 11 + Math.round(balance / 1200));
//   const activeJobs = status === 'busy' ? Math.max(1, Math.min(4, Math.round(experienceYears / 2))) : status === 'active' ? 1 : 0;
//   const reviewCount = 18 + experienceYears * 12 + index * 3;
//   const joinedAt = Provider.createdAt ? new Date(Provider.createdAt) : null;
//   const email = Provider.email || buildEmail(Provider.name);
//   const phone = Provider.phone || t('Providers.table.phone', { defaultValue: 'Phone Number' });
//   const service = professionName || Provider.service || Provider.professionName || t('Providers.card.serviceFallback');

//   return {
//     ...Provider,
//     service,
//     status,
//     location,
//     rating,
//     reviewCount,
//     completedJobs,
//     activeJobs,
//     revenue: balance,
//     email,
//     phone,
//     joinedAt,
//     initials: getInitials(Provider.name),
//     experienceYears,
//   };
// }

// function SummaryCard({ label, value, helper, icon, tone = 'neutral' }) {
//   const borderColor = tone === 'positive' ? 'rgba(34, 197, 94, 0.18)' : 'rgba(15, 23, 42, 0.08)';
//   const backgroundColor = tone === 'positive' ? 'linear-gradient(180deg, rgba(240, 253, 244, 1), rgba(236, 253, 245, 0.75))' : 'linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(248, 250, 252, 0.86))';

//   return (
//     <Card
//       elevation={0}
//       sx={{
//         borderRadius: 2,
//         border: `1px solid ${borderColor}`,
//         background: backgroundColor,
//         boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04), 0 10px 24px rgba(15, 23, 42, 0.04)',
//         height: '100%',
//       }}
//     >
//       <CardContent sx={{ p: 2.4, '&:last-child': { pb: 2.4 } }}>
//         <Stack spacing={1.1}>
//           <Stack direction="row" alignItems="center" spacing={1.1}>
//             <Box
//               sx={{
//                 width: 42,
//                 height: 42,
//                 borderRadius: 2,
//                 display: 'grid',
//                 placeItems: 'center',
//                 color: tone === 'positive' ? '#15803d' : '#2563eb',
//                 backgroundColor: tone === 'positive' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(37, 99, 235, 0.1)',
//               }}
//             >
//               {icon}
//             </Box>
//             <Typography sx={{ fontSize: '0.9rem', lineHeight: 1.2, fontWeight: 700, color: '#6b7280' }}>{label}</Typography>
//           </Stack>
//           <Typography sx={{ fontSize: '2rem', lineHeight: 1.05, fontWeight: 800, letterSpacing: '-0.04em', color: '#0f172a' }}>
//             {value}
//           </Typography>
//           <Typography sx={{ fontSize: '0.92rem', lineHeight: 1.4, color: '#64748b' }}>{helper}</Typography>
//         </Stack>
//       </CardContent>
//     </Card>
//   );
// }

// function ProviderMetric({ label, value }) {
//   return (
//     <Box>
//       <Typography sx={{ fontSize: '0.74rem', lineHeight: 1.2, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
//         {label}
//       </Typography>
//       <Typography sx={{ mt: 0.35, fontSize: { xs: '0.95rem', md: '1.02rem' }, lineHeight: 1.2, color: '#0f172a', fontWeight: 800 }}>
//         {value}
//       </Typography>
//     </Box>
//   );
// }


// function ProviderCard({ Provider, onViewProfile, onActivate, onDeactivate, onDelete, t }) {
//   const initials = `${Provider.first_name?.[0] || ''}${Provider.last_name?.[0] || ''}`.toUpperCase() || 'P';
//   const [menuAnchor, setMenuAnchor] = useState(null);

//   const availabilityMeta = Provider.is_available
//     ? { label: t('Providers.status.available', { defaultValue: 'Available' }), color: '#15803d', dot: '#22c55e' }
//     : { label: t('Providers.status.unavailable', { defaultValue: 'Unavailable' }), color: '#b91c1c', dot: '#ef4444' };

//   return (
//     <Card
//       elevation={0}
//       sx={{
//         borderRadius: '20px',
//         border: '1px solid rgba(226,232,240,0.8)',
//         background: '#ffffff',
//         boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
//         transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
//         '&:hover': {
//           transform: 'translateY(-4px)',
//           boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)',
//           borderColor: '#3b82f6',
//         },
//       }}
//     >
//       <CardContent sx={{ p: { xs: 2.5, sm: 3 }, '&:last-child': { pb: { xs: 2.5, sm: 3 } } }}>
//         <Stack direction={{ xs: 'column', lg: 'row' }} alignItems={{ xs: 'stretch', lg: 'center' }} justifyContent="space-between" spacing={3}>

//           {/* Avatar + الاسم والمهنة + الإتاحة */}
//          <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
  
//   {/* Avatar — بيعرض الصورة إذا موجودة */}
//   <Box sx={{ position: 'relative', flexShrink: 0 }}>
//     <Avatar
//       src={Provider.image_url || undefined}
//       sx={{
//         width: 60, height: 60,
//         borderRadius: '16px',
//         bgcolor: '#eff6ff', color: '#2563eb',
//         fontSize: '1.2rem', fontWeight: 700,
//         border: '2px solid #f8fafc',
//         boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
//       }}
//     >
//       {!Provider.image_url && initials}
//     </Avatar>

//     {/* نقطة is_active فوق الـ Avatar */}
//     <Box sx={{
//       position: 'absolute', bottom: 2, right: 2,
//       width: 12, height: 12, borderRadius: '50%',
//       backgroundColor: Provider.is_active ? '#22c55e' : '#94a3b8',
//       border: '2px solid #ffffff',
//     }} />
//   </Box>

//   <Box sx={{ minWidth: 0 }}>
//     <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
//       {Provider.first_name} {Provider.last_name}
//     </Typography>

//     {/* المهنة */}
//     <Box sx={{ display: 'inline-flex', alignItems: 'center', mt: 0.4, px: 1.2, py: 0.25, borderRadius: '8px', backgroundColor: '#f0fdf4', border: '1px solid #dcfce7' }}>
//       <Typography sx={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>
//         {Provider.service_category_name || t('Providers.card.serviceFallback', { defaultValue: 'Service Provider' })}
//       </Typography>
//     </Box>

//     {/* is_active + is_available في سطر */}
//     <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.6 }}>
      
//       {/* is_active */}
//       <Stack direction="row" spacing={0.5} alignItems="center">
//         <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: Provider.is_active ? '#22c55e' : '#94a3b8', flexShrink: 0 }} />
//         <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: Provider.is_active ? '#15803d' : '#64748b' }}>
//           {Provider.is_active
//             ? t('Providers.status.active', { defaultValue: 'Active' })
//             : t('Providers.status.inactive', { defaultValue: 'Inactive' })}
//         </Typography>
//       </Stack>

//       <Typography sx={{ fontSize: '0.75rem', color: '#cbd5e1' }}>·</Typography>

//       {/* is_available */}
//       <Stack direction="row" spacing={0.5} alignItems="center">
//         <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: availabilityMeta.dot, flexShrink: 0 }} />
//         <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: availabilityMeta.color }}>
//           {availabilityMeta.label}
//         </Typography>
//       </Stack>

//     </Stack>
//   </Box>
// </Stack>

//           {/* المعلومات الوسطى */}
//           <Stack
//             direction={{ xs: 'column', sm: 'row' }}
//             spacing={{ xs: 1.5, sm: 3 }}
//             alignItems={{ xs: 'flex-start', sm: 'center' }}
//             sx={{ flexWrap: 'wrap', flex: { lg: 2 }, justifyContent: { lg: 'center' } }}
//           >
//             <Stack direction="row" spacing={0.8} alignItems="center">
//               <LocalPhoneRoundedIcon sx={{ fontSize: 17, color: '#64748b' }} />
//               <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', fontFamily: 'monospace' }}>
//                 {Provider.phone}
//               </Typography>
//             </Stack>

//             {Provider.email && (
//               <Stack direction="row" spacing={0.8} alignItems="center" sx={{ minWidth: 0 }}>
//                 <MailRoundedIcon sx={{ fontSize: 17, color: '#64748b' }} />
//                 <Typography noWrap sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', maxWidth: 200 }}>
//                   {Provider.email}
//                 </Typography>
//               </Stack>
//             )}

//             <Stack direction="row" spacing={0.8} alignItems="center">
//               <AccessTimeRoundedIcon sx={{ fontSize: 17, color: '#64748b' }} />
//               <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
//                 {Provider.experience_years} {t('Providers.card.years', { defaultValue: 'yrs exp' })}
//               </Typography>
//             </Stack>

//             <Stack direction="row" spacing={0.8} alignItems="center">
//               <CalendarMonthRoundedIcon sx={{ fontSize: 17, color: '#64748b' }} />
//               <Typography sx={{ fontSize: '0.875rem', color: '#334155' }}>
//                 {Provider.created_at ? new Date(Provider.created_at).toISOString().slice(0, 10) : '—'}
//               </Typography>
//             </Stack>
//           </Stack>

//           {/* التقييم + الزر + القائمة */}
//           <Stack direction={{ xs: 'row', lg: 'column' }} spacing={1.5} alignItems={{ xs: 'center', lg: 'flex-end' }} sx={{ flexShrink: 0 }}>

//             {/* Rating */}
//             <Stack direction="row" spacing={0.5} alignItems="center"
//               sx={{ px: 1.4, py: 0.6, borderRadius: '10px', backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}
//             >
//               <StarRoundedIcon sx={{ fontSize: 17, color: '#f59e0b' }} />
//               <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#92400e' }}>
//                 {Number(Provider.rating).toFixed(1)}
//               </Typography>
//               <Typography sx={{ fontSize: '0.78rem', color: '#a16207' }}>
//                 ({Provider.rating_count})
//               </Typography>
//             </Stack>

//             {/* الأزرار */}
//             <Stack direction="row" spacing={1} alignItems="center">
//               <Button
//                 variant="contained"
//                 onClick={() => onViewProfile(Provider)}
//                 sx={{
//                   height: 42,
//                   borderRadius: '12px',
//                   textTransform: 'none',
//                   fontSize: '0.875rem',
//                   fontWeight: 600,
//                   backgroundColor: '#1e293b',
//                   boxShadow: 'none',
//                   '&:hover': { backgroundColor: '#0f172a', boxShadow: '0 4px 12px rgba(15,23,42,0.15)' },
//                 }}
//               >
//                 {t('Providers.card.viewProfile', { defaultValue: 'View Profile' })}
//               </Button>

//               {/* قائمة الـ Actions */}
//               <IconButton
//                 size="small"
//                 onClick={(e) => setMenuAnchor(e.currentTarget)}
//                 sx={{
//                   width: 42, height: 42,
//                   borderRadius: '12px',
//                   border: '1px solid rgba(15,23,42,0.1)',
//                   color: '#64748b',
//                   '&:hover': { backgroundColor: '#f8fafc', borderColor: '#cbd5e1' },
//                 }}
//               >
//                 <MoreVertRoundedIcon fontSize="small" />
//               </IconButton>

//               <Menu
//                 anchorEl={menuAnchor}
//                 open={Boolean(menuAnchor)}
//                 onClose={() => setMenuAnchor(null)}
//                 transformOrigin={{ horizontal: 'right', vertical: 'top' }}
//                 anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//                 PaperProps={{
//                   elevation: 0,
//                   sx: {
//                     borderRadius: '12px',
//                     border: '1px solid rgba(15,23,42,0.08)',
//                     boxShadow: '0 10px 30px rgba(15,23,42,0.1)',
//                     minWidth: 180,
//                     mt: 0.5,
//                   },
//                 }}
//               >
//                 {Provider.is_active ? (
//                   <MenuItem onClick={() => { setMenuAnchor(null); onDeactivate?.(Provider); }}
//                     sx={{ borderRadius: '8px', mx: 0.5, '&:hover': { backgroundColor: '#fff7ed' } }}
//                   >
//                     <ListItemIcon><BlockRoundedIcon fontSize="small" sx={{ color: '#f97316' }} /></ListItemIcon>
//                     <ListItemText primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600, color: '#c2410c' }}>
//                       {t('Providers.actions.deactivate', { defaultValue: 'Deactivate' })}
//                     </ListItemText>
//                   </MenuItem>
//                 ) : (
//                   <MenuItem onClick={() => { setMenuAnchor(null); onActivate?.(Provider); }}
//                     sx={{ borderRadius: '8px', mx: 0.5, '&:hover': { backgroundColor: '#f0fdf4' } }}
//                   >
//                     <ListItemIcon><CheckCircleRoundedIcon fontSize="small" sx={{ color: '#22c55e' }} /></ListItemIcon>
//                     <ListItemText primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600, color: '#15803d' }}>
//                       {t('Providers.actions.activate', { defaultValue: 'Activate' })}
//                     </ListItemText>
//                   </MenuItem>
//                 )}

//                 <MenuItem onClick={() => { setMenuAnchor(null); onDelete?.(Provider); }}
//                   sx={{ borderRadius: '8px', mx: 0.5, '&:hover': { backgroundColor: '#fff1f2' } }}
//                 >
//                   <ListItemIcon><DeleteOutlineRoundedIcon fontSize="small" sx={{ color: '#ef4444' }} /></ListItemIcon>
//                   <ListItemText primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600, color: '#dc2626' }}>
//                     {t('Providers.actions.delete', { defaultValue: 'Delete' })}
//                   </ListItemText>
//                 </MenuItem>
//               </Menu>
//             </Stack>
//           </Stack>

//         </Stack>
//       </CardContent>
//     </Card>
//   );
// }

// function ProvidersPage() {
//   const { Providers, professions, addProvider, notify, fetchProviders,activateProvider, deactivateProvider, deleteProvider } = useAppContext();
//   const { t, i18n } = useTranslation();
//   const isRtl = i18n.dir() === 'rtl';
//   const navigate = useNavigate();

//   const [statusFilter, setStatusFilter] = useState('all');
//   const [search, setSearch] = useState('');
//   const [addDialogOpen, setAddDialogOpen] = useState(false);

//   const [searchResults, setSearchResults] = useState(null);
// const [searchLoading, setSearchLoading] = useState(false);
// const debounceRef = useRef(null);
// useEffect(() => {
//   if (debounceRef.current) clearTimeout(debounceRef.current);
//   if (!search.trim()) { setSearchResults(null); return; }
//   debounceRef.current = setTimeout(async () => {
//     setSearchLoading(true);
//     try {
//       const res = await api.get(`/admin/provider/search?query=${encodeURIComponent(search.trim())}`);
//       setSearchResults(res.data.data);
//     } catch {
//       setSearchResults([]);
//     } finally {
//       setSearchLoading(false);
//     }
//   }, 500);
//   return () => clearTimeout(debounceRef.current);
// }, [search]);

//   const enrichedProviders = useMemo(() => Providers || [], [Providers]);



//  const summary = useMemo(() => {
//   return {
//     totalProviders: enrichedProviders.length,
//     availableProviders: enrichedProviders.filter((p) => p.is_available && p.is_active).length,
//     unavailableProviders: enrichedProviders.filter((p) => !p.is_available ).length,
//     activeProviders: enrichedProviders.filter((p) =>  p.is_active).length,
//     inactiveProviders: enrichedProviders.filter((p) => !p.is_active).length,
//   };
// }, [enrichedProviders]);
// const filteredProviders = useMemo(() => {
//   const source = searchResults !== null ? searchResults : enrichedProviders;
//   return source.filter((Provider) => {
//     const matchesStatus =
//       statusFilter === 'all' ||
//       (statusFilter === 'Available' && Provider.is_available && Provider.is_active) ||
//       (statusFilter === 'Active' && Provider.is_active) ||
//       (statusFilter === 'Unavailable' && !Provider.is_available) ||
//       (statusFilter === 'Inactive' && !Provider.is_active);
//     return matchesStatus;
//   });
// }, [enrichedProviders, searchResults, statusFilter]);


//  // const [addLoading, setAddLoading] = useState(false); 

//   const [pageLoading, setPageLoading] = useState(true);
//   const [loadingAction, setLoadingAction] = useState(null); // { id, type }

// useEffect(() => {
//   async function loadData() {
//     setPageLoading(true);
//     await fetchProviders();
//     setPageLoading(false);
//   }
//   loadData();
// }, []);

// async function handleAddProviderSubmit(values) {
//     setLoadingAction({ id: 'new', type: 'add' });
//   //setAddLoading(true);
//   try {
//     await addProvider(values);
//         await fetchProviders(); // ← رفريش فوري

//     setAddDialogOpen(false);
//     notify({ severity: 'success', message: 'Provider added successfully' });
//   } catch (err) {
//     notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to add provider' });
//    }// finally {
//   //   setAddLoading(false);
//   // }
//   finally {
//     setLoadingAction(null);
//   }
// }
// async function handleActivate(Provider) {
//     setLoadingAction({ id: Provider.id, type: 'activate' });

//   try {
//     await activateProvider(Provider.id);
//     await fetchProviders();
//     notify({ severity: 'success', message: 'Provider activated successfully' });
//   } catch (err) {
//     notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to activate provider' });
//   }finally {
//     setLoadingAction(null);
//   }
// }

// async function handleDeactivate(Provider) {
//     setLoadingAction({ id: Provider.id, type: 'deactivate' });

//   try {
//     await deactivateProvider(Provider.id);
//     await fetchProviders();
//     notify({ severity: 'success', message: 'Provider deactivated successfully' });
//   } catch (err) {
//     notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to deactivate provider' });
//   }finally {
//     setLoadingAction(null);
//   }
// }

// async function handleDelete(Provider) {
//     setLoadingAction({ id: Provider.id, type: 'activate' });

//   try {
//     await deleteProvider(Provider.id);
//     await fetchProviders();
//     notify({ severity: 'success', message: 'Provider deleted successfully' });
//   } catch (err) {
//     notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to delete provider' });
//   }finally {
//     setLoadingAction(null);
//   }
// }
//   function handleViewProfile(Provider) {
//     navigate(`/Providers/${Provider.id}`, { state: { returnTo: '/Providers' } });
//   }

//   function getFilterLabel(status) {
//     if (status === 'all') {
//       return t('Providers.filters.all', { defaultValue: 'All' });
//     }

//     return t(`Providers.status.${status}`, {
//       defaultValue: status.charAt(0).toUpperCase() + status.slice(1),
//     });
//   }
// if (pageLoading) {
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
//         {t('Providers.loading', { defaultValue: 'Loading providers...' })}
//       </Typography>
//     </Box>
//   );
// }
//   return (
    
//     <Stack spacing={3.2} dir={isRtl ? 'rtl' : 'ltr'}>
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
//       {loadingAction.type === 'activate' && t('Providers.actions.activating', { defaultValue: 'Activating provider...' })}
//       {loadingAction.type === 'deactivate' && t('Providers.actions.deactivating', { defaultValue: 'Deactivating provider...' })}
//       {loadingAction.type === 'delete' && t('Providers.actions.deleting', { defaultValue: 'Deleting provider...' })}
//       {loadingAction.type === 'add' && t('Providers.actions.adding', { defaultValue: 'Adding provider...' })}
//     </Typography>
//   </Box>
// )}
//       <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
//         <Box sx={{ maxWidth: 780 }}>
//           <Typography sx={{ fontSize: { xs: '2.05rem', md: '2.55rem' }, lineHeight: 1.05, fontWeight: 900, letterSpacing: '-0.04em', color: '#0f172a' }}>
//             {t('Providers.title', { defaultValue: 'Providers Management' })}
//           </Typography>
//           <Typography sx={{ mt: 0.95, maxWidth: 700, fontSize: { xs: '0.98rem', md: '1.03rem' }, lineHeight: 1.6, color: '#64748b' }}>
//             {t('Providers.subtitle', {
//               defaultValue: 'Maintain Provider records with fast create, edit, delete, and profile navigation workflows.',
//             })}
//           </Typography>
//         </Box>

//         <Button
//           startIcon={<AddRoundedIcon sx={{ fontSize: 21 }} />}
//           variant="contained"
//           onClick={() => setAddDialogOpen(true)}
//           sx={{
//             minWidth: { xs: '100%', md: 170 },
//             height: 48,
//             borderRadius: 3,
//             px: 2.4,
//             textTransform: 'none',
//             fontSize: '0.95rem',
//             fontWeight: 800,
//             backgroundColor: '#2563eb',
//             boxShadow: '0 12px 26px rgba(37, 99, 235, 0.26)',
//             '&:hover': {
//               backgroundColor: '#1d4ed8',
//               boxShadow: '0 14px 28px rgba(37, 99, 235, 0.3)',
//             },
//           }}
//         >
//           {t('Providers.addProvider', { defaultValue: 'Add Provider' })}
//         </Button>
//       </Stack>

//       <Box sx={{ display: 'grid',   gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(5, minmax(0, 1fr))' },
//           gap: { xs: 2, md: 2.25 } }}>
//         <SummaryCard
//           label={t('Providers.summary.totalProviders', { defaultValue: 'Total Providers' })}
//           value={summary.totalProviders}
//           helper={t('Providers.summary.totalProvidersHelp', { defaultValue: 'Profiles in the system' })}
//           icon={<Groups2RoundedIcon fontSize="small" />}
//         />
//         <SummaryCard
//           label={t('Providers.summary.availableProviders', { defaultValue: 'Available' })}
//           value={summary.availableProviders}
//           helper={t('Providers.summary.availableProvidersHelp', { defaultValue: 'Ready for assignment' })}
//           icon={<CheckCircleOutlineRoundedIcon fontSize="small" />}
//           tone="positive"
//         />
//         <SummaryCard
//           label={t('Providers.summary.unavailableProviders', { defaultValue: 'Unavailable' })}
//           value={summary.unavailableProviders}
//           helper={t('Providers.summary.unavailableProvidersHelp', { defaultValue: 'Currently unavailable' })}
//           icon={<AccessTimeRoundedIcon fontSize="small" />}
//         />
//         <SummaryCard
//           label={t('Providers.card.activeProviders', { defaultValue: 'Active' })}
//           value={summary.activeProviders}
//           helper={t('Providers.card.activeHelp', { defaultValue: 'Unavailable right now' })}
//           icon={<PersonOffOutlinedIcon fontSize="small" />}
//         />
//         <SummaryCard
//   label={t('Providers.summary.inactiveProviders', { defaultValue: 'Inactive' })}
//   value={summary.inactiveProviders}
//   helper={t('Providers.summary.inactiveProvidersHelp', { defaultValue: 'Not activated yet' })}
//   icon={<PersonOffOutlinedIcon fontSize="small" />}
// />
//       </Box>

//       <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between" spacing={1.8} sx={{ pt: 0.5 }}>
//         <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ rowGap: 1 }}>
//           {STATUS_FILTERS.map((status) => {
//             const selected = statusFilter === status;
//             return (
//               <Chip
//                 key={status}
//                 label={getFilterLabel(status)}
//                 onClick={() => setStatusFilter(status)}
//                 clickable
//                 variant={selected ? 'filled' : 'outlined'}
//                 color={selected ? 'primary' : 'default'}
//                 sx={{
//                   height: 44,
//                   px: 0.5,
//                   borderRadius: 999,
//                   fontWeight: 800,
//                   fontSize: '0.92rem',
//                   borderColor: selected ? '#2563eb' : 'rgba(15, 23, 42, 0.1)',
//                   backgroundColor: selected ? '#2563eb' : '#ffffff',
//                   color: selected ? '#ffffff' : '#0f172a',
//                   '& .MuiChip-label': { px: 1.4 },
//                   boxShadow: selected ? '0 10px 20px rgba(37, 99, 235, 0.2)' : 'none',
//                   transition: 'transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease',
//                   '&:hover': {
//                     backgroundColor: selected ? '#1d4ed8' : '#f8fafc',
//                     transform: 'translateY(-1px)',
//                   },
//                 }}
//               />
//             );
//           })}
//         </Stack>

//         <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748b' }}>
//           {t('Providers.overview.showing', {
//             defaultValue: 'Showing {{visible}} of {{total}} Providers',
//             visible: filteredProviders.length,
//             total: summary.totalProviders,
//           })}
//         </Typography>
//       </Stack>

//       <Card
//         elevation={0}
//         sx={{
//           borderRadius: 4,
//           border: '1px solid rgba(15, 23, 42, 0.08)',
//           boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03), 0 18px 40px rgba(15, 23, 42, 0.05)',
//           overflow: 'hidden',
//           backgroundColor: '#ffffff',
//         }}
//       >
//         <CardContent sx={{ p: { xs: 2, md: 2.4 }, '&:last-child': { pb: { xs: 2, md: 2.4 } } }}>
//           <Stack spacing={2.1}>
//             <TextField
//               value={search}
//               onChange={(event) => setSearch(event.target.value)}
//               placeholder={t('Providers.searchPlaceholder', { defaultValue: 'Search Providers by name, phone, or experience...' })}
//               fullWidth
//               sx={{
//                 '& .MuiInputBase-root': {
//                   height: { xs: 54, md: 58 },
//                   borderRadius: 999,
//                   backgroundColor: '#f8fafc',
//                   fontSize: '0.98rem',
//                 },
//               }}
//        InputProps={{
//   startAdornment: (
//     <InputAdornment position="start">
//       {searchLoading
//         ? <CircularProgress size={20} sx={{ color: '#94a3b8' }} />
//         : <SearchRoundedIcon sx={{ fontSize: 22, color: '#94a3b8' }} />
//       }
//     </InputAdornment>
//   ),
// }}
//             />



// <Divider sx={{ borderColor: 'rgba(15, 23, 42, 0.08)' }} />
// {searchLoading && (
//   <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 1 }}>
//     <CircularProgress size={18} thickness={4} sx={{ color: '#2563eb' }} />
//     <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#64748b' }}>
//       {t('Providers.searching', { defaultValue: 'Searching...' })}
//     </Typography>
//   </Stack>
// )}
//             {filteredProviders.length > 0 ? (
//               <Stack spacing={1.8}>
//                 {filteredProviders.map((Provider) => (
// <ProviderCard
//   key={Provider.id}
//   Provider={Provider}
//   onViewProfile={handleViewProfile}
//   onActivate={handleActivate}
//   onDeactivate={handleDeactivate}
//   onDelete={handleDelete}
//   t={t}
// />           ))}
//               </Stack>
//             ) : (
//               <Box
//                 sx={{
//                   py: { xs: 5, md: 7 },
//                   px: 2,
//                   textAlign: 'center',
//                   borderRadius: 4,
//                   backgroundColor: '#f8fafc',
//                   border: '1px dashed rgba(15, 23, 42, 0.12)',
//                 }}
//               >
//                 <Typography sx={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
//                   {t('Providers.card.noProvidersTitle', { defaultValue: 'No Providers match the current filters' })}
//                 </Typography>
//                 <Typography sx={{ mt: 0.8, fontSize: '0.97rem', lineHeight: 1.6, color: '#64748b' }}>
//                   {t('Providers.card.noProvidersSubtitle', {
//                     defaultValue: 'Clear a filter, search a different term, or add a new Provider to continue.',
//                   })}
//                 </Typography>
//               </Box>
//             )}
//           </Stack>
//         </CardContent>
//       </Card>

// <ProviderDialog
//   open={addDialogOpen}
//   onClose={() => setAddDialogOpen(false)}
//   onSubmit={handleAddProviderSubmit}
//   loading={loadingAction?.type === 'add'}  // ← أضف هاد
// />    </Stack>
//   );
// }

// export default ProvidersPage;


// // عدّل هاد السطر
// import {useState, useEffect, useRef } from 'react';
// import {
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Chip,
//   Divider,
//   InputAdornment,
//   Pagination,
//   Stack,
//   TextField,
//   Typography,
// } from '@mui/material';
// import AddRoundedIcon from '@mui/icons-material/AddRounded';
// import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
// import StarRoundedIcon from '@mui/icons-material/StarRounded';
// import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
// import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
// import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
// import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
// import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
// import ProviderDialog from '../components/ProviderDialog';
// import { useAppContext } from '../context/AppContext';
// import { useTranslation } from 'react-i18next';
// import { useNavigate } from 'react-router-dom';
// import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
// import MailRoundedIcon from '@mui/icons-material/MailRounded';
// import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
// import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
// import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
// import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
// import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
// import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, CircularProgress ,Collapse} from '@mui/material';
// // عدّل هاد السطر
// import api from '../utils/axiosInstance';
// import DashboardMetricCard from '../components/dashboard/DashboardMetricCard';
// import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
// import { Skeleton } from '@mui/material'; // إذا مش موجودة
// import FilterListIcon from '@mui/icons-material/FilterList';
// const STATUS_FILTERS = ['all', 'Available', 'Unavailable', 'Active', 'Inactive'];

// // ─── Map UI status filter -> backend query params ─────────
// function getStatusParams(status) {
//   switch (status) {
//     case 'Available':
//       return {  is_available: 1 };
//     case 'Unavailable':
//       return { is_available: 0 };
//     case 'Active':
//       return { is_active: 1 };
//     case 'Inactive':
//       return { is_active: 0 };
//     default:
//       return {};
//   }
// }

// function parseExperienceYears(experience) {
//   const match = String(experience || '').match(/\d+/);
//   return Number(match?.[0] || 0);
// }

// function getInitials(name) {
//   return String(name || '')
//     .split(/\s+/)
//     .filter(Boolean)
//     .slice(0, 2)
//     .map((part) => part.slice(0, 1))
//     .join('')
//     .toUpperCase();
// }

// function buildEmail(name) {
//   const slug = String(name || '')
//     .toLowerCase()
//     .replace(/[^a-z0-9]+/g, '.')
//     .replace(/^\.+|\.+$/g, '');

//   return `${slug || 'Provider'}@mydashboard.app`;
// }

// // function getStatusMeta(status, t) {
// //   const normalized = status === 'busy' || status === 'offline' ? status : 'active';

// //   if (normalized === 'busy') {
// //     return {
// //       label: t('Providers.status.busy', { defaultValue: 'Busy' }),
// //       color: '#b45309',
// //       backgroundColor: 'rgba(245, 158, 11, 0.12)',
// //       icon: <AccessTimeRoundedIcon sx={{ fontSize: 16 }} />,
// //     };
// //   }

// //   if (normalized === 'offline') {
// //     return {
// //       label: t('Providers.status.offline', { defaultValue: 'Offline' }),
// //       color: '#ef4444',
// //       backgroundColor: 'rgba(239, 68, 68, 0.12)',
// //       icon: <FiberManualRecordRoundedIcon sx={{ fontSize: 12 }} />,
// //     };
// //   }

// //   return {
// //     label: t('Providers.status.active', { defaultValue: 'Active' }),
// //     color: '#15803d',
// //     backgroundColor: 'rgba(34, 197, 94, 0.12)',
// //     icon: <CheckCircleOutlineRoundedIcon sx={{ fontSize: 16 }} />,
// //   };
// // }

// // function getProviderDisplay(Provider, index, professionName, t) {
// //   const experienceYears = parseExperienceYears(Provider.experience);
// //   const balance = Number(Provider.balance || 0);
// //   const status = Provider.status || (experienceYears >= 7 ? 'active' : experienceYears >= 4 ? 'busy' : 'offline');
// //   const location = Provider.location || Provider_LOCATIONS[index % Provider_LOCATIONS.length];
// //   const rating = Math.min(5, 4.4 + Math.min(experienceYears, 9) * 0.07 + (balance > 10000 ? 0.12 : 0));
// //   const completedJobs = Math.max(14, experienceYears * 11 + Math.round(balance / 1200));
// //   const activeJobs = status === 'busy' ? Math.max(1, Math.min(4, Math.round(experienceYears / 2))) : status === 'active' ? 1 : 0;
// //   const reviewCount = 18 + experienceYears * 12 + index * 3;
// //   const joinedAt = Provider.createdAt ? new Date(Provider.createdAt) : null;
// //   const email = Provider.email || buildEmail(Provider.name);
// //   const phone = Provider.phone || t('Providers.table.phone', { defaultValue: 'Phone Number' });
// //   const service = professionName || Provider.service || Provider.professionName || t('Providers.card.serviceFallback');

// //   return {
// //     ...Provider,
// //     service,
// //     status,
// //     location,
// //     rating,
// //     reviewCount,
// //     completedJobs,
// //     activeJobs,
// //     revenue: balance,
// //     email,
// //     phone,
// //     joinedAt,
// //     initials: getInitials(Provider.name),
// //     experienceYears,
// //   };
// // }



// // function ProviderMetric({ label, value }) {
// //   return (
// //     <Box>
// //       <Typography sx={{ fontSize: '0.74rem', lineHeight: 1.2, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
// //         {label}
// //       </Typography>
// //       <Typography sx={{ mt: 0.35, fontSize: { xs: '0.95rem', md: '1.02rem' }, lineHeight: 1.2, color: '#0f172a', fontWeight: 800 }}>
// //         {value}
// //       </Typography>
// //     </Box>
// //   );
// // }


// function ProviderCard({ Provider, onViewProfile, onActivate, onDeactivate, onDelete, t }) {
//   const initials = `${Provider.first_name?.[0] || ''}${Provider.last_name?.[0] || ''}`.toUpperCase() || 'P';
//   const [menuAnchor, setMenuAnchor] = useState(null);

//   const availabilityMeta = Provider.is_available
//     ? { label: t('Providers.status.available', { defaultValue: 'Available' }), color: '#15803d', dot: '#22c55e' }
//     : { label: t('Providers.status.unavailable', { defaultValue: 'Unavailable' }), color: '#b91c1c', dot: '#ef4444' };

//   return (
//     <Card
//       elevation={0}
//       sx={{
//         borderRadius: '20px',
//         border: '1px solid rgba(226,232,240,0.8)',
//         background: '#ffffff',
//         boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
//         transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
//         '&:hover': {
//           transform: 'translateY(-4px)',
//           boxShadow: '0 20px 25px -5px rgba(0,0,0,0.05)',
//           borderColor: '#3b82f6',
//         },
//       }}
//     >
//       <CardContent sx={{ p: { xs: 2.5, sm: 3 }, '&:last-child': { pb: { xs: 2.5, sm: 3 } } }}>
//         <Stack direction={{ xs: 'column', lg: 'row' }} alignItems={{ xs: 'stretch', lg: 'center' }} justifyContent="space-between" spacing={3}>

//           {/* Avatar + الاسم والمهنة + الإتاحة */}
//          <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
  
//   {/* Avatar — بيعرض الصورة إذا موجودة */}
//   <Box sx={{ position: 'relative', flexShrink: 0 }}>
//     <Avatar
//       src={Provider.image_url || undefined}
//       sx={{
//         width: 60, height: 60,
//         borderRadius: '16px',
//         bgcolor: '#eff6ff', color: '#2563eb',
//         fontSize: '1.2rem', fontWeight: 700,
//         border: '2px solid #f8fafc',
//         boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
//       }}
//     >
//       {!Provider.image_url && initials}
//     </Avatar>

//     {/* نقطة is_active فوق الـ Avatar */}
//     <Box sx={{
//       position: 'absolute', bottom: 2, right: 2,
//       width: 12, height: 12, borderRadius: '50%',
//       backgroundColor: Provider.is_active ? '#22c55e' : '#94a3b8',
//       border: '2px solid #ffffff',
//     }} />
//   </Box>

//   <Box sx={{ minWidth: 0 }}>
//     <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
//       {Provider.first_name} {Provider.last_name}
//     </Typography>

//     {/* المهنة */}
//     <Box sx={{ display: 'inline-flex', alignItems: 'center', mt: 0.4, px: 1.2, py: 0.25, borderRadius: '8px', backgroundColor: '#f0fdf4', border: '1px solid #dcfce7' }}>
//       <Typography sx={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>
//         {Provider.service_category_name || t('Providers.card.serviceFallback', { defaultValue: 'Service Provider' })}
//       </Typography>
//     </Box>

//     {/* is_active + is_available في سطر */}
//     <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.6 }}>
      
//       {/* is_active */}
//       <Stack direction="row" spacing={0.5} alignItems="center">
//         <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: Provider.is_active ? '#22c55e' : '#94a3b8', flexShrink: 0 }} />
//         <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: Provider.is_active ? '#15803d' : '#64748b' }}>
//           {Provider.is_active
//             ? t('Providers.status.active', { defaultValue: 'Active' })
//             : t('Providers.status.inactive', { defaultValue: 'Inactive' })}
//         </Typography>
//       </Stack>

//       <Typography sx={{ fontSize: '0.75rem', color: '#cbd5e1' }}>·</Typography>

//       {/* is_available */}
//       <Stack direction="row" spacing={0.5} alignItems="center">
//         <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: availabilityMeta.dot, flexShrink: 0 }} />
//         <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: availabilityMeta.color }}>
//           {availabilityMeta.label}
//         </Typography>
//       </Stack>

//     </Stack>
//   </Box>
// </Stack>

//           {/* المعلومات الوسطى */}
//           <Stack
//             direction={{ xs: 'column', sm: 'row' }}
//             spacing={{ xs: 1.5, sm: 3 }}
//             alignItems={{ xs: 'flex-start', sm: 'center' }}
//             sx={{ flexWrap: 'wrap', flex: { lg: 2 }, justifyContent: { lg: 'center' } }}
//           >
//             <Stack direction="row" spacing={0.8} alignItems="center">
//               <LocalPhoneRoundedIcon sx={{ fontSize: 17, color: '#64748b' }} />
//               <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', fontFamily: 'monospace' }}>
//                 {Provider.phone}
//               </Typography>
//             </Stack>

//             {Provider.email && (
//               <Stack direction="row" spacing={0.8} alignItems="center" sx={{ minWidth: 0 }}>
//                 <MailRoundedIcon sx={{ fontSize: 17, color: '#64748b' }} />
//                 <Typography noWrap sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#334155', maxWidth: 200 }}>
//                   {Provider.email}
//                 </Typography>
//               </Stack>
//             )}

//             <Stack direction="row" spacing={0.8} alignItems="center">
//               <AccessTimeRoundedIcon sx={{ fontSize: 17, color: '#64748b' }} />
//               <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#334155' }}>
//                 {Provider.experience_years} {t('Providers.card.years', { defaultValue: 'yrs exp' })}
//               </Typography>
//             </Stack>

//             <Stack direction="row" spacing={0.8} alignItems="center">
//               <CalendarMonthRoundedIcon sx={{ fontSize: 17, color: '#64748b' }} />
//               <Typography sx={{ fontSize: '0.875rem', color: '#334155' }}>
//                 {Provider.created_at ? new Date(Provider.created_at).toISOString().slice(0, 10) : '—'}
//               </Typography>
//             </Stack>
//           </Stack>

//           {/* التقييم + الزر + القائمة */}
//           <Stack direction={{ xs: 'row', lg: 'column' }} spacing={1.5} alignItems={{ xs: 'center', lg: 'flex-end' }} sx={{ flexShrink: 0 }}>

//             {/* Rating */}
//             <Stack direction="row" spacing={0.5} alignItems="center"
//               sx={{ px: 1.4, py: 0.6, borderRadius: '10px', backgroundColor: '#fffbeb', border: '1px solid #fde68a' }}
//             >
//               <StarRoundedIcon sx={{ fontSize: 17, color: '#f59e0b' }} />
//               <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#92400e' }}>
//                 {Number(Provider.rating).toFixed(1)}
//               </Typography>
//               <Typography sx={{ fontSize: '0.78rem', color: '#a16207' }}>
//                 ({Provider.rating_count})
//               </Typography>
//             </Stack>

//             {/* الأزرار */}
//             <Stack direction="row" spacing={1} alignItems="center">
//               <Button
//                 variant="contained"
//                 onClick={() => onViewProfile(Provider)}
//                 sx={{
//                   height: 42,
//                   borderRadius: '12px',
//                   textTransform: 'none',
//                   fontSize: '0.875rem',
//                   fontWeight: 600,
//                   backgroundColor: '#1e293b',
//                   boxShadow: 'none',
//                   '&:hover': { backgroundColor: '#0f172a', boxShadow: '0 4px 12px rgba(15,23,42,0.15)' },
//                 }}
//               >
//                 {t('Providers.card.viewProfile', { defaultValue: 'View Profile' })}
//               </Button>

//               {/* قائمة الـ Actions */}
//               <IconButton
//                 size="small"
//                 onClick={(e) => setMenuAnchor(e.currentTarget)}
//                 sx={{
//                   width: 42, height: 42,
//                   borderRadius: '12px',
//                   border: '1px solid rgba(15,23,42,0.1)',
//                   color: '#64748b',
//                   '&:hover': { backgroundColor: '#f8fafc', borderColor: '#cbd5e1' },
//                 }}
//               >
//                 <MoreVertRoundedIcon fontSize="small" />
//               </IconButton>

//               <Menu
//                 anchorEl={menuAnchor}
//                 open={Boolean(menuAnchor)}
//                 onClose={() => setMenuAnchor(null)}
//                 transformOrigin={{ horizontal: 'right', vertical: 'top' }}
//                 anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
//                 PaperProps={{
//                   elevation: 0,
//                   sx: {
//                     borderRadius: '12px',
//                     border: '1px solid rgba(15,23,42,0.08)',
//                     boxShadow: '0 10px 30px rgba(15,23,42,0.1)',
//                     minWidth: 180,
//                     mt: 0.5,
//                   },
//                 }}
//               >
//                 {Provider.is_active ? (
//                   <MenuItem onClick={() => { setMenuAnchor(null); onDeactivate?.(Provider); }}
//                     sx={{ borderRadius: '8px', mx: 0.5, '&:hover': { backgroundColor: '#fff7ed' } }}
//                   >
//                     <ListItemIcon><BlockRoundedIcon fontSize="small" sx={{ color: '#f97316' }} /></ListItemIcon>
//                     <ListItemText primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600, color: '#c2410c' }}>
//                       {t('Providers.actions.deactivate', { defaultValue: 'Deactivate' })}
//                     </ListItemText>
//                   </MenuItem>
//                 ) : (
//                   <MenuItem onClick={() => { setMenuAnchor(null); onActivate?.(Provider); }}
//                     sx={{ borderRadius: '8px', mx: 0.5, '&:hover': { backgroundColor: '#f0fdf4' } }}
//                   >
//                     <ListItemIcon><CheckCircleRoundedIcon fontSize="small" sx={{ color: '#22c55e' }} /></ListItemIcon>
//                     <ListItemText primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600, color: '#15803d' }}>
//                       {t('Providers.actions.activate', { defaultValue: 'Activate' })}
//                     </ListItemText>
//                   </MenuItem>
//                 )}

//                 <MenuItem onClick={() => { setMenuAnchor(null); onDelete?.(Provider); }}
//                   sx={{ borderRadius: '8px', mx: 0.5, '&:hover': { backgroundColor: '#fff1f2' } }}
//                 >
//                   <ListItemIcon><DeleteOutlineRoundedIcon fontSize="small" sx={{ color: '#ef4444' }} /></ListItemIcon>
//                   <ListItemText primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600, color: '#dc2626' }}>
//                     {t('Providers.actions.delete', { defaultValue: 'Delete' })}
//                   </ListItemText>
//                 </MenuItem>
//               </Menu>
//             </Stack>
//           </Stack>

//         </Stack>
//       </CardContent>
//     </Card>
//   );
// }

// function ProvidersPage() {
//   const {  addProvider, notify, fetchProviders, activateProvider, deactivateProvider, deleteProvider } = useAppContext();
//   const { t, i18n } = useTranslation();
//   const isRtl = i18n.dir() === 'rtl';
//   const navigate = useNavigate();

//   const [statusFilter, setStatusFilter] = useState('all');
//   const [search, setSearch] = useState('');
//   const [addDialogOpen, setAddDialogOpen] = useState(false);

//   // ── List state (server-side filter + pagination) ──────────
//   const [providersList, setProvidersList] = useState([]);
//   const [page, setPage] = useState(1);
//   const [lastPage, setLastPage] = useState(1);
//   const [total, setTotal] = useState(0);

//   const [listLoading, setListLoading] = useState(false);
//   const [searchLoading, setSearchLoading] = useState(false);
//   const [pageLoading, setPageLoading] = useState(true);
//   const [loadingAction, setLoadingAction] = useState(null); // { id, type }

//   const debounceRef = useRef(null);
//   const isFirstRun = useRef(true);
//   const firstLoadDoneRef = useRef(false);

//   // ── Summary counts (independent of pagination/filter) ─────
//   const [summary, setSummary] = useState({
//     totalProviders: 0,
//     availableProviders: 0,
//     unavailableProviders: 0,
//     activeProviders: 0,
//     inactiveProviders: 0,
//   });
// const [analyticsPeriod, setAnalyticsPeriod] = useState('this_month');
// const [customNum, setCustomNum]             = useState('');
// const [customUnit, setCustomUnit]           = useState('d');
// const [analytics, setAnalytics]             = useState(null);
// const [analyticsLoading, setAnalyticsLoading] = useState(false);
// const [analyticsOpen, setAnalyticsOpen] = useState(false);
// const PRESET_PERIODS = [
//   'today','yesterday','this_week','last_week',
//   'this_month','last_month','this_year','last_year',
// ];
// const UNITS = ['d', 'w', 'm', 'y'];
 
// async function fetchAnalytics(period) {
//   try {
//     setAnalyticsLoading(true);
//     const res = await api.get('/admin/analytics/providers', { params: { period } });
//     setAnalytics(res.data.data);
//   } catch (err) {
//     console.error('Failed to fetch provider analytics:', err);
//   } finally {
//     setAnalyticsLoading(false);
//   }
// }

// useEffect(() => {
//   fetchAnalytics(analyticsPeriod);
// }, [analyticsPeriod]);
//   // ── Fetch the (paginated, filtered) providers list ─────────
//   async function fetchProvidersList({ pageNum = page, status = statusFilter, query = search } = {}) {
//     const hasQuery = query.trim().length > 0;

//     if (hasQuery) setSearchLoading(true);
//     else setListLoading(true);

//     try {
//       const params = { page: pageNum, ...getStatusParams(status) };

//       let response;
//       if (hasQuery) {
//         response = await api.get('/admin/provider/search', {
//           params: { query: query.trim(), ...params },
//         });
//       } else {
//         response = await api.get('/admin/provider/all-providers', { params });
//       }

//       const payload = response.data.data;
//       const list = Array.isArray(payload) ? payload : payload.data ?? [];

//       setProvidersList(list);

//       if (!Array.isArray(payload)) {
//         setTotal(payload.total ?? list.length);
//         setLastPage(payload.last_page ?? 1);
//         setPage(payload.current_page ?? pageNum);
//       } else {
//         setTotal(list.length);
//         setLastPage(1);
//         setPage(1);
//       }
//     } catch (err) {
//       console.error('Failed to fetch providers:', err);
//       setProvidersList([]);
//     } finally {
//       setListLoading(false);
//       setSearchLoading(false);
//       if (!firstLoadDoneRef.current) {
//         firstLoadDoneRef.current = true;
//         setPageLoading(false);
//       }
//     }
//   }

//   // Initial summary load
  

//   // Reset to page 1 whenever the search text or status filter changes (skip on first mount)
//   useEffect(() => {
//     if (isFirstRun.current) return;
//     setPage(1);
//   }, [search, statusFilter]);

//   // Fetch the list on page / statusFilter / search change (debounced when typing)
//   useEffect(() => {
//     if (debounceRef.current) clearTimeout(debounceRef.current);

//     const delay = search.trim() ? 500 : 0;
//     debounceRef.current = setTimeout(() => {
//       fetchProvidersList({ pageNum: page, status: statusFilter, query: search });
//       isFirstRun.current = false;
//     }, delay);

//     return () => clearTimeout(debounceRef.current);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [page, statusFilter, search]);

// //   useEffect(() => {
// //   if (pageLoading) return;

// //   const interval = setInterval(() => {
// //     fetchProvidersList({
// //       pageNum: page,
// //       status: statusFilter,
// //       query: search,
// //     });

// //     fetchSummary();
// //   }, 60000);

// //   return () => clearInterval(interval);
// //   // eslint-disable-next-line react-hooks/exhaustive-deps
// // }, [page, statusFilter, search, pageLoading]);

//  async function refreshAfterAction() {
//   await Promise.all([
//     fetchProvidersList({ pageNum: page, status: statusFilter, query: search }),
//     fetchProviders(),
//     fetchAnalytics(analyticsPeriod),
//   ]);
// }

//   async function handleAddProviderSubmit(values) {
//     setLoadingAction({ id: 'new', type: 'add' });
//     try {
//       await addProvider(values);
//       await refreshAfterAction();
//       setAddDialogOpen(false);
//       notify({ severity: 'success', message: 'Provider added successfully' });
//     } catch (err) {
//       notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to add provider' });
//     } finally {
//       setLoadingAction(null);
//     }
//   }

//   async function handleActivate(Provider) {
//     setLoadingAction({ id: Provider.id, type: 'activate' });
//     try {
//       await activateProvider(Provider.id);
//       await refreshAfterAction();
//       notify({ severity: 'success', message: 'Provider activated successfully' });
//     } catch (err) {
//       notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to activate provider' });
//     } finally {
//       setLoadingAction(null);
//     }
//   }

//   async function handleDeactivate(Provider) {
//     setLoadingAction({ id: Provider.id, type: 'deactivate' });
//     try {
//       await deactivateProvider(Provider.id);
//       await refreshAfterAction();
//       notify({ severity: 'success', message: 'Provider deactivated successfully' });
//     } catch (err) {
//       notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to deactivate provider' });
//     } finally {
//       setLoadingAction(null);
//     }
//   }

//   async function handleDelete(Provider) {
//     setLoadingAction({ id: Provider.id, type: 'delete' });
//     try {
//       await deleteProvider(Provider.id);

//       // If this was the last item on the page (and not page 1), step back a page
//       const willBeEmpty = providersList.length === 1 && page > 1;
//       if (willBeEmpty) {
//         setPage(page - 1); // triggers refetch via effect
//         await fetchProviders();
//       } else {
//         await refreshAfterAction();
//       }

//       notify({ severity: 'success', message: 'Provider deleted successfully' });
//     } catch (err) {
//       notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to delete provider' });
//     } finally {
//       setLoadingAction(null);
//     }
//   }

//   function handleViewProfile(Provider) {
//     navigate(`/Providers/${Provider.id}`, { state: { returnTo: '/Providers' } });
//   }

//   function getFilterLabel(status) {
//     if (status === 'all') {
//       return t('Providers.filters.all', { defaultValue: 'All' });
//     }

//     return t(`Providers.status.${status}`, {
//       defaultValue: status.charAt(0).toUpperCase() + status.slice(1),
//     });
//   }
// if (pageLoading) {
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
//         {t('Providers.loading', { defaultValue: 'Loading providers...' })}
//       </Typography>
//     </Box>
//   );
// }
//   return (
    
//     <Stack spacing={3.2} dir={isRtl ? 'rtl' : 'ltr'}>
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
//       {loadingAction.type === 'activate' && t('Providers.actions.activating', { defaultValue: 'Activating provider...' })}
//       {loadingAction.type === 'deactivate' && t('Providers.actions.deactivating', { defaultValue: 'Deactivating provider...' })}
//       {loadingAction.type === 'delete' && t('Providers.actions.deleting', { defaultValue: 'Deleting provider...' })}
//       {loadingAction.type === 'add' && t('Providers.actions.adding', { defaultValue: 'Adding provider...' })}
//     </Typography>
//   </Box>
// )}
//       <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
//         <Box sx={{ maxWidth: 780 }}>
//           <Typography sx={{ fontSize: { xs: '2.05rem', md: '2.55rem' }, lineHeight: 1.05, fontWeight: 900, letterSpacing: '-0.04em', color: '#0f172a' }}>
//             {t('Providers.title', { defaultValue: 'Providers Management' })}
//           </Typography>
//           <Typography sx={{ mt: 0.95, maxWidth: 700, fontSize: { xs: '0.98rem', md: '1.03rem' }, lineHeight: 1.6, color: '#64748b' }}>
//             {t('Providers.subtitle', {
//               defaultValue: 'Maintain Provider records with fast create, edit, delete, and profile navigation workflows.',
//             })}
//           </Typography>
//         </Box>

//         <Button
//           startIcon={<AddRoundedIcon sx={{ fontSize: 21 }} />}
//           variant="contained"
//           onClick={() => setAddDialogOpen(true)}
//           sx={{
//             minWidth: { xs: '100%', md: 170 },
//             height: 48,
//             borderRadius: 3,
//             px: 2.4,
//             textTransform: 'none',
//             fontSize: '0.95rem',
//             fontWeight: 800,
//             backgroundColor: '#2563eb',
//             boxShadow: '0 12px 26px rgba(37, 99, 235, 0.26)',
//             '&:hover': {
//               backgroundColor: '#1d4ed8',
//               boxShadow: '0 14px 28px rgba(37, 99, 235, 0.3)',
//             },
//           }}
//         >
//           {t('Providers.addProvider', { defaultValue: 'Add Provider' })}
//         </Button>
//       </Stack>
// {/* ── Analytics ─────────────────────────────────────────── */}

// <Card
//   elevation={0}
//   sx={{
//     borderRadius: 2.5,
//     border: '1px solid rgba(148,163,184,0.22)',
//     boxShadow: '0 18px 45px rgba(15,23,42,0.08)',
//     background:
//       'linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.95) 100%)',
//     overflow: 'hidden',
//   }}
// >
//   <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
//     {/* Header + Toggle */}
//     <Stack
//       direction={{ xs: 'column', sm: 'row' }}
//       alignItems={{ xs: 'flex-start', sm: 'center' }}
//       justifyContent="space-between"
//       spacing={2}
//       sx={{ mb: analyticsOpen ? 3 : 0 }}
//     >
//       <Stack
//   direction="row"
//   spacing={2}
//   alignItems="center" // يضمن محاذاة الأيقونة والنصوص عمودياً في المنتصف تماماً
//   sx={{ minHeight: 52 }}
// >
//   <Box
//     sx={{
//       width: 48, // تقليل الحجم قليلاً (من 52 إلى 48) ليتناسب بصرياً ويرتفع عن الحافة السفلية
//       height: 48,
//       borderRadius: 2,
//       background:
//         'linear-gradient(135deg, rgba(37,99,235,0.14), rgba(6,182,212,0.12))',
//       display: 'grid',
//       placeItems: 'center',
//       color: '#2563eb',
//       boxShadow: 'inset 0 0 0 1px rgba(37,99,235,0.12)',
//       alignSelf: 'center', // تأكيد رفع الدائرة ومحاذاتها بالمنتصف
//     }}
//   >
//     <TrendingUpRoundedIcon />
//   </Box>

//   <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
//     <Typography
//       variant="h6"
//       sx={{
//         fontWeight: 900,
//         color: '#0f172a',
//         letterSpacing: '-0.02em',
//         lineHeight: 1.2,
//         mb: 0.5, 
//       }}
//     >
//       Providers Analytics
//     </Typography>

//     {analytics?.meta && (
//       <Typography
//         variant="caption"
//         sx={{
//           display: 'inline-flex',
//           alignItems: 'center',
//           px: 1.1,
//           py: 0.35,
//           borderRadius: 2,
//           bgcolor: 'rgba(15,23,42,0.04)',
//           color: '#64748b',
//           fontFamily: 'monospace',
//           fontWeight: 700,
//           alignSelf: 'flex-start',
//         }}
//       >
//         📅 {analytics.meta.display_message} ·{' '}
//         {analytics.meta.from_date?.slice(0, 10)} →{' '}
//         {analytics.meta.to_date?.slice(0, 10)}
//       </Typography>
//     )}
//   </Box>
// </Stack>

//       <Button
//         startIcon={<FilterListIcon />}
//         variant={analyticsOpen ? 'contained' : 'outlined'}
//         onClick={() => setAnalyticsOpen((v) => !v)}
//         size="medium"
//         sx={{
//           borderRadius: 2,
//           fontWeight: 800,
//           textTransform: 'none',
//           px: 2.4,
//           height: 42,
//           boxShadow: analyticsOpen
//             ? '0 10px 22px rgba(37,99,235,0.22)'
//             : 'none',
//         }}
//       >
//         {analyticsPeriod
//           .replace(/_/g, ' ')
//           .replace(/\b\w/g, (c) => c.toUpperCase())}
//       </Button>
//     </Stack>

//     {/* Filter Panel */}
//     <Collapse in={analyticsOpen}>
//       <Box
//         sx={{
//           p: { xs: 2, md: 3 },
//           borderRadius: 2.5,
//           bgcolor: 'rgba(248,250,252,0.9)',
//           border: '1px solid rgba(148,163,184,0.22)',
//           mb: 3,
//           boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.8)',
//         }}
//       >
//         <Stack spacing={2.2}>
//           <Typography
//             variant="caption"
//             sx={{
//               fontWeight: 900,
//               color: '#64748b',
//               textTransform: 'uppercase',
//               letterSpacing: '0.08em',
//             }}
//           >
//             Select Period
//           </Typography>

//           <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ rowGap: 1 }}>
//             {PRESET_PERIODS.map((p) => {
//               const selected = analyticsPeriod === p;
//               const label = p
//                 .replace(/_/g, ' ')
//                 .replace(/\b\w/g, (c) => c.toUpperCase());

//               return (
//                 <Chip
//                   key={p}
//                   label={label}
//                   clickable
//                   onClick={() => {
//                     setAnalyticsPeriod(p);
//                     setCustomNum('');
//                   }}
//                   size="small"
//                   sx={{
//                     height: 36,
//                     borderRadius: 2,
//                     fontWeight: 800,
//                     fontSize: '0.8rem',
//                     border: '1px solid',
//                     borderColor: selected
//                       ? '#2563eb'
//                       : 'rgba(148,163,184,0.35)',
//                     bgcolor: selected ? '#2563eb' : '#fff',
//                     color: selected ? '#fff' : '#334155',
//                     boxShadow: selected
//                       ? '0 8px 18px rgba(37,99,235,0.24)'
//                       : '0 2px 8px rgba(15,23,42,0.04)',
//                     transition: 'all 180ms ease',
//                     '& .MuiChip-label': { px: 1.5 },
//                     '&:hover': {
//                       bgcolor: selected ? '#1d4ed8' : '#f1f5f9',
//                       transform: 'translateY(-1px)',
//                     },
//                   }}
//                 />
//               );
//             })}
//           </Stack>

//           <Divider sx={{ borderColor: 'rgba(148,163,184,0.22)' }} />

//           <Stack
//             direction={{ xs: 'column', sm: 'row' }}
//             spacing={1}
//             alignItems={{ xs: 'stretch', sm: 'center' }}
//           >
//             <TextField
//               value={customNum}
//               onChange={(e) => {
//                 const val = e.target.value;
//                 if (val === '' || /^\d+$/.test(val)) setCustomNum(val);
//               }}
//               placeholder="4"
//               size="small"
//               sx={{
//                 width: { xs: '100%', sm: 90 },
//                 '& .MuiOutlinedInput-root': {
//                   borderRadius: 2,
//                   fontSize: '0.9rem',
//                   fontFamily: 'monospace',
//                   fontWeight: 800,
//                   bgcolor: '#fff',
//                 },
//               }}
//             />

//             <Stack direction="row" spacing={1}>
//               {UNITS.map((u) => (
//                 <Box
//                   key={u}
//                   onClick={() => setCustomUnit(u)}
//                   sx={{
//                     height: 40,
//                     width: 44,
//                     display: 'inline-flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     borderRadius: 2,
//                     border: `1px solid ${
//                       customUnit === u
//                         ? '#2563eb'
//                         : 'rgba(148,163,184,0.35)'
//                     }`,
//                     bgcolor: customUnit === u ? '#eff6ff' : '#fff',
//                     color: customUnit === u ? '#2563eb' : '#475569',
//                     fontWeight: 900,
//                     fontSize: '0.85rem',
//                     cursor: 'pointer',
//                     fontFamily: 'monospace',
//                     transition: 'all 160ms ease',
//                     '&:hover': {
//                       borderColor: '#2563eb',
//                       color: '#2563eb',
//                       transform: 'translateY(-1px)',
//                     },
//                   }}
//                 >
//                   {u}
//                 </Box>
//               ))}
//             </Stack>

//             <Button
//               onClick={() => {
//                 if (!customNum) return;
//                 setAnalyticsPeriod(`${customNum}${customUnit}`);
//               }}
//               variant="contained"
//               size="small"
//               disabled={!customNum}
//               sx={{
//                 borderRadius: 2,
//                 fontWeight: 800,
//                 textTransform: 'none',
//                 height: 40,
//                 px: 3,
//                 boxShadow: '0 8px 18px rgba(37,99,235,0.22)',
//               }}
//             >
//               Apply
//             </Button>
//           </Stack>
//         </Stack>
//       </Box>
//     </Collapse>

//     {/* Analytics Cards */}
//     <Box
//       sx={{
//         display: 'grid',
//         gridTemplateColumns: {
//           xs: '1fr',
//           sm: 'repeat(2, 1fr)',
//           md: 'repeat(3, 1fr)',
//           xl: 'repeat(6, 1fr)',
//         },
//         gap: 2,
//       }}
//     >
//       {[
//         {
//           title: 'Total Providers',
//           value: analytics?.total_providers ?? '—',
//           caption: 'All registered',
//           icon: <Groups2RoundedIcon />,
//         },
//         {
//           title: 'New Providers',
//           value: analytics?.new_providers?.count ?? '—',
//           caption:
//             analytics?.new_providers?.growth != null
//               ? `${analytics.new_providers.growth > 0 ? '+' : ''}${analytics.new_providers.growth}% growth`
//               : 'vs previous period',
//           captionTone:
//             (analytics?.new_providers?.growth ?? 0) >= 0
//               ? 'positive'
//               : 'warning',
//           icon: <TrendingUpRoundedIcon />,
//         },
//         {
//           title: 'Available',
//           value: analytics?.available_providers ?? '—',
//           caption: `${analytics?.available_providers_rate ?? 0}% rate`,
//           captionTone: 'positive',
//           icon: <CheckCircleOutlineRoundedIcon />,
//         },
//         {
//           title: 'Unavailable',
//           value: analytics?.unavailable_providers ?? '—',
//           caption: 'Currently offline',
//           icon: <AccessTimeRoundedIcon />,
//         },
//         {
//           title: 'Active',
//           value: analytics?.active_providers ?? '—',
//           caption: 'Account active',
//           captionTone: 'positive',
//           icon: <CheckCircleOutlineRoundedIcon />,
//         },
//         {
//           title: 'Inactive',
//           value: analytics?.inactive_providers ?? '—',
//           caption: 'Not activated',
//           captionTone: 'warning',
//           icon: <PersonOffOutlinedIcon />,
//         },
//       ].map((card) =>
//         analyticsLoading ? (
//           <Skeleton
//             key={card.title}
//             variant="rounded"
//             height={132}
//             sx={{ borderRadius: 2 }}
//           />
//         ) : (
//           <DashboardMetricCard key={card.title} {...card} />
//         )
//       )}
//     </Box>
//   </CardContent>
// </Card>
    

//       <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between" spacing={1.8} sx={{ pt: 0.5 }}>
//         <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ rowGap: 1 }}>
//           {STATUS_FILTERS.map((status) => {
//             const selected = statusFilter === status;
//             return (
//               <Chip
//                 key={status}
//                 label={getFilterLabel(status)}
//                 onClick={() => setStatusFilter(status)}
//                 clickable
//                 variant={selected ? 'filled' : 'outlined'}
//                 color={selected ? 'primary' : 'default'}
//                 sx={{
//                   height: 44,
//                   px: 0.5,
//                   borderRadius: 999,
//                   fontWeight: 800,
//                   fontSize: '0.92rem',
//                   borderColor: selected ? '#2563eb' : 'rgba(15, 23, 42, 0.1)',
//                   backgroundColor: selected ? '#2563eb' : '#ffffff',
//                   color: selected ? '#ffffff' : '#0f172a',
//                   '& .MuiChip-label': { px: 1.4 },
//                   boxShadow: selected ? '0 10px 20px rgba(37, 99, 235, 0.2)' : 'none',
//                   transition: 'transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease',
//                   '&:hover': {
//                     backgroundColor: selected ? '#1d4ed8' : '#f8fafc',
//                     transform: 'translateY(-1px)',
//                   },
//                 }}
//               />
//             );
//           })}
//         </Stack>

//         <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748b' }}>
//           {t('Providers.overview.showing', {
//             defaultValue: 'Showing {{visible}} of {{total}} Providers',
//             visible: providersList.length,
//             total,
//           })}
//         </Typography>
//       </Stack>

//       <Card
//         elevation={0}
//         sx={{
//           borderRadius: 4,
//           border: '1px solid rgba(15, 23, 42, 0.08)',
//           boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03), 0 18px 40px rgba(15, 23, 42, 0.05)',
//           overflow: 'hidden',
//           backgroundColor: '#ffffff',
//         }}
//       >
//         <CardContent sx={{ p: { xs: 2, md: 2.4 }, '&:last-child': { pb: { xs: 2, md: 2.4 } } }}>
//           <Stack spacing={2.1}>
//             <TextField
//               value={search}
//               onChange={(event) => setSearch(event.target.value)}
//               placeholder={t('Providers.searchPlaceholder', { defaultValue: 'Search Providers by name, phone, or experience...' })}
//               fullWidth
//               sx={{
//                 '& .MuiInputBase-root': {
//                   height: { xs: 54, md: 58 },
//                   borderRadius: 999,
//                   backgroundColor: '#f8fafc',
//                   fontSize: '0.98rem',
//                 },
//               }}
//        InputProps={{
//   startAdornment: (
//     <InputAdornment position="start">
//       {searchLoading
//         ? <CircularProgress size={20} sx={{ color: '#94a3b8' }} />
//         : <SearchRoundedIcon sx={{ fontSize: 22, color: '#94a3b8' }} />
//       }
//     </InputAdornment>
//   ),
// }}
//             />



// <Divider sx={{ borderColor: 'rgba(15, 23, 42, 0.08)' }} />
// {/* {searchLoading && (
//   <Stack direction="row" spacing={1.5} alignItems="center" sx={{ px: 1 }}>
//     <CircularProgress size={18} thickness={4} sx={{ color: '#2563eb' }} />
//     <Typography sx={{ fontSize: '0.88rem', fontWeight: 600, color: '#64748b' }}>
//       {t('Providers.searching', { defaultValue: 'Searching...' })}
//     </Typography>
//   </Stack>
// )} */}
//            {(listLoading || searchLoading) ? (
//   <Box
//     sx={{
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//       justifyContent: 'center',
//       py: 8,
//       gap: 2,
//     }}
//   >
//     <CircularProgress size={48} thickness={4} sx={{ color: '#2563eb' }} />
//     <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748b' }}>
//       {t('Providers.loading', { defaultValue: 'Loading...' })}
//     </Typography>
//   </Box>
// ) : providersList.length > 0 ? (
//               <Stack spacing={1.8}>
//                 {providersList.map((Provider) => (
// <ProviderCard
//   key={Provider.id}
//   Provider={Provider}
//   onViewProfile={handleViewProfile}
//   onActivate={handleActivate}
//   onDeactivate={handleDeactivate}
//   onDelete={handleDelete}
//   t={t}
// />           ))}
//               </Stack>
//             ) : (
//               <Box
//                 sx={{
//                   py: { xs: 5, md: 7 },
//                   px: 2,
//                   textAlign: 'center',
//                   borderRadius: 4,
//                   backgroundColor: '#f8fafc',
//                   border: '1px dashed rgba(15, 23, 42, 0.12)',
//                 }}
//               >
//                 <Typography sx={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
//                   {t('Providers.card.noProvidersTitle', { defaultValue: 'No Providers match the current filters' })}
//                 </Typography>
//                 <Typography sx={{ mt: 0.8, fontSize: '0.97rem', lineHeight: 1.6, color: '#64748b' }}>
//                   {t('Providers.card.noProvidersSubtitle', {
//                     defaultValue: 'Clear a filter, search a different term, or add a new Provider to continue.',
//                   })}
//                 </Typography>
//               </Box>
//             )}

//             {/* Pagination footer */}
//             {!listLoading && total > 0 && lastPage > 1 && (
//               <Stack direction="row" justifyContent="center" sx={{ pt: 1 }}>
//                 <Pagination
//                   count={lastPage}
//                   page={page}
//                   onChange={(_, value) => setPage(value)}
//                   color="primary"
//                   shape="rounded"
//                 />
//               </Stack>
//             )}
//           </Stack>
//         </CardContent>
//       </Card>

// <ProviderDialog
//   open={addDialogOpen}
//   onClose={() => setAddDialogOpen(false)}
//   onSubmit={handleAddProviderSubmit}
//   loading={loadingAction?.type === 'add'}  // ← أضف هاد
// />    </Stack>
//   );
// }

// export default ProvidersPage;

import {useState, useEffect, useRef } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  InputAdornment,
  Pagination,
  Stack,
  TextField,
  Typography,
  useTheme,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import ProviderDialog from '../components/ProviderDialog';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import LocalPhoneRoundedIcon from '@mui/icons-material/LocalPhoneRounded';
import MailRoundedIcon from '@mui/icons-material/MailRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { IconButton, Menu, MenuItem, ListItemIcon, ListItemText, CircularProgress, Collapse } from '@mui/material';
import api from '../utils/axiosInstance';
import DashboardMetricCard from '../components/dashboard/DashboardMetricCard';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { Skeleton } from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import { alpha } from '@mui/material/styles';

const STATUS_FILTERS = ['all', 'Available', 'Unavailable', 'Active', 'Inactive'];

function getStatusParams(status) {
  switch (status) {
    case 'Available':   return { is_available: 1 };
    case 'Unavailable': return { is_available: 0 };
    case 'Active':      return { is_active: 1 };
    case 'Inactive':    return { is_active: 0 };
    default:            return {};
  }
}

function getInitials(name) {
  return String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.slice(0, 1))
    .join('')
    .toUpperCase();
}

// ─── ProviderCard ─────────────────────────────────────────────────────────────
function ProviderCard({ Provider, onViewProfile, onActivate, onDeactivate, onDelete, t }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const initials = `${Provider.first_name?.[0] || ''}${Provider.last_name?.[0] || ''}`.toUpperCase() || 'P';
  const [menuAnchor, setMenuAnchor] = useState(null);

  const availabilityMeta = Provider.is_available
    ? { label: t('Providers.status.available',   { defaultValue: 'Available' }),   color: '#15803d', dot: '#22c55e' }
    : { label: t('Providers.status.unavailable', { defaultValue: 'Unavailable' }), color: '#b91c1c', dot: '#ef4444' };

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: '20px',
        border: '1px solid',
        borderColor: isDark ? alpha('#94a3b8', 0.15) : 'rgba(226,232,240,0.8)',
        bgcolor: 'background.paper',
        boxShadow: isDark
          ? '0 1px 3px rgba(0,0,0,0.3)'
          : '0 1px 3px rgba(0,0,0,0.05)',
        transition: 'all 0.25s cubic-bezier(0.4,0,0.2,1)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: isDark
            ? '0 20px 25px -5px rgba(0,0,0,0.35)'
            : '0 20px 25px -5px rgba(0,0,0,0.05)',
          borderColor: '#3b82f6',
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, sm: 3 }, '&:last-child': { pb: { xs: 2.5, sm: 3 } } }}>
        <Stack direction={{ xs: 'column', lg: 'row' }} alignItems={{ xs: 'stretch', lg: 'center' }} justifyContent="space-between" spacing={3}>

          {/* Avatar + Name */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ minWidth: 0, flex: 1 }}>
            <Box sx={{ position: 'relative', flexShrink: 0 }}>
              <Avatar
                src={Provider.image_url || undefined}
                sx={{
                  width: 60, height: 60,
                  borderRadius: '16px',
                  bgcolor: isDark ? alpha('#2563eb', 0.2) : '#eff6ff',
                  color: '#2563eb',
                  fontSize: '1.2rem', fontWeight: 700,
                  border: '2px solid',
                  borderColor: 'divider',
                  boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                }}
              >
                {!Provider.image_url && initials}
              </Avatar>
              <Box sx={{
                position: 'absolute', bottom: 2, right: 2,
                width: 12, height: 12, borderRadius: '50%',
                backgroundColor: Provider.is_active ? '#22c55e' : '#94a3b8',
                border: '2px solid',
                borderColor: 'background.paper',
              }} />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: 'text.primary', lineHeight: 1.3, letterSpacing: '-0.01em' }}>
                {Provider.first_name} {Provider.last_name}
              </Typography>

              <Box sx={{
                display: 'inline-flex', alignItems: 'center', mt: 0.4,
                px: 1.2, py: 0.25, borderRadius: '8px',
                backgroundColor: isDark ? alpha('#16a34a', 0.15) : '#f0fdf4',
                border: '1px solid',
                borderColor: isDark ? alpha('#16a34a', 0.3) : '#dcfce7',
              }}>
                <Typography sx={{ fontSize: '0.78rem', color: '#16a34a', fontWeight: 600 }}>
                  {Provider.service_category_name || t('Providers.card.serviceFallback', { defaultValue: 'Service Provider' })}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.6 }}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: Provider.is_active ? '#22c55e' : '#94a3b8', flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: Provider.is_active ? '#15803d' : 'text.secondary' }}>
                    {Provider.is_active
                      ? t('Providers.status.active',   { defaultValue: 'Active' })
                      : t('Providers.status.inactive', { defaultValue: 'Inactive' })}
                  </Typography>
                </Stack>

                <Typography sx={{ fontSize: '0.75rem', color: 'text.disabled' }}>·</Typography>

                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Box sx={{ width: 7, height: 7, borderRadius: '50%', backgroundColor: availabilityMeta.dot, flexShrink: 0 }} />
                  <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: availabilityMeta.color }}>
                    {availabilityMeta.label}
                  </Typography>
                </Stack>
              </Stack>
            </Box>
          </Stack>

          {/* Info row */}
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={{ xs: 1.5, sm: 3 }}
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            sx={{ flexWrap: 'wrap', flex: { lg: 2 }, justifyContent: { lg: 'center' } }}
          >
            <Stack direction="row" spacing={0.8} alignItems="center">
              <LocalPhoneRoundedIcon sx={{ fontSize: 17, color: 'text.secondary' }} />
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'text.primary', fontFamily: 'monospace' }}>
                {Provider.phone}
              </Typography>
            </Stack>

            {Provider.email && (
              <Stack direction="row" spacing={0.8} alignItems="center" sx={{ minWidth: 0 }}>
                <MailRoundedIcon sx={{ fontSize: 17, color: 'text.secondary' }} />
                <Typography noWrap sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'text.primary', maxWidth: 200 }}>
                  {Provider.email}
                </Typography>
              </Stack>
            )}

            <Stack direction="row" spacing={0.8} alignItems="center">
              <AccessTimeRoundedIcon sx={{ fontSize: 17, color: 'text.secondary' }} />
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary' }}>
                {Provider.experience_years} {t('Providers.card.years', { defaultValue: 'yrs exp' })}
              </Typography>
            </Stack>

            <Stack direction="row" spacing={0.8} alignItems="center">
              <CalendarMonthRoundedIcon sx={{ fontSize: 17, color: 'text.secondary' }} />
              <Typography sx={{ fontSize: '0.875rem', color: 'text.primary' }}>
                {Provider.created_at ? new Date(Provider.created_at).toISOString().slice(0, 10) : '—'}
              </Typography>
            </Stack>
          </Stack>

          {/* Rating + Actions */}
          <Stack direction={{ xs: 'row', lg: 'column' }} spacing={1.5} alignItems={{ xs: 'center', lg: 'flex-end' }} sx={{ flexShrink: 0 }}>
            <Stack direction="row" spacing={0.5} alignItems="center"
              sx={{
                px: 1.4, py: 0.6, borderRadius: '10px',
                backgroundColor: isDark ? alpha('#f59e0b', 0.12) : '#fffbeb',
                border: '1px solid',
                borderColor: isDark ? alpha('#f59e0b', 0.25) : '#fde68a',
              }}
            >
              <StarRoundedIcon sx={{ fontSize: 17, color: '#f59e0b' }} />
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 700, color: '#92400e' }}>
                {Number(Provider.rating).toFixed(1)}
              </Typography>
              <Typography sx={{ fontSize: '0.78rem', color: '#a16207' }}>
                ({Provider.rating_count})
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} alignItems="center">
              <Button
                variant="contained"
                onClick={() => onViewProfile(Provider)}
                sx={{
                  height: 42,
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  backgroundColor: isDark ? alpha('#94a3b8', 0.15) : '#1e293b',
                  color: isDark ? 'text.primary' : '#fff',
                  boxShadow: 'none',
                  '&:hover': {
                    backgroundColor: isDark ? alpha('#94a3b8', 0.25) : '#0f172a',
                    boxShadow: isDark ? 'none' : '0 4px 12px rgba(15,23,42,0.15)',
                  },
                }}
              >
                {t('Providers.card.viewProfile', { defaultValue: 'View Profile' })}
              </Button>

              <IconButton
                size="small"
                onClick={(e) => setMenuAnchor(e.currentTarget)}
                sx={{
                  width: 42, height: 42,
                  borderRadius: '12px',
                  border: '1px solid',
                  borderColor: 'divider',
                  color: 'text.secondary',
                  '&:hover': { bgcolor: 'action.hover', borderColor: 'text.disabled' },
                }}
              >
                <MoreVertRoundedIcon fontSize="small" />
              </IconButton>

              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={() => setMenuAnchor(null)}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    borderRadius: '12px',
                    border: '1px solid',
                    borderColor: 'divider',
                    boxShadow: isDark
                      ? '0 10px 30px rgba(0,0,0,0.4)'
                      : '0 10px 30px rgba(15,23,42,0.1)',
                    minWidth: 180,
                    mt: 0.5,
                    bgcolor: 'background.paper',
                  },
                }}
              >
                {Provider.is_active ? (
                  <MenuItem onClick={() => { setMenuAnchor(null); onDeactivate?.(Provider); }}
                    sx={{ borderRadius: '8px', mx: 0.5, '&:hover': { backgroundColor: isDark ? alpha('#f97316', 0.1) : '#fff7ed' } }}
                  >
                    <ListItemIcon><BlockRoundedIcon fontSize="small" sx={{ color: '#f97316' }} /></ListItemIcon>
                    <ListItemText primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600, color: '#c2410c' }}>
                      {t('Providers.actions.deactivate', { defaultValue: 'Deactivate' })}
                    </ListItemText>
                  </MenuItem>
                ) : (
                  <MenuItem onClick={() => { setMenuAnchor(null); onActivate?.(Provider); }}
                    sx={{ borderRadius: '8px', mx: 0.5, '&:hover': { backgroundColor: isDark ? alpha('#22c55e', 0.1) : '#f0fdf4' } }}
                  >
                    <ListItemIcon><CheckCircleRoundedIcon fontSize="small" sx={{ color: '#22c55e' }} /></ListItemIcon>
                    <ListItemText primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600, color: '#15803d' }}>
                      {t('Providers.actions.activate', { defaultValue: 'Activate' })}
                    </ListItemText>
                  </MenuItem>
                )}

                <MenuItem onClick={() => { setMenuAnchor(null); onDelete?.(Provider); }}
                  sx={{ borderRadius: '8px', mx: 0.5, '&:hover': { backgroundColor: isDark ? alpha('#ef4444', 0.1) : '#fff1f2' } }}
                >
                  <ListItemIcon><DeleteOutlineRoundedIcon fontSize="small" sx={{ color: '#ef4444' }} /></ListItemIcon>
                  <ListItemText primaryTypographyProps={{ fontSize: '0.875rem', fontWeight: 600, color: '#dc2626' }}>
                    {t('Providers.actions.delete', { defaultValue: 'Delete' })}
                  </ListItemText>
                </MenuItem>
              </Menu>
            </Stack>
          </Stack>

        </Stack>
      </CardContent>
    </Card>
  );
}

// ─── ProvidersPage ────────────────────────────────────────────────────────────
function ProvidersPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const { addProvider, notify, fetchProviders, activateProvider, deactivateProvider, deleteProvider } = useAppContext();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch]             = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const [providersList, setProvidersList] = useState([]);
  const [page, setPage]       = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal]     = useState(0);

  const [listLoading, setListLoading]     = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [pageLoading, setPageLoading]     = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);

  const debounceRef      = useRef(null);
  const isFirstRun       = useRef(true);
  const firstLoadDoneRef = useRef(false);

  const [analyticsPeriod, setAnalyticsPeriod] = useState('this_month');
  const [customNum, setCustomNum]             = useState('');
  const [customUnit, setCustomUnit]           = useState('d');
  const [analytics, setAnalytics]             = useState(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsOpen, setAnalyticsOpen]     = useState(false);

  const PRESET_PERIODS = [
    'today','yesterday','this_week','last_week',
    'this_month','last_month','this_year','last_year',
  ];
  const UNITS = ['d', 'w', 'm', 'y'];

  async function fetchAnalytics(period) {
    try {
      setAnalyticsLoading(true);
      const res = await api.get('/admin/analytics/providers', { params: { period } });
      setAnalytics(res.data.data);
    } catch (err) {
      console.error('Failed to fetch provider analytics:', err);
    } finally {
      setAnalyticsLoading(false);
    }
  }

  useEffect(() => { fetchAnalytics(analyticsPeriod); }, [analyticsPeriod]);

  async function fetchProvidersList({ pageNum = page, status = statusFilter, query = search } = {}) {
    const hasQuery = query.trim().length > 0;
    if (hasQuery) setSearchLoading(true);
    else setListLoading(true);

    try {
      const params = { page: pageNum, ...getStatusParams(status) };
      let response;
      if (hasQuery) {
        response = await api.get('/admin/provider/search', { params: { query: query.trim(), ...params } });
      } else {
        response = await api.get('/admin/provider/all-providers', { params });
      }

      const payload = response.data.data;
      const list = Array.isArray(payload) ? payload : payload.data ?? [];
      setProvidersList(list);

      if (!Array.isArray(payload)) {
        setTotal(payload.total ?? list.length);
        setLastPage(payload.last_page ?? 1);
        setPage(payload.current_page ?? pageNum);
      } else {
        setTotal(list.length);
        setLastPage(1);
        setPage(1);
      }
    } catch (err) {
      console.error('Failed to fetch providers:', err);
      setProvidersList([]);
    } finally {
      setListLoading(false);
      setSearchLoading(false);
      if (!firstLoadDoneRef.current) {
        firstLoadDoneRef.current = true;
        setPageLoading(false);
      }
    }
  }

  useEffect(() => {
    if (isFirstRun.current) return;
    setPage(1);
  }, [search, statusFilter]);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const delay = search.trim() ? 500 : 0;
    debounceRef.current = setTimeout(() => {
      fetchProvidersList({ pageNum: page, status: statusFilter, query: search });
      isFirstRun.current = false;
    }, delay);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter, search]);

  async function refreshAfterAction() {
    await Promise.all([
      fetchProvidersList({ pageNum: page, status: statusFilter, query: search }),
      fetchProviders(),
      fetchAnalytics(analyticsPeriod),
    ]);
  }

  async function handleAddProviderSubmit(values) {
    setLoadingAction({ id: 'new', type: 'add' });
    try {
      await addProvider(values);
      await refreshAfterAction();
      setAddDialogOpen(false);
      notify({ severity: 'success', message: 'Provider added successfully' });
    } catch (err) {
      notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to add provider' });
    } finally { setLoadingAction(null); }
  }

  async function handleActivate(Provider) {
    setLoadingAction({ id: Provider.id, type: 'activate' });
    try {
      await activateProvider(Provider.id);
      await refreshAfterAction();
      notify({ severity: 'success', message: 'Provider activated successfully' });
    } catch (err) {
      notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to activate provider' });
    } finally { setLoadingAction(null); }
  }

  async function handleDeactivate(Provider) {
    setLoadingAction({ id: Provider.id, type: 'deactivate' });
    try {
      await deactivateProvider(Provider.id);
      await refreshAfterAction();
      notify({ severity: 'success', message: 'Provider deactivated successfully' });
    } catch (err) {
      notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to deactivate provider' });
    } finally { setLoadingAction(null); }
  }

  async function handleDelete(Provider) {
    setLoadingAction({ id: Provider.id, type: 'delete' });
    try {
      await deleteProvider(Provider.id);
      const willBeEmpty = providersList.length === 1 && page > 1;
      if (willBeEmpty) {
        setPage(page - 1);
        await fetchProviders();
      } else {
        await refreshAfterAction();
      }
      notify({ severity: 'success', message: 'Provider deleted successfully' });
    } catch (err) {
      notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to delete provider' });
    } finally { setLoadingAction(null); }
  }

  function handleViewProfile(Provider) {
    navigate(`/Providers/${Provider.id}`, { state: { returnTo: '/Providers' } });
  }

  function getFilterLabel(status) {
    if (status === 'all') return t('Providers.filters.all', { defaultValue: 'All' });
    return t(`Providers.status.${status}`, { defaultValue: status.charAt(0).toUpperCase() + status.slice(1) });
  }

  // ── Overlay color (shared between pageLoading & loadingAction) ────────────
  const overlayBg = isDark ? 'rgba(0,0,0,0.65)' : 'rgba(15,23,42,0.45)';

  if (pageLoading) {
    return (
      <Box sx={{
        position: 'fixed', inset: 0, zIndex: 9999,
        backgroundColor: overlayBg,
        backdropFilter: 'blur(4px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
      }}>
        <CircularProgress size={64} thickness={4} sx={{ color: '#ffffff' }} />
        <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
          {t('Providers.loading', { defaultValue: 'Loading providers...' })}
        </Typography>
      </Box>
    );
  }

  return (
    <Stack spacing={3.2} dir={isRtl ? 'rtl' : 'ltr'}>

      {/* ── Full-screen action overlay ─────────────────────────────────────── */}
      {loadingAction && (
        <Box sx={{
          position: 'fixed', inset: 0, zIndex: 9999,
          backgroundColor: overlayBg,
          backdropFilter: 'blur(4px)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2,
        }}>
          <CircularProgress size={64} thickness={4} sx={{ color: '#ffffff' }} />
          <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
            {loadingAction.type === 'activate'   && t('Providers.actions.activating',   { defaultValue: 'Activating provider...' })}
            {loadingAction.type === 'deactivate' && t('Providers.actions.deactivating', { defaultValue: 'Deactivating provider...' })}
            {loadingAction.type === 'delete'     && t('Providers.actions.deleting',     { defaultValue: 'Deleting provider...' })}
            {loadingAction.type === 'add'        && t('Providers.actions.adding',       { defaultValue: 'Adding provider...' })}
          </Typography>
        </Box>
      )}

      {/* ── Page header ───────────────────────────────────────────────────── */}
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
        <Box sx={{ maxWidth: 780 }}>
          <Typography sx={{ fontSize: { xs: '2.05rem', md: '2.55rem' }, lineHeight: 1.05, fontWeight: 900, letterSpacing: '-0.04em', color: 'text.primary' }}>
            {t('Providers.title', { defaultValue: 'Providers Management' })}
          </Typography>
          <Typography sx={{ mt: 0.95, maxWidth: 700, fontSize: { xs: '0.98rem', md: '1.03rem' }, lineHeight: 1.6, color: 'text.secondary' }}>
            {t('Providers.subtitle', { defaultValue: 'Maintain Provider records with fast create, edit, delete, and profile navigation workflows.' })}
          </Typography>
        </Box>

        <Button
          startIcon={<AddRoundedIcon sx={{ fontSize: 21 }} />}
          variant="contained"
          onClick={() => setAddDialogOpen(true)}
          sx={{
            minWidth: { xs: '100%', md: 170 }, height: 48, borderRadius: 1, px: 2.4,
            textTransform: 'none', fontSize: '0.95rem', fontWeight: 800,
            backgroundColor: '#2563eb',
            boxShadow: '0 12px 26px rgba(37,99,235,0.26)',
            '&:hover': { backgroundColor: '#1d4ed8', boxShadow: '0 14px 28px rgba(37,99,235,0.3)' },
          }}
        >
          {t('Providers.addProvider', { defaultValue: 'Add Provider' })}
        </Button>
      </Stack>

      {/* ── Analytics Card ────────────────────────────────────────────────── */}
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
          {/* Header */}
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
                background: `linear-gradient(135deg, ${isDark ? 'rgba(37,99,235,0.22)' : 'rgba(37,99,235,0.14)'}, ${isDark ? 'rgba(6,182,212,0.18)' : 'rgba(6,182,212,0.12)'})`,
                display: 'grid', placeItems: 'center', color: '#2563eb',
                boxShadow: `inset 0 0 0 1px ${isDark ? 'rgba(37,99,235,0.2)' : 'rgba(37,99,235,0.12)'}`,
                alignSelf: 'center',
              }}>
                <TrendingUpRoundedIcon />
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 900, color: 'text.primary', letterSpacing: '-0.02em', lineHeight: 1.2, mb: 0.5 }}>
                  Providers Analytics
                </Typography>
                {analytics?.meta && (
                  <Typography variant="caption" sx={{
                    display: 'inline-flex', alignItems: 'center',
                    px: 1.1, py: 0.35, borderRadius: 2,
                    bgcolor: 'action.hover', color: 'text.secondary',
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
                borderRadius: 1, fontWeight: 800, textTransform: 'none', px: 2.4, height: 42,
                boxShadow: analyticsOpen ? '0 10px 22px rgba(37,99,235,0.22)' : 'none',
              }}
            >
              {analyticsPeriod.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
            </Button>
          </Stack>

          {/* Filter Panel */}
          <Collapse in={analyticsOpen}>
            <Box sx={{
              p: { xs: 2, md: 3 }, borderRadius: 2,
              bgcolor: isDark ? 'action.hover' : 'rgba(248,250,252,0.9)',
              border: '1px solid', borderColor: 'divider',
              mb: 3,
              boxShadow: isDark ? 'none' : 'inset 0 1px 0 rgba(255,255,255,0.8)',
            }}>
              <Stack spacing={2.2}>
                <Typography variant="caption" sx={{ fontWeight: 900, color: 'text.secondary', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
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
                          borderColor: selected ? '#2563eb' : 'divider',
                          bgcolor: selected ? '#2563eb' : 'background.paper',
                          color: selected ? '#fff' : 'text.primary',
                          boxShadow: selected ? '0 8px 18px rgba(37,99,235,0.24)' : 'none',
                          transition: 'all 180ms ease',
                          '& .MuiChip-label': { px: 1.5 },
                          '&:hover': { bgcolor: selected ? '#1d4ed8' : 'action.hover', transform: 'translateY(-1px)' },
                        }}
                      />
                    );
                  })}
                </Stack>

                <Divider />

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ xs: 'stretch', sm: 'center' }}>
                  <TextField
                    value={customNum}
                    onChange={(e) => { const val = e.target.value; if (val === '' || /^\d+$/.test(val)) setCustomNum(val); }}
                    placeholder="4" size="small"
                    sx={{
                      width: { xs: '100%', sm: 90 },
                      '& .MuiOutlinedInput-root': { borderRadius: 1, fontSize: '0.9rem', fontFamily: 'monospace', fontWeight: 800, bgcolor: 'background.paper' },
                    }}
                  />
                  <Stack direction="row" spacing={1}>
                    {UNITS.map((u) => (
                      <Box key={u} onClick={() => setCustomUnit(u)} sx={{
                        height: 40, width: 44, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: 1, border: '1px solid',
                        borderColor: customUnit === u ? '#2563eb' : 'divider',
                        bgcolor: customUnit === u ? (isDark ? alpha('#2563eb', 0.18) : '#eff6ff') : 'background.paper',
                        color: customUnit === u ? '#2563eb' : 'text.secondary',
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
                    sx={{ borderRadius: 1, fontWeight: 800, textTransform: 'none', height: 40, px: 3, boxShadow: '0 8px 18px rgba(37,99,235,0.22)' }}
                  >
                    Apply
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Collapse>

          {/* Analytics Cards */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)', xl: 'repeat(6, 1fr)' },
            gap: 2,
          }}>
            {[
              { title: 'Total Providers', value: analytics?.total_providers ?? '—', caption: 'All registered', icon: <Groups2RoundedIcon /> },
              {
                title: 'New Providers',
                value: analytics?.new_providers?.count ?? '—',
                caption: analytics?.new_providers?.growth != null
                  ? `${analytics.new_providers.growth > 0 ? '+' : ''}${analytics.new_providers.growth}% growth`
                  : 'vs previous period',
                captionTone: (analytics?.new_providers?.growth ?? 0) >= 0 ? 'positive' : 'warning',
                icon: <TrendingUpRoundedIcon />,
              },
              { title: 'Available',   value: analytics?.available_providers ?? '—',   caption: `${analytics?.available_providers_rate ?? 0}% rate`, captionTone: 'positive', icon: <CheckCircleOutlineRoundedIcon /> },
              { title: 'Unavailable', value: analytics?.unavailable_providers ?? '—', caption: 'Currently offline', icon: <AccessTimeRoundedIcon /> },
              { title: 'Active',      value: analytics?.active_providers ?? '—',      caption: 'Account active', captionTone: 'positive', icon: <CheckCircleOutlineRoundedIcon /> },
              { title: 'Inactive',    value: analytics?.inactive_providers ?? '—',    caption: 'Not activated',  captionTone: 'warning',  icon: <PersonOffOutlinedIcon /> },
            ].map((card) =>
              analyticsLoading
                ? <Skeleton key={card.title} variant="rounded" height={132} sx={{ borderRadius: 2 }} />
                : <DashboardMetricCard key={card.title} {...card} />
            )}
          </Box>
        </CardContent>
      </Card>

      {/* ── Status filter + count ─────────────────────────────────────────── */}
      <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between" spacing={1.8} sx={{ pt: 0.5 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ rowGap: 1 }}>
          {STATUS_FILTERS.map((status) => {
            const selected = statusFilter === status;
            return (
              <Chip
                key={status}
                label={getFilterLabel(status)}
                onClick={() => setStatusFilter(status)}
                clickable
                variant={selected ? 'filled' : 'outlined'}
                color={selected ? 'primary' : 'default'}
                sx={{
                  height: 44, px: 0.5, borderRadius: 1, fontWeight: 800, fontSize: '0.92rem',
                  borderColor: selected ? '#2563eb' : 'divider',
                  backgroundColor: selected ? '#2563eb' : 'background.paper',
                  color: selected ? '#ffffff' : 'text.primary',
                  '& .MuiChip-label': { px: 1.4 },
                  boxShadow: selected ? '0 10px 20px rgba(37,99,235,0.2)' : 'none',
                  transition: 'transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease',
                  '&:hover': { backgroundColor: selected ? '#1d4ed8' : 'action.hover', transform: 'translateY(-1px)' },
                }}
              />
            );
          })}
        </Stack>

        <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: 'text.secondary' }}>
          {t('Providers.overview.showing', {
            defaultValue: 'Showing {{visible}} of {{total}} Providers',
            visible: providersList.length,
            total,
          })}
        </Typography>
      </Stack>

      {/* ── Providers list card ───────────────────────────────────────────── */}
      <Card
        elevation={0}
        sx={{
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: isDark
            ? '0 1px 2px rgba(0,0,0,0.3), 0 18px 40px rgba(0,0,0,0.2)'
            : '0 1px 2px rgba(15,23,42,0.03), 0 18px 40px rgba(15,23,42,0.05)',
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 2.4 }, '&:last-child': { pb: { xs: 2, md: 2.4 } } }}>
          <Stack spacing={2.1}>
            <TextField
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('Providers.searchPlaceholder', { defaultValue: 'Search Providers by name' })}
              fullWidth
              sx={{
                '& .MuiInputBase-root': {
                  height: { xs: 54, md: 58 },
                  borderRadius: 1,
                  backgroundColor: isDark ? 'action.hover' : '#f8fafc',
                  fontSize: '0.98rem',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {searchLoading
                      ? <CircularProgress size={20} sx={{ color: '#94a3b8' }} />
                      : <SearchRoundedIcon sx={{ fontSize: 22, color: '#94a3b8' }} />
                    }
                  </InputAdornment>
                ),
              }}
            />

            <Divider />

            {(listLoading || searchLoading) ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', py: 8, gap: 2 }}>
                <CircularProgress size={48} thickness={4} sx={{ color: '#2563eb' }} />
                <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: 'text.secondary' }}>
                  {t('Providers.loading', { defaultValue: 'Loading...' })}
                </Typography>
              </Box>
            ) : providersList.length > 0 ? (
              <Stack spacing={1.8}>
                {providersList.map((Provider) => (
                  <ProviderCard
                    key={Provider.id}
                    Provider={Provider}
                    onViewProfile={handleViewProfile}
                    onActivate={handleActivate}
                    onDeactivate={handleDeactivate}
                    onDelete={handleDelete}
                    t={t}
                  />
                ))}
              </Stack>
            ) : (
              <Box sx={{
                py: { xs: 5, md: 7 }, px: 2, textAlign: 'center', borderRadius: 4,
                backgroundColor: isDark ? 'action.hover' : '#f8fafc',
                border: '1px dashed',
                borderColor: isDark ? alpha('#94a3b8', 0.25) : 'rgba(15,23,42,0.12)',
              }}>
                <Typography sx={{ fontSize: '1.15rem', fontWeight: 800, color: 'text.primary' }}>
                  {t('Providers.card.noProvidersTitle', { defaultValue: 'No Providers match the current filters' })}
                </Typography>
                <Typography sx={{ mt: 0.8, fontSize: '0.97rem', lineHeight: 1.6, color: 'text.secondary' }}>
                  {t('Providers.card.noProvidersSubtitle', { defaultValue: 'Clear a filter, search a different term, or add a new Provider to continue.' })}
                </Typography>
              </Box>
            )}

            {!listLoading && total > 0 && lastPage > 1 && (
              <Stack direction="row" justifyContent="center" sx={{ pt: 1 }}>
                <Pagination count={lastPage} page={page} onChange={(_, value) => setPage(value)} color="primary" shape="rounded" />
              </Stack>
            )}
          </Stack>
        </CardContent>
      </Card>

      <ProviderDialog
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onSubmit={handleAddProviderSubmit}
        loading={loadingAction?.type === 'add'}
      />
    </Stack>
  );
}

export default ProvidersPage;