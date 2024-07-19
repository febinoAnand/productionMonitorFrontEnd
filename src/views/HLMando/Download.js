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
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';

const Download = () => {
  const [startDate4, setStartDate4] = useState(new Date());

  return (
    <>
      <CRow className="mb-3">
        <CCol xs={12}>
          <CCard>
            <CCardHeader>
              <h4>Machines</h4>
            </CCardHeader>
            <CCardBody>
              <CRow>
                <CCol md={8}>
                  <CInputGroup>
                    <CFormInput placeholder="Search" />
                    <CButton type="button" color="secondary">
                      <FaSearch />
                    </CButton>
                  </CInputGroup>
                </CCol>
                <CCol md={4} className="text-end">
                  <CInputGroup>
                    <DatePicker
                      selected={startDate4}
                      onChange={(date) => setStartDate4(date)}
                      customInput={<CustomInput />}
                      dateFormat="dd/MM/yyyy"
                      popperPlacement="bottom-end"
                    />
                  </CInputGroup>
                </CCol>
              </CRow>
              <CRow className="mt-3">
                <CCol md={12}>
                  <CRow>
                    <CCol md={2}>
                      <CFormCheck
                        id="machine1"
                        label="Machine 1"
                        style={{ marginBottom: '10px' }}
                      />
                    </CCol>
                    <CCol md={2}>
                      <CFormCheck
                        id="machine2"
                        label="Machine 2"
                        style={{ marginBottom: '10px' }}
                      />
                    </CCol>
                    <CCol md={2}>
                      <CFormCheck
                        id="machine3"
                        label="Machine 3"
                        style={{ marginBottom: '10px' }}
                      />
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
              <CRow className="justify-content-center mt-5">
                <CCol md={3} className="text-center">
                  <CButton type="button" color="primary" variant='outline' className="mb-3" style={{ width: '100%' }}>
                    Download Summary Report
                  </CButton>
                  <CButton type="button" color="primary" variant='outline' style={{ width: '100%' }}>
                    Download Shiftwise Report
                  </CButton>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
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