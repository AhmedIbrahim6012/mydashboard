

import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Avatar, Box, Button, Card, CardContent, Chip, CircularProgress,
  Divider, Grid, IconButton, Rating, Skeleton, Stack, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import WorkRoundedIcon from '@mui/icons-material/WorkRounded';
import GavelRoundedIcon from '@mui/icons-material/GavelRounded';
import MiscellaneousServicesRoundedIcon from '@mui/icons-material/MiscellaneousServicesRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import LocationOnRoundedIcon from '@mui/icons-material/LocationOnRounded';
import PageHeader from '../components/PageHeader';
import ConfirmDialog from '../components/ConfirmDialog';
import CustomerRestrictionActions from '../components/customers/CustomerRestrictionActions';
import { useAppContext } from '../context/AppContext';
import { useTranslation } from 'react-i18next';
import api from '../utils/axiosInstance';

function getInitials(firstName = '', lastName = '') {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function isEmpty(value) {
  return value === null || value === undefined || value === '';
}

function formatDateTime(value) {
  if (isEmpty(value)) return '—';
  const raw = String(value);
  if (/^\d{4}-\d{2}-\d{2}/.test(raw)) return raw.replace('T', ' ').slice(0, 19);
  return raw;
}

function formatMoney(value) {
  if (isEmpty(value)) return '—';
  const number = Number(value);
  return Number.isFinite(number) ? `$${number.toFixed(2)}` : String(value);
}

function formatPercent(value) {
  if (isEmpty(value)) return '—';
  const number = Number(value);
  return Number.isFinite(number) ? `${number}` : String(value);
}

function SectionCard({ title, subtitle, icon, endAdornment, children }) {
  return (
    <Card elevation={0} sx={(theme) => ({ borderRadius: 3, border: `1px solid ${theme.palette.divider}` })}>
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          spacing={1.5}
          sx={{ mb: 2.5 }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            {icon && (
              <Box sx={{
                width: 40, height: 40, borderRadius: 2, display: 'grid', placeItems: 'center',
                bgcolor: 'action.hover', color: 'primary.main', flexShrink: 0,
              }}>
                {icon}
              </Box>
            )}
            <Box>
              <Typography variant="subtitle2" fontWeight={800}>{title}</Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
              )}
            </Box>
          </Stack>
          {endAdornment}
        </Stack>
        {children}
      </CardContent>
    </Card>
  );
}

function InfoField({ label, value }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, mt: 0.3, wordBreak: 'break-word' }}>
        {isEmpty(value) ? '—' : String(value)}
      </Typography>
    </Box>
  );
}

function EmptyState({ icon, title, description }) {
  return (
    <Stack alignItems="center" spacing={1} sx={{ py: 4, textAlign: 'center' }}>
      <Box sx={{ color: 'text.disabled' }}>{icon}</Box>
      <Typography variant="body2" fontWeight={700}>{title}</Typography>
      <Typography variant="caption" color="text.secondary">{description}</Typography>
    </Stack>
  );
}

