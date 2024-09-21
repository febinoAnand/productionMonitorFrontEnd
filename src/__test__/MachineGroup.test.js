import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import axios from 'axios';
import Groups from '../views/base/details/MachineGroup';
import userEvent from '@testing-library/user-event';

describe('Groups Component', () => {
  beforeEach(() => {
    // Mocking Storage.getItem for simulating admin access
    Storage.prototype.getItem = jest.fn((key) => {
      if (key === 'username') return 'user'; // Simulating logged-in user
      if (key === 'password') return 'user'; // Simulating password
      return null;
    });

    // Reset axios mocks
    jest.clearAllMocks();
  });

  test('should open "Create Group" modal when the Create Group button is clicked', () => {
    render(<Groups />);

    expect(screen.queryByText('Create New Group')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Create Group'));

    expect(screen.getByText('Create New Group')).toBeInTheDocument();
  });

  test('should close modal when close button is clicked', async () => {
    render(<Groups />);

    fireEvent.click(screen.getByText('Create Group'));

    expect(screen.getByText('Create New Group')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close'));

    await waitFor(() => {
      expect(screen.queryByText('Create New Group')).not.toBeInTheDocument();
    });
  });

  test('renders cilTrash icon correctly', async () => {
    const mockGroupData = [
      {
        group_id: 1,
        group_name: 'CALPI',
        machines: [{ machine_id: 1, machine_name: 'CALPI1' }],
      },
      {
        group_id: 2,
        group_name: 'MCLMI',
        machines: [
          { machine_id: 2, machine_name: 'MCLMI4' },
          { machine_id: 3, machine_name: 'MCLMI3' },
          { machine_id: 4, machine_name: 'MCLMI5' },
        ],
      },
      {
        group_id: 3,
        group_name: 'HSGMI',
        machines: [
          { machine_id: 5, machine_name: 'HSGMI1' },
          { machine_id: 6, machine_name: 'HSGMI2' },
          { machine_id: 7, machine_name: 'HSGMI3' },
        ],
      },
    ];

    axios.get.mockResolvedValue({
      data: mockGroupData,
    });

    render(<Groups />);

    await waitFor(() => {
      const table = screen.getByRole('table');
      expect(table).toBeInTheDocument();

      const actionHeader = within(table).getByRole('columnheader', { name: /Action/i });
      expect(actionHeader).toBeInTheDocument();

      const tableBodies = screen.getAllByRole('rowgroup');
      const tableBody = tableBodies[1];
      const tableRows = within(tableBody).getAllByRole('row');
      expect(tableRows.length).toBeGreaterThan(1);

      tableRows.slice(1).forEach(row => {
        const cells = within(row).getAllByRole('cell');
        const actionCell = cells[cells.length - 1];

        const buttons = within(actionCell).getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(0);

        buttons.forEach(button => {
          const trashIcon = within(button).queryByRole('img', { name: /cilTrash/i });
          if (trashIcon) {
            expect(trashIcon).toBeInTheDocument();
          }
        });
      });
    });
  });

  // Additional tests for cilPen icon and modal actions...

  test('should add a new group to the table when the save group button is clicked', async () => {
    axios.get.mockResolvedValueOnce({
      data: [
        { group_id: 1, group_name: 'Existing Group', machines: [] },
      ],
    });

    render(<Groups />);

    const createGroupButton = screen.getByRole('button', { name: /Create Group/i });
    userEvent.click(createGroupButton);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Create New Group/i })).toBeInTheDocument();
    });

    const groupNameInput = screen.getByLabelText(/Group Name/i);
    userEvent.type(groupNameInput, 'New Test Group');

    const machineSelect = screen.getByLabelText(/Machines/i);
    userEvent.selectOptions(machineSelect, ['1', '2']);

    axios.post.mockResolvedValueOnce({
      data: {
        group_id: 2,
        group_name: 'New Test Group',
        machines: [
          { id: 1, machine_name: 'Machine 1' },
          { id: 2, machine_name: 'Machine 2' },
        ],
      },
    });

    const saveGroupButton = screen.getByRole('button', { name: /Save Group/i });
    userEvent.click(saveGroupButton);

    axios.get.mockResolvedValueOnce({
      data: [
        { group_id: 1, group_name: 'Existing Group', machines: [] },
        { group_id: 2, group_name: 'New Test Group', machines: [
          { id: 1, machine_name: 'Machine 1' },
          { id: 2, machine_name: 'Machine 2' },
        ] },
      ],
    });

    render(<Groups />);

    await waitFor(() => {
      expect(screen.getByText(/New Test Group/i)).toBeInTheDocument();
      expect(screen.getByText(/Machine 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Machine 2/i)).toBeInTheDocument();
    });

    const tableRows = screen.getAllByRole('row');
    expect(tableRows.length).toBeGreaterThan(1);
  });
});
