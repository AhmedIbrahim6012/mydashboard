import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import { useAppContext } from '../context/AppContext';
import { validateLogin } from '../utils/validation';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
const INITIAL_VALUES = {
  phone: '',
  password: '',
};

function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, notify } = useAppContext();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const [values, setValues] = useState(INITIAL_VALUES);
  const [errors, setErrors] = useState({ phone: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
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

  function handleTogglePasswordVisibility() {
    setIsPasswordVisible((currentVisible) => !currentVisible);
  }

  function handlePasswordMouseDown(event) {
    event.preventDefault();
  }

  // function handleSubmit(event) {
  //   event.preventDefault();
  //   const nextErrors = validateLogin(values);
  //   setErrors({ phone: nextErrors.phone || '', password: nextErrors.password || '' });

  //   if (Object.keys(nextErrors).length > 0) {
  //     setSubmitError(t('login.form.validation'));
  //     return;
  //   }

  //   setSubmitError('');
  //   // Instead of directly logging in, simulate sending an OTP and navigate to OTP page
  //   setLoading(true);
  //   timerRef.current = setTimeout(() => {
  //     notify({ severity: 'info', title: t('login.otp.sent', { defaultValue: 'OTP sent' }), message: t('login.otp.sentMessage', { phone: values.phone }) });
  //     setLoading(false);
  //     navigate('/otp', { state: { phone: values.phone } });
  //   }, 700);
  // }
  async function handleSubmit(event) {
  event.preventDefault();

  const nextErrors = validateLogin(values);

  setErrors({
    phone: nextErrors.phone || '',
    password: nextErrors.password || '',
  });

  if (Object.keys(nextErrors).length > 0) {
    setSubmitError(t('login.form.validation'));
    return;
  }

  setSubmitError('');
  setLoading(true);

  try {
    const response = await axios.post(
      'https://homeservicesplatfrom.onrender.com/api/admin/auth/login',
      {
        phone: values.phone,
        password: values.password,
      }
    );

    const data = response.data;

    if (data.success) {
      localStorage.setItem(
        'login_token',
        data.data.login_token
      );

      notify({
        severity: 'success',
        title: 'OTP Sent',
        message: data.message,
      });

      navigate('/otp', {
        state: {
          phone: values.phone,
            password: values.password,
          login_token: response.data.data.login_token,
        },
      });
    } else {
      setSubmitError(data.message || 'Login failed');
    }
  } catch (error) {
    console.error(error);

    setSubmitError(
      error.response?.data?.message ||
        'Something went wrong'
    );
  } finally {
    setLoading(false);
  }
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
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 4, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                <Box sx={{ width: 52, height: 52, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.18)', display: 'grid', placeItems: 'center' }}>
                  <LockOutlinedIcon />
                </Box>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                      {t('login.hero.brand')}
                  </Typography>
                    <Typography sx={{ opacity: 0.82 }}>{t('login.hero.subtitle')}</Typography>
                </Box>
              </Box>
              <Typography variant="h3" sx={{ fontWeight: 800, letterSpacing: '-0.04em', maxWidth: 500 }}>
                  {t('login.hero.title')}
              </Typography>
              <Typography sx={{ mt: 2, maxWidth: 520, opacity: 0.9 }}>
                  {t('login.hero.description')}
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
                { icon: <ShowChartIcon />, label: t('login.hero.features.analytics') },
                { icon: <PeopleAltIcon />, label: t('login.hero.features.workers') },
                { icon: <AccountBalanceWalletIcon />, label: t('login.hero.features.wallet') },
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
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flexDirection: isRtl ? 'row-reverse' : 'row' }}>
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
                    {t('login.form.title')}
                  </Typography>
                  <Typography color="text.secondary" sx={{ mt: 1 }}>
                    {t('login.form.subtitle')}
                  </Typography>
                </Box>
                {submitError ? <Alert severity="error">{submitError}</Alert> : null}
                <Box component="form" onSubmit={handleSubmit} noValidate>
                  <Stack spacing={2.5}>
                    <TextField
                      label={t('login.form.phone', { defaultValue: 'Phone number' })}
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      error={Boolean(errors.phone)}
                      helperText={errors.phone}
                      autoComplete="tel"
                      inputMode="tel"
                      fullWidth
                      placeholder="+1 555 123 4567"
                    />
                    <TextField
                      label={t('login.form.password')}
                      name="password"
                      type={isPasswordVisible ? 'text' : 'password'}
                      value={values.password}
                      onChange={handleChange}
                      error={Boolean(errors.password)}
                      helperText={errors.password}
                      autoComplete="current-password"
                      fullWidth
                      slotProps={{
                        input: {
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={handleTogglePasswordVisibility}
                                onMouseDown={handlePasswordMouseDown}
                                edge="end"
                                aria-label={
                                  isPasswordVisible
                                    ? t('login.form.hidePassword', { defaultValue: 'Hide password' })
                                    : t('login.form.showPassword', { defaultValue: 'Show password' })
                                }
                                aria-pressed={isPasswordVisible}
                              >
                                {isPasswordVisible ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        },
                      }}
                    />
                    <Button type="submit" variant="contained" size="large" disabled={loading} sx={{ py: 1.4 }}>
                      {loading ? t('login.form.submitting') : t('login.form.submit')}
                    </Button>
                  </Stack>
                </Box>
                <Alert severity="info" variant="outlined">
                  {t('login.form.info')}
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
