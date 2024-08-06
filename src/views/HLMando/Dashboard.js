import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { CRow, CCol, CCard, CCardHeader, CCardBody, CWidgetStatsA } from '@coreui/react';
import { useNavigate } from 'react-router-dom';
import BaseURL from 'src/assets/contants/BaseURL';

const Dashboard = () => {
  const [combinedData, setCombinedData] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate(); 

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token'); 
    return {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    };
  };

  const fetchData = useCallback(async () => {
    try {
      const [response1, response2] = await Promise.all([
        axios.get(BaseURL + 'data/dashboard/', { headers: getAuthHeaders() }),
        axios.get(BaseURL + 'devices/machinegroup/', { headers: getAuthHeaders() })
      ]);

      // Combine data from both sources
      const allGroups = [...response1.data, ...response2.data];

      // Filter out duplicates based on 'group_id'
      const uniqueGroups = Array.from(new Map(allGroups.map(group => [group.group_id, group])).values());

      setCombinedData(uniqueGroups);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); 
    }
  }, []);

  useEffect(() => {
    fetchData(); 

    const intervalId = setInterval(() => {
      fetchData(); 
    }, 3000);

    return () => clearInterval(intervalId);
  }, [fetchData]);

  const colors = ['#4a90e2', '#50e3c2', '#f5a623', '#d0021b', '#8b572a', '#7ed321'];

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
    navigate('/HLMando/IndividualMachine', { state: { groupName, machine } });
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!combinedData.length) {
    return <div>No data available.</div>; 
  }

  return (
    <div className="page" style={zoomOutStyle}>
      <CRow className="mb-3">
        {combinedData.slice().reverse().map((group) => (
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
