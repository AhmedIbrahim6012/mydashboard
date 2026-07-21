

import {
  Box,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
  Avatar,
  Chip,
} from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GroupsIcon from '@mui/icons-material/Groups';
import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
import HandymanIcon from '@mui/icons-material/Handyman';
import EngineeringIcon from '@mui/icons-material/Engineering';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import { NavLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
function Sidebar({ mobileOpen, collapsed, onClose }) {
  const theme = useTheme();
  const { language } = useAppContext();
  const { t } = useTranslation();
  const isRtl = language === 'ar' || theme.direction === 'rtl';
  const drawerWidth = collapsed ? 80 : 260;

  const navItems = [
    { label: t('dashboard.title'), to: '/dashboard', icon: <DashboardIcon fontSize="small" /> },
    { label: t('Providers.title'), to: '/Providers', icon: <EngineeringIcon fontSize="small" />, badge: 12 },
    { label: t('professions.title'), to: '/professions', icon: <HandymanIcon fontSize="small" /> },
    { label: t('customers.title'), to: '/customers', icon: <GroupsIcon fontSize="small" /> },
    { label: t('messages.title'), to: '/messages', icon: <ForumRoundedIcon fontSize="small" />, badge: 3 },
    { label: t('finance.title'), to: '/financial-analytics', icon: <AnalyticsIcon fontSize="small" /> },
    { label: t('orders.title'), to: '/orders', icon: <ReceiptLongRoundedIcon fontSize="small" /> },
    {
  label: t('notifications.title', 'Notifications'),
  to: '/notifications',
  icon: <NotificationsNoneRoundedIcon />,
  // ← إذا عندك state للـ unread في الـ context، وإلا احذف هذا
},

    { label: t('wallet.title'), to: '/wallet', icon: <AccountBalanceWalletIcon fontSize="small" /> },
    { label: t('transactions.title'), to: '/transactions', icon: <ReceiptLongRoundedIcon fontSize="small" /> },  // ← الجديد

 {
  label: t('sidebar.restrictions', { defaultValue: 'Restrictions' }),
  to: '/admin/restrictions',
  icon: <GavelRoundedIcon />,
}    , 


    { label: t('settings.title'), to: '/settings', icon: <SettingsRoundedIcon fontSize="small" /> },
   
  ];

  const drawerContent = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(180deg, #0a0f1e 0%, #0d1426 60%, #09101c 100%)',
        borderRight: isRtl ? 'none' : '1px solid rgba(148, 163, 184, 0.1)',
        borderLeft: isRtl ? '1px solid rgba(148, 163, 184, 0.1)' : 'none',
      }}
    >
      {/* ── Logo ── */}
      <Box sx={{ px: collapsed ? 1.5 : 2.5, py: 2.5 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          justifyContent={collapsed ? 'center' : 'flex-start'}
          sx={{ flexDirection: isRtl ? 'row-reverse' : 'row' }}
        >
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2.5,
              display: 'grid',
              placeItems: 'center',
              fontWeight: 800,
              fontSize: 13,
              color: '#fff',
              flexShrink: 0,
              background: 'linear-gradient(135deg, #2563eb, #6366f1)',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.4)',
            }}
          >
            AD
          </Box>
          {!collapsed && (
            <Box>
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 800, lineHeight: 1.15, color: '#f1f5f9', letterSpacing: '-0.01em' }}
              >
                MyDashboard
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(148, 163, 184, 0.65)', fontSize: 11 }}>
                {t('app.subtitle')}
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>

      <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.1)', mx: collapsed ? 1 : 2 }} />

      {/* ── Nav Items ── */}
      <List sx={{ flexGrow: 1, px: collapsed ? 1 : 1.5, py: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {!collapsed && (
          <Typography
            variant="caption"
            sx={{ color: 'rgba(148,163,184,0.45)', fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', px: 1.5, pb: 0.5 }}
          >
            {t('nav.main', { defaultValue: 'القائمة الرئيسية' })}
          </Typography>
        )}

        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            onClick={onClose}
            sx={{
              minHeight: 44,
              borderRadius: 2.5,
              justifyContent: collapsed ? 'center' : 'flex-start',
              px: collapsed ? 1 : 1.5,
              color: 'rgba(148, 163, 184, 0.75)',
              transition: 'background 180ms ease, color 180ms ease, transform 180ms ease',
              '&:hover': {
                background: 'rgba(148, 163, 184, 0.08)',
                color: '#e2e8f0',
                transform: isRtl ? 'translateX(-2px)' : 'translateX(2px)',
              },
              '&.active': {
                background: 'linear-gradient(135deg, rgba(37,99,235,0.2), rgba(99,102,241,0.14))',
                color: '#93c5fd',
                boxShadow: 'inset 0 0 0 1px rgba(96,165,250,0.18)',
                '& .MuiListItemIcon-root': { color: '#93c5fd' },
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed ? 0 : 36,
                justifyContent: 'center',
                color: 'inherit',
                mr: collapsed ? 0 : (isRtl ? 0 : 0.5),
                ml: collapsed ? 0 : (isRtl ? 0.5 : 0),
              }}
            >
              {item.icon}
            </ListItemIcon>

            {!collapsed && (
              <>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{ fontWeight: 600, fontSize: 13 }}
                  sx={{ '& .MuiListItemText-primary': { color: 'inherit' } }}
                />
                {item.badge && (
                  <Chip
                    label={item.badge}
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: 10,
                      fontWeight: 700,
                      background: 'rgba(99,102,241,0.2)',
                      color: '#a5b4fc',
                      border: 'none',
                      '& .MuiChip-label': { px: 0.75 },
                    }}
                  />
                )}
              </>
            )}
          </ListItemButton>
        ))}
      </List>

      <Divider sx={{ borderColor: 'rgba(148, 163, 184, 0.1)', mx: collapsed ? 1 : 2 }} />

      {/* ── User Profile ── */}
      <Box sx={{ px: collapsed ? 1 : 2, py: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          justifyContent={collapsed ? 'center' : 'flex-start'}
          sx={{
            flexDirection: isRtl ? 'row-reverse' : 'row',
            px: collapsed ? 0 : 1,
            py: 1,
            borderRadius: 2.5,
            cursor: 'pointer',
            transition: 'background .18s',
            '&:hover': { background: 'rgba(148,163,184,0.07)' },
          }}
        >
          <Avatar
            sx={{
              width: 34,
              height: 34,
              fontSize: 12,
              fontWeight: 700,
              flexShrink: 0,
              background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(59,130,246,0.3))',
              color: '#93c5fd',
              border: '1px solid rgba(99,102,241,0.25)',
            }}
          >
            أح
          </Avatar>
          {!collapsed && (
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="caption" sx={{ fontWeight: 700, color: '#e2e8f0', display: 'block', fontSize: 12, lineHeight: 1.3 }}>
Admin
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(148,163,184,0.6)', fontSize: 11 }}>
                مدير النظام
              </Typography>
            </Box>
          )}
        </Stack>
      </Box>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      aria-label="navigation sidebar"
    >
      {/* Mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        anchor={isRtl ? 'right' : 'left'}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 260,
            boxSizing: 'border-box',
            backgroundColor: '#0d1426',
            border: 'none',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop */}
      <Drawer
        variant="permanent"
        anchor={isRtl ? 'right' : 'left'}
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            overflowX: 'hidden',
            transition: 'width 400ms cubic-bezier(0.4, 0, 0.2, 1)',
            backgroundColor: '#0d1426',
            border: 'none',
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
}

