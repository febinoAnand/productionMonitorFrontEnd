import React from 'react'
import BaseURL from 'src/assets/contants/BaseURL';
import { cilPen } from '@coreui/icons';
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
  CTooltip
} from '@coreui/react'
import axios from 'axios';
import CIcon from '@coreui/icons-react';

class MachineDetails extends React.Component {

  state = {
    machineList: [],
    hmiList: [],
    url: BaseURL + "devices/machine/",
    id: 0,
    line: "",
    machineID: "",
    manufacture: "",
    model: "",
    name: "",
    Device: {},
    hmiID: 0,
    showModal: false,
    isUpdate: false,
  }

  componentDidMount() {
    this.updateMachineTable();
  }

  toggleModal = () => {
    this.setState({ showModal: !this.state.showModal });
  }

  machineDeleteData = (event) => {
    axios.delete(this.state.url + this.state.id + "/")
      .then(res => {
        this.updateMachineTable();
        this.clearState();
      })
      .catch(err => {
        console.log(err);
      })
  }

  machineUpdateData = (event) => {
    event.preventDefault();
    axios.put(this.state.url + this.state.id + "/", this.state)
      .then(res => {
        this.updateMachineTable();
        this.clearState();
        this.toggleModal();
      }).catch(err => {
        console.log(err);
      })
  }

  clearState = () => {
    this.setState({
      id: "",
      line: "",
      machineID: "",
      manufacture: "",
      model: "",
      name: "",
      Device: {},
      hmiID: 0,
      isUpdate: false
    })
  }

  updateMachineTable() {
    axios.get(this.state.url)
      .then(res => {
        this.setState({ machineList: res.data });
      })

    axios.get(BaseURL + "devices/device/")
      .then(res => {
        this.setState({ hmiList: res.data });
      })
  }

  machinePostData = (event) => {
    event.preventDefault();
    axios.post(this.state.url, this.state)
      .then(res => {
        this.updateMachineTable();
        this.clearState();
        this.toggleModal();
      })
      .catch(err => {
        console.log(err);
      });
  }

  handleFormData = (event) => {
    this.setState({ [event.target.id]: event.target.value });
  }

  changeDropdown = (event) => {
    this.setState({
      hmiID: event.target.value,
      Device: { id: event.target.value }
    });
  }

  getRowData = (event) => {
    this.setState({
      id: event.id,
      line: event.line,
      machineID: event.machineID,
      manufacture: event.manufacture,
      model: event.model,
      name: event.name,
      Device: event.device,
      hmiID: event.device.id,
      isUpdate: true,
      showModal: true
    });
  }

  render() {
    return (
      <>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Machine List</strong>
                <CButton color='success' className='float-end' onClick={() => { this.clearState(); this.toggleModal(); }}>Add Machine</CButton>
              </CCardHeader>
              <CCardBody>
                <CTable striped hover>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">#</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Machine ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Device ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Manufacture</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Model</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Line</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {this.state.machineList.map((list, id) => (
                      <CTableRow key={list.id}>
                        <CTableHeaderCell scope="row">{id + 1}</CTableHeaderCell>
                        <CTableDataCell>{list.machineID}</CTableDataCell>
                        <CTableDataCell>{list.device.deviceID}</CTableDataCell>
                        <CTableDataCell>{list.name}</CTableDataCell>
                        <CTableDataCell>{list.manufacture}</CTableDataCell>
                        <CTableDataCell>{list.model}</CTableDataCell>
                        <CTableDataCell>{list.line}</CTableDataCell>
                        <CTableDataCell className="text-end">
                          <CTooltip content="Edit">
                            <CButton style={{ fontSize: '10px', padding: '6px 10px' }} onClick={() => this.getRowData(list)}>
                              <CIcon icon={cilPen} />
                            </CButton>
                          </CTooltip>
                        </CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <CModal visible={this.state.showModal} size='lg' onClose={this.toggleModal}>
          <CModalHeader>
            <CModalTitle>{this.state.isUpdate ? "Update Machine Details" : "Add Machine Details"}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm className="row g-3">
              <CCol md={3}>
                <CFormLabel htmlFor="machineID">Machine ID</CFormLabel>
                <CFormInput id="machineID" placeholder="eg: MAC5632" value={this.state.machineID} onChange={this.handleFormData} />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="name">Name</CFormLabel>
                <CFormInput id="name" placeholder="" value={this.state.name} onChange={this.handleFormData} />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="manufacture">Manufacture</CFormLabel>
                <CFormInput id="manufacture" placeholder="" value={this.state.manufacture} onChange={this.handleFormData} />
              </CCol>
              <CCol xs={3}>
                <CFormLabel htmlFor="model">Model</CFormLabel>
                <CFormInput id="model" placeholder="" value={this.state.model} onChange={this.handleFormData} />
              </CCol>
              <CCol xs={3}>
                <CFormLabel htmlFor="line">Line</CFormLabel>
                <CFormInput id="line" placeholder="eg: 1, 2, 3" value={this.state.line} onChange={this.handleFormData} />
              </CCol>
              <CCol md={3}>
                <CFormLabel htmlFor="Device">Device ID</CFormLabel>
                <CFormSelect id="Device" value={this.state.hmiID} onChange={this.changeDropdown}>
                  <option key={0}></option>
                  {this.state.hmiList.map((hmiList, id) => (
                    <option key={id + 1} value={hmiList.id}>{hmiList.deviceID}</option>
                  ))}
                </CFormSelect>
              </CCol>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color='secondary' onClick={this.toggleModal}>Close</CButton>
            {this.state.isUpdate ?
              <CButton color='primary' onClick={this.machineUpdateData}>Update Machine</CButton>
              :
              <CButton color='success' onClick={this.machinePostData}>Add Machine</CButton>
            }
          </CModalFooter>
        </CModal>
      </>
    )
  }
}

export default MachineDetails;