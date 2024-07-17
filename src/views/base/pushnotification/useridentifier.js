import React from 'react'
import axios from 'axios';

import {
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
  } from '@coreui/react'
import BaseURL from 'src/assets/contants/BaseURL';


class UserIdentifier extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  componentDidMount() {
    axios.get(BaseURL +"pushnotification/notificationauth/")
      .then(response => {
        this.setState({ users: response.data.reverse() });
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }


  
 render(){ 
  const { users } = this.state;

  return (
    <>
     <CRow>

      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>USER IDENTIFIER</strong>
          </CCardHeader>
          <CCardBody>
            
            
            
              <CTable striped hover>
                <CTableHead>
                  <CTableRow>
                    <CTableHeaderCell scope="col">Si.No</CTableHeaderCell>
                    <CTableHeaderCell scope="col">User Name</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Noti-Token</CTableHeaderCell>

                    
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                    {users.map((user, index) => (
                      <CTableRow key={index}>
                        <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                        <CTableDataCell>{user.user_to_auth}</CTableDataCell>
                        <CTableDataCell>{user.noti_token}</CTableDataCell>
                      </CTableRow>
                    ))}
                </CTableBody>
              </CTable>
            
          </CCardBody>
        </CCard>
      </CCol>
      
      </CRow>

     </>
  )
  }
}

export default UserIdentifier