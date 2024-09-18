import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  CButton,
  CCard,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked, cilUser, cilExitToApp } from '@coreui/icons';
import BaseURL from 'src/assets/contants/BaseURL';

const useAuth = () => {
  const login = (token) => {
    localStorage.setItem('token', token);
    console.log(token);
  };

  return { login };
};

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();


  const handleLogin = async (event) => {
    event.preventDefault();
    setIsSubmitting(true); 

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
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
   <div
  className="bg-light d-flex align-items-center justify-content-center"
  style={{ minHeight: '100vh', width: '100%', overflow: 'hidden' }}
>

  <CContainer
    className="d-flex align-items-center justify-content-center"
    style={{
      maxWidth: '1200px',     
      height: 'auto',         
      margin: '0 auto',        
      padding: '0',
      transform: 'translate(175px)',             
    }}
  >
    <div
      className="d-flex flex-row"
      style={{ 
        width: '100%',         
        height: 'auto',
        maxHeight: '400px',
      }}
    >
      
      <div
        style={{
          flex: '1 1 50%',     
          maxWidth: '50%',
          minWidth: '300px',
          display: 'flex',      
          justifyContent: 'center',  
          alignItems: 'center',     
        }}
      >
        <img
          src="/mando company.jpg"
          alt="Company Logo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',    
            borderRadius: '0',     
          }}
        />
      </div>

     
      <CCard
        className="p-4"
        style={{
          flex: '1 1 50%',  
          maxWidth: '250px', 
          minWidth: '250px',  
          backgroundColor: '#047BC4',
          borderRadius: '0',   
          padding: '20px',
          display: 'flex',
          justifyContent: 'center',  
          alignItems: 'center',     
        }}
      >
            <CForm onSubmit={handleLogin} style={{ width: '100%' }}>
              <h1 style={{ color: '#FFFFFF', textAlign: 'center' }}>Login</h1>
              <CInputGroup className="mb-3" style={{ marginTop: '30px' }}>
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
              <CButton
                type="submit"
                color="primary"
                className="w-100"
                style={{
                  backgroundColor: 'black',
                  borderColor: '#6CB4EE',
                  color: 'white',
                  borderRadius: '10px',
                  padding: '10px',
                }}
                disabled={isSubmitting}
              >
                <CIcon icon={cilExitToApp} /> Sign In
              </CButton>
              <CRow className="mt-3 text-center">
                <CCol>
                  <Link to="/users/Logindemo" style={{ fontSize: '0.8rem', color: '#FFFFFF' }}>
                    Demo User OTP
                  </Link>
                </CCol>
                <CCol>
                  <Link to="/users/Activatedemo" style={{ fontSize: '0.8rem', color: '#FFFFFF' }}>
                    To Activate Demo User
                  </Link>
                </CCol>
              </CRow>
            </CForm>
          </CCard>
        </div>
      </CContainer>
    </div>
  );
};

export default Login;
