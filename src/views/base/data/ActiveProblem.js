import React from 'react'
import axios from 'axios';
import BaseURL from 'src/assets/contants/BaseURL';


import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    // CForm,
    // CFormCheck,
    CFormInput,
    // CFormLabel,
    // CFormSelect,
    CInputGroup,
    CInputGroupText,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
  } from '@coreui/react'
import CIcon from '@coreui/icons-react';

import {
  cilMagnifyingGlass
} from '@coreui/icons'

class ActiveProblem extends React.Component{

  state = {activeProblemList:[]}

  componentDidMount(){
      let resData;
      axios.get(BaseURL+"data/problem/")
      .then(res=>{
        resData = res.data;
        this.setState({
          activeProblemList:resData
        });
        console.log(resData);
      })
  }

  render(){
  
    return (
      <>
      <CRow>
      

        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Active Problem</strong>
            </CCardHeader>
            <CCardBody>
              {/* <p className="text-medium-emphasis small">
                Use <code>hover</code> property to enable a hover state on table rows within a{' '}
                <code>&lt;CTableBody&gt;</code>.
              </p>
              */}


              <CCol md={4}>
              
              
              <CInputGroup className="flex-nowrap mt-3 col-sg-3">
                  <CInputGroupText id="addon-wrapping"><CIcon icon={cilMagnifyingGlass}/></CInputGroupText>
                  <CFormInput
                    placeholder="Username"
                    aria-label="Username"
                    aria-describedby="addon-wrapping"
                  />
                  <CButton type="button" color="secondary"  id="button-addon2">
                    Search
                  </CButton>
                </CInputGroup>
                {/* <CButton color='primary'>Search</CButton> */}
                </CCol>
                
                <CCol className='mb-3'>

                </CCol>
              
                <CTable striped hover>
                  <CTableHead>
                    <CTableRow>
                      <CTableHeaderCell scope="col">#</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date Time</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Event Group</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Event ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Machine ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Issue Time</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Acknowledge Time</CTableHeaderCell>
                      <CTableHeaderCell scope="col">End Time</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {this.state.activeProblemList.map((prob,id)=>(
                      <CTableRow key={prob.id}>
                      <CTableHeaderCell scope="row">{id+1}</CTableHeaderCell>
                      <CTableDataCell>{prob.date} {prob.time}</CTableDataCell>
                      <CTableDataCell>{prob.eventGroupID}</CTableDataCell>
                      <CTableDataCell>{prob.event.eventID}</CTableDataCell>
                      <CTableDataCell>{prob.machine.machineID}</CTableDataCell>
                      <CTableDataCell>{prob.issueTime}</CTableDataCell>
                      <CTableDataCell>{prob.acknowledgeTime}</CTableDataCell>
                      <CTableDataCell>{prob.endTime}</CTableDataCell>
                      <CTableDataCell>{prob.event.problem.problemName}</CTableDataCell>
                      
                    </CTableRow>
                    ))}
                    

{/* 
                    <CTableRow>
                      <CTableHeaderCell scope="row">2</CTableHeaderCell>
                      <CTableDataCell>20.03.2022 11:53:23</CTableDataCell>
                      <CTableDataCell>EVT342</CTableDataCell>
                      <CTableDataCell>MEC54</CTableDataCell>
                      <CTableDataCell>20.03.2022 11:53:23</CTableDataCell>
                      <CTableDataCell>20.03.2022 11:53:23</CTableDataCell>
                      <CTableDataCell>20.03.2022 11:53:23</CTableDataCell>
                      <CTableDataCell>ALL OK</CTableDataCell>
                    </CTableRow> */}


                   

                  </CTableBody>
                </CTable>
              
            </CCardBody>
          </CCard>
        </CCol>
        
        </CRow>

      </>
    )
  }
}
export default ActiveProblem;
