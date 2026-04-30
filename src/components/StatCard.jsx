import { alpha, Card, CardContent, Stack, Typography } from '@mui/material';
// const dynamicFontSize = (text) => {
//   if (text.length > 20) return '1.2rem';
//   if (text.length > 10) return '1.6rem';
//   return '2.2rem';
// };
function StatCard({ title, value, helperText, icon, accent = '#4f46e5' }) {
  return (
    <Card
      elevation={0}
      sx={(theme) => ({
        height: '100%',
        border: `1px solid ${alpha(theme.palette.divider, 0.8)}`,
        background: `linear-gradient(145deg, ${alpha(accent, 0.16)}, ${theme.palette.background.paper} 70%)`,
        borderRadius: 2,
      })}
    >
  
      <CardContent>
        <Stack spacing={2}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ color: 'text.secondary' }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, letterSpacing: 0.4 }}>
              {title}
            </Typography>
            {icon}
          </Stack>
          {<Typography variant="h3" sx={{ fontWeight: 350, letterSpacing: '-0.04em'   
,fontSize: 'clamp(1.5rem, 2.5vw, 2.5rem)',
    wordBreak: 'break-word',}}>
            {value}
          </Typography> 
         }
          {helperText ? (
            <Typography variant="body2" color="text.secondary">
              {helperText}
            </Typography>
          ) : null}
        </Stack>
      </CardContent>
    </Card>
  );
}

export default StatCard;
