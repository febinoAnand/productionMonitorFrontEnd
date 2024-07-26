import React from 'react';
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';

const Productionmonitor = () => {

  return (
    <div className="page">
      <CRow className="mb-5"> 
        <CCol xs={12}>
          <h5>MCLMI</h5>
          <CCard className="mb-4">
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <CCardBody>
              <CTable striped hover>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Si.No</CTableHeaderCell>
                    <CTableHeaderCell scope="col">WORK CENTER</CTableHeaderCell>
                    <CTableHeaderCell scope="col">SHIFT 1</CTableHeaderCell>
                    <CTableHeaderCell scope="col">SHIFT 2</CTableHeaderCell>
                    <CTableHeaderCell scope="col">SHIFT 3</CTableHeaderCell>
                    <CTableHeaderCell scope="col">TOTAL</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
            </div>
          </CCard>
          <h5>HSGMI</h5>
          <CCard className="mb-4">
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <CCardBody>
              <CTable striped hover>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Si.No</CTableHeaderCell>
                    <CTableHeaderCell scope="col">WORK CENTER</CTableHeaderCell>
                    <CTableHeaderCell scope="col">SHIFT 1</CTableHeaderCell>
                    <CTableHeaderCell scope="col">SHIFT 2</CTableHeaderCell>
                    <CTableHeaderCell scope="col">SHIFT 3</CTableHeaderCell>
                    <CTableHeaderCell scope="col">TOTAL</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
            </div>
          </CCard>
          <h5>CRRMI</h5>
          <CCard className="mb-4">
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <CCardBody>
              <CTable striped hover>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Si.No</CTableHeaderCell>
                    <CTableHeaderCell scope="col">WORK CENTER</CTableHeaderCell>
                    <CTableHeaderCell scope="col">SHIFT 1</CTableHeaderCell>
                    <CTableHeaderCell scope="col">SHIFT 2</CTableHeaderCell>
                    <CTableHeaderCell scope="col">SHIFT 3</CTableHeaderCell>
                    <CTableHeaderCell scope="col">TOTAL</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
            </div>
          </CCard>
          <h5>CALPI</h5>
          <CCard className="mb-4">
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <CCardBody>
              <CTable striped hover>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Si.No</CTableHeaderCell>
                    <CTableHeaderCell scope="col">WORK CENTER</CTableHeaderCell>
                    <CTableHeaderCell scope="col">SHIFT 1</CTableHeaderCell>
                    <CTableHeaderCell scope="col">SHIFT 2</CTableHeaderCell>
                    <CTableHeaderCell scope="col">SHIFT 3</CTableHeaderCell>
                    <CTableHeaderCell scope="col">TOTAL</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
            </div>
          </CCard>
        </CCol>
      </CRow>
    </div>

  );
};

export default Productionmonitor;
