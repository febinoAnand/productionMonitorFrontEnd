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
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
  } from '@coreui/react'

const MQTT = () => {
  
  return (
    <>
     <CRow>
      <CCol xs={12}>
     <CCard className="mb-4">
          <CCardHeader>
            <strong>MQTT Config</strong>
          </CCardHeader>
          <CCardBody>
            
              
            
            
            
              <CForm className="row g-3">

                <CCol md={9}>
                  <CFormLabel htmlFor="buttonname">Host</CFormLabel>
                  <CFormInput id="buttonname" placeholder="eg: 232.123.434.123, testmqtt.com" />
                </CCol>
                
                <CCol md={3}>
                  <CFormLabel htmlFor="buttonname">Port</CFormLabel>
                  <CFormInput id="buttonname" placeholder="eg: 1883, 8883" />
                </CCol>

                <CCol xs={3}>
                  <CFormLabel htmlFor="colorname">User Name</CFormLabel>
                  <CFormInput id="colorname" placeholder="eg: Encryption username" />
                </CCol>
                
                <CCol xs={3}>
                  <CFormLabel htmlFor="colorcode">Password</CFormLabel>
                  {/* <ColorPicker/> */}
                  <CFormInput
                          type="password"
                          id="exampleColorInput"
                          title="Choose your color"
                        />
                </CCol>
                

                <CCol xs={6}>
                  <CFormLabel htmlFor="colorcode">Client ID</CFormLabel>
                  {/* <ColorPicker/> */}
                  <CFormInput
                          type="text"
                          id="exampleColorInput"
                          title="Choose your color"
                        />
                </CCol>

                <CCol xs={3}>
                <CFormLabel htmlFor="colorcode">Keep Alive</CFormLabel>
                  {/* <ColorPicker/> */}
                  <CFormInput
                          type="text"
                          id="exampleColorInput"
                          defaultValue="60"
                          title="Choose your color"
                        />

                </CCol>

                <CCol xs={3}>
                  <CFormLabel htmlFor="colorcode">QOS</CFormLabel>
                  {/* <ColorPicker/> */}
                  <CFormSelect
                          
                          id="exampleColorInput"
                          defaultValue="#563d7c"
                          title="Choose your color"
                        />
                </CCol>
                <CCol xs={6}>
                  
                </CCol>
                
                <CCol xs={12}>
                  
                </CCol>
                
                {/* <CCol xs={1}>
                  <div className='d-grid gap-2'>
                    <CButton type="submit" color='success' variant="outline" >Add</CButton>
          
                  </div>
                  
                </CCol> */}
                <CCol xs={1}>
                  <div className='d-grid gap-2'>
                    <CButton type="submit" color='primary' variant="outline">Update</CButton>
          
                  </div>
                  
                </CCol>
                <CCol xs={1}>
                <div className='d-grid gap-2'>
                  <CButton type="submit" color='danger' variant="outline">Clear</CButton>   
                </div> 
                </CCol>
              </CForm>
            
          </CCardBody>
        </CCard>

        </CCol>

      </CRow>

     </>
  )
}

export default MQTT
