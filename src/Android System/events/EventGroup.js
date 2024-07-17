import React from 'react'
import axios from 'axios';


import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormLabel,
    CFormInput,
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
class EventGroup extends React.Component{
 

  state = {
    id:0,
    groupID:"",
    groupName:"",
    events:[],
    machines:[],
    tableList:[],
    allEvents:[],
    allMachine:[],
    eventSelectedValues:[],
    machineSelectedValues:[],
    url:BaseURL+'events/eventgroup/'
    };

  componentDidMount(){
    this.updateEventGroupTable();
    this.clearState();
  }

  clearState = () =>{
    this.setState({
      id:0,
      groupID:"",
      groupName:"",
      eventSelectedValues:[],
      machineSelectedValues:[]
    })
  }

  addEventGroup = (event)=>{
    console.log(this.state);
    let postData = {
      id:this.state.id,
      groupID:this.state.groupID,
      groupName:this.state.groupName,
      eventSelectedValues:this.state.eventSelectedValues,
      machineSelectedValues:this.state.machineSelectedValues,
      // machines:this.state.machines,
      // events:this.state.events
    }
    axios.post(this.state.url,postData)
    .then(res=>{
      this.updateEventGroupTable();
      this.clearState();
    })
    .catch(err=>{
      console.log(err);
    })
  }

  updateEventGroup = (event)=>{
    let postData = {
      id:this.state.id,
      groupID:this.state.groupID,
      groupName:this.state.groupName,
      eventSelectedValues:this.state.eventSelectedValues,
      machineSelectedValues:this.state.machineSelectedValues,
    }
    axios.put(this.state.url+this.state.id+"/",postData)
    .then(res=>{
      this.updateEventGroupTable();
      this.clearState();
    })
    .catch(err=>{
      console.log(err);
    })
  }

  deleteEventGroup = (event)=>{
    axios.delete(this.state.url+this.state.id+"/")
    .then(res=>{
      this.updateEventGroupTable();
      this.clearState();
    })
    .catch(err=>{
      console.log(err);
    })
  }


  getRowData = (event)=>{
    console.log(event)
    let wholeValues = event.events;
    let wholeMachineValues = event.machines;
    let selectedValues = [];
    let machineValues = [];
  
    for(let i = 0;i<wholeValues.length;i++){
      let currentValue = wholeValues[i].eventID;
      selectedValues.push(currentValue)
    }

    for (let i =0;i<wholeMachineValues.length;i++){
      let currentMachine = wholeMachineValues[i].machineID;
      machineValues.push(currentMachine)
    }
    

    this.setState({
      id:event.id,
      groupID:event.groupID,
      groupName:event.groupName,
      eventSelectedValues:selectedValues,
      machineSelectedValues:machineValues,
      events:event.events,
      machines:event.machines
    },
    function (){
      console.log(this.state)
    }
    )
  }

  updateEventGroupTable(){
    let data;
    axios.get(BaseURL+'events/eventgroup/')
    .then(res => {
      data = res.data;
      this.setState({
        tableList:data
      });

      // console.log(data);
    }).catch(err=>{})

    axios.get(BaseURL+'events/event/')
    .then(res =>{
      data = res.data;
      this.setState({
        allEvents:data
      });

      // console.log(data);
    })

    axios.get(BaseURL+'devices/machine/')
    .then(res =>{
      data = res.data;
      this.setState({
        allMachine:data
      });

      // console.log(data);
    })

  }

  getMultipleSelect = (event)=>{

    // console.log(event)
    let multipleOptions = event.target.options
    let allEvents = this.state.allEvents
    let value = []
    let selectEventID = []
    for(let i = 0;i<multipleOptions.length;i++){
      if(multipleOptions[i].selected){
        value.push(multipleOptions[i].value)
        // console.log(value)
        for(let j = 0;j<allEvents.length;j++){
          if(allEvents[j].eventID === multipleOptions[i].value){
            selectEventID.push(allEvents[j])
          }
        }
      }
    }
    
    this.setState({
      eventSelectedValues:value,
      events:selectEventID
    },
    // function(){
    //   console.log(this.state)
    // }
    )
   
  }

