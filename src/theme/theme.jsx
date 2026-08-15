// src/theme/theme.js
import { createTheme, responsiveFontSizes } from '@mui/material';
import { brand, darkPalette, lightPalette } from './colors';

export function getTheme(themeMode, language) {
  const direction = language === 'ar' ? 'rtl' : 'ltr';
  const isDark = themeMode === 'dark';
  const p = isDark ? darkPalette : lightPalette;

  const palette = {
    mode: themeMode,
    primary: { main: brand.primary },
    secondary: { main: p.secondary },
    background: { default: p.bg, paper: p.surface },
    error: { main: p.error },
    divider: p.border,
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
              backgroundColor: p.surface,
              border: `1px solid ${p.border}`,
            },
          },
        },
        MuiButton: {
          defaultProps: {
            disableElevation: true,
          },
          styleOverrides: {
            root: {
              borderRadius: 16,
              fontWeight: 800,
              textTransform: 'none',
            },
          },
        },
        MuiOutlinedInput: {
          styleOverrides: {
            root: {
              backgroundColor: p.field,
              '& fieldset': { borderColor: p.border },
              '&.Mui-focused fieldset': { borderColor: brand.primary },
            },
          },
        },
      },
    }),
  );
}