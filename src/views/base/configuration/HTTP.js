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

const HTTP = ({ authToken, apiPath }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [responseData, setResponseData] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    const requestOptions = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    };

    fetch(apiPath, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        setResponseData(data);
        setModalVisible(false); // close the config modal
      })
      .catch((error) => console.error('Error:', error));
  };

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>HTTP Request Details</strong>
            <CButton
              color="primary"
              variant="outline"
              className="float-end"
              onClick={() => setModalVisible(true)}
            >
              Configure Request
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable striped hover>
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell scope="col">Auth Token</CTableHeaderCell>
                  <CTableHeaderCell scope="col">API Path</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell>{authToken}</CTableDataCell>
                  <CTableDataCell>{apiPath}</CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>HTTP Request Configuration</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm onSubmit={handleSubmit} className="row g-3">
            <CCol xs={12}>
              <CFormLabel>Authorization Token:</CFormLabel>
              <CFormInput id="authToken" value={authToken} />
            </CCol>
            <CCol xs={12}>
              <CFormLabel>API Path:</CFormLabel>
              <CFormInput id="apiPath" value={apiPath} />
            </CCol>
            <CCol xs={12}>
              <CButton type="submit" color="primary" variant="outline">
                Send Request
              </CButton>
            </CCol>
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

      {responseData && (
        <CModal visible={true} onClose={() => setResponseData(null)}>
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
    </CRow>
  );
};

export default HTTP;