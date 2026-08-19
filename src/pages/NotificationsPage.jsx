

import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Tooltip,
  Paper,
  Stack,
  Badge,
  Pagination,
  alpha,
  useTheme,
  Fade,
  Skeleton,
} from '@mui/material';

import NotificationsNoneRoundedIcon from '@mui/icons-material/NotificationsNoneRounded';
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded';
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded';
import DoneRoundedIcon from '@mui/icons-material/DoneRounded';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import MarkEmailReadRoundedIcon from '@mui/icons-material/MarkEmailReadRounded';
import MarkEmailUnreadRoundedIcon from '@mui/icons-material/MarkEmailUnreadRounded';
import InboxRoundedIcon from '@mui/icons-material/InboxRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';

import { useTranslation } from 'react-i18next';
import api from '../utils/axiosInstance';
import PageHeader from '../components/PageHeader';

// ── helpers ────────────────────────────────────────────────────────────────────

const TYPE_CONFIG = {
  new_order: {
    icon: <ShoppingCartRoundedIcon sx={{ fontSize: 18 }} />,
    color: '#6366f1',
    bg: 'rgba(99,102,241,0.08)',
    label: 'New Order',
  },
};

const DEFAULT_CONFIG = {
  icon: <NotificationsNoneRoundedIcon sx={{ fontSize: 18 }} />,
  color: '#64748b',
  bg: 'rgba(100,116,139,0.08)',
  label: 'System',
};

const getConfig = (type) => TYPE_CONFIG[type] || DEFAULT_CONFIG;

function parseDate(dateStr) {
  if (!dateStr) return null;

  const value = String(dateStr);
  const normalized = value.includes('T') ? value : value.replace(' ', 'T');
  const hasTimezone = normalized.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(normalized);

  const date = new Date(hasTimezone ? normalized : `${normalized}Z`);
  return isNaN(date.getTime()) ? null : date;
}

function timeAgo(dateStr) {
  const date = parseDate(dateStr);

  if (!date) return dateStr || null;

  const diff = Math.floor((Date.now() - date.getTime()) / 1000);

  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function getNotificationTime(notif) {
  return notif.created_at || notif.createdAt || notif.read_at || null;
}

// ── Loading state ──────────────────────────────────────────────────────────────

function LoadingState() {
  return (
    <Box sx={{ px: { xs: 2.5, sm: 4 }, py: 3 }}>
      {[1, 2, 3, 4, 5].map((item) => (
        <Stack
          key={item}
          direction="row"
          spacing={2.5}
          alignItems="flex-start"
          sx={{
            py: 3,
            borderBottom: item !== 5 ? '1px solid' : 'none',
            borderColor: 'divider',
          }}
        >
          <Skeleton
            variant="rounded"
            width={48}
            height={48}
            sx={{ borderRadius: 1, flexShrink: 0 }}
          />

          <Box sx={{ flex: 1 }}>
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mb: 1.5 }}>
              <Skeleton variant="text" width="40%" height={24} />
              <Skeleton variant="rounded" width={75} height={22} sx={{ borderRadius: 1 }} />
            </Stack>

            <Skeleton variant="text" width="95%" height={20} />
            <Skeleton variant="text" width="60%" height={20} />

            <Skeleton variant="text" width={100} height={18} sx={{ mt: 1 }} />
          </Box>

          <Skeleton
            variant="rounded"
            width={36}
            height={36}
            sx={{ borderRadius: 2, flexShrink: 0 }}
          />
        </Stack>
      ))}
    </Box>
  );
}

// ── Stat item ──────────────────────────────────────────────────────────────────

