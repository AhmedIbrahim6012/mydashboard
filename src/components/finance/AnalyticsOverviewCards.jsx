import { Box, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import HandymanRoundedIcon from '@mui/icons-material/HandymanRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import TrendingFlatRoundedIcon from '@mui/icons-material/TrendingFlatRounded';

function GrowthBadge({ growth }) {
  const value = Number(growth ?? 0);
  const isPositive = value > 0;
  const isNeutral = value === 0;

  const color = isNeutral ? '#64748b' : isPositive ? '#16a34a' : '#dc2626';
  const Icon = isNeutral
    ? TrendingFlatRoundedIcon
    : isPositive
      ? TrendingUpRoundedIcon
      : TrendingDownRoundedIcon;

  return (
    <Stack direction="row" alignItems="center" spacing={0.4}>
      <Icon sx={{ fontSize: 16, color }} />
      <Typography sx={{ fontSize: '0.85rem', fontWeight: 600, color }}>
        {isPositive ? '+' : ''}{value}%
      </Typography>
    </Stack>
  );
}

function OverviewCard({ title, value, growth, icon, iconColor, iconBg, loading }) {
  return (
    <Card
      elevation={0}
      sx={(theme) => ({
        height: '100%',
        minHeight: 160,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.85)}`,
        boxShadow: '0 2px 8px rgba(15,23,42,0.04), 0 10px 22px rgba(15,23,42,0.04)',
        background: theme.palette.background.paper,
        transition: 'box-shadow 0.2s ease',
        '&:hover': {
          boxShadow: '0 4px 16px rgba(15,23,42,0.08), 0 14px 30px rgba(15,23,42,0.06)',
        },
      })}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box
              sx={{
                width: 44,
                height: 44,
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                bgcolor: iconBg,
                color: iconColor,
                '& svg': { fontSize: 22 },
              }}
            >
              {icon}
            </Box>
            {loading ? (
              <Skeleton width={50} height={20} />
            ) : (
              <GrowthBadge growth={growth} />
            )}
          </Stack>

          <Box>
            <Typography sx={{ color: '#64748b', fontSize: '0.88rem', fontWeight: 500, mb: 0.5 }}>
              {title}
            </Typography>
            {loading ? (
              <Skeleton width={100} height={40} />
            ) : (
              <Typography
                sx={{
                  color: '#0f172a',
                  fontSize: '2rem',
                  fontWeight: 800,
                  lineHeight: 1.1,
                  letterSpacing: '-0.04em',
                }}
              >
                {value}
              </Typography>
            )}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

/**
 * AnalyticsOverviewCards
 * Props:
 *   data   — response from GET /admin/analytics
 *   loading — boolean
 */
function AnalyticsOverviewCards({ data, loading }) {
  const orders   = data?.orders   ?? {};
  const users    = data?.users    ?? {};
  const providers = data?.providers ?? {};
  const revenue  = data?.revenue  ?? {};

  const cards = [
    {
      id: 'revenue',
      title: 'Revenue',
      value: `$${Number(revenue.amount ?? 0).toLocaleString()}`,
      growth: revenue.growth,
      icon: <AttachMoneyRoundedIcon />,
      iconColor: '#2563eb',
      iconBg: '#dbeafe',
    },
    {
      id: 'orders',
      title: 'Orders',
      value: Number(orders.count ?? 0).toLocaleString(),
      growth: orders.growth,
      icon: <ShoppingBagRoundedIcon />,
      iconColor: '#16a34a',
      iconBg: '#dcfce7',
    },
    {
      id: 'users',
      title: 'Users',
      value: Number(users.count ?? 0).toLocaleString(),
      growth: users.growth,
      icon: <GroupsRoundedIcon />,
      iconColor: '#a855f7',
      iconBg: '#f3e8ff',
    },
    {
      id: 'providers',
      title: 'Providers',
      value: Number(providers.count ?? 0).toLocaleString(),
      growth: providers.growth,
      icon: <HandymanRoundedIcon />,
      iconColor: '#f59e0b',
      iconBg: '#fef3c7',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)',
          md: 'repeat(4, 1fr)',
        },
        gap: { xs: 1.5, md: 2.5 },
      }}
    >
      {cards.map((card) => (
        <OverviewCard key={card.id} {...card} loading={loading} />
      ))}
    </Box>
  );
}

export default AnalyticsOverviewCards;