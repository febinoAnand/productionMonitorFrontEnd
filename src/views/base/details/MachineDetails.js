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
  CFormText,
  CAlert
} from '@coreui/react';
import axios from 'axios';
import CIcon from '@coreui/icons-react';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
  };
};

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
      successMessage: '',
      errors: {} // Added errors state
    };
  }

  componentDidMount() {
    this.fetchMachineList();
    this.fetchDeviceList();
  }

  fetchMachineList = async () => {
    try {
      const response = await axios.get(`${BaseURL}devices/machine/`, { headers: getAuthHeaders() });
      const sortedData = response.data.reverse(); 
      this.setState({ machineList: sortedData });
    } catch (error) {
      console.error("There was an error fetching the machine list!", error);
    }
  }

  fetchDeviceList = async () => {
    try {
      const response = await axios.get(`${BaseURL}devices/device/`, { headers: getAuthHeaders() });
      const sortedData = response.data.reverse(); // Reverse the data
      this.setState({ deviceList: sortedData });
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
      errors: {} // Clear errors on form close
    });
  }

  openAddModal = () => {
    this.setState({ showAddModal: true });
  }

  closeAddModal = () => {
    this.setState({ showAddModal: false }, this.clearState);
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

  validateForm = () => {
    const { machineID, name, manufacture, line, hmiID } = this.state;
    let errors = {};
    let isValid = true;

    if (!machineID) {
      errors.machineID = "Machine ID is required";
      isValid = false;
    }

    if (!name) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!manufacture) {
      errors.manufacture = "Manufacture is required";
      isValid = false;
    }

    if (!line) {
      errors.line = "Line is required";
      isValid = false;
    }

    if (!hmiID) {
      errors.hmiID = "Device is required";
      isValid = false;
    }

    this.setState({ errors });
    return isValid;
  }

  machinePostData = async () => {
    if (!this.validateForm()) {
      return;
    }

    const { machineID, name, manufacture, line, hmiID } = this.state;
    try {
      const response = await axios.post(`${BaseURL}devices/machine/`, {
        machine_id: machineID,
        machine_name: name,
        manufacture: manufacture,
        line: line,
        device: hmiID,
      }, { headers: getAuthHeaders() });
      const newMachine = response.data;
      this.displaySuccessMessage("Machine added successfully!");
      this.setState((prevState) => ({
        machineList: [newMachine, ...prevState.machineList], // New machine added to the top
      }));
      this.closeAddModal(); // Close the modal on success
    } catch (error) {
      console.error("There was an error adding the machine!", error);
      this.setState({ errors: { submit: "There was an error adding the machine" } });
      this.closeAddModal(); // Close the modal on error
    }
  }

  machineUpdateData = async () => {
    if (!this.validateForm()) {
      return;
    }

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
      }, { headers: getAuthHeaders() });
      this.displaySuccessMessage("Machine updated successfully!");
      this.closeUpdateModal(); // Close the modal on success
      this.fetchMachineList();
    } catch (error) {
      console.error("There was an error updating the machine!", error);
      this.setState({ errors: { submit: "There was an error updating the machine" } });
      this.closeUpdateModal(); // Close the modal on error
    }
  }

  machineDeleteData = async (machineId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this machine?");
    
    if (!confirmDelete) {
      return;
    }
  
    try {
      await axios.delete(`${BaseURL}devices/machine/${machineId}/`, { headers: getAuthHeaders() });
      this.displaySuccessMessage("Machine deleted successfully!");
      this.fetchMachineList();
    } catch (error) {
      console.error("There was an error deleting the machine!", error);
    }
  }

  render() {
    const { machineList, deviceList, showAddModal, showUpdateModal, machineID, name, manufacture, line, hmiID, successMessage, errors } = this.state;

    return (
      <div className="page">
        <CRow>
          {successMessage && (
            <CAlert color="success" dismissible onClose={() => this.setState({ successMessage: '' })}>
              {successMessage}
            </CAlert>
          )}
          {errors.submit && (
            <CAlert color="danger" dismissible onClose={() => this.setState({ errors: { submit: '' } })}>
              {errors.submit}
            </CAlert>
          )}
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Machine List</strong>
                <CButton color='success' variant='outline' size='sm' className='float-end' onClick={this.openAddModal}>Add Machine</CButton>
              </CCardHeader>
              <CCardBody>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <CTable striped hover>
                    <CTableHead>
                      <CTableRow color="dark">
                        <CTableHeaderCell scope="col">Si.No</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Machine ID</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Device Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Manufacture</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Line</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {machineList.length === 0 ? (
                        <CTableRow>
                          <CTableDataCell colSpan="6" className="text-center">
                            No data available
                          </CTableDataCell>
                        </CTableRow>
                      ) : (
                        machineList.map((machine, index) => (
                          <CTableRow key={machine.id}>
                            <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                            <CTableDataCell>{machine.machine_id}</CTableDataCell>
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
                </div>
              </CCardBody>
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
                <CFormLabel htmlFor="machineID">Machine ID <span className="text-danger">*</span></CFormLabel>
                <CFormInput id="machineID" placeholder="eg: MAC5632" value={machineID} onChange={this.handleFormData} isInvalid={!!errors.machineID} />
                {errors.machineID && <CFormText className="text-danger">{errors.machineID}</CFormText>}
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="name">Name <span className="text-danger">*</span></CFormLabel>
                <CFormInput id="name" placeholder="" value={name} onChange={this.handleFormData} isInvalid={!!errors.name} />
                {errors.name && <CFormText className="text-danger">{errors.name}</CFormText>}
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="manufacture">Manufacture <span className="text-danger">*</span></CFormLabel>
                <CFormInput id="manufacture" placeholder="" value={manufacture} onChange={this.handleFormData} isInvalid={!!errors.manufacture} />
                {errors.manufacture && <CFormText className="text-danger">{errors.manufacture}</CFormText>}
              </CCol>
              <CCol xs={3}>
                <CFormLabel htmlFor="line">Line <span className="text-danger">*</span></CFormLabel>
                <CFormInput id="line" placeholder="eg: 1, 2, 3" value={line} onChange={this.handleFormData} isInvalid={!!errors.line} />
                {errors.line && <CFormText className="text-danger">{errors.line}</CFormText>}
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="Device">Device <span className="text-danger">*</span></CFormLabel>
                <CFormSelect id="Device" value={hmiID} onChange={this.changeDropdown} isInvalid={!!errors.hmiID}>
                  <option value="">Select Device</option>
                  {deviceList.map((device) => (
                    <option key={device.id} value={device.id}>{device.device_name}</option>
                  ))}
                </CFormSelect>
                {errors.hmiID && <CFormText className="text-danger">{errors.hmiID}</CFormText>}
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
                <CFormLabel htmlFor="machineID">Machine ID <span className="text-danger">*</span></CFormLabel>
                <CFormInput id="machineID" placeholder="eg: MAC5632" value={machineID} onChange={this.handleFormData} isInvalid={!!errors.machineID} />
                {errors.machineID && <CFormText className="text-danger">{errors.machineID}</CFormText>}
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="name">Name <span className="text-danger">*</span></CFormLabel>
                <CFormInput id="name" placeholder="" value={name} onChange={this.handleFormData} isInvalid={!!errors.name} />
                {errors.name && <CFormText className="text-danger">{errors.name}</CFormText>}
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="manufacture">Manufacture <span className="text-danger">*</span></CFormLabel>
                <CFormInput id="manufacture" placeholder="" value={manufacture} onChange={this.handleFormData} isInvalid={!!errors.manufacture} />
                {errors.manufacture && <CFormText className="text-danger">{errors.manufacture}</CFormText>}
              </CCol>
              <CCol xs={3}>
                <CFormLabel htmlFor="line">Line <span className="text-danger">*</span></CFormLabel>
                <CFormInput id="line" placeholder="eg: 1, 2, 3" value={line} onChange={this.handleFormData} isInvalid={!!errors.line} />
                {errors.line && <CFormText className="text-danger">{errors.line}</CFormText>}
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="Device">Device <span className="text-danger">*</span></CFormLabel>
                <CFormSelect id="Device" value={hmiID} onChange={this.changeDropdown} isInvalid={!!errors.hmiID}>
                  <option value="">Select Device</option>
                  {deviceList.map((device) => (
                    <option key={device.id} value={device.id}>{device.device_name}</option>
                  ))}
                </CFormSelect>
                {errors.hmiID && <CFormText className="text-danger">{errors.hmiID}</CFormText>}
              </CCol>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" size='sm' onClick={this.closeUpdateModal}>Close</CButton>
            <CButton color="primary" size='sm' onClick={this.machineUpdateData}>Update Machine</CButton>
          </CModalFooter>
        </CModal>
      </div>
    );
  }
}

export default MachineDetails;
