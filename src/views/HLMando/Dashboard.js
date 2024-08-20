import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { CRow, CCol, CCard, CCardHeader, CCardBody, CWidgetStatsA,CSpinner } from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import BaseURL from 'src/assets/contants/BaseURL';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState([]); 
  const [machineGroupData, setMachineGroupData] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate(); 

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token'); 
    return {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    };
  };


  const handleAuthError = useCallback(() => {
    localStorage.removeItem('token');
    navigate('/login');
  }, [navigate]);

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await axios.get(BaseURL + 'data/dashboard-data/', { headers: getAuthHeaders() });
      setDashboardData(response.data.groups);
      console.log(response.data.groups);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleAuthError();
      } else {
        console.error('Error fetching dashboard data:', error);
      }
    }
  }, [handleAuthError]);

  const fetchMachineGroupData = useCallback(async () => {
    try {
      const response = await axios.get(BaseURL + 'devices/machinegroup/', { headers: getAuthHeaders() });
      setMachineGroupData(response.data);
      console.log(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        handleAuthError();
      } else {
        console.error('Error fetching machine group data:', error);
      }
    }
  }, [handleAuthError]);

  const fetchData = useCallback(async () => {
    await Promise.all([fetchDashboardData(), fetchMachineGroupData()]);
    setLoading(false); 
  }, [fetchDashboardData, fetchMachineGroupData]);

  useEffect(() => {
    fetchData(); 

    const intervalId = setInterval(() => {
      fetchData(); 
    }, 5000);

    return () => clearInterval(intervalId);
  }, [fetchData]);

  const colors = [
    '#4a90e2', '#33FF57', '#3357FF', '#FF33A1', '#FF8C00', '#F1C40F',
    '#E67E22', '#9B59B6', '#1ABC9C', '#2ECC71', '#3498DB', '#E74C3C',
    '#F39C12', '#D35400', '#7F8C8D', '#BDC3C7', '#9B59B6', '#FF6F61'
  ];
  
  

  const widgetStyles = {
    backgroundColor: '#4a90e2',
    color: '#fff',
    borderRadius: '12px',
    padding: '20px',
    width: '250px', 
    height: '130px', 
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
    border: '1px solid rgba(255,255,255,0.2)',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
  };

  const zoomOutStyle = {
    transform: 'scale(0.8)', 
    transformOrigin: 'top left',
    width: '125%',
  };

  const handleClick = (groupName, machine) => {
    navigate('/HLMando/IndividualMachine', { state: { groupName, machineId: machine.id } });
  };

  if (loading) {
    // Original code: return <div>Loading...</div>;
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <CSpinner color="primary" variant="grow" />
        <CSpinner color="secondary" variant="grow" />
        <CSpinner color="success" variant="grow" />
        <CSpinner color="danger" variant="grow" />
        <CSpinner color="warning" variant="grow" />
        <CSpinner color="info" variant="grow" />
        <CSpinner color="dark" variant="grow" />
      </div>
    );
  }

  if (!dashboardData.length && !machineGroupData.length) {
    return <div>No data available.</div>; 
  }

  const combinedData = dashboardData.map(group => {
    const machineGroup = machineGroupData.find(mg => mg.group_id === group.group_id) || {};
    return {
      ...group,
      ...machineGroup,
      machines: group.machines.map(machine => {
        const machineData = machineGroup.machines?.find(m => m.machine_id === machine.machine_id) || {};
        return {
          ...machine,
          ...machineData
        };
      })
    };
  }).reverse(); 

  return (
    <div className="page" style={{ ...zoomOutStyle, marginTop: '20px' }}>
      <CRow className="mb-3">
        {combinedData.map((group) => (
          group.machines.length > 0 && (
            <CCol xs={12} key={group.group_id} style={{ marginBottom: '20px' }}>
              <CCard>
                <CCardHeader style={{
                  backgroundColor: '#f8f9fa',
                  color: '#343a40',
                  fontSize: '16px',
                  fontWeight: '700',
                  padding: '10px 20px',
                  borderBottom: '2px solid #e9ecef',
                  fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
                }}>
                  <h4 style={{ margin: 0 }}>{group.group_name}</h4>
                </CCardHeader>
                <CCardBody>
                  <CRow>
                    {group.machines.map((machine, index) => (
                      <CCol xs={12} md={3} key={machine.machine_id}>
                        <CWidgetStatsA
                          className="mb-4"
                          style={{
                            ...widgetStyles,
                            backgroundColor: colors[index % colors.length],
                            cursor: 'pointer' 
                          }}
                          onClick={() => handleClick(group.group_name, machine)} 
                          value={
                            <span style={{
                              display: 'block',
                              fontSize: '18px',
                              fontWeight: 'bold',
                              lineHeight: '1.2',
                              color: '#fff'
                            }}>
                              {`${machine.production_count || 0} / ${machine.target_production || 0}`} 
                            </span>
                          }
                          title={
                            <span style={{
                              fontSize: '18px',
                              fontWeight: '600',
                              lineHeight: '1.2',
                              color: '#fff'
                            }}>
                              {machine.machine_name}
                            </span>
                          }
                        />
                      </CCol>
                    ))}
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
