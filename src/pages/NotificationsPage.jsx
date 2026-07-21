// // src/pages/NotificationsPage.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Box, Typography, List, ListItem, ListItemText,
//   IconButton, Button, Chip, Divider, CircularProgress, Tooltip,
//   Paper, Stack, Badge, Pagination, alpha, useTheme, Fade,
// } from '@mui/material';
// import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
// import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
// import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
// import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
// import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
// import { useTranslation } from 'react-i18next';
// import api from '../utils/axiosInstance';
// import PageHeader from '../components/PageHeader';

// // ── helpers ────────────────────────────────────────────────────────────────────

// const TYPE_CONFIG = {
//   new_order: {
//     icon: <ShoppingCartRoundedIcon sx={{ fontSize: 16 }} />,
//     color: '#6366f1',
//     bg: 'rgba(99,102,241,0.10)',
//     label: 'New Order',
//   },
// };
// const DEFAULT_CONFIG = {
//   icon: <NotificationsNoneRoundedIcon sx={{ fontSize: 16 }} />,
//   color: '#64748b',
//   bg: 'rgba(100,116,139,0.10)',
//   label: 'System',
// };
// const getConfig = (type) => TYPE_CONFIG[type] || DEFAULT_CONFIG;

// function timeAgo(dateStr) {
//   if (!dateStr) return null;
//   const date = new Date(dateStr.replace(' ', 'T') + 'Z');
//   if (isNaN(date)) return dateStr;
//   const diff = Math.floor((Date.now() - date) / 1000);
//   if (diff < 60) return 'Just now';
//   if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
//   if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
//   return new Intl.DateTimeFormat('en-GB', {
//     day: '2-digit', month: 'short', year: 'numeric',
//   }).format(date);
// }

// // ── Single row ─────────────────────────────────────────────────────────────────

// function NotificationRow({ notif, onMarkRead, marking }) {
//   const theme = useTheme();
//   const isUnread = !notif.read_at;
//   const cfg = getConfig(notif.type);
//   const isDark = theme.palette.mode === 'dark';

//   return (
//     <Fade in timeout={300}>
//       <Box>
//         <ListItem
//           alignItems="flex-start"
//           sx={{
//             gap: 2,
//             px: { xs: 2, sm: 3 },
//             py: 2,
//             position: 'relative',
//             transition: 'background 0.18s',
//             bgcolor: isUnread
//               ? isDark
//                 ? alpha(cfg.color, 0.07)
//                 : alpha(cfg.color, 0.04)
//               : 'transparent',
//             '&:hover': {
//               bgcolor: isDark
//                 ? alpha(cfg.color, 0.12)
//                 : alpha(cfg.color, 0.07),
//             },
//             // unread left accent bar
//             '&::before': isUnread ? {
//               content: '""',
//               position: 'absolute',
//               left: 0,
//               top: '50%',
//               transform: 'translateY(-50%)',
//               width: 3,
//               height: '60%',
//               borderRadius: '0 3px 3px 0',
//               bgcolor: cfg.color,
//             } : {},
//           }}
//         >
//           {/* Icon bubble */}
//           <Box
//             sx={{
//               width: 38,
//               height: 38,
//               borderRadius: '11px',
//               bgcolor: cfg.bg,
//               color: cfg.color,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               flexShrink: 0,
//               mt: 0.25,
//               border: `1px solid ${alpha(cfg.color, 0.15)}`,
//             }}
//           >
//             {cfg.icon}
//           </Box>

//           {/* Text */}
//           <ListItemText
//             sx={{ my: 0 }}
//             primary={
//               <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap" mb={0.3}>
//                 <Typography
//                   variant="body2"
//                   fontWeight={isUnread ? 700 : 500}
//                   color={isUnread ? 'text.primary' : 'text.secondary'}
//                   lineHeight={1.4}
//                 >
//                   {notif.title}
//                 </Typography>
//                 <Chip
//                   label={cfg.label}
//                   size="small"
//                   sx={{
//                     fontSize: 10,
//                     height: 17,
//                     bgcolor: cfg.bg,
//                     color: cfg.color,
//                     fontWeight: 700,
//                     borderRadius: '5px',
//                     border: `1px solid ${alpha(cfg.color, 0.2)}`,
//                     letterSpacing: 0.3,
//                   }}
//                 />
//               </Stack>
//             }
//             secondary={
//               <Stack gap={0.4}>
//                 <Typography
//                   variant="body2"
//                   color="text.secondary"
//                   fontSize={13}
//                   lineHeight={1.5}
//                 >
//                   {notif.body}
//                 </Typography>
//                 <Stack direction="row" alignItems="center" gap={0.8}>
//                   {isUnread && (
//                     <Box
//                       sx={{
//                         width: 6,
//                         height: 6,
//                         borderRadius: '50%',
//                         bgcolor: cfg.color,
//                         flexShrink: 0,
//                       }}
//                     />
//                   )}
//                   <Typography variant="caption" color="text.disabled" fontSize={11}>
//                     {isUnread ? timeAgo(null) || 'Unread' : `Read · ${timeAgo(notif.read_at)}`}
//                   </Typography>
//                 </Stack>
//               </Stack>
//             }
//           />

//           {/* Action */}
//           {isUnread && (
//             <Tooltip title="Mark as read" placement="left">
//               <span>
//                 <IconButton
//                   size="small"
//                   onClick={() => onMarkRead(notif.id)}
//                   disabled={marking}
//                   sx={{
//                     color: cfg.color,
//                     bgcolor: cfg.bg,
//                     borderRadius: '9px',
//                     width: 32,
//                     height: 32,
//                     flexShrink: 0,
//                     border: `1px solid ${alpha(cfg.color, 0.15)}`,
//                     '&:hover': { bgcolor: alpha(cfg.color, 0.18) },
//                     '&:disabled': { opacity: 0.4 },
//                   }}
//                 >
//                   <DoneRoundedIcon sx={{ fontSize: 16 }} />
//                 </IconButton>
//               </span>
//             </Tooltip>
//           )}
//         </ListItem>
//         <Divider sx={{ mx: 3, opacity: 0.5 }} />
//       </Box>
//     </Fade>
//   );
// }

// // ── Empty state ────────────────────────────────────────────────────────────────

// function EmptyState({ filter }) {
//   const messages = {
//     all: { title: 'All clear', sub: 'No notifications yet.' },
//     unread: { title: 'You\'re all caught up', sub: 'No unread notifications.' },
//     read: { title: 'Nothing read yet', sub: 'Mark notifications as read to see them here.' },
//   };
//   const m = messages[filter] || messages.all;
//   return (
//     <Box
//       sx={{
//         py: 10,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         gap: 1.5,
//       }}
//     >
//       <Box
//         sx={{
//           width: 64,
//           height: 64,
//           borderRadius: '18px',
//           bgcolor: 'action.hover',
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           mb: 0.5,
//         }}
//       >
//         <NotificationsNoneRoundedIcon sx={{ fontSize: 28, color: 'text.disabled' }} />
//       </Box>
//       <Typography variant="subtitle2" fontWeight={700} color="text.secondary">
//         {m.title}
//       </Typography>
//       <Typography variant="body2" color="text.disabled" fontSize={13}>
//         {m.sub}
//       </Typography>
//     </Box>
//   );
// }

// // ── Main page ──────────────────────────────────────────────────────────────────

// export default function NotificationsPage() {
//   const { t } = useTranslation();
//   const theme = useTheme();

//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [markingId, setMarkingId] = useState(null);
//   const [markingAll, setMarkingAll] = useState(false);
//   const [page, setPage] = useState(1);
//   const [lastPage, setLastPage] = useState(1);
//   const [total, setTotal] = useState(0);
//   const [filter, setFilter] = useState('all');

//   const fetchNotifications = useCallback(async (p = 1) => {
//     setLoading(true);
//     try {
//       const res = await api.get('/admin/notifications', { params: { page: p } });
//       const d = res.data.data;
//       setNotifications(d.data);
//       setLastPage(d.last_page);
//       setTotal(d.total);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => { fetchNotifications(page); }, [page, fetchNotifications]);

