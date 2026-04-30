import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useAppContext } from '../context/AppContext';
import { validateLogin } from '../utils/validation';

const INITIAL_VALUES = {
  username: '',
  password: '',
};

function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, login } = useAppContext();
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState(INITIAL_VALUES);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const timerRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => () => clearTimeout(timerRef.current), []);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateLogin(values);
    setErrors({
      username: nextErrors.username || '',
      password: nextErrors.password || '',
    });

    if (Object.keys(nextErrors).length > 0) {
      setSubmitError('Please fix the highlighted fields.');
      return;
    }

    setSubmitError('');
    setLoading(true);
    timerRef.current = setTimeout(() => {
      login(values.username.trim());
      navigate('/dashboard', { replace: true });
      setLoading(false);
    }, 700);
  }

  return (
    <Box
      sx={(theme) => ({
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        px: 2,
        py: 4,
        background:
          theme.palette.mode === 'dark'
            ? 'radial-gradient(circle at top, rgba(99, 102, 241, 0.2), transparent 35%), linear-gradient(180deg, #020617, #0f172a)'
            : 'radial-gradient(circle at top, rgba(99, 102, 241, 0.16), transparent 35%), linear-gradient(180deg, #eef2ff, #f8fafc)',
      })}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1200,
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: 4,
        }}
      >
        <Box>
          <Box
            sx={(theme) => ({
              height: '100%',
              minHeight: { xs: 260, md: 620 },
              borderRadius: 6,
              p: { xs: 4, md: 6 },
              color: 'white',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              background: `linear-gradient(145deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              boxShadow: '0 30px 80px rgba(15, 23, 42, 0.18)',
            })}
          >
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4 }}>
                <Box sx={{ width: 52, height: 52, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.18)', display: 'grid', placeItems: 'center' }}>
                  <LockOutlinedIcon />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    MyDashboard
                  </Typography>
                  <Typography sx={{ opacity: 0.82 }}>Operations and workforce control</Typography>
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.04em', maxWidth: 500 }}>
                A clean admin workspace for modern teams.
              </Typography>
              <Typography sx={{ mt: 2, maxWidth: 520, opacity: 0.9 }}>
                Manage workers, monitor company performance, and process deposits from one scalable interface.
              </Typography>
            </Box>
            <Box
              sx={{
                position: 'relative',
                zIndex: 1,
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, minmax(0, 1fr))' },
                gap: 2,
              }}
            >
              {[
                { icon: <ShowChartIcon />, label: 'Live analytics' },
                { icon: <PeopleAltIcon />, label: 'Worker management' },
                { icon: <AccountBalanceWalletIcon />, label: 'Wallet operations' },
              ].map((feature) => (
                <Card
                  key={feature.label}
                  elevation={0}
                  sx={{
                    flex: 1,
                    bgcolor: 'rgba(255,255,255,0.14)',
                    color: 'white',
                    border: '1px solid rgba(255,255,255,0.14)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <CardContent sx={{ py: 2.2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      {feature.icon}
                      <Typography sx={{ fontWeight: 700 }}>{feature.label}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </Box>
        <Box>
          <Card
            elevation={0}
            sx={(theme) => ({
              height: '100%',
              minHeight: { xs: 0, md: 620 },
              borderRadius: 6,
              border: `1px solid ${theme.palette.divider}`,
              boxShadow: '0 30px 80px rgba(15, 23, 42, 0.1)',
            })}
          >
            <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
              <Stack spacing={3}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
                    Sign in
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    Enter any valid credentials to access the dashboard.
                  </Typography>
                </Box>
                {submitError ? <Alert severity="error">{submitError}</Alert> : null}
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <Stack spacing={2.5}>
                    <TextField
                      label="Username"
                      name="username"
                      value={values.username}
                      onChange={handleChange}
                      error={Boolean(errors.username)}
                      helperText={errors.username}
                      autoComplete="username"
                      fullWidth
                    />
                    <TextField
                      label="Password"
                      name="password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      error={Boolean(errors.password)}
                      helperText={errors.password}
                      autoComplete="current-password"
                      fullWidth
                    />
                    <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ py: 1.4 }}>
                      {loading ? 'Signing in...' : 'Sign In'}
                    </Button>
                  </Stack>
                </Box>
                <Alert severity="info" variant="outlined">
                  This dashboard uses local storage to persist sessions, worker data, and theme settings.
                </Alert>
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;
