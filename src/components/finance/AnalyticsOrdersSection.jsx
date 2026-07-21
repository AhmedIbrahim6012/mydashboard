import { Box, Card, CardContent, Divider, Skeleton, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
} from 'recharts';

const ORDER_COLORS = {
  completed: '#16a34a',
  pending:   '#f59e0b',
  cancelled: '#ef4444',
};

function RateBadge({ label, value, color }) {
  return (
    <Stack
      sx={{
        flex: 1,
        p: 1.5,
        borderRadius: 2,
        bgcolor: alpha(color, 0.08),
        border: `1px solid ${alpha(color, 0.15)}`,
        minWidth: 80,
      }}
      spacing={0.25}
    >
      <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color, lineHeight: 1.1 }}>
        {Number(value ?? 0).toFixed(1)}%
      </Typography>
      <Typography sx={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 500 }}>
        {label}
      </Typography>
    </Stack>
  );
}

function StatRow({ label, general, periodCount, periodGrowth, loading }) {
  if (loading) {
    return (
      <Stack direction="row" alignItems="center" justifyContent="space-between" py={1}>
        <Skeleton width={120} />
        <Skeleton width={80} />
      </Stack>
    );
  }

  const growth = Number(periodGrowth ?? 0);
  const growthColor = growth > 0 ? '#16a34a' : growth < 0 ? '#dc2626' : '#64748b';

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" py={1.25}>
      <Typography sx={{ color: '#475467', fontSize: '0.92rem' }}>{label}</Typography>
      <Stack direction="row" alignItems="center" spacing={2}>
        <Typography sx={{ color: '#0f172a', fontWeight: 700, fontSize: '0.95rem', minWidth: 32, textAlign: 'right' }}>
          {Number(periodCount ?? 0).toLocaleString()}
        </Typography>
        <Typography sx={{ color: '#94a3b8', fontSize: '0.78rem', minWidth: 48, textAlign: 'right' }}>
          All: {Number(general ?? 0).toLocaleString()}
        </Typography>
        <Typography sx={{ fontSize: '0.8rem', fontWeight: 600, color: growthColor, minWidth: 44, textAlign: 'right' }}>
          {growth > 0 ? '+' : ''}{growth}%
        </Typography>
      </Stack>
    </Stack>
  );
}

/**
 * AnalyticsOrdersSection
 * Props:
 *   data    — response.data from GET /admin/analytics/orders
 *   loading — boolean
 */
function AnalyticsOrdersSection({ data, loading }) {
  const totalOrders     = data?.['Total Orders']     ?? {};
  const pendingOrders   = data?.['Pending Orders']   ?? {};
  const completedOrders = data?.['Completed Orders'] ?? {};
  const cancelledOrders = data?.['Cancelled Orders'] ?? {};

  const pieData = [
    { name: 'Completed', value: Number(completedOrders?.period?.count ?? 0), color: ORDER_COLORS.completed },
    { name: 'Pending',   value: Number(pendingOrders?.period?.count ?? 0),   color: ORDER_COLORS.pending },
    { name: 'Cancelled', value: Number(cancelledOrders?.period?.count ?? 0), color: ORDER_COLORS.cancelled },
  ].filter((d) => d.value > 0);

  const hasPieData = pieData.reduce((sum, d) => sum + d.value, 0) > 0;

  return (
    <Card
      elevation={0}
      sx={(theme) => ({
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.85)}`,
        boxShadow: '0 2px 8px rgba(15,23,42,0.04)',
        background: theme.palette.background.paper,
      })}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Typography sx={{ fontWeight: 800, fontSize: '1.1rem', color: '#0f172a', mb: 2.5 }}>
          Orders Breakdown
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 260px' }, gap: 3 }}>
          {/* Left: stat rows */}
          <Stack divider={<Divider />}>
            <StatRow
              label="Total Orders"
              general={totalOrders?.general}
              periodCount={totalOrders?.period?.count}
              periodGrowth={totalOrders?.period?.growth}
              loading={loading}
            />
            <StatRow
              label="Completed Orders"
              general={completedOrders?.general}
              periodCount={completedOrders?.period?.count}
              periodGrowth={completedOrders?.period?.growth}
              loading={loading}
            />
            <StatRow
              label="Pending Orders"
              general={pendingOrders?.general}
              periodCount={pendingOrders?.period?.count}
              periodGrowth={pendingOrders?.period?.growth}
              loading={loading}
            />
            <StatRow
              label="Cancelled Orders"
              general={cancelledOrders?.general}
              periodCount={cancelledOrders?.period?.count}
              periodGrowth={cancelledOrders?.period?.growth}
              loading={loading}
            />

            {/* Rate badges */}
            <Box sx={{ pt: 2 }}>
              <Typography sx={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', mb: 1.25 }}>
                Period Rates
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {loading ? (
                  <>
                    <Skeleton width={80} height={60} sx={{ borderRadius: 2 }} />
                    <Skeleton width={80} height={60} sx={{ borderRadius: 2 }} />
                    <Skeleton width={80} height={60} sx={{ borderRadius: 2 }} />
                  </>
                ) : (
                  <>
                    <RateBadge label="Acceptance" value={data?.periodAcceptenecRate}  color={ORDER_COLORS.completed} />
                    <RateBadge label="Pending"    value={data?.periodPendingRate}      color={ORDER_COLORS.pending} />
                    <RateBadge label="Cancellation" value={data?.periodCancellationRate} color={ORDER_COLORS.cancelled} />
                  </>
                )}
              </Stack>
            </Box>
          </Stack>

          {/* Right: pie chart */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
            {loading ? (
              <Skeleton variant="circular" width={160} height={160} />
            ) : hasPieData ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={55}
                    outerRadius={90}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip
                    formatter={(value) => [Number(value).toLocaleString(), 'Orders']}
                    contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 8px 24px rgba(15,23,42,0.14)' }}
                  />
                  <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Stack alignItems="center" spacing={1}>
                <Typography sx={{ color: '#94a3b8', fontSize: '0.9rem' }}>No order data</Typography>
                <Typography sx={{ color: '#cbd5e1', fontSize: '0.78rem' }}>for this period</Typography>
              </Stack>
            )}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default AnalyticsOrdersSection;