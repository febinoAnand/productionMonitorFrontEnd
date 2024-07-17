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



class EventProblem extends React.Component{

  state = {
    problemTable:[],
    problemCode:"",
    problemName:"",
    problemDescription:"",
    problemType:"",
    id:0,
    url:BaseURL+"events/problem/"
  };

  componentDidMount(){
    this.updateProblemCodeTable();
  }

  addProblemCode = (event) =>{
    axios.post(this.state.url,this.state)
    .then(res=>{
      // console.log(res.data);
      this.updateProblemCodeTable();
      this.clearState();
    })
    .catch(err=>{
      console.log(err);
    })
  }

  deleteProblemCode = (event)=>{
    axios.delete(this.state.url+this.state.id+'/')
    .then(res=>{
      // console.log(res.data);
      this.updateProblemCodeTable();
      this.clearState();
    })
    .catch(err=>{
      console.log(err);
      alert(err)
    })
  }

  updateProblemCode = (event)=>{
    axios.put(this.state.url+this.state.id+"/",this.state)
    .then(res=>{
      this.updateProblemCodeTable();
      this.clearState();
    })
    .catch(err=>{
      console.log(err);
    })
  }


  updateProblemCodeTable(){
    let resultData;
    axios.get(this.state.url)
    .then(res =>{
      resultData = res.data;
      this.setState({
        problemTable:resultData,
        problemType:"ISSUE"
      });

      console.log(resultData);
    })
  }

  getRowData = (event)=>{
    this.setState({
      problemCode:event.problemCode,
      problemName:event.problemName,
      problemDescription:event.problemDescription,
      id:event.id
    })
  }

  clearState = ()=>{
    this.setState({
      problemCode:"",
      problemName:"",
      problemDescription:"",
      id:0
    })
  }

  updateState = (event)=>{
    this.setState({[event.target.id]:event.target.value})
  }

  updateDropdown = (event)=>{

    // console.log("Id-->",event.target.id);
    // console.log("Value-->",event.target.value);
    let value = event.target.value;

    this.setState({
      problemType:value
    });


    console.log(this.state);
  
  }


  render(){
    return (
      <>
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Add Problem code</strong>
            </CCardHeader>
            <CCardBody>
                <CForm className="row g-3">
                  {/* <CCol md={3}>
                    <CFormLabel htmlFor="problemid">ID</CFormLabel>
                    <CFormSelect id="problemid" >
                      <option></option>
                      <option>No Items</option>
                    </CFormSelect>
                  </CCol> */}
                  
                  <CCol md={3}>
                    <CFormLabel htmlFor="problemCode">Problem Code</CFormLabel>
                    <CFormInput id="problemCode"  onChange={this.updateState} value={this.state.problemCode} placeholder="eg: WR3489, ER34095, OK" />
                  </CCol>

                  <CCol xs={3}>
                    <CFormLabel htmlFor="problemName" >Problem Name</CFormLabel>
                    <CFormInput id="problemName" onChange={this.updateState} value={this.state.problemName} placeholder="eg: Materail Stopped, No Power, ALL OK" />
                  </CCol>
                  
                  <CCol xs={6}>
                    <CFormLabel htmlFor="problemDescription">Description</CFormLabel>
                    {/* <ColorPicker/> */}
                    <CFormInput onChange={this.updateState} value={this.state.problemDescription} id="problemDescription"/>
                  </CCol>

                  <CCol xs={3}>
                    <CFormLabel htmlFor="problemType" >Problem Type</CFormLabel>
                    <CFormSelect id="problemType" value={this.state.problemType} onChange={this.updateDropdown}>
                      <option key="ISSUE">ISSUE</option>
                      <option key="ACKNOWLEDGE">ACKNOWLEDGE</option>
                      <option key="FINE">FINE</option>
                      
                    </CFormSelect>
                  </CCol>
                  <CCol xs={9}>
                   
                  </CCol>
                 
                  
                  
                  
                  <CCol xs={1}>
                    <div className='d-grid gap-2'>
                      <CButton  color='success' variant='outline' onClick={this.addProblemCode}>Add</CButton>
            
                    </div>
                    
                  </CCol>
                  <CCol xs={1}>
                    <div className='d-grid gap-2'>
                      <CButton  color='primary' variant='outline' onClick={this.updateProblemCode}>Update</CButton>
            
                    </div>
                    
                  </CCol>
                  <CCol xs={1}>
                  <div className='d-grid gap-2'>
                    <CButton  color='danger' variant='outline' onClick={this.deleteProblemCode} >Delete</CButton>   
                  </div> 
                  </CCol>
                  <CCol xs={1}>
                  <div className='d-grid gap-2'>
                    <CButton  color='warning' variant='outline' onClick={this.clearState} >Clear</CButton>   
                  </div> 
                  </CCol>
                </CForm>
              
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12}>
          <CCard className="mb-4">
            <CCardHeader>
              <strong>Problem List</strong>
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
                      <CTableHeaderCell scope="col">Code</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Problem Type</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Description</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {this.state.problemTable.map((problemTable,id)=>(
                      <CTableRow key={problemTable.id} onClick={()=>this.getRowData(problemTable)}>
                        <CTableHeaderCell scope="row">{id+1}</CTableHeaderCell>
                        <CTableDataCell>{problemTable.problemCode}</CTableDataCell>
                        <CTableDataCell>{problemTable.problemName}</CTableDataCell>
                        <CTableDataCell>{problemTable.problemType}</CTableDataCell>
                        <CTableDataCell>{problemTable.problemDescription}</CTableDataCell>
                      </CTableRow>
                    ))}
                    
                    {/* <CTableRow>
                      <CTableHeaderCell scope="row">2</CTableHeaderCell>
                      <CTableDataCell>ALL OK</CTableDataCell>
                      <CTableDataCell>OK</CTableDataCell>
                      <CTableDataCell>Working Fine</CTableDataCell>
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

export default EventProblem
