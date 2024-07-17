import React from 'react'
import { LiveHeader } from '../components/index'
// import MachineCard from 'src/views/base/cards/MachineCards'
// import { CRow } from '@coreui/react'
import { V2Example } from 'src/components/arrows/ArrowElementTest'
// import ArrowClass from 'src/components/arrows/ArrowClass'
import greyLogo from "../assets/images/grey-gredient.jpeg"

const backgroundStyle ={
  backgroundImage: `url(${greyLogo})`,
  backgroundSize:"cover",
};
const DashboardLayout = () => {

  
  return (
    <div>
      {/* <AppSidebar /> */}
      <div className="wrapper d-flex flex-column min-vh-100 bg-light" style={backgroundStyle}>
        <LiveHeader location="/dashboard"/>
        
        <div className="body flex-grow-1 px-3">
          {/* <AppContent /> */}

          <V2Example/>
          {/* <V2Example /> */}
          {/* <SimpleTempFunc/> */}
          
        </div>
        {/* <ArrowClass/> */}
        {/* <DraggableArrow/> */}
        {/* <MyComponent/> */}
      </div>
    </div>
  )
}

export default DashboardLayout
