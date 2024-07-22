import React, { useEffect, useState } from 'react';
import { CRow, CCol, CCard, CCardBody, CWidgetStatsE } from '@coreui/react';
import BaseURL from 'src/assets/contants/BaseURL'; 

const WidgetDisplay = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${BaseURL}/data/dashboard/`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(responseData => {
        console.log('API Response:', responseData); 
        if (Array.isArray(responseData)) {
          setData(responseData);
        } else {
          throw new Error('Unexpected data structure');
        }
        setLoading(false);
      })
      .catch(error => {
        console.error('Fetch error:', error); 
        setError(error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <CRow>
      <CCol xs={14}>
        {data.map(group => (
          <CCard key={group.group_id} className="mb-3 mt-3">
            <CCardBody
              style={{
                borderRadius: '0.5rem',
                padding: '1rem',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  fontWeight: 'bold'
                }}
              >
                {group.group_name}
              </div>
              <CRow>
                {group.machines.map(machine => (
                  <CCol xs={6} key={machine.machine_id}>
                    <div
                      style={{
                        width: '400px',
                        margin: '0.5rem auto',
                        padding: '1rem',
                        borderRadius: '0.5rem',
                        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        backgroundColor: '#f9f9f9',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <CWidgetStatsE
                        className="mb-3 mt-3"
                        style={{
                          margin: '0 auto',
                          fontSize: '1.2rem',
                          padding: '1rem',
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          width: '100%',
                          flex: 1
                        }}
                        value={
                          <div
                            style={{
                              width: '140px',
                              height: '60px',
                              backgroundColor: '#3498db',
                              borderRadius: '50px', 
                              display: 'flex',
                              justifyContent: 'center',
                              alignItems: 'center',
                              color: 'white',
                              fontSize: '1rem',
                              textAlign: 'center',
                              padding: '0.5rem',
                              boxSizing: 'border-box',
                              flex: 1
                            }}
                          >
                            <div>{machine.production_count} / {machine.target_production}</div>
                          </div>
                        }
                        title={machine.machine_name}
                      />
                    </div>
                  </CCol>
                ))}
              </CRow>
            </CCardBody>
          </CCard>
        ))}
      </CCol>
    </CRow>
  );
};

export default WidgetDisplay;
