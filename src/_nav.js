import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  //cilCursor,
  cilMonitor,
  // cilNotes,
  cilPuzzle,
  // cilSpeedometer,
  // cilLightbulb,
  //cilUsb,
  //cilEqualizer,
  // cilSitemap,
  // cilTouchApp,
  // cilBug,
  // cilCenterFocus,
  // cilUser,
  cilDescription,
  // cilAccountLogout,
  cilClock,

  //cilGroup,
  cilCloud,
  // cilListRich,
  // cilObjectGroup,
  //cilBraille,
   //cilCheckCircle,
   //cilDiamond,
  // cilEnvelopeLetter,
  cilArrowCircleBottom,
   //cilSettings,
   //cilSearch,
   //cilSwapHorizontal,
  //  cilVoiceOverRecord,
  cilShieldAlt,
   //cilPrint,
  //  cilLan,
  //cilBoltCircle,
   //cilBellExclamation,
   //cilRunning,
  //  cilSignLanguage,
   //cilShortText,
   //cilColumns,
  // cilInputHdmi,
  // cilInput,
  //cibKeycdn,
  cilHome,
  cilUserX,
  //cilCog
} from '@coreui/icons'
//import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import {CNavItem, CNavTitle } from '@coreui/react'


const username = localStorage.getItem('username');
const password = localStorage.getItem('password');

const isAdmin = username === 'admin' && password === 'admin';

