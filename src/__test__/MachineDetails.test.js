import React from 'react';
import { render, fireEvent, waitFor, screen, debug } from '@testing-library/react';
import MachineDetails from '../views/base/details/MachineDetails';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import { within } from '@testing-library/dom';

jest.mock('axios');

describe('MachineDetails Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  test('renders MachineDetails component', () => {
    render(<MachineDetails />);
    expect(screen.getByText('Machine List')).toBeInTheDocument();
  });

  test('renders table headers correctly', () => {
    render(<MachineDetails />);
    expect(screen.getByText('Si.No')).toBeInTheDocument();
    expect(screen.getByText('Machine ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Manufacture')).toBeInTheDocument();
    expect(screen.getByText('Line')).toBeInTheDocument();
    expect(screen.getByText('Production PerHour')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
  });

  test('should open "Add Machine" modal when the add button is clicked', () => {
    render(<MachineDetails />);

    expect(screen.queryByText('Add Machine Details')).not.toBeInTheDocument();

    fireEvent.click(screen.getByText('Add Machine'));

    expect(screen.getByText('Add Machine Details')).toBeInTheDocument();
  });

  test('should close modal when close button is clicked', async () => {
    render(<MachineDetails />);

    fireEvent.click(screen.getByText('Add Machine'));

    expect(screen.getByText('Add Machine Details')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close'));

    await waitFor(() => {
      expect(screen.queryByText('Add Machine Details')).not.toBeInTheDocument();
    });
  });

  test('should display loading spinner if data is being fetched', async () => {
    axios.get.mockImplementation(() =>
      new Promise((resolve) => setTimeout(() => resolve({ data: { machines: [] } }), 100))
    );

    render(<MachineDetails />);

    const spinners = screen.getAllByRole('status');
    expect(spinners.length).toBeGreaterThan(0); 

    await waitFor(() => {
      expect(screen.queryAllByRole('status').length).toBe(0); 
    });
  });

  test('should display "no data available" when the machine list is empty', async () => {
    render(<MachineDetails machines={[]} />);

    await waitFor(() => {
      expect(screen.getByText('No data available')).toBeInTheDocument();
    });
  });

  test('displays machine data in the table', async () => {
    const mockMachineData = [
      { id: 1, machine_id: 'MAC5632', machine_name: 'Machine A', manufacture: 'Manufacturer X', line: 'Line 1', production_per_hour: '100 units' },
      { id: 2, machine_id: 'MAC5633', machine_name: 'Machine B', manufacture: 'Manufacturer Y', line: 'Line 2', production_per_hour: '200 units' },
    ];

    axios.get.mockResolvedValue({
      data: mockMachineData,
    });

    render(<MachineDetails />);

    await waitFor(() => {
      expect(screen.getByText(/Machine A/i)).toBeInTheDocument();
      expect(screen.getByText(/Manufacturer X/i)).toBeInTheDocument();
      expect(screen.getByText(/Line 1/i)).toBeInTheDocument();
      expect(screen.getByText(/Machine B/i)).toBeInTheDocument();
      expect(screen.getByText(/Manufacturer Y/i)).toBeInTheDocument();
    });
  });

  test('renders ciltrash icon correctly', () => {
    render(<MachineDetails />);
  
    const tableActionHeader = screen.getByRole('columnheader', { name: 'Action' });
    const tableBodies = screen.getAllByRole('rowgroup');
    const tableBody = tableBodies[1];
    const tableRows = within(tableBody).getAllByRole('row'); 
    const tableRow = tableRows[0]; 
    const tableCells = within(tableRow).getAllByRole('cell'); 
  
    const hasData = tableCells.some(cell => cell.textContent !== 'No data available');
  
    if (hasData) {
      const tableActionCell = tableCells.find(cell => within(cell).getByRole('img', { name: 'cilTrash' }));
      const ciltrashIcon = within(tableActionCell).getByRole('img', { name: 'cilTrash' });
      expect(ciltrashIcon).toBeInTheDocument();
    } else {
      expect(screen.queryByText('No data available')).toBeInTheDocument();
    }
  });
  test('renders cilpen icon correctly', () => {
    render(<MachineDetails />);
  
    const tableActionHeader = screen.getByRole('columnheader', { name: 'Action' });
    const tableBodies = screen.getAllByRole('rowgroup');
    const tableBody = tableBodies[1]; 
    const tableRows = within(tableBody).getAllByRole('row'); 
    const tableRow = tableRows[0]; 
    const tableCells = within(tableRow).getAllByRole('cell'); 
  
    
    const hasData = tableCells.some(cell => cell.textContent !== 'No data available');
  
    if (hasData) {
      const tableActionCell = tableCells.find(cell => within(cell).getByRole('img', { name: 'cilPen' })); 
      const cilpenIcon = within(tableActionCell).getByRole('img', { name: 'cilPen' });
      expect(cilpenIcon).toBeInTheDocument();
    } else {
      expect(screen.queryByText('No data available')).toBeInTheDocument();
    }
  });
  test('opens Update Machine Details modal with prefilled data when cilpen button is clicked', async () => {
    render(<MachineDetails />);
    
    const tableActionHeader = screen.getByRole('columnheader', { name: 'Action' });
    const tableBodies = screen.getAllByRole('rowgroup');
    const tableBody = tableBodies[1];
    const tableRows = within(tableBody).getAllByRole('row');
    const tableRow = tableRows[0]; 
    const tableCells = within(tableRow).getAllByRole('cell');
    const hasData = tableCells.some(cell => cell.textContent !== 'No data available');
    
    if (hasData) {
      const tableActionCell = tableCells.find(cell => within(cell).getByRole('img', { name: 'cilPen' })); 
      const cilpenButton = within(tableActionCell).getByRole('button', { name: 'cilPen' });
      fireEvent.click(cilpenButton); 
    
      await waitFor(() => screen.getByText('Update Machine Details'));
      const machineIDInput = screen.getByLabelText('Machine ID'); 
      const nameInput = screen.getByLabelText('Name');
      const manufactureInput = screen.getByLabelText('Manufacture');
      const lineInput = screen.getByLabelText('Line'); 
      const productionPerHourInput = screen.getByLabelText('Production Per Hour');
    
      expect(machineIDInput).toHaveValue('MAC5632'); 
      expect(nameInput).toHaveValue('Machine 1');
      expect(manufactureInput).toHaveValue('Manufacturer 1');
      expect(lineInput).toHaveValue('1');
      expect(productionPerHourInput).toHaveValue('100 units');
      expect(screen.getByText('Update Machine Details')).toBeInTheDocument();
      
      const updateButton = screen.getByText('Update Machine');
      fireEvent.click(updateButton);
      
      
      await waitFor(() => {
        const updatedTableRow = tableRows[0];
        const updatedTableCells = within(updatedTableRow).getAllByRole('cell');
        
        expect(updatedTableCells[1]).toHaveTextContent('MAC5632');
        expect(updatedTableCells[2]).toHaveTextContent('Machine 1');
        expect(updatedTableCells[3]).toHaveTextContent('Manufacturer 1');
        expect(updatedTableCells[4]).toHaveTextContent('1');
        expect(updatedTableCells[5]).toHaveTextContent('100 units');
      });
    } else {
      expect(screen.queryByText('No data available')).toBeInTheDocument();
    }
  });
  test('should add machine details to table when save button is clicked', async () => {
    render(<MachineDetails />);
    
    const addButton = screen.getByText('Add Machine');
    fireEvent.click(addButton);
    
    expect(screen.getByText('Add Machine Details')).toBeInTheDocument();
    
    const machineIDInput = screen.getByLabelText(/Machine ID/);
    const nameInput = screen.getByLabelText(/Name/);
    const manufactureInput = screen.getByLabelText(/Manufacture/);
    const lineInput = screen.getByLabelText(/Line/);
    const productionPerHourInput = screen.getByLabelText(/Production Per Hour/);
    
    fireEvent.change(machineIDInput, { target: { value: 'M018' } });
    fireEvent.change(nameInput, { target: { value: 'CALPI1' } });
    fireEvent.change(manufactureInput, { target: { value: '' } });
    fireEvent.change(lineInput, { target: { value: '4' } });
    fireEvent.change(productionPerHourInput, { target: { value: '1000' } });
    
    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);
    
    console.log('Save button clicked');
    
    await waitFor(() => {
      const tableRows = screen.getAllByRole('row');
      console.log('Table rows:', tableRows);
      expect(tableRows.length).toBeGreaterThan(1);
    });
    
    console.log('Table rows updated');
    
  });
  test('deletes machine details from table when ciltrash button is clicked and confirmed', async () => {
    render(<MachineDetails />);
    
    const tableActionHeader = screen.getByRole('columnheader', { name: 'Action' });
    const tableBodies = screen.getAllByRole('rowgroup');
    const tableBody = tableBodies[1];
    const tableRows = within(tableBody).getAllByRole('row');
    const tableRow = tableRows[0]; 
    const tableCells = within(tableRow).getAllByRole('cell');
    const hasData = tableCells.some(cell => cell.textContent !== 'No data available');
    
    if (hasData) {
      const tableActionCell = tableCells.find(cell => within(cell).getByRole('img', { name: 'cilTrash' })); 
      const ciltrashButton = within(tableActionCell).getByRole('button', { name: 'cilTrash' });
      fireEvent.click(ciltrashButton); 
      
      // Mock the confirmation dialog
      window.confirm = jest.fn(() => true);
      
      await waitFor(() => {
        const updatedTableRows = screen.getAllByRole('row');
        expect(updatedTableRows.length).toBeLessThan(tableRows.length);
      });
      
      expect(screen.queryByText('MAC5632')).not.toBeInTheDocument();
      expect(screen.queryByText('Machine 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Manufacturer 1')).not.toBeInTheDocument();
      expect(screen.queryByText('1')).not.toBeInTheDocument();
      expect(screen.queryByText('100 units')).not.toBeInTheDocument();
    } else {
      expect(screen.queryByText('No data available')).toBeInTheDocument();
    }
  });
  
  test('does not delete machine details from table when ciltrash button is clicked and cancelled', async () => {
    render(<MachineDetails />);
    
    const tableActionHeader = screen.getByRole('columnheader', { name: 'Action' });
    const tableBodies = screen.getAllByRole('rowgroup');
    const tableBody = tableBodies[1];
    const tableRows = within(tableBody).getAllByRole('row');
    const tableRow = tableRows[0]; 
    const tableCells = within(tableRow).getAllByRole('cell');
    const hasData = tableCells.some(cell => cell.textContent !== 'No data available');
    
    if (hasData) {
      const tableActionCell = tableCells.find(cell => within(cell).getByRole('img', { name: 'cilTrash' })); 
      const ciltrashButton = within(tableActionCell).getByRole('button', { name: 'cilTrash' });
      fireEvent.click(ciltrashButton); 
      
      // Mock the confirmation dialog
      window.confirm = jest.fn(() => false);
      
      await waitFor(() => {
        const updatedTableRows = screen.getAllByRole('row');
        expect(updatedTableRows.length).toBe(tableRows.length);
      });
      
      expect(screen.queryByText('MAC5632')).toBeInTheDocument();
      expect(screen.queryByText('Machine 1')).toBeInTheDocument();
      expect(screen.queryByText('Manufacturer 1')).toBeInTheDocument();
      expect(screen.queryByText('1')).toBeInTheDocument();
      expect(screen.queryByText('100 units')).toBeInTheDocument();
    } else {
      expect(screen.queryByText('No data available')).toBeInTheDocument();
    }
  });
});