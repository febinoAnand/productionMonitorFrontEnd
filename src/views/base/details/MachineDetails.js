import React from 'react'
import BaseURL from 'src/assets/contants/BaseURL';


import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    // CFormCheck,
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



class MachineDetails extends React.Component{

  state = {
    machineList:[],
    hmiList:[],
    url:BaseURL+"devices/machine/",
    id:0,
    line: "",
    machineID: "",
    manufacture: "",
    model: "",
    name: "",
    Device:{},
    hmiID:0
  }

  componentDidMount(){
    this.updateMachineTable();
  }

  machineDeleteData = (event) =>{
    axios.delete(this.state.url+this.state.id+"/")
    .then(res=>{
      this.updateMachineTable();
      this.clearState();
    })
    .catch(err=>{
      console.log(err);
    })
  }

  machineUpdateData = (event) =>{
    event.preventDefault();
    console.log(this.state);
    axios.put(this.state.url+this.state.id+"/",this.state)
    .then(res=>{
      this.updateMachineTable();
      this.clearState();
      console.log(res.data);
    }).catch(err=>{
      console.log(err);
    })
  }

  clearState = () =>{
    // console.log("cleared..")
    this.setState({
      id:"",
      line: "",
      machineID: "",
      manufacture: "",
      model: "",
      name: "",
      Device:{},
      hmiID:0
    }) 
  }

  updateMachineTable(){
    let resData;
    axios.get(this.state.url)
    .then(res=>{
      resData = res.data;
      this.setState({
        machineList:resData
      })
      // console.log(resData);
    })

    axios.get(BaseURL+"devices/device/")
    .then(res=>{
      resData = res.data;
      this.setState({
        hmiList:resData
      });
      // console.log(resData);
    })
  }

  machinePostData = (event) =>{
    event.preventDefault();
    console.log(this.state);
    axios.post(this.state.url,this.state)
    .then(res=>{
      console.log(res.data);
      this.updateMachineTable();
    })
    .catch(err=>{
      console.log(err);
    });
    this.clearState();
  }

  handleFormData = (event)=>{
    this.setState({[event.target.id]:event.target.value})
  }


  changeDropdown= (event) =>{
    console.log(event);
    this.setState({
      hmiID:event.target.value,
      Device:{id:event.target.value}
    },function(){
      // console.log(this.state)
    });
    
    // axios.get(BaseURL+"devices/hmi/")
    // .then(res=>{
    //   resData = res.data;
    //   this.setState({
    //     hmiList:resData
    //   });
    //   console.log(resData);
    // })

  }

  getRowData = (event) =>{
    console.log(event);
    this.setState({
      id:event.id,
      line: event.line,
      machineID: event.machineID,
      manufacture: event.manufacture,
      model: event.model,
      name:event.name,
      Device:event.device,
      hmiID:event.device.id
    },function(){
      // console.log(this.state)
    })
    

  }

  
  render(){
    return (
      <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Add Machine Details</strong>
            </CCardHeader>
            <CCardBody>
                <CForm className="row g-3">
                  <CCol md={3}>
                    <CFormLabel htmlFor="machineID">Machine ID</CFormLabel>
                    <CFormInput id="machineID" placeholder="eg: MAC5632" value={this.state.machineID} onChange={this.handleFormData}/>
                     
                  </CCol>
                  
                  <CCol md={3}>
                    <CFormLabel htmlFor="name">Name</CFormLabel>
                    <CFormInput id="name" placeholder="" value={this.state.name} onChange={this.handleFormData}/>
                  </CCol>

                  
                  
                  <CCol md={3}>
                    <CFormLabel htmlFor="manufacture">Manufracture</CFormLabel>
                    <CFormInput id="manufacture" placeholder="" value={this.state.manufacture} onChange={this.handleFormData}/>
                  </CCol>

                
                  
                  <CCol xs={3}>
                    <CFormLabel htmlFor="model">Model</CFormLabel>
                    <CFormInput id="model" placeholder="" value={this.state.model} onChange={this.handleFormData}/>
                  </CCol>

                  
                  <CCol xs={3}>
                    <CFormLabel htmlFor="line">Line</CFormLabel>
                    <CFormInput id="line" placeholder="eg: 1, 2, 3" value={this.state.line} onChange={this.handleFormData}/>
                  </CCol>

                  <CCol md={3}>
                    <CFormLabel htmlFor="Device">Device ID</CFormLabel>
                    <CFormSelect id="Device" value={this.state.hmiID} onChange={this.changeDropdown}> 
                      <option key={0}></option>
                      {this.state.hmiList.map((hmiList,id)=>(
                        <option key={id+1} value={hmiList.id}>{hmiList.deviceID}</option>
                      ))}
                    </CFormSelect>
                  </CCol>

                  {/* <CCol xs={6}>
                  <div className="mb-3">
                  <CFormLabel htmlFor="formFile">Image file</CFormLabel>
                  <CFormInput type="file" id="formFile" />
                  </div>
                  </CCol> */}

                  <CCol xs={6}>

                  </CCol>

                  
                


                  
                  
                  
                  
                  <CCol xs={1}>
                    <div className='d-grid gap-2'>
                      <CButton onClick={this.machinePostData} color='success' variant='outline'>Add</CButton>
            
                    </div>
                    
                  </CCol>
                  <CCol xs={1}>
                    <div className='d-grid gap-2'>
                      <CButton onClick={this.machineUpdateData} color='primary' variant='outline'>Update</CButton>
            
                    </div>
                    
                  </CCol>
                  <CCol xs={1}>
                  <div className='d-grid gap-2'>
                    <CButton onClick={this.machineDeleteData} color='danger' variant='outline'>Delete</CButton>   
                  </div> 
                  </CCol>
                  <CCol xs={1}>
                  <div className='d-grid gap-2'>
                    <CButton onClick={this.clearState} color='danger' variant='outline'>Clear</CButton>   
                  </div> 
                  </CCol>
                </CForm>
              
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Machine List</strong>
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
                      <CTableHeaderCell scope="col">Machine ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Device ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Manufracture</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Model</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Line</CTableHeaderCell>
                      
                      {/* <CTableHeaderCell scope="col">Image</CTableHeaderCell> */}
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {this.state.machineList.map((list,id)=>(
                        <CTableRow key={list.id} onClick={()=>this.getRowData(list)}>
                        <CTableHeaderCell scope="row">{id+1}</CTableHeaderCell>
                        <CTableDataCell>{list.machineID}</CTableDataCell>
                        <CTableDataCell>{list.device.deviceID}</CTableDataCell>
                        <CTableDataCell>{list.name}</CTableDataCell>
                        <CTableDataCell>{list.manufacture}</CTableDataCell>
                        <CTableDataCell>{list.model}</CTableDataCell>
                        <CTableDataCell>{list.line}</CTableDataCell>
                        
                        {/* <CTableDataCell>xxxx.jpg</CTableDataCell> */}
                        </CTableRow>
                    ))}
                   
                    {/* <CTableRow>
                    <CTableHeaderCell scope="row">2</CTableHeaderCell>
                      <CTableDataCell>MEC302948</CTableDataCell>
                      <CTableDataCell>Spinning</CTableDataCell>
                      <CTableDataCell>Lakshi Reter</CTableDataCell>
                      <CTableDataCell>1990</CTableDataCell>
                      <CTableDataCell>1</CTableDataCell>
                      <CTableDataCell>HMI389480</CTableDataCell>
                      <CTableDataCell>xxxx.jpg</CTableDataCell>
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

export default MachineDetails
