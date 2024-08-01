import React from 'react';
import { useLocation } from 'react-router-dom';
import { CCard, CCardBody, CTable } from '@coreui/react';

const Machine = () => {
  const location = useLocation();
  const { state } = location;
  const { machine, groupName } = state || { machine: null, groupName: '' };

  if (!machine) return <div>Loading...</div>;

  return (
    <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', paddingTop: '50px' }}>
      <CCard style={{ maxWidth: '600px', width: '100%' }}>
        <CCardBody>
          <h3>{groupName}</h3>
          <CTable striped hover style={{ fontSize: '0.9rem' }}>
            <tbody>
              <tr>
                <td style={{ fontWeight: 'bold' }}>Production Count</td>
                <td>{machine.production_count}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>Shift Time</td>
                <td>{machine.shift_time || 'N/A'}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>Date</td>
                <td>{machine.date || 'N/A'}</td>
              </tr>
            </tbody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  );
};

export default Machine;