function StatBox({ icon, label, value, color }) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        minWidth: { xs: '100%', sm: 150 },
        flex: 1,
        border: '1px solid',
        borderColor: alpha(color, theme.palette.mode === 'dark' ? 0.2 : 0.12),
        bgcolor:
          theme.palette.mode === 'dark'
            ? alpha(color, 0.05)
            : alpha(color, 0.03),
        transition: 'all 0.25s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          transform: 'translateY(-3px)',
          boxShadow: `0 12px 24px -10px ${alpha(color, 0.15)}`,
          borderColor: alpha(color, 0.35),
        }
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1.8}>
        <Box
          sx={{
            width: 40,
            height: 40,
            borderRadius: 2.5,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: alpha(color, 0.1),
            color,
            flexShrink: 0,
          }}
        >
          {icon}
        </Box>

        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: 'block',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: 0.5,
              fontSize: 10,
              lineHeight: 1.2,
              mb: 0.5,
            }}
          >
            {label}
          </Typography>

          <Typography
            variant="h5"
            fontWeight={900}
            sx={{
              lineHeight: 1,
              letterSpacing: -0.5,
            }}
          >
            {value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}

// ── Single row ─────────────────────────────────────────────────────────────────

function NotificationRow({ notif, onMarkRead, marking, isRtl }) {
  const theme = useTheme();
  const isUnread = !notif.read_at;
  const cfg = getConfig(notif.type);
  const isDark = theme.palette.mode === 'dark';

  const displayTime = isUnread
    ? timeAgo(getNotificationTime(notif)) || 'Unread'
    : `Read · ${timeAgo(notif.read_at) || ''}`;

  return (
    <Fade in timeout={260}>
      <Box>
        <ListItem
          alignItems="flex-start"
          sx={{
            gap: { xs: 2, sm: 2.5 },
            px: { xs: 2.5, sm: 4 },
            py: { xs: 2.5, sm: 3 },
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.22s cubic-bezier(0.4, 0, 0.2, 1)',
            bgcolor: isUnread
              ? isDark
                ? alpha(cfg.color, 0.05)
                : alpha(cfg.color, 0.02)
              : 'transparent',

            '&:hover': {
              bgcolor: isDark ? alpha(cfg.color, 0.08) : alpha(cfg.color, 0.04),
            },

            '&::before': isUnread
              ? {
                  content: '""',
                  position: 'absolute',
                  left: isRtl ? 'auto' : 0,
                  right: isRtl ? 0 : 'auto',
                  top: 0,
                  bottom: 0,
                  width: 4.5,
                  bgcolor: cfg.color,
                }
              : {},
          }}
        >
          {/* Icon bubble */}
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 1,
              bgcolor: cfg.bg,
              color: cfg.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
              border: `1px solid ${alpha(cfg.color, isDark ? 0.2 : 0.12)}`,
              boxShadow: isUnread
                ? `0 8px 20px ${alpha(cfg.color, isDark ? 0.08 : 0.06)}`
                : 'none',
            }}
          >
            {cfg.icon}
          </Box>

          {/* Text */}
          <ListItemText
            sx={{ my: 0, minWidth: 0 }}
            primary={
              <Stack
                direction="row"
                alignItems="center"
                gap={1.2}
                flexWrap="wrap"
                sx={{ mb: 0.8 }}
              >
                <Typography
                  variant="body1"
                  fontWeight={isUnread ? 800 : 600}
                  color={isUnread ? 'text.primary' : 'text.secondary'}
                  lineHeight={1.4}
                  sx={{
                    letterSpacing: -0.15,
                    maxWidth: '100%',
                  }}
                >
                  {notif.title || 'Untitled notification'}
                </Typography>

                <Chip
                  label={cfg.label}
                  size="small"
                  sx={{
                    fontSize: 10,
                    height: 20,
                    bgcolor: cfg.bg,
                    color: cfg.color,
                    fontWeight: 800,
                    borderRadius: 0.5,
                    border: `1px solid ${alpha(cfg.color, 0.15)}`,
                    letterSpacing: 0.2,
                    '& .MuiChip-label': {
                      px: 1,
                    },
                  }}
                />

                {isUnread && (
                  <Chip
                    label="Unread"
                    size="small"
                    sx={{
                      fontSize: 10,
                      height: 20,
                      bgcolor: alpha('#ef4444', isDark ? 0.1 : 0.06),
                      color: '#ef4444',
                      fontWeight: 800,
                      borderRadius: 1.5,
                      border: `1px solid ${alpha('#ef4444', 0.15)}`,
                      '& .MuiChip-label': {
                        px: 1,
                      },
                    }}
                  />
                )}
              </Stack>
            }
            secondary={
              <Stack spacing={1.2}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  fontSize={13.5}
                  lineHeight={1.6}
                  sx={{
                    maxWidth: 720,
                    wordBreak: 'break-word',
                  }}
                >
                  {notif.body || 'No additional details provided.'}
                </Typography>

                <Stack direction="row" alignItems="center" gap={1} flexWrap="wrap">
                  <AccessTimeRoundedIcon
                    sx={{
                      fontSize: 14,
                      color: isUnread ? cfg.color : 'text.disabled',
                    }}
                  />

                  <Typography
                    variant="caption"
                    color={isUnread ? 'text.secondary' : 'text.disabled'}
                    fontSize={11.5}
                    fontWeight={isUnread ? 700 : 500}
                  >
                    {displayTime}
                  </Typography>
                </Stack>
              </Stack>
            }
          />

          {/* Action */}
          {isUnread && (
            <Tooltip title="Mark as read" placement={isRtl ? 'right' : 'left'}>
              <span>
                <IconButton
                  size="small"
                  onClick={() => onMarkRead(notif.id)}
                  disabled={marking}
                  sx={{
                    color: cfg.color,
                    bgcolor: cfg.bg,
                    borderRadius: 1.2,
                    width: 36,
                    height: 36,
                    flexShrink: 0,
                    border: `1px solid ${alpha(cfg.color, 0.15)}`,
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      bgcolor: alpha(cfg.color, 0.16),
                      transform: 'translateY(-2px)',
                      boxShadow: `0 4px 12px ${alpha(cfg.color, 0.15)}`,
                    },
                    '&:disabled': {
                      opacity: 0.4,
                    },
                  }}
                >
                  {marking ? (
                    <CircularProgress size={16} color="inherit" />
                  ) : (
                    <DoneRoundedIcon sx={{ fontSize: 18 }} />
                  )}
                </IconButton>
              </span>
            </Tooltip>
          )}
        </ListItem>

        <Divider
          sx={{
            mx: { xs: 2.5, sm: 4 },
            opacity: 0.4,
          }}
        />
      </Box>
    </Fade>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────

