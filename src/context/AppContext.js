// import { createContext, useContext, useEffect, useMemo, useState,useRef } from 'react';
// import {
//   createSeedWorkers,
//   createSeedProfessions,
//   readCustomers,
//   readFinanceRecords,
//   readAuth,
//   readLanguage,
//   readThemeMode,
//   readWorkers,
//   readProfessions,
//   writeAuth,
//   writeCustomers,
//   writeFinanceRecords,
//   writeLanguage,
//   writeThemeMode,
//   writeWorkers,
//   writeProfessions,
// } from '../services/storage';
// import { generateId } from '../utils/id';
// import api from '../utils/axiosInstance';
// import { STORAGE_KEYS } from '../services/storage';
// import axios from 'axios';
// const AppContext = createContext(null);

// export function AppProvider({ children }) {
//   const [themeMode, setThemeMode] = useState(readThemeMode());
//   const [language, setLanguageState] = useState(readLanguage());
//   const [auth, setAuth] = useState(readAuth());
//   const [workers, setWorkers] = useState(readWorkers());
//   const [professions, setProfessions] = useState(readProfessions());
//   const [customers, setCustomers] = useState(readCustomers());
//   const [financeRecords, setFinanceRecords] = useState(readFinanceRecords());
//   const [notification, setNotification] = useState(null);
// const [isInitializing, setIsInitializing] = useState(true);
//   useEffect(() => {
//     writeThemeMode(themeMode);
//   }, [themeMode]);

//   useEffect(() => {
//     writeLanguage(language);
//   }, [language]);

//   useEffect(() => {
//     writeAuth(auth);
//   }, [auth]);

//   useEffect(() => {
//     writeWorkers(workers);
//   }, [workers]);

//   useEffect(() => {
//     writeProfessions(professions);
//   }, [professions]);

//   useEffect(() => {
//     writeCustomers(customers);
//   }, [customers]);

//   useEffect(() => {
//     writeFinanceRecords(financeRecords);
//   }, [financeRecords]);

// // بعد كل الـ useEffects الموجودة
// // useEffect(() => {
// //   // اشتغل بس لما يكون في auth
// //   if (!auth) return;

// //   console.log('Refresh interval started'); // للتأكد إنه بيشتغل

// //   const intervalId = setInterval(async () => {
// //     try {
// //       const refreshToken = localStorage.getItem('refresh_token');
// //       if (!refreshToken) return;

// //       console.log('Refreshing token...'); // للتأكد إنه بيجدد

// //       const res = await axios.post(
// //         'https://homeservicesplatfrom.onrender.com/api/admin/auth/refresh-tokens',
// //         { refresh_token: refreshToken }
// //       );

// //       localStorage.setItem('access_token', res.data.data.access_token.token);
// //       localStorage.setItem('refresh_token', res.data.data.refresh_token.token);

// //       console.log('Token refreshed successfully ✅');
// //     } catch (err) {
// //       console.error('Refresh failed:', err);
// //       localStorage.removeItem('access_token');
// //       localStorage.removeItem('refresh_token');
// //       localStorage.removeItem('admin');
// //       localStorage.removeItem('login_token');
// //       setAuth(null);
// //     }
// //   }, 4 * 60 * 1000);

// //   return () => {
// //     console.log('Refresh interval cleared');
// //     clearInterval(intervalId);
// //   };
// // }, [auth]); // ← auth dependency مهمة

// ////////////////////////////////////////////
// ///////////////////////////////////////////
// //const refreshIntervalRef = useRef(null);

// // useEffect(() => {
// //   if (!auth) {
// //     clearInterval(refreshIntervalRef.current);
// //     return;
// //   }

// //   // لو في interval شغال، لا تعمل واحد ثاني
// //   if (refreshIntervalRef.current) return;

// //   console.log('Refresh interval started');

// //   // refreshIntervalRef.current = setInterval(async () => {
// //   //   try {
// //   //     const refreshToken = localStorage.getItem('refresh_token');

// //   //     if (!refreshToken) return;

// //   //     console.log('Refreshing token...');

// //   //     const res = await axios.post(
// //   //       'https://homeservicesplatfrom.onrender.com/api/admin/auth/refresh-tokens',
// //   //       { refresh_token: refreshToken }
// //   //     );

// //   //     localStorage.setItem('access_token', res.data.data.access_token.token);
// //   //     localStorage.setItem('refresh_token', res.data.data.refresh_token.token);

