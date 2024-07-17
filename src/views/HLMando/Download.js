import React, { useState } from 'react';
import { CCol, CRow } from '@coreui/react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FaDownload, FaSearch} from 'react-icons/fa'; // Import necessary icons


const Download = () => {
  const [startDate4, setStartDate4] = useState(new Date());

  return (
    <>
      <CRow className="mb-3">
        <CCol md={3}>
          <div className="input-group">
            <input type="text" className="form-control" placeholder="Search" />
            <div className="input-group-append">
              <span className="input-group-text" style={{ height: '38px', borderRadius: '0px' }}>
                <FaSearch /> {/* Updated icon */}
              </span>
            </div>
          </div>
        </CCol>
        <CCol md={4} className="text-end">
          <DatePicker
            selected={startDate4}
            onChange={(date) => setStartDate4(date)}
            customInput={<CustomInput />}
            dateFormat="dd/MM/yyyy"
            popperPlacement="bottom-end"
          />
        </CCol>
      </CRow>
      <CRow className="justify-content-center mt-5">
        <CCol md={4} className="text-center">
          <div className="d-flex flex-column align-items-center">
            <div className="input-group" style={{ width: '100%', marginBottom: 0 }}>
              <input
                type="text"
                className="form-control"
                placeholder="SUMMARY REPORT"
                readOnly
                style={{ height: '38px', borderRadius: '0px' }}
              />
              <div className="input-group-append">
                <span className="input-group-text" style={{ height: '36px', borderRadius: '0px' }}>
                  <FaDownload />
                </span>
              </div>
            </div>
            <div className="input-group" style={{ width: '100%' }}>
              <input
                type="text"
                className="form-control"
                placeholder="SHIFTWISE REPORT"
                readOnly
                style={{ height: '38px', borderRadius: '0px' }}
              />
              <div className="input-group-append">
                <span className="input-group-text" style={{ height: '38px', borderRadius: '0px' }}>
                  <FaDownload />
                </span>
              </div>
            </div>
          </div>
        </CCol>
      </CRow>
    </>
  );
};

const CustomInput = ({ value, onClick }) => (
  <div className="input-group" style={{ height: '38px', borderRadius: '0px' }}>
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
        <FaSearch />
      </span>
    </div>
  </div>
);

export default Download;
