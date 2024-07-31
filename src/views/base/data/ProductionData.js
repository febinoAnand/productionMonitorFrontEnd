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

const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); 
  return {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
  };
};

class ProductionData extends React.Component {
  state = {
    productionDataList: [],
    searchQuery: '',
    filteredData: [],
    selectedRows: [], // New state to track selected rows
  };

  componentDidMount() {
    axios.get(`${BaseURL}data/productiondata/`, { headers: getAuthHeaders() })
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

  handleSelectAll = (event) => {
    const { filteredData } = this.state;
    const isChecked = event.target.checked;
    this.setState({
      selectedRows: isChecked ? filteredData.map(data => data.id) : []
    });
  };

  handleRowSelect = (event, id) => {
    const { selectedRows } = this.state;
    const isChecked = event.target.checked;
    this.setState({
      selectedRows: isChecked
        ? [...selectedRows, id]
        : selectedRows.filter(rowId => rowId !== id)
    });
  };

  handleDeleteSelected = () => {
    const { selectedRows } = this.state;
    // Make an API call to delete selected rows
    axios.post(`${BaseURL}data/deleteproductiondata/`, { ids: selectedRows }, { headers: getAuthHeaders() })
      .then(() => {
        // Filter out deleted rows from filteredData
        this.setState(prevState => ({
          filteredData: prevState.filteredData.filter(data => !selectedRows.includes(data.id)),
          selectedRows: [] // Clear selected rows
        }));
      })
      .catch(error => console.error('Error deleting data:', error));
  };

  render() {
    return (
      <div className="page">
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Production Data</strong>
                <CButton 
                  type="button" 
                  color="primary" 
                  className="float-end"
                  onClick={this.handleDeleteSelected}
                  disabled={this.state.selectedRows.length === 0}
                >
                  Delete Selected
                </CButton>
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
                        <CTableHeaderCell>
                          <input
                            type="checkbox"
                            onChange={this.handleSelectAll}
                            checked={this.state.filteredData.length > 0 && this.state.selectedRows.length === this.state.filteredData.length}
                          />
                        </CTableHeaderCell>
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
                          <CTableDataCell colSpan="13" className="text-center">
                            No data available
                          </CTableDataCell>
                        </CTableRow>
                      ) : (
                        this.state.filteredData.map((production, index) => (
                          <CTableRow key={production.id}>
                            <CTableDataCell>
                              <input
                                type="checkbox"
                                checked={this.state.selectedRows.includes(production.id)}
                                onChange={(e) => this.handleRowSelect(e, production.id)}
                              />
                            </CTableDataCell>
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
