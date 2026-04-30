import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import {
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Bar,
  BarChart,
} from 'recharts';
import { formatCurrency } from '../../utils/format';

const PIE_COLORS = ['#4f46e5', '#14b8a6', '#f59e0b'];

function ChartCard({ title, subtitle, children, minHeight = 320 }) {
  return (
    <Card elevation={0} sx={(theme) => ({ height: '100%', borderRadius: 2, border: `1px solid ${theme.palette.divider}` })}>
      <CardContent sx={{ p: 3, height: '100%' }}>
        <Stack spacing={2.5} sx={{ height: '100%' }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              {title}
            </Typography>
            {subtitle ? (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            ) : null}
          </Box>
          <Box sx={{ minHeight, width: '100%' }}>{children}</Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function FinanceCharts({ chartSeries }) {
  const pieData = chartSeries.length
    ? [
        { name: 'Revenue', value: chartSeries.reduce((sum, record) => sum + Number(record.revenue || 0), 0) },
        { name: 'Deposits', value: chartSeries.reduce((sum, record) => sum + Number(record.deposits || 0), 0) },
        { name: 'Profit', value: Math.max(chartSeries.reduce((sum, record) => sum + Number(record.profit || 0), 0), 0) },
      ]
    : [];

  return (
    <Stack spacing={3}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, minmax(0, 1fr))' },
          gap: 3,
          alignItems: 'stretch',
        }}
      >
        <ChartCard title="Revenue Over Time" subtitle="Daily revenue trend for the selected period." minHeight={340}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartSeries}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
              <Tooltip formatter={(value) => formatCurrency(value)} labelFormatter={(label) => label} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#4f46e5"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 7 }}
                isAnimationActive
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Orders per Day" subtitle="Order volume mapped against the same selected range." minHeight={340}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartSeries}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} />
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
              <Tooltip formatter={(value) => Number(value).toLocaleString()} />
              <Bar dataKey="ordersCount" fill="#14b8a6" radius={[8, 8, 0, 0]} isAnimationActive animationDuration={800} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'center' }}>
        <Card
          elevation={0}
          sx={(theme) => ({
            width: '100%',
            maxWidth: 620,
            borderRadius: 4,
            border: `1px solid ${theme.palette.divider}`,
          })}
        >
          <CardContent sx={{ p: 3 }}>
            <Stack spacing={2.5} alignItems="center">
              <Box sx={{ textAlign: 'center' }}>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  Revenue Distribution
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Revenue, deposits, and profit share for the selected filter range.
                </Typography>
              </Box>
              <Box sx={{ width: '100%', height: 280 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={70}
                      outerRadius={110}
                      paddingAngle={4}
                      isAnimationActive
                      animationDuration={800}
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(value)} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      </Box>
    </Stack>
  );
}

export default FinanceCharts;