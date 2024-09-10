import { render, screen, waitFor, act, fireEvent } from '@testing-library/react';
import Dashboard from 'src/views/HLMando/Dashboard';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';

// Mock axios
jest.mock('axios');

describe('Dashboard Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Clear any previous mocks
  });

  test('renders without crashing', () => {
    render(
      <Router>
        <Dashboard />
      </Router>
    );
    expect(screen).toBeDefined();
  });

  test('displays loading spinner while data is being fetched', async () => {
    // Mock the axios calls to simulate loading state
    axios.get.mockImplementation(() =>
      new Promise((resolve) => setTimeout(() => resolve({ data: { groups: [], machines: [] } }), 100))
    );

    render(
      <Router>
        <Dashboard />
      </Router>
    );

    // Check if spinners are present
    const spinners = screen.queryAllByRole('status');
    expect(spinners.length).toBeGreaterThan(0); // Ensure at least one spinner is present

    // Wait for the spinners to be removed after data is fetched
    await waitFor(() => {
      expect(screen.queryAllByRole('status').length).toBe(0); // Spinners should be removed after data is fetched
    });
  });

  test('displays "No data available" message when there is no data', async () => {
    // Mock the axios calls to return empty data
    axios.get.mockImplementation(() =>
      Promise.resolve({ data: { groups: [], machines: [] } })
    );

    render(
      <Router>
        <Dashboard />
      </Router>
    );

    // Wait for the component to update after fetching data
    await waitFor(() => {
      expect(screen.getByText(/No data available/i)).toBeInTheDocument();
    });
  });

  test('displays data correctly when data is available', async () => {
    // Mock the axios calls to return sample data
    const sampleGroups = [
      { group_id: 1, group_name: 'Group A', machines: [{ machine_id: 101, machine_name: 'Machine A1', production_count: 50, target_production: 100 }] },
      { group_id: 2, group_name: 'Group B', machines: [{ machine_id: 102, machine_name: 'Machine B1', production_count: 30, target_production: 60 }] }
    ];
    const sampleMachineGroups = [
      { group_id: 1, machines: [{ machine_id: 101, machine_name: 'Machine A1' }] },
      { group_id: 2, machines: [{ machine_id: 102, machine_name: 'Machine B1' }] }
    ];
    axios.get.mockImplementation((url) => {
      if (url.includes('dashboard-data')) {
        return Promise.resolve({ data: { groups: sampleGroups } });
      } else if (url.includes('machinegroup')) {
        return Promise.resolve({ data: sampleMachineGroups });
      }
    });

    render(
      <Router>
        <Dashboard />
      </Router>
    );

    // Wait for data to be fetched and rendered
    await waitFor(() => {
      expect(screen.getByText('Group A')).toBeInTheDocument();
      expect(screen.getByText('Group B')).toBeInTheDocument();
      expect(screen.getByText('Machine A1')).toBeInTheDocument();
      expect(screen.getByText('Machine B1')).toBeInTheDocument();
    });
  });

  test('navigates to the correct page on widget click', async () => {
    // Mock the axios calls to return sample data
    const sampleGroups = [
      { group_id: 1, group_name: 'Group A', machines: [{ machine_id: 101, machine_name: 'Machine A1', production_count: 50, target_production: 100 }] }
    ];
    const sampleMachineGroups = [
      { group_id: 1, machines: [{ machine_id: 101, machine_name: 'Machine A1' }] }
    ];
    axios.get.mockImplementation((url) => {
      if (url.includes('dashboard-data')) {
        return Promise.resolve({ data: { groups: sampleGroups } });
      } else if (url.includes('machinegroup')) {
        return Promise.resolve({ data: sampleMachineGroups });
      }
    });

    render(
      <Router>
        <Dashboard />
      </Router>
    );

    // Wait for the data to be rendered
    await waitFor(() => {
      expect(screen.getByText('Machine A1')).toBeInTheDocument();
    });

    // Simulate clicking the widget
    const widget = screen.getByText('Machine A1').closest('div');
    fireEvent.click(widget);

    // Verify navigation or state change (depends on your implementation)
    await waitFor(() => {
      expect(window.location.pathname).toBe('/HLMando/IndividualMachine'); // Update this according to your route
    });
  });
});