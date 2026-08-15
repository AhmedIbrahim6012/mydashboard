// import api from '../utils/axiosInstance';

// // Known status values for the "status" filter (computed by the backend from
// // starts_at / ends_at, independent from the is_suspended flag).
// // ⚠️ Only 'expired' was confirmed via the sample request — adjust this list
// // if the backend documents/returns other values (e.g. 'upcoming', 'active').
// export const OFFER_STATUS_OPTIONS = ['active', 'upcoming', 'expired'];

// export const fetchOffers = async ({ status, isActive, providerId, page = 1 } = {}) => {
//   const params = { page };
//   if (status) params.status = status;
//   if (isActive !== undefined && isActive !== '') params.is_active = isActive;
//   if (providerId) params.provider_id = providerId;

//   const res = await api.get('/admin/offers', { params });
//   return res.data; // { success, message, data: { data: [...], total, per_page, current_page, last_page } }
// };

// export const suspendOffer = async (offerId) => {
//   const res = await api.post('/admin/offers/suspend', { offer_id: offerId });
//   return res.data;
// };

// export const unsuspendOffer = async (offerId) => {
//   const res = await api.post('/admin/offers/unsuspend', { offer_id: offerId });
//   return res.data;
// };

// // Same shape as complaintsService/restrictionsService's error extractor —
// // kept local here so offersService has no cross-service dependency.
// export function extractApiErrorMessage(err, fallback) {
//   const data = err?.response?.data;
//   if (data?.errors && typeof data.errors === 'object') {
//     const messages = Object.values(data.errors).flat();
//     if (messages.length) return messages.join(' — ');
//   }
//   return data?.message || err?.message || fallback;
// }

import api from '../utils/axiosInstance';

// Known status values for the "status" filter (computed by the backend from
// starts_at / ends_at, independent from the is_suspended flag).
// ⚠️ Only 'expired' was confirmed via the sample request — adjust this list
// if the backend documents/returns other values (e.g. 'upcoming', 'active').
export const OFFER_STATUS_OPTIONS = ['active', 'upcoming', 'expired'];

export const fetchOffers = async ({ status, isActive, isSuspended, providerId, page = 1 } = {}) => {
  const params = { page };
  if (status) params.status = status;
  if (isActive !== undefined && isActive !== '') params.is_active = isActive;
  if (isSuspended !== undefined && isSuspended !== '') params.is_suspended = isSuspended;
  if (providerId) params.provider_id = providerId;

  const res = await api.get('/admin/offers', { params });
  return res.data; // { success, message, data: { data: [...], total, per_page, current_page, last_page } }
};

export const suspendOffer = async (offerId) => {
  const res = await api.post('/admin/offers/suspend', { offer_id: offerId });
  return res.data;
};

export const unsuspendOffer = async (offerId) => {
  const res = await api.post('/admin/offers/unsuspend', { offer_id: offerId });
  return res.data;
};

// Same shape as complaintsService/restrictionsService's error extractor —
// kept local here so offersService has no cross-service dependency.
export function extractApiErrorMessage(err, fallback) {
  const data = err?.response?.data;
  if (data?.errors && typeof data.errors === 'object') {
    const messages = Object.values(data.errors).flat();
    if (messages.length) return messages.join(' — ');
  }
  return data?.message || err?.message || fallback;
}