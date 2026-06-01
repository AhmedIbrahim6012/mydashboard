import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Chip,
  Stack,
  TextField,
  Typography,
  LinearProgress,
  Divider,
  Skeleton,
  alpha,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import GroupsIcon from '@mui/icons-material/Groups';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import WorkerDialog from '../components/WorkerDialog';
import { useAppContext } from '../context/AppContext';
import { formatDate } from '../utils/format';
import { useTranslation } from 'react-i18next';
import api from '../utils/axiosInstance';

// ─── Stat Card ───────────────────────────────────────────
function StatCard({ icon, label, value, color = 'primary' }) {
  return (
    <Card elevation={0} sx={(theme) => ({
      borderRadius: 4, border: `1px solid ${theme.palette.divider}`,
      background: `linear-gradient(135deg, ${alpha(theme.palette[color].main, 0.09)}, transparent)`,
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': { transform: 'translateY(-3px)', boxShadow: `0 16px 40px ${alpha(theme.palette[color].main, 0.15)}` },
    })}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2}>
          <Box sx={(theme) => ({
            width: 46, height: 46, borderRadius: 3,
            bgcolor: alpha(theme.palette[color].main, 0.13),
            display: 'grid', placeItems: 'center', color: `${color}.main`,
          })}>{icon}</Box>
          <Box>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, mb: 0.5 }}>{label}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.04em' }}>{value}</Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

