

import { useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import SecurityIcon from '@mui/icons-material/Security';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import DownloadIcon from '@mui/icons-material/Download';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import RefreshIcon from '@mui/icons-material/Refresh';
import { QRCodeSVG } from 'qrcode.react';
import axiosInstance from '../utils/axiosInstance';
import { CircularProgress } from '@mui/material';

import SmartphoneIcon from '@mui/icons-material/Smartphone';
import ComputerIcon from '@mui/icons-material/Computer';
import LogoutIcon from '@mui/icons-material/Logout';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import ActiveSessionsDialog from '../components/ActiveSessionsDialog';

const STEPS = ['Confirm', 'Scan QR', 'Save Codes'];
const confettiKeyframes = `
@keyframes confettiFall {
  0%   { transform: translateY(-60px) rotate(0deg);   opacity: 1; }
  100% { transform: translateY(340px) rotate(720deg); opacity: 0; }
}
@keyframes popIn {
  0%   { transform: scale(0.5); opacity: 0; }
  70%  { transform: scale(1.15); }
  100% { transform: scale(1);   opacity: 1; }
}`;
// ─── Recovery Codes Dialog ────────────────────────────────────────────────────
function RecoveryCodesDialog({ open, codes, onDone }) {
  const [copied, setCopied] = useState(false);

  const [downloaded, setDownloaded] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(codes.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handleDownload() {
    const text = [
      'Recovery Codes — Home Services Platform',
      '='.repeat(42),
      '',
      ...codes,
      '',
      '='.repeat(42),
      'Each code can only be used once.',
      'Store them somewhere safe.',
    ].join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recovery-codes.txt';
    a.click();
URL.revokeObjectURL(url);
setDownloaded(true);
    }
  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
      disableEscapeKeyDown
      onClose={() => {}}
      PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
    >
      <Box sx={{ height: 4, bgcolor: 'warning.main' }} />

      <DialogTitle sx={{ pt: 3, pb: 1 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Avatar sx={{ bgcolor: 'warning.light', color: 'warning.dark', width: 40, height: 40 }}>
            <WarningAmberIcon fontSize="small" />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              Save Your Recovery Codes
            </Typography>
            <Typography variant="caption" color="text.secondary">
              You won't see these again
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ pt: 1 }}>
        <Stack spacing={2.5}>
          <Alert severity="warning" sx={{ borderRadius: 2.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              Download or copy before continuing — these codes are shown only once.
            </Typography>
            <Typography variant="caption">
              Use them if you lose access to your authenticator app. Each code works once.
            </Typography>
          </Alert>

          <Box
            sx={(theme) => ({
              bgcolor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.50',
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 3,
              overflow: 'hidden',
            })}
          >
            <List dense disablePadding>
              {codes.map((code, i) => (
                <Box key={code}>
                  <ListItem sx={{ px: 2.5, py: 0.8 }}>
                    <ListItemText
                      primary={
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Typography
                            sx={{
                              fontFamily: 'monospace',
                              fontWeight: 700,
                              fontSize: '0.95rem',
                              letterSpacing: '0.1em',
                            }}
                          >
                            {code}
                          </Typography>
                          <Typography variant="caption" color="text.disabled" sx={{ fontFamily: 'monospace' }}>
                            #{String(i + 1).padStart(2, '0')}
                          </Typography>
                        </Stack>
                      }
                    />
                  </ListItem>
                  {i < codes.length - 1 && (
                    <Divider sx={{ borderStyle: 'dashed', opacity: 0.4, mx: 2 }} />
                  )}
                </Box>
              ))}
            </List>
          </Box>

         <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<ContentCopyIcon />}
              onClick={handleCopy}
              fullWidth
              color={copied ? 'success' : 'inherit'}
              sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 600 }}
            >
              {copied ? '✓ Copied!' : 'Copy All'}
            </Button>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              fullWidth
              sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 600 }}
            >
              Download .txt
            </Button>
          </Stack>

          {!downloaded && !copied && (
            <Typography variant="caption" color="warning.main" textAlign="center" sx={{ fontWeight: 600 }}>
              ⚠ Please download or copy your codes before continuing.
            </Typography>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          variant="contained"
          color="success"
          fullWidth
          size="large"
onClick={onDone}
disabled={!downloaded && !copied}          sx={{ borderRadius: 2.5, py: 1.3, fontWeight: 700, textTransform: 'none' }}
        >
          I've Saved My Codes — Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ─── Change QR Dialog ─────────────────────────────────────────────────────────
function ChangeQrDialog({ open, onClose }) {
  const [step, setStep] = useState(0);
  const [qrUrl, setQrUrl] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [otpError, setOtpError] = useState('');
  const [loading, setLoading] = useState(false);
  const [recoveryCodes, setRecoveryCodes] = useState([]);
  const [showRecovery, setShowRecovery] = useState(false);

  function handleClose() {
    setStep(0);
    setQrUrl('');
    setOtpCode('');
    setOtpError('');
    setRecoveryCodes([]);
    setShowRecovery(false);
    onClose();
  }

  async function handleConfirm() {
    setLoading(true);
    setOtpError('');
    try {
      const res = await axiosInstance.post('/admin/auth/generate-secret-2fa');
      setQrUrl(res.data.data.qr_code_url);
      setStep(1);
    } catch (err) {
      setOtpError(err?.response?.data?.message || 'Failed to generate QR. Try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerify() {
    if (otpCode.length !== 6) {
      setOtpError('Enter the 6-digit code from your authenticator app.');
      return;
    }
    setLoading(true);
    setOtpError('');
    try {
      const res = await axiosInstance.post('/admin/auth/verify-2fa', {
        twofa_code: otpCode,
      });
      setRecoveryCodes(res.data.data);
      setShowRecovery(true);
    } catch (err) {
      setOtpError(err?.response?.data?.message || 'Invalid code. Try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleRecoveryDone() {
    setShowRecovery(false);
    setStep(2);
  }

  return (
    <>
    {(loading) && (
  <Box sx={{
    position: 'fixed',
    inset: 0,
    zIndex: 9999,
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    backdropFilter: 'blur(4px)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  }}>
    <CircularProgress size={64} thickness={4} sx={{ color: '#ffffff' }} />
    <Typography sx={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
      {step === 0 ? 'Generating QR Code...' : 'Verifying Code...'}
    </Typography>
  </Box>
)}
      <Dialog
        open={open && !showRecovery}
        onClose={step === 0 ? handleClose : undefined}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
      >
        <Box sx={{ height: 4, bgcolor: step === 2 ? 'success.main' : 'primary.main' }} />

        {step === 0 && (
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{ position: 'absolute', top: 14, right: 14, bgcolor: 'action.hover' }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}

        <DialogTitle sx={{ pt: 3, pb: 2 }}>
          <Stepper activeStep={step} sx={{ mb: 0 }}>
            {STEPS.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </DialogTitle>

        <DialogContent sx={{ pt: 1 }}>
          {/* Step 0: Confirm */}
          {step === 0 && (
            <Stack spacing={2.5} alignItems="center" sx={{ py: 1, textAlign: 'center' }}>
              <Avatar sx={{ width: 64, height: 64, bgcolor: 'primary.light', color: 'primary.dark' }}>
                <QrCode2Icon sx={{ fontSize: 34 }} />
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Change Authenticator QR?
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  This will generate a new QR code. Your current authenticator setup will be replaced
                  and you'll need to re-scan.
                </Typography>
              </Box>
              <Alert severity="warning" sx={{ borderRadius: 2, width: '100%', textAlign: 'left' }}>
                Make sure you have access to your authenticator app before continuing.
              </Alert>
              {otpError && (
                <Alert severity="error" sx={{ borderRadius: 2, width: '100%', textAlign: 'left' }}>
                  {otpError}
                </Alert>
              )}
            </Stack>
          )}

          {/* Step 1: Scan + Verify */}
          {step === 1 && (
            <Stack spacing={2.5} alignItems="center">
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Scan this QR with Google Authenticator, then enter the 6-digit code below.
              </Typography>

             <Box
  sx={(theme) => ({
    p: 2.5,
    bgcolor: '#fff',
    borderRadius: 3,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow: '0 4px 16px rgba(0,0,0,0.06)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  })}
>
                {qrUrl ? (
                  <QRCodeSVG value={qrUrl} size={200} />
                ) : (
                  <Typography color="error">QR not available</Typography>
                )}
              </Box>

              <TextField
                label="Verification Code"
                value={otpCode}
                onChange={(e) => {
                  setOtpCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                  if (otpError) setOtpError('');
                }}
                error={Boolean(otpError)}
                helperText={otpError}
                fullWidth
                inputProps={{
                  inputMode: 'numeric',
                  maxLength: 6,
                  style: {
                    textAlign: 'center',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    letterSpacing: '0.5rem',
                    fontFamily: 'monospace',
                  },
                }}
                sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2.5 } }}
              />
            </Stack>
          )}

          {/* Step 2: Done */}
        {/* Step 2: Done */}
{step === 2 && (
  <>
    <style>{confettiKeyframes}</style>
    {/* تم تعديل الحاوية هنا لمنع أي تداخل وتأمين التوسيط */}
    <Stack 
      spacing={3} 
      alignItems="center" 
      justifyContent="center" 
      sx={{ py: 4, px: 2, textAlign: 'center', position: 'relative', overflow: 'hidden', width: '100%' }}
    >

      {/* Confetti pieces */}
      {[...Array(22)].map((_, i) => {
        const colors = ['#2563eb','#22c55e','#f59e0b','#ef4444','#a855f7','#06b6d4','#ec4899'];
        const color = colors[i % colors.length];
        const left = `${(i * 4.5) % 100}%`;
        const delay = `${(i * 0.12).toFixed(2)}s`;
        const duration = `${1.1 + (i % 5) * 0.18}s`;
        const size = 7 + (i % 4) * 3;
        const isCircle = i % 3 === 0;
        return (
          <Box key={i} sx={{
            position: 'absolute',
            top: 0,
            left,
            width: size,
            height: isCircle ? size : size * 0.5,
            borderRadius: isCircle ? '50%' : '2px',
            backgroundColor: color,
            animation: `confettiFall ${duration} ${delay} ease-in forwards`,
            zIndex: 0,
          }} />
        );
      })}

      {/* الأيقونة والنصوص بداخل تدفق مرن وموسط تلقائياً */}
      <Avatar sx={{
        width: 80, 
        height: 80,
        bgcolor: 'success.light', 
        color: 'success.dark',
        animation: 'popIn 0.5s ease forwards',
        zIndex: 1,
        boxShadow: '0 4px 12px rgba(34, 197, 94, 0.2)'
      }}>
        <CheckCircleIcon sx={{ fontSize: 48 }} />
      </Avatar>

      <Box sx={{ zIndex: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 800, mb: 1 }}>
          Authenticator Updated!
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ maxWwidth: '280px', mx: 'auto' }}>
          Your QR code has been regenerated successfully. Your new authenticator setup is now active.
        </Typography>
      </Box>
    </Stack>
  </>
)}
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
          {step === 0 && (
            <>
              <Button
                variant="outlined"
                onClick={handleClose}
                sx={{ borderRadius: 2.5, textTransform: 'none', flex: 1 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleConfirm}
                disabled={loading}
                sx={{ borderRadius: 2.5, textTransform: 'none', flex: 1, fontWeight: 700 }}
              >
                {loading ? 'Generating…' : 'Yes, Change It'}
              </Button>
            </>
          )}

          {step === 1 && (
            <Button
              variant="contained"
              onClick={handleVerify}
              disabled={loading || otpCode.length !== 6}
              fullWidth
              size="large"
              sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
            >
              {loading ? 'Verifying…' : 'Verify & Continue'}
            </Button>
          )}

          {step === 2 && (
            <Button
              variant="contained"
              color="success"
              onClick={handleClose}
              fullWidth
              size="large"
              sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
            >
              Done
            </Button>
          )}
        </DialogActions>
      </Dialog>

      <RecoveryCodesDialog
        open={showRecovery}
        codes={recoveryCodes}
        onDone={handleRecoveryDone}
      />
    </>
  );
}

// ─── Settings Page ────────────────────────────────────────────────────────────
function SettingsPage() {
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
const [sessionsDialogOpen, setSessionsDialogOpen] = useState(false); // ← أضف هاد

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
          Settings
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Manage your account security and preferences
        </Typography>
      </Box>

      {/* Security Card */}
      <Card
        elevation={0}
        sx={(theme) => ({
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
        })}
      >
        <Box
          sx={(theme) => ({
            px: 3,
            py: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.action.hover,
          })}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <SecurityIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Two-Factor Authentication
            </Typography>
            <Chip label="Enabled" color="success" size="small" sx={{ fontWeight: 700, ml: 0.5 }} />
          </Stack>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: 'primary.light',
                  color: 'primary.dark',
                  borderRadius: 2.5,
                }}
              >
                <QrCode2Icon />
              </Avatar>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  Authenticator App (TOTP)
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Google Authenticator or any TOTP-compatible app
                </Typography>
              </Box>
            </Stack>

            <Tooltip title="Generate a new QR code for your authenticator app">
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={() => setQrDialogOpen(true)}
                sx={{
                  borderRadius: 1,
                  textTransform: 'none',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}
              >
                Change QR Code
              </Button>
            </Tooltip>
          </Stack>

          <Alert severity="info" sx={{ mt: 2.5, borderRadius: 2.5 }}>
            <Typography variant="body2">
              Regenerating your QR code will invalidate your current authenticator setup.
              You'll need to re-scan the new code to continue using 2FA.
            </Typography>
          </Alert>
        </CardContent>
      </Card>

     <Card
        elevation={0}
        sx={(theme) => ({
          borderRadius: 2,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'hidden',
        })}
      >
        <Box
          sx={(theme) => ({
            px: 3,
            py: 2,
            borderBottom: `1px solid ${theme.palette.divider}`,
            bgcolor: theme.palette.action.hover,
          })}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <PrivacyTipIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Privacy & Security
            </Typography>
          </Stack>
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            justifyContent="space-between"
            alignItems={{ xs: 'flex-start', sm: 'center' }}
            spacing={2}
          >
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: 'info.light',
                  color: 'info.dark',
                  borderRadius: 2.5,
                }}
              >
                <ComputerIcon />
              </Avatar>
              <Box>
                <Typography variant="body1" sx={{ fontWeight: 700 }}>
                  Active Sessions
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Manage devices currently logged into your account
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="outlined"
              startIcon={<PrivacyTipIcon />}
              onClick={() => setSessionsDialogOpen(true)}
              sx={{
                borderRadius: 1,
                textTransform: 'none',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              Manage Sessions
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <ChangeQrDialog open={qrDialogOpen} onClose={() => setQrDialogOpen(false)} />
      {/* ← أضف هاد */}
      <ActiveSessionsDialog
        open={sessionsDialogOpen}
        onClose={() => setSessionsDialogOpen(false)}
      />
    </Stack>
  );
}

export default SettingsPage;