//   const handleMarkRead = async (id) => {
//     setMarkingId(id);
//     try {
//       await api.get(`/admin/notifications/mark-as-read/${id}`);
//       setNotifications((prev) =>
//         prev.map((n) =>
//           n.id === id
//             ? { ...n, read_at: new Date().toISOString().replace('T', ' ').slice(0, 19) }
//             : n
//         )
//       );
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setMarkingId(null);
//     }
//   };

//   const handleMarkAllRead = async () => {
//     setMarkingAll(true);
//     const unread = notifications.filter((n) => !n.read_at);
//     for (const n of unread) {
//       try {
//         await api.get(`/admin/notifications/mark-as-read/${n.id}`);
//       } catch (e) { /* skip */ }
//     }
//     setNotifications((prev) =>
//       prev.map((n) => ({
//         ...n,
//         read_at: n.read_at || new Date().toISOString().replace('T', ' ').slice(0, 19),
//       }))
//     );
//     setMarkingAll(false);
//   };

//   const filtered = notifications.filter((n) => {
//     if (filter === 'unread') return !n.read_at;
//     if (filter === 'read') return !!n.read_at;
//     return true;
//   });

//   const unreadCount = notifications.filter((n) => !n.read_at).length;

//   const FILTERS = [
//     { key: 'all', label: t('notifications.filter.all', 'All'), count: notifications.length },
//     { key: 'unread', label: t('notifications.filter.unread', 'Unread'), count: unreadCount },
//     { key: 'read', label: t('notifications.filter.read', 'Read'), count: notifications.length - unreadCount },
//   ];

//   return (
//     <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 800, mx: 'auto' }}>
//       <PageHeader
//         title={t('notifications.title', 'Notifications')}
//         subtitle={t('notifications.subtitle', 'Stay updated with the latest activity')}
//       />

//       <Paper
//         elevation={0}
//         sx={{
//           border: '1px solid',
//           borderColor: 'divider',
//           borderRadius: 3,
//           overflow: 'hidden',
//         }}
//       >
//         {/* ── Toolbar ── */}
//         <Stack
//           direction={{ xs: 'column', sm: 'row' }}
//           alignItems={{ xs: 'flex-start', sm: 'center' }}
//           justifyContent="space-between"
//           gap={1.5}
//           sx={{
//             px: 3,
//             py: 2,
//             borderBottom: '1px solid',
//             borderColor: 'divider',
//             bgcolor: theme.palette.mode === 'dark'
//               ? alpha('#fff', 0.02)
//               : alpha('#000', 0.015),
//           }}
//         >
//           {/* Left: icon + total */}
//           <Stack direction="row" alignItems="center" gap={1.5}>
//             <Badge
//               badgeContent={unreadCount}
//               color="error"
//               sx={{ '& .MuiBadge-badge': { fontSize: 10, minWidth: 18, height: 18 } }}
//             >
//               <Box
//                 sx={{
//                   width: 34,
//                   height: 34,
//                   borderRadius: '10px',
//                   bgcolor: 'action.selected',
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                 }}
//               >
//                 <NotificationsActiveRoundedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
//               </Box>
//             </Badge>
//             <Box>
//               <Typography variant="subtitle2" fontWeight={700} lineHeight={1.2}>
//                 {t('notifications.title', 'Notifications')}
//               </Typography>
//               <Typography variant="caption" color="text.disabled">
//                 {total} {t('notifications.total', 'total')}
//               </Typography>
//             </Box>
//           </Stack>

//           {/* Center: filter tabs */}
//           <Stack direction="row" gap={0.75}>
//             {FILTERS.map((f) => (
//               <Chip
//                 key={f.key}
//                 label={
//                   <Stack direction="row" alignItems="center" gap={0.6}>
//                     <span>{f.label}</span>
//                     <Box
//                       sx={{
//                         px: 0.7,
//                         py: 0.1,
//                         borderRadius: '5px',
//                         fontSize: 10,
//                         fontWeight: 700,
//                         lineHeight: 1.6,
//                         bgcolor: filter === f.key
//                           ? alpha('#fff', 0.25)
//                           : 'action.selected',
//                         color: filter === f.key ? 'inherit' : 'text.disabled',
//                         minWidth: 18,
//                         textAlign: 'center',
//                       }}
//                     >
//                       {f.count}
//                     </Box>
//                   </Stack>
//                 }
//                 onClick={() => setFilter(f.key)}
//                 size="small"
//                 variant={filter === f.key ? 'filled' : 'outlined'}
//                 color={filter === f.key ? 'primary' : 'default'}
//                 sx={{
//                   fontWeight: 600,
//                   fontSize: 12,
//                   borderRadius: '8px',
//                   height: 30,
//                   cursor: 'pointer',
//                 }}
//               />
//             ))}
//           </Stack>

//           {/* Right: mark all */}
//           {unreadCount > 0 && (
//             <Button
//               size="small"
//               startIcon={markingAll
//                 ? <CircularProgress size={12} color="inherit" />
//                 : <DoneAllRoundedIcon sx={{ fontSize: 16 }} />
//               }
//               onClick={handleMarkAllRead}
//               disabled={markingAll}
//               sx={{
//                 fontWeight: 600,
//                 fontSize: 12,
//                 borderRadius: '8px',
//                 textTransform: 'none',
//                 whiteSpace: 'nowrap',
//               }}
//             >
//               {t('notifications.markAllRead', 'Mark all read')}
//             </Button>
//           )}
//         </Stack>

//         {/* ── Content ── */}
//         {loading ? (
//           <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10, gap: 2 }}>
//             <CircularProgress size={28} />
//             <Typography variant="body2" color="text.disabled">Loading notifications…</Typography>
//           </Box>
//         ) : filtered.length === 0 ? (
//           <EmptyState filter={filter} />
//         ) : (
//           <List disablePadding>
//             {filtered.map((n) => (
//               <NotificationRow
//                 key={n.id}
//                 notif={n}
//                 onMarkRead={handleMarkRead}
//                 marking={markingId === n.id}
//               />
//             ))}
//           </List>
//         )}

//         {/* ── Pagination ── */}
//         {lastPage > 1 && (
//           <Box
//             sx={{
//               display: 'flex',
//               justifyContent: 'center',
//               py: 2.5,
//               borderTop: '1px solid',
//               borderColor: 'divider',
//             }}
//           >
//             <Pagination
//               count={lastPage}
//               page={page}
//               onChange={(_, v) => { setPage(v); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
//               color="primary"
//               shape="rounded"
//               size="small"
//             />
//           </Box>
//         )}
//       </Paper>
//     </Box>
//   );
// }

// src/pages/NotificationsPage.jsx
// import React, { useState, useEffect, useCallback } from 'react';
// import {
//   Box,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   IconButton,
//   Button,
//   Chip,
//   Divider,
//   CircularProgress,
//   Tooltip,
//   Paper,
//   Stack,
//   Badge,
//   Pagination,
//   alpha,
//   useTheme,
//   Fade,
//   Skeleton,
// } from '@mui/material';

// import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
// import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
// import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
// import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
// import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
// import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
// import MarkEmailUnreadRoundedIcon from '@mui/icons-material/MarkEmailUnreadRounded';
// import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
// import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';

// import { useTranslation } from 'react-i18next';
// import api from '../utils/axiosInstance';
// import PageHeader from '../components/PageHeader';

// // ── helpers ────────────────────────────────────────────────────────────────────

// const TYPE_CONFIG = {
//   new_order: {
//     icon: <ShoppingCartRoundedIcon sx={{ fontSize: 18 }} />,
//     color: '#6366f1',
//     bg: 'rgba(99,102,241,0.10)',
//     label: 'New Order',
//   },
// };

