import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { CRow, CCol, CCard, CCardHeader, CCardBody, CWidgetStatsA } from '@coreui/react';
import BaseURL from 'src/assets/contants/BaseURL';

const Dashboard = () => {
  const [data, setData] = useState([]);

  // Utility function to get authentication headers
  const getAuthHeaders = () => {
    const token = localStorage.getItem('token'); // Adjust based on where you store your token
    return {
      'Authorization': `Token ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch data function with headers
  const fetchData = useCallback(async () => {
    try {
      const response = await axios.get(BaseURL + 'data/dashboard/', {
        headers: getAuthHeaders()
      });
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }, []);

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 60000);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  const colors = ['#4a90e2', '#50e3c2', '#f5a623', '#d0021b', '#8b572a', '#7ed321'];

  const widgetStyles = {
    backgroundColor: '#4a90e2',
    color: '#fff',
    borderRadius: '12px',
    padding: '20px',
    width: '100%',
    height: '150px',
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
    height: '125%'
  };

  return (
    <div className="page" style={zoomOutStyle}>
      <CRow className="mb-3">
        {data.map(group => (
          group.machine_count > 0 && (
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
                    {group.machines.map((machine, index) => (
                      <CCol xs={4} key={machine.machine_id}>
                        <CWidgetStatsA
                          className="mb-2"
                          style={{
                            ...widgetStyles,
                            backgroundColor: colors[index % colors.length]
                          }}
                          value={
                            <span style={{
                              display: 'block',
                              fontSize: '24px',
                              fontWeight: 'bold',
                              lineHeight: '1.2',
                              color: '#fff'
                            }}>
                              {`${machine.production_count} / ${machine.target_production}`}
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
