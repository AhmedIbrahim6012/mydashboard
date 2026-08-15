// import { Navigate, Route, Routes } from 'react-router-dom';
// import AppLayout from '../layouts/AppLayout.js';
// import ProtectedRoute from './ProtectedRoute.jsx';
// import DashboardPage from '../pages/DashboardPage.jsx';
// import LoginPage from '../pages/LoginPage.jsx';
// import OtpPage from '../pages/OtpPage.jsx';
// import NotFoundPage from '../pages/NotFoundPage.jsx';
//  import FinancePage from '../pages/finance/FinancePage.jsx';
// import WalletPage from '../pages/WalletPage.jsx';
// import OrdersPage from '../pages/orders/OrdersPage.jsx';
// import ProviderProfilePage from '../pages/ProviderProfilePage.jsx';
// import ProvidersPage from '../pages/ProvidersPage.jsx';
// import ProfessionDetailPage from '../pages/ProfessionDetailPage.jsx';
// import ProfessionsPage from '../pages/ProfessionsPage.jsx';
// import CustomersPage from '../pages/customers/CustomersPage.jsx';
// import MessagesPage from '../pages/MessagesPage.jsx';
// import { useAppContext } from '../context/AppContext.js';
// import TwoFactorSetupPage from '../pages/TwoFactorSetupPage.jsx';
// import SettingsPage from '../pages/SettingsPage.jsx';
// import TransactionsPage from '../pages/TransactionsPage.jsx';
// import { Box, CircularProgress } from '@mui/material';
// import NotificationsPage from '../pages/NotificationsPage';
// import CustomerDetailsPage from '../pages/customers/CustomerDetailsPage';
// import RestrictionsPage from '../pages/RestrictionsPage';
// function AppRoutes() {
//   const { isAuthenticated,isInitializing  } = useAppContext();
// if (isInitializing) {
//     return (
//       <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//         <CircularProgress size={48} />
//       </Box>
//     );
//   }

  
//   return (
//     <Routes>
// <Route path="/otp" element={<OtpPage />} />
// <Route path="/2fa-setup" element={<TwoFactorSetupPage />} />      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
//       <Route element={<ProtectedRoute />}>
//         <Route element={<AppLayout />}>
//           <Route path="/" element={<Navigate to="/dashboard" replace />} />
//           <Route path="/dashboard" element={<DashboardPage />} />
//           <Route path="/Providers" element={<ProvidersPage />} />
//           <Route path="/Providers/:ProviderId" element={<ProviderProfilePage />} />
//           <Route path="/professions" element={<ProfessionsPage />} />
//           <Route path="/professions/:id" element={<ProfessionDetailPage />} />
//           <Route path="/staff/:ProviderId" element={<ProviderProfilePage />} />
//           <Route path="/customers" element={<CustomersPage />} />
//           <Route path="/customers/:customerId" element={<CustomersPage />} />
//           <Route path="/messages" element={<MessagesPage />} />
//           <Route path="/financial-analytics" element={<FinancePage />} />
//           <Route path="/orders" element={<OrdersPage />} />
//           <Route path="/wallet" element={<WalletPage />} />
//           <Route path="/transactions" element={<TransactionsPage />} />
//           <Route path="/settings" element={<SettingsPage />} />
//           <Route path="/notifications" element={<NotificationsPage />} />
// <Route path="/admin/user/:id" element={<CustomerDetailsPage />} />
// <Route path="/admin/restrictions" element={<RestrictionsPage />} />
//           <Route path="*" element={<NotFoundPage />} />
//         </Route>
//       </Route>
//       <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
//     </Routes>
//   );
// }

// export default AppRoutes;
import { Navigate, Route, Routes } from 'react-router-dom';
import AppLayout from '../layouts/AppLayout.js';
import ProtectedRoute from './ProtectedRoute.jsx';
import DashboardPage from '../pages/DashboardPage.jsx';
import LoginPage from '../pages/LoginPage.jsx';
import OtpPage from '../pages/OtpPage.jsx';
import NotFoundPage from '../pages/NotFoundPage.jsx';
 import FinancePage from '../pages/finance/FinancePage.jsx';
import WalletPage from '../pages/WalletPage.jsx';
import OrdersPage from '../pages/orders/OrdersPage.jsx';
import ProviderProfilePage from '../pages/ProviderProfilePage.jsx';
import ProvidersPage from '../pages/ProvidersPage.jsx';
import ProfessionDetailPage from '../pages/ProfessionDetailPage.jsx';
import ProfessionsPage from '../pages/ProfessionsPage.jsx';
import CustomersPage from '../pages/customers/CustomersPage.jsx';
import MessagesPage from '../pages/MessagesPage.jsx';
import { useAppContext } from '../context/AppContext.js';
import TwoFactorSetupPage from '../pages/TwoFactorSetupPage.jsx';
import SettingsPage from '../pages/SettingsPage.jsx';
import TransactionsPage from '../pages/TransactionsPage.jsx';
import { Box, CircularProgress, Typography, Button  } from '@mui/material';
import NotificationsPage from '../pages/NotificationsPage';
import CustomerDetailsPage from '../pages/customers/CustomerDetailsPage';
import RestrictionsPage from '../pages/RestrictionsPage';
import ComplaintsPage from '../pages/ComplaintsPage';
import OffersPage from '../pages/Offerspage.jsx';

function AppRoutes() {
  const { isAuthenticated, isInitializing, initError, retryInit } = useAppContext();

  if (initError === 'network-failed') {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          px: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          تعذر الاتصال بالسيرفر، تأكد من اتصالك بالإنترنت.
        </Typography>
        <Button variant="contained" onClick={retryInit}>
          إعادة المحاولة
        </Button>
      </Box>
    );
  }

  if (isInitializing) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  
  return (
    <Routes>
<Route path="/otp" element={<OtpPage />} />
<Route path="/2fa-setup" element={<TwoFactorSetupPage />} />      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/Providers" element={<ProvidersPage />} />
          <Route path="/Providers/:ProviderId" element={<ProviderProfilePage />} />
          <Route path="/professions" element={<ProfessionsPage />} />
          <Route path="/professions/:id" element={<ProfessionDetailPage />} />
          <Route path="/staff/:ProviderId" element={<ProviderProfilePage />} />
          <Route path="/customers" element={<CustomersPage />} />
          <Route path="/customers/:customerId" element={<CustomersPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/financial-analytics" element={<FinancePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
<Route path="/admin/user/:id" element={<CustomerDetailsPage />} />
<Route path="/admin/restrictions" element={<RestrictionsPage />} />
<Route path="/complaints" element={<ComplaintsPage />} />
<Route path="/admin/offers" element={<OffersPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
}

export default AppRoutes;
