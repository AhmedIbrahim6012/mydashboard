// /* eslint-disable */
// // @ts-nocheck
// importScripts('https://www.gstatic.com/firebasejs/12.15.0/firebase-app-compat.js');
//  importScripts('https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging-compat.js');

// firebase.initializeApp({
//   apiKey: "AIzaSyDAishRviaNwf1aFeSlIGgp-25WHzoU_c0",
//   projectId: "mr-fix-62f88",
//   messagingSenderId: "174946494029",
//   appId: "1:174946494029:web:4d4dea1abcf5fa55221e04",
// });

// const messaging = firebase.messaging();

// // messaging.onBackgroundMessage((payload) => {
// //     console.log('[SW] Background message:', payload); // ← أضف هاد
// //   self.registration.showNotification(payload.notification.title, {
// //     body: payload.notification.body,
// //     icon: '/logo.png',
// //   });
// // });

// messaging.onBackgroundMessage((payload) => {
//   // هاد بيشتغل بس لما التطبيق مقفول
//   // لما مفتوح، onForegroundMessage بيتعامل معه
//   self.registration.showNotification(
//     payload.notification?.title || 'إشعار جديد',
//     { body: payload.notification?.body || '' }
//   );
// });

/* eslint-disable */
// @ts-nocheck
importScripts('https://www.gstatic.com/firebasejs/12.15.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.15.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDAishRviaNwf1aFeSlIGgp-25WHzoU_c0",
  projectId: "mr-fix-62f88",
  messagingSenderId: "174946494029",
  appId: "1:174946494029:web:4d4dea1abcf5fa55221e04",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  // تحقق إذا في clients مفتوحين (يعني التطبيق مفتوح)
  self.clients.matchAll({ type: 'window', includeUncontrolled: true })
    .then((clients) => {
      if (clients.length > 0) {
        // التطبيق مفتوح — لا تعرض system notification
        // onForegroundMessage رح يتعامل معه
        return;
      }
      // التطبيق مقفول — اعرض system notification
      self.registration.showNotification(
        payload.notification?.title || 'إشعار جديد',
        { body: payload.notification?.body || '' }
      );
    });
});