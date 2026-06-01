import { useState } from 'react';
import { Box, Container } from '@mui/material';
import { Outlet } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useAppContext } from '../context/AppContext';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

function AppLayout() {
  const theme = useTheme();
  const { language } = useAppContext();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const isRtl = language === 'ar';

  function handleMobileClose() {
    setMobileOpen(false);
  }

  function handleCollapseToggle() {
    setCollapsed((currentValue) => !currentValue);
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: isRtl ? 'row-reverse' : 'row', minHeight: '100vh' }}>
      <Sidebar
        mobileOpen={mobileOpen}
        collapsed={isDesktop ? collapsed : false}
        onClose={handleMobileClose}
      />
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <TopBar
          collapsed={isDesktop ? collapsed : false}
          onMenuClick={() => setMobileOpen(true)}
          onCollapseToggle={handleCollapseToggle}
        />
        <Box
          component="main"
          sx={(currentTheme) => ({
            minHeight: 'calc(100vh - 76px)',
            background:
              currentTheme.palette.mode === 'dark'
                ? 'radial-gradient(circle at top right, rgba(79, 70, 229, 0.16), transparent 28%), linear-gradient(180deg, rgba(15, 23, 42, 0.95), rgba(15, 23, 42, 1))'
                : 'radial-gradient(circle at top right, rgba(79, 70, 229, 0.1), transparent 28%), linear-gradient(180deg, rgba(248, 250, 252, 1), rgba(241, 245, 249, 1))',
            ml: { md: !isRtl && isDesktop ? (collapsed ? '96px' : '280px') : 0 },
            mr: { md: isRtl && isDesktop ? (collapsed ? '96px' : '280px') : 0 },
            transition: 'margin 240ms ease',
          })}
        >
          <Container maxWidth="xl" sx={{ py: 4 }}>
            <Outlet />
          </Container>
        </Box>
      </Box>
    </Box>
  );
}

export default AppLayout;
