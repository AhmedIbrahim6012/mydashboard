import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the login form by default', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
});
