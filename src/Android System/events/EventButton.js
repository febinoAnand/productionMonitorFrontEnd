import React from 'react'
import axios from 'axios';


import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
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
import BaseURL from 'src/assets/contants/BaseURL';

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

class EventButton extends React.Component{

  state = {
    id:0,
    buttonTable:[],
    buttonID:"",
    buttonColor:"#000000",
    buttonColorName:"",
    buttonName:"",
    buttonDO:"",
    buttonMode:"auto",
    url:BaseURL+"events/button/"
  };

  updateState = (event)=>{
    this.setState({[event.target.id]:event.target.value})
  }

  updateButtonData=(event)=>{
    let resData = {
      id:this.state.id,
      buttonID:this.state.buttonID,
      buttonColor:this.state.buttonColor,
      buttonColorName:this.state.buttonColorName,
      buttonName:this.state.buttonName,
      buttonDO:this.state.buttonDO,
      buttonMode:this.state.buttonMode,
    }
    axios.put(this.state.url+this.state.id+"/",resData)
    .then(res=>{
      this.updateButtonTableData();
      this.clearState();
    })
    .catch(err=>{
      console.log(err)
    })
  }

  addButtonData=(event)=>{
    let resData = {
      buttonID:this.state.buttonID,
      buttonColor:this.state.buttonColor,
      buttonColorName:this.state.buttonColorName,
      buttonName:this.state.buttonName,
      buttonDO:this.state.buttonDO,
      buttonMode:this.state.buttonMode,
    }
    axios.post(this.state.url,resData)
    .then(res=>{
      this.updateButtonTableData();
      this.clearState();
    })
    .catch(err=>{
      console.log(err)
    })
  }

  deleteButtonData=(event)=>{
    axios.delete(this.state.url+this.state.id+"/")
    .then(res=>{
      this.updateButtonTableData();
      this.clearState();
    })
    .catch(err=>{
      console.log(err)
    })
  }

  clearState = (event)=>{
    this.setState({
      id:0,
      buttonID:"",
      buttonColor:"#000000",
      buttonColorName:"",
      buttonName:"",
      buttonMode:"auto",
      buttonDO:"",
    })
  }

  

  getRowData = (event)=>{
    this.setState({
      id:event.id,
      buttonID:event.buttonID,
      buttonColor:event.buttonColor,
      buttonColorName:event.buttonColorName,
      buttonDO:event.buttonDO,
      buttonMode:event.buttonMode,
      buttonName:event.buttonName
    })
  }

  updateButtonTableData(){
    let resultData;
    axios.get(this.state.url)
    .then(res=>{
      resultData = res.data;
      this.setState({
        buttonTable:resultData
      })
      console.log(resultData);
    })
  }

  updateDropdown = (event)=>{

    // console.log("Id-->",event.target.id);
    // console.log("Value-->",event.target.value);
    let value = event.target.value;
    // console.log(value);

    this.setState({
      buttonMode:value
    });


    
  
  }

