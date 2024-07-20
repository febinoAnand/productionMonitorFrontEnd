import React, { useState, useEffect } from 'react';
import { cilPen, cilTrash } from '@coreui/icons';
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
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CButton
} from '@coreui/react';
import CIcon from '@coreui/icons-react';

const MQTT = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [host, setHost] = useState('');
  const [port, setPort] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [serverNameAlias, setServerNameAlias] = useState('');
  const [keepAlive, setKeepAlive] = useState('60');
  const [qos, setQos] = useState('0');
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchConfigurations();
  }, []);

  const fetchConfigurations = async () => {
    try {
      const response = await fetch('https://productionb.univa.cloud/config/mqttsettings/');
      if (response.ok) {
        const configurations = await response.json();
        setData(configurations);
      } else {
        console.error('Failed to fetch configurations');
      }
    } catch (error) {
      console.error('Error fetching configurations:', error);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const newEntry = {
      id: editIndex !== null ? editIndex : Date.now(),
      host,
      port,
      username: userName,
      password,
      server_name_alias: serverNameAlias,
      keepalive: keepAlive,
      qos
    };

    if (editIndex !== null) {
      setData((prevData) =>
        prevData.map((item) => (item.id === editIndex ? newEntry : item))
      );
    } else {
      setData((prevData) => [...prevData, newEntry]);
    }

    setModalVisible(false);
    resetForm();
  };

  const handleEdit = (id) => {
    const entry = data.find((item) => item.id === id);
    setHost(entry.host);
    setPort(entry.port);
    setUserName(entry.username);
    setPassword(entry.password);
    setServerNameAlias(entry.server_name_alias);
    setKeepAlive(entry.keepalive);
    setQos(entry.qos);
    setEditIndex(id);
    setModalVisible(true);
  };

  const handleDelete = (id) => {
    setData((prevData) => prevData.filter((item) => item.id !== id));
  };

  const resetForm = () => {
    setHost('');
    setPort('');
    setUserName('');
    setPassword('');
    setServerNameAlias('');
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
                color="success"
                variant="outline"
                className="float-end"
                onClick={() => setModalVisible(true)}
              >
                Add Configuration
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
                    <CTableHeaderCell scope="col">Server Name Alias</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Keep Alive</CTableHeaderCell>
                    <CTableHeaderCell scope="col">QOS</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data.map((entry) => (
                    <CTableRow key={entry.id}>
                      <CTableDataCell>{entry.host}</CTableDataCell>
                      <CTableDataCell>{entry.port}</CTableDataCell>
                      <CTableDataCell>{entry.username}</CTableDataCell>
                      <CTableDataCell>{entry.password}</CTableDataCell>
                      <CTableDataCell>{entry.server_name_alias}</CTableDataCell>
                      <CTableDataCell>{entry.keepalive}</CTableDataCell>
                      <CTableDataCell>{entry.qos}</CTableDataCell>
                      <CTableDataCell>
                            <div className="d-flex gap-2">
                              <CButton  onClick={() => handleEdit(entry.id)}>
                                <CIcon icon={cilPen} />
                              </CButton>
                              <CButton onClick={() => handleDelete(entry.id)}>
                                <CIcon icon={cilTrash} />
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
          <CModalTitle>{editIndex !== null ? 'Edit MQTT Configuration' : 'Add MQTT Configuration'}</CModalTitle>
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
                value={keepAlive}
                onChange={(e) => setKeepAlive(e.target.value)}
                placeholder="e.g., 60"
              />
            </CCol>
            <CCol md={3}>
              <CFormLabel htmlFor="qos">QOS</CFormLabel>
              <CFormInput
                id="qos"
                value={qos}
                onChange={(e) => setQos(e.target.value)}
                placeholder="e.g., 0"
              />
            </CCol>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleSubmit}>
            {editIndex !== null ? 'Update' : 'Add'}
          </CButton>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default MQTT;
