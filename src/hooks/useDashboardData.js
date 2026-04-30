import { useAppContext } from '../context/AppContext';

export function useDashboardData() {
  const { workers, customers } = useAppContext();

  const totalWorkers = workers.length;
  const totalWorkerBalance = workers.reduce((sum, worker) => sum + Number(worker.balance || 0), 0);
  const totalActivityCount = workers.reduce((sum, worker) => sum + (worker.history?.length || 0), 0);
  const totalCustomers = Array.isArray(customers) ? customers.length : 0;

  return {
    workers,
    totalWorkers,
    totalWorkerBalance,
    totalActivityCount,
    customers,
    totalCustomers,
  };
}
