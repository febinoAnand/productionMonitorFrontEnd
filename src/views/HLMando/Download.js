import React, { useState, useEffect, forwardRef, useRef } from 'react';
import {
  CCol,
  CRow,
  CFormInput,
  CInputGroup,
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CCollapse,
  CFormCheck,
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
import LoadingSpinner from './Loadingspinner';



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
      style={{ height: '38px', borderRadius: '0px', backgroundColor: '#047BC4', borderColor: '#047BC4' }}
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
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedFileFormat, setSelectedFileFormat] = useState('');
  const [selectedReportType, setSelectedReportType] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(true); 
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); 
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
      } finally {
        setLoading(false); 
      }
    };

    fetchData();
  }, [navigate]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setErrorMessage('');
  };

  const handleMachineChange = (machineId) => {
    setSelectedMachine(prevSelected => {
      if (prevSelected.includes(machineId)) {
        return prevSelected.filter(id => id !== machineId);
      } else {
        return [...prevSelected, machineId];
      }
    });
  };


  const handleFileFormatChange = (e) => {
    const { id, checked } = e.target;
    if (checked) {
      setSelectedFileFormat(id);
    } else {
      setSelectedFileFormat(null);
    }
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

      const response = await axios.post(`${BaseURL}data/hourly-shift-report-select-machine/`, {
          date: formattedDate,
          machine_id: machineId,
      }, { headers: getAuthHeaders() });

      if (response.status === 401) {
          logout(navigate);
          return;
      }

      const { date, machine_data } = response.data;

      if (selectedFileFormat === 'pdf') {
        const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
        const pageWidth = doc.internal.pageSize.width;
        const margin = 10;
        let pageNumber = 1;
        let isFirstPage = true;

        doc.setFontSize(14).setFont("helvetica", "bold").text(`Shiftwise Report`, pageWidth / 2, 15, { align: 'center' });
        doc.setFontSize(10).setFont("helvetica", "normal");
        doc.text(`Date: ${date}`, pageWidth - margin, 25, { align: 'right' });
        doc.setLineWidth(0.5).line(margin, 30, pageWidth - margin, 30);
    
        Object.entries(machine_data).forEach(([machineId, shifts], index) => {
            if (!isFirstPage) {
                doc.addPage();
            }
            isFirstPage = false;
    
            const machineName = shifts[0][2];

            doc.setFontSize(12).text(`Machine: ${machineName} (${machineId})`, margin, 25); 
    
            const excelHeaders = ['Si.No', 'Shift', 'Date', 'Time', 'Line', 'Production Count', 'Target Count', 'Differences'];
            const tableData = [];
            let shiftSerialNumber = 0;
            let totalProduction = 0;
            let totalTarget = 0;
    
            shifts.forEach((shift, shiftIndex) => {
                shiftSerialNumber++;
                const production = shift[4];
                const target = shift[5];
    
                tableData.push([
                    shiftSerialNumber,
                    `Shift ${shift[0]}`,
                    shift[1],
                    shift[3],
                    machineName,
                    production,
                    target,
                    production - target
                ]);
    
                totalProduction += production;
                totalTarget += target;
    
                const isLastRow = shiftIndex === shifts.length - 1;
                const isNextShiftDifferent = isLastRow || shifts[shiftIndex + 1][0] !== shift[0];
    
                if (isNextShiftDifferent) {
                    tableData.push(['Total', '', '', '', '', totalProduction, totalTarget, totalProduction - totalTarget]);
    
                    totalProduction = 0;
                    totalTarget = 0;
                }
            });
    
            autoTable(doc, {
                head: [excelHeaders],
                body: tableData,
                startY: isFirstPage ? 40 : 35,
                theme: 'plain',
                headStyles: { fillColor: [0, 123, 255], textColor: [255, 255, 255], fontSize: 8 },
                styles: { cellPadding: 2, fontSize: 7, valign: 'middle', textColor: [0, 0, 0] },
                columnStyles: { 0: { halign: 'center' }, 7: { halign: 'center' } },
                didParseCell: data => {
                    if (data.row.raw[0] === 'Total') {
                        data.cell.styles.fillColor = [240, 240, 240];
                        data.cell.styles.fontStyle = 'bold';
                    }
                }
            });

            doc.setFontSize(8).text(`${pageNumber}`, pageWidth / 2, doc.internal.pageSize.height - 10, { align: 'center' });
            pageNumber++;
        });
    
        doc.save(`shiftwise_report (${formattedDate}).pdf`);
      }else if (selectedFileFormat === 'excel') {
          const excelHeaders = ['Si.No', 'Shift', 'Date', 'Time', 'Line', 'Production Count', 'Target Count', 'Differences'];
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('Report');
      
          let rowIndex = 1;
      
          Object.entries(machine_data).forEach(([machineId, shifts]) => {
              if (!shifts.length) return;
      
              let totalProduction = 0;
              let totalTarget = 0;
              let shiftSerialNumber = 1;
      
              const machineName = shifts[0][2];
      
              const totalColumns = 8;
              const lastColumnLetter = String.fromCharCode(65 + totalColumns - 1);
      
              const machineHeaderRow = worksheet.addRow([
                  `Machine: ${machineName} (${machineId})`,
                  ...new Array(totalColumns - 1).fill('')
              ]);
              const headerRowIndex = machineHeaderRow.number;
              worksheet.mergeCells(`A${headerRowIndex}:${lastColumnLetter}${headerRowIndex}`);
              machineHeaderRow.font = { size: 14, bold: true, color: { argb: 'FFFFFFFF' } };
              machineHeaderRow.alignment = { horizontal: 'center', vertical: 'middle' };
              machineHeaderRow.eachCell((cell, colNumber) => {
                  if (colNumber <= totalColumns) {
                      cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF4CAF50' } };
                  }
              });
      
              rowIndex++;
      
              const headerRow = worksheet.addRow(excelHeaders);
              headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
              headerRow.alignment = { horizontal: 'center', vertical: 'middle' };
              headerRow.eachCell(cell => {
                  cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF007BFF' } };
              });
      
              rowIndex++;
      
              let previousShiftNo = null;
      
              shifts.forEach((shift, shiftIndex) => {
                  const shiftNo = shift[0];
                  const shiftDate = shift[1];
                  const shiftTime = shift[3];
                  const production = shift[4] || 0;
                  const target = shift[5] || 0;
      
                  totalProduction += production;
                  totalTarget += target;
      
                  if (shiftNo !== previousShiftNo) {
                      const shiftTitleRow = worksheet.addRow([
                          `Shift-${shiftNo} : ${shiftDate}`,
                          ...new Array(totalColumns - 1).fill('')
                      ]);
                      const shiftTitleRowIndex = shiftTitleRow.number;
                      worksheet.mergeCells(`A${shiftTitleRowIndex}:${lastColumnLetter}${shiftTitleRowIndex}`);
                      shiftTitleRow.font = { size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
                      shiftTitleRow.alignment = { horizontal: 'center', vertical: 'middle' };
                      shiftTitleRow.eachCell((cell, colNumber) => {
                          if (colNumber <= totalColumns) {
                              cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF9C27B0' } };
                          }
                      });
      
                      rowIndex++;
                      previousShiftNo = shiftNo;
                  }
      
                  worksheet.addRow([
                      shiftSerialNumber++,
                      `Shift ${shiftNo}`,
                      shiftDate,
                      shiftTime,
                      machineName,
                      production,
                      target,
                      production - target
                  ]).eachCell(cell => {
                      cell.alignment = { horizontal: 'center', vertical: 'middle' };
                  });
      
                  const isLastRow = shiftIndex === shifts.length - 1;
                  const isNextShiftDifferent = isLastRow || shifts[shiftIndex + 1][0] !== shiftNo;
      
                  if (isNextShiftDifferent) {
                      const totalRow = worksheet.addRow(['Total', '', '', '', '', totalProduction, totalTarget, totalProduction - totalTarget]);
                      totalRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
                      totalRow.alignment = { horizontal: 'center', vertical: 'middle' };
                      totalRow.eachCell(cell => {
                          cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF607D8B' } }; // Dark gray shade
                      });
      
                      rowIndex++;
                      totalProduction = 0;
                      totalTarget = 0;
                  }
              });
      
              rowIndex++;
          });
      
          worksheet.eachRow(row => {
              row.eachCell(cell => {
                  cell.border = {
                      top: { style: 'thin' },
                      left: { style: 'thin' },
                      bottom: { style: 'thin' },
                      right: { style: 'thin' },
                  };
              });
          });
      
          worksheet.columns = [
              { width: 8 },
              { width: 12 },
              { width: 15 },
              { width: 20 },
              { width: 20 },
              { width: 15 },
              { width: 15 },
              { width: 15 },
          ];
      
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

const toggleDropdown = () => {
  setDropdownOpen(!dropdownOpen);
};

useEffect(() => {
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };
  document.addEventListener('mousedown', handleClickOutside);
  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
  };
}, []);

const handleSearchChange = (e) => {
  setSearchQuery(e.target.value);
};

const filteredMachines = machineOptions.filter((machine) =>
  machine.name.toLowerCase().includes(searchQuery.toLowerCase())
);

const handleSelectAll = (e) => {
  setSelectAll(e.target.checked);
  setSelectedMachine(e.target.checked ? machineOptions.map((machine) => machine.id) : []);
};

const handleDownload = () => {
  if (selectedReportType === 'shiftwise') {
    generateShiftwisePDF();
  } else if (selectedReportType === 'summary') {
    generateSummaryPDF();
  }
};
  
if (loading) {
  return <LoadingSpinner />; 
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
              <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <CInputGroup style={{ marginRight: '8px' }}>
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

            <CCol md={3}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                <CButton
                  onClick={toggleDropdown}
                  color="white"
                  style={{
                    width: '100%',
                    border: '0.5px solid rgb(197, 197, 197)',
                    borderRadius: '5px',
                    marginBottom: '10px',
                  }}
                  disabled={selectedReportType === 'summary'}
                >
                  Select Machines
                </CButton>
              </div>

              <CCollapse visible={dropdownOpen}>
                <div
                  ref={dropdownRef}
                  style={{
                    position: 'absolute',
                    width: '22.5%',
                    maxHeight: dropdownOpen ? '360px' : '0',
                    overflowY: 'scroll',
                    backgroundColor: '#f7f7f7',
                    border: '0.5px solid rgb(197, 197, 197)',
                    padding: dropdownOpen ? '10px' : '0',
                    borderRadius: '5px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    zIndex: 1000,
                  }}
                >
                  <div style={{ marginBottom: '10px' }}>
                    <CFormInput
                      type="text"
                      placeholder="Search Machines"
                      value={searchQuery}
                      onChange={handleSearchChange}
                      style={{ marginBottom: '10px' }}
                    />
                  </div>
                  <div>
                    <CFormCheck id="selectAll" label="Select All" checked={selectAll} onChange={handleSelectAll} />
                  </div>
                  <hr style={{ margin: '10px 0', borderTop: '1px solid rgb(102, 102, 102)' }} />
                  {filteredMachines.map((machine) => (
                    <CFormCheck
                      key={machine.id}
                      id={machine.id}
                      label={machine.name}
                      checked={selectedMachine.includes(machine.id)}
                      onChange={() => handleMachineChange(machine.id)}
                    />
                  ))}
                </div>
              </CCollapse>

              {selectedMachine.length > 0 && (
                <div>
                  <strong>Selected Machines:</strong>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(5, minmax(120px, 1fr))',
                      gap: '10px',
                      marginTop: '10px',
                    }}
                  >
                    {selectedMachine.map((id) => {
                      const machine = filteredMachines?.find((m) => m.id === id);
                      return machine ? (
                        <div
                          key={id}
                          style={{
                            padding: '5px',
                            backgroundColor: '#f7f7f7',
                            border: '0.5px solid rgb(197, 197, 197)',
                            borderRadius: '5px',
                            textAlign: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {machine.name}
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </CCol>
            <CCol md={3}>
            <div
                  style={{
                    border: '0.5px solid rgb(197, 197, 197)',
                    borderRadius: '5px',
                    padding: '3px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '8px',
                    width: '105%'
                  }}
                >
                  <CFormCheck
                    type="radio"
                    id="shiftwise"
                    name="reportType"
                    label="Shiftwise"
                    checked={selectedReportType === 'shiftwise'}
                    onChange={() => setSelectedReportType('shiftwise')}
                  />
                  <div style={{ width: '1px', height: '30px', backgroundColor: 'rgb(197, 197, 197)' }} />
                  <CFormCheck
                    type="radio"
                    id="summary"
                    name="reportType"
                    label="Summary"
                    checked={selectedReportType === 'summary'}
                    onChange={() => setSelectedReportType('summary')}
                  />
                </div>
            </CCol>

            <CCol md={3}>
              <div
                style={{
                  border: '0.5px solid rgb(197, 197, 197)',
                  borderRadius: '5px',
                  padding: '3px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '6px',
                  width: '80%',
                }}
              >
                <CFormCheck
                  type="radio"
                  id="pdf"
                  label="PDF"
                  name="fileType"
                  checked={selectedFileFormat === 'pdf'}
                  onChange={handleFileFormatChange}
                />

                <div style={{ width: '1px', height: '30px', backgroundColor: 'rgb(197, 197, 197)' }} />

                <CFormCheck
                  type="radio"
                  id="excel"
                  label="Excel"
                  name="fileType"
                  checked={selectedFileFormat === 'excel'}
                  onChange={handleFileFormatChange}
                />
              </div>
            </CCol>
          </CRow>
            <CRow className="justify-content-center mt-4">
              <CCol md={3} className="text-center">
                <CButton
                  type="button"
                  color="primary"
                  variant="outline"
                  className="mb-3"
                  style={{ width: '100%' }}
                  onClick={handleDownload}
                  disabled={!selectedReportType}
                >
                  Download
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