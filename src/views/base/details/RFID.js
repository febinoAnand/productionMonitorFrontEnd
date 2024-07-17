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
import axios from 'axios';

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

class RFID extends React.Component{

  state = {
    rfidList:[],
    url:"http://localhost:8000/devices/rfid/"
  }

  componentDidMount(){
    let resData;
    axios.get(this.state.url)
    .then(res => {
      resData = res.data;
      this.setState({
        rfidList:resData
      });
      console.log(resData);
    })
  }

  postData(event){
    console.log("Data POsted..");
    axios.post(this.state.url,{
      
    })
  };
  
  render(){

  
    return (
      <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Add RFID</strong>
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
                  <CCol xs={1}>
                  
                  </CCol>
                  
                  <CCol md={3}>
                    <CFormLabel htmlFor="buttonname">RFID Value</CFormLabel>
                    <CFormInput id="buttonname" placeholder="eg: 2308420398429830498" />
                  </CCol>

                  <CCol xs={1}>
                  
                  </CCol>
                  <CCol md={3}>
                    <CFormLabel htmlFor="buttonid">User ID</CFormLabel>
                    <CFormSelect id="buttonid" >
                      <option></option>
                      <option>Add</option>
                    </CFormSelect>
                  </CCol>
                  
                  <CCol xs={1}>
                  
                  </CCol>
                  
                  
                  <CCol xs={1}>
                    <div className='d-grid gap-2'>
                      <CButton color='success' onClick={this.postData} variant='outline'>Add</CButton>
            
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
              <strong>RFID Table </strong>
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
                      <CTableHeaderCell scope="col">RFID Value</CTableHeaderCell>
                      <CTableHeaderCell scope="col">User ID</CTableHeaderCell>
                      
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {this.state.rfidList.map((rfid,id)=>(
                      <CTableRow key={id}>
                      <CTableHeaderCell scope="row">{id+1}</CTableHeaderCell>
                      <CTableDataCell>{rfid.rfid}</CTableDataCell>
                      
                      <CTableDataCell>{rfid.rfidUser}</CTableDataCell>
                    </CTableRow>
                    ))}
                    {/* <CTableRow>
                      <CTableHeaderCell scope="row">2</CTableHeaderCell>
                      <CTableDataCell>3248019283049123823</CTableDataCell>
                      
                      <CTableDataCell>User 2</CTableDataCell>
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

export default RFID
