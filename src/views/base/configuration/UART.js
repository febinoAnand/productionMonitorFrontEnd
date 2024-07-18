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
    CFormSwitch
  } from '@coreui/react'

const UART = () => {
  
  return (
    <>
     <CRow>
      <CCol xs={12}>
     <CCard className="mb-4">
          <CCardHeader>
            <strong>HTTP Config</strong>
          </CCardHeader>
          <CCardBody>
            
              
            
            
            
              <CForm className="row g-3">

                <CCol md={9}>
                  <CFormLabel htmlFor="buttonname">COM Port</CFormLabel>
                  <CFormSelect id="buttonname" placeholder="eg: 232.123.434.123, testmqtt.com" />
                </CCol>
                
                <CCol md={3}>
                  <CFormLabel htmlFor="buttonname">Baud rate</CFormLabel>
                  <CFormSelect id="buttonname" placeholder="eg: 1883, 8883">
                    <option>9600</option>
                    <option>19200</option>
                    <option>115200</option>
                  </CFormSelect>
                </CCol>

                <CCol xs={3}>
                  <CFormLabel htmlFor="colorname">Parity</CFormLabel>
                  <CFormSelect id="colorname" placeholder="eg: Encryption username" >
                    <option>None</option>
                    <option>Odd</option>
                    <option>Even</option>
                  </CFormSelect>
                </CCol>
                
                <CCol xs={3}>
                  <CFormLabel htmlFor="colorcode">Data Bit</CFormLabel>
                  {/* <ColorPicker/> */}
                  <CFormSelect
                          
                          id="exampleColorInput"
                          title="Choose your color"
                        >
                          <option>5</option>
                          <option>6</option>
                          <option>7</option>
                          <option>8</option>
                        </CFormSelect>
                </CCol>
                

                <CCol xs={3}>
                  <CFormLabel htmlFor="colorcode">Stop Bit</CFormLabel>
                  {/* <ColorPicker/> */}
                  <CFormSelect
                          type="text"
                          id="exampleColorInput"
                          title="Choose your color"
                        >
                          <option>1</option>
                          <option>1.5</option>
                          <option>2</option>
                        </CFormSelect>
                </CCol>

                <CCol xs={3}>
                   
                </CCol>

                <CCol xs={3} className='mt-4'>
                <CFormSwitch className="mb-2" label="CTS" id="formSwitchCheckDefault" />
                <CFormSwitch className="mb-2" label="DTR" id="formSwitchCheckDefault" />
                <CFormSwitch className="mb-2" label="XON" id="formSwitchCheckDefault" />
                
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
                    <CButton type="submit" color='success' variant="outline">Update</CButton>
                  </div>
                  
                </CCol>
                <CCol xs={1}>
                <div className='d-grid gap-2'>
                  <CButton type="submit" color='warning' variant="outline">Clear</CButton>   
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

export default UART
