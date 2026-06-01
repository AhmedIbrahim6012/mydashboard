import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function NotFoundPage() {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  return (
    <Card elevation={0} sx={(theme) => ({ borderRadius: 4, border: `1px solid ${theme.palette.divider}` })}>
      <CardContent sx={{ p: 5 }}>
        <Stack spacing={2.5} alignItems={isRtl ? 'flex-end' : 'flex-start'}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            {t('notFound.title', { defaultValue: 'Page not found' })}
          </Typography>
          <Typography color="text.secondary">
            {t('notFound.subtitle', { defaultValue: 'The page you are looking for does not exist or has moved.' })}
          </Typography>
          <Button component={RouterLink} to="/dashboard" variant="contained">
            {t('notFound.back', { defaultValue: 'Return to dashboard' })}
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default NotFoundPage;
