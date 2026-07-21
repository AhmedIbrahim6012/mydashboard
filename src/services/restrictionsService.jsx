import api from '../utils/axiosInstance';

// export const banAccount = async ({ accountType = 'user', accountId, banReason }) => {
//   const res = await api.post('/admin/restrictions/ban-account', {
//     account_type: accountType,
//     account_id: accountId,
//     ban_reason: banReason,
//   });
//   return res.data;
// };
export const banAccount = async ({ accountType = 'user', accountId, banReason }) => {
  const res = await api.post('/admin/restrictions/ban-account', {
    account_type: accountType,
    account_id: Number(accountId),
    ban_reason: banReason,
  });
  return res.data;
};

export const suspendAccount = async ({ accountType = 'user', accountId, scope, suspensionReason, expiresAt }) => {
  const res = await api.post('/admin/restrictions/suspend', {
    account_type: accountType,
    account_id: accountId,
    scope,
    suspension_reason: suspensionReason,
    expires_at: expiresAt,
  });
  return res.data;
};

export const limitAccount = async ({ accountType = 'user', accountId, scope, limitReason }) => {
  const res = await api.post('/admin/restrictions/limit', {
    account_type: accountType,
    account_id: accountId,
    scope,
    limit_reason: limitReason,
  });
  return res.data;
};

export const liftRestriction = async ({ restrictionId, liftReason }) => {
  const res = await api.post('/admin/restrictions/lift', {
    restriction_id: restrictionId,
    lift_reason: liftReason,
  });
  return res.data;
};

export const warnAccount = async ({ accountType = 'user', accountId, scope, warningReason }) => {
  const res = await api.post('/admin/restrictions/warning', {
    account_type: accountType,
    account_id: accountId,
    scope,
    warning_reason: warningReason,
  });
  return res.data;
};
export const fetchRestrictions = async ({ accountId, accountType , type, scope, page = 1 } = {}) => {
  const params = { page };
  if (accountType) params.account_type = accountType;
  if (accountId != null) params.account_id = accountId;
  if (type) params.type = type;       // ban, suspend, warning, limit
  if (scope) params.scope = scope;    // orders, services, reviews, chat, notifications, offers, all

  const res = await api.get('/admin/restrictions', { params });
  return res.data.data; // { data: [...], total, per_page, current_page, last_page }
};