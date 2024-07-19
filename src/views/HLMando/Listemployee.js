import React from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  // CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CFormCheck
} from '@coreui/react';
import { cilTrash, cilPen, cilSave } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const Listemployee = () => {
  // Sample data - replace with actual data as needed
  const dataRows = [
    { id: 1, employeeId: 'EMP001', employeeName: 'John Doe', employeeMobile: '9876543210', registerStatus: 'Registered', status: 'Active' },
    { id: 2, employeeId: 'EMP002', employeeName: 'Jane Smith', employeeMobile: '9876543211', registerStatus: 'Pending', status: 'Inactive' },
    { id: 3, employeeId: 'EMP003', employeeName: 'Michael Johnson', employeeMobile: '9876543212', registerStatus: 'Registered', status: 'Active' },
    // Add more rows as needed
  ];

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody>
              <CTable striped hover>
                <CTableHead color='dark'>
                  <CTableRow>
                    <CTableHeaderCell scope="col">
                      <CFormCheck />
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col">Employee Id</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Employee Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Employee Mobile No</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Register Status</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {dataRows.map(row => (
                    <CTableRow key={row.id}>
                      <CTableDataCell>
                        <CFormCheck />
                      </CTableDataCell>
                      <CTableDataCell>{row.employeeId}</CTableDataCell>
                      <CTableDataCell>{row.employeeName}</CTableDataCell>
                      <CTableDataCell>{row.employeeMobile}</CTableDataCell>
                      <CTableDataCell>{row.registerStatus}</CTableDataCell>
                      <CTableDataCell>{row.status}</CTableDataCell>
                      <CTableDataCell>
                        <CButton color="primary" size="sm" className="me-3">
                          <CIcon icon={cilPen} />
                        </CButton>
                        <CButton color="danger" size="sm" className="me-3">
                          <CIcon icon={cilSave} />
                        </CButton>
                        <CButton color="danger" size="sm" className="me-3">
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Listemployee;
