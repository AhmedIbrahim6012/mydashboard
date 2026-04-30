import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Paper,
  Typography,
  Stack,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ConfirmDialog from '../ConfirmDialog';
import { useState } from 'react';
import CustomerDetailsModal from './CustomerDetailsModal';

function CustomersTable({ customers, onDelete }) {
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

  function handleConfirmDelete() {
    onDelete(selected.id);
    setConfirmOpen(false);
    setSelected(null);
  }

  return (
    <>
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: (theme) => `1px solid ${theme.palette.divider}` }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Full Name
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Phone Number
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Email
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Account Balance
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Registered
                </Typography>
              </TableCell>
              <TableCell align="right">
                <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                  Actions
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((c) => (
              <TableRow key={c.id} hover>
                <TableCell>{c.fullName}</TableCell>
                <TableCell>{c.phone}</TableCell>
                <TableCell>{c.email || '—'}</TableCell>
                <TableCell>${Number(c.balance || 0).toFixed(2)}</TableCell>
                <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <IconButton size="small" onClick={() => handleView(c)}>
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error" onClick={() => handleDeleteClick(c)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete customer"
        description={`Are you sure you want to delete ${selected?.fullName || 'this customer'}?`}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <CustomerDetailsModal open={detailsOpen} customer={selected} onClose={() => setDetailsOpen(false)} />
    </>
  );
}

export default CustomersTable;