export default Sidebar;

// import {
//   Box,
//   Divider,
//   Drawer,
//   List,
//   ListItemButton,
//   ListItemIcon,
//   ListItemText,
//   Stack,
//   Typography,
//   Avatar,
//   Chip,
// } from '@mui/material';
// import AnalyticsIcon from '@mui/icons-material/Analytics';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
// import GroupsIcon from '@mui/icons-material/Groups';
// import ForumRoundedIcon from '@mui/icons-material/ForumRounded';
// import HandymanIcon from '@mui/icons-material/Handyman';
// import EngineeringIcon from '@mui/icons-material/Engineering';
// import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
// import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
// import { NavLink } from 'react-router-dom';
// import { useTheme } from '@mui/material/styles';
// import { useTranslation } from 'react-i18next';
// import { useAppContext } from '../context/AppContext';
// import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
// import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
// function Sidebar({ mobileOpen, collapsed, onClose }) {
//   const theme = useTheme();
//   const { language } = useAppContext();
//   const { t } = useTranslation();
//   const isRtl = language === 'ar' || theme.direction === 'rtl';
//   const drawerWidth = collapsed ? 80 : 260;

//   const navItems = [
//     { label: t('dashboard.title'), to: '/dashboard', icon: <DashboardIcon fontSize="small" /> },
//     { label: t('Providers.title'), to: '/Providers', icon: <EngineeringIcon fontSize="small" />, badge: 12 },
//     { label: t('professions.title'), to: '/professions', icon: <HandymanIcon fontSize="small" /> },
//     { label: t('customers.title'), to: '/customers', icon: <GroupsIcon fontSize="small" /> },
//     { label: t('messages.title'), to: '/messages', icon: <ForumRoundedIcon fontSize="small" />, badge: 3 },
//     { label: t('finance.title'), to: '/financial-analytics', icon: <AnalyticsIcon fontSize="small" /> },
//     { label: t('orders.title'), to: '/orders', icon: <ReceiptLongRoundedIcon fontSize="small" /> },
//     {
//   label: t('notifications.title', 'Notifications'),
//   to: '/notifications',
//   icon: <NotificationsNoneRoundedIcon />,
//   // ← إذا عندك state للـ unread في الـ context، وإلا احذف هذا
// },

