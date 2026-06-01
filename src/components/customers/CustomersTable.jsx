import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ConfirmDialog from '../ConfirmDialog';
import { useState } from 'react';
import CustomerDetailsModal from './CustomerDetailsModal';
import { useTranslation } from 'react-i18next';

function getCustomerStatus(customer) {
  if (Number(customer.balance || 0) > 0 && customer.email) {
    return 'active';
  }

  if (Number(customer.balance || 0) > 0) {
    return 'pending';
  }

  if (customer.email) {
    return 'confirmed';
  }

  return 'inactive';
}

function getStatusChipProps(status, t) {
  switch (status) {
    case 'active':
      return { label: t('customers.status.active', { defaultValue: 'Active' }), color: 'primary', variant: 'filled' };
    case 'pending':
      return { label: t('customers.status.pending', { defaultValue: 'Pending' }), color: 'warning', variant: 'filled' };
    case 'confirmed':
      return { label: t('customers.status.confirmed', { defaultValue: 'Confirmed' }), color: 'success', variant: 'filled' };
    default:
      return { label: t('customers.status.inactive', { defaultValue: 'Inactive' }), color: 'default', variant: 'outlined' };
  }
}

function CustomersTable({ customers, onDelete }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const locale = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  function handleView(customer) {
    setSelected(customer);
    setDetailsOpen(true);
  }

  function handleDeleteClick(customer) {
    setSelected(customer);
    setConfirmOpen(true);
  }

  function closeDetails() {
    setDetailsOpen(false);
    setSelected(null);
  }

  function handleConfirmDelete() {
    onDelete(selected.id);
    setConfirmOpen(false);
    setSelected(null);
  }

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={(theme) => ({
          borderRadius: 0,
          borderTop: `1px solid ${theme.palette.divider}`,
          boxShadow: 'none',
        })}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.4 }}>
                  {t('customers.table.customerId', { defaultValue: 'Customer ID' })}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {t('customers.table.customer', { defaultValue: 'Customer' })}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {t('customers.table.email')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {t('customers.table.registered')}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {t('customers.table.status', { defaultValue: 'Status' })}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {t('customers.table.balance')}
                </Typography>
              </TableCell>
              <TableCell align={isRtl ? 'left' : 'right'}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  {t('customers.table.actions')}
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => {
              const status = getCustomerStatus(customer);
              const statusChip = getStatusChipProps(status, t);

              return (
                <TableRow key={customer.id} hover>
                  <TableCell>
                    <Typography sx={{ fontWeight: 800 }}>{customer.id}</Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ width: 40, height: 40, fontSize: 16, bgcolor: 'primary.light', color: 'primary.dark', fontWeight: 800 }}>
                        {customer.fullName.slice(0, 1)}
                      </Avatar>
                      <Box>
                        <Typography sx={{ fontWeight: 800 }}>{customer.fullName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {customer.phone}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>{customer.email || '—'}</TableCell>
                  <TableCell>{new Date(customer.createdAt).toLocaleString(locale)}</TableCell>
                  <TableCell>
                    <Chip size="small" label={statusChip.label} color={statusChip.color} variant={statusChip.variant} />
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 800 }}>{Number(customer.balance || 0).toLocaleString(locale, { style: 'currency', currency: 'USD' })}</Typography>
                  </TableCell>
                  <TableCell align={isRtl ? 'left' : 'right'}>
                    <Stack direction="row" spacing={1} justifyContent={isRtl ? 'flex-start' : 'flex-end'}>
                      <IconButton size="small" onClick={() => handleView(customer)} aria-label={t('customers.actions.view', { name: customer.fullName, defaultValue: `View ${customer.fullName}` })}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                      <IconButton size="small" color="error" onClick={() => handleDeleteClick(customer)} aria-label={t('customers.actions.delete', { name: customer.fullName, defaultValue: `Delete ${customer.fullName}` })}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={confirmOpen}
        title={t('customers.confirm.title')}
        description={t('customers.confirm.description', { name: selected?.fullName || 'this customer' })}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <CustomerDetailsModal open={detailsOpen} customer={selected} onClose={closeDetails} />
    </>
  );
}

export default CustomersTable;