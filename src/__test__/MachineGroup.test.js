import React from 'react';
import { render, waitFor, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Groups from '../views/base/details/MachineGroup';
import axios from 'axios';
import { within } from '@testing-library/dom';

jest.mock('axios');

describe('Groups component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders Groups component', () => {
    render(<Groups />);
    expect(screen.getByText('Group LIST')).toBeInTheDocument();
  });

  test('renders table headers correctly', () => {
    render(<Groups />);
    expect(screen.getByText('Si.No')).toBeInTheDocument();
    expect(screen.getByText('Group')).toBeInTheDocument();
    expect(screen.getByText('Machines')).toBeInTheDocument();
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

  test('should display loading spinner if data is being fetched', async () => {
    axios.get
      .mockImplementationOnce(() =>
        new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 100))
      )
      .mockImplementationOnce(() =>
        new Promise((resolve) => setTimeout(() => resolve({ data: [] }), 100))
      );

    render(<Groups />);
    const spinners = screen.getAllByRole('status');
    expect(spinners.length).toBeGreaterThan(0);

    await waitFor(() => {
      expect(screen.queryAllByRole('status')).toHaveLength(0);
    });
  });

  test('filters groups based on search query', async () => {
    axios.get
      .mockImplementationOnce(() => Promise.resolve({
        data: [
          { group_id: 1, group_name: 'CALPI', machines: [{ machine_name: 'CALPI1' }] },
          { group_id: 2, group_name: 'MCLMI', machines: [{ machine_name: 'MCLMI4' }, { machine_name: 'MCLMI3' }, { machine_name: 'MCLMI5' }] },
          { group_id: 3, group_name: 'CRRMI', machines: [{ machine_name: 'CRRMI1' }, { machine_name: 'CRRMI2' }, { machine_name: 'CRRMI3' }, { machine_name: 'CRRMI4' }, { machine_name: 'CRRMI5' }, { machine_name: 'CRRMI6' }, { machine_name: 'CRRMI7' }] },
          { group_id: 4, group_name: 'HSGMI', machines: [{ machine_name: 'HSGMI1' }, { machine_name: 'HSGMI2' }, { machine_name: 'HSGMI3' }, { machine_name: 'HSGMI4' }, { machine_name: 'HSGMI5' }, { machine_name: 'HSGMI6' }, { machine_name: 'HSGMI7' }] },
        ]
      }))
      .mockImplementationOnce(() => Promise.resolve({
        data: [
          { id: 1, machine_name: 'CALPI1' },
          { id: 2, machine_name: 'MCLMI4' },
          { id: 3, machine_name: 'MCLMI3' },
          { id: 4, machine_name: 'MCLMI5' },
          { id: 5, machine_name: 'CRRMI1' },
          { id: 6, machine_name: 'CRRMI2' },
          { id: 7, machine_name: 'CRRMI3' },
          { id: 8, machine_name: 'CRRMI4' },
          { id: 9, machine_name: 'CRRMI5' },
          { id: 10, machine_name: 'CRRMI6' },
          { id: 11, machine_name: 'CRRMI7' },
          { id: 12, machine_name: 'HSGMI1' },
          { id: 13, machine_name: 'HSGMI2' },
          { id: 14, machine_name: 'HSGMI3' },
          { id: 15, machine_name: 'HSGMI4' },
          { id: 16, machine_name: 'HSGMI5' },
          { id: 17, machine_name: 'HSGMI6' },
          { id: 18, machine_name: 'HSGMI7' },
        ]
      }));

    render(<Groups />);

    await waitFor(() => {
      expect(screen.getByText('CALPI')).toBeInTheDocument();
      expect(screen.getByText('MCLMI')).toBeInTheDocument();
      expect(screen.getByText('CRRMI')).toBeInTheDocument();
      expect(screen.getByText('HSGMI')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText('Search by Group Name or Machine Names'), { target: { value: 'CRRMI' } });
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(screen.getByText('CRRMI')).toBeInTheDocument();
      expect(screen.queryByText('CALPI')).not.toBeInTheDocument();
      expect(screen.queryByText('MCLMI')).not.toBeInTheDocument();
      expect(screen.queryByText('HSGMI')).not.toBeInTheDocument();
    });
  });

  test('should display "no data available" when the machine group is empty', async () => {
    render(<Groups data={[]} />);

    await waitFor(() => {
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });
  });

  test('displays machine groups and machine data in the table', async () => {
    const mockGroupData = [
      { group_id: 1, group_name: 'CALPI', machines: [{ machine_name: 'CALPI1' }] },
      { group_id: 2, group_name: 'MCLMI', machines: [{ machine_name: 'MCLMI4' }, { machine_name: 'MCLMI3' }, { machine_name: 'MCLMI5' }] },
      { group_id: 3, group_name: 'CRRMI', machines: [{ machine_name: 'CRRMI1' }, { machine_name: 'CRRMI2' }, { machine_name: 'CRRMI3' }] },
      { group_id: 4, group_name: 'HSGMI', machines: [{ machine_name: 'HSGMI1' }, { machine_name: 'HSGMI2' }] },
    ];

    axios.get.mockResolvedValue({
      data: mockGroupData,
    });

    render(<Groups />);

    await waitFor(() => {
      mockGroupData.forEach(group => {
        const groupElements = screen.getAllByText((content, element) =>
          element.tagName.toLowerCase() === 'td' && content.includes(group.group_name)
        );
        expect(groupElements.length).toBeGreaterThan(0);

        group.machines.forEach(machine => {
          const machineElements = screen.getAllByText((content, element) =>
            element.tagName.toLowerCase() === 'td' && content.includes(machine.machine_name)
          );
          expect(machineElements.length).toBeGreaterThan(0);
        });
      });
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
      }
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

  test('renders cilPen icon correctly', async () => {
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
      }
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
          const penIcon = within(button).queryByRole('img', { name: /cilPen/i });

          if (penIcon) {
            expect(penIcon).toBeInTheDocument();
          }
        });
      });
    });
  });
  test('opens Update Machine Group modal with prefilled data when cilPen button is clicked', async () => {
    render(<Groups />);
  
    // Ensure the table header is rendered
    const tableActionHeader = screen.getByRole('columnheader', { name: 'Action' });
    expect(tableActionHeader).toBeInTheDocument();
  

    waitFor(() => {
      const tableBodies = screen.getAllByRole('rowgroup');
      expect(tableBodies.length).toBeGreaterThan(0);
  
      const tableBody = tableBodies[1]; 
      expect(tableBody).toBeInTheDocument(); 
  
      
      const tableRows = within(tableBody).getAllByRole('row');
      expect(tableRows.length).toBeGreaterThan(1);
  
      
      const tableRow = tableRows[1]; 
      const actionCell = within(tableRow).getByRole('cell'); 
      const cilPenButton = within(actionCell).getByRole('button', { name: 'cilPen' });
  
      expect(cilPenButton).toBeInTheDocument(); 
      fireEvent.click(cilPenButton); 
  
     
      waitFor(() => {
        expect(screen.getByText('Edit Group')).toBeInTheDocument();
  
       
        const groupNameInput = screen.getByLabelText('Group Name');
        const machineNamesInput = screen.getByLabelText('Machines'); 
  
    
        expect(groupNameInput).toHaveValue('CALPI');
        expect(machineNamesInput).toHaveValue('CALPI1');
  
       
        const saveButton = screen.getByText('Save changes');
        expect(saveButton).toBeInTheDocument();
  
        
        fireEvent.click(saveButton);
      });
  
      
 waitFor(() => {
       
        const updatedTableRows = within(tableBody).getAllByRole('row');
        expect(updatedTableRows.length).toBeGreaterThan(1); 
  
        const updatedTableRow = updatedTableRows[1]; 
        const updatedTableCells = within(updatedTableRow).getAllByRole('cell');
  
    
        expect(updatedTableCells[1]).toHaveTextContent('CALPI'); 
        expect(updatedTableCells[2]).toHaveTextContent('CALPI1'); 
      });
    });
  });

  test('should add a new group to the table when the save group button is clicked', async () => {
    // Mock the initial GET request to fetch existing groups
    axios.get.mockResolvedValueOnce({
      data: [
        { group_id: 1, group_name: 'Existing Group', machines: [] },
      ],
    });
  
    // Render the Groups component
    render(<Groups />);
  
    // Open the modal for creating a new group
    const createGroupButton = screen.getByRole('button', { name: /Create Group/i });
    userEvent.click(createGroupButton);
  
    // Ensure the modal is rendered
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /Create New Group/i })).toBeInTheDocument();
    });
  
    // Fill in the form inputs
    const groupNameInput = screen.getByLabelText(/Group Name/i);
    userEvent.type(groupNameInput, 'New Test Group');
  
    const machineSelect = screen.getByLabelText(/Machines/i);
    userEvent.selectOptions(machineSelect, ['1', '2']);
  
    // Mock the POST request to create a new group
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
  
    // Save the new group
    const saveGroupButton = screen.getByRole('button', { name: /Save Group/i });
    userEvent.click(saveGroupButton);
  
    // Mock the GET request to fetch updated groups
    axios.get.mockResolvedValueOnce({
      data: [
        { group_id: 1, group_name: 'Existing Group', machines: [] },
        { group_id: 2, group_name: 'New Test Group', machines: [
          { id: 1, machine_name: 'Machine 1' },
          { id: 2, machine_name: 'Machine 2' },
        ] },
      ],
    });
  
    // Re-render the component to fetch updated data
    render(<Groups />);
  
    // Wait for the new group to appear in the table
    await waitFor(() => {
      expect(screen.getByText(/New Test Group/i)).toBeInTheDocument();
      expect(screen.getByText(/Machine 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Machine 2/i)).toBeInTheDocument();
    });
  
    // Verify the table contains the expected number of rows
    const tableRows = screen.getAllByRole('row');
    expect(tableRows.length).toBeGreaterThan(1);
  });
});

