
import { useState ,useEffect} from 'react';
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
    Skeleton, // أضفها هنا

} from '@mui/material';
import SmartphoneIcon from '@mui/icons-material/Smartphone';
import ComputerIcon from '@mui/icons-material/Computer';
import LogoutIcon from '@mui/icons-material/Logout';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CloseIcon from '@mui/icons-material/Close';
import { CircularProgress } from '@mui/material';
import api from '../utils/axiosInstance';
import { useAppContext } from '../context/AppContext';
function ActiveSessionsDialog({ open, onClose }) {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [logoutAllLoading, setLogoutAllLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const [error, setError] = useState('');
  const [confirmLogoutAll, setConfirmLogoutAll] = useState(false);
const { logout } = useAppContext();
  // جلب الجلسات عند فتح الـ Dialog
  useEffect(() => {
    if (!open) return;
    fetchSessions();
  }, [open]);

  async function fetchSessions() {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/admin/auth/me');
      setSessions(res.data.data['logged in devices'] || []);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load sessions.');
    } finally {
      setLoading(false);
    }
  }

 async function handleLogoutDevice(deviceId) {
  setRemovingId(deviceId);
  try {
    await api.post('/admin/auth/logout-device', { device_id: deviceId });

    // ← أضف هاد الشرط
    if (deviceId === currentDeviceId) {
      window.dispatchEvent(new Event('auth:logout'));
      return;
    }

    setSessions((prev) => prev.filter((s) => s.device_id !== deviceId));
  } catch (err) {
    setError(err?.response?.data?.message || 'Failed to logout device.');
  } finally {
    setRemovingId(null);
  }
}

  async function handleLogoutAll() {
    setLogoutAllLoading(true);
    try {
      await     api.post('/admin/auth/logout-all-devices');
 window.dispatchEvent(new Event('auth:logout'));     
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to logout all devices.');
    } finally {
      setLogoutAllLoading(false);
      setConfirmLogoutAll(false);
    }
  }

  function getPlatformIcon(platform) {
    if (platform === 'android' || platform === 'ios') {
      return <SmartphoneIcon fontSize="small" />;
    }
    return <ComputerIcon fontSize="small" />;
  }

  // الجلسة الحالية = أقل last_activity (الأحدث)
  const currentDeviceId = localStorage.getItem('device_id');

  return (
    <>
      <Dialog
        open={open && !confirmLogoutAll}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, overflow: 'hidden' } }}
      >
        <Box sx={{ height: 4, bgcolor: 'primary.main' }} />

<IconButton
  onClick={onClose}
  size="small"
  sx={{ position: 'absolute', top: 14, right: 14, bgcolor: 'action.hover' }}
>
  <CloseIcon fontSize="small" />
</IconButton>

<DialogTitle sx={{ pt: 3, pb: 1 }}>
  <Stack direction="row" spacing={1.5} alignItems="center">
    <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.dark', width: 40, height: 40 }}>
      <PrivacyTipIcon fontSize="small" />
    </Avatar>
    <Box>
      <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
        Active Sessions
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {sessions.length} device{sessions.length !== 1 ? 's' : ''} logged in
      </Typography>
    </Box>
  </Stack>
