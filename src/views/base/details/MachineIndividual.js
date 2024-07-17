import React, { useEffect, useState } from 'react'

import {
  CChartPolarArea,
  CChartRadar,
} from '@coreui/react-chartjs'

import {

  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'

import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import BaseURL from 'src/assets/contants/BaseURL'

const MachineIndividual = () => {

  const statusBar = {
    width:"100%",
    height:"15px",
    borderRadius:"10px"
  }


  const [searchParams] = useSearchParams("machineid");
  const machineIDParam = searchParams.get("machineid");
  
  const [machineDetails,setMachineDetails] = useState({
    "machine": {
        "id": 0,
        "machineID": "",
        "name": "",
        "manufacture": "",
        "model": "",
        "line": ""
    },
    "device": {
        "id": 0,
        "deviceID": "",
        "model": "",
        "hardwareVersion": "",
        "softwareVersion": ""
    },
    "problemhistory": [],
    "activeproblem": []
});


  
  useEffect(() => {
    const interval = setInterval(() => {
      axios.get(BaseURL+"data/machinelivedata?machineid="+machineIDParam).then((response) => {
      setMachineDetails(response.data);
      console.log(response.data);
    });
      
    }, 2000);

    return () => {
      clearInterval(interval);
    };
    // eslint-disable-next-line
  }, []);

  
  
  return  (
    <CRow>
      <CCol xs={1}>
      </CCol>  
      <CCol xs={4}>
        <CCard className="mb-4">
          <CCardHeader>
            Machine Details 
          </CCardHeader>
          <CCardBody>
              <CTable>
                <CTableHead>
                  <CTableRow>
                    <CTableDataCell scope="col">Machine ID</CTableDataCell>
                    <CTableDataCell>{machineDetails.machine.machineID}</CTableDataCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  <CTableRow>
                    
                    <CTableDataCell scope="col">Device ID</CTableDataCell>
                    <CTableDataCell>{machineDetails.device.deviceID}</CTableDataCell>
                    
                  </CTableRow>
                  <CTableRow>
                    
                    <CTableDataCell scope="col">Name</CTableDataCell>
                    <CTableDataCell>{machineDetails.machine.name}</CTableDataCell>
                    
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell scope="col">Manufracture</CTableDataCell>
                    <CTableDataCell>{machineDetails.machine.manufacture}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell scope="col">Model</CTableDataCell>
                    <CTableDataCell>{machineDetails.machine.model}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell scope="col">Line</CTableDataCell>
                    <CTableDataCell>{machineDetails.machine.line}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell scope="col">Hardware Version</CTableDataCell>
                    <CTableDataCell>{machineDetails.device.hardwareVersion}</CTableDataCell>
                  </CTableRow>
                  <CTableRow>
                    <CTableDataCell scope="col">Software Verison</CTableDataCell>
                    <CTableDataCell>{machineDetails.device.softwareVersion}</CTableDataCell>
                  </CTableRow>
                </CTableBody>
              </CTable>
            
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={3}>
        <CCard className="mb-4">
          <CCardHeader>Radar Chart</CCardHeader>
          <CCardBody>
            <CChartRadar
              data={{
                labels: [
                  'EG102',
                  'EG391',
                  'EG200',
                  'EG239',
                  'EG489',
                  'EG295',
                  'EG194',
                ],
                datasets: [
                  {
                    label: 'My First dataset',
                    backgroundColor: 'rgba(220, 220, 220, 0.2)',
                    borderColor: 'rgba(220, 220, 220, 1)',
                    pointBackgroundColor: 'rgba(220, 220, 220, 1)',
                    pointBorderColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(220, 220, 220, 1)',
                    data: [65, 59, 90, 81, 56, 55, 40],
                  },
                  {
                    label: 'My Second dataset',
                    backgroundColor: 'rgba(151, 187, 205, 0.2)',
                    borderColor: 'rgba(151, 187, 205, 1)',
                    pointBackgroundColor: 'rgba(151, 187, 205, 1)',
                    pointBorderColor: '#fff',
                    pointHighlightFill: '#fff',
                    pointHighlightStroke: 'rgba(151, 187, 205, 1)',
                    data: [28, 48, 40, 19, 96, 27, 100],
                  },
                ],
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={3}>
        <CCard className="mb-4">
          <CCardHeader>Polar Area Chart</CCardHeader>
          <CCardBody>
            <CChartPolarArea 
              data={{
                labels: ['Red', 'Green', 'Yellow', 'Grey', 'Blue'],
                datasets: [
                  {
                    data: [11, 16, 7, 3, 14],
                    backgroundColor: ['#FF6384', '#4BC0C0', '#FFCE56', '#E7E9ED', '#36A2EB'],
                  },
                ],
                
              }}
            />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={1}>
      </CCol> 
      <CCol xs={1}>
      </CCol> 
      <CCol xs={10}>
          <CCard className="mb-4">
            <CCardHeader>Active Problem</CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell scope="col"> </CTableHeaderCell>
                    <CTableHeaderCell scope="col">Date Time {machineDetails.length}</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Event</CTableHeaderCell>
                    <CTableHeaderCell scope="col" className="text-center">Issue at</CTableHeaderCell>
                    <CTableHeaderCell scope="col" className="text-center">Status</CTableHeaderCell>
                    <CTableHeaderCell scope="col"></CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {machineDetails.activeproblem.length === 0 && (
                    <CTableRow>
                      <CTableDataCell colSpan='6' className="text-center">
                         No Active Problem
                        </CTableDataCell>
                    </CTableRow>
                  )}
                  {machineDetails.activeproblem.map((item, index) => (
                    <CTableRow v-for="item in tableItems" key={index}>
                      <CTableDataCell className="text-center">
                        
                      </CTableDataCell>
                      <CTableDataCell >
                      {item.date} {item.time} 
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.event.problem.problemCode} - {item.event.problem.problemDescription}</div>
                        <div className="medium text-medium-emphasis">
                          <span>Process: {item.eventGroupID}</span> | Event:{' '} {item.event.eventID}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell className="text-center">
                        <div>{item.issueTime}</div>
                      </CTableDataCell>

                      <CTableDataCell className="text-center">
                        <div style={{...statusBar,backgroundColor:item.event.indicator.indicatorColor}}></div>
                      </CTableDataCell>

                      <CTableDataCell>
                      </CTableDataCell>

                  
                    </CTableRow>
                  )) 
                  }
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
      </CCol>
      <CCol xs={1}>
      </CCol> 
      <CCol xs={1}>
      </CCol> 
      <CCol xs={10}>
          <CCard className="mb-4">
            <CCardHeader>History</CCardHeader>
            <CCardBody>
            <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col"></CTableHeaderCell>
                    
                      <CTableHeaderCell scope="col">Date Time</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Event Group</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Event ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Issue Time</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Acknowledge Time</CTableHeaderCell>
                      <CTableHeaderCell scope="col">End Time</CTableHeaderCell>
                      
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                {machineDetails.problemhistory.length === 0 && (
                    <CTableRow>
                      <CTableDataCell colSpan='8' className="text-center">
                         No Problem History
                        </CTableDataCell>
                    </CTableRow>
                  )}
                  {machineDetails.problemhistory.map((item,index)=>(
                    <CTableRow key={index}>
                      <CTableHeaderCell scope="row"></CTableHeaderCell>
                      <CTableDataCell>{item.date} {item.time}</CTableDataCell>
                      <CTableDataCell>{item.eventGroupID}</CTableDataCell>
                      <CTableDataCell>{item.event.eventID}</CTableDataCell>
                      <CTableDataCell>{item.issueTime}</CTableDataCell>
                      <CTableDataCell></CTableDataCell>
                      <CTableDataCell>{item.endTime}</CTableDataCell>
                    </CTableRow>

                  ))}
                  
                  
                  
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
      </CCol>
    </CRow>
  )
}

export default MachineIndividual
