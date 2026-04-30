import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout';
import ProtectedRoute from './ProtectedRoute';
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import NotFoundPage from '../pages/NotFoundPage';
import FinancePage from '../pages/finance/FinancePage.jsx';
import WalletPage from '../pages/WalletPage';
import WorkerProfilePage from '../pages/WorkerProfilePage';
import WorkersPage from '../pages/WorkersPage';
import CustomersPage from '../pages/customers/CustomersPage';
import { useAppContext } from '../context/AppContext';

function AppRoutes() {
  const { isAuthenticated } = useAppContext();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/workers" element={<WorkersPage />} />
          <Route path="/workers/:workerId" element={<WorkerProfilePage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/:customerId" element={<CustomersPage />} />
          <Route path="/financial-analytics" element={<FinancePage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

export default AppRoutes;
