import { Dialog, DialogTitle, DialogContent, Stack, Typography, Box } from '@mui/material';

function CustomerDetailsModal({ open, customer, onClose }) {
  if (!customer) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Customer details</DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ py: 1 }}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Full name
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              {customer.fullName}
            </Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Phone
            </Typography>
            <Typography>{customer.phone}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Email
            </Typography>
            <Typography>{customer.email || '—'}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Account balance
            </Typography>
            <Typography sx={{ fontWeight: 700 }}>${customer.balance?.toFixed(2) || '0.00'}</Typography>
          </Box>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Registered
            </Typography>
            <Typography>{new Date(customer.createdAt).toLocaleString()}</Typography>
          </Box>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default CustomerDetailsModal;