// import React from 'react';
// import {
//   Box,
//   Chip,
//   CircularProgress,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   IconButton,
//   Stack,
//   Typography,
//   Zoom,
//   Divider,
//   useTheme,
// } from '@mui/material';
// import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
// import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
// import StarRoundedIcon from '@mui/icons-material/StarRounded';

// // --- مكون فرعي: لتنسيق الحاويات المشتركة وتقليل التكرار ---
// const SectionCard = ({ title, children, ...props }) => (
//   <Box
//     sx={(theme) => ({
//       p: 2.5,
//       borderRadius: 3,
//       border: `1px solid ${theme.palette.divider}`,
//       bgcolor: 'background.paper',
//       transition: 'box-shadow 0.2s ease-in-out',
//       '&:hover': {
//         boxShadow: theme.shadows[1],
//       },
//     })}
//     {...props}
//   >
//     {title && (
//       <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2 }}>
//         {title}
//       </Typography>
//     )}
//     {children}
//   </Box>
// );

// // --- مكون فرعي: لعرض تفاصيل النصوص ---
// function DetailRow({ label, value }) {
//   return (
//     <Stack spacing={0.5}>
//       <Typography
//         variant="caption"
//         color="text.secondary"
//         sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}
//       >
//         {label}
//       </Typography>
//       <Typography variant="body2" sx={{ fontWeight: 600 }}>
//         {value || '—'}
//       </Typography>
//     </Stack>
//   );
// }

// // --- مكون فرعي: لقائمة المزودين ---
// const ProvidersList = ({ providers = [] }) => (
//   <SectionCard title={`Providers (${providers.length})`}>
//     <Stack spacing={1.5}>
//       {providers.length > 0 ? (
//         providers.map((p) => (
//           <Stack
//             key={p.id}
//             direction="row"
//             justifyContent="space-between"
//             alignItems="center"
//             sx={(theme) => ({
//               p: 1.5,
//               borderRadius: 2,
//               bgcolor: theme.palette.action.hover,
//               border: `1px solid ${theme.palette.action.selected}`,
//             })}
//           >
//             <Box>
//               <Typography variant="body2" sx={{ fontWeight: 700 }}>
//                 {p.name || '—'}
//               </Typography>
//               <Typography variant="caption" color="text.secondary">
//                 ID #{p.id}
//               </Typography>
//             </Box>

//             <Stack alignItems="flex-end" spacing={0.75}>
//               <Chip
//                 label={p.status || '—'}
//                 size="small"
//                 color={p.status === 'accepted' ? 'success' : 'default'}
//                 sx={{ fontWeight: 700, textTransform: 'capitalize' }}
//               />
//               <Stack direction="row" spacing={0.5} alignItems="center">
//                 <StarRoundedIcon sx={{ fontSize: 16, color: 'warning.main' }} />
//                 <Typography variant="caption" sx={{ fontWeight: 700 }}>
//                   {p.rating ?? 0}
//                 </Typography>
//               </Stack>
//             </Stack>
//           </Stack>
//         ))
//       ) : (
//         <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
//           No providers available
//         </Typography>
//       )}
//     </Stack>
//   </SectionCard>
// );

// // --- المكون الرئيسي للمنبثقة ---
// function OrderDetailsDialog({ open, order, loading, onClose }) {
//   const theme = useTheme();
  
//   if (!open) return null;

//   const images = order?.images || [];
//   const providers = order?.providers || [];
//   const isDialogLoading = loading || order?._loading;

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       maxWidth="md"
//       fullWidth
//       TransitionComponent={Zoom} // إضافة تأثير دخول ناعم واحترافي
//       slotProps={{
//         paper: {
//           sx: { 
//             borderRadius: 4,
//             backgroundImage: 'none', // يمنع تداخل الخلفيات في الـ Dark Mode
//           }
//         }
//       }}
//     >
//       {/* الرأس (Header) */}
//       <DialogTitle sx={{ p: 3, pb: 2 }}>
//         <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
//           <Stack direction="row" spacing={2} alignItems="center">
//             <Box
//               sx={{
//                 width: 48,
//                 height: 48,
//                 borderRadius: 3,
//                 display: 'grid',
//                 placeItems: 'center',
//                 bgcolor: 'primary.main',
//                 color: 'primary.contrastText',
//                 boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
//               }}
//             >
//               <ReceiptLongRoundedIcon fontSize="medium" />
//             </Box>

