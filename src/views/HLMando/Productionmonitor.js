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
    <>
      <CRow className="mb-5"> 
        <CCol xs={12}>
          {/* MCLMI Table */}
          <h5>MCLMI</h5>
          <CCard className="mb-4">
            <CCardBody>
              <CTable striped hover>
                <CTableHead color="dark">
                  <CTableRow>
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
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>

          {/* HSGMI Table */}
          <h5>HSGMI</h5>
          <CCard className="mb-4">
            <CCardBody>
              <CTable striped hover>
                <CTableHead color="dark">
                  <CTableRow>
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
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>

          {/* CRRMI Table */}
          <h5>CRRMI</h5>
          <CCard className="mb-4">
            <CCardBody>
              <CTable striped hover>
                <CTableHead color="dark">
                  <CTableRow>
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
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>

          {/* CALPI Table */}
          <h5>CALPI</h5>
          <CCard className="mb-4">
            <CCardBody>
              <CTable striped hover>
                <CTableHead color="dark">
                  <CTableRow>
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

export default Productionmonitor;
