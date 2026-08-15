import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import TextField from '@mui/material/TextField';
import { CircularProgress } from '@mui/material';
import { getDeviceId, getDeviceName} from '../utils/deviceId'; // ← استورد الدوال من utils/deviceUtils.js
import { requestNotificationPermission } from '../services/notificationsService'; // ← استورد الدوال من utils/deviceUtils.js
import { persistTokens } from '../services/refreshManager';
function OtpPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
 //onst { phone, password, login_token: initialToken, enabled_2fa, qr_code_url } = location.state || {};const [login_token, setLoginToken] = useState(initialToken);

const { phone, password, login_token: initialToken} = location.state || {};const [login_token, setLoginToken] = useState(initialToken);
  //const { phone, password, login_token } = location.state || {};
  // const { phone } = location.state || {};
  const { login, notify } = useAppContext();

  const LENGTH = 6;
  const [digits, setDigits] = useState(Array(LENGTH).fill(''));
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  const code = digits.join('');

const [useRecovery, setUseRecovery] = useState(false);
const [recoveryCode, setRecoveryCode] = useState('');

  useEffect(() => {
    if (!phone) navigate('/login', { replace: true });
  }, [phone, navigate]);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  function handleChange(index, e) {
    // Allow any character (alphanumeric)
    const val = e.target.value.replace(/\s/g, ''); // strip whitespace only

    if (!val) {
      // Cleared — just update this box
      const next = [...digits];
      next[index] = '';
      setDigits(next);
      if (error) setError('');
      return;
    }

    // If user pastes multiple chars, distribute across boxes
    if (val.length > 1) {
      const chars = val.slice(0, LENGTH - index).split('');
      const next = [...digits];
      chars.forEach((ch, i) => {
        if (index + i < LENGTH) next[index + i] = ch;
      });
      setDigits(next);
      const focusIndex = Math.min(index + chars.length, LENGTH - 1);
      inputRefs.current[focusIndex]?.focus();
      if (error) setError('');
      return;
    }

    // Single character
    const next = [...digits];
    next[index] = val.slice(-1); // take last typed char
    setDigits(next);
    if (error) setError('');

    // Auto-advance
    if (index < LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index, e) {
    if (e.key === 'Backspace') {
      if (digits[index]) {
        // Clear current
        const next = [...digits];
        next[index] = '';
        setDigits(next);
      } else if (index > 0) {
        // Move back
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\s/g, '').slice(0, LENGTH);
    const next = Array(LENGTH).fill('');
    pasted.split('').forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    const focusIndex = Math.min(pasted.length, LENGTH - 1);
    inputRefs.current[focusIndex]?.focus();
    if (error) setError('');
  }

  // function handleVerify(e) {
  //   e.preventDefault();
  //   if (code.length !== LENGTH) {
  //     setError(t('otp.validation.invalid', { defaultValue: 'Enter the 6-digit code.' }));
  //     return;
  //   }
  //   login(phone);
  //   notify({
  //     severity: 'success',
  //     title: t('otp.verified', { defaultValue: 'Verified' }),
  //     message: t('otp.welcome', { defaultValue: 'You are signed in.' }),
  //   });
  //   navigate('/dashboard', { replace: true });
  // }

async function handleVerify(e) {
  e.preventDefault();
if (!useRecovery && code.length !== LENGTH) {
  setError(t('otp.validation.invalid', { defaultValue: 'Enter the 6-digit code.' }));
  return;
}

if (useRecovery && recoveryCode.trim().length < 5) {
  setError('Enter a valid recovery code.');
  return;
}

  try {
    setSending(true);
const deviceName = await getDeviceName();
   const deviceId = getDeviceId(); // دالة تحكيها تحت
const fcmToken = localStorage.getItem('fcm_token') 
  ?? await requestNotificationPermission() 
  ?? 'null';const payload = useRecovery
  ? {
      phone,
      recovery_code: recoveryCode.trim(),
      login_token,
      fcm_token: fcmToken,
      device_id: deviceId,
      device_name: deviceName,
      platform_type: 'web',
    }
  : {
      phone,
      twofa_code: code,
      login_token,
      fcm_token: fcmToken,
      device_id: deviceId,
     device_name: deviceName,
      platform_type: 'web',
    };

const response = await axios.post(
  'https://homeservicesplatfrom.onrender.com/api/admin/auth/verify-login/',
  payload
);

    const data = response.data.data;

    // // حفظ التوكنات
    // localStorage.setItem('access_token', data.access_token.token);
    // localStorage.setItem('refresh_token', data.refresh_token.token);
persistTokens(data); // ← بيخزن access_token + refresh_token + الـ expiry تبعهم مع بعض

    // حفظ بيانات الادمن
    localStorage.setItem('admin', JSON.stringify(data.admin));

    // تسجيل الدخول داخل AppContext
    login(phone);

    notify({
      severity: 'success',
      title: 'Success',
      message: 'Logged in successfully',
    });

    navigate('/dashboard', { replace: true });
  } catch (err) {
    console.error(err);

    setError(
      err?.response?.data?.message ||
        'Invalid OTP code'
    );
  } finally {
    setSending(false);
  }
}
  // function handleResend() {
  //   if (resendCooldown > 0) return;
  //   setSending(true);
  //   setTimeout(() => {
  //     setSending(false);
  //     setResendCooldown(30);
  //     notify({
  //       severity: 'info',
  //       title: t('otp.resent', { defaultValue: 'OTP resent' }),
  //       message: t('otp.resentMessage', { phone }),
  //     });
  //   }, 700);
  // }
async function handleResend() {
  if (resendCooldown > 0) return;

  try {
    setSending(true);

    const response = await axios.post(
      'https://homeservicesplatfrom.onrender.com/api/admin/auth/login',
      {
        phone,
        password,
      }
    );

    const newLoginToken = response.data.data.login_token;

    // تحديث state
   // location.state.loginToken = newLoginToken;
setLoginToken(newLoginToken);
    setResendCooldown(30);

    notify({
      severity: 'success',
      title: 'OTP Sent',
      message: 'A new OTP has been sent successfully',
    });
  } catch (err) {
    console.error(err);

    notify({
      severity: 'error',
      title: 'Error',
      message:
        err?.response?.data?.message ||
        'Failed to resend OTP',
    });
  } finally {
    setSending(false);
  }
}
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', px: 2, py: 6 }}>
      <Card sx={{ width: '100%', maxWidth: 520, borderRadius: 3 }}>
        <CardContent>
          <Stack spacing={3}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800 }}>
                {t('otp.title', { defaultValue: 'Verify your phone' })}
              </Typography>
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                {t('otp.instructions', {
                  defaultValue: 'Enter the 6-digit code we sent to {{phone}}',
                  phone: phone || 'your phone',
                })}
              </Typography>
            </Box>

            <Box component="form" onSubmit={handleVerify} noValidate>
              <Stack spacing={2}>
                {/* OTP Boxes */}
                <Stack direction="row" spacing={1} justifyContent="center">
                  {digits.map((digit, i) => (
                   <Box
                                 key={i}
                           component="input"
                         ref={(el) => (inputRefs.current[i] = el)}
                           value={digit}
                       onChange={(e) => handleChange(i, e)}
                                 onKeyDown={(e) => handleKeyDown(i, e)}
                                 onPaste={handlePaste}
                                onFocus={(e) => e.target.select()}
                               disabled={sending}
                                     maxLength={1}
                      autoComplete="one-time-code"
                      inputMode="text"
                      sx={{
                        width: 48,
                        height: 56,
                        textAlign: 'center',
                        fontSize: '1.4rem',
                        fontWeight: 700,
                        border: (theme) =>
                          `2px solid ${
                            error
                              ? theme.palette.error.main
                              : digit
                              ? theme.palette.primary.main
                              : theme.palette.divider
                          }`,
                        borderRadius: 2,
                        outline: 'none',
                        bgcolor: 'background.paper',
                        color: 'text.primary',
                        caretColor: 'primary.main',
                        transition: 'border-color 0.2s, box-shadow 0.2s',
                        '&:focus': {
                          borderColor: error ? 'error.main' : 'primary.main',
                          boxShadow: (theme) =>
                            `0 0 0 3px ${
                              error
                                ? theme.palette.error.light + '55'
                                : theme.palette.primary.light + '55'
                            }`,
                        },
                      }}
                    />
                  ))}
                </Stack>

                {error && (
                  <Typography variant="caption" color="error" textAlign="center">
                    {error}
                  </Typography>
                )}

                {/* Toggle بين OTP و Recovery Code */}
