



import { createContext, useContext, useEffect, useMemo, useState, useRef, useCallback } from 'react';
import {
  readCustomers,
  readFinanceRecords,
  readLanguage,
  readThemeMode,
  readProviders,
  readProfessions,
  writeAuth,
  writeCustomers,
  writeFinanceRecords,
  writeLanguage,
  writeThemeMode,
  writeProviders,
  writeProfessions,
  STORAGE_KEYS
} from '../services/storage';
import api from '../utils/axiosInstance';
import axios from 'axios';
import { refreshTokens, isRefreshTokenExpired, getNextRefreshDelayMs } from '../services/refreshManager';
// src/context/AppContext.jsx  ← أول السطر 1
import { requestNotificationPermission, onForegroundMessage } from '../services/notificationsService';

import { isTokenFresh } from '../utils/tokenUtils';   // ← أضف هاد السطر
import {watchFcmTokenRefresh} from '../services/notificationsService'; 
// ← أضف هاد السطر
const REFRESH_URL = 'https://homeservicesplatfrom.onrender.com/api/admin/auth/refresh-tokens';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [themeMode, setThemeMode] = useState(readThemeMode());
  const [language, setLanguageState] = useState(readLanguage());

  const [auth, setAuth] = useState(() => {
    const rToken = localStorage.getItem('refresh_token');
    const adminData = localStorage.getItem('admin');
    if (rToken && adminData) {
      try { return JSON.parse(adminData); } catch { return null; }
    }
    return null;
  });
// ==========================================
  // 📡 Fetch Professions (ALL pages — used for dropdowns/selects app-wide,
  // separate from ProfessionsPage's own paginated table state)
  // ==========================================
  
  // NOTE: kept capitalized ("Providers") intentionally — ProvidersPage,
  // ProfessionsPage, ProfessionDetailPage and WalletPage all already
  // destructure `Providers` from useAppContext(). Renaming here would break
  // those call sites, so this stays non-idiomatic on purpose.
  const [Providers, setProviders] = useState(readProviders());
  const [professions, setProfessions] = useState(readProfessions());
  const [customers, setCustomers] = useState(readCustomers());
  const [financeRecords, setFinanceRecords] = useState(readFinanceRecords());
  const [notification, setNotification] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);
const [initError, setInitError] = useState(null); // null | 'network-failed'
const initRetryCountRef = useRef(0);
const MAX_INIT_RETRIES = 6; // بعد 6 محاولات (~ دقيقة تقريبًا بالمجموع) نوقف
  // مزامنة البيانات مع الـ Storage المحلي
  const [initTrigger, setInitTrigger] = useState(0);

  useEffect(() => { writeThemeMode(themeMode); }, [themeMode]);
  useEffect(() => { writeLanguage(language); }, [language]);
  useEffect(() => { writeAuth(auth); }, [auth]);
  useEffect(() => { writeProviders(Providers); }, [Providers]);
  useEffect(() => { writeProfessions(professions); }, [professions]);
  useEffect(() => { writeCustomers(customers); }, [customers]);
  useEffect(() => { writeFinanceRecords(financeRecords); }, [financeRecords]);

  // ==========================================
  // ⚙️ Refresh-token engine
  // ==========================================
  const refreshIntervalRef = useRef(null);
  const isRefreshingRef = useRef(false);
  const lastHiddenRef = useRef(null);

  // Single place that ends a session completely and consistently.
  // Previously the interval's 401 handler and the 'auth:logout' event
  // handler each cleared things differently (or not at all), which could
  
  // leave stale tokens in localStorage after a "soft" logout.
  
  // const fullLogoutCleanup = useCallback(() => {
  //   localStorage.removeItem('access_token');
  //   localStorage.removeItem('refresh_token');
  //   localStorage.removeItem('admin');
  //   localStorage.removeItem('login_token');
  //   localStorage.removeItem(STORAGE_KEYS.auth);
  //   if (refreshIntervalRef.current) {
  //     clearInterval(refreshIntervalRef.current);
  //     refreshIntervalRef.current = null;
  //   }
  //   setAuth(null);
  // }, []);

  const fullLogoutCleanup = useCallback(() => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('admin');
  localStorage.removeItem('login_token');
  localStorage.removeItem('access_token_expiry');   // ← جديد
  localStorage.removeItem('refresh_token_expiry');  // ← جديد
  localStorage.removeItem(STORAGE_KEYS.auth);
  if (refreshIntervalRef.current) {
    clearTimeout(refreshIntervalRef.current); // ← صار setTimeout مش setInterval
    refreshIntervalRef.current = null;
  }
  setAuth(null);
}, []);

  // Single source of truth for the refresh network call. Every caller
  // (init, the 12-min interval, the visibility-change check) goes through
  // here and shares isRefreshingRef — this is what prevents two concurrent
  // requests from racing against the same (single-use, rotating) refresh
  // token, which could otherwise cause an unwanted early logout.
  // const performRefresh = useCallback(async () => {
  //   if (isRefreshingRef.current) return 'skipped';

  //   const refreshToken = localStorage.getItem('refresh_token');
  //   if (!refreshToken) return 'no-token';

  //   isRefreshingRef.current = true;
  //   try {
  //     const res = await axios.post(
  //       REFRESH_URL,
  //       { refresh_token: refreshToken },
  //       { timeout: 30000 }
  //     );

  //     localStorage.setItem('access_token', res.data.data.access_token.token);
  //     localStorage.setItem('refresh_token', res.data.data.refresh_token.token);

  //     console.log('✅ Token refreshed');
  //     return 'ok';
  //   } catch (err) {
  //     const isNetwork = !err.response || err.code === 'ERR_NETWORK';
  //     if (isNetwork) {
  //       console.log('⏳ Network error during refresh — will retry');
  //       return 'network';
  //     }
  //     if (err.response?.status === 401 || err.response?.status === 403) {
  //       console.log('❌ Refresh token expired/invalid');
  //       return 'unauthorized';
  //     }
  //     // other 4xx/5xx — don't kill the session over a transient server error
  //     return 'error';
  //   } finally {
  //     isRefreshingRef.current = false;
  //   }
  // }, []);