// //   //     console.log('Token refreshed successfully ✅');
// //   //   } catch (err) {
// //   //     console.error('Refresh failed:', err);
// //   //     clearInterval(refreshIntervalRef.current);
// //   //     refreshIntervalRef.current = null;
// //   //     localStorage.removeItem('access_token');
// //   //     localStorage.removeItem('refresh_token');
// //   //     localStorage.removeItem('admin');
// //   //     localStorage.removeItem('login_token');
// //   //     setAuth(null);
// //   //   }
// //   // }, 4 * 60 * 1000);
// // refreshIntervalRef.current = setInterval(async () => {
// //   try {
// //     const refreshToken = localStorage.getItem('refresh_token');
// //     console.log('Using token:', refreshToken?.slice(0, 15) + '...'); // ← أضف

// //     if (!refreshToken) return;

// //     console.log('Refreshing token...');

// //     const res = await axios.post(
// //       'https://homeservicesplatfrom.onrender.com/api/admin/auth/refresh-tokens',
// //       { refresh_token: refreshToken }
// //     );

// //     const newRefresh = res.data.data.refresh_token.token;
// //     console.log('New token:', newRefresh?.slice(0, 15) + '...'); // ← أضف

// //     localStorage.setItem('access_token', res.data.data.access_token.token);
// //     localStorage.setItem('refresh_token', newRefresh);
// //       console.log('TTTTTTTTTTTTT',res);

// //     console.log('Token refreshed successfully ✅');
// //   } catch (err) {
// //     console.error('Refresh failed:', err);
// //     console.log('REAL ERROR =>', err.response?.data);
// // console.log('Status Code:', err.response?.status);

// // console.log(
// //   'Full Backend Response:',
// //   JSON.stringify(err.response?.data, null, 2)
// // );

// // console.log(
// //   'Backend Error:',
// //   err.response?.data?.errors
// // );

// // console.log(
// //   'Backend Message:',
// //   err.response?.data?.message
// // );

// // console.log('Axios Error Message:', err.message);
    
// //     console.log('Failed token was:', localStorage.getItem('refresh_token')?.slice(0, 15)); // ← أضف
// //       // لو Network Error، لا تخرج — بس حاول مرة ثانية

// //     if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
// //     console.log('Network error — will retry next interval');
// //     return; // ← ما نمسح التوكنات ولا نخرج المستخدم
// //   }

// //     clearInterval(refreshIntervalRef.current);
// //     refreshIntervalRef.current = null;
// //     localStorage.removeItem('access_token');
// //     localStorage.removeItem('refresh_token');
// //     localStorage.removeItem('admin');
// //     localStorage.removeItem('login_token');
// //     setAuth(null);
// //   }
// // }, 90 * 1000);
// //   return () => {
// //     clearInterval(refreshIntervalRef.current);
// //     refreshIntervalRef.current = null;
// //   };
// // }, [auth]);

// useEffect(() => {
//   let cancelled = false; // 🔑 منع double execution

//   const init = async () => {
//     const refreshToken = localStorage.getItem('refresh_token');

//     if (!refreshToken) {
//       if (!cancelled) setIsInitializing(false);
//       return;
//     }

//     localStorage.removeItem('access_token');

//     try {
//       const res = await axios.post(
//         'https://homeservicesplatfrom.onrender.com/api/admin/auth/refresh-tokens',
//         { refresh_token: refreshToken }
//       );

//       if (cancelled) return; // ← لو StrictMode شغّل مرة ثانية، تجاهل

//       localStorage.setItem('access_token', res.data.data.access_token.token);
//       localStorage.setItem('refresh_token', res.data.data.refresh_token.token);
//       console.log('Init refresh ✅');
//     } catch (err) {
//       if (cancelled) return;
//       if (err.response?.status === 401 || err.response?.status === 403) {
//         localStorage.removeItem('refresh_token');
//         localStorage.removeItem('admin');
//         localStorage.removeItem('login_token');
//         setAuth(null);
//       }
//     } finally {
//       if (!cancelled) setIsInitializing(false);
//     }
//   };

//   init();

//   return () => {
//     cancelled = true; // ← cleanup عند unmount أو re-run
//   };
// }, []);

// const refreshIntervalRef = useRef(null);

// useEffect(() => {
//   const handleLogout = () => {
//     clearInterval(refreshIntervalRef.current);
//     refreshIntervalRef.current = null;
//     setAuth(null);
//   };

