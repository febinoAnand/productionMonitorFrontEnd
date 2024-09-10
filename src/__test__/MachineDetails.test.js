import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MachineDetails from '../views/base/details/MachineDetails'; 

describe('MachineDetails Component', () => {
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

  test('should open add machine modal when add button is clicked', () => {
    render(<MachineDetails />);
    
    expect(screen.queryByText('Add Machine Details')).not.toBeInTheDocument();
    
    const openModalButton = screen.getByText('Add Machine'); // Button to open the modal
    fireEvent.click(openModalButton);
    
    expect(screen.getByText('Add Machine Details')).toBeInTheDocument();
  });

  test('should close modal when close button is clicked', async () => {
    render(<MachineDetails />);
    
    const openModalButton = screen.getByText('Add Machine'); // Button to open the modal
    fireEvent.click(openModalButton);
    
    expect(screen.getByText('Add Machine Details')).toBeInTheDocument();
    
    const closeButton = screen.getByText('Close'); 
    fireEvent.click(closeButton);
    
    await waitFor(() => {
      expect(screen.queryByText('Add Machine Details')).not.toBeInTheDocument();
    });
  });
});
