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
  state = {
    machineDataList: [],
    searchQuery: '',
    filteredData: [],
  };

  componentDidMount() {
    axios.get(BaseURL + "data/machinedata/")
      .then(res => {
        const resData = res.data;
        const sortedData = resData.reverse();
        this.setState({ machineDataList: sortedData, filteredData: sortedData });
        console.log(sortedData);
      })
      .catch(error => {
        console.error("There was an error fetching the machine data!", error);
      });
  }

  handleSearchChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  }

  handleSearch = () => {
    const { searchQuery, machineDataList } = this.state;
    if (searchQuery.trim() === '') {
      this.setState({ filteredData: machineDataList });
      return;
    }
    const filteredData = machineDataList.filter(machine => {
      const query = searchQuery.toLowerCase();
      return (
        (String(machine.date).toLowerCase().includes(query)) ||
        (String(machine.time).toLowerCase().includes(query)) ||
        (String(machine.machine_id).toLowerCase().includes(query)) ||
        (String(machine.data).toLowerCase().includes(query)) ||
        (String(machine.device_id).toLowerCase().includes(query)) ||
        (String(machine.data_id).toLowerCase().includes(query))
      );
    });
    this.setState({ filteredData });
  }

  render() {
    const { searchQuery, filteredData } = this.state;

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
                      <CTableHeaderCell scope="col">Machine ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Data</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Device ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Data ID</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {filteredData.length > 0 ? (
                      filteredData.map((machine, index) => (
                        <CTableRow key={machine.id}>
                          <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                          <CTableDataCell>{machine.date}</CTableDataCell>
                          <CTableDataCell>{machine.time}</CTableDataCell>
                          <CTableDataCell>{machine.machine_id}</CTableDataCell>
                          <CTableDataCell>{JSON.stringify(machine.data)}</CTableDataCell>
                          <CTableDataCell>{machine.device_id}</CTableDataCell>
                          <CTableDataCell>{machine.data_id}</CTableDataCell>
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
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    );
  }
}

export default MachineData;