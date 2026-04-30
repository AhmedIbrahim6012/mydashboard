import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme, responsiveFontSizes } from '@mui/material';
import { useMemo } from 'react';
import './App.css';
import { AppProvider, useAppContext } from './context/AppContext';
import AppRoutes from './routes/AppRoutes';
import AppSnackbar from './components/AppSnackbar';

function AppShell() {
  const { themeMode } = useAppContext();

  const theme = useMemo(() => {
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
          fontFamily: 'Inter, Segoe UI, sans-serif',
          h1: { fontWeight: 800 },
          h2: { fontWeight: 800 },
          h3: { fontWeight: 800 },
          h4: { fontWeight: 800 },
          h5: { fontWeight: 800 },
          h6: { fontWeight: 800 },
        },
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
  }, [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppRoutes />
      <AppSnackbar />
    </ThemeProvider>
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