  componentDidMount(){
    this.updateButtonTableData();
  }

  
  render(){
  return (
    <>
     <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Buttons</strong>
          </CCardHeader>
          <CCardBody>
              <CForm className="row g-3">
                <CCol md={3}>
                  <CFormLabel htmlFor="buttonID">ID</CFormLabel>
                  <CFormInput id="buttonID" placeholder="eg: BT3234" onChange={this.updateState} value={this.state.buttonID}/>
                </CCol>
                
                <CCol md={3}>
                  <CFormLabel htmlFor="buttonName">Button Name</CFormLabel>
                  <CFormInput id="buttonName" placeholder="eg: Motor ON, Conveyor OFF, STOP" onChange={this.updateState} value={this.state.buttonName} />
                </CCol>

                <CCol xs={3}>
                  <CFormLabel htmlFor="buttonColorName">Color Name</CFormLabel>
                  <CFormInput id="buttonColorName" placeholder="eg: Red, Blue, Green" onChange={this.updateState} value={this.state.buttonColorName}/>
                </CCol>
                
                <CCol xs={3}>
                  <CFormLabel htmlFor="buttonColor">Color Code</CFormLabel>
                  {/* <ColorPicker/> */}
                  <CFormInput
                          type="color"
                          id="buttonColor"
                          title="Choose your color"
                          onChange={this.updateState} 
                          value={this.state.buttonColor}
                        />
                </CCol>

                <CCol xs={3}>
                <CFormLabel htmlFor="buttonDO">DO</CFormLabel>
                  <CFormInput id="buttonDO" placeholder="eg: 1, 2, 3" onChange={this.updateState} value={this.state.buttonDO}/>
                </CCol>

                <CCol xs={3}>

                <CFormLabel htmlFor="buttonMode" >Mode</CFormLabel>
                    <CFormSelect id="buttonMode" value={this.state.buttonMode} onChange={this.updateDropdown}>
                      <option key="auto">AUTO</option>
                      <option key="manual">MANUAL</option>
                      <option key="auto+manual">AUTO+MANUAL</option>
                    </CFormSelect>
                </CCol>

                <CCol xs={6}>
                  
                </CCol>
                
                <CCol xs={1}>
                  <div className='d-grid gap-2'>
                    <CButton type="submit" color='success' variant="outline" onClick={this.addButtonData}>Add</CButton>
                 </div>
                  
                </CCol>
                <CCol xs={1}>
                  <div className='d-grid gap-2'>
                    <CButton type="submit" color='primary' variant="outline" onClick={this.updateButtonData}>Update</CButton>
          
                  </div>
                  
                </CCol>
                <CCol xs={1}>
                <div className='d-grid gap-2'>
                  <CButton type="submit" color='danger' variant="outline" onClick={this.deleteButtonData}>Delete</CButton>   
                </div> 
                </CCol>
                <CCol xs={1}>
                <div className='d-grid gap-2'>
                  <CButton type="submit" color='warning' variant="outline" onClick={this.clearState}>Clear</CButton>   
                </div> 
                </CCol>
              </CForm>
            
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Button List</strong>
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
                    <CTableHeaderCell scope="col">Button ID</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Button Name</CTableHeaderCell>
                    
                    <CTableHeaderCell scope="col">Color Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Color Code</CTableHeaderCell>
                    <CTableHeaderCell scope="col">DO</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Mode</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {this.state.buttonTable.map((buttonTable,id)=>(
                      <CTableRow key={buttonTable.id} onClick={()=>this.getRowData(buttonTable)}>
                        <CTableHeaderCell scope="row">{id+1}</CTableHeaderCell>
                        <CTableHeaderCell scope="row">{buttonTable.buttonID}</CTableHeaderCell>
                        <CTableDataCell>{buttonTable.buttonName}</CTableDataCell>
                     
                      <CTableDataCell>{buttonTable.buttonColorName}</CTableDataCell>
                      <CTableDataCell>
                        <CRow >
                          <CFormLabel htmlFor="buttonColor" className="col-sm-3 col-form-label">{buttonTable.buttonColor}</CFormLabel>
                          <CFormInput
                              className="col-sm-2"
                              type="color"
                              id="buttonColor"
                              value={buttonTable.buttonColor}
                              title="Choose your color"
                              disabled
                            />
                        </CRow>
                      
                      </CTableDataCell>
                      <CTableDataCell>{buttonTable.buttonDO}</CTableDataCell>
                      <CTableDataCell>{buttonTable.buttonMode}</CTableDataCell>
                    </CTableRow>
                  ))}
                  

                  {/* <CTableRow>
                    <CTableHeaderCell scope="row">3</CTableHeaderCell>
                    <CTableDataCell>Send</CTableDataCell>
                    <CTableDataCell>
                    <CRow >

                      <CFormLabel htmlFor="inputPassword" className="col-sm-3 col-form-label">
                      #FFFF00
                      </CFormLabel>

                      <CFormInput
                          className="col-sm-2"
                          type="color"
                          id="exampleColorInput"
                          defaultValue="#FFFF00"
                          title="Choose your color"
                          disabled
                        />
                    </CRow>
                    </CTableDataCell>
                    <CTableDataCell>Yellow</CTableDataCell> 
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

export default EventButton