//   window.addEventListener('auth:logout', handleLogout);
//   return () => window.removeEventListener('auth:logout', handleLogout);
// }, []);


// ////////////////////////////////////////
// // في AppContext.jsx — بعد useEffect الـ logout event
// useEffect(() => {
//   const handleVisibilityChange = () => {
//     if (document.visibilityState === 'visible' && auth) {
//       doRefresh(); // ← نفس الدالة مع نفس الـ lock ✅
//     }
//   };

//   document.addEventListener('visibilitychange', handleVisibilityChange);
//   return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
// }, [auth]);
// ///////////////////////////////////////
// const isRefreshingRef = useRef(false);

// const doRefresh = useRef(async () => {
//   if (isRefreshingRef.current) return;
//   const refreshToken = localStorage.getItem('refresh_token');
//   if (!refreshToken) return;

//   isRefreshingRef.current = true;

//   try {
//     const res = await axios.post(
//       'https://homeservicesplatfrom.onrender.com/api/admin/auth/refresh-tokens',
//       { refresh_token: refreshToken }
//     );
//     localStorage.setItem('access_token', res.data.data.access_token.token);
//     localStorage.setItem('refresh_token', res.data.data.refresh_token.token);

//     // 🔑 اقرأ الوقت من الـ response واحسب 80% منه
//     const lifeTimeMinutes = res.data.data.access_token.life_time;
//     const intervalMs = lifeTimeMinutes * 60 * 1000 * 0.8;
//     clearInterval(refreshIntervalRef.current);
//     refreshIntervalRef.current = setInterval(() => doRefresh.current(), intervalMs);

//     console.log(`Token refreshed ✅ — next refresh in ${lifeTimeMinutes * 0.8} min`);
//   } catch (err) {
//     if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') return;
//     if (err.response?.status === 401 || err.response?.status === 403) {
//       clearInterval(refreshIntervalRef.current);
//       refreshIntervalRef.current = null;
//       localStorage.removeItem('access_token');
//       localStorage.removeItem('refresh_token');
//       localStorage.removeItem('admin');
//       localStorage.removeItem('login_token');
//       setAuth(null);
//     }
//   } finally {
//     isRefreshingRef.current = false;
//   }
// }).current;
// useEffect(() => {
//   if (!auth) {
//     clearInterval(refreshIntervalRef.current);
//     refreshIntervalRef.current = null;
//     return;
//   }

//   if (refreshIntervalRef.current) return;

//   refreshIntervalRef.current = setInterval(doRefresh, 4 * 60 * 1000);

//   return () => {
//     clearInterval(refreshIntervalRef.current);
//     refreshIntervalRef.current = null;
//   };
// }, [auth]);
//   const themeName = themeMode === 'dark' ? 'Dark' : 'Light';

