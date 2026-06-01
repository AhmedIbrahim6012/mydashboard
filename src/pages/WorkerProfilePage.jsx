import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PageHeader from '../components/PageHeader';
import WorkerDialog from '../components/WorkerDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAppContext } from '../context/AppContext';
import { useWorker } from '../hooks/useWorker';
import { formatCurrency } from '../utils/format';
import { useTranslation } from 'react-i18next';

function WorkerProfilePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { worker } = useWorker();
  const { updateWorker, deleteWorker, professions } = useAppContext();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const locale = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const professionId = location.state?.professionId || null;
  const returnTo = location.state?.returnTo || (professionId ? `/professions/${professionId}` : '/workers');
  const profession = professions.find((entry) => entry.id === (professionId || worker?.professionId));

  if (!worker) {
    return (
      <Card elevation={0} sx={(theme) => ({ borderRadius: 4, border: `1px solid ${theme.palette.divider}` })}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={2} alignItems="flex-start">
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              {t('workers.profile.notFound.title')}
            </Typography>
            <Typography color="text.secondary">
              {t('workers.profile.notFound.subtitle')}
            </Typography>
            <Button startIcon={<ArrowBackIcon />} variant="contained" onClick={() => navigate(returnTo)}>
              {t('workers.profile.notFound.back')}
            </Button>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  function handleSave(values) {
    updateWorker(worker.id, values);
    setDialogOpen(false);
  }

  function handleDelete() {
    deleteWorker(worker.id);
    navigate(returnTo);
  }

  return (
    <Stack spacing={3.5} dir={isRtl ? 'rtl' : 'ltr'}>
      <PageHeader
        title={t('workers.profile.title')}
        subtitle={t('workers.profile.subtitle')}
        actions={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button startIcon={<ArrowBackIcon />} variant="outlined" onClick={() => navigate(returnTo)}>
              {profession ? t('workers.profile.backToProfession', { defaultValue: 'Back to profession' }) : t('workers.profile.back')}
            </Button>
            <Button startIcon={<EditOutlinedIcon />} variant="contained" onClick={() => setDialogOpen(true)}>
              {t('workers.profile.edit')}
            </Button>
          </Stack>
        }
      />

      <GridLayout worker={worker} profession={profession} t={t} isRtl={isRtl} locale={locale} />

      <Card elevation={0} sx={(theme) => ({ borderRadius: 2, border: `1px solid ${theme.palette.divider}` })}>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {t('workers.profile.activityHistory')}
            </Typography>
            <Stack spacing={1.5}>
              {worker.history?.length ? (
                worker.history.map((activity) => (
                  <Box
                    key={activity.id}
                    sx={(theme) => ({
                      borderRadius: 3,
                      p: 2,
                      backgroundColor: theme.palette.action.hover,
                    })}
                  >
                    <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1}>
                      <Box>
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                          <Chip size="small" label={activity.type} />
                          <Typography sx={{ fontWeight: 700 }}>{activity.note}</Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.8 }}>
                          {new Date(activity.date).toLocaleString(locale)}
                        </Typography>
                      </Box>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: 800, color: activity.amount >= 0 ? 'success.main' : 'error.main' }}
                      >
                        {activity.amount >= 0 ? '+' : '-'}{formatCurrency(Math.abs(activity.amount))}
                      </Typography>
                    </Stack>
                  </Box>
                ))
              ) : (
                <Typography color="text.secondary">{t('workers.profile.emptyActivity')}</Typography>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={1.5} justifyContent={isRtl ? 'flex-start' : 'flex-end'}>
        <Button color="error" startIcon={<DeleteOutlinedIcon />} onClick={() => setDeleteOpen(true)}>
          {t('workers.profile.delete')}
        </Button>
      </Stack>

      <WorkerDialog open={dialogOpen} worker={worker} onClose={() => setDialogOpen(false)} onSubmit={handleSave} />
      <ConfirmDialog
        open={deleteOpen}
        title={t('workers.confirm.title')}
        description={t('workers.profile.deleteConfirm', { name: worker.name })}
        confirmLabel={t('common.delete')}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </Stack>
  );
}

function GridLayout({ worker, profession, t, isRtl, locale }) {
  return (
    <Grid container spacing={2.5}>
      <Grid item xs={12} lg={7}>
        <Card elevation={0} sx={(theme) => ({ height: '100%', borderRadius: 4, border: `1px solid ${theme.palette.divider}` })}>
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={3}>
              <Stack direction="row" spacing={2} alignItems="center" sx={{ flexDirection: isRtl ? 'row-reverse' : 'row' }}>
                <Avatar sx={{ width: 72, height: 72, fontSize: 32, bgcolor: 'primary.main' }}>{worker.name.slice(0, 1)}</Avatar>
                <Box>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>
                    {worker.name}
                  </Typography>
                  <Typography color="text.secondary">{t('workers.profile.fields.workerId', { id: worker.id })}</Typography>
                  <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: 'wrap' }}>
                    {profession ? <Chip size="small" label={profession.name} /> : null}
                    {profession ? <Chip size="small" variant="outlined" label={`${Number(profession.commissionPercent || 0)}% ${t('professions.commission', { defaultValue: 'commission' })}`} /> : null}
                  </Stack>
                </Box>
              </Stack>
              <Divider />
              <Grid container spacing={2}>
                {[
                  { label: t('workers.profile.fields.phone'), value: worker.phone },
                  { label: t('workers.profile.fields.experience'), value: worker.experience },
                  { label: t('workers.profile.fields.balance'), value: formatCurrency(worker.balance) },
                ].map((item) => (
                  <Grid key={item.label} item xs={12} sm={4}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {item.label}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 800 }}>
                        {item.value}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} lg={5}>
        <Card elevation={0} sx={(theme) => ({ height: '100%', borderRadius: 4, border: `1px solid ${theme.palette.divider}` })}>
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2.5}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {t('workers.profile.walletOverview')}
              </Typography>
              <Box
                sx={(theme) => ({
                  borderRadius: 4,
                  p: 3,
                  color: 'white',
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                })}
              >
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {t('workers.profile.currentWalletBalance')}
                </Typography>
                <Typography variant="h3" sx={{ fontWeight: 800, mt: 1 }}>
                  {formatCurrency(worker.balance)}
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, opacity: 0.92 }}>
                  {t('workers.profile.walletNote')}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

export default WorkerProfilePage;
