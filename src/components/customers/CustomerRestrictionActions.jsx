// import { useState, useEffect, useCallback } from 'react';
// import {
//   Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
//   MenuItem, Stack, TextField, Typography, Divider, Skeleton,
// } from '@mui/material';
// import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
// import PauseCircleOutlineRoundedIcon from '@mui/icons-material/PauseCircleOutlineRounded';
// import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
// import ReportGmailerrorredRoundedIcon from '@mui/icons-material/ReportGmailerrorredRounded';
// import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
// import {
//   banAccount, suspendAccount, limitAccount, liftRestriction, warnAccount, fetchRestrictions,
// } from '../../services/restrictionsService';

// const SCOPES = ['all', 'orders', 'services', 'reviews', 'chat', 'notifications', 'offers'];

// const TYPE_CONFIG = {
//   ban: { label: 'Banned', color: 'error' },
//   suspend: { label: 'Suspended', color: 'secondary' },
//   limit: { label: 'Limited', color: 'info' },
//   warning: { label: 'Warning', color: 'warning' },
// };

// function isExpired(expiresAt) {
//   return expiresAt ? new Date(expiresAt) < new Date() : false;
// }

// // action = 'ban' | 'suspend' | 'limit' | 'warning' | 'lift'
// function RestrictionDialog({ action, accountId, restrictionId, onClose, onSuccess }) {
//   const [reason, setReason] = useState('');
//   const [scope, setScope] = useState('all');
//   const [expiresAt, setExpiresAt] = useState('');
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState(null);

//   const titles = {
//     ban: 'Ban Account',
//     suspend: 'Suspend Account',
//     limit: 'Limit Account',
//     warning: 'Warn Account',
//     lift: 'Lift Restriction',
//   };

//   const needsScope = action === 'suspend' || action === 'limit' || action === 'warning';
//   const needsExpiry = action === 'suspend';

//   async function handleSubmit() {
//     setSubmitting(true);
//     setError(null);
//     try {
//       if (action === 'ban') {
//         await banAccount({ accountId, banReason: reason });
//       } else if (action === 'suspend') {
//         await suspendAccount({ accountId, scope, suspensionReason: reason, expiresAt });
//       } else if (action === 'limit') {
//         await limitAccount({ accountId, scope, limitReason: reason });
//       } else if (action === 'warning') {
//         await warnAccount({ accountId, scope, warningReason: reason });
//       } else if (action === 'lift') {
//         await liftRestriction({ restrictionId, liftReason: reason });
//       }
//       onSuccess?.();
//       onClose();
//     } catch (err) {
//       setError(err.response?.data?.message || err.message || 'Something went wrong');
//     } finally {
//       setSubmitting(false);
//     }
//   }

//   return (
//     <Dialog open onClose={onClose} fullWidth maxWidth="sm">
//       <DialogTitle sx={{ fontWeight: 800 }}>{titles[action]}</DialogTitle>
//       <DialogContent>
//         <Stack spacing={2.2} sx={{ mt: 1 }}>
//           {error && <Alert severity="error">{error}</Alert>}

//           {needsScope && (
//             <TextField
//               select label="Scope" value={scope}
//               onChange={(e) => setScope(e.target.value)}
//               fullWidth size="small"
//             >
//               {SCOPES.map((s) => (
//                 <MenuItem key={s} value={s}>{s}</MenuItem>
//               ))}
//             </TextField>
//           )}

//           {needsExpiry && (
//             <TextField
//               label="Expires at" type="date" fullWidth size="small"
//               value={expiresAt}
//               onChange={(e) => setExpiresAt(e.target.value)}
//               InputLabelProps={{ shrink: true }}
//             />
//           )}

//           <TextField
//             label={action === 'lift' ? 'Lift reason' : 'Reason'}
//             value={reason}
//             onChange={(e) => setReason(e.target.value)}
//             fullWidth multiline minRows={3}
//           />
//         </Stack>
//       </DialogContent>
//       <DialogActions sx={{ p: 2.5 }}>
//         <Button onClick={onClose} disabled={submitting}>Cancel</Button>
//         <Button
//           onClick={handleSubmit}
//           variant="contained"
//           color={action === 'ban' ? 'error' : 'primary'}
//           disabled={submitting || !reason || (needsExpiry && !expiresAt)}
//         >
//           {submitting ? 'Submitting...' : 'Confirm'}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

