import { useEffect, useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material';
import { validateWorker } from '../utils/validation';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';

const EMPTY_FORM = {
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  experience_years: '',
  service_category_id: '',
};

function WorkerDialog({ open, worker, onClose, onSubmit, loading = false, defaultProfessionId = '' }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const { professions } = useAppContext();
  const [values, setValues] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState(EMPTY_FORM);

  useEffect(() => {
    if (open) {
      setValues({
        first_name: worker?.first_name || '',
        last_name: worker?.last_name || '',
        phone: worker?.phone || '',
        email: worker?.email || '',
        experience_years: worker?.experience_years || '',
        service_category_id: worker?.service_category_id || defaultProfessionId || professions[0]?.id || '',
      });
      setErrors(EMPTY_FORM);
    }
  }, [defaultProfessionId, open, professions, worker]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateWorker(values);
    setErrors({
      first_name: nextErrors.first_name || '',
      last_name: nextErrors.last_name || '',
      phone: nextErrors.phone || '',
      email: nextErrors.email || '',
      experience_years: nextErrors.experience_years || '',
      service_category_id: '',
    });

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    // Build payload - remove email if empty
    const payload = {
      first_name: values.first_name.trim(),
      last_name: values.last_name.trim(),
      phone: values.phone.trim(),
      experience_years: values.experience_years.trim(),
      service_category_id: values.service_category_id,
    };
    
    if (values.email && values.email.trim()) {
      payload.email = values.email.trim();
    }

    onSubmit(payload);
  }

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>{worker ? t('workers.dialog.edit') : t('workers.dialog.add')}</DialogTitle>
      <form onSubmit={handleSubmit} noValidate>
        <DialogContent>
          <Stack spacing={2} sx={{ pt: 1 }}>
            <TextField
              label={t('workers.dialog.firstName', 'First Name')}
              name="first_name"
              value={values.first_name}
              onChange={handleChange}
              error={Boolean(errors.first_name)}
              helperText={errors.first_name}
              autoFocus
              fullWidth
            />
            <TextField
              label={t('workers.dialog.lastName', 'Last Name')}
              name="last_name"
              value={values.last_name}
              onChange={handleChange}
              error={Boolean(errors.last_name)}
              helperText={errors.last_name}
              fullWidth
            />
            <TextField
              label={t('workers.dialog.phone')}
              name="phone"
              value={values.phone}
              onChange={handleChange}
              error={Boolean(errors.phone)}
              helperText={errors.phone}
              fullWidth
            />
            <TextField
              label={t('workers.dialog.email')}
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
              fullWidth
            />
            <TextField
              label={t('workers.dialog.experienceYears', 'Experience Years')}
              name="experience_years"
              type="number"
              value={values.experience_years}
              onChange={handleChange}
              error={Boolean(errors.experience_years)}
              helperText={errors.experience_years || t('workers.dialog.experienceHelp')}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel id="profession-select-label">{t('professions.selectLabel', { defaultValue: 'Profession' })}</InputLabel>
              <Select
                labelId="profession-select-label"
                label={t('professions.selectLabel', { defaultValue: 'Profession' })}
                name="service_category_id"
                value={values.service_category_id}
                onChange={handleChange}
                fullWidth
              >
                {professions.map((profession) => (
                  <MenuItem key={profession.id} value={profession.id}>
                    {profession.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={onClose} disabled={loading} sx={{ ml: isRtl ? 0 : 1, mr: isRtl ? 1 : 0 }}>
            {t('workers.dialog.cancel')}
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? t('workers.dialog.saving') : t('workers.dialog.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default WorkerDialog;