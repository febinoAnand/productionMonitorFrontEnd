import React, { useState, useEffect } from 'react';
import { cilPen } from '@coreui/icons';
import {
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
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CButton,
  CAlert
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import BaseURL from 'src/assets/contants/BaseURL';

const url = `${BaseURL}config/mqttsettings/`;


const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); 
  return {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
  };
};

const MQTT = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editId, setEditId] = useState(null);
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [serverNameAlias, setServerNameAlias] = useState('');
  const [keepAlive, setKeepAlive] = useState('60');
  const [qos, setQos] = useState('0');
  const [data, setData] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      const response = await fetch(url, { headers: getAuthHeaders() });
      if (response.ok) {
        const configurations = await response.json();
        setData(configurations);
        if (configurations.length > 0) {
          const firstEntry = configurations[0];
          setHost(firstEntry.host);
          setPort(firstEntry.port);
          setUserName(firstEntry.username);
          setPassword(firstEntry.password);
          setServerNameAlias(firstEntry.server_name_alias);
          setKeepAlive(firstEntry.keepalive);
          setQos(firstEntry.qos);
          setEditId(firstEntry._id);
        }
      } else {
        console.error('Failed to fetch configurations');
      }
    } catch (error) {
      console.error('Error fetching configurations:', error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (editId === null) {
      console.error('No configuration selected for update');
      return;
    }

    const updatedEntry = {
      host,
      port,
      username: userName,
      password,
      server_name_alias: serverNameAlias,
      keepalive: keepAlive,
      qos
    };

    try {
      const response = await fetch(`${url}${editId}/`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedEntry),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update configuration: ${response.status} ${errorText}`);
      }

      setData((prevData) =>
        prevData.map((item) =>
          item._id === editId ? { ...item, ...updatedEntry } : item
        )
      );

      setModalVisible(false);
      setSuccessMessage('Configuration updated successfully!');
      resetForm();
    } catch (error) {
      console.error('Error updating configuration:', error);
    }
  };

  const handleEdit = (id) => {
    const entry = data.find((item) => item._id === id);
    setHost(entry.host);
    setPort(entry.port);
    setUserName(entry.username);
    setPassword(entry.password);
    setServerNameAlias(entry.server_name_alias);
    setKeepAlive(entry.keepalive);
    setQos(entry.qos);
    setEditId(id);
    setModalVisible(true);
  };

  const resetForm = () => {
    setHost('');
    setPort('');
    setUserName('');
    setPassword('');
    setServerNameAlias('');
    setKeepAlive('60');
    setQos('0');
    setEditId(null);
  };

  return (
    <div className="page">
      {successMessage && (
        <CAlert color="success" dismissible onClose={() => setSuccessMessage('')}>
          {successMessage}
        </CAlert>
      )}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>MQTT Config</strong>
            </CCardHeader>
            <CCardBody>
              <CTable striped hover>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Host</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Port</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Username</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Password</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Server Name Alias</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Keep Alive</CTableHeaderCell>
                    <CTableHeaderCell scope="col">QOS</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data.map((entry) => (
                    <CTableRow key={entry._id}>
                      <CTableDataCell>{entry.host}</CTableDataCell>
                      <CTableDataCell>{entry.port}</CTableDataCell>
                      <CTableDataCell>{entry.username}</CTableDataCell>
                      <CTableDataCell>{entry.password}</CTableDataCell>
                      <CTableDataCell>{entry.server_name_alias}</CTableDataCell>
                      <CTableDataCell>{entry.keepalive}</CTableDataCell>
                      <CTableDataCell>{entry.qos}</CTableDataCell>
                      <CTableDataCell>
                        <div className="d-flex gap-2">
                          <CButton size="sm" onClick={() => handleEdit(entry._id)}>
                            <CIcon icon={cilPen} />
                          </CButton>
                        </div>
                      </CTableDataCell>
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
          <CModalTitle>Edit MQTT Configuration</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit} className="row g-3">
            <CCol md={3}>
              <CFormLabel htmlFor="host">Host</CFormLabel>
              <CFormInput
                id="host"
                value={host}
                onChange={(e) => setHost(e.target.value)}
                placeholder="e.g., 232.123.434.123, testmqtt.com"
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel htmlFor="port">Port</CFormLabel>
              <CFormInput
                id="port"
                value={port}
                onChange={(e) => setPort(e.target.value)}
                placeholder="e.g., 1883"
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel htmlFor="userName">Username</CFormLabel>
              <CFormInput
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g., mqttuser"
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel htmlFor="password">Password</CFormLabel>
              <CFormInput
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="e.g., yourpassword"
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel htmlFor="serverNameAlias">Server Name Alias</CFormLabel>
              <CFormInput
                id="serverNameAlias"
                value={serverNameAlias}
                onChange={(e) => setServerNameAlias(e.target.value)}
                placeholder="e.g., MQTT Server"
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel htmlFor="keepAlive">Keep Alive</CFormLabel>
              <CFormInput
                id="keepAlive"
                type="number"
                value={keepAlive}
                onChange={(e) => setKeepAlive(e.target.value)}
                placeholder="e.g., 60"
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel htmlFor="qos">QoS</CFormLabel>
              <CFormInput
                id="qos"
                type="number"
                value={qos}
                onChange={(e) => setQos(e.target.value)}
                placeholder="e.g., 0"
              />
            </CCol>
            <CCol xs={12}>
              <div className="d-flex justify-content-end">
                <CButton type="submit" color="success" variant="outline" size="sm">Update</CButton>
                <CButton color="secondary" size="sm" onClick={() => setModalVisible(false)} className="ms-2">Close</CButton>
              </div>
            </CCol>
          </CForm>
        </CModalBody>
      </CModal>
    </div>
  );
};

export default MQTT;