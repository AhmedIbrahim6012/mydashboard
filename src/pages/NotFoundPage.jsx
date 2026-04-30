import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

function NotFoundPage() {
  return (
    <Card elevation={0} sx={(theme) => ({ borderRadius: 4, border: `1px solid ${theme.palette.divider}` })}>
      <CardContent sx={{ p: 5 }}>
        <Stack spacing={2.5} alignItems="flex-start">
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Page not found
          </Typography>
          <Typography color="text.secondary">
            The page you are looking for does not exist or has moved.
          </Typography>
          <Button component={RouterLink} to="/dashboard" variant="contained">
            Return to dashboard
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default NotFoundPage;