//             <Box>
//               <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
//                 Order Details
//               </Typography>
//               <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
//                 {isDialogLoading ? 'Loading details...' : `#${order?.order_number || '—'}`}
//               </Typography>
//             </Box>
//           </Stack>

//           <IconButton 
//             onClick={onClose}
//             sx={{ 
//               bgcolor: 'action.hover',
//               '&:hover': { bgcolor: 'action.selected' }
//             }}
//           >
//             <CloseRoundedIcon />
//           </IconButton>
//         </Stack>
//       </DialogTitle>

//       <Divider />

//       {/* المحتوى (Content) */}
//       <DialogContent sx={{ p: 3, mt: 1 }}>
//         {isDialogLoading ? (
//           <Stack alignItems="center" justifyContent="center" sx={{ py: 8 }}>
//             <CircularProgress size={40} thickness={4} />
//           </Stack>
//         ) : order ? (
//           <Stack spacing={3}>
            
//             {/* بطاقة العنوان العلوية الـ Gradient */}
//             <Box
//               sx={{
//                 borderRadius: 3,
//                 p: 3,
//                 color: 'primary.contrastText',
//                 background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 60%, ${theme.palette.secondary.main} 100%)`,
//                 boxShadow: `0 6px 20px ${theme.palette.primary.main}25`,
//               }}
//             >
//               <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems={{ xs: 'flex-start', sm: 'center' }} spacing={2}>
//                 <Box>
//                   <Typography variant="caption" sx={{ opacity: 0.8, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>
//                     Order Title
//                   </Typography>
//                   <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
//                     {order.title || '—'}
//                   </Typography>
//                 </Box>

//                 <Chip
//                   label={order.status || '—'}
//                   sx={{
//                     bgcolor: 'rgba(255, 255, 255, 0.25)',
//                     color: '#fff',
//                     fontWeight: 700,
//                     textTransform: 'capitalize',
//                     backdropFilter: 'blur(4px)',
//                     px: 1,
//                   }}
//                 />
//               </Stack>
//             </Box>

//             {/* معلومات الطلب والمزودين في شبكة مرنة */}
//             <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
//               <Box sx={{ flex: 1 }}>
//                 <SectionCard title="Order Info">
//                   <Stack spacing={2}>
//                     <DetailRow label="Order Number" value={order.order_number} />
//                     <DetailRow label="Status" value={order.status} />
//                     <DetailRow
//                       label="Created At"
//                       value={order.created_at ? new Date(order.created_at).toLocaleString() : null}
//                     />
//                     <DetailRow label="Internal Note" value={order.note} />
//                   </Stack>
//                 </SectionCard>
//               </Box>

//               <Box sx={{ flex: 1 }}>
//                 <ProvidersList providers={providers} />
//               </Box>
//             </Stack>

//             {/* صور الطلب */}
//             {images.length > 0 && (
//               <SectionCard title="Order Images">
//                 <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ rowGap: 2 }}>
//                   {images.map((img, index) => (
//                     <Box
//                       key={index}
//                       component="img"
//                       src={img.image_url}
//                       alt={`order-attachment-${index + 1}`}
//                       sx={{
//                         width: 110,
//                         height: 110,
//                         borderRadius: 2.5,
//                         objectFit: 'cover',
//                         border: `1px solid ${theme.palette.divider}`,
//                         transition: 'transform 0.2s',
//                         '&:hover': {
//                           transform: 'scale(1.04)',
//                           cursor: 'pointer',
//                         },
//                       }}
//                     />
//                   ))}
//                 </Stack>
//               </SectionCard>
//             )}

