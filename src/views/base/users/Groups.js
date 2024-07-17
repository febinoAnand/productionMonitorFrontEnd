import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        fetchGroupData();
        fetchUserData();
    }, []);

    useEffect(() => {
        handleSearch(searchQuery);
    }, [groupData, searchQuery]);

    const fetchGroupData = async () => {
        try {
            const response = await axios.get(BaseURL + "app/groups/")
            const sortedData = response.data.reverse();
            setGroupData(sortedData);
            setFilteredGroupData(sortedData);
        } catch (error) {
            console.error('Error fetching group data:', error);
        }
    };

    const fetchUserData = async () => {
        try {
            const response = await axios.get(BaseURL + "Userauth/userdetail/");
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

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

    const handleSearch = (query) => {
        setSearchQuery(query);
        if (!groupData) return;
    
        if (query === '') {
            setFilteredGroupData(groupData);
        } else {
            const lowercasedQuery = query.toLowerCase();
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
    };    

    const handleUpdateGroup = async () => {
        try {
            if (selectedGroup.id) {
                await axios.put(`${BaseURL}app/groups/${selectedGroup.id}/`, selectedGroup);
            } else {
                await axios.post(`${BaseURL}app/groups/`, selectedGroup);
            }
            fetchGroupData();
            setModalVisible(false);
        } catch (error) {
            console.error('Error updating group:', error);
        }
    };

    const handleCreateNewGroup = async () => {
        try {
            const newGroup = {
                name: newGroupName,
                user_set: newGroupUsers,
            };
            await axios.post(BaseURL + "app/groups/", newGroup);
            fetchGroupData();
            setNewGroupModalVisible(false);
            setNewGroupName('');
            setNewGroupUsers([]);
        } catch (error) {
            console.error('Error creating new group:', error);
        }
    };

    const handleDeleteGroup = async (groupId) => {
        try {
            await axios.delete(`${BaseURL}app/groups/${groupId}/`);
            fetchGroupData();
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };    

    return (
        <>
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong>Group LIST</strong>
                        </CCardHeader>
                        <CCardBody>
                            <CCol md={4}>
                                <CInputGroup className="flex-nowrap mt-3 mb-4">
                                    <CFormInput
                                        placeholder="Search by Group Name or User IDs"
                                        aria-label="Search"
                                        aria-describedby="addon-wrapping"
                                        value={searchQuery}
                                        onChange={(e) => handleSearch(e.target.value)}
                                    />
                                    <CButton type="button" color="secondary" onClick={(e) => handleSearch(e.target.value)} id="button-addon2">
                                        Search
                                    </CButton>
                                </CInputGroup>
                            </CCol>
                            <CTooltip content="Create new Group">
                                <CButton type="button" color="primary" className="mb-3" onClick={() => setNewGroupModalVisible(true)}>
                                    Create
                                </CButton>
                            </CTooltip>
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
                                    {filteredGroupData.map((group, index) => (
                                        <CTableRow
                                            key={group.id}
                                        >
                                            <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                            <CTableDataCell>{group.name}</CTableDataCell>
                                            <CTableDataCell>{group.user_details.map(user => user.email).join(', ')}</CTableDataCell>
                                            <CTableDataCell>{group.user_details.map(user => user.mobile_no).join(', ')}</CTableDataCell>
                                            <CTableDataCell>
                                                <div className="d-flex gap-2">
                                                    <CButton onClick={() => handleGroupSelect(group)}>
                                                        <CIcon icon={cilPen} />
                                                    </CButton>
                                                    <CButton onClick={(e) => { e.stopPropagation(); handleDeleteGroup(group.id); }}>
                                                        <CIcon icon={cilTrash} />
                                                    </CButton>
                                                </div>
                                            </CTableDataCell>
                                        </CTableRow>
                                    ))}
                                </CTableBody>
                            </CTable>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
            <CModal size='lg' visible={modalVisible} onClose={() => setModalVisible(false)} backdrop="static" keyboard={false}>
                <CModalHeader onClose={() => setModalVisible(false)}>
                    <CModalTitle>Groups Details</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="group" className="col-sm-2 col-form-label">Group</CFormLabel>
                            <CCol md={6}>
                                <CFormInput type="text" id="group" name="group" value={selectedGroup ? selectedGroup.name : ''} readOnly />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="userList" className="col-sm-2 col-form-label">User List</CFormLabel>
                            <CCol md={6}>
                                <CFormSelect id="userList" name="userList" multiple value={selectedGroup ? selectedGroup.user_set : []} onChange={handleUserSetChange}>
                                    {userData.map(user => (
                                        <option key={user.usermod.id} value={user.usermod.id}>
                                            {user.usermod.username}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="justify-content-center">
                            <CCol md="auto">
                                <CButton color="primary" onClick={handleUpdateGroup}>Update</CButton>
                            </CCol>
                        </CRow>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setModalVisible(false)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
            <CModal size='lg' visible={newGroupModalVisible} onClose={() => setNewGroupModalVisible(false)} backdrop="static" keyboard={false}>
                <CModalHeader onClose={() => setNewGroupModalVisible(false)}>
                    <CModalTitle>Create New Group</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="newGroupName" className="col-sm-2 col-form-label">Group Name</CFormLabel>
                            <CCol md={6}>
                                <CFormInput type="text" id="newGroupName" name="newGroupName" value={newGroupName} onChange={(e) => setNewGroupName(e.target.value)} />
                            </CCol>
                        </CRow>
                        <CRow className="mb-3">
                            <CFormLabel htmlFor="newUserList" className="col-sm-2 col-form-label">User List</CFormLabel>
                            <CCol md={6}>
                                <CFormSelect id="newUserList" name="newUserList" multiple value={newGroupUsers} onChange={handleNewGroupUsersChange}>
                                    {userData.map(user => (
                                        <option key={user.usermod.id} value={user.usermod.id}>
                                            {user.usermod.username}
                                        </option>
                                    ))}
                                </CFormSelect>
                            </CCol>
                        </CRow>
                        <CRow className="justify-content-center">
                            <CCol md="auto">
                                <CButton color="primary" onClick={handleCreateNewGroup}>Create</CButton>
                            </CCol>
                        </CRow>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" onClick={() => setNewGroupModalVisible(false)}>
                        Close
                    </CButton>
                </CModalFooter>
            </CModal>
        </>
    );
};

export default Groups;