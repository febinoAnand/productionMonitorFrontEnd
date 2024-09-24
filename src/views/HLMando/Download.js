import React, { useState, useEffect, forwardRef } from 'react';
import {
  CCol,
  CRow,
  CFormInput,
  CInputGroup,
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CFormSelect,
} from '@coreui/react';
import DatePicker from 'react-datepicker';
import ExcelJS from 'exceljs';
import 'react-datepicker/dist/react-datepicker.css';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import CIcon from '@coreui/icons-react';
import { cilCalendar } from '@coreui/icons';
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

const Download = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedMachine, setSelectedMachine] = useState('');
  const [machineOptions, setMachineOptions] = useState([]);
  const [selectedFileFormat, setSelectedFileFormat] = useState('');
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

  const handleFileFormatChange = (e) => {
    setSelectedFileFormat(e.target.value);
  };

  const showErrorMessage = (message) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(''), 6000);
  };

  const generateShiftwisePDF = async () => {
    if (!selectedFileFormat) {
        showErrorMessage('Please select a file format.');
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
            logout(navigate);
            return;
        }

        const { date, machine_name, shifts } = response.data;

        if (selectedFileFormat === 'pdf') {
            const doc = new jsPDF({
                orientation: 'p',
                unit: 'mm',
                format: 'a4'
            });

            const pageWidth = doc.internal.pageSize.width;
            const margin = 10;
            const contentWidth = pageWidth - 2 * margin;
            const columnCount = 5;
            const columnWidth = contentWidth / columnCount;

            doc.setFontSize(14);
            doc.setFont("helvetica", "bold");
            doc.text(`Shiftwise Report`, pageWidth / 2, 20, { align: 'center' });
            doc.setFontSize(10);
            doc.setFont("helvetica", "normal");
            doc.text(`Machine Name: ${machine_name}`, margin, 10);
            doc.text(`Date: ${date}`, pageWidth - margin, 10, { align: 'right' });
            doc.setLineWidth(0.5);
            doc.line(margin, 25, pageWidth - margin, 25);

            if (shifts.length === 0) {
                doc.setFontSize(10);
                doc.text('No shift data available.', pageWidth / 2, 30, { align: 'center' });
            } else {
                const tableData = [];

                shifts.forEach(shift => {
                    const shiftLabel = `Shift ${shift.shift_no}`;
                    let totalProduction = 0;
                    let totalTarget = 0;
                    let firstRow = true;

                    Object.entries(shift.timing).forEach(([timeRange, [proCount, targetCount]]) => {
                        const production = proCount || 0;
                        const target = targetCount || 0;

                        totalProduction += production;
                        totalTarget += target;

                        tableData.push([
                            firstRow ? shiftLabel : '',
                            timeRange,
                            production,
                            target,
                            production - target
                        ]);

                        firstRow = false;
                    });

                    if (totalProduction !== 0 || totalTarget !== 0) {
                        tableData.push([
                            'Total',
                            '',
                            totalProduction,
                            totalTarget,
                            totalProduction - totalTarget
                        ]);
                    }
                });

                autoTable(doc, {
                    head: [['Shift', 'Time Range', 'Production Count', 'Target Count', 'Differences']],
                    body: tableData,
                    startY: 30,
                    theme: 'plain',
                    headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255], fontSize: 8 },
                    styles: {
                        cellPadding: 2,
                        fontSize: 7,
                        valign: 'middle',
                        lineWidth: 0.5,
                        textColor: [0, 0, 0]
                    },
                    columnStyles: {
                        0: { cellWidth: columnWidth, halign: 'center', lineWidth: 0.5 },
                        1: { cellWidth: columnWidth, halign: 'center', lineWidth: 0.5 },
                        2: { cellWidth: columnWidth, halign: 'center', lineWidth: 0.5 },
                        3: { cellWidth: columnWidth, halign: 'center', lineWidth: 0.5 },
                        4: { cellWidth: columnWidth, halign: 'center', lineWidth: 0.5 }
                    },
                    tableWidth: contentWidth,
                    didParseCell: function (data) {
                        if (data.row.raw[0] === 'Total') {
                            data.cell.styles.fillColor = [240, 240, 240];
                            data.cell.styles.textColor = [0, 0, 0];
                            data.cell.styles.fontStyle = 'bold';
                        } else if (data.row.raw[0] !== '' && data.row.index > 0) {
                            data.cell.styles.lineWidth = 0.5;
                        } else {
                            data.cell.styles.lineTopWidth = 0;
                            data.cell.styles.lineBottomWidth = 0;
                        }
                    }
                });
            }

            doc.setFontSize(8);
            doc.setFont("helvetica", "normal");
            doc.text(`Generated on: ${format(new Date(), 'yyyy-MM-dd')}`, margin, doc.internal.pageSize.height - 10);

            doc.save(`shiftwise_report (${formattedDate}).pdf`);
          }else if (selectedFileFormat === 'excel') {
            const excelHeaders = ['Shift', 'Time Range', 'Production Count', 'Target Count', 'Differences'];
            const excelData = [];
        
            shifts.forEach(shift => {
                const shiftLabel = `Shift ${shift.shift_no}`;
                let totalProduction = 0;
                let totalTarget = 0;
                let firstRow = true;
        
                Object.entries(shift.timing).forEach(([timeRange, [proCount, targetCount]]) => {
                    const production = proCount || 0;
                    const target = targetCount || 0;
        
                    totalProduction += production;
                    totalTarget += target;
        
                    excelData.push([
                        firstRow ? shiftLabel : '',
                        timeRange,
                        production,
                        target,
                        production - target
                    ]);
        
                    firstRow = false;
                });
        
               
                if (totalProduction !== 0 || totalTarget !== 0) {
                    excelData.push([
                        'Total',
                        '',
                        totalProduction,
                        totalTarget,
                        totalProduction - totalTarget
                    ]);
                }
            });
        
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Report');
        
            
            const titleRow = worksheet.addRow(['Shiftwise Production Report']);
            titleRow.font = { size: 16, bold: true };
            titleRow.alignment = { horizontal: 'center' };
            
            
            worksheet.mergeCells('A1:E1');
            
            titleRow.getCell(1).fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF4CAF50' } 
            };
            titleRow.getCell(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 14 };
        
            
            const headerRow = worksheet.addRow(excelHeaders);
            headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
            
            
            worksheet.getCell('A2').fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FF007BFF' } 
            };
            worksheet.getCell('B2').fill = worksheet.getCell('A2').fill;
            worksheet.getCell('C2').fill = worksheet.getCell('A2').fill;
            worksheet.getCell('D2').fill = worksheet.getCell('A2').fill;
            worksheet.getCell('E2').fill = worksheet.getCell('A2').fill;
        
            headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
            headerRow.height = 20; 
        
            
            worksheet.getRow(2).commit();
        
            excelData.forEach(rowData => {
                const row = worksheet.addRow(rowData);
        
                
                row.getCell(3).numFmt = '#,##0';
                row.getCell(4).numFmt = '#,##0';
                row.getCell(5).numFmt = '#,##0';
        
                
                row.alignment = {
                    horizontal: (index) => index >= 3 ? 'right' : 'center',
                    vertical: 'middle'
                };
        
                
                if (row.getCell(1).value === 'Total') {
                    row.font = { bold: true, color: { argb: 'FFFFFFFF' } }; 
                    row.getCell('A').fill = {
                        type: 'pattern',
                        pattern: 'solid',
                        fgColor: { argb: 'FF607D8B' } 
                    };
                    row.getCell('B').fill = row.getCell('A').fill;
                    row.getCell('C').fill = row.getCell('A').fill;
                    row.getCell('D').fill = row.getCell('A').fill;
                    row.getCell('E').fill = row.getCell('A').fill;
                }
            });
        
            
            worksheet.eachRow((row) => {
                for (let col = 1; col <= 5; col++) { 
                    const cell = row.getCell(col);
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' },
                    };
                }
            });
        
           
            worksheet.columns = [
                { width: 12 }, 
                { width: 25 }, 
                { width: 20 }, 
                { width: 20 }, 
                { width: 20 }, 
            ];
        
            worksheet.views = [{ state: 'frozen', ySplit: 2 }];
        
            workbook.xlsx.writeBuffer().then((buffer) => {
                const blob = new Blob([buffer], { type: 'application/octet-stream' });
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `shiftwise_report (${formattedDate}).xlsx`;
                link.click();
            });
        }
      } catch (error) {
        console.error('Error generating report:', error.message);
        showErrorMessage('Failed to generate report. Please try again later.');
    }
};




