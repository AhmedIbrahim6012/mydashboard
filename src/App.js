import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material';
import { useEffect, useMemo } from 'react';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { useTranslation } from 'react-i18next';
import './App.css';
import { AppProvider, useAppContext } from './context/AppContext';
import AppRoutes from './routes/AppRoutes';
import AppSnackbar from './components/AppSnackbar';

function AppShell() {
  const { themeMode, language } = useAppContext();
  const { i18n } = useTranslation();

  useEffect(() => {
    if (i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [i18n, language]);

  useEffect(() => {
    const direction = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [language]);

  const cache = useMemo(
    () =>
      createCache({
        key: language === 'ar' ? 'mui-rtl' : 'mui',
        stylisPlugins: language === 'ar' ? [prefixer, rtlPlugin] : [],
      }),
    [language],
  );

  const theme = useMemo(() => {
    const direction = language === 'ar' ? 'rtl' : 'ltr';
    const palette = themeMode === 'dark'
      ? {
          mode: 'dark',
          primary: { main: '#7c8cff' },
          secondary: { main: '#22c55e' },
          background: { default: '#020617', paper: '#0f172a' },
        }
      : {
          mode: 'light',
          primary: { main: '#4f46e5' },
          secondary: { main: '#0ea5e9' },
          background: { default: '#f8fafc', paper: '#ffffff' },
        };

    return responsiveFontSizes(
      createTheme({
        palette,
        shape: { borderRadius: 14 },
        typography: {
          fontFamily: language === 'ar' ? 'Tajawal, Segoe UI, sans-serif' : 'Manrope, Segoe UI, sans-serif',
          h1: { fontWeight: 800 },
          h2: { fontWeight: 800 },
          h3: { fontWeight: 800 },
          h4: { fontWeight: 800 },
          h5: { fontWeight: 800 },
          h6: { fontWeight: 800 },
        },
        direction,
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              body: {
                backgroundColor: palette.background.default,
              },
            },
          },
          MuiCard: {
            styleOverrides: {
              root: {
                backdropFilter: 'blur(18px)',
              },
            },
          },
          MuiButton: {
            defaultProps: {
              disableElevation: true,
            },
          },
        },
      }),
    );
  }, [language, themeMode]);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppRoutes />
        <AppSnackbar />
      </ThemeProvider>
    </CacheProvider>
  );
}

function App() {
  return (
    <AppProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppShell />
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
