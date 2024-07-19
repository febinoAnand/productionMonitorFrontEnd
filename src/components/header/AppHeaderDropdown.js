import React from 'react';
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react';
import {
  cilLockLocked,
  cilTouchApp,
  cilUser,
} from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import axios from 'axios';
import avatar9 from './../../assets/images/avatars/10.jpg';
import BaseURL from 'src/assets/contants/BaseURL';
import { useNavigate } from 'react-router-dom';

const AppHeaderDropdown = () => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(BaseURL + 'Userauth/weblogout/', { token });

    } catch (error) {
      console.error('There was an error logging out!', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      navigate('/');
      window.location.reload();
    }
  };

  const handleChangePassword = () => {
    navigate('/users/changepassword');
  };

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
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={handleChangePassword}>
          <div className="dropdown-item d-flex align-items-center">
            <CIcon icon={cilTouchApp} className="me-2" />
            Change Password
          </div>
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={handleLogout}>
          <div className="dropdown-item d-flex align-items-center">
            <CIcon icon={cilLockLocked} className="me-2" />
            Log Out
          </div>
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;