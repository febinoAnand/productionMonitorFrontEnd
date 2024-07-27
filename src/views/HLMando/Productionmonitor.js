import React, { useEffect, useState } from 'react';
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';
import BaseURL from 'src/assets/contants/BaseURL';

const ProductionMonitor = () => {
  const [shiftData, setShiftData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BaseURL}/data/production-monitor/`);
        const result = await response.json();
        console.log(result); // Log the result to understand its structure
        setShiftData(result.shift_wise_data || []);
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

  const renderTable = (shift) => {
    return shift.groups.map(group => (
      <div key={group.group_id}>
        <h5>{group.group_name}</h5>
        <CCard className="mb-4">
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <CCardBody>
              <CTable striped hover>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Si.No</CTableHeaderCell>
                    <CTableHeaderCell scope="col">WORK CENTER</CTableHeaderCell>
                    <CTableHeaderCell scope="col">TOTAL PRODUCTION COUNT</CTableHeaderCell>
                    <CTableHeaderCell scope="col">TOTAL TARGET COUNT</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {group.machines.map((machine, index) => (
                    <CTableRow key={machine.machine_id}>
                      <CTableDataCell>{index + 1}</CTableDataCell>
                      <CTableDataCell>{machine.machine_name}</CTableDataCell>
                      <CTableDataCell>{group.total_production_count_by_group}</CTableDataCell>
                      <CTableDataCell>{group.total_target_count_by_group}</CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </div>
        </CCard>
      </div>
    ));
  };

  return (
    <div className="page">
      <CRow className="mb-5">
        <CCol xs={12}>
          {shiftData.map(shift => renderTable(shift))}
        </CCol>
      </CRow>
    </div>
  );
};

export default ProductionMonitor;