const generateSummaryPDF = async () => {
  if (!selectedFileFormat) {
    showErrorMessage('Please select a file format.');
    return;
  }
  try {
    const formattedDate = format(selectedDate, 'yyyy-MM-dd');
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


    const addPageHeader = () => {
      doc.setFontSize(12);
      doc.text(`Date: ${formattedDate}`, 14, 15);
      doc.setFontSize(18);
      doc.text('Summary Report', pageWidth / 2, 15, { align: 'center' });
    };
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

  
  machine_groups.forEach((group) => {
    let groupTotalProduction = 0; 

    group.machines.forEach((machine, index) => {
      const row = [];
      let rowTotalProduction = 0;

      
      if (index === 0) {
        row.push(group.group_name);
      } else {
        row.push(''); 
      }

    
      row.push(machine.machine_name);

    
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

      
      row.push(rowTotalProduction);

      
      groupTotalProduction += rowTotalProduction;

      
      tableData.push(row);
    });

    
    if (tableData.length > 0) {
      const lastRowOfGroup = tableData[tableData.length - 1];
      lastRowOfGroup.push(groupTotalProduction);
    }
  });

    if (selectedFileFormat === 'pdf') {
      addPageHeader();

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
          0: { cellWidth: 30, fontStyle: 'bold' }, 
          1: { cellWidth: 40 },
          ...shiftNamesArray.reduce((styles, shiftName, index) => {
            styles[index + 2] = { cellWidth: 20 }; 
            return styles;
          }, {}),
          [headers.length - 2]: { cellWidth: 30 }, 
          [headers.length - 1]: { cellWidth: 30, fontStyle: 'bold' } 
        },
        margin: { top: 20 },
        didDrawPage: (data) => {
          addPageHeader();
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        drawCell: (data) => {
          
          if (data.column.index === 0 || data.column.index === headers.length - 1) {
            data.cell.styles.lineWidth = 0; 
          }
        }
      });

      doc.save(`Production_Summary_Report (${formattedDate}).pdf`);
    }else if (selectedFileFormat === 'excel') {
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Production Summary Report');
  
      // Title of the report
      const titleRow = worksheet.addRow(['Production Summary Report']);
      worksheet.mergeCells('A1:G1'); 
      titleRow.font = { name: 'Arial', size: 18, bold: true, color: { argb: 'FFFFFFFF' } }; // White text
      titleRow.alignment = { horizontal: 'center', vertical: 'middle' };
      titleRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF4F81BD' } // Corporate blue color
      };
      titleRow.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
      };
  
      const headerRow = worksheet.addRow(headers.map(header => header.content));
      headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
      headerRow.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: 'FF007BFF' } 
      };
      headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
  
      // Header row border
      headerRow.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' }
      };

      worksheet.views = [{ state: 'frozen', ySplit: 2 }];
  
      tableData.forEach((row, rowIndex) => {
          const dataRow = worksheet.addRow(row);
  
          dataRow.eachCell({ includeEmpty: true }, (cell) => {
              cell.border = {
                  top: { style: 'thin' },
                  left: { style: 'thin' },
                  bottom: { style: 'thin' },
                  right: { style: 'thin' } 
              };
              if (rowIndex % 2 === 0) {
                  cell.fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'FFEFEFEF' } 
                  };
              } else {
                  cell.fill = {
                      type: 'pattern',
                      pattern: 'solid',
                      fgColor: { argb: 'FFFFFFFF' }
                  };
              }
          });
          const totalProductionCountCell = dataRow.getCell('G');
          totalProductionCountCell.border = {
              top: { style: 'thin' },
              left: { style: 'thin' },
              bottom: { style: 'thin' },
              right: { style: 'thin' }
          };
      });
      worksheet.columns.forEach((column) => {
          let maxLength = 0;
          column.eachCell({ includeEmpty: true }, (cell) => {
              const columnText = cell.value ? cell.value.toString() : '';
              maxLength = Math.max(maxLength, columnText.length);
          });
          column.width = maxLength < 20 ? 20 : maxLength + 2; // Dynamic width
      });
  
      workbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer], { type: 'application/octet-stream' });
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = `Production_Summary_Report (${formattedDate}).xlsx`;
          link.click();
          URL.revokeObjectURL(link.href);
      }).catch(err => {
          console.error("Error generating report:", err);
      });
  }
  
  
  
  
} catch (error) {
    console.error('Error generating report:', error.message);
    showErrorMessage('Error generating report. Please check the console for details.');
  }
}
  
  
  const today = new Date();

  return (
    <div className="page">
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
      <CCol xs={12}>
        <CCard>
          <CCardHeader>
            <h4>Download</h4>
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md={3} className="text-end">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <CInputGroup>
                    <DatePicker
                      selected={selectedDate}
                      onChange={handleDateChange}
                      customInput={<CustomInput />}
                      dateFormat="dd/MM/yyyy"
                      popperPlacement="bottom-end"
                      maxDate={today}
                    />
                  </CInputGroup>
                </div>
              </CCol>
              <CCol md={4}>
                <CFormSelect
                  id="machine"
                  name="machine"
                  value={selectedMachine}
                  onChange={handleMachineChange}
                >
                  <option value="">Select Machine</option>
                  {machineOptions.map(option => (
                    <option key={option.id} value={option.id}>
                      {option.name}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              <CCol md={4}>
                <CFormSelect
                  id="fileFormat"
                  name="fileFormat"
                  value={selectedFileFormat}
                  onChange={handleFileFormatChange}
                >
                  <option value="">Select Format</option>
                  <option value="pdf">PDF</option>
                  <option value="excel">Excel</option>
                </CFormSelect>
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
    </div>
  );
};

export default Download;