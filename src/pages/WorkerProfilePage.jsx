import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
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
import { formatCurrency, formatDateTime } from '../utils/format';

function WorkerProfilePage() {
  const navigate = useNavigate();
  const { worker } = useWorker();
  const { updateWorker, deleteWorker } = useAppContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  if (!worker) {
    return (
      <Card elevation={0} sx={(theme) => ({ borderRadius: 4, border: `1px solid ${theme.palette.divider}` })}>
        <CardContent sx={{ p: 4 }}>
          <Stack spacing={2} alignItems="flex-start">
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Worker not found
            </Typography>
            <Typography color="text.secondary">
              The selected worker profile no longer exists or could not be loaded.
            </Typography>
            <Button startIcon={<ArrowBackIcon />} variant="contained" onClick={() => navigate('/workers')}>
              Back to workers
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
    navigate('/workers');
  }

  return (
    <Stack spacing={3.5}>
      <PageHeader
        title="Worker Profile"
        subtitle="Inspect profile details, activity history, and quick actions for the selected worker."
        actions={
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
            <Button startIcon={<ArrowBackIcon />} variant="outlined" onClick={() => navigate('/workers')}>
              Back
            </Button>
            <Button startIcon={<EditOutlinedIcon />} variant="contained" onClick={() => setDialogOpen(true)}>
              Edit Worker
            </Button>
          </Stack>
        }
      />

      <GridLayout worker={worker} />

      <Card elevation={0} sx={(theme) => ({ borderRadius: 4, border: `1px solid ${theme.palette.divider}` })}>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Activity History
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
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip size="small" label={activity.type} />
                          <Typography sx={{ fontWeight: 700 }}>{activity.note}</Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.8 }}>
                          {formatDateTime(activity.date)}
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
                <Typography color="text.secondary">No recent activity has been recorded for this worker.</Typography>
              )}
            </Stack>
          </Stack>
        </CardContent>
      </Card>

      <Stack direction="row" spacing={1.5} justifyContent="flex-end">
        <Button color="error" startIcon={<DeleteOutlinedIcon />} onClick={() => setDeleteOpen(true)}>
          Delete Worker
        </Button>
      </Stack>

      <WorkerDialog
        open={dialogOpen}
        worker={worker}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSave}
      />
      <ConfirmDialog
        open={deleteOpen}
        title="Delete worker"
        description={`Delete ${worker.name} from the system? This cannot be undone.`}
        confirmLabel="Delete"
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </Stack>
  );
}

function GridLayout({ worker }) {
  return (
    <Stack spacing={3} direction={{ xs: 'column', lg: 'row' }}>
      <Card elevation={0} sx={(theme) => ({ flex: 1, borderRadius: 4, border: `1px solid ${theme.palette.divider}` })}>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={3}>
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar sx={{ width: 72, height: 72, fontSize: 32, bgcolor: 'primary.main' }}>{worker.name.slice(0, 1)}</Avatar>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {worker.name}
                </Typography>
                <Typography color="text.secondary">Worker ID: {worker.id}</Typography>
              </Box>
            </Stack>
            <Divider />
            <Stack spacing={1.5}>
              {[
                { label: 'Phone Number', value: worker.phone },
                { label: 'Experience', value: worker.experience },
                { label: 'Balance', value: formatCurrency(worker.balance) },
              ].map((item) => (
                <Box key={item.label}>
                  <Typography variant="body2" color="text.secondary">
                    {item.label}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Stack>
          </Stack>
        </CardContent>
      </Card>
      <Card elevation={0} sx={(theme) => ({ flex: 1, borderRadius: 4, border: `1px solid ${theme.palette.divider}` })}>
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={2.5}>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Wallet Overview
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
                Current wallet balance
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mt: 1 }}>
                {formatCurrency(worker.balance)}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1, opacity: 0.92 }}>
                Records are stored locally and update instantly after deposits or edits.
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default WorkerProfilePage;
