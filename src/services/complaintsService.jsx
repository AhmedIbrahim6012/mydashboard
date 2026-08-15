// import api from '../utils/axiosInstance';

// /**
//  * Complaints Service
//  * -------------------
//  * Every function mirrors the pattern already used in restrictionsService.js /
//  * WalletPage's inline calls: build a clean params object, skip empty values,
//  * unwrap res.data, and let the caller decide what to do with errors.
//  *
//  * Endpoints covered (confirmed via Postman collection):
//  *   GET  /admin/complaints                 (list + filters)
//  *   GET  /admin/complaints/details          (single complaint, full detail)
//  *   GET  /admin/complaints/messages         (chat thread for a complaint)
//  *   POST /admin/complaints/add-message      (multipart/form-data, supports images[])
//  *   POST /admin/complaints/open             { complaint_id }                → in_review
//  *   POST /admin/complaints/review           { complaint_id, reason }        → in_review
//  *   POST /admin/complaints/pending-info     { complaint_id, reason }        → pending_info
//  *   POST /admin/complaints/resolve          { complaint_id, reason }        → resolved
//  *   POST /admin/complaints/reject           { complaint_id, reason }        → rejected
//  */

// // ---------------------------------------------------------------------------
// // List + filters
// // ---------------------------------------------------------------------------
// // Filters observed in the Postman "Params" tab:
// //   query            → free text search (title/description, presumably)
// //   status           → open | in_review | pending_info | closed | rejected | resolved
// //   complaint_number → exact numeric complaint number
// //   complainant_id   → numeric id of whoever filed the complaint
// //   complainant_type → user | provider
// //   respondent_id    → numeric id of whoever the complaint is against
// //   respondent_type  → user | provider
// export const fetchComplaints = async ({
//   query,
//   status,
//   complaintNumber,
//   complainantId,
//   complainantType,
//   respondentId,
//   respondentType,
//   page = 1,
// } = {}) => {
//   const params = { page };
//   if (query) params.query = query;
//   if (status) params.status = status;
//   if (complaintNumber) params.complaint_number = complaintNumber;
//   if (complainantId) params.complainant_id = complainantId;
//   if (complainantType) params.complainant_type = complainantType;
//   if (respondentId) params.respondent_id = respondentId;
//   if (respondentType) params.respondent_type = respondentType;

//   const res = await api.get('/admin/complaints', { params });
//   // NOTE: the sample response for this endpoint is a flat, non-paginated
//   // array (`{ success, message, data: [...] }`). If the backend later adds
//   // pagination meta (total/last_page), this still works — callers should
//   // read res.data.data for the list and treat pagination as best-effort.
//   return res.data;
// };

// // ---------------------------------------------------------------------------
// // Single complaint — full detail (respondent, complainant, assigned_to,
// // images, status_history)
// // ---------------------------------------------------------------------------
// export const fetchComplaintDetails = async (complaintId) => {
//   const res = await api.get('/admin/complaints/details', {
//     params: { complaint_id: complaintId },
//   });
//   return res.data.data;
// };

// // ---------------------------------------------------------------------------
// // Messages (chat thread)
// // ---------------------------------------------------------------------------
// export const fetchComplaintMessages = async (complaintId) => {
//   const res = await api.get('/admin/complaints/messages', {
//     params: { complaint_id: complaintId },
//   });
//   return res.data.data; // array of { id, message, is_me, sender, images[], created_at }
// };

// export const addComplaintMessage = async ({ complaintId, message, images = [] }) => {
//   const formData = new FormData();
//   formData.append('complaint_id', complaintId);
//   formData.append('message', message);
//   images.forEach((file) => formData.append('images[]', file));

//   const res = await api.post('/admin/complaints/add-message', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });
//   return res.data.data;
// };

// // ---------------------------------------------------------------------------
// // Status transitions
// // ---------------------------------------------------------------------------
// // "open" is the odd one out: it takes no reason and moves open → in_review.
// // Treat it as "Start Review" in the UI.
// export const openComplaint = async (complaintId) => {
//   const res = await api.post('/admin/complaints/open', { complaint_id: complaintId });
//   return res.data.data;
// };

// // "review" also lands on in_review, but is used to move a complaint back
// // from pending_info (or resume review) — it takes a reason.
// export const reviewComplaint = async (complaintId, reason) => {
//   const res = await api.post('/admin/complaints/review', {
//     complaint_id: complaintId,
//     reason,
//   });
//   return res.data.data;
// };

// export const markPendingInfo = async (complaintId, reason) => {
//   const res = await api.post('/admin/complaints/pending-info', {
//     complaint_id: complaintId,
//     reason,
//   });
//   return res.data.data;
// };

// export const resolveComplaint = async (complaintId, reason) => {
//   const res = await api.post('/admin/complaints/resolve', {
//     complaint_id: complaintId,
//     reason,
//   });
//   return res.data.data;
// };

// export const rejectComplaint = async (complaintId, reason) => {
//   const res = await api.post('/admin/complaints/reject', {
//     complaint_id: complaintId,
//     reason,
//   });
//   return res.data.data;
// };

