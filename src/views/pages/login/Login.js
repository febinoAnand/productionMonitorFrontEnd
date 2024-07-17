import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormCheck,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser, cilExitToApp } from '@coreui/icons';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [saveId, setSaveId] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    // Implement your login logic here
    navigate('/dashboard'); // Redirect to dashboard after successful login
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center justify-content-center">
      <CContainer className="container-md">
        <CRow className="justify-content-center">
          <CCol md={6}>
            <img
              src="/mando company.jpg"
              alt="Company Logo"
              style={{ width: '135%', height: '60vh', objectFit: 'cover', marginLeft: '25px', marginTop: '10px' }}
            />
          </CCol>
          <CCol md={3}>
            <CCard className="p-4" style={{ height: '60vh', backgroundColor: '#1E90FF', borderRadius: 0,marginTop:'10px' }}>
              <CCardBody style={{ height: '100%', overflowY: 'auto' }}>
                <CForm onSubmit={handleLogin}>
                  <h1 style={{ color: '#FFFFFF' }}>Login</h1>
                  <p className="text-medium-emphasis" style={{ color: '#1E90FF' }}>Sign In to your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Login ID"
                      autoComplete="username"
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type="password"
                      placeholder="Password"
                      autoComplete="current-password"
                    />
                  </CInputGroup>
                  <CFormCheck
                    id="save-id"
                    label="Save ID"
                    checked={saveId}
                    onChange={(e) => setSaveId(e.target.checked)}
                  />
                  <CButton type="submit" color="primary" className="w-100" style={{
                    backgroundColor: 'black', 
                    borderColor: '#6CB4EE', 
                    color: 'white', 
                    width: '40px', 
                    height: '40px', 
                    padding: 0, 
                    borderRadius: '10px' 
                  }}>
                    <CIcon icon={cilExitToApp} /> Sign In
                  </CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Login;