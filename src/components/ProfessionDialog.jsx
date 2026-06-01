import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ImageRoundedIcon from '@mui/icons-material/ImageRounded';
import { useTranslation } from 'react-i18next';

const EMPTY_FORM = {
  name: '',
  commission: '',
  image: null,
  imageFile: null,
};

function ProfessionDialog({ open, profession, onClose, onSubmit, loading = false }) {
  const { t } = useTranslation();
  const [values, setValues] = useState(EMPTY_FORM);

  useEffect(() => {
    if (!open) {
      return;
    }

    setValues({
      name: profession?.name || '',
      commission: profession?.commission ?? '',
      image: profession?.image ?? null,
      imageFile: null,
    });
  }, [open, profession]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setValues((currentValues) => ({
        ...currentValues,
        image: reader.result,
        imageFile: file,
      }));
    };
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setValues((currentValues) => ({ ...currentValues, image: null, imageFile: null }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    onSubmit({
      name: values.name.trim(),
      commission: Number(values.commission || 0),
      image: values.image || null,
      imageFile: values.imageFile || null,
    });
  }

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>{profession ? t('professions.dialog.edit') : t('professions.dialog.add')}</DialogTitle>
      <form onSubmit={handleSubmit} noValidate>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Box
              sx={(theme) => ({
                p: 2,
                borderRadius: 3,
                border: `1px dashed ${theme.palette.divider}`,
                backgroundColor: theme.palette.action.hover,
              })}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <Box
                  sx={(theme) => ({
                    width: 96,
                    height: 96,
                    borderRadius: 3,
                    overflow: 'hidden',
                    border: `1px solid ${theme.palette.divider}`,
                    display: 'grid',
                    placeItems: 'center',
                    bgcolor: theme.palette.background.paper,
                    color: theme.palette.text.secondary,
                    flexShrink: 0,
                  })}
                >
                  {values.image ? (
                    <img
                      src={values.image}
                      alt="profession"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  ) : (
                    <ImageRoundedIcon sx={{ fontSize: 34 }} />
                  )}
                </Box>

                <Box sx={{ flex: 1, width: '100%' }}>
                  <Typography sx={{ fontWeight: 700, mb: 0.5 }}>
                    {t('professions.dialog.imageLabel', { defaultValue: 'Profession image' })}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                    {t('professions.dialog.imageHint', { defaultValue: 'Upload a representative image for this profession.' })}
                  </Typography>
                  <Stack direction="row" spacing={1.25}>
                    <input
                      accept="image/*"
                      id="profession-image"
                      type="file"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                    <label htmlFor="profession-image">
                      <Button component="span" variant="contained">
                        {t('professions.dialog.upload', { defaultValue: 'Upload' })}
                      </Button>
                    </label>
                    {values.image ? (
                      <Button variant="outlined" color="inherit" onClick={removeImage}>
                        {t('professions.dialog.remove', { defaultValue: 'Remove' })}
                      </Button>
                    ) : null}
                  </Stack>
                </Box>
              </Stack>
            </Box>

            <TextField
              label={t('professions.dialog.name')}
              name="name"
              value={values.name}
              onChange={handleChange}
              autoFocus
              fullWidth
            />

            <TextField
              label={t('professions.dialog.commission')}
              name="commission"
              type="number"
              value={values.commission}
              onChange={handleChange}
              inputProps={{ min: 0, max: 100, step: 0.1 }}
              fullWidth
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose} disabled={loading} variant="outlined">
            {t('common.cancel')}
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {profession
              ? t('professions.dialog.save', { defaultValue: 'Save changes' })
              : t('professions.dialog.create', { defaultValue: 'Create profession' })}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ProfessionDialog;
