// import React, { useEffect, useRef, useState } from 'react';
// import {
//   Avatar,
//   Box,
//   Button,
//   Chip,
//   CircularProgress,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Divider,
//   IconButton,
//   ImageList,
//   ImageListItem,
//   Stack,
//   Tab,
//   Tabs,
//   TextField,
//   Typography,
//   alpha,
//   useTheme,
// } from '@mui/material';
// import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
// import SendRoundedIcon from '@mui/icons-material/SendRounded';
// import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
// import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
// import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
// import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
// import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded';
// import { useTranslation } from 'react-i18next';

// import {
//   fetchComplaintDetails,
//   fetchComplaintMessages,
//   addComplaintMessage,
//   openComplaint,
//   reviewComplaint,
//   markPendingInfo,
//   resolveComplaint,
//   rejectComplaint,
//   extractApiErrorMessage,
// } from '../../services/complaintsService';
// import { getStatusMeta, getAvailableActions, toUTC3 } from './complaintStatus';
// import { useAppContext } from '../../context/AppContext';

// // ---------------------------------------------------------------------------
// // Small inline "reason" dialog — used by every status transition except
// // "Start Review" (open), which the API accepts with no reason at all.
// // ---------------------------------------------------------------------------
// function ReasonPromptDialog({ open, actionKey, loading, onCancel, onConfirm }) {
//   const { t } = useTranslation();
//   const [reason, setReason] = useState('');

//   useEffect(() => {
//     if (open) setReason('');
//   }, [open]);

//   const copy = {
//     resume_review: {
//       title: t('complaints.actions.resumeReview', 'Resume Review'),
//       helper: t('complaints.actions.resumeReviewHelper', 'Why is this complaint going back into review?'),
//     },
//     pending_info: {
//       title: t('complaints.actions.pendingInfo', 'Request More Info'),
//       helper: t('complaints.actions.pendingInfoHelper', 'What information is missing?'),
//     },
//     resolve: {
//       title: t('complaints.actions.resolve', 'Resolve Complaint'),
//       helper: t('complaints.actions.resolveHelper', 'How was this complaint resolved?'),
//     },
//     reject: {
//       title: t('complaints.actions.reject', 'Reject Complaint'),
//       helper: t('complaints.actions.rejectHelper', 'Why is this complaint being rejected?'),
//     },
//   }[actionKey] || { title: '', helper: '' };

//   return (
//     <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
//       <DialogTitle>{copy.title}</DialogTitle>
//       <DialogContent>
//         <TextField
//           autoFocus
//           fullWidth
//           multiline
//           minRows={3}
//           label={t('complaints.actions.reason', 'Reason')}
//           helperText={copy.helper}
//           value={reason}
//           onChange={(e) => setReason(e.target.value)}
//           sx={{ mt: 1 }}
//         />
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onCancel} disabled={loading}>
//           {t('common.cancel', 'Cancel')}
//         </Button>
//         <Button
//           variant="contained"
//           disabled={!reason.trim() || loading}
//           onClick={() => onConfirm(reason.trim())}
//         >
//           {loading ? <CircularProgress size={18} /> : t('common.confirm', 'Confirm')}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// // ---------------------------------------------------------------------------
// // Status history timeline (Overview tab)
// // ---------------------------------------------------------------------------
// function StatusHistory({ history, borderColor }) {
//   const { t } = useTranslation();
//   if (!history?.length) {
//     return (
//       <Typography variant="body2" color="text.secondary">
//         {t('complaints.noHistory', 'No status changes yet')}
//       </Typography>
//     );
//   }
//   return (
//     <Stack spacing={1.5}>
//       {history.map((h) => {
//         const meta = getStatusMeta(h.to_status);
//         return (
//           <Box
//             key={h.id}
//             sx={{
//               p: 1.5,
//               borderRadius: 2,
//               border: `1px solid ${borderColor}`,
//             }}
//           >
//             <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
//               <Chip
//                 size="small"
//                 label={t(`complaints.statusValues.${h.from_status}`, h.from_status)}
//                 variant="outlined"
//               />
//               <Typography variant="body2" color="text.secondary">→</Typography>
//               <Chip
//                 size="small"
//                 label={t(`complaints.statusValues.${h.to_status}`, h.to_status)}
//                 sx={{ color: meta.color, backgroundColor: meta.bg, fontWeight: 600 }}
//               />
//               <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
//                 {toUTC3(h.changed_at)}
//               </Typography>
//             </Stack>
//             {h.note && (
//               <Typography variant="body2" sx={{ mt: 0.5 }}>
//                 {h.note}
//               </Typography>
//             )}
//             <Typography variant="caption" color="text.secondary">
//               {t('complaints.by', 'by')} {h.changed_by?.name}
//             </Typography>
//           </Box>
//         );
//       })}
//     </Stack>
//   );
// }

