import {
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogContent,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { useTranslation } from 'react-i18next';

function getInitials(firstName = '', lastName = '') {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function getStatusConfig(customer) {
  if (customer.is_active && customer.is_verified) {
    return { label: 'Active', color: 'success' };
  }
  if (customer.is_active && !customer.is_verified) {
    return { label: 'Pending', color: 'warning' };
  }
  if (!customer.is_active && customer.is_verified) {
    return { label: 'Suspended', color: 'error' };
  }
  return { label: 'Inactive', color: 'default' };
}

function DetailRow({ icon, label, value, mono = false }) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Box
        sx={(theme) => ({
          p: 1,
          borderRadius: 2,
          bgcolor: 'action.hover',
          color: 'text.secondary',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          border: `1px solid ${theme.palette.divider}`,
        })}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.8, display: 'block' }}>
          {label}
        </Typography>
        <Typography
          variant="body2"
          noWrap
          sx={{ fontWeight: 600, mt: 0.25, color: 'text.primary', ...(mono && { fontFamily: 'monospace', fontSize: '0.85rem' }) }}
        >
          {value || '—'}
        </Typography>
      </Box>
    </Stack>
  );
}

function CustomerDetailsModal({ open, customer, onClose }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'ar' ? 'ar-EG' : 'en-US';

  if (!customer) return null;

  const fullName = `${customer.first_name} ${customer.last_name}`;
  const initials = getInitials(customer.first_name, customer.last_name);
  const statusConfig = getStatusConfig(customer);

  const createdDate = customer.created_at
    ? new Date(customer.created_at).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3.5,
          overflow: 'hidden',
          boxShadow: '0 24px 48px -12px rgba(0,0,0,0.15)'
        },
      }}
    >
      {/* Header strip */}
      <Box
        sx={(theme) => ({
          px: 3,
          pt: 4,
          pb: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}10, ${theme.palette.primary.light}05)`,
          borderBottom: `1px solid ${theme.palette.divider}`,
          position: 'relative',
        })}
      >
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ position: 'absolute', top: 16, right: 16, bgcolor: 'background.paper', border: '1px solid', borderColor: 'divider' }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Stack direction="row" spacing={2.5} alignItems="center">
          <Avatar
            sx={{
              width: 64,
              height: 64,
              fontWeight: 800,
              fontSize: '1.25rem',
              bgcolor: 'primary.main',
              color: 'primary.contrastText',
              boxShadow: '0 8px 16px -4px rgba(33, 150, 243, 0.3)',
            }}
          >
            {initials}
          </Avatar>

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Stack direction="row" spacing={0.8} alignItems="center" flexWrap="wrap">
              <Typography
                variant="h6"
                sx={{ fontWeight: 800, lineHeight: 1.2, color: 'text.primary' }}
                noWrap
              >
                {fullName}
              </Typography>
              {customer.is_verified && (
                <VerifiedUserIcon sx={{ fontSize: 18, color: 'success.main' }} />
              )}
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.8 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace', bgcolor: 'action.hover', px: 1, py: 0.2, borderRadius: 1 }}>
                #{customer.id}
              </Typography>
              <Chip
                label={t(`customers.status.${statusConfig.label.toLowerCase()}`, { defaultValue: statusConfig.label })}
                color={statusConfig.color}
                size="small"
                sx={{ height: 22, fontSize: '0.7rem', fontWeight: 700, borderRadius: 1.5 }}
              />
            </Stack>
          </Box>
        </Stack>
      </Box>

      <DialogContent sx={{ p: 3, mt: 1 }}>
        <Stack spacing={2.5}>
          <DetailRow
            icon={<PhoneIcon sx={{ fontSize: 18 }} />}
            label={t('customers.details.phone', { defaultValue: 'Phone' })}
            value={customer.phone}
            mono
          />

          <Divider sx={{ borderStyle: 'dashed' }} />

          <DetailRow
            icon={<EmailIcon sx={{ fontSize: 18 }} />}
            label={t('customers.details.email', { defaultValue: 'Email' })}
            value={customer.email}
          />

          <Divider sx={{ borderStyle: 'dashed' }} />

          <DetailRow
            icon={<CalendarTodayIcon sx={{ fontSize: 18 }} />}
            label={t('customers.details.registered', { defaultValue: 'Registered' })}
            value={createdDate}
          />

          <Divider sx={{ borderStyle: 'dashed', mb: 1 }} />

          {/* Status flags */}
          <Stack direction="row" spacing={2}>
            <Box
              sx={(theme) => ({
                flex: 1,
                p: 2,
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: 'background.paper',
                textAlign: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.01)'
              })}
            >
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                {t('customers.details.accountStatus', { defaultValue: 'Account' })}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: customer.is_active ? 'success.main' : 'error.main' }}
              >
                {customer.is_active
                  ? t('customers.details.active', { defaultValue: 'Active' })
                  : t('customers.details.inactive', { defaultValue: 'Inactive' })}
              </Typography>
            </Box>

            <Box
              sx={(theme) => ({
                flex: 1,
                p: 2,
                borderRadius: 2.5,
                border: `1px solid ${theme.palette.divider}`,
                bgcolor: 'background.paper',
                textAlign: 'center',
                boxShadow: '0 2px 6px rgba(0,0,0,0.01)'
              })}
            >
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: 'block', mb: 0.5 }}>
                {t('customers.details.verification', { defaultValue: 'Verification' })}
              </Typography>
              <Typography
                variant="body2"
                sx={{ fontWeight: 700, color: customer.is_verified ? 'success.main' : 'warning.main' }}
              >
                {customer.is_verified
                  ? t('customers.details.verified', { defaultValue: 'Verified' })
                  : t('customers.details.unverified', { defaultValue: 'Unverified' })}
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}

export default CustomerDetailsModal;