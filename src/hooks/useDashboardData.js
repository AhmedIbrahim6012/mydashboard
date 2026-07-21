import { useAppContext } from '../context/AppContext';

export function useDashboardData() {
  const { Providers, customers } = useAppContext();

  const totalProviders = Providers.length;
  const totalProviderBalance = Providers.reduce((sum, Provider) => sum + Number(Provider.balance || 0), 0);
  const totalActivityCount = Providers.reduce((sum, Provider) => sum + (Provider.history?.length || 0), 0);
  const totalCustomers = Array.isArray(customers) ? customers.length : 0;

  return {
    Providers,
    totalProviders,
    totalProviderBalance,
    totalActivityCount,
    customers,
    totalCustomers,
  };
}
