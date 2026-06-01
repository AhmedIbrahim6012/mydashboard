import { useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha } from '@mui/material/styles';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import Groups2RoundedIcon from '@mui/icons-material/Groups2Rounded';
import PersonOffOutlinedIcon from '@mui/icons-material/PersonOffOutlined';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';
import FiberManualRecordRoundedIcon from '@mui/icons-material/FiberManualRecordRounded';
import LocalPhoneOutlinedIcon from '@mui/icons-material/LocalPhoneOutlined';
import MailOutlineRoundedIcon from '@mui/icons-material/MailOutlineRounded';
import PlaceOutlinedIcon from '@mui/icons-material/PlaceOutlined';
import WorkerDialog from '../components/WorkerDialog';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import { formatCurrency } from '../utils/format';
import { useNavigate } from 'react-router-dom';

const STATUS_FILTERS = ['all', 'active', 'busy', 'offline'];
const WORKER_LOCATIONS = ['Riyadh', 'Dubai', 'Jeddah', 'Abu Dhabi', 'Doha', 'Kuwait City'];



function parseExperienceYears(experience) {
  const match = String(experience || '').match(/\d+/);
  return Number(match?.[0] || 0);
}

function getInitials(name) {
  return String(name || '')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.slice(0, 1))
    .join('')
    .toUpperCase();
}

function buildEmail(name) {
  const slug = String(name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '.')
    .replace(/^\.+|\.+$/g, '');

  return `${slug || 'worker'}@mydashboard.app`;
}

function getStatusMeta(status, t) {
  const normalized = status === 'busy' || status === 'offline' ? status : 'active';

  if (normalized === 'busy') {
    return {
      label: t('workers.status.busy', { defaultValue: 'Busy' }),
      color: '#b45309',
      backgroundColor: 'rgba(245, 158, 11, 0.12)',
      icon: <AccessTimeRoundedIcon sx={{ fontSize: 16 }} />,
    };
  }

  if (normalized === 'offline') {
    return {
      label: t('workers.status.offline', { defaultValue: 'Offline' }),
      color: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.12)',
      icon: <FiberManualRecordRoundedIcon sx={{ fontSize: 12 }} />,
    };
  }

  return {
    label: t('workers.status.active', { defaultValue: 'Active' }),
    color: '#15803d',
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    icon: <CheckCircleOutlineRoundedIcon sx={{ fontSize: 16 }} />,
  };
}

function getWorkerDisplay(worker, index, professionName, t) {
  const experienceYears = parseExperienceYears(worker.experience);
  const balance = Number(worker.balance || 0);
  const status = worker.status || (experienceYears >= 7 ? 'active' : experienceYears >= 4 ? 'busy' : 'offline');
  const location = worker.location || WORKER_LOCATIONS[index % WORKER_LOCATIONS.length];
  const rating = Math.min(5, 4.4 + Math.min(experienceYears, 9) * 0.07 + (balance > 10000 ? 0.12 : 0));
  const completedJobs = Math.max(14, experienceYears * 11 + Math.round(balance / 1200));
  const activeJobs = status === 'busy' ? Math.max(1, Math.min(4, Math.round(experienceYears / 2))) : status === 'active' ? 1 : 0;
  const reviewCount = 18 + experienceYears * 12 + index * 3;
  const joinedAt = worker.createdAt ? new Date(worker.createdAt) : null;
  const email = worker.email || buildEmail(worker.name);
  const phone = worker.phone || t('workers.table.phone', { defaultValue: 'Phone Number' });
  const service = professionName || worker.service || worker.professionName || t('workers.card.serviceFallback', { defaultValue: 'Service Provider' });

  return {
    ...worker,
    service,
    status,
    location,
    rating,
    reviewCount,
    completedJobs,
    activeJobs,
    revenue: balance,
    email,
    phone,
    joinedAt,
    initials: getInitials(worker.name),
    experienceYears,
  };
}

