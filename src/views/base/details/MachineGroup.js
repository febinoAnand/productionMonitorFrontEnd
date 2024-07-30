import React, { useState, useEffect, useCallback } from 'react';
import { cilPen, cilTrash } from '@coreui/icons';
import {
    CButton,
    CCard,
    CFormSelect,
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
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CTooltip,
    CAlert
} from '@coreui/react';
import axios from 'axios';
import CIcon from '@coreui/icons-react';
import BaseURL from 'src/assets/contants/BaseURL';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token'); 
    return {
        Authorization: `Token ${token}`,
    };
};

const Groups = () => {
    const [groupData, setGroupData] = useState([]);
    const [filteredGroupData, setFilteredGroupData] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [newGroupModalVisible, setNewGroupModalVisible] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupMachines, setNewGroupMachines] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');

    const fetchGroupData = useCallback(async () => {
        try {
            const response = await axios.get(BaseURL + "devices/machinegroup/", { headers: getAuthHeaders() });
            const sortedData = response.data.reverse();
            setGroupData(sortedData);
            setFilteredGroupData(sortedData);
        } catch (error) {
            console.error('Error fetching group data:', error);
        }
    }, []);

    useEffect(() => {
        fetchGroupData();
    }, [fetchGroupData]);

    const handleSearch = useCallback(() => {
        if (!searchQuery) {
            setFilteredGroupData(groupData);
            return;
        }

        const filteredData = groupData.filter(group => {
            const name = group.group_name?.toLowerCase() || '';
            const machineNames = group.machines
                .map(machine => machine.machine_name.toLowerCase())
                .join(' ');

            return (
                name.includes(searchQuery.toLowerCase()) ||
                machineNames.includes(searchQuery.toLowerCase())
            );
        });
        setFilteredGroupData(filteredData);
    }, [groupData, searchQuery]);

    const handleGroupSelect = (group) => {
        setSelectedGroup(group ? { ...group } : { group_name: '', machines: [] });
        setModalVisible(true);
    };

    const handleMachineListChange = (event) => {
        const options = event.target.options;
        const selectedMachines = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedMachines.push({
                    machine_id: options[i].value,
                    machine_name: options[i].text
                });
            }
        }
        setSelectedGroup(prevGroup => ({
            ...prevGroup,
            machines: selectedMachines
        }));
    };

    const handleNewGroupMachinesChange = (event) => {
        const options = event.target.options;
        const selectedMachines = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedMachines.push({
                    machine_id: options[i].value,
                    machine_name: options[i].text
                });
            }
        }
        setNewGroupMachines(selectedMachines);
    };

    const handleUpdateGroup = async () => {
        try {
            if (selectedGroup.group_id) {
                const updatedGroup = {
                    group_name: selectedGroup.group_name,
                    machines: selectedGroup.machines
                };

                await axios.put(`${BaseURL}devices/machinegroup/${selectedGroup.group_id}/`, updatedGroup, { headers: getAuthHeaders() });
                fetchGroupData();
                setModalVisible(false);
                setSuccessMessage('Group updated successfully!');
            }
        } catch (error) {
            console.error('Error updating group:', error);
        }
    };

    const handleCreateNewGroup = async () => {
        try {
            const newGroup = {
                group_name: newGroupName,
                machines: newGroupMachines
            };

            await axios.post(BaseURL + "devices/machinegroup/", newGroup, { headers: getAuthHeaders() });
            fetchGroupData();
            setNewGroupModalVisible(false);
            setNewGroupName('');
            setNewGroupMachines([]);
            setSuccessMessage('Group created successfully!');
        } catch (error) {
            console.error('Error creating new group:', error);
        }
    };

    const handleDeleteGroup = async (groupId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this group?");
        
        if (!confirmDelete) {
            return;
        }
    
        try {
            await axios.delete(`${BaseURL}devices/machinegroup/${groupId}/`, { headers: getAuthHeaders() });
            fetchGroupData();
            setSuccessMessage('Group deleted successfully!');
        } catch (error) {
            console.error('Error deleting group:', error);
        }
    };

    return (
        <div className="page">
            {successMessage && (
                <CRow>
                    <CCol>
                        <CAlert color="success" onClose={() => setSuccessMessage('')}>
                            {successMessage}
                        </CAlert>
                    </CCol>
                </CRow>
            )}
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader className="d-flex justify-content-between align-items-center">
                            <strong>Group LIST</strong>
                            <CTooltip content="Create new Group">
                                <CButton type="button" color="success" variant='outline' size='sm' onClick={() => setNewGroupModalVisible(true)}>
                                    Create Group
                                </CButton>
                            </CTooltip>
                        </CCardHeader>
                        <CCardBody>
                            <CCol md={4}>
                                <CInputGroup className="flex-nowrap mt-3 mb-4">
                                    <CFormInput
                                        placeholder="Search by Group Name or Machine Names"
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
                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <CTable striped hover>
                                <CTableHead>
                                    <CTableRow color="dark">
                                        <CTableHeaderCell scope="col">Si.No</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Group</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Machines</CTableHeaderCell>
                                        <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                                    </CTableRow>
                                </CTableHead>
                                <CTableBody>
                                    {filteredGroupData.length === 0 ? (
                                        <CTableRow>
                                            <CTableDataCell colSpan="4" className="text-center">No data available</CTableDataCell>
                                        </CTableRow>
                                    ) : (
                                        filteredGroupData.map((group, index) => (
                                            <CTableRow key={group.group_id}>
                                                <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                                <CTableDataCell>{group.group_name}</CTableDataCell>
                                                <CTableDataCell>
                                                    {group.machines.map(machine => machine.machine_name).join(', ')}
                                                </CTableDataCell>
                                                <CTableDataCell>
                                                    <div className="d-flex gap-2">
                                                        <CTooltip content="Edit Group">
                                                            <CButton color="primary" size='sm' onClick={() => handleGroupSelect(group)}>
                                                                <CIcon icon={cilPen} />
                                                            </CButton>
                                                        </CTooltip>
                                                        <CTooltip content="Delete Group">
                                                            <CButton color="primary" size='sm' onClick={() => handleDeleteGroup(group.group_id)}>
                                                                <CIcon icon={cilTrash} />
                                                            </CButton>
                                                        </CTooltip>
                                                    </div>
                                                </CTableDataCell>
                                            </CTableRow>
                                        ))
                                    )}
                                </CTableBody>
                            </CTable>
                            </div>
                        </CCardBody>

                    </CCard>
                </CCol>
            </CRow>
            <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
                <CModalHeader onClose={() => setModalVisible(false)}>
                    <CModalTitle>Edit Group</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CRow>
                            <CCol xs={12}>
                                <CFormLabel htmlFor="groupName">Group Name</CFormLabel>
                                <CFormInput
                                    id="groupName"
                                    value={selectedGroup?.group_name || ''}
                                    onChange={(e) => setSelectedGroup({ ...selectedGroup, group_name: e.target.value })}
                                />
                            </CCol>
                            <CCol xs={12} className="mt-3">
                                <CFormLabel htmlFor="machineList">Machine List</CFormLabel>
                                <CFormSelect
                                    id="machineList"
                                    multiple
                                    value={selectedGroup?.machines.map(machine => machine.machine_id) || []}
                                    onChange={handleMachineListChange}
                                >
                                    {filteredGroupData.flatMap(group => group.machines).map(machine => (
                                        <option key={machine.machine_id} value={machine.machine_id}>{machine.machine_name}</option>
                                    ))}
                                </CFormSelect>
                            </CCol>
                        </CRow>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" size='sm' onClick={() => setModalVisible(false)}>Close</CButton>
                    <CButton color="primary" variant='outline' size='sm' onClick={handleUpdateGroup}>Save changes</CButton>
                </CModalFooter>
            </CModal>
            <CModal visible={newGroupModalVisible} onClose={() => setNewGroupModalVisible(false)}>
                <CModalHeader onClose={() => setNewGroupModalVisible(false)}>
                    <CModalTitle>Create New Group</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CRow>
                            <CCol xs={12}>
                                <CFormLabel htmlFor="newGroupName">Group Name</CFormLabel>
                                <CFormInput
                                    id="newGroupName"
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                />
                            </CCol>
                            <CCol xs={12} className="mt-3">
                                <CFormLabel htmlFor="newMachineList">Machine List</CFormLabel>
                                <CFormSelect
                                    id="newMachineList"
                                    multiple
                                    value={newGroupMachines.map(machine => machine.machine_id)}
                                    onChange={handleNewGroupMachinesChange}
                                >
                                    {filteredGroupData.flatMap(group => group.machines).map(machine => (
                                        <option key={machine.machine_id} value={machine.machine_id}>{machine.machine_name}</option>
                                    ))}
                                </CFormSelect>
                            </CCol>
                        </CRow>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" size='sm' onClick={() => setNewGroupModalVisible(false)}>Close</CButton>
                    <CButton color="primary" variant='outline' size='sm' onClick={handleCreateNewGroup}>Create Group</CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default Groups;
