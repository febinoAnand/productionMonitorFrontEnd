import React, { useState } from 'react';
import { CContainer, CRow, CCol, CCard, CCardBody, CForm, CInputGroup, CInputGroupText, CFormInput, CFormCheck, CButton, CAlert } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import axios from 'axios';
import BaseURL from 'src/assets/contants/BaseURL';

const ActiveDemo = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isInactive, setIsInactive] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const fetchUserStatus = async () => {
    try {
      const response = await axios.post(BaseURL + 'Userauth/demo-check-user-activity/', {
        username: username,
        password: password
      });

      if (response.data.status === 'active') {
        setIsActive(true);
        setIsInactive(false);
      } else if (response.data.status === 'inactive') {
        setIsActive(false);
        setIsInactive(true);
      } else {
        console.error('Invalid response after checking user status:', response.data);
      }
    } catch (error) {
      console.error('Error fetching user status:', error);
    }
  };

  const updateUserStatus = async (isActive) => {
    try {
      const response = await axios.post(BaseURL + 'Userauth/demo-update-user-status/', {
        username: username,
        password: password,
        is_active: isActive
      });

      if (response.data.status === 'active') {
        setIsActive(true);
        setIsInactive(false);
        setSuccessMessage('User status updated successfully!');
        setErrorMessage('');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      setSuccessMessage('');
      setErrorMessage('Failed to update user status. Please try again.');
    }
  };

  const handleActivateChange = () => {
    setIsActive(true);
    setIsInactive(false);
  };

  const handleDeactivateChange = () => {
    setIsActive(false);
    setIsInactive(true);
  };

  const handleUpdateStatus = async () => {
    if (!username) {
      setErrorMessage('Please enter a username.');
      return;
    }

    try {
      if (isActive) {
        await updateUserStatus(true);
      } else {
        await updateUserStatus(false);
      }
      fetchUserStatus();
    } catch (error) {
      console.error('Error updating user status:', error);
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCard>
              <CCardBody>
                <h1>Activation Page</h1>
                {successMessage && (
                  <CAlert color="success">{successMessage}</CAlert>
                )}
                {errorMessage && (
                  <CAlert color="danger">{errorMessage}</CAlert>
                )}
                <CForm>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-user" />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Enter Username"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon="cil-lock-locked" />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Enter Password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </CInputGroup>
                  <CRow className="mb-3">
                    <CCol xs={6}>
                      <CFormCheck
                        id="activateCheckbox"
                        label="Activate"
                        checked={isActive}
                        onChange={handleActivateChange}
                      />
                    </CCol>
                    <CCol xs={6}>
                      <CFormCheck
                        id="deactivateCheckbox"
                        label="Deactivate"
                        checked={isInactive}
                        onChange={handleDeactivateChange}
                      />
                    </CCol>
                  </CRow>
                  <CButton onClick={handleUpdateStatus} color="primary">Update Status</CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default ActiveDemo;