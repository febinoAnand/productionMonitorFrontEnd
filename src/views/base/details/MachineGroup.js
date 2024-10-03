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
    CInputGroup,
    CFormLabel,
    CFormText,
    CRow,
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
    CAlert,
    CForm,
} from '@coreui/react';
import axios from 'axios';
import CIcon from '@coreui/icons-react';
import BaseURL from 'src/assets/contants/BaseURL';
import LoadingSpinner from '../../HLMando/Loadingspinner';


const handleAuthError = (error) => {
    if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login'; 
    } else {
        console.error("An error occurred:", error);
    }
};

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        Authorization: `Token ${token}`,
    };
};

const Groups = () => {
    const [groupData, setGroupData] = useState([]);
    const [filteredGroupData, setFilteredGroupData] = useState([]);
    const [machineData, setMachineData] = useState([]);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [newGroupModalVisible, setNewGroupModalVisible] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupMachines, setNewGroupMachines] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [deleteMessage, setDeleteMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(true);
    const MESSAGE_DISPLAY_DURATION = 3000;

    const fetchGroupData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(BaseURL + "devices/machinegroup/", { headers: getAuthHeaders() });
            const sortedData = response.data.reverse();
            setGroupData(sortedData);
            setFilteredGroupData(sortedData);
        } catch (error) {
            handleAuthError(error); 
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchMachineData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axios.get(BaseURL + "devices/machine/", { headers: getAuthHeaders() });
            setMachineData(response.data);
        } catch (error) {
            handleAuthError(error); 
        } finally {
            setLoading(false);
        }
    }, []);
    
    useEffect(() => {
        fetchGroupData();
        fetchMachineData();
    }, [fetchGroupData, fetchMachineData]);

    const applyHeaderStyles = () => {
        const headerCells = document.querySelectorAll('.custom-table-header th');
        headerCells.forEach((cell) => {
            cell.style.backgroundColor = '#047BC4';
            cell.style.color = 'white';
        });
    };

    useEffect(() => {
        applyHeaderStyles();
    }, []);

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
        setSelectedGroup({
            group_id: group.group_id,
            group_name: group.group_name,
            machines: group.machines.map(machine => ({
                id: machine.id,
                machine_id: machine.machine_id,
                machine_name: machine.machine_name
            }))
        });
        setModalVisible(true);
    };

    const handleMachineListChange = (event) => {
        const options = event.target.options;
        const selectedMachines = [];
        for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
                selectedMachines.push({
                    id: parseInt(options[i].value, 10),
                    machine_name: options[i].text
                });
            }
        }
        setSelectedGroup(prevGroup => ({
            ...prevGroup,
            machines: selectedMachines
        }));
    };

    const validateGroupName = (name) => {
        return name && name.trim() !== '';
    };

    const validateMachines = (machines) => {
        return machines && machines.length > 0;
    };

    const handleUpdateGroup = async () => {
        if (!validateGroupName(selectedGroup.group_name)) {
            setErrors((prevErrors) => ({ ...prevErrors, group_name: 'Group name is required' }));
            return;
        }

        if (!validateMachines(selectedGroup.machines)) {
            setErrors((prevErrors) => ({ ...prevErrors, machines: 'At least one machine must be selected' }));
            return;
        }

        setLoading(true);
        try {
            const machineIds = selectedGroup.machines.map(machine => machine.id);

            const updatedGroup = {
                group_name: selectedGroup.group_name,
                machine_list: machineIds
            };

            await axios.put(`${BaseURL}devices/machinegroup/${selectedGroup.group_id}/`, updatedGroup, { headers: getAuthHeaders() });
            
            fetchGroupData();
            setModalVisible(false);
            setSuccessMessage('Group updated successfully!');
        } catch (error) {
            handleAuthError(error); 
            setErrors(error.response?.data || {});
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNewGroup = async () => {
        if (!validateGroupName(newGroupName)) {
            setErrors((prevErrors) => ({ ...prevErrors, group_name: 'Group name is required' }));
            return;
        }

        if (!validateMachines(newGroupMachines)) {
            setErrors((prevErrors) => ({ ...prevErrors, machines: 'At least one machine must be selected' }));
            return;
        }

        setLoading(true);
        try {
            const machineIds = newGroupMachines.map(machine => machine.id);

            const newGroup = {
                group_name: newGroupName,
                machine_list: machineIds
            };

            await axios.post(BaseURL + "devices/machinegroup/", newGroup, { headers: getAuthHeaders() });
            fetchGroupData();
            setNewGroupModalVisible(false);
            setNewGroupName('');
            setNewGroupMachines([]);
            setSuccessMessage('Group created successfully!');
            handleCloseNewGroupModal(); 
        } catch (error) {
            handleAuthError(error); 
            setErrors(error.response?.data || {});
        } finally {
            setLoading(false);
        }
    };

    const handleCloseNewGroupModal = () => {
        setNewGroupName('');
        setNewGroupMachines([]);
        setErrors({});
        setNewGroupModalVisible(false);
    };

    const handleDeleteGroup = async (groupId) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this group?");
        
        if (!confirmDelete) {
            return;
        }

        setLoading(true);
        try {
            await axios.delete(`${BaseURL}devices/machinegroup/${groupId}/`, { headers: getAuthHeaders() });
            fetchGroupData();
            setDeleteMessage('Group deleted successfully!');
        } catch (error) {
            handleAuthError(error); 
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (successMessage || deleteMessage) {
            const timer = setTimeout(() => {
                setSuccessMessage('');
                setDeleteMessage('');
            }, MESSAGE_DISPLAY_DURATION);

            return () => clearTimeout(timer);
        }
    }, [successMessage, deleteMessage]);

    const username = localStorage.getItem('username');
    const password = localStorage.getItem('password');

    const isAdmin = username === 'admin' && password === 'admin';

    if (loading) {
        return <LoadingSpinner />;
      }
    return (
        <div className="page">
            {(successMessage || deleteMessage) && (
                <CRow>
                    <CCol>
                        {successMessage && (
                            <CAlert color="success" onClose={() => setSuccessMessage('')}>
                                {successMessage}
                            </CAlert>
                        )}
                        {deleteMessage && (
                            <CAlert color="success" onClose={() => setDeleteMessage('')}>
                                {deleteMessage}
                            </CAlert>
                        )}
                    </CCol>
                </CRow>
            )}
            <CRow>
                <CCol xs={12}>
                    <CCard className="mb-4"style={{
        marginTop: '30px',
      }}>
                        <CCardHeader className="d-flex justify-content-between align-items-center">
                            <strong>Group LIST</strong>
                            {isAdmin && (
                            <CTooltip content="Create new Group">
                                <CButton type="button" color="success" variant='outline' size='sm' onClick={() => setNewGroupModalVisible(true)}>
                                    Create Group
                                </CButton>
                            </CTooltip>
)}
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
                                    <CButton type="button" color="secondary" style={{ backgroundColor: '#047BC4', borderColor: '#047BC4', color: '#fff' }} onClick={handleSearch} id="button-addon2">
                                        Search
                                    </CButton>
                                </CInputGroup>
                            </CCol>
                            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                                <CTable striped hover>
                                <CTableHead className="custom-table-header initial-data">
                                        <CTableRow>
                                            <CTableHeaderCell scope="col">Si.No</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Group</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Machines</CTableHeaderCell>
                                            {isAdmin && <CTableHeaderCell>Action</CTableHeaderCell>}
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
                                                    {isAdmin && (
                                                    <CTableDataCell>
                                                        <CTooltip content="Edit Group">
                                                            <CButton
                                                                color="primary"
                                                                size="sm"
                                                                onClick={() => handleGroupSelect(group)}
                                                                className="me-2"
                                                            >
                                                                <CIcon icon={cilPen} />
                                                            </CButton>
                                                        </CTooltip>
                                                        <CTooltip content="Delete Group">
                                                            <CButton
                                                                color="primary"
                                                                size="sm"
                                                                onClick={() => handleDeleteGroup(group.group_id)}
                                                            >
                                                                <CIcon icon={cilTrash} />
                                                            </CButton>
                                                        </CTooltip>
                                                    </CTableDataCell>
                                                    )}
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
            <CModal visible={modalVisible} onClose={() => setModalVisible(false)} backdrop="static">
                <CModalHeader onClose={() => setModalVisible(false)}>
                    <CModalTitle>Edit Group</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    {selectedGroup && (
                        <CForm>
                            <CRow>
                                <CCol xs={12}>
                                <CFormLabel htmlFor="groupName">Group Name<span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormInput
                                        id="groupName"
                                        value={selectedGroup.group_name}
                                        onChange={(e) => setSelectedGroup({ ...selectedGroup, group_name: e.target.value })}
                                    />
                                     {errors.group_name && (
                                    <CFormText color="danger"style={{ color: 'red' }}>{errors.group_name}</CFormText>
                                )}
                                </CCol>
                                <CCol xs={12} className="mt-3">
                                    <CFormLabel htmlFor="machineList">Machines<span style={{ color: 'red' }}>*</span></CFormLabel>
                                    <CFormSelect
                                        id="machineList"
                                        multiple
                                        value={selectedGroup.machines.map(machine => machine.id.toString())}
                                        onChange={handleMachineListChange}
                                    >
                                        {machineData.map(machine => (
                                            <option key={machine.id} value={machine.id}>
                                                {machine.machine_name}
                                            </option>
                                        ))}
                                    </CFormSelect>
                                    {errors.machines && (
                                    <CFormText color="danger"style={{ color: 'red' }}>{errors.machines}</CFormText>
                                )}
                                </CCol>
                            </CRow>
                        </CForm>
                    )}
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" size='sm'variant='outline'onClick={() => setModalVisible(false)}>
                        Close
                    </CButton>
                    <CButton color="primary"size='sm' variant='outline' onClick={handleUpdateGroup}>
                        Save changes
                    </CButton>
                </CModalFooter>
            </CModal>

            <CModal visible={newGroupModalVisible} onClose={() => setNewGroupModalVisible(false)} backdrop="static">
                <CModalHeader onClose={() => setNewGroupModalVisible(false)}>
                    <CModalTitle>Create New Group</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <CForm>
                        <CRow>
                            <CCol xs={12}>
                                
                            <CFormLabel htmlFor="newGroupName">Group Name<span style={{ color: 'red' }}>*</span></CFormLabel>
                                <CFormInput
                                    id="newGroupName"
                                    value={newGroupName}
                                    onChange={(e) => setNewGroupName(e.target.value)}
                                />
                               {errors.group_name && (
                                    <CFormText color="danger"style={{ color: 'red' }}>{errors.group_name}</CFormText>
                                )}
                            </CCol>
                            <CCol xs={12} className="mt-3">
                            <CFormLabel htmlFor="newMachineList">Machines<span style={{ color: 'red' }}>*</span></CFormLabel>
                                <CFormSelect
                                    id="newMachineList"
                                    multiple
                                    value={newGroupMachines.map(machine => machine.id.toString())}
                                    onChange={(event) => {
                                        const options = event.target.options;
                                        const selectedMachines = [];
                                        for (let i = 0; i < options.length; i++) {
                                            if (options[i].selected) {
                                                selectedMachines.push({
                                                    id: parseInt(options[i].value, 10),
                                                    machine_name: options[i].text
                                                });
                                            }
                                        }
                                        setNewGroupMachines(selectedMachines);
                                    }}
                                >
                                    {machineData.map(machine => (
                                        <option key={machine.id} value={machine.id}>
                                            {machine.machine_name}
                                        </option>
                                    ))}
                                </CFormSelect>
                                {errors.machines && (
                                    <CFormText color="danger"style={{ color: 'red' }}>{errors.machines}</CFormText>
                                )}
                            </CCol>
                        </CRow>
                    </CForm>
                </CModalBody>
                <CModalFooter>
                    <CButton color="secondary" size='sm'variant='outline' onClick={() => setNewGroupModalVisible(false)}>
                        Close
                    </CButton>
                    <CButton color="primary"  size='sm'variant='outline'onClick={handleCreateNewGroup}>
                        Save Group
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default Groups;