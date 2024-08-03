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
        // Fetch machine groups
        const groupsResponse = await axios.get(`${BaseURL}devices/machinegroup/`, {
          headers: getAuthHeaders()
        });
        const groupsData = groupsResponse.data;

        // Fetch shift timings
        const shiftsResponse = await axios.get(`${BaseURL}devices/shifttimings/`, {
          headers: getAuthHeaders()
        });
        const shiftsData = shiftsResponse.data;

        // Prepare shift names mapping
        const shiftNamesMap = shiftsData.reduce((acc, shift) => {
          const shiftName = shift.shift_name || `Shift ${shift.shift_number}`;
          const shiftNumber = shift.shift_number !== null ? shift.shift_number : shiftName;
          acc[shiftNumber] = shiftName;
          return acc;
        }, {});

        // Sort shift numbers
        const shiftNumbers = Object.keys(shiftNamesMap).map(Number).sort((a, b) => a - b);

        // Reverse the order of groups and machines to display the last fetched data first
        const reversedGroupsData = groupsData.reverse().map(group => ({
          ...group,
          machines: (group.machines || []).reverse() // Reverse machines within each group
        }));

        setFilteredData(reversedGroupsData);
        setShiftData({ names: shiftNamesMap, numbers: shiftNumbers });
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
                <CCardBody>
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

                        // Dummy data for shifts as it's missing from the provided response
                        const shifts = machine.shifts || []; // Replace with actual shifts if available

                        // Calculate totals based on shifts
                        shifts.forEach(shift => {
                          const shiftNumber = shift.shift_number !== null ? shift.shift_number : 0;
                          const shiftIndex = shiftNumbers.indexOf(shiftNumber);
                          if (shiftIndex >= 0) {
                            machineTotals[shiftIndex] = (shift.target_count || 0) + (shift.production_count || 0);
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
