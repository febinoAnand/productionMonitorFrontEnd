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

class ShiftTiming extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      successMessage: '',
      shiftData: [],
      showAddModal: false,
      showUpdateModal: false,
      currentShift: null,
      newShift: {
        shift_name: '',
        shift_number: '',
        start_time: '',
        end_time: ''
      }
    };
  }

  componentDidMount() {
    this.fetchShiftData();
    this.applyHeaderStyles();
  }

  fetchShiftData = async () => {
    try {
      const response = await axios.get(`${BaseURL}devices/shifttimings/`, { headers: getAuthHeaders() });
      const sortedData = response.data.reverse();
      this.setState({ shiftData: sortedData });
    } catch (error) {
      console.error("Error fetching shift data", error);
    }
  }

  openAddModal = () => {
    this.setState({ showAddModal: true });
  }

  closeAddModal = () => {
    this.setState({ showAddModal: false });
  }

  openUpdateModal = (shift) => {
    this.setState({ showUpdateModal: true, currentShift: shift });
  }

  closeUpdateModal = () => {
    this.setState({ showUpdateModal: false, currentShift: null });
  }

  handleFormData = (e) => {
    const { id, value } = e.target;
    this.setState(prevState => ({
      newShift: {
        ...prevState.newShift,
        [id]: value
      }
    }));
  }

  handleUpdateData = (e) => {
    const { id, value } = e.target;
    this.setState(prevState => ({
      currentShift: {
        ...prevState.currentShift,
        [id]: value
      }
    }));
  }

  addShift = async () => {
    try {
      await axios.post(`${BaseURL}devices/shifttimings/`, this.state.newShift, { headers: getAuthHeaders() });
      this.displaySuccessMessage('Shift added successfully');
      this.fetchShiftData();
      this.closeAddModal();
    } catch (error) {
      console.error("Error adding shift", error);
    }
  }

  updateShift = async () => {
    try {
      const { currentShift } = this.state;
      await axios.put(`${BaseURL}devices/shifttimings/${currentShift._id}/`, currentShift, { headers: getAuthHeaders() });
      this.displaySuccessMessage('Shift updated successfully');
      this.fetchShiftData();
      this.closeUpdateModal();
    } catch (error) {
      console.error("Error updating shift", error);
    }
  }

  deleteShift = async (shiftId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this shift?");
    
    if (!confirmDelete) {
      return;
    }

    try {
      await axios.delete(`${BaseURL}devices/shifttimings/${shiftId}/`, { headers: getAuthHeaders() });
      this.displaySuccessMessage('Shift deleted successfully');
      this.fetchShiftData();
    } catch (error) {
      console.error("Error deleting shift", error);
    }
  }

  displaySuccessMessage = (message) => {
    this.setState({ successMessage: message });
    setTimeout(() => this.setState({ successMessage: '' }), 3000);
  }

  applyHeaderStyles = () => {
    const headerCells = document.querySelectorAll('.custom-table-header th');
    headerCells.forEach((cell) => {
      cell.style.backgroundColor = '#047BC4';
      cell.style.color = 'white';
    });
  }
  
  render() {
    const { successMessage, shiftData, showAddModal, showUpdateModal, currentShift, newShift } = this.state;

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
              <CCardHeader>
                <strong>Shift Timing</strong>
                <CButton color='success' variant='outline' size='sm' className='float-end' onClick={this.openAddModal}>Add Shift</CButton>
              </CCardHeader>
              <CCardBody>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <CTable striped hover>
                  <CTableHead color='dark' className="custom-table-header">
                      <CTableRow color="dark">
                        <CTableHeaderCell scope="col">Si.No</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Shift Name</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Shift Number</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Start Time</CTableHeaderCell>
                        <CTableHeaderCell scope="col">End Time</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Created Date Time</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Updated Date Time</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {shiftData.length ? shiftData.map((shift, index) => (
                        <CTableRow key={shift._id}>
                          <CTableDataCell>{index + 1}</CTableDataCell>
                          <CTableDataCell>{shift.shift_name}</CTableDataCell>
                          <CTableDataCell>{shift.shift_number}</CTableDataCell>
                          <CTableDataCell>{shift.start_time}</CTableDataCell>
                          <CTableDataCell>{shift.end_time}</CTableDataCell>
                          <CTableDataCell>{new Date(shift.create_date_time).toLocaleString()}</CTableDataCell>
                          <CTableDataCell>{new Date(shift.update_date_time).toLocaleString()}</CTableDataCell>
                          <CTableDataCell>
                            <div className="d-flex gap-2">
                              <CButton color="primary" size='sm' onClick={() => this.openUpdateModal(shift)}>
                                <CIcon icon={cilPen} />
                              </CButton>
                              <CButton color="primary" size='sm' onClick={() => this.deleteShift(shift._id)}>
                                <CIcon icon={cilTrash} />
                              </CButton>
                            </div>
                          </CTableDataCell>
                        </CTableRow>
                      )) : (
                        <CTableRow>
                          <CTableDataCell colSpan="8" className="text-center">
                            No data available
                          </CTableDataCell>
                        </CTableRow>
                      )}
                    </CTableBody>
                  </CTable>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        <CModal visible={showAddModal} onClose={this.closeAddModal}>
          <CModalHeader>
            <CModalTitle>Add Shift</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <CFormLabel htmlFor="shift_name">Shift Name</CFormLabel>
              <CFormInput id="shift_name" value={newShift.shift_name} onChange={this.handleFormData} />
              <CFormLabel htmlFor="shift_number">Shift Number</CFormLabel>
              <CFormInput id="shift_number" value={newShift.shift_number} onChange={this.handleFormData} />
              <CFormLabel htmlFor="start_time">Start Time</CFormLabel>
              <CFormInput id="start_time" type="time" value={newShift.start_time} onChange={this.handleFormData} />
              <CFormLabel htmlFor="end_time">End Time</CFormLabel>
              <CFormInput id="end_time" type="time" value={newShift.end_time} onChange={this.handleFormData} />
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" size='sm' onClick={this.closeAddModal}>Close</CButton>
            <CButton color="primary" variant='outline' size='sm' onClick={this.addShift}>Add Shift</CButton>
          </CModalFooter>
        </CModal>
        <CModal visible={showUpdateModal} onClose={this.closeUpdateModal}>
          <CModalHeader>
            <CModalTitle>Update Shift</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {currentShift && (
              <CForm>
                <CFormLabel htmlFor="shift_name">Shift Name</CFormLabel>
                <CFormInput id="shift_name" value={currentShift.shift_name} onChange={this.handleUpdateData} />
                <CFormLabel htmlFor="shift_number">Shift Number</CFormLabel>
                <CFormInput id="shift_number" value={currentShift.shift_number} onChange={this.handleUpdateData} />
                <CFormLabel htmlFor="start_time">Start Time</CFormLabel>
                <CFormInput id="start_time" type="time" value={currentShift.start_time} onChange={this.handleUpdateData} />
                <CFormLabel htmlFor="end_time">End Time</CFormLabel>
                <CFormInput id="end_time" type="time" value={currentShift.end_time} onChange={this.handleUpdateData} />
              </CForm>
            )}
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" size='sm' onClick={this.closeUpdateModal}>Close</CButton>
            <CButton color="primary" variant='outline' size='sm' onClick={this.updateShift}>Update Shift</CButton>
          </CModalFooter>
        </CModal>
      </div>
    );
  }
}

export default ShiftTiming;