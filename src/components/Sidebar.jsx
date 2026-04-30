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
} from '@mui/material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GroupsIcon from '@mui/icons-material/Groups';
import EngineeringIcon from '@mui/icons-material/Engineering';
import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { label: 'Dashboard', to: '/dashboard', icon: <DashboardIcon /> },
  { label: 'Workers Management', to: '/workers', icon: <EngineeringIcon /> },
  { label: 'Customers Management', to: '/customers', icon: <GroupsIcon /> },
  { label: 'Financial Analytics', to: '/financial-analytics', icon: <AnalyticsIcon /> },
  { label: 'Wallet / Deposits', to: '/wallet', icon: <AccountBalanceWalletIcon /> },
];

function Sidebar({ mobileOpen, collapsed, onClose }) {
  const drawerWidth = collapsed ? 96 : 280;

  const drawerContent = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 2.5, py: 3 }}>
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={(theme) => ({
              width: 48,
              height: 48,
              borderRadius: 3,
              display: 'grid',
              placeItems: 'center',
              color: 'white',
              fontWeight: 800,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: '0 14px 30px rgba(79, 70, 229, 0.35)',
            })}
          >
            AD
          </Box>
          {!collapsed ? (
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.1 }}>
                MyDashboard
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Operations control center
              </Typography>
            </Box>
          ) : null}
        </Stack>
      </Box>
      <Divider />
      <List sx={{ flexGrow: 1, px: 1.5, py: 2 }}>
        {NAV_ITEMS.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            onClick={onClose}
            sx={(theme) => ({
              minHeight: 52,
              borderRadius: 3,
              mb: 1,
              justifyContent: collapsed ? 'center' : 'flex-start',
              px: collapsed ? 1.5 : 2,
              '&.active': {
                backgroundColor: theme.palette.action.selected,
                color: theme.palette.primary.main,
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.main,
                },
              },
            })}
          >
            <ListItemIcon sx={{ minWidth: collapsed ? 0 : 40, justifyContent: 'center' }}>
              {item.icon}
            </ListItemIcon>
            {!collapsed ? <ListItemText primary={item.label} primaryTypographyProps={{ fontWeight: 600 }} /> : null}
          </ListItemButton>
        ))}
      </List>
      {!collapsed ? (
        <Box sx={{ p: 2.5 }}>
          <Box
            sx={(theme) => ({
              borderRadius: 4,
              p: 2,
              color: 'white',
              background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
            })}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
              Scalable, responsive, and ready for growth.
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.75, opacity: 0.9 }}>
              Built with a reusable data layer and persistent workspace state.
            </Typography>
          </Box>
        </Box>
      ) : null}
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { md: drawerWidth },
        flexShrink: { md: 0 },
      }}
      aria-label="navigation sidebar"
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            width: 280,
            boxSizing: 'border-box',
          },
        }}
      >
        {drawerContent}
      </Drawer>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            overflowX: 'hidden',
            transition: 'width 240ms ease',
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
