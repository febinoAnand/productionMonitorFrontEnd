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

        const { date, machine_name, shifts } = response.data;

        const doc = new jsPDF({
            orientation: 'p', // Portrait mode
            unit: 'mm',
            format: 'a4' // A4 size paper
        });

        const pageWidth = doc.internal.pageSize.width;
        const margin = 10; // Margin from the edges
        const contentWidth = pageWidth - 2 * margin; // Width available for table
        const columnCount = 5; // Number of columns
        const columnWidth = contentWidth / columnCount; // Width of each column

        // Set up the PDF header
        doc.setFontSize(10);
        doc.text(`Machine Name: ${machine_name}`, margin, 10);
        doc.text(`Date: ${date}`, pageWidth - margin, 10, { align: 'right' });
        doc.setFontSize(14);
        doc.text('Shiftwise Report', pageWidth / 2, 20, { align: 'center' });
        doc.setLineWidth(0.5);
        doc.line(margin, 23, pageWidth - margin, 23);

        // Prepare the table data
        const tableData = [];
        const shiftTotals = new Map();
        const shiftLabels = new Map();

        shifts.forEach(shift => {
            const shiftLabel = `Shift ${shift.shift_no}`;
            let totalProduction = 0;
            let totalTarget = 0;

            Object.entries(shift.timing).forEach(([timeRange, [proCount, targetCount]]) => {
                totalProduction += proCount || 0;
                totalTarget += targetCount || 0;

                if (!shiftLabels.has(shiftLabel)) {
                    tableData.push([
                        shiftLabel,
                        timeRange,
                        proCount || 0,
                        targetCount || 0,
                        (proCount || 0) - (targetCount || 0)
                    ]);
                    shiftLabels.set(shiftLabel, tableData.length - 1); 
                } else {
                    tableData.push([
                        '',
                        timeRange,
                        proCount || 0,
                        targetCount || 0,
                        (proCount || 0) - (targetCount || 0)
                    ]);
                }
            });

            tableData.push([
                'Total', 
                '',
                totalProduction,
                totalTarget,
                totalProduction - totalTarget
            ]);

            shiftTotals.set(shiftLabel, tableData.length - 1); 
        });

        // Use autoTable to create the table in the PDF
        autoTable(doc, {
            head: [['Shift', 'Time Range', 'Production Count', 'Target Count', 'Differences']],
            body: tableData,
            startY: 30,
            theme: 'grid',
            headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255] },
            styles: {
                cellPadding: 1, // Reduced padding
                fontSize: 7, // Smaller font size
                valign: 'middle',
                lineWidth: 0.5
            },
            columnStyles: {
                0: { cellWidth: columnWidth }, // Adjust column width
                1: { cellWidth: columnWidth }, // Adjust column width
                2: { cellWidth: columnWidth }, // Adjust column width
                3: { cellWidth: columnWidth }, // Adjust column width
                4: { cellWidth: columnWidth }  // Adjust column width
            },
            tableWidth: contentWidth, // Set table width
            didDrawCell: function (data) {
                const shiftTotalIndex = shiftTotals.get(data.row.raw[0]);

                if (shiftTotalIndex !== undefined && data.row.index === shiftTotalIndex) {
                    doc.setFillColor(240, 240, 240); // Light gray background for total rows
                    doc.setTextColor(0, 0, 0); // Black text color
                    doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
                }
            }
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

    // Fetch production data from API
    const response = await axios.post(
      `${BaseURL}data/production/`,
      { date: formattedDate },
      { headers: getAuthHeaders() }
    );

    if (response.status === 401) {
      logout(navigate);
      return;
    }

    const { machine_groups } = response.data;

    if (!Array.isArray(machine_groups) || machine_groups.length === 0) {
      throw new Error('No machine groups found in the API response');
    }

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;

    // Function to add a header on each page
    const addPageHeader = () => {
      doc.setFontSize(12);
      doc.text(`Date: ${formattedDate}`, 14, 15);
      doc.setFontSize(18);
      doc.text('Summary Report', pageWidth / 2, 15, { align: 'center' });
    };

    // Collect unique shift names from data
    const shiftNames = new Set();
    machine_groups.forEach((group) => {
      group.machines.forEach((machine) => {
        machine.shifts.forEach((shift) => {
          shiftNames.add(shift.shift_name || `Shift ${shift.shift_no}`);
        });
      });
    });

    const shiftNamesArray = Array.from(shiftNames).sort((a, b) => {
      const shiftNumberA = parseInt(a.replace(/\D/g, ''));
      const shiftNumberB = parseInt(b.replace(/\D/g, ''));
      return shiftNumberA - shiftNumberB;
    });

    // Define table headers
    const headers = [
      { content: 'Group', styles: { halign: 'center', fillColor: [0, 123, 255], fontStyle: 'bold', textColor: [255, 255, 255] } },
      { content: 'Work Center', styles: { halign: 'center', fillColor: [0, 123, 255], fontStyle: 'bold', textColor: [255, 255, 255] } },
      ...shiftNamesArray.map(shift => ({
        content: shift,
        styles: { halign: 'center', fillColor: [0, 123, 255], fontStyle: 'bold', textColor: [255, 255, 255] }
      })),
      { content: 'Production Count', styles: { halign: 'center', fillColor: [0, 123, 255], fontStyle: 'bold', textColor: [255, 255, 255] } },
      { content: 'Total Production Count', styles: { halign: 'center', fillColor: [0, 123, 255], fontStyle: 'bold', textColor: [255, 255, 255] } }
    ];

    const tableData = [];

    // Prepare data for the table
    machine_groups.forEach((group) => {
      let groupTotalProduction = 0; // Initialize group total production

      group.machines.forEach((machine, index) => {
        const row = [];
        let rowTotalProduction = 0;

        // Add group name only for the first machine in the group
        if (index === 0) {
          row.push(group.group_name); // Group name
        } else {
          row.push(''); // Empty cell for other machines
        }

        // Insert machine name under 'Work Center'
        row.push(machine.machine_name);

        // Insert shift production counts for each shift
        shiftNamesArray.forEach((shiftName) => {
          const shift = machine.shifts.find(
            (s) => s.shift_name === shiftName || `Shift ${s.shift_no}` === shiftName
          );
          const productionCountForShift =
            shift && !isNaN(shift.total_shift_production_count)
              ? shift.total_shift_production_count
              : 0;
          row.push(productionCountForShift);
          rowTotalProduction += productionCountForShift;
        });

        // Insert total production count for the machine
        row.push(rowTotalProduction);

        // Update group total production count
        groupTotalProduction += rowTotalProduction;

        // Push the row to table data
        tableData.push(row);
      });

      // Add the 'Total Production Count' for the group in the last row of the group
      if (tableData.length > 0) {
        const lastRowOfGroup = tableData[tableData.length - 1];
        lastRowOfGroup.push(groupTotalProduction); // Add the group total production to the last row of the group
      }
    });

    // Generate table using autoTable plugin
    autoTable(doc, {
      head: [headers],
      body: tableData,
      startY: 30,
      theme: 'grid',
      headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255] },
      styles: {
        cellPadding: 2,
        fontSize: 7,
        valign: 'middle',
        lineWidth: 0.5,
        halign: 'center',
      },
      columnStyles: {
        0: { cellWidth: 30, fontStyle: 'bold' }, // Group column
        1: { cellWidth: 40 }, // Work Center column
        ...shiftNamesArray.reduce((styles, shiftName, index) => {
          styles[index + 2] = { cellWidth: 20 }; // Shift columns
          return styles;
        }, {}),
        [headers.length - 2]: { cellWidth: 30 }, // Production Count column
        [headers.length - 1]: { cellWidth: 30, fontStyle: 'bold' } // Total Production Count column (bold)
      },
      margin: { top: 20 },
      didDrawPage: (data) => {
        addPageHeader();
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      drawCell: (data) => {
        // Remove borders for 'Group' column and 'Total Production Count' column
        if (data.column.index === 0 || data.column.index === headers.length - 1) {
          data.cell.styles.lineWidth = 0; // Remove border
        }
      }
    });

    // Save the generated PDF
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
