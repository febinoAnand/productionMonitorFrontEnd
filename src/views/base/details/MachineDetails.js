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
      selectedMachine: null,
      successMessage: ''
    };
  }

  componentDidMount() {
    this.fetchMachineList();
    this.fetchDeviceList();
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
      selectedMachine: null,
    });
  }

  openAddModal = () => {
    this.setState({ showAddModal: true });
  }

  closeAddModal = () => {
    this.setState({ showAddModal: false });
  }

  openUpdateModal = () => {
    this.setState({ showUpdateModal: true });
  }

  closeUpdateModal = () => {
    this.setState({ showUpdateModal: false }, this.clearState);
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
    this.openUpdateModal();
  }

  displaySuccessMessage = (message) => {
    this.setState({ successMessage: message });
    setTimeout(() => this.setState({ successMessage: '' }), 3000);
  }

  machinePostData = async () => {
    const { machineID, name, manufacture, line, hmiID } = this.state;
    try {
      const response = await axios.post(`${BaseURL}devices/machine/`, {
        machine_id: machineID,
        machine_name: name,
        manufacture: manufacture,
        line: line,
        device: hmiID,
      });
      const newMachine = response.data;
      this.displaySuccessMessage("Machine added successfully!");
      this.setState((prevState) => ({
        machineList: [newMachine, ...prevState.machineList],
      }));
      this.closeAddModal();
    } catch (error) {
      console.error("There was an error adding the machine!", error);
      this.closeAddModal();
    }
  }

  machineUpdateData = async () => {
    const { selectedMachine, machineID, name, manufacture, line, hmiID } = this.state;

    if (!selectedMachine) {
      console.error("Selected machine data is missing!");
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
      this.displaySuccessMessage("Machine updated successfully!");
      this.closeUpdateModal();
      this.fetchMachineList();
    } catch (error) {
      console.error("There was an error updating the machine!", error);
      this.closeUpdateModal();
    }
  }

  machineDeleteData = async (machineId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this machine?");
    
    if (!confirmDelete) {
      return;
    }
  
    try {
      await axios.delete(`${BaseURL}devices/machine/${machineId}/`);
      this.displaySuccessMessage("Machine deleted successfully!");
      this.fetchMachineList();
    } catch (error) {
      console.error("There was an error deleting the machine!", error);
    }
  }

  render() {
    const { machineList, deviceList, showAddModal, showUpdateModal, machineID, name, manufacture, line, hmiID, successMessage } = this.state;

    return (
      <div className="page">
        <CRow>
          {successMessage && (
            <CAlert color="success" dismissible onClose={() => this.setState({ successMessage: '' })}>
              {successMessage}
            </CAlert>
          )}
          <CCol xs={12}>
            <CCard className="mb-4">
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <CCardHeader>
                <strong>Machine List</strong>
                <CButton color='success' variant='outline' size='sm' className='float-end' onClick={this.openAddModal}>Add Machine</CButton>
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
                              <CButton color="primary" size='sm' onClick={() => this.getRowData(machine)}>
                                <CIcon icon={cilPen} />
                              </CButton>
                              <CButton color="primary" size='sm' onClick={() => this.machineDeleteData(machine.id)}>
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
              </div>
            </CCard>
          </CCol>
        </CRow>

        <CModal visible={showAddModal} size='lg' onClose={this.closeAddModal}>
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
            <CButton color="secondary" size='sm' onClick={this.closeAddModal}>Close</CButton>
            <CButton color="primary" variant='outline' size='sm' onClick={this.machinePostData}>Add Machine</CButton>
          </CModalFooter>
        </CModal>

        <CModal visible={showUpdateModal} size='lg' onClose={this.closeUpdateModal}>
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
            <CButton color="secondary" size='sm' onClick={this.closeUpdateModal}>Close</CButton>
            <CButton color="primary" size='sm' onClick={this.machineUpdateData}>Update Machine</CButton>
          </CModalFooter>
        </CModal>
      </div>
    )
  }
}

export default MachineDetails;