//     { label: t('wallet.title'), to: '/wallet', icon: <AccountBalanceWalletIcon fontSize="small" /> },
//     { label: t('transactions.title'), to: '/transactions', icon: <ReceiptLongRoundedIcon fontSize="small" /> },  // ← الجديد

//  {
//   label: t('sidebar.restrictions', { defaultValue: 'Restrictions' }),
//   to: '/admin/restrictions',
//   icon: <GavelRoundedIcon />,
// }    , 


//     { label: t('settings.title'), to: '/settings', icon: <SettingsRoundedIcon fontSize="small" /> },
   
//   ];

//   const drawerContent = (
//     <Box
//       sx={{
//         height: '100%',
//         display: 'flex',
//         flexDirection: 'column',
//         background: 'linear-gradient(180deg, #FD7A38 0%, #E5651F 60%, #C9530F 100%)',
//         borderRight: isRtl ? 'none' : '1px solid rgba(255, 255, 255, 0.15)',
//         borderLeft: isRtl ? '1px solid rgba(255, 255, 255, 0.15)' : 'none',
//       }}
//     >
//       {/* ── Logo ── */}
//       <Box sx={{ px: collapsed ? 1.5 : 2.5, py: 2.5 }}>
//         <Stack
//           direction="row"
//           alignItems="center"
//           spacing={1.5}
//           justifyContent={collapsed ? 'center' : 'flex-start'}
//           sx={{ flexDirection: isRtl ? 'row-reverse' : 'row' }}
//         >
//           <Box
//             sx={{
//               width: 40,
//               height: 40,
//               borderRadius: 2.5,
//               display: 'grid',
//               placeItems: 'center',
//               fontWeight: 800,
//               fontSize: 13,
//               color: '#FD7A38',
//               flexShrink: 0,
//               background: '#ffffff',
//               boxShadow: '0 8px 20px rgba(0, 0, 0, 0.25)',
//             }}
//           >
//             AD
//           </Box>
//           {!collapsed && (
//             <Box>
//               <Typography
//                 variant="subtitle1"
//                 sx={{ fontWeight: 800, lineHeight: 1.15, color: '#ffffff', letterSpacing: '-0.01em' }}
//               >
//                 MyDashboard
//               </Typography>
//               <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 11 }}>
//                 {t('app.subtitle')}
//               </Typography>
//             </Box>
//           )}
//         </Stack>
//       </Box>

//       <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', mx: collapsed ? 1 : 2 }} />

//       {/* ── Nav Items ── */}
//       <List sx={{ flexGrow: 1, px: collapsed ? 1 : 1.5, py: 2, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
//         {!collapsed && (
//           <Typography
//             variant="caption"
//             sx={{ color: 'rgba(255,255,255,0.6)', fontWeight: 700, fontSize: 10, textTransform: 'uppercase', letterSpacing: '.08em', px: 1.5, pb: 0.5 }}
//           >
//             {t('nav.main', { defaultValue: 'القائمة الرئيسية' })}
//           </Typography>
//         )}

