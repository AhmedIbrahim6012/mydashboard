// import { Navigate, Outlet, useLocation } from 'react-router-dom';
// import { useAppContext } from '../context/AppContext';

// function ProtectedRoute() {
//   const { isAuthenticated, isInitializing } = useAppContext();
//   const location = useLocation();

//   if (isInitializing) {
//     return null;
//   }

//   if (!isAuthenticated) {
//     return <Navigate to="/login" replace state={{ from: location }} />;
//   }

//   return <Outlet />;
// }

// export default ProtectedRoute;


import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAppContext } from '../context/AppContext';

function ProtectedRoute() {
  const { isAuthenticated, isInitializing } = useAppContext();
  const location = useLocation();

  if (isInitializing) {
    return (
      <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;