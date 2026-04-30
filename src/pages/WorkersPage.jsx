import { useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import WorkerDialog from '../components/WorkerDialog';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAppContext } from '../context/AppContext';
import { formatCurrency, formatDate } from '../utils/format';

function WorkersPage() {
  const navigate = useNavigate();
  const { workers, addWorker, updateWorker, deleteWorker } = useAppContext();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeWorker, setActiveWorker] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  function openAddDialog() {
    setActiveWorker(null);
    setDialogOpen(true);
  }

  function openEditDialog(worker) {
    setActiveWorker(worker);
    setDialogOpen(true);
  }

  function handleSaveWorker(values) {
    if (activeWorker) {
      updateWorker(activeWorker.id, values);
    } else {
      addWorker(values);
    }
    setDialogOpen(false);
  }

  function handleDeleteConfirm() {
    if (deleteTarget) {
      deleteWorker(deleteTarget.id);
      setDeleteTarget(null);
    }
  }

  return (
    <Stack spacing={3.5}>
      <PageHeader
        title="Workers Management"
        subtitle="Maintain worker records with fast create, edit, delete, and profile navigation workflows."
        actions={
          <Button startIcon={<AddIcon />} variant="contained" onClick={openAddDialog} size="large">
            Add Worker
          </Button>
        }
      />
      <Card elevation={0} sx={(theme) => ({ borderRadius: 2, border: `1px solid ${theme.palette.divider}` })}>
        <CardContent sx={{ p: 0 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Worker</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell>Experience</TableCell>
                  <TableCell>Balance</TableCell>
                  <TableCell>Joined</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {workers.map((worker) => (
                  <TableRow key={worker.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: 'primary.main' }}>{worker.name.slice(0, 1)}</Avatar>
                        <Box>
                          <Typography sx={{ fontWeight: 700 }}>{worker.name}</Typography>
                          <Chip size="small" label={worker.history?.length ? `${worker.history.length} activities` : 'No activity yet'} sx={{ mt: 0.5 }} />
                        </Box>
                      </Stack>
                    </TableCell>
                    <TableCell>{worker.phone}</TableCell>
                    <TableCell>{worker.experience}</TableCell>
                    <TableCell>{formatCurrency(worker.balance)}</TableCell>
                    <TableCell>{formatDate(worker.createdAt)}</TableCell>
                    <TableCell align="right">
                      <Stack direction="row" justifyContent="flex-end" spacing={0.5}>
                        <IconButton aria-label={`view profile for ${worker.name}`} onClick={() => navigate(`/workers/${worker.id}`)}>
                          <VisibilityOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton aria-label={`edit ${worker.name}`} onClick={() => openEditDialog(worker)}>
                          <EditOutlinedIcon fontSize="small" />
                        </IconButton>
                        <IconButton aria-label={`delete ${worker.name}`} onClick={() => setDeleteTarget(worker)} color="error">
                          <DeleteOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
                {workers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <Box sx={{ py: 6, textAlign: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          No workers found
                        </Typography>
                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                          Add a worker to start tracking profiles and balances.
                        </Typography>
                        <Button sx={{ mt: 2 }} variant="contained" onClick={openAddDialog}>
                          Add Worker
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : null}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <WorkerDialog
        open={dialogOpen}
        worker={activeWorker}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleSaveWorker}
      />
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete worker"
        description={`Are you sure you want to delete ${deleteTarget?.name || 'this worker'}? This action cannot be undone.`}
        confirmLabel="Delete"
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />
    </Stack>
  );
}

export default WorkersPage;
