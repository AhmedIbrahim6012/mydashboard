// import axios from 'axios';

// const REFRESH_URL = 'https://homeservicesplatfrom.onrender.com/api/admin/auth/refresh-tokens';

// // القفل الحقيقي المشترك بين كل الملفات يلي بتستخدمو
// let refreshPromise = null;

// /**
//  * يرجع نتيجة موحّدة:
//  * 'ok' | 'unauthorized' | 'network' | 'error' | 'no-token'
//  * وبيرجع نفس الـ promise لأي طلب متزامن (مفيش تضارب أبداً)
//  */
// export function refreshTokens() {
//   if (refreshPromise) return refreshPromise;

//   refreshPromise = (async () => {
//     const refreshToken = localStorage.getItem('refresh_token');
//     if (!refreshToken) return { status: 'no-token' };

//     try {
//       const res = await axios.post(
//         REFRESH_URL,
//         { refresh_token: refreshToken },
//         { timeout: 30000 }
//       );

//       const access = res.data.data.access_token.token;
//       const refresh = res.data.data.refresh_token.token;
//       localStorage.setItem('access_token', access);
//       localStorage.setItem('refresh_token', refresh);
// localStorage.setItem('access_token_expiry', Date.now() + 15 * 60 * 1000); // ← أضف هاد السطر

//       console.log('✅ Token refreshed');
//       return { status: 'ok', accessToken: access };
//     } catch (err) {
//       const isNetwork = !err.response || err.code === 'ERR_NETWORK';
//       if (isNetwork) {
//         console.log('⏳ Network error during refresh — will retry');
//         return { status: 'network' };
//       }
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         console.log('❌ Refresh token expired/invalid');
//         return { status: 'unauthorized' };
//       }
//       return { status: 'error' };
//     } finally {
//       refreshPromise = null; // يفضى القفل، يصير قابل لطلب جديد بالمستقبل
//     }
//   })();

//   return refreshPromise;
// }

import axios from 'axios';

const REFRESH_URL = 'https://homeservicesplatfrom.onrender.com/api/admin/auth/refresh-tokens';
const SAFETY_BUFFER_MINUTES = 2; // منجدد الأكسس توكن قبل انتهائه بدقيقتين تمامًا متل ما اقترحت

let refreshPromise = null;

// نقطة واحدة لتخزين التوكنات — لازم تُستخدم من هون ومن شاشة اللوجين (verify-login) كمان
// حتى ما يصير فرق بين "دخول أول مرة" و"ريفريش" بالطريقة يلي منخزن فيها الانتهاء
export function persistTokens(data) {
  const { access_token, refresh_token } = data;

  localStorage.setItem('access_token', access_token.token);
  localStorage.setItem('refresh_token', refresh_token.token);

  // الزمن جاي من الـ response مباشرة، مش رقم ثابت
  localStorage.setItem(
    'access_token_expiry',
    String(Date.now() + access_token.life_time * 60 * 1000)
  );
  localStorage.setItem(
    'refresh_token_expiry',
    String(Date.now() + refresh_token.life_time * 60 * 1000)
  );

  return { accessLifeMinutes: access_token.life_time };
}

// فحص محلي بحت، بدون أي طلب شبكة
export function isRefreshTokenExpired() {
  const expiry = localStorage.getItem('refresh_token_expiry');
  if (!expiry) return false; // ما في معلومة محفوظة → منسيبها للسيرفر يقرر بدل ما نخمن
  return Date.now() >= Number(expiry);
}

// كم باقي وقت (ملي ثانية) لحد لازم نعمل الريفريش الجاي، حسب آخر access_token_expiry محفوظ
export function getNextRefreshDelayMs() {
  const expiry = localStorage.getItem('access_token_expiry');
  if (!expiry) return null;
  const remaining = Number(expiry) - Date.now() - SAFETY_BUFFER_MINUTES * 60 * 1000;
  return Math.max(remaining, 30 * 1000); // حد أدنى 30 ثانية حتى ما يصير استدعاء فوري لو الحساب طلع سالب
}

export function refreshTokens() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return { status: 'no-token' };

    try {
      const res = await axios.post(
        REFRESH_URL,
        { refresh_token: refreshToken },
        { timeout: 30000 }
      );

      const { accessLifeMinutes } = persistTokens(res.data.data);

      console.log('✅ Token refreshed');
      return { status: 'ok', accessLifeMinutes };
    } catch (err) {
      const isNetwork = !err.response || err.code === 'ERR_NETWORK';
      if (isNetwork) return { status: 'network' };
      if (err.response?.status === 401 ) {
        return { status: 'unauthorized' };
      }
      return { status: 'error' };
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}