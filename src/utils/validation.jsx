export function validateLogin(values) {
  const errors = {};

  if (!values.username.trim()) {
    errors.username = 'Username is required.';
  } else if (values.username.trim().length < 3) {
    errors.username = 'Username must be at least 3 characters.';
  }

  if (!values.password) {
    errors.password = 'Password is required.';
  } else if (values.password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }

  return errors;
}

export function validateWorker(values) {
  const errors = {};

  if (!values.name.trim()) {
    errors.name = 'Worker name is required.';
  }

  if (!values.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!/^[+()\d\s-]{7,}$/.test(values.phone.trim())) {
    errors.phone = 'Enter a valid phone number.';
  }

  if (!values.experience.trim()) {
    errors.experience = 'Experience is required.';
  }

  return errors;
}

export function validateDeposit(values) {
  const errors = {};

  if (!values.workerId) {
    errors.workerId = 'Select a worker.';
  }

  if (!values.amount) {
    errors.amount = 'Enter an amount.';
  } else if (Number(values.amount) <= 0) {
    errors.amount = 'Amount must be greater than zero.';
  }

  return errors;
}
