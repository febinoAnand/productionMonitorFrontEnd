import React from 'react';
// import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  CContainer,
  CHeader,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  // CButton,
  // COffcanvas,
  // COffcanvasHeader,
  // COffcanvasBody,
  // CBadge,
  CNavLink,
  // CTooltip
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilMenu } from '@coreui/icons';

import { AppBreadcrumb } from './index';
import { AppHeaderDropdown } from './header/index';
// import BaseURL from 'src/assets/contants/BaseURL';

const AppHeader = () => {
  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);
  // const [notifications, setNotifications] = useState([]);
  // const [notificationCount, setNotificationCount] = useState(0);
  // const [offcanvasVisible, setOffcanvasVisible] = useState(false);
  // const [inboxVisible, setInboxVisible] = useState(false);
  // const [inbox, setInbox] = useState([]);
  // const [inboxCount, setInboxCount] = useState(0);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem('token');
  //   const fetchNotifications = async () => {
  //     try {
  //       const today = new Date().toISOString().split('T')[0];
  //       const response = await fetch(`${BaseURL}pushnotification/sendreport/?date=${today}`, {
  //         headers: {
  //           Authorization: `Token ${token}`,
  //           'Content-Type': 'application/json',
  //         },
  //       });
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch notifications');
  //       }
  //       const data = await response.json();
  //       const sortedNotifications = data.filter(notification => (
  //         notification.delivery_status === "200 - OK" &&
  //         notification.date === today
  //       )).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).reverse();
  //       setNotifications(sortedNotifications);
  //       setNotificationCount(sortedNotifications.length);
  //     } catch (error) {
  //       console.error('Error fetching notifications:', error);
  //     }
  //   };

  //   const fetchInbox = async () => {
  //     try {
  //       const today = new Date().toISOString().split('T')[0];
  //       const response = await fetch(`${BaseURL}emailtracking/inbox/?date=${today}`, {
  //         headers: {
  //           Authorization: `Token ${token}`,
  //           'Content-Type': 'application/json',
  //         },
  //       });
  //       if (!response.ok) {
  //         throw new Error('Failed to fetch inbox messages');
  //       }
  //       const data = await response.json();
  //       const sortedInbox = data.filter(message => message.date === today)
  //         .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).reverse();
  //       setInbox(sortedInbox);
  //       setInboxCount(sortedInbox.length);
  //     } catch (error) {
  //       console.error('Error fetching inbox messages:', error);
  //     }
  //   };

  //   fetchNotifications();
  //   fetchInbox();
  // }, []);

  // const truncateMessage = (message, charLimit) => {
  //   if (message.length > charLimit) {
  //     return message.substring(0, charLimit) + '...';
  //   }
  //   return message;
  // };

  // const handleNotificationClick = (ticketId) => {
  //   navigate(`/emailtracking/ticketreport`);
  //   setOffcanvasVisible(false);
  // };

  // const handleInboxClick = () => {
  //   navigate(`/emailtracking/emailtable`);
  //   setInboxVisible(false);
  // };

  return (
    <CHeader position="sticky" className="mb-2">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavLink>Dashboard</CNavLink>
        </CHeaderNav>
        {/* <CHeaderNav>
          <CTooltip content="Notifications">
            <CButton color="link" onClick={() => setOffcanvasVisible(!offcanvasVisible)}>
              <div style={{ position: 'relative' }}>
                <CIcon icon={cilBell} size="lg" />
                {notificationCount > 0 && (
                  <CBadge 
                    color="danger" 
                    className="position-absolute top-0 start-100 translate-middle" 
                    size="sm"
                    style={{ transform: 'translate(-50%, -50%)', fontSize: '0.75rem' }}
                  >
                    {notificationCount}
                  </CBadge>
                )}
              </div>
            </CButton>
          </CTooltip>
          <CTooltip content="Inbox Received">
            <CButton color="link" onClick={() => setInboxVisible(!inboxVisible)}>
              <div style={{ position: 'relative' }}>
                <CIcon icon={cilEnvelopeOpen} size="lg" />
                {inboxCount > 0 && (
                  <CBadge 
                    color="danger" 
                    className="position-absolute top-0 start-100 translate-middle" 
                    size="sm"
                    style={{ transform: 'translate(-50%, -50%)', fontSize: '0.75rem' }}
                  >
                    {inboxCount}
                  </CBadge>
                )}
              </div>
            </CButton>
          </CTooltip>
        </CHeaderNav> */}
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>

      {/* <COffcanvas placement="end" visible={offcanvasVisible} onHide={() => setOffcanvasVisible(false)}>
        <COffcanvasHeader className="bg-primary text-light">
          <h5><strong>Notifications</strong></h5>
          <CButton className="text-reset" color='danger' onClick={() => setOffcanvasVisible(false)}>
            <span aria-hidden="true">&times;</span>
          </CButton>
        </COffcanvasHeader>
        <COffcanvasBody>
          {notifications.length > 0 ? (
            notifications.map((notification, index) => (
              <div key={index} onClick={() => handleNotificationClick(notification.ticketId)} style={{ cursor: 'pointer', marginBottom: '1rem' }}>
                <strong>{notification.title}</strong>
                <div>{truncateMessage(notification.message, 45)}</div>
                {index < notifications.length - 1 && <div style={{ borderTop: '1px solid #e0e0e0', margin: '10px 0' }}></div>}
              </div>
            ))
          ) : (
            <div>No notifications</div>
          )}
        </COffcanvasBody>
      </COffcanvas>

      <COffcanvas placement="end" visible={inboxVisible} onHide={() => setInboxVisible(false)}>
        <COffcanvasHeader className="bg-primary text-light">
          <h5><strong>Mails Received Today</strong></h5>
          <CButton className="text-reset" color='danger' onClick={() => setInboxVisible(false)}>
            <span aria-hidden="true">&times;</span>
          </CButton>
        </COffcanvasHeader>
        <COffcanvasBody>
          {inbox.length > 0 ? (
            inbox.map((message, index) => (
              <div key={index} onClick={handleInboxClick} style={{ cursor: 'pointer', marginBottom: '1rem' }}>
                <strong>{message.subject}</strong>
                <div>{truncateMessage(message.message, 50)}</div>
                {index < inbox.length - 1 && <div style={{ borderTop: '1px solid #e0e0e0', margin: '10px 0' }}></div>}
              </div>
            ))
          ) : (
            <div>No inbox messages</div>
          )}
        </COffcanvasBody>
      </COffcanvas> */}
    </CHeader>
  );
};

export default AppHeader;