//         {navItems.map((item) => (
//           <ListItemButton
//             key={item.to}
//             component={NavLink}
//             to={item.to}
//             onClick={onClose}
//             sx={{
//               minHeight: 44,
//               borderRadius: 2.5,
//               justifyContent: collapsed ? 'center' : 'flex-start',
//               px: collapsed ? 1 : 1.5,
//               color: 'rgba(255, 255, 255, 0.85)',
//               transition: 'background 180ms ease, color 180ms ease, transform 180ms ease',
//               '&:hover': {
//                 background: 'rgba(255, 255, 255, 0.15)',
//                 color: '#ffffff',
//                 transform: isRtl ? 'translateX(-2px)' : 'translateX(2px)',
//               },
//               '&.active': {
//                 background: 'rgba(0, 0, 0, 0.22)',
//                 color: '#ffffff',
//                 boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.3)',
//                 '& .MuiListItemIcon-root': { color: '#ffffff' },
//               },
//             }}
//           >
//             <ListItemIcon
//               sx={{
//                 minWidth: collapsed ? 0 : 36,
//                 justifyContent: 'center',
//                 color: 'inherit',
//                 mr: collapsed ? 0 : (isRtl ? 0 : 0.5),
//                 ml: collapsed ? 0 : (isRtl ? 0.5 : 0),
//               }}
//             >
//               {item.icon}
//             </ListItemIcon>

//             {!collapsed && (
//               <>
//                 <ListItemText
//                   primary={item.label}
//                   primaryTypographyProps={{ fontWeight: 600, fontSize: 13 }}
//                   sx={{ '& .MuiListItemText-primary': { color: 'inherit' } }}
//                 />
//                 {item.badge && (
//                   <Chip
//                     label={item.badge}
//                     size="small"
//                     sx={{
//                       height: 18,
//                       fontSize: 10,
//                       fontWeight: 700,
//                       background: 'rgba(0, 0, 0, 0.25)',
//                       color: '#ffffff',
//                       border: 'none',
//                       '& .MuiChip-label': { px: 0.75 },
//                     }}
//                   />
//                 )}
//               </>
//             )}
//           </ListItemButton>
//         ))}
//       </List>

//       <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', mx: collapsed ? 1 : 2 }} />

//       {/* ── User Profile ── */}
//       <Box sx={{ px: collapsed ? 1 : 2, py: 2 }}>
//         <Stack
//           direction="row"
//           alignItems="center"
//           spacing={1.5}
//           justifyContent={collapsed ? 'center' : 'flex-start'}
//           sx={{
//             flexDirection: isRtl ? 'row-reverse' : 'row',
//             px: collapsed ? 0 : 1,
//             py: 1,
//             borderRadius: 2.5,
//             cursor: 'pointer',
//             transition: 'background .18s',
//             '&:hover': { background: 'rgba(255,255,255,0.12)' },
//           }}
//         >
//           <Avatar
//             sx={{
//               width: 34,
//               height: 34,
//               fontSize: 12,
//               fontWeight: 700,
//               flexShrink: 0,
//               background: 'rgba(0, 0, 0, 0.2)',
//               color: '#ffffff',
//               border: '1px solid rgba(255, 255, 255, 0.35)',
//             }}
//           >
//             أح
//           </Avatar>
//           {!collapsed && (
//             <Box sx={{ minWidth: 0 }}>
//               <Typography variant="caption" sx={{ fontWeight: 700, color: '#ffffff', display: 'block', fontSize: 12, lineHeight: 1.3 }}>
// Admin
//               </Typography>
//               <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.75)', fontSize: 11 }}>
//                 مدير النظام
//               </Typography>
//             </Box>
//           )}
//         </Stack>
//       </Box>
//     </Box>
//   );

//   return (
//     <Box
//       component="nav"
//       sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
//       aria-label="navigation sidebar"
//     >
//       {/* Mobile */}
//       <Drawer
//         variant="temporary"
//         open={mobileOpen}
//         onClose={onClose}
//         ModalProps={{ keepMounted: true }}
//         anchor={isRtl ? 'right' : 'left'}
//         sx={{
//           display: { xs: 'block', md: 'none' },
//           '& .MuiDrawer-paper': {
//             width: 260,
//             boxSizing: 'border-box',
//             backgroundColor: '#FD7A38',
//             border: 'none',
//           },
//         }}
//       >
//         {drawerContent}
//       </Drawer>

//       {/* Desktop */}
//       <Drawer
//         variant="permanent"
//         anchor={isRtl ? 'right' : 'left'}
//         sx={{
//           display: { xs: 'none', md: 'block' },
//           '& .MuiDrawer-paper': {
//             width: drawerWidth,
//             boxSizing: 'border-box',
//             overflowX: 'hidden',
//             transition: 'width 400ms cubic-bezier(0.4, 0, 0.2, 1)',
//             backgroundColor: '#FD7A38',
//             border: 'none',
//           },
//         }}
//         open
//       >
//         {drawerContent}
//       </Drawer>
//     </Box>
//   );
// }

// export default Sidebar;