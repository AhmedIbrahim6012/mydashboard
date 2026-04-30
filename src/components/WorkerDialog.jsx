import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from '@mui/material';
import { validateWorker } from '../utils/validation';

const EMPTY_FORM = {
  name: '',
  phone: '',
  experience: '',
};

function WorkerDialog({ open, worker, onClose, onSubmit, loading = false }) {
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState(EMPTY_FORM);

  useEffect(() => {
    if (open) {
      setValues({
        name: worker?.name || '',
        phone: worker?.phone || '',
        experience: worker?.experience || '',
      });
      setErrors(EMPTY_FORM);
    }
  }, [open, worker]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateWorker(values);
    setErrors({
      name: nextErrors.name || '',
      phone: nextErrors.phone || '',
      experience: nextErrors.experience || '',
    });

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    onSubmit({
      name: values.name.trim(),
      phone: values.phone.trim(),
      experience: values.experience.trim(),
    });
  }

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>{worker ? 'Edit Worker' : 'Add Worker'}</DialogTitle>
      <form onSubmit={handleSubmit} noValidate>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label="Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              error={Boolean(errors.name)}
              helperText={errors.name}
              autoFocus
              fullWidth
            />
            <TextField
              label="Phone Number"
              name="phone"
              value={values.phone}
              onChange={handleChange}
              error={Boolean(errors.phone)}
              helperText={errors.phone}
              fullWidth
            />
            <TextField
              label="Experience"
              name="experience"
              value={values.experience}
              onChange={handleChange}
              error={Boolean(errors.experience)}
              helperText={errors.experience || 'Example: 5 years or Senior Technician'}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : 'Save Worker'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default WorkerDialog;
