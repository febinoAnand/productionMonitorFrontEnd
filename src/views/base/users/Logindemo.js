
import React, { useState } from 'react';import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser } from '@coreui/icons';
import BaseURL from 'src/assets/contants/BaseURL';

const LoginDemo = () => {
  const [username, setUsername] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [responseStatus, setResponseStatus] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  const handleGenerateOTP = async () => {
    try {
      const formattedMobileNumber = `+91${mobileNumber}`;

      const response = await fetch(BaseURL + 'Userauth/demo-check-generate-otp/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          mobile_no: formattedMobileNumber,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setResponseStatus('success');
        setResponseMessage(`OTP generated: ${data.otp}`);
        setOtp(data.otp);
      } else {
        setResponseStatus('danger');
        setResponseMessage(`Failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error generating OTP:', error);
      setResponseStatus('danger');
      setResponseMessage('An error occurred. Please try again.');
    }
  };


  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login Demo</h1>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Mobile Number"
                        autoComplete="mobile-number"
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                      />
                    </CInputGroup>
                    {responseStatus && (
                      <CAlert color={responseStatus} className="mb-3">
                        {responseMessage}
                      </CAlert>
                    )}
                    <CButton onClick={handleGenerateOTP} color="primary" className="px-4">
                      Generate OTP
                    </CButton>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default LoginDemo;