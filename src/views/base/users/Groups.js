import React, { useState, useEffect, useCallback } from 'react';
import { cilPen, cilTrash } from '@coreui/icons';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CFormInput,
    CFormLabel,
    CForm,
    CRow,
    CInputGroup,
    CTable,
    CTableBody,
    CTableDataCell,
    CTableHead,
    CTableHeaderCell,
    CTableRow,
    CFormSelect,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CTooltip
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import axios from 'axios';
import BaseURL from 'src/assets/contants/BaseURL';

const Groups = () => {
    const [groupData, setGroupData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [filteredGroupData, setFilteredGroupData] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [newGroupModalVisible, setNewGroupModalVisible] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupUsers, setNewGroupUsers] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        return {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json'
        };
    };

    const fetchGroupData = useCallback(async () => {
        try {
            const response = await axios.get(BaseURL + "app/groups/", { headers: getAuthHeaders() });
            const sortedData = response.data.reverse();
            setGroupData(sortedData);
            setFilteredGroupData(sortedData);
        } catch (error) {
            console.error('Error fetching group data:', error);
        }
    }, []);

    const fetchUserData = useCallback(async () => {
        try {
            const response = await axios.get(BaseURL + "Userauth/userdetail/", { headers: getAuthHeaders() });
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }, []);

    useEffect(() => {
        fetchGroupData();
        fetchUserData();
    }, [fetchGroupData, fetchUserData]);

    const handleSearch = useCallback(() => {
        if (!groupData) return;

        if (searchQuery === '') {
            setFilteredGroupData(groupData);
        } else {
            const lowercasedQuery = searchQuery.toLowerCase();
            const filteredData = groupData.filter(group => {
                const name = group.name?.toLowerCase() || '';
                const userSet = group.user_set ? group.user_set.map(userId => userId.toString().toLowerCase()).join(' ') : '';
                const userEmails = group.user_details.map(user => user.email.toLowerCase()).join(' ');
                const userMobileNumbers = group.user_details.map(user => user.mobile_no.toLowerCase()).join(' ');

                return (
                    name.includes(lowercasedQuery) ||
                    userSet.includes(lowercasedQuery) ||
                    userEmails.includes(lowercasedQuery) ||
                    userMobileNumbers.includes(lowercasedQuery)
                );
            });
            setFilteredGroupData(filteredData);
        }
    }, [groupData, searchQuery]);

    const handleGroupSelect = (group) => {
        if (group) {
            setSelectedGroup({ ...group });
        } else {
            setSelectedGroup({ name: '', user_set: [] });
        }
        setModalVisible(true);
    };

    const handleUserSetChange = (event) => {
        const options = event.target.options;
        const selectedUsers = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedUsers.push(parseInt(options[i].value, 10));
            }
        }
        setSelectedGroup(prevGroup => ({
            ...prevGroup,
            user_set: selectedUsers
        }));
    };

    const handleNewGroupUsersChange = (event) => {
        const options = event.target.options;
        const selectedUsers = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedUsers.push(parseInt(options[i].value, 10));
            }
        }
        setNewGroupUsers(selectedUsers);
    };

    const showSuccessMessage = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleUpdateGroup = async () => {
        try {
            if (selectedGroup.id) {
                await axios.put(`${BaseURL}app/groups/${selectedGroup.id}/`, selectedGroup, { headers: getAuthHeaders() });
                showSuccessMessage('Group updated successfully!');
            } else {
                await axios.post(`${BaseURL}app/groups/`, selectedGroup, { headers: getAuthHeaders() });
                showSuccessMessage('Group created successfully!');
            }
            fetchGroupData();
            setModalVisible(false);
        } catch (error) {
            console.error('Error updating group:', error);
            showSuccessMessage('Error updating group!');
        }
    };

    const handleCreateNewGroup = async () => {
        try {
            const newGroup = {
                name: newGroupName,
                user_set: newGroupUsers,
            };
            await axios.post(BaseURL + "app/groups/", newGroup, { headers: getAuthHeaders() });
            showSuccessMessage('New group created successfully!');
            fetchGroupData();
            setNewGroupModalVisible(false);
            setNewGroupName('');
            setNewGroupUsers([]);
        } catch (error) {
            console.error('Error creating new group:', error);
            showSuccessMessage('Error creating new group!');
        }
    };

    const handleDeleteGroup = async (groupId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this group?");
        
        if (!confirmDelete) return;

        try {
            await axios.delete(`${BaseURL}app/groups/${groupId}/`, { headers: getAuthHeaders() });
            showSuccessMessage('Group deleted successfully!');
            fetchGroupData();
        } catch (error) {
            console.error('Error deleting group:', error);
            showSuccessMessage('Error deleting group!');
        }
    };

    return (
        <div className="page">
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
                                <strong>Group LIST</strong>
                                <CTooltip content="Create new Group">
                                    <CButton type="button" color="success" variant='outline' size='sm' onClick={() => setNewGroupModalVisible(true)}>
                                        Create Group
                                    </CButton>
                                </CTooltip>
                            </div>
                        </CCardHeader>
                        <CCardBody>
                            <CCol md={4}>
                                <CInputGroup className="flex-nowrap mt-3 mb-4">
                                    <CFormInput
                                        placeholder="Search by Group Name or User IDs"
                                        aria-label="Search"
                                        aria-describedby="addon-wrapping"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <CButton type="button" color="secondary" onClick={handleSearch} id="button-addon2">
                                        Search
                                    </CButton>
                                </CInputGroup>
                            </CCol>
                            <CTable striped hover>
                                <CTableHead>
                                    <CTableRow color="dark">
                                        <CTableHeaderCell scope="col">Si.No</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Group</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">User-Email</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Mobile No</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {filteredGroupData.length === 0 ? (
                                        <CTableRow>
                                            <CTableDataCell colSpan="5" className="text-center">No data available</CTableDataCell>
                                        </CTableRow>
                                    ) : (
                                        filteredGroupData.map((group, index) => (
                                            <CTableRow key={group.id}>
                                                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                                <CTableDataCell>{group.name}</CTableDataCell>
                                                <CTableDataCell>{group.user_details.map(user => user.email).join(', ')}</CTableDataCell>
                                                <CTableDataCell>{group.user_details.map(user => user.mobile_no).join(', ')}</CTableDataCell>
                                                <CTableDataCell>
                                                    <CButton color="primary" size='sm' onClick={() => handleGroupSelect(group)}>
                                                        <CIcon icon={cilPen} />
                                                    </CButton>
                                                    <CButton color="primary" size='sm' onClick={() => handleDeleteGroup(group.id)} className="ms-2">
                                                        <CIcon icon={cilTrash} />
                                                    </CButton>
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
            <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
                <CModalHeader>
                    <CModalTitle>{selectedGroup && selectedGroup.id ? 'Edit Group' : 'New Group'}</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CFormLabel htmlFor="groupName">Group Name</CFormLabel>
                        <CFormInput
                            id="groupName"
                            value={selectedGroup ? selectedGroup.name : ''}
                            onChange={(e) => setSelectedGroup(prevGroup => ({ ...prevGroup, name: e.target.value }))}
                        />
                        <CFormLabel htmlFor="userSet" className="mt-3">Select Users</CFormLabel>
                        <CFormSelect
                            id="userSet"
                            multiple
                            value={selectedGroup ? selectedGroup.user_set : []}
                            onChange={handleUserSetChange}
                        >
                            {userData.map(user => (
                                        <option key={user.usermod.id} value={user.usermod.id}>
                                            {user.usermod.username}
                                        </option>
                                    ))}
                                </CFormSelect>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" size='sm' onClick={() => setModalVisible(false)}>Close</CButton>
                    <CButton color="primary" variant='outline' size='sm' onClick={handleUpdateGroup}>
                        {selectedGroup && selectedGroup.id ? 'Update' : 'Create'}
                    </CButton>
                </CModalFooter>
            </CModal>
            <CModal visible={newGroupModalVisible} onClose={() => setNewGroupModalVisible(false)}>
                <CModalHeader>
                    <CModalTitle>Create New Group</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CFormLabel htmlFor="newGroupName">Group Name</CFormLabel>
                        <CFormInput
                            id="newGroupName"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                        />
                        <CFormLabel htmlFor="newGroupUsers" className="mt-3">Select Users</CFormLabel>
                        <CFormSelect
                            id="newGroupUsers"
                            multiple
                            value={newGroupUsers}
                            onChange={handleNewGroupUsersChange}
                        >
                            {userData.map(user => (
                                        <option key={user.usermod.id} value={user.usermod.id}>
                                            {user.usermod.username}
                                        </option>
                                    ))}
                                </CFormSelect>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" size='sm' onClick={() => setNewGroupModalVisible(false)}>Close</CButton>
                    <CButton color="primary" variant='outline' size='sm' onClick={handleCreateNewGroup}>Create</CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default Groups;