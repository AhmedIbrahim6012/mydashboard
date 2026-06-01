import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';

function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAppContext();
  const location = useLocation();

  if (isInitializing) {
    return null;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;