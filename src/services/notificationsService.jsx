// import { messaging } from './firebase';
// import { getToken, onMessage } from 'firebase/messaging';
// import axiosInstance from '../utils/axiosInstance';

// const VAPID_KEY = 'BD62bWldfunyDr60zlApg6Tm4bRQhmFOwvR1CyBaE2WCt9TtJqfJUhPbdSqvhdlhZjtoTG7G_JKHOmanT-IH4-A'; // من Firebase Console

// export async function requestNotificationPermission() {
//   const permission = await Notification.requestPermission();
//   if (permission !== 'granted') return null;

//   const token = await getToken(messaging, { vapidKey: VAPID_KEY });

//   if (token) {

//     console.log('✅ FCM Token:', token);
//     // أرسل الـ token للباكند
//     // await axiosInstance.post('/admin/notifications/register-token', {
//     //   fcm_token: token,
//     // });
//   }

//   return token;
// }

// export function onForegroundMessage(callback) {
//   return onMessage(messaging, (payload) => {
//     // امنع أي system notification موجود
//     // واعرض بس عبر الـ Snackbar
//     callback(payload);
//   });
// }

// notificationsService.js
import { messaging } from './firebase';
import { getToken, onMessage } from 'firebase/messaging'; // ← شيل onTokenRefresh مو محتاجه
import api from '../utils/axiosInstance';

const VAPID_KEY = 'BD62bWldfunyDr60zlApg6Tm4bRQhmFOwvR1CyBaE2WCt9TtJqfJUhPbdSqvhdlhZjtoTG7G_JKHOmanT-IH4-A';

// دالة واحدة مشتركة تجيب الـ token
async function getFcmToken() {
  try {
    const token = await getToken(messaging, { vapidKey: VAPID_KEY });
    return token ?? null;
  } catch (err) {
    console.error('[FCM] getToken failed:', err.message);
    return null;
  }
}

// تُستدعى عند أول طلب permission (في login flow)
export async function requestNotificationPermission() {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') return null;

    const token = await getFcmToken();
    if (!token) return null;

    localStorage.setItem('fcm_token', token);
    return token;

  } catch (err) {
    console.error('[FCM] Permission request failed:', err.message);
    return null;
  }
}

// تُستدعى عند فتح الـ app — تشيك إذا تجدد الـ token وتحدث الباكند
export async function watchFcmTokenRefresh() {
  // إذا ما في permission أصلاً، ما تطلب — بس اخرج بهدوء
  if (Notification.permission !== 'granted') return;

  const currentToken = await getFcmToken();
  if (!currentToken) return;

  const savedToken = localStorage.getItem('fcm_token');

  if (currentToken === savedToken) return; // ✅ ما تغير، لا تعمل شي

  // تغير — حدّث الباكند واحفظ الجديد
  try {
    await api.post('/admin/auth/update-fcm-token', {
      fcm_token: currentToken,
    });
    localStorage.setItem('fcm_token', currentToken);
    console.log('[FCM] Token refreshed and updated');
  } catch (err) {
    console.error('[FCM] Failed to update token on server:', err);
  }
}

export function onForegroundMessage(callback) {
  return onMessage(messaging, (payload) => {
    callback(payload);
  });
}