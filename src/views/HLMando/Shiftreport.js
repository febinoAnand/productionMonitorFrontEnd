import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
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
import BaseURL from 'src/assets/contants/BaseURL';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
  };
};

const Shiftreport = () => {
  const [startDate, setStartDate] = useState(null);
  const [shiftData, setShiftData] = useState([]);
  const [filteredShiftData, setFilteredShiftData] = useState([]);
  const [machineOptions, setMachineOptions] = useState([]);
  const [selectedMachine, setSelectedMachine] = useState('');
  const [highlightedDates, setHighlightedDates] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BaseURL}data/production-monitor/`, { headers: getAuthHeaders() });
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        const shiftData = (data.shift_wise_data || []).filter(shift => shift.shift_number !== 0);
        setShiftData(shiftData);
        setFilteredShiftData(shiftData); // Show all data initially

        const machineResponse = await fetch(`${BaseURL}devices/machine/`, { headers: getAuthHeaders() });
        if (!machineResponse.ok) {
          throw new Error(`HTTP error! Status: ${machineResponse.status}`);
        }
        const machineData = await machineResponse.json();

        const machineNames = Array.from(new Set(machineData.map(machine => machine.machine_name)));
        setMachineOptions(machineNames);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (selectedMachine) {
      const datesWithData = Array.from(new Set(
        shiftData
          .flatMap(shift => shift.groups.flatMap(group => group.machines))
          .filter(machine => machine.machine_name === selectedMachine)
          .map(machine => shiftData.find(shift => shift.groups.some(group => group.machines.includes(machine))).shift_date.split('T')[0])
      ));
      setHighlightedDates(datesWithData.map(date => new Date(date)));
    } else {
      setHighlightedDates([]);
    }
  }, [selectedMachine, shiftData]);

  useEffect(() => {
    if (!selectedMachine && !startDate) {
      setFilteredShiftData(shiftData); // Show all data if no machine or date is selected
    }
  }, [selectedMachine, startDate, shiftData]);

  const handleSearchClick = () => {
    if (!startDate || !selectedMachine) return;

    const formattedDate = format(startDate, 'yyyy-MM-dd');

    const filteredData = shiftData.filter(shift => {
      const shiftDate = shift.shift_date.split('T')[0];
      const matchDate = shiftDate === formattedDate;

      const filteredGroups = shift.groups.filter(group => 
        group.machines.some(machine => machine.machine_name === selectedMachine)
      );

      return matchDate && filteredGroups.length > 0;
    }).map(shift => ({
      ...shift,
      groups: shift.groups.filter(group => 
        group.machines.some(machine => machine.machine_name === selectedMachine)
      )
    }));

    setFilteredShiftData(filteredData);
  };

  const CustomInput = ({ value, onClick }) => (
    <div className="input-group" style={{ height: '38px', borderRadius: '0px' }}>
      <input
        type="text"
        className="form-control"
        value={value}
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

  // Time ranges for different shifts
  const shiftTimeRanges = {
    1: [
      { start: '06:30 AM', end: '07:30 AM' },
      { start: '07:30 AM', end: '08:30 AM' },
      { start: '08:30 AM', end: '09:30 AM' },
      { start: '09:30 AM', end: '10:30 AM' },
      { start: '10:30 AM', end: '11:30 AM' },
      { start: '11:30 AM', end: '12:30 PM' },
      { start: '12:30 PM', end: '01:30 PM' },
      { start: '01:30 PM', end: '02:30 PM' }
    ],
    2: [
      { start: '02:30 PM', end: '03:30 PM' },
      { start: '03:30 PM', end: '04:30 PM' },
      { start: '04:30 PM', end: '05:30 PM' },
      { start: '05:30 PM', end: '06:30 PM' },
      { start: '06:30 PM', end: '07:30 PM' },
      { start: '07:30 PM', end: '08:30 PM' },
      { start: '08:30 PM', end: '09:30 PM' },
      { start: '09:30 PM', end: '10:30 PM' },
      { start: '10:30 PM', end: '11:30 PM' }
    ],
    3: [
      { start: '10:30 PM', end: '11:30 PM' },
      { start: '11:30 PM', end: '12:30 AM' },
      { start: '12:30 AM', end: '01:30 AM' },
      { start: '01:30 AM', end: '02:30 AM' },
      { start: '02:30 AM', end: '03:30 AM' },
      { start: '03:30 AM', end: '04:30 AM' },
      { start: '04:30 AM', end: '05:30 AM' },
      { start: '05:30 AM', end: '06:30 AM' }
    ]
  };

  const renderShiftTable = (shift) => {
    const shiftLabel = shift.shift_number !== null ? `Shift ${shift.shift_number}` : 'Shift N/A';

    // Calculate the total production count for this shift
    const totalProductionCount = shift.groups.reduce((total, group) => total + group.total_production_count_by_group, 0);

    // Get the time ranges for this shift
    const timeRanges = shiftTimeRanges[shift.shift_number] || [];

    return (
      <CCard className="mb-4" key={shift.shift_id}>
        <CCardHeader>
          <h5>{shift.shift_name ? shift.shift_name : shiftLabel}</h5>
        </CCardHeader>
        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
        <CCardBody style={{ marginTop: '10px' }}> 
            <CTable striped hover>
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell scope="col">Time</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Production Count Actual</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {timeRanges.map((range, index) => (
                  <CTableRow key={index}>
                    <CTableDataCell>{`${range.start} to ${range.end}`}</CTableDataCell>
                    <CTableDataCell>
                      {shift.groups
                        .filter(group => group.time_range === `${range.start} to ${range.end}`)
                        .reduce((total, group) => total + group.total_production_count_by_group, 0)}
                    </CTableDataCell>
                  </CTableRow>
                ))}
                <CTableRow>
                  <CTableHeaderCell>Total</CTableHeaderCell>
                  <CTableHeaderCell>{totalProductionCount}</CTableHeaderCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </div>
      </CCard>
    );
  };

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
                  <option key={index} value={machine}>
                    {machine}
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
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              customInput={<CustomInput />}
              dateFormat="yyyy-MM-dd"
              popperPlacement="bottom-end"
              highlightDates={highlightedDates}
              onChangeRaw={(e) => setStartDate(new Date(e.target.value))}
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
          {filteredShiftData.length > 0 ? (
            filteredShiftData.map(shift => (
              <div key={shift.shift_id}>
                {renderShiftTable(shift)}
              </div>
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
