import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { CRow, CCol, CCard, CCardHeader, CCardBody, CWidgetStatsA} from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import BaseURL from 'src/assets/contants/BaseURL';
import LoadingSpinner from './Loadingspinner';

const DeviceStatusIndicator = ({ status }) => {
  const indicatorColor = status === 1 ? 'green' : 'red'; 
  const statusText = status === 1 ? 'Online' : 'Offline';
  return (
    <div style={{
      position: 'absolute',
      top: '-30px',
      right: '20px',
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      backgroundColor: '#fff',
      borderRadius: '5px',
      boxShadow: '0 0 5px rgba(0,0,0,0.3)',
      zIndex: 2000, 
    }}>
      <span style={{
        marginRight: '8px',
        fontSize: '16px',
        fontWeight: 'bold',
      }}>Device:</span>
      <span style={{
        width: '12px',
        height: '12px',
        borderRadius: '50%',
        backgroundColor: indicatorColor,
        display: 'inline-block',
      }} />
       <span style={{
        marginLeft: '8px', 
        fontSize: '16px',
        fontWeight: 'bold',
        color: indicatorColor, 
      }}>{statusText}</span>
    </div>
  );
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deviceStatus, setDeviceStatus] = useState(0); 
  const navigate = useNavigate();

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json',
    };
  };

  const handleAuthError = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await axios.get(BaseURL + 'data/dashboard-data/', { headers: getAuthHeaders() });
      setDashboardData(response.data.groups.reverse());
      setDeviceStatus(response.device_status)
      console.log(response.data.groups);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleAuthError();
      } else {
        console.error('Error fetching dashboard data:', error);
      }
    } finally {
      setLoading(false);
    }
  }, [handleAuthError]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    const wsUrl = `${BaseURL.replace('https', 'wss')}data/dashboard-data/`; 
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
      console.log('WebSocket connected');
    };


    socket.onmessage = (event) => {
      
      const updatedData = JSON.parse(event.data);
      setDashboardData(updatedData.groups.reverse()); 
      setDeviceStatus(updatedData.device_status)
      console.log('WebSocket message received:', updatedData.groups);
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    return () => {
      socket.close();
      console.log('WebSocket closed');
    };
  }, []); 

  const widgetStyles = {
    borderRadius: '12px',
    padding: '20px',
    width: '250px',
    height: '180px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.2)',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  };

  const innerWidgetStyles = {
    borderRadius: '8px',
    padding: '10px',
    width: '170px',
    height: '110px', 
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#FFFFFF', 
    border: '1px solid #ccc',
    position: 'relative', 
  };

  const zoomOutStyle = {
    transform: 'scale(0.8)',
    transformOrigin: 'top left',
    width: '125%',
  };

  const handleClick = (groupName, machine) => {
    console.log('Selected Machine ID:', machine.machine_id,machine.status);
    navigate('/HLMando/IndividualMachine', { state: { groupName, machineId: machine.machine_id, status:machine.status } });
  };

  if (loading) {
    return <LoadingSpinner />; 
  }
  if (!dashboardData.length) {
    return <div>No data available.</div>;
  }

  return (
    <div className="page" style={{ ...zoomOutStyle, marginTop: '20px' }}>
      <DeviceStatusIndicator status={deviceStatus} /> 
      <CRow className="mb-3">
        {dashboardData.map((group) => (
          group.machines.length > 0 && (
            <CCol xs={12} key={group.group_id} style={{ marginBottom: '20px' }}>
              <CCard>
                <CCardHeader style={{
                  backgroundColor: '#f8f9fa',
                  color: '#343a40',
                  fontSize: '20px',
                  fontWeight: '700',
                  padding: '10px 20px',
                  borderBottom: '2px solid #e9ecef',
                  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
                }}>
                  <h4 style={{ margin: 0 }}>{group.group_name}</h4>
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    {group.machines.map((machine, index) => {
                      const productionCount = machine.production_count || 0;
                      const targetProduction = machine.target_production || 0;
                      const percentage = targetProduction > 0 ? (productionCount / targetProduction) * 100 : 0;

                      let backgroundColor;
                      if (percentage >= 95) {
                        backgroundColor = '#80ff80';
                      } else if (percentage >= 85) {
                        backgroundColor = '#ffff66';
                      } else {
                        backgroundColor = '#ff4d4d';
                      }

                     
                      const rectangleColor = machine.status === 1 ? '#f61612' : '#4ded4f';

                      return (
                        <CCol xs={12} md={3} key={machine.machine_id}>
                          <CWidgetStatsA
                            className="mb-4"
                            style={{
                              ...widgetStyles,
                              backgroundColor: backgroundColor,
                              cursor: 'pointer'
                            }}
                            onClick={() => handleClick(group.group_name, machine)}
                            value={
                              <div>
                                
                                <span style={{
                                  fontSize: '20px',
                                  fontWeight: 'bold',
                                  lineHeight: '1.2',
                                  color: '#000',
                                  marginBottom:'15px',
                                   display: 'block',
                                }}>
                                  {machine.machine_name}
                                </span>
                                <div style={innerWidgetStyles}>
                                  <div style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center', 
                                    alignItems: 'center', 
                                    width: '100%', 
                                    marginBottom:'15px'
                                  }}>
                                    <span style={{
                                      fontSize: '20px',
                                      lineHeight: '1.2',
                                      color: '#000',
                                    }}>
                                      {productionCount}
                                    </span>

                                    <div style={{
                                      width: '50%',
                                      height: '2px',
                                      backgroundColor: '#000',
                                      margin: '5px 0',
                                    }}></div>

                                    <span style={{
                                      fontSize: '20px',
                                      lineHeight: '1.2',
                                      color: '#000',
                                    }}>
                                      {targetProduction}
                                    </span>
                                  </div>
                                </div>

                                <div style={{
                                  marginTop: '20px',
                                  width: '110px',
                                  height: '10px',
                                  backgroundColor: rectangleColor,
                                  position: 'absolute', 
                                  bottom: '10px',
                                  marginLeft:'30px',
                                  marginBottom:'10px'
                                }}></div>
                              </div>
                            }
                          />
                        </CCol>
                      );
                    })}
                  </CRow>
                </CCardBody>
              </CCard>
            </CCol>
          )
        ))}
      </CRow>
    </div>
  );
};

export default Dashboard;