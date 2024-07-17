import React from 'react'
import {
  CAvatar,
  // CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  // cilBell,
  // cilCreditCard,
  // cilCommentSquare,
  // cilEnvelopeOpen,
  // cilFile,
  cilLockLocked,
  // cilSettings,
  // cilTask,
  cilUser,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import axios from 'axios'
import avatar9 from './../../assets/images/avatars/10.jpg'
import BaseURL from 'src/assets/contants/BaseURL';

const AppHeaderDropdown = () => {
  const username = localStorage.getItem('username');
  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.post(BaseURL + 'Userauth/weblogout/', { token })

      if (response.data.status === 'OK') {
        localStorage.removeItem('token')
        localStorage.removeItem('username');
        window.location.href = '#'
      } else {
        alert('Logout failed: ' + response.data.message)
      }
    } catch (error) {
      console.error('There was an error logging out!', error)
    }
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CIcon icon={cilUser}></CIcon>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
      <CDropdownHeader className="bg-light fw-semibold py-2 text-center">Account</CDropdownHeader>
        <CDropdownItem className="text-center">
          <CAvatar src={avatar9} className="avatar mb-2" size='lg' />
          <div className="d-flex flex-column align-items-center">
            <span className="text-muted">User</span>
            <span className="fw-bold">{username}</span>
          </div>
          {/* <CBadge color="info" className="ms-2">
            42
          </CBadge> */}
        </CDropdownItem>
        {/* <CDropdownItem href="#">
          <CIcon icon={cilEnvelopeOpen} className="me-2" />
          Messages
          <CBadge color="success" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilTask} className="me-2" />
          Tasks
          <CBadge color="danger" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCommentSquare} className="me-2" />
          Comments
          <CBadge color="warning" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownHeader className="bg-light fw-semibold py-2">Settings</CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilSettings} className="me-2" />
          Settings
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilCreditCard} className="me-2" />
          Payments
          <CBadge color="secondary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownItem href="#">
          <CIcon icon={cilFile} className="me-2" />
          Projects
          <CBadge color="primary" className="ms-2">
            42
          </CBadge>
        </CDropdownItem> */}
        <CDropdownDivider />
        <CDropdownItem href="#" onClick={handleLogout}>
          <CIcon icon={cilLockLocked} className="me-2" />
          Log Out
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