</DialogTitle>

        <DialogContent sx={{ pt: 1, px: 3 }}>
          <Stack spacing={2}>
            {error && (
              <Alert severity="error" sx={{ borderRadius: 2.5 }}>{error}</Alert>
            )}
{loading ? (
  <Box
    sx={(theme) => ({
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: 3,
      overflow: 'hidden',
    })}
  >
    {[1, 2, 3].map((item, index) => (
      <Box key={item}>
        <Stack
          direction="row"
          alignItems="center"
          spacing={2}
          sx={{ px: 2.5, py: 2 }}
        >
          {/* صورة الجهاز */}
          <Skeleton
            variant="rounded"
            width={42}
            height={42}
            sx={{ borderRadius: 2.5, flexShrink: 0 }}
          />

          {/* معلومات الجلسة */}
          <Box sx={{ flex: 1 }}>
            <Skeleton
              variant="text"
              width="45%"
              height={24}
            />

            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ mt: 0.5 }}
            >
              <Skeleton
                variant="text"
                width="35%"
                height={18}
              />

              <Skeleton
                variant="rounded"
                width={55}
                height={18}
              />
            </Stack>
          </Box>

          {/* زر تسجيل الخروج */}
          <Skeleton
            variant="circular"
            width={32}
            height={32}
          />
        </Stack>

        {index < 2 && (
          <Divider sx={{ opacity: 0.5 }} />
        )}
      </Box>
    ))}
  </Box>
) : (
              <Box
                sx={(theme) => ({
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: 3,
                  overflow: 'hidden',
                })}
              >
                {sessions.map((session, i) => {
                  const isCurrent = session.device_id === currentDeviceId;
                  const isRemoving = removingId === session.device_id;

                  return (
                    <Box key={session.id}>
                      <Stack
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        sx={(theme) => ({
                          px: 2.5,
                          py: 2,
                          bgcolor: isCurrent
                            ? theme.palette.mode === 'dark'
                              ? 'rgba(99,102,241,0.08)'
                              : 'rgba(99,102,241,0.05)'
                            : 'transparent',
                          transition: 'background 0.2s',
                          '&:hover': {
                            bgcolor: theme.palette.action.hover,
                          },
                        })}
                      >
                        {/* Platform Icon */}
                        <Avatar
                          sx={(theme) => ({
                            width: 42,
                            height: 42,
                            borderRadius: 2.5,
                            bgcolor: isCurrent
                              ? 'primary.light'
                              : theme.palette.mode === 'dark'
                              ? 'grey.800'
                              : 'grey.100',
                            color: isCurrent ? 'primary.dark' : 'text.secondary',
                            flexShrink: 0,
                          })}
                        >
                          {getPlatformIcon(session.platform)}
                        </Avatar>

                        {/* Info */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontWeight: 700,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {session.device_name}
                            </Typography>
                            {isCurrent && (
                              <Chip
                                label="This device"
                                size="small"
                                color="primary"
                                sx={{ fontWeight: 700, height: 20, fontSize: '0.65rem' }}
                              />
                            )}
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ mt: 0.3 }}>
                            <AccessTimeIcon sx={{ fontSize: 13, color: 'text.disabled' }} />
                            <Typography variant="caption" color="text.secondary">
                              {session.last_activity_at}
                            </Typography>
                            <Typography variant="caption" color="text.disabled">·</Typography>
                            <Chip
                              label={session.platform}
                              size="small"
                              variant="outlined"
                              sx={{ height: 16, fontSize: '0.6rem', px: 0.3 }}
                            />
                          </Stack>
                        </Box>

                        {/* Logout Button */}
                        <Tooltip title={isCurrent ? 'Logout from this device' : 'Remove session'}>
                          <span>
                            <IconButton
                              size="small"
                              color={isCurrent ? 'error' : 'default'}
                              onClick={() => handleLogoutDevice(session.device_id)}
                              disabled={isRemoving || logoutAllLoading}
                              sx={{
                                bgcolor: 'action.hover',
                                '&:hover': { bgcolor: 'error.light', color: 'error.dark' },
                                transition: 'all 0.2s',
                              }}
                            >
                              {isRemoving
                                ? <CircularProgress size={16} />
                                : <LogoutIcon fontSize="small" />
                              }
                            </IconButton>
                          </span>
                        </Tooltip>
                      </Stack>

                      {i < sessions.length - 1 && (
                        <Divider sx={{ opacity: 0.5 }} />
                      )}
                    </Box>
                  );
                })}

                {sessions.length === 0 && !loading && (
                  <Stack alignItems="center" py={4}>
                    <Typography color="text.secondary" variant="body2">No active sessions found.</Typography>
                  </Stack>
                )}
              </Box>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 3, pt: 2 }}>
          <Button
            variant="outlined"
            color="error"
            fullWidth
            size="large"
            startIcon={logoutAllLoading ? <CircularProgress size={18} color="error" /> : <LogoutIcon />}
            onClick={() => setConfirmLogoutAll(true)}
            disabled={loading || logoutAllLoading || sessions.length === 0}
            sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}
          >
            Logout from All Devices
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Logout All Dialog */}
      <Dialog
        open={confirmLogoutAll}
        onClose={() => setConfirmLogoutAll(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <Box sx={{ height: 4, bgcolor: 'error.main' }} />
        <DialogTitle sx={{ pt: 3 }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Avatar sx={{ bgcolor: 'error.light', color: 'error.dark', width: 40, height: 40 }}>
              <LogoutIcon fontSize="small" />
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                Logout All Devices?
              </Typography>
              <Typography variant="caption" color="text.secondary">
                This includes your current session
              </Typography>
            </Box>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Alert severity="error" sx={{ borderRadius: 2.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              You'll be signed out from all {sessions.length} devices immediately.
            </Typography>
            <Typography variant="caption">
              You'll need to login again on all your devices.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1, gap: 1 }}>
          <Button
            variant="outlined"
            onClick={() => setConfirmLogoutAll(false)}
            sx={{ borderRadius: 2.5, textTransform: 'none', flex: 1 }}
            disabled={logoutAllLoading}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleLogoutAll}
            disabled={logoutAllLoading}
            sx={{ borderRadius: 2.5, textTransform: 'none', flex: 1, fontWeight: 700 }}
          >
            {logoutAllLoading
              ? <CircularProgress size={20} color="inherit" />
              : 'Yes, Logout All'
            }
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
export default ActiveSessionsDialog;