// // ---------------------------------------------------------------------------
// // Messages tab — chat thread + composer with multi-image attach
// // ---------------------------------------------------------------------------
// function MessagesTab({ complaintId, borderColor }) {
//   const { t } = useTranslation();
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [text, setText] = useState('');
//   const [attachments, setAttachments] = useState([]);
//   const [sending, setSending] = useState(false);
//   const [error, setError] = useState('');
//   const fileInputRef = useRef(null);
//   const bottomRef = useRef(null);

//   const load = async () => {
//     setLoading(true);
//     try {
//       const data = await fetchComplaintMessages(complaintId);
//       setMessages(data || []);
//     } catch (err) {
//       setError(extractApiErrorMessage(err, t('complaints.messagesLoadError', 'Failed to load messages')));
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (complaintId) load();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [complaintId]);

//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   const handleFilesSelected = (e) => {
//     const files = Array.from(e.target.files || []);
//     setAttachments((prev) => [...prev, ...files]);
//     e.target.value = '';
//   };

//   const removeAttachment = (idx) => {
//     setAttachments((prev) => prev.filter((_, i) => i !== idx));
//   };

//   const handleSend = async () => {
//     if (!text.trim() && attachments.length === 0) return;
//     setSending(true);
//     setError('');
//     try {
//       const newMsg = await addComplaintMessage({
//         complaintId,
//         message: text.trim(),
//         images: attachments,
//       });
//       setMessages((prev) => [...prev, newMsg]);
//       setText('');
//       setAttachments([]);
//     } catch (err) {
//       setError(extractApiErrorMessage(err, t('complaints.sendError', 'Failed to send message')));
//     } finally {
//       setSending(false);
//     }
//   };

//   return (
//     <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
//       <Box sx={{ flex: 1, overflowY: 'auto', px: 0.5, py: 1, minHeight: 280, maxHeight: 360 }}>
//         {loading ? (
//           <Stack alignItems="center" sx={{ py: 4 }}>
//             <CircularProgress size={24} />
//           </Stack>
//         ) : messages.length === 0 ? (
//           <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
//             {t('complaints.noMessages', 'No messages yet')}
//           </Typography>
//         ) : (
//           <Stack spacing={1.5}>
//             {messages.map((m) => (
//               <Box
//                 key={m.id}
//                 sx={{
//                   alignSelf: m.is_me ? 'flex-end' : 'flex-start',
//                   maxWidth: '75%',
//                   ml: m.is_me ? 'auto' : 0,
//                 }}
//               >
//                 <Stack
//                   spacing={0.5}
//                   sx={{
//                     p: 1.25,
//                     borderRadius: 2,
//                     bgcolor: m.is_me ? 'primary.main' : (theme) => alpha(theme.palette.text.primary, 0.06),
//                     color: m.is_me ? 'primary.contrastText' : 'text.primary',
//                   }}
//                 >
//                   <Typography variant="caption" sx={{ opacity: 0.8 }}>
//                     {m.sender?.name}
//                   </Typography>
//                   {m.message && <Typography variant="body2">{m.message}</Typography>}
//                   {m.images?.length > 0 && (
//                     <Stack direction="row" spacing={0.5} flexWrap="wrap">
//                       {m.images.map((img, i) => (
//                         <Box
//                           key={i}
//                           component="img"
//                           src={img.image_url || img}
//                           alt="attachment"
//                           sx={{ width: 72, height: 72, borderRadius: 1, objectFit: 'cover' }}
//                         />
//                       ))}
//                     </Stack>
//                   )}
//                   <Typography variant="caption" sx={{ opacity: 0.7, alignSelf: 'flex-end' }}>
//                     {toUTC3(m.created_at)}
//                   </Typography>
//                 </Stack>
//               </Box>
//             ))}
//             <div ref={bottomRef} />
//           </Stack>
//         )}
//       </Box>

//       {error && (
//         <Typography variant="caption" color="error" sx={{ px: 1 }}>
//           {error}
//         </Typography>
//       )}

//       {attachments.length > 0 && (
//         <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ px: 0.5, pb: 1 }}>
//           {attachments.map((file, idx) => (
//             <Box key={idx} sx={{ position: 'relative' }}>
//               <Box
//                 component="img"
//                 src={URL.createObjectURL(file)}
//                 alt={file.name}
//                 sx={{ width: 56, height: 56, borderRadius: 1, objectFit: 'cover', border: `1px solid ${borderColor}` }}
//               />
//               <IconButton
//                 size="small"
//                 onClick={() => removeAttachment(idx)}
//                 sx={{
//                   position: 'absolute',
//                   top: -8,
//                   right: -8,
//                   bgcolor: 'background.paper',
//                   border: `1px solid ${borderColor}`,
//                   width: 20,
//                   height: 20,
//                 }}
//               >
//                 <CloseRoundedIcon sx={{ fontSize: 14 }} />
//               </IconButton>
//             </Box>
//           ))}
//         </Stack>
//       )}