// const DEFAULT_CONFIG = {
//   icon: <NotificationsNoneRoundedIcon sx={{ fontSize: 18 }} />,
//   color: '#64748b',
//   bg: 'rgba(100,116,139,0.10)',
//   label: 'System',
// };

// const getConfig = (type) => TYPE_CONFIG[type] || DEFAULT_CONFIG;

// function parseDate(dateStr) {
//   if (!dateStr) return null;

//   const value = String(dateStr);
//   const normalized = value.includes('T') ? value : value.replace(' ', 'T');
//   const hasTimezone = normalized.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(normalized);

//   const date = new Date(hasTimezone ? normalized : `${normalized}Z`);
//   return isNaN(date.getTime()) ? null : date;
// }

// function timeAgo(dateStr) {
//   const date = parseDate(dateStr);

//   if (!date) return dateStr || null;

//   const diff = Math.floor((Date.now() - date.getTime()) / 1000);

//   if (diff < 60) return 'Just now';
//   if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
//   if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
//   if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

//   return new Intl.DateTimeFormat('en-GB', {
//     day: '2-digit',
//     month: 'short',
//     year: 'numeric',
//   }).format(date);
// }

// function getNotificationTime(notif) {
//   return notif.created_at || notif.createdAt || notif.read_at || null;
// }

// // ── Loading state ──────────────────────────────────────────────────────────────

// function LoadingState() {
//   return (
//     <Box sx={{ px: { xs: 2, sm: 3 }, py: 2 }}>
//       {[1, 2, 3, 4, 5].map((item) => (
//         <Stack
//           key={item}
//           direction="row"
//           spacing={2}
//           alignItems="flex-start"
//           sx={{
//             py: 2,
//             borderBottom: item !== 5 ? '1px solid' : 'none',
//             borderColor: 'divider',
//           }}
//         >
//           <Skeleton
//             variant="rounded"
//             width={46}
//             height={46}
//             sx={{ borderRadius: 3, flexShrink: 0 }}
//           />

//           <Box sx={{ flex: 1 }}>
//             <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1 }}>
//               <Skeleton variant="text" width="36%" height={22} />
//               <Skeleton variant="rounded" width={68} height={22} sx={{ borderRadius: 2 }} />
//             </Stack>

//             <Skeleton variant="text" width="92%" height={18} />
//             <Skeleton variant="text" width="58%" height={18} />

//             <Skeleton variant="text" width={90} height={18} sx={{ mt: 0.5 }} />
//           </Box>

//           <Skeleton
//             variant="rounded"
//             width={34}
//             height={34}
//             sx={{ borderRadius: 2, flexShrink: 0 }}
//           />
//         </Stack>
//       ))}
//     </Box>
//   );
// }

// // ── Stat item ──────────────────────────────────────────────────────────────────

// function StatBox({ icon, label, value, color }) {
//   const theme = useTheme();

//   return (
//     <Paper
//       elevation={0}
//       sx={{
//         p: 1.6,
//         borderRadius: 3,
//         minWidth: { xs: '100%', sm: 150 },
//         flex: 1,
//         border: '1px solid',
//         borderColor: alpha(color, theme.palette.mode === 'dark' ? 0.25 : 0.18),
//         bgcolor:
//           theme.palette.mode === 'dark'
//             ? alpha(color, 0.08)
//             : alpha(color, 0.055),
//       }}
//     >
//       <Stack direction="row" alignItems="center" spacing={1.4}>
//         <Box
//           sx={{
//             width: 34,
//             height: 34,
//             borderRadius: 2.2,
//             display: 'flex',
//             alignItems: 'center',
//             justifyContent: 'center',
//             bgcolor: alpha(color, 0.14),
//             color,
//             flexShrink: 0,
//           }}
//         >
//           {icon}
//         </Box>

//         <Box sx={{ minWidth: 0 }}>
//           <Typography
//             variant="caption"
//             color="text.secondary"
//             sx={{
//               display: 'block',
//               fontWeight: 700,
//               lineHeight: 1.2,
//               mb: 0.25,
//             }}
//           >
//             {label}
//           </Typography>

//           <Typography
//             variant="h6"
//             fontWeight={900}
//             sx={{
//               lineHeight: 1,
//               letterSpacing: -0.4,
//             }}
//           >
//             {value}
//           </Typography>
//         </Box>
//       </Stack>
//     </Paper>
//   );
// }

// // ── Single row ─────────────────────────────────────────────────────────────────

// function NotificationRow({ notif, onMarkRead, marking, isRtl }) {
//   const theme = useTheme();
//   const isUnread = !notif.read_at;
//   const cfg = getConfig(notif.type);
//   const isDark = theme.palette.mode === 'dark';

//   const displayTime = isUnread
//     ? timeAgo(getNotificationTime(notif)) || 'Unread'
//     : `Read · ${timeAgo(notif.read_at) || ''}`;

//   return (
//     <Fade in timeout={260}>
//       <Box>
//         <ListItem
//           alignItems="flex-start"
//           sx={{
//             gap: { xs: 1.4, sm: 2 },
//             px: { xs: 2, sm: 3 },
//             py: { xs: 2, sm: 2.3 },
//             position: 'relative',
//             overflow: 'hidden',
//             transition: 'all 0.22s ease',
//             bgcolor: isUnread
//               ? isDark
//                 ? alpha(cfg.color, 0.095)
//                 : alpha(cfg.color, 0.045)
//               : 'transparent',

//             '&:hover': {
//               bgcolor: isDark ? alpha(cfg.color, 0.14) : alpha(cfg.color, 0.075),
//             },

//             '&::before': isUnread
//               ? {
//                   content: '""',
//                   position: 'absolute',
//                   left: isRtl ? 'auto' : 0,
//                   right: isRtl ? 0 : 'auto',
//                   top: 16,
//                   bottom: 16,
//                   width: 4,
//                   borderRadius: isRtl ? '4px 0 0 4px' : '0 4px 4px 0',
//                   bgcolor: cfg.color,
//                 }
//               : {},
//           }}
//         >
//           {/* Icon bubble */}
//           <Box
//             sx={{
//               width: 46,
//               height: 46,
//               borderRadius: 3,
//               bgcolor: cfg.bg,
//               color: cfg.color,
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               flexShrink: 0,
//               mt: 0.15,
//               border: `1px solid ${alpha(cfg.color, isDark ? 0.28 : 0.18)}`,
//               boxShadow: isUnread
//                 ? `0 10px 26px ${alpha(cfg.color, isDark ? 0.1 : 0.12)}`
//                 : 'none',
//             }}
//           >
//             {cfg.icon}
//           </Box>

//           {/* Text */}
//           <ListItemText
//             sx={{ my: 0, minWidth: 0 }}
//             primary={
//               <Stack
//                 direction="row"
//                 alignItems="center"
//                 gap={1}
//                 flexWrap="wrap"
//                 sx={{ mb: 0.45 }}
//               >
//                 <Typography
//                   variant="body2"
//                   fontWeight={isUnread ? 900 : 700}
//                   color={isUnread ? 'text.primary' : 'text.secondary'}
//                   lineHeight={1.45}
//                   sx={{
//                     letterSpacing: -0.1,
//                     maxWidth: '100%',
//                   }}
//                 >
//                   {notif.title || 'Untitled notification'}
//                 </Typography>

//                 <Chip
//                   label={cfg.label}
//                   size="small"
//                   sx={{
//                     fontSize: 10.5,
//                     height: 21,
//                     bgcolor: cfg.bg,
//                     color: cfg.color,
//                     fontWeight: 800,
//                     borderRadius: 1.5,
//                     border: `1px solid ${alpha(cfg.color, 0.2)}`,
//                     letterSpacing: 0.25,
//                     '& .MuiChip-label': {
//                       px: 0.9,
//                     },
//                   }}
//                 />

