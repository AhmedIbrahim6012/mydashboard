import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import { useTranslation } from 'react-i18next';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts';

const summaryCards = [
  {
    id: 'revenue',
    title: 'Total Revenue',
    value: '$184,270',
    trend: '+12.5%',
    trendTone: 'positive',
    icon: <AttachMoneyRoundedIcon fontSize="small" />,
    iconColor: '#2563eb',
    iconBg: '#dbeafe',
  },
  {
    id: 'bookings',
    title: 'Total Bookings',
    value: '1,048',
    trend: '+8.2%',
    trendTone: 'positive',
    icon: <CalendarMonthRoundedIcon fontSize="small" />,
    iconColor: '#16a34a',
    iconBg: '#dcfce7',
  },
  {
    id: 'providers',
    title: 'Active Providers',
    value: '87',
    trend: '+5.1%',
    trendTone: 'positive',
    icon: <GroupsRoundedIcon fontSize="small" />,
    iconColor: '#a855f7',
    iconBg: '#f3e8ff',
  },
  {
    id: 'rating',
    title: 'Avg. Rating',
    value: '4.78',
    trend: '-0.2%',
    trendTone: 'neutral',
    icon: <StarBorderRoundedIcon fontSize="small" />,
    iconColor: '#ca8a04',
    iconBg: '#fef3c7',
  },
];

const revenueTrendData = [
  { label: 'Jan', revenue: 4200, bookings: 42 },
  { label: 'Feb', revenue: 3900, bookings: 39 },
  { label: 'Mar', revenue: 5100, bookings: 51 },
  { label: 'Apr', revenue: 4600, bookings: 46 },
  { label: 'May', revenue: 6300, bookings: 63 },
  { label: 'Jun', revenue: 5900, bookings: 59 },
];

const serviceDistributionData = [
  { name: 'Painting', value: 28, color: '#ef4444' },
  { name: 'Electrical', value: 17, color: '#8b5cf6' },
  { name: 'Cleaning', value: 14, color: '#ec4899' },
  { name: 'Plumbing', value: 10, color: '#3b82f6' },
  { name: 'Gardening', value: 19, color: '#10b981' },
  { name: 'HVAC', value: 12, color: '#f59e0b' },
];

const providerPerformanceData = [
  { name: 'Mike Johnson', jobs: 156, revenue: 23400 },
  { name: 'Clean Team', jobs: 148, revenue: 34800 },
  { name: 'Tom Electric', jobs: 162, revenue: 37800 },
  { name: 'Green Gardens', jobs: 58, revenue: 10600 },
  { name: 'Cool Air', jobs: 154, revenue: 36200 },
];

const topServicesData = [
  { service: 'Painting', bookings: 95, revenue: 42750, average: 450, color: '#3b82f6' },
  { service: 'Electrical', bookings: 203, revenue: 36540, average: 180, color: '#10b981' },
  { service: 'Cleaning', bookings: 174, revenue: 31200, average: 179, color: '#f59e0b' },
  { service: 'Plumbing', bookings: 144, revenue: 28160, average: 195, color: '#8b5cf6' },
];

function formatCurrency(value) {
  return `$${Number(value || 0).toLocaleString()}`;
}

