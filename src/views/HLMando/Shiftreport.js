import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
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

const Shiftreport = () => {
  const [startDate1, setStartDate1] = useState(new Date());
  const [startDate2, setStartDate2] = useState(new Date());
  const [startDate3, setStartDate3] = useState(new Date());

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
      <div className="input-group-append" onClick={onClick} style={{ borderRadius: '0px' }}>
        <span className="input-group-text" style={{ height: '38px', borderRadius: '0px' }}>
          <i className="fa fa-search"  />
        </span>
      </div>
    </div>
  );

  return (
    <>
      <CRow>
        <CCol xs={12}>
          {/* First Table */}
          <h5>Shift 1</h5>
          <CCard className="mb-4">
            <CCardBody>
              <CRow className="mb-3">
                <CCol md={3}>
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder="" />
                    <div className="input-group-append">
                      <span className="input-group-text" style={{ height: '38px', borderRadius: '0px' }}>
                        <i className="fa fa-search" />
                      </span>
                    </div>
                  </div>
                </CCol>
                <CCol md={4} className="text-end">
                  <DatePicker
                    selected={startDate1}
                    onChange={(date) => setStartDate1(date)}
                    customInput={<CustomInput />}
                    dateFormat="dd/MM/yyyy"
                    popperPlacement="bottom-end" 
                  />
                </CCol>
              </CRow>
              <CTable striped hover>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Time</CTableHeaderCell>
                    <CTableHeaderCell scope="col" className="text-end">
                      Production Count Actual
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>

          {/* Second Table */}
          <h5>Shift 2</h5>
          <CCard className="mb-4">
            <CCardBody>
              <CRow className="mb-3">
                <CCol md={3}>
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder="" />
                    <div className="input-group-append">
                      <span className="input-group-text" style={{ height: '38px', borderRadius: '0px' }}>
                        <i className="fa fa-search" />
                      </span>
                    </div>
                  </div>
                </CCol>
                <CCol md={4} className="text-end">
                  <DatePicker
                    selected={startDate2}
                    onChange={(date) => setStartDate2(date)}
                    customInput={<CustomInput />}
                    dateFormat="dd/MM/yyyy"
                    popperPlacement="bottom-end" // Aligns the calendar to the right side
                  />
                </CCol>
              </CRow>
              <CTable striped hover>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Time</CTableHeaderCell>
                    <CTableHeaderCell scope="col" className="text-end">
                      Production Count Actual
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableDataCell></CTableDataCell>
                    <CTableDataCell></CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>

          {/* Third Table */}
          <h5>Shift 3</h5>
          <CCard className="mb-4">
            <CCardBody>
              <CRow className="mb-3">
                <CCol md={3}>
                  <div className="input-group">
                    <input type="text" className="form-control" placeholder="" />
                    <div className="input-group-append">
                      <span className="input-group-text" style={{ height: '38px', borderRadius: '0px' }}>
                        <i className="fa fa-search" />
                      </span>
                    </div>
                  </div>
                </CCol>
                <CCol md={4} className="text-end">
                  <DatePicker
                    selected={startDate3}
                    onChange={(date) => setStartDate3(date)}
                    customInput={<CustomInput />}
                    dateFormat="dd/MM/yyyy"
                    popperPlacement="bottom-end" // Aligns the calendar to the right side
                  />
                </CCol>
              </CRow>
              <CTable striped hover>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Time</CTableHeaderCell>
                    <CTableHeaderCell scope="col" className="text-end">
                      Production Count Actual
                    </CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
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