//                 {isUnread && (
//                   <Chip
//                     label="Unread"
//                     size="small"
//                     sx={{
//                       fontSize: 10.5,
//                       height: 21,
//                       bgcolor: alpha('#ef4444', isDark ? 0.12 : 0.09),
//                       color: '#ef4444',
//                       fontWeight: 800,
//                       borderRadius: 1.5,
//                       border: `1px solid ${alpha('#ef4444', 0.18)}`,
//                       '& .MuiChip-label': {
//                         px: 0.9,
//                       },
//                     }}
//                   />
//                 )}
//               </Stack>
//             }
//             secondary={
//               <Stack spacing={0.85}>
//                 <Typography
//                   variant="body2"
//                   color="text.secondary"
//                   fontSize={13.5}
//                   lineHeight={1.7}
//                   sx={{
//                     maxWidth: 660,
//                     wordBreak: 'break-word',
//                   }}
//                 >
//                   {notif.body || 'No additional details provided.'}
//                 </Typography>

//                 <Stack direction="row" alignItems="center" gap={0.8} flexWrap="wrap">
//                   <AccessTimeRoundedIcon
//                     sx={{
//                       fontSize: 14,
//                       color: isUnread ? cfg.color : 'text.disabled',
//                     }}
//                   />

//                   <Typography
//                     variant="caption"
//                     color={isUnread ? 'text.secondary' : 'text.disabled'}
//                     fontSize={11.5}
//                     fontWeight={isUnread ? 700 : 500}
//                   >
//                     {displayTime}
//                   </Typography>
//                 </Stack>
//               </Stack>
//             }
//           />

//           {/* Action */}
//           {isUnread && (
//             <Tooltip title="Mark as read" placement={isRtl ? 'right' : 'left'}>
//               <span>
//                 <IconButton
//                   size="small"
//                   onClick={() => onMarkRead(notif.id)}
//                   disabled={marking}
//                   sx={{
//                     color: cfg.color,
//                     bgcolor: cfg.bg,
//                     borderRadius: 2,
//                     width: 36,
//                     height: 36,
//                     flexShrink: 0,
//                     border: `1px solid ${alpha(cfg.color, 0.18)}`,
//                     transition: 'all 0.2s ease',
//                     '&:hover': {
//                       bgcolor: alpha(cfg.color, 0.18),
//                       transform: 'translateY(-1px)',
//                     },
//                     '&:disabled': {
//                       opacity: 0.45,
//                     },
//                   }}
//                 >
//                   {marking ? (
//                     <CircularProgress size={15} color="inherit" />
//                   ) : (
//                     <DoneRoundedIcon sx={{ fontSize: 17 }} />
//                   )}
//                 </IconButton>
//               </span>
//             </Tooltip>
//           )}
//         </ListItem>

//         <Divider
//           sx={{
//             mx: { xs: 2, sm: 3 },
//             opacity: 0.55,
//           }}
//         />
//       </Box>
//     </Fade>
//   );
// }

// // ── Empty state ────────────────────────────────────────────────────────────────

// function EmptyState({ filter }) {
//   const theme = useTheme();

//   const messages = {
//     all: {
//       title: 'All clear',
//       sub: 'No notifications yet. New system activity will appear here.',
//     },
//     unread: {
//       title: 'You are all caught up',
//       sub: 'There are no unread notifications right now.',
//     },
//     read: {
//       title: 'Nothing read yet',
//       sub: 'After marking notifications as read, they will appear here.',
//     },
//   };

//   const m = messages[filter] || messages.all;

//   return (
//     <Box
//       sx={{
//         py: { xs: 8, sm: 10 },
//         px: 2,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         textAlign: 'center',
//         gap: 1.4,
//       }}
//     >
//       <Box
//         sx={{
//           width: 78,
//           height: 78,
//           borderRadius: 5,
//           bgcolor:
//             theme.palette.mode === 'dark'
//               ? alpha(theme.palette.primary.main, 0.12)
//               : alpha(theme.palette.primary.main, 0.08),
//           border: '1px solid',
//           borderColor: alpha(theme.palette.primary.main, 0.14),
//           display: 'flex',
//           alignItems: 'center',
//           justifyContent: 'center',
//           mb: 0.5,
//         }}
//       >
//         <InboxRoundedIcon
//           sx={{
//             fontSize: 34,
//             color: 'primary.main',
//           }}
//         />
//       </Box>

//       <Typography variant="subtitle1" fontWeight={900} color="text.primary">
//         {m.title}
//       </Typography>

//       <Typography
//         variant="body2"
//         color="text.secondary"
//         fontSize={13.5}
//         sx={{ maxWidth: 340, lineHeight: 1.7 }}
//       >
//         {m.sub}
//       </Typography>
//     </Box>
//   );
// }

// // ── Main page ──────────────────────────────────────────────────────────────────

// export default function NotificationsPage() {
//   const { t, i18n } = useTranslation();
//   const theme = useTheme();

//   const isRtl = i18n.dir() === 'rtl';
//   const isDark = theme.palette.mode === 'dark';

//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [markingId, setMarkingId] = useState(null);
//   const [markingAll, setMarkingAll] = useState(false);
//   const [page, setPage] = useState(1);
//   const [lastPage, setLastPage] = useState(1);
//   const [total, setTotal] = useState(0);
//   const [filter, setFilter] = useState('all');
// const [totalUnread, setTotalUnread] = useState(0);
//   const [totalRead, setTotalRead]     = useState(0);

//   const fetchNotifications = useCallback(async (p = 1, currentFilter = filter) => {
//     setLoading(true);

//     const params = { page: p };
//     if (currentFilter === 'unread') params.is_read = 0;
//     if (currentFilter === 'read')   params.is_read = 1;

//     try {
//       const res = await api.get('/admin/notifications', { params });
//       const d = res.data.data;

//       setNotifications(d.data);
//       setLastPage(d.last_page);
//       setTotal(d.total);
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setLoading(false);
//     }
//   }, []);
// const fetchCounts = useCallback(async () => {
//     try {
//       const [unreadRes, readRes] = await Promise.all([
//         api.get('/admin/notifications', { params: { page: 1, is_read: 0 } }),
//         api.get('/admin/notifications', { params: { page: 1, is_read: 1 } }),
//       ]);
//       setTotalUnread(unreadRes.data.data.total);
//       setTotalRead(readRes.data.data.total);
//     } catch (e) { console.error(e); }
//   }, []);
//   useEffect(() => { fetchCounts(); }, [fetchCounts]);
//  useEffect(() => {
//     setPage(1);
//     fetchNotifications(1, filter);
//   }, [filter]);                          // ← عند تغيير الفلتر: روح صفحة 1

//   useEffect(() => {
//     fetchNotifications(page, filter);
//   }, [page]);                            // ← عند تغيير الصفحة فقط

//   const handleMarkRead = async (id) => {
//     setMarkingId(id);

//     try {
//       await api.get(`/admin/notifications/mark-as-read/${id}`);

//       setNotifications((prev) =>
//         prev.map((n) =>
//           n.id === id
//             ? {
//                 ...n,
//                 read_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
//               }
//             : n
//         )
//       );
//       fetchCounts(); // ← أضف هاد
//     } catch (e) {
//       console.error(e);
//     } finally {
//       setMarkingId(null);
//     }
//   };

//   const handleMarkAllRead = async () => {
//     setMarkingAll(true);

//     const unread = notifications.filter((n) => !n.read_at);

//     for (const n of unread) {
//       try {
//         await api.get(`/admin/notifications/mark-as-read/${n.id}`);
//       } catch (e) {
//         // skip
//       }
//     }

//     setNotifications((prev) =>
//       prev.map((n) => ({
//         ...n,
//         read_at:
//           n.read_at || new Date().toISOString().replace('T', ' ').slice(0, 19),
//       }))
//     );

//     setMarkingAll(false);
//         fetchCounts(); // ← أضف هاد في آخر الدالة

//   };

//  const filtered = notifications;

//   const unreadCount = totalUnread;
//   const readCount   = totalRead;

