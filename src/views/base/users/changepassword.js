import React, { useState } from 'react';
import {
  CButton,
  CForm,
  CFormInput,
  CCol,
  CRow,
} from '@coreui/react';
import axios from 'axios';
import BaseURL from 'src/assets/contants/BaseURL';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirm password do not match.');
      return;
    }

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(`${BaseURL}Userauth/userchangepassword/`, {
        old_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword
      }, {
        headers: {
          'Authorization': `Token ${token}`
        }
      });

      console.log('Password changed successfully:', response.data);
      setErrorMessage('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMessage('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      setErrorMessage('Failed to change password. Please try again.');
    }
  };

  return (
    <CRow className="justify-content-center">
      <CCol md="6">
        <div className="text-center mb-4">
          <h2>Change Password</h2>
        </div>
        <CForm onSubmit={handleChangePassword}>
          {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
          <CFormInput
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          /><br />
          <CFormInput
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          /><br />
          <CFormInput
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          /><br />
          <CRow className="justify-content-center">
            <CCol md="auto">
                <CButton color="primary" type="submit">Update</CButton>
            </CCol>
          </CRow>
        </CForm>
      </CCol>
    </CRow>
  );
};

export default ChangePassword;