// function CustomerRestrictionActions({ accountId }) {
//   const [openAction, setOpenAction] = useState(null); // { type: 'ban'|'suspend'|..., restrictionId? }
//   const [restrictions, setRestrictions] = useState([]);
//   const [loading, setLoading] = useState(true);
// const [restrictionsPage, setRestrictionsPage] = useState(1);
// const [restrictionsLastPage, setRestrictionsLastPage] = useState(1);
//  const loadRestrictions = useCallback(async (pageNumber = 1) => {
//   setLoading(true);
//   try {
//     const result = await fetchRestrictions({ accountId, accountType: 'user', page: pageNumber });
//     setRestrictions((prev) => (pageNumber === 1 ? (result.data ?? []) : [...prev, ...(result.data ?? [])]));
//     setRestrictionsLastPage(result.last_page);
//     setRestrictionsPage(result.current_page);
//   } catch (err) {
//     console.error('Failed to load restrictions', err);
//   } finally {
//     setLoading(false);
//   }
// }, [accountId]);

// useEffect(() => { loadRestrictions(1); }, [loadRestrictions]);
//   const activeRestrictions = restrictions.filter((r) => !r.lifted_at && !isExpired(r.expires_at));
//   const history = restrictions.filter((r) => r.lifted_at || isExpired(r.expires_at));

//   function handleSuccess() {
//   setOpenAction(null);
//   loadRestrictions(1);
// }

//   return (
//     <Box>
//       <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1.5 }}>
//         Account Restrictions
//       </Typography>

//       <Stack direction="row" spacing={1.2} flexWrap="wrap" sx={{ rowGap: 1.2, mb: 2.5 }}>
//         <Button startIcon={<ReportGmailerrorredRoundedIcon />} variant="outlined" color="warning"
//           onClick={() => setOpenAction({ type: 'warning' })}>
//           Warn
//         </Button>
//         <Button startIcon={<SpeedRoundedIcon />} variant="outlined" color="info"
//           onClick={() => setOpenAction({ type: 'limit' })}>
//           Limit
//         </Button>
//         <Button startIcon={<PauseCircleOutlineRoundedIcon />} variant="outlined" color="secondary"
//           onClick={() => setOpenAction({ type: 'suspend' })}>
//           Suspend
//         </Button>
//         <Button startIcon={<BlockRoundedIcon />} variant="outlined" color="error"
//           onClick={() => setOpenAction({ type: 'ban' })}>
//           Ban
//         </Button>
//       </Stack>

//       {loading ? (
//         <Stack spacing={1}>
//           <Skeleton variant="rounded" height={50} />
//           <Skeleton variant="rounded" height={50} />
//         </Stack>
//       ) : (
//         <>
//           {activeRestrictions.length > 0 && (
//             <Stack spacing={1.2} sx={{ mb: 2 }}>
//               <Typography variant="caption" fontWeight={800} color="text.secondary" textTransform="uppercase">
//                 Active
//               </Typography>
//               {activeRestrictions.map((r) => {
//                 const cfg = TYPE_CONFIG[r.type] || { label: r.type, color: 'default' };
//                 return (
//                   <Stack
//                     key={r.id}
//                     direction={{ xs: 'column', sm: 'row' }}
//                     spacing={1.5}
//                     alignItems={{ xs: 'flex-start', sm: 'center' }}
//                     justifyContent="space-between"
//                     sx={{ p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
//                   >
//                     <Stack spacing={0.3}>
//                       <Stack direction="row" spacing={1} alignItems="center">
//                         <Chip label={cfg.label} color={cfg.color} size="small" sx={{ fontWeight: 700 }} />
//                         <Chip label={r.scope} size="small" variant="outlined" />
//                       </Stack>
//                       <Typography variant="body2" color="text.secondary">{r.reason}</Typography>
//                       {r.expires_at && (
//                         <Typography variant="caption" color="text.secondary">
//                           Expires: {new Date(r.expires_at).toLocaleString()}
//                         </Typography>
//                       )}
//                     </Stack>
//                     <Button
//                       size="small" variant="outlined" color="success"
//                       startIcon={<LockOpenRoundedIcon />}
//                       onClick={() => setOpenAction({ type: 'lift', restrictionId: r.id })}
//                     >
//                       Lift
//                     </Button>
//                   </Stack>
//                 );
//               })}
//             </Stack>
//           )}
// {restrictionsPage < restrictionsLastPage && (
//   <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
//     <Button
//       size="small" variant="outlined"
//       disabled={loading}
//       onClick={() => loadRestrictions(restrictionsPage + 1)}
//     >
//       {loading ? 'Loading...' : 'Load more restrictions'}
//     </Button>
//   </Box>
// )}
//           {history.length > 0 && (
//             <Stack spacing={1.2}>
//               <Divider />
//               <Typography variant="caption" fontWeight={800} color="text.secondary" textTransform="uppercase">
//                 History
//               </Typography>
//               {history.map((r) => {
//                 const cfg = TYPE_CONFIG[r.type] || { label: r.type, color: 'default' };
//                 return (
//                   <Box key={r.id} sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
//                     <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
//                       <Chip label={cfg.label} size="small" variant="outlined" />
//                       <Chip label={r.scope} size="small" variant="outlined" />
//                       {r.lifted_at && <Chip label="Lifted" size="small" color="success" variant="outlined" />}
//                     </Stack>
//                     <Typography variant="body2" color="text.secondary">{r.reason}</Typography>
//                     {r.lift_reason && (
//                       <Typography variant="caption" color="text.secondary">
//                         Lift reason: {r.lift_reason}
//                       </Typography>
//                     )}
//                   </Box>
//                 );
//               })}
//             </Stack>
//           )}