//       <Stack direction="row" spacing={1} alignItems="flex-end" sx={{ pt: 1, borderTop: `1px solid ${borderColor}` }}>
//         <input
//           ref={fileInputRef}
//           type="file"
//           accept="image/*"
//           multiple
//           hidden
//           onChange={handleFilesSelected}
//         />
//         <IconButton onClick={() => fileInputRef.current?.click()}>
//           <AttachFileRoundedIcon />
//         </IconButton>
//         <TextField
//           fullWidth
//           size="small"
//           multiline
//           maxRows={4}
//           placeholder={t('complaints.typeMessage', 'Type a message…')}
//           value={text}
//           onChange={(e) => setText(e.target.value)}
//           onKeyDown={(e) => {
//             if (e.key === 'Enter' && !e.shiftKey) {
//               e.preventDefault();
//               handleSend();
//             }
//           }}
//         />
//         <IconButton
//           color="primary"
//           disabled={sending || (!text.trim() && attachments.length === 0)}
//           onClick={handleSend}
//         >
//           {sending ? <CircularProgress size={20} /> : <SendRoundedIcon />}
//         </IconButton>
//       </Stack>
//     </Box>
//   );
// }

// // ---------------------------------------------------------------------------
// // Main dialog
// // ---------------------------------------------------------------------------
// export default function ComplaintDetailsDialog({ open, complaintId, onClose }) {
//   const { t } = useTranslation();
//   const theme = useTheme();
//   const borderColor = theme.palette.divider;

//   const [tab, setTab] = useState('overview');
//   const [detail, setDetail] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [changed, setChanged] = useState(false);

//   const [actionKey, setActionKey] = useState(null); // resume_review | pending_info | resolve | reject | null
//   const [actionLoading, setActionLoading] = useState(false);

//   // AppSnackbar is a global component driven by AppContext — it reads
//   // `notification` and renders itself once at the app root. We just call
//   // notify({ title, message, severity }) here, not render <AppSnackbar /> ourselves.
//   const { notify } = useAppContext();

//   const loadDetail = async () => {
//     if (!complaintId) return;
//     setLoading(true);
//     setError('');
//     try {
//       const data = await fetchComplaintDetails(complaintId);
//       setDetail(data);
//     } catch (err) {
//       setError(extractApiErrorMessage(err, t('complaints.detailsLoadError', 'Failed to load complaint details')));
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (open && complaintId) {
//       setTab('overview');
//       setChanged(false);
//       loadDetail();
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [open, complaintId]);

//   const handleClose = () => onClose(changed);

