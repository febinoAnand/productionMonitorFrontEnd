import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import BaseURL from 'src/assets/contants/BaseURL';
import CIcon from '@coreui/icons-react';
import { cilFeaturedPlaylist } from '@coreui/icons';
import {
  CCard,
  CCardBody,
  CRow,
  CCol,
  CTableHead,
  CTableHeaderCell,
  CTable,
  CTableRow,
  CTableDataCell,
  CTableBody,
  CCardHeader,
  CSpinner,
} from '@coreui/react';

const Machine = () => {
  const location = useLocation();
  const { state } = location;
  const { machineId } = state || { machineId: null };

  const [machine, setMachine] = useState(null);
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const fetchMachineData = async () => {
      try {
        const response = await axios.get(`${BaseURL}data/individual-report/`, {
          headers: getAuthHeaders(),
        });
        const machineData = response.data.machines.find(machine => machine.machine_id === machineId);
        setMachine(machineData);
      } catch (error) {
        console.error('Error fetching machine data:', error);
      }
    };

    if (machineId) {
      fetchMachineData();
      const dataFetchInterval = setInterval(fetchMachineData, 10000);
      return () => clearInterval(dataFetchInterval);
    }
  }, [machineId]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes.toString().padStart(2, '0');
      const formattedSeconds = seconds.toString().padStart(2, '0');
      const formattedDate = now.toISOString().split('T')[0]; // YYYY-MM-DD

      setCurrentTime(`${formattedHours}:${formattedMinutes}:${formattedSeconds} ${ampm}`);
      setCurrentDate(formattedDate);
    };

    updateDateTime();
    const timeUpdateInterval = setInterval(updateDateTime, 1000);

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
  }, [machine]); // Ensure it runs when machine data changes

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    };
  };

  if (!machine) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <CSpinner color="primary" variant="grow" />
        <CSpinner color="secondary" variant="grow" />
        <CSpinner color="success" variant="grow" />
        <CSpinner color="danger" variant="grow" />
        <CSpinner color="warning" variant="grow" />
        <CSpinner color="info" variant="grow" />
        <CSpinner color="dark" variant="grow" />
      </div>
    );
  }

  const productionData = machine.shifts_data || {};
  const shiftNames = Object.keys(productionData); // Get all shift names

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
      <CCard style={{ maxWidth: '450px', width: '100%', marginBottom: '15px' }}>
        <CCardBody style={{ textAlign: 'center' }}>
          <CIcon icon={cilFeaturedPlaylist} size="4xl" style={{ color: '#047BC4', marginBottom: '20px' }} />
          <h2 style={{ textAlign: 'center', color: '#047BC4' }}>{machine.machine_name}</h2>
          <CTable striped hover style={{ fontSize: '0.9rem', marginTop: '20px', textAlign: 'left' }}>
            <CTableBody>
              {shiftNames.length > 0 && (
                <>
                  {shiftNames.map(shiftName => {
                    const shiftData = productionData[shiftName];
                    const shiftTimes = Object.keys(shiftData);
                    const currentShiftData = shiftTimes.find(time => shiftData[time]);

                    return (
                      <React.Fragment key={shiftName}>
                        <CTableRow>
                          <CTableDataCell style={{ fontWeight: 'bold' }}>Production Count for {shiftName}</CTableDataCell>
                          <CTableDataCell>{currentShiftData ? shiftData[currentShiftData].actual_production : 'N/A'}</CTableDataCell>
                        </CTableRow>
                        <CTableRow>
                          <CTableDataCell style={{ fontWeight: 'bold' }}>Shift Time</CTableDataCell>
                          <CTableDataCell>{currentShiftData || 'N/A'}</CTableDataCell>
                        </CTableRow>
                      </React.Fragment>
                    );
                  })}
                </>
              )}
              <CTableRow>
                <CTableDataCell style={{ fontWeight: 'bold' }}>Date</CTableDataCell>
                <CTableDataCell>{currentDate}</CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>

      {/* Shift Report Table */}
      <div style={{ width: '100%' }}>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Shift Wise Report</strong>
              </CCardHeader>
              <CCardBody>
                {shiftNames.map(shiftName => (
                  <div key={shiftName} style={{ marginBottom: '20px' }}>
                    <strong>{shiftName}</strong>
                    <CTable striped hover>
                      <CTableHead className="custom-table-header">
                        <CTableRow>
                          <CTableHeaderCell scope="col">Time</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Production Count</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {Object.keys(productionData[shiftName]).map(timeRange => (
                          <CTableRow key={timeRange}>
                            <CTableDataCell>{timeRange}</CTableDataCell>
                            <CTableDataCell>{productionData[shiftName][timeRange].actual_production}</CTableDataCell>
                          </CTableRow>
                        ))}
                      </CTableBody>
                    </CTable>
                  </div>
                ))}
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    </div>
  );
};

export default Machine;
