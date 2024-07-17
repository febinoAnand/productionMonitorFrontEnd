
import React, { useState, useRef, useEffect } from "react";
import Xarrow, {useXarrow, Xwrapper} from 'react-xarrows';
// import styled from "styled-components";
import Draggable from "react-draggable";
import styled from "styled-components";
import {
    CWidgetStatsB,
    CWidgetStatsA,
    CWidgetStatsC,
    CWidgetStatsD,
    CWidgetStatsE,
    CWidgetStatsF,


    CCol,
  } from '@coreui/react'
 import {
    cilPeople,
  } from '@coreui/icons'
  import CIcon from '@coreui/icons-react'
const texts = ["Text 1", "Text 2", "Text 3", "Text 4"];

const machinelist = [
    {
        id: 1,
        name: 'Machine 1',
        status: 'success',
        codeValue: 'ALL OK',
        text:'Running',
        icon: <CIcon icon={cilPeople} height={20} />
    },
    {
        id: 2,
        name: 'Machine 2',
        status: 'warning',
        codeValue: 'WR348',
        text:'Material Stopped',
        icon: <CIcon icon={cilPeople} height={20} />
      },
      {
        id: 3,
        name: 'Machine 3',
        status: 'danger',
        codeValue: 'ER394',
        text:'Machine Stopped',
        icon: <CIcon icon={cilPeople} height={20} />
      },
      {
        id: 4,
        name: 'Machine 4',
        status: 'danger',
        codeValue: 'ER069',
        text:'Material Stopped',
        icon: <CIcon icon={cilPeople} height={20} />
      },
      {
        id: 5,
        name: 'Machine 5',
        status: 'success',
        codeValue: 'ALL OK',
        text:'Running',
        icon: <CIcon icon={cilPeople} height={20} />
      }
    ]

// const ItemsContainer = styled.div`
//   color: black;
//   position: relative;
//   background-color: white;
//   width: 100%;
//   height: 100%;
//   border: 4px solid orange;
// `;

const ItemsContainer = styled.div`
  color: black;
  position: relative;
  background-color: white;
  height: 100%;
  border: 4px solid orange;
`;


const ExampleDiv = styled.div`
  position: relative;
  background-color: darkblue;
  color: white;
  padding: 0.5em 1em;
  width: 10%;
  margin: 0.3em;
  cursor: move;
`;


const item = 'Text 1';




function ArrowClass() {
  const [positions, setPositions] = useState({});
  const [hasLoaded, setHasLoaded] = useState(false);
  const nodeRef = useRef(null);
  

  useEffect(() => {
    const existingDivPositions = JSON.parse(
      localStorage.getItem("positions_div")
    );
    setPositions(existingDivPositions);
    setHasLoaded(true);
    console.log("Position");
    console.log(existingDivPositions);
    console.log("has loaded");
  }, []);

  function handleStop(e, data) {
    let dummyPositions = {...positions};
    const itemId = e.target.id;
    dummyPositions[itemId] = {};
    dummyPositions[itemId]["x"] = data.x;
    dummyPositions[itemId]["y"] = data.y;
    setPositions(dummyPositions);
    console.log(dummyPositions);
    console.log("event-",e);
    
  }

  useEffect(() => {
    localStorage.setItem(`positions_div`, JSON.stringify(positions));
  }, [positions]);

  const updateXarrow = useXarrow();

  


  return hasLoaded ? (

    <div>
      {texts.map((item) => {
        return (
          <>
            <Draggable
            // onDrag={updateXarrow} 
              defaultPosition={
                positions === null
                  ? { x: 0, y: 0 }
                  : !positions[item[5]]
                  ? { x: 0, y: 0 }
                  : { x: positions[item[5]].x, y: positions[item[5]].y }
              }
              position={null}
              key={item[5]}
              // nodeRef={nodeRef}
              onStop={handleStop}
            >
              <CCol xs={6}>
              <div  key={item[5]}>
                <ExampleDiv id={item[5]}>{item}</ExampleDiv>
                </div>
                </CCol>
                {/* <CWidgetStatsB id={item.id}
                    color={item.status}
                    icon={item.icon}
                    value={item.codeValue}
                    title={item.name}
                    inverse
                    // progress={{ color: 'white', value: 89.9 }}
                    progress={{ value: 75 }}
                    text = {item.text}
                /> */}
               
                
              
            </Draggable>
          </>
        );
      })}{" "}
    </div>
    
    // <Draggable
    //     defaultPosition={
    //     positions === null
    //         ? { x: 0, y: 0 }
    //         : !positions[item[5]]
    //         ? { x: 0, y: 0 }
    //         : { x: positions[item[5]].x, y: positions[item[5]].y }
    //     }
    //     position={null}
    //     key={item[5]}
    //     nodeRef={nodeRef}
    //     onStop={handleStop}
    // >
    //     <div ref={nodeRef}>
    //     <div id={item[5]}>{item}</div>
    //     </div>
    // </Draggable>


  ) : null;
}

export default ArrowClass;