const _nav = [
  {
    component: CNavTitle,
    name: 'Production Monitor',
    style: { color: '#FFFFFF' },
  },
  {
    component: CNavItem,
    name: <span style={{ color: 'white' }}>Dashboard</span>,
    to: '/HLMando/dashboard',
    icon: <CIcon icon={cilCloud}  customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: <span style={{ color: 'white' }}>Production</span>,
    to: '/HLMando/Productionmonitor',
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: <span style={{ color: 'white' }}>Shiftreport</span>,
    to: '/HLMando/Shiftreport',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: <span style={{ color: 'white' }}>Download</span>,
    to: '/HLMando/Download',
    icon: <CIcon icon={cilArrowCircleBottom} customClassName="nav-icon" />,
  },
   {
     component: CNavItem,
     name: <span style={{ color: 'white' }}>List Achievement</span>,
     to: '/HLMando/Listachievement',
     icon: <CIcon icon={cilClock} customClassName="nav-icon" />,
   },



    //{
      //component: CNavItem,
      //name: 'List Employee',
      //to: '/HLMando/Listemployee',
      //icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    //},
    //{
      //component: CNavItem,
      //name: 'Logout',
      //to: '/logout',
      //icon: <CIcon icon={cilAccountLogout} customClassName="nav-icon" />,
      //style: { color: '#FFFFFF' },
    //},
  // {
  //   component: CNavItem,
  //   name: 'Live Dashboard',
  //   to: '/live',
  //   icon: <CIcon icon={cilMonitor} customClassName="nav-icon" />
   
  // },
  // {
  //   component: CNavItem,
  //   name: 'Data Dashboard',
  //   to: '/dashboard',
  //   icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    
  // },
  //{
    //component: CNavItem,
    //name: 'Dashboard',
    //to: '/emailtracking/dashboard',
    //icon: <CIcon icon={cilLaptop} customClassName="nav-icon" />,
  //},
  // {
  //   component: CNavTitle,
  //   name: 'Application',
  // },
//   {
//   component: CNavGroup,
//   name: 'Andon System',
  
//   icon: <CIcon icon={cilListRich} customClassName="nav-icon" />,
//   items:[
//     {
//       component: CNavItem,
//       name: 'Process',
//       to: '/event/eventgroup',
//       icon: <CIcon icon={cilObjectGroup} customClassName="nav-icon" />,
//     },
//     {
//       component: CNavItem,
//       name: 'Event Map',
//       to: '/event/eventmap',
//       icon: <CIcon icon={cilSitemap} customClassName="nav-icon" />,
//     },
//     {
//       component: CNavItem,
//       name: 'Indicator',
//       to: '/event/indicator',
//       icon: <CIcon icon={cilLightbulb} customClassName="nav-icon" />,
//     },
//     {
//       component: CNavItem,
//       name: 'Button',
//       to: '/event/button',
//       icon: <CIcon icon={cilTouchApp} customClassName="nav-icon" />,
//     },
//     {
//       component: CNavItem,
//       name: 'Problem Code',
//       to: '/event/problemcode',
//       icon: <CIcon icon={cilBug} customClassName="nav-icon" />,
//     },

//{
  //component: CNavTitle,
  //name: 'DATA',
  //style: { color: '#FFFFFF' },
//},
//{
  //component: CNavItem,
  //name: 'Log Data',
  //to: '/data/logdata',
  //icon: <CIcon icon={cilBraille} customClassName="nav-icon" />,
//},
//{
  //component: CNavItem,
  //name: 'Machine Data',
  //to: '/data/machinedata',
  //icon: <CIcon icon={cilCheckCircle} customClassName="nav-icon" />,
//},
//{
  //component: CNavItem,
  //name: 'Device Data',
  //to: '/data/devicedata',
  //icon: <CIcon icon={cilDiamond} customClassName="nav-icon" />,
//},
//{
  //component: CNavItem,
  //name: 'Production Data',
  //to: '/data/productiondata',
  //icon: <CIcon icon={cibKeycdn} customClassName="nav-icon" />,
//},
//{
//  component: CNavItem,
//  name: 'Active Problem',
//  to: '/data/activeproblem',
//  icon: <CIcon icon={cilBraille} customClassName="nav-icon" />,
//},
//{
//  component: CNavItem,
//  name: 'Problem Data',
//  to: '/data/problemdata',
//  icon: <CIcon icon={cilCheckCircle} customClassName="nav-icon" />,
//},
//{
//  component: CNavItem,
//  name: 'Device Raw',
//  to: '/data/devraw',
//  icon: <CIcon icon={cilDiamond} customClassName="nav-icon" />,
//},
//{
//  component: CNavTitle,
//  name: 'Email tracking',
//},
// {
//   component: CNavItem,
//   name: 'Dashboard',
//   to: '/emailtracking/dashboard',
//   icon: <CIcon icon={cilLaptop} customClassName="nav-icon" />,
// },
// {
//   component: CNavItem,
//   name: 'Inbox',
//   to: '/emailtracking/emailtable',
//   icon: <CIcon icon={cilArrowCircleBottom} customClassName="nav-icon" />,
// },
// {
//   component: CNavItem,
//   name: 'Create Department',
//   to: '/emailtracking/department',
//   icon: <CIcon icon={cilSearch} customClassName="nav-icon" />,
// },
// {
//   component: CNavItem,
//   name: 'Rule Engine',
//   to: '/emailtracking/trigger',
//   icon: <CIcon icon={cilSignLanguage} customClassName="nav-icon" />,
// },
// {
//   component: CNavItem,
//   name: 'Ticket',
//   to: '/emailtracking/ticket',
//   icon: <CIcon icon={cilColumns} customClassName="nav-icon" />,
// },
// {
//   component: CNavItem,
//   name: 'Report',
//   to: '/emailtracking/ticketreport',
//   icon: <CIcon icon={cilShortText} customClassName="nav-icon" />,
// },
// {
//   component: CNavItem,
//   name: 'Setting',
//   to: '/emailtracking/setting',
//   icon: <CIcon icon={cibKeycdn} customClassName="nav-icon" />,
// },

  {
    component: CNavTitle,
    name: 'Device Management',
    style: {color: '#FFFFFF' },
  },
  {
    component: CNavItem,
    name: <span style={{ color: 'white' }}>Machine</span>,
    to: '/details/machinedetails',
    icon: <CIcon icon={cilPuzzle} customClassName="nav-icon" />,
    
  },
  isAdmin && {
    component: CNavItem,
    name: <span style={{ color: 'white' }}>Shift Timing</span>,
    to: '/details/shifttiming',
    icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" />,
    
  },
  {
    component: CNavItem,
    name: <span style={{ color: 'white' }}>Machinegroup</span>,
    to: '/details/machinegroup',
    icon: <CIcon icon={cilMonitor} customClassName="nav-icon" />,
    
  },
  //{
    //component: CNavItem,
    //name: 'Device',
    //to: '/details/devdetails',
    //icon: <CIcon icon={cilCursor} customClassName="nav-icon" />,

    // items:[
    //   {
    //     component: CNavItem,
    //     name: 'Hard Device',
    //     to: '/details/devdetails',
    //     icon: <CIcon icon={cilInput} customClassName="nav-icon" />,
        
    //   },
    //   {
    //     component: CNavItem,
    //     name: 'Soft Device',
    //     to: '/details/softdetails',
    //     icon: <CIcon icon={cilInputHdmi} customClassName="nav-icon" />,
        
    //   },
    // ]
    
  //},
  // {
  //   component: CNavItem,
  //   name: 'Unregister Device',
  //   to:'/details/unregister',
  //   icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  
  // },
  //{
    //component: CNavTitle,
    //name: 'Configurations',
    //style: {color: '#FFFFFF' },

  //},
  //{
    //component: CNavItem,
    //name: 'UART',
    //to:'/config/uart',
    //icon: <CIcon icon={cilUsb} customClassName="nav-icon" />,

  //},
  //{
    //component: CNavItem,
    //name: 'HTTP',
    //to:'/config/http',
    //icon: <CIcon icon={cilUsb} customClassName="nav-icon" />,

  //},
  //{
    //component: CNavItem,
    //name: 'MQTT',
    //to: '/config/mqtt',
    //icon: <CIcon icon={cilEqualizer} customClassName="nav-icon" />,
  
  //},
  isAdmin && {
    component: CNavTitle,
     name: 'User Management',
     style: {color: '#FFFFFF' },
     
   },
   isAdmin && {
     component: CNavItem,
     name: <span style={{ color: 'white' }}>Employees</span>,
     to: '/users/users',
     icon: <CIcon icon={cilUserX} customClassName="nav-icon" />,
     
   },
   //{
    // component: CNavItem,
     //name: 'Groups',
     //to: '/users/groups',
     //icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
     
   //},
  // {
  //   component: CNavTitle,
  //   name: 'Setting',
  // },
  // {
  //   component: CNavItem,
  //   name: 'Settings',
  //   to:'/setting/settings',
  //   icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  // }
  //{
    //component: CNavTitle,
    //name: 'ACTIONS',
    //style: { color: '#FFFFFF' },
  //},
  //{
            //component: CNavItem,
            //name: 'Notify Report',
            //to: '/pushnotification/sendreport',
            //icon: <CIcon icon={cilSwapHorizontal} customClassName="nav-icon" />,
          //},
          //  {
          //    component: CNavItem,
          //    name: 'User Identifier',
          //    to: '/pushnotification/useridentifier',
          //    icon: <CIcon icon={cilVoiceOverRecord} customClassName="nav-icon" />,
          //  },
          // {
          //   component: CNavItem,
          //   name: 'Setting',
          //   to: '/pushnotification/setting',
          //   icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" />,
          // },
            //{
              //component: CNavItem,
              //name: 'SMS Report',
              //to: '/smsgateway/sendreport',
              //icon: <CIcon icon={cilPrint} customClassName="nav-icon" />,
            //},
            // {
            //   component: CNavItem,
            //   name: 'Settings',
            //   to: '/smsgateway/settings',
            //   icon: <CIcon icon={cilLan} customClassName="nav-icon" />,
            // },
  
          ].filter(Boolean); // Filter out false values

export default _nav