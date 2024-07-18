import React from 'react';
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
  CFormSelect,
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
import axios from 'axios';

class MachineDetails extends React.Component {
  state = {
    machineList: [],
    hmiList: [],
    url: BaseURL + 'devices/machine/',
    id: 0,
    line: '',
    machineID: '',
    manufacture: '',
    model: '',
    name: '',
    Device: {},
    hmiID: 0,
    showModal: false,
  };

  componentDidMount() {
    this.updateMachineTable();
  }

  machineDeleteData = (id) => {
    axios.delete(this.state.url + id + '/')
      .then((res) => {
        this.updateMachineTable();
        this.clearState();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  machineUpdateData = (event) => {
    event.preventDefault();
    axios.put(this.state.url + this.state.id + '/', this.state)
      .then((res) => {
        this.updateMachineTable();
        this.clearState();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  clearState = () => {
    this.setState({
      id: '',
      line: '',
      machineID: '',
      manufacture: '',
      model: '',
      name: '',
      Device: {},
      hmiID: 0,
    });
  };

  updateMachineTable = () => {
    axios.get(this.state.url)
      .then((res) => {
        this.setState({
          machineList: res.data,
        });
      });

    axios.get(BaseURL + 'devices/device/')
      .then((res) => {
        this.setState({
          hmiList: res.data,
        });
      });
  };

  machinePostData = (event) => {
    event.preventDefault();
    axios.post(this.state.url, this.state)
      .then((res) => {
        this.updateMachineTable();
      })
      .catch((err) => {
        console.log(err);
      });
    this.clearState();
  };

  handleFormData = (event) => {
    this.setState({ [event.target.id]: event.target.value });
  };

  changeDropdown = (event) => {
    this.setState({
      hmiID: event.target.value,
      Device: { id: event.target.value },
    });
  };

  getRowData = (machine) => {
    this.setState({
      id: machine.id,
      line: machine.line,
      machineID: machine.machineID,
      manufacture: machine.manufacture,
      model: machine.model,
      name: machine.name,
      Device: machine.device,
      hmiID: machine.device.id,
      showModal: true,
    });
  };

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  };

  render() {
    return (
      <>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Machine List</strong>
                <CButton className="float-end" onClick={this.toggleModal}>Add Machine</CButton>
              </CCardHeader>
              <CCardBody>
                <CTable striped hover>
                <CTableHead color='dark'>
                    <CTableRow>
                      <CTableHeaderCell scope="col">#</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Machine ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Device ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Manufacture</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Model</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Line</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {this.state.machineList.map((machine, index) => (
                      <CTableRow key={machine.id}>
                        <CTableDataCell>{index + 1}</CTableDataCell>
                        <CTableDataCell>{machine.machineID}</CTableDataCell>
                        <CTableDataCell>{machine.device.id}</CTableDataCell>
                        <CTableDataCell>{machine.name}</CTableDataCell>
                        <CTableDataCell>{machine.manufacture}</CTableDataCell>
                        <CTableDataCell>{machine.model}</CTableDataCell>
                        <CTableDataCell>{machine.line}</CTableDataCell>
                        <CTableDataCell>
                          <CButton color="info" size="sm" onClick={() => this.getRowData(machine)}>Edit</CButton>
                          {' '}
                          <CButton color="danger" size="sm" onClick={() => this.machineDeleteData(machine.id)}>Delete</CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
                <CModal visible={this.state.showModal} onClose={this.toggleModal}>
                  <CModalHeader>
                    <CModalTitle>{this.state.id ? 'Update Machine' : 'Add Machine'}</CModalTitle>
                  </CModalHeader>
                  <CForm onSubmit={this.state.id ? this.machineUpdateData : this.machinePostData}>
                    <CModalBody>
                      <CFormLabel htmlFor="machineID">Machine ID</CFormLabel>
                      <CFormInput
                        type="text"
                        id="machineID"
                        value={this.state.machineID}
                        onChange={this.handleFormData}
                      />
                      <CFormLabel htmlFor="name">Name</CFormLabel>
                      <CFormInput
                        type="text"
                        id="name"
                        value={this.state.name}
                        onChange={this.handleFormData}
                      />
                      <CFormLabel htmlFor="manufacture">Manufacture</CFormLabel>
                      <CFormInput
                        type="text"
                        id="manufacture"
                        value={this.state.manufacture}
                        onChange={this.handleFormData}
                      />
                      <CFormLabel htmlFor="model">Model</CFormLabel>
                      <CFormInput
                        type="text"
                        id="model"
                        value={this.state.model}
                        onChange={this.handleFormData}
                      />
                      <CFormLabel htmlFor="line">Line</CFormLabel>
                      <CFormInput
                        type="text"
                        id="line"
                        value={this.state.line}
                        onChange={this.handleFormData}
                      />
                      <CFormLabel htmlFor="hmiID">HMI Device</CFormLabel>
                      <CFormSelect id="hmiID" value={this.state.hmiID} onChange={this.changeDropdown}>
                        <option>Select HMI Device</option>
                        {this.state.hmiList.map((device) => (
                          <option key={device.id} value={device.id}>
                            {device.name}
                          </option>
                        ))}
                      </CFormSelect>
                    </CModalBody>
                    <CModalFooter>
                      <CButton color="secondary" onClick={this.toggleModal}>Close</CButton>
                      <CButton type="submit" color="primary">{this.state.id ? 'Update' : 'Add'}</CButton>
                    </CModalFooter>
                  </CForm>
                </CModal>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    );
  }
}

export default MachineDetails;
