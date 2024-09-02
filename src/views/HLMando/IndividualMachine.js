import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import BaseURL from 'src/assets/contants/BaseURL';
import CIcon from '@coreui/icons-react';
import { cilMemory } from '@coreui/icons';
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

  useEffect(() => {
    const fetchMachineData = async () => {
      try {
        const response = await axios.post(
          `${BaseURL}data/individual-report/`,
          {
            date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
            machine_id: machineId,
          },
          {
            headers: getAuthHeaders(),
          }
        );

        console.log('API Response:', response.data); // Debugging line

        setMachine(response.data);
      } catch (error) {
        console.error('Error fetching machine data:', error);
      }
    };

    if (machineId) {
      fetchMachineData();
      const dataFetchInterval = setInterval(fetchMachineData, 10000); // Refresh every 10 seconds
      return () => clearInterval(dataFetchInterval);
    }
  }, [machineId]);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const formattedDate = now.toISOString().split('T')[0];

      setCurrentDate(formattedDate);
    };

    updateDateTime();
    const timeUpdateInterval = setInterval(updateDateTime, 1000);

    return () => clearInterval(timeUpdateInterval);
  }, []);

  useEffect(() => {
    const applyHeaderStyles = () => {
      const headerCells = document.querySelectorAll('.custom-table-header th');
      headerCells.forEach((cell) => {
        cell.style.backgroundColor = '#047BC4';
        cell.style.color = 'white';
      });
    };

    applyHeaderStyles();
  }, [machine]);

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Token ${token}`,
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

  const filteredShifts = machine.shifts.filter((shift) => {
    return shift.timing && Object.keys(shift.timing).length > 0;
  });

  const latestShift = filteredShifts.reduce((latest, shift) => {
    const shiftTime = new Date(shift.shift_start_time);
    return shiftTime > latest ? shiftTime : latest;
  }, new Date(0));

  const latestShiftData = filteredShifts.find((shift) => {
    const shiftTime = new Date(shift.shift_start_time);
    return shiftTime.getTime() === latestShift.getTime();
  });

  // Calculate the total production count for the latest shift
  const totalProductionCountLatestShift = latestShiftData
    ? Object.values(latestShiftData.timing).reduce(
        (total, current) => total + (current.actual_production || 0),
        0
      )
    : 0;

  // Get the latest time of the latest shift
  const latestShiftTime =
    latestShiftData && Object.keys(latestShiftData.timing).length > 0
      ? Object.keys(latestShiftData.timing).sort().pop()
      : 'N/A';

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
      {latestShiftData && (
        <CCard
          style={{ maxWidth: '450px', width: '100%', marginBottom: '15px' }}
        >
          <CCardBody style={{ textAlign: 'center' }}>
            <CIcon
              icon={cilMemory}
              size="4xl"
              style={{ color: '#047BC4', marginBottom: '20px' }}
            />
            <h2 style={{ textAlign: 'center', color: '#047BC4' }}>
              {machine.machine_name}
            </h2>
            <CTable
              striped
              hover
              style={{
                fontSize: '0.9rem',
                marginTop: '20px',
                textAlign: 'left',
              }}
            >
              <CTableBody>
                <CTableRow>
                  <CTableDataCell style={{ fontWeight: 'bold' }}>
                    Production Count
                  </CTableDataCell>
                  <CTableDataCell>{totalProductionCountLatestShift}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell style={{ fontWeight: 'bold' }}>
                    Shift Name
                  </CTableDataCell>
                  <CTableDataCell>
                    {latestShiftData.shift_name || `Shift ${latestShiftData.shift_no}`}
                  </CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell style={{ fontWeight: 'bold' }}>
                    Shift Time
                  </CTableDataCell>
                  <CTableDataCell>{latestShiftTime}</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell style={{ fontWeight: 'bold' }}>
                    Date
                  </CTableDataCell>
                  <CTableDataCell>{currentDate}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      )}
      <div style={{ width: '100%' }}>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Shift Wise Report</strong>
              </CCardHeader>
              <CCardBody>
                {filteredShifts.map((shift) => (
                  <div key={shift.shift_no} style={{ marginBottom: '20px' }}>
                    <strong>{`Shift ${shift.shift_no}`}</strong>
                    <CTable striped hover>
                      <CTableHead className="custom-table-header">
                        <CTableRow>
                          <CTableHeaderCell scope="col">Time</CTableHeaderCell>
                          <CTableHeaderCell scope="col">
                            Production Count
                          </CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {Object.keys(shift.timing).map((timeRange) => (
                          <CTableRow key={timeRange}>
                            <CTableDataCell>{timeRange}</CTableDataCell>
                            <CTableDataCell>
                              {shift.timing[timeRange].actual_production}
                            </CTableDataCell>
                          </CTableRow>
                        ))}
                        <CTableRow>
                          <CTableDataCell style={{ fontWeight: 'bold' }}>
                            Total
                          </CTableDataCell>
                          <CTableDataCell style={{ fontWeight: 'bold' }}>
                            {Object.values(shift.timing).reduce(
                              (total, current) =>
                                total + (current.actual_production || 0),
                              0
                            )}
                          </CTableDataCell>
                        </CTableRow>
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
