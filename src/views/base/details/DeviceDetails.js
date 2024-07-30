import React, { useState, useEffect, useCallback } from 'react';
import { cilPen, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTooltip,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CForm,
  CFormInput,
  CFormLabel
} from '@coreui/react';
import BaseURL from 'src/assets/contants/BaseURL';

const url = `${BaseURL}devices/device/`;

const DeviceDetails = () => {
  const [deviceList, setDeviceList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchDevices = useCallback(async () => {
    try {
      const response = await fetch(url, { headers: getAuthHeaders() });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const sortedData = data.reverse(); 
      setDeviceList(sortedData);
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  }, []);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  const toggleModal = (mode = '', device = null) => {
    setModalMode(mode);
    setSelectedDevice(device);
    setShowModal(!showModal);
  };

  const handleEditClick = (device) => {
    toggleModal('update', device);
  };

  const handleDeleteClick = (deviceId) => {
    if (window.confirm('Are you sure you want to delete this device?')) {
      deleteDevice(deviceId);
    }
  };

  const deleteDevice = async (deviceId) => {
    try {
      const response = await fetch(`${url}${deviceId}/`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      setDeviceList(deviceList.filter(device => device.id !== deviceId));
      setSuccessMessage('Device deleted successfully');
      setTimeout(() => setSuccessMessage(''), 3000); // Hide message after 3 seconds
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };

  const handleFormData = (e) => {
    const { id, value } = e.target;
    setSelectedDevice(prevDevice => ({
      ...prevDevice,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Extract api_path separately
      const { api_path, ...deviceData } = selectedDevice; 

      if (modalMode === 'add') {
        // For adding a new device, include api_path or send as empty string if not provided
        const response = await fetch(url, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({ ...deviceData, api_path: api_path || '' }),
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const newDevice = await response.json();
        setDeviceList([newDevice, ...deviceList]); 
        setSuccessMessage('Device added successfully');
        setTimeout(() => setSuccessMessage(''), 3000); // Hide message after 3 seconds
      } else if (modalMode === 'update') {
       
        const response = await fetch(`${url}${selectedDevice.id}/`, {
          method: 'PUT',
          headers: getAuthHeaders(),
          body: JSON.stringify({ ...deviceData, api_path: api_path || '' }), // Ensure api_path is included
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const updatedDevice = await response.json();
        setDeviceList([updatedDevice, ...deviceList.filter(device => device.id !== updatedDevice.id)]); 
        setSuccessMessage('Device updated successfully');
        setTimeout(() => setSuccessMessage(''), 3000); 
      }
      toggleModal();
    } catch (error) {
      console.error('Error saving device:', error);
    }
  };

  return (
    <div className="page">
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Device Details</strong>
              <CButton className="float-end" size="sm" color="success" variant='outline' onClick={() => toggleModal('add')}>
                Add Device
              </CButton>
            </CCardHeader>
            <CCardBody>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <CTable striped hover>
                  <CTableHead color='dark'>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Si No</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Device Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Device Token</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Hardware Version</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Software Version</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Protocol</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Pub Topic</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Sub Topic</CTableHeaderCell>
                      <CTableHeaderCell scope="col">API Path</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {deviceList.map((device, index) => (
                      <CTableRow key={device.id}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{device.device_name}</CTableDataCell>
                        <CTableDataCell>{device.device_token}</CTableDataCell>
                        <CTableDataCell>{device.hardware_version}</CTableDataCell>
                        <CTableDataCell>{device.software_version}</CTableDataCell>
                        <CTableDataCell>{device.protocol}</CTableDataCell>
                        <CTableDataCell>{device.pub_topic}</CTableDataCell>
                        <CTableDataCell>{device.sub_topic}</CTableDataCell>
                        <CTableDataCell>{device.api_path}</CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-2">
                            <CTooltip content="Edit Device">
                              <CButton color="primary" size="sm" onClick={() => handleEditClick(device)}>
                                <CIcon icon={cilPen} />
                              </CButton>
                            </CTooltip>
                            <CTooltip content="Delete Device">
                              <CButton color="primary" size="sm" onClick={() => handleDeleteClick(device.id)}>
                                <CIcon icon={cilTrash} />
                              </CButton>
                            </CTooltip>
                          </div>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={showModal} onClose={() => setShowModal(false)} size="xl">
        <CModalHeader>
          <CModalTitle>{modalMode === 'update' ? 'Update Device' : 'Add Device'}</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit}>
          <CModalBody>
            <CRow className="g-3">
              <CCol md={3}>
                <CFormLabel htmlFor="device_name">Device Name</CFormLabel>
                <CFormInput
                  type="text"
                  id="device_name"
                  placeholder="Enter Device Name"
                  value={selectedDevice?.device_name || ''}
                  onChange={handleFormData}
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="device_token">Device Token</CFormLabel>
                <CFormInput
                  type="text"
                  id="device_token"
                  placeholder="Enter Device Token"
                  value={selectedDevice?.device_token || ''}
                  onChange={handleFormData}
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="hardware_version">Hardware Version</CFormLabel>
                <CFormInput
                  type="text"
                  id="hardware_version"
                  placeholder="Enter Hardware Version"
                  value={selectedDevice?.hardware_version || ''}
                  onChange={handleFormData}
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="software_version">Software Version</CFormLabel>
                <CFormInput
                  type="text"
                  id="software_version"
                  placeholder="Enter Software Version"
                  value={selectedDevice?.software_version || ''}
                  onChange={handleFormData}
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="protocol">Protocol</CFormLabel>
                <CFormInput
                  type="text"
                  id="protocol"
                  placeholder="Enter Protocol"
                  value={selectedDevice?.protocol || ''}
                  onChange={handleFormData}
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="pub_topic">Pub Topic</CFormLabel>
                <CFormInput
                  type="text"
                  id="pub_topic"
                  placeholder="Enter Pub Topic"
                  value={selectedDevice?.pub_topic || ''}
                  onChange={handleFormData}
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="sub_topic">Sub Topic</CFormLabel>
                <CFormInput
                  type="text"
                  id="sub_topic"
                  placeholder="Enter Sub Topic"
                  value={selectedDevice?.sub_topic || ''}
                  onChange={handleFormData}
                />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="api_path">API Path</CFormLabel>
                <CFormInput
                  type="text"
                  id="api_path"
                  placeholder="Enter API Path"
                  value={selectedDevice?.api_path || ''}
                  onChange={handleFormData}
                />
              </CCol>
            </CRow>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" size="sm" onClick={() => setShowModal(false)}>
              Cancel
            </CButton>
            <CButton color="primary" size="sm" variant='outline' type="submit">
              {modalMode === 'update' ? 'Update' : 'Add'}
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>
    </div>
  );
};

export default DeviceDetails;
