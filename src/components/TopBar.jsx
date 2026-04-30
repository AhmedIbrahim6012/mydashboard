import {
  AppBar,
  Box,
  IconButton,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAppContext } from '../context/AppContext';

function TopBar({ collapsed, onMenuClick, onCollapseToggle }) {
  const { logout, themeMode, toggleTheme } = useAppContext();

  return (
    <AppBar
      position="sticky"
      elevation={0}
      color="transparent"
      sx={(theme) => ({
        borderBottom: `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(18px)',
        backgroundColor: theme.palette.mode === 'dark' ? 'rgba(15, 23, 42, 0.72)' : 'rgba(255, 255, 255, 0.82)',
      })}
    >
      <Toolbar sx={{ minHeight: 76, gap: 2 }}>
        <IconButton
          edge="start"
          onClick={onMenuClick}
          sx={{ display: { xs: 'inline-flex', md: 'none' } }}
          aria-label="open navigation menu"
        >
          <MenuIcon />
        </IconButton>
        <IconButton
          onClick={onCollapseToggle}
          sx={{ display: { xs: 'none', md: 'inline-flex' } }}
          aria-label={collapsed ? 'expand sidebar' : 'collapse sidebar'}
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
            Admin Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Modern operations and workforce management
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title={`Switch to ${themeMode === 'light' ? 'dark' : 'light'} mode`}>
            <IconButton onClick={toggleTheme} aria-label="toggle theme mode">
              {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Tooltip>
          <Tooltip title="Sign out">
            <IconButton onClick={logout} aria-label="sign out">
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
