import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/PageHeader';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import FilterAltRoundedIcon from '@mui/icons-material/FilterAltRounded';
import PushPinRoundedIcon from '@mui/icons-material/PushPinRounded';
import CircleRoundedIcon from '@mui/icons-material/CircleRounded';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import InsertEmoticonRoundedIcon from '@mui/icons-material/InsertEmoticonRounded';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import SupportAgentRoundedIcon from '@mui/icons-material/SupportAgentRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import CallRoundedIcon from '@mui/icons-material/CallRounded';
import VideocamRoundedIcon from '@mui/icons-material/VideocamRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';

const FILTERS = ['all', 'workers', 'customers', 'pinned', 'unread'];

const seededConversations = [
  {
    id: 'msg-1',
    name: 'Sarah Johnson',
    role: 'customer',
    title: 'Billing adjustment and refund review',
    online: true,
    unread: 3,
    pinned: true,
    ticketStatus: 'pending',
    assignee: 'Admin Team',
    lastSeen: '2m ago',
    lastMessage: 'Please review the updated invoice I sent a moment ago.',
    time: '09:42',
    avatar: 'SJ',
    typing: true,
    recentMessages: [
      { id: 'm1', role: 'customer', text: 'I was charged twice for the same booking.', time: '09:10' },
      { id: 'm2', role: 'admin', text: 'Thanks for raising this. I am checking the transaction history now.', time: '09:12' },
      { id: 'm3', role: 'customer', text: 'Please review the updated invoice I sent a moment ago.', time: '09:42' },
    ],
  },
  {
    id: 'msg-2',
    name: 'Omar Hassan',
    role: 'worker',
    title: 'Shift assignment confirmation',
    online: false,
    unread: 0,
    pinned: false,
    ticketStatus: 'open',
    assignee: 'Support Desk',
    lastSeen: '18m ago',
    lastMessage: 'Confirmed. I will be available at the updated schedule.',
    time: '08:54',
    avatar: 'OH',
    typing: false,
    recentMessages: [
      { id: 'm1', role: 'worker', text: 'Can we move my shift to 2 PM today?', time: '08:31' },
      { id: 'm2', role: 'admin', text: 'Yes, the schedule has been updated.', time: '08:45' },
      { id: 'm3', role: 'worker', text: 'Confirmed. I will be available at the updated schedule.', time: '08:54' },
    ],
  },
  {
    id: 'msg-3',
    name: 'Leila Ahmed',
    role: 'customer',
    title: 'Password reset and account lock issue',
    online: true,
    unread: 2,
    pinned: false,
    ticketStatus: 'escalated',
    assignee: 'Security Admin',
    lastSeen: 'Live now',
    lastMessage: 'I still cannot access my account after resetting the password.',
    time: '09:28',
    avatar: 'LA',
    typing: false,
    recentMessages: [
      { id: 'm1', role: 'customer', text: 'My account keeps getting locked.', time: '09:02' },
      { id: 'm2', role: 'admin', text: 'We have escalated this to our security team.', time: '09:17' },
      { id: 'm3', role: 'customer', text: 'I still cannot access my account after resetting the password.', time: '09:28' },
    ],
  },
  {
    id: 'msg-4',
    name: 'Rania Al Farsi',
    role: 'customer',
    title: 'Account verification and document upload',
    online: false,
    unread: 0,
    pinned: false,
    ticketStatus: 'resolved',
    assignee: 'Admin Team',
    lastSeen: '1h ago',
    lastMessage: 'Everything is verified now. Thank you.',
    time: 'Yesterday',
    avatar: 'RF',
    typing: false,
    recentMessages: [
      { id: 'm1', role: 'customer', text: 'I uploaded the document set earlier today.', time: 'Yesterday 13:20' },
      { id: 'm2', role: 'admin', text: 'The verification is complete. You are good to go.', time: 'Yesterday 13:33' },
      { id: 'm3', role: 'customer', text: 'Everything is verified now. Thank you.', time: 'Yesterday 13:35' },
    ],
  },
  {
    id: 'msg-5',
    name: 'Mahmoud Saleh',
    role: 'worker',
    title: 'Equipment replacement request',
    online: true,
    unread: 1,
    pinned: true,
    ticketStatus: 'open',
    assignee: 'Operations Admin',
    lastSeen: '7m ago',
    lastMessage: 'The old device is failing during field updates.',
    time: '09:05',
    avatar: 'MS',
    typing: false,
    recentMessages: [
      { id: 'm1', role: 'worker', text: 'My scanner battery is dropping too quickly.', time: '08:40' },
      { id: 'm2', role: 'admin', text: 'Please send the device ID and we will replace it.', time: '08:53' },
      { id: 'm3', role: 'worker', text: 'The old device is failing during field updates.', time: '09:05' },
    ],
  },
];

