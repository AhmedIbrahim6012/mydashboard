import { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  TextField,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { formatCurrency, formatDate } from '../../utils/format';
import { sortFinanceRecords } from '../../services/financeService';
import ConfirmDialog from '../ConfirmDialog';

const TABLE_COLUMNS = [
  { id: 'date', label: 'Date' },
  { id: 'revenue', label: 'Revenue', align: 'right' },
  { id: 'ordersCount', label: 'Orders', align: 'right' },
  { id: 'profit', label: 'Profit', align: 'right' },
  { id: 'deposits', label: 'Deposits', align: 'right' },
];

const EMPTY_FORM = {
  revenue: '',
  ordersCount: '',
  profit: '',
  deposits: '',
};

function FinanceRecordsTable({ records, onUpdateRecord, onDeleteRecord }) {
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [formValues, setFormValues] = useState(EMPTY_FORM);

  useEffect(() => {
    setPage(0);
  }, [records]);

  useEffect(() => {
    if (editOpen && selectedRecord) {
      setFormValues({
        revenue: String(selectedRecord.revenue ?? ''),
        ordersCount: String(selectedRecord.ordersCount ?? ''),
        profit: String(selectedRecord.profit ?? ''),
        deposits: String(selectedRecord.deposits ?? ''),
      });
    }
  }, [editOpen, selectedRecord]);

  const sortedRecords = useMemo(() => sortFinanceRecords(records, orderBy, order), [records, orderBy, order]);
  const pagedRecords = useMemo(
    () => sortedRecords.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [sortedRecords, page, rowsPerPage],
  );

  function handleSort(columnId) {
    if (orderBy === columnId) {
      setOrder((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }

    setOrderBy(columnId);
    setOrder(columnId === 'date' ? 'desc' : 'desc');
  }

  function openEditDialog(record) {
    setSelectedRecord(record);
    setEditOpen(true);
  }

  function closeEditDialog() {
    setEditOpen(false);
    setSelectedRecord(null);
    setFormValues(EMPTY_FORM);
  }

  function handleEditSubmit(event) {
    event.preventDefault();

    if (!selectedRecord) {
      return;
    }

    onUpdateRecord(selectedRecord.id, {
      revenue: Number(formValues.revenue || 0),
      ordersCount: Number(formValues.ordersCount || 0),
      profit: Number(formValues.profit || 0),
      deposits: Number(formValues.deposits || 0),
    });

    closeEditDialog();
  }

  function openDeleteDialog(record) {
    setSelectedRecord(record);
    setDeleteOpen(true);
  }

  function closeDeleteDialog() {
    setDeleteOpen(false);
    setSelectedRecord(null);
  }

  function handleConfirmDelete() {
    if (selectedRecord) {
      onDeleteRecord(selectedRecord.id);
    }

    closeDeleteDialog();
  }

  return (
    <>
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 4, border: (theme) => `1px solid ${theme.palette.divider}` }}>
        <Table>
          <TableHead>
            <TableRow>
              {TABLE_COLUMNS.map((column) => (
                <TableCell key={column.id} align={column.align || 'left'} sortDirection={orderBy === column.id ? order : false}>
                  <TableSortLabel
                    active={orderBy === column.id}
                    direction={orderBy === column.id ? order : 'asc'}
                    onClick={() => handleSort(column.id)}
                  >
                    <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                      {column.label}
                    </Typography>
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell align="right">
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Actions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedRecords.length > 0 ? (
              pagedRecords.map((record) => (
                <TableRow key={record.id} hover>
                  <TableCell>{formatDate(record.date)}</TableCell>
                  <TableCell align="right">{formatCurrency(record.revenue)}</TableCell>
                  <TableCell align="right">{Number(record.ordersCount || 0).toLocaleString()}</TableCell>
                  <TableCell align="right">{formatCurrency(record.profit)}</TableCell>
                  <TableCell align="right">{formatCurrency(record.deposits)}</TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1} justifyContent="flex-end">
                      <IconButton size="small" onClick={() => openEditDialog(record)} aria-label={`Edit record ${formatDate(record.date)}`}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => openDeleteDialog(record)} aria-label={`Delete record ${formatDate(record.date)}`}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6}>
                  <Box sx={{ py: 5, textAlign: 'center' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      No records available for this date range.
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      Adjust the filter window to load analytics data.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={sortedRecords.length}
          page={page}
          onPageChange={(_, nextPage) => setPage(nextPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(Number(event.target.value));
            setPage(0);
          }}
          rowsPerPageOptions={[5, 10, 15, 25]}
        />
      </TableContainer>

      <Dialog open={editOpen} onClose={closeEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>Edit finance record</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField label="Revenue" type="number" value={formValues.revenue} onChange={(event) => setFormValues((current) => ({ ...current, revenue: event.target.value }))} fullWidth />
              <TextField label="Orders" type="number" value={formValues.ordersCount} onChange={(event) => setFormValues((current) => ({ ...current, ordersCount: event.target.value }))} fullWidth />
              <TextField label="Profit" type="number" value={formValues.profit} onChange={(event) => setFormValues((current) => ({ ...current, profit: event.target.value }))} fullWidth />
              <TextField label="Deposits" type="number" value={formValues.deposits} onChange={(event) => setFormValues((current) => ({ ...current, deposits: event.target.value }))} fullWidth />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={closeEditDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              Save changes
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog
        open={deleteOpen}
        title="Delete finance record"
        description={`Are you sure you want to delete the record from ${selectedRecord ? formatDate(selectedRecord.date) : 'this date'}?`}
        confirmLabel="Delete"
        onClose={closeDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export default FinanceRecordsTable;
