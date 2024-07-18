import React from 'react';
import axios from 'axios';
import BaseURL from 'src/assets/contants/BaseURL'

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

class DeviceData extends React.Component {
  state = { deviceDataList: [] };

  componentDidMount() {
    axios.get(BaseURL + "data/devices/")
      .then(res => {
        const resData = res.data;
        this.setState({ deviceDataList: resData });
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
                <strong>Device Data</strong>
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
                      <CTableHeaderCell scope="col">Data</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Device ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Protocol</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Topic API</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Log Data ID</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {this.state.deviceDataList.map((device, id) => (
                      <CTableRow key={device.id}>
                        <CTableHeaderCell scope="row">{id + 1}</CTableHeaderCell>
                        <CTableDataCell>{device.date}</CTableDataCell>
                        <CTableDataCell>{device.time}</CTableDataCell>
                        <CTableDataCell>{device.data}</CTableDataCell>
                        <CTableDataCell>{device.deviceID}</CTableDataCell>
                        <CTableDataCell>{device.protocol}</CTableDataCell>
                        <CTableDataCell>{device.topicAPI}</CTableDataCell>
                        <CTableDataCell>{device.logDataID}</CTableDataCell>
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

export default DeviceData;
