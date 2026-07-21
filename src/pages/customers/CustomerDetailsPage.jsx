import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Avatar, Box, Button, Card, CardContent, Chip, CircularProgress,
  Divider, Grid, IconButton, Rating, Skeleton, Stack, Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import VerifiedIcon from '@mui/icons-material/Verified';
import PageHeader from '../../components/PageHeader';
import { fetchCustomerDetails, fetchCustomerReviews } from '../../services/customersService';
import { useTranslation } from 'react-i18next';
import CustomerRestrictionActions from '../../components/customers/CustomerRestrictionActions';
function getInitials(firstName = '', lastName = '') {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function CustomerDetailsPage() {
  const { id } = useParams();
  const customerId = Number(id);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [reviews, setReviews] = useState([]);
  const [reviewsPage, setReviewsPage] = useState(1);
  const [reviewsLastPage, setReviewsLastPage] = useState(1);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchCustomerDetails(id)
      .then((data) => { if (active) setCustomer(data); })
      .catch((err) => { if (active) setError(err.message || 'Failed to load customer'); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const loadReviews = useCallback(async (pageNumber) => {
    setReviewsLoading(true);
    try {
      const result = await fetchCustomerReviews(id, pageNumber);
      setReviews((prev) => (pageNumber === 1 ? result.data : [...prev, ...result.data]));
      setReviewsLastPage(result.last_page);
      setReviewsPage(result.current_page);
    } catch (err) {
      console.error('Failed to load reviews', err);
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  useEffect(() => { loadReviews(1); }, [loadReviews]);

  const handleLoadMore = () => {
    if (reviewsPage < reviewsLastPage && !reviewsLoading) loadReviews(reviewsPage + 1);
  };

  if (loading) {
    return (
      <Stack spacing={2}>
        <Skeleton variant="rounded" height={60} />
        <Skeleton variant="rounded" height={200} />
      </Stack>
    );
  }

  if (error || !customer) {
    return (
      <Stack spacing={2} alignItems="center" sx={{ py: 6 }}>
        <Typography color="error">{error || 'Customer not found'}</Typography>
        <Button onClick={() => navigate(-1)}>{t('common.back', { defaultValue: 'Back' })}</Button>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={1} alignItems="center">
        <IconButton onClick={() => navigate(-1)}><ArrowBackIcon /></IconButton>
        <PageHeader
          title={`${customer.first_name} ${customer.last_name}`}
          subtitle={t('customers.details.subtitle', { defaultValue: 'Customer details' })}
        />
      </Stack>

      <Card elevation={0} sx={(theme) => ({ borderRadius: 3, border: `1px solid ${theme.palette.divider}` })}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm="auto">
              <Avatar src={customer.image_url || undefined} sx={{ width: 96, height: 96, fontSize: '1.8rem', fontWeight: 700 }}>
                {getInitials(customer.first_name, customer.last_name)}
              </Avatar>
            </Grid>
            <Grid item xs={12} sm>
              <Stack spacing={1.5}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography variant="h6" fontWeight={800}>
                    {customer.first_name} {customer.last_name}
                  </Typography>
                  {customer.is_verified && <VerifiedIcon color="success" fontSize="small" />}
                  <Chip
                    label={customer.is_active ? t('customers.status.active', { defaultValue: 'Active' }) : t('customers.status.inactive', { defaultValue: 'Inactive' })}
                    color={customer.is_active ? 'success' : 'default'}
                    size="small"
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">{customer.email}</Typography>
                <Typography variant="body2" color="text.secondary">{customer.phone}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {t('customers.details.registeredAt', { defaultValue: 'Registered at' })}: {new Date(customer.created_at).toLocaleDateString()}
                </Typography>
              </Stack>
            </Grid>
          </Grid>

          {customer.addresses?.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1.5 }}>
                {t('customers.details.addresses', { defaultValue: 'Addresses' })}
              </Typography>
              <Stack spacing={1}>
                {customer.addresses.map((addr) => (
                  <Typography key={addr.id} variant="body2" color="text.secondary">
                    {addr.country} - {addr.city} - {addr.area}
                  </Typography>
                ))}
              </Stack>
            </>
          )}
        </CardContent>
      </Card>
<Card elevation={0} sx={(theme) => ({ borderRadius: 3, border: `1px solid ${theme.palette.divider}` })}>
  <CardContent sx={{ p: 3 }}>
<Typography variant="subtitle2" fontWeight={800} sx={{ mb: 2 }}>
  Account Restrictions
</Typography>
<CustomerRestrictionActions accountId={customer.id} accountType="user" />  </CardContent>
</Card>
      <Card elevation={0} sx={(theme) => ({ borderRadius: 3, border: `1px solid ${theme.palette.divider}` })}>
        <CardContent sx={{ p: 3 }}>
          <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 2 }}>
            {t('customers.details.reviews', { defaultValue: 'Reviews' })}
          </Typography>

          {reviews.length === 0 && !reviewsLoading ? (
            <Typography variant="body2" color="text.secondary">
              {t('customers.details.noReviews', { defaultValue: 'No reviews yet' })}
            </Typography>
          ) : (
            <Stack spacing={2} divider={<Divider />}>
              {reviews.map((review) => (
                <Stack key={review.id} direction="row" spacing={2}>
                  <Avatar src={review.provider?.image_url || undefined} sx={{ width: 40, height: 40 }}>
                    {review.provider?.name?.charAt(0)}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" fontWeight={700}>{review.provider?.name}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(review.created_at).toLocaleDateString()}
                      </Typography>
                    </Stack>
                    <Rating value={review.stars} readOnly size="small" sx={{ my: 0.5 }} />
                    <Typography variant="body2" color="text.secondary">{review.comment}</Typography>
                  </Box>
                </Stack>
              ))}
            </Stack>
          )}

          {reviewsPage < reviewsLastPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Button onClick={handleLoadMore} disabled={reviewsLoading} variant="outlined">
                {reviewsLoading ? <CircularProgress size={20} /> : t('common.loadMore', { defaultValue: 'Load more' })}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>
    </Stack>
  );
}

export default CustomerDetailsPage;