// شيل REFRESH_URL من فوق، ما عاد لازم

const performRefresh = useCallback(async () => {
  const result = await refreshTokens();
  return result.status; // نفس الأسماء يلي كانت مستخدمة: 'ok' | 'unauthorized' | 'network' | 'error' | 'no-token'
}, []);

  // Periodic / visibility-triggered refresh. auth is already set by the
  // time this runs (the interval only starts once auth is truthy), so this
  // never needs to touch React auth state on success — only on hard failure.
  const doRefresh = useCallback(async () => {
    const result = await performRefresh();
    if (result === 'unauthorized') {
      fullLogoutCleanup();
    }
  }, [performRefresh, fullLogoutCleanup]);

  // ==========================================
  // ⏱️ Init — مرة واحدة عند تشغيل التطبيق
  // ==========================================
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        if (!cancelled) {
          setAuth(null);
          setIsInitializing(false);
        }
        return;
      }

      // إذا في refresh_token وبيانات admin → دخّل المستخدم فورًا (optimistic)
      const adminData = localStorage.getItem('admin');
      let cachedAdmin = null;
      if (adminData) {
        try {
          cachedAdmin = JSON.parse(adminData);
          if (!cancelled) setAuth(cachedAdmin);
        } catch { /* ignore */ }
      }

      // const accessToken = localStorage.getItem('access_token');
const accessToken = localStorage.getItem('access_token');
  // console.log('access_token exists:', !!accessToken);
  // console.log('token value (first 20 chars):', accessToken?.substring(0, 20));
  // console.log('isTokenFresh result:', accessToken ? isTokenFresh(accessToken) : 'no token');
if (accessToken && isTokenFresh()) {
  // ✅ التوكن لسا شغال، ما بعمل refresh زيادة
  console.log('[Auth] Token still fresh, skipping refresh');
    initRetryCountRef.current = 0; // ← جديد

  if (!cancelled) setIsInitializing(false);
    watchFcmTokenRefresh(); // ✅ هنا — المستخدم logged in والتوكن شغال
  return;
}
// التوكن انتهى أو ما في access_token → قبل ما نتصل بالسيرفر، منتأكد محليًا
if (isRefreshTokenExpired()) {
  console.log('[Auth] Refresh token expired locally — logout بدون طلب شبكة');
  fullLogoutCleanup();
  setIsInitializing(false);
  return;
}

// التوكن انتهى أو ما في access_token → لازم نجدد
const result = await performRefresh();
if (cancelled) return;

