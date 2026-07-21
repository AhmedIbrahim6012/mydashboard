import {  useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Avatar, Box, Button, Card, CardContent,
  Stack, TextField, Typography,
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useTheme } from '@mui/material/styles';
import { useAppContext } from '../context/AppContext';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
// أضف هذا للـ imports الحالية
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  List, ListItem, ListItemText, Divider, Alert
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { requestNotificationPermission } from '../services/notificationsService';
import { getDeviceId , getDeviceName } from '../utils/deviceId';
export default function TwoFactorSetupPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, notify } = useAppContext();

  const { phone,  login_token, qr_code_url } = location.state || {};

  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);


const [recoveryCodes, setRecoveryCodes] = useState([]);
const [showRecovery, setShowRecovery] = useState(false);
const [copied, setCopied] = useState(false);

  // إذا ما في state، ارجع للـ login
  if (!phone || !login_token) {
    navigate('/login', { replace: true });
    return null;
  }

  async function handleVerify(e) {
    e.preventDefault();
    if (code.length !== 6) {
      setError('Enter the 6-digit code from Google Authenticator');
      return;
    }
    const deviceName = await getDeviceName();
const fcmToken = localStorage.getItem('fcm_token') 

  ?? await requestNotificationPermission() 
  ?? 'null';const deviceId = getDeviceId();
    try {
      setLoading(true);
      const response = await axios.post(
        'https://homeservicesplatfrom.onrender.com/api/admin/auth/verify-login/',
        {
  phone,
  twofa_code: code,
  login_token,
  fcm_token: fcmToken,
  device_id: deviceId,
  device_name: deviceName,
  platform_type: 'web',
}
      );

      const data = response.data.data;

     localStorage.setItem('access_token', data.access_token.token);
localStorage.setItem('refresh_token', data.refresh_token.token);
localStorage.setItem('admin', JSON.stringify(data.admin));

// إذا في recovery codes — اعرضهن أول
if (data.recovery_codes?.length > 0) {
  setRecoveryCodes(data.recovery_codes);
  setShowRecovery(true);
} else {
  login(phone);
  notify({ severity: 'success', title: 'Success', message: 'Two-factor authentication activated successfully' });
  navigate('/dashboard', { replace: true });
}
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid code, try again');
    } finally {
      setLoading(false);
    }
  }
function handleCopyCodes() {
  navigator.clipboard.writeText(recoveryCodes.join('\n'));
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
}

function handleDownloadCodes() {
  const text = `Recovery Codes - Home Services Platform\n${'='.repeat(40)}\n\n${recoveryCodes.join('\n')}\n\n${'='.repeat(40)}\nKeep these codes safe. Each code can only be used once.`;
  const blob = new Blob([text], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'recovery-codes.txt';
  a.click();
  URL.revokeObjectURL(url);
}

function handleDoneRecovery() {
  login(phone);
  notify({ severity: 'success', title: 'Success', message: 'Two-factor authentication activated successfully' });
  navigate('/dashboard', { replace: true });
}
  return (
    <Box
      dir={theme.direction}
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        bgcolor: 'background.default',
      }}
    >
      <Card elevation={6} sx={{ maxWidth: 520, width: '100%', borderRadius: 3 }}>
        <CardContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            p: { xs: 3, sm: 4 },
          }}
        >
          <Avatar sx={{ bgcolor: 'primary.main', width: 72, height: 72 }}>
            <LockOutlinedIcon fontSize="large" />
          </Avatar>

          <Typography variant="h5" component="h1" align="center" sx={{ fontWeight: 700 }}>
            Enable Two-Factor Authentication
          </Typography>

          <Typography variant="body2" color="text.secondary" align="center" sx={{ maxWidth: 420 }}>
            Scan the QR code below using Google Authenticator, then enter the 6-digit code to activate.
          </Typography>

          {/* QR Code الحقيقي */}
          <Box sx={{ mt: 1.5, p: 2, bgcolor: 'white', borderRadius: 2, boxShadow: 1 }}>
            {qr_code_url ? (
              <QRCodeSVG value={qr_code_url} size={220} />
            ) : (
              <Typography color="error">QR code not available</Typography>
            )}
          </Box>

          <Box component="form" onSubmit={handleVerify} sx={{ width: '100%' }}>
            <Stack spacing={2}>
              <TextField
                label="Verification Code"
                variant="outlined"
                fullWidth
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  if (error) setError('');
                }}
                error={Boolean(error)}
                helperText={error}
                inputProps={{
                  inputMode: 'numeric',
                  maxLength: 6,
                  style: {
                    textAlign: 'center',
                    fontSize: 22,
                    letterSpacing: '0.5rem',
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading || code.length !== 6}
                sx={{ py: 1.5, fontWeight: 700 }}
              >
                {loading ? 'Verifying...' : 'Verify & Activate'}
              </Button>

              <Button
                variant="text"
                onClick={() => navigate('/login')}
              >
                Back to Login
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>
      {/* Recovery Codes Dialog */}
<Dialog
  open={showRecovery}
  maxWidth="sm"
  fullWidth
  disableEscapeKeyDown
  onClose={() => {}} // منع الإغلاق بالضغط بالخارج
  PaperProps={{ sx: { borderRadius: 3 } }}
>
  <DialogTitle sx={{ pb: 1 }}>
    <Typography variant="h6" sx={{ fontWeight: 800 }}>
      🔐 Save Your Recovery Codes
    </Typography>
  </DialogTitle>

  <DialogContent>
    <Stack spacing={2.5}>
      <Alert severity="warning" sx={{ borderRadius: 2 }}>
        <Typography variant="body2" sx={{ fontWeight: 600 }}>
          Save these codes now — you won't be able to see them again!
        </Typography>
        <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
          Use them if you lose access to your authenticator app.
        </Typography>
      </Alert>

      <Box
        sx={(theme) => ({
          bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: 2,
          p: 2,
        })}
      >
        <List dense disablePadding>
          {recoveryCodes.map((code, i) => (
            <Box key={code}>
              <ListItem disablePadding sx={{ py: 0.6 }}>
                <ListItemText
                  primary={
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography
                        sx={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          fontSize: '1rem',
                          letterSpacing: '0.08em',
                          color: 'text.primary',
                        }}
                      >
                        {code}
                      </Typography>
                      <Typography variant="caption" color="text.disabled">
                        #{i + 1}
                      </Typography>
                    </Stack>
                  }
                />
              </ListItem>
              {i < recoveryCodes.length - 1 && <Divider sx={{ borderStyle: 'dashed', opacity: 0.4 }} />}
            </Box>
          ))}
        </List>
      </Box>

      <Stack direction="row" spacing={1.5}>
        <Button
          variant="outlined"
          startIcon={<ContentCopyIcon />}
          onClick={handleCopyCodes}
          fullWidth
          sx={{ borderRadius: 2 }}
        >
          {copied ? '✓ Copied!' : 'Copy All'}
        </Button>
        <Button
          variant="outlined"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadCodes}
          fullWidth
          sx={{ borderRadius: 2 }}
        >
          Download .txt
        </Button>
      </Stack>
    </Stack>
  </DialogContent>

  <DialogActions sx={{ p: 3, pt: 1 }}>
    <Button
      variant="contained"
      fullWidth
      size="large"
      onClick={handleDoneRecovery}
      sx={{ borderRadius: 2.5, py: 1.3, fontWeight: 700 }}
    >
      I've Saved My Codes — Continue to Dashboard
    </Button>
  </DialogActions>
</Dialog>
    </Box>
  );
}