//   const FILTERS = [
//     {
//       key: 'all',
//       label: t('notifications.filter.all', 'All'),
//       count: notifications.length,
//       icon: <NotificationsNoneRoundedIcon sx={{ fontSize: 15 }} />,
//     },
//     {
//       key: 'unread',
//       label: t('notifications.filter.unread', 'Unread'),
//       count: unreadCount,
//       icon: <MarkEmailUnreadRoundedIcon sx={{ fontSize: 15 }} />,
//     },
//     {
//       key: 'read',
//       label: t('notifications.filter.read', 'Read'),
//       count: readCount,
//       icon: <MarkEmailReadRoundedIcon sx={{ fontSize: 15 }} />,
//     },
//   ];

//   return (
//     <Box
//       sx={{
//         p: { xs: 2, md: 4 },
//         maxWidth: 980,
//         mx: 'auto',
//         direction: isRtl ? 'rtl' : 'ltr',
//       }}
//     >
//       <PageHeader
//         title={t('notifications.title', 'Notifications')}
//         subtitle={t(
//           'notifications.subtitle',
//           'Stay updated with the latest activity'
//         )}
//       />

//       {/* Top summary */}
//       <Paper
//         elevation={0}
//         sx={{
//           mb: 2.5,
//           p: { xs: 2, sm: 2.4 },
//           borderRadius: 4,
//           overflow: 'hidden',
//           position: 'relative',
//           border: '1px solid',
//           borderColor: 'divider',
//           bgcolor: 'background.paper',
//           boxShadow: isDark
//             ? '0 22px 60px rgba(0,0,0,0.24)'
//             : '0 18px 55px rgba(15,23,42,0.07)',

//           '&::before': {
//             content: '""',
//             position: 'absolute',
//             inset: 0,
//             pointerEvents: 'none',
//             background: isDark
//               ? `radial-gradient(circle at top ${isRtl ? 'right' : 'left'}, ${alpha(
//                   theme.palette.primary.main,
//                   0.18
//                 )}, transparent 34%)`
//               : `radial-gradient(circle at top ${isRtl ? 'right' : 'left'}, ${alpha(
//                   theme.palette.primary.main,
//                   0.12
//                 )}, transparent 34%)`,
//           },
//         }}
//       >
//         <Stack
//           direction={{ xs: 'column', md: 'row' }}
//           alignItems={{ xs: 'stretch', md: 'center' }}
//           justifyContent="space-between"
//           spacing={2}
//           sx={{ position: 'relative', zIndex: 1 }}
//         >
//           <Stack direction="row" spacing={1.7} alignItems="center">
//             <Badge
//               badgeContent={unreadCount}
//               color="error"
//               sx={{
//                 '& .MuiBadge-badge': {
//                   fontSize: 10,
//                   minWidth: 19,
//                   height: 19,
//                   fontWeight: 800,
//                 },
//               }}
//             >
//               <Box
//                 sx={{
//                   width: 54,
//                   height: 54,
//                   borderRadius: 4,
//                   display: 'flex',
//                   alignItems: 'center',
//                   justifyContent: 'center',
//                   color: 'primary.main',
//                   bgcolor: alpha(theme.palette.primary.main, isDark ? 0.14 : 0.1),
//                   border: '1px solid',
//                   borderColor: alpha(theme.palette.primary.main, 0.16),
//                 }}
//               >
//                 <NotificationsActiveRoundedIcon sx={{ fontSize: 27 }} />
//               </Box>
//             </Badge>

//             <Box>
//               <Typography
//                 variant="h6"
//                 fontWeight={950}
//                 sx={{
//                   letterSpacing: -0.4,
//                   lineHeight: 1.15,
//                 }}
//               >
//                 {t('notifications.title', 'Notifications Center')}
//               </Typography>

//               <Typography
//                 variant="body2"
//                 color="text.secondary"
//                 sx={{ mt: 0.45, lineHeight: 1.6 }}
//               >
//                 {unreadCount > 0
//                   ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
//                   : t('notifications.allCaughtUp', 'Everything is up to date')}
//               </Typography>
//             </Box>
//           </Stack>

//           <Stack
//             direction={{ xs: 'column', sm: 'row' }}
//             spacing={1.2}
//             sx={{ minWidth: { md: 470 } }}
//           >
//             <StatBox
//               icon={<NotificationsNoneRoundedIcon sx={{ fontSize: 18 }} />}
//               label={t('notifications.total', 'Total')}
//               value={total}
//               color={theme.palette.primary.main}
//             />

//             <StatBox
//               icon={<MarkEmailUnreadRoundedIcon sx={{ fontSize: 18 }} />}
//               label={t('notifications.filter.unread', 'Unread')}
//               value={unreadCount}
//               color="#ef4444"
//             />

//             <StatBox
//               icon={<MarkEmailReadRoundedIcon sx={{ fontSize: 18 }} />}
//               label={t('notifications.filter.read', 'Read')}
//               value={readCount}
//               color="#22c55e"
//             />
//           </Stack>
//         </Stack>
//       </Paper>

//       <Paper
//         elevation={0}
//         sx={{
//           border: '1px solid',
//           borderColor: 'divider',
//           borderRadius: 4,
//           overflow: 'hidden',
//           bgcolor: 'background.paper',
//           boxShadow: isDark
//             ? '0 20px 70px rgba(0,0,0,0.22)'
//             : '0 18px 55px rgba(15,23,42,0.07)',
//         }}
//       >
//         {/* Toolbar */}
//         <Stack
//           direction={{ xs: 'column', md: 'row' }}
//           alignItems={{ xs: 'stretch', md: 'center' }}
//           justifyContent="space-between"
//           gap={1.5}
//           sx={{
//             px: { xs: 2, sm: 3 },
//             py: 2,
//             borderBottom: '1px solid',
//             borderColor: 'divider',
//             bgcolor: isDark ? alpha('#fff', 0.025) : alpha('#020617', 0.015),
//           }}
//         >
//           <Stack
//             direction="row"
//             alignItems="center"
//             spacing={1.2}
//             sx={{ minWidth: 0 }}
//           >
//             <Box
//               sx={{
//                 width: 38,
//                 height: 38,
//                 borderRadius: 2.5,
//                 bgcolor: 'action.selected',
//                 display: 'flex',
//                 alignItems: 'center',
//                 justifyContent: 'center',
//                 flexShrink: 0,
//               }}
//             >
//               <InboxRoundedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
//             </Box>

//             <Box sx={{ minWidth: 0 }}>
//               <Typography
//                 variant="subtitle2"
//                 fontWeight={900}
//                 sx={{
//                   lineHeight: 1.2,
//                   letterSpacing: -0.1,
//                 }}
//               >
//                 {t('notifications.inbox', 'Notification inbox')}
//               </Typography>

//               <Typography variant="caption" color="text.disabled">
//                 {filtered.length} shown from {total} total
//               </Typography>
//             </Box>
//           </Stack>

//           <Stack
//             direction={{ xs: 'column', sm: 'row' }}
//             alignItems={{ xs: 'stretch', sm: 'center' }}
//             justifyContent="space-between"
//             gap={1}
//           >
//             <Stack
//               direction="row"
//               gap={0.75}
//               flexWrap="wrap"
//               sx={{
//                 p: 0.5,
//                 borderRadius: 3,
//                 bgcolor: 'action.hover',
//                 border: '1px solid',
//                 borderColor: 'divider',
//               }}
//             >
//               {FILTERS.map((f) => {
//                 const active = filter === f.key;

//                 return (
//                   <Chip
//                     key={f.key}
//                     icon={f.icon}
//                     label={
//                       <Stack direction="row" alignItems="center" gap={0.7}>
//                         <span>{f.label}</span>