//   const actions = useMemo(
//     () => ({
//       login(username) {
//         setAuth({ username, loggedInAt: new Date().toISOString() });
//         setNotification({
//           severity: 'success',
//           title: 'Welcome back',
//           message: `Signed in as ${username}.`,
//         });
//       },      
//      async logout() {
//   try {
//     await api.post('/admin/auth/logout');
//   } catch (err) {
//     console.error('Logout error:', err);
//   } finally {
//     // امسح التوكنات بس، مو كل شي
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('refresh_token');
//     localStorage.removeItem('login_token');
//     localStorage.removeItem('admin');
//     localStorage.removeItem(STORAGE_KEYS.auth);
//     setAuth(null);
//     setNotification({
//       severity: 'info',
//       title: 'Signed out',
//       message: 'You have been logged out successfully.',
//     });
//   }
// },
//       toggleTheme() {
//         setThemeMode((currentMode) => (currentMode === 'light' ? 'dark' : 'light'));
//       },
//       setLanguage(nextLanguage) {
//         setLanguageState(nextLanguage === 'ar' ? 'ar' : 'en');
//       },
//       toggleLanguage() {
//         setLanguageState((currentLanguage) => (currentLanguage === 'ar' ? 'en' : 'ar'));
//       },
//       notify(payload) {
//         setNotification(payload);
//       },
//       closeNotification() {
//         setNotification(null);
//       },
//       addWorker(worker) {
//         setWorkers((currentWorkers) => [
//           {
//             ...worker,
//             id: generateId('worker'),
//             professionId: worker.professionId ?? professions[0]?.id ?? null,
//             balance: 0,
//             createdAt: new Date().toISOString(),
//             history: [],
//           },
//           ...currentWorkers,
//         ]);
//         setNotification({
//           severity: 'success',
//           title: 'Worker saved',
//           message: `${worker.name} was added to the system.`,
//         });
//       },
//       addProfession(profession) {
//         setProfessions((current) => [
//           {
//             id: generateId('profession'),
//             name: profession.name,
//             commission: Number(profession.commission || 0),
//             image: profession.image || null,
//           },
//           ...current,
//         ]);
//         setNotification({
//           severity: 'success',
//           title: 'Profession added',
//           message: `${profession.name} was added to the system.`,
//         });
//       },
//       setProfessions(data) {
//       setProfessions(data);
//     },
//       updateProfession(professionId, updates) {
//         setProfessions((current) =>
//           current.map((profession) =>
//             profession.id === professionId
//               ? {
//                   ...profession,
//                   ...updates,
//                   commission: updates.commission !== undefined ? Number(updates.commission) : profession.commission,
//                   image: updates.image !== undefined ? updates.image : profession.image,
//                 }
//               : profession,
//           ),
//         );
//         setNotification({
//           severity: 'success',
//           title: 'Profession updated',
//           message: 'Commission and category details were saved.',
//         });
//       },
//       deleteProfession(professionId) {
//         setProfessions((current) => current.filter((profession) => profession.id !== professionId));
//         setWorkers((current) => current.map((worker) => (worker.professionId === professionId ? { ...worker, professionId: null } : worker)));
//         setNotification({
//           severity: 'info',
//           title: 'Profession removed',
//           message: 'Workers were unassigned from the removed profession.',
//         });
//       },
//       addCustomer(customer) {
//         setCustomers((current) => [
//           {
//             ...customer,
//             id: generateId('customer'),
//             balance: Number(customer.balance || 0),
//             createdAt: new Date().toISOString(),
//           },
//           ...current,
//         ]);
//         setNotification({
//           severity: 'success',
//           title: 'Customer saved',
//           message: `${customer.fullName} was added to the system.`,
//         });
//       },
//       updateCustomer(customerId, updates) {
//         setCustomers((current) => current.map((c) => (c.id === customerId ? { ...c, ...updates } : c)));
//         setNotification({
//           severity: 'success',
//           title: 'Customer updated',
//           message: `Customer changes were saved.`,
//         });
//       },
//       deleteCustomer(customerId) {
//         setCustomers((current) => current.filter((c) => c.id !== customerId));
//         setNotification({
//           severity: 'success',
//           title: 'Customer deleted',
//           message: 'The customer record was removed.',
//         });
//       },
//       refreshFinanceRecords() {
//         setFinanceRecords(readFinanceRecords());
//       },
//       updateFinanceRecord(recordId, updates) {
//         setFinanceRecords((currentRecords) =>
//           currentRecords.map((record) =>
//             record.id === recordId
//               ? {
//                   ...record,
//                   ...updates,
//                 }
//               : record,
//           ),
//         );

//         setNotification({
//           severity: 'success',
//           title: 'Finance record updated',
//           message: 'The record was saved successfully.',
//         });
//       },
//       deleteFinanceRecord(recordId) {
//         setFinanceRecords((currentRecords) => currentRecords.filter((record) => record.id !== recordId));

//         setNotification({
//           severity: 'success',
//           title: 'Finance record deleted',
//           message: 'The record was removed from analytics.',
//         });
//       },
//       updateWorker(workerId, updates) {
//         setWorkers((currentWorkers) =>
//           currentWorkers.map((worker) =>
//             worker.id === workerId
//               ? {
//                   ...worker,
//                   ...updates,
//                 }
//               : worker,
//           ),
//         );
//         setNotification({
//           severity: 'success',
//           title: 'Worker updated',
//           message: `${updates.name || 'Worker'} changes were saved.`,
//         });
//       },
//       deleteWorker(workerId) {
//         setWorkers((currentWorkers) => currentWorkers.filter((worker) => worker.id !== workerId));
//         setNotification({
//           severity: 'success',
//           title: 'Worker deleted',
//           message: 'The worker record was removed.',
//         });
//       },
//       depositToWorker(workerId, amount) {
//         const numericAmount = Number(amount);
//         setWorkers((currentWorkers) =>
//           currentWorkers.map((worker) => {
//             if (worker.id !== workerId) {
//               return worker;
//             }

