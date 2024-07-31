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

class MachineData extends React.Component {
  state = {
    machineDataList: [],
    searchQuery: '',
    filteredData: [],
    selectedMachineIds: [],  
    selectAll: false,        
  };

  componentDidMount() {
    axios.get(BaseURL + "data/machinedata/", { headers: getAuthHeaders() })
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
      this.setState({ filteredData: machineDataList }, this.updateSelectAll);
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
    this.setState({ filteredData }, this.updateSelectAll);
  }

  updateSelectAll = () => {
    const { filteredData, selectedMachineIds } = this.state;
    const allSelected = filteredData.length > 0 && filteredData.every(machine => selectedMachineIds.includes(machine.machine_id));
    this.setState({ selectAll: allSelected });
  }

  handleCheckboxChange = (event, machineId) => {
    const { checked } = event.target;
    this.setState(prevState => {
      const selectedMachineIds = checked
        ? [...prevState.selectedMachineIds, machineId]
        : prevState.selectedMachineIds.filter(id => id !== machineId);
      return {
        selectedMachineIds,
      };
    }, this.updateSelectAll);
  }

  handleSelectAllChange = (event) => {
    const { checked } = event.target;
    this.setState(prevState => ({
      selectAll: checked,
      selectedMachineIds: checked ? prevState.filteredData.map(machine => machine.machine_id) : [],
    }));
  }

  handleDeleteSelected = () => {
    const { selectedMachineIds } = this.state;
    if (selectedMachineIds.length === 0) {
      alert("No machines selected for deletion.");
      return;
    }
    axios.delete(`${BaseURL}data/machinedata/`, {
      headers: getAuthHeaders(),
      data: { ids: selectedMachineIds }
    })
      .then(() => {
        
        this.setState(prevState => ({
          machineDataList: prevState.machineDataList.filter(machine => !selectedMachineIds.includes(machine.machine_id)),
          filteredData: prevState.filteredData.filter(machine => !selectedMachineIds.includes(machine.machine_id)),
          selectedMachineIds: [],  
          selectAll: false,        
        }));
        alert("Selected machines deleted successfully.");
      })
      .catch(error => {
        console.error("There was an error deleting the machines!", error);
      });
  }

  render() {
    const { searchQuery, filteredData, selectedMachineIds, selectAll } = this.state;

    return (
      <div className="page">
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader className="d-flex justify-content-between align-items-center">
                <strong>Machine Data</strong>
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
                        <CTableHeaderCell scope="col">Machine ID</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Data</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Device ID</CTableHeaderCell>
                        <CTableHeaderCell scope="col">Data ID</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {filteredData.length > 0 ? (
                        filteredData.map((machine, index) => (
                          <CTableRow key={machine.machine_id}>
                            <CTableDataCell>
                              <input
                                type="checkbox"
                                checked={selectedMachineIds.includes(machine.machine_id)}
                                onChange={(e) => this.handleCheckboxChange(e, machine.machine_id)}
                              />
                            </CTableDataCell>
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

export default MachineData;
