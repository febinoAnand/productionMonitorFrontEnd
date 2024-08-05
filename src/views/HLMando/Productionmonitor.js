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
        // Fetch production data
        const response = await axios.get(`${BaseURL}data/production/`, {
          headers: getAuthHeaders()
        });
        const { group_data } = response.data;

        // Check if group_data is valid
        if (!Array.isArray(group_data)) {
          throw new Error('Invalid data format');
        }

        // Prepare shift names mapping and filter out shift_number 0
        const shiftNamesMap = {};
        const shiftNumbers = new Set(); // Using Set to collect unique shift numbers

        group_data.forEach(group => {
          if (group.machines) {
            group.machines.forEach(machine => {
              if (machine.shifts) {
                Object.keys(machine.shifts).forEach(shiftNumber => {
                  const shift = machine.shifts[shiftNumber];
                  if (shift.shift_number !== 0) { // Exclude shift_number 0
                    const shiftName = shift.shift_name || `Shift ${shiftNumber}`;
                    shiftNamesMap[shiftNumber] = shiftName;
                    shiftNumbers.add(Number(shiftNumber));
                  }
                });
              }
            });
          }
        });

        // Convert Set to sorted array
        const sortedShiftNumbers = Array.from(shiftNumbers).sort((a, b) => a - b);

        // Reverse group_data to display the last fetched data first
        const reversedGroupData = group_data.reverse().map(group => ({
          ...group,
          machines: (group.machines || []).map(machine => ({
            ...machine,
            shifts: Object.keys(machine.shifts || {}).reduce((acc, key) => {
              if (key !== "0") { // Exclude shift_number 0
                acc[key] = machine.shifts[key];
              }
              return acc;
            }, {})
          }))
        }));

        setFilteredData(reversedGroupData);
        setShiftData({ names: shiftNamesMap, numbers: sortedShiftNumbers });
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const { names: shiftNamesMap, numbers: shiftNumbers } = shiftData;

  return (
    <div>
      {filteredData.map(group => {
        // Initialize totals
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
                    <CTableHead color="dark">
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
                        // Initialize machine totals
                        const machineTotals = shiftNumbers.map(() => 0);

                        // Calculate totals based on shifts
                        Object.values(machine.shifts || {}).forEach(shift => {
                          const shiftNumber = shift.shift_number;
                          if (shiftNumber !== 0) { // Exclude shift_number 0
                            const shiftIndex = shiftNumbers.indexOf(shiftNumber);
                            if (shiftIndex >= 0) {
                              machineTotals[shiftIndex] =(shift.production_count || 0);
                            }
                          }
                        });

                        // Calculate machine total
                        const total = machineTotals.reduce((sum, value) => sum + value, 0);
                        groupTotal += total;

                        // Update shiftTotals
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
      })}
    </div>
  );
};

export default ProductionMonitor;
