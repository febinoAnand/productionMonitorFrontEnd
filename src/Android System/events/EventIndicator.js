import React from 'react'
import axios from 'axios'


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
    // CFormSelect,
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

class EventIndicator extends React.Component{

  state = {
    id:0,
    indicatorColor:"",
    indicatorColorName:"",
    indicatorID:"",
    indicatorpin:"",
    indicatorTable:[],
    url:BaseURL+'events/indicator/'
  };

  componentDidMount(){
    this.updateIndicatorTable();
  }

  updateIndicatorTable(){
    let resultData;
    axios.get(this.state.url)
    .then(res => {
      resultData = res.data;
      this.setState({
        indicatorTable:resultData
      })
      console.log(resultData);
    }).catch(err=>{console.log("Error")})
    
  }

  addIndicatorData = (event)=>{
    axios.post(this.state.url,this.state)
    .then(res=>{
      this.updateIndicatorTable();
      this.clearState();
    })
    .catch(err=>{
      console.log(err);
    })
  }

  updateIndicatorData = (event)=>{
    axios.put(this.state.url+this.state.id+"/",this.state)
    .then(res=>{
      this.updateIndicatorTable();
      this.clearState();
    })
  }

  deleteIndicatorData = (event)=>{
    axios.delete(this.state.url+this.state.id+"/")
    .then(res=>{
      this.updateIndicatorTable();
      this.clearState();
    })
    .catch(err=>{
      console.log(err);
    })
  }

  clearState = (event)=>{
    this.setState({
      id:0,
      indicatorColor:"",
      indicatorColorName:"",
      indicatorID:"",
      indicatorpin:"",
    })
  }

  updateState = (event)=>{
    this.setState({
      [event.target.id]:event.target.value
    })
  }

  getRowData= (event)=>{
    this.setState({
      id:event.id,
      indicatorColor:event.indicatorColor,
      indicatorColorName:event.indicatorColorName,
      indicatorID:event.indicatorID,
      indicatorpin:event.indicatorpin,

    })
  }
  

  
  render(){
  return (
    <>
     <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Add Indicator</strong>
          </CCardHeader>
          <CCardBody>
            
              
            
            
            
              <CForm className="row g-3">
                <CCol md={3}>
                  <CFormLabel htmlFor="indicatorID">Indicator ID</CFormLabel>
                  <CFormInput id="indicatorID" placeholder="eg: IND3489" value={this.state.indicatorID} onChange={this.updateState}/>
                </CCol>
                
                <CCol md={3}>
                  <CFormLabel htmlFor="indicatorpin">Pin No.</CFormLabel>
                  <CFormInput id="indicatorpin" placeholder="eg: 1, 2, 3" value={this.state.indicatorpin} onChange={this.updateState}/>
                </CCol>

                <CCol xs={3}>
                  <CFormLabel htmlFor="indicatorColorName">Indicator Color Name</CFormLabel>
                  <CFormInput id="indicatorColorName" placeholder="eg: Red, Blue, Green" value={this.state.indicatorColorName} onChange={this.updateState}/>
                </CCol>
                
                <CCol xs={3}>
                  <CFormLabel htmlFor="indicatorColor">Indicator Color Code</CFormLabel>
                  {/* <ColorPicker/> */}
                  <CFormInput
                          type="color"
                          id="indicatorColor"
                          value={this.state.indicatorColor}
                          title="Choose your color"
                          onChange={this.updateState}
                        />
                
                </CCol>
                
                
                <CCol xs={1}>
                  <div className='d-grid gap-2'>
                    <CButton color='success' variant='outline' onClick={this.addIndicatorData}>Add</CButton>
          
                  </div>
                  
                </CCol>
                <CCol xs={1}>
                  <div className='d-grid gap-2'>
                    <CButton  color='primary' variant='outline' onClick={this.updateIndicatorData}>Update</CButton>
          
                  </div>
                  
                </CCol>
                <CCol xs={1}>
                <div className='d-grid gap-2'>
                  <CButton color='danger' variant='outline' onClick={this.deleteIndicatorData}>Delete</CButton>   
                </div> 
                </CCol>

                <CCol xs={1}>
                <div className='d-grid gap-2'>
                  <CButton  color='warning' variant='outline' onClick={this.clearState}>Clear</CButton>   
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
                    <CTableHeaderCell scope="col">Pin No.</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Color Code</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Color Name</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  
                {this.state.indicatorTable.map((indicatorTable,id)=>(
                  <CTableRow key={indicatorTable.id} onClick={()=>this.getRowData(indicatorTable)}>  
                  <CTableHeaderCell scope="row">{id+1}</CTableHeaderCell>
                  <CTableHeaderCell scope="row">{indicatorTable.indicatorID}</CTableHeaderCell>
                  
                  <CTableDataCell>{indicatorTable.indicatorpin}</CTableDataCell>
                  <CTableDataCell>
                    <CRow>
                    <CFormLabel htmlFor="indicatorColor" className="col-sm-3 col-form-label">{indicatorTable.indicatorColor}</CFormLabel>
                    <CFormInput
                        className="col-sm-2"
                        type="color"
                        id="indicatorColor"
                        value={indicatorTable.indicatorColor}
                        title="Choose your color"
                        disabled
                      />
                    </CRow>
                  </CTableDataCell>
                  <CTableDataCell>{indicatorTable.indicatorColorName}</CTableDataCell>
                </CTableRow>
                ))}
                  

{/* 
                  <CTableRow>
                    <CTableHeaderCell scope="row">2</CTableHeaderCell>
                    <CTableDataCell>4</CTableDataCell>
                    <CTableDataCell>3</CTableDataCell>
                    <CTableDataCell>
                    <CRow >

                      <CFormLabel htmlFor="inputPassword" className="col-sm-3 col-form-label">
                      #FF0000
                      </CFormLabel>

                      <CFormInput
                          className="col-sm-2"
                          type="color"
                          id="exampleColorInput"
                          defaultValue="#FF0000"
                          title="Choose your color"
                          disabled
                        />
                      </CRow>
                    </CTableDataCell>
                    <CTableDataCell>Red</CTableDataCell>
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

export default EventIndicator
