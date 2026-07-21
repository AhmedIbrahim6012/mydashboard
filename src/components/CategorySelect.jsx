// import { useState, useEffect, useRef } from 'react';
// import {
//   Box,
//   Popover,
//   TextField,
//   InputAdornment,
//   List,
//   ListItemButton,
//   ListItemText,
//   CircularProgress,
//   Typography,
//   IconButton,
//   Stack,
// } from '@mui/material';
// import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
// import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
// import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
// import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
// import { useTranslation } from 'react-i18next';
// import api from '../utils/axiosInstance';

// function CategorySelect({ value, label, onChange, error, helperText, disabled = false }) {
//   const { t, i18n } = useTranslation();
//   const isRtl = i18n.dir() === 'rtl';

//   const [anchorEl, setAnchorEl] = useState(null);
//   const open = Boolean(anchorEl);

//   const [selectedName, setSelectedName] = useState(label || '');
//   const [search, setSearch] = useState('');
//   const [categories, setCategories] = useState([]);
//   const [page, setPage] = useState(1);
//   const [lastPage, setLastPage] = useState(1);
//   const [loading, setLoading] = useState(false);

//   const debounceRef = useRef(null);
//   const isFirstOpen = useRef(true);

//   useEffect(() => {
//     setSelectedName(label || '');
//   }, [label]);

//  async function fetchCategories({ pageNum = 1, query = search } = {}) {
//     setLoading(true);
//     try {
//       const trimmed = query.trim();
//       const response = trimmed
//         ? await api.get('/admin/category/search', { params: { query: trimmed, page: pageNum, is_active: 1 } })
//         : await api.get('/admin/category/all-categories', { params: { page: pageNum, is_active: 1 } });

//       const payload = response.data.data;
//       const rawList = Array.isArray(payload) ? payload : payload.data ?? [];
//       // safety net: لو الـ backend ما طبّق الفلترة (مثلاً على search) منفلتر يدوياً بالفرونت
//       const activeOnly = rawList.filter((c) => c.is_active);

//       setCategories(activeOnly);
//       setPage(Array.isArray(payload) ? 1 : payload.current_page ?? pageNum);
//       setLastPage(Array.isArray(payload) ? 1 : payload.last_page ?? 1);
//     } catch (err) {
//       console.error('Failed to fetch categories:', err);
//       setCategories([]);
//     } finally {
//       setLoading(false);
//     }
//   }
//   function handleOpen(event) {
//     setAnchorEl(event.currentTarget);
//     if (isFirstOpen.current) {
//       fetchCategories({ pageNum: 1, query: '' });
//       isFirstOpen.current = false;
//     }
//   }

//   function handleClose() {
//     setAnchorEl(null);
//   }

//   function handleSearchChange(event) {
//     const query = event.target.value;
//     setSearch(query);
//     if (debounceRef.current) clearTimeout(debounceRef.current);
//     debounceRef.current = setTimeout(() => {
//       fetchCategories({ pageNum: 1, query });
//     }, 400);
//   }

//   function handleSelect(category) {
//     setSelectedName(category.name);
//     onChange(category.id, category.name);
//     handleClose();
//   }

//   return (
//     <Box sx={{ width: '100%' }}>
//       <TextField
//         label={t('professions.selectLabel', { defaultValue: 'Profession' })}
//         value={selectedName}
//         onClick={disabled ? undefined : handleOpen}
//         error={Boolean(error)}
//         helperText={helperText}
//         fullWidth
//         disabled={disabled}
//         InputProps={{
//           readOnly: true,
//           endAdornment: (
//             <InputAdornment position="end">
//               <KeyboardArrowDownRoundedIcon sx={{ color: '#64748b' }} />
//             </InputAdornment>
//           ),
//           sx: { borderRadius: '12px', cursor: disabled ? 'default' : 'pointer' },
//         }}
//       />

