import { Box, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

function PageHeader({ title, subtitle, actions }) {
  const theme = useTheme();
  const isRtl = theme.direction === 'rtl';

  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: isRtl ? 'flex-end' : 'flex-start', md: 'center' }}
      spacing={2}
      sx={{ mb: 3 }}
    >
      <Box sx={{ textAlign: isRtl ? 'right' : 'left' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, letterSpacing: '-0.03em' }}>
          {title}
        </Typography>
        {subtitle ? (
          <Typography variant="body1" color="text.secondary" sx={{ mt: 0.75, maxWidth: 720 }}>
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      {actions ? <Box>{actions}</Box> : null}
    </Stack>
  );
}

export default PageHeader;
