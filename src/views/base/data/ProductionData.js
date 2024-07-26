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

class ProductionData extends React.Component {
  state = {
    productionDataList: [],
    searchQuery: '',
    filteredData: [],
  };

  componentDidMount() {
    axios.get(`${BaseURL}data/productiondata/`)
      .then(res => {
        const resData = res.data;
        const sortedData = resData.reverse();
        this.setState({ productionDataList: sortedData, filteredData: sortedData });
        console.log(sortedData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }

  handleSearchQueryChange = (event) => {
    this.setState({ searchQuery: event.target.value });
  };

  handleSearch = () => {
    const { productionDataList, searchQuery } = this.state;
    const filteredData = productionDataList.filter(production => 
      Object.values(production).some(value =>
        value.toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
    this.setState({ filteredData });
  };

  render() {
    return (
      <div className="page">
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Production Data</strong>
              </CCardHeader>
              <CCardBody>
                <CCol md={4}>
                  <CInputGroup className="flex-nowrap mt-3">
                    <CFormInput
                      placeholder="Search"
                      aria-label="Search"
                      aria-describedby="addon-wrapping"
                      value={this.state.searchQuery}
                      onChange={this.handleSearchQueryChange}
                    />
                    <CButton type="button" color="dark" id="button-addon2" onClick={this.handleSearch}>
                      Search
                    </CButton>
                  </CInputGroup>
                </CCol>

                <CCol className='mb-3'></CCol>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>

                <CTable striped hover>
                  <CTableHead color='dark'>
                    <CTableRow>
                      <CTableHeaderCell scope="col">Si.No</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Time</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Shift ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Shift Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Shift StartTime</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Shift EndTime</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Target</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Count</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Machine ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Machine Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Data ID</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {this.state.filteredData.length === 0 ? (
                      <CTableRow>
                        <CTableDataCell colSpan="12" className="text-center">
                          No data available
                        </CTableDataCell>
                      </CTableRow>
                    ) : (
                      this.state.filteredData.map((production, index) => (
                        <CTableRow key={production.id}>
                          <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                          <CTableDataCell>{production.date}</CTableDataCell>
                          <CTableDataCell>{production.time}</CTableDataCell>
                          <CTableDataCell>{production.shift_id}</CTableDataCell>
                          <CTableDataCell>{production.shift_name}</CTableDataCell>
                          <CTableDataCell>{production.shift_start_time}</CTableDataCell>
                          <CTableDataCell>{production.shift_end_time}</CTableDataCell>
                          <CTableDataCell>{production.target_production}</CTableDataCell>
                          <CTableDataCell>{production.production_count}</CTableDataCell>
                          <CTableDataCell>{production.machine_id}</CTableDataCell>
                          <CTableDataCell>{production.machine_name}</CTableDataCell>
                          <CTableDataCell>{production.data_id}</CTableDataCell>
                        </CTableRow>
                      ))
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

export default ProductionData;