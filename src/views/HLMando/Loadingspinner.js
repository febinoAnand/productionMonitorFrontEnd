import React from 'react';
import { CSpinner } from '@coreui/react';

const LoadingSpinner = () => {
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
};

export default LoadingSpinner;