function ProviderProfilePage() {
  const { ProviderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || '/Providers';
  const { notify, activateProvider, deactivateProvider, deleteProvider } = useAppContext();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  const [provider, setProvider] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(null); // 'activate' | 'deactivate' | 'delete' | null

  const loadProvider = useCallback(() => {
    setLoading(true);
    setError(null);
    api.get(`/admin/provider/providers/${ProviderId}`)
      .then((res) => setProvider(res.data.data))
      .catch((err) => setError(err.message || 'Failed to load provider'))
      .finally(() => setLoading(false));
  }, [ProviderId]);

  useEffect(() => { loadProvider(); }, [loadProvider]);

  async function handleActivate() {
    setLoadingAction('activate');
    try {
      await activateProvider(provider.provider.id);
      setProvider((prev) => ({ ...prev, provider: { ...prev.provider, is_active: true } }));
      notify({ severity: 'success', message: 'Provider activated successfully' });
    } catch (err) {
      notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to activate' });
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleDeactivate() {
    setLoadingAction('deactivate');
    try {
      await deactivateProvider(provider.provider.id);
      setProvider((prev) => ({ ...prev, provider: { ...prev.provider, is_active: false } }));
      notify({ severity: 'success', message: 'Provider deactivated successfully' });
    } catch (err) {
      notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to deactivate' });
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleDelete() {
    setLoadingAction('delete');
    try {
      await deleteProvider(provider.provider.id);
      notify({ severity: 'success', message: 'Provider deleted successfully' });
      navigate(returnTo);
    } catch (err) {
      notify({ severity: 'error', message: err?.response?.data?.message || 'Failed to delete' });
    } finally {
      setLoadingAction(null);
      setDeleteOpen(false);
    }
  }

  if (loading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={60} />
        <Skeleton variant="rounded" height={220} />
        <Skeleton variant="rounded" height={160} />
      </Stack>
    );
  }

  if (error || !provider) {
    return (
      <Stack spacing={2} alignItems="center" sx={{ py: 6 }}>
        <Typography color="error">{error || t('Providers.profile.notFound', { defaultValue: 'Provider not found' })}</Typography>
        <Button onClick={() => navigate(returnTo)}>{t('common.back', { defaultValue: 'Back' })}</Button>
      </Stack>
    );
  }

  const {
    provider: p = {},
    addresses = [],
    services = [],
    category = null,
    reviews = [],
  } = provider;

  const addressesList = Array.isArray(addresses) ? addresses : [];
  const servicesList = Array.isArray(services) ? services : [];
  const reviewsList = Array.isArray(reviews) ? reviews : [];
  const providerName = `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Provider';
  const ratingValue = Number(p.rating) || 0;
  const commissionValue = category?.commission ?? p.commission;

  return (
    <Stack spacing={3} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={2}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton onClick={() => navigate(returnTo)}>
            <ArrowBackIcon sx={{ transform: isRtl ? 'rotate(180deg)' : 'none' }} />
          </IconButton>
          <PageHeader
            title={providerName}
            subtitle={t('Providers.profile.subtitle', { defaultValue: 'Provider details' })}
          />
        </Stack>

        <Stack direction="row" spacing={1.2}>
          {p.is_active ? (
            <Button
              startIcon={loadingAction === 'deactivate' ? <CircularProgress size={16} /> : <BlockRoundedIcon />}
              variant="outlined" color="error"
              disabled={loadingAction === 'deactivate'}
              onClick={handleDeactivate}
            >
              {t('Providers.actions.deactivate', { defaultValue: 'Deactivate' })}
            </Button>
          ) : (
            <Button
              startIcon={loadingAction === 'activate' ? <CircularProgress size={16} /> : <CheckCircleRoundedIcon />}
              variant="outlined" color="success"
              disabled={loadingAction === 'activate'}
              onClick={handleActivate}
            >
              {t('Providers.actions.activate', { defaultValue: 'Activate' })}
            </Button>
          )}

          <Button
            startIcon={loadingAction === 'delete' ? <CircularProgress size={16} /> : <DeleteOutlineRoundedIcon />}
            variant="contained" color="error"
            disabled={loadingAction === 'delete'}
            onClick={() => setDeleteOpen(true)}
          >
            {t('Providers.actions.delete', { defaultValue: 'Delete' })}
          </Button>
        </Stack>
      </Stack>

      {/* Main info card */}
      <Card elevation={0} sx={(theme) => ({ borderRadius: 3, border: `1px solid ${theme.palette.divider}` })}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm="auto">
              <Avatar src={p.image_url || undefined} sx={{ width: 96, height: 96, fontSize: '1.8rem', fontWeight: 700 }}>
                {getInitials(p.first_name, p.last_name)}
              </Avatar>
            </Grid>
            <Grid item xs={12} sm>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                  <Typography variant="h6" fontWeight={800}>{providerName}</Typography>
                  <Chip
                    label={p.is_active
                      ? t('Providers.status.active', { defaultValue: 'Active' })
                      : t('Providers.status.inactive', { defaultValue: 'Inactive' })}
                    color={p.is_active ? 'success' : 'default'}
                    size="small"
                  />
                  <Chip
                    label={p.is_available
                      ? t('Providers.status.available', { defaultValue: 'Available' })
                      : t('Providers.status.unavailable', { defaultValue: 'Unavailable' })}
                    color={p.is_available ? 'info' : 'default'}
                    variant="outlined"
                    size="small"
                  />
                </Stack>

                <Typography variant="body2" color="text.secondary">{p.email}</Typography>
                <Typography variant="body2" color="text.secondary">{p.phone}</Typography>

                <Stack direction="row" spacing={0.5} alignItems="center">
                  <Rating value={ratingValue} precision={0.1} readOnly size="small" />
                  <Typography variant="caption" color="text.secondary">
                    {ratingValue.toFixed(1)} · {p.rating_count ?? 0} {t('Providers.card.reviews', { defaultValue: 'reviews' })}
                  </Typography>
                </Stack>

                <Typography variant="caption" color="text.secondary">
                  {t('customers.details.registeredAt', { defaultValue: 'Registered at' })}: {formatDateTime(p.created_at)}
                </Typography>
              </Stack>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={2}>
            <Grid item xs={6} sm={3}>
              <InfoField label={t('Providers.profile.fields.experience', { defaultValue: 'Experience' })} value={`${p.experience_years ?? '—'} ${t('Providers.card.years', { defaultValue: 'yrs' })}`} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <InfoField label={t('Providers.profile.fields.commission', { defaultValue: 'Commission' })} value={formatPercent(commissionValue)} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <InfoField label={t('Providers.profile.services', { defaultValue: 'Services' })} value={servicesList.length} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <InfoField label={t('Providers.profile.fields.updatedAt', { defaultValue: 'Updated At' })} value={formatDateTime(p.updated_at)} />
            </Grid>
          </Grid>

          {p.description && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                {t('Providers.profile.description', { defaultValue: 'Description' })}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, whiteSpace: 'pre-wrap' }}>
                {p.description}
              </Typography>
            </>
          )}
        </CardContent>
      </Card>

      {/* Category */}
      <SectionCard
        title={t('Providers.profile.categoryDetails', { defaultValue: 'Category' })}
        subtitle={t('Providers.profile.categorySubtitle', { defaultValue: 'Assigned service category' })}
        icon={<WorkRoundedIcon />}
      >
        {category ? (
          <Grid container spacing={2}>
            <Grid item xs={6} sm={4}><InfoField label={t('Providers.profile.fields.category', { defaultValue: 'Category' })} value={category.name} /></Grid>
            <Grid item xs={6} sm={4}><InfoField label={t('Providers.profile.fields.commission', { defaultValue: 'Commission' })} value={formatPercent(category.commission)} /></Grid>
            <Grid item xs={6} sm={4}>
              <InfoField
                label={t('customers.table.status', { defaultValue: 'Status' })}
                value={category.is_active
                  ? t('Providers.status.active', { defaultValue: 'Active' })
                  : t('Providers.status.inactive', { defaultValue: 'Inactive' })}
              />
            </Grid>
          </Grid>
        ) : (
          <EmptyState
            icon={<WorkRoundedIcon />}
            title={t('Providers.profile.noCategory', { defaultValue: 'No category data' })}
            description={t('Providers.profile.noCategoryHint', { defaultValue: 'No category information was returned from the backend.' })}
          />
        )}
      </SectionCard>

      {/* Addresses (array — a provider can have more than one) */}
      <SectionCard
        title={t('Providers.profile.address', { defaultValue: 'Addresses' })}
        subtitle={t('Providers.profile.addressSubtitle', { defaultValue: 'Registered location data' })}
        icon={<LocationOnRoundedIcon />}
        endAdornment={
          <Chip label={addressesList.length} size="small" sx={{ fontWeight: 800 }} />
        }
      >
        {addressesList.length > 0 ? (
          <Stack spacing={2} divider={<Divider />}>
            {addressesList.map((addr) => (
              <Box key={addr.id}>
                <Typography variant="body2" fontWeight={700} sx={{ mb: 1 }}>
                  {addr.title || addr.display_address || `${addr.city || ''}, ${addr.country || ''}`}
                </Typography>
                <Grid container spacing={1.5}>
                  <Grid item xs={6} sm={3}><InfoField label={t('Providers.profile.fields.country', { defaultValue: 'Country' })} value={addr.country} /></Grid>
                  <Grid item xs={6} sm={3}><InfoField label={t('Providers.profile.fields.city', { defaultValue: 'City' })} value={addr.city} /></Grid>
                  <Grid item xs={6} sm={3}><InfoField label={t('Providers.profile.fields.area', { defaultValue: 'Area' })} value={addr.area} /></Grid>
                  {addr.street && <Grid item xs={6} sm={3}><InfoField label={t('Providers.profile.fields.street', { defaultValue: 'Street' })} value={addr.street} /></Grid>}
                  {addr.building && <Grid item xs={6} sm={3}><InfoField label={t('Providers.profile.fields.building', { defaultValue: 'Building' })} value={addr.building} /></Grid>}
                  {addr.floor && <Grid item xs={6} sm={3}><InfoField label={t('Providers.profile.fields.floor', { defaultValue: 'Floor' })} value={addr.floor} /></Grid>}
                  {addr.apartment && <Grid item xs={6} sm={3}><InfoField label={t('Providers.profile.fields.apartment', { defaultValue: 'Apt.' })} value={addr.apartment} /></Grid>}
                </Grid>
              </Box>
            ))}
          </Stack>
        ) : (
          <EmptyState
            icon={<LocationOnRoundedIcon />}
            title={t('Providers.profile.noAddress', { defaultValue: 'No address data' })}
            description={t('Providers.profile.noAddressHint', { defaultValue: 'No address information was returned from the backend.' })}
          />
        )}
      </SectionCard>

      {/* Services */}
      <SectionCard
        title={t('Providers.profile.services', { defaultValue: 'Services' })}
        subtitle={t('Providers.profile.servicesSubtitle', { defaultValue: 'All services registered by this provider' })}
        icon={<MiscellaneousServicesRoundedIcon />}
        endAdornment={<Chip label={servicesList.length} size="small" sx={{ fontWeight: 800 }} />}
      >
        {servicesList.length > 0 ? (
          <TableContainer component={Paper} elevation={0} sx={(theme) => ({ border: `1px solid ${theme.palette.divider}`, borderRadius: 2 })}>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ bgcolor: 'action.hover' }}>
                  <TableCell sx={{ fontWeight: 800 }}>#</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>{t('Providers.table.title', { defaultValue: 'Title' })}</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>{t('Providers.table.description', { defaultValue: 'Description' })}</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>{t('Providers.table.price', { defaultValue: 'Price' })}</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>{t('customers.table.status', { defaultValue: 'Status' })}</TableCell>
                  <TableCell sx={{ fontWeight: 800 }}>{t('Providers.table.createdAt', { defaultValue: 'Created At' })}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {servicesList.map((svc, index) => (
                  <TableRow key={svc.id || index} hover>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{svc.title || '—'}</TableCell>
                    <TableCell sx={{ maxWidth: 320 }}>
                      <Typography variant="body2" color="text.secondary" noWrap>{svc.description || '—'}</Typography>
                    </TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>{formatMoney(svc.price)}</TableCell>
                    <TableCell>
                      <Chip
                        label={svc.is_active ? t('Providers.status.active', { defaultValue: 'Active' }) : t('Providers.status.inactive', { defaultValue: 'Inactive' })}
                        color={svc.is_active ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDateTime(svc.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <EmptyState
            icon={<MiscellaneousServicesRoundedIcon />}
            title={t('Providers.profile.noServices', { defaultValue: 'No services yet' })}
            description={t('Providers.profile.noServicesHint', { defaultValue: 'No service records were returned from the backend.' })}
          />
        )}
      </SectionCard>

      {/* Reviews */}
      <SectionCard
        title={t('Providers.profile.reviews', { defaultValue: 'Reviews' })}
        subtitle={t('Providers.profile.reviewsSubtitle', { defaultValue: 'Customer feedback for this provider' })}
        icon={<StarRoundedIcon />}
        endAdornment={<Chip label={reviewsList.length} size="small" sx={{ fontWeight: 800 }} />}
      >
        {reviewsList.length > 0 ? (
          <Stack spacing={2} divider={<Divider />}>
            {reviewsList.map((review) => (
              <Box key={review.id}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 0.5 }}>
                  <Rating value={review.stars ?? 0} readOnly size="small" />
                  <Typography variant="caption" color="text.secondary">
                    {formatDateTime(review.created_at)}
                  </Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  {review.comment || '—'}
                </Typography>
              </Box>
            ))}
          </Stack>
        ) : (
          <EmptyState
            icon={<StarRoundedIcon />}
            title={t('Providers.profile.noReviews', { defaultValue: 'No reviews yet' })}
            description={t('Providers.profile.noReviewsHint', { defaultValue: 'No review records were returned from the backend.' })}
          />
        )}
      </SectionCard>

      {/* Restrictions */}
      <SectionCard
        title={t('Providers.profile.restrictions', { defaultValue: 'Account Restrictions' })}
        subtitle={t('Providers.profile.restrictionsSubtitle', { defaultValue: 'Ban, suspend, limit, or warn this provider' })}
        icon={<GavelRoundedIcon />}
      >
        <CustomerRestrictionActions accountId={p.id} accountType="provider" />
      </SectionCard>

      <ConfirmDialog
        open={deleteOpen}
        title={t('Providers.confirm.title', { defaultValue: 'Delete Provider' })}
        description={t('Providers.profile.deleteConfirm', {
          defaultValue: `Are you sure you want to delete ${p.first_name} ${p.last_name}?`,
          name: `${p.first_name} ${p.last_name}`,
        })}
        confirmLabel={t('common.delete', { defaultValue: 'Delete' })}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
      />
    </Stack>
  );
}

export default ProviderProfilePage;