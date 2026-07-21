

// import { useEffect, useMemo, useState } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import {
//   Avatar,
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Grid,
//   Chip,
//   Stack,
//   TextField,
//   Typography,
//   LinearProgress,
//   Divider,
//   Skeleton,
//   Pagination,
//   alpha,
// } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import AddIcon from '@mui/icons-material/Add';
// import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
// import PhoneIcon from '@mui/icons-material/Phone';
// import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
// import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
// import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
// import GroupsIcon from '@mui/icons-material/Groups';
// import TrendingUpIcon from '@mui/icons-material/TrendingUp';
// import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
// import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
// import ProviderDialog from '../components/ProviderDialog';
// import { useAppContext } from '../context/AppContext';
// import { formatDate } from '../utils/format';
// import { useTranslation } from 'react-i18next';
// import api from '../utils/axiosInstance';

// // ─── Stat Card ───────────────────────────────────────────
// function StatCard({ icon, label, value, color = 'primary' }) {
//   return (
//     <Card elevation={0} sx={(theme) => ({
//       borderRadius: 4, border: `1px solid ${theme.palette.divider}`,
//       background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.09)}, transparent)`,
//       transition: 'transform 0.2s, box-shadow 0.2s',
//       '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 16px 40px ${alpha(theme.palette[color].main, 0.15)}` },
//     })}>
//       <CardContent sx={{ p: 3 }}>
//         <Stack spacing={2}>
//           <Box sx={(theme) => ({
//             width: 46, height: 46, borderRadius: 3,
//             bgcolor: alpha(theme.palette[color].main, 0.13),
//             display: 'grid', placeItems: 'center', color: `${color}.main`,
//           })}>{icon}</Box>
//           <Box>
//             <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>{label}</Typography>
//             <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.04em' }}>{value}</Typography>
//           </Box>
//         </Stack>
//       </CardContent>
//     </Card>
//   );
// }

// // ─── Provider Card ─────────────────────────────────────────
// function ProviderCard({ Provider, profession, navigate, t, isRtl }) {
//   return (
//     <Card elevation={0} sx={(theme) => ({
//       height: '100%', borderRadius: 4, border: `1px solid ${theme.palette.divider}`,
//       transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
//       '&:hover': { transform: 'translateY(-4px)', boxShadow: theme.shadows[10], borderColor: theme.palette.primary.light },
//     })}>
//       <CardContent sx={{ p: 3 }}>
//         <Stack spacing={2.5}>
//           <Stack direction="row" spacing={2} alignItems="center" sx={{ flexDirection: isRtl ? 'row-reverse' : 'row' }}>
//             <Avatar sx={(theme) => ({
//               width: 52, height: 52, bgcolor: theme.palette.primary.main,
//               fontWeight: 800, fontSize: 20,
//               boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
//             })}>
// {(Provider.first_name || '').slice(0, 1)}            </Avatar>
//             <Box sx={{ flex: 1, minWidth: 0 }}>
//              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }} noWrap>
//   {`${Provider.first_name || ''} ${Provider.last_name || ''}`.trim() || '—'}
// </Typography>
// <Typography variant="body2" color="text.secondary" noWrap>
//   {Provider.experience_years ? `${Provider.experience_years} years exp.` : '—'}
// </Typography>
//             </Box>
// <Chip 
//   label={Provider.is_active ? 'Active' : 'Inactive'} 
//   size="small" 
//   color={Provider.is_active ? 'success' : 'default'} 
//   sx={{ fontWeight: 700, borderRadius: 2 }} 
// />          </Stack>

//           <Divider />

