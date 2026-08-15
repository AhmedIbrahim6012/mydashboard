// import {
//   Box, Button, Card, CardContent, Chip, Skeleton, Stack,
//   Table, TableBody, TableCell, TableContainer,
//   TableHead, TableRow, Typography,
// } from '@mui/material';
// import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
// import { useMediaQuery } from '@mui/material';
// import { useTheme } from '@mui/material/styles';
// import { useTranslation } from 'react-i18next';

// const statusStyles = {
//   pending:    { color: '#b45309', background: '#fff7ed', border: '#fed7aa' },
//   confirmed:  { color: '#1d4ed8', background: '#eff6ff', border: '#bfdbfe' },
//   'in-transit': { color: '#7c3aed', background: '#f5f3ff', border: '#ddd6fe' },
//   completed:  { color: '#15803d', background: '#f0fdf4', border: '#bbf7d0' },
//   cancelled:  { color: '#b91c1c', background: '#fef2f2', border: '#fecaca' },
// };

// function StatusChip({ status }) {
//   const style = statusStyles[status] || statusStyles.pending;
//   return (
//     <Chip label={status} size="small" sx={{
//       fontWeight: 700, textTransform: 'capitalize', borderRadius: 999,
//       backgroundColor: style.background, color: style.color, border: `1px solid ${style.border}`,
//     }} />
//   );
// }

// function OrdersTable({ orders, loading, onViewOrder }) {
//   const theme = useTheme();
//   const isCompact = useMediaQuery(theme.breakpoints.down('md'));
//   const { t } = useTranslation();

//   if (loading) {
//     return (
//       <Stack spacing={1.5}>
//         {[1,2,3,4,5].map((i) => <Skeleton key={i} variant="rounded" height={56} sx={{ borderRadius: 2 }} />)}
//       </Stack>
//     );
//   }

//   if (orders.length === 0) {
//     return (
//       <Card elevation={0} sx={(th) => ({ borderRadius: 3, border: `1px solid ${th.palette.divider}` })}>
//         <CardContent sx={{ py: 7, textAlign: 'center' }}>
//           <Typography variant="h6" sx={{ fontWeight: 800 }}>{t('orders.empty.title')}</Typography>
//           <Typography color="text.secondary" sx={{ mt: 1 }}>{t('orders.empty.subtitle')}</Typography>
//         </CardContent>
//       </Card>
//     );
//   }

//   if (isCompact) {
//     return (
//       <Stack spacing={1.5}>
//         {orders.map((order) => (
//           <Card key={order.id} elevation={0} sx={(th) => ({ borderRadius: 3, border: `1px solid ${th.palette.divider}` })}>
//             <CardContent sx={{ p: 2.25 }}>
//               <Stack spacing={1.5}>
//                 <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
//                   <Box>
//                     <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
//                       #{order.order_number}
//                     </Typography>
//                     <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.25 }}>{order.title}</Typography>
//                     <Typography variant="body2" color="text.secondary">
//                       {(order.providers || []).map((p) => p.name).join(', ') || '—'}
//                     </Typography>
//                   </Box>
//                   <StatusChip status={order.status} />
//                 </Stack>
//                 <Stack direction="row" justifyContent="space-between" alignItems="center">
//                   <Typography variant="caption" color="text.secondary">
//                     {new Date(order.created_at).toLocaleDateString()}
//                   </Typography>
//                   <Button variant="outlined" size="small"
//                     startIcon={<VisibilityRoundedIcon />}
//                     onClick={() => onViewOrder(order)}
//                     sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}>
//                     {t('orders.table.viewDetails')}
//                   </Button>
//                 </Stack>
//               </Stack>
//             </CardContent>
//           </Card>
//         ))}
//       </Stack>
//     );
//   }