//                         <Box
//                           sx={{
//                             px: 0.75,
//                             py: 0.1,
//                             borderRadius: 1.4,
//                             fontSize: 10,
//                             fontWeight: 900,
//                             lineHeight: 1.6,
//                             bgcolor: active
//                               ? alpha('#fff', isDark ? 0.16 : 0.25)
//                               : 'background.paper',
//                             color: active ? 'inherit' : 'text.secondary',
//                             minWidth: 19,
//                             textAlign: 'center',
//                             boxShadow: active ? 'none' : '0 1px 2px rgba(15,23,42,0.06)',
//                           }}
//                         >
//                           {f.count}
//                         </Box>
//                       </Stack>
//                     }
//                     onClick={() => setFilter(f.key)}
//                     size="small"
//                     variant={active ? 'filled' : 'outlined'}
//                     color={active ? 'primary' : 'default'}
//                     sx={{
//                       fontWeight: 800,
//                       fontSize: 12,
//                       borderRadius: 2,
//                       height: 32,
//                       cursor: 'pointer',
//                       borderColor: active ? 'transparent' : 'divider',
//                       transition: 'all 0.2s ease',
//                       '& .MuiChip-icon': {
//                         ml: isRtl ? 0 : 1,
//                         mr: isRtl ? 1 : -0.2,
//                       },
//                     }}
//                   />
//                 );
//               })}
//             </Stack>

//             {unreadCount > 0 && (
//               <Button
//                 size="small"
//                 variant="contained"
//                 disableElevation
//                 startIcon={
//                   markingAll ? (
//                     <CircularProgress size={14} color="inherit" />
//                   ) : (
//                     <DoneAllRoundedIcon sx={{ fontSize: 17 }} />
//                   )
//                 }
//                 onClick={handleMarkAllRead}
//                 disabled={markingAll}
//                 sx={{
//                   fontWeight: 850,
//                   fontSize: 12.5,
//                   borderRadius: 2.3,
//                   textTransform: 'none',
//                   whiteSpace: 'nowrap',
//                   px: 1.8,
//                   height: 36,
//                   boxShadow: `0 10px 24px ${alpha(
//                     theme.palette.primary.main,
//                     isDark ? 0.18 : 0.22
//                   )}`,
//                   '& .MuiButton-startIcon': {
//                     ml: isRtl ? 0.5 : -0.3,
//                     mr: isRtl ? -0.3 : 0.8,
//                   },
//                 }}
//               >
//                 {t('notifications.markAllRead', 'Mark all read')}
//               </Button>
//             )}
//           </Stack>
//         </Stack>

//         {/* Content */}
//         {loading ? (
//           <LoadingState />
//         ) : filtered.length === 0 ? (
//           <EmptyState filter={filter} />
//         ) : (
//           <List disablePadding>
//             {filtered.map((n) => (
//               <NotificationRow
//                 key={n.id}
//                 notif={n}
//                 onMarkRead={handleMarkRead}
//                 marking={markingId === n.id}
//                 isRtl={isRtl}
//               />
//             ))}
//           </List>
//         )}

//         {/* Pagination */}
//         {lastPage > 1 && (
//           <Box
//             sx={{
//               display: 'flex',
//               justifyContent: 'center',
//               py: 2.5,
//               px: 2,
//               borderTop: '1px solid',
//               borderColor: 'divider',
//               bgcolor: isDark ? alpha('#fff', 0.018) : alpha('#020617', 0.012),
//             }}
//           >
//             <Pagination
//               count={lastPage}
//               page={page}
//               onChange={(_, v) => {
//                 setPage(v);
//                 window.scrollTo({ top: 0, behavior: 'smooth' });
//               }}
//               color="primary"
//               shape="rounded"
//               size="small"
//               sx={{
//                 '& .MuiPaginationItem-root': {
//                   fontWeight: 800,
//                   borderRadius: 2,
//                 },
//               }}
//             />
//           </Box>
//         )}
//       </Paper>
//     </Box>
//   );
// }

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Tooltip,
  Paper,
  Stack,
  Badge,
  Pagination,
  alpha,
  useTheme,
  Fade,
  Skeleton,
} from '@mui/material';

import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import MarkEmailUnreadRoundedIcon from '@mui/icons-material/MarkEmailUnreadRounded';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';

import { useTranslation } from 'react-i18next';
import api from '../utils/axiosInstance';
import PageHeader from '../components/PageHeader';

// ── helpers ────────────────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  new_order: {
    icon: <ShoppingCartRoundedIcon sx={{ fontSize: 18 }} />,
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.08)',
    label: 'New Order',
  },
};

const DEFAULT_CONFIG = {
  icon: <NotificationsNoneRoundedIcon sx={{ fontSize: 18 }} />,
  color: '#64748b',
  bg: 'rgba(100,116,139,0.08)',
  label: 'System',
};

const getConfig = (type) => TYPE_CONFIG[type] || DEFAULT_CONFIG;

function parseDate(dateStr) {
  if (!dateStr) return null;

  const value = String(dateStr);
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const hasTimezone = normalized.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(normalized);

  const date = new Date(hasTimezone ? normalized : `${normalized}Z`);
  return isNaN(date.getTime()) ? null : date;
}

function timeAgo(dateStr) {
  const date = parseDate(dateStr);

  if (!date) return dateStr || null;

  const diff = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function getNotificationTime(notif) {
  return notif.created_at || notif.createdAt || notif.read_at || null;
}

// ── Loading state ──────────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <Box sx={{ px: { xs: 2.5, sm: 4 }, py: 3 }}>
      {[1, 2, 3, 4, 5].map((item) => (
        <Stack
          key={item}
          direction="row"
          spacing={2.5}
          alignItems="flex-start"
          sx={{
            py: 3,
            borderBottom: item !== 5 ? '1px solid' : 'none',
            borderColor: 'divider',
          }}
        >
          <Skeleton
            variant="rounded"
            width={48}
            height={48}
            sx={{ borderRadius: 3, flexShrink: 0 }}
          />

          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
              <Skeleton variant="text" width="40%" height={24} />
              <Skeleton variant="rounded" width={75} height={22} sx={{ borderRadius: 2 }} />
            </Stack>

            <Skeleton variant="text" width="95%" height={20} />
            <Skeleton variant="text" width="60%" height={20} />

            <Skeleton variant="text" width={100} height={18} sx={{ mt: 1 }} />
          </Box>

          <Skeleton
            variant="rounded"
            width={36}
            height={36}
            sx={{ borderRadius: 2, flexShrink: 0 }}
          />
        </Stack>
      ))}
    </Box>
  );
}

// ── Stat item ──────────────────────────────────────────────────────────────────

