import React, { Component } from 'react';
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
  CWidgetStatsA,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import Chart from 'chart.js/auto';
import { cilPeople, cilUser, cilShareBoxed, cilPin } from '@coreui/icons';
import BaseURL from 'src/assets/contants/BaseURL';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalUsers: 0,
      activeUsers: 0,
      inactiveUsers: 0,
      totalDepartments: 0,
      totalInbox: 0,
      totalTickets: 0,
      departmentTicketCount: [],
      userDetails: [],
    };
    this.chartRef = React.createRef();
  }

  async componentDidMount() {
    await this.fetchData();
    this.updateChart();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.departmentTicketCount !== prevState.departmentTicketCount) {
      this.updateChart();
    }
  }

  fetchData = async () => {
    const token = localStorage.getItem('token');
    console.log('Token:', token);
    if (!token) {
      console.error('No token found');
      return;
    }
    try {
      const response = await axios.get(`${BaseURL}emailtracking/dashboard/`, {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = response.data;

      this.setState({
        totalUsers: data.total_users,
        activeUsers: data.active_users,
        inactiveUsers: data.inactive_users,
        totalDepartments: data.total_departments,
        totalInbox: data.total_inbox,
        totalTickets: data.total_tickets,
        departmentTicketCount: data.department_ticket_count,
        userDetails: data.user_details,
      });
    } catch (error) {
      if (error.response) {
        console.error('Error fetching data:', error.response.data);
        if (error.response.status === 403) {
          console.error('403 Forbidden - Check if the token is valid and has the correct permissions.');
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
    }
  };

  updateChart() {
    const { departmentTicketCount } = this.state;
    const labels = departmentTicketCount.map(item => item.department_name);
    const data = departmentTicketCount.map(item => item.ticket_count);

    const ctx = this.chartRef.current.getContext('2d');

    if (this.chartInstance) {
      this.chartInstance.destroy();
    }

    const barColors = [
      'rgba(255, 99, 132, 0.5)',
      'rgba(54, 162, 235, 0.5)',
      'rgba(255, 206, 86, 0.5)',
      'rgba(75, 192, 192, 0.5)',
      'rgba(153, 102, 255, 0.5)',
      'rgba(255, 159, 64, 0.5)',
      'rgba(199, 199, 199, 0.5)',
      'rgba(255, 99, 71, 0.5)',
      'rgba(144, 238, 144, 0.5)',
      'rgba(173, 216, 230, 0.5)',
      'rgba(240, 128, 128, 0.5)',
      'rgba(32, 178, 170, 0.5)',
      'rgba(240, 230, 140, 0.5)',
      'rgba(123, 104, 238, 0.5)',
      'rgba(255, 105, 180, 0.5)',
      'rgba(205, 92, 92, 0.5)',
      'rgba(50, 205, 50, 0.5)',
      'rgba(100, 149, 237, 0.5)',
      'rgba(255, 228, 181, 0.5)',
      'rgba(147, 112, 219, 0.5)',
    ];

    this.chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Tickets',
          data: data,
          backgroundColor: barColors.slice(0, data.length),
          borderColor: barColors.slice(0, data.length).map(color => color.replace('0.5', '1')),
          borderWidth: 1,
        }],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }

  render() {
    const { totalUsers, activeUsers, inactiveUsers, totalDepartments, totalInbox, totalTickets, userDetails } = this.state;

    return (
      <>
        <CRow>
          <CCol sm={6} lg={3}>
            <CWidgetStatsA
              className="mb-3"
              color="primary"
              value={<div style={{ fontSize: '3rem', textAlign: 'center' }}>{totalUsers}</div>}
              title={<div className="text-center" style={{ marginBottom: '1rem' }}>Total No. Of Users Available</div>}
            />
          </CCol>
          <CCol sm={6} lg={3}>
            <CWidgetStatsA
              className="mb-3"
              color="success"
              value={<div style={{ fontSize: '3rem', textAlign: 'center' }}>{activeUsers}</div>}
              title={<div className="text-center" style={{ marginBottom: '1rem' }}>Total No. Of Active Users</div>}
            />
          </CCol>
          <CCol sm={6} lg={3}>
            <CWidgetStatsA
              className="mb-3"
              color="danger"
              value={<div style={{ fontSize: '3rem', textAlign: 'center' }}>{inactiveUsers}</div>}
              title={<div className="text-center" style={{ marginBottom: '1rem' }}>Total No. Of Inactive Users</div>}
            />
          </CCol>
          <CCol sm={6} lg={3}>
            <CWidgetStatsA
              className="mb-3"
              color="warning"
              value={<div style={{ fontSize: '3rem', textAlign: 'center' }}>{totalDepartments}</div>}
              title={<div className="text-center" style={{ marginBottom: '1rem' }}>Total No. Of Departments</div>}
            />
          </CCol>
        </CRow>
        <CRow className="mb-4">
          <CCol xs="12" sm="6" lg="6">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              backgroundColor: '#f0f0f0', 
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ 
                backgroundColor: '#ff6e6e', 
                width: '30%', 
                padding: '20px', 
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <CIcon icon={cilShareBoxed} size="lg" className="text-white" />
              </div>
              <div style={{ 
                backgroundColor: '#ffffff', 
                width: '30%', 
                padding: '20px', 
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>{totalInbox}</div>
              </div>
              <div style={{ 
                backgroundColor: '#E768E1', 
                width: '30%', 
                padding: '10px', 
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#333' }} className="text-center text-muted mt-2">Total Inbox</div>
              </div>
            </div>
          </CCol>
          <CCol xs="12" sm="6" lg="6">
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              backgroundColor: '#f0f0f0', 
              padding: '20px',
              borderRadius: '10px',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
            }}>
              <div style={{ 
                backgroundColor: '#2484F1', 
                width: '30%', 
                padding: '20px', 
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <CIcon icon={cilPin} size="lg" className="text-white" />
              </div>
              <div style={{ 
                backgroundColor: '#ffffff', 
                width: '30%', 
                padding: '20px', 
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#333' }}>{totalTickets}</div>
              </div>
              <div style={{ 
                backgroundColor: '#AA76FA', 
                width: '30%', 
                padding: '10px', 
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '1.3rem', fontWeight: 'bold', color: '#333' }} className="text-center text-muted mt-2">Total Ticket</div>
              </div>
            </div>
          </CCol>
        </CRow>
        <CCard className="mb-4">
          <CCardHeader><strong>Ticket Analysis</strong></CCardHeader>
          <CCardBody>
            <canvas ref={this.chartRef} />
          </CCardBody>
        </CCard>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>All Users</strong>
              </CCardHeader>
              <CCardBody>
                <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  <CTable align="middle" className="mb-0 border" hover responsive>
                    <CTableHead color="light">
                      <CTableRow>
                        <CTableHeaderCell className="text-center">
                          <CIcon icon={cilPeople} />
                        </CTableHeaderCell>
                        <CTableHeaderCell>Name</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Email</CTableHeaderCell>
                        <CTableHeaderCell>Designation</CTableHeaderCell>
                        <CTableHeaderCell className="text-center">Mobile No</CTableHeaderCell>
                        <CTableHeaderCell>Active State</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {userDetails.map((user, index) => (
                        <CTableRow key={index}>
                          <CTableDataCell className="text-center">
                            <CIcon size="xl" icon={cilUser} />
                          </CTableDataCell>
                          <CTableDataCell>
                            <div>{user.email}</div>
                            <div className="small text-medium-emphasis">
                              Registered: {user.username}
                            </div>
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <span>{user.email}</span>
                          </CTableDataCell>
                          <CTableDataCell>
                            <span>{user.user_detail?.designation || 'N/A'}</span>
                          </CTableDataCell>
                          <CTableDataCell className="text-center">
                            <span>{user.user_detail?.mobile_no || 'N/A'}</span>
                          </CTableDataCell>
                          <CTableDataCell>
                            <span style={{ fontWeight: user.is_active ? 'bold' : 'bold', color: user.is_active ? 'green' : 'red' }}>
                              {user.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </>
    );
  }
}

export default Dashboard;