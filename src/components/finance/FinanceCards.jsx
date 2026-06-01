import { Box } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaidIcon from '@mui/icons-material/Paid';
import { useTranslation } from 'react-i18next';
import StatCard from '../StatCard';
import { formatCurrency } from '../../utils/format';

function FinanceCards({ summary, rangeDescription }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'ar' ? 'ar-EG' : 'en-US';
  const averageOrder = summary.selectedOrders > 0 ? summary.selectedRevenue / summary.selectedOrders : 0;
  const margin = summary.selectedRevenue > 0 ? (summary.selectedProfit / summary.selectedRevenue) * 100 : 0;

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(4, minmax(0, 1fr))' },
        gap: 3,
      }}
    >
      <StatCard
        flipDirection="horizontal"
        title={t('finance.cards.totalRevenue')}
        value={formatCurrency(summary.selectedRevenue)}
        helperText={rangeDescription}
        trendText={t('finance.cardsMeta.revenueTrend', { defaultValue: '+9.4% vs previous window' })}
        alarmLevel={summary.selectedRevenue < 5000 ? 'warning' : 'none'}
        cardState={summary.selectedRevenue >= 5000 ? 'confirmed' : 'default'}
        backTitle={t('finance.cardsMeta.revenueBackTitle', { defaultValue: 'Revenue signals' })}
        backDescription={t('finance.cardsMeta.revenueBackDescription', { defaultValue: 'Understand concentration and order-value health.' })}
        backItems={[
          { label: t('finance.cardsMeta.averageOrder', { defaultValue: 'Average order' }), value: formatCurrency(averageOrder) },
          { label: t('finance.cardsMeta.totalOrders', { defaultValue: 'Orders in range' }), value: Number(summary.selectedOrders || 0).toLocaleString(locale) },
          { label: t('finance.cardsMeta.profitMargin', { defaultValue: 'Profit margin' }), value: `${margin.toFixed(1)}%` },
        ]}
        accent="#4f46e5"
        icon={<TrendingUpIcon fontSize="small" />}
      />
      <StatCard
        flipDirection="horizontal"
        title={t('finance.cards.totalProfit')}
        value={formatCurrency(summary.selectedProfit)}
        helperText={rangeDescription}
        trendText={t('finance.cardsMeta.profitTrend', { defaultValue: '+6.2% vs previous window' })}
        alarmLevel={summary.selectedProfit < 0 ? 'critical' : summary.selectedProfit < 2000 ? 'warning' : 'none'}
        cardState={summary.selectedProfit >= 2000 ? 'accepted' : 'default'}
        backTitle={t('finance.cardsMeta.profitBackTitle', { defaultValue: 'Profit alerts' })}
        backDescription={t('finance.cardsMeta.profitBackDescription', { defaultValue: 'Watch profitability shifts before they affect cash flow.' })}
        backItems={[
          { label: t('finance.cardsMeta.revenueBase', { defaultValue: 'Revenue base' }), value: formatCurrency(summary.selectedRevenue) },
          { label: t('finance.cardsMeta.depositsBase', { defaultValue: 'Deposits base' }), value: formatCurrency(summary.selectedDeposits) },
          { label: t('finance.cardsMeta.margin', { defaultValue: 'Margin' }), value: `${margin.toFixed(1)}%` },
        ]}
        accent="#14b8a6"
        icon={<PaidIcon fontSize="small" />}
      />
      <StatCard
        flipDirection="horizontal"
        title={t('finance.cards.totalOrders')}
        value={Number(summary.selectedOrders || 0).toLocaleString()}
        helperText={rangeDescription}
        trendText={t('finance.cardsMeta.ordersTrend', { defaultValue: '+8.2% from last week' })}
        alarmLevel={summary.selectedOrders < 10 ? 'warning' : 'info'}
        cardState={summary.selectedOrders >= 10 ? 'confirmed' : 'default'}
        backTitle={t('finance.cardsMeta.ordersBackTitle', { defaultValue: 'Order alerts' })}
        backDescription={t('finance.cardsMeta.ordersBackDescription', { defaultValue: 'Track demand pressure and throughput.' })}
        backItems={[
          { label: t('finance.cardsMeta.orderDensity', { defaultValue: 'Order density' }), value: t('finance.cardsMeta.orderDensityValue', { defaultValue: 'Steady' }) },
          { label: t('finance.cardsMeta.averageOrder', { defaultValue: 'Average order' }), value: formatCurrency(averageOrder) },
          { label: t('finance.cardsMeta.coverageWindow', { defaultValue: 'Coverage' }), value: rangeDescription },
        ]}
        accent="#f59e0b"
        icon={<ShoppingCartIcon fontSize="small" />}
      />
      <StatCard
        flipDirection="horizontal"
        title={t('finance.cards.deposits')}
        value={formatCurrency(summary.selectedDeposits)}
        helperText={rangeDescription}
        trendText={t('finance.cardsMeta.depositsTrend', { defaultValue: '+4.3% from last month' })}
        alarmLevel={summary.selectedDeposits > summary.selectedRevenue * 0.75 ? 'warning' : 'none'}
        cardState={summary.selectedDeposits <= summary.selectedRevenue * 0.75 ? 'accepted' : 'default'}
        backTitle={t('finance.cardsMeta.depositsBackTitle', { defaultValue: 'Deposit alerts' })}
        backDescription={t('finance.cardsMeta.depositsBackDescription', { defaultValue: 'Maintain healthy deposits-to-revenue ratio.' })}
        backItems={[
          { label: t('finance.cardsMeta.depositsToRevenue', { defaultValue: 'Deposits / Revenue' }), value: `${summary.selectedRevenue ? ((summary.selectedDeposits / summary.selectedRevenue) * 100).toFixed(1) : '0.0'}%` },
          { label: t('finance.cardsMeta.profit', { defaultValue: 'Profit' }), value: formatCurrency(summary.selectedProfit) },
          { label: t('finance.cardsMeta.orders', { defaultValue: 'Orders' }), value: Number(summary.selectedOrders || 0).toLocaleString(locale) },
        ]}
        accent="#0f766e"
        icon={<AccountBalanceWalletIcon fontSize="small" />}
      />
    </Box>
  );
}

export default FinanceCards;