function StatBox({ icon, label, value, color }) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3.5,
        minWidth: { xs: '100%', sm: 150 },
        flex: 1,
        border: '1px solid',
        borderColor: alpha(color, theme.palette.mode === 'dark' ? 0.2 : 0.12),
        bgcolor:
          theme.palette.mode === 'dark'
            ? alpha(color, 0.05)
            : alpha(color, 0.03),
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: `0 12px 24px -10px ${alpha(color, 0.15)}`,
          borderColor: alpha(color, 0.35),
        }
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.8}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(color, 0.1),
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              fontSize: 10,
              lineHeight: 1.2,
              mb: 0.5,
            }}
          >
            {label}
          </Typography>

          <Typography
            variant="h5"
            fontWeight={900}
            sx={{
              lineHeight: 1,
              letterSpacing: -0.5,
            }}
          >
            {value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

// ── Single row ─────────────────────────────────────────────────────────────────

function NotificationRow({ notif, onMarkRead, marking, isRtl }) {
  const theme = useTheme();
  const isUnread = !notif.read_at;
  const cfg = getConfig(notif.type);
  const isDark = theme.palette.mode === 'dark';

  const displayTime = isUnread
    ? timeAgo(getNotificationTime(notif)) || 'Unread'
    : `Read · ${timeAgo(notif.read_at) || ''}`;

  return (
    <Fade in timeout={260}>
      <Box>
        <ListItem
          alignItems="flex-start"
          sx={{
            gap: { xs: 2, sm: 2.5 },
            px: { xs: 2.5, sm: 4 },
            py: { xs: 2.5, sm: 3 },
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
            bgcolor: isUnread
              ? isDark
                ? alpha(cfg.color, 0.05)
                : alpha(cfg.color, 0.02)
              : 'transparent',

            '&:hover': {
              bgcolor: isDark ? alpha(cfg.color, 0.08) : alpha(cfg.color, 0.04),
            },

            '&::before': isUnread
              ? {
                  content: '""',
                  position: 'absolute',
                  left: isRtl ? 'auto' : 0,
                  right: isRtl ? 0 : 'auto',
                  top: 0,
                  bottom: 0,
                  width: 4.5,
                  bgcolor: cfg.color,
                }
              : {},
          }}
        >
          {/* Icon bubble */}
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 3,
              bgcolor: cfg.bg,
              color: cfg.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: `1px solid ${alpha(cfg.color, isDark ? 0.2 : 0.12)}`,
              boxShadow: isUnread
                ? `0 8px 20px ${alpha(cfg.color, isDark ? 0.08 : 0.06)}`
                : 'none',
            }}
          >
            {cfg.icon}
          </Box>

          {/* Text */}
          <ListItemText
            sx={{ my: 0, minWidth: 0 }}
            primary={
              <Stack
                direction="row"
                alignItems="center"
                gap={1.2}
                flexWrap="wrap"
                sx={{ mb: 0.8 }}
              >
                <Typography
                  variant="body1"
                  fontWeight={isUnread ? 800 : 600}
                  color={isUnread ? 'text.primary' : 'text.secondary'}
                  lineHeight={1.4}
                  sx={{
                    letterSpacing: -0.15,
                    maxWidth: '100%',
                  }}
                >
                  {notif.title || 'Untitled notification'}
                </Typography>

                <Chip
                  label={cfg.label}
                  size="small"
                  sx={{
                    fontSize: 10,
                    height: 20,
                    bgcolor: cfg.bg,
                    color: cfg.color,
                    fontWeight: 800,
                    borderRadius: 1.5,
                    border: `1px solid ${alpha(cfg.color, 0.15)}`,
                    letterSpacing: 0.2,
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />

                {isUnread && (
                  <Chip
                    label="Unread"
                    size="small"
                    sx={{
                      fontSize: 10,
                      height: 20,
                      bgcolor: alpha('#ef4444', isDark ? 0.1 : 0.06),
                      color: '#ef4444',
                      fontWeight: 800,
                      borderRadius: 1.5,
                      border: `1px solid ${alpha('#ef4444', 0.15)}`,
                      '& .MuiChip-label': {
                        px: 1,
                      },
                    }}
                  />
                )}
              </Stack>
            }
            secondary={
              <Stack spacing={1.2}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontSize={13.5}
                  lineHeight={1.6}
                  sx={{
                    maxWidth: 720,
                    wordBreak: 'break-word',
                  }}
                >
                  {notif.body || 'No additional details provided.'}
                </Typography>

                <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                  <AccessTimeRoundedIcon
                    sx={{
                      fontSize: 14,
                      color: isUnread ? cfg.color : 'text.disabled',
                    }}
                  />

                  <Typography
                    variant="caption"
                    color={isUnread ? 'text.secondary' : 'text.disabled'}
                    fontSize={11.5}
                    fontWeight={isUnread ? 700 : 500}
                  >
                    {displayTime}
                  </Typography>
                </Stack>
              </Stack>
            }
          />

          {/* Action */}
          {isUnread && (
            <Tooltip title="Mark as read" placement={isRtl ? 'right' : 'left'}>
              <span>
                <IconButton
                  size="small"
                  onClick={() => onMarkRead(notif.id)}
                  disabled={marking}
                  sx={{
                    color: cfg.color,
                    bgcolor: cfg.bg,
                    borderRadius: 2.2,
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    border: `1px solid ${alpha(cfg.color, 0.15)}`,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: alpha(cfg.color, 0.16),
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${alpha(cfg.color, 0.15)}`,
                    },
                    '&:disabled': {
                      opacity: 0.4,
                    },
                  }}
                >
                  {marking ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <DoneRoundedIcon sx={{ fontSize: 18 }} />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          )}
        </ListItem>

        <Divider
          sx={{
            mx: { xs: 2.5, sm: 4 },
            opacity: 0.4,
          }}
        />
      </Box>
    </Fade>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyState({ filter }) {
  const theme = useTheme();

  const messages = {
    all: {
      title: 'All clear',
      sub: 'No notifications yet. New system activity will appear here.',
    },
    unread: {
      title: 'You are all caught up',
      sub: 'There are no unread notifications right now.',
    },
    read: {
      title: 'Nothing read yet',
      sub: 'After marking notifications as read, they will appear here.',
    },
  };

  const m = messages[filter] || messages.all;

  return (
    <Box
      sx={{
        py: { xs: 10, sm: 12 },
        px: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 84,
          height: 84,
          borderRadius: 4.5,
          bgcolor:
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.primary.main, 0.08)
              : alpha(theme.palette.primary.main, 0.05),
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.12),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 1,
          boxShadow: `0 12px 30px -10px ${alpha(theme.palette.primary.main, 0.12)}`,
        }}
      >
        <InboxRoundedIcon
          sx={{
            fontSize: 38,
            color: 'primary.main',
          }}
        />
      </Box>

      <Typography variant="h6" fontWeight={850} color="text.primary" sx={{ letterSpacing: -0.3 }}>
        {m.title}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        fontSize={14}
        sx={{ maxWidth: 360, lineHeight: 1.7 }}
      >
        {m.sub}
      </Typography>
    </Box>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const isRtl = i18n.dir() === 'rtl';
  const isDark = theme.palette.mode === 'dark';

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('all');
  const [totalUnread, setTotalUnread] = useState(0);
  const [totalRead, setTotalRead]     = useState(0);

  const fetchNotifications = useCallback(async (p = 1, currentFilter = filter) => {
    setLoading(true);

    const params = { page: p };
    if (currentFilter === 'unread') params.is_read = 0;
    if (currentFilter === 'read')   params.is_read = 1;

    try {
      const res = await api.get('/admin/notifications', { params });
      const d = res.data.data;

      setNotifications(d.data);
      setLastPage(d.last_page);
      setTotal(d.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCounts = useCallback(async () => {
    try {
      const [unreadRes, readRes] = await Promise.all([
        api.get('/admin/notifications', { params: { page: 1, is_read: 0 } }),
        api.get('/admin/notifications', { params: { page: 1, is_read: 1 } }),
      ]);
      setTotalUnread(unreadRes.data.data.total);
      setTotalRead(readRes.data.data.total);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchCounts(); }, [fetchCounts]);

  useEffect(() => {
    setPage(1);
    fetchNotifications(1, filter);
  }, [filter]);                          // ← عند تغيير الفلتر: روح صفحة 1

  useEffect(() => {
    fetchNotifications(page, filter);
  }, [page]);                            // ← عند تغيير الصفحة فقط

  const handleMarkRead = async (id) => {
    setMarkingId(id);

    try {
      await api.get(`/admin/notifications/mark-as-read/${id}`);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                read_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
              }
            : n
        )
      );
      fetchCounts(); // ← أضف هاد
    } catch (e) {
      console.error(e);
    } finally {
      setMarkingId(null);
    }
  };

  const handleMarkAllRead = async () => {
    setMarkingAll(true);

    const unread = notifications.filter((n) => !n.read_at);

    for (const n of unread) {
      try {
        await api.get(`/admin/notifications/mark-as-read/${n.id}`);
      } catch (e) {
        // skip
      }
    }

    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        read_at:
          n.read_at || new Date().toISOString().replace('T', ' ').slice(0, 19),
      }))
    );

    setMarkingAll(false);
    fetchCounts(); // ← أضف هاد في آخر الدالة
  };

  const filtered = notifications;

  const unreadCount = totalUnread;
  const readCount   = totalRead;

  const FILTERS = [
    {
      key: 'all',
      label: t('notifications.filter.all', 'All'),
      count: total,
      icon: <NotificationsNoneRoundedIcon sx={{ fontSize: 16 }} />,
    },
    {
      key: 'unread',
      label: t('notifications.filter.unread', 'Unread'),
      count: unreadCount,
      icon: <MarkEmailUnreadRoundedIcon sx={{ fontSize: 16 }} />,
    },
    {
      key: 'read',
      label: t('notifications.filter.read', 'Read'),
      count: readCount,
      icon: <MarkEmailReadRoundedIcon sx={{ fontSize: 16 }} />,
    },
  ];

  return (
    <Box
      sx={{
        p: { xs: 2.5, md: 5 },
        maxWidth: 1040,
        mx: 'auto',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <PageHeader
        title={t('notifications.title', 'Notifications')}
        subtitle={t(
          'notifications.subtitle',
          'Stay updated with the latest activity'
        )}
      />

      {/* Top summary */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: 4.5,
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          boxShadow: isDark
            ? '0 24px 64px rgba(0,0,0,0.22)'
            : '0 16px 48px rgba(15,23,42,0.05)',

          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: isDark
              ? `radial-gradient(circle at top ${isRtl ? 'right' : 'left'}, ${alpha(
                  theme.palette.primary.main,
                  0.12
                )}, transparent 40%)`
              : `radial-gradient(circle at top ${isRtl ? 'right' : 'left'}, ${alpha(
                  theme.palette.primary.main,
                  0.07
                )}, transparent 40%)`,
          },
        }}
      >
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          alignItems={{ xs: 'stretch', lg: 'center' }}
          justifyContent="space-between"
          spacing={3}
          sx={{ position: 'relative', zIndex: 1 }}
        >
          <Stack direction="row" spacing={2.2} alignItems="center">
            <Badge
              badgeContent={unreadCount}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: 10,
                  minWidth: 20,
                  height: 20,
                  fontWeight: 800,
                  boxShadow: `0 0 0 3px ${theme.palette.background.paper}`,
                },
              }}
            >
              <Box
                sx={{
                  width: 58,
                  height: 58,
                  borderRadius: 3.5,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, isDark ? 0.12 : 0.08),
                  border: '1px solid',
                  borderColor: alpha(theme.palette.primary.main, 0.15),
                }}
              >
                <NotificationsActiveRoundedIcon sx={{ fontSize: 28 }} />
              </Box>
            </Badge>

            <Box>
              <Typography
                variant="h5"
                fontWeight={950}
                sx={{
                  letterSpacing: -0.5,
                  lineHeight: 1.1,
                }}
              >
                {t('notifications.title', 'Notifications Center')}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.6, fontWeight: 500, opacity: 0.85 }}
              >
                {unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                  : t('notifications.allCaughtUp', 'Everything is up to date')}
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            sx={{ minWidth: { lg: 520 } }}
          >
            <StatBox
              icon={<NotificationsNoneRoundedIcon sx={{ fontSize: 20 }} />}
              label={t('notifications.total', 'Total')}
              value={total}
              color={theme.palette.primary.main}
            />

            <StatBox
              icon={<MarkEmailUnreadRoundedIcon sx={{ fontSize: 20 }} />}
              label={t('notifications.filter.unread', 'Unread')}
              value={unreadCount}
              color="#ef4444"
            />

            <StatBox
              icon={<MarkEmailReadRoundedIcon sx={{ fontSize: 20 }} />}
              label={t('notifications.filter.read', 'Read')}
              value={readCount}
              color="#22c55e"
            />
          </Stack>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 4.5,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          boxShadow: isDark
            ? '0 20px 50px rgba(0,0,0,0.18)'
            : '0 12px 40px rgba(15,23,42,0.04)',
        }}
      >
        {/* Toolbar */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'stretch', md: 'center' }}
          justifyContent="space-between"
          gap={2}
          sx={{
            px: { xs: 2.5, sm: 4 },
            py: 2.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: isDark ? alpha('#fff', 0.015) : alpha('#020617', 0.01),
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ minWidth: 0 }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2.5,
                bgcolor: 'action.selected',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <InboxRoundedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                fontWeight={900}
                sx={{
                  lineHeight: 1.2,
                  letterSpacing: -0.2,
                }}
              >
                {t('notifications.inbox', 'Notification inbox')}
              </Typography>

              <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 500 }}>
                {filtered.length} shown from {total} total
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent="space-between"
            gap={1.5}
          >
            <Stack
              direction="row"
              gap={0.5}
              flexWrap="wrap"
              sx={{
                p: 0.5,
                borderRadius: 3,
                bgcolor: 'action.hover',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              {FILTERS.map((f) => {
                const active = filter === f.key;

                return (
                  <Chip
                    key={f.key}
                    icon={f.icon}
                    label={
                      <Stack direction="row" alignItems="center" gap={0.8}>
                        <span>{f.label}</span>

                        <Box
                          sx={{
                            px: 1,
                            py: 0.2,
                            borderRadius: 1.5,
                            fontSize: 10,
                            fontWeight: 900,
                            lineHeight: 1.4,
                            bgcolor: active
                              ? alpha('#fff', isDark ? 0.15 : 0.25)
                              : 'background.paper',
                            color: active ? 'inherit' : 'text.secondary',
                            minWidth: 20,
                            textAlign: 'center',
                            boxShadow: active ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
                          }}
                        >
                          {f.count}
                        </Box>
                      </Stack>
                    }
                    onClick={() => setFilter(f.key)}
                    size="small"
                    variant={active ? 'filled' : 'outlined'}
                    color={active ? 'primary' : 'default'}
                    sx={{
                      fontWeight: 800,
                      fontSize: 12,
                      borderRadius: 2.2,
                      height: 32,
                      cursor: 'pointer',
                      borderColor: active ? 'transparent' : 'transparent',
                      transition: 'all 0.2s ease',
                      bgcolor: active ? 'primary.main' : 'transparent',
                      '&:hover': {
                        bgcolor: active ? 'primary.dark' : 'action.selected',
                      },
                      '& .MuiChip-icon': {
                        ml: isRtl ? 0 : 1,
                        mr: isRtl ? 1 : -0.2,
                      },
                    }}
                  />
                );
              })}
            </Stack>

            {unreadCount > 0 && (
              <Button
                size="small"
                variant="contained"
                disableElevation
                startIcon={
                  markingAll ? (
                    <CircularProgress size={14} color="inherit" />
                  ) : (
                    <DoneAllRoundedIcon sx={{ fontSize: 18 }} />
                  )
                }
                onClick={handleMarkAllRead}
                disabled={markingAll}
                sx={{
                  fontWeight: 850,
                  fontSize: 12.5,
                  borderRadius: 2.5,
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  px: 2,
                  height: 36,
                  boxShadow: `0 8px 20px ${alpha(
                    theme.palette.primary.main,
                    isDark ? 0.15 : 0.2
                  )}`,
                  '& .MuiButton-startIcon': {
                    ml: isRtl ? 0.6 : -0.2,
                    mr: isRtl ? -0.2 : 0.6,
                  },
                }}
              >
                {t('notifications.markAllRead', 'Mark all read')}
              </Button>
            )}
          </Stack>
        </Stack>

        {/* Content */}
        {loading ? (
          <LoadingState />
        ) : filtered.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <List disablePadding>
            {filtered.map((n) => (
              <NotificationRow
                key={n.id}
                notif={n}
                onMarkRead={handleMarkRead}
                marking={markingId === n.id}
                isRtl={isRtl}
              />
            ))}
          </List>
        )}

        {/* Pagination */}
        {lastPage > 1 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              py: 3,
              px: 3,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: isDark ? alpha('#fff', 0.01) : alpha('#020617', 0.005),
            }}
          >
            <Pagination
              count={lastPage}
              page={page}
              onChange={(_, v) => {
                setPage(v);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              color="primary"
              shape="rounded"
              size="medium"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontWeight: 800,
                  borderRadius: 2.2,
                },
              }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
}