function EmptyState({ filter }) {
  const theme = useTheme();

  const messages = {
    all: {
      title: 'All clear',
      sub: 'No notifications yet. New system activity will appear here.',
    },
    unread: {
      title: 'You are all caught up',
      sub: 'There are no unread notifications right now.',
    },
    read: {
      title: 'Nothing read yet',
      sub: 'After marking notifications as read, they will appear here.',
    },
  };

  const m = messages[filter] || messages.all;

  return (
    <Box
      sx={{
        py: { xs: 10, sm: 12 },
        px: 3,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 84,
          height: 84,
          borderRadius: 4.5,
          bgcolor:
            theme.palette.mode === 'dark'
              ? alpha(theme.palette.primary.main, 0.08)
              : alpha(theme.palette.primary.main, 0.05),
          border: '1px solid',
          borderColor: alpha(theme.palette.primary.main, 0.12),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 1,
          boxShadow: `0 12px 30px -10px ${alpha(theme.palette.primary.main, 0.12)}`,
        }}
      >
        <InboxRoundedIcon
          sx={{
            fontSize: 38,
            color: 'primary.main',
          }}
        />
      </Box>

      <Typography variant="h6" fontWeight={850} color="text.primary" sx={{ letterSpacing: -0.3 }}>
        {m.title}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        fontSize={14}
        sx={{ maxWidth: 360, lineHeight: 1.7 }}
      >
        {m.sub}
      </Typography>
    </Box>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const { t, i18n } = useTranslation();
  const theme = useTheme();

  const isRtl = i18n.dir() === 'rtl';
  const isDark = theme.palette.mode === 'dark';

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [markingId, setMarkingId] = useState(null);
  const [markingAll, setMarkingAll] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filter, setFilter] = useState('all');
  const [totalUnread, setTotalUnread] = useState(0);
  const [totalRead, setTotalRead]     = useState(0);

  const fetchNotifications = useCallback(async (p = 1, currentFilter = filter) => {
    setLoading(true);

    const params = { page: p };
    if (currentFilter === 'unread') params.is_read = 0;
    if (currentFilter === 'read')   params.is_read = 1;

    try {
      const res = await api.get('/admin/notifications', { params });
      const d = res.data.data;

      setNotifications(d.data);
      setLastPage(d.last_page);
      setTotal(d.total);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCounts = useCallback(async () => {
    try {
      const [unreadRes, readRes] = await Promise.all([
        api.get('/admin/notifications', { params: { page: 1, is_read: 0 } }),
        api.get('/admin/notifications', { params: { page: 1, is_read: 1 } }),
      ]);
      setTotalUnread(unreadRes.data.data.total);
      setTotalRead(readRes.data.data.total);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchCounts(); }, [fetchCounts]);

  useEffect(() => {
    setPage(1);
    fetchNotifications(1, filter);
  }, [filter]);                          // ← عند تغيير الفلتر: روح صفحة 1

  useEffect(() => {
    fetchNotifications(page, filter);
  }, [page]);                            // ← عند تغيير الصفحة فقط

  const handleMarkRead = async (id) => {
    setMarkingId(id);

    try {
      await api.post(`/admin/notifications/mark-as-read/${id}`);

      setNotifications((prev) =>
        prev.map((n) =>
          n.id === id
            ? {
                ...n,
                read_at: new Date().toISOString().replace('T', ' ').slice(0, 19),
              }
            : n
        )
      );
      fetchCounts(); // ← أضف هاد
    } catch (e) {
      console.error(e);
    } finally {
      setMarkingId(null);
    }
  };

  const handleMarkAllRead = async () => {
  setMarkingAll(true);

  try {
    await api.post('/admin/notifications/mark-all-as-read');

    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        read_at:
          n.read_at || new Date().toISOString().replace('T', ' ').slice(0, 19),
      }))
    );

    fetchCounts();
  } catch (e) {
    console.error(e);
  } finally {
    setMarkingAll(false);
  }
};

  const filtered = notifications;

  const unreadCount = totalUnread;
  const readCount   = totalRead;

  const FILTERS = [
    {
      key: 'all',
      label: t('notifications.filter.all', 'All'),
      count: total,
      icon: <NotificationsNoneRoundedIcon sx={{ fontSize: 16 }} />,
    },
    {
      key: 'unread',
      label: t('notifications.filter.unread', 'Unread'),
      count: unreadCount,
      icon: <MarkEmailUnreadRoundedIcon sx={{ fontSize: 16 }} />,
    },
    {
      key: 'read',
      label: t('notifications.filter.read', 'Read'),
      count: readCount,
      icon: <MarkEmailReadRoundedIcon sx={{ fontSize: 16 }} />,
    },
  ];

  return (
    <Box
      sx={{
        p: { xs: 2.5, md: 5 },
        maxWidth: 1040,
        mx: 'auto',
        direction: isRtl ? 'rtl' : 'ltr',
      }}
    >
      <PageHeader
        title={t('notifications.title', 'Notifications')}
        subtitle={t(
          'notifications.subtitle',
          'Stay updated with the latest activity'
        )}
      />

      {/* Top summary */}
      <Paper
        elevation={0}
        sx={{
          mb: 4,
          p: { xs: 2.5, sm: 3.5 },
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
          border: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
          boxShadow: isDark
            ? '0 24px 64px rgba(0,0,0,0.22)'
            : '0 16px 48px rgba(15,23,42,0.05)',

          '&::before': {
            content: '""',
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            background: isDark
              ? `radial-gradient(circle at top ${isRtl ? 'right' : 'left'}, ${alpha(
                  theme.palette.primary.main,
                  0.12
                )}, transparent 40%)`
              : `radial-gradient(circle at top ${isRtl ? 'right' : 'left'}, ${alpha(
                  theme.palette.primary.main,
                  0.07
                )}, transparent 40%)`,
          },
        }}
      >
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          alignItems={{ xs: 'stretch', lg: 'center' }}
          justifyContent="space-between"
          spacing={3}
          sx={{ position: 'relative', zIndex: 1 }}
        >
          <Stack direction="row" spacing={2.2} alignItems="center">
            <Badge
              badgeContent={unreadCount}
              color="error"
              sx={{
                '& .MuiBadge-badge': {
                  fontSize: 10,
                  minWidth: 20,
                  height: 20,
                  fontWeight: 800,
                  boxShadow: `0 0 0 3px ${theme.palette.background.paper}`,
                },
              }}
            >
              <Box
                sx={{
                  width: 58,
                  height: 58,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'primary.main',
                  bgcolor: alpha(theme.palette.primary.main, isDark ? 0.12 : 0.08),
                  border: '1px solid',
                  borderColor: alpha(theme.palette.primary.main, 0.15),
                }}
              >
                <NotificationsActiveRoundedIcon sx={{ fontSize: 28 }} />
              </Box>
            </Badge>

            <Box>
              <Typography
                variant="h5"
                fontWeight={950}
                sx={{
                  letterSpacing: -0.5,
                  lineHeight: 1.1,
                }}
              >
                {t('notifications.title', 'Notifications Center')}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.6, fontWeight: 500, opacity: 0.85 }}
              >
                {unreadCount > 0
                  ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`
                  : t('notifications.allCaughtUp', 'Everything is up to date')}
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={1.5}
            sx={{ minWidth: { lg: 520 } }}
          >
            <StatBox
              icon={<NotificationsNoneRoundedIcon sx={{ fontSize: 20 }} />}
              label={t('notifications.total', 'Total')}
              value={total}
              color={theme.palette.primary.main}
            />

            <StatBox
              icon={<MarkEmailUnreadRoundedIcon sx={{ fontSize: 20 }} />}
              label={t('notifications.filter.unread', 'Unread')}
              value={unreadCount}
              color="#ef4444"
            />

            <StatBox
              icon={<MarkEmailReadRoundedIcon sx={{ fontSize: 20 }} />}
              label={t('notifications.filter.read', 'Read')}
              value={readCount}
              color="#22c55e"
            />
          </Stack>
        </Stack>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 2,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          boxShadow: isDark
            ? '0 20px 50px rgba(0,0,0,0.18)'
            : '0 12px 40px rgba(15,23,42,0.04)',
        }}
      >
        {/* Toolbar */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'stretch', md: 'center' }}
          justifyContent="space-between"
          gap={2}
          sx={{
            px: { xs: 2.5, sm: 4 },
            py: 2.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            bgcolor: isDark ? alpha('#fff', 0.015) : alpha('#020617', 0.01),
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.5}
            sx={{ minWidth: 0 }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1.5,
                bgcolor: 'action.selected',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              <InboxRoundedIcon sx={{ fontSize: 20, color: 'text.secondary' }} />
            </Box>

            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                fontWeight={900}
                sx={{
                  lineHeight: 1.2,
                  letterSpacing: -0.2,
                }}
              >
                {t('notifications.inbox', 'Notification inbox')}
              </Typography>

              <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 500 }}>
                {filtered.length} shown from {total} total
              </Typography>
            </Box>
          </Stack>

          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent="space-between"
            gap={1.5}
  sx={{ flex: 1 }}   // ← بدل width: '100%'

          >
            <Stack
              direction="row"
              gap={0.5}
              flexWrap="wrap"
              sx={{
                p: 0.5,
                borderRadius: 0.5,
                bgcolor: 'action.hover',
                border: '1px solid',
                borderColor: 'divider',
              }}
            >
              {FILTERS.map((f) => {
                const active = filter === f.key;

                return (
                  <Chip
                    key={f.key}
                    icon={f.icon}
                    label={
                      <Stack direction="row" alignItems="center" gap={0.8}>
                        <span>{f.label}</span>

                        <Box
                          sx={{
                            px: 1,
                            py: 0.2,
                            borderRadius: 1,
                            fontSize: 10,
                            fontWeight: 900,
                            lineHeight: 1.4,
                            bgcolor: active
                              ? alpha('#fff', isDark ? 0.15 : 0.25)
                              : 'background.paper',
                            color: active ? 'inherit' : 'text.secondary',
                            minWidth: 20,
                            textAlign: 'center',
                            boxShadow: active ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
                          }}
                        >
                          {f.count}
                        </Box>
                      </Stack>
                    }
                    onClick={() => setFilter(f.key)}
                    size="small"
                    variant={active ? 'filled' : 'outlined'}
                    color={active ? 'primary' : 'default'}
                    sx={{
                      fontWeight: 800,
                      fontSize: 12,
                      borderRadius: 0.5,
                      height: 32,
                      cursor: 'pointer',
                      borderColor: active ? 'transparent' : 'transparent',
                      transition: 'all 0.2s ease',
                      bgcolor: active ? 'primary.main' : 'transparent',
                      '&:hover': {
                        bgcolor: active ? 'primary.dark' : 'action.selected',
                      },
                      '& .MuiChip-icon': {
                        ml: isRtl ? 0 : 1,
                        mr: isRtl ? 1 : -0.2,
                      },
                    }}
                  />
                );
              })}
            </Stack>

            {unreadCount > 0 && (
              
              <Button
                size="small"
                variant="contained"
                disableElevation
                startIcon={
                  markingAll ? (
                    <CircularProgress size={14} color="inherit" />
                  ) : (
                    <DoneAllRoundedIcon sx={{ fontSize: 18 }} />
                  )
                }
                onClick={handleMarkAllRead}
                disabled={markingAll}
                sx={{
marginInlineStart: 'auto',
                  gap: 0.5,
                
                  fontWeight: 850,
                  fontSize: 12.5,
                  borderRadius: 0.5,
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  px: 4,
                  height: 36,
                  boxShadow: `0 8px 20px ${alpha(
                    theme.palette.primary.main,
                    isDark ? 0.15 : 0.2
                  )}`,
                  '& .MuiButton-startIcon': {
                    ml: isRtl ? 0.6 : -0.2,
                    mr: isRtl ? -0.2 : 0.6,
                  },
                }}
              >
                {t('notifications.markAllRead', 'Mark all read')}
              </Button>
            )}
          </Stack>
        </Stack>

        {/* Content */}
        {loading ? (
          <LoadingState />
        ) : filtered.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <List disablePadding>
            {filtered.map((n) => (
              <NotificationRow
                key={n.id}
                notif={n}
                onMarkRead={handleMarkRead}
                marking={markingId === n.id}
                isRtl={isRtl}
              />
            ))}
          </List>
        )}

        {/* Pagination */}
        {lastPage > 1 && (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              py: 3,
              px: 3,
              borderTop: '1px solid',
              borderColor: 'divider',
              bgcolor: isDark ? alpha('#fff', 0.01) : alpha('#020617', 0.005),
            }}
          >
            <Pagination
              count={lastPage}
              page={page}
              onChange={(_, v) => {
                setPage(v);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              color="primary"
              shape="rounded"
              size="medium"
              sx={{
                '& .MuiPaginationItem-root': {
                  fontWeight: 800,
                  borderRadius: 2.2,
                },
              }}
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
}