// ─── Worker Card ─────────────────────────────────────────
function WorkerCard({ worker, profession, navigate, t, isRtl }) {
  return (
    <Card elevation={0} sx={(theme) => ({
      height: '100%', borderRadius: 4, border: `1px solid ${theme.palette.divider}`,
      transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
      '&:hover': { transform: 'translateY(-4px)', boxShadow: theme.shadows[10], borderColor: theme.palette.primary.light },
    })}>
      <CardContent sx={{ p: 3 }}>
        <Stack spacing={2.5}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ flexDirection: isRtl ? 'row-reverse' : 'row' }}>
            <Avatar sx={(theme) => ({
              width: 52, height: 52, bgcolor: theme.palette.primary.main,
              fontWeight: 800, fontSize: 20,
              boxShadow: `0 8px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
            })}>
              {(worker.name || '').slice(0, 1)}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }} noWrap>{worker.name || '—'}</Typography>
              <Typography variant="body2" color="text.secondary" noWrap>{worker.role || worker.experience || '—'}</Typography>
            </Box>
            <Chip label={worker.status || 'Active'} size="small" color="success" sx={{ fontWeight: 700, borderRadius: 2 }} />
          </Stack>

          <Divider />

          <Grid container spacing={1.5}>
            {[
              { icon: <PhoneIcon fontSize="small" />, label: t('workers.phone', { defaultValue: 'Phone' }), value: worker.phone },
              { icon: <AccountBalanceWalletIcon fontSize="small" />, label: t('workers.balance', { defaultValue: 'Balance' }), value: worker.balance !== undefined ? `$${worker.balance}` : null },
              { icon: <CalendarTodayIcon fontSize="small" />, label: t('workers.joined', { defaultValue: 'Joined' }), value: worker.createdAt ? formatDate(worker.createdAt) : null },
              { icon: <MonetizationOnIcon fontSize="small" />, label: 'Commission', value: worker.commissionOverride !== undefined ? `${worker.commissionOverride}%` : '—' },
            ].map((item) => (
              <Grid item xs={6} key={item.label}>
                <Box sx={(theme) => ({ p: 1.5, borderRadius: 2, bgcolor: theme.palette.action.hover })}>
                  <Stack direction="row" spacing={0.75} alignItems="center" sx={{ mb: 0.5 }}>
                    <Box sx={{ color: 'text.secondary', display: 'flex' }}>{item.icon}</Box>
                    <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>{item.label}</Typography>
                  </Stack>
                  <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>{item.value || '—'}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>

          <Button fullWidth variant="outlined" size="small"
            startIcon={<VisibilityOutlinedIcon fontSize="small" />}
            onClick={() => navigate(`/workers/${worker.id}`, { state: { professionId: profession.id, returnTo: `/professions/${profession.id}` } })}
            sx={{ borderRadius: 2, fontWeight: 700, textTransform: 'none' }}>
            {t('workers.table.viewProfile', { name: worker.name })}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────
function ProfessionDetailPage() {
  const navigate = useNavigate();
  const { id: professionId } = useParams();
  const { workers, addWorker } = useAppContext();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  // ── API State ──────────────────────────────────────────
  const [profession, setProfession] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    async function fetchProfession() {
      try {
        setFetchLoading(true);
        const response = await api.get(`/admin/category/categories/${professionId}`);
        const data = response.data.data;
        setProfession({
          id: data.id,
          name: data.name,
          commission: data.commission,
          image: data.image_url,
          is_active: data.is_active,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setFetchLoading(false);
      }
    }
    fetchProfession();
  }, [professionId]);

  // ── Workers ────────────────────────────────────────────
  const professionWorkers = useMemo(
    () => workers.filter((w) => w.professionId === professionId),
    [professionId, workers],
  );

  const [searchQuery, setSearchQuery] = useState('');
  const filteredWorkers = useMemo(
    () => professionWorkers.filter((w) =>
      `${w.name} ${w.id} ${w.phone} ${w.experience}`.toLowerCase().includes(searchQuery.toLowerCase())
    ),
    [professionWorkers, searchQuery],
  );

  const [workerDialogOpen, setWorkerDialogOpen] = useState(false);

  function handleSaveWorker(values) {
    addWorker({ ...values, professionId });
    setWorkerDialogOpen(false);
  }

  const commissionNum = Math.min(Math.max(Number(profession?.commission || 0), 0), 100);
  const totalBalance = professionWorkers.reduce((s, w) => s + Number(w.balance || 0), 0);

  // ── Loading ────────────────────────────────────────────
  if (fetchLoading) {
    return (
      <Stack spacing={4}>
        <Skeleton variant="rounded" height={200} sx={{ borderRadius: 5 }} />
        <Grid container spacing={2.5}>
          {[1, 2, 3].map((i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Skeleton variant="rounded" height={140} sx={{ borderRadius: 4 }} />
            </Grid>
          ))}
        </Grid>
        <Skeleton variant="rounded" height={100} sx={{ borderRadius: 4 }} />
      </Stack>
    );
  }

  // ── Not Found ──────────────────────────────────────────
  if (!profession) {
    return (
      <Card elevation={0} sx={(theme) => ({ borderRadius: 4, border: `1px solid ${theme.palette.divider}` })}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={2} alignItems="flex-start">
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {t('professions.notFound', { defaultValue: 'Job category not found' })}
            </Typography>
            <Button startIcon={<ArrowBackIcon />} variant="contained" onClick={() => navigate('/professions')}>
              {t('professions.back', { defaultValue: 'Back to categories' })}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={4} dir={isRtl ? 'rtl' : 'ltr'}>

      {/* ── Hero Banner ───────────────────────────────── */}
      <Card elevation={0} sx={(theme) => ({
        borderRadius: 5, overflow: 'hidden',
        border: `1px solid ${theme.palette.divider}`,
        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main} 50%, ${theme.palette.secondary.main})`,
        color: '#fff', position: 'relative',
      })}>
        <Box sx={{ position: 'absolute', right: -80, top: -80, width: 300, height: 300, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.06)' }} />
        <Box sx={{ position: 'absolute', right: 40, bottom: -100, width: 200, height: 200, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />
        <Box sx={{ position: 'absolute', left: -40, bottom: -60, width: 180, height: 180, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.04)' }} />

        <CardContent sx={{ p: { xs: 3, md: 5 }, position: 'relative', zIndex: 1 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} alignItems={{ md: 'center' }} justifyContent="space-between">

            <Stack direction="row" spacing={3} alignItems="center">
              <Avatar src={profession.image} sx={{
                width: 90, height: 90, fontSize: 36, fontWeight: 900,
                bgcolor: 'rgba(255,255,255,0.18)',
                border: '3px solid rgba(255,255,255,0.35)',
                boxShadow: '0 12px 40px rgba(0,0,0,0.25)',
              }}>
                {!profession.image && (profession.name || '').slice(0, 1)}
              </Avatar>

              <Box>
                <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.03em', color: '#fff', lineHeight: 1.1 }}>
                  {profession.name}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 1.5 }} flexWrap="wrap">
                  <Chip
                    icon={profession.is_active
                      ? <CheckCircleOutlinedIcon sx={{ color: '#fff !important', fontSize: 14 }} />
                      : <CancelOutlinedIcon sx={{ color: '#fff !important', fontSize: 14 }} />
                    }
                    label={profession.is_active ? 'Active' : 'Inactive'}
                    size="small"
                    sx={{
                      bgcolor: profession.is_active ? 'rgba(76,175,80,0.35)' : 'rgba(255,255,255,0.15)',
                      color: '#fff', fontWeight: 700, border: '1px solid rgba(255,255,255,0.2)',
                    }}
                  />
                  <Chip
                    icon={<GroupsIcon sx={{ color: '#fff !important', fontSize: 14 }} />}
                    label={`${professionWorkers.length} workers`}
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700 }}
                  />
                  <Chip
                    icon={<MonetizationOnIcon sx={{ color: '#fff !important', fontSize: 14 }} />}
                    label={`${Number(profession.commission || 0)}% commission`}
                    size="small"
                    sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: '#fff', fontWeight: 700 }}
                  />
                </Stack>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.5} flexWrap="wrap">
              <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/professions')} variant="outlined"
                sx={{ color: '#fff', borderColor: 'rgba(255,255,255,0.4)', borderRadius: 3, textTransform: 'none', fontWeight: 700, '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
                {t('professions.back', { defaultValue: 'Back' })}
              </Button>
              <Button startIcon={<AddIcon />} onClick={() => setWorkerDialogOpen(true)} variant="contained" disableElevation
                sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff', borderRadius: 3, textTransform: 'none', fontWeight: 700, backdropFilter: 'blur(10px)', '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' } }}>
                {t('professions.addWorker', { defaultValue: 'Add Worker' })}
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      {/* ── Stat Cards ────────────────────────────────── */}
      <Grid container spacing={2.5}>
        <Grid item xs={12} sm={4}>
          <StatCard icon={<GroupsIcon />} label="Total Workers" value={professionWorkers.length} color="primary" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard icon={<MonetizationOnIcon />} label="Commission Rate" value={`${Number(profession.commission || 0)}%`} color="success" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <StatCard icon={<TrendingUpIcon />} label="Total Balance" value={`$${totalBalance.toLocaleString()}`} color="warning" />
        </Grid>
      </Grid>

      {/* ── Commission Bar ────────────────────────────── */}
      <Card elevation={0} sx={(theme) => ({ borderRadius: 4, border: `1px solid ${theme.palette.divider}` })}>
        <CardContent sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>Commission Rate</Typography>
            <Typography variant="h5" sx={{ fontWeight: 900, letterSpacing: '-0.03em' }}>
              {Number(profession.commission || 0)}%
            </Typography>
          </Stack>
          <LinearProgress variant="determinate" value={commissionNum} sx={(theme) => ({
            height: 12, borderRadius: 6, bgcolor: theme.palette.action.hover,
            '& .MuiLinearProgress-bar': {
              borderRadius: 6,
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            },
          })} />
          <Stack direction="row" justifyContent="space-between" sx={{ mt: 1 }}>
            <Typography variant="caption" color="text.secondary">0%</Typography>
            <Typography variant="caption" color="text.secondary">100%</Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* ── Workers ───────────────────────────────────── */}
      <Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}
          alignItems={{ sm: 'center' }} justifyContent="space-between" sx={{ mb: 2.5 }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            Workers ({filteredWorkers.length})
          </Typography>
          <TextField
            placeholder={t('workers.searchPlaceholder', { defaultValue: 'Search workers...' })}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="small"
            sx={{ maxWidth: 320, '& .MuiOutlinedInput-root': { borderRadius: 3 } }}
          />
        </Stack>

        {filteredWorkers.length > 0 ? (
          <Grid container spacing={2.5}>
            {filteredWorkers.map((worker) => (
              <Grid key={worker.id} item xs={12} sm={6} lg={4}>
                <WorkerCard worker={worker} profession={profession} navigate={navigate} t={t} isRtl={isRtl} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Card elevation={0} sx={(theme) => ({ borderRadius: 4, border: `1px dashed ${theme.palette.divider}` })}>
            <CardContent>
              <Box sx={{ py: 8, textAlign: 'center' }}>
                <GroupsIcon sx={{ fontSize: 56, color: 'text.disabled', mb: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {t('professions.emptyTitle', { defaultValue: 'No workers yet' })}
                </Typography>
                <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                  {t('professions.emptySubtitle', { defaultValue: 'Add a worker to this category to get started.' })}
                </Typography>
                <Button variant="contained" startIcon={<AddIcon />} onClick={() => setWorkerDialogOpen(true)}
                  sx={{ borderRadius: 3, textTransform: 'none', fontWeight: 700 }}>
                  Add First Worker
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
      </Box>

      <WorkerDialog
        open={workerDialogOpen}
        worker={null}
        defaultProfessionId={profession.id}
        onClose={() => setWorkerDialogOpen(false)}
        onSubmit={handleSaveWorker}
      />
    </Stack>
  );
}

export default ProfessionDetailPage;