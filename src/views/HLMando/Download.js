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
import { cilCalendar} from '@coreui/icons';
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

  const generateShiftwisePDF = async () => {
    
    try {
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        const machineId = selectedMachine;

        const response = await axios.post(`${BaseURL}data/hourly-shift-report/`, {
            date: formattedDate,
            machine_id: machineId,
        }, { headers: getAuthHeaders() });

        if (response.status === 401) {
            logout(navigate); 
            return;
        }

        const { date, machine_id,machine_name, shifts } = response.data;

        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.width;

        
        doc.setFontSize(12);
        doc.text(`Machine Name: ${machine_name}`, 14, 15);
        doc.text(`Date: ${date}`, pageWidth - 50, 15, { align: 'right' });
        doc.setFontSize(18);
        doc.text('Shiftwise Report', pageWidth / 2, 25, { align: 'center' });
        doc.setLineWidth(0.5);
        doc.line(14, 28, pageWidth - 14, 28);

        
const tableData = [];
const shiftMap = new Map();

shifts.forEach(shift => {
    const shiftLabel = `Shift ${shift.shift_no}`;
    const totalProduction = Object.values(shift.timing).reduce((sum, [proCount]) => sum + (proCount || 0), 0);
    const totalTarget = Object.values(shift.timing).reduce((sum, [, targetCount]) => sum + (targetCount || 0), 0);
    const timeRanges = Object.keys(shift.timing);
    const productionCounts = Object.values(shift.timing);

    timeRanges.forEach((timeRange, index) => {
        const [proCount, targetCount] = productionCounts[index];
        if (!shiftMap.has(shiftLabel)) {
            shiftMap.set(shiftLabel, []);
        }
        shiftMap.get(shiftLabel).push([
            timeRange,
            `${proCount || 0}/${targetCount || 0}`,
            (index === timeRanges.length - 1) ? `${totalProduction}/${totalTarget}` : ''
        ]);
    });
});


shiftMap.forEach((rows, shiftLabel) => {
    rows.forEach(([timeRange, proTargetCount, totalCount], index) => {
        tableData.push([
            index === 0 ? shiftLabel : '',
            timeRange,
            proTargetCount,
            totalCount
        ]);
    });
});


const totalProductionCount = tableData.reduce(([sumProCount, sumTargetCount], row) => {
    const [proCount, targetCount] = row[2].split('/').map(Number);
    return [sumProCount + (proCount || 0), sumTargetCount + (targetCount || 0)];
}, [0, 0]);


tableData.push(['TOTAL', '', '', `${totalProductionCount[0]}/${totalProductionCount[1]}`]);


      
        autoTable(doc, {
          head: [['Shift', 'Time Range', 'Production Count ', 'Total Production Count']],
          body: tableData,
          startY: 40,
          theme: 'grid',
          headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255] },
          styles: {
              cellPadding: 4,
              fontSize: 10,
              valign: 'middle',
              lineWidth: 0.5,
              cellWidth: 'auto'
          },
          columnStyles: {
              0: { cellWidth: (pageWidth - 40) / 4 },
              1: { cellWidth: (pageWidth - 40) / 4 },
              2: { cellWidth: (pageWidth - 40) / 4 },
              3: { cellWidth: (pageWidth - 40) / 4 }
          },
      });

        
        const currentDate = format(new Date(), 'yyyy-MM-dd');
        doc.save(`shiftwise_report_${currentDate}.pdf`);
    } catch (error) {
        console.error('Error generating PDF:', error.message);
        setErrorMessage('Error generating PDF.');
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

    const headers = ['Groups', 'Work Centre', ...shiftNamesArray, 'Production Count', 'Target Count'];

    const tableData = [];
    let grandTotalProductionCount = 0;
    let grandTotalTargetCount = 0;

    machine_groups.forEach(group => {
      let groupTotalCount = 0;
      let groupTotalTarget = 0;

      group.machines.forEach((machine, index) => {
        const row = [];
        let rowTotalProduction = 0;
        let rowTotalTarget = 0;

        if (index === 0) {
          row.push({ content: group.group_name, styles: { fontStyle: 'bold' } });
        } else {
          row.push('');
        }

        row.push(machine.machine_name);

        shiftNamesArray.forEach(shiftName => {
          const shift = machine.shifts.find(s => s.shift_name === shiftName || `Shift ${s.shift_no}` === shiftName);
          const productionCountForShift = shift && !isNaN(shift.total_shift_production_count) ? shift.total_shift_production_count : 0;
          const targetCountForShift = shift && !isNaN(shift.target_count) ? shift.target_count : 0;
          row.push(`${productionCountForShift}/${targetCountForShift}`);
          rowTotalProduction += productionCountForShift;
          rowTotalTarget += targetCountForShift;
        });

        row.push(`${rowTotalProduction}/${rowTotalTarget}`);
        groupTotalCount += rowTotalProduction;
        groupTotalTarget += rowTotalTarget;

        tableData.push(row);

        grandTotalProductionCount += rowTotalProduction;
        grandTotalTargetCount += rowTotalTarget;
      });

      // Group total row with fractions
      tableData[tableData.length - 1].push(`${groupTotalCount}/${groupTotalTarget}`);
    });

    
    const totalRow = new Array(headers.length).fill('');
    totalRow[0] = 'Total';
    totalRow[headers.length - 2] = `${grandTotalProductionCount}/${grandTotalTargetCount}`;
    totalRow[headers.length - 1] = `${grandTotalProductionCount}/${grandTotalTargetCount}`;
    tableData.push(totalRow);

    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255] },
      styles: { 
        cellPadding: 1, 
        fontSize: 5, 
        valign: 'middle', 
        lineWidth: 0.5 
      },
      columnStyles: {
        0: { fontStyle: 'bold', fillColor: [240, 240, 240] }, 
        1: { fontStyle: 'italic' }, 
        ...shiftNamesArray.reduce((styles, shiftName, index) => {
          styles[index + 2] = { columnWidth: 'auto' };
          return styles;
        }, {})
      },
      margin: { top: 10 },
      didDrawPage: (data) => {
        if (data.pageCount === 1) {
          addPageHeader(); 
        }
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245] 
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