//           <Grid container spacing={1.5}>
//             {[
//               { icon: <PhoneIcon fontSize="small" />, label: t('Providers.phone', { defaultValue: 'Phone' }), value: Provider.phone },
//              { icon: <AccountBalanceWalletIcon fontSize="small" />, label: 'Status', value: Provider.is_active ? 'Active' : 'Inactive' },
// { icon: <CalendarTodayIcon fontSize="small" />, label: t('Providers.joined', { defaultValue: 'Joined' }), value: Provider.created_at ? formatDate(Provider.created_at) : null },
// { icon: <MonetizationOnIcon fontSize="small" />, label: 'Rating', value: `${Provider.rating} ⭐ (${Provider.rating_count})` },
//             ].map((item) => (
//               <Grid item xs={6} key={item.label}>
//                 <Box sx={(theme) => ({ p: 1.5, borderRadius: 2, bgcolor: theme.palette.action.hover })}>
//                   <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.5 }}>
//                     <Box sx={{ color: 'text.secondary', display: 'flex' }}>{item.icon}</Box>
//                     <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{item.label}</Typography>
//                   </Stack>
//                   <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>{item.value || '—'}</Typography>
//                 </Box>
//               </Grid>
//             ))}
//           </Grid>

//           <Button fullWidth variant="outlined" size="small"
//             startIcon={<VisibilityOutlinedIcon fontSize="small" />}
//             onClick={() => navigate(`/Providers/${Provider.id}`, { state: { professionId: profession.id, returnTo: `/professions/${profession.id}` } })}
//             sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}>
//             {t('Providers.table.viewProfile', { name: Provider.name })}
//           </Button>
//         </Stack>
//       </CardContent>
//     </Card>
//   );
// }

// // ─── Main Page ────────────────────────────────────────────
// function ProfessionDetailPage() {
//   const navigate = useNavigate();
//   const { id: professionId } = useParams();
//   const { addProvider } = useAppContext();
//   const [providers, setProviders] = useState([]);
//   const [providersLoading, setProvidersLoading] = useState(true);
//   const { t, i18n } = useTranslation();
//   const isRtl = i18n.dir() === 'rtl';

//   // ── API State ──────────────────────────────────────────
//   const [profession, setProfession] = useState(null);
//   const [fetchLoading, setFetchLoading] = useState(true);

//   // ── Providers pagination state ─────────────────────────
//   const [page, setPage] = useState(1);
//   const [lastPage, setLastPage] = useState(1);
//   const [total, setTotal] = useState(0);

//   useEffect(() => {
//     async function fetchProviders() {
//       try {
//         setProvidersLoading(true);
//         const res = await api.get('/admin/provider/all-providers', {
//           params: { category_id: professionId, page },
//         });
//         const payload = res.data.data;
//         const list = Array.isArray(payload) ? payload : payload.data ?? [];

//         setProviders(list);

//         if (!Array.isArray(payload)) {
//           setTotal(payload.total ?? list.length);
//           setLastPage(payload.last_page ?? 1);
//           setPage(payload.current_page ?? page);
//         } else {
//           setTotal(list.length);
//           setLastPage(1);
//         }
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setProvidersLoading(false);
//       }
//     }
//     fetchProviders();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [professionId, page]);

//   useEffect(() => {
//     async function fetchProfession() {
//       try {
//         setFetchLoading(true);
//         const response = await api.get(`/admin/category/categories/${professionId}`);
//         const data = response.data.data;
//         setProfession({
//           id: data.id,
//           name: data.name,
//           commission: data.commission,
//         //  image: data.image_url,
//   image: typeof data.image === 'string' ? data.image : data.image?.image_url || null,
//           is_active: data.is_active,
//         });
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setFetchLoading(false);
//       }
//     }
//     fetchProfession();
//   }, [professionId]);

//   // ── Providers (current page) ────────────────────────────
//   const professionProviders = providers;

//   // Client-side search on the current page's results
//   const [searchQuery, setSearchQuery] = useState('');
//   const filteredProviders = useMemo(
//     () => professionProviders.filter((w) =>
//       `${w.first_name || ''} ${w.last_name || ''} ${w.id} ${w.phone} ${w.experience_years || ''}`
//         .toLowerCase()
//         .includes(searchQuery.toLowerCase())
//     ),
//     [professionProviders, searchQuery],
//   );

//   const [ProviderDialogOpen, setProviderDialogOpen] = useState(false);

//   function handleSaveProvider(values) {
//     addProvider({ ...values, professionId });
//     setProviderDialogOpen(false);
//   }

//   const commissionNum = Math.min(Math.max(Number(profession?.commission || 0), 0), 100);
//   const totalBalance = professionProviders.reduce((s, w) => s + Number(w.balance || 0), 0);

