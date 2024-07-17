import React,{ useEffect ,useState} from 'react';
import 
// Xarrow,
 {useXarrow, Xwrapper} from 'react-xarrows';

 import axios from 'axios';

import Draggable from 'react-draggable';
// import CIcon from '@coreui/icons-react'
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
  // console.log(item);

  let indicatorColor = "";
  let problemCode = "";
  let problemName = "";
  try{

    indicatorColor = item.currentStatus.event.indicator.indicatorColor;
    problemCode = item.currentStatus.event.problem.problemCode;
    problemName = item.currentStatus.event.problem.problemName;

    // console.log("indicatorColor",indicatorColor);
  }catch(error){
    indicatorColor = 'grey';
    problemCode = "N/A";
    problemName = "None";
  }


  // console.log(indicatorColor);

  const myStyle = {
    color: "black",
    backgroundColor: indicatorColor,
    padding: "10px",
    height:"180px",
    width:"180px",
    fontSize:"20px",
    justifyContent: "center",
    borderRadius: '.5em',
    boxShadow:'0px 2px 10px rgba(0,0,0,0.3);',

  };
  const innerStyle = {
    fontSize:"16px",
  };


  return(
    <>
    <div style={myStyle}>
      <h4>{item.currentStatus.machineID}</h4>
      {/* <div>{item.event.problem.problemCode}</div> */}
      <div style={innerStyle}>{problemCode}</div>

      <div></div><br></br>
      {/* <div className=''>{item.event.problem.problemName}</div> */}
      <div className='' style={innerStyle}>{problemName}</div>
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

    // function handleStop(e, data) {
    //     let dummyPositions = {...positions};
    //     const itemId = e.target.id;
    //     dummyPositions[itemId] = {};
    //     dummyPositions[itemId]["x"] = data.x;
    //     dummyPositions[itemId]["y"] = data.y;
    //     setPositions(dummyPositions);
    //     console.log(dummyPositions);
    //     console.log("event-",e);
        
    //   }
    
    return hasLoaded ? (

        <div>
        {machineDataList.map((item) =>{
            return(
                
                <Draggable onDrag={updateXarrow} 
                defaultPosition={
                    positions === null ? { x: 0, y: 0 } : !positions[item.machineID] ? { x: 0, y: 0 } : { x: positions[item.machineID].x, y: positions[item.machineID].y }
                }
                positionOffset={{x:0,y:0}}

                // defaultPosition={{x:x,y:y}}
                
                // position={{x:x,y:y}}
                // nodeRef={nodeRef}
                key={item.machineID}
                onStop={handlePosition} 
                >
            <div id={item.machineID} key={item.machineID}>
                
            <CCol xs={6} sm={12} lg={12}>

              <MachineStatusComponent currentStatus={item}/>
            
            {/* <CWidgetStatsB
                color={item.status}
                icon={item.icon}
                value={item.codeValue}
                title={item.name}
                inverse
                // progress={{ color: 'white', value: 89.9 }}
                progress={{ value: 75 }}
                text = {item.text}
              
            /> */}

            </CCol>
            {/* {console.log(item)} */}
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
        <div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%'}}>
            
            <Xwrapper>

            
              
                <DraggableBox id={"Machine_1"} status={'success'} codeValue={'ALL OK'} machineDataList={machineListArray}/>
                {/* <DraggableBox id={'Machine_2'} status={'warning'} codeValue={'WR567'}/>
                <DraggableBox id={'Machine_3'} status={'warning'} codeValue={'WR098'}/>
                <DraggableBox id={'Machine_4'} status={'danger'} codeValue={'ER349'}/>
                <DraggableBox id={'Machine_5'} status={'success'} codeValue={'ALL OK'}/>
                <DraggableBox id={'Machine_6'} status={'success'} codeValue={'ALL OK'}/>
                <DraggableBox id={'Machine_7'} status={'success'} codeValue={'ALL OK'}/>
                <DraggableBox id={'Machine_8'} status={'warning'} codeValue={'WR098'}/> */}
                
                
                {/* <Xarrow start={'Machine 1'} end={'Machine 2'}
                dashness={{animation:true}}
                showHead={false}
                strokeWidth={15}/>
                <Xarrow start={'Machine 1'} end={'Machine 2'}
                strokeWidth={5}
                showHead={false}/>

                <Xarrow start={'Machine 2'} end={'Machine 3'}
                dashness={{animation:true}}
                showHead={false}
                strokeWidth={15}/>
                <Xarrow start={'Machine 2'} end={'Machine 3'}
                strokeWidth={5}
                showHead={false}/>

                <Xarrow start={'Machine 3'} end={'Machine 4'}
                dashness
                showHead={false}
                strokeWidth={15}/>
                <Xarrow start={'Machine 3'} end={'Machine 4'}
                strokeWidth={5}
                showHead={false}/>

                
                
                <Xarrow start={'Machine 5'} end={'Machine 3'}/>
                <Xarrow start={'Machine 6'} end={'Machine 4'}/> */}
            </Xwrapper>
        </div>
    ) ;
}
