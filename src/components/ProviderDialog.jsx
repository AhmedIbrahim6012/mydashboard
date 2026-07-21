// import { useEffect, useState } from 'react';
// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   FormControl,
//   InputLabel,
//   MenuItem,
//   Select,
//   Stack,
//   TextField,
// } from '@mui/material';
// import { validateProvider } from '../utils/validation';
// import { useTranslation } from 'react-i18next';
// import { useAppContext } from '../context/AppContext';

// const EMPTY_FORM = {
//   first_name: '',
//   last_name: '',
//   phone: '',
//   email: '',
//   experience_years: '',
//   service_category_id: '',
// };

// function ProviderDialog({ open, Provider, onClose, onSubmit, loading = false, defaultProfessionId = '' }) {
//   const { t, i18n } = useTranslation();
//   const isRtl = i18n.dir() === 'rtl';
//   const { professions } = useAppContext();
//   const [values, setValues] = useState(EMPTY_FORM);
//   const [errors, setErrors] = useState(EMPTY_FORM);

//   useEffect(() => {
//     if (open) {
//       setValues({
//         first_name: Provider?.first_name || '',
//         last_name: Provider?.last_name || '',
//         phone: Provider?.phone || '',
//         email: Provider?.email || '',
//         experience_years: Provider?.experience_years || '',
//         service_category_id: Provider?.service_category_id || defaultProfessionId || professions[0]?.id || '',
//       });
//       setErrors(EMPTY_FORM);
//     }
//   }, [defaultProfessionId, open, professions, Provider]);

//   function handleChange(event) {
//     const { name, value } = event.target;
//     setValues((currentValues) => ({ ...currentValues, [name]: value }));
//   }

//   function handleSubmit(event) {
//     event.preventDefault();
//     const nextErrors = validateProvider(values);
//     setErrors({
//       first_name: nextErrors.first_name || '',
//       last_name: nextErrors.last_name || '',
//       phone: nextErrors.phone || '',
//       email: nextErrors.email || '',
//       experience_years: nextErrors.experience_years || '',
//       service_category_id: '',
//     });

//     if (Object.keys(nextErrors).length > 0) {
//       return;
//     }

//     // Build payload - remove email if empty
//     const payload = {
//       first_name: values.first_name.trim(),
//       last_name: values.last_name.trim(),
//       phone: values.phone.trim(),
//       experience_years: values.experience_years.trim(),
//       service_category_id: values.service_category_id,
//     };
    
//     if (values.email && values.email.trim()) {
//       payload.email = values.email.trim();
//     }

//     onSubmit(payload);
//   }

//   return (
//     <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
//       <DialogTitle>{Provider ? t('Providers.dialog.edit') : t('Providers.dialog.add')}</DialogTitle>
//       <form onSubmit={handleSubmit} noValidate>
//         <DialogContent>
//           <Stack spacing={2} sx={{ pt: 1 }}>
//             <TextField
//               label={t('Providers.dialog.firstName', 'First Name')}
//               name="first_name"
//               value={values.first_name}
//               onChange={handleChange}
//               error={Boolean(errors.first_name)}
//               helperText={errors.first_name}
//               autoFocus
//               fullWidth
//             />
//             <TextField
//               label={t('Providers.dialog.lastName', 'Last Name')}
//               name="last_name"
//               value={values.last_name}
//               onChange={handleChange}
//               error={Boolean(errors.last_name)}
//               helperText={errors.last_name}
//               fullWidth
//             />
//             <TextField
//               label={t('Providers.dialog.phone')}
//               name="phone"
//               value={values.phone}
//               onChange={handleChange}
//               error={Boolean(errors.phone)}
//               helperText={errors.phone}
//               fullWidth
//             />
//             <TextField
//               label={t('Providers.dialog.email')}
//               name="email"
//               type="email"
//               value={values.email}
//               onChange={handleChange}
//               error={Boolean(errors.email)}
//               helperText={errors.email}
//               fullWidth
//             />
//             <TextField
//               label={t('Providers.dialog.experienceYears', 'Experience Years')}
//               name="experience_years"
//               type="number"
//               value={values.experience_years}
//               onChange={handleChange}
//               error={Boolean(errors.experience_years)}
//               helperText={errors.experience_years || t('Providers.dialog.experienceHelp')}
//               fullWidth
//             />
//             <FormControl fullWidth>
//               <InputLabel id="profession-select-label">{t('professions.selectLabel', { defaultValue: 'Profession' })}</InputLabel>
//               <Select
//                 labelId="profession-select-label"
//                 label={t('professions.selectLabel', { defaultValue: 'Profession' })}
//                 name="service_category_id"
//                 value={values.service_category_id}
//                 onChange={handleChange}
//                 fullWidth
//               >
//                 {professions.map((profession) => (
//                   <MenuItem key={profession.id} value={profession.id}>
//                     {profession.name}
//                   </MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//           </Stack>
//         </DialogContent>
//         <DialogActions sx={{ px: 3, pb: 3 }}>
//           <Button onClick={onClose} disabled={loading} sx={{ ml: isRtl ? 0 : 1, mr: isRtl ? 1 : 0 }}>
//             {t('Providers.dialog.cancel')}
//           </Button>
//           <Button type="submit" variant="contained" disabled={loading}>
//             {loading ? t('Providers.dialog.saving') : t('Providers.dialog.save')}
//           </Button>
//         </DialogActions>
//       </form>
//     </Dialog>
//   );
// }

// export default ProviderDialog;

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
  Typography,
  IconButton
} from '@mui/material';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'; // أيقونة إغلاق إضافية لمظهر بريميوم
import { validateProvider } from '../utils/validation';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '../context/AppContext';
import CategorySelect from './CategorySelect';