//   // ── Loading ────────────────────────────────────────────
//   if (fetchLoading) {
//     return (
//       <Stack spacing={4}>
//         <Skeleton variant="rounded" height={200} sx={{ borderRadius: 5 }} />
//         <Grid container spacing={2.5}>
//           {[1, 2, 3].map((i) => (
//             <Grid item xs={12} sm={4} key={i}>
//               <Skeleton variant="rounded" height={140} sx={{ borderRadius: 4 }} />
//             </Grid>
//           ))}
//         </Grid>
//         <Skeleton variant="rounded" height={100} sx={{ borderRadius: 4 }} />
//       </Stack>
//     );
//   }

//   // ── Not Found ──────────────────────────────────────────
//   if (!profession) {
//     return (
//       <Card elevation={0} sx={(theme) => ({ borderRadius: 4, border: `1px solid ${theme.palette.divider}` })}>
//         <CardContent sx={{ p: 4 }}>
//           <Stack spacing={2} alignItems="flex-start">
//             <Typography variant="h5" sx={{ fontWeight: 800 }}>
//               {t('professions.notFound', { defaultValue: 'Job category not found' })}
//             </Typography>
//             <Button startIcon={<ArrowBackIcon />} variant="contained" onClick={() => navigate('/professions')}>
//               {t('professions.back', { defaultValue: 'Back to categories' })}
//             </Button>
//           </Stack>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Stack spacing={4} dir={isRtl ? 'rtl' : 'ltr'}>

//       {/* ── Hero Banner ───────────────────────────────── */}
//       <Card elevation={0} sx={(theme) => ({
//         borderRadius: 5, overflow: 'hidden',
//         border: `1px solid ${theme.palette.divider}`,
//         background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main})`,
//         color: '#fff', position: 'relative',
//       })}>
//         <Box sx={{ position: 'absolute', right: -80, top: -80, width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)' }} />
//         <Box sx={{ position: 'absolute', right: 40, bottom: -100, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
//         <Box sx={{ position: 'absolute', left: -40, bottom: -60, width: 180, height: 180, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />

//         <CardContent sx={{ p: { xs: 3, md: 5 }, position: 'relative', zIndex: 1 }}>
//           <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ md: 'center' }} justifyContent="space-between">

//             <Stack direction="row" spacing={3} alignItems="center">
//               <Avatar src={profession.image} sx={{
//                 width: 90, height: 90, fontSize: 36, fontWeight: 900,
//                 bgcolor: 'rgba(255,255,255,0.18)',
//                 border: '3px solid rgba(255,255,255,0.35)',
//                 boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
//               }}>
//                 {!profession.image && (profession.name || '').slice(0, 1)}
//               </Avatar>

//               <Box>
//                 <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.1 }}>
//                   {profession.name}
//                 </Typography>
//                 <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap">
//                   <Chip
//                     icon={profession.is_active
//                       ? <CheckCircleOutlinedIcon sx={{ color: '#fff !important', fontSize: 14 }} />
//                       : <CancelOutlinedIcon sx={{ color: '#fff !important', fontSize: 14 }} />
//                     }
//                     label={profession.is_active ? 'Active' : 'Inactive'}
//                     size="small"
//                     sx={{
//                       bgcolor: profession.is_active ? 'rgba(76,175,80,0.35)' : 'rgba(255,255,255,0.15)',
//                       color: '#fff', fontWeight: 700, border: '1px solid rgba(255,255,255,0.2)',
//                     }}
//                   />
//                   <Chip
//                     icon={<GroupsIcon sx={{ color: '#fff !important', fontSize: 14 }} />}
//                     label={`${total} Providers`}
//                     size="small"
//                     sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700 }}
//                   />
//                   <Chip
//                     icon={<MonetizationOnIcon sx={{ color: '#fff !important', fontSize: 14 }} />}
//                     label={`${Number(profession.commission || 0)}% commission`}
//                     size="small"
//                     sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700 }}
//                   />
//                 </Stack>
//               </Box>
//             </Stack>

