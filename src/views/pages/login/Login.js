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
  //CFormCheck,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser, cilExitToApp } from '@coreui/icons';
import BaseURL from 'src/assets/contants/BaseURL';


const useAuth = () => {
  const login = (token) => {
    localStorage.setItem('token', token);
    console.log(token)
  };

  return { login };
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  //const [saveId, setSaveId] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(BaseURL + 'Userauth/weblogin/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        login(data.token);
        localStorage.setItem('username', username);
        localStorage.setItem('password', password);
        console.log(username);
        console.log('Login successful. Token:', data.token);
        navigate('/HLMando/dashboard');
        window.location.reload();
      } else {
        const errorData = await response.json();
        alert(`Login failed: ${errorData.message}`);
      }
    } catch (error) {
      console.error('An error occurred during login:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center justify-content-center">
      <CContainer className="container-md"  style={{ transform: 'scale(0.8)'}}>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <img
              src="/mando company.jpg"
              alt="Company Logo"
              style={{ width: '135%', height: '60vh', objectFit: 'cover', marginLeft: '25px', marginTop: '10px' }}
            />
          </CCol>
          <CCol md={3}>
            <CCard className="p-4" style={{ height: '60vh', backgroundColor:  '#55B0E2', borderRadius: 0, marginTop: '10px' }}>
              <CCardBody style={{ height: '100%', overflowY: 'auto' }}>
                <CForm onSubmit={handleLogin}>
                  <h1 style={{ color: '#FFFFFF' }}>Login</h1>
                  <CInputGroup className="mb-3" style={{ marginTop: '40px' }}>
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