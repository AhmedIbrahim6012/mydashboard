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

const EMPTY_VALUES = {
  workerId: '',
  amount: '',
};

function WalletPage() {
  const { workers, depositToWorker } = useAppContext();
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
    <Stack spacing={3.5}>
      <PageHeader
        title="Wallet / Deposits"
        subtitle="Add money to a worker wallet and keep balances synchronized instantly across the application."
      />
      {workers.length === 0 ? (
        <Alert severity="warning">Add at least one worker before processing wallet deposits.</Alert>
      ) : null}
      <Stack spacing={3} direction={{ xs: 'column', lg: 'row' }}>
        <Card elevation={0} sx={(theme) => ({ flex: 1, borderRadius: 4, border: `1px solid ${theme.palette.divider}` })}>
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2.5} component="form" onSubmit={handleSubmit} noValidate>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Add Balance
              </Typography>
              <TextField
                select
                label="Select Worker"
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
                label="Amount"
                name="amount"
                type="number"
                value={values.amount}
                onChange={handleChange}
                error={Boolean(errors.amount)}
                helperText={errors.amount || 'Enter the amount to add to the wallet.'}
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
                Deposit Funds
              </Button>
            </Stack>
          </CardContent>
        </Card>
        <Card elevation={0} sx={(theme) => ({ width: { xs: '100%', lg: 420 }, borderRadius: 4, border: `1px solid ${theme.palette.divider}` })}>
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2.5}>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                Selected Wallet
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
                      Balance updates are reflected immediately after deposit confirmation.
                    </Typography>
                  </Stack>
                </Box>
              ) : (
                <Alert severity="info">Choose a worker to preview the current wallet balance.</Alert>
              )}
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Connected workers
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {workers.length}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" color="text.secondary">
                  Wallet coverage
                </Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {workers.length ? '100% synced' : 'No workers yet'}
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
