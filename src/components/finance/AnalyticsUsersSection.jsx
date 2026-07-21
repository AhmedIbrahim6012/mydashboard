import { Box, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import PeopleAltRoundedIcon from '@mui/icons-material/PeopleAltRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import HowToRegRoundedIcon from '@mui/icons-material/HowToRegRounded';
// import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
// import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';

function MetricTile({ icon, label, value, sub, subColor, loading }) {
  return (
    <Box
      sx={(theme) => ({
        flex: 1,
        p: 2,
        borderRadius: 2.5,
        border: `1px solid ${alpha(theme.palette.divider, 0.7)}`,
        minWidth: 140,
      })}
    >
      <Stack spacing={1.25}>
        <Box
          sx={{
            width: 36,
            height: 36,
            borderRadius: 1.5,
            display: 'grid',
            placeItems: 'center',
            bgcolor: '#f1f5f9',
            color: '#475467',
            '& svg': { fontSize: 18 },
          }}
        >
          {icon}
        </Box>

        {loading ? (
          <>
            <Skeleton width={60} height={36} />
            <Skeleton width={90} height={16} />
          </>
        ) : (
          <>
            <Typography sx={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', lineHeight: 1, letterSpacing: '-0.03em' }}>
              {value}
            </Typography>
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <Typography sx={{ fontSize: '0.8rem', color: '#64748b' }}>{label}</Typography>
              {sub != null ? (
                <Typography sx={{ fontSize: '0.78rem', fontWeight: 600, color: subColor ?? '#64748b' }}>
                  {sub}
                </Typography>
              ) : null}
            </Stack>
          </>
        )}
      </Stack>
    </Box>
  );
}

/**
 * AnalyticsUsersSection
 * Props:
 *   data    — response.data from GET /admin/analytics/users
 *   loading — boolean
 */
function AnalyticsUsersSection({ data, loading }) {
  const totalUsers  = Number(data?.total_users ?? 0);
  const newUsers    = data?.new_users    ?? {};
  const activeUsers = data?.active_users ?? {};
  const activeRate  = Number(data?.active_user_rate ?? 0);

  const newGrowth    = Number(newUsers.growth ?? 0);
  const activeGrowth = Number(activeUsers.growth ?? 0);

  // Active rate visual: simple fill bar
  const barFillPercent = Math.min(activeRate, 100);

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
          Users Overview
        </Typography>

        <Stack spacing={2.5}>
          {/* Metric tiles */}
          <Stack direction="row" flexWrap="wrap" gap={1.5}>
            <MetricTile
              icon={<PeopleAltRoundedIcon />}
              label="Total Users"
              value={Number(totalUsers).toLocaleString()}
              loading={loading}
            />
            <MetricTile
              icon={<PersonAddRoundedIcon />}
              label="New Users (period)"
              value={Number(newUsers.count ?? 0).toLocaleString()}
              sub={`${newGrowth > 0 ? '+' : ''}${newGrowth}%`}
              subColor={newGrowth > 0 ? '#16a34a' : newGrowth < 0 ? '#dc2626' : '#64748b'}
              loading={loading}
            />
            <MetricTile
              icon={<HowToRegRoundedIcon />}
              label="Active Users (period)"
              value={Number(activeUsers.count ?? 0).toLocaleString()}
              sub={`${activeGrowth > 0 ? '+' : ''}${activeGrowth}%`}
              subColor={activeGrowth > 0 ? '#16a34a' : activeGrowth < 0 ? '#dc2626' : '#64748b'}
              loading={loading}
            />
          </Stack>

          {/* Active rate bar */}
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.75}>
              <Typography sx={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>
                Active User Rate
              </Typography>
              {loading ? (
                <Skeleton width={40} height={20} />
              ) : (
                <Typography sx={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                  {activeRate.toFixed(1)}%
                </Typography>
              )}
            </Stack>
            <Box sx={{ height: 8, borderRadius: 99, bgcolor: '#f1f5f9', overflow: 'hidden' }}>
              {loading ? (
                <Skeleton variant="rectangular" height="100%" width="100%" />
              ) : (
                <Box
                  sx={{
                    height: '100%',
                    width: `${barFillPercent}%`,
                    borderRadius: 99,
                    bgcolor: barFillPercent > 60 ? '#16a34a' : barFillPercent > 30 ? '#f59e0b' : '#ef4444',
                    transition: 'width 0.6s ease',
                  }}
                />
              )}
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default AnalyticsUsersSection;