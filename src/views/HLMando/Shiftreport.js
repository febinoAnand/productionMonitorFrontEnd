import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom'; 
import CIcon from '@coreui/icons-react';
import { cilCalendar, cilSearch } from '@coreui/icons';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CInputGroup,
  CFormSelect,
  CSpinner,
  CButton
} from '@coreui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import BaseURL from 'src/assets/contants/BaseURL';

const HARDCORE_SHIFT_DATA = [
  {
    shift_name: 'Shift 1',
    shift_no: 1,
    timing: {
      '06:30 AM - 07:30 AM': [0, 0],
      '07:30 AM - 08:30 AM': [0, 0],
      '08:30 AM - 09:30 AM': [0, 0],
      '09:30 AM - 10:30 AM': [0, 0],
      '10:30 AM - 11:30 AM': [0, 0],
      '11:30 AM - 12:30 PM': [0, 0],
      '12:30 PM - 01:30 PM': [0, 0],
      '01:30 PM - 02:30 PM': [0, 0],
    }
  },
  {
    shift_name: 'Shift 2',
    shift_no: 2,
    timing: {
      '02:30 PM - 03:30 PM': [0, 0],
      '03:30 PM - 04:30 PM': [0, 0],
      '04:30 PM - 05:30 PM': [0, 0],
      '05:30 PM - 06:30 PM': [0, 0],
      '06:30 PM - 07:30 PM': [0, 0],
      '07:30 PM - 08:30 PM': [0, 0],
      '08:30 PM - 09:30 PM': [0, 0],
      '09:30 PM - 10:30 PM': [0, 0]
    }
  },
  {
    shift_name: 'Shift 3',
    shift_no: 3,
    timing: {
      '10:30 PM - 11:30 PM': [0, 0],
      '11:30 PM - 12:30 AM': [0, 0],
      '12:30 AM - 01:30 AM': [0, 0],
      '01:30 AM - 02:30 AM': [0, 0],
      '02:30 AM - 03:30 AM': [0, 0],
      '03:30 AM - 04:30 AM': [0, 0],
      '04:30 AM - 05:30 AM': [0, 0],
      '05:30 AM - 06:30 AM': [0, 0]
    }
  }
];