//             const updatedBalance = Number(worker.balance) + numericAmount;
//             const historyEntry = {
//               id: generateId('activity'),
//               type: 'deposit',
//               amount: numericAmount,
//               note: 'Wallet deposit',
//               date: new Date().toISOString(),
//             };

//             return {
//               ...worker,
//               balance: updatedBalance,
//               history: [historyEntry, ...(worker.history || [])],
//             };
//           }),
//         );
//         setNotification({
//           severity: 'success',
//           title: 'Deposit completed',
//           message: `Added ${numericAmount.toLocaleString()} to the selected wallet.`,
//         });
//       },
//       resetToSeedData() {
//         setWorkers(createSeedWorkers());
//         setProfessions(createSeedProfessions());
//       },
//     }),
//     [professions],
//   );

//   const value = useMemo(
//     () => ({
//       themeMode,
//       language,
//       themeName,
//       auth,
//       isAuthenticated: Boolean(auth),
//       isInitializing,
//       workers,
//       professions,
//       customers,
//       financeRecords,
//       notification,
//       ...actions,
//     }),
//     [actions, auth,  isInitializing   , customers, financeRecords, language, notification, professions, themeMode, themeName, workers],
//   );

//   return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
// }

// export function useAppContext() {
//   const context = useContext(AppContext);

//   if (!context) {
//     throw new Error('useAppContext must be used within an AppProvider.');
//   }

//   return context;
// }




