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
} from '@coreui/react';
import axios from 'axios';
import BaseURL from 'src/assets/contants/BaseURL';
import CIcon from '@coreui/icons-react';
import { cilSearch } from '@coreui/icons';

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
  const [allData, setAllData] = useState([]);
  const [searchClicked, setSearchClicked] = useState(false);

  useEffect(() => {
    // Set the default date to today
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      setError(null);
      try {
        console.log('Fetching data...');
        const response = await axios.get(`${BaseURL}data/production/`, {
          headers: getAuthHeaders()
        });

        console.log('API Response:', response.data);

        const { date, machine_groups } = response.data;

        if (!Array.isArray(machine_groups)) {
          throw new Error('Invalid data format: machine_groups is not an array');
        }

        const shiftNamesMap = {};
        const shiftNumbers = new Set();
        const formattedGroups = machine_groups.reverse().map(group => { 
          const formattedMachines = group.machines.map(machine => {
            const shiftTotals = {};
            const shiftArray = machine.shifts || [];
            shiftArray.forEach(shift => {
              if (shift.shift_no !== 0) {
                const shiftNumber = shift.shift_no;
                shiftNamesMap[shiftNumber] = shift.shift_name || `Shift ${shiftNumber}`;
                shiftNumbers.add(shiftNumber);
                shiftTotals[shiftNumber] = (shiftTotals[shiftNumber] || 0) + (shift.production_count || 0);
              }
            });

            return {
              ...machine,
              total_production_count: Object.values(shiftTotals).reduce((sum, count) => sum + count, 0),
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

        setAllData(formattedGroups);
        setFilteredData(formattedGroups); // Set initial data to display in the table
        setShiftData({ names: shiftNamesMap, numbers: sortedShiftNumbers });
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(`Error: ${error.message || 'An unknown error occurred'}`);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log('Interval triggered');
      // fetchData();
    }, 3000);

    return () => clearInterval(intervalId);
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
  }, [filteredData]);

  const handleSearch = () => {
    setSearchClicked(true);

    if (selectedDate) {
      console.log('Selected Date:', selectedDate);
      console.log('All Data Before:', allData);

      const filtered = allData.map(group => ({
        ...group,
        machines: group.machines.filter(machine => {
          const machineDate = machine.production_date || 'Unknown Date';
          console.log('Machine Date:', machineDate);
          return machineDate === selectedDate;
        })
      }));

      console.log('Filtered Data After:', filtered);

      // Check if filtered data is empty
      const hasData = filtered.some(group => group.machines.length > 0);
      if (!hasData) {
        // Create a default data structure with zeros
        filtered.forEach(group => {
          group.machines.forEach(machine => {
            machine.shiftTotals = shiftData.numbers.reduce((acc, shiftNumber) => {
              acc[shiftNumber] = 0;
              return acc;
            }, {});
            machine.total_production_count = 0;
          });
        });
      }

      setFilteredData(filtered);
    } else {
      setFilteredData(allData);
    }
  };

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
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <CCardBody style={{ marginTop: '10px' }}>
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
                            <CTableDataCell>{machine.machine_id}</CTableDataCell>
                            {machineTotals.map((total, idx) => (
                              <CTableDataCell key={idx}>{total}</CTableDataCell>
                            ))}
                            <CTableDataCell>{total}</CTableDataCell>
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
                        <CTableDataCell key={idx}><strong>{group.machines.reduce((sum, machine) => sum + (machine.shiftTotals[shiftNumber] || 0), 0)}</strong></CTableDataCell>
                      ))}
                      <CTableDataCell><strong>{group.machines.reduce((sum, machine) => sum + machine.total_production_count, 0)}</strong></CTableDataCell>
                    </CTableRow>
                  </CTableBody>
                </CTable>
              </CCardBody>
            </div>
          </CCard>
        ))
      )}
    </div>
  );
};

export default ProductionMonitor;
