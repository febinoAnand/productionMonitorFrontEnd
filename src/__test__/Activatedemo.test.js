import ActiveDemo from '../views/base/users/Activatedemo';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import BaseURL from 'src/assets/contants/BaseURL';

jest.mock('axios');

describe('ActiveDemo Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders activation page', () => {
    render(<ActiveDemo />);
    expect(screen.getByText(/Activation Page/i)).toBeInTheDocument();
  });

  test('updates user status to active', async () => {
    axios.post.mockResolvedValueOnce({
      data: { status: 'active' }
    });
  
    render(<ActiveDemo />);
    
    fireEvent.change(screen.getByPlaceholderText(/Enter Username/i), { target: { value: 'demoUser' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter Password/i), { target: { value: 'demoPass' } });
    
    const checkboxes = screen.getAllByLabelText(/Activate/i);
    fireEvent.click(checkboxes[0]);
  
    await waitFor(() => {
      fireEvent.click(screen.getByRole('button', { name: /Update Status/i }));
    });
  
    expect(axios.post).toHaveBeenCalledWith(`${BaseURL}Userauth/demo-update-user-status/`, {
      username: 'demoUser',
      password: 'demoPass',
      is_active: true,
    });
    
    expect(await screen.findByText(/User status updated successfully!/i)).toBeInTheDocument();
  });
  

  test('updates user status to inactive', async () => {
    axios.post.mockResolvedValueOnce({ data: { status: 'inactive' } });
  
    render(<ActiveDemo />);
    
    fireEvent.change(screen.getByPlaceholderText(/Enter Username/i), { target: { value: 'demoUser' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter Password/i), { target: { value: 'demoPass' } });
    fireEvent.click(screen.getByLabelText(/Deactivate/i));
  
    fireEvent.click(screen.getByRole('button', { name: /Update Status/i }));
  
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('Userauth/demo-update-user-status/'),
        {
          username: 'demoUser',
          password: 'demoPass',
          is_active: false,
        }
      );
    });
  });
  
  test('shows error message on failed status update', async () => {
    axios.post.mockRejectedValueOnce(new Error('Network Error'));

    render(<ActiveDemo />);
    
    fireEvent.change(screen.getByPlaceholderText(/Enter Username/i), { target: { value: 'demoUser' } });
    fireEvent.change(screen.getByPlaceholderText(/Enter Password/i), { target: { value: 'demoPass' } });

    fireEvent.click(screen.getByRole('button', { name: /Update Status/i }));

    await waitFor(() => {
      expect(screen.getByText(/Failed to update user status. Please try again./i)).toBeInTheDocument();
    });
});
test('shows error message when username is not entered', async () => { 
  render(<ActiveDemo />);
  
  fireEvent.click(screen.getByRole('button', { name: /Update Status/i }));

  expect(screen.getByText(/Please enter a username./i)).toBeInTheDocument();
});
});