//   const handleStartReview = async () => {
//     setActionLoading(true);
//     try {
//       await openComplaint(complaintId);
//       setChanged(true);
//       notify({ title: t('complaints.actionSuccess', 'Status updated'), severity: 'success' });
//       loadDetail();
//     } catch (err) {
//       notify({
//         title: t('complaints.actionError', 'Action failed'),
//         message: extractApiErrorMessage(err, ''),
//         severity: 'error',
//       });
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const runReasonAction = async (reason) => {
//     setActionLoading(true);
//     try {
//       const fn = {
//         resume_review: reviewComplaint,
//         pending_info: markPendingInfo,
//         resolve: resolveComplaint,
//         reject: rejectComplaint,
//       }[actionKey];
//       await fn(complaintId, reason);
//       setChanged(true);
//       notify({ title: t('complaints.actionSuccess', 'Status updated'), severity: 'success' });
//       setActionKey(null);
//       loadDetail();
//     } catch (err) {
//       notify({
//         title: t('complaints.actionError', 'Action failed'),
//         message: extractApiErrorMessage(err, ''),
//         severity: 'error',
//       });
//     } finally {
//       setActionLoading(false);
//     }
//   };

//   const actionButtons = detail ? getAvailableActions(detail.status) : [];
//   const meta = detail ? getStatusMeta(detail.status) : null;

//   const ACTION_CONFIG = {
//     start_review: {
//       label: t('complaints.actions.startReview', 'Start Review'),
//       icon: <PlayCircleRoundedIcon fontSize="small" />,
//       color: 'primary',
//       onClick: handleStartReview,
//     },
//     resume_review: {
//       label: t('complaints.actions.resumeReview', 'Resume Review'),
//       icon: <PlayCircleRoundedIcon fontSize="small" />,
//       color: 'primary',
//       onClick: () => setActionKey('resume_review'),
//     },
//     pending_info: {
//       label: t('complaints.actions.pendingInfo', 'Request Info'),
//       icon: <HourglassBottomRoundedIcon fontSize="small" />,
//       color: 'secondary',
//       onClick: () => setActionKey('pending_info'),
//     },
//     resolve: {
//       label: t('complaints.actions.resolve', 'Resolve'),
//       icon: <CheckCircleRoundedIcon fontSize="small" />,
//       color: 'success',
//       onClick: () => setActionKey('resolve'),
//     },
//     reject: {
//       label: t('complaints.actions.reject', 'Reject'),
//       icon: <HighlightOffRoundedIcon fontSize="small" />,
//       color: 'error',
//       onClick: () => setActionKey('reject'),
//     },
//   };

//   return (
//     <>
//       <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
//         <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//           <Box sx={{ flex: 1 }}>
//             {t('complaints.detailsTitle', 'Complaint')} {detail ? `#${detail.complaint_number}` : ''}
//           </Box>
//           {meta && detail && (
//             <Chip
//               size="small"
//               label={t(`complaints.statusValues.${detail.status}`, detail.status)}
//               sx={{ color: meta.color, backgroundColor: meta.bg, fontWeight: 600 }}
//             />
//           )}
//           <IconButton onClick={handleClose} size="small">
//             <CloseRoundedIcon />
//           </IconButton>
//         </DialogTitle>

//         <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 3, borderBottom: `1px solid ${borderColor}` }}>
//           <Tab value="overview" label={t('complaints.overview', 'Overview')} />
//           <Tab value="messages" label={t('complaints.messages', 'Messages')} />
//         </Tabs>

//         <DialogContent sx={{ minHeight: 380 }}>
//           {loading ? (
//             <Stack alignItems="center" sx={{ py: 6 }}>
//               <CircularProgress size={28} />
//             </Stack>
//           ) : error ? (
//             <Typography color="error" align="center" sx={{ py: 4 }}>
//               {error}
//             </Typography>
//           ) : !detail ? null : tab === 'overview' ? (
//             <Stack spacing={2.5} sx={{ pt: 1 }}>
//               <Box>
//                 <Typography variant="subtitle1" fontWeight={700}>
//                   {detail.title}
//                 </Typography>
//                 <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
//                   {detail.description}
//                 </Typography>
//               </Box>

//               <Stack direction="row" spacing={4} flexWrap="wrap">
//                 <Box>
//                   <Typography variant="caption" color="text.secondary">
//                     {t('complaints.complainant', 'Complainant')}
//                   </Typography>
//                   <Typography variant="body2">{detail.complainant?.name || '—'}</Typography>
//                 </Box>
//                 <Box>
//                   <Typography variant="caption" color="text.secondary">
//                     {t('complaints.respondent', 'Respondent')}
//                   </Typography>
//                   <Typography variant="body2">{detail.respondent?.name || '—'}</Typography>
//                 </Box>
//                 <Box>
//                   <Typography variant="caption" color="text.secondary">
//                     {t('complaints.assignedTo', 'Assigned To')}
//                   </Typography>
//                   <Typography variant="body2">{detail.assigned_to?.name || '—'}</Typography>
//                 </Box>
//               </Stack>

//               <Stack direction="row" spacing={4} flexWrap="wrap">
//                 <Box>
//                   <Typography variant="caption" color="text.secondary">
//                     {t('complaints.createdAt', 'Created At')}
//                   </Typography>
//                   <Typography variant="body2">{toUTC3(detail.created_at)}</Typography>
//                 </Box>
//                 <Box>
//                   <Typography variant="caption" color="text.secondary">
//                     {t('complaints.resolvedAt', 'Resolved At')}
//                   </Typography>
//                   <Typography variant="body2">
//                     {detail.resolved_at ? toUTC3(detail.resolved_at) : '—'}
//                   </Typography>
//                 </Box>
//                 <Box>
//                   <Typography variant="caption" color="text.secondary">
//                     {t('complaints.satisfaction', 'Satisfaction')}
//                   </Typography>
//                   <Typography variant="body2">{detail.satisfaction_rate ?? '—'}</Typography>
//                 </Box>
//               </Stack>

//               {detail.images?.length > 0 && (
//                 <Box>
//                   <Typography variant="caption" color="text.secondary">
//                     {t('complaints.attachments', 'Attachments')}
//                   </Typography>
//                   <ImageList cols={4} gap={8} sx={{ mt: 0.5 }}>
//                     {detail.images.map((img, i) => (
//                       <ImageListItem key={i}>
//                         <a href={img.image_url} target="_blank" rel="noreferrer">
//                           <Box
//                             component="img"
//                             src={img.image_url}
//                             alt={`attachment-${i}`}
//                             sx={{ borderRadius: 1, height: 90, objectFit: 'cover', width: '100%' }}
//                           />
//                         </a>
//                       </ImageListItem>
//                     ))}
//                   </ImageList>
//                 </Box>
//               )}

//               <Divider />

//               <Box>
//                 <Typography variant="subtitle2" sx={{ mb: 1 }}>
//                   {t('complaints.statusHistory', 'Status History')}
//                 </Typography>
//                 <StatusHistory history={detail.status_history} borderColor={borderColor} />
//               </Box>
//             </Stack>
//           ) : (
//             <MessagesTab complaintId={complaintId} borderColor={borderColor} />
//           )}
//         </DialogContent>

//         {detail && actionButtons.length > 0 && (
//           <DialogActions sx={{ px: 3, py: 1.5, borderTop: `1px solid ${borderColor}`, gap: 1 }}>
//             {actionButtons.map((key) => {
//               const cfg = ACTION_CONFIG[key];
//               return (
//                 <Button
//                   key={key}
//                   size="small"
//                   variant="outlined"
//                   color={cfg.color}
//                   startIcon={cfg.icon}
//                   onClick={cfg.onClick}
//                   disabled={actionLoading}
//                 >
//                   {cfg.label}
//                 </Button>
//               );
//             })}
//           </DialogActions>
//         )}
//       </Dialog>

//       <ReasonPromptDialog
//         open={!!actionKey}
//         actionKey={actionKey}
//         loading={actionLoading}
//         onCancel={() => setActionKey(null)}
//         onConfirm={runReasonAction}
//       />
//     </>
//   );
// }

import React, { useEffect, useRef, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  ImageList,
  ImageListItem,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import SendRoundedIcon from '@mui/icons-material/SendRounded';
import AttachFileRoundedIcon from '@mui/icons-material/AttachFileRounded';
import PlayCircleRoundedIcon from '@mui/icons-material/PlayCircleRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import HourglassBottomRoundedIcon from '@mui/icons-material/HourglassBottomRounded';
import { useTranslation } from 'react-i18next';

import {
  fetchComplaintDetails,
  fetchComplaintMessages,
  addComplaintMessage,
  openComplaint,
  reviewComplaint,
  markPendingInfo,
  resolveComplaint,
  rejectComplaint,
  extractApiErrorMessage,
} from '../../services/complaintsService';
import { getStatusMeta, getAvailableActions, toUTC3 } from './complaintStatus';
import { useAppContext } from '../../context/AppContext';

// ---------------------------------------------------------------------------
// Small inline "reason" dialog — used by every status transition except
// "Start Review" (open), which the API accepts with no reason at all.
// ---------------------------------------------------------------------------
function ReasonPromptDialog({ open, actionKey, loading, onCancel, onConfirm }) {
  const { t } = useTranslation();
  const [reason, setReason] = useState('');

  useEffect(() => {
    if (open) setReason('');
  }, [open]);

  const copy = {
    resume_review: {
      title: t('complaints.actions.resumeReview', 'Resume Review'),
      helper: t('complaints.actions.resumeReviewHelper', 'Why is this complaint going back into review?'),
    },
    pending_info: {
      title: t('complaints.actions.pendingInfo', 'Request More Info'),
      helper: t('complaints.actions.pendingInfoHelper', 'What information is missing?'),
    },
    resolve: {
      title: t('complaints.actions.resolve', 'Resolve Complaint'),
      helper: t('complaints.actions.resolveHelper', 'How was this complaint resolved?'),
    },
    reject: {
      title: t('complaints.actions.reject', 'Reject Complaint'),
      helper: t('complaints.actions.rejectHelper', 'Why is this complaint being rejected?'),
    },
  }[actionKey] || { title: '', helper: '' };

  return (
    <Dialog open={open} onClose={onCancel} maxWidth="xs" fullWidth>
      <DialogTitle>{copy.title}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          multiline
          minRows={3}
          label={t('complaints.actions.reason', 'Reason')}
          helperText={copy.helper}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} disabled={loading}>
          {t('common.cancel', 'Cancel')}
        </Button>
        <Button
          variant="contained"
          disabled={!reason.trim() || loading}
          onClick={() => onConfirm(reason.trim())}
        >
          {loading ? <CircularProgress size={18} /> : t('common.confirm', 'Confirm')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// ---------------------------------------------------------------------------
// Status history timeline (Overview tab)
// ---------------------------------------------------------------------------
function StatusHistory({ history, borderColor }) {
  const { t } = useTranslation();
  if (!history?.length) {
    return (
      <Typography variant="body2" color="text.secondary">
        {t('complaints.noHistory', 'No status changes yet')}
      </Typography>
    );
  }
  return (
    <Stack spacing={1.5}>
      {history.map((h) => {
        const meta = getStatusMeta(h.to_status);
        return (
          <Box
            key={h.id}
            sx={{
              p: 1.5,
              borderRadius: 2,
              border: `1px solid ${borderColor}`,
            }}
          >
            <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
              <Chip
                size="small"
                label={t(`complaints.statusValues.${h.from_status}`, h.from_status)}
                variant="outlined"
              />
              <Typography variant="body2" color="text.secondary">→</Typography>
              <Chip
                size="small"
                label={t(`complaints.statusValues.${h.to_status}`, h.to_status)}
                sx={{ color: meta.color, backgroundColor: meta.bg, fontWeight: 600 }}
              />
              <Typography variant="caption" color="text.secondary" sx={{ ml: 'auto' }}>
                {toUTC3(h.changed_at)}
              </Typography>
            </Stack>
            {h.note && (
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                {h.note}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              {t('complaints.by', 'by')} {h.changed_by?.name}
            </Typography>
          </Box>
        );
      })}
    </Stack>
  );
}

// ---------------------------------------------------------------------------
// Messages tab — chat thread + composer with multi-image attach
// ---------------------------------------------------------------------------
function MessagesTab({ complaintId, status, borderColor }) {
  const { t } = useTranslation();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [text, setText] = useState('');
  const [attachments, setAttachments] = useState([]);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const bottomRef = useRef(null);

  // The backend only accepts new messages while the complaint is actively
  // in review — everywhere else (open/pending_info/resolved/rejected/closed)
  // the composer is locked.
  const canSend = status === 'in_review';

  const load = async () => {
    setLoading(true);
    try {
      const data = await fetchComplaintMessages(complaintId);
      setMessages(data || []);
    } catch (err) {
      setError(extractApiErrorMessage(err, t('complaints.messagesLoadError', 'Failed to load messages')));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (complaintId) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complaintId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFilesSelected = (e) => {
    const files = Array.from(e.target.files || []);
    setAttachments((prev) => [...prev, ...files]);
    e.target.value = '';
  };

  const removeAttachment = (idx) => {
    setAttachments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleSend = async () => {
    if (!text.trim() && attachments.length === 0) return;
    setSending(true);
    setError('');
    try {
      const newMsg = await addComplaintMessage({
        complaintId,
        message: text.trim(),
        images: attachments,
      });
      setMessages((prev) => [...prev, newMsg]);
      setText('');
      setAttachments([]);
    } catch (err) {
      setError(extractApiErrorMessage(err, t('complaints.sendError', 'Failed to send message')));
    } finally {
      setSending(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flex: 1, overflowY: 'auto', px: 0.5, py: 1, minHeight: 280, maxHeight: 360 }}>
        {loading ? (
          <Stack spacing={1.5}>
            <Skeleton variant="rounded" width="55%" height={48} sx={{ borderRadius: 2 }} />
            <Skeleton variant="rounded" width="60%" height={48} sx={{ borderRadius: 2, alignSelf: 'flex-end', ml: 'auto' }} />
            <Skeleton variant="rounded" width="45%" height={48} sx={{ borderRadius: 2 }} />
          </Stack>
        ) : messages.length === 0 ? (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ py: 4 }}>
            {t('complaints.noMessages', 'No messages yet')}
          </Typography>
        ) : (
          <Stack spacing={1.5}>
            {messages.map((m) => (
              <Box
                key={m.id}
                sx={{
                  alignSelf: m.is_me ? 'flex-end' : 'flex-start',
                  maxWidth: '75%',
                  ml: m.is_me ? 'auto' : 0,
                }}
              >
                <Stack
                  spacing={0.5}
                  sx={{
                    p: 1.25,
                    borderRadius: 2,
                    bgcolor: m.is_me ? 'primary.main' : (theme) => alpha(theme.palette.text.primary, 0.06),
                    color: m.is_me ? 'primary.contrastText' : 'text.primary',
                  }}
                >
                  <Typography variant="caption" sx={{ opacity: 0.8 }}>
                    {m.sender?.name}
                  </Typography>
                  {m.message && <Typography variant="body2">{m.message}</Typography>}
                  {m.images?.length > 0 && (
                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                      {m.images.map((img, i) => (
                        <Box
                          key={i}
                          component="img"
                          src={img.image_url || img}
                          alt="attachment"
                          sx={{ width: 72, height: 72, borderRadius: 1, objectFit: 'cover' }}
                        />
                      ))}
                    </Stack>
                  )}
                  <Typography variant="caption" sx={{ opacity: 0.7, alignSelf: 'flex-end' }}>
                    {toUTC3(m.created_at)}
                  </Typography>
                </Stack>
              </Box>
            ))}
            <div ref={bottomRef} />
          </Stack>
        )}
      </Box>

      {error && (
        <Typography variant="caption" color="error" sx={{ px: 1 }}>
          {error}
        </Typography>
      )}

      {attachments.length > 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ px: 0.5, pb: 1 }}>
          {attachments.map((file, idx) => (
            <Box key={idx} sx={{ position: 'relative' }}>
              <Box
                component="img"
                src={URL.createObjectURL(file)}
                alt={file.name}
                sx={{ width: 56, height: 56, borderRadius: 1, objectFit: 'cover', border: `1px solid ${borderColor}` }}
              />
              <IconButton
                size="small"
                onClick={() => removeAttachment(idx)}
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  bgcolor: 'background.paper',
                  border: `1px solid ${borderColor}`,
                  width: 20,
                  height: 20,
                }}
              >
                <CloseRoundedIcon sx={{ fontSize: 14 }} />
              </IconButton>
            </Box>
          ))}
        </Stack>
      )}

      <Stack direction="row" spacing={1} alignItems="flex-end" sx={{ pt: 1, borderTop: `1px solid ${borderColor}` }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleFilesSelected}
          disabled={!canSend}
        />
        <IconButton onClick={() => fileInputRef.current?.click()} disabled={!canSend}>
          <AttachFileRoundedIcon />
        </IconButton>
        <TextField
          fullWidth
          size="small"
          multiline
          maxRows={4}
          disabled={!canSend}
          placeholder={
            canSend
              ? t('complaints.typeMessage', 'Type a message…')
              : t('complaints.sendDisabled', 'You can only send messages while the complaint is in review')
          }
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <IconButton
          color="primary"
          disabled={!canSend || sending || (!text.trim() && attachments.length === 0)}
          onClick={handleSend}
        >
          {sending ? <CircularProgress size={20} /> : <SendRoundedIcon />}
        </IconButton>
      </Stack>
      {!canSend && (
        <Typography variant="caption" color="text.secondary" sx={{ px: 1, pt: 0.5 }}>
          {t('complaints.sendDisabled', 'You can only send messages while the complaint is in review')}
        </Typography>
      )}
    </Box>
  );
}

// ---------------------------------------------------------------------------
// Main dialog
// ---------------------------------------------------------------------------
export default function ComplaintDetailsDialog({ open, complaintId, onClose }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const borderColor = theme.palette.divider;

  const [tab, setTab] = useState('overview');
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [changed, setChanged] = useState(false);

  const [actionKey, setActionKey] = useState(null); // resume_review | pending_info | resolve | reject | null
  const [actionLoading, setActionLoading] = useState(false);

  // AppSnackbar is a global component driven by AppContext — it reads
  // `notification` and renders itself once at the app root. We just call
  // notify({ title, message, severity }) here, not render <AppSnackbar /> ourselves.
  const { notify } = useAppContext();

  const loadDetail = async () => {
    if (!complaintId) return;
    setLoading(true);
    setError('');
    try {
      const data = await fetchComplaintDetails(complaintId);
      setDetail(data);
    } catch (err) {
      setError(extractApiErrorMessage(err, t('complaints.detailsLoadError', 'Failed to load complaint details')));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && complaintId) {
      setTab('overview');
      setChanged(false);
      loadDetail();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, complaintId]);

  const handleClose = () => onClose(changed);

  const handleStartReview = async () => {
    setActionLoading(true);
    try {
      await openComplaint(complaintId);
      setChanged(true);
      notify({ title: t('complaints.actionSuccess', 'Status updated'), severity: 'success' });
      loadDetail();
    } catch (err) {
      notify({
        title: t('complaints.actionError', 'Action failed'),
        message: extractApiErrorMessage(err, ''),
        severity: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const runReasonAction = async (reason) => {
    setActionLoading(true);
    try {
      const fn = {
        resume_review: reviewComplaint,
        pending_info: markPendingInfo,
        resolve: resolveComplaint,
        reject: rejectComplaint,
      }[actionKey];
      await fn(complaintId, reason);
      setChanged(true);
      notify({ title: t('complaints.actionSuccess', 'Status updated'), severity: 'success' });
      setActionKey(null);
      loadDetail();
    } catch (err) {
      notify({
        title: t('complaints.actionError', 'Action failed'),
        message: extractApiErrorMessage(err, ''),
        severity: 'error',
      });
    } finally {
      setActionLoading(false);
    }
  };

  const actionButtons = detail ? getAvailableActions(detail.status) : [];
  const meta = detail ? getStatusMeta(detail.status) : null;

  const ACTION_CONFIG = {
    start_review: {
      label: t('complaints.actions.startReview', 'Start Review'),
      icon: <PlayCircleRoundedIcon fontSize="small" />,
      color: 'primary',
      onClick: handleStartReview,
    },
    resume_review: {
      label: t('complaints.actions.resumeReview', 'Resume Review'),
      icon: <PlayCircleRoundedIcon fontSize="small" />,
      color: 'primary',
      onClick: () => setActionKey('resume_review'),
    },
    pending_info: {
      label: t('complaints.actions.pendingInfo', 'Request Info'),
      icon: <HourglassBottomRoundedIcon fontSize="small" />,
      color: 'secondary',
      onClick: () => setActionKey('pending_info'),
    },
    resolve: {
      label: t('complaints.actions.resolve', 'Resolve'),
      icon: <CheckCircleRoundedIcon fontSize="small" />,
      color: 'success',
      onClick: () => setActionKey('resolve'),
    },
    reject: {
      label: t('complaints.actions.reject', 'Reject'),
      icon: <HighlightOffRoundedIcon fontSize="small" />,
      color: 'error',
      onClick: () => setActionKey('reject'),
    },
  };

  return (
    <>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ flex: 1 }}>
            {t('complaints.detailsTitle', 'Complaint')} {detail ? `#${detail.complaint_number}` : ''}
          </Box>
          {meta && detail && (
            <Chip
              size="small"
              label={t(`complaints.statusValues.${detail.status}`, detail.status)}
              sx={{ color: meta.color, backgroundColor: meta.bg, fontWeight: 600 }}
            />
          )}
          <IconButton onClick={handleClose} size="small">
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ px: 3, borderBottom: `1px solid ${borderColor}` }}>
          <Tab value="overview" label={t('complaints.overview', 'Overview')} />
          <Tab value="messages" label={t('complaints.messages', 'Messages')} />
        </Tabs>

        <DialogContent sx={{ minHeight: 380 }}>
          {loading ? (
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <Box>
                <Skeleton variant="text" width="55%" height={32} />
                <Skeleton variant="text" width="90%" />
                <Skeleton variant="text" width="70%" />
              </Box>
              <Stack direction="row" spacing={4} flexWrap="wrap">
                <Skeleton variant="rounded" width={110} height={38} />
                <Skeleton variant="rounded" width={110} height={38} />
                <Skeleton variant="rounded" width={110} height={38} />
              </Stack>
              <Stack direction="row" spacing={4} flexWrap="wrap">
                <Skeleton variant="rounded" width={110} height={38} />
                <Skeleton variant="rounded" width={110} height={38} />
                <Skeleton variant="rounded" width={110} height={38} />
              </Stack>
              <Skeleton variant="rounded" height={90} />
              <Skeleton variant="rounded" height={70} />
            </Stack>
          ) : error ? (
            <Typography color="error" align="center" sx={{ py: 4 }}>
              {error}
            </Typography>
          ) : !detail ? null : tab === 'overview' ? (
            <Stack spacing={2.5} sx={{ pt: 1 }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={700}>
                  {detail.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  {detail.description}
                </Typography>
              </Box>

              <Stack direction="row" spacing={4} flexWrap="wrap">
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('complaints.complainant', 'Complainant')}
                  </Typography>
                  <Typography variant="body2">{detail.complainant?.name || '—'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('complaints.respondent', 'Respondent')}
                  </Typography>
                  <Typography variant="body2">{detail.respondent?.name || '—'}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('complaints.assignedTo', 'Assigned To')}
                  </Typography>
                  <Typography variant="body2">{detail.assigned_to?.name || '—'}</Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={4} flexWrap="wrap">
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('complaints.createdAt', 'Created At')}
                  </Typography>
                  <Typography variant="body2">{toUTC3(detail.created_at)}</Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('complaints.resolvedAt', 'Resolved At')}
                  </Typography>
                  <Typography variant="body2">
                    {detail.resolved_at ? toUTC3(detail.resolved_at) : '—'}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('complaints.satisfaction', 'Satisfaction')}
                  </Typography>
                  <Typography variant="body2">{detail.satisfaction_rate ?? '—'}</Typography>
                </Box>
              </Stack>

              {detail.images?.length > 0 && (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t('complaints.attachments', 'Attachments')}
                  </Typography>
                  <ImageList cols={4} gap={8} sx={{ mt: 0.5 }}>
                    {detail.images.map((img, i) => (
                      <ImageListItem key={i}>
                        <a href={img.image_url} target="_blank" rel="noreferrer">
                          <Box
                            component="img"
                            src={img.image_url}
                            alt={`attachment-${i}`}
                            sx={{ borderRadius: 1, height: 90, objectFit: 'cover', width: '100%' }}
                          />
                        </a>
                      </ImageListItem>
                    ))}
                  </ImageList>
                </Box>
              )}

              <Divider />

              <Box>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  {t('complaints.statusHistory', 'Status History')}
                </Typography>
                <StatusHistory history={detail.status_history} borderColor={borderColor} />
              </Box>
            </Stack>
          ) : (
            <MessagesTab complaintId={complaintId} status={detail.status} borderColor={borderColor} />
          )}
        </DialogContent>

        {detail && actionButtons.length > 0 && (
          <DialogActions sx={{ px: 3, py: 1.5, borderTop: `1px solid ${borderColor}`, gap: 1 }}>
            {actionButtons.map((key) => {
              const cfg = ACTION_CONFIG[key];
              return (
                <Button
                  key={key}
                  size="small"
                  variant="outlined"
                  color={cfg.color}
                  startIcon={cfg.icon}
                  onClick={cfg.onClick}
                  disabled={actionLoading}
                >
                  {cfg.label}
                </Button>
              );
            })}
          </DialogActions>
        )}
      </Dialog>

      <ReasonPromptDialog
        open={!!actionKey}
        actionKey={actionKey}
        loading={actionLoading}
        onCancel={() => setActionKey(null)}
        onConfirm={runReasonAction}
      />
    </>
  );
}