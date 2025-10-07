import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Hidden Histories header', () => {
  render(<App />);
  const headerElement = screen.getByText(/Hidden Histories/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders navigation menu', () => {
  render(<App />);
  const familiesLink = screen.getByText(/Families/i);
  const timelineLink = screen.getByText(/Timeline/i);
  expect(familiesLink).toBeInTheDocument();
  expect(timelineLink).toBeInTheDocument();
});

test('renders hero section', () => {
  render(<App />);
  const heroTitle = screen.getByText(/Preserving the/i);
  expect(heroTitle).toBeInTheDocument();
});
