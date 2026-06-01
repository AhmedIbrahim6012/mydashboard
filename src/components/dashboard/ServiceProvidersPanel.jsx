import { Avatar, Box, Card, CardContent, Chip, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import AccessTimeRoundedIcon from '@mui/icons-material/AccessTimeRounded';

function ServiceProvidersPanel({ providers }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 2.4,
        border: `1px solid ${alpha('#0f172a', 0.09)}`,
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.05)',
        height: '100%',
      }}
    >
      <CardContent sx={{ p: 3.25, '&:last-child': { pb: 3.25 } }}>
        <Typography sx={{ fontSize: '2rem', lineHeight: 1.22, color: '#0f172a', fontWeight: 700, mb: 2.35 }}>
          Service Providers
        </Typography>

        <Stack spacing={1.9}>
          {providers.map((provider) => {
            const isAvailable = provider.status === 'available';

            return (
              <Stack
                key={provider.id}
                direction="row"
                alignItems="center"
                spacing={2}
                sx={{
                  border: `1px solid ${alpha('#0f172a', 0.1)}`,
                  borderRadius: 2,
                  p: 1.9,
                  transition: 'border-color 180ms ease, box-shadow 180ms ease, transform 180ms ease',
                  '&:hover': {
                    borderColor: alpha('#2563eb', 0.24),
                    boxShadow: '0 4px 14px rgba(15, 23, 42, 0.08)',
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 58,
                    height: 58,
                    bgcolor: alpha('#2f6fec', 0.16),
                    color: '#245dd8',
                    fontWeight: 700,
                    fontSize: '1.55rem',
                  }}
                >
                  {provider.initials}
                </Avatar>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontSize: '1.33rem', lineHeight: 1.16, color: '#0f172a', fontWeight: 700 }}>
                    {provider.name}
                  </Typography>
                  <Typography sx={{ mt: 0.34, color: '#475467', fontSize: '1.02rem', lineHeight: 1.2 }}>
                    {provider.service}
                  </Typography>
                </Box>

                <Stack alignItems="flex-start" spacing={0.35} sx={{ minWidth: 95 }}>
                  <Stack direction="row" alignItems="center" spacing={0.7}>
                    <StarRoundedIcon sx={{ color: '#fbbf24', fontSize: 22 }} />
                    <Typography sx={{ fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                      {provider.rating.toFixed(1)}
                    </Typography>
                  </Stack>
                  <Typography sx={{ color: '#475467', fontSize: '0.98rem' }}>
                    {provider.jobs} jobs
                  </Typography>
                </Stack>

                <Chip
                  icon={isAvailable ? <CheckCircleOutlineRoundedIcon /> : <AccessTimeRoundedIcon />}
                  label={isAvailable ? 'Available' : 'Busy'}
                  variant="outlined"
                  sx={{
                    height: 36,
                    borderRadius: 20,
                    fontSize: '0.98rem',
                    fontWeight: 500,
                    color: isAvailable ? '#15803d' : '#b45309',
                    borderColor: alpha(isAvailable ? '#22c55e' : '#f59e0b', 0.5),
                    backgroundColor: alpha(isAvailable ? '#22c55e' : '#f59e0b', 0.1),
                    '& .MuiChip-icon': {
                      color: isAvailable ? '#16a34a' : '#d97706',
                      fontSize: 21,
                    },
                  }}
                />
              </Stack>
            );
          })}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default ServiceProvidersPanel;
