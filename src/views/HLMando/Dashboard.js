import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CRow, CCol, CCard, CCardHeader, CCardBody, CWidgetStatsE } from '@coreui/react';
import { CChartBar } from '@coreui/react-chartjs';
import BaseURL from 'src/assets/contants/BaseURL';

const Dashboard = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get(BaseURL + 'data/dashboard/')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <CRow className="mb-3">
      {data.map(group => (
        group.machine_count > 0 && (
          <CCol xs={12} key={group.group_id}style={{ marginBottom: '20px' }}>
            <CCard>
              <CCardHeader>
                <h3>{group.group_name}</h3>
              </CCardHeader>
              <CCardBody>
                <CRow>
                  {group.machines.map(machine => (
                    <CCol xs={4} key={machine.machine_id}>
                      <CWidgetStatsE
                        className="mb-2"
                        chart={
                          <CChartBar
                            className="mx-auto"
                            style={{ height: '60px', width: '50px' }}
                          />
                        }
                         title={<span style={{ fontSize: '20px', fontWeight: 'bold' }}>{machine.machine_name}</span>}
                        value={
                          <span style={{
                            display: 'inline-block',
                            backgroundColor: '#007bff', 
                            color: '#fff', 
                            borderRadius: '50px', 
                            padding: '20px 30px',
                            fontSize: '14px' 
                          }}>
                            {`${machine.production_count} / ${machine.target_production}`}
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
  );
};

export default Dashboard;
