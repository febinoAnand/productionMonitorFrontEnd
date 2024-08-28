import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormInput,
  CButton,
  CSpinner, // Imported CSpinner for loading indicators
} from '@coreui/react';
import axios from 'axios';
import BaseURL from 'src/assets/contants/BaseURL';
import CIcon from '@coreui/icons-react';
import { cilSearch } from '@coreui/icons';
import { useNavigate } from 'react-router-dom'; 

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
  };
};

const ProductionMonitor = () => {
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [shiftData, setShiftData] = useState({ names: {}, numbers: [] });
  const [selectedDate, setSelectedDate] = useState('');
  const [loading, setLoading] = useState(true); // Added loading state
  const navigate = useNavigate();

  const getTodayDate = () => new Date().toISOString().split('T')[0];

  useEffect(() => {
    const today = getTodayDate();
    setSelectedDate(today);

    const checkAuthAndFetchData = async () => {
      if (!localStorage.getItem('token')) {
        handleAuthError(); 
        return;
      }
      await fetchData(today);
    };

    checkAuthAndFetchData();
  }, []);

  const fetchData = async (date) => {
    setError(null);
    setLoading(true); // Set loading to true when fetching starts
    try {
      const response = await axios.post(
        `${BaseURL}data/production/`,
        { date },
        { headers: getAuthHeaders() }
      );

      const { machine_groups } = response.data;

      const shiftNamesMap = {};
      const shiftNumbers = new Set();
      const formattedGroups = machine_groups.reverse().map(group => {
        const formattedMachines = group.machines.map(machine => {
          const shiftTotals = {};
          const shiftArray = machine.shifts || [];
          shiftArray.forEach(shift => {
            if (shift.shift_no !== 0 && ![4, 5, 6].includes(shift.shift_no)) {  // Exclude Shifts 4, 5, and 6
              const shiftNumber = shift.shift_no;
              shiftNamesMap[shiftNumber] = shift.shift_name || `Shift ${shiftNumber}`;
              shiftNumbers.add(shiftNumber);
              shiftTotals[shiftNumber] = (shiftTotals[shiftNumber] || 0) + (shift.total_shift_production_count || 0);
            }
          });

          return {
            ...machine,
            total_shift_production_count: Object.values(shiftTotals).reduce((sum, count) => sum + count, 0),
            shiftTotals,
            production_date: date
          };
        });

        return {
          ...group,
          machines: formattedMachines
        };
      });

      const sortedShiftNumbers = Array.from(shiftNumbers).sort((a, b) => a - b);

      const hasData = formattedGroups.some(group => group.machines.length > 0);

      if (!hasData) {
        setFilteredData([]); 
      } else {
        setFilteredData(formattedGroups);
      }

      setShiftData({ names: shiftNamesMap, numbers: sortedShiftNumbers });
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleAuthError();
      } else {
        console.error('Error fetching data:', error);
        setError(`Error: ${error.message || 'An unknown error occurred'}`);
      }
    } finally {
      setLoading(false); // Set loading to false after fetching completes
    }
  };

  const handleAuthError = () => {
    localStorage.removeItem('token');
    navigate('/login'); 
  };

  const handleSearch = async () => {
    const today = getTodayDate();
    if (selectedDate && selectedDate !== today) {
      await fetchData(selectedDate);
    }
  };

  useEffect(() => {
    const applyHeaderStyles = () => {
      const headerCells = document.querySelectorAll('.custom-table-header th');
      headerCells.forEach((cell) => {
        cell.style.backgroundColor = '#047BC4';
        cell.style.color = 'white';
      });
    };

    applyHeaderStyles();
  }, [filteredData]);

  if (loading) return (
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

  if (error) return <div>{error}</div>;

  const { names: shiftNamesMap, numbers: shiftNumbers } = shiftData;

  return (
    <div>
      <CCard className="mb-4">
        <CCardHeader>
          <h5>Production</h5>
        </CCardHeader>
        <CCardBody>
          <div className="input-group" style={{ width: '300px' }}>
            <CFormInput
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              placeholder="Select Date"
              style={{ width: '90px' }}
            />
            <CButton
              type="button"
              color="primary"
              className="ms-2"
              style={{ height: '38px', borderRadius: '0px', backgroundColor: '#047BC4', borderColor: '#047BC4' }}
              onClick={handleSearch}
              disabled={!selectedDate}
            >
              <CIcon icon={cilSearch} />
            </CButton>
          </div>
        </CCardBody>
      </CCard>

      {filteredData.length === 0 ? (
        <div>No data available</div>
      ) : (
        filteredData.map((group, groupIndex) => (
          <CCard className="mb-4" key={groupIndex}>
            <CCardHeader>
              <h5>{group.group_name || 'Group Name'}</h5>
            </CCardHeader>
              <CCardBody style={{ marginTop: '10px' }}>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <CTable striped hover>
                    <CTableHead className="custom-table-header">
                      <CTableRow>
                        <CTableHeaderCell rowSpan="2" scope="col">WORK CENTER</CTableHeaderCell>
                        {shiftNumbers.length > 0 && shiftNumbers.map((shiftNumber, index) => (
                          <CTableHeaderCell key={index} colSpan="1" scope="col">
                            {shiftNamesMap[shiftNumber] || `Shift ${shiftNumber}`}
                          </CTableHeaderCell>
                        ))}
                        <CTableHeaderCell rowSpan="2" scope="col">Total</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {group.machines && group.machines.length > 0 ? (
                        group.machines.map(machine => {
                          const machineTotals = shiftNumbers.map(shiftNumber => machine.shiftTotals[shiftNumber] || 0);
                          const total = machineTotals.reduce((sum, value) => sum + value, 0);

                          return (
                            <CTableRow key={machine.machine_id}>
                              <CTableDataCell>{machine.machine_name}</CTableDataCell>
                              {machineTotals.map((total, idx) => (
                                <CTableDataCell key={idx}>{total}</CTableDataCell>
                              ))}
                              <CTableDataCell style={{fontWeight: 'bold', color: '#007bff' }}>{total}</CTableDataCell>
                            </CTableRow>
                          );
                        })
                      ) : (
                        <CTableRow>
                          <CTableDataCell colSpan={shiftNumbers.length + 2}>No machines available</CTableDataCell>
                        </CTableRow>
                      )}
                      <CTableRow>
                        <CTableDataCell><strong>Total</strong></CTableDataCell>
                        {shiftNumbers.map((shiftNumber, idx) => (
                          <CTableDataCell style={{fontWeight: 'bold', color: '#007bff' }} key={idx}>
                            {group.machines.reduce((sum, machine) => sum + (machine.shiftTotals[shiftNumber] || 0), 0)}
                          </CTableDataCell>
                        ))}
                        <CTableDataCell style={{fontWeight: 'bold', color: '#007bff' }}>
                          {group.machines.reduce((sum, machine) => sum + machine.total_shift_production_count, 0)}
                        </CTableDataCell>
                      </CTableRow>
                    </CTableBody>
                  </CTable>
                </div>
              </CCardBody>
          </CCard>
        ))
      )}
    </div>
  );
};

export default ProductionMonitor;