//      <Popover
//   open={open}
//   anchorEl={anchorEl}
//   onClose={handleClose}
//   anchorOrigin={{ vertical: 'bottom', horizontal: isRtl ? 'right' : 'left' }}
//   transformOrigin={{ vertical: 'top', horizontal: isRtl ? 'right' : 'left' }}
//   sx={{ zIndex: 1500 }}
//   PaperProps={{
//     sx: {
//       // تعديل العرض ليكون أكبر وأكثر اتساعاً ومناسب للشاشات المختلفة
//       width: anchorEl ? Math.max(anchorEl.offsetWidth, 480) : 480, 
//       maxWidth: '95vw',
//       mt: 1.25, // إبعاد القائمة قليلاً عن زر الفتح ليعطي شعوراً بالعمق
//       borderRadius: '20px', // حواف أنعم وأكثر عصرية
//       // ظلال احترافية ناعمة تحاكي الواقع (Smooth Drop Shadows)
//       boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.12), 0 12px 24px -6px rgba(15, 23, 42, 0.04)',
//       border: '1px solid rgba(15, 23, 42, 0.06)',
//       backdropFilter: 'blur(8px)', // إضافة تأثير تغبيش خلفي ناعم للواقعية
//       backgroundColor: 'rgba(255, 255, 255, 0.98)',
//       overflow: 'hidden',
//     },
//   }}
// >
//   {/* صندوق البحث - تحسين الهوامش ليعطي مساحة تنفس للتصميم */}
//   <Box sx={{ p: 2.5, pb: 1.5, borderBottom: '1px solid rgba(15, 23, 42, 0.04)' }}>
//     <TextField
//       autoFocus
//       size="medium"
//       fullWidth
//       placeholder={t('professions.searchPlaceholder', { defaultValue: 'Search profession...' })}
//       value={search}
//       onChange={handleSearchChange}
//       InputProps={{
//         startAdornment: (
//           <InputAdornment position="start">
//             {loading ? (
//               <CircularProgress size={20} thickness={4} sx={{ color: '#6366f1' }} />
//             ) : (
//               <SearchRoundedIcon sx={{ fontSize: 22, color: '#94a3b8' }} />
//             )}
//           </InputAdornment>
//         ),
//         sx: { 
//           borderRadius: '14px', // حواف متناسقة مع الإطار الخارجي
//           fontSize: '0.95rem', 
//           height: 54,
//           backgroundColor: '#f8fafc', // لون خلفية هادئ للبحث
//           '& .MuiOutlinedInput-notchedOutline': {
//             borderColor: 'rgba(15, 23, 42, 0.06)',
//           },
//           '&:hover .MuiOutlinedInput-notchedOutline': {
//             borderColor: 'rgba(15, 23, 42, 0.12)',
//           },
//           '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//             borderColor: '#6366f1', // لون التركيز احترافي (Indigo)
//           }
//         },
//       }}
//     />
//   </Box>

//   {/* قائمة العناصر - زيادة الطول الأقصى قليلاً */}
//   <List sx={{ maxHeight: 420, overflowY: 'auto', px: 1.5, py: 1 }}>
//     {loading ? (
//       <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
//         <CircularProgress size={32} thickness={4} sx={{ color: '#6366f1' }} />
//       </Box>
//     ) : categories.length > 0 ? (
//       categories.map((category) => (
//         <ListItemButton
//           key={category.id}
//           selected={category.id === value}
//           onClick={() => handleSelect(category)}
//           sx={{
//             mb: 0.75, // مسافة بين العناصر لمنع التكدس
//             py: 1.5, 
//             px: 2,
//             borderRadius: '12px',
//             transition: 'all 0.2s ease-in-out',
//             // تأثير تمرير الماوس (Hover) واقعي واحترافي
//             '&:hover': {
//               backgroundColor: '#f1f5f9',
//             },
//             // تأثير اختيار العنصر الحالي
//             '&.Mui-selected': {
//               backgroundColor: 'rgba(99, 102, 241, 0.08)',
//               '&:hover': {
//                 backgroundColor: 'rgba(99, 102, 241, 0.12)',
//               },
//               '& .MuiListItemText-primary': {
//                 color: '#4f46e5', // تغيير لون النص عند الاختيار لتمييزه
//               }
//             }
//           }}
//         >
//           <ListItemText
//             primary={category.name}
//             secondary={`${t('professions.commission', { defaultValue: 'Commission' })}: ${category.commission}%`}
//             primaryTypographyProps={{ 
//               fontSize: '0.95rem', 
//               fontWeight: 600, // خط سميك وأنيق بدون مبالغة
//               color: '#0f172a',
//               letterSpacing: '-0.01em'
//             }}
//             secondaryTypographyProps={{ 
//               fontSize: '0.82rem', 
//               fontWeight: 500,
//               color: '#64748b',
//               mt: 0.25 
//             }}
//           />
//         </ListItemButton>
//       ))
//     ) : (
//       <Box sx={{ py: 6, textAlign: 'center' }}>
//         <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 500 }}>
//           {t('professions.noResults', { defaultValue: 'No professions found' })}
//         </Typography>
//       </Box>
//     )}
//   </List>