//   return (
//     <TableContainer component={Card} elevation={0} sx={(th) => ({ borderRadius: 3, border: `1px solid ${th.palette.divider}` })}>
//       <Table>
//         <TableHead>
//           <TableRow>
//             {['Order #', 'Title', 'Providers', 'Status', 'Date', ''].map((h, i) => (
//               <TableCell key={i} sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }}>{h}</TableCell>
//             ))}
//           </TableRow>
//         </TableHead>
//         <TableBody>
//           {orders.map((order) => (
//             <TableRow key={order.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
//               <TableCell>
//                 <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>
//                   {order.order_number}
//                 </Typography>
//               </TableCell>
//               <TableCell>
//                 <Typography sx={{ fontWeight: 700 }}>{order.title}</Typography>
//               </TableCell>
//               <TableCell>
//                 <Stack spacing={0.5}>
//                   {(order.providers || []).slice(0, 2).map((p) => (
//                     <Typography key={p.id} variant="body2" sx={{ fontWeight: 600 }}>{p.name}</Typography>
//                   ))}
//                   {(order.providers || []).length > 2 && (
//                     <Typography variant="caption" color="text.secondary">
//                       +{order.providers.length - 2} more
//                     </Typography>
//                   )}
//                 </Stack>
//               </TableCell>
//               <TableCell><StatusChip status={order.status} /></TableCell>
//               <TableCell>
//                 <Typography variant="body2" color="text.secondary">
//                   {new Date(order.created_at).toLocaleDateString()}
//                 </Typography>
//               </TableCell>
//               <TableCell>
//                 <Button variant="text" size="small"
//                   startIcon={<VisibilityRoundedIcon />}
//                   onClick={() => onViewOrder(order)}
//                   sx={{ textTransform: 'none', fontWeight: 700 }}>
//                   {t('orders.table.viewDetails')}
//                 </Button>
//               </TableCell>
//             </TableRow>
//           ))}
//         </TableBody>
//       </Table>
//     </TableContainer>
//   );
// }

// export default OrdersTable;

import {
  Avatar, Box, Button, Card, CardContent, Chip, Skeleton, Stack,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography,
} from '@mui/material';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const statusStyles = {
  pending:    { color: '#b45309', background: '#fff7ed', border: '#fed7aa' },
  confirmed:  { color: '#1d4ed8', background: '#eff6ff', border: '#bfdbfe' },
  'in-transit': { color: '#7c3aed', background: '#f5f3ff', border: '#ddd6fe' },
  completed:  { color: '#15803d', background: '#f0fdf4', border: '#bbf7d0' },
  cancelled:  { color: '#b91c1c', background: '#fef2f2', border: '#fecaca' },
};

// type الجديد اللي رجع من الـ API: service | custom
const typeStyles = {
  service: { color: '#0369a1', background: '#f0f9ff', border: '#bae6fd' },
  custom:  { color: '#7c3aed', background: '#f5f3ff', border: '#ddd6fe' },
};

function StatusChip({ status }) {
  const style = statusStyles[status] || statusStyles.pending;
  return (
    <Chip label={status} size="small" sx={{
      fontWeight: 700, textTransform: 'capitalize', borderRadius: 999,
      backgroundColor: style.background, color: style.color, border: `1px solid ${style.border}`,
    }} />
  );
}

function TypeChip({ type }) {
  const style = typeStyles[type] || typeStyles.service;
  return (
    <Chip label={type || '—'} size="small" variant="outlined" sx={{
      fontWeight: 700, textTransform: 'capitalize', borderRadius: 999,
      backgroundColor: style.background, color: style.color, border: `1px solid ${style.border}`,
    }} />
  );
}

// عرض بيانات العميل (order.user) بشكل موحّد Avatar + الاسم
function CustomerCell({ user }) {
  if (!user) return <Typography variant="body2" color="text.secondary">—</Typography>;
  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Avatar src={user.image?.image_url} sx={{ width: 28, height: 28, fontSize: '0.8rem' }}>
        {user.name?.[0]}
      </Avatar>
      <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
        {user.name || '—'}
      </Typography>
    </Stack>
  );
}

