import { Box, Card, CardContent, Skeleton, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import HandymanRoundedIcon from '@mui/icons-material/HandymanRounded';
import PersonAddRoundedIcon from '@mui/icons-material/PersonAddRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import SignalCellularAltRoundedIcon from '@mui/icons-material/SignalCellularAltRounded';

function MetricTile({ icon, iconColor, iconBg, label, value, sub, subColor, loading }) {
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
            bgcolor: iconBg ?? '#f1f5f9',
            color: iconColor ?? '#475467',
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
 * AnalyticsProvidersSection
 * Props:
 *   data    — response.data from GET /admin/analytics/providers
 *   loading — boolean
 */
function AnalyticsProvidersSection({ data, loading }) {
  const totalProviders    = Number(data?.total_providers ?? 0);
  const newProviders      = data?.new_providers      ?? {};
  const activeProviders   = data?.active_providers   ?? {};
  const availableProviders = Number(data?.available_providers ?? 0);
  const activeRate        = Number(data?.active_providers_rate ?? 0);

  const newGrowth    = Number(newProviders.growth ?? 0);
  const activeGrowth = Number(activeProviders.growth ?? 0);

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
          Providers Overview
        </Typography>

        <Stack spacing={2.5}>
          {/* Metric tiles */}
          <Stack direction="row" flexWrap="wrap" gap={1.5}>
            <MetricTile
              icon={<HandymanRoundedIcon />}
              iconColor="#a855f7"
              iconBg="#f3e8ff"
              label="Total Providers"
              value={Number(totalProviders).toLocaleString()}
              loading={loading}
            />
            <MetricTile
              icon={<PersonAddRoundedIcon />}
              iconColor="#2563eb"
              iconBg="#dbeafe"
              label="New Providers (period)"
              value={Number(newProviders.count ?? 0).toLocaleString()}
              sub={`${newGrowth > 0 ? '+' : ''}${newGrowth}%`}
              subColor={newGrowth > 0 ? '#16a34a' : newGrowth < 0 ? '#dc2626' : '#64748b'}
              loading={loading}
            />
            <MetricTile
              icon={<CheckCircleRoundedIcon />}
              iconColor="#16a34a"
              iconBg="#dcfce7"
              label="Active Providers (period)"
              value={Number(activeProviders.count ?? 0).toLocaleString()}
              sub={`${activeGrowth > 0 ? '+' : ''}${activeGrowth}%`}
              subColor={activeGrowth > 0 ? '#16a34a' : activeGrowth < 0 ? '#dc2626' : '#64748b'}
              loading={loading}
            />
            <MetricTile
              icon={<SignalCellularAltRoundedIcon />}
              iconColor="#f59e0b"
              iconBg="#fef3c7"
              label="Available Now"
              value={Number(availableProviders).toLocaleString()}
              loading={loading}
            />
          </Stack>

          {/* Active rate bar */}
          <Box>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={0.75}>
              <Typography sx={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500 }}>
                Active Provider Rate
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
                    width: `${Math.min(activeRate, 100)}%`,
                    borderRadius: 99,
                    bgcolor: activeRate > 60 ? '#16a34a' : activeRate > 30 ? '#f59e0b' : '#ef4444',
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

export default AnalyticsProvidersSection;