import { createContext, useContext, useEffect, useMemo, useState, useRef } from 'react';
import {
  createSeedWorkers,
  createSeedProfessions,
  readCustomers,
  readFinanceRecords,
  readAuth,
  readLanguage,
  readThemeMode,
  readWorkers,
  readProfessions,
  writeAuth,
  writeCustomers,
  writeFinanceRecords,
  writeLanguage,
  writeThemeMode,
  writeWorkers,
  writeProfessions,
} from '../services/storage';
import { generateId } from '../utils/id';
import api from '../utils/axiosInstance';
import { STORAGE_KEYS } from '../services/storage';
import axios from 'axios';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [themeMode, setThemeMode] = useState(readThemeMode());
  const [language, setLanguageState] = useState(readLanguage());
  const [auth, setAuth] = useState(readAuth());
  const [workers, setWorkers] = useState(readWorkers());
  const [professions, setProfessions] = useState(readProfessions());
  const [customers, setCustomers] = useState(readCustomers());
  const [financeRecords, setFinanceRecords] = useState(readFinanceRecords());
  const [notification, setNotification] = useState(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // ==========================================
  // 1. مزامنة البيانات مع الـ Storage المحلي
  // ==========================================
  useEffect(() => { writeThemeMode(themeMode); }, [themeMode]);
  useEffect(() => { writeLanguage(language); }, [language]);
  useEffect(() => { writeAuth(auth); }, [auth]);
  useEffect(() => { writeWorkers(workers); }, [workers]);
  useEffect(() => { writeProfessions(professions); }, [professions]);
  useEffect(() => { writeCustomers(customers); }, [customers]);
  useEffect(() => { writeFinanceRecords(financeRecords); }, [financeRecords]);

  // ==========================================
  // 2. مرحلة المزامنة الأولية عند تشغيل التطبيق (Init)
  // ==========================================
  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        if (!cancelled) setIsInitializing(false);
        return;
      }

      localStorage.removeItem('access_token');

      try {
        const res = await axios.post(
          'https://homeservicesplatfrom.onrender.com/api/admin/auth/refresh-tokens',
          { refresh_token: refreshToken }
        );

        if (cancelled) return;

        localStorage.setItem('access_token', res.data.data.access_token.token);
        localStorage.setItem('refresh_token', res.data.data.refresh_token.token);
        console.log('Init refresh ✅');
      } catch (err) {
        if (cancelled) return;
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('admin');
          localStorage.removeItem('login_token');
          setAuth(null);
        }
      } finally {
        if (!cancelled) setIsInitializing(false);
      }
    };

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  // ==========================================
  // 3. إدارة عملية الـ Refresh التلقائي والديناميكي
  // ==========================================
  const refreshIntervalRef = useRef(null);
  const isRefreshingRef = useRef(false);

  // دالة التحديث الأساسية المصممة لمنع تكرار الطلبات المتزامنة
  const doRefresh = useMemo(() => async () => {
    if (isRefreshingRef.current) return;
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return;

    isRefreshingRef.current = true;

    try {
      const res = await axios.post(
        'https://homeservicesplatfrom.onrender.com/api/admin/auth/refresh-tokens',
        { refresh_token: refreshToken }
      );
      
      localStorage.setItem('access_token', res.data.data.access_token.token);
      localStorage.setItem('refresh_token', res.data.data.refresh_token.token);

      // حساب وقت الـ Interval الجديد بناءً على 80% من عمر التوكن الفعلي
      const lifeTimeMinutes = res.data.data.access_token.life_time || 15;
      const intervalMs = lifeTimeMinutes * 60 * 1000 * 0.8;

      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
      
      refreshIntervalRef.current = setInterval(() => {
        doRefresh();
      }, intervalMs);

      console.log(`Token refreshed ✅ — next refresh in ${(lifeTimeMinutes * 0.8).toFixed(1)} min`);
    } catch (err) {
      if (err.code === 'ERR_NETWORK' || err.message === 'Network Error') {
        console.log('Network error — will retry next interval');
        return;
      }
      if (err.response?.status === 401 || err.response?.status === 403) {
        if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('admin');
        localStorage.removeItem('login_token');
        setAuth(null);
      }
    } finally {
      isRefreshingRef.current = false;
    }
  }, [setAuth]);

  // إدارة تفعيل وإلغاء الـ Interval بناءً على حالة الـ Auth
  useEffect(() => {
    if (!auth) {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
      return;
    }

    if (!refreshIntervalRef.current) {
      doRefresh();
    }

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [auth, doRefresh]);

  // مراقبة عودة المستخدم لعلامة التبويب (Visibility Change)
  // useEffect(() => {
  //   const handleVisibilityChange = () => {
  //     if (document.visibilityState === 'visible' && auth && !isRefreshingRef.current) {
  //       doRefresh();
  //     }
  //   };

  //   document.addEventListener('visibilitychange', handleVisibilityChange);
  //   return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  // }, [auth, doRefresh]);

  // الاستماع لحدث تسجيل الخروج المخصص (Custom Event)
  useEffect(() => {
    const handleLogout = () => {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
      setAuth(null);
    };

    window.addEventListener('auth:logout', handleLogout);
    return () => window.removeEventListener('auth:logout', handleLogout);
  }, []);

  // ==========================================
  // 4. العمليات (Actions) والوظائف الفرعية
  // ==========================================
  const themeName = themeMode === 'dark' ? 'Dark' : 'Light';

  const actions = useMemo(
    () => ({
      login(username) {
        setAuth({ username, loggedInAt: new Date().toISOString() });
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
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('login_token');
          localStorage.removeItem('admin');
          localStorage.removeItem(STORAGE_KEYS.auth);
          setAuth(null);
          setNotification({
            severity: 'info',
            title: 'Signed out',
            message: 'You have been logged out successfully.',
          });
        }
      },
      toggleTheme() {
        setThemeMode((currentMode) => (currentMode === 'light' ? 'dark' : 'light'));
      },
      setLanguage(nextLanguage) {
        setLanguageState(nextLanguage === 'ar' ? 'ar' : 'en');
      },
      toggleLanguage() {
        setLanguageState((currentLanguage) => (currentLanguage === 'ar' ? 'en' : 'ar'));
      },
      notify(payload) {
        setNotification(payload);
      },
      closeNotification() {
        setNotification(null);
      },
      addWorker(worker) {
        setWorkers((currentWorkers) => [
          {
            ...worker,
            id: generateId('worker'),
            professionId: worker.professionId ?? professions[0]?.id ?? null,
            balance: 0,
            createdAt: new Date().toISOString(),
            history: [],
          },
          ...currentWorkers,
        ]);
        setNotification({
          severity: 'success',
          title: 'Worker saved',
          message: `${worker.name} was added to the system.`,
        });
      },
      addProfession(profession) {
        setProfessions((current) => [
          {
            id: generateId('profession'),
            name: profession.name,
            commission: Number(profession.commission || 0),
            image: profession.image || null,
          },
          ...current,
        ]);
        setNotification({
          severity: 'success',
          title: 'Profession added',
          message: `${profession.name} was added to the system.`,
        });
      },
      setProfessions(data) {
        setProfessions(data);
      },
      updateProfession(professionId, updates) {
        setProfessions((current) =>
          current.map((profession) =>
            profession.id === professionId
              ? {
                  ...profession,
                  ...updates,
                  commission: updates.commission !== undefined ? Number(updates.commission) : profession.commission,
                  image: updates.image !== undefined ? updates.image : profession.image,
                }
              : profession,
          ),
        );
        setNotification({
          severity: 'success',
          title: 'Profession updated',
          message: 'Commission and category details were saved.',
        });
      },
      deleteProfession(professionId) {
        setProfessions((current) => current.filter((profession) => profession.id !== professionId));
        setWorkers((current) => current.map((worker) => (worker.professionId === professionId ? { ...worker, professionId: null } : worker)));
        setNotification({
          severity: 'info',
          title: 'Profession removed',
          message: 'Workers were unassigned from the removed profession.',
        });
      },
      addCustomer(customer) {
        setCustomers((current) => [
          {
            ...customer,
            id: generateId('customer'),
            balance: Number(customer.balance || 0),
            createdAt: new Date().toISOString(),
          },
          ...current,
        ]);
        setNotification({
          severity: 'success',
          title: 'Customer saved',
          message: `${customer.fullName} was added to the system.`,
        });
      },
      updateCustomer(customerId, updates) {
        setCustomers((current) => current.map((c) => (c.id === customerId ? { ...c, ...updates } : c)));
        setNotification({
          severity: 'success',
          title: 'Customer updated',
          message: `Customer changes were saved.`,
        });
      },
      deleteCustomer(customerId) {
        setCustomers((current) => current.filter((c) => c.id !== customerId));
        setNotification({
          severity: 'success',
          title: 'Customer deleted',
          message: 'The customer record was removed.',
        });
      },
      refreshFinanceRecords() {
        setFinanceRecords(readFinanceRecords());
      },
      updateFinanceRecord(recordId, updates) {
        setFinanceRecords((currentRecords) =>
          currentRecords.map((record) =>
            record.id === recordId
              ? {
                  ...record,
                  ...updates,
                }
              : record,
          ),
        );

        setNotification({
          severity: 'success',
          title: 'Finance record updated',
          message: 'The record was saved successfully.',
        });
      },
      deleteFinanceRecord(recordId) {
        setFinanceRecords((currentRecords) => currentRecords.filter((record) => record.id !== recordId));

        setNotification({
          severity: 'success',
          title: 'Finance record deleted',
          message: 'The record was removed from analytics.',
        });
      },
      updateWorker(workerId, updates) {
        setWorkers((currentWorkers) =>
          currentWorkers.map((worker) =>
            worker.id === workerId
              ? {
                  ...worker,
                  ...updates,
                }
              : worker,
          ),
        );
        setNotification({
          severity: 'success',
          title: 'Worker updated',
          message: `${updates.name || 'Worker'} changes were saved.`,
        });
      },
      deleteWorker(workerId) {
        setWorkers((currentWorkers) => currentWorkers.filter((worker) => worker.id !== workerId));
        setNotification({
          severity: 'success',
          title: 'Worker deleted',
          message: 'The worker record was removed.',
        });
      },
      depositToWorker(workerId, amount) {
        const numericAmount = Number(amount);
        setWorkers((currentWorkers) =>
          currentWorkers.map((worker) => {
            if (worker.id !== workerId) {
              return worker;
            }

            const updatedBalance = Number(worker.balance) + numericAmount;
            const historyEntry = {
              id: generateId('activity'),
              type: 'deposit',
              amount: numericAmount,
              note: 'Wallet deposit',
              date: new Date().toISOString(),
            };

            return {
              ...worker,
              balance: updatedBalance,
              history: [historyEntry, ...(worker.history || [])],
            };
          }),
        );
        setNotification({
          severity: 'success',
          title: 'Deposit completed',
          message: `Added ${numericAmount.toLocaleString()} to the selected wallet.`,
        });
      },
      resetToSeedData() {
        setWorkers(createSeedWorkers());
        setProfessions(createSeedProfessions());
      },
    }),
    [professions],
  );

  const value = useMemo(
    () => ({
      themeMode,
      language,
      themeName,
      auth,
      isAuthenticated: Boolean(auth),
      isInitializing,
      workers,
      professions,
      customers,
      financeRecords,
      notification,
      ...actions,
    }),
    [actions, auth, isInitializing, customers, financeRecords, language, notification, professions, themeMode, themeName, workers],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider.');
  }

  return context;
}

