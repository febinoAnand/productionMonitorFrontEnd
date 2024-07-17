import React,{ useEffect ,useState} from 'react';
import 
// Xarrow,
 {useXarrow, Xwrapper} from 'react-xarrows';

 import {
  CNavLink,
} from '@coreui/react'
import { NavLink } from 'react-router-dom'
 import "../../scss/widget.css";
//  import "../../scss/font-awesome.min.css"
 import axios from 'axios';
//  import { CIcon } from '@coreui/icons-react';
import { cilBell } from '@coreui/icons';

import Draggable from 'react-draggable';
import CIcon from '@coreui/icons-react'
import {
    // CWidgetStatsB,
    // CWidgetStatsA,
    // CWidgetStatsC,
    // CWidgetStatsD,
    // CWidgetStatsE,
    // CWidgetStatsF,


    CCol,
  } from '@coreui/react'

  // import {
  //   cilPeople,
  // } from '@coreui/icons'
import BaseURL from 'src/assets/contants/BaseURL';


const MachineStatusComponent = (item) =>{
  console.log(item);

  let indicatorColor = "";
  let problemCode = "";
  let problemName = "";
  let eventID = "";
  let unSolvedCount = 0;
  try{
    indicatorColor = item.currentStatus.event.indicator.indicatorColor;
    problemCode = item.currentStatus.event.problem.problemCode;
    problemName = item.currentStatus.event.problem.problemName;
    eventID = item.currentStatus.event.eventID;
    unSolvedCount = item.currentStatus.unsolvedeventcount;
  }catch(error){
    indicatorColor = '#10c916';
    problemCode = "N/A";
    problemName = "ALL OK";
    eventID = "N/A"
    unSolvedCount = 0;
  }
  return(
    <>
      <div className="widget">
          <div className="widget-indicator widget-indicator-color" style={{backgroundColor:indicatorColor}}></div>
          <div className="widget-details">
              <div className="widget-headline" style={{color:indicatorColor}}>{item.currentStatus.machineID}</div>
              <div className="widget-description">{problemName}</div>
              <div className="widget-bell-block">
                  <div className="widget-indicator-code">
                      <div className="widget-indicator-text" style={{color:indicatorColor}}>{problemCode}</div>
                      <div>CODE</div>
                  </div>
                  <div className="widget-bell">
                    <CNavLink to={"/machinelive?machineid="+item.currentStatus.machineID} component={NavLink}>
                      <CIcon icon={cilBell} size="xl"/>
                    </CNavLink>
                    {unSolvedCount > 1 ? (
                      <div className="widget-notification-value">{unSolvedCount}</div>
                    ):(
                      <div></div>
                    )}
                  </div>
                  <div className="widget-indicator-code">
                      <div className="widget-indicator-text" style={{color:indicatorColor}}>{eventID}</div>
                      <div>EVENT</div>
                  </div>
              </div>
          </div>
      </div>
    </>
  )
}
    
const DraggableBox = ({machineDataList}) => {
    const updateXarrow = useXarrow();
    const [positions, setPositions] = useState({

    });

    const [hasLoaded, setHasLoaded] = useState(false);

    useEffect(() => {
        const existingDivPositions = JSON.parse(
          localStorage.getItem("positions_div_s")
        );
        setPositions(existingDivPositions);
        setHasLoaded(true);
        // console.log("Position");
        // console.log(existingDivPositions);
        // console.log("has loaded");

      
      }, []);

      useEffect(() => {
        localStorage.setItem(`positions_div_s`, JSON.stringify(positions));
      }, [positions]);
    
    function handlePosition(e,data){
        let testposition = {...positions}
        const itemId = data.node.id;
        // const tempID = e.target.id;
        // console.log("Event-->",e);
        // console.log("Data--->",data);
        // console.log("Item ID --->",itemId);
        // console.log("tempID--->",tempID);

        
        testposition[itemId] = {};
        testposition[itemId]["x"] = data.x;
        testposition[itemId]["y"] = data.y;

        setPositions(testposition);
        // console.log("Position set completed")
        // console.log(testposition);
        // console.log("ID="+e+", Drag Stopped at ");

        // setX(data.x);
        // setY(data.y);

    }
    
  return hasLoaded ? (
    <div>
      {machineDataList.map((item) =>{
          return(
            <Draggable onDrag={updateXarrow} 
                defaultPosition={
                    positions === null ? { x: 0, y: 0 } : !positions[item.machineID] ? { x: 0, y: 0 } : { x: positions[item.machineID].x, y: positions[item.machineID].y }
                }
                positionOffset={{x:0,y:0}}
                key={item.machineID}
                onStop={handlePosition} 
                >
              <div id={item.machineID} key={item.machineID}>
                <CCol xs={6} sm={12} lg={12}>
                  <MachineStatusComponent currentStatus={item}/>
                </CCol>
              </div>
            </Draggable>
          )
      })}
    </div>
  ): null;
};

export function V2Example(data) {
  const [machineListArray,setMachineListArray] = useState(
[]);

  useEffect(() => {
    const interval = setInterval(() => {
      axios.get(BaseURL+"data/livedata").then((response) => {
      // console.log(response.data);
      setMachineListArray(response.data);
    });
      
    }, 2000);

    return () => {
      // console.log(`clearing interval`);
      clearInterval(interval);
    };
    
  }, []);


    return (
        <div style={{display: 'flex',flexDirection:'row', justifyContent: 'space-evenly', width: '100%'}}>
            <Xwrapper>
                <DraggableBox machineDataList={machineListArray}/>
            </Xwrapper>
        </div>
    ) ;
}