//           {restrictions.length === 0 && (
//             <Typography variant="body2" color="text.secondary">
//               No restrictions found for this account.
//             </Typography>
//           )}
//         </>
//       )}

//       {openAction && (
//         <RestrictionDialog
//           action={openAction.type}
//           accountId={accountId}
//           restrictionId={openAction.restrictionId}
//           onClose={() => setOpenAction(null)}
//           onSuccess={handleSuccess}
//         />
//       )}
//     </Box>
//   );
// }

// export default CustomerRestrictionActions;


import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Alert, Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle,
  MenuItem, Stack, TextField, Typography, Divider, Skeleton,
} from '@mui/material';
import BlockRoundedIcon from '@mui/icons-material/BlockRounded';
import PauseCircleOutlineRoundedIcon from '@mui/icons-material/PauseCircleOutlineRounded';
import SpeedRoundedIcon from '@mui/icons-material/SpeedRounded';
import ReportGmailerrorredRoundedIcon from '@mui/icons-material/ReportGmailerrorredRounded';
import LockOpenRoundedIcon from '@mui/icons-material/LockOpenRounded';
import {
  banAccount, suspendAccount, limitAccount, liftRestriction, warnAccount, fetchRestrictions,
} from '../../services/restrictionsService';

const SCOPES = ['all', 'orders', 'services', 'reviews', 'chat', 'notifications', 'offers'];

const TYPE_CONFIG = {
  ban: { label: 'Banned', color: 'error' },
  suspend: { label: 'Suspended', color: 'secondary' },
  limit: { label: 'Limited', color: 'info' },
  warning: { label: 'Warning', color: 'warning' },
};

// تقييد بدون expires_at (ban, limit, warning) ما بينتهي وقته أبدًا تلقائيًا — دايمًا false.
// تقييد فيه expires_at (suspend) بينتهي تلقائيًا لما يفوت وقته.
function isExpired(expiresAt) {
  return expiresAt ? new Date(expiresAt) < new Date() : false;
}

