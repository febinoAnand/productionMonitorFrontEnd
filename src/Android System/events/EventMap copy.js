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

// const ColorPicker = (props) => {
//   return (
//       <ChromePicker
//           color={props.value || false}
//           value={props.value}
//           onChange={ color => {
//               props.onChange(color)
//           }}
//       />
//   )
// }

// const ColorPicker = () => {
//   const [color, setColor] = useState(null);

//   console.log("colorPicker", color);

//   return (
//     <input type="color" value={color} onChange={e => setColor(e.target.value)} />
//   );
// }

const EventIndicator = () => {

  
  
  return (
    <>
     <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Add Event</strong>
          </CCardHeader>
          <CCardBody>
            
              
            
            
            
              <CForm className="row g-3">
                <CCol md={3}>
                  <CFormLabel htmlFor="buttonid">ID</CFormLabel>
                  <CFormSelect id="buttonid" >
                    <option></option>
                    <option>No Items</option>
                  </CFormSelect>
                </CCol>

                <CCol md={3}>
                  <CFormLabel htmlFor="buttonid">Button ID</CFormLabel>
                  <CFormSelect id="buttonid" >
                    <option></option>
                    <option>Add</option>
                  </CFormSelect>
                </CCol>

                <CCol md={3}>
                  <CFormLabel htmlFor="buttonid">Problem ID</CFormLabel>
                  <CFormSelect id="buttonid" >
                    <option></option>
                    <option>Add</option>
                  </CFormSelect>
                </CCol>

                <CCol md={3}>
                  <CFormLabel htmlFor="buttonid">Indicator ID</CFormLabel>
                  <CFormSelect id="buttonid" >
                    <option></option>
                    <option>Add</option>
                  </CFormSelect>
                </CCol>
                
                <CCol md={6}>
                  <CFormLabel htmlFor="buttonid">Users To Acknoledge</CFormLabel>
                  <CFormSelect id="buttonid" multiple>
                    
                    <option>Users 1</option>
                    <option>Users 2</option>
                    <option>Users 3</option>
                  </CFormSelect>
                  
                </CCol>

                <CCol md={6}>
                  <CFormLabel htmlFor="buttonid">Users To Notify</CFormLabel>
                  <CFormSelect id="buttonid" multiple>
                  <option>Users 1</option>
                    <option>Users 2</option>
                    <option>Users 3</option>
                  </CFormSelect>
                </CCol>
              
                
                <CCol xs={1}>
                  <div className='d-grid gap-2'>
                    <CButton type="submit" color='success' variant='outline'>Add</CButton>
          
                  </div>
                  
                </CCol>
                <CCol xs={1}>
                  <div className='d-grid gap-2'>
                    <CButton type="submit" color='primary' variant='outline'>Update</CButton>
          
                  </div>
                  
                </CCol>
                <CCol xs={1}>
                <div className='d-grid gap-2'>
                  <CButton type="submit" color='danger' variant='outline'>Delete</CButton>   
                </div> 
                </CCol>
              </CForm>
            
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Indicator List</strong>
          </CCardHeader>
          <CCardBody>
            {/* <p className="text-medium-emphasis small">
              Use <code>hover</code> property to enable a hover state on table rows within a{' '}
              <code>&lt;CTableBody&gt;</code>.
            </p>
             */}
            
            
            
              <CTable striped hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Button ID</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Problem ID</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Indicator ID</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    <CTableHeaderCell scope="row">1</CTableHeaderCell>
                    <CTableDataCell>1</CTableDataCell>
                    <CTableDataCell>BTN38940</CTableDataCell>
                    <CTableDataCell>PRM30909</CTableDataCell>
                    <CTableDataCell>IND30948</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                  <CTableHeaderCell scope="row">1</CTableHeaderCell>
                    <CTableDataCell>1</CTableDataCell>
                    <CTableDataCell>BTN38940</CTableDataCell>
                    <CTableDataCell>PRM30909</CTableDataCell>
                    <CTableDataCell>IND30948</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                  <CTableHeaderCell scope="row">1</CTableHeaderCell>
                    <CTableDataCell>1</CTableDataCell>
                    <CTableDataCell>BTN38940</CTableDataCell>
                    <CTableDataCell>PRM30909</CTableDataCell>
                    <CTableDataCell>IND30948</CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            
          </CCardBody>
        </CCard>
      </CCol>
      
      </CRow>

     </>
  )
}

export default EventIndicator
