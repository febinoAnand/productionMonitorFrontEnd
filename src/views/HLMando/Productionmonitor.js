import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
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

  // Fetch data when component mounts
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${BaseURL}data/group-machine-data/`, {
        headers: getAuthHeaders()
      });

      const result = response.data;

      const reversedGroups = (result.groups || []).reverse().map(group => ({
        ...group,
        machines: group.machines.reverse()
      }));

      setFilteredData(reversedGroups);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const renderTable = (group) => {
    const shiftInfo = group.machines.flatMap(machine =>
      machine.shifts.map(shift => ({
        shift_name: shift.shift_name,
        target_count: shift.target_count || 0,
        production_count: shift.production_count || 0
      }))
    );

    const shiftMap = shiftInfo.reduce((acc, shift) => {
      if (!acc[shift.shift_name]) {
        acc[shift.shift_name] = { target_count: shift.target_count, production_count: shift.production_count };
      } else {
        acc[shift.shift_name].target_count += shift.target_count; 
        acc[shift.shift_name].production_count += shift.production_count; 
      }
      return acc;
    }, {});

    const uniqueShiftNames = Object.keys(shiftMap);

    return (
      <div key={group.group_name}>
        <h5>{group.group_name}</h5>
        <CCard className="mb-4">
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <CCardBody>
              <CTable striped hover>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell rowSpan="2" scope="col">Si.No</CTableHeaderCell>
                    <CTableHeaderCell rowSpan="2" scope="col">WORK CENTER</CTableHeaderCell>
                    {uniqueShiftNames.map((shiftName, index) => (
                      <CTableHeaderCell key={index} colSpan="1" scope="col">
                        {shiftName}
                      </CTableHeaderCell>
                    ))}
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {group.machines.map((machine, index) => (
                    <CTableRow key={machine.machine_id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{machine.machine_name}</CTableDataCell>
                      {uniqueShiftNames.map((shiftName, idx) => {
                        const shift = machine.shifts.find(s => s.shift_name === shiftName);
                        return (
                          <CTableDataCell key={`combined-cell-${idx}`}>
                            {shift ? `${shift.target_production}/${shift.production_count}` : 'No data'}
                          </CTableDataCell>
                        );
                      })}
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </div>
        </CCard>
      </div>
    );
  };

  return (
    <div>
      {filteredData.map(group => renderTable(group))}
    </div>
  );
};

export default ProductionMonitor;