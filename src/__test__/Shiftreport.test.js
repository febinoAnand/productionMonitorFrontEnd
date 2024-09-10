import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Shiftreport from 'src/views/HLMando/Shiftreport';
import axios from 'axios';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('axios');

const mockMachineData = [
  { machine_name: 'Machine 1', machine_id: 1 },
  { machine_name: 'Machine 2', machine_id: 2 },
];

const mockHourlyData = {
  shifts: [
    {
      shift_name: 'Shift 1',
      shift_no: 1,
      timing: {
        '00:00 - 01:00': [10, 12],
        '01:00 - 02:00': [20, 18],
      },
    },
  ],
};

describe('Shiftreport Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(
      <Router>
        <Shiftreport />
      </Router>
    );
    expect(screen.getByText('Shift Report')).toBeInTheDocument();
  });

  test('loads and displays machine options', async () => {
    axios.get.mockResolvedValueOnce({ data: mockMachineData });

    render(
      <Router>
        <Shiftreport />
      </Router>
    );

    // Wait for the machine options to load
    await waitFor(() => {
      expect(screen.getByText('Machine 1')).toBeInTheDocument();
      expect(screen.getByText('Machine 2')).toBeInTheDocument();
    });
  });

  test('search button is disabled when machine or date is not selected', async () => {
    render(
      <Router>
        <Shiftreport />
      </Router>
    );

    // Select machine and date fields
    expect(screen.getByRole('button', { name: /search/i })).toBeDisabled();
  });

  test('displays error message when no machine or date is selected', async () => {
    render(
      <Router>
        <Shiftreport />
      </Router>
    );

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText('Please select both a machine and a date.')).toBeInTheDocument();
    });
  });

  test('fetches and displays shift data on search', async () => {
    axios.get.mockResolvedValueOnce({ data: mockMachineData });
    axios.post.mockResolvedValueOnce({ data: mockHourlyData });

    render(
      <Router>
        <Shiftreport />
      </Router>
    );

    // Simulate selecting machine and date
    fireEvent.change(screen.getByLabelText(/select machine/i), { target: { value: 'Machine 1' } });
    fireEvent.change(screen.getByPlaceholderText(/yyyy-mm-dd/i), { target: { value: '2024-09-01' } });

    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    await waitFor(() => {
      expect(screen.getByText('Shift 1')).toBeInTheDocument();
      expect(screen.getByText('00:00 - 01:00')).toBeInTheDocument();
      expect(screen.getByText('10')).toBeInTheDocument();
      expect(screen.getByText('12')).toBeInTheDocument();
    });
  });

  test('shows loading spinner while fetching data', async () => {
    axios.get.mockResolvedValueOnce({ data: mockMachineData });

    render(
      <Router>
        <Shiftreport />
      </Router>
    );

    // Check if the loading spinner is displayed
    expect(screen.getByRole('status')).toBeInTheDocument();

    // Simulate async behavior
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });
  });
});
