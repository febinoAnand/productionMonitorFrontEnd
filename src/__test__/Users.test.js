import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Users from '../views/base/users/Users'; // Adjust the path as needed

jest.mock('axios');

describe('Users component', () => {
  it('renders the component', () => {
    const { getByText } = render(<Users />);
    expect(getByText('USERS LIST')).toBeInTheDocument();
  });

  it('fetches users on mount', async () => {
    axios.get.mockResolvedValue({
      data: [
        {
          user_id: 1,
          usermod: { username: 'testuser', email: 'test@example.com' },
          designation: 'Test Designation',
          mobile_no: '1234567890',
          userActive: true,
        },
      ],
    });

    const { getByText } = render(<Users />);
    await waitFor(() => expect(getByText('testuser')).toBeInTheDocument());
  });

  it('handles search functionality', async () => {
    axios.get.mockResolvedValue({
      data: [
        {
          user_id: 1,
          usermod: { username: 'testuser', email: 'test@example.com' },
          designation: 'Test Designation',
          mobile_no: '1234567890',
          userActive: true,
        },
      ],
    });

    const { getByText, getByPlaceholderText } = render(<Users />);
    await waitFor(() => expect(getByText('testuser')).toBeInTheDocument());

    const searchInput = getByPlaceholderText('Search by Email , Designation, Mobile no or Device ID');
    fireEvent.change(searchInput, { target: { value: 'test' } });
    fireEvent.click(getByText('Search'));

    await waitFor(() => expect(getByText('testuser')).toBeInTheDocument());
  });

  it('handles delete selected users', async () => {
    axios.get.mockResolvedValue({
      data: [
        {
          user_id: 1,
          usermod: { username: 'testuser', email: 'test@example.com' },
          designation: 'Test Designation',
          mobile_no: '1234567890',
          userActive: true,
        },
      ],
    });

    axios.delete.mockResolvedValue({});

    const { getByText, getByRole } = render(<Users />);
    await waitFor(() => expect(getByText('testuser')).toBeInTheDocument());

    const checkbox = getByRole('checkbox');
    fireEvent.click(checkbox);

    const deleteButton = getByText('Delete Selected');
    fireEvent.click(deleteButton);

    await waitFor(() => expect(getByText('Users deleted successfully')).toBeInTheDocument());
  });

  it('handles update user', async () => {
    axios.get.mockResolvedValue({
      data: [
        {
          userdetail_id: 1,
          user_id: 1,
          usermod: { username: 'testuser', email: 'test@example.com' },
          designation: 'Test Designation',
          mobile_no: '1234567890',
          userActive: true,
        },
      ],
    });

    axios.put.mockResolvedValue({});

    const { getByText, getByRole, getByPlaceholderText } = render(<Users />);
    await waitFor(() => expect(getByText('testuser')).toBeInTheDocument());

    const editButton = getByRole('button', { name: 'Edit' });
    fireEvent.click(editButton);

    const nameInput = getByPlaceholderText('Name');
    fireEvent.change(nameInput, { target: { value: 'Updated Name' } });

    const updateButton = getByText('Update');
    fireEvent.click(updateButton);

    await waitFor(() => expect(getByText('User updated successfully')).toBeInTheDocument());
  });

  it('handles update password', async () => {
    axios.get.mockResolvedValue({
      data: [
        {
          userdetail_id: 1,
          user_id: 1,
          usermod: { username: 'testuser', email: 'test@example.com' },
          designation: 'Test Designation',
          mobile_no: '1234567890',
          userActive: true,
        },
      ],
    });

    axios.post.mockResolvedValue({});

    const { getByText, getByRole, getByPlaceholderText } = render(<Users />);
    await waitFor(() => expect(getByText('testuser')).toBeInTheDocument());

    const passwordButton = getByRole('button', { name: 'Update Password' });
    fireEvent.click(passwordButton);

    const newPasswordInput = getByPlaceholderText('New Password');
    fireEvent.change(newPasswordInput, { target: { value: 'newpassword' } });

    const confirmPasswordInput = getByPlaceholderText('Confirm Password');
    fireEvent.change(confirmPasswordInput, { target: { value: 'newpassword' } });

    const updatePasswordButton = getByText('Update');
    fireEvent.click(updatePasswordButton);

    await waitFor(() => expect(getByText('Password updated successfully')).toBeInTheDocument());
  });
});