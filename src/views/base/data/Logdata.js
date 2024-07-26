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

class LogData extends React.Component {
  state = {
    logDataList: [],
    searchQuery: '',
    filteredData: [],
  };

  componentDidMount() {
    axios.get(BaseURL + "data/logdata/")
      .then(res => {
        const resData = res.data;
        const sortedData = resData.reverse();
        this.setState({ logDataList: sortedData, filteredData: sortedData });
        console.log(sortedData);
      })
      .catch(error => {
        console.error("There was an error fetching the log data!", error);
      });
  }

  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  }

  handleSearch = () => {
    const { searchQuery, logDataList } = this.state;
    if (searchQuery.trim() === '') {
      this.setState({ filteredData: logDataList });
      return;
    }
    const filteredData = logDataList.filter(log =>
      log.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.time.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.received_data.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.protocol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.topic_api.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.unique_id.toLowerCase().includes(searchQuery.toLowerCase())
    );
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
                <strong>Log Data</strong>
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
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <CTable striped hover>
                  <CTableHead color='dark'>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Si.No</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Time</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Received Data</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Protocol</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Topic API</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Unique ID</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredData.length > 0 ? (
                      filteredData.map((log, index) => (
                        <CTableRow key={log.unique_id}>
                          <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                          <CTableDataCell>{log.date}</CTableDataCell>
                          <CTableDataCell>{log.time}</CTableDataCell>
                          <CTableDataCell>{log.received_data}</CTableDataCell>
                          <CTableDataCell>{log.protocol}</CTableDataCell>
                          <CTableDataCell>{log.topic_api}</CTableDataCell>
                          <CTableDataCell>{log.unique_id}</CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan="7" className="text-center">
                          No data available
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>
    );
  }
}

export default LogData;