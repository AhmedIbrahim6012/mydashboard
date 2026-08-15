import api from '../utils/axiosInstance';

// Same defensive unwrap pattern used in AppContext's fetchProviders and in
// RestrictionsPage's account picker: some list endpoints return a flat
// array in `data`, others return a paginated `{ data: [...] }` shape
// nested inside `data`.
function unwrapPage(payload, fallbackPage) {
  const list = Array.isArray(payload) ? payload : (payload?.data ?? []);
  return {
    list,
    currentPage: payload?.current_page ?? fallbackPage,
    lastPage: payload?.last_page ?? 1,
  };
}

function unwrapList(payload) {
  return Array.isArray(payload) ? payload : (payload?.data ?? []);
}

// ---------------------------------------------------------------------------
// Users
// ---------------------------------------------------------------------------
export const fetchAllUsers = async (page = 1) => {
  const res = await api.get('/admin/user/all-users', { params: { page } });
  return unwrapPage(res.data?.data, page);
};

export const searchUsers = async (query) => {
  const res = await api.get('/admin/user/search', { params: { query } });
  return unwrapList(res.data?.data);
};

// ---------------------------------------------------------------------------
// Providers
// ---------------------------------------------------------------------------
export const fetchAllProviders = async (page = 1) => {
  const res = await api.get('/admin/provider/all-providers', { params: { page } });
  return unwrapPage(res.data?.data, page);
};

export const searchProviders = async (query) => {
  const res = await api.get('/admin/provider/search', { params: { query } });
  return unwrapList(res.data?.data);
};