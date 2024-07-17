import React from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormCheck,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow
} from '@coreui/react';
import { cilSave, cilPen } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const Listachievement = () => {
  return (
    <>
      {/* First Table */}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody>
              <CTable striped hover>
                <CTableHead color='dark'>
                  <CTableRow>
                    <CTableHeaderCell scope="col">
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Line ID</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Shift 1</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Shift 2</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Shift 3</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {/* Placeholder for empty row */}
                  <CTableRow>
                    <CTableDataCell colSpan="8" className="text-center">
                      No data available
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Gap */}
      <div className="mb-4" />

      {/* Second Table */}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardBody>
              <CTable striped hover>
                <CTableHead color='dark'>
                  <CTableRow>
                    <CTableHeaderCell scope="col">
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Line ID</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Shift 1</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Shift 2</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Shift 3</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {/* Placeholder for empty row */}
                  <CTableRow>
                    <CTableDataCell colSpan="8" className="text-center">
                      No data available
                    </CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Listachievement;
