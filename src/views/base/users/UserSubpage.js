import React from 'react'
import BaseURL from 'src/assets/contants/BaseURL';
import { cilTrash, cilFilter, cilMagnifyingGlass } from '@coreui/icons';

import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormCheck,
    CFormInput,
    CFormLabel,
    CFormSelect,
    CRow,
    CInputGroup,
    CInputGroupText,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
  } from '@coreui/react'
import CIcon from '@coreui/icons-react';
import axios from 'axios';



class UserSubpage extends React.Component{

  render(){
    return (
      <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>USER LIST</strong>
            </CCardHeader>
            <CCardBody>
            <CRow className="mb-3">
                <CFormLabel htmlFor="Name" className="col-sm-2 col-form-label">Name</CFormLabel>
                <CCol sm={10}>
                    <CFormInput type="text" id="Name" name="Name"/>
                </CCol>
            </CRow>
            <CRow className="mb-3">
                <CFormLabel htmlFor="Email" className="col-sm-2 col-form-label">Email</CFormLabel>
                <CCol sm={10}>
                    <CFormInput type="email" id="Email" name="Email"/>
                </CCol>
            </CRow>
            <CRow className="mb-3">
                <CFormLabel htmlFor="Mobile" className="col-sm-2 col-form-label">Mobile</CFormLabel>
                <CCol sm={10}>
                    <CFormInput type="phone" id="Mobile" name="Mobile"/>
                </CCol>
            </CRow>
            <CRow className="mb-3">
                <CFormLabel htmlFor="Designation" className="col-sm-2 col-form-label">Designation</CFormLabel>
                <CCol sm={10}>
                    <CFormInput type="text" id="Designation" name="Designation"/>
                </CCol>
            </CRow>
            <CRow className="mb-3">
                <CFormLabel htmlFor="userlist" className="col-sm-2 col-form-label">User List</CFormLabel>
                <CCol sm={5}>
                    <CFormSelect id="userlist" multiple value={[]}>
                      {/* <option>Users 2</option>
                    <option>Users 3</option> */}
                    </CFormSelect> 
                </CCol> 
            </CRow><br />
            <CRow className="mb-3">
                <CFormLabel htmlFor="userlist" className="col-sm-2 col-form-label">Active Status</CFormLabel>
                <CCol sm={10}>
                <CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox1" value="option1" label="Activate"/>
                <CFormCheck inline type="radio" name="inlineRadioOptions" id="inlineCheckbox2" value="option2" label="Deactivate"/>
                </CCol> 
            </CRow>
            <CRow className="justify-content-center">
                <CCol xs={1}>
                  <div className='d-grid gap-2'>
                    <CButton color="primary" type="submit">Add</CButton>
                  </div>
                </CCol>
                <CCol xs={1}>
                  <div className='d-grid gap-2'>
                    <CButton  color="primary" type="submit">Update</CButton>
                  </div>
                </CCol>
            </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      </>
    )
  }
}

export default UserSubpage