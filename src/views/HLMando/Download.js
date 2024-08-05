import React, { useState, useEffect, forwardRef } from 'react';
import {
  CCol,
  CRow,
  CInputGroup,
  CFormInput,
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CFormSelect,
} from '@coreui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CIcon from '@coreui/icons-react';
import { cilCalendar, cilSearch } from '@coreui/icons';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import BaseURL from 'src/assets/contants/BaseURL';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json',
  };
};

const Download = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMachine, setSelectedMachine] = useState('');
  const [machineOptions, setMachineOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const machineResponse = await fetch(`${BaseURL}devices/machine/`, { headers: getAuthHeaders() });
        if (!machineResponse.ok) {
          throw new Error(`HTTP error! Status: ${machineResponse.status}`);
        }
        const machineData = await machineResponse.json();
        const machineNames = Array.from(new Set(machineData.map(machine => ({
          id: machine.machine_id,
          name: machine.machine_name,
        }))));
        setMachineOptions(machineNames);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setErrorMessage('');
  };

  const handleMachineChange = (e) => {
    setSelectedMachine(e.target.value);
  };

  const generateSummaryPDF = async () => {
    try {
        const formattedDate = selectedDate.toISOString().split('T')[0];
  
        const [machineGroupResponse, shiftTimingsResponse] = await Promise.all([
            axios.get(`${BaseURL}devices/machinegroup/`, { headers: getAuthHeaders() }),
            axios.get(`${BaseURL}devices/shifttimings/`, { headers: getAuthHeaders() }),
        ]);
  
        const machineGroups = machineGroupResponse.data;
        let shiftTimings = shiftTimingsResponse.data;
  
        
        shiftTimings = shiftTimings
            .filter(timing => timing.production_count !== 0)
            .sort((a, b) => new Date(b.date) - new Date(a.date)); 
  
        const doc = new jsPDF();
  
       
        let grandTotal = 0;
  
        const tableData = [];
  
        machineGroups.forEach((group) => {
            group.machines.forEach((machine) => {
               
                const machineTimings = shiftTimings.filter(timing => timing.machine_id === machine.machine_id);
  
                const cumulativeData = machineTimings.reduce((acc, timing) => {
                    const shiftIndex = timing.shift - 1; 
                    acc[`shift${shiftIndex + 1}`] = (acc[`shift${shiftIndex + 1}`] || 0) + timing.production_count;
                    acc.total += timing.production_count;
                    return acc;
                }, { work_center: machine.work_center, shift1: 0, shift2: 0, shift3: 0, total: 0 });
  
                // Add to grand total
                grandTotal += cumulativeData.total;
  
                // Add row to table data
                tableData.push([
                    cumulativeData.work_center,
                    cumulativeData.shift1,
                    cumulativeData.shift2,
                    cumulativeData.shift3,
                    cumulativeData.total
                ]);
            });
        });
  
      
        doc.setFontSize(18);
        doc.text('Summary Report', 14, 20);
  
        autoTable(doc, {
            head: [['WORK CENTER', 'Shift 1', 'Shift 2', 'Shift 3', 'Total']],
            body: tableData,
            startY: 30,
            theme: 'grid',
            headStyles: { fillColor: [0, 123, 255] },
            styles: { cellPadding: 5, fontSize: 10 },
        });
  
        
        doc.setFontSize(14);
        doc.text(`Total Production Across All Groups: ${grandTotal}`, 14, doc.autoTable.previous.finalY + 10);
  
        doc.save('summary_report.pdf');
    } catch (error) {
        console.error('Error generating PDF:', error);
        setErrorMessage('Error generating PDF. Please try again.');
    }
};

  
  const generateShiftwisePDF = async () => {
    try {
      const formattedDate = selectedDate.toISOString().split('T')[0];
  
      // Fetch shift timings
      const response = await axios.get(`${BaseURL}data/production-monitor/`, {
        headers: getAuthHeaders(),
        params: { date: formattedDate, machine: selectedMachine },
      });
  
      // Log the response data
      console.log('Shift Timings Data:', response.data);
  
      const { shift_wise_data } = response.data;
  
      // Check if shift_wise_data is an array
      if (!Array.isArray(shift_wise_data)) {
        throw new TypeError('Expected shift_wise_data to be an array');
      }
  
      // Log contents of shift_wise_data
      console.log('Contents of shift_wise_data:', shift_wise_data);
  
      // Check data format and log shift values
      shift_wise_data.forEach(item => {
        console.log(`Item:`, item, `Shift ID:`, item.shift_id, `Shift Number:`, item.shift_number);
      });
  
      // Filter out shift 0 and prepare data for shifts 1 to 4 using shift_id
      const shiftData = shift_wise_data.filter(timing => {
        const shiftValue = parseInt(timing.shift_id); // Use shift_id or shift_number based on your needs
        return shiftValue > 0 && shiftValue <= 4;
      });
  
      // Log filtered shift data
      console.log('Filtered Shift Data:', shiftData);
  
      // Check if shiftData has entries
      if (shiftData.length === 0) {
        throw new Error('No valid shift data found');
      }
  
      const doc = new jsPDF();
      const shifts = [1, 2, 3, 4];
  
      shifts.forEach((shift, index) => {
        if (index > 0) {
          doc.addPage();
        }
  
        doc.setFontSize(16);
        doc.text(`Shift ${shift}`, 14, 20);
  
        // Filter data for the current shift
        const shiftTableData = shiftData
          .filter(timing => parseInt(timing.shift_id) === shift) // Use shift_id or shift_number
          .map(timing => [timing.time, timing.production_count]);
  
      
        if (shiftTableData.length === 0) {
          doc.text('No data available for this shift.', 14, 30);
        } else {
          
          autoTable(doc, {
            head: [['Time', 'Production Count Actual']],
            body: shiftTableData,
            startY: 30,
            theme: 'grid',
            headStyles: { fillColor: [0, 123, 255] },
            styles: { cellPadding: 5, fontSize: 10 },
          });
        }
      });
  
      // Save the PDF document
      doc.save('shiftwise_report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
      setErrorMessage('Error generating PDF. Please try again.');
    }
  };
  
  
  return (
    <div className="page">
      <CRow className="mb-3">
        {errorMessage && (
          <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>
        )}
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <h4>Machines</h4>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md={4} className="text-end">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <CInputGroup>
                      <CFormSelect
                        value={selectedMachine}
                        onChange={handleMachineChange}
                        aria-label="Select Machine"
                      >
                        <option value="">Select a machine</option>
                        {machineOptions.map((machine) => (
                          <option key={machine.id} value={machine.id}>
                            {machine.name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CInputGroup>
                  </div>
                </CCol>
                <CCol md={6} className="text-end">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <CInputGroup>
                      <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        customInput={<CustomInput />}
                        dateFormat="dd/MM/yyyy"
                        popperPlacement="bottom-end"
                      />
                      <CButton
                        type="button"
                        color="primary"
                        className="ms-2"
                        style={{ height: '38px', borderRadius: '0px', backgroundColor: '#047BC4', borderColor: '#047BC4' }}
                      >
                        <CIcon icon={cilSearch} />
                      </CButton>
                    </CInputGroup>
                  </div>
                </CCol>
              </CRow>
              <CRow className="justify-content-center mt-5">
                <CCol md={3} className="text-center">
                  <CButton
                    type="button"
                    color="primary"
                    variant="outline"
                    className="mb-3"
                    style={{ width: '100%' }}
                    onClick={generateSummaryPDF}
                  >
                    Summary Report
                  </CButton>
                </CCol>
                <CCol md={3} className="text-center">
                  <CButton
                    type="button"
                    color="primary"
                    variant="outline"
                    className="mb-3"
                    style={{ width: '100%' }}
                    onClick={generateShiftwisePDF}
                  >
                    Shiftwise Report
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  );
};

const CustomInput = forwardRef((props, ref) => (
  <CInputGroup>
    <CFormInput
      value={props.value}
      onClick={props.onClick}
      readOnly
      ref={ref}
      style={{ paddingRight: '30px', height: '38px', borderRadius: '0px' }}
    />
    <CButton
      type="button"
      color="secondary"
      onClick={props.onClick}
      style={{ backgroundColor: '#047BC4', borderColor: '#047BC4' }}
    >
      <CIcon icon={cilCalendar} style={{ color: '#FFFFFF' }} />
    </CButton>
  </CInputGroup>
));
CustomInput.displayName = 'CustomInput';

export default Download;
