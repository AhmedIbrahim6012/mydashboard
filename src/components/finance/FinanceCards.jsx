import { Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaidIcon from '@mui/icons-material/Paid';
import StatCard from '../StatCard';
import { formatCurrency } from '../../utils/format';

function FinanceCards({ summary, rangeDescription }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' },
        gap: 3,
      }}
    >
      <StatCard
        title="Total Revenue"
        value={formatCurrency(summary.selectedRevenue)}
        helperText={rangeDescription}
        accent="#4f46e5"
        icon={<TrendingUpIcon fontSize="small" />}
      />
      <StatCard
        title="Total Profit"
        value={formatCurrency(summary.selectedProfit)}
        helperText={rangeDescription}
        accent="#14b8a6"
        icon={<PaidIcon fontSize="small" />}
      />
      <StatCard
        title="Total Orders"
        value={Number(summary.selectedOrders || 0).toLocaleString()}
        helperText={rangeDescription}
        accent="#f59e0b"
        icon={<ShoppingCartIcon fontSize="small" />}
      />
      <StatCard
        title="Deposits"
        value={formatCurrency(summary.selectedDeposits)}
        helperText={rangeDescription}
        accent="#0f766e"
        icon={<AccountBalanceWalletIcon fontSize="small" />}
      />
    </Box>
  );
}

export default FinanceCards;
