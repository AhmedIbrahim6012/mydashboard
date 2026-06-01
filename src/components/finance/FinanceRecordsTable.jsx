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
import { useTranslation } from 'react-i18next';
import { formatCurrency, formatDate } from '../../utils/format';
import { sortFinanceRecords } from '../../services/financeService';
import ConfirmDialog from '../ConfirmDialog';

const EMPTY_FORM = {
  revenue: '',
  ordersCount: '',
  profit: '',
  deposits: '',
};

function FinanceRecordsTable({ filteredRecords, onUpdateRecord, onDeleteRecord }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const alignEnd = isRtl ? 'left' : 'right';

  const tableColumns = [
    { id: 'date', label: t('finance.records.date'), align: isRtl ? 'right' : 'left' },
    { id: 'revenue', label: t('finance.records.revenue'), align: alignEnd },
    { id: 'ordersCount', label: t('finance.records.orders'), align: alignEnd },
    { id: 'profit', label: t('finance.records.profit'), align: alignEnd },
    { id: 'deposits', label: t('finance.records.deposits'), align: alignEnd },
  ];

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
  }, [filteredRecords]);

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

  const sortedRecords = useMemo(
    () => sortFinanceRecords(filteredRecords, orderBy, order),
    [filteredRecords, orderBy, order],
  );
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
      <TableContainer
        component={Paper}
        elevation={0}
        dir={isRtl ? 'rtl' : 'ltr'}
        sx={{ borderRadius: 4, border: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {tableColumns.map((column) => (
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
              <TableCell align={alignEnd}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {t('finance.records.actions')}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pagedRecords.length > 0 ? (
              pagedRecords.map((record) => (
                <TableRow key={record.id} hover>
                  <TableCell align={isRtl ? 'right' : 'left'}>{formatDate(record.date)}</TableCell>
                  <TableCell align={alignEnd}>{formatCurrency(record.revenue)}</TableCell>
                  <TableCell align={alignEnd}>{Number(record.ordersCount || 0).toLocaleString()}</TableCell>
                  <TableCell align={alignEnd}>{formatCurrency(record.profit)}</TableCell>
                  <TableCell align={alignEnd}>{formatCurrency(record.deposits)}</TableCell>
                  <TableCell align={alignEnd}>
                    <Stack direction="row" spacing={1} justifyContent={isRtl ? 'flex-start' : 'flex-end'}>
                      <IconButton
                        size="small"
                        onClick={() => openEditDialog(record)}
                        aria-label={t('finance.records.editAria', { date: formatDate(record.date) })}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => openDeleteDialog(record)}
                        aria-label={t('finance.records.deleteAria', { date: formatDate(record.date) })}
                      >
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
                      {t('finance.records.noDataTitle')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {t('finance.records.noDataSubtitle')}
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
          labelRowsPerPage={t('finance.records.rowsPerPage')}
          labelDisplayedRows={({ from, to, count }) =>
            `${from}-${to} ${t('finance.records.of')} ${count !== -1 ? count : `${t('finance.records.moreThan')} ${to}`}`
          }
        />
      </TableContainer>

      <Dialog open={editOpen} onClose={closeEditDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{t('finance.records.editFinanceRecord')}</DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent>
            <Stack spacing={2} sx={{ pt: 1 }}>
              <TextField label={t('finance.records.revenue')} type="number" value={formValues.revenue} onChange={(event) => setFormValues((current) => ({ ...current, revenue: event.target.value }))} fullWidth />
              <TextField label={t('finance.records.orders')} type="number" value={formValues.ordersCount} onChange={(event) => setFormValues((current) => ({ ...current, ordersCount: event.target.value }))} fullWidth />
              <TextField label={t('finance.records.profit')} type="number" value={formValues.profit} onChange={(event) => setFormValues((current) => ({ ...current, profit: event.target.value }))} fullWidth />
              <TextField label={t('finance.records.deposits')} type="number" value={formValues.deposits} onChange={(event) => setFormValues((current) => ({ ...current, deposits: event.target.value }))} fullWidth />
            </Stack>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={closeEditDialog}>{t('finance.records.cancel')}</Button>
            <Button type="submit" variant="contained">
              {t('finance.records.saveChanges')}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ConfirmDialog
        open={deleteOpen}
        title={t('finance.records.deleteFinanceRecord')}
        description={t('finance.records.deletePrompt', {
          date: selectedRecord ? formatDate(selectedRecord.date) : t('finance.records.thisDate'),
        })}
        confirmLabel={t('finance.records.delete')}
        onClose={closeDeleteDialog}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}

export default FinanceRecordsTable;
