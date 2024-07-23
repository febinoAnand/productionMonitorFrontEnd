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

class DeviceData extends React.Component {
  state = {
    deviceDataList: [],
    searchQuery: '',
    filteredData: [],
  };

  componentDidMount() {
    axios.get(BaseURL + "data/devicedata/")
      .then(res => {
        const resData = res.data;
        const sortedData = resData.reverse();
        this.setState({ deviceDataList: sortedData, filteredData: sortedData });
        console.log(sortedData);
      })
      .catch(error => {
        console.error("There was an error fetching the device data!", error);
      });
  }

  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  }

  handleSearch = () => {
    const { searchQuery, deviceDataList } = this.state;
    if (searchQuery.trim() === '') {
      this.setState({ filteredData: deviceDataList });
      return;
    }
    const query = searchQuery.toLowerCase();
    const filteredData = deviceDataList.filter(device => {
      return (
        (String(device.date).toLowerCase().includes(query)) ||
        (String(device.time).toLowerCase().includes(query)) ||
        (String(device.device_id).toLowerCase().includes(query)) ||
        (String(device.protocol).toLowerCase().includes(query)) ||
        (String(device.topic_api).toLowerCase().includes(query)) ||
        (String(device.log_data_id).toLowerCase().includes(query)) ||
        (JSON.stringify(device.data).toLowerCase().includes(query))
      );
    });
    this.setState({ filteredData });
  }

  render() {
    const { searchQuery, filteredData } = this.state;

    return (
      <div className="page">
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
                      value={searchQuery}
                      onChange={this.handleSearchChange}
                    />
                    <CButton type="button" color="dark" onClick={this.handleSearch}>
                      Search
                    </CButton>
                  </CInputGroup>
                </CCol>

                <CCol className='mb-4'></CCol>

                <CTable striped hover>
                  <CTableHead color='dark'>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Si.No</CTableHeaderCell>
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
                    {filteredData.length > 0 ? (
                      filteredData.map((device, index) => (
                        <CTableRow key={device.id}>
                          <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                          <CTableDataCell>{device.date}</CTableDataCell>
                          <CTableDataCell>{device.time}</CTableDataCell>
                          <CTableDataCell>{JSON.stringify(device.data)}</CTableDataCell>
                          <CTableDataCell>{device.device_id}</CTableDataCell>
                          <CTableDataCell>{device.protocol}</CTableDataCell>
                          <CTableDataCell>{device.topic_api}</CTableDataCell>
                          <CTableDataCell>{device.log_data_id}</CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan="8" className="text-center">
                          No data available
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    );
  }
}

export default DeviceData;