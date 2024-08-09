import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
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
  CButton
} from '@coreui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import BaseURL from 'src/assets/contants/BaseURL';

const Shiftreport = () => {
  const [startDate, setStartDate] = useState(null);
  const [machineOptions, setMachineOptions] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState('');
  const [machineHourlyData, setMachineHourlyData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
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
        console.error("Error fetching data:", error);
      }
    };

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

    applyHeaderStyles(); // Apply styles when the component mounts or updates

  }, [machineHourlyData]); // Dependency array includes machineHourlyData

  const handleSearchClick = async () => {
    if (!selectedMachine || !startDate) return;

    try {
      const machineId = machineOptions.find(machine => machine.name === selectedMachine).id;
      const formattedDate = format(startDate, 'yyyy-MM-dd');
      const response = await axios.post(`${BaseURL}data/machine-hourly-data/`, {
        "machine_id": machineId,
        "date": formattedDate
      }, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
      const data = response.data;
      // Filter out shifts without hourly data
      setMachineHourlyData(Object.values(data).filter(shift => shift.hourly_data && Object.keys(shift.hourly_data).length > 0));
    } catch (error) {
      console.error("Error fetching machine hourly data:", error);
    }
  };

  const CustomInput = ({ value, onClick }) => (
    <div className="input-group" style={{ height: '38px', borderRadius: '0px' }}>
      <input
        type="text"
        className="form-control"
        value={value || ""}
        onClick={onClick}
        readOnly
        placeholder="Select date"
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

      <CRow>
        <CCol xs={12}>
          {machineHourlyData.length > 0 ? (
            machineHourlyData.map((shift, index) => (
              <CCard className="mb-4" key={index}>
                <CCardHeader>
                  <h5>{shift.shift_name || 'Shift ' + (index + 1)}</h5>
                </CCardHeader>
                <CCardBody style={{ marginTop: '10px' }}>
                  <CTable striped hover>
                    <CTableHead className="custom-table-header">
                      <CTableRow>
                        <CTableHeaderCell scope="col">Time</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Production Count Actual</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {Object.entries(shift.hourly_data).map(([timeRange, count], i) => (
                        <CTableRow key={i}>
                          <CTableDataCell>{timeRange}</CTableDataCell>
                          <CTableDataCell>{count}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCardBody>
              </CCard>
            ))
          ) : (
            <p>No data available for the selected date and machine.</p>
          )}
        </CCol>
      </CRow>
    </div>
  );
};

export default Shiftreport;