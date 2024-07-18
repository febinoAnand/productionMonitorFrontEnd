import React from 'react'
import axios from 'axios';
import BaseURL from 'src/assets/contants/BaseURL';


import {
    // CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    // CForm,
    // CFormCheck,
    // CFormInput,
    // CFormLabel,
    // CFormSelect,
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

class UnregisteredDevices extends React.Component{

  state = {
    hmiList:[],
    url:BaseURL+"devices/unregister/",
    id:"",
    deviceID:"",
    model:"",
    hardwareVersion:"",
    softwareVersion:"",
    password:"",
    sessionID:"",
    OTP:""
  }

  updateValueInTable = (event) => {
    let resData;
    axios.get(this.state.url)
    .then(res=>{
      resData = res.data;
      this.setState({
        hmiList:resData,
      })
      console.log(resData);
    })
  }

  clearState = (event)=>{
    this.setState({
      deviceID:"",
      model:"",
      hardwareVersion:"",
      softwareVersion:""

    });
  }

  getRowValue = (event)=>{
   console.log(event);
   this.setState({
        id:event.id,
        deviceID:event.deviceID,
        model:event.model,
        hardwareVersion:event.hardwareVersion,
        softwareVersion:event.softwareVersion
        
   })

  }


  addHMIPost = (event)=>{
    event.preventDefault();
    // console.log(this.state);
    axios.post(this.state.url,this.state)
    .then(res=>{
      // console.log(res.data);
      this.updateValueInTable();
      this.clearState();
    })
    .catch(err=>{
      // let respData = "";
      // for(let i = 0; i < err.response.data; i++){
      //   respData += respData + "/n";
      // }
      // console.log("Error",respData);
      console.log("Error",err.response.data.deviceID);
      alert(err.response.data.deviceID);
    })
  }

  updateValue = (event) =>{
    event.preventDefault();
    axios.put(this.state.url+this.state.id+"/",this.state)
    .then(res=>{
      this.updateValueInTable();
      this.clearState();
    }).catch(err=>{
      console.log(err);
    })
  }

  deletValue = (event) =>{
    event.preventDefault();
    axios.delete(this.state.url+this.state.id+'/')
    .then(res=>{
      this.updateValueInTable();
      this.clearState();
    }).catch(err=>{
      console.log(err);
    })
  }
  

  handleFormData = (event)=>{
    this.setState({[event.target.id]:event.target.value})
  }

  componentDidMount(){
    this.updateValueInTable();
  }



 
  
render(){  
    return (
      <>
      <CRow>
        {/* <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Add Device</strong>
            </CCardHeader>
            <CCardBody>
              
                <CForm className="row g-3" >
                  <CCol md={3}>
                    <CFormLabel htmlFor="deviceID">Device ID</CFormLabel>
                    <CFormInput id="deviceID" placeholder="eg: 3489209" value={this.state.deviceID} onChange={this.handleFormData} readOnly/>
                    
                  </CCol>
                 
                  
                  <CCol md={3}>
                    <CFormLabel htmlFor="hardwareVersion">Hardware Version</CFormLabel>
                    <CFormInput id="hardwareVersion" placeholder="eg: 2.3.0" value={this.state.hardwareVersion} onChange={this.handleFormData}/>
                  </CCol>

                 
                  
                  <CCol xs={3}>
                    <CFormLabel htmlFor="softwareVersion">Software Version</CFormLabel>
                    <CFormInput id="softwareVersion" placeholder="eg: 1.2.0" value={this.state.softwareVersion} onChange={this.handleFormData}/>
                  </CCol>

                 

                  <CCol xs={3}>
                    <CFormLabel htmlFor="model">Model</CFormLabel>
                    <CFormInput id="model" placeholder="model no" value={this.state.model} onChange={this.handleFormData}/>
                  </CCol>
            
                  <CCol xs={1}>
                    <div className='d-grid gap-2'>
                      <CButton color='primary' variant='outline' onClick={this.updateValue}>Update</CButton>
            
                    </div>
                    
                  </CCol>
                  <CCol xs={1}>
                  <div className='d-grid gap-2'>
                    <CButton color='danger' variant='outline' onClick={this.deletValue}>Delete</CButton>   
                  </div> 
                  </CCol>
                  <CCol xs={1}>
                  <div className='d-grid gap-2'>
                    <CButton color='warning' variant='outline' onClick={this.clearState}>Clear</CButton>   
                  </div> 
                  </CCol>
                </CForm>
              
            </CCardBody>
          </CCard>
        </CCol> */}

        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Device List</strong>
            </CCardHeader>
            <CCardBody>
              {/* <p className="text-medium-emphasis small">
                Use <code>hover</code> property to enable a hover state on table rows within a{' '}
                <code>&lt;CTableBody&gt;</code>.
              </p>
              */}
              
              
              
                <CTable striped hover>
                <CTableHead color='dark'>
                    <CTableRow>
                      <CTableHeaderCell scope="col">#</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Session ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Device ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Hardware Version</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Software Verison</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Device Password</CTableHeaderCell>
                      <CTableHeaderCell scope="col">OTP</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody  >
                    {this.state.hmiList.map((hmi,id)=>(
                      // <CTableRow key={id} data-rowid={id} onClick={this.onClick}>
                      <CTableRow key={hmi.id} onClick={()=>this.getRowValue(hmi)}>
                      {/* // <CTableRow key={id} onClick={({target}) => console.log(target.textContent)}> */}
                        {/* {({target}) => console.log(target.textContent)} */}
                      <CTableHeaderCell scope="row">{id+1}</CTableHeaderCell>
                      <CTableDataCell>{hmi.sessionID}</CTableDataCell>
                        <CTableDataCell>{hmi.deviceID}</CTableDataCell>
                        <CTableDataCell>{hmi.hardwareVersion}</CTableDataCell>
                        <CTableDataCell>{hmi.softwareVersion}</CTableDataCell>
                        <CTableDataCell>{hmi.devicePassword}</CTableDataCell>
                        <CTableDataCell>{hmi.OTP}</CTableDataCell>
                        
                      </CTableRow>
                    ))}
                    {/* <CTableRow>
                      <CTableHeaderCell scope="row">2</CTableHeaderCell>
                      <CTableDataCell>HMI849802</CTableDataCell>
                      <CTableDataCell>2.1
                      
                      </CTableDataCell>
                      <CTableDataCell>2.0.4</CTableDataCell>
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

export default UnregisteredDevices
