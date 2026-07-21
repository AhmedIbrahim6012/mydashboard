import api from '../utils/axiosInstance';
import axiosInstance from '../utils/axiosInstance';

const BASE = '/admin/user';

// GET all users (with pagination)
export async function fetchCustomers(page = 1) {
  const { data } = await api.get(`${BASE}/all-users`, {
    params: { page },
  });
  return data.data; // { data: [...], total, per_page, current_page, last_page }
}

// GET search
// GET search globally with pagination
export async function searchCustomers(query, page = 1) {
  const { data } = await api.get(`${BASE}/search`, {
    params: { query, page },
  });
  return data.data;
}

// POST activate
export async function activateCustomer(id) {
  const { data } = await api.post(`${BASE}/${id}/activate`);
  return data;
}

// POST deactivate
export async function deactivateCustomer(id) {
  const { data } = await api.post(`${BASE}/${id}/deactivate`);
  return data;
}

export async function fetchAllCustomersForStats() {
  const { data } = await api.get(`${BASE}/all-users`, {
    params: { page: 1, per_page: 9999 },
  });
  return data.data;
}

// اجلب تفاصيل زبون واحد
export const fetchCustomerDetails = async (id) => {
  const res = await api.get(`/admin/user/${id}`);
  return res.data.data; // { id, first_name, last_name, email, ... }
};

// اجلب مراجعات الزبون (صفحة صفحة)
export const fetchCustomerReviews = async (id, page = 1) => {
  const res = await api.get(`/admin/user/${id}/reviews`, { params: { page } });
  return res.data.data; // { data: [...], total, per_page, current_page, last_page }
};