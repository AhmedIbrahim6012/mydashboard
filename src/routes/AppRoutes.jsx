import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout.js';
import ProtectedRoute from './ProtectedRoute.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import OtpPage from '../pages/OtpPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
import FinancePage from '../pages/finance/FinancePage.jsx';
import WalletPage from '../pages/WalletPage.jsx';
import WorkerProfilePage from '../pages/WorkerProfilePage.jsx';
import WorkersPage from '../pages/WorkersPage.jsx';
import ProfessionDetailPage from '../pages/ProfessionDetailPage.jsx';
import ProfessionsPage from '../pages/ProfessionsPage.jsx';
import CustomersPage from '../pages/customers/CustomersPage.jsx';
import MessagesPage from '../pages/MessagesPage.jsx';
import { useAppContext } from '../context/AppContext.js';

function AppRoutes() {
  const { isAuthenticated } = useAppContext();

  return (
    <Routes>
      <Route path="/otp" element={<OtpPage />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/workers" element={<WorkersPage />} />
          <Route path="/workers/:workerId" element={<WorkerProfilePage />} />
          <Route path="/professions" element={<ProfessionsPage />} />
          <Route path="/professions/:id" element={<ProfessionDetailPage />} />
          <Route path="/staff/:workerId" element={<WorkerProfilePage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/:customerId" element={<CustomersPage />} />
          <Route path="/messages" element={<MessagesPage />} />
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
