import {
  Avatar,
  Box,
  Chip,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
  Switch 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VerifiedIcon from '@mui/icons-material/Verified';
import ConfirmDialog from '../ConfirmDialog';
import { useState } from 'react';
import CustomerDetailsModal from './CustomerDetailsModal';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

function getInitials(firstName = '', lastName = '') {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function getStatusConfig(customer) {
  if (customer.is_active && customer.is_verified) return { label: 'active', color: 'success' };
  if (customer.is_active && !customer.is_verified) return { label: 'pending', color: 'warning' };
  if (!customer.is_active && customer.is_verified) return { label: 'Inactive', color: 'error' };
  return { label: 'inactive', color: 'default' };
}

const AVATAR_COLORS = [
  { bg: '#e3f2fd', text: '#0d47a1' },
  { bg: '#f3e5f5', text: '#4a148c' },
  { bg: '#e8f5e9', text: '#1b5e20' },
  { bg: '#fff3e0', text: '#e65100' },
  { bg: '#e0f7fa', text: '#006064' },
];

function getAvatarColor(id) {
  return AVATAR_COLORS[Number(id || 0) % AVATAR_COLORS.length];
}

function TableSkeleton() {
  return Array.from({ length: 5 }).map((_, i) => (
    <TableRow key={i}>
      {Array.from({ length: 6 }).map((__, j) => (
        <TableCell key={j} sx={{ py: 2 }}>
          <Skeleton variant={j === 1 ? 'rectangular' : 'text'} height={j === 1 ? 40 : 22} sx={{ borderRadius: 1 }} />
        </TableCell>
      ))}
    </TableRow>
  ));
}

function CustomersTable({ customers, onDelete, onToggleActive, loading = false }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const [selected, setSelected] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const navigate = useNavigate();

function handleView(customer) {
  navigate(`/admin/user/${customer.id}`);
}

  const columns = [
    t('customers.table.customerId', { defaultValue: '#ID' }),
    t('customers.table.customer', { defaultValue: 'Customer' }),
    t('customers.table.email', { defaultValue: 'Email' }),
    t('customers.table.registered', { defaultValue: 'Registered' }),
    t('customers.table.status', { defaultValue: 'Status' }),
    t('customers.table.actions', { defaultValue: 'Actions' }),
  ];

  return (
    <>
      <TableContainer
        component={Paper}
        elevation={0}
        sx={(theme) => ({
          borderRadius: 0,
          borderTop: `1px solid ${theme.palette.divider}`,
          maxHeight: 'calc(100vh - 300px)',
        })}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              {columns.map((col, i) => (
                <TableCell
                  key={col}
                  align={i === columns.length - 1 ? (isRtl ? 'left' : 'right') : 'left'}
                  sx={(theme) => ({ 
                    py: 2, 
                    bgcolor: 'action.hover',
                    borderBottom: `1px solid ${theme.palette.divider}`
                  })}
                >
                  <Typography
                    variant="caption"
                    sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.8, color: 'text.secondary' }}
                  >
                    {col}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              <TableSkeleton />
            ) : customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} align="center" sx={{ py: 8 }}>
                  <Typography color="text.secondary" variant="body2" sx={{ fontWeight: 500 }}>
                    {t('customers.emptyState', { defaultValue: 'No customers match the current filters.' })}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => {
                const fullName = `${customer.first_name} ${customer.last_name}`;
                const initials = getInitials(customer.first_name, customer.last_name);
                const avatarColor = getAvatarColor(customer.id);
                const statusConfig = getStatusConfig(customer);

                return (
                  <TableRow
                    key={customer.id}
                    hover
                    sx={{ '&:last-child td': { border: 0 }, transition: 'background-color 0.2s ease' }}
                  >
                    {/* ID */}
                    <TableCell sx={{ width: 80, py: 2 }}>
                      <Typography
                        variant="caption"
                        sx={{
                          fontFamily: 'monospace',
                          fontWeight: 700,
                          color: 'text.secondary',
                          bgcolor: 'action.selected',
                          px: 1,
                          py: 0.4,
                          borderRadius: 1.5,
                        }}
                      >
                        #{customer.id}
                      </Typography>
                    </TableCell>

                    {/* Customer */}
                    <TableCell sx={{ py: 1.5 }}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          sx={{
                            width: 40,
                            height: 40,
                            fontSize: '0.85rem',
                            fontWeight: 700,
                            bgcolor: avatarColor.bg,
                            color: avatarColor.text,
                            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.03)'
                          }}
                        >
                          {initials}
                        </Avatar>
                        <Box sx={{ minWidth: 0 }}>
                          <Stack direction="row" spacing={0.5} alignItems="center">
                            <Typography variant="body2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                              {fullName}
                            </Typography>
                            {customer.is_verified && (
                              <Tooltip title={t('customers.verified', { defaultValue: 'Verified account' })}>
                                <VerifiedIcon sx={{ fontSize: 15, color: 'success.main' }} />
                              </Tooltip>
                            )}
                          </Stack>
                          <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', mt: 0.25 }}>
                            {customer.phone || '—'}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    {/* Email */}
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" color="text.primary" sx={{ fontWeight: 500 }}>
                        {customer.email || '—'}
                      </Typography>
                    </TableCell>

                    {/* Registered Date */}
                    <TableCell sx={{ py: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        {customer.created_at ? new Date(customer.created_at).toLocaleDateString() : '—'}
                      </Typography>
                    </TableCell>

                    {/* Status Toggle Switch */}
                    <TableCell sx={{ py: 2 }}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Switch
                          size="small"
                          checked={customer.is_active}
                          onChange={() => onToggleActive(customer)}
                          color="success"
                        />
                        <Chip
                          label={t(`customers.status.${statusConfig.label.toLowerCase()}`, { defaultValue: statusConfig.label })}
                          color={statusConfig.color}
                          variant="soft"
                          size="small"
                          sx={{ 
                            fontWeight: 600, 
                            borderRadius: 1.5, 
                            fontSize: '0.725rem',
                            textTransform: 'capitalize',
                            bgcolor: (theme) => `${theme.palette[statusConfig.color]?.main}12`,
                            color: (theme) => theme.palette[statusConfig.color]?.main,
                          }}
                        />
                      </Stack>
                    </TableCell>

                    {/* Actions */}
                    <TableCell align={isRtl ? 'left' : 'right'} sx={{ py: 2 }}>
                      <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                        <Tooltip title={t('customers.actions.view', { defaultValue: 'View Details' })}>
                          <IconButton size="small" onClick={() => handleView(customer)} sx={{ color: 'text.secondary' }}>
                            <VisibilityIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('customers.actions.delete', { defaultValue: 'Delete' })}>
                          <IconButton size="small" onClick={() => onDelete(customer.id)} color="error" sx={{ opacity: 0.8 }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* <CustomerDetailsModal
        open={detailsOpen}
        customer={selected}
        onClose={() => {
          setDetailsOpen(false);
          setSelected(null);
        }}
      /> */}
    </>
  );
}

export default CustomersTable;