  getMachineMultipleSelect = (event)=>{

    console.log(event)
    let multipleOptions = event.target.options;
    let allMachine = this.state.allMachine;
    let value = [];
    let selectedMachineID = [];
    for(let i = 0;i<multipleOptions.length;i++){
      if(multipleOptions[i].selected){
        value.push(multipleOptions[i].value)
        console.log(value)
        for(let j = 0;j<allMachine.length;j++){
          if(allMachine[j].machineID === multipleOptions[i].value){
            selectedMachineID.push(allMachine[j])
          }
        }
      }
    }
    
    this.setState({
      machineSelectedValues:value,
      machines:selectedMachineID
    },
    function(){
      console.log(this.state)
    }
    )
   
  }



  
 render(){ 
  return (
    <>
     <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Add Process</strong>
            
          </CCardHeader>
          <CCardBody>
            
              
            
            
            
              <CForm className="row g-3">
                <CCol md={3}>
                  <CFormLabel htmlFor="groupID">ID</CFormLabel>
                  <CFormInput id="groupID" placeholder="eg: EG23098, EG2384" value={this.state.groupID} onChange={(event)=>{this.setState({groupID:event.target.value})}}/>
                </CCol>

                <CCol md={8}>
                  
                </CCol>

                <CCol md={3}>
                  <CFormLabel htmlFor="groupName">Process Name</CFormLabel>
                  <CFormInput id="groupName" placeholder="eg: Process Name" value={this.state.groupName} onChange={(event)=>{this.setState({groupName:event.target.value})}}/>
                </CCol>
                

                <CCol md={6}>
                  
                </CCol>

               
                
                <CCol md={4}>
                  <CFormLabel htmlFor="buttonid">Event List</CFormLabel>
                  <CFormSelect id="buttonid" multiple value={this.state.eventSelectedValues} onChange={this.getMultipleSelect}>
                      
                    {this.state.allEvents.map(allEvents=>(
                      <option key={allEvents.id} >{allEvents.eventID}</option>
                    ))};
                    
                    {/* <option>Users 2</option>
                    <option>Users 3</option> */}
                  </CFormSelect>
                  
                </CCol>

                <CCol md={1}>
                  
                </CCol>

                <CCol md={4}>
                  <CFormLabel htmlFor="buttonid">Machine List</CFormLabel>
                  <CFormSelect id="buttonid" multiple value={this.state.machineSelectedValues}  onChange={this.getMachineMultipleSelect}>
                      
                    {this.state.allMachine.map(allMachines=>(
                      <option key={allMachines.machineID}>{allMachines.machineID}</option>
                    ))};
                    
                   
                  </CFormSelect>
                  
                </CCol>

                <CCol md={3}>
                  
                </CCol>

                <CCol md={12}>
                  
                </CCol>
               
              
                
                <CCol xs={1}>
                  <div className='d-grid gap-2'>
                    <CButton color='success' variant='outline' onClick={this.addEventGroup}>Add</CButton>
                  </div>
                </CCol>

                <CCol xs={1}>
                  <div className='d-grid gap-2'>
                    <CButton  color='primary' variant='outline' onClick={this.updateEventGroup}>Update</CButton>
                  </div>
                </CCol>

                <CCol xs={1}>
                <div className='d-grid gap-2'>
                  <CButton color='danger' variant='outline' onClick={this.deleteEventGroup}>Delete</CButton>   
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
            <strong>Process</strong>
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
                    <CTableHeaderCell scope="col">Process Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Event IDs</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Machine IDs</CTableHeaderCell>
                    
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
                 
                  {this.state.tableList.map((output,id)=>(
                    
                    <CTableRow key={output.id} onClick={()=>this.getRowData(output)}>
                      <CTableHeaderCell scope="row">{id +1}</CTableHeaderCell>
                      <CTableDataCell>{output.groupID}</CTableDataCell>
                      <CTableDataCell>{output.groupName}</CTableDataCell>
                      <CTableDataCell>
                        {output.events.map((events,id) => (
                          <div key={events.id}>{events.eventID}</div>
                        ))}
                      </CTableDataCell>
                      <CTableDataCell>
                        {output.machines.map((machines,id) => (
                          <div key={machines.machineID}>{machines.machineID}</div>
                        ))}
                      </CTableDataCell>
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

export default EventGroup
