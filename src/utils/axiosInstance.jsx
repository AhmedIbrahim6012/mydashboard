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

// import axios from 'axios';

// const api = axios.create({
//   baseURL: 'https://homeservicesplatfrom.onrender.com/api',
// });

// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach(prom => {
//     if (error) prom.reject(error);
//     else prom.resolve(token);
//   });
//   failedQueue = [];
// };

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('access_token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

// if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('refresh-tokens')) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         }).then(token => {
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//           return api(originalRequest);
//         }).catch(err => Promise.reject(err));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const refreshToken = localStorage.getItem('refresh_token');
//         if (!refreshToken) throw new Error('No refresh token');

//         const res = await axios.post(
//           'https://homeservicesplatfrom.onrender.com/api/admin/auth/refresh-tokens',
//           { refresh_token: refreshToken }
//         );

//         const newAccessToken = res.data.data.access_token.token;
//         const newRefreshToken = res.data.data.refresh_token.token;

//         localStorage.setItem('access_token', newAccessToken);
//         localStorage.setItem('refresh_token', newRefreshToken);

//         processQueue(null, newAccessToken);
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return api(originalRequest);

//       } catch (err) {
//         processQueue(err, null);
//         localStorage.removeItem('access_token');
//         localStorage.removeItem('refresh_token');
//         localStorage.removeItem('admin');
//         localStorage.removeItem('login_token');
//         window.dispatchEvent(new Event('auth:logout'));
//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }

//     }
//     return Promise.reject(error);
//   }
// );

// export default api;


// import axios from 'axios';

// const BASE_URL = 'https://homeservicesplatfrom.onrender.com/api';

// const api = axios.create({ baseURL: BASE_URL });

// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach(prom => error ? prom.reject(error) : prom.resolve(token));
//   failedQueue = [];
// };

// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem('access_token');
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     if (
//       error.response?.status === 401 &&
//       !originalRequest._retry &&
//       !originalRequest.url?.includes('refresh-tokens')
//     ) {
//       if (isRefreshing) {
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         }).then(token => {
//           originalRequest.headers.Authorization = `Bearer ${token}`;
//           return api(originalRequest);
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         const refreshToken = localStorage.getItem('refresh_token');
//         if (!refreshToken) throw new Error('No refresh token');

//         const res = await axios.post(
//           `${BASE_URL}/admin/auth/refresh-tokens`,
//           { refresh_token: refreshToken },
//           { timeout: 30000 } // ← مهم للـ sleep server
//         );

//         const newAccessToken = res.data.data.access_token.token;
//         const newRefreshToken = res.data.data.refresh_token.token;

//         localStorage.setItem('access_token', newAccessToken);
//         localStorage.setItem('refresh_token', newRefreshToken);

//         processQueue(null, newAccessToken);
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
//         return api(originalRequest);

//       } catch (err) {
//         processQueue(err, null);
//         localStorage.removeItem('access_token');
//         localStorage.removeItem('refresh_token');
//         localStorage.removeItem('admin');
//         localStorage.removeItem('login_token');
//         window.dispatchEvent(new Event('auth:logout'));
//         return Promise.reject(err);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;
import axios from 'axios';
import { refreshTokens } from '../services/refreshManager';
const BASE_URL = 'https://homeservicesplatfrom.onrender.com/api';
const api = axios.create({ baseURL: BASE_URL });

let failedQueue = [];
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => error ? prom.reject(error) : prom.resolve(token));
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

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('refresh-tokens')
    ) {
      originalRequest._retry = true;

      // إذا في عملية refresh شغالة أصلاً (سواء من هون أو من AppContext)
      // رح ننضم لنفس الـ promise مباشرة بدل ما نعمل وحدة جديدة
      try {
        const result = await refreshTokens(); // ← القفل المشترك هون

        if (result.status === 'ok') {
          processQueue(null, result.accessToken);
          originalRequest.headers.Authorization = `Bearer ${result.accessToken}`;
          return api(originalRequest);
        }

        if (result.status === 'unauthorized' || result.status === 'no-token') {
          const err = new Error('Session expired');
          processQueue(err, null);
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('admin');
          localStorage.removeItem('login_token');
          window.dispatchEvent(new Event('auth:logout'));
          return Promise.reject(err);
        }

        // 'network' أو 'error' — ما نطرد المستخدم على خطأ مؤقت
        processQueue(error, null);
        return Promise.reject(error);

      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;