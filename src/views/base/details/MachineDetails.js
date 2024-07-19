import React from 'react';
import BaseURL from 'src/assets/contants/BaseURL';
import { cilPen, cilTrash } from '@coreui/icons';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
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
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CAlert
} from '@coreui/react';
import axios from 'axios';
import CIcon from '@coreui/icons-react';

class MachineDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      machineID: '',
      name: '',
      manufacture: '',
      line: '',
      hmiID: '',
      showAddModal: false,
      showUpdateModal: false,
      deviceList: [],
      machineList: [],
      selectedMachine: {},
      successMessage: ''
    };
  }

  componentDidMount() {
    this.fetchMachineList();
    this.fetchDeviceList();
    this.handleSuccessMessage();
  }

  fetchMachineList = async () => {
    try {
      const response = await axios.get(`${BaseURL}devices/machine/`);
      this.setState({ machineList: response.data });
    } catch (error) {
      console.error("There was an error fetching the machine list!", error);
    }
  }

  fetchDeviceList = async () => {
    try {
      const response = await axios.get(`${BaseURL}devices/device/`);
      this.setState({ deviceList: response.data });
    } catch (error) {
      console.error("There was an error fetching the device list!", error);
    }
  }

  clearState = () => {
    this.setState({
      machineID: '',
      name: '',
      manufacture: '',
      line: '',
      hmiID: '',
      selectedMachine: {},
    });
  }

  toggleAddModal = () => {
    this.setState(prevState => ({
      showAddModal: !prevState.showAddModal
    }));
  }

  toggleUpdateModal = () => {
    this.setState(prevState => ({
      showUpdateModal: !prevState.showUpdateModal
    }), () => {
      if (!this.state.showUpdateModal) {
        this.clearState();
      }
    });
  }

  handleFormData = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  }

  changeDropdown = (e) => {
    this.setState({ hmiID: e.target.value });
  }

  getRowData = (machine) => {
    this.setState({
      selectedMachine: machine,
      machineID: machine.machine_id,
      name: machine.machine_name,
      manufacture: machine.manufacture,
      line: machine.line,
      hmiID: machine.device,
    });
    this.toggleUpdateModal();
  }

  handleSuccessMessage = () => {
    const message = localStorage.getItem('successMessage');
    if (message) {
      this.setState({ successMessage: message });
      localStorage.removeItem('successMessage');
    }
  }

  machinePostData = async () => {
    try {
      await axios.post(`${BaseURL}devices/machine/`, {
        machine_id: this.state.machineID,
        machine_name: this.state.name,
        manufacture: this.state.manufacture,
        line: this.state.line,
        device: this.state.hmiID,
      });
      localStorage.setItem('successMessage', "Machine added successfully!");
      this.toggleAddModal();
      this.fetchMachineList();
      setTimeout(() => window.location.reload(), 100);
    } catch (error) {
      console.error("There was an error adding the machine!", error);
      localStorage.setItem('successMessage', "Failed to add machine!");
      this.toggleAddModal();
      setTimeout(() => window.location.reload(), 100);
    }
  }

  machineUpdateData = async () => {
    const { selectedMachine, machineID, name, manufacture, line, hmiID } = this.state;

    if (!selectedMachine.id) {
      console.error("Selected machine ID is missing!");
      return;
    }

    try {
      await axios.put(`${BaseURL}devices/machine/${selectedMachine.id}/`, {
        machine_id: machineID,
        machine_name: name,
        manufacture: manufacture,
        line: line,
        device: hmiID,
      });
      localStorage.setItem('successMessage', "Machine updated successfully!");
      this.toggleUpdateModal();
      this.fetchMachineList();
      window.location.reload();
    } catch (error) {
      console.error("There was an error updating the machine!", error);
      this.toggleUpdateModal();
      window.location.reload();
    }
  }

  machineDeleteData = async (machineId) => {
    try {
      await axios.delete(`${BaseURL}devices/machine/${machineId}/`);
      localStorage.setItem('successMessage', "Machine deleted successfully!");
      this.fetchMachineList();
      window.location.reload();
    } catch (error) {
      console.error("There was an error deleting the machine!", error);
      localStorage.setItem('successMessage', "Failed to delete machine!");
      window.location.reload();
    }
  }

  render() {
    const { machineList, deviceList, showAddModal, showUpdateModal, machineID, name, manufacture, line, hmiID, successMessage } = this.state;

    return (
      <>
        <CRow>
        {successMessage && (
                  <CAlert color="success" dismissible onClose={() => this.setState({ successMessage: '' })}>
                    {successMessage}
                  </CAlert>
                )}
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Machine List</strong>
                <CButton color='success' variant='outline' className='float-end' onClick={this.toggleAddModal}>Add Machine</CButton>
              </CCardHeader>
              <CCardBody>
                <CTable striped hover>
                  <CTableHead>
                    <CTableRow color="dark">
                      <CTableHeaderCell scope="col">Si.No</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Machine ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Device ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Manufacture</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Line</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {machineList.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan="7" className="text-center">
                          No data available
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      machineList.map((machine, index) => (
                        <CTableRow key={machine.id}>
                          <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                          <CTableDataCell>{machine.machine_id}</CTableDataCell>
                          <CTableDataCell>{machine.device}</CTableDataCell>
                          <CTableDataCell>{machine.machine_name}</CTableDataCell>
                          <CTableDataCell>{machine.manufacture}</CTableDataCell>
                          <CTableDataCell>{machine.line}</CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex gap-2">
                              <CButton onClick={() => this.getRowData(machine)}>
                                <CIcon icon={cilPen} />
                              </CButton>
                              <CButton onClick={() => this.machineDeleteData(machine.id)}>
                                <CIcon icon={cilTrash} />
                              </CButton>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    )}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CModal visible={showAddModal} size='lg' onClose={this.toggleAddModal}>
          <CModalHeader>
            <CModalTitle>Add Machine Details</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm className="row g-3">
              <CCol md={3}>
                <CFormLabel htmlFor="machineID">Machine ID</CFormLabel>
                <CFormInput id="machineID" placeholder="eg: MAC5632" value={machineID} onChange={this.handleFormData} />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="name">Name</CFormLabel>
                <CFormInput id="name" placeholder="" value={name} onChange={this.handleFormData} />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="manufacture">Manufacture</CFormLabel>
                <CFormInput id="manufacture" placeholder="" value={manufacture} onChange={this.handleFormData} />
              </CCol>
              <CCol xs={3}>
                <CFormLabel htmlFor="line">Line</CFormLabel>
                <CFormInput id="line" placeholder="eg: 1, 2, 3" value={line} onChange={this.handleFormData} />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="Device">Device</CFormLabel>
                <CFormSelect id="Device" value={hmiID} onChange={this.changeDropdown}>
                  <option value="">Select Device</option>
                  {deviceList.map((device) => (
                    <option key={device.id} value={device.id}>{device.device_name}</option>
                  ))}
                </CFormSelect>
              </CCol>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={this.toggleAddModal}>Close</CButton>
            <CButton color="primary" onClick={this.machinePostData}>Add Machine</CButton>
          </CModalFooter>
        </CModal>
        <CModal visible={showUpdateModal} size='lg' onClose={this.toggleUpdateModal}>
          <CModalHeader>
            <CModalTitle>Update Machine Details</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm className="row g-3">
              <CCol md={3}>
                <CFormLabel htmlFor="machineID">Machine ID</CFormLabel>
                <CFormInput id="machineID" placeholder="eg: MAC5632" value={machineID} onChange={this.handleFormData} />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="name">Name</CFormLabel>
                <CFormInput id="name" placeholder="" value={name} onChange={this.handleFormData} />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="manufacture">Manufacture</CFormLabel>
                <CFormInput id="manufacture" placeholder="" value={manufacture} onChange={this.handleFormData} />
              </CCol>
              <CCol xs={3}>
                <CFormLabel htmlFor="line">Line</CFormLabel>
                <CFormInput id="line" placeholder="eg: 1, 2, 3" value={line} onChange={this.handleFormData} />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="Device">Device</CFormLabel>
                <CFormSelect id="Device" value={hmiID} onChange={this.changeDropdown}>
                  <option value="">Select Device</option>
                  {deviceList.map((device) => (
                    <option key={device.id} value={device.id}>{device.device_name}</option>
                  ))}
                </CFormSelect>
              </CCol>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={this.toggleUpdateModal}>Close</CButton>
            <CButton color="primary" onClick={this.machineUpdateData}>Update Machine</CButton>
          </CModalFooter>
        </CModal>
      </>
    );
  }
}

export default MachineDetails;