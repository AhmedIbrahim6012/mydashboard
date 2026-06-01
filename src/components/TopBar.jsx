import { useMemo } from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import {
  AppBar,
  Box,
  FormControl,
  MenuItem,
  Select,
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
import { useTranslation } from 'react-i18next';

function TopBar({ collapsed, onMenuClick, onCollapseToggle }) {
  const { logout, themeMode, toggleTheme, language, setLanguage } = useAppContext();
  const { t } = useTranslation();
  const fixedToggleCache = useMemo(() => createCache({ key: 'topbar-fixed-toggle' }), []);

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
          aria-label={t('topbar.openMenu', { defaultValue: 'Open navigation menu' })}
        >
          <MenuIcon />
        </IconButton>
        <CacheProvider value={fixedToggleCache}>
          <IconButton
            onClick={onCollapseToggle}
            sx={{
              display: { xs: 'none', md: 'inline-flex' },
              position: 'fixed',
              top: 12.5,
              left: 0.1,
              right: 'auto',
              zIndex: 1400,
              direction: 'ltr',
              '& svg': {
                transform: 'none',
              },
            }}
            aria-label={collapsed ? t('topbar.expandSidebar', { defaultValue: 'Expand sidebar' }) : t('topbar.collapseSidebar', { defaultValue: 'Collapse sidebar' })}
          >
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </CacheProvider>
        <Box sx={{ flexGrow: 1 , ml: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: '-0.02em' }}>
            {t('app.title')}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t('app.subtitle')}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center">
          <Tooltip title={themeMode === 'light' ? t('topbar.darkMode') : t('topbar.lightMode')}>
            <IconButton onClick={toggleTheme} aria-label={t('topbar.toggleTheme', { defaultValue: 'Toggle theme mode' })}>
              {themeMode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
            </IconButton>
          </Tooltip>
          <FormControl size="small" sx={{ minWidth: 92 }}>
            <Select
              value={language}
              onChange={(event) => setLanguage(event.target.value)}
              displayEmpty
              renderValue={(value) => (value === 'ar' ? t('common.arabic') : t('common.english'))}
              aria-label={t('topbar.languageSwitch', { defaultValue: 'Switch language' })}
            >
              <MenuItem value="en">{t('common.english')}</MenuItem>
              <MenuItem value="ar">{t('common.arabic')}</MenuItem>
            </Select>
          </FormControl>
          <Tooltip title={t('common.signOut')}>
            <IconButton onClick={logout} aria-label={t('common.signOut')}>
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
