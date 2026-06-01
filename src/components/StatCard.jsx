import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

function StatCard({
  title,
  value,
  helperText,
  icon,
  accent = '#4f46e5',
  trendText,
  trendTone = 'positive',
  cardState = 'default',
  helperBadge,
}) {
  const { t } = useTranslation();
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const isAcceptedLike = cardState === 'accepted' || cardState === 'confirmed';
  const trendColor =
    trendTone === 'positive'
      ? 'success.main'
      : trendTone === 'negative'
      ? 'error.main'
      : 'text.secondary';

  const borderColor = alpha(theme.palette.divider, isDark ? 0.7 : 1);
  const cardBg = isAcceptedLike
    ? `radial-gradient(circle at 86% 10%, ${alpha(accent, 0.14)} 0%, transparent 34%), radial-gradient(circle at 12% 88%, ${alpha(accent, 0.08)} 0%, transparent 40%), linear-gradient(160deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, isDark ? 0.06 : 0.03)} 100%)`
    : `linear-gradient(160deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.primary.main, isDark ? 0.03 : 0.015)} 100%)`;
  const iconBg = isDark
    ? `linear-gradient(180deg, ${alpha(accent, 0.18)} 0%, ${alpha(accent, 0.08)} 100%)`
    : `linear-gradient(180deg, ${alpha(accent, 0.16)} 0%, ${alpha(accent, 0.08)} 100%)`;
  const badgeBg = isDark ? alpha(accent, 0.14) : alpha(accent, 0.08);

  return (
    <Box sx={{ height: '100%' }}>
      <Card
        elevation={0}
        sx={{
          height: '100%',
          border: `1px solid ${borderColor}`,
          background: cardBg,
          borderRadius: 3,
          boxShadow: `0 10px 30px ${alpha(isDark ? '#000000' : '#0f172a', isDark ? 0.26 : 0.08)}`,
          transition:
            'background 420ms ease, box-shadow 420ms ease, border-color 320ms ease, color 240ms ease',
          '&:hover': {
            borderColor: alpha(accent, isDark ? 0.5 : 0.42),
            boxShadow: `0 14px 36px ${alpha(isDark ? '#000000' : '#0f172a', isDark ? 0.34 : 0.12)}`,
          },
        }}
      >
        <CardContent sx={{ p: 2.75, height: '100%' }}>
          <Stack spacing={2.25} sx={{ height: '100%' }}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: 'text.secondary', letterSpacing: 0.2 }}>
                  {title}
                </Typography>
                <Typography
                  variant="h3"
                  sx={{
                    mt: 0.75,
                    fontWeight: 700,
                    letterSpacing: '-0.04em',
                    fontSize: 'clamp(1.8rem, 2.5vw, 2.7rem)',
                    lineHeight: 1.05,
                    wordBreak: 'break-word',
                  }}
                >
                  {value}
                </Typography>
              </Box>

              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2.5,
                  background: iconBg,
                  color: accent,
                  display: 'grid',
                  placeItems: 'center',
                  flex: '0 0 auto',
                  boxShadow: `inset 0 1px 0 ${alpha('#ffffff', isDark ? 0.06 : 0.6)}`,
                  '& svg': { fontSize: 30 },
                }}
              >
                {icon}
              </Box>
            </Stack>

            {trendText ? (
              <Typography variant="body1" sx={{ color: trendColor, fontWeight: 600 }}>
                {trendText}
              </Typography>
            ) : helperText ? (
              <Typography variant="body1" color="text.secondary" sx={{ fontWeight: 500 }}>
                {helperText}
              </Typography>
            ) : null}

            {helperBadge ? (
              <Box
                sx={{
                  alignSelf: 'flex-start',
                  px: 1.25,
                  py: 0.6,
                  borderRadius: 999,
                  bgcolor: badgeBg,
                  color: accent,
                  fontSize: '0.78rem',
                  fontWeight: 700,
                }}
              >
                {helperBadge}
              </Box>
            ) : null}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}

export default StatCard;