import { Box, Stack } from '@mui/material';
import AttachMoneyRoundedIcon from '@mui/icons-material/AttachMoneyRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import { useTranslation } from 'react-i18next';
import PageHeader from '../components/PageHeader';
import DashboardMetricCard from '../components/dashboard/DashboardMetricCard';
import RevenueOverviewChart from '../components/dashboard/RevenueOverviewChart';
import ServiceProvidersPanel from '../components/dashboard/ServiceProvidersPanel';
import RecentBookingsTable from '../components/dashboard/RecentBookingsTable';

const summaryCards = [
  {
    id: 'revenue',
    title: 'Total Revenue',
    value: '$47,860',
    caption: '+12.5% from last month',
    captionTone: 'positive',
    icon: <AttachMoneyRoundedIcon fontSize="small" />,
  },
  {
    id: 'bookings',
    title: 'Active Bookings',
    value: '124',
    caption: '+8.2% from last week',
    captionTone: 'positive',
    icon: <CalendarMonthRoundedIcon fontSize="small" />,
  },
  {
    id: 'customers',
    title: 'Total Customers',
    value: '1,284',
    caption: '+5.1% from last month',
    captionTone: 'positive',
    icon: <GroupOutlinedIcon fontSize="small" />,
  },
  {
    id: 'rating',
    title: 'Avg. Rating',
    value: '4.8',
    caption: 'Steady performance',
    captionTone: 'neutral',
    icon: <TrendingUpRoundedIcon fontSize="small" />,
  },
];

const revenueSeries = [
  { month: 'Jan', value: 4200 },
  { month: 'Feb', value: 3800 },
  { month: 'Mar', value: 5100 },
  { month: 'Apr', value: 4600 },
  { month: 'May', value: 6300 },
  { month: 'Jun', value: 5900 },
  { month: 'Jul', value: 7200 },
  { month: 'Aug', value: 6800 },
  { month: 'Sep', value: 7500 },
  { month: 'Oct', value: 8300 },
  { month: 'Nov', value: 8000 },
  { month: 'Dec', value: 9100 },
];

const serviceProviders = [
  {
    id: 'provider-1',
    initials: 'M',
    name: 'Mike Johnson',
    service: 'Plumbing',
    rating: 4.8,
    jobs: 156,
    status: 'available',
  },
  {
    id: 'provider-2',
    initials: 'C',
    name: 'Clean Team Co.',
    service: 'House Cleaning',
    rating: 4.9,
    jobs: 289,
    status: 'busy',
  },
  {
    id: 'provider-3',
    initials: 'T',
    name: 'Tom Electric',
    service: 'Electrical',
    rating: 4.7,
    jobs: 203,
    status: 'available',
  },
];

const recentBookings = [
  {
    id: '#BK001',
    customer: 'John Smith',
    service: 'Plumbing Repair',
    provider: 'Mike Johnson',
    dateTime: '2026-05-08 10:00 AM',
    status: 'confirmed',
    amount: '$150',
  },
  {
    id: '#BK002',
    customer: 'Sarah Williams',
    service: 'House Cleaning',
    provider: 'Clean Team Co.',
    dateTime: '2026-05-09 2:00 PM',
    status: 'pending',
    amount: '$120',
  },
  {
    id: '#BK003',
    customer: 'Robert Brown',
    service: 'Electrical Work',
    provider: 'Tom Electric',
    dateTime: '2026-05-07 9:00 AM',
    status: 'completed',
    amount: '$280',
  },
  {
    id: '#BK004',
    customer: 'Emily Davis',
    service: 'Lawn Care',
    provider: 'Green Gardens',
    dateTime: '2026-05-10 11:00 AM',
    status: 'confirmed',
    amount: '$90',
  },
  {
    id: '#BK005',
    customer: 'Michael Wilson',
    service: 'AC Repair',
    provider: 'Cool Air Services',
    dateTime: '2026-05-06 3:00 PM',
    status: 'cancelled',
    amount: '$200',
  },
];

function DashboardPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  return (
    <Stack spacing={3} dir={isRtl ? 'rtl' : 'ltr'}>
      <PageHeader
        title={t('dashboard.title', { defaultValue: 'Dashboard' })}
        subtitle={t('dashboard.welcome', { defaultValue: "Welcome back! Here's what's happening today." })}
      />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' },
          gap: 2.5,
          alignItems: 'stretch',
        }}
      >
        {summaryCards.map((card) => (
          <DashboardMetricCard
            key={card.id}
            title={card.title}
            value={card.value}
            caption={card.caption}
            captionTone={card.captionTone}
            icon={card.icon}
          />
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1.03fr) minmax(380px, 0.97fr)' },
          gap: 2.5,
          alignItems: 'stretch',
        }}
      >
        <RevenueOverviewChart data={revenueSeries} />
        <ServiceProvidersPanel providers={serviceProviders} />
      </Box>

      <RecentBookingsTable bookings={recentBookings} />
    </Stack>
  );
}

export default DashboardPage;
