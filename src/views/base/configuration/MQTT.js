import React, { useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
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
} from '@coreui/react';

const BaseURL = "https://productionb.univa.cloud/";

const MQTT = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [clientId, setClientId] = useState('');
  const [keepAlive, setKeepAlive] = useState('60');
  const [qos, setQos] = useState('0');
  const [data, setData] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newEntry = { host, port, userName, password, clientId, keepAlive, qos };

    if (editIndex !== null) {
      // Update existing entry
      await updateConfiguration(editIndex, newEntry);
    } else {
      // Add new entry
      await addConfiguration(newEntry);
    }

    setModalVisible(false);
    resetForm();
  };

  const addConfiguration = async (entry) => {
    try {
      const response = await fetch(`${BaseURL}/config/mqttsettings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });

      if (response.ok) {
        const newEntry = await response.json();
        setData([...data, newEntry]);
      } else {
        console.error('Failed to add configuration');
      }
    } catch (error) {
      console.error('Error adding configuration:', error);
    }
  };

  const updateConfiguration = async (index, entry) => {
    try {
      const response = await fetch(`${BaseURL}/config/mqttsettings/${index}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entry),
      });

      if (response.ok) {
        const updatedEntry = await response.json();
        const updatedData = data.map((item, idx) =>
          idx === index ? updatedEntry : item
        );
        setData(updatedData);
      } else {
        console.error('Failed to update configuration');
      }
    } catch (error) {
      console.error('Error updating configuration:', error);
    }
  };

  const handleEdit = (index) => {
    const entry = data[index];
    setHost(entry.host);
    setPort(entry.port);
    setUserName(entry.userName);
    setPassword(entry.password);
    setClientId(entry.clientId);
    setKeepAlive(entry.keepAlive);
    setQos(entry.qos);
    setEditIndex(index);
    setModalVisible(true);
  };

  const handleDelete = async (index) => {
    try {
      const response = await fetch(`${BaseURL}/config/mqttsettings/${index}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const updatedData = data.filter((_, i) => i !== index);
        setData(updatedData);
      } else {
        console.error('Failed to delete configuration');
      }
    } catch (error) {
      console.error('Error deleting configuration:', error);
    }
  };

  const resetForm = () => {
    setHost('');
    setPort('');
    setUserName('');
    setPassword('');
    setClientId('');
    setKeepAlive('60');
    setQos('0');
    setEditIndex(null);
  };

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>MQTT Config</strong>
              <CButton
                color="primary"
                variant="outline"
                className="float-end"
                onClick={() => setModalVisible(true)}
              >
                Add New Configuration
              </CButton>
            </CCardHeader>
            <CCardBody>
              <CTable striped hover>
                <CTableHead color="dark">
                  <CTableRow>
                    <CTableHeaderCell scope="col">Host</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Port</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Username</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Password</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Client ID</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Keep Alive</CTableHeaderCell>
                    <CTableHeaderCell scope="col">QOS</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data.map((entry, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{entry.host}</CTableDataCell>
                      <CTableDataCell>{entry.port}</CTableDataCell>
                      <CTableDataCell>{entry.userName}</CTableDataCell>
                      <CTableDataCell>{entry.password}</CTableDataCell>
                      <CTableDataCell>{entry.clientId}</CTableDataCell>
                      <CTableDataCell>{entry.keepAlive}</CTableDataCell>
                      <CTableDataCell>{entry.qos}</CTableDataCell>
                      <CTableDataCell>
                        <CButton
                          color="warning"
                          variant="outline"
                          onClick={() => handleEdit(index)}
                        >
                          Update
                        </CButton>
                        <CButton
                          color="danger"
                          variant="outline"
                          onClick={() => handleDelete(index)}
                        >
                          Delete
                        </CButton>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="xl">
        <CModalHeader>
          <CModalTitle>{editIndex !== null ? 'Edit MQTT Configuration' : 'Add MQTT Configuration'}</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit} className="row g-3">
            <CCol md={9}>
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
                placeholder="e.g., 1883, 8883"
              />
            </CCol>
            <CCol xs={3}>
              <CFormLabel htmlFor="userName">User Name</CFormLabel>
              <CFormInput
                id="userName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder="e.g., Encryption username"
              />
            </CCol>
            <CCol xs={3}>
              <CFormLabel htmlFor="password">Password</CFormLabel>
              <CFormInput
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </CCol>
            <CCol xs={6}>
              <CFormLabel htmlFor="clientId">Client ID</CFormLabel>
              <CFormInput
                id="clientId"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
            </CCol>
            <CCol xs={3}>
              <CFormLabel htmlFor="keepAlive">Keep Alive</CFormLabel>
              <CFormInput
                type="text"
                id="keepAlive"
                value={keepAlive}
                onChange={(e) => setKeepAlive(e.target.value)}
                placeholder="e.g., 60"
              />
            </CCol>
            <CCol xs={3}>
              <CFormLabel htmlFor="qos">QOS</CFormLabel>
              <CFormSelect
                id="qos"
                value={qos}
                onChange={(e) => setQos(e.target.value)}
              >
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
              </CFormSelect>
            </CCol>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton type="submit" color="primary" variant="outline">
            {editIndex !== null ? 'Update' : 'Add'}
          </CButton>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default MQTT;
