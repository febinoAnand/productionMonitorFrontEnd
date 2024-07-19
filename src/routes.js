import React from 'react'

// const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

//test
const Test = React.lazy(() => import('./views/test/Test'))

// Password
const Changepassword = React.lazy(() => import('./views/base/users/changepassword'))

//Events
// const EventMap = React.lazy(() => import ('./views/base/events/EventMap'))
// const EventGroup = React.lazy(() => import ('./views/base/events/EventGroup'))
// const Indicator = React.lazy(() => import('./views/base/events/EventIndicator'))
// const Button = React.lazy(() => import('./views/base/events/EventButton'))
// const ProblemCode = React.lazy(() => import('./views/base/events/EventProblemcode'))

//EmailTracking
//const dashboard = React.lazy(() => import('./views/base/emailtracking/dashboard'))
//const EmailTable = React.lazy(() => import('./views/base/emailtracking/EmailTable'))
//const SettingData = React.lazy(() => import('./views/base/emailtracking/SettingData'))
//const department = React.lazy(() => import('./views/base/emailtracking/department'))
//const Trigger = React.lazy(() => import('./views/base/emailtracking/trigger'))
//const TicketReport = React.lazy(() => import('./views/base/emailtracking/ticketreport'))
//const Ticket = React.lazy(() => import('./views/base/emailtracking/ticket'))

//PushNotification
const SendReport = React.lazy(() => import('./views/base/pushnotification/sendreport'))
const UserIdentifier = React.lazy(() => import('./views/base/pushnotification/useridentifier'))
const Setting = React.lazy(() => import('./views/base/pushnotification/setting'))

//SMSGateway
const SendReports = React.lazy(() => import('./views/base/smsgateway/sendreport'))
const Settings = React.lazy(() => import('./views/base/smsgateway/settings'))

//datas
 //const HMIRaw = React.lazy(() => import('./views/base/data/HMIRaw_function'))
 //const ActiveProblem = React.lazy(() => import('./views/base/data/ActiveProblem'))
 //const ProblemData = React.lazy(() => import('./views/base/data/ProblemData'))
 const LogData = React.lazy(() => import('./views/base/data/Logdata'))
 const MachineData = React.lazy(() => import('./views/base/data/MachineData'))
 const DeviceData = React.lazy(() => import('./views/base/data/DeviceData'))
 const ProductionData = React.lazy(() => import('./views/base/data/ProductionData'))

//config
//const UART = React.lazy(() => import('./views/base/configuration/UART'))
const MQTT = React.lazy(() => import('./views/base/configuration/MQTT'))
const HTTP = React.lazy(() => import('./views/base/configuration/HTTP'))


//details
 const HMIDetails = React.lazy(() => import('./views/base/details/HMIDetails'))
 const UnregisteredDevices = React.lazy(() => import('./views/base/details/UnregisteredDevices'))
 const MachineDetails = React.lazy(() => import('./views/base/details/MachineDetails'))
 const MachineGroup = React.lazy(() => import('./views/base/details/MachineGroup'))
 const RFID = React.lazy(() => import('./views/base/details/RFID'))

//users
const Users = React.lazy(() => import('./views/base/users/Users'))
const Groups = React.lazy(() => import('./views/base/users/Groups'))
const UserSubpage = React.lazy(() => import('./views/base/users/UserSubpage'))



// Base
const Accordion = React.lazy(() => import('./views/base/accordion/Accordion'))
const Breadcrumbs = React.lazy(() => import('./views/base/breadcrumbs/Breadcrumbs'))
const Cards = React.lazy(() => import('./views/base/cards/Cards'))
const Carousels = React.lazy(() => import('./views/base/carousels/Carousels'))
const Collapses = React.lazy(() => import('./views/base/collapses/Collapses'))
const ListGroups = React.lazy(() => import('./views/base/list-groups/ListGroups'))
const Navs = React.lazy(() => import('./views/base/navs/Navs'))
const Paginations = React.lazy(() => import('./views/base/paginations/Paginations'))
const Placeholders = React.lazy(() => import('./views/base/placeholders/Placeholders'))
const Popovers = React.lazy(() => import('./views/base/popovers/Popovers'))
const Progress = React.lazy(() => import('./views/base/progress/Progress'))
const Spinners = React.lazy(() => import('./views/base/spinners/Spinners'))
const Tables = React.lazy(() => import('./views/base/tables/Tables'))
const Tooltips = React.lazy(() => import('./views/base/tooltips/Tooltips'))

