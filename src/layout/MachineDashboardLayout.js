import React from 'react'
import { LiveHeader } from '../components/index'
// import greyLogo from "../assets/images/grey-gredient.jpeg"

// import { useSearchParams } from 'react-router-dom';
import MachineIndividual from 'src/views/base/details/MachineIndividual';

const MachineDashboardLayout = () => {
  
  
  return (
    <div>
      <div className="wrapper d-flex flex-column min-vh-100 bg-light" >
        <LiveHeader location="/live" />
        <div className="body flex-grow-1 px-3">
          <MachineIndividual/>
        </div>
      </div>
    </div>
  )
}

export default MachineDashboardLayout
