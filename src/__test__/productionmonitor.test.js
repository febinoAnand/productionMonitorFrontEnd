import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import axios from 'axios';
import ProductionMonitor from 'src/views/HLMando/Productionmonitor';

jest.mock('axios');

describe('ProductionMonitor component', () => {
  it('renders without crashing', () => {
    render(
      <Router>
        <ProductionMonitor />
      </Router>
    );
  });

  it('displays loading spinner while data is being fetched', async () => {
    axios.post.mockResolvedValue({
      data: {
        date: '2024-09-01',
        machine_groups: [],
      },
    });

    const { getByText } = render(
      <Router>
        <ProductionMonitor />
      </Router>
    );

    expect(getByText('Loading...')).toBeInTheDocument();

    await waitFor(() => {
      // Check if loading spinner disappears after fetching
      expect(getByText('2024-09-01')).toBeInTheDocument();
    });
  });

  it('renders production data', async () => {
    axios.post.mockResolvedValue({
      data: {
        date: '2024-09-09',
        machine_groups: [
          {
            group_name: 'CALPI',
            machines: [
              {
                machine_id: 'M001',
                machine_name: 'CALPI1',
                shifts: [
                  {
                    shift_no: 1,
                    shift_name: '',
                    total_shift_production_count: 5280,
                  },
                  {
                    shift_no: 2,
                    shift_name: '',
                    total_shift_production_count: 2160,
                  },
                  {
                    shift_no: 3,
                    shift_name: '',
                    total_shift_production_count: 0,
                  },
                ],
              },
            ],
          },
        ],
      },
    });

    const { getByText } = render(
      <Router>
        <ProductionMonitor />
      </Router>
    );

    await waitFor(() => {
      expect(getByText('2024-09-09')).toBeInTheDocument();
      expect(getByText('CALPI')).toBeInTheDocument();
      expect(getByText('CALPI1')).toBeInTheDocument();
      expect(getByText('Shift 1')).toBeInTheDocument();
      expect(getByText('Shift 2')).toBeInTheDocument();
      expect(getByText('Shift 3')).toBeInTheDocument();
      expect(getByText('5280')).toBeInTheDocument();
      expect(getByText('2160')).toBeInTheDocument();
      expect(getByText('0')).toBeInTheDocument();
      expect(getByText('7440')).toBeInTheDocument();
    });
  });

  it('calls fetchData when date is changed', async () => {
    const fetchDataSpy = jest.spyOn(ProductionMonitor.prototype, 'fetchData').mockImplementation(() => {});

    axios.post.mockResolvedValue({
      data: {
        date: '2024-08-31',
        machine_groups: [],
      },
    });

    const { getByText, getByPlaceholderText } = render(
      <Router>
        <ProductionMonitor />
      </Router>
    );

    const dateInput = getByPlaceholderText('Select Date');
    fireEvent.change(dateInput, { target: { value: '2024-08-31' } });

    const searchButton = getByText('Search');
    fireEvent.click(searchButton);

    await waitFor(() => {
      expect(fetchDataSpy).toHaveBeenCalledTimes(1);
      expect(fetchDataSpy).toHaveBeenCalledWith('2024-08-31');
    });
  });

  it('displays error message when fetchData fails', async () => {
    axios.post.mockRejectedValue(new Error('Failed to fetch data'));

    const { getByText } = render(
      <Router>
        <ProductionMonitor />
      </Router>
    );

    await waitFor(() => {
      expect(getByText('Error fetching data')).toBeInTheDocument();
    });
  });
});
