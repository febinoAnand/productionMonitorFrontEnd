import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import BaseURL from 'src/assets/contants/BaseURL';
import {
  CCard,
  CCardBody,
  CTable,
  CRow,
  CCol,
  CCardHeader,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
} from '@coreui/react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Machine = () => {
  const location = useLocation();
  const { state } = location;
  const { machineId } = state || { machineId: null };

  const [machine, setMachine] = useState(null);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const fetchMachineData = async () => {
      try {
        const response = await axios.get(`${BaseURL}data/individual/${machineId}/`, {
          headers: getAuthHeaders(),
        });
        setMachine(response.data.machine_details);
      } catch (error) {
        console.error('Error fetching machine data:', error);
      }
    };

    if (machineId) {
      fetchMachineData();
      const dataFetchInterval = setInterval(fetchMachineData, 5000);

      return () => clearInterval(dataFetchInterval);
    }
  }, [machineId]);

  useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');
      setCurrentTime(`${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`);
    };

    updateCurrentTime();
    const timeUpdateInterval = setInterval(updateCurrentTime, 1000);

    return () => clearInterval(timeUpdateInterval);
  }, []);

  useEffect(() => {
    const applyHeaderStyles = () => {
      const headerCells = document.querySelectorAll('.custom-table-header th');
      headerCells.forEach(cell => {
        cell.style.backgroundColor = '#047BC4';
        cell.style.color = 'white';
      });
    };

    applyHeaderStyles();
  }, [machine]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    };
  };

  if (!machine) return <div>Loading...</div>;

  const currentDate = new Date().toISOString().split('T')[0];
  const productionData = machine.production_data || [];
  const todayData = productionData.find(item => item.date === currentDate);
  const targetProduction = todayData ? todayData.target_production : 'N/A';
  const productionCount = todayData ? todayData.production_count : 'N/A';

  const data = {
    labels: ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'],
    datasets: [
      {
        label: 'Target Production',
        data: [12, 19, 3, 5, 2, 3, 7],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Actual Production',
        data: [14, 18, 5, 4, 7, 2, 9],
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
    ],
  };
  
  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            label += context.raw;
            return label;
          },
        },
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        color: '#000',
        font: {
          weight: 'bold',
        },
        formatter: (value) => value,
      },
    },
  };
  
  
  return (
    <div
      className="page"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
        paddingTop: '50px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '100%',
          marginBottom: '30px',
        }}
      >
        <CCard style={{ maxWidth: '600px', width: '100%' }}>
          <CCardBody>
            <h3>Machine Details</h3>
            <CTable striped hover style={{ fontSize: '0.9rem' }}>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Machine Name</td>
                  <td>{machine.machine_name}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Machine ID</td>
                  <td>{machine.machine_id || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Line</td>
                  <td>{machine.line || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Manufacture</td>
                  <td>{machine.manufacture || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Year</td>
                  <td>{machine.year || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Production per hour</td>
                  <td>{machine.production_per_hour || 'N/A'}</td>
                </tr>
              </tbody>
            </CTable>
          </CCardBody>
        </CCard>
        <CCard style={{ maxWidth: '600px', width: '100%', marginLeft: '50px' }}>
          <CCardBody>
            <h3>Production Data</h3>
            <CTable striped hover style={{ fontSize: '0.9rem' }}>
              <tbody>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Date</td>
                  <td>{currentDate}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Time</td>
                  <td>{currentTime}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Today&apos;s Production</td>
                  <td>{productionCount}</td>
                </tr>

                <tr>
                  <td style={{ fontWeight: 'bold' }}>Actual Reading</td>
                  <td>{targetProduction}</td>
                </tr>
              </tbody>
            </CTable>
          </CCardBody>
        </CCard>
      </div>
      <div style={{ width: '100%', marginBottom: '30px' }}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Production Chart</strong>
          </CCardHeader>
          <CCardBody>
            <Bar data={data} options={options} />
          </CCardBody>
        </CCard>
      </div>

      <div style={{ width: '100%' }}>
        <CRow>
          <CCol xs={12}>
          <CCard className="mb-4">
  <CCardHeader>
    <strong>Machine Data - {machine.machine_id}</strong>
  </CCardHeader>
  <CCardBody>
    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
      <CTable striped hover>
        <CTableHead className="custom-table-header">
          <CTableRow>
            <CTableHeaderCell scope="col">Si.No</CTableHeaderCell>
            <CTableHeaderCell scope="col">Date</CTableHeaderCell>
            <CTableHeaderCell scope="col">Time</CTableHeaderCell>
            <CTableHeaderCell scope="col">Data</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
        {machine.machine_data.slice().reverse().map((data, index) => (
            <CTableRow key={index}>
              <CTableDataCell>{index + 1}</CTableDataCell>
              <CTableDataCell>{data.date}</CTableDataCell>
              <CTableDataCell>{data.time}</CTableDataCell>
              <CTableDataCell>{JSON.stringify(data.data)}</CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </div>
  </CCardBody>
</CCard>

          </CCol>
        </CRow>
      </div>
    </div>
  );
};

export default Machine;