//   {/* شريط الانتقال بين الصفحات (Pagination) */}
//   {!loading && lastPage > 1 && (
//     <Stack
//       direction="row"
//       alignItems="center"
//       justifyContent="space-between"
//       sx={{ 
//         px: 2.5, 
//         py: 1.8, 
//         borderTop: '1px solid rgba(15, 23, 42, 0.06)',
//         backgroundColor: '#f8fafc' // تمييز الأسفل بخلفية هادئة
//       }}
//     >
//       <IconButton 
//         size="medium" 
//         disabled={page <= 1} 
//         onClick={() => fetchCategories({ pageNum: page - 1, query: search })}
//         sx={{ 
//           backgroundColor: '#ffffff', 
//           border: '1px solid rgba(15, 23, 42, 0.05)',
//           boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
//           '&:hover': { backgroundColor: '#f1f5f9' }
//         }}
//       >
//         {isRtl ? <ChevronRightRoundedIcon sx={{ color: '#475569' }} /> : <ChevronLeftRoundedIcon sx={{ color: '#475569' }} />}
//       </IconButton>

//       <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.875rem' }}>
//         {page} <span style={{ color: '#94a3b8', fontWeight: 500 }}>/</span> {lastPage}
//       </Typography>

//       <IconButton 
//         size="medium" 
//         disabled={page >= lastPage} 
//         onClick={() => fetchCategories({ pageNum: page + 1, query: search })}
//         sx={{ 
//           backgroundColor: '#ffffff', 
//           border: '1px solid rgba(15, 23, 42, 0.05)',
//           boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
//           '&:hover': { backgroundColor: '#f1f5f9' }
//         }}
//       >
//         {isRtl ? <ChevronLeftRoundedIcon sx={{ color: '#475569' }} /> : <ChevronRightRoundedIcon sx={{ color: '#475569' }} />}
//       </IconButton>
//     </Stack>
//   )}
// </Popover>
//     </Box>
//   );
// }

// export default CategorySelect;

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  InputAdornment,
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
  Typography,
  IconButton,
  Stack,
  Slide
} from '@mui/material';
import React from 'react';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import { useTranslation } from 'react-i18next';
import api from '../utils/axiosInstance';

