import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
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
  const { machine } = state || { machine: null, groupName: '' };

  useEffect(() => {
    const headerCells = document.querySelectorAll('.custom-table-header th');
    headerCells.forEach((cell) => {
      cell.style.backgroundColor = 'dodgerblue';
      cell.style.color = 'white';
    });
  }, []);

  if (!machine) return <div>Loading...</div>;

  const data = {
    labels: ['Label 1', 'Label 2', 'Label 3', 'Label 4', 'Label 5'],
    datasets: [
      {
        label: 'Dataset 1',
        data: [12, 19, 3, 5, 2],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
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
                  <td>{machine.date}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Time</td>
                  <td>{machine.time || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Todays Count</td>
                  <td>{machine.today_count || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={{ fontWeight: 'bold' }}>Actual Reading</td>
                  <td>{machine.actual_count || 'N/A'}</td>
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
                <strong>Machine Data</strong>
              </CCardHeader>
              <CCardBody>
                <CTable striped hover>
                  <CTableHead className="custom-table-header">
                    <CTableRow>
                      <CTableHeaderCell scope="col">Si.No</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Time</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Machine ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col"> Data</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    <CTableRow>
                      <CTableDataCell></CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    </div>
  );
};

export default Machine;