import React from 'react'
import axios from 'axios';


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
import BaseURL from 'src/assets/contants/BaseURL';


class HMIRaw extends React.Component{

  state={
    rawDataList:[]
  }

  componentDidMount(){
    this.getRawData();
    this.interval = setInterval(() => {
      this.getRawData();
    }, 2000);
    
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getRawData(){
    let resData;
    // ,{ headers: { "DEVICEAUTHORIZATION": "b3fbc7e4ac3a94700ffbddc196d342" } }
    axios.get(BaseURL+"data/rawdata")
    .then(res=>{
      resData = res.data;
      this.setState({
        rawDataList:resData
      })
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
              <strong>Data from HMI</strong>
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
                      <CTableHeaderCell scope="col">Raw Data</CTableHeaderCell>
                      
                      
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {this.state.rawDataList.map((raw,id)=>(
                      <CTableRow key={id}>
                      <CTableHeaderCell scope="row">{id+1}</CTableHeaderCell>
                      <CTableDataCell>{raw.fields.datetime}</CTableDataCell>
                      <CTableDataCell>{raw.fields.data}</CTableDataCell>
                    </CTableRow>
                    ))}
                    

                    {/* <CTableRow>
                      <CTableHeaderCell scope="row">2</CTableHeaderCell>
                      <CTableDataCell>20.03.2022 11:12:43</CTableDataCell>
                      <CTableDataCell>{'{"id": "0001","type": "donut","name": "Cake","ppu": 0.55,"batters":{"batter":[{ "id": "1001", "type": "Regular" },{ "id": "1002", "type": "Chocolate" },{ "id": "1003", "type": "Blueberry" },{ "id": "1004", "type": "Devils Food" }]},"topping":[{ "id": "5001", "type": "None" },{ "id": "5002", "type": "Glazed" },{ "id": "5005", "type": "Sugar" },{ "id": "5007", "type": "Powdered Sugar" },{ "id": "5006", "type": "Chocolate with Sprinkles" },{ "id": "5003", "type": "Chocolate" },{ "id": "5004", "type": "Maple" }]}'}</CTableDataCell>
                  
                      
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

export default HMIRaw;