// // ---------------------------------------------------------------------------
// // Shared error helper (same shape as the one used in restrictionsService.js)
// // ---------------------------------------------------------------------------
// export function extractApiErrorMessage(err, fallback) {
//   const data = err?.response?.data;
//   if (data?.errors && typeof data.errors === 'object') {
//     const messages = Object.values(data.errors).flat();
//     if (messages.length) return messages.join(' — ');
//   }
//   return data?.message || err.message || fallback;
// }

import api from '../utils/axiosInstance';

/**
 * Complaints Service
 * -------------------
 * Every function mirrors the pattern already used in restrictionsService.js /
 * WalletPage's inline calls: build a clean params object, skip empty values,
 * unwrap res.data, and let the caller decide what to do with errors.
 *
 * Endpoints covered (confirmed via Postman collection):
 *   GET  /admin/complaints                 (list + filters)
 *   GET  /admin/complaints/details          (single complaint, full detail)
 *   GET  /admin/complaints/messages         (chat thread for a complaint)
 *   POST /admin/complaints/add-message      (multipart/form-data, supports images[])
 *   POST /admin/complaints/open             { complaint_id }                → in_review
 *   POST /admin/complaints/review           { complaint_id, reason }        → in_review
 *   POST /admin/complaints/pending-info     { complaint_id, reason }        → pending_info
 *   POST /admin/complaints/resolve          { complaint_id, reason }        → resolved
 *   POST /admin/complaints/reject           { complaint_id, reason }        → rejected
 */

// ---------------------------------------------------------------------------
// List + filters
// ---------------------------------------------------------------------------
// Filters observed in the Postman "Params" tab:
//   query            → free text search (title/description, presumably)
//   status           → open | in_review | pending_info | closed | rejected | resolved
//   complaint_number → exact numeric complaint number
//   complainant_id   → numeric id of whoever filed the complaint
//   complainant_type → user | provider
//   respondent_id    → numeric id of whoever the complaint is against
//   respondent_type  → user | provider
export const fetchComplaints = async ({
  query,
  status,
  complaintNumber,
  complainantId,
  complainantType,
  respondentId,
  respondentType,
  page = 1,
} = {}) => {
  const params = { page };
  if (query) params.query = query;
  if (status) params.status = status;
  if (complaintNumber) params.complaint_number = complaintNumber;
  if (complainantId) params.complainant_id = complainantId;
  if (complainantType) params.complainant_type = complainantType;
  if (respondentId) params.respondent_id = respondentId;
  if (respondentType) params.respondent_type = respondentType;

  const res = await api.get('/admin/complaints', { params });
  // NOTE: the sample response for this endpoint is a flat, non-paginated
  // array (`{ success, message, data: [...] }`). If the backend later adds
  // pagination meta (total/last_page), this still works — callers should
  // read res.data.data for the list and treat pagination as best-effort.
  return res.data;
};

// ---------------------------------------------------------------------------
// Single complaint — full detail (respondent, complainant, assigned_to,
// images, status_history)
// ---------------------------------------------------------------------------
export const fetchComplaintDetails = async (complaintId) => {
  const res = await api.get('/admin/complaints/details', {
    params: { complaint_id: complaintId },
  });
  return res.data.data;
};

// ---------------------------------------------------------------------------
// Messages (chat thread)
// ---------------------------------------------------------------------------
export const fetchComplaintMessages = async (complaintId) => {
  const res = await api.get('/admin/complaints/messages', {
    params: { complaint_id: complaintId },
  });
  return res.data.data; // array of { id, message, is_me, sender, images[], created_at }
};

export const addComplaintMessage = async ({ complaintId, message, images = [] }) => {
  const formData = new FormData();
  formData.append('complaint_id', complaintId);
  formData.append('message', message);
  images.forEach((file) => formData.append('images[]', file));

  const res = await api.post('/admin/complaints/add-message', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.data;
};

// ---------------------------------------------------------------------------
// Status transitions
// ---------------------------------------------------------------------------
// "open" is the odd one out: it takes no reason and moves open → in_review.
// Treat it as "Start Review" in the UI.
export const openComplaint = async (complaintId) => {
  const res = await api.post('/admin/complaints/open', { complaint_id: complaintId });
  return res.data.data;
};

// "review" also lands on in_review, but is used to move a complaint back
// from pending_info (or resume review) — it takes a reason.
export const reviewComplaint = async (complaintId, reason) => {
  const res = await api.post('/admin/complaints/review', {
    complaint_id: complaintId,
    reason,
  });
  return res.data.data;
};

export const markPendingInfo = async (complaintId, reason) => {
  const res = await api.post('/admin/complaints/pending-info', {
    complaint_id: complaintId,
    reason,
  });
  return res.data.data;
};

export const resolveComplaint = async (complaintId, reason) => {
  const res = await api.post('/admin/complaints/resolve', {
    complaint_id: complaintId,
    reason,
  });
  return res.data.data;
};

export const rejectComplaint = async (complaintId, reason) => {
  const res = await api.post('/admin/complaints/reject', {
    complaint_id: complaintId,
    reason,
  });
  return res.data.data;
};

// ---------------------------------------------------------------------------
// Shared error helper (same shape as the one used in restrictionsService.js)
// ---------------------------------------------------------------------------
export function extractApiErrorMessage(err, fallback) {
  const data = err?.response?.data;
  if (data?.errors && typeof data.errors === 'object') {
    const messages = Object.values(data.errors).flat();
    if (messages.length) return messages.join(' — ');
  }
  return data?.message || err.message || fallback;
}