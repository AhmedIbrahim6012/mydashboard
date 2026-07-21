import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import ShoppingCartRoundedIcon from '@mui/icons-material/ShoppingCartRounded';
import LocalShippingRoundedIcon from '@mui/icons-material/LocalShippingRounded';
import PaidRoundedIcon from '@mui/icons-material/PaidRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import { formatCurrency } from '../../utils/format';

function MetricCard({ title, value, helperText, accent, icon }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 3,
        border: `1px solid ${theme.palette.divider}`,
        background: `radial-gradient(circle at top right, ${accent}1A 0%, transparent 34%), linear-gradient(160deg, ${theme.palette.background.paper} 0%, ${isDark ? 'rgba(15,23,42,0.98)' : 'rgba(248,250,252,0.94)'} 100%)`,
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ mt: 0.75, fontWeight: 800, letterSpacing: '-0.04em' }}>
              {value}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
              {helperText}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 54,
              height: 54,
              borderRadius: 2.5,
              display: 'grid',
              placeItems: 'center',
              color: accent,
              background: isDark ? `${accent}26` : `${accent}18`,
              flexShrink: 0,
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function OrdersSummaryCards({ summary }) {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'ar' ? 'ar-EG' : 'en-US';

  const cards = [
    {
      key: 'totalOrders',
      title: t('orders.summary.totalOrders'),
      value: Number(summary.totalOrders || 0).toLocaleString(locale),
      helperText: t('orders.summary.totalOrdersHelp'),
      accent: '#2563eb',
      icon: <ShoppingCartRoundedIcon fontSize="small" />,
    },
    {
      key: 'activeOrders',
      title: t('orders.summary.activeOrders'),
      value: Number(summary.activeOrders || 0).toLocaleString(locale),
      helperText: t('orders.summary.activeOrdersHelp'),
      accent: '#f59e0b',
      icon: <LocalShippingRoundedIcon fontSize="small" />,
    },
    {
      key: 'revenue',
      title: t('orders.summary.revenue'),
      value: formatCurrency(summary.revenue),
      helperText: t('orders.summary.revenueHelp'),
      accent: '#14b8a6',
      icon: <PaidRoundedIcon fontSize="small" />,
    },
    {
      key: 'completionRate',
      title: t('orders.summary.completionRate'),
      value: `${summary.completionRate}%`,
      helperText: t('orders.summary.completionRateHelp'),
      accent: '#7c3aed',
      icon: <CheckCircleRoundedIcon fontSize="small" />,
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', xl: 'repeat(4, minmax(0, 1fr))' },
        gap: 2.5,
      }}
    >
      {cards.map((card) => (
        <MetricCard key={card.key} {...card} />
      ))}
    </Box>
  );
}

export default OrdersSummaryCards;