const EMPTY_FORM = {
  first_name: '',
  last_name: '',
  phone: '',
  email: '',
  experience_years: '',
  service_category_id: '',
};

function ProviderDialog({ open, Provider, onClose, onSubmit, loading = false, defaultProfessionId = '' }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';
  const [values, setValues] = useState(EMPTY_FORM);
const [errors, setErrors] = useState(EMPTY_FORM);
const [selectedCategoryName, setSelectedCategoryName] = useState('');

 useEffect(() => {
  if (open) {
    setValues({
      first_name: Provider?.first_name || '',
      last_name: Provider?.last_name || '',
      phone: Provider?.phone || '',
      email: Provider?.email || '',
      experience_years: Provider?.experience_years || '',
      service_category_id: Provider?.service_category_id || defaultProfessionId || '',
    });
    setSelectedCategoryName(Provider?.service_category_name || '');
    setErrors(EMPTY_FORM);
  }
}, [defaultProfessionId, open, Provider]);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = validateProvider(values);
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
    <Dialog 
      open={open} 
      onClose={loading ? undefined : onClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: {
          borderRadius: '24px', // حواف ناعمة وعصرية جداً للمودال
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', // ظل سينمائي عميق
          backgroundImage: 'none',
          backgroundColor: '#ffffff',
          overflow: 'hidden'
        }
      }}
    >
      {/* رأس الـ Dialog المصمم بطريقة فخمة */}
      <DialogTitle sx={{ p: 3, pb: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(15, 23, 42, 0.06)' }}>
        <Typography sx={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>
          {Provider ? t('Providers.dialog.edit') : t('Providers.dialog.add')}
        </Typography>
        
        {!loading && (
          <IconButton onClick={onClose} size="small" sx={{ color: '#64748b', '&:hover': { backgroundColor: '#f1f5f9' } }}>
            <CloseRoundedIcon sx={{ fontSize: 20 }} />
          </IconButton>
        )}
      </DialogTitle>

      <form onSubmit={handleSubmit} noValidate>
        <DialogContent sx={{ p: 3, pt: 3 }}>
          <Stack spacing={2.5}>
            
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label={t('Providers.dialog.firstName', 'First Name')}
                name="first_name"
                value={values.first_name}
                onChange={handleChange}
                error={Boolean(errors.first_name)}
                helperText={errors.first_name}
                autoFocus
                fullWidth
                slotProps={{
                  input: { sx: { borderRadius: '12px' } }
                }}
              />
              <TextField
                label={t('Providers.dialog.lastName', 'Last Name')}
                name="last_name"
                value={values.last_name}
                onChange={handleChange}
                error={Boolean(errors.last_name)}
                helperText={errors.last_name}
                fullWidth
                slotProps={{
                  input: { sx: { borderRadius: '12px' } }
                }}
              />
            </Stack>

            <TextField
              label={t('Providers.dialog.phone')}
              name="phone"
              value={values.phone}
              onChange={handleChange}
              error={Boolean(errors.phone)}
              helperText={errors.phone}
              fullWidth
              slotProps={{
                input: { sx: { borderRadius: '12px', fontFamily: 'monospace' } }
              }}
            />

            <TextField
              label={t('Providers.dialog.email')}
              name="email"
              type="email"
              value={values.email}
              onChange={handleChange}
              error={Boolean(errors.email)}
              helperText={errors.email}
              fullWidth
              slotProps={{
                input: { sx: { borderRadius: '12px' } }
              }}
            />

            <TextField
              label={t('Providers.dialog.experienceYears', 'Experience Years')}
              name="experience_years"
              type="number"
              value={values.experience_years}
              onChange={handleChange}
              error={Boolean(errors.experience_years)}
              helperText={errors.experience_years || t('Providers.dialog.experienceHelp')}
              fullWidth
              slotProps={{
                input: { sx: { borderRadius: '12px' } }
              }}
            />

           <CategorySelect
  value={values.service_category_id}
  label={selectedCategoryName}
  onChange={(id, name) => {
    setValues((v) => ({ ...v, service_category_id: id }));
    setSelectedCategoryName(name);
  }}
  error={Boolean(errors.service_category_id)}
  helperText={errors.service_category_id}
/>
          </Stack>
        </DialogContent>

        {/* أزرار التحكم السفلية المتناسقة مع طابع الفخامة الداكن للأزرار */}
        <DialogActions sx={{ p: 3, pt: 1, borderTop: '1px solid rgba(15, 23, 42, 0.04)' }}>
          <Button 
            onClick={onClose} 
            disabled={loading} 
            sx={{ 
              ml: isRtl ? 0 : 1, 
              mr: isRtl ? 1 : 0,
              borderRadius: '10px',
              textTransform: 'none',
              fontWeight: 600,
              px: 2.5,
              color: '#64748b',
              '&:hover': { backgroundColor: '#f8fafc', color: '#0f172a' }
            }}
          >
            {t('Providers.dialog.cancel')}
          </Button>
          <Button 
            type="submit" 
            variant="contained" 
            disabled={loading}
            sx={{
              borderRadius: '12px',
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              height: 42,
              backgroundColor: '#1e293b', // متناسق تماماً مع لون أزرار الكارد الفخمة (Slate-800)
              boxShadow: 'none',
              '&:hover': { 
                backgroundColor: '#0f172a',
                boxShadow: '0 4px 12px rgba(15, 23, 42, 0.15)'
              },
            }}
          >
            {loading ? t('Providers.dialog.saving') : t('Providers.dialog.save')}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}

export default ProviderDialog;