function SummaryCard({ label, value, helper, icon, tone = 'neutral' }) {
  const borderColor = tone === 'positive' ? 'rgba(34, 197, 94, 0.18)' : 'rgba(15, 23, 42, 0.08)';
  const backgroundColor = tone === 'positive' ? 'linear-gradient(180deg, rgba(240, 253, 244, 1), rgba(236, 253, 245, 0.75))' : 'linear-gradient(180deg, rgba(255, 255, 255, 1), rgba(248, 250, 252, 0.86))';

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: `1px solid ${borderColor}`,
        background: backgroundColor,
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04), 0 10px 24px rgba(15, 23, 42, 0.04)',
        height: '100%',
      }}
    >
      <CardContent sx={{ p: 2.4, '&:last-child': { pb: 2.4 } }}>
        <Stack spacing={1.1}>
          <Stack direction="row" alignItems="center" spacing={1.1}>
            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 2.2,
                display: 'grid',
                placeItems: 'center',
                color: tone === 'positive' ? '#15803d' : '#2563eb',
                backgroundColor: tone === 'positive' ? 'rgba(34, 197, 94, 0.12)' : 'rgba(37, 99, 235, 0.1)',
              }}
            >
              {icon}
            </Box>
            <Typography sx={{ fontSize: '0.9rem', lineHeight: 1.2, fontWeight: 700, color: '#6b7280' }}>{label}</Typography>
          </Stack>
          <Typography sx={{ fontSize: '2rem', lineHeight: 1.05, fontWeight: 800, letterSpacing: '-0.04em', color: '#0f172a' }}>
            {value}
          </Typography>
          <Typography sx={{ fontSize: '0.92rem', lineHeight: 1.4, color: '#64748b' }}>{helper}</Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

