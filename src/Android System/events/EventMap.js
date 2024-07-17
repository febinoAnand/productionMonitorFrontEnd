import React from 'react'
import axios from 'axios';


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
class EventMap extends React.Component{
 

  state = {
    id:0,
    eventID:"",

    buttonID:0,
    button:{},

    problemID:0,
    problem:{},

    indicatorID:0,
    indicator:{},
    
    buttonList:[],
    problemList:[],
    indicatorList:[],
    eventTable:[],

    url:BaseURL+'events/event/'
  };

  updateState = (event)=>{
    this.setState({
     [event.target.id]:event.target.value
    })
  }

  addEventData = ()=>{
    // console.log(this.state)
    axios.post(this.state.url,this.state)
    .then(res=>{
      this.updateEventTable();
      this.clearState();
    })
    .catch(err=>{
      console.log(err)
    })
  }


  updateEventData = ()=>{
    axios.put(this.state.url+this.state.id+"/",this.state)
    .then(res=>{
      this.updateEventTable();
      this.clearState();
    })
    .catch(err=>{
      console.log(err)
    })
  }

  deleteEventData = ()=>{
    axios.delete(this.state.url+this.state.id+"/")
    .then(res=>{
      this.updateEventTable();
      this.clearState();
    })
    .catch(err=>{
      console.log(err)
    })
  }


  updateDropdown = (event)=>{
    let value = parseInt(event.target.value)

    switch(event.target.id){
      case "button":
        this.setState({
          buttonID:value,
          button:{id:value}
        })
        break;
      case "problem":
        this.setState({
          problemID:value,
          problem:{id:value}
        })
        break;
      case "indicator":
        this.setState({
          indicatorID:value,
          indicator:{id:value}
        })
        break;
        default:
          break;
    }
  
  }

  updateEventTable(){

    let data;
    axios.get(this.state.url)
    .then(res => {
      data = res.data;
      this.setState({
        eventTable:data
      });

      console.log(data);
    }).catch(err=>{})

    axios.get(BaseURL+"events/button/")
    .then(res => {
      data = res.data;
      this.setState({
        buttonList:data
      });
      console.log(data);
    }).catch(err=>{})

    axios.get(BaseURL+"events/indicator/")
    .then(res => {
      data = res.data;
      this.setState({
        indicatorList:data
      });
      console.log(data);
    }).catch(err=>{})

    axios.get(BaseURL+"events/problem/")
    .then(res => {
      data = res.data;
      this.setState({
        problemList:data
      });
      console.log(data);
    }).catch(err=>{})

  }


  componentDidMount(){
    this.updateEventTable();
    this.clearState();
  }

  clearState = ()=>{
    this.setState({
      id:0,
      eventID:"",
  
      buttonID:0,
      button:{},
  
      problemID:0,
      problem:{},
  
      indicatorID:0,
      indicator:{},
    })

  }

  getRowData = (event)=>{
    this.setState({
      id:event.id,
      eventID:event.eventID,
      button:event.button,
      indicator:event.indicator,
      problem:event.problem,
      buttonID:event.button.id,
      indicatorID:event.indicator.id,
      problemID:event.problem.id
    })
  }

  

 render(){ 
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
                  <CFormLabel htmlFor="eventID">Evnet ID</CFormLabel>
                  <CFormInput id="eventID" placeholder="eg: EVE23098, EVE2384" value={this.state.eventID} onChange={this.updateState}/>
                </CCol>

                <CCol md={3}>
                  <CFormLabel htmlFor="button">Button ID</CFormLabel>
                  <CFormSelect id="button" value={this.state.buttonID} onChange={this.updateDropdown}>
                    <option key={0}></option>
                    {this.state.buttonList.map((button,id)=>(
                      <option key={id+1} value={button.id}>{button.buttonID}-{button.buttonName}</option>
                    ))}
                    
                    
                  </CFormSelect>
                </CCol>

                <CCol md={3}>
                  <CFormLabel htmlFor="problem">Problem Code</CFormLabel>
                  <CFormSelect id="problem" value={this.state.problemID} onChange={this.updateDropdown}>
                    <option key={0}></option>
                    {this.state.problemList.map((problem,id)=>(
                      <option key={id+1} value={problem.id}>{problem.problemCode}-{problem.problemName}</option>
                    ))}
                    
                  </CFormSelect>
                </CCol>

                <CCol md={3}>
                  <CFormLabel htmlFor="indicator">Indicator ID</CFormLabel>
                  <CFormSelect id="indicator" value={this.state.indicatorID} onChange={this.updateDropdown}>
                    <option key={0}></option>
                    {this.state.indicatorList.map((indicator,id)=>(
                      <option key={id+1} value={indicator.id}>{indicator.indicatorID}-{indicator.indicatorColorName}</option>
                    ))}
                  </CFormSelect>
                </CCol>
                
                {/* <CCol md={6}>
                  <CFormLabel htmlFor="buttonid">Users To Acknoledge</CFormLabel>
                  <CFormSelect id="buttonid" multiple>
                    
                    <option>Users 1</option>
                    <option>Users 2</option>
                    <option>Users 3</option>
                  </CFormSelect>
                  
                </CCol> */}

                {/* <CCol md={6}>
                  <CFormLabel htmlFor="buttonid">Users To Notify</CFormLabel>
                  <CFormSelect id="buttonid" multiple>
                  <option>Users 1</option>
                    <option>Users 2</option>
                    <option>Users 3</option>
                  </CFormSelect>
                </CCol>
               */}
                
                <CCol xs={1}>
                  <div className='d-grid gap-2'>
                    <CButton onClick={this.addEventData} color='success' variant='outline'>Add</CButton>
          
                  </div>
                  
                </CCol>
                <CCol xs={1}>
                  <div className='d-grid gap-2'>
                    <CButton onClick={this.updateEventData}  color='primary' variant='outline'>Update</CButton>
          
                  </div>
                  
                </CCol>
                <CCol xs={1}>
                <div className='d-grid gap-2'>
                  <CButton onClick={this.deleteEventData}  color='danger' variant='outline'>Delete</CButton>   
                </div> 
                </CCol>

                <CCol xs={1}>
                <div className='d-grid gap-2'>
                  <CButton onClick={this.clearState}  color='warning' variant='outline'>Clear</CButton>   
                </div> 
                </CCol>
              </CForm>
            
          </CCardBody>
        </CCard>
      </CCol>

      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Event List</strong>
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
                  {/* <CTableRow>
                    <CTableHeaderCell scope="row">1</CTableHeaderCell>
                    <CTableDataCell>1</CTableDataCell>
                    <CTableDataCell>BTN38940</CTableDataCell>
                    <CTableDataCell>PRM30909</CTableDataCell>
                    <CTableDataCell>IND30948</CTableDataCell>
                  </CTableRow> */}
                 
                  {this.state.eventTable.map((output,id)=>(
                    
                    <CTableRow key={id} onClick={()=>this.getRowData(output)}>
                    <CTableHeaderCell scope="row">{id +1}</CTableHeaderCell>
                      <CTableDataCell>{output.eventID}</CTableDataCell>
                      <CTableDataCell>{output.button.buttonID} - {output.button.buttonName}</CTableDataCell>
                      <CTableDataCell>{output.problem.problemCode} - {output.problem.problemName}</CTableDataCell>
                      <CTableDataCell>{output.indicator.indicatorID} - {output.indicator.indicatorColorName}</CTableDataCell>
                    </CTableRow>
                    

                  ))}
                  

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

export default EventMap