function OrdersTable({ orders, loading, onViewOrder }) {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();

  if (loading) {
    return (
      <Stack spacing={1.5}>
        {[1,2,3,4,5].map((i) => <Skeleton key={i} variant="rounded" height={56} sx={{ borderRadius: 2 }} />)}
      </Stack>
    );
  }

  if (orders.length === 0) {
    return (
      <Card elevation={0} sx={(th) => ({ borderRadius: 3, border: `1px solid ${th.palette.divider}` })}>
        <CardContent sx={{ py: 7, textAlign: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>{t('orders.empty.title')}</Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>{t('orders.empty.subtitle')}</Typography>
        </CardContent>
      </Card>
    );
  }

  if (isCompact) {
    return (
      <Stack spacing={1.5}>
        {orders.map((order) => (
          <Card key={order.id} elevation={0} sx={(th) => ({ borderRadius: 3, border: `1px solid ${th.palette.divider}` })}>
            <CardContent sx={{ p: 2.25 }}>
              <Stack spacing={1.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                  <Box sx={{ minWidth: 0 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>
                        #{order.order_number}
                      </Typography>
                      <TypeChip type={order.type} />
                    </Stack>
                    <Typography variant="h6" sx={{ fontWeight: 800, mt: 0.25 }}>{order.title}</Typography>
                    <Box sx={{ mt: 0.5 }}>
                      <CustomerCell user={order.user} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {(order.providers || []).map((p) => p.name).join(', ') || '—'}
                    </Typography>
                  </Box>
                  <StatusChip status={order.status} />
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="caption" color="text.secondary">
                    {new Date(order.created_at).toLocaleDateString()}
                  </Typography>
                  <Button variant="outlined" size="small"
                    startIcon={<VisibilityRoundedIcon />}
                    onClick={() => onViewOrder(order)}
                    sx={{ borderRadius: 2.5, textTransform: 'none', fontWeight: 700 }}>
                    {t('orders.table.viewDetails')}
                  </Button>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
    );
  }

  return (
    <TableContainer component={Card} elevation={0} sx={(th) => ({ borderRadius: 1.5, border: `1px solid ${th.palette.divider}` })}>
      <Table>
        <TableHead>
          <TableRow>
            {['Order #', 'Title', 'Type', 'Customer', 'Providers', 'Status', 'Date', ''].map((h, i) => (
              <TableCell key={i} sx={{ fontWeight: 700, color: 'text.secondary', fontSize: '0.8rem' }}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id} hover sx={{ '&:last-child td': { borderBottom: 0 } }}>
              <TableCell>
                <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: 'monospace' }}>
                  {order.order_number}
                </Typography>
              </TableCell>
              <TableCell>
                <Typography sx={{ fontWeight: 700 }}>{order.title}</Typography>
                {order.note && (
                  <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', maxWidth: 180 }}>
                    {order.note}
                  </Typography>
                )}
              </TableCell>
              <TableCell><TypeChip type={order.type} /></TableCell>
              <TableCell><CustomerCell user={order.user} /></TableCell>
              <TableCell>
                <Stack spacing={0.5}>
                  {(order.providers || []).slice(0, 2).map((p) => (
                    <Typography key={p.id} variant="body2" sx={{ fontWeight: 600 }}>{p.name}</Typography>
                  ))}
                  {(order.providers || []).length > 2 && (
                    <Typography variant="caption" color="text.secondary">
                      +{order.providers.length - 2} more
                    </Typography>
                  )}
                  {(order.providers || []).length === 0 && (
                    <Typography variant="body2" color="text.secondary">—</Typography>
                  )}
                </Stack>
              </TableCell>
              <TableCell><StatusChip status={order.status} /></TableCell>
              <TableCell>
                <Typography variant="body2" color="text.secondary">
                  {new Date(order.created_at).toLocaleDateString()}
                </Typography>
              </TableCell>
              <TableCell>
                <Button variant="text" size="small"
                  startIcon={<VisibilityRoundedIcon />}
                  onClick={() => onViewOrder(order)}
                  sx={{ textTransform: 'none', fontWeight: 700 }}>
                  {t('orders.table.viewDetails')}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default OrdersTable;