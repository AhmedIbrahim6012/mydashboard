import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  Checkbox,
  FormControlLabel,
  MenuItem,
  Stack,
  Slider,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import SearchIcon from '@mui/icons-material/Search';
import PageHeader from '../../components/PageHeader';
import CustomersTable from '../../components/customers/CustomersTable';
import { useAppContext } from '../../context/AppContext';
import { useTranslation } from 'react-i18next';

const FILTERS = ['all', 'active', 'pending', 'confirmed', 'inactive'];

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

function CustomersPage() {
  const { customers, deleteCustomer, addCustomer } = useAppContext();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [advancedFiltersOpen, setAdvancedFiltersOpen] = useState(false);
  const [emailPresenceFilter, setEmailPresenceFilter] = useState('all');
  const [positiveBalanceOnly, setPositiveBalanceOnly] = useState(false);
  const [minimumBalance, setMinimumBalance] = useState(0);

  const enrichedCustomers = useMemo(
    () =>
      customers.map((customer) => ({
        ...customer,
        status: getCustomerStatus(customer),
      })),
    [customers],
  );

  const filterCounts = useMemo(
    () => ({
      all: enrichedCustomers.length,
      active: enrichedCustomers.filter((customer) => customer.status === 'active').length,
      pending: enrichedCustomers.filter((customer) => customer.status === 'pending').length,
      confirmed: enrichedCustomers.filter((customer) => customer.status === 'confirmed').length,
      inactive: enrichedCustomers.filter((customer) => customer.status === 'inactive').length,
    }),
    [enrichedCustomers],
  );

  const maximumBalance = useMemo(() => {
    return Math.max(0, ...enrichedCustomers.map((customer) => Number(customer.balance || 0)));
  }, [enrichedCustomers]);

  const filteredCustomers = useMemo(() => {
    const lowerSearch = search.trim().toLowerCase();

    return enrichedCustomers.filter((customer) => {
      const matchesSearch =
        !lowerSearch ||
        customer.fullName.toLowerCase().includes(lowerSearch) ||
        customer.phone.toLowerCase().includes(lowerSearch) ||
        String(customer.id || '').toLowerCase().includes(lowerSearch) ||
        String(customer.email || '').toLowerCase().includes(lowerSearch);
      const matchesStatus = statusFilter === 'all' || customer.status === statusFilter;
      const matchesEmailPresence =
        emailPresenceFilter === 'all' ||
        (emailPresenceFilter === 'with-email' && Boolean(customer.email)) ||
        (emailPresenceFilter === 'without-email' && !customer.email);
      const matchesBalanceThreshold = Number(customer.balance || 0) >= minimumBalance;
      const matchesPositiveBalanceOnly = !positiveBalanceOnly || Number(customer.balance || 0) > 0;

      return matchesSearch && matchesStatus && matchesEmailPresence && matchesBalanceThreshold && matchesPositiveBalanceOnly;
    });
  }, [emailPresenceFilter, enrichedCustomers, minimumBalance, positiveBalanceOnly, search, statusFilter]);

  const summaryCards = useMemo(() => {
    const activeCount = enrichedCustomers.filter((customer) => customer.status === 'active').length;
    const pendingCount = enrichedCustomers.filter((customer) => customer.status === 'pending').length;
    const inactiveCount = enrichedCustomers.filter((customer) => customer.status === 'inactive').length;
    const totalBalance = enrichedCustomers.reduce((sum, customer) => sum + Number(customer.balance || 0), 0);

    return [
      {
        label: t('customers.summary.totalCustomers', { defaultValue: 'All customers' }),
        value: enrichedCustomers.length,
        helper: t('customers.summary.totalCustomersHelp', { defaultValue: 'Registered accounts' }),
      },
      {
        label: t('customers.summary.active', { defaultValue: 'Active' }),
        value: activeCount,
        helper: t('customers.summary.activeHelp', { defaultValue: 'With email and balance' }),
      },
      {
        label: t('customers.summary.pending', { defaultValue: 'Pending' }),
        value: pendingCount,
        helper: t('customers.summary.pendingHelp', { defaultValue: 'Needs follow-up' }),
      },
      {
        label: t('customers.summary.totalBalance', { defaultValue: 'Total balance' }),
        value: totalBalance.toLocaleString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', { style: 'currency', currency: 'USD' }),
        helper: t('customers.summary.totalBalanceHelp', { defaultValue: 'Combined account value' }),
      },
      {
        label: t('customers.summary.inactive', { defaultValue: 'Inactive' }),
        value: inactiveCount,
        helper: t('customers.summary.inactiveHelp', { defaultValue: 'No email on file' }),
      },
    ];
  }, [enrichedCustomers, i18n.language, t]);

  function handleDelete(id) {
    deleteCustomer(id);
  }

  function handleAddSample() {
    addCustomer({ fullName: 'New Customer', phone: '+1 (000) 000-0000', email: null, balance: 0 });
  }

  function clearAdvancedFilters() {
    setEmailPresenceFilter('all');
    setPositiveBalanceOnly(false);
    setMinimumBalance(0);
  }

  function handleExport() {
    const csvRows = [
      ['Customer ID', 'Full Name', 'Phone', 'Email', 'Balance', 'Registered'],
      ...filteredCustomers.map((customer) => [
        customer.id,
        customer.fullName,
        customer.phone,
        customer.email || '',
        Number(customer.balance || 0),
        customer.createdAt,
      ]),
    ];

    const csv = csvRows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'customers-export.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Stack spacing={3} dir={isRtl ? 'rtl' : 'ltr'}>
      <PageHeader
        title={t('customers.title')}
        subtitle={t('customers.subtitle')}
        actions={
          <Button startIcon={<AddIcon />} onClick={handleAddSample} variant="contained" size="large">
            {t('customers.addSample')}
          </Button>
        }
      />

      <Grid container spacing={2.25}>
        {summaryCards.map((card) => (
          <Grid key={card.label} item xs={12} sm={6} lg={4} xl={3}>
            <Card
              elevation={0}
              sx={(theme) => ({
                borderRadius: 4,
                border: `1px solid ${theme.palette.divider}`,
                background: `linear-gradient(180deg, ${theme.palette.background.paper}, ${theme.palette.action.hover})`,
              })}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Stack spacing={0.75}>
                  <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                    {card.label}
                  </Typography>
                  <Typography variant="h4" sx={{ fontWeight: 900, letterSpacing: '-0.03em' }}>
                    {card.value}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.helper}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ rowGap: 1 }}>
        {FILTERS.map((filter) => {
          const isSelected = statusFilter === filter;

          const labelMap = {
            all: t('customers.filters.all', { defaultValue: 'All ({{count}})', count: filterCounts.all }),
            active: `${t('customers.status.active', { defaultValue: 'Active' })} (${filterCounts.active})`,
            pending: `${t('customers.status.pending', { defaultValue: 'Pending' })} (${filterCounts.pending})`,
            confirmed: `${t('customers.status.confirmed', { defaultValue: 'Confirmed' })} (${filterCounts.confirmed})`,
            inactive: `${t('customers.status.inactive', { defaultValue: 'Inactive' })} (${filterCounts.inactive})`,
          };

          return (
            <Chip
              key={filter}
              label={labelMap[filter]}
              onClick={() => setStatusFilter(filter)}
              clickable
              color={isSelected ? 'primary' : 'default'}
              variant={isSelected ? 'filled' : 'outlined'}
              sx={{ borderRadius: 999, fontWeight: 700 }}
            />
          );
        })}
      </Stack>

      <Card elevation={0} sx={(theme) => ({ borderRadius: 4, border: `1px solid ${theme.palette.divider}`, overflow: 'hidden' })}>
        <CardContent sx={{ p: { xs: 2, md: 3 } }}>
          <Stack spacing={2.5}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} lg={7}>
                <TextField
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={t('customers.searchPlaceholder', { defaultValue: 'Search by customer, email, or phone...' })}
                  fullWidth
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1.5, color: 'text.secondary', display: 'grid', placeItems: 'center' }}>
                        <SearchIcon fontSize="small" />
                      </Box>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} lg={5}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    startIcon={<FilterAltOutlinedIcon />}
                    onClick={() => setAdvancedFiltersOpen((current) => !current)}
                  >
                    {t('customers.moreFilters', { defaultValue: 'More Filters' })}
                  </Button>
                  <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleExport}>
                    {t('customers.export', { defaultValue: 'Export' })}
                  </Button>
                </Stack>
              </Grid>
            </Grid>

            <Divider />

            {advancedFiltersOpen ? (
              <Grid container spacing={2} alignItems="stretch">
                <Grid item xs={12} md={4}>
                  <TextField
                    select
                    fullWidth
                    label={t('customers.filters.email', { defaultValue: 'Email presence' })}
                    value={emailPresenceFilter}
                    onChange={(event) => setEmailPresenceFilter(event.target.value)}
                  >
                    <MenuItem value="all">{t('customers.filters.all', { defaultValue: 'All' })}</MenuItem>
                    <MenuItem value="with-email">{t('customers.filters.withEmail', { defaultValue: 'With email' })}</MenuItem>
                    <MenuItem value="without-email">{t('customers.filters.withoutEmail', { defaultValue: 'No email' })}</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Stack spacing={1.5} sx={{ p: 0.25 }}>
                    <FormControlLabel
                      control={<Checkbox checked={positiveBalanceOnly} onChange={(event) => setPositiveBalanceOnly(event.target.checked)} />}
                      label={t('customers.filters.positiveOnly', { defaultValue: 'Positive balance only' })}
                    />
                    <FormControlLabel
                      control={<Checkbox checked={minimumBalance > 0} onChange={(event) => setMinimumBalance(event.target.checked ? Math.max(minimumBalance, 1) : 0)} />}
                      label={t('customers.filters.minimumActive', { defaultValue: 'Apply minimum balance threshold' })}
                    />
                  </Stack>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Box sx={{ px: 1 }}>
                    <Stack spacing={1}>
                      <Typography variant="body2" sx={{ fontWeight: 700 }}>
                        {t('customers.filters.minimumBalance', { defaultValue: 'Minimum balance' })}
                      </Typography>
                      <Slider
                        value={minimumBalance}
                        min={0}
                        max={Math.max(1, maximumBalance || 1)}
                        onChange={(_, value) => setMinimumBalance(Array.isArray(value) ? value[0] : value)}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `$${Number(value).toLocaleString(i18n.language === 'ar' ? 'ar-EG' : 'en-US')}`}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {t('customers.filters.between', {
                          defaultValue: 'Customers with balances at or above {{value}} are shown.',
                          value: Number(minimumBalance).toLocaleString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
                            style: 'currency',
                            currency: 'USD',
                          }),
                        })}
                      </Typography>
                    </Stack>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" spacing={1.5}>
                    <Button variant="text" onClick={clearAdvancedFilters}>
                      {t('customers.filters.clear', { defaultValue: 'Clear filters' })}
                    </Button>
                    <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                      {t('customers.filters.activeSummary', {
                        defaultValue: '{{count}} filters active',
                        count: [emailPresenceFilter !== 'all', positiveBalanceOnly, minimumBalance > 0].filter(Boolean).length,
                      })}
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            ) : null}

            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
              {t('customers.overview.showing', {
                defaultValue: 'Showing {{visible}} of {{total}} customers',
                visible: filteredCustomers.length,
                total: enrichedCustomers.length,
              })}
            </Typography>

            {filteredCustomers.length === 0 ? (
              <Alert severity="info" sx={{ borderRadius: 3 }}>
                {t('customers.emptyState', { defaultValue: 'No customers match the current filters.' })}
              </Alert>
            ) : null}
          </Stack>
        </CardContent>

        <CustomersTable customers={filteredCustomers} onDelete={handleDelete} />
      </Card>

    </Stack>
  );
}

export default CustomersPage;