const Shiftreport = () => {
  const [startDate, setStartDate] = useState(null);
  const [machineOptions, setMachineOptions] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState('');
  const [machineHourlyData, setMachineHourlyData] = useState(HARDCORE_SHIFT_DATA);
  const [setErrorMessage] = useState('');
  const navigate = useNavigate(); 
  const [loading, setLoading] = useState(false);

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login'); 
  };

  const fetchData = async () => {
    setLoading(true); 
    try {
      const response = await axios.get(`${BaseURL}devices/machine/`, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const machineData = response.data;
      const machineNames = Array.from(new Set(machineData.map(machine => machine.machine_name)));
      const machineIds = Array.from(new Set(machineData.map(machine => machine.machine_id)));
      setMachineOptions(machineNames.map((name, index) => ({ name, id: machineIds[index] })));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logout();
      } else {
        console.error("Error fetching data:", error);
      }
    } finally {
      setLoading(false); 
    }
  };

  const handleSearchClick = async () => {
    if (!selectedMachine || !startDate) {
      setErrorMessage('Please select both a machine and a date.'); 
      return;
    }
    setLoading(true); 
    try {
      const machineId = machineOptions.find(machine => machine.name === selectedMachine).id;
      const formattedDate = format(startDate, 'yyyy-MM-dd');
      const response = await axios.post(`${BaseURL}data/hourly-shift-report/`, {
        "date": formattedDate,
        "machine_id": machineId
      }, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = response.data;
      setMachineHourlyData(data.shifts.filter(shift => shift.timing && Object.keys(shift.timing).length > 0));
    } catch (error) {
      if (error.response && error.response.status === 401) {
        logout();
      } else {
        console.error("Error fetching machine hourly data:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
  }, [machineHourlyData]);

  const calculateTotal = (timing, index) => {
    return Object.values(timing).reduce((acc, value) => acc + value[index], 0);
  };
  

  const CustomInput = ({ value, onClick }) => (
    <div className="input-group" style={{ height: '38px', borderRadius: '0px' }}>
      <input
        type="text"
        className="form-control"
        value={value || ""}
        onClick={onClick}
        readOnly
        placeholder="yyyy-mm-dd"
        style={{ paddingRight: '30px', height: '38px', borderRadius: '0px' }}
      />
      <div className="input-group-append" style={{ borderRadius: '0px' }}>
        <CButton type="button" color="primary" onClick={onClick} style={{ height: '38px', borderRadius: '0px', backgroundColor: '#047BC4', borderColor: '#047BC4' }}>
          <CIcon icon={cilCalendar} />
        </CButton>
      </div>
    </div>
  );

  return (
    <div className="page">
      {loading && (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <CSpinner color="primary" variant="grow" />
          <CSpinner color="secondary" variant="grow" />
          <CSpinner color="success" variant="grow" />
          <CSpinner color="danger" variant="grow" />
          <CSpinner color="warning" variant="grow" />
          <CSpinner color="info" variant="grow" />
          <CSpinner color="dark" variant="grow" />
        </div>
      )}

      <CCard className="mb-3" style={{ marginTop: '30px' }}>
        <CCardHeader>
          <h5>Shift Report</h5>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol md={4}>
              <CInputGroup className="flex-nowrap mt-3 mb-4">
                <CFormSelect
                  aria-label="Select Machine"
                  value={selectedMachine}
                  onChange={(e) => setSelectedMachine(e.target.value)}
                >
                  <option value="">Select Machine</option>
                  {machineOptions.length > 0 ? (
                    machineOptions.map((machine, index) => (
                      <option key={index} value={machine.name}>
                        {machine.name}
                      </option>
                    ))
                  ) : (
                    <option value="">Loading machines...</option>
                  )}
                </CFormSelect>
              </CInputGroup>
            </CCol>
            <CCol md={4} className="text-end">
              <CInputGroup className="flex-nowrap mt-3 mb-4">
                <DatePicker
                  selected={startDate ? new Date(startDate) : null}
                  onChange={(date) => setStartDate(date)}
                  customInput={<CustomInput />}
                  dateFormat="yyyy-MM-dd"
                  popperPlacement="bottom-end"
                  onChangeRaw={(e) => {
                    const rawDate = new Date(e.target.value);
                    setStartDate(isNaN(rawDate.getTime()) ? null : rawDate);
                  }}
                />
                <CButton
                  type="button"
                  color="primary"
                  className="ms-2"
                  style={{ height: '38px', borderRadius: '0px', backgroundColor: '#047BC4', borderColor: '#047BC4' }}
                  onClick={handleSearchClick}
                  disabled={!selectedMachine || !startDate}
                >
                  <CIcon icon={cilSearch} />
                </CButton>
              </CInputGroup>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      <CRow>
        <CCol xs={12}>
          {machineHourlyData.length > 0 ? (
            machineHourlyData.map((shift, index) => (
              <CCard className="mb-4" key={index}>
                <CCardHeader>
                  <h5>{shift.shift_name || 'Shift ' + shift.shift_no}</h5>
                </CCardHeader>
                <CCardBody style={{ marginTop: '10px' }}>
                  <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    <CTable striped hover>
                      <CTableHead className="custom-table-header">
                        <CTableRow>
                          <CTableHeaderCell scope="col">Time</CTableHeaderCell>
                          <CTableHeaderCell scope="col">Production Count </CTableHeaderCell>
                          <CTableHeaderCell scope="col">Target Count</CTableHeaderCell>
                        </CTableRow>
                      </CTableHead>
                      <CTableBody>
                      {Object.entries(shift.timing).map(([timeRange, counts], i) => (
                        <CTableRow key={i}>
                          <CTableDataCell>{timeRange}</CTableDataCell>
                          <CTableDataCell>{counts[0]}</CTableDataCell>
                          <CTableDataCell>{counts[1]}</CTableDataCell>
                        </CTableRow>
                      ))}
                      <CTableRow>
                        <CTableDataCell style={{ fontWeight: 'bold' }}>Total</CTableDataCell>
                        <CTableDataCell style={{ fontWeight: 'bold', color: '#007bff' }}>
                          {calculateTotal(shift.timing, 0)}
                        </CTableDataCell>
                        <CTableDataCell style={{ fontWeight: 'bold', color: '#007bff' }}>
                          {calculateTotal(shift.timing, 1)}
                        </CTableDataCell>
                        </CTableRow>
                      </CTableBody>
                    </CTable>
                  </div>
                </CCardBody>
              </CCard>
            ))
          ) : (
            <p>No data available</p>
          )}
        </CCol>
      </CRow>
    </div>
  );
};

export default Shiftreport;