// Buttons
const Buttons = React.lazy(() => import('./views/buttons/buttons/Buttons'))
const ButtonGroups = React.lazy(() => import('./views/buttons/button-groups/ButtonGroups'))
const Dropdowns = React.lazy(() => import('./views/buttons/dropdowns/Dropdowns'))

//Forms
const ChecksRadios = React.lazy(() => import('./views/forms/checks-radios/ChecksRadios'))
const FloatingLabels = React.lazy(() => import('./views/forms/floating-labels/FloatingLabels'))
const FormControl = React.lazy(() => import('./views/forms/form-control/FormControl'))
const InputGroup = React.lazy(() => import('./views/forms/input-group/InputGroup'))
const Layout = React.lazy(() => import('./views/forms/layout/Layout'))
const Range = React.lazy(() => import('./views/forms/range/Range'))
const Select = React.lazy(() => import('./views/forms/select/Select'))
const Validation = React.lazy(() => import('./views/forms/validation/Validation'))

const Charts = React.lazy(() => import('./views/charts/Charts'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

//MAin Setting
// const Settingss = React.lazy(() => import('./views/base/setting/settings'))

//Production Monitor
const Productionmonitor = React.lazy(() => import('./views/HLMando/Productionmonitor'))

//Shiftreport
const Shiftreport = React.lazy(() => import('./views/HLMando/Shiftreport'))
//List Achievement
const Listachievement = React.lazy(() => import('./views/HLMando/Listachievement'))
//List Employee
const Listemployee = React.lazy(() => import('./views/HLMando/Listemployee'))
//Download
const Download = React.lazy(() => import('./views/HLMando/Download'))




const routes = [
{ path: '/', exact: true, name: 'Home' },
  // { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  
  { path: '/temp/test', name: 'Test', element: Test }, //test

  // { path: '/event/eventgroup', name: 'EventGroup', element: EventGroup}, //Event
  // { path: '/event/eventmap', name: 'EventMap', element: EventMap}, //Event
  // { path: '/event/indicator', name: 'Indicator', element: Indicator}, //Event
  // { path: '/event/button', name: 'Button', element: Button}, //Event
  // { path: '/event/problemcode', name: 'ProblemCode', element: ProblemCode}, //Event

  //{ path: '/emailtracking/dashboard', name: 'EmailTracking / Dashboard', element: dashboard}, //EmailTracking
  //{ path: '/emailtracking/emailtable', name: 'EmailTracking / Inbox', element: EmailTable}, //EmailTracking
  //{ path: '/emailtracking/setting', name: 'EmailTracking / Setting', element: SettingData}, //EmailTracking
  //{ path: '/emailtracking/department', name: 'EmailTracking / Create Departments', element: department}, //EmailTracking
  //{ path: '/emailtracking/trigger', name: 'EmailTracking / Rules Engine', element: Trigger}, //EmailTracking
  //{ path: '/emailtracking/ticketreport', name: 'EmailTracking / Report', element: TicketReport}, //EmailTracking
  //{ path: '/emailtracking/ticket', name: 'EmailTracking / Ticket', element: Ticket}, //EmailTracking

  { path: '/pushnotification/sendreport', name: 'Actions / Notifications / Send Report', element: SendReport}, //PushNotification
  { path: '/pushnotification/useridentifier', name: 'Actions / Notifications / User Identifier', element: UserIdentifier}, //PushNotification
  { path: '/pushnotification/setting', name: 'Actions / Notifications / Setting', element: Setting}, //PushNotification

  { path: '/smsgateway/sendreport', name: 'Actions / SMS Gateway / Send Report', element: SendReports}, //SMSGateway
  { path: '/smsgateway/settings', name: 'Actions / SMS Gateway / Settings', element: Settings}, //SMSGateway

  //{ path: '/data/activeproblem', name: 'ActiveProblem', element: ActiveProblem}, //data
   //{ path: '/data/problemdata', name: 'ProblemData', element: ProblemData}, //data
   //{ path: '/data/devraw', name: 'HMIRaw', element: HMIRaw}, //data
   { path: '/data/logdata', name: 'LogData', element: LogData}, //data
   { path: '/data/machinedata', name: 'MachineData', element:MachineData}, //data
   { path: '/data/devicedata', name: 'DeviceData', element: DeviceData}, //data
   { path: '/data/productiondata', name: 'ProductionData', element:ProductionData}, //data

   { path: '/details/machinegroup', name: 'Machine Group', element: MachineGroup}, //details
  { path: '/details/machinedetails', name: 'Machine Details', element: MachineDetails}, //details
  { path: '/details/devdetails', name: 'HMI Device', element: HMIDetails}, //details
   { path: '/details/unregister', name: 'Unregistered Device', element: UnregisteredDevices}, //details
   { path: '/details/rfid', name: 'RFID', element: RFID}, //details

  { path: '/users/users', name: 'User Management / Users', element: Users}, //users
  { path: '/users/groups', name: 'User Management / Groups', element: Groups}, //users
  { path: '/users/usersubpage', name: 'UserSubpage', element: UserSubpage}, //users


   //{ path: '/config/uart', name: 'UART', element: UART}, //config
   { path: '/config/mqtt', name: 'MQTT', element: MQTT}, //config
   { path: '/config/http', name: 'HTTP', element: HTTP}, //config


  // { path: '/setting/settings', name: 'SETTING / Settings', element: Settingss}, //Main Setting

  
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/base', name: 'Base', element: Cards, exact: true },
  { path: '/base/accordion', name: 'Accordion', element: Accordion },
  { path: '/base/breadcrumbs', name: 'Breadcrumbs', element: Breadcrumbs },
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/base/carousels', name: 'Carousel', element: Carousels },
  { path: '/base/collapses', name: 'Collapse', element: Collapses },
  { path: '/base/list-groups', name: 'List Groups', element: ListGroups },
  { path: '/base/navs', name: 'Navs', element: Navs },
  { path: '/base/paginations', name: 'Paginations', element: Paginations },
  { path: '/base/placeholders', name: 'Placeholders', element: Placeholders },
  { path: '/base/popovers', name: 'Popovers', element: Popovers },
  { path: '/base/progress', name: 'Progress', element: Progress },
  { path: '/base/spinners', name: 'Spinners', element: Spinners },
  { path: '/base/tables', name: 'Tables', element: Tables },
  { path: '/base/tooltips', name: 'Tooltips', element: Tooltips },
  { path: '/buttons', name: 'Buttons', element: Buttons, exact: true },
  { path: '/buttons/buttons', name: 'Buttons', element: Buttons },
  { path: '/buttons/dropdowns', name: 'Dropdowns', element: Dropdowns },
  { path: '/buttons/button-groups', name: 'Button Groups', element: ButtonGroups },
  { path: '/charts', name: 'Charts', element: Charts },
  { path: '/forms', name: 'Forms', element: FormControl, exact: true },
  { path: '/forms/form-control', name: 'Form Control', element: FormControl },
  { path: '/forms/select', name: 'Select', element: Select },
  { path: '/forms/checks-radios', name: 'Checks & Radios', element: ChecksRadios },
  { path: '/forms/range', name: 'Range', element: Range },
  { path: '/forms/input-group', name: 'Input Group', element: InputGroup },
  { path: '/forms/floating-labels', name: 'Floating Labels', element: FloatingLabels },
  { path: '/forms/layout', name: 'Layout', element: Layout },
  { path: '/forms/validation', name: 'Validation', element: Validation },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },

  { path: '/users/changepassword', name: 'Change Password', element: Changepassword}, //Changepassword

//ProductionMonitor
{ path: '/HLMando/Productionmonitor', name: 'ProductionMonitor', element: Productionmonitor },
//Shiftreport
{ path: '/HLMando/Shiftreport', name: 'Shiftreport', element: Shiftreport },
//Listachievement
{ path: '/HLMando/Listachievement', name: 'Listachievement', element: Listachievement },
//Listemployee
{ path: '/HLMando/Listemployee', name: 'Listemployee', element: Listemployee },
//Download
{ path: '/HLMando/Download', name: 'Download', element: Download },

]
export default routes
