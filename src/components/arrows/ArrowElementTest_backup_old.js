import React from 'react';
import Xarrow, {useXarrow, Xwrapper} from 'react-xarrows';
import Draggable from 'react-draggable';
import CIcon from '@coreui/icons-react'
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

const boxStyle = {border: 'grey solid 2px', borderRadius: '10px', padding: '5px'};

const DraggableBox = ({id, status, codeValue}) => {
    const updateXarrow = useXarrow();
    return (
        <Draggable onDrag={updateXarrow} onStop={updateXarrow}>
            <div id={id}>
            <CCol xs={6} sm={12} lg={12}>
              
               <CWidgetStatsB
                color={status}
                icon={<CIcon icon={cilPeople} height={20} />}
                value={codeValue}
                title={id}
                inverse
                // progress={{ color: 'white', value: 89.9 }}
                progress={{ value: 75 }}
                text = {"Material Stopped"}
              />
            </CCol>
               
              
         
            </div>
        </Draggable>
    );
};

export function V2Example() {
    return (
        <div style={{display: 'flex', justifyContent: 'space-evenly', width: '100%'}}>
            <Xwrapper>
                <DraggableBox id={'Machine 1'} status={'success'} codeValue={'ALL OK'}/>
                <DraggableBox id={'Machine 2'} status={'warning'} codeValue={'WR567'}/>
                <DraggableBox id={'Machine 3'} status={'warning'} codeValue={'WR098'}/>
                <DraggableBox id={'Machine 4'} status={'danger'} codeValue={'ER349'}/>
                <DraggableBox id={'Machine 5'} status={'success'} codeValue={'ALL OK'}/>
                <DraggableBox id={'Machine 6'} status={'success'} codeValue={'ALL OK'}/>
                <Xarrow start={'Machine 1'} end={'Machine 2'}/>
                <Xarrow start={'Machine 2'} end={'Machine 3'}/>
                <Xarrow start={'Machine 3'} end={'Machine 4'}/>
                <Xarrow start={'Machine 5'} end={'Machine 3'}/>
                <Xarrow start={'Machine 6'} end={'Machine 4'}/>
            </Xwrapper>
        </div>
    );
}