function WorkerMetric({ label, value }) {
  return (
    <Box>
      <Typography sx={{ fontSize: '0.74rem', lineHeight: 1.2, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
        {label}
      </Typography>
      <Typography sx={{ mt: 0.35, fontSize: { xs: '0.95rem', md: '1.02rem' }, lineHeight: 1.2, color: '#0f172a', fontWeight: 800 }}>
        {value}
      </Typography>
    </Box>
  );
}

function WorkerCard({ worker, onViewProfile, t }) {
  const status = getStatusMeta(worker.status, t);

  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 4,
        border: '1px solid rgba(15, 23, 42, 0.08)',
        background: 'linear-gradient(180deg, #ffffff 0%, #fbfdff 100%)',
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04), 0 14px 30px rgba(15, 23, 42, 0.05)',
        transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 10px 26px rgba(15, 23, 42, 0.08)',
          borderColor: 'rgba(37, 99, 235, 0.2)',
        },
      }}
    >
      <CardContent sx={{ p: { xs: 2.2, md: 2.75 }, '&:last-child': { pb: { xs: 2.2, md: 2.75 } } }}>
        <Stack spacing={2.1}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Stack direction="row" spacing={1.8} alignItems="center" sx={{ minWidth: 0 }}>
              <Avatar
                sx={{
                  width: { xs: 58, md: 62 },
                  height: { xs: 58, md: 62 },
                  borderRadius: '50%',
                  bgcolor: '#dce8f7',
                  color: '#245dd8',
                  fontSize: '1.18rem',
                  fontWeight: 800,
                  flex: '0 0 auto',
                  boxShadow: 'inset 0 0 0 1px rgba(37, 99, 235, 0.08)',
                }}
              >
                {worker.initials}
              </Avatar>
              <Box sx={{ minWidth: 0 }}>
                <Typography sx={{ fontSize: { xs: '1.16rem', md: '1.28rem' }, lineHeight: 1.1, fontWeight: 800, color: '#0f172a' }}>
                  {worker.name}
                </Typography>
                <Typography sx={{ mt: 0.3, fontSize: '0.95rem', lineHeight: 1.25, color: '#52657d', fontWeight: 500 }}>
                  {worker.service}
                </Typography>
                <Box
                  sx={{
                    mt: 0.9,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 0.7,
                    px: 1.15,
                    py: 0.65,
                    borderRadius: 999,
                    color: status.color,
                    backgroundColor: status.backgroundColor,
                  }}
                >
                  {status.icon}
                  <Typography sx={{ fontSize: '0.8rem', lineHeight: 1, fontWeight: 700 }}>{status.label}</Typography>
                </Box>
              </Box>
            </Stack>

            <Stack direction="row" spacing={0.7} alignItems="center" sx={{ flexShrink: 0, mt: 0.25 }}>
              <StarRoundedIcon sx={{ fontSize: 24, color: '#f59e0b' }} />
              <Typography sx={{ fontSize: '1.18rem', lineHeight: 1, fontWeight: 800, color: '#0f172a' }}>
                {worker.rating.toFixed(1)}
              </Typography>
              <Typography sx={{ fontSize: '0.84rem', color: '#64748b' }}>({worker.reviewCount})</Typography>
            </Stack>
          </Stack>

          <Stack
            direction={{ xs: 'column', md: 'row' }}
            spacing={{ xs: 0.9, md: 2.2 }}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            sx={{ color: '#5a6f86' }}
          >
            <Stack direction="row" spacing={0.8} alignItems="center">
              <MailOutlineRoundedIcon sx={{ fontSize: 19 }} />
              <Typography sx={{ fontSize: '0.91rem', lineHeight: 1.25 }}>{worker.email}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.8} alignItems="center">
              <LocalPhoneOutlinedIcon sx={{ fontSize: 19 }} />
              <Typography sx={{ fontSize: '0.91rem', lineHeight: 1.25 }}>{worker.phone}</Typography>
            </Stack>
            <Stack direction="row" spacing={0.8} alignItems="center">
              <PlaceOutlinedIcon sx={{ fontSize: 19 }} />
              <Typography sx={{ fontSize: '0.91rem', lineHeight: 1.25 }}>{worker.location}</Typography>
            </Stack>
          </Stack>

          <Box
            sx={{
              borderRadius: 3,
              p: { xs: 1.5, md: 1.8 },
              backgroundColor: '#f7fafc',
              border: '1px solid rgba(15, 23, 42, 0.04)',
            }}
          >
            <Stack
              direction={{ xs: 'column', lg: 'row' }}
              spacing={{ xs: 1.4, lg: 1.2 }}
              alignItems={{ xs: 'stretch', lg: 'center' }}
              justifyContent="space-between"
            >
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(4, minmax(0, 1fr))' }, gap: 1.25, flex: 1 }}>
                <WorkerMetric label={t('workers.card.completed', { defaultValue: 'Completed jobs' })} value={worker.completedJobs} />
                <WorkerMetric label={t('workers.card.activeJobs', { defaultValue: 'Active jobs' })} value={worker.activeJobs} />
                <WorkerMetric label={t('workers.card.revenue', { defaultValue: 'Revenue' })} value={formatCurrency(worker.revenue)} />
                <WorkerMetric label={t('workers.card.joinDate', { defaultValue: 'Join date' })} value={worker.joinedAt ? worker.joinedAt.toISOString().slice(0, 10) : '—'} />
              </Box>

              <Button
                variant="contained"
                onClick={() => onViewProfile(worker)}
                sx={{
                  minWidth: { xs: '100%', lg: 180 },
                  height: 46,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontSize: '0.93rem',
                  fontWeight: 700,
                  backgroundColor: '#2563eb',
                  boxShadow: '0 10px 22px rgba(37, 99, 235, 0.22)',
                  alignSelf: 'stretch',
                  '&:hover': {
                    backgroundColor: '#1d4ed8',
                    boxShadow: '0 12px 26px rgba(37, 99, 235, 0.28)',
                  },
                }}
              >
                {t('workers.card.viewProfile', { defaultValue: 'View Profile' })}
              </Button>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function WorkersPage() {
  const { workers, professions, addWorker } = useAppContext();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const navigate = useNavigate();

  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const enrichedWorkers = useMemo(() => {
    return (workers || []).map((worker, index) => {
      const profession = professions.find((item) => item.id === worker.professionId);
      return getWorkerDisplay(worker, index, profession?.name, t);
    });
  }, [professions, t, workers]);

  const summary = useMemo(() => {
    const totalWorkers = enrichedWorkers.length;
    const activeWorkers = enrichedWorkers.filter((worker) => worker.status === 'active').length;
    const busyWorkers = enrichedWorkers.filter((worker) => worker.status === 'busy').length;
    const offlineWorkers = enrichedWorkers.filter((worker) => worker.status === 'offline').length;
    return { totalWorkers, activeWorkers, busyWorkers, offlineWorkers };
  }, [enrichedWorkers]);

  const filteredWorkers = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();

    return enrichedWorkers.filter((worker) => {
      const matchesSearch =
        !lowerSearch ||
        worker.name.toLowerCase().includes(lowerSearch) ||
        worker.service.toLowerCase().includes(lowerSearch) ||
        worker.phone.toLowerCase().includes(lowerSearch) ||
        String(worker.experience || '').toLowerCase().includes(lowerSearch);

      const matchesStatus = statusFilter === 'all' || worker.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [enrichedWorkers, search, statusFilter]);

  function handleAddWorkerSubmit(values) {
    addWorker(values);
    setAddDialogOpen(false);
  }

  function handleViewProfile(worker) {
    navigate(`/workers/${worker.id}`, { state: { returnTo: '/workers' } });
  }

  function getFilterLabel(status) {
    if (status === 'all') {
      return t('workers.filters.all', { defaultValue: 'All' });
    }

    return t(`workers.status.${status}`, {
      defaultValue: status.charAt(0).toUpperCase() + status.slice(1),
    });
  }

  return (
    <Stack spacing={3.2} dir={isRtl ? 'rtl' : 'ltr'}>
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', md: 'center' }} spacing={2}>
        <Box sx={{ maxWidth: 780 }}>
          <Typography sx={{ fontSize: { xs: '2.05rem', md: '2.55rem' }, lineHeight: 1.05, fontWeight: 900, letterSpacing: '-0.04em', color: '#0f172a' }}>
            {t('workers.title', { defaultValue: 'Workers Management' })}
          </Typography>
          <Typography sx={{ mt: 0.95, maxWidth: 700, fontSize: { xs: '0.98rem', md: '1.03rem' }, lineHeight: 1.6, color: '#64748b' }}>
            {t('workers.subtitle', {
              defaultValue: 'Maintain worker records with fast create, edit, delete, and profile navigation workflows.',
            })}
          </Typography>
        </Box>

        <Button
          startIcon={<AddRoundedIcon sx={{ fontSize: 21 }} />}
          variant="contained"
          onClick={() => setAddDialogOpen(true)}
          sx={{
            minWidth: { xs: '100%', md: 170 },
            height: 48,
            borderRadius: 3,
            px: 2.4,
            textTransform: 'none',
            fontSize: '0.95rem',
            fontWeight: 800,
            backgroundColor: '#2563eb',
            boxShadow: '0 12px 26px rgba(37, 99, 235, 0.26)',
            '&:hover': {
              backgroundColor: '#1d4ed8',
              boxShadow: '0 14px 28px rgba(37, 99, 235, 0.3)',
            },
          }}
        >
          {t('workers.addWorker', { defaultValue: 'Add Worker' })}
        </Button>
      </Stack>

      <Box sx={{ display: 'grid',   gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
          gap: { xs: 2, md: 2.25 } }}>
        <SummaryCard
          label={t('workers.summary.totalWorkers', { defaultValue: 'Total workers' })}
          value={summary.totalWorkers}
          helper={t('workers.summary.totalWorkersHelp', { defaultValue: 'Profiles in the system' })}
          icon={<Groups2RoundedIcon fontSize="small" />}
        />
        <SummaryCard
          label={t('workers.summary.availableWorkers', { defaultValue: 'Available' })}
          value={summary.activeWorkers}
          helper={t('workers.summary.availableWorkersHelp', { defaultValue: 'Ready for assignment' })}
          icon={<CheckCircleOutlineRoundedIcon fontSize="small" />}
          tone="positive"
        />
        <SummaryCard
          label={t('workers.summary.busyWorkers', { defaultValue: 'Busy' })}
          value={summary.busyWorkers}
          helper={t('workers.summary.busyWorkersHelp', { defaultValue: 'Currently active' })}
          icon={<AccessTimeRoundedIcon fontSize="small" />}
        />
        <SummaryCard
          label={t('workers.card.offlineWorkers', { defaultValue: 'Offline' })}
          value={summary.offlineWorkers}
          helper={t('workers.card.offlineHelp', { defaultValue: 'Unavailable right now' })}
          icon={<PersonOffOutlinedIcon fontSize="small" />}
        />
      </Box>

      <Stack direction={{ xs: 'column', md: 'row' }} alignItems={{ xs: 'stretch', md: 'center' }} justifyContent="space-between" spacing={1.8} sx={{ pt: 0.5 }}>
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ rowGap: 1 }}>
          {STATUS_FILTERS.map((status) => {
            const selected = statusFilter === status;
            return (
              <Chip
                key={status}
                label={getFilterLabel(status)}
                onClick={() => setStatusFilter(status)}
                clickable
                variant={selected ? 'filled' : 'outlined'}
                color={selected ? 'primary' : 'default'}
                sx={{
                  height: 44,
                  px: 0.5,
                  borderRadius: 999,
                  fontWeight: 800,
                  fontSize: '0.92rem',
                  borderColor: selected ? '#2563eb' : 'rgba(15, 23, 42, 0.1)',
                  backgroundColor: selected ? '#2563eb' : '#ffffff',
                  color: selected ? '#ffffff' : '#0f172a',
                  '& .MuiChip-label': { px: 1.4 },
                  boxShadow: selected ? '0 10px 20px rgba(37, 99, 235, 0.2)' : 'none',
                  transition: 'transform 180ms ease, box-shadow 180ms ease, background-color 180ms ease',
                  '&:hover': {
                    backgroundColor: selected ? '#1d4ed8' : '#f8fafc',
                    transform: 'translateY(-1px)',
                  },
                }}
              />
            );
          })}
        </Stack>

        <Typography sx={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748b' }}>
          {t('workers.overview.showing', {
            defaultValue: 'Showing {{visible}} of {{total}} workers',
            visible: filteredWorkers.length,
            total: summary.totalWorkers,
          })}
        </Typography>
      </Stack>

      <Card
        elevation={0}
        sx={{
          borderRadius: 4,
          border: '1px solid rgba(15, 23, 42, 0.08)',
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.03), 0 18px 40px rgba(15, 23, 42, 0.05)',
          overflow: 'hidden',
          backgroundColor: '#ffffff',
        }}
      >
        <CardContent sx={{ p: { xs: 2, md: 2.4 }, '&:last-child': { pb: { xs: 2, md: 2.4 } } }}>
          <Stack spacing={2.1}>
            <TextField
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t('workers.searchPlaceholder', { defaultValue: 'Search workers by name, phone, or experience...' })}
              fullWidth
              sx={{
                '& .MuiInputBase-root': {
                  height: { xs: 54, md: 58 },
                  borderRadius: 999,
                  backgroundColor: '#f8fafc',
                  fontSize: '0.98rem',
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon sx={{ fontSize: 22, color: '#94a3b8' }} />
                  </InputAdornment>
                ),
              }}
            />

            <Divider sx={{ borderColor: 'rgba(15, 23, 42, 0.08)' }} />

            {filteredWorkers.length > 0 ? (
              <Stack spacing={1.8}>
                {filteredWorkers.map((worker) => (
                  <WorkerCard key={worker.id} worker={worker} onViewProfile={handleViewProfile} t={t} />
                ))}
              </Stack>
            ) : (
              <Box
                sx={{
                  py: { xs: 5, md: 7 },
                  px: 2,
                  textAlign: 'center',
                  borderRadius: 4,
                  backgroundColor: '#f8fafc',
                  border: '1px dashed rgba(15, 23, 42, 0.12)',
                }}
              >
                <Typography sx={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  {t('workers.card.noWorkersTitle', { defaultValue: 'No workers match the current filters' })}
                </Typography>
                <Typography sx={{ mt: 0.8, fontSize: '0.97rem', lineHeight: 1.6, color: '#64748b' }}>
                  {t('workers.card.noWorkersSubtitle', {
                    defaultValue: 'Clear a filter, search a different term, or add a new worker to continue.',
                  })}
                </Typography>
              </Box>
            )}
          </Stack>
        </CardContent>
      </Card>

      <WorkerDialog open={addDialogOpen} onClose={() => setAddDialogOpen(false)} onSubmit={handleAddWorkerSubmit} />
    </Stack>
  );
}

export default WorkersPage;
