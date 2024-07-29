import React, { useState, useEffect } from 'react';
import { cilPen, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import axios from 'axios';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CRow,
  CTable,
  CTableBody,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CAlert,
} from '@coreui/react';

import BaseURL from 'src/assets/contants/BaseURL';

const url = `${BaseURL}config/httpsettings/`;

const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); 
  return {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
  };
};

const HTTP = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [settings, setSettings] = useState([]);
  const [formData, setFormData] = useState({
    id: '',
    authToken: '',
    apiPath: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await axios.get(url, { headers: getAuthHeaders() });
        const sortedData = response.data.reverse(); 
        setSettings(sortedData);
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [id]: value }));
  };

  const handleAdd = async () => {
    try {
      const response = await axios.post(url, {
        auth_token: formData.authToken,
        api_path: formData.apiPath,
      }, { headers: getAuthHeaders() });
      setSettings((prevSettings) => [response.data, ...prevSettings]);
      setFormData({ id: '', authToken: '', apiPath: '' });
      setModalVisible(false);
      showSuccessMessage('Settings added successfully!');
    } catch (error) {
      console.error('Error adding settings:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${url}${formData.id}/`, {
        auth_token: formData.authToken,
        api_path: formData.apiPath,
      }, { headers: getAuthHeaders() });
      setSettings((prevSettings) =>
        [response.data, ...prevSettings.filter((setting) => setting.id !== formData.id)]
      );
      setFormData({ id: '', authToken: '', apiPath: '' });
      setModalVisible(false);
      setIsUpdating(false);
      showSuccessMessage('Settings updated successfully!');
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this setting?');

    if (confirmDelete) {
      try {
        await axios.delete(`${url}${id}/`, { headers: getAuthHeaders() });
        setSettings((prevSettings) =>
          prevSettings.filter((setting) => setting.id !== id)
        );
        showSuccessMessage('Settings deleted successfully!');
      } catch (error) {
        console.error('Error deleting settings:', error);
        showSuccessMessage('Error deleting settings.');
      }
    } else {
      showSuccessMessage('Deletion canceled.');
    }
  };

  const openAddModal = () => {
    setIsUpdating(false);
    setFormData({ id: '', authToken: '', apiPath: '' });
    setModalVisible(true);
  };

  const openUpdateModal = (setting) => {
    setFormData({
      id: setting.id,
      authToken: setting.auth_token,
      apiPath: setting.api_path,
    });
    setIsUpdating(true);
    setModalVisible(true);
  };

  const handleSubmit = () => {
    if (isUpdating) {
      handleUpdate();
    } else {
      handleAdd();
    }
  };

  const showSuccessMessage = (message) => {
    setSuccessMessage(message);
    setTimeout(() => {
      setSuccessMessage('');
    }, 3000);
  };

  return (
    <div className="page">
      {successMessage && (
        <CAlert color="success" dismissible>
          {successMessage}
        </CAlert>
      )}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>HTTPS Settings</strong>
              <CButton
                color="success"
                variant="outline"
                size="sm"
                className="float-end"
                onClick={openAddModal}
              >
                Configure Settings
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CTable striped hover>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Auth Token</CTableHeaderCell>
                    <CTableHeaderCell scope="col">API Path</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {settings.map((setting, index) => (
                    <CTableRow key={index}>
                      <CTableHeaderCell>{setting.auth_token}</CTableHeaderCell>
                      <CTableHeaderCell>{setting.api_path}</CTableHeaderCell>
                      <CTableHeaderCell>
                        <div className="d-flex gap-2">
                          <CButton color="primary" size="sm" onClick={() => openUpdateModal(setting)}>
                            <CIcon icon={cilPen} />
                          </CButton>
                          <CButton color="primary" size="sm" onClick={() => handleDelete(setting.id)}>
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </div>
                      </CTableHeaderCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="lg">
        <CModalHeader>
          <CModalTitle>{isUpdating ? 'Update Settings' : 'Configure Settings'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm className="row g-3">
            <CCol xs={5}>
              <CFormLabel htmlFor="authToken">Authorization Token:</CFormLabel>
              <CFormInput
                id="authToken"
                value={formData.authToken}
                onChange={handleInputChange}
                placeholder="Enter Authorization Token"
                size="lg"
              />
            </CCol>
            <CCol xs={5}>
              <CFormLabel htmlFor="apiPath">API Path:</CFormLabel>
              <CFormInput
                id="apiPath"
                value={formData.apiPath}
                onChange={handleInputChange}
                placeholder="Enter API Path"
                size="lg"
              />
            </CCol>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="primary"
            variant="outline"
            size="sm"
            onClick={handleSubmit}
          >
            {isUpdating ? 'Update' : 'Add'}
          </CButton>
          <CButton color="secondary" size="sm" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default HTTP;
