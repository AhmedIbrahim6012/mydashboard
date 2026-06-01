// // // بدل هذا
// // import axios from 'axios';
// // axios.get(...)

// // // استخدم هذا
// // import api from '../utils/axiosInstance';
// // api.get(...)

// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'https://homeservicesplatfrom.onrender.com/api',
// });

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('access_token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (error.response?.status === 401 && !originalRequest._retry) {
//       originalRequest._retry = true;

//       try {
//         const refreshToken = localStorage.getItem('refresh_token');

//         const res = await axios.post(
//           'https://homeservicesplatfrom.onrender.com/api/admin/auth/refresh-tokens',
//           { refresh_token: refreshToken }
//         );

//         const newAccessToken = res.data.data.access_token.token;
//         const newRefreshToken = res.data.data.refresh_token.token; // ← أضف هذا

//         localStorage.setItem('access_token', newAccessToken);
// localStorage.setItem('refresh_token', newRefreshToken); // ← وهذا

//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return api(originalRequest);
//       } catch (err) {
//         localStorage.removeItem('access_token');
//   localStorage.removeItem('refresh_token');
//   localStorage.removeItem('admin');
//   localStorage.removeItem('login_token');
//   window.location.href = '/login';

//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;

import axios from 'axios';

const api = axios.create({
  baseURL: 'https://homeservicesplatfrom.onrender.com/api',
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        }).catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) throw new Error('No refresh token');

        const res = await axios.post(
          'https://homeservicesplatfrom.onrender.com/api/admin/auth/refresh-tokens',
          { refresh_token: refreshToken }
        );

        const newAccessToken = res.data.data.access_token.token;
        const newRefreshToken = res.data.data.refresh_token.token;

        localStorage.setItem('access_token', newAccessToken);
        localStorage.setItem('refresh_token', newRefreshToken);

        processQueue(null, newAccessToken);
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);

      } catch (err) {
        processQueue(err, null);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('admin');
        localStorage.removeItem('login_token');
        window.dispatchEvent(new Event('auth:logout'));
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;