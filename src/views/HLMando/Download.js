import React, { useState, forwardRef } from 'react';
import {
  CCol,
  CRow,
  CInputGroup,
  CFormInput,
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CFormCheck
} from '@coreui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaCalendarAlt } from 'react-icons/fa';
import jsPDF from 'jspdf';
import Papa from 'papaparse';

const Download = () => {
  const [startDate4, setStartDate4] = useState(new Date());
  const [endDate4, setEndDate4] = useState(new Date());
  const [selectedMachines, setSelectedMachines] = useState({
    machine1: false,
    machine2: false,
    machine3: false,
  });

  const handleMachineChange = (e) => {
    setSelectedMachines({ ...selectedMachines, [e.target.id]: e.target.checked });
  };

  const formatDate = (date) => {

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    doc.text(`From Date: ${formatDate(startDate4)}`, 10, 10);
    doc.text(`To Date: ${formatDate(endDate4)}`, 10, 20);
    doc.text('Selected Machines:', 10, 30);

    let yOffset = 40;
    Object.keys(selectedMachines).forEach((machine) => {
      if (selectedMachines[machine]) {
        doc.text(machine, 10, yOffset);
        yOffset += 10;
      }
    });

    doc.save('download.pdf');
  };
  const generateCSV = () => {
    const formatDate = (date) => {
      const day = String(date.getDate()).padStart(2, '0'); 
      const month = String(date.getMonth() + 1).padStart(2, '0'); 
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    };
  
    const data = [
      ["From Date", formatDate(startDate4)],
      ["To Date", formatDate(endDate4)],
      ["Selected Machines"]
    ];
  
    Object.keys(selectedMachines).forEach((machine) => {
      if (selectedMachines[machine]) {
        data.push([machine]);
      }
    });
  
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'download.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };
  return (
    <div className="page">
      <CRow className="mb-3">
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <h4>Machines</h4>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md={6} className="text-end">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px', marginRight: '425px' }}>From Date</div>
                    <CInputGroup>
                      <DatePicker
                        selected={startDate4}
                        onChange={(date) => setStartDate4(date)}
                        customInput={<CustomInput />}
                        dateFormat="yyyy/MM/dd"
                        popperPlacement="bottom-end"
                      />
                    </CInputGroup>
                  </div>
                </CCol>
                <CCol md={6} className="text-end">
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <div style={{ fontWeight: 'bold', marginBottom: '5px', marginRight: '445px' }}>To Date</div>
                    <CInputGroup>
                      <DatePicker
                        selected={endDate4}
                        onChange={(date) => setEndDate4(date)}
                        customInput={<CustomInput />}
                        dateFormat="yyyy/MM/dd"
                        popperPlacement="bottom-end"
                      />
                    </CInputGroup>
                  </div>
                </CCol>
              </CRow>
              <CRow className="mt-3">
                <CCol md={12}>
                  <CRow>
                    <CCol md={2}>
                      <CFormCheck
                        id="machine1"
                        label="Machine 1"
                        checked={selectedMachines.machine1}
                        onChange={handleMachineChange}
                        style={{ marginBottom: '10px' }}
                      />
                    </CCol>
                    <CCol md={2}>
                      <CFormCheck
                        id="machine2"
                        label="Machine 2"
                        checked={selectedMachines.machine2}
                        onChange={handleMachineChange}
                        style={{ marginBottom: '10px' }}
                      />
                    </CCol>
                    <CCol md={2}>
                      <CFormCheck
                        id="machine3"
                        label="Machine 3"
                        checked={selectedMachines.machine3}
                        onChange={handleMachineChange}
                        style={{ marginBottom: '10px' }}
                      />
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
              <CRow className="justify-content-center mt-5">
                <CCol md={3} className="text-center">
                  <CButton type="button" color="primary" variant='outline' className="mb-3" style={{ width: '100%' }} onClick={generatePDF}>
                    Download PDF
                  </CButton>
                  <CButton type="button" color="primary" variant='outline' style={{ width: '100%' }} onClick={generateCSV}>
                    Download CSV
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
    <CButton type="button" color="secondary" onClick={props.onClick}>
      <FaCalendarAlt />
    </CButton>
  </CInputGroup>
));

CustomInput.displayName = 'CustomInput';

export default Download;
