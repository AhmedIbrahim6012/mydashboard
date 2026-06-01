import { Avatar, Box, Chip, Dialog, DialogContent, DialogTitle, Divider, Stack, Typography } from '@mui/material';
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

function CustomerDetailsModal({ open, customer, onClose }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const locale = i18n.language === 'ar' ? 'ar-EG' : 'en-US';

  if (!customer) return null;

  const status = getCustomerStatus(customer);
  const statusLabel = t(`customers.status.${status}`, { defaultValue: status });

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
      <DialogTitle sx={{ pb: 1 }}>{t('customers.details.title')}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ py: 1, textAlign: isRtl ? 'right' : 'left' }}>
          <Box
            sx={(theme) => ({
              p: 2,
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              background: `linear-gradient(135deg, ${theme.palette.background.paper}, ${theme.palette.action.hover})`,
            })}
          >
            <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flexDirection: isRtl ? 'row-reverse' : 'row' }}>
              <Avatar sx={{ width: 56, height: 56, fontWeight: 800, bgcolor: 'primary.light', color: 'primary.dark' }}>{customer.fullName.slice(0, 1)}</Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>
                  {customer.fullName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {customer.id}
                </Typography>
              </Box>
              <Chip size="small" label={statusLabel} color={status === 'inactive' ? 'default' : status === 'pending' ? 'warning' : status === 'confirmed' ? 'success' : 'primary'} />
            </Stack>
          </Box>

          <Divider />

          <Stack spacing={1.75}>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t('customers.details.phone')}
              </Typography>
              <Typography sx={{ fontWeight: 700 }}>{customer.phone}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t('customers.details.email')}
              </Typography>
              <Typography>{customer.email || '—'}</Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t('customers.details.balance')}
              </Typography>
              <Typography sx={{ fontWeight: 800, fontSize: '1.25rem' }}>
                {Number(customer.balance || 0).toLocaleString(locale, { style: 'currency', currency: 'USD' })}
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                {t('customers.details.registered')}
              </Typography>
              <Typography>{new Date(customer.createdAt).toLocaleString(locale)}</Typography>
            </Box>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default CustomerDetailsModal;