import React from 'react'



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
import axios from 'axios';
import BaseURL from 'src/assets/contants/BaseURL';

class ProblemData extends React.Component{

  state ={problemDataList:[]}

  componentDidMount(){
    let resultData;
    axios.get(BaseURL+"data/lastproblem/")
    .then(res=>{
      resultData = res.data;
      this.setState({
        problemDataList:resultData
      });

      console.log(resultData);
    })
  }

  
  
  render(){
    return (
      <>
      <CRow>
      

        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Problem Data</strong>
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
                      <CTableHeaderCell scope="col">Group ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Event ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Machine ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Issue Time</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Acknowledge Time</CTableHeaderCell>
                      <CTableHeaderCell scope="col">End Time</CTableHeaderCell>
                      
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>

                  {this.state.problemDataList.map((problemDataList,id)=>(
                    <CTableRow key={id}>
                    <CTableHeaderCell scope="row">{id+1}</CTableHeaderCell>
                    <CTableDataCell>{problemDataList.date} {problemDataList.time}</CTableDataCell>
                    <CTableDataCell>{problemDataList.eventGroupID}</CTableDataCell>
                    <CTableDataCell>{problemDataList.event.eventID}</CTableDataCell>
                    <CTableDataCell>{problemDataList.machine.machineID}</CTableDataCell>
                    <CTableDataCell>{problemDataList.issueTime}</CTableDataCell>
                    <CTableDataCell>{problemDataList.acknowledgeTime}</CTableDataCell>
                    <CTableDataCell>{problemDataList.endTime}</CTableDataCell>
                  </CTableRow>
                  ))}
                    


                    {/* <CTableRow>
                      <CTableHeaderCell scope="row">2</CTableHeaderCell>
                      <CTableDataCell>20.03.2022 11:12:43</CTableDataCell>
                      <CTableDataCell>EVT32</CTableDataCell>
                      <CTableDataCell>MEC32</CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                      <CTableDataCell>20.03.2022 11:53:23</CTableDataCell>
                      
                    </CTableRow>
                    <CTableRow>
                      <CTableHeaderCell scope="row">3</CTableHeaderCell>
                      <CTableDataCell>10.03.2022 11:01:34</CTableDataCell>
                      <CTableDataCell>EVT342</CTableDataCell>
                      <CTableDataCell>MEC54</CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                      <CTableDataCell>20.03.2022 11:53:23</CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                      
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

export default ProblemData;
