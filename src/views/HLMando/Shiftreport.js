import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CIcon from '@coreui/icons-react';
import { cilSearch, cilCalendar } from '@coreui/icons';
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
  CInputGroup,
  CFormInput,
  CButton
} from '@coreui/react';

const Shiftreport = () => {
  const [startDate, setStartDate] = useState(new Date());

  const CustomInput = ({ value, onClick }) => (
    <div className="input-group" style={{height: '38px', borderRadius: '0px' }}>
      <input
        type="text"
        className="form-control"
        value={value}
        onClick={onClick}
        readOnly
        style={{ paddingRight: '30px', height: '38px', borderRadius: '0px' }}
      />
      <div className="input-group-append" style={{ borderRadius: '0px' }}>
        <CButton type="button" color="secondary" onClick={onClick} style={{ height: '38px', borderRadius: '0px' }}>
          <CIcon icon={cilCalendar} />
        </CButton>
      </div>
    </div>
  );

  return (
    <>
      <CRow className="mb-3">
        <CCol md={4}>
          <CInputGroup className="flex-nowrap mt-3 mb-4">
            <CFormInput
              placeholder="Search by time or Production Count Actual"
              aria-label="Search"
              aria-describedby="addon-wrapping"
            />
            <CButton type="button" color="secondary" id="button-addon2">
              <CIcon icon={cilSearch} />
            </CButton>
          </CInputGroup>
        </CCol>
        <CCol md={4} className="text-end">
          <CInputGroup className="flex-nowrap mt-3 mb-4">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              customInput={<CustomInput />}
              dateFormat="dd/MM/yyyy"
              popperPlacement="bottom-end"
            />
          </CInputGroup>
        </CCol>
      </CRow>

      <CRow>
        <CCol xs={12}>
          <h5>Shift 1</h5>
          <CCard className="mb-4">
            <CCardBody>
              <CTable striped hover>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Si.No</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Time</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Production Count Actual</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
          <h5>Shift 2</h5>
          <CCard className="mb-4">
            <CCardBody>
              <CTable striped hover>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Si.No</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Time</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Production Count Actual</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
          <h5>Shift 3</h5>
          <CCard className="mb-4">
            <CCardBody>
              <CTable striped hover>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Si.No</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Time</CTableHeaderCell>
                    <CTableHeaderCell scope="col"> Production Count Actual</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
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

export default Shiftreport;