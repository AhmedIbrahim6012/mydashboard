// // Shared between ComplaintsPage.jsx and ComplaintDetailsDialog.jsx so the
// // status → color/label mapping never drifts between the table and the dialog.

// export const STATUS_OPTIONS = [
//   'open',
//   'in_review',
//   'pending_info',
//   'resolved',
//   'rejected',
//   'closed',
// ];

// export const STATUS_META = {
//   open: { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)' }, // blue
//   in_review: { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' }, // amber
//   pending_info: { color: '#8b5cf6', bg: 'rgba(139,92,246,0.12)' }, // purple
//   resolved: { color: '#10b981', bg: 'rgba(16,185,129,0.12)' }, // green
//   rejected: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)' }, // red
//   closed: { color: '#6b7280', bg: 'rgba(107,114,128,0.12)' }, // grey
// };

// export function getStatusMeta(status) {
//   return STATUS_META[status] || STATUS_META.closed;
// }

// // Same UTC→Asia/Riyadh formatter used across WalletPage/TransactionsPage.
// export function toUTC3(dateStr) {
//   if (!dateStr) return '—';
//   const date = new Date(dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T') + 'Z');
//   if (isNaN(date)) return dateStr;
//   return new Intl.DateTimeFormat('en-GB', {
//     timeZone: 'Asia/Riyadh',
//     year: 'numeric',
//     month: '2-digit',
//     day: '2-digit',
//     hour: '2-digit',
//     minute: '2-digit',
//     second: '2-digit',
//     hour12: false,
//   }).format(date);
// }

// // Which action buttons make sense from a given current status.
// // 'open' action needs no reason; the rest do.
// export function getAvailableActions(status) {
//   switch (status) {
//     case 'open':
//       return ['start_review', 'reject'];
//     case 'in_review':
//       return ['pending_info', 'resolve', 'reject'];
//     case 'pending_info':
//       return ['resume_review', 'resolve', 'reject'];
//     case 'resolved':
//     case 'rejected':
//     case 'closed':
//     default:
//       return [];
//   }
// }
// Shared between ComplaintsPage.jsx and ComplaintDetailsDialog.jsx so the
// status → color/label mapping never drifts between the table and the dialog.

// Shared between ComplaintsPage.jsx and ComplaintDetailsDialog.jsx so the
// status → color/label mapping never drifts between the table and the
// dialog. Styled the same way as RestrictionsPage's typeStyles/statusStyles
// (light + dark background/border pairs, resolved with isDark at render time).

export const STATUS_OPTIONS = [
  'open',
  'in_review',
  'pending_info',
  'resolved',
  'rejected',
  'closed',
];

export const STATUS_STYLES = {
  open:         { color: '#3b82f6', background: '#eff6ff', darkBackground: '#0b1b34', border: '#bfdbfe', darkBorder: '#1e40af' },
  in_review:    { color: '#f59e0b', background: '#fffbeb', darkBackground: '#2d1b00', border: '#fde68a', darkBorder: '#92400e' },
  pending_info: { color: '#8b5cf6', background: '#f5f3ff', darkBackground: '#1e1040', border: '#ddd6fe', darkBorder: '#5b21b6' },
  resolved:     { color: '#10b981', background: '#ecfdf5', darkBackground: '#052e16', border: '#a7f3d0', darkBorder: '#166534' },
  rejected:     { color: '#ef4444', background: '#fef2f2', darkBackground: '#2d0a0a', border: '#fecaca', darkBorder: '#7f1d1d' },
  closed:       { color: '#64748b', background: '#f1f5f9', darkBackground: '#1e293b', border: '#cbd5e1', darkBorder: '#334155' },
};

// Backward-compatible simple accessor (color + a single bg) — still used by
// ComplaintDetailsDialog's chips where dark-mode awareness isn't wired up.
export function getStatusMeta(status) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.closed;
  return { color: s.color, bg: s.background, darkBg: s.darkBackground, border: s.border, darkBorder: s.darkBorder };
}

export function getStatusStyle(status) {
  return STATUS_STYLES[status] || STATUS_STYLES.closed;
}

// Same UTC→Asia/Riyadh formatter used across WalletPage/TransactionsPage/RestrictionsPage.
export function toUTC3(dateStr) {
  if (!dateStr) return '—';
  const date = new Date(dateStr.includes('T') ? dateStr : dateStr.replace(' ', 'T') + 'Z');
  if (isNaN(date)) return dateStr;
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Riyadh',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date);
}

// Which action buttons make sense from a given current status.
// 'open' action needs no reason; the rest do.
export function getAvailableActions(status) {
  switch (status) {
    case 'open':
      return ['start_review', 'reject'];
    case 'in_review':
      return ['pending_info', 'resolve', 'reject'];
    case 'pending_info':
      return ['resume_review', 'resolve', 'reject'];
    case 'resolved':
    case 'rejected':
    case 'closed':
    default:
      return [];
  }
}