import axios from 'axios';

const REFRESH_URL = 'https://homeservicesplatfrom.onrender.com/api/admin/auth/refresh-tokens';

// القفل الحقيقي المشترك بين كل الملفات يلي بتستخدمو
let refreshPromise = null;

/**
 * يرجع نتيجة موحّدة:
 * 'ok' | 'unauthorized' | 'network' | 'error' | 'no-token'
 * وبيرجع نفس الـ promise لأي طلب متزامن (مفيش تضارب أبداً)
 */
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

      const access = res.data.data.access_token.token;
      const refresh = res.data.data.refresh_token.token;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
localStorage.setItem('access_token_expiry', Date.now() + 15 * 60 * 1000); // ← أضف هاد السطر

      console.log('✅ Token refreshed');
      return { status: 'ok', accessToken: access };
    } catch (err) {
      const isNetwork = !err.response || err.code === 'ERR_NETWORK';
      if (isNetwork) {
        console.log('⏳ Network error during refresh — will retry');
        return { status: 'network' };
      }
      if (err.response?.status === 401 || err.response?.status === 403) {
        console.log('❌ Refresh token expired/invalid');
        return { status: 'unauthorized' };
      }
      return { status: 'error' };
    } finally {
      refreshPromise = null; // يفضى القفل، يصير قابل لطلب جديد بالمستقبل
    }
  })();

  return refreshPromise;
}