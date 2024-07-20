import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { cilTrash, cilPen, cilLockLocked } from '@coreui/icons';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CFormInput,
    CInputGroup,
    CRow,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CFormSwitch,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CFormLabel,
    CForm
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import BaseURL from 'src/assets/contants/BaseURL';

const Users = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userActive, setUserActive] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [passwordModalVisible, setPasswordModalVisible] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        handleSearch();
    }, [searchQuery, users]);

    const fetchUsers = () => {
        const token = localStorage.getItem('token');
        axios.get(BaseURL + 'Userauth/userdetail/', {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
            .then(response => {
                setUsers(response.data);
                setFilteredUsers(response.data);
            })
            .catch(error => {
                console.error('Error fetching users:', error);
            });
    };

    const handleSearch = () => {
        const query = document.getElementById('searchInput').value.toLowerCase();
        const filtered = users.filter(user => {
            const searchFields = [
                user.usermod.username,
                user.designation,
                user.mobile_no,
                user.device_id,
                user.auth_state,
                user.expiry_time,
            ];
            return searchFields.some(field =>
                field ? field.toString().toLowerCase().includes(query) : false
            );
        });
        setFilteredUsers(filtered);
    };

    const handleTableRowClick = (user) => {
        setSelectedUser(user);
        setUserActive(user.userActive);
        setModalVisible(true);
    };

    const handlePasswordModalOpen = (user) => {
        setSelectedUser(user);
        setPasswordModalVisible(true);
    };

    const handleToggleChange = (event) => {
        const { checked } = event.target;
        setUserActive(checked);
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedUsers([]);
        } else {
            setSelectedUsers(filteredUsers.map(user => user.user_id));
        }
        setSelectAll(!selectAll);
    };

    const handleSelectUser = (userId) => {
        const selectedIndex = selectedUsers.indexOf(userId);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = [...selectedUsers, userId];
        } else if (selectedIndex === 0) {
            newSelected = [...selectedUsers.slice(1)];
        } else if (selectedIndex === selectedUsers.length - 1) {
            newSelected = [...selectedUsers.slice(0, -1)];
        } else if (selectedIndex > 0) {
            newSelected = [
                ...selectedUsers.slice(0, selectedIndex),
                ...selectedUsers.slice(selectedIndex + 1),
            ];
        }

        setSelectedUsers(newSelected);
        setSelectAll(newSelected.length === filteredUsers.length);
    };

    const handleDeleteSelectedUsers = () => {
        const token = localStorage.getItem('token');
        selectedUsers.forEach(userId => {
            axios.delete(`${BaseURL}Userauth/delete-user/${userId}/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            })
                .then(response => {
                    fetchUsers();
                    setSuccessMessage('User deleted successfully');
                })
                .catch(error => {
                    console.error('Error deleting user:', error);
                });
        });
        setSelectedUsers([]);
    };

    const handleUpdateUser = () => {
        if (!selectedUser || !selectedUser.userdetail_id) {
            console.error('Error: No user selected for update.');
            return;
        }

        const username = document.getElementById('name').value;
        const designation = document.getElementById('designation').value;
        const mobileno = document.getElementById('mobileno').value;

        if (!username || !designation || !mobileno) {
            console.error('Error: Username, designation, or mobile number cannot be empty.');
            return;
        }

        const updatedUser = {
            ...selectedUser,
            usermod: {
                ...selectedUser.usermod,
                username: username,
            },
            designation: designation,
            mobile_no: mobileno,
            userActive: userActive
        };

        const token = localStorage.getItem('token');
        axios.put(`${BaseURL}Userauth/userdetail/${selectedUser.userdetail_id}/`, updatedUser, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
            .then(response => {
                console.log('User updated successfully:', response.data);
                fetchUsers();
                setModalVisible(false);
                setSuccessMessage('User updated successfully');
            })
            .catch(error => {
                console.error('Error updating user:', error);
            });
    };

    const handleUpdatePassword = () => {
        if (!selectedUser || !selectedUser.userdetail_id) {
            console.error('Error: No user selected for password update.');
            return;
        }
        const newPassword = document.getElementById('newpassword').value;
        const confirmPassword = document.getElementById('confirmpassword').value;
    
        if (newPassword !== confirmPassword) {
            console.error('Error: New Password and Confirm Password do not match.');
            return;
        }
    
        const requestData = {
            user_id: selectedUser.user_id,
            username: selectedUser.usermod.username,
            new_password: newPassword,
            confirm_password: confirmPassword,
        };
        console.log("data",requestData)
    
        const token = localStorage.getItem('token');
        axios.post(`${BaseURL}Userauth/change-password/`, requestData, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
            .then(response => {
                console.log('Password updated successfully:', response.data);
                fetchUsers();
                setPasswordModalVisible(false);
                setSuccessMessage('Password updated successfully');
            })
            .catch(error => {
                console.error('Error updating password:', error);
            });
    };    

    const handleDeleteUser = (userId) => {
        const token = localStorage.getItem('token');
        axios.delete(`${BaseURL}Userauth/delete-user/${userId}/`, {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
            .then(response => {
                fetchUsers();
                setSuccessMessage('User deleted successfully');
            })
            .catch(error => {
                console.error('Error deleting user:', error);
            });
    };

    return (
        <>
            {successMessage && (
                <div className="alert alert-success" role="alert">
                    {successMessage}
                </div>
            )}
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <div className="d-flex align-items-center justify-content-between">
                                <strong>USER LIST</strong>
                                <CButton type="button" color="success" variant='outline' size='sm' onClick={handleDeleteSelectedUsers}>
                                    Delete Selected
                                </CButton>
                            </div>
                        </CCardHeader>
                        <CCardBody>
                            <CCol md={4}>
                                <CInputGroup className="flex-nowrap mt-3 mb-4">
                                    <CFormInput
                                        placeholder="Search by Ext user, Designation, Mobile no or Device ID"
                                        aria-label="Search"
                                        aria-describedby="addon-wrapping"
                                        id="searchInput"
                                    />
                                    <CButton type="button" color="secondary" onClick={handleSearch} id="button-addon2">
                                        Search
                                    </CButton>
                                </CInputGroup>
                            </CCol>
                            <CTable striped hover>
                                <CTableHead>
                                    <CTableRow color="dark">
                                        <CTableHeaderCell scope="col">
                                            <input
                                                type="checkbox"
                                                checked={selectAll}
                                                onChange={handleSelectAll}
                                            />
                                        </CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Si.No</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Ext User</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Designation</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Mobile No</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Device ID</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Active Status</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Expiry Time</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {filteredUsers.length === 0 ? (
                                        <CTableRow>
                                            <CTableDataCell colSpan="9" className="text-center">
                                                No users available
                                            </CTableDataCell>
                                        </CTableRow>
                                    ) : (
                                        filteredUsers.map((user, index) => (
                                            <CTableRow key={index}>
                                                <CTableDataCell>
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedUsers.includes(user.user_id)}
                                                        onChange={() => handleSelectUser(user.user_id)}
                                                    />
                                                </CTableDataCell>
                                                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                                <CTableDataCell>{user.usermod.username}</CTableDataCell>
                                                <CTableDataCell>{user.designation}</CTableDataCell>
                                                <CTableDataCell>{user.mobile_no}</CTableDataCell>
                                                <CTableDataCell>{user.device_id}</CTableDataCell>
                                                <CTableDataCell>
                                                    <span style={{ fontWeight: user.userActive ? 'bold' : 'bold', color: user.userActive ? 'green' : 'red' }}>
                                                        {user.userActive ? 'Active' : 'Inactive'}
                                                    </span>
                                                </CTableDataCell>
                                                <CTableDataCell>{user.expiry_time}</CTableDataCell>
                                                <CTableDataCell>
                                                    <div className="d-flex gap-2">
                                                        <CButton className="button-green" size='sm' onClick={() => handleTableRowClick(user)}>
                                                            <CIcon icon={cilPen} />
                                                        </CButton>
                                                        <CButton className="button-yellow" size='sm' onClick={() => handlePasswordModalOpen(user)}>
                                                            <CIcon icon={cilLockLocked} />
                                                        </CButton>
                                                        <CButton color='primary' size='sm' onClick={(e) => { e.stopPropagation(); handleDeleteUser(user.user_id); }}>
                                                            <CIcon icon={cilTrash} />
                                                        </CButton>
                                                    </div>
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))
                                    )}
                                </CTableBody>
                            </CTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <CModal size='lg' visible={modalVisible} onClose={() => setModalVisible(false)} backdrop="static" keyboard={false}>
                <CModalHeader onClose={() => setModalVisible(false)}>
                    <CModalTitle>User Details</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {selectedUser && (
                        <CForm>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="name" className="col-sm-2 col-form-label">User Name</CFormLabel>
                                <CCol md={4}>
                                    <CFormInput type="text" id="name" name="name" defaultValue={selectedUser.usermod.username} readOnly />
                                </CCol>
                                <CFormLabel htmlFor="email" className="col-sm-2 col-form-label">Email Address</CFormLabel>
                                <CCol md={4}>
                                    <CFormInput type="text" id="email" name="email" defaultValue={selectedUser.usermod.email} readOnly />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="designation" className="col-sm-2 col-form-label">Designation</CFormLabel>
                                <CCol md={4}>
                                    <CFormInput type="text" id="designation" name="designation" defaultValue={selectedUser.designation} />
                                </CCol>
                                <CFormLabel htmlFor="mobileno" className="col-sm-2 col-form-label">Mobile N0</CFormLabel>
                                <CCol md={4}>
                                    <CFormInput type="text" id="mobileno" name="mobileno" defaultValue={selectedUser.mobile_no} />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="toggle" className="col-sm-2 col-form-label">Active Status</CFormLabel>
                                <CCol md={6}>
                                    <CFormSwitch
                                        id="toggle"
                                        checked={userActive}
                                        onChange={handleToggleChange}
                                    />
                                </CCol>
                            </CRow>
                            <CRow className="justify-content-center">
                                <CCol md="auto">
                                    <CButton color="primary" variant='outline' size='sm' onClick={handleUpdateUser}>Update</CButton>
                                </CCol>
                            </CRow>
                        </CForm>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" size='sm' onClick={() => setModalVisible(false)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>

            <CModal size='lg' visible={passwordModalVisible} onClose={() => setPasswordModalVisible(false)} backdrop="static" keyboard={false}>
                <CModalHeader onClose={() => setPasswordModalVisible(false)}>
                    <CModalTitle><strong>Update Password</strong></CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {selectedUser && (
                        <CForm>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="name" className="col-sm-2 col-form-label">User Name</CFormLabel>
                                <CCol md={10}>
                                    <CFormInput type="text" id="name" name="name" defaultValue={selectedUser.usermod.username} readOnly />
                                </CCol>
                            </CRow>
                            <CRow className="mb-3">
                                <CFormLabel htmlFor="newpassword" className="col-sm-2 col-form-label">New Password</CFormLabel>
                                <CCol md={4}>
                                    <CFormInput type="password" id="newpassword" name="newpassword" />
                                </CCol>
                                <CFormLabel htmlFor="confirmpassword" className="col-sm-2 col-form-label">Confirm Password</CFormLabel>
                                <CCol md={4}>
                                    <CFormInput type="password" id="confirmpassword" name="confirmpassword" />
                                </CCol>
                            </CRow>
                            <CRow className="justify-content-center">
                                <CCol md="auto">
                                    <CButton color="primary" variant='outline' size='sm' onClick={handleUpdatePassword}>Update</CButton>
                                </CCol>
                            </CRow>
                        </CForm>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" size='sm' onClick={() => setPasswordModalVisible(false)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};

export default Users;