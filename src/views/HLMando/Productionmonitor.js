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
} from '@coreui/react';
import axios from 'axios';
import BaseURL from 'src/assets/contants/BaseURL';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); 
  return {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
  };
};

const ProductionMonitor = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [shiftData, setShiftData] = useState({ names: {}, numbers: [] });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log('Fetching data...');
        const response = await axios.get(`${BaseURL}data/production/`, {
          headers: getAuthHeaders()
        });
        const { group_data } = response.data;

        if (!Array.isArray(group_data)) {
          throw new Error('Invalid data format');
        }

        const shiftNamesMap = {};
        const shiftNumbers = new Set();

        group_data.forEach(group => {
          if (group.machines) {
            group.machines.forEach(machine => {
              if (machine.shifts) {
                Object.keys(machine.shifts).forEach(shiftNumber => {
                  const shift = machine.shifts[shiftNumber];
                  if (shift.shift_number !== 0) {
                    const shiftName = shift.shift_name || `Shift ${shiftNumber}`;
                    shiftNamesMap[shiftNumber] = shiftName;
                    shiftNumbers.add(Number(shiftNumber));
                  }
                });
              }
            });
          }
        });

        const sortedShiftNumbers = Array.from(shiftNumbers).sort((a, b) => a - b);

        const reversedGroupData = group_data.reverse().map(group => ({
          ...group,
          machines: (group.machines || []).map(machine => ({
            ...machine,
            shifts: Object.keys(machine.shifts || {}).reduce((acc, key) => {
              if (key !== "0") {
                acc[key] = machine.shifts[key];
              }
              return acc;
            }, {})
          }))
        }));

        const formattedGroupData = reversedGroupData.map(group => ({
          ...group,
          machines: group.machines.map(machine => ({
            ...machine,
            total_production_count: Object.values(machine.shifts || {}).reduce((sum, shift) => sum + (shift.production_count || 0), 0)
          }))
        }));

        setFilteredData(formattedGroupData);
        setShiftData({ names: shiftNamesMap, numbers: sortedShiftNumbers });
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const headerCells = document.querySelectorAll('.custom-table-header th');
    headerCells.forEach((cell) => {
      cell.style.backgroundColor = '#047BC4';
      cell.style.color = 'white';
    });
  }, [filteredData]);

  if (loading && filteredData.length === 0) return null;

  if (error) return <div>Error: {error.message}</div>;

  const { names: shiftNamesMap, numbers: shiftNumbers } = shiftData;

  return (
    <div>
      {filteredData.length === 0 ? (
        <div>No data available</div>
      ) : (
        filteredData.map(group => {
          const shiftTotals = shiftNumbers.map(() => 0);
          let groupTotal = 0;

          return (
            <div key={group.group_id}>
              <CCard className="mb-4">
                <CCardHeader>
                  <h5>{group.group_name}</h5>
                </CCardHeader>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <CCardBody style={{ marginTop: '10px' }}> 
                    <CTable striped hover>
                      <CTableHead className="custom-table-header">
                        <CTableRow>
                          <CTableHeaderCell rowSpan="2" scope="col">WORK CENTER</CTableHeaderCell>
                          {shiftNumbers.map((shiftNumber, index) => (
                            <CTableHeaderCell key={index} colSpan="1" scope="col">
                              {shiftNamesMap[shiftNumber] || `Shift ${shiftNumber}`}
                            </CTableHeaderCell>
                          ))}
                          <CTableHeaderCell rowSpan="2" scope="col">Total</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                        {group.machines && group.machines.map(machine => {
                          const machineTotals = shiftNumbers.map(() => 0);

                          Object.values(machine.shifts || {}).forEach(shift => {
                            const shiftNumber = shift.shift_number;
                            if (shiftNumber !== 0) {
                              const shiftIndex = shiftNumbers.indexOf(shiftNumber);
                              if (shiftIndex >= 0) {
                                machineTotals[shiftIndex] = (shift.production_count);
                              }
                            }
                          });

                          const total = machineTotals.reduce((sum, value) => sum + value, 0);
                          groupTotal += total;

                          machineTotals.forEach((value, index) => {
                            shiftTotals[index] += value;
                          });

                          return (
                            <CTableRow key={machine.machine_id}>
                              <CTableDataCell>{machine.machine_name}</CTableDataCell>
                              {machineTotals.map((total, idx) => (
                                <CTableDataCell key={idx}>
                                  {total}
                                </CTableDataCell>
                              ))}
                              <CTableDataCell>{total}</CTableDataCell>
                            </CTableRow>
                          );
                        })}
                        <CTableRow>
                          <CTableDataCell><strong>Total</strong></CTableDataCell>
                          {shiftTotals.map((total, idx) => (
                            <CTableDataCell key={idx}><strong>{total}</strong></CTableDataCell>
                          ))}
                          <CTableDataCell><strong>{groupTotal}</strong></CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                  </CCardBody>
                </div>
              </CCard>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ProductionMonitor;