// الـ API بده تاريخ "بعد بكرا" (يعني بعد يومين من اليوم على الأقل)
function getMinExpiryDate() {
  const d = new Date();
  d.setDate(d.getDate() + 2);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

// يحول object الأخطاء القادم من الـ API لسطر واحد مقروء
function extractApiErrorMessage(err, fallback) {
  const data = err?.response?.data;
  if (data?.errors && typeof data.errors === 'object') {
    const messages = Object.values(data.errors).flat();
    if (messages.length) return messages.join(' — ');
  }
  return data?.message || err.message || fallback;
}

// action = 'ban' | 'suspend' | 'limit' | 'warning' | 'lift'
function RestrictionDialog({ action, accountType, accountId, restrictionId, onClose, onSuccess }) {
  const [reason, setReason] = useState('');
  const [scope, setScope] = useState('all');
  const [expiresAt, setExpiresAt] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const titles = {
    ban: 'Ban Account',
    suspend: 'Suspend Account',
    limit: 'Limit Account',
    warning: 'Warn Account',
    lift: 'Lift Restriction',
  };

  const needsScope = action === 'suspend' || action === 'limit' || action === 'warning';
  const needsExpiry = action === 'suspend';
  const minExpiryDate = useMemo(() => getMinExpiryDate(), []);
  const expiryTooSoon = needsExpiry && expiresAt && expiresAt < minExpiryDate;

  async function handleSubmit() {
    if (needsExpiry && (!expiresAt || expiryTooSoon)) return;

    setSubmitting(true);
    setError(null);
    try {
      if (action === 'ban') {
        await banAccount({ accountType, accountId, banReason: reason });
      } else if (action === 'suspend') {
        await suspendAccount({ accountType, accountId, scope, suspensionReason: reason, expiresAt });
      } else if (action === 'limit') {
        await limitAccount({ accountType, accountId, scope, limitReason: reason });
      } else if (action === 'warning') {
        await warnAccount({ accountType, accountId, scope, warningReason: reason });
      } else if (action === 'lift') {
        await liftRestriction({ restrictionId, liftReason: reason });
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(extractApiErrorMessage(err, 'Something went wrong'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 800 }}>{titles[action]}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.2} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}

          {needsScope && (
            <TextField
              select label="Scope" value={scope}
              onChange={(e) => setScope(e.target.value)}
              fullWidth size="small"
            >
              {SCOPES.map((s) => (
                <MenuItem key={s} value={s}>{s}</MenuItem>
              ))}
            </TextField>
          )}

          {needsExpiry && (
            <TextField
              label="Expires at" type="date" fullWidth size="small"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              InputLabelProps={{ shrink: true }}
              inputProps={{ min: minExpiryDate }}
              error={expiryTooSoon}
              helperText={expiryTooSoon ? 'Expiry date must be at least the day after tomorrow.' : ' '}
            />
          )}

          <TextField
            label={action === 'lift' ? 'Lift reason' : 'Reason'}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            fullWidth multiline minRows={3}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color={action === 'ban' ? 'error' : 'primary'}
          disabled={submitting || !reason || (needsExpiry && (!expiresAt || expiryTooSoon))}
        >
          {submitting ? 'Submitting...' : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

// accountType: 'user' | 'provider'
function CustomerRestrictionActions({ accountId, accountType = 'user' }) {
  const [openAction, setOpenAction] = useState(null); // { type, restrictionId? }
  const [restrictions, setRestrictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restrictionsPage, setRestrictionsPage] = useState(1);
  const [restrictionsLastPage, setRestrictionsLastPage] = useState(1);

  const loadRestrictions = useCallback(async (pageNumber = 1) => {
    setLoading(true);
    try {
      const result = await fetchRestrictions({ accountId, accountType, page: pageNumber });
      setRestrictions((prev) => (pageNumber === 1 ? (result.data ?? []) : [...prev, ...(result.data ?? [])]));
      setRestrictionsLastPage(result.last_page);
      setRestrictionsPage(result.current_page);
    } catch (err) {
      console.error('Failed to load restrictions', err);
    } finally {
      setLoading(false);
    }
  }, [accountId, accountType]);

  useEffect(() => { loadRestrictions(1); }, [loadRestrictions]);

  // ⭐ المنطق النهائي:
  // Active  = لسا ما انعمله Lift يدوي  AND  لسا ما انتهى وقته (إذا كان إله وقت انتهاء أصلاً).
  // History = انعمله Lift يدوي  OR  انتهى وقته تلقائيًا (حالة الـ suspend فقط، لأنو باقي
  //           الأنواع ما إلها expires_at فأول شرط بس هو يلي بيحكمها).
  const activeRestrictions = restrictions.filter((r) => !r.lifted_at && !isExpired(r.expires_at));
  const history = restrictions.filter((r) => r.lifted_at || isExpired(r.expires_at));

  function handleSuccess() {
    setOpenAction(null);
    loadRestrictions(1);
  }

  return (
    <Box>
      <Stack direction="row" spacing={1.2} flexWrap="wrap" sx={{ rowGap: 1.2, mb: 2.5 }}>
        <Button startIcon={<ReportGmailerrorredRoundedIcon />} variant="outlined" color="warning"
          onClick={() => setOpenAction({ type: 'warning' })}>
          Warn
        </Button>
        <Button startIcon={<SpeedRoundedIcon />} variant="outlined" color="info"
          onClick={() => setOpenAction({ type: 'limit' })}>
          Limit
        </Button>
        <Button startIcon={<PauseCircleOutlineRoundedIcon />} variant="outlined" color="secondary"
          onClick={() => setOpenAction({ type: 'suspend' })}>
          Suspend
        </Button>
        <Button startIcon={<BlockRoundedIcon />} variant="outlined" color="error"
          onClick={() => setOpenAction({ type: 'ban' })}>
          Ban
        </Button>
      </Stack>

      {loading ? (
        <Stack spacing={1}>
          <Skeleton variant="rounded" height={50} />
          <Skeleton variant="rounded" height={50} />
        </Stack>
      ) : (
        <>
          {activeRestrictions.length > 0 && (
            <Stack spacing={1.2} sx={{ mb: 2 }}>
              <Typography variant="caption" fontWeight={800} color="text.secondary" textTransform="uppercase">
                Active
              </Typography>
              {activeRestrictions.map((r) => {
                const cfg = TYPE_CONFIG[r.type] || { label: r.type, color: 'default' };
                return (
                  <Stack
                    key={r.id}
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1.5}
                    alignItems={{ xs: 'flex-start', sm: 'center' }}
                    justifyContent="space-between"
                    sx={{ p: 1.5, borderRadius: 2, border: '1px solid', borderColor: 'divider' }}
                  >
                    <Stack spacing={0.3}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Chip label={cfg.label} color={cfg.color} size="small" sx={{ fontWeight: 700 }} />
                        <Chip label={r.scope} size="small" variant="outlined" />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">{r.reason}</Typography>
                      {r.expires_at && (
                        <Typography variant="caption" color="text.secondary">
                          Expires: {new Date(r.expires_at).toLocaleString()}
                        </Typography>
                      )}
                    </Stack>
                    <Button
                      size="small" variant="outlined" color="success"
                      startIcon={<LockOpenRoundedIcon />}
                      onClick={() => setOpenAction({ type: 'lift', restrictionId: r.id })}
                    >
                      Lift
                    </Button>
                  </Stack>
                );
              })}
            </Stack>
          )}

          {history.length > 0 && (
            <Stack spacing={1.2}>
              <Divider />
              <Typography variant="caption" fontWeight={800} color="text.secondary" textTransform="uppercase">
                History
              </Typography>
              {history.map((r) => {
                const cfg = TYPE_CONFIG[r.type] || { label: r.type, color: 'default' };
                const expiredNaturally = !r.lifted_at && isExpired(r.expires_at);
                return (
                  <Box key={r.id} sx={{ p: 1.5, borderRadius: 2, bgcolor: 'action.hover' }}>
                    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
                      <Chip label={cfg.label} size="small" variant="outlined" />
                      <Chip label={r.scope} size="small" variant="outlined" />
                      {r.lifted_at ? (
                        <Chip label="Lifted" size="small" color="success" variant="outlined" />
                      ) : expiredNaturally ? (
                        <Chip label="Expired" size="small" color="default" variant="outlined" />
                      ) : null}
                    </Stack>
                    <Typography variant="body2" color="text.secondary">{r.reason}</Typography>
                    {r.lift_reason && (
                      <Typography variant="caption" color="text.secondary">
                        Lift reason: {r.lift_reason}
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Stack>
          )}

          {restrictions.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              No restrictions found for this account.
            </Typography>
          )}

          {restrictionsPage < restrictionsLastPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                size="small" variant="outlined"
                disabled={loading}
                onClick={() => loadRestrictions(restrictionsPage + 1)}
              >
                {loading ? 'Loading...' : 'Load more restrictions'}
              </Button>
            </Box>
          )}
        </>
      )}

      {openAction && (
        <RestrictionDialog
          action={openAction.type}
          accountType={accountType}
          accountId={accountId}
          restrictionId={openAction.restrictionId}
          onClose={() => setOpenAction(null)}
          onSuccess={handleSuccess}
        />
      )}
    </Box>
  );
}

export default CustomerRestrictionActions;