//             {/* تفاصيل الخدمة */}
//             {order.service && (
//               <SectionCard title="Service Details">
//                 <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} alignItems="flex-start">
//                   {order.service.image_url && (
//                     <Box
//                       component="img"
//                       src={order.service.image_url}
//                       alt={order.service.title}
//                       sx={{
//                         width: 90,
//                         height: 90,
//                         borderRadius: 2.5,
//                         objectFit: 'cover',
//                         flexShrink: 0,
//                         border: `1px solid ${theme.palette.divider}`,
//                       }}
//                     />
//                   )}

//                   <Stack spacing={1} sx={{ flex: 1 }}>
//                     <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
//                       {order.service.title || '—'}
//                     </Typography>

//                     <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
//                       {order.service.description || '—'}
//                     </Typography>

//                     <Typography variant="h6" sx={{ fontWeight: 800, color: 'success.main', mt: 1 }}>
//                       ${Number(order.service.price || 0).toFixed(2)}
//                     </Typography>
//                   </Stack>
//                 </Stack>
//               </SectionCard>
//             )}

//             {/* الوصف الإضافي */}
//             {order.description && (
//               <SectionCard title="Description">
//                 <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
//                   {order.description}
//                 </Typography>
//               </SectionCard>
//             )}
//           </Stack>
//         ) : (
//           <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
//             No order details found.
//           </Typography>
//         )}
//       </DialogContent>
//     </Dialog>
//   );
// }

// export default OrderDetailsDialog;

import React from 'react';
import {
  Avatar,
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  Zoom,
  Divider,
  useTheme,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ReceiptLongRoundedIcon from '@mui/icons-material/ReceiptLongRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import PlaceRoundedIcon from '@mui/icons-material/PlaceRounded';
import LocalOfferRoundedIcon from '@mui/icons-material/LocalOfferRounded';

// --- مكون فرعي: لتنسيق الحاويات المشتركة وتقليل التكرار ---
const SectionCard = ({ title, children, ...props }) => (
  <Box
    sx={(theme) => ({
      p: 2.5,
      borderRadius: 3,
      border: `1px solid ${theme.palette.divider}`,
      bgcolor: 'background.paper',
      transition: 'box-shadow 0.2s ease-in-out',
      '&:hover': {
        boxShadow: theme.shadows[1],
      },
    })}
    {...props}
  >
    {title && (
      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 2 }}>
        {title}
      </Typography>
    )}
    {children}
  </Box>
);

// --- مكون فرعي: لعرض تفاصيل النصوص ---
function DetailRow({ label, value }) {
  return (
    <Stack spacing={0.5}>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.06em' }}
      >
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 600 }}>
        {value || '—'}
      </Typography>
    </Stack>
  );
}