// تأثير حركة سلس عند فتح الديالوك
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function CategorySelect({ value, label, onChange, error, helperText, disabled = false }) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.dir() === 'rtl';

  // نستخدم الأن قيمة boolean للتحكم بالديالوك بدلاً من عناصر الأنكير
  const [open, setOpen] = useState(false);

  const [selectedName, setSelectedName] = useState(label || '');
  const [search, setSearch] = useState('');
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const debounceRef = useRef(null);
  const isFirstOpen = useRef(true);

  useEffect(() => {
    setSelectedName(label || '');
  }, [label]);

  async function fetchCategories({ pageNum = 1, query = search } = {}) {
    setLoading(true);
    try {
      const trimmed = query.trim();
      const response = trimmed
        ? await api.get('/admin/category/search', { params: { query: trimmed, page: pageNum, is_active: 1 } })
        : await api.get('/admin/category/all-categories', { params: { page: pageNum, is_active: 1 } });

      const payload = response.data.data;
      const rawList = Array.isArray(payload) ? payload : payload.data ?? [];
      const activeOnly = rawList.filter((c) => c.is_active);

      setCategories(activeOnly);
      setPage(Array.isArray(payload) ? 1 : payload.current_page ?? pageNum);
      setLastPage(Array.isArray(payload) ? 1 : payload.last_page ?? 1);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }

  function handleOpen() {
    setOpen(true);
    if (isFirstOpen.current) {
      fetchCategories({ pageNum: 1, query: '' });
      isFirstOpen.current = false;
    }
  }

  function handleClose() {
    setOpen(false);
  }

  function handleSearchChange(event) {
    const query = event.target.value;
    setSearch(query);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchCategories({ pageNum: 1, query });
    }, 400);
  }

  function handleSelect(category) {
    setSelectedName(category.name);
    onChange(category.id, category.name);
    handleClose();
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* حقل الإدخال الرئيسي الذي يضغط عليه المستخدم لفتح الديالوك */}
      <TextField
        label={t('professions.selectLabel', { defaultValue: 'Profession' })}
        value={selectedName}
        onClick={disabled ? undefined : handleOpen}
        error={Boolean(error)}
        helperText={helperText}
        fullWidth
        disabled={disabled}
        InputProps={{
          readOnly: true,
          endAdornment: (
            <InputAdornment position="end">
              <KeyboardArrowDownRoundedIcon sx={{ color: '#64748b' }} />
            </InputAdornment>
          ),
          sx: { 
            borderRadius: '14px', 
            cursor: disabled ? 'default' : 'pointer',
            backgroundColor: '#fff',
            '&:hover': {
              backgroundColor: disabled ? 'transparent' : '#f8fafc'
            }
          },
        }}
      />

      {/* الديالوك الاحترافي الجديد */}
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        keepMounted
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: '24px',
            boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
            overflow: 'hidden',
            background: '#ffffff',
          }
        }}
      >
        {/* رأس الديالوك يحتوي على العنوان وزر الإغلاق */}
        <DialogTitle sx={{ m: 0, p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', fontSize: '1.2rem' }}>
            {t('professions.selectLabel', { defaultValue: 'Select Profession' })}
          </Typography>
          <IconButton onClick={handleClose} sx={{ color: '#94a3b8', '&:hover': { backgroundColor: '#f1f5f9', color: '#475569' } }}>
            <CloseRoundedIcon />
          </IconButton>
        </DialogTitle>

        {/* محتوى الديالوك: حقل البحث والقائمة */}
        <DialogContent dividers={false} sx={{ p: 0, display: 'flex', flexDirection: 'column', backgroundColor: '#fff' }}>
          
          {/* شريط البحث المريح */}
          <Box sx={{ p: 2.5, backgroundColor: '#ffffff' }}>
            <TextField
              autoFocus
              size="medium"
              fullWidth
              placeholder={t('professions.searchPlaceholder', { defaultValue: 'Search profession...' })}
              value={search}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    {loading ? (
                      <CircularProgress size={20} thickness={4} sx={{ color: '#6366f1' }} />
                    ) : (
                      <SearchRoundedIcon sx={{ fontSize: 22, color: '#94a3b8' }} />
                    )}
                  </InputAdornment>
                ),
                sx: { 
                  borderRadius: '14px', 
                  fontSize: '0.95rem', 
                  height: 54,
                  backgroundColor: '#f8fafc',
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(15, 23, 42, 0.06)' },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'rgba(15, 23, 42, 0.12)' },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#6366f1' }
                },
              }}
            />
          </Box>

          {/* قائمة المهن */}
          <List sx={{ maxHeight: 380, overflowY: 'auto', px: 2.5, pb: 2, pt: 0 }}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
                <CircularProgress size={32} thickness={4} sx={{ color: '#6366f1' }} />
              </Box>
            ) : categories.length > 0 ? (
              categories.map((category) => (
                <ListItemButton
                  key={category.id}
                  selected={category.id === value}
                  onClick={() => handleSelect(category)}
                  sx={{
                    mb: 1,
                    py: 1.5, 
                    px: 2,
                    borderRadius: '14px',
                    border: '1px solid rgba(15, 23, 42, 0.03)',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: '#f1f5f9',
                      transform: 'translateY(-1px)'
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgba(99, 102, 241, 0.08)',
                      borderColor: 'rgba(99, 102, 241, 0.2)',
                      '&:hover': { backgroundColor: 'rgba(99, 102, 241, 0.12)' },
                      '& .MuiListItemText-primary': { color: '#4f46e5' }
                    }
                  }}
                >
                  <ListItemText
                    primary={category.name}
                    secondary={`${t('professions.commission', { defaultValue: 'Commission' })}: ${category.commission}%`}
                    primaryTypographyProps={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}
                    secondaryTypographyProps={{ fontSize: '0.85rem', fontWeight: 500, color: '#64748b', mt: 0.25 }}
                  />
                </ListItemButton>
              ))
            ) : (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography variant="body2" sx={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 500 }}>
                  {t('professions.noResults', { defaultValue: 'No professions found' })}
                </Typography>
              </Box>
            )}
          </List>
        </DialogContent>

        {/* أزرار التنقل السفلي (Pagination) */}
        {!loading && lastPage > 1 && (
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ 
              px: 3, 
              py: 2, 
              borderTop: '1px solid #f1f5f9',
              backgroundColor: '#f8fafc'
            }}
          >
            <IconButton 
              size="medium" 
              disabled={page <= 1} 
              onClick={() => fetchCategories({ pageNum: page - 1, query: search })}
              sx={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid rgba(15, 23, 42, 0.08)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                '&:hover': { backgroundColor: '#f1f5f9' },
                '&:disabled': { backgroundColor: 'transparent' }
              }}
            >
              {isRtl ? <ChevronRightRoundedIcon sx={{ color: '#475569' }} /> : <ChevronLeftRoundedIcon sx={{ color: '#475569' }} />}
            </IconButton>

            <Typography variant="body2" sx={{ fontWeight: 700, color: '#334155', fontSize: '0.9rem' }}>
              {page} <span style={{ color: '#94a3b8', fontWeight: 500 }}>/</span> {lastPage}
            </Typography>

            <IconButton 
              size="medium" 
              disabled={page >= lastPage} 
              onClick={() => fetchCategories({ pageNum: page + 1, query: search })}
              sx={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid rgba(15, 23, 42, 0.08)',
                boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                '&:hover': { backgroundColor: '#f1f5f9' },
                '&:disabled': { backgroundColor: 'transparent' }
              }}
            >
              {isRtl ? <ChevronLeftRoundedIcon sx={{ color: '#475569' }} /> : <ChevronRightRoundedIcon sx={{ color: '#475569' }} />}
            </IconButton>
          </Stack>
        )}
      </Dialog>
    </Box>
  );
}

export default CategorySelect;