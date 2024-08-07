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
      
        const response = await axios.get(`${BaseURL}data/production-monitor/`, { headers: getAuthHeaders() });
        const { shift_wise_data } = response.data;

        const doc = new jsPDF();
        let grandTotal = 0;
        let startY = 35; 
        const headerGap = 10; 

      
        const currentDate = new Date().toLocaleDateString();


        const addPageHeader = () => {
            doc.setFontSize(18);
            doc.text('Summary Report', doc.internal.pageSize.width / 2, 15, { align: 'center' });
            doc.setFontSize(10);
            doc.text(`Date: ${currentDate}`, doc.internal.pageSize.width - 40, 20); // Date on the top-right corner
            doc.setLineWidth(0.5);
            doc.line(14, 25, doc.internal.pageSize.width - 14, 25); // Line under the header
        };

        
        const addGroupTable = (group) => {
            if (startY + 60 > doc.internal.pageSize.height) { 
                doc.addPage();
                startY = 35; 
                addPageHeader(); 
            }

            
            startY += headerGap;

            doc.setFontSize(16);
            doc.text(`Group: ${group.group_name}`, 14, startY);
            startY += 10;

            
            const tableData = group.machines.map(machine => [
                machine.machine_name,
                machine.production_count, 
                machine.production_count, 
                machine.production_count, 
                machine.production_count+machine.target_production 
            ]);

            
            const groupTotal = group.machines.reduce((sum, machine) => sum + machine.production_count+machine.target_production , 0);
            tableData.push([
                'Total',
                tableData.reduce((sum, row) => sum + row[1], 0),
                tableData.reduce((sum, row) => sum + row[2], 0),
                tableData.reduce((sum, row) => sum + row[3], 0),
                groupTotal
            ]);

            
            autoTable(doc, {
                head: [['WORK CENTER', 'Shift 1', 'Shift 2', 'Shift 3', 'Total']],
                body: tableData,
                startY: startY,
                theme: 'grid',
                headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255] },
                styles: { cellPadding: 5, fontSize: 10, valign: 'middle', lineWidth: 0.5 },
                columnStyles: { 
                    0: { cellWidth: 50 }, 
                    1: { cellWidth: 30 }, 
                    2: { cellWidth: 30 }, 
                    3: { cellWidth: 30 }, 
                    4: { cellWidth: 50, fontStyle: 'bold', textColor: [0, 0, 0] } 
                },
                margin: { top: 10 },
                didDrawPage: () => {
                    addPageHeader(); 
                }
            });

            startY = doc.autoTable.previous.finalY + 20; 
        };

        addPageHeader(); 

        
        const processedGroupIds = new Set();

        shift_wise_data.forEach((shift) => {
            shift.groups.forEach((group) => {
                if (!processedGroupIds.has(group.group_id)) {
                    addGroupTable(group);
                    processedGroupIds.add(group.group_id);

                  
                    grandTotal += group.machines.reduce((sum, machine) => sum + machine.production_count, 0);
                }
            });
        });

  
        doc.setFontSize(14);
        doc.text(`Grand Total Production Across All Groups: ${grandTotal}`, 14, startY);

  
        doc.save('summary_report.pdf');
    } catch (error) {
        console.error('Error generating PDF:', error);
        setErrorMessage('Error generating PDF. Please try again.');
    }
};





const generateShiftwisePDF = async () => {
  try {
      
      const response = await axios.get(`${BaseURL}data/production-monitor/`, { headers: getAuthHeaders() });
      const { shift_wise_data } = response.data;

      const doc = new jsPDF();
      let startY = 30; 
      const headerGap = 15; 

      const addPageHeader = () => {
          doc.setFontSize(18);
          doc.text('Shiftwise Report', doc.internal.pageSize.width / 2, 15, { align: 'center' });
          doc.setLineWidth(0.5);
          doc.line(14, 18, doc.internal.pageSize.width - 14, 18); 
      };

      const addShiftTable = (shift) => {
          if (startY + 60 > doc.internal.pageSize.height) { 
              doc.addPage();
              startY = 30; 
              addPageHeader(); 
          }

          
          startY += headerGap;

          doc.setFontSize(16);
          doc.text(`Shift: ${shift.shift_number}`, 14, startY);
          startY += 10;

         
          const tableData = shift.groups.flatMap(group => 
              group.machines.map(machine => [
                  '', 
                  machine.production_count,
                  machine.production_count 
              ])
          );

          
          autoTable(doc, {
              head: [['Time', 'Production Count Actual']],
              body: tableData,
              startY: startY,
              theme: 'grid',
              headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255] },
              styles: { cellPadding: 5, fontSize: 10, valign: 'middle', lineWidth: 0.5 },
              columnStyles: { 0: { cellWidth: 60 }, 1: { cellWidth: 60 }, 2: { cellWidth: 60 } },
              margin: { top: 10 },
              didDrawPage: () => {
                  addPageHeader();
              }
          });

          startY = doc.autoTable.previous.finalY + 20; 
      };

      addPageHeader(); 

      shift_wise_data
          .filter(shift => shift.shift_number !== 0)
          .forEach((shift) => {
              addShiftTable(shift);
          });

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
