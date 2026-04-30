import { Alert, Snackbar } from '@mui/material';
import { useAppContext } from '../context/AppContext';

function AppSnackbar() {
  const { notification, closeNotification } = useAppContext();
  const open = Boolean(notification);

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={closeNotification}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={closeNotification} severity={notification?.severity || 'success'} variant="filled" sx={{ width: '100%' }}>
        <strong>{notification?.title}</strong>
        {notification?.message ? ` ${notification.message}` : ''}
      </Alert>
    </Snackbar>
  );
}

export default AppSnackbar;
