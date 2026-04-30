import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { useDashboardData } from '../hooks/useDashboardData';
import { formatCurrency } from '../utils/format';

const profitSeries = [
  { month: 'Jan', profit: 185000 },
  { month: 'Feb', profit: 199000 },
  { month: 'Mar', profit: 210000 },
  { month: 'Apr', profit: 226000 },
  { month: 'May', profit: 241000 },
  { month: 'Jun', profit: 258000 },
  { month: 'Jul', profit: 271000 },
  { month: 'Aug', profit: 284000 },
];

function DashboardPage() {
  const { totalWorkers, workers, totalCustomers } = useDashboardData();
  const latestProfit = profitSeries[profitSeries.length - 1].profit;
  const totalBalance = workers.reduce((sum, worker) => sum + Number(worker.balance || 0), 0);

  return (
    <Stack spacing={3.5}>
      <PageHeader
        title="Dashboard"
        subtitle="Track workforce size, company performance, and wallet activity from a polished executive overview."
      />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', md: 'repeat(3, minmax(0, 1fr))' },
          gap: 3,
        }}
      >
        <Box>
          <StatCard
            title="Total Workers"
            value={totalWorkers}
            helperText="Current active workforce in the system"
            accent="#2563eb"
            icon={<PeopleAltIcon fontSize="small" />}
          />
        </Box>
        <Box>
          <StatCard
            title="Total Company Profits"
            value={formatCurrency(latestProfit)}
            helperText="Rolling profit performance across the last eight months"
            accent="#14b8a6"
            icon={<TrendingUpIcon fontSize="small" />}
          />
        </Box>
        <Box>
          <StatCard
            title="Worker Wallets"
            value={formatCurrency(totalBalance)}
            helperText="Aggregate wallet balance across all workers"
            accent="#f59e0b"
            icon={<AccountBalanceIcon fontSize="small" />}
          />
        </Box>
        <Box>
          <StatCard
            title="Total Customers"
            value={totalCustomers}
            helperText="Registered mobile app users"
            accent="#7c3aed"
            icon={<PhoneAndroidIcon fontSize="small" />}
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 2fr) minmax(320px, 1fr)' },
          gap: 3,
        }}
      >
        <Box>
          <Card
            elevation={0}
            sx={(theme) => ({
              height: '100%',
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
            })}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Profit Trend
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Monthly company profit movement in a responsive analytics chart.
                  </Typography>
                </Box>
                <Box sx={{ width: '100%', height: 340 }}>
                  <ResponsiveContainer>
                    <LineChart data={profitSeries}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.25} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                      <Tooltip formatter={(value) => formatCurrency(value)} />
                      <Line
                        type="monotone"
                        dataKey="profit"
                        stroke="#4f46e5"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 7 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Card
            elevation={0}
            sx={(theme) => ({
              height: '100%',
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
            })}
          >
            <CardContent sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Executive Snapshot
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    A concise view of the current operational health.
                  </Typography>
                </Box>
                {[
                  { label: 'Workers tracked', value: totalWorkers },
                  { label: 'Active wallets', value: workers.filter((worker) => worker.balance > 0).length },
                  { label: 'Total wallet value', value: formatCurrency(totalBalance) },
                  { label: 'Latest monthly profit', value: formatCurrency(latestProfit) },
                ].map((item) => (
                  <Box
                    key={item.label}
                    sx={(theme) => ({
                      borderRadius: 3,
                      p: 2,
                      backgroundColor: theme.palette.action.hover,
                    })}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {item.label}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.5 }}>
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Box>
      </Box>
    </Stack>
  );
}

export default DashboardPage;
