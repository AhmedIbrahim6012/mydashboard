// import { Box, Card, CardContent, Stack, Typography } from '@mui/material';
// import { alpha } from '@mui/material/styles';

// /**
//  * Dashboard top-row metric card.
//  * @param {Object} props
//  * @param {string} props.title
//  * @param {string|number} props.value
//  * @param {string} props.caption
//  * @param {React.ReactNode} props.icon
//  * @param {'positive'|'warning'|'neutral'} [props.captionTone]
//  */
// function DashboardMetricCard({ title, value, caption, icon, captionTone = 'positive' }) {
//   const captionColor =
//     captionTone === 'positive'
//       ? '#16a34a'
//       : captionTone === 'warning'
//       ? '#b45309'
//       : '#475467';

//   return (
//     <Card
//       elevation={0}
//       sx={(theme) => ({
//         height: '100%',
//         borderRadius: 2.4,
//         border: `1px solid ${alpha('#0f172a', 0.09)}`,
//         backgroundColor: theme.palette.background.paper,
//         boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06), 0 8px 24px rgba(15, 23, 42, 0.05)',
//         transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
//         '&:hover': {
//           transform: 'translateY(-2px)',
//           borderColor: alpha('#2563eb', 0.2),
//           boxShadow: '0 4px 16px rgba(15, 23, 42, 0.1), 0 12px 28px rgba(15, 23, 42, 0.08)',
//         },
//       })}
//     >
//       <CardContent sx={{ p: 2.75, '&:last-child': { pb: 2.75 } }}>
//         <Stack direction="row" justifyContent="space-between" spacing={2.25}>
//           <Box sx={{ minWidth: 0 }}>
//             <Typography sx={{ fontSize: '1.02rem', lineHeight: 1.3, color: '#475467', fontWeight: 500 }}>
//               {title}
//             </Typography>
//             <Typography
//               sx={{
//                 mt: 0.95,
//                 fontSize: '2rem',
//                 lineHeight: 1.06,
//                 fontWeight: 700,
//                 letterSpacing: '-0.03em',
//                 color: '#0f172a',
//               }}
//             >
//               {value}
//             </Typography>
//             <Typography sx={{ mt: 1.05, fontSize: '0.98rem', lineHeight: 1.3, color: captionColor, fontWeight: 500 }}>
//               {caption}
//             </Typography>
//           </Box>

//           <Box
//             sx={{
//               width: 58,
//               height: 58,
//               borderRadius: 1.9,
//               display: 'grid',
//               placeItems: 'center',
//               backgroundColor: alpha('#2f6fec', 0.16),
//               color: '#2563eb',
//               flex: '0 0 auto',
//               '& svg': { fontSize: 30 },
//             }}
//           >
//             {icon}
//           </Box>
//         </Stack>
//       </CardContent>
//     </Card>
//   );
// }

// export default DashboardMetricCard;


import { Box, Card, CardContent, Stack, Typography, useTheme } from '@mui/material';
import { alpha } from '@mui/material/styles';

/**
 * Dashboard top-row metric card.
 * @param {Object} props
 * @param {string} props.title
 * @param {string|number} props.value
 * @param {string} props.caption
 * @param {React.ReactNode} props.icon
 * @param {'positive'|'warning'|'neutral'} [props.captionTone]
 */
function DashboardMetricCard({ title, value, caption, icon, captionTone = 'positive' }) {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';

  const captionColor =
    captionTone === 'positive'
      ? '#16a34a'
      : captionTone === 'warning'
      ? '#b45309'
      : theme.palette.text.secondary;

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        borderRadius: 2.4,
        border: '1px solid',
        borderColor: isDark ? alpha('#94a3b8', 0.15) : alpha('#0f172a', 0.09),
        backgroundColor: 'background.paper',
        boxShadow: isDark
          ? '0 1px 2px rgba(0,0,0,0.3), 0 8px 24px rgba(0,0,0,0.2)'
          : '0 1px 2px rgba(15,23,42,0.06), 0 8px 24px rgba(15,23,42,0.05)',
        transition: 'transform 180ms ease, box-shadow 180ms ease, border-color 180ms ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          borderColor: alpha('#2563eb', 0.3),
          boxShadow: isDark
            ? '0 4px 16px rgba(0,0,0,0.4), 0 12px 28px rgba(0,0,0,0.25)'
            : '0 4px 16px rgba(15,23,42,0.1), 0 12px 28px rgba(15,23,42,0.08)',
        },
      }}
    >
      <CardContent sx={{ p: 2.75, '&:last-child': { pb: 2.75 } }}>
        <Stack direction="row" justifyContent="space-between" spacing={2.25}>
          <Box sx={{ minWidth: 0 }}>
            <Typography sx={{ fontSize: '1.02rem', lineHeight: 1.3, color: 'text.secondary', fontWeight: 500 }}>
              {title}
            </Typography>
            <Typography
              sx={{
                mt: 0.95,
                fontSize: '2rem',
                lineHeight: 1.06,
                fontWeight: 700,
                letterSpacing: '-0.03em',
                color: 'text.primary',
              }}
            >
              {value}
            </Typography>
            <Typography sx={{ mt: 1.05, fontSize: '0.98rem', lineHeight: 1.3, color: captionColor, fontWeight: 500 }}>
              {caption}
            </Typography>
          </Box>

          <Box
            sx={{
              width: 58,
              height: 58,
              borderRadius: 1.9,
              display: 'grid',
              placeItems: 'center',
              backgroundColor: isDark ? alpha('#2f6fec', 0.22) : alpha('#2f6fec', 0.16),
              color: '#2563eb',
              flex: '0 0 auto',
              '& svg': { fontSize: 30 },
            }}
          >
            {icon}
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

export default DashboardMetricCard;