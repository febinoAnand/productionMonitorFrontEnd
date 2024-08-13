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
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom'; 


const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json',
  };
};

const logout = (navigate) => {
  localStorage.removeItem('token');
  navigate('/login'); 
};

const Download = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMachine, setSelectedMachine] = useState('');
  const [machineOptions, setMachineOptions] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isDataFetched, setIsDataFetched] = useState(false);
  const [data, setData] = useState(null);
  const navigate = useNavigate();


  useEffect(() => {
    const fetchData = async () => {
      try {
        const machineResponse = await fetch(`${BaseURL}devices/machine/`, { headers: getAuthHeaders() });
        if (!machineResponse.ok) {
          if (machineResponse.status === 401) {
            logout(navigate); 
          }
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
  }, [navigate]); 

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setErrorMessage('');
  };

  const handleMachineChange = (e) => {
    setSelectedMachine(e.target.value);
  };

  const searchHandler = async () => {
    if (!selectedDate || !selectedMachine) {
      setErrorMessage('Please select both the date and machine.');
      setTimeout(() => setErrorMessage(''), 6000);
      return;
    }

    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const machineId = selectedMachine;
      
      const response = await axios.post(`${BaseURL}data/hourly-shift-report/`, {
        date: formattedDate,
        machine_id: machineId,
      }, { headers: getAuthHeaders() });

      if (response.status === 401) {
        logout(navigate); // Handle invalid token
        return;
      }

      setData(response.data);
      setIsDataFetched(true); 
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setErrorMessage('Error fetching data. Please try again.');
      setTimeout(() => setErrorMessage(''), 6000);
    }
  };



  const generateShiftwisePDF = async () => {
    if (!selectedDate || !selectedMachine) {
      setErrorMessage('Please select both the date and machine to generate the PDF.');
      setTimeout(() => setErrorMessage(''), 6000);
      return;
    }

    if (!data || !isDataFetched) {
      alert('No data available to generate the PDF. Please perform the search first.');
      setTimeout(() => setErrorMessage(''), 6000);
      return;
    }

    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const machineId = selectedMachine; 
    
      const response = await axios.post(`${BaseURL}data/hourly-shift-report/`, {
        date: formattedDate,
        machine_id: machineId,
      }, { headers: getAuthHeaders() });

      if (response.status === 401) {
        logout(navigate); // Handle invalid token
        return;
      }

      console.log('API Response:', response.data); 

      const { shifts } = response.data;
  
      if (!Array.isArray(shifts) || shifts.length === 0) {
        throw new Error('No shifts found in the API response');
      }
  
      const doc = new jsPDF();
      let startY = 30; 
      const headerGap = 10;
      const pageWidth = doc.internal.pageSize.width;
  
      const addPageHeader = () => {
        doc.setFontSize(12);
        doc.text(`Machine ID: ${machineId}`, 14, 15);
        doc.text(`Date: ${formattedDate}`, pageWidth - 50, 15, { align: 'right' });
        doc.setFontSize(18);
        doc.text('Shiftwise Report', pageWidth / 2, 25, { align: 'center' });
        doc.setLineWidth(0.5);
        doc.line(14, 28, pageWidth - 14, 28); 
      };
  
      const addShiftTable = (shift) => {
        if (!shift.timing || typeof shift.timing !== 'object' || Object.keys(shift.timing).length === 0) {
          console.log(`Skipping Shift ${shift.shift_no}: No data available`);
          return; 
        }
  
        if (startY + 80 > doc.internal.pageSize.height) { 
          doc.addPage();
          startY = 30; 
          addPageHeader(); 
        }
  
        startY += headerGap;
  
        doc.setFontSize(16);
        doc.text(`Shift: ${shift.shift_no}`, 14, startY);
        startY += 10;
  
        const tableData = Object.entries(shift.timing).map(([timeRange, count]) => [
          timeRange, 
          count || 0,
          0
        ]);
  
        const totalProductionCount = Object.values(shift.timing).reduce((sum, count) => sum + (count || 0), 0);
  
        autoTable(doc, {
          head: [['Time Range', 'Production Count', 'Target']], 
          body: tableData,
          startY: startY,
          theme: 'grid',
          headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255] },
          styles: {
            cellPadding: 2, 
            fontSize: 7,   
            valign: 'middle',
            lineWidth: 0.5
          },
          columnStyles: { 0: { cellWidth: pageWidth / 3 - 14 }, 1: { cellWidth: pageWidth / 3 - 14 }, 2: { cellWidth: pageWidth / 3 - 14 } },
          margin: { top: 10 },
          didDrawPage: () => {
            addPageHeader();
          }
        });
  
        startY = doc.autoTable.previous.finalY + 10; 
  
        doc.setFontSize(14);
        doc.text(`Total Production Count: ${totalProductionCount}`, 14, startY);
        startY += 20;
      };
  
      addPageHeader(); 
  
      const validShifts = shifts.filter(shift => shift.shift_no !== 0 && shift.timing && Object.keys(shift.timing).length > 0);

      validShifts.forEach((shift) => {
        addShiftTable(shift);
      });
  
      doc.save('shiftwise_report.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error.message);
      setErrorMessage('Error generating PDF. Please select the machine.');
      setTimeout(() => setErrorMessage(''), 6000);
    }
  };

  const generateSummaryPDF = async () => {
    try {
      const formattedDate = format(selectedDate, 'yyyy-MM-dd');
      const currentDate = format(new Date(), 'yyyy-MM-dd');
  
      const response = await axios.post(`${BaseURL}data/production/`, {
        date: formattedDate
      }, { headers: getAuthHeaders() });
      if (response.status === 401) {
        logout(navigate); 
        return;
      }
  
      console.log('API Response:', response.data);
  
      const { machine_groups } = response.data;
  
      if (!Array.isArray(machine_groups) || machine_groups.length === 0) {
        throw new Error('No machine groups found in the API response');
      }
  
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.width;
  
      const addPageHeader = () => {
        doc.setFontSize(12);
        doc.text(`Date: ${formattedDate}`, 14, 15);
        doc.setFontSize(18);
        doc.text('Production Summary Report', pageWidth / 2, 15, { align: 'center' });
        doc.setLineWidth(0.5);
        doc.line(14, 22, pageWidth - 14, 22);
      };
  
      
      const shiftNames = new Set();
      machine_groups.forEach(group => {
        group.machines.forEach(machine => {
          machine.shifts.forEach(shift => {
            shiftNames.add(shift.shift_name || `Shift ${shift.shift_no}`);
          });
        });
      });
  
      
      const shiftNamesArray = Array.from(shiftNames).sort((a, b) => {
        const shiftNumberA = parseInt(a.replace(/\D/g, ''));
        const shiftNumberB = parseInt(b.replace(/\D/g, ''));
        return shiftNumberA - shiftNumberB;
      });
  
      const headers = ['Groups', 'Work Centre', ...shiftNamesArray, 'Production Count', 'Total Production Count'];
  
      const tableData = [];
      let grandTotalProductionCount = 0; 
  
      // Generate table data
      machine_groups.forEach(group => {
        group.machines.forEach((machine, index) => {
          const row = [];
          let groupTotalCount = 0;
  
          
          if (index === 0) {
            row.push({ content: group.group_name, styles: { fontStyle: 'bold' } });
          } else {
            row.push('');
          }
  
          
          row.push(machine.machine_id);
  
          let rowTotal = 0;
  
          
          shiftNamesArray.forEach(shiftName => {
            const shift = machine.shifts.find(s => s.shift_name === shiftName || `Shift ${s.shift_no}` === shiftName);
            const productionCountForShift = shift ? shift.production_count : 0;
            row.push(productionCountForShift);
            rowTotal += productionCountForShift; 
          });
  
         
          row.push(rowTotal);
  
         
          row.push(groupTotalCount);
  
          
          tableData.push(row);
  
        
          grandTotalProductionCount += rowTotal;
        });
      });
  
      
      const totalRow = new Array(headers.length).fill('');
      totalRow[0] = 'Total'; 
      totalRow[headers.length - 1] = grandTotalProductionCount; 
      tableData.push(totalRow);
  
      
      autoTable(doc, {
        head: [headers],
        body: tableData,
        startY: 30,
        theme: 'grid',
        headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255] },
        styles: { cellPadding: 1.5, fontSize: 6, valign: 'middle', lineWidth: 0.5 },
        columnStyles: { 0: { fontStyle: 'bold' } }, 
        margin: { top: 10 },
        didDrawPage: () => {
          addPageHeader();
        }
      });
  
      const fileName = `Production_Summary_Report_${currentDate}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error('Error generating PDF:', error.message);
      setErrorMessage('Error generating PDF. Please check the console for details.');
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
              <h4>Download</h4>
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
                        onClick={searchHandler}
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
      disabled={!selectedDate || !selectedMachine}
      onClick={generateShiftwisePDF}
      
    >
      Shiftwise Report
    </CButton>
  </CCol>
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
