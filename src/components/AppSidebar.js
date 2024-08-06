//import React from 'react'
//import { useSelector, useDispatch } from 'react-redux'

//import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
// import CIcon from '@coreui/icons-react'
// import {
//   cilFactory,
//   cilChild,
//   cilMagnifyingGlass
// } from '@coreui/icons'

//import { AppSidebarNav } from './AppSidebarNav'

// import { logoNegative } from 'src/assets/brand/logo-negative'
// import { sygnet } from 'src/assets/brand/sygnet'
//import logoImage from 'src/assets/images/hlmando.svg'
//import SimpleBar from 'simplebar-react'
//import 'simplebar/dist/simplebar.min.css'

// sidebar nav config
//import navigation from '../_nav'

//const AppSidebar = () => {
  //const dispatch = useDispatch()
  //const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  //const sidebarShow = useSelector((state) => state.sidebarShow)

  //return (
    //<CSidebar
      //position="fixed"
      //unfoldable={!unfoldable}
      //visible={sidebarShow}
      //onVisibleChange={(visible) => {
        //dispatch({ type: 'set', sidebarShow: visible })
      //}}
      
      //style={{overflowY: 'auto' }}
    //>
      //<CSidebarBrand style={{ display: 'flex', alignItems: 'center' }} to="/">
      //<img src={logoImage} alt="Logo"  style={{ height: 'auto', width: 'auto' }}/>
      //</CSidebarBrand>
      //<CSidebarNav >
        //<SimpleBar>
          //<AppSidebarNav items={navigation} />
        //</SimpleBar>
      //</CSidebarNav>
      //<CSidebarToggler
        //className="d-none d-lg-flex"
        //onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
         
      ///>
    //</CSidebar>
  //)
//}

//export default React.memo(AppSidebar)



import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react'
import { AppSidebarNav } from './AppSidebarNav'
import logoImage from 'src/assets/images/hlmando.svg'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import navigation from '../_nav'

const AppSidebar = () => {
  const dispatch = useDispatch()
  const unfoldable = useSelector((state) => state.sidebarUnfoldable)
  const sidebarShow = useSelector((state) => state.sidebarShow)

  return (
    <CSidebar
      position="fixed"
      unfoldable={!unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible })
      }}
      style={{ overflowY: 'auto', backgroundColor:  '#047BC4', color: 'white' }} 
    >
      <CSidebarBrand
        to="/"
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '10px',
          backgroundColor: ' #047BC4', 
        }}
      >
        <img
          src={logoImage}
          alt="Logo"
          style={{ height: 'auto', width: '100%', maxWidth: '200px' }} 
        />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar> 
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
        style={{ backgroundColor: '#047BC4', color: 'white' }} 
      />
    </CSidebar>
  )
}

export default React.memo(AppSidebar)