if (result === 'network') {
  initRetryCountRef.current += 1;

  if (initRetryCountRef.current > MAX_INIT_RETRIES) {
    console.log('❌ Init failed after max retries — giving up, showing error UI');
    if (!cancelled) {
      setInitError('network-failed');
      setIsInitializing(false); // يوقف شاشة اللودينغ، مش ينضل عالق فيها
    }
    return;
  }

  // Exponential backoff بسيط: 5s, 10s, 20s, 30s, 30s, 30s...
  const delay = Math.min(5000 * Math.pow(2, initRetryCountRef.current - 1), 30000);
  console.log(`⏳ Server sleeping, retry ${initRetryCountRef.current}/${MAX_INIT_RETRIES} in ${delay / 1000}s...`);
  setTimeout(() => { if (!cancelled) init(); }, delay);
  return;
}

if (result === 'unauthorized') {
  fullLogoutCleanup();
} else if (result === 'ok' && !cachedAdmin) {
    initRetryCountRef.current = 0; // ← جديد

  const fallbackAdmin = { username: 'Admin', loggedInAt: new Date().toISOString() };
  localStorage.setItem('admin', JSON.stringify(fallbackAdmin));
  setAuth(fallbackAdmin);
}

setIsInitializing(false);
    };

    init();
    return () => { cancelled = true; };
  }, [performRefresh, fullLogoutCleanup,initTrigger]);

  // ==========================================
  // 🔄 Interval — يبدأ بعد تسجيل الدخول، يتوقف عند الخروج
  // ==========================================
 useEffect(() => {
  if (!auth) {
    if (refreshIntervalRef.current) {
      clearTimeout(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
    return;
  }

  let cancelled = false;

  const scheduleNext = () => {
    const delay = getNextRefreshDelayMs() ?? 3 * 60 * 1000; // fallback احتياطي بس لو ما في expiry محفوظ
    refreshIntervalRef.current = setTimeout(async () => {
      if (cancelled) return;
      await doRefresh();
      if (!cancelled) scheduleNext(); // نعيد الجدولة حسب الـ life_time الجديد يلي رجع بالريفريش
    }, delay);
  };

  scheduleNext();
  console.log('⏱️ Dynamic refresh scheduling started');

  return () => {
    cancelled = true;
    if (refreshIntervalRef.current) {
      clearTimeout(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
  };
}, [auth, doRefresh]);

  // ==========================================
  // 👁️ Visibility change — بس إذا غاب أكثر من 5 دقائق
  // ==========================================
  // useEffect(() => {
  //   const handleVisibility = () => {
  //     if (document.visibilityState === 'hidden') {
  //       lastHiddenRef.current = Date.now();
  //       return;
  //     }
  //     if (
  //       auth &&
  //       lastHiddenRef.current &&
  //       Date.now() - lastHiddenRef.current > 5 * 60 * 1000
  //     ) {
  //       doRefresh();
  //     }
  //   };

  //   document.addEventListener('visibilitychange', handleVisibility);
  //   return () => document.removeEventListener('visibilitychange', handleVisibility);
  // }, [auth, doRefresh]);

  // ==========================================
  // 🚪 Logout event من axiosInstance
  // ==========================================
  useEffect(() => {
    window.addEventListener('auth:logout', fullLogoutCleanup);
    return () => window.removeEventListener('auth:logout', fullLogoutCleanup);
  }, [fullLogoutCleanup]);


  // ==========================================
// 🔔 Firebase Notifications — أضفه هون
// ==========================================
useEffect(() => {
  if (!auth) return;
  // requestNotificationPermission شاغلة بالـ login flow — هون بس نسمع للإشعارات
  const unsubscribe = onForegroundMessage((payload) => {
    setNotification({
      severity: 'info',
      title: payload.notification?.title || 'إشعار جديد',
      message: payload.notification?.body || '',
    });
  });
  return () => unsubscribe();
}, [auth]);
  // ==========================================
  // 📡 Fetch Providers
  // ==========================================
  const fetchProviders = useCallback(async () => {
    try {
      const res = await api.get('/admin/provider/all-providers');
      const payload = res.data.data;
      setProviders(Array.isArray(payload) ? payload : payload.data ?? []);
    } catch (err) {
      console.error('Failed to fetch providers:', err);
    }
  }, []);


  // const fetchProfessions = useCallback(async () => {
  //   try {
  //     let page = 1;
  //     let lastPage = 1;
  //     const all = [];

  //     do {
  //       const res = await api.get('/admin/category/all-categories', { params: { page } });
  //       const payload = res.data.data;
  //       const list = Array.isArray(payload) ? payload : payload.data ?? [];
  //       all.push(...list);

  //       lastPage = Array.isArray(payload) ? 1 : payload.last_page ?? 1;
  //       page += 1;
  //     } while (page <= lastPage);

  //     setProfessions(all);
  //   } catch (err) {
  //     console.error('Failed to fetch professions:', err);
  //   }
  // }, []);

  // useEffect(() => {
  //   if (!auth) return;
  //   fetchProfessions();
  // }, [auth, fetchProfessions]);

  // useEffect(() => {
  //   if (!auth) return;
  //   fetchProviders();
  //   const interval = setInterval(fetchProviders, 30000);
  //   return () => clearInterval(interval);
  // }, [auth, fetchProviders]);

  // ==========================================
  // 💼 Actions
  // ==========================================
  const themeName = themeMode === 'dark' ? 'Dark' : 'Light';

  const actions = useMemo(
    () => ({
      login(username) {
        const adminObj = { username, loggedInAt: new Date().toISOString() };
        localStorage.setItem('admin', JSON.stringify(adminObj));
        setAuth(adminObj);
        setNotification({
          severity: 'success',
          title: 'Welcome back',
          message: `Signed in as ${username}.`,
        });
      },
      async logout() {
        try {
          await api.post('/admin/auth/logout');
        } catch (err) {
          console.error('Logout error:', err);
        } finally {
          fullLogoutCleanup();
          setNotification({
            severity: 'info',
            title: 'Signed out',
            message: 'You have been logged out successfully.',
          });
        }
      },
      toggleTheme() {
        setThemeMode((m) => (m === 'light' ? 'dark' : 'light'));
      },
      setLanguage(nextLanguage) {
        setLanguageState(nextLanguage === 'ar' ? 'ar' : 'en');
      },
      toggleLanguage() {
        setLanguageState((l) => (l === 'ar' ? 'en' : 'ar'));
      },

       retryInit() {
      initRetryCountRef.current = 0;
      setInitError(null);
      setIsInitializing(true);
      setInitTrigger((n) => n + 1);
    },
      notify(payload) {
        setNotification(payload);
      },
      closeNotification() {
        setNotification(null);
      },
      async addProvider(providerData) {
        const payload = {
          first_name: providerData.first_name,
          last_name: providerData.last_name,
          phone: providerData.phone,
          experience_years: providerData.experience_years,
          category_id: providerData.service_category_id,
        };
        if (providerData.email) payload.email = providerData.email;
        const res = await api.post('/admin/provider/create-provider', payload);
        const newProvider = res.data.data;
        setProviders((current) => [newProvider, ...current]);
        return newProvider;
      },
      setProfessions(data) {
        setProfessions(data);
      },
      refreshFinanceRecords() {
        setFinanceRecords(readFinanceRecords());
      },
      updateFinanceRecord(recordId, updates) {
        setFinanceRecords((current) =>
          current.map((r) => (r.id === recordId ? { ...r, ...updates } : r)),
        );
      },
      deleteFinanceRecord(recordId) {
        setFinanceRecords((current) => current.filter((r) => r.id !== recordId));
      },
      updateProvider(ProviderId, updates) {
        setProviders((current) =>
          current.map((p) => (p.id === ProviderId ? { ...p, ...updates } : p)),
        );
      },
      async activateProvider(providerId) {
        await api.post(`/admin/provider/${providerId}/activate`);
      },
      async deactivateProvider(providerId) {
        await api.post(`/admin/provider/${providerId}/deactivate`);
      },
      async deleteProvider(providerId) {
        await api.delete(`/admin/provider/delete-provider/${providerId}`);
      },
    }),
    [fullLogoutCleanup],
  );

  const value = useMemo(
    () => ({
      themeMode,
      language,
      themeName,
      auth,
      isAuthenticated: Boolean(auth),
      isInitializing,
      Providers,
      professions,
             // ← أضف هاد
initError,
      customers,
      financeRecords,
      notification,
      fetchProviders,
      ...actions,
    }),
    [actions, auth, isInitializing, customers, financeRecords, language, notification, professions, themeMode, themeName, Providers, fetchProviders, initError  ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider.');
  return context;
}