import React from 'react';
import axios from 'axios';
import BaseURL from 'src/assets/contants/BaseURL';

import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CInputGroup,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react';

class MachineData extends React.Component {
  state = { machineDataList: [] };

  componentDidMount() {
    axios.get(BaseURL + "data/machines/")
      .then(res => {
        const resData = res.data;
        this.setState({ machineDataList: resData });
        console.log(resData);
      });
  }

  render() {
    return (
      <>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Machine Data</strong>
              </CCardHeader>
              <CCardBody>
                <CCol md={4}>
                  <CInputGroup className="flex-nowrap mt-3">
                    <CFormInput
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="addon-wrapping"
                    />
                    <CButton type="button" color="dark" id="button-addon2">
                      Search
                    </CButton>
                  </CInputGroup>
                </CCol>

                <CCol className='mb-4'></CCol>

                <CTable striped hover>
                <CTableHead color='dark'>
                    <CTableRow>
                      <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Time</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Machine ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Data</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Device ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Data ID</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {this.state.machineDataList.map((machine, id) => (
                      <CTableRow key={machine.id}>
                        <CTableHeaderCell scope="row">{id + 1}</CTableHeaderCell>
                        <CTableDataCell>{machine.date}</CTableDataCell>
                        <CTableDataCell>{machine.time}</CTableDataCell>
                        <CTableDataCell>{machine.machineID}</CTableDataCell>
                        <CTableDataCell>{machine.data}</CTableDataCell>
                        <CTableDataCell>{machine.deviceID}</CTableDataCell>
                        <CTableDataCell>{machine.dataID}</CTableDataCell>
                      </CTableRow>
                    ))}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    );
  }
}

export default MachineData;
