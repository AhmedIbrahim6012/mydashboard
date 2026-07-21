export function validateLogin(values) {
  const errors = {};

  if (!values.phone || !String(values.phone).trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!/^[+()\d\s-]{7,}$/.test(String(values.phone).trim())) {
    errors.phone = 'Enter a valid phone number.';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return errors;
}
export function validateProvider(values) {
  const errors = {};

  if (!values.first_name?.trim()) {
    errors.first_name = 'First name is required';
  }

  if (!values.last_name?.trim()) {
    errors.last_name = 'Last name is required';
  }

  if (!values.phone?.trim()) {
    errors.phone = 'Phone number is required';
  }

  if (values.email?.trim()) {
    const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
    if (!emailRegex.test(values.email.trim())) {
      errors.email = 'Invalid email address';
    }
  }

  if (!values.experience_years?.toString().trim()) {
    errors.experience_years = 'Experience years is required';
  } else if (isNaN(values.experience_years) || Number(values.experience_years) < 0) {
    errors.experience_years = 'Must be a valid number';
  }

  return errors;
}

export function validateDeposit(values) {
  const errors = {};

  if (!values.ProviderId) {
    errors.ProviderId = 'Select a Provider.';
  }

  if (!values.amount) {
    errors.amount = 'Enter an amount.';
  } else if (Number(values.amount) <= 0) {
    errors.amount = 'Amount must be greater than zero.';
  }

  return errors;
}