//             <Stack direction="row" spacing={1.5} flexWrap="wrap">
//               <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/professions')} variant="outlined"
//                 sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', borderRadius: 3, textTransform: 'none', fontWeight: 700, '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
//                 {t('professions.back', { defaultValue: 'Back' })}
//               </Button>
//               <Button startIcon={<AddIcon />} onClick={() => setProviderDialogOpen(true)} variant="contained" disableElevation
//                 sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: 3, textTransform: 'none', fontWeight: 700, backdropFilter: 'blur(10px)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
//                 {t('professions.addProvider', { defaultValue: 'Add Provider' })}
//               </Button>
//             </Stack>
//           </Stack>
//         </CardContent>
//       </Card>

//       {/* ── Stat Cards ────────────────────────────────── */}
//       <Grid container spacing={2.5}>
//         <Grid item xs={12} sm={4}>
//           <StatCard icon={<GroupsIcon />} label="Total Providers" value={total} color="primary" />
//         </Grid>
//         <Grid item xs={12} sm={4}>
//           <StatCard icon={<MonetizationOnIcon />} label="Commission Rate" value={`${Number(profession.commission || 0)}%`} color="success" />
//         </Grid>
//         <Grid item xs={12} sm={4}>
//           <StatCard icon={<TrendingUpIcon />} label="Total Balance" value={`$${totalBalance.toLocaleString()}`} color="warning" />
//         </Grid>
//       </Grid>

//       {/* ── Commission Bar ────────────────────────────── */}
//       <Card elevation={0} sx={(theme) => ({ borderRadius: 4, border: `1px solid ${theme.palette.divider}` })}>
//         <CardContent sx={{ p: 3 }}>
//           <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
//             <Typography variant="h6" sx={{ fontWeight: 800 }}>Commission Rate</Typography>
//             <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.03em' }}>
//               {Number(profession.commission || 0)}%
//             </Typography>
//           </Stack>
//           <LinearProgress variant="determinate" value={commissionNum} sx={(theme) => ({
//             height: 12, borderRadius: 6, bgcolor: theme.palette.action.hover,
//             '& .MuiLinearProgress-bar': {
//               borderRadius: 6,
//               background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
//             },
//           })} />
//           <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
//             <Typography variant="caption" color="text.secondary">0%</Typography>
//             <Typography variant="caption" color="text.secondary">100%</Typography>
//           </Stack>
//         </CardContent>
//       </Card>

//       {/* ── Providers ───────────────────────────────────── */}
//       <Box>
//         <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}
//           alignItems={{ sm: 'center' }} justifyContent="space-between" sx={{ mb: 2.5 }}>
//           <Typography variant="h6" sx={{ fontWeight: 800 }}>
//             Providers ({total})
//           </Typography>
//           <TextField
//             placeholder={t('Providers.searchPlaceholder', { defaultValue: 'Search Providers...' })}
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             size="small"
//             sx={{ maxWidth: 320, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
//           />
//         </Stack>
// {providersLoading ? (
//   <Grid container spacing={2.5}>
//     {[1,2,3].map((i) => (
//       <Grid item xs={12} sm={6} lg={4} key={i}>
//         <Skeleton variant="rounded" height={280} sx={{ borderRadius: 4 }} />
//       </Grid>
//     ))}
//   </Grid>
// ) :
//         filteredProviders.length > 0 ? (
//           <>
//             <Grid container spacing={2.5}>
//               {filteredProviders.map((Provider) => (
//                 <Grid key={Provider.id} item xs={12} sm={6} lg={4}>
//                   <ProviderCard Provider={Provider} profession={profession} navigate={navigate} t={t} isRtl={isRtl} />
//                 </Grid>
//               ))}
//             </Grid>

//             {/* Pagination footer */}
//             {total > 0 && (
//               <Stack
//                 direction={{ xs: 'column', sm: 'row' }}
//                 spacing={1.5}
//                 alignItems="center"
//                 justifyContent="space-between"
//                 sx={{ mt: 2.5 }}
//               >
//                 <Typography variant="body2" color="text.secondary">
//                   {t('Providers.showing', {
//                     defaultValue: 'Showing {{count}} of {{total}}',
//                     count: providers.length,
//                     total,
//                   })}
//                 </Typography>