const roleMeta = {
  worker: { labelKey: 'messages.roles.worker', color: 'info', icon: <SupportAgentRoundedIcon sx={{ fontSize: 16 }} /> },
  customer: { labelKey: 'messages.roles.customer', color: 'success', icon: <PersonRoundedIcon sx={{ fontSize: 16 }} /> },
  admin: { labelKey: 'messages.roles.admin', color: 'secondary', icon: <SupportAgentRoundedIcon sx={{ fontSize: 16 }} /> },
};

const ticketMeta = {
  open: { color: 'info' },
  pending: { color: 'warning' },
  escalated: { color: 'error' },
  resolved: { color: 'success' },
};

function MessagesPage() {
  const theme = useTheme();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState('');
  const [activeId, setActiveId] = useState(seededConversations[0].id);
  const [conversations, setConversations] = useState(seededConversations);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(timer);
  }, []);

  const ui = useMemo(() => {
    const light = theme.palette.mode === 'light';
    return {
      border: `1px solid ${alpha(theme.palette.divider, light ? 0.85 : 0.55)}`,
      surface: `linear-gradient(160deg, ${alpha(theme.palette.background.paper, light ? 0.96 : 0.9)} 0%, ${alpha(theme.palette.primary.main, light ? 0.03 : 0.08)} 100%)`,
      soft: alpha(theme.palette.action.hover, light ? 0.62 : 0.42),
      selected: alpha(theme.palette.primary.main, light ? 0.1 : 0.18),
      shadow: `0 18px 50px ${alpha('#0f172a', light ? 0.1 : 0.34)}`,
      bubbleShadow: `0 12px 24px ${alpha('#0f172a', light ? 0.08 : 0.22)}`,
    };
  }, [theme]);

  const filteredConversations = useMemo(() => {
    const loweredSearch = search.trim().toLowerCase();

    return conversations.filter((conversation) => {
      const matchesSearch =
        !loweredSearch ||
        [conversation.name, conversation.title, conversation.lastMessage, conversation.role, conversation.ticketStatus]
          .join(' ')
          .toLowerCase()
          .includes(loweredSearch);

      const matchesFilter =
        filter === 'all' ||
        (filter === 'workers' && conversation.role === 'worker') ||
        (filter === 'customers' && conversation.role === 'customer') ||
        (filter === 'pinned' && conversation.pinned) ||
        (filter === 'unread' && conversation.unread > 0);

      return matchesSearch && matchesFilter;
    });
  }, [conversations, filter, search]);

  useEffect(() => {
    if (!filteredConversations.length) {
      return;
    }

    if (!filteredConversations.some((conversation) => conversation.id === activeId)) {
      setActiveId(filteredConversations[0].id);
    }
  }, [activeId, filteredConversations]);

  const activeConversation = filteredConversations.find((conversation) => conversation.id === activeId) || null;
  const unreadCount = conversations.reduce((sum, conversation) => sum + conversation.unread, 0);
  const onlineCount = conversations.filter((conversation) => conversation.online).length;

  const quickReplies = [
    t('messages.quickReplies.reply1', { defaultValue: 'Thanks for the update.' }),
    t('messages.quickReplies.reply2', { defaultValue: 'We are reviewing this now.' }),
    t('messages.quickReplies.reply3', { defaultValue: 'Please share a screenshot.' }),
  ];

  function handleSendMessage(text = draft) {
    const trimmed = text.trim();
    if (!trimmed || !activeConversation) {
      return;
    }

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setConversations((previousConversations) =>
      previousConversations.map((conversation) =>
        conversation.id !== activeConversation.id
          ? conversation
          : {
              ...conversation,
              unread: 0,
              lastMessage: trimmed,
              time,
              recentMessages: [
                ...conversation.recentMessages,
                {
                  id: `${conversation.id}-${Date.now()}`,
                  role: 'admin',
                  text: trimmed,
                  time,
                },
              ],
            },
      ),
    );

    setDraft('');
  }

  const sortedConversations = filteredConversations
    .slice()
    .sort(
      (leftConversation, rightConversation) =>
        Number(rightConversation.pinned) - Number(leftConversation.pinned) ||
        Number(rightConversation.unread) - Number(leftConversation.unread),
    );

  return (
    <Stack spacing={3} dir={isRtl ? 'rtl' : 'ltr'} sx={{ minWidth: 0 }}>
      <PageHeader
        title={t('messages.title', { defaultValue: 'Messages' })}
        subtitle={t('messages.subtitle', { defaultValue: 'A modern support workspace for real-time conversations.' })}
        actions={
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip size="small" color="success" variant="outlined" label={`${onlineCount} ${t('messages.metrics.online', { defaultValue: 'online' })}`} />
            <Badge badgeContent={unreadCount} color="error" overlap="circular">
              <IconButton
                sx={{
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                }}
              >
                <NotificationsRoundedIcon />
              </IconButton>
            </Badge>
          </Stack>
        }
      />

      <Box
        sx={{
          display: 'grid',
          gap: 2.5,
          gridTemplateColumns: { xs: '1fr', xl: '380px 1fr' },
          alignItems: 'stretch',
          minHeight: { xl: 'calc(100vh - 240px)' },
        }}
      >
        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            border: ui.border,
            background: ui.surface,
            boxShadow: ui.shadow,
            backdropFilter: 'blur(14px)',
            minWidth: 0,
          }}
        >
          <CardContent sx={{ p: 2.25, height: '100%', display: 'flex', flexDirection: 'column', gap: 1.75 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1.5 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '-0.03em' }}>
                  {t('messages.sections.active', { defaultValue: 'Conversations' })}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {filteredConversations.length} {t('messages.sections.visible', { defaultValue: 'visible' })}
                </Typography>
              </Box>
              <Chip size="small" label={`${unreadCount} ${t('messages.labels.unread', { defaultValue: 'unread' })}`} color="error" variant="outlined" />
            </Box>

            <TextField
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('messages.searchPlaceholder', { defaultValue: 'Search conversations...' })}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ rowGap: 1 }}>
              {FILTERS.map((filterKey) => {
                const selected = filter === filterKey;
                return (
                  <Chip
                    key={filterKey}
                    label={t(`messages.filters.${filterKey}`, { defaultValue: filterKey })}
                    icon={filterKey === 'all' ? <FilterAltRoundedIcon /> : undefined}
                    clickable
                    onClick={() => setFilter(filterKey)}
                    color={selected ? 'primary' : 'default'}
                    variant={selected ? 'filled' : 'outlined'}
                    sx={{ borderRadius: 999, fontWeight: 700 }}
                  />
                );
              })}
            </Stack>

            <Divider />

            <Box sx={{ flexGrow: 1, minHeight: 0, overflow: 'auto', pr: 0.5 }}>
              {loading ? (
                <Stack spacing={1.25}>
                  {Array.from({ length: 6 }).map((_, index) => (
                    <Skeleton key={index} variant="rounded" height={96} />
                  ))}
                </Stack>
              ) : sortedConversations.length ? (
                <List disablePadding sx={{ display: 'grid', gap: 1.1 }}>
                  {sortedConversations.map((conversation) => {
                    const role = roleMeta[conversation.role];
                    const isSelected = activeConversation?.id === conversation.id;

                    return (
                      <ListItemButton
                        key={conversation.id}
                        onClick={() => setActiveId(conversation.id)}
                        selected={isSelected}
                        sx={{
                          borderRadius: 3,
                          alignItems: 'flex-start',
                          gap: 1,
                          border: `1px solid ${isSelected ? alpha(theme.palette.primary.main, 0.34) : alpha(theme.palette.divider, 0.8)}`,
                          background: isSelected ? ui.selected : theme.palette.background.paper,
                          transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease, background 180ms ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: `0 12px 26px ${alpha('#0f172a', theme.palette.mode === 'light' ? 0.09 : 0.24)}`,
                            borderColor: alpha(theme.palette.primary.main, 0.36),
                          },
                        }}
                      >
                        <ListItemAvatar sx={{ minWidth: 56, mr: isRtl ? 0 : 1, ml: isRtl ? 1 : 0 }}>
                          <Badge
                            overlap="circular"
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                            badgeContent={
                              <CircleRoundedIcon
                                sx={{
                                  fontSize: 11,
                                  color: conversation.online ? '#22c55e' : theme.palette.text.disabled,
                                  bgcolor: theme.palette.background.paper,
                                  borderRadius: '50%',
                                }}
                              />
                            }
                          >
                            <Avatar
                              sx={{
                                width: 48,
                                height: 48,
                                bgcolor: alpha(theme.palette.primary.main, 0.14),
                                color: theme.palette.primary.main,
                                fontWeight: 800,
                              }}
                            >
                              {conversation.avatar}
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>

                        <ListItemText
                          primary={
                            <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                              <Stack direction="row" spacing={1} alignItems="center" sx={{ minWidth: 0 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 800 }} noWrap>
                                  {conversation.name}
                                </Typography>
                                {conversation.pinned ? <PushPinRoundedIcon sx={{ fontSize: 15, color: theme.palette.warning.main }} /> : null}
                              </Stack>
                              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, whiteSpace: 'nowrap' }}>
                                {conversation.time}
                              </Typography>
                            </Stack>
                          }
                          secondary={
                            <Stack spacing={0.9}>
                              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.45 }}>
                                {conversation.lastMessage}
                              </Typography>
                              <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" sx={{ rowGap: 0.75 }}>
                                <Chip size="small" icon={role.icon} color={role.color} label={t(role.labelKey)} />
                                <Chip
                                  size="small"
                                  color={ticketMeta[conversation.ticketStatus].color}
                                  variant="outlined"
                                  label={t(`messages.ticketStatus.${conversation.ticketStatus}`, { defaultValue: conversation.ticketStatus })}
                                />
                                {conversation.unread > 0 ? (
                                  <Chip size="small" color="error" label={`${conversation.unread} ${t('messages.labels.unread', { defaultValue: 'unread' })}`} />
                                ) : null}
                              </Stack>
                            </Stack>
                          }
                        />
                      </ListItemButton>
                    );
                  })}
                </List>
              ) : (
                <Box
                  sx={{
                    minHeight: 320,
                    borderRadius: 3,
                    border: `1px dashed ${alpha(theme.palette.divider, 0.9)}`,
                    display: 'grid',
                    placeItems: 'center',
                    p: 3,
                    textAlign: 'center',
                    bgcolor: ui.soft,
                  }}
                >
                  <Stack spacing={1.25} alignItems="center" sx={{ maxWidth: 300 }}>
                    <SearchRoundedIcon sx={{ fontSize: 48, color: theme.palette.primary.main }} />
                    <Typography variant="h6" sx={{ fontWeight: 900 }}>
                      {t('messages.emptyTitle', { defaultValue: 'No conversations available' })}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {t('messages.emptySubtitle', { defaultValue: 'Clear filters or start a new support conversation to continue.' })}
                    </Typography>
                    <Button variant="outlined" onClick={() => { setSearch(''); setFilter('all'); }}>
                      {t('messages.clearFilters', { defaultValue: 'Clear filters' })}
                    </Button>
                  </Stack>
                </Box>
              )}
            </Box>
          </CardContent>
        </Card>

        <Card
          elevation={0}
          sx={{
            borderRadius: 4,
            border: ui.border,
            background: ui.surface,
            boxShadow: ui.shadow,
            backdropFilter: 'blur(14px)',
            minWidth: 0,
          }}
        >
          <CardContent sx={{ p: 0, height: '100%', minHeight: { xs: 640, xl: '100%' }, display: 'flex', flexDirection: 'column' }}>
            {loading ? (
              <Stack spacing={2} sx={{ p: 2.25 }}>
                <Skeleton variant="rounded" height={84} />
                <Skeleton variant="rounded" height={390} />
                <Skeleton variant="rounded" height={156} />
              </Stack>
            ) : activeConversation ? (
              <Stack spacing={0} sx={{ height: '100%', minHeight: 0 }}>
                <Box
                  sx={{
                    p: 2.25,
                    borderBottom: `1px solid ${alpha(theme.palette.divider, 0.82)}`,
                    background: `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.12)} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`,
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2} sx={{ minWidth: 0 }}>
                    <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
                      <Badge
                        overlap="circular"
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                        badgeContent={
                          <CircleRoundedIcon
                            sx={{
                              fontSize: 11,
                              color: activeConversation.online ? '#22c55e' : theme.palette.text.disabled,
                              bgcolor: theme.palette.background.paper,
                              borderRadius: '50%',
                            }}
                          />
                        }
                      >
                        <Avatar
                          sx={{
                            width: 52,
                            height: 52,
                            bgcolor: alpha(theme.palette.primary.main, 0.15),
                            color: theme.palette.primary.main,
                            fontWeight: 800,
                          }}
                        >
                          {activeConversation.avatar}
                        </Avatar>
                      </Badge>

                      <Box sx={{ minWidth: 0 }}>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ rowGap: 0.75 }}>
                          <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: '-0.03em' }} noWrap>
                            {activeConversation.name}
                          </Typography>
                          <Chip size="small" icon={roleMeta[activeConversation.role].icon} color={roleMeta[activeConversation.role].color} label={t(roleMeta[activeConversation.role].labelKey)} />
                          <Chip
                            size="small"
                            label={t(`messages.ticketStatus.${activeConversation.ticketStatus}`, { defaultValue: activeConversation.ticketStatus })}
                            color={ticketMeta[activeConversation.ticketStatus].color}
                          />
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" sx={{ mt: 0.7, rowGap: 0.65 }}>
                          <Typography variant="body2" color="text.secondary">
                            {activeConversation.title}
                          </Typography>
                          <Stack direction="row" spacing={0.4} alignItems="center">
                            <AccessTimeRoundedIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                              {activeConversation.lastSeen}
                            </Typography>
                          </Stack>
                        </Stack>
                      </Box>
                    </Stack>

                    <Stack direction="row" spacing={0.6}>
                      <IconButton sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.8)}` }}>
                        <CallRoundedIcon />
                      </IconButton>
                      <IconButton sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.8)}` }}>
                        <VideocamRoundedIcon />
                      </IconButton>
                      <IconButton sx={{ border: `1px solid ${alpha(theme.palette.divider, 0.8)}` }}>
                        <MoreVertRoundedIcon />
                      </IconButton>
                    </Stack>
                  </Stack>
                </Box>

                <Box
                  sx={{
                    flexGrow: 1,
                    minHeight: 0,
                    overflow: 'auto',
                    p: { xs: 2, sm: 2.5 },
                    bgcolor: ui.soft,
                    backgroundImage:
                      theme.palette.mode === 'light'
                        ? 'radial-gradient(circle at top left, rgba(255,255,255,0.72), transparent 34%), radial-gradient(circle at bottom right, rgba(255,255,255,0.55), transparent 28%)'
                        : 'radial-gradient(circle at top left, rgba(255,255,255,0.06), transparent 34%), radial-gradient(circle at bottom right, rgba(255,255,255,0.03), transparent 28%)',
                  }}
                >
                  <Stack spacing={1.4}>
                    {activeConversation.recentMessages.map((message) => {
                      const isOutgoing = message.role === 'admin';
                      return (
                        <Stack key={message.id} direction="row" justifyContent={isOutgoing ? 'flex-end' : 'flex-start'}>
                          <Box
                            sx={{
                              maxWidth: { xs: '92%', md: '76%' },
                              px: 1.7,
                              py: 1.45,
                              borderRadius: 3,
                              borderTopRightRadius: isOutgoing ? 0.8 : 3,
                              borderTopLeftRadius: isOutgoing ? 3 : 0.8,
                              bgcolor: isOutgoing ? alpha(theme.palette.primary.main, theme.palette.mode === 'light' ? 0.16 : 0.28) : theme.palette.background.paper,
                              border: `1px solid ${alpha(theme.palette.divider, isOutgoing ? 0.55 : 0.82)}`,
                              boxShadow: ui.bubbleShadow,
                            }}
                          >
                            <Typography variant="body2" sx={{ lineHeight: 1.7 }}>
                              {message.text}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.7, fontWeight: 700 }}>
                              {message.time}
                            </Typography>
                          </Box>
                        </Stack>
                      );
                    })}

                    {activeConversation.typing ? (
                      <Stack direction="row" justifyContent="flex-start">
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.75,
                            px: 1.4,
                            py: 1.1,
                            borderRadius: 3,
                            border: `1px solid ${alpha(theme.palette.divider, 0.82)}`,
                            bgcolor: theme.palette.background.paper,
                            boxShadow: ui.bubbleShadow,
                          }}
                        >
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {[0, 1, 2].map((dot) => (
                              <Box
                                key={dot}
                                sx={{
                                  width: 7,
                                  height: 7,
                                  borderRadius: '50%',
                                  bgcolor: theme.palette.primary.main,
                                  animation: 'supportDotPulse 1.15s infinite ease-in-out',
                                  animationDelay: `${dot * 0.15}s`,
                                  '@keyframes supportDotPulse': {
                                    '0%, 80%, 100%': { transform: 'scale(0.8)', opacity: 0.4 },
                                    '40%': { transform: 'scale(1)', opacity: 1 },
                                  },
                                }}
                              />
                            ))}
                          </Box>
                          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                            {t('messages.typing', { defaultValue: 'Typing...' })}
                          </Typography>
                        </Box>
                      </Stack>
                    ) : null}
                  </Stack>
                </Box>

                <Box sx={{ p: { xs: 2, sm: 2.25 }, borderTop: `1px solid ${alpha(theme.palette.divider, 0.82)}` }}>
                  <Stack spacing={1.25}>
                    <Stack direction="row" spacing={0.8} flexWrap="wrap" sx={{ rowGap: 0.8 }}>
                      {quickReplies.map((reply) => (
                        <Chip
                          key={reply}
                          label={reply}
                          clickable
                          variant="outlined"
                          onClick={() => handleSendMessage(reply)}
                          sx={{ borderRadius: 999 }}
                        />
                      ))}
                    </Stack>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'flex-end',
                        gap: 1.1,
                        p: 1.35,
                        borderRadius: 4,
                        border: `1px solid ${alpha(theme.palette.divider, 0.82)}`,
                        bgcolor: theme.palette.background.paper,
                        boxShadow: `0 10px 24px ${alpha('#0f172a', theme.palette.mode === 'light' ? 0.06 : 0.18)}`,
                      }}
                    >
                      <Stack direction="row" spacing={0.25} sx={{ alignSelf: 'flex-end' }}>
                        <IconButton size="small" aria-label={t('messages.composer.attach', { defaultValue: 'Attach file' })}>
                          <AttachFileRoundedIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" aria-label={t('messages.composer.image', { defaultValue: 'Send image' })}>
                          <ImageRoundedIcon fontSize="small" />
                        </IconButton>
                        <IconButton size="small" aria-label={t('messages.composer.emoji', { defaultValue: 'Emoji' })}>
                          <InsertEmoticonRoundedIcon fontSize="small" />
                        </IconButton>
                      </Stack>

                      <TextField
                        value={draft}
                        onChange={(event) => setDraft(event.target.value)}
                        placeholder={t('messages.composer.placeholder', { defaultValue: 'Write a message...' })}
                        multiline
                        minRows={1}
                        maxRows={4}
                        fullWidth
                        variant="standard"
                        InputProps={{ disableUnderline: true }}
                        sx={{
                          '& .MuiInputBase-input': {
                            py: 0.8,
                            px: 0.5,
                            lineHeight: 1.65,
                          },
                        }}
                      />

                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<SendRoundedIcon />}
                        onClick={() => handleSendMessage()}
                        sx={{
                          alignSelf: 'flex-end',
                          borderRadius: 999,
                          px: 2.3,
                          py: 1.15,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {t('messages.composer.send', { defaultValue: 'Send' })}
                      </Button>
                    </Box>

                    <Typography variant="body2" color="text.secondary">
                      {t('messages.supportLine', { defaultValue: 'Support ticket updates sync instantly to the live chat feed.' })}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            ) : (
              <Box sx={{ minHeight: 520, display: 'grid', placeItems: 'center', p: 3, textAlign: 'center' }}>
                <Stack spacing={1.4} alignItems="center" sx={{ maxWidth: 360 }}>
                  <SearchRoundedIcon sx={{ fontSize: 54, color: theme.palette.primary.main }} />
                  <Typography variant="h5" sx={{ fontWeight: 900 }}>
                    {t('messages.emptyTitle', { defaultValue: 'No conversations available' })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {t('messages.emptySubtitle', { defaultValue: 'Clear filters or start a new support conversation to continue.' })}
                  </Typography>
                </Stack>
              </Box>
            )}
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}

export default MessagesPage;