<Button
  variant="text"
  size="small"
  onClick={() => {
    setUseRecovery((v) => !v);
    setError('');
  }}
  sx={{ alignSelf: 'center', fontSize: '0.8rem', textTransform: 'none', color: 'text.secondary' }}
>
  {useRecovery
    ? '← Use authenticator code instead'
    : "Can't access your app? Use a recovery code"}
</Button>

{useRecovery && (
  <TextField
    label="Recovery Code"
    placeholder="XXXX-HSP-XXXX"
 disabled={sending}
    value={recoveryCode}
    onChange={(e) => {
      setRecoveryCode(e.target.value.toUpperCase());
      if (error) setError('');
    }}
    fullWidth
    inputProps={{
      style: { fontFamily: 'monospace', fontSize: '1.1rem', letterSpacing: '0.1em', textAlign: 'center' }
    }}
  />
)}  

                <Stack direction="row" spacing={2} alignItems="center" justifyContent="center">
                 <Button
  type="submit"
  variant="contained"
  disabled={sending || (useRecovery ? recoveryCode.trim().length < 5 : code.length !== LENGTH)}
  sx={{ position: 'relative', minWidth: 100,overflow: 'hidden' }}
>
  {sending && (
    <CircularProgress size={20} thickness={5} sx={{ color: 'white', position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }} />
  )}
  <span style={{ opacity: sending ? 0 : 1 }}>
    {t('otp.verify', { defaultValue: 'Verify' })}
  </span>
</Button>
                  <Button
                    variant="outlined"
                    onClick={handleResend}
                    disabled={sending || resendCooldown > 0}
                  >
                    {sending
                      ? t('otp.resending', { defaultValue: 'Resending...' })
                      : resendCooldown > 0
                      ? t('otp.resendWait', { seconds: resendCooldown })
                      : t('otp.resend', { defaultValue: 'Resend OTP' })}
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default OtpPage;