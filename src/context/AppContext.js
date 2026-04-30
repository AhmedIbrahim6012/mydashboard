import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createSeedWorkers,
  readCustomers,
  readFinanceRecords,
  readAuth,
  readThemeMode,
  readWorkers,
  writeAuth,
  writeCustomers,
  writeFinanceRecords,
  writeThemeMode,
  writeWorkers,
} from '../services/storage';
import { generateId } from '../utils/id';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [themeMode, setThemeMode] = useState(readThemeMode());
  const [auth, setAuth] = useState(readAuth());
  const [workers, setWorkers] = useState(readWorkers);
  const [customers, setCustomers] = useState(readCustomers);
  const [financeRecords, setFinanceRecords] = useState(readFinanceRecords);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    writeThemeMode(themeMode);
  }, [themeMode]);

  useEffect(() => {
    writeAuth(auth);
  }, [auth]);

  useEffect(() => {
    writeWorkers(workers);
  }, [workers]);

  useEffect(() => {
    writeCustomers(customers);
  }, [customers]);

  useEffect(() => {
    writeFinanceRecords(financeRecords);
  }, [financeRecords]);

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
      logout() {
        setAuth(null);
        setNotification({
          severity: 'info',
          title: 'Signed out',
          message: 'You have been logged out successfully.',
        });
      },
      toggleTheme() {
        setThemeMode((currentMode) => (currentMode === 'light' ? 'dark' : 'light'));
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
      },
    }),
    [],
  );

  const value = useMemo(
    () => ({
      themeMode,
      themeName,
      auth,
      isAuthenticated: Boolean(auth),
      workers,
      customers,
      financeRecords,
      notification,
      ...actions,
    }),
    [actions, auth, customers, financeRecords, notification, themeMode, themeName, workers],
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
