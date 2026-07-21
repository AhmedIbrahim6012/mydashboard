import { render, screen } from '@testing-library/react';
import '../../i18n';
import OrdersPage from './OrdersPage';

test('renders the orders dashboard page', () => {
  render(<OrdersPage />);

  expect(screen.getByRole('heading', { name: /orders/i })).toBeInTheDocument();
  expect(screen.getByRole('textbox', { name: /search orders/i })).toBeInTheDocument();
  expect(screen.getByText(/recent orders/i)).toBeInTheDocument();
});