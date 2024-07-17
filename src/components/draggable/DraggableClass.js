import Draggable from 'react-draggable';
import React from 'react';

function DraggableClass({myCompo, updatePosition}) {

    // update x and y of myCompo when dragging is stopped
    function handleStop(event,dragElement) {
        myCompo.x = dragElement.x;
        myCompo.y = dragElement.y;
        updatePosition(myCompo);
    }

    return (
        <div>
            <Draggable onStop={handleStop} defaultPosition={{x: myCompo.x, y: myCompo.y}} positionOffset={{ x: '-50%', y: '-50%' }}>
            <div id={id}>
            <CCol xs={6} sm={12} lg={12}>
              
               <CWidgetStatsB
                color={"warning"}
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
        </div>
    );
}

export {DraggableClass};
