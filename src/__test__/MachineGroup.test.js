import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import axios from 'axios';
import Groups from '../views/base/details/MachineGroup'; 
import BaseURL from 'src/assets/contants/BaseURL';

// Mocking axios
jest.mock('axios');

const mockGroupData = [
    { group_id: 1, group_name: 'Group 1', machines: [{ id: 1, machine_name: 'Machine 1' }] },
    { group_id: 2, group_name: 'Group 2', machines: [{ id: 2, machine_name: 'Machine 2' }] },
];

const mockMachineData = [
    { id: 1, machine_name: 'Machine 1' },
    { id: 2, machine_name: 'Machine 2' },
];

describe('Groups Component', () => {
    beforeEach(() => {
        axios.get.mockImplementation(url => {
            if (url === `${BaseURL}devices/machinegroup/`) {
                return Promise.resolve({ data: mockGroupData });
            }
            if (url === `${BaseURL}devices/machine/`) {
                return Promise.resolve({ data: mockMachineData });
            }
        });
    });

    test('renders Groups component and displays loading spinner', async () => {
        render(<Groups />);
        expect(screen.getByText('Group LIST')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Search by Group Name or Machine Names')).toBeInTheDocument();
        
        // Wait for the data to be loaded and displayed
        await waitFor(() => {
            expect(screen.getByText('Group 1')).toBeInTheDocument();
            expect(screen.getByText('Machine 1')).toBeInTheDocument();
        });
    });

    test('search functionality filters groups correctly', async () => {
        render(<Groups />);
        await waitFor(() => {
            expect(screen.getByText('Group 1')).toBeInTheDocument();
            expect(screen.getByText('Group 2')).toBeInTheDocument();
        });
        
        // Simulate a search
        fireEvent.change(screen.getByPlaceholderText('Search by Group Name or Machine Names'), { target: { value: 'Group 1' } });
        fireEvent.click(screen.getByText('Search'));

        await waitFor(() => {
            expect(screen.getByText('Group 1')).toBeInTheDocument();
            expect(screen.queryByText('Group 2')).not.toBeInTheDocument();
        });
    });

    test('opens and closes the new group modal', async () => {
        render(<Groups />);
        
        // Open the new group modal
        fireEvent.click(screen.getByText('Create Group'));
        await waitFor(() => {
            expect(screen.getByText('Create New Group')).toBeInTheDocument();
        });
        
        // Close the modal
        fireEvent.click(screen.getByText('Close'));
        await waitFor(() => {
            expect(screen.queryByText('Create New Group')).not.toBeInTheDocument();
        });
    });

    test('successfully creates a new group', async () => {
        axios.post.mockResolvedValueOnce({ status: 201 }); // Mock successful creation
        render(<Groups />);

        // Open the new group modal
        fireEvent.click(screen.getByText('Create Group'));

        // Fill out the form
        const groupNameInput = screen.getByLabelText(/Group Name\*/i);
        fireEvent.change(groupNameInput, { target: { value: 'New Group' } });
        
        // Simulate machine selection
        fireEvent.click(screen.getByText('Machine 1'));
        fireEvent.click(screen.getByText('Machine 2'));

        // Submit the form
        fireEvent.click(screen.getByText('Save Group'));

        // Check that success message is shown
        await waitFor(() => {
            expect(screen.getByText('Group created successfully!')).toBeInTheDocument();
        });
    });

    test('successfully updates an existing group', async () => {
        axios.put.mockResolvedValueOnce({ status: 200 }); // Mock successful update
        render(<Groups />);

        // Find and click the edit icon for the first group
        const editButton = screen.getAllByRole('button', { name: /edit/i })[0];
        fireEvent.click(editButton);

       
        const groupNameInput = screen.getByLabelText(/Group Name\*/i);
        fireEvent.change(groupNameInput, { target: { value: 'Updated Group' } });

        
        fireEvent.click(screen.getByText('Save changes'));

       
        await waitFor(() => {
            expect(screen.getByText('Group updated successfully!')).toBeInTheDocument();
        });
    });

    test('successfully deletes a group', async () => {
        axios.delete.mockResolvedValueOnce({ status: 204 }); 
        render(<Groups />);

        
        window.confirm = jest.fn(() => true);
        const deleteButton = screen.getAllByRole('button', { name: /delete/i })[0];
        fireEvent.click(deleteButton);

        
        await waitFor(() => {
            expect(screen.getByText('Group deleted successfully!')).toBeInTheDocument();
        });
    });
});
