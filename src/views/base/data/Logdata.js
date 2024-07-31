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

// Utility function to get authorization headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token'); 
  return {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
  };
};

// Component definition
class LogData extends React.Component {
  state = {
    logDataList: [],
    searchQuery: '',
    filteredData: [],
    selectedLogIds: [],  // New state for selected log IDs
    selectAll: false,    // State for the select all checkbox
  };

  componentDidMount() {
    axios.get(BaseURL + "data/logdata/", { headers: getAuthHeaders() })
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

  handleCheckboxChange = (event, logId) => {
    const { checked } = event.target;
    this.setState(prevState => {
      const selectedLogIds = checked
        ? [...prevState.selectedLogIds, logId]
        : prevState.selectedLogIds.filter(id => id !== logId);
      return {
        selectedLogIds,
        selectAll: prevState.filteredData.length === selectedLogIds.length,
      };
    });
  }

  handleSelectAllChange = (event) => {
    const { checked } = event.target;
    this.setState(prevState => ({
      selectAll: checked,
      selectedLogIds: checked ? prevState.filteredData.map(log => log.unique_id) : [],
    }));
  }

  handleDeleteSelected = () => {
    const { selectedLogIds } = this.state;
    if (selectedLogIds.length === 0) {
      alert("No logs selected for deletion.");
      return;
    }
    axios.delete(`${BaseURL}data/logdata/`, {
      headers: getAuthHeaders(),
      data: { ids: selectedLogIds }
    })
      .then(() => {
        // Filter out the deleted logs from the current list
        this.setState(prevState => ({
          logDataList: prevState.logDataList.filter(log => !selectedLogIds.includes(log.unique_id)),
          filteredData: prevState.filteredData.filter(log => !selectedLogIds.includes(log.unique_id)),
          selectedLogIds: [],  // Clear selection
          selectAll: false,    // Uncheck select all
        }));
        alert("Selected logs deleted successfully.");
      })
      .catch(error => {
        console.error("There was an error deleting the logs!", error);
      });
  }

  render() {
    const { searchQuery, filteredData, selectedLogIds, selectAll } = this.state;

    return (
      <div className="page">
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
            <CCardHeader className="d-flex justify-content-between align-items-center">
  <strong>Log Data</strong>
  <CButton
    type="button"
    color="primary"
    onClick={this.handleDeleteSelected}
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
                        <CTableHeaderCell scope="col">
                          <input
                            type="checkbox"
                            checked={selectAll}
                            onChange={this.handleSelectAllChange}
                          />
                        </CTableHeaderCell>
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
                            <CTableDataCell>
                              <input
                                type="checkbox"
                                checked={selectedLogIds.includes(log.unique_id)}
                                onChange={(e) => this.handleCheckboxChange(e, log.unique_id)}
                              />
                            </CTableDataCell>
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
                          <CTableDataCell colSpan="8" className="text-center">
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
