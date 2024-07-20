import React, { useState, useEffect } from 'react';
import { cilPen } from '@coreui/icons';
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
} from '@coreui/react';

const BaseURL = "https://productionb.univa.cloud/";
const url = `${BaseURL}config/httpsettings/`;

const HTTP = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [responseData, setResponseData] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [settings, setSettings] = useState([]);
  const [formData, setFormData] = useState({
    authToken: '',
    apiPath: '',
  });

  useEffect(() => {
    // Fetch settings data when the component mounts
    const fetchSettings = async () => {
      try {
        const response = await axios.get(url);
        setSettings(response.data);
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
      const response = await axios.post(url, formData);
      setSettings((prevSettings) => [...prevSettings, response.data]);
      setFormData({ authToken: '', apiPath: '' });
      setModalVisible(false);
    } catch (error) {
      console.error('Error adding settings:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(`${url}${formData.authToken}/`, formData);
      setSettings((prevSettings) =>
        prevSettings.map((setting) =>
          setting.authToken === formData.authToken ? response.data : setting
        )
      );
      setFormData({ authToken: '', apiPath: '' });
      setModalVisible(false);
      setIsUpdating(false);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const openAddModal = () => {
    setIsUpdating(false);
    setModalVisible(true);
  };

  const openUpdateModal = (setting) => {
    setFormData(setting);
    setIsUpdating(true);
    setModalVisible(true);
  };

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>HTTPS Settings</strong>
              <CButton
                color="success"
                variant="outline"
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
                              <CButton  onClick={() => openUpdateModal(setting)}>
                                <CIcon icon={cilPen} />
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
                size="xl"
              />
            </CCol>
            <CCol xs={5}>
              <CFormLabel htmlFor="apiPath">API Path:</CFormLabel>
              <CFormInput
                id="apiPath"
                value={formData.apiPath}
                onChange={handleInputChange}
                placeholder="Enter API Path"
                size="xl"
              />
            </CCol>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton
            color="primary"
            variant="outline"
            onClick={isUpdating ? handleUpdate : handleAdd}
          >
            {isUpdating ? 'Update' : 'Add'}
          </CButton>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {responseData && (
        <CModal visible={true} onClose={() => setResponseData(null)} size="xl">
          <CModalHeader>
            <CModalTitle>Response Data</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <pre>{JSON.stringify(responseData, null, 2)}</pre>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setResponseData(null)}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      )}
    </>
  );
};

export default HTTP;