// --- مكون فرعي: لقائمة المزودين ---
const ProvidersList = ({ providers = [] }) => (
  <SectionCard title={`Providers (${providers.length})`}>
    <Stack spacing={1.5}>
      {providers.length > 0 ? (
        providers.map((p) => (
          <Stack
            key={p.id}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={(theme) => ({
              p: 1.5,
              borderRadius: 2,
              bgcolor: theme.palette.action.hover,
              border: `1px solid ${theme.palette.action.selected}`,
            })}
          >
            <Stack direction="row" spacing={1.5} alignItems="center">
              <Avatar src={p.image?.image_url} sx={{ width: 36, height: 36 }}>
                {p.name?.[0]}
              </Avatar>
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                  {p.name || '—'}
                </Typography>
                {/* <Typography variant="caption" color="text.secondary">
                  ID #{p.id}
                </Typography> */}
              </Box>
            </Stack>

            <Stack alignItems="flex-end" spacing={0.75}>
              <Chip
                label={p.status || '—'}
                size="small"
                color={p.status === 'accepted' ? 'success' : 'default'}
                sx={{ fontWeight: 700, textTransform: 'capitalize' }}
              />
              {p.rating != null && (
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <StarRoundedIcon sx={{ fontSize: 16, color: 'warning.main' }} />
                  <Typography variant="caption" sx={{ fontWeight: 700 }}>
                    {p.rating ?? 0}
                  </Typography>
                </Stack>
              )}
            </Stack>
          </Stack>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
          No providers available
        </Typography>
      )}
    </Stack>
  </SectionCard>
);

// --- مكون فرعي: بيانات العميل صاحب الطلب ---
const CustomerCard = ({ user }) => (
  <SectionCard title="Customer">
    {user ? (
      <Stack direction="row" spacing={1.5} alignItems="center">
        <Avatar src={user.image?.image_url} sx={{ width: 44, height: 44 }}>
          {user.name?.[0]}
        </Avatar>
        <Box>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>
            {user.name || '—'}
          </Typography>
          {/* <Typography variant="caption" color="text.secondary">
            ID #{user.id}
          </Typography> */}
        </Box>
      </Stack>
    ) : (
      <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
        No customer data
      </Typography>
    )}
  </SectionCard>
);

// --- سكيلتون لحالة التحميل (بديل الـ Spinner) ---
function DetailsSkeleton() {
  return (
    <Stack spacing={3}>
      <Skeleton variant="rounded" height={92} sx={{ borderRadius: 3 }} />
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
        <Skeleton variant="rounded" height={140} sx={{ borderRadius: 3, flex: 1 }} />
        <Skeleton variant="rounded" height={140} sx={{ borderRadius: 3, flex: 1 }} />
      </Stack>
      <Skeleton variant="rounded" height={90} sx={{ borderRadius: 3 }} />
      <Skeleton variant="rounded" height={110} sx={{ borderRadius: 3 }} />
      <Skeleton variant="rounded" height={90} sx={{ borderRadius: 3 }} />
    </Stack>
  );
}

// --- المكون الرئيسي للمنبثقة ---
function OrderDetailsDialog({ open, order, loading, onClose }) {
  const theme = useTheme();

  if (!open) return null;

  const providers = order?.providers || [];
  const isDialogLoading = loading || order?._loading;

  const hasPricingInfo =
    order &&
    (order.original_price != null ||
      order.offer_discount_percentage != null ||
      order.total_price != null);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      TransitionComponent={Zoom} // إضافة تأثير دخول ناعم واحترافي
      slotProps={{
        paper: {
          sx: {
            borderRadius: 4,
            backgroundImage: 'none', // يمنع تداخل الخلفيات في الـ Dark Mode
          },
        },
      }}
    >
      {/* الرأس (Header) */}
      <DialogTitle sx={{ p: 3, pb: 2 }}>
        <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                display: 'grid',
                placeItems: 'center',
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                boxShadow: `0 4px 12px ${theme.palette.primary.main}40`,
              }}
            >
              <ReceiptLongRoundedIcon fontSize="medium" />
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                Order Details
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                {isDialogLoading ? 'Loading details...' : `#${order?.order_number || '—'}`}
              </Typography>
            </Box>
          </Stack>

          <IconButton
            onClick={onClose}
            sx={{
              bgcolor: 'action.hover',
              '&:hover': { bgcolor: 'action.selected' },
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Stack>
      </DialogTitle>

      <Divider />

      {/* المحتوى (Content) */}
      <DialogContent sx={{ p: 3, mt: 1 }}>
        {isDialogLoading ? (
          <DetailsSkeleton />
        ) : order ? (
          <Stack spacing={3}>
            {/* بطاقة العنوان العلوية الـ Gradient */}
            <Box
              sx={{
                borderRadius: 3,
                p: 3,
                color: 'primary.contrastText',
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 60%, ${theme.palette.secondary.main} 100%)`,
                boxShadow: `0 6px 20px ${theme.palette.primary.main}25`,
              }}
            >
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                justifyContent="space-between"
                alignItems={{ xs: 'flex-start', sm: 'center' }}
                spacing={2}
              >
                <Box>
                  <Typography variant="caption" sx={{ opacity: 0.8, textTransform: 'uppercase', fontWeight: 700, letterSpacing: 1 }}>
                    Order Title
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800, mt: 0.5 }}>
                    {order.title || '—'}
                  </Typography>
                </Box>

                <Chip
                  label={order.status || '—'}
                  sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.25)',
                    color: '#fff',
                    fontWeight: 700,
                    textTransform: 'capitalize',
                    backdropFilter: 'blur(4px)',
                    px: 1,
                  }}
                />
              </Stack>
            </Box>

            {/* معلومات الطلب + بيانات العميل */}
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              <Box sx={{ flex: 1 }}>
                <SectionCard title="Order Info">
                  <Stack spacing={2}>
                    <DetailRow label="Order Number" value={order.order_number} />
                    <DetailRow label="Status" value={order.status} />
                    <DetailRow
                      label="Created At"
                      value={order.created_at ? new Date(order.created_at).toLocaleString() : null}
                    />
                    <DetailRow
                      label="Completed At"
                      value={order.completed_at ? new Date(order.completed_at).toLocaleString() : null}
                    />
                    <DetailRow label="Internal Note" value={order.note} />
                  </Stack>
                </SectionCard>
              </Box>

              <Box sx={{ flex: 1 }}>
                <CustomerCard user={order.user} />
              </Box>
            </Stack>

            {/* التسعير */}
            {hasPricingInfo && (
              <SectionCard title="Pricing">
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                  {order.original_price != null && (
                    <DetailRow label="Original Price" value={`$${Number(order.original_price).toFixed(2)}`} />
                  )}
                  {order.offer_discount_percentage != null && (
                    <DetailRow label="Discount" value={`${Number(order.offer_discount_percentage)}%`} />
                  )}
                  <DetailRow label="Total Price" value={`$${Number(order.total_price || 0).toFixed(2)}`} />
                </Stack>
              </SectionCard>
            )}

            {/* المزودون */}
            <ProvidersList providers={providers} />

            {/* العنوان */}
            {order.address && (
              <SectionCard title="Address">
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <PlaceRoundedIcon sx={{ color: 'text.secondary', mt: 0.3 }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {order.address.display_address || '—'}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {[order.address.city, order.address.country].filter(Boolean).join(', ')}
                    </Typography>
                  </Box>
                </Stack>
              </SectionCard>
            )}

            {/* تفاصيل الخدمة */}
            {order.service && (
              <SectionCard title="Service Details">
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} alignItems="flex-start">
                  {order.service.image?.image_url && (
                    <Box
                      component="img"
                      src={order.service.image.image_url}
                      alt={order.service.title}
                      sx={{
                        width: 90,
                        height: 90,
                        borderRadius: 2.5,
                        objectFit: 'cover',
                        flexShrink: 0,
                        border: `1px solid ${theme.palette.divider}`,
                      }}
                    />
                  )}

                  <Stack spacing={1} sx={{ flex: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      {order.service.title || '—'}
                    </Typography>

                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                      {order.service.description || '—'}
                    </Typography>

                    <Typography variant="h6" sx={{ fontWeight: 800, color: 'success.main', mt: 1 }}>
                      ${Number(order.service.price || 0).toFixed(2)}
                    </Typography>
                  </Stack>
                </Stack>
              </SectionCard>
            )}

            {/* العرض المرتبط بالطلب (إن وُجد) */}
            {order.offer && (
              <SectionCard title="Offer">
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <LocalOfferRoundedIcon sx={{ color: 'secondary.main' }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      {order.offer.title || `Offer #${order.offer.id}`}
                    </Typography>
                    {order.offer.discount_percentage != null && (
                      <Typography variant="caption" color="text.secondary">
                        {order.offer.discount_percentage}% discount
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </SectionCard>
            )}

            {/* الوصف الإضافي */}
            {order.description && (
              <SectionCard title="Description">
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                  {order.description}
                </Typography>
              </SectionCard>
            )}
          </Stack>
        ) : (
          <Typography align="center" color="text.secondary" sx={{ py: 4 }}>
            No order details found.
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default OrderDetailsDialog;