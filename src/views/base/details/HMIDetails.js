import React from 'react';
import axios from 'axios';
import BaseURL from 'src/assets/contants/BaseURL';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';

class HMIDetails extends React.Component {
  state = {
    hmiList: [],
    url: BaseURL + 'devices/device/',
    id: '',
    deviceID: '',
    model: '',
    hardwareVersion: '',
    softwareVersion: '',
    protocol: '',
    pubTopic: '',
    subTopic: '',
    apiPath: '',
    showModal: false,
    modalMode: 'add', // 'add' or 'update'
  };

  componentDidMount() {
    this.updateValueInTable();
  }

  updateValueInTable = () => {
    axios.get(this.state.url)
      .then(res => {
        this.setState({ hmiList: res.data });
      })
      .catch(err => console.log(err));
  };

  clearState = () => {
    this.setState({
      id: '',
      deviceID: '',
      model: '',
      hardwareVersion: '',
      softwareVersion: '',
      protocol: '',
      pubTopic: '',
      subTopic: '',
      apiPath: '',
    });
  };

  handleFormData = (event) => {
    this.setState({ [event.target.id]: event.target.value });
  };

  toggleModal = (mode = 'add') => {
    this.setState({
      showModal: !this.state.showModal,
      modalMode: mode,
    });
  };

  addHMIPost = (event) => {
    event.preventDefault();
    axios.post(this.state.url, this.state)
      .then(() => {
        this.updateValueInTable();
        this.clearState();
        this.toggleModal();
      })
      .catch(err => {
        console.log("Error", err.response?.data?.deviceID || err);
        alert(err.response?.data?.deviceID || "An error occurred");
      });
  };

  updateValue = (event) => {
    event.preventDefault();
    axios.put(this.state.url + this.state.id + '/', this.state)
      .then(() => {
        this.updateValueInTable();
        this.clearState();
        this.toggleModal();
      })
      .catch(err => console.log(err));
  };

  deleteValue = (event) => {
    event.preventDefault();
    axios.delete(this.state.url + this.state.id + '/')
      .then(() => {
        this.updateValueInTable();
        this.clearState();
        this.toggleModal();
      })
      .catch(err => console.log(err));
  };

  getRowValue = (hmi) => {
    this.setState({
      id: hmi.id,
      deviceID: hmi.deviceID,
      model: hmi.model,
      hardwareVersion: hmi.hardwareVersion,
      softwareVersion: hmi.softwareVersion,
      protocol: hmi.protocol,
      pubTopic: hmi.pubTopic,
      subTopic: hmi.subTopic,
      apiPath: hmi.apiPath,
      showModal: true,
      modalMode: 'update',
    });
  };

  render() {
    return (
      <>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>HMI Details</strong>
                <CButton className="float-end" onClick={() => this.toggleModal('add')}>Add Device</CButton>
              </CCardHeader>
              <CCardBody>
                <CTable striped hover>
                <CTableHead color='dark'>
                    <CTableRow>
                      <CTableHeaderCell scope="col">#</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Device ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Hardware Version</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Software Version</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Model</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Protocol</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Pub Topic</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Sub Topic</CTableHeaderCell>
                      <CTableHeaderCell scope="col">API Path</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {this.state.hmiList.map((hmi, index) => (
                      <CTableRow key={hmi.id}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{hmi.deviceID}</CTableDataCell>
                        <CTableDataCell>{hmi.hardwareVersion}</CTableDataCell>
                        <CTableDataCell>{hmi.softwareVersion}</CTableDataCell>
                        <CTableDataCell>{hmi.model}</CTableDataCell>
                        <CTableDataCell>{hmi.protocol}</CTableDataCell>
                        <CTableDataCell>{hmi.pubTopic}</CTableDataCell>
                        <CTableDataCell>{hmi.subTopic}</CTableDataCell>
                        <CTableDataCell>{hmi.apiPath}</CTableDataCell>
                        <CTableDataCell>
                          <CButton
                            color="warning"
                            onClick={() => this.getRowValue(hmi)}
                          >
                            Update
                          </CButton>
                          <CButton
                            color="danger"
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this item?')) {
                                this.setState({ id: hmi.id }, this.deleteValue);
                              }
                            }}
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

        <CModal visible={this.state.showModal} onClose={() => this.toggleModal()}>
          <CModalHeader>
            <CModalTitle>{this.state.modalMode === 'update' ? 'Update Device' : 'Add Device'}</CModalTitle>
          </CModalHeader>
          <CForm onSubmit={this.state.modalMode === 'update' ? this.updateValue : this.addHMIPost}>
            <CModalBody>
              <CFormLabel htmlFor="deviceID">Device ID</CFormLabel>
              <CFormInput
                type="text"
                id="deviceID"
                value={this.state.deviceID}
                onChange={this.handleFormData}
                readOnly={this.state.modalMode === 'update'}
              />
              <CFormLabel htmlFor="model">Model</CFormLabel>
              <CFormInput
                type="text"
                id="model"
                value={this.state.model}
                onChange={this.handleFormData}
              />
              <CFormLabel htmlFor="hardwareVersion">Hardware Version</CFormLabel>
              <CFormInput
                type="text"
                id="hardwareVersion"
                value={this.state.hardwareVersion}
                onChange={this.handleFormData}
              />
              <CFormLabel htmlFor="softwareVersion">Software Version</CFormLabel>
              <CFormInput
                type="text"
                id="softwareVersion"
                value={this.state.softwareVersion}
                onChange={this.handleFormData}
              />
              <CFormLabel htmlFor="protocol">Protocol</CFormLabel>
              <CFormInput
                type="text"
                id="protocol"
                value={this.state.protocol}
                onChange={this.handleFormData}
              />
              <CFormLabel htmlFor="pubTopic">Pub Topic</CFormLabel>
              <CFormInput
                type="text"
                id="pubTopic"
                value={this.state.pubTopic}
                onChange={this.handleFormData}
              />
              <CFormLabel htmlFor="subTopic">Sub Topic</CFormLabel>
              <CFormInput
                type="text"
                id="subTopic"
                value={this.state.subTopic}
                onChange={this.handleFormData}
              />
              <CFormLabel htmlFor="apiPath">API Path</CFormLabel>
              <CFormInput
                type="text"
                id="apiPath"
                value={this.state.apiPath}
                onChange={this.handleFormData}
              />
            </CModalBody>
            <CModalFooter>
              {this.state.modalMode === 'update' && (
                <CButton color="danger" onClick={this.deleteValue}>
                  Delete
                </CButton>
              )}
              <CButton color="secondary" onClick={() => this.toggleModal()}>Close</CButton>
              <CButton type="submit" color="primary">
                {this.state.modalMode === 'update' ? 'Update' : 'Add'}
              </CButton>
            </CModalFooter>
          </CForm>
        </CModal>
      </>
    );
  }
}

export default HMIDetails;
