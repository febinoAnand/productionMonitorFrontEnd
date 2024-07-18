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
  state = { productionDataList: [] };

  componentDidMount() {
    axios.get(BaseURL + "data/productions/")
      .then(res => {
        const resData = res.data;
        this.setState({ productionDataList: resData });
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
                <strong>Production Data</strong>
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

                <CCol className='mb-3'></CCol>

                <CTable striped hover>
                <CTableHead color='dark'>
                    <CTableRow>
                      <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Time</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Shift ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Shift Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Shift StartTime</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Shift EndTime</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Target </CTableHeaderCell>
                      <CTableHeaderCell scope="col"> Count</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Machine ID</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Machine Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Data ID</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {this.state.productionDataList.map((production, id) => (
                      <CTableRow key={production.id}>
                        <CTableHeaderCell scope="row">{id + 1}</CTableHeaderCell>
                        <CTableDataCell>{production.date}</CTableDataCell>
                        <CTableDataCell>{production.time}</CTableDataCell>
                        <CTableDataCell>{production.shiftID}</CTableDataCell>
                        <CTableDataCell>{production.shiftName}</CTableDataCell>
                        <CTableDataCell>{production.shiftStartTime}</CTableDataCell>
                        <CTableDataCell>{production.shiftEndTime}</CTableDataCell>
                        <CTableDataCell>{production.target}</CTableDataCell>
                        <CTableDataCell>{production.Count}</CTableDataCell>
                        <CTableDataCell>{production.machineID}</CTableDataCell>
                        <CTableDataCell>{production.machineName}</CTableDataCell>
                        <CTableDataCell>{production.Count}</CTableDataCell>
                        <CTableDataCell>{production.dataID}</CTableDataCell>
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

export default ProductionData;
