import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Listachievement from 'src/views/HLMando/Listachievement';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';

jest.mock('axios');

describe('Listachievement Component', () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  test('renders without crashing', () => {
    render(
      <Router>
        <Listachievement />
      </Router>
    );
    expect(screen).toBeDefined();
  });

  test('displays loading spinner while data is being fetched', async () => {
    
    axios.get.mockImplementation(() =>
      new Promise((resolve) => setTimeout(() => resolve({ data: { achievements: [] } }), 100))
    );

    render(
      <Router>
        <Listachievement />
      </Router>
    );

    const spinners = screen.queryAllByRole('status');
    expect(spinners.length).toBeGreaterThan(0); 

    
    await waitFor(() => {
      expect(screen.queryAllByRole('status').length).toBe(0); 
    });
  });

  test('renders table with fetched data', async () => {
    
    const sampleData = {
      start_date: '2024-08-31',
      end_date: '2024-09-09',
      achievements: [
        {
          group_name: 'HSGMI',
          dates: [
            {
              date: '2024-08-31',
              shifts: [
                { shift_no: 1, total_production_count: 0 },
                { shift_no: 2, total_production_count: 0 },
                { shift_no: 3, total_production_count: 0 },
              ],
            },
          ],
        },
      ],
    };
    axios.get.mockImplementation(() =>
      Promise.resolve({ data: sampleData })
    );
  
    render(
      <Router>
        <Listachievement />
      </Router>
    );
  
    
    await waitFor(() => {
      expect(screen.getByText('HSGMI')).toBeInTheDocument();
      expect(screen.getByText('2024-08-31')).toBeInTheDocument();
      expect(screen.getAllByText('0').length).toBe(4);
    });
  });
});