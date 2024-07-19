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
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react';

const HTTP = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [responseData, setResponseData] = useState(null);

  return (
    <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong> Httpsettings</strong>
              <CButton
                color="primary"
                variant="outline"
                className="float-end"
                onClick={() => setModalVisible(true)}
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
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {/* Your table data would go here */}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)} size="xl">
        <CModalHeader>
          <CModalTitle>Configure Settings</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CForm className="row g-3">
            <CCol xs={12}>
              <CFormLabel htmlFor="authToken">Authorization Token:</CFormLabel>
              <CFormInput id="authToken" placeholder="Enter Authorization Token" size="lg" />
            </CCol>
            <CCol xs={12}>
              <CFormLabel htmlFor="apiPath">API Path:</CFormLabel>
              <CFormInput id="apiPath" placeholder="Enter API Path" size="lg" />
            </CCol>
            <CCol xs={12}>
              <CButton type="submit" color="primary" variant="outline">
                Save
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
