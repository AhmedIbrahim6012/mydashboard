import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PageHeader from '../components/PageHeader';
import { useAppContext } from '../context/AppContext';
import { formatCurrency } from '../utils/format';
import { validateDeposit } from '../utils/validation';
import { useTranslation } from 'react-i18next';

const EMPTY_VALUES = {
  workerId: '',
  amount: '',
};

function WalletPage() {
  const { workers, depositToWorker } = useAppContext();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const [values, setValues] = useState(EMPTY_VALUES);
  const [errors, setErrors] = useState(EMPTY_VALUES);

  useEffect(() => {
    if (!values.workerId && workers.length > 0) {
      setValues((currentValues) => ({ ...currentValues, workerId: workers[0].id }));
    }
  }, [values.workerId, workers]);

  const selectedWorker = useMemo(
    () => workers.find((worker) => worker.id === values.workerId),
    [values.workerId, workers],
  );

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateDeposit(values);
    setErrors({
      workerId: nextErrors.workerId || '',
      amount: nextErrors.amount || '',
    });

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    depositToWorker(values.workerId, Number(values.amount));
    setValues((currentValues) => ({ ...currentValues, amount: '' }));
  }

  return (
    <Stack spacing={3.5} dir={isRtl ? 'rtl' : 'ltr'}>
      <PageHeader
        title={t('wallet.title')}
        subtitle={t('wallet.subtitle')}
      />
      {workers.length === 0 ? (
        <Alert severity="warning">{t('wallet.warning')}</Alert>
      ) : null}
      <Stack spacing={3} direction={{ xs: 'column', lg: 'row' }}>
        <Card elevation={0} sx={(theme) => ({ flex: 1, borderRadius: 4, border: `1px solid ${theme.palette.divider}` })}>
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2.5} component="form" onSubmit={handleSubmit} noValidate>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {t('wallet.form.title')}
              </Typography>
              <TextField
                select
                label={t('wallet.form.selectWorker')}
                name="workerId"
                value={values.workerId}
                onChange={handleChange}
                error={Boolean(errors.workerId)}
                helperText={errors.workerId}
                fullWidth
              >
                {workers.map((worker) => (
                  <MenuItem key={worker.id} value={worker.id}>
                    {worker.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label={t('wallet.form.amount')}
                name="amount"
                type="number"
                value={values.amount}
                onChange={handleChange}
                error={Boolean(errors.amount)}
                helperText={errors.amount || t('wallet.form.amountHelp')}
                inputProps={{ min: 1, step: 1 }}
                fullWidth
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={<AddIcon />}
                disabled={!workers.length}
                size="large"
              >
                {t('wallet.form.submit')}
              </Button>
            </Stack>
          </CardContent>
        </Card>
        <Card elevation={0} sx={(theme) => ({ width: { xs: '100%', lg: 420 }, borderRadius: 4, border: `1px solid ${theme.palette.divider}` })}>
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2.5}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {t('wallet.preview.title')}
              </Typography>
              {selectedWorker ? (
                <Box
                  sx={(theme) => ({
                    borderRadius: 4,
                    p: 3,
                    color: 'white',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  })}
                >
                  <Stack spacing={1.2}>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {selectedWorker.name}
                    </Typography>
                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                      {formatCurrency(selectedWorker.balance)}
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      {t('wallet.preview.balanceNote')}
                    </Typography>
                  </Stack>
                </Box>
              ) : (
                <Alert severity="info">{t('wallet.preview.chooseWorker')}</Alert>
              )}
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('wallet.preview.connectedWorkers')}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {workers.length}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  {t('wallet.preview.walletCoverage')}
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {workers.length ? t('wallet.preview.fullSync') : t('wallet.preview.noWorkers')}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Stack>
  );
}

export default WalletPage;