//                 {lastPage > 1 && (
//                   <Pagination
//                     count={lastPage}
//                     page={page}
//                     onChange={(_, value) => setPage(value)}
//                     color="primary"
//                     shape="rounded"
//                   />
//                 )}
//               </Stack>
//             )}
//           </>
//         ) : (
//           <Card elevation={0} sx={(theme) => ({ borderRadius: 4, border: `1px dashed ${theme.palette.divider}` })}>
//             <CardContent>
//               <Box sx={{ py: 8, textAlign: 'center' }}>
//                 <GroupsIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
//                 <Typography variant="h6" sx={{ fontWeight: 800 }}>
//                   {t('professions.emptyTitle', { defaultValue: 'No Providers yet' })}
//                 </Typography>
//                 <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
//                   {t('professions.emptySubtitle', { defaultValue: 'Add a Provider to this category to get started.' })}
//                 </Typography>
//                 <Button variant="contained" startIcon={<AddIcon />} onClick={() => setProviderDialogOpen(true)}
//                   sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700 }}>
//                   Add First Provider
//                 </Button>
//               </Box>
//             </CardContent>
//           </Card>
//         )}
//       </Box>

//       <ProviderDialog
//         open={ProviderDialogOpen}
//         Provider={null}
//         defaultProfessionId={profession.id}
//         onClose={() => setProviderDialogOpen(false)}
//         onSubmit={handleSaveProvider}
//       />
//     </Stack>
//   );
// }

// export default ProfessionDetailPage;

import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  TextField,
  Typography,
  Divider,
  Skeleton,
  Pagination,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GroupsIcon from '@mui/icons-material/Groups';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ProviderDialog from '../components/ProviderDialog';
import { useAppContext } from '../context/AppContext';
import { formatDate } from '../utils/format';
import { useTranslation } from 'react-i18next';
import api from '../utils/axiosInstance';

// ─── Stat Card ───────────────────────────────────────────
function StatCard({ icon, label, value, color = 'primary' }) {
  return (
    <Card elevation={0} sx={(theme) => ({
      borderRadius: 3,
      border: `1px solid ${theme.palette.divider}`,
    })}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box sx={{
            width: 44, height: 44, borderRadius: 2,
            bgcolor: 'action.hover',
            display: 'grid', placeItems: 'center', color: `${color}.main`,
          }}>{icon}</Box>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>{label}</Typography>
            <Typography variant="h5" sx={{ fontWeight: 800 }}>{value}</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

// ─── Provider Card ─────────────────────────────────────────
function ProviderCard({ Provider, profession, navigate, t, isRtl }) {
  return (
    <Card elevation={0} sx={(theme) => ({
      height: '100%',
      borderRadius: 3,
      border: `1px solid ${theme.palette.divider}`,
    })}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flexDirection: isRtl ? 'row-reverse' : 'row' }}>
            <Avatar sx={{
              width: 52, height: 52, bgcolor: 'primary.main',
              fontWeight: 700, fontSize: 20,
            }}>
{(Provider.first_name || '').slice(0, 1)}            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
             <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }} noWrap>
  {`${Provider.first_name || ''} ${Provider.last_name || ''}`.trim() || '—'}
</Typography>
<Typography variant="body2" color="text.secondary" noWrap>
  {Provider.experience_years ? `${Provider.experience_years} years exp.` : '—'}
</Typography>
            </Box>
<Chip 
  label={Provider.is_active ? 'Active' : 'Inactive'} 
  size="small" 
  color={Provider.is_active ? 'success' : 'default'} 
/>          </Stack>

          <Divider />

          <Grid container spacing={1.5}>
            {[
              { icon: <PhoneIcon fontSize="small" />, label: t('Providers.phone', { defaultValue: 'Phone' }), value: Provider.phone },
             { icon: <AccountBalanceWalletIcon fontSize="small" />, label: 'Status', value: Provider.is_active ? 'Active' : 'Inactive' },
{ icon: <CalendarTodayIcon fontSize="small" />, label: t('Providers.joined', { defaultValue: 'Joined' }), value: Provider.created_at ? formatDate(Provider.created_at) : null },
{ icon: <MonetizationOnIcon fontSize="small" />, label: 'Rating', value: `${Provider.rating} ⭐ (${Provider.rating_count})` },
            ].map((item) => (
              <Grid item xs={6} key={item.label}>
                <Box sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
                  <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.5 }}>
                    <Box sx={{ color: 'text.secondary', display: 'flex' }}>{item.icon}</Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{item.label}</Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>{item.value || '—'}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Button fullWidth variant="outlined" size="small"
            startIcon={<VisibilityOutlinedIcon fontSize="small" />}
            onClick={() => navigate(`/Providers/${Provider.id}`, { state: { professionId: profession.id, returnTo: `/professions/${profession.id}` } })}
            sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}>
            {t('Providers.table.viewProfile', { name: Provider.name })}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────
function ProfessionDetailPage() {
  const navigate = useNavigate();
  const { id: professionId } = useParams();
  const { addProvider } = useAppContext();
  const [providers, setProviders] = useState([]);
  const [providersLoading, setProvidersLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  // ── API State ──────────────────────────────────────────
  const [profession, setProfession] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  // ── Providers pagination state ─────────────────────────
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    async function fetchProviders() {
      try {
        setProvidersLoading(true);
        const res = await api.get('/admin/provider/all-providers', {
          params: { category_id: professionId, page },
        });
        const payload = res.data.data;
        const list = Array.isArray(payload) ? payload : payload.data ?? [];

        setProviders(list);

        if (!Array.isArray(payload)) {
          setTotal(payload.total ?? list.length);
          setLastPage(payload.last_page ?? 1);
          setPage(payload.current_page ?? page);
        } else {
          setTotal(list.length);
          setLastPage(1);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setProvidersLoading(false);
      }
    }
    fetchProviders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [professionId, page]);

  useEffect(() => {
    async function fetchProfession() {
      try {
        setFetchLoading(true);
        const response = await api.get(`/admin/category/categories/${professionId}`);
        const data = response.data.data;
        setProfession({
          id: data.id,
          name: data.name,
          commission: data.commission,
        //  image: data.image_url,
  image: typeof data.image === 'string' ? data.image : data.image?.image_url || null,
          is_active: data.is_active,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setFetchLoading(false);
      }
    }
    fetchProfession();
  }, [professionId]);

  // ── Providers (current page) ────────────────────────────
  const professionProviders = providers;

  // Client-side search on the current page's results
  const [searchQuery, setSearchQuery] = useState('');
  const filteredProviders = useMemo(
    () => professionProviders.filter((w) =>
      `${w.first_name || ''} ${w.last_name || ''} ${w.id} ${w.phone} ${w.experience_years || ''}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
    ),
    [professionProviders, searchQuery],
  );

  const [ProviderDialogOpen, setProviderDialogOpen] = useState(false);

  function handleSaveProvider(values) {
    addProvider({ ...values, professionId });
    setProviderDialogOpen(false);
  }

  const totalBalance = professionProviders.reduce((s, w) => s + Number(w.balance || 0), 0);

  // ── Loading ────────────────────────────────────────────
  if (fetchLoading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={60} />
        <Skeleton variant="rounded" height={200} />
      </Stack>
    );
  }

  // ── Not Found ──────────────────────────────────────────
  if (!profession) {
    return (
      <Stack spacing={2} alignItems="center" sx={{ py: 6 }}>
        <Typography color="error">{t('professions.notFound', { defaultValue: 'Job category not found' })}</Typography>
        <Button onClick={() => navigate('/professions')}>{t('common.back', { defaultValue: 'Back' })}</Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={3} dir={isRtl ? 'rtl' : 'ltr'}>

      {/* ── Header ───────────────────────────────── */}
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton onClick={() => navigate('/professions')}><ArrowBackIcon /></IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h6" fontWeight={800}>{profession.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {t('professions.detailsSubtitle', { defaultValue: 'Job category details' })}
          </Typography>
        </Box>
        <Button startIcon={<AddIcon />} onClick={() => setProviderDialogOpen(true)} variant="contained" disableElevation
          sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
          {t('professions.addProvider', { defaultValue: 'Add Provider' })}
        </Button>
      </Stack>

      {/* ── Profile Card ─────────────────────────── */}
      <Card elevation={0} sx={(theme) => ({ borderRadius: 3, border: `1px solid ${theme.palette.divider}` })}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm="auto">
              <Avatar src={profession.image || undefined} sx={{ width: 96, height: 96, fontSize: '1.8rem', fontWeight: 700 }}>
                {!profession.image && (profession.name || '').slice(0, 1)}
              </Avatar>
            </Grid>
            <Grid item xs={12} sm>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h6" fontWeight={800}>
                    {profession.name}
                  </Typography>
                  <Chip
                    icon={profession.is_active
                      ? <CheckCircleOutlinedIcon fontSize="small" />
                      : <CancelOutlinedIcon fontSize="small" />
                    }
                    label={profession.is_active ? 'Active' : 'Inactive'}
                    color={profession.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </Stack>
                <Stack direction="row" spacing={1} flexWrap="wrap">
                  <Chip
                    icon={<GroupsIcon fontSize="small" />}
                    label={`${total} Providers`}
                    size="small"
                    variant="outlined"
                  />
                  <Chip
                    icon={<MonetizationOnIcon fontSize="small" />}
                    label={`${Number(profession.commission || 0)}% commission`}
                    size="small"
                    variant="outlined"
                  />
                </Stack>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* ── Stat Cards ────────────────────────────────── */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={4}>
          <StatCard icon={<GroupsIcon />} label="Total Providers" value={total} color="primary" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard icon={<MonetizationOnIcon />} label="Commission Rate" value={`${Number(profession.commission || 0)}%`} color="success" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard icon={<TrendingUpIcon />} label="Total Balance" value={`$${totalBalance.toLocaleString()}`} color="warning" />
        </Grid>
      </Grid>

      {/* ── Providers ───────────────────────────────────── */}
      <Card elevation={0} sx={(theme) => ({ borderRadius: 3, border: `1px solid ${theme.palette.divider}` })}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}
            alignItems={{ sm: 'center' }} justifyContent="space-between" sx={{ mb: 2.5 }}>
            <Typography variant="subtitle2" fontWeight={800}>
              Providers ({total})
            </Typography>
            <TextField
              placeholder={t('Providers.searchPlaceholder', { defaultValue: 'Search Providers...' })}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="small"
              sx={{ maxWidth: 320 }}
            />
          </Stack>

          {providersLoading ? (
            <Grid container spacing={2.5}>
              {[1,2,3].map((i) => (
                <Grid item xs={12} sm={6} lg={4} key={i}>
                  <Skeleton variant="rounded" height={280} sx={{ borderRadius: 3 }} />
                </Grid>
              ))}
            </Grid>
          ) :
          filteredProviders.length > 0 ? (
            <>
              <Grid container spacing={2.5}>
                {filteredProviders.map((Provider) => (
                  <Grid key={Provider.id} item xs={12} sm={6} lg={4}>
                    <ProviderCard Provider={Provider} profession={profession} navigate={navigate} t={t} isRtl={isRtl} />
                  </Grid>
                ))}
              </Grid>

              {/* Pagination footer */}
              {total > 0 && (
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1.5}
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ mt: 2.5 }}
                >
                  <Typography variant="body2" color="text.secondary">
                    {t('Providers.showing', {
                      defaultValue: 'Showing {{count}} of {{total}}',
                      count: providers.length,
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
            </>
          ) : (
            <Box sx={{ py: 8, textAlign: 'center' }}>
              <GroupsIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {t('professions.emptyTitle', { defaultValue: 'No Providers yet' })}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                {t('professions.emptySubtitle', { defaultValue: 'Add a Provider to this category to get started.' })}
              </Typography>
              <Button variant="contained" startIcon={<AddIcon />} onClick={() => setProviderDialogOpen(true)}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 700 }}>
                Add First Provider
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      <ProviderDialog
        open={ProviderDialogOpen}
        Provider={null}
        defaultProfessionId={profession.id}
        onClose={() => setProviderDialogOpen(false)}
        onSubmit={handleSaveProvider}
      />
    </Stack>
  );
}

export default ProfessionDetailPage;