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
  CFormLabel,
  CFormSelect,
  CFormText
} from '@coreui/react';
import BaseURL from 'src/assets/contants/BaseURL';

const url = `${BaseURL}devices/device/`;

const DeviceDetails = () => {
  const [deviceList, setDeviceList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('');
  const [selectedDevice, setSelectedDevice] = useState({
    device_name: '',
    device_token: '',
    hardware_version: '',
    software_version: '',
    protocol: '',
    pub_topic: '',
    sub_topic: '',
    api_path: '',
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const protocolOptions = ['HTTP', 'MQTT'];

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
    setSelectedDevice(device || {
      device_name: '',
      device_token: '',
      hardware_version: '',
      software_version: '',
      protocol: '',
      pub_topic: '',
      sub_topic: '',
      api_path: '',
    });
    setErrors({});
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
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };

  const handleFormData = (e) => {
    const { id, value } = e.target;
    setSelectedDevice(prevDevice => ({
      ...prevDevice,
      [id]: id === 'protocol' ? value.toLowerCase() : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!selectedDevice.device_name) newErrors.device_name = 'Device Name is required';
    if (!selectedDevice.device_token) newErrors.device_token = 'Device Token is required';
    if (!selectedDevice.hardware_version) newErrors.hardware_version = 'Hardware Version is required';
    if (!selectedDevice.software_version) newErrors.software_version = 'Software Version is required';
    if (!selectedDevice.protocol) newErrors.protocol = 'Protocol is required';
    if (!selectedDevice.pub_topic) newErrors.pub_topic = 'pub topic is required';
    if (!selectedDevice.sub_topic) newErrors.sub_topic = 'sub topic is required';


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const { api_path, protocol, ...deviceData } = selectedDevice;

      const requestOptions = {
        method: modalMode === 'add' ? 'POST' : 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ ...deviceData, protocol: protocol.toLowerCase(), api_path: api_path || '' }),
      };

      const response = await fetch(modalMode === 'add' ? url : `${url}${selectedDevice.id}/`, requestOptions);

      const responseText = await response.text();
      console.log('Response text:', responseText);

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const updatedDevice = JSON.parse(responseText);

      if (modalMode === 'add') {
        setDeviceList([updatedDevice, ...deviceList]);
        setSuccessMessage('Device added successfully');
      } else if (modalMode === 'update') {
        setDeviceList([updatedDevice, ...deviceList.filter(device => device.id !== updatedDevice.id)]);
        setSuccessMessage('Device updated successfully');
      }

      setTimeout(() => setSuccessMessage(''), 3000);
      toggleModal();
    } catch (error) {
      console.error('Error saving device:', error);
      setErrorMessage('Error saving device');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  return (
    <div className="page">
      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
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
                <CFormLabel htmlFor="device_name">Device Name <span className="text-danger">*</span></CFormLabel>
                <CFormInput
                  type="text"
                  id="device_name"
                  placeholder="Enter Device Name"
                  value={selectedDevice.device_name}
                  onChange={handleFormData}
                  isInvalid={!!errors.device_name}
                />
                {errors.device_name && <CFormText className="text-danger">{errors.device_name}</CFormText>}
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="device_token">Device Token <span className="text-danger">*</span></CFormLabel>
                <CFormInput
                  type="text"
                  id="device_token"
                  placeholder="Enter Device Token"
                  value={selectedDevice.device_token}
                  onChange={handleFormData}
                  isInvalid={!!errors.device_token}
                />
                {errors.device_token && <CFormText className="text-danger">{errors.device_token}</CFormText>}
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="hardware_version">Hardware Version <span className="text-danger">*</span></CFormLabel>
                <CFormInput
                  type="text"
                  id="hardware_version"
                  placeholder="Enter Hardware Version"
                  value={selectedDevice.hardware_version}
                  onChange={handleFormData}
                  isInvalid={!!errors.hardware_version}
                />
                {errors.hardware_version && <CFormText className="text-danger">{errors.hardware_version}</CFormText>}
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="software_version">Software Version <span className="text-danger">*</span></CFormLabel>
                <CFormInput
                  type="text"
                  id="software_version"
                  placeholder="Enter Software Version"
                  value={selectedDevice.software_version}
                  onChange={handleFormData}
                  isInvalid={!!errors.software_version}
                />
                {errors.software_version && <CFormText className="text-danger">{errors.software_version}</CFormText>}
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="protocol">Protocol <span className="text-danger">*</span></CFormLabel>
                <CFormSelect
                  id="protocol"
                  value={selectedDevice.protocol}
                  onChange={handleFormData}
                  isInvalid={!!errors.protocol}
                >
                  <option value="">Select Protocol</option>
                  {protocolOptions.map((protocol) => (
                    <option key={protocol} value={protocol.toLowerCase()}>
                      {protocol}
                    </option>
                  ))}
                </CFormSelect>
                {errors.protocol && <CFormText className="text-danger">{errors.protocol}</CFormText>}
              </CCol>
              <CCol md={3}>
  <CFormLabel htmlFor="pub_topic">Pub Topic <span className="text-danger">*</span></CFormLabel>
  <CFormInput
    type="text"
    id="pub_topic"
    placeholder="Enter Pub Topic"
    value={selectedDevice.pub_topic}
    onChange={handleFormData}
    isInvalid={!!errors.pub_topic}
  />
  {errors.pub_topic && <CFormText className="text-danger">{errors.pub_topic}</CFormText>}
</CCol>
<CCol md={3}>
  <CFormLabel htmlFor="sub_topic">Sub Topic <span className="text-danger">*</span></CFormLabel>
  <CFormInput
    type="text"
    id="sub_topic"
    placeholder="Enter Sub Topic"
    value={selectedDevice.sub_topic}
    onChange={handleFormData}
    isInvalid={!!errors.sub_topic}
  />
  {errors.sub_topic && <CFormText className="text-danger">{errors.sub_topic}</CFormText>}
</CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="api_path">API Path</CFormLabel>
                <CFormInput
                  type="text"
                  id="api_path"
                  placeholder="Enter API Path (Optional)"
                  value={selectedDevice.api_path}
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