function SummaryCard({ card }) {
  const isPositive = card.trendTone === 'positive';

  return (
    <Card
      elevation={0}
      sx={(theme) => ({
        height: '100%',
        minHeight: 174,
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.85)}`,
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04), 0 10px 22px rgba(15, 23, 42, 0.04)',
        backgroundColor: theme.palette.background.paper,
      })}
    >
      <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
        <Stack justifyContent="space-between" sx={{ minHeight: 126 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                display: 'grid',
                placeItems: 'center',
                bgcolor: card.iconBg,
                color: card.iconColor,
                boxShadow: `inset 0 1px 0 ${alpha('#ffffff', 0.7)}`,
                '& svg': { fontSize: 27 },
              }}
            >
              {card.icon}
            </Box>

            <Stack direction="row" spacing={0.75} alignItems="center" sx={{ pt: 0.75 }}>
              <Typography
                sx={{
                  fontSize: '0.92rem',
                  lineHeight: 1,
                  fontWeight: 500,
                  color: isPositive ? '#16a34a' : '#64748b',
                }}
              >
                {isPositive ? '↗' : '↘'} {card.trend}
              </Typography>
            </Stack>
          </Stack>

          <Box sx={{ pt: 1.25 }}>
            <Typography sx={{ color: '#475467', fontSize: '0.98rem', lineHeight: 1.25 }}>{card.title}</Typography>
            <Typography sx={{ mt: 1.1, color: '#0f172a', fontSize: '2rem', lineHeight: 1.1, fontWeight: 700, letterSpacing: '-0.04em' }}>
              {card.value}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function ChartCard({ title, children, minHeight = 320 }) {
  return (
    <Card
      elevation={0}
      sx={(theme) => ({
        height: '100%',
        borderRadius: 3,
        border: `1px solid ${alpha(theme.palette.divider, 0.85)}`,
        boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04), 0 10px 22px rgba(15, 23, 42, 0.04)',
        backgroundColor: theme.palette.background.paper,
      })}
    >
      <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
        <Typography sx={{ mb: 2.5, color: '#0f172a', fontSize: '1.25rem', lineHeight: 1.2, fontWeight: 700 }}>
          {title}
        </Typography>
        <Box sx={{ width: '100%', minHeight }}>{children}</Box>
      </CardContent>
    </Card>
  );
}

function AnalyticsTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <Box
      sx={{
        bgcolor: '#fff',
        borderRadius: 2,
        border: '1px solid rgba(148, 163, 184, 0.22)',
        boxShadow: '0 14px 30px rgba(15, 23, 42, 0.16)',
        px: 1.5,
        py: 1.25,
      }}
    >
      <Typography sx={{ mb: 0.75, color: '#0f172a', fontSize: '0.98rem', fontWeight: 500 }}>{label}</Typography>
      <Stack spacing={0.6}>
        {payload.map((entry) => (
          <Typography key={entry.dataKey} sx={{ color: entry.color || '#0f172a', fontSize: '0.92rem' }}>
            {entry.name}: {formatter ? formatter(entry.value, entry.name) : entry.value}
          </Typography>
        ))}
      </Stack>
    </Box>
  );
}

function FinancePage() {
  const { i18n } = useTranslation();

  const isRtl = i18n.dir() === 'rtl';

  return (
    <Stack spacing={3.5} dir={isRtl ? 'rtl' : 'ltr'}>
      <Box sx={{ mb: 0.25 }}>
        <Typography sx={{ color: '#0f172a', fontSize: { xs: '2rem', md: '2.15rem' }, lineHeight: 1.1, fontWeight: 700, letterSpacing: '-0.04em' }}>
          Analytics
        </Typography>
        <Typography sx={{ mt: 0.75, color: '#55657b', fontSize: '1.02rem', lineHeight: 1.4 }}>
          Detailed insights and performance metrics.
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
          gap: { xs: 2, md: 2.25 },
          alignItems: 'stretch',
        }}
      >
        {summaryCards.map((card) => (
          <SummaryCard key={card.id} card={card} />
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.05fr) minmax(420px, 0.95fr)' },
          gap: 2.5,
          alignItems: 'stretch',
        }}
      >
        <ChartCard title="Revenue & Bookings Trend" minHeight={330}>
          <ResponsiveContainer width="100%" height={330}>
            <LineChart data={revenueTrendData} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 4" stroke="#dbe3ee" />
              <XAxis dataKey="label" tickLine={false} axisLine={{ stroke: '#d1d9e4' }} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis yAxisId="left" tickLine={false} axisLine={{ stroke: '#8fa0b5' }} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 8000]} ticks={[0, 2000, 4000, 6000, 8000]} />
              <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={{ stroke: '#8fa0b5' }} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 80]} ticks={[0, 20, 40, 60, 80]} />
              <RechartsTooltip content={(props) => <AnalyticsTooltip {...props} formatter={(value) => (typeof value === 'number' && value < 100 ? Number(value).toLocaleString() : formatCurrency(value))} />} />
              <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
              <Line yAxisId="right" type="monotone" dataKey="bookings" name="Bookings" stroke="#10b981" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Service Distribution" minHeight={330}>
          <ResponsiveContainer width="100%" height={330}>
            <PieChart>
              <Pie data={serviceDistributionData} dataKey="value" nameKey="name" innerRadius={0} outerRadius={128} paddingAngle={0} stroke="#fff" strokeWidth={1.2}>
                {serviceDistributionData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <RechartsTooltip content={(props) => <AnalyticsTooltip {...props} formatter={(value) => `${Number(value || 0)}%`} />} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </Box>

      <ChartCard title="Provider Performance" minHeight={350}>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={providerPerformanceData} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 4" stroke="#dbe3ee" />
            <XAxis dataKey="name" tickLine={false} axisLine={{ stroke: '#cbd5e1' }} tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis tickLine={false} axisLine={{ stroke: '#8fa0b5' }} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 38000]} ticks={[0, 9500, 19000, 28500, 38000]} />
            <RechartsTooltip content={(props) => <AnalyticsTooltip {...props} formatter={(value, name) => (name === 'Revenue ($)' ? formatCurrency(value) : Number(value || 0).toLocaleString())} />} />
            <Legend verticalAlign="bottom" iconType="square" wrapperStyle={{ paddingTop: 18, color: '#5f6f86' }} />
            <Bar dataKey="jobs" name="Completed Jobs" fill="#3b82f6" barSize={16} />
            <Bar dataKey="revenue" name="Revenue ($)" fill="#10b981" barSize={58} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <Card
        elevation={0}
        sx={(theme) => ({
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.divider, 0.85)}`,
          boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04), 0 10px 22px rgba(15, 23, 42, 0.04)',
          backgroundColor: theme.palette.background.paper,
        })}
      >
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Typography sx={{ mb: 2.75, color: '#0f172a', fontSize: '1.25rem', lineHeight: 1.2, fontWeight: 700 }}>
            Top Services by Revenue
          </Typography>

          <Box sx={{ overflowX: 'auto' }}>
            <Box
              component="table"
              sx={{
                width: '100%',
                borderCollapse: 'collapse',
                minWidth: 820,
              }}
            >
              <Box component="thead">
                <Box component="tr">
                  {['Service', 'Total Bookings', 'Revenue', 'Avg. Per Booking'].map((headCell) => (
                    <Box
                      component="th"
                      key={headCell}
                      sx={{
                        textAlign: 'left',
                        py: 1.75,
                        px: 2,
                        backgroundColor: '#f8fbff',
                        color: '#55657b',
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                        borderBottom: '1px solid #e4ebf4',
                      }}
                    >
                      {headCell}
                    </Box>
                  ))}
                </Box>
              </Box>
              <Box component="tbody">
                {topServicesData.map((row) => (
                  <Box
                    component="tr"
                    key={row.service}
                    sx={{
                      '& td': {
                        borderBottom: '1px solid #e4ebf4',
                      },
                    }}
                  >
                    <Box component="td" sx={{ py: 2.2, px: 2 }}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: row.color, flex: '0 0 auto' }} />
                        <Typography sx={{ color: '#0f172a', fontSize: '1rem', fontWeight: 700 }}>{row.service}</Typography>
                      </Stack>
                    </Box>
                    <Box component="td" sx={{ py: 2.2, px: 2, color: '#42546b', fontSize: '1rem' }}>
                      {Number(row.bookings).toLocaleString()}
                    </Box>
                    <Box component="td" sx={{ py: 2.2, px: 2, color: '#0f172a', fontSize: '1rem', fontWeight: 700 }}>
                      {formatCurrency(row.revenue)}
                    </Box>
                    <Box component="td" sx={{ py: 2.2, px: 2, color: '#42546b', fontSize: '1rem' }}>
                      {formatCurrency(row.average)}
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}

export default FinancePage;
