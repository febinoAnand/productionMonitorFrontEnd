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
      productionPerHour: '',
      showAddModal: false,
      showUpdateModal: false,
      machineList: [],
      selectedMachine: null,
      successMessage: '',
      errors: {} 
    };
  }

  componentDidMount() {
    this.fetchMachineList();
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

  clearState = () => {
    this.setState({
      machineID: '',
      name: '',
      productionPerHour: '',
      selectedMachine: null,
      errors: {} 
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

  getRowData = (machine) => {
    this.setState({
      selectedMachine: machine,
      machineID: machine.machine_id,
      name: machine.machine_name,
      productionPerHour: machine.production_per_hour,
    });
    this.openUpdateModal();
  }

  displaySuccessMessage = (message) => {
    this.setState({ successMessage: message });
    setTimeout(() => this.setState({ successMessage: '' }), 3000);
  }

  validateForm = () => {
    const { machineID, name, productionPerHour } = this.state;
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

    if (!productionPerHour) {
      errors.productionPerHour = "Production per hour is required";
      isValid = false;
    }

    this.setState({ errors });
    return isValid;
  }

  machinePostData = async () => {
    if (!this.validateForm()) {
      return;
    }

    const { machineID, name, productionPerHour } = this.state;
    try {
      const response = await axios.post(`${BaseURL}devices/machine/`, {
        machine_id: machineID,
        machine_name: name,
        production_per_hour: productionPerHour,
      }, { headers: getAuthHeaders() });
      const newMachine = response.data;
      this.displaySuccessMessage("Machine added successfully!");
      this.setState((prevState) => ({
        machineList: [newMachine, ...prevState.machineList], 
      }));
      this.closeAddModal(); 
    } catch (error) {
      console.error("There was an error adding the machine!", error);
      this.setState({ errors: { submit: "There was an error adding the machine" } });
      this.closeAddModal(); 
    }
  }

  machineUpdateData = async () => {
    if (!this.validateForm()) {
      return;
    }

    const { selectedMachine, machineID, name, productionPerHour } = this.state;

    if (!selectedMachine) {
      console.error("Selected machine data is missing!");
      return;
    }

    try {
      await axios.put(`${BaseURL}devices/machine/${selectedMachine.id}/`, {
        machine_id: machineID,
        machine_name: name,
        production_per_hour: productionPerHour,
      }, { headers: getAuthHeaders() });
      this.displaySuccessMessage("Machine updated successfully!");
      this.closeUpdateModal(); 
      this.fetchMachineList();
    } catch (error) {
      console.error("There was an error updating the machine!", error);
      this.setState({ errors: { submit: "There was an error updating the machine" } });
      this.closeUpdateModal(); 
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
    const { machineList, showAddModal, showUpdateModal, machineID, name, productionPerHour, successMessage, errors } = this.state;

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
                        <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Production Per Hour</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {machineList.length === 0 ? (
                        <CTableRow>
                          <CTableDataCell colSpan="5" className="text-center">
                            No data available
                          </CTableDataCell>
                        </CTableRow>
                      ) : (
                        machineList.map((machine, index) => (
                          <CTableRow key={machine.id}>
                            <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                            <CTableDataCell>{machine.machine_id}</CTableDataCell>
                            <CTableDataCell>{machine.machine_name}</CTableDataCell>
                            <CTableDataCell>{machine.production_per_hour}</CTableDataCell>
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

        {/* Add Machine Modal */}
        <CModal visible={showAddModal} onClose={this.closeAddModal}>
          <CModalHeader>
            <CModalTitle>Add Machine</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <CFormLabel htmlFor="machineID">Machine ID <span style={{ color: 'red' }}>*</span></CFormLabel>
              <CFormInput
                id="machineID"
                value={machineID}
                onChange={this.handleFormData}
                isInvalid={!!errors.machineID}
              />
              <CFormText color="danger">{errors.machineID}</CFormText>

              <CFormLabel htmlFor="name">Name <span style={{ color: 'red' }}>*</span></CFormLabel>
              <CFormInput
                id="name"
                value={name}
                onChange={this.handleFormData}
                isInvalid={!!errors.name}
              />
              <CFormText color="danger">{errors.name}</CFormText>

              <CFormLabel htmlFor="productionPerHour">Production Per Hour <span style={{ color: 'red' }}>*</span></CFormLabel>
              <CFormInput
                id="productionPerHour"
                value={productionPerHour}
                onChange={this.handleFormData}
                isInvalid={!!errors.productionPerHour}
              />
              <CFormText color="danger">{errors.productionPerHour}</CFormText>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" variant='outline' size='sm'onClick={this.closeAddModal}>Close</CButton>
            <CButton color="primary" variant='outline' size='sm'onClick={this.machinePostData}>Save</CButton>
          </CModalFooter>
        </CModal>

        {/* Update Machine Modal */}
        <CModal visible={showUpdateModal} onClose={this.closeUpdateModal}>
          <CModalHeader>
            <CModalTitle>Update Machine</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <CFormLabel htmlFor="machineID">Machine ID <span style={{ color: 'red' }}>*</span></CFormLabel>
              <CFormInput
                id="machineID"
                value={machineID}
                onChange={this.handleFormData}
                isInvalid={!!errors.machineID}
              />
              <CFormText color="danger">{errors.machineID}</CFormText>

              <CFormLabel htmlFor="name">Name <span style={{ color: 'red' }}>*</span></CFormLabel>
              <CFormInput
                id="name"
                value={name}
                onChange={this.handleFormData}
                isInvalid={!!errors.name}
              />
              <CFormText color="danger">{errors.name}</CFormText>

              <CFormLabel htmlFor="productionPerHour">Production Per Hour <span style={{ color: 'red' }}>*</span></CFormLabel>
              <CFormInput
                id="productionPerHour"
                value={productionPerHour}
                onChange={this.handleFormData}
                isInvalid={!!errors.productionPerHour}
              />
              <CFormText color="danger">{errors.productionPerHour}</CFormText>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary"variant='outline' size='sm' onClick={this.closeUpdateModal}>Close</CButton>
            <CButton color="primary" variant='outline' size='sm'onClick={this.machineUpdateData}>Save</CButton>
          </CModalFooter>
        </CModal>
      </div>
    );
  }
}

export default MachineDetails;
