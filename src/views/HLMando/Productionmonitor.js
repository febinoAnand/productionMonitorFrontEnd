import React, { useState } from 'react';
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
  CButton,
  CInputGroup
} from '@coreui/react';
import axios from 'axios';
import BaseURL from 'src/assets/contants/BaseURL';
import CIcon from '@coreui/icons-react';
import { cilCalendar, cilSearch } from '@coreui/icons';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';


const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};


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
  const [startDate, setStartDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const fetchData = async (date) => {
    setLoading(true);
    setError(null);
    try {
      
      const formattedDate = formatDate(date);

      console.log('Formatted date for fetching data:', formattedDate);

      const response = await axios.post(`${BaseURL}data/group-wise-machine-data/`, {
        date: formattedDate
      }, {
        headers: getAuthHeaders() 
      });

      const result = response.data;

     
      const reversedGroups = (result.groups || []).reverse().map(group => ({
        ...group,
        machines: group.machines.reverse()
      }));

      setFilteredData(reversedGroups);
      setShowTable(true);
    } catch (error) {
      setError(error);
      setShowTable(false);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchClick = () => {
    if (startDate) {
      fetchData(startDate);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const CustomInput = ({ value, onClick }) => (
    <div className="input-group" style={{ height: '38px', borderRadius: '0px' }}>
      <input
        type="text"
        className="form-control"
        value={value}
        onClick={onClick}
        readOnly
        style={{ paddingRight: '30px', height: '38px', borderRadius: '0px' }}
      />
      <div className="input-group-append" style={{ borderRadius: '0px' }}>
        <CButton type="button" color="secondary" onClick={onClick} style={{ height: '38px', borderRadius: '0px' }}>
          <CIcon icon={cilCalendar} />
        </CButton>
      </div>
    </div>
  );

  const renderTable = (group) => {
    
    const shiftInfo = group.machines.flatMap(machine =>
      machine.shifts.map(shift => ({
        shift_name: shift.shift_name,
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
    <div className="page">
      <CRow className="mb-5">
        <CCol xs={12}>
          <CInputGroup className="flex-nowrap mt-3 mb-4">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              customInput={<CustomInput />}
              dateFormat="yyyy-MM-dd"
              popperPlacement="bottom-end"
            />
            <CButton
              type="button"
              color="secondary"
              className="ms-2"
              style={{ height: '38px', borderRadius: '0px' }}
              onClick={handleSearchClick}
              disabled={!startDate}
            >
              <CIcon icon={cilSearch} />
            </CButton>
          </CInputGroup>
        </CCol>
      </CRow>
      {showTable ? (
        <CRow>
          <CCol xs={12}>
            {filteredData
              .filter(group => group.machines.some(machine => machine.shifts.length > 0)) 
              .map(group => renderTable(group))}
          </CCol>
        </CRow>
      ) : (
        <CRow>
          <CCol xs={12}>
            <div>No data available</div>
          </CCol>
        </CRow>
      )}
    </div>
  );
  };
  
export default ProductionMonitor;
