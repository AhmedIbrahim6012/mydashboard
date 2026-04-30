import { readCustomers, writeCustomers } from './storage';

export function getCustomers() {
  return readCustomers();
}

export function saveCustomers(customers) {
  writeCustomers(customers);
}

export default { getCustomers, saveCustomers };