// src/theme/colors.js
// نفس الألوان المستخدمة بتطبيق Flutter — مصدر وحيد للحقيقة (Single Source of Truth)
// أي تغيير مستقبلي على الألوان يصير هون بس، وينعكس تلقائيًا بكل الواجهة

export const brand = {
  primary: '#FF6B26',
  navy: '#002351',
};

export const darkPalette = {
  bg: '#07111F',
  surface: '#0F1E33',
  field: '#111827',
  border: '#243247',
  secondary: '#38BDF8',
  error: '#EF4444',
};

export const lightPalette = {
  bg: '#F4F4F5',
  surface: '#FFFFFF',
  field: '#F1F5F9',
  border: '#E2E8F0',
  secondary: brand.navy,
  error: '#DC2626',
};