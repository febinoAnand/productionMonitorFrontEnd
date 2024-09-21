import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LoginDemo from '../views/base/users/Logindemo';

global.fetch = jest.fn();

describe('LoginDemo Component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  test('renders LoginDemo component', () => {
    render(<LoginDemo />);
    
    expect(screen.getByText(/Login Demo/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Mobile Number/i)).toBeInTheDocument();
    expect(screen.getByText(/Generate OTP/i)).toBeInTheDocument();
  });

  test('generates OTP successfully', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ otp: '123456' }),
    });

    render(<LoginDemo />);
    
    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/Mobile Number/i), { target: { value: '9876543210' } });
    
    fireEvent.click(screen.getByText(/Generate OTP/i));
    
    await waitFor(() => {
      expect(screen.getByText(/OTP generated successfully./i)).toBeInTheDocument();
      expect(screen.getByText(/OTP: 123456/i)).toBeInTheDocument();
    });
  });

  test('handles API error', async () => {
    fetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Failed to generate OTP' }),
    });

    render(<LoginDemo />);
    
    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'testuser' } });
    fireEvent.change(screen.getByPlaceholderText(/Mobile Number/i), { target: { value: '9876543210' } });
    
    fireEvent.click(screen.getByText(/Generate OTP/i));
    
    await waitFor(() => {
      expect(screen.getByText(/Failed: Failed to generate OTP/i)).toBeInTheDocument();
    });
  });
});
