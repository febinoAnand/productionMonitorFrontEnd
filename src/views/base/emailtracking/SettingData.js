import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { cilTrash } from '@coreui/icons';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormCheck,
    CFormInput,
    CFormLabel,
    CRow,
    CFormSwitch,
    CInputGroup,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTooltip,
    CTableDataCell,
    CTableBody,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
    CNav,
    CNavItem
} from '@coreui/react';
import BaseURL from 'src/assets/contants/BaseURL';
import CIcon from '@coreui/icons-react';

const token = localStorage.getItem('token');
const axiosInstance = axios.create({
    baseURL: BaseURL,
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Token ${token}`
    }
});

class SettingData extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            host: '',
            port: '',
            username: '',
            password: '',
            checkinterval: '',
            checkstatus: false,
            errors: {},
            successMessage: '',
            emailList: [],
            filteredEmailList: [],
            inputValue: '',
            modalVisible: false,
            newEmail: ''
        };
    }

    componentDidMount() {
        this.fetchSettings();
        this.fetchEmailData();
    }

    fetchEmailData() {
        axiosInstance.get('emailtracking/email_ids/')
            .then(response => {
                const emailList = response.data.reverse();
                this.setState({ emailList, filteredEmailList: emailList });
            })
            .catch(error => {
                console.error('Error fetching email data:', error);
                toast.error('Failed to fetch email data');
            });
    }

    handleAdd = () => {
        const { newEmail } = this.state;
        if (newEmail.trim() !== '') {
            const emailData = {
                email: newEmail,
                active: true
            };
            axiosInstance.post('emailtracking/email_ids/', emailData)
                .then(response => {
                    console.log('Email added successfully:', response.data);
                    this.setState({ 
                        successMessage: 'Email added successfully',
                        newEmail: '',
                        modalVisible: false 
                    });
                    this.fetchEmailData();
                })
                .catch(error => {
                    console.error('Error adding email:', error);
                    toast.error('Failed to add email');
                });
        } else {
            console.warn('Input value is empty. No email added.');
            toast.warning('Input value is empty. No email added.');
        }
    };
    
    handleToggleEmail = (email) => {
        const updatedEmail = {
            ...email,
            active: !email.active
        };
    
        axiosInstance.put(`emailtracking/email_ids/${email.id}/`, updatedEmail)
            .then(response => {
                console.log('Email updated successfully:', response.data);
                this.setState({ successMessage: 'Email updated successfully' });
                this.fetchEmailData();
            })
            .catch(error => {
                console.error('Error updating email:', error);
                toast.error('Failed to update email');
            });
    };
    
    handleDeleteEmail = (emailId) => {
        axiosInstance.delete(`emailtracking/email_ids/${emailId}/`)
            .then(response => {
                console.log('Email deleted successfully:', response.data);
                this.setState({ successMessage: 'Email deleted successfully' });
                this.fetchEmailData();
            })
            .catch(error => {
                console.error('Error deleting email:', error);
                toast.error('Failed to delete email');
            });
    };  

    fetchSettings() {
        axiosInstance.get('emailtracking/settings/')
            .then(response => {
                const data = response.data[0];
                if (data) {
                    const { id, host, port, username, password, checkinterval, checkstatus } = data;
                    const validCheckInterval = typeof checkinterval !== 'undefined' ? String(checkinterval) : '';

                    this.setState({ 
                        id,
                        host, 
                        port, 
                        username, 
                        password, 
                        checkinterval: validCheckInterval, 
                        checkstatus,
                    });
                }
            })
            .catch(error => {
                console.error('Error fetching settings:', error);
                toast.error('Failed to fetch settings');
            });
    }

    handleChange = (e) => {
        const { name, value } = e.target;
        this.setState({
            [name]: value
        });
    };

    handleRadioChange = (e) => {
        const { name, value } = e.target;
        const newValue = value === 'true';
        this.setState({
            [name]: newValue
        });
    };

    handleSearch = () => {
        const searchQuery = document.getElementById('searchInput').value;
        const { emailList } = this.state;
        const filteredEmailList = emailList.filter(emailObj =>
            emailObj.email.toLowerCase().includes(searchQuery.toLowerCase())
        );
        this.setState({ filteredEmailList });
    };

    handleSubmit = (e) => {
        e.preventDefault();
        const errors = this.validate();
        if (Object.keys(errors).length === 0) {
            console.log('Submitted data:', this.state);

            const { id, host, port, username, password, checkinterval, checkstatus } = this.state;
            const data = {
                id,
                host,
                port: parseInt(port),
                username,
                password,
                checkinterval: checkinterval !== '' ? parseInt(checkinterval) : null,
                checkstatus,
            };

            axiosInstance.put(`emailtracking/settings/${id}/`, data)
                .then(() => {
                    this.setState({ successMessage: 'Settings updated successfully', errors: {} });
                })
                .catch(error => {
                    console.error('Error updating settings:', error);
                    toast.error('Failed to update settings');
                });
        } else {
            this.setState({ errors });
            console.log('Validation errors:', errors);
        }
    };

    validate = () => {
        const { host, port, username, password, checkinterval } = this.state;
        const errors = {};

        if (!host || !host.trim()) {
            errors.host = 'Host is required';
        } else if (host.length > 200) {
            errors.host = 'Host must be less than 200 characters';
        }
        if (!port || !String(port).trim()) {
            errors.port = 'Port is required';
        } else {
            const portNum = parseInt(port);
            if (isNaN(portNum) || portNum < 0 || portNum > 65535) {
                errors.port = 'Port must be a number between 0 to 65535';
            }
        }
        if (!username || !username.trim()) {
            errors.username = 'Username is required';
        } else if (username.length > 50) {
            errors.username = 'Username must be less than 50 characters';
        }
        if (!password || !password.trim()) {
            errors.password = 'Password is required';
        } else if (password.length > 50) {
            errors.password = 'Password must be less than 50 characters';
        }
        if (checkinterval !== '' && (isNaN(checkinterval) || checkinterval < 0 || checkinterval > 3600)) {
            errors.checkinterval = 'Check Interval must be a number between 0 to 3600';
        }

        return errors;
    };

    render() {
        const { host, port, username, password, checkinterval, checkstatus, errors, successMessage, filteredEmailList, modalVisible, newEmail } = this.state;

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
                            <CCardHeader  className="d-flex justify-content-between align-items-center">
                                <strong>SMTP Settings</strong>
                            </CCardHeader>
                            <CCardBody>
                                <CForm>
                                    <CRow className="mb-3">
                                        <CFormLabel htmlFor="host" className="col-sm-2 col-form-label">Host</CFormLabel>
                                        <CCol sm={10}>
                                            <CFormInput type="text" id="host" name="host" value={host} onChange={this.handleChange} />
                                            {errors.host && <div className="text-danger">{errors.host}</div>}
                                        </CCol>
                                    </CRow>
                                    <CRow className="mb-3">
                                        <CFormLabel htmlFor="port" className="col-sm-2 col-form-label">Port</CFormLabel>
                                        <CCol sm={10}>
                                            <CFormInput type="text" id="port" name="port" value={port} onChange={this.handleChange} />
                                            {errors.port && <div className="text-danger">{errors.port}</div>}
                                        </CCol>
                                    </CRow>
                                    <CRow className="mb-3">
                                        <CFormLabel htmlFor="username" className="col-sm-2 col-form-label">Username</CFormLabel>
                                        <CCol sm={10}>
                                            <CFormInput type="text" id="username" name="username" value={username} onChange={this.handleChange} />
                                            {errors.username && <div className="text-danger">{errors.username}</div>}
                                        </CCol>
                                    </CRow>
                                    <CRow className="mb-3">
                                        <CFormLabel htmlFor="password" className="col-sm-2 col-form-label">Password</CFormLabel>
                                        <CCol sm={10}>
                                            <CFormInput type="password" id="password" name="password" value={password} onChange={this.handleChange} />
                                            {errors.password && <div className="text-danger">{errors.password}</div>}
                                        </CCol>
                                    </CRow>
                                    <fieldset className="row mb-3">
                                        <legend className="col-form-label col-sm-2 pt-0">Check Status</legend>
                                        <CCol sm={10}>
                                            <CFormCheck
                                                type="radio"
                                                name="checkstatus"
                                                id="gridRadios1"
                                                value="true"
                                                label="Enable"
                                                checked={checkstatus === true}
                                                onChange={this.handleRadioChange}
                                            />
                                            <CFormCheck
                                                type="radio"
                                                name="checkstatus"
                                                id="gridRadios2"
                                                value="false"
                                                label="Disable"
                                                checked={checkstatus === false}
                                                onChange={this.handleRadioChange}
                                            />
                                        </CCol>
                                    </fieldset>
                                    <CRow className="mb-3">
                                        <CFormLabel htmlFor="checkInterval" className="col-sm-2 col-form-label">Check Interval</CFormLabel>
                                        <CCol sm={10}>
                                            <CFormInput type="text" id="checkInterval" name="checkinterval" value={checkinterval} onChange={this.handleChange} />
                                            {errors.checkinterval && (<div className="text-danger">{errors.checkinterval}</div>)}
                                        </CCol>
                                    </CRow>
                                    <br />
                                    <CRow className="justify-content-center">
                                        <CCol md="auto">
                                            <CButton color="primary" type="submit" onClick={this.handleSubmit}>Update</CButton>
                                        </CCol>
                                    </CRow>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
                <CRow>
                    <CCol xs={12}>
                        <CCard className="mb-4">
                            <CCardHeader className="d-flex justify-content-between align-items-center">
                                <strong>From E-Mail</strong>
                                <CNav>
                                    <CNavItem className="mx-2 position-relative">
                                    <CButton color="primary" size='sm' onClick={() => this.setState({ modalVisible: true })}>Add Email</CButton>
                                    </CNavItem>
                                </CNav>
                            </CCardHeader>
                            <CCardBody>
                                <CCol md={4}>
                                <CInputGroup className="mb-3">
                                    <CFormInput
                                        type="text"
                                        id="searchInput"
                                        placeholder="Search email"
                                    />
                                    <CButton type="button" color='secondary' onClick={this.handleSearch}>
                                        Search
                                    </CButton>
                                </CInputGroup>
                                </CCol>
                                <CTable striped hover>
                                    <CTableHead color='dark'>
                                        <CTableRow>
                                            <CTableHeaderCell scope="col">Sl.No</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Email</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Active State</CTableHeaderCell>
                                            <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                                        </CTableRow>
                                    </CTableHead>
                                    <CTableBody>
                                        {filteredEmailList .length === 0 ? (
                                            <CTableRow>
                                                <CTableDataCell colSpan="4" className="text-center">No emails available</CTableDataCell>
                                            </CTableRow>
                                        ) : (
                                            filteredEmailList .map((emailObj, index) => (
                                                <CTableRow key={emailObj.id}>
                                                    <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                                                    <CTableDataCell>{emailObj.email}</CTableDataCell>
                                                    <CTableDataCell>
                                                    <CTooltip content="Change User to Active or Inactive">
                                                        <CFormSwitch
                                                            checked={emailObj.active}
                                                            onChange={() => this.handleToggleEmail(emailObj)}
                                                        />
                                                    </CTooltip>
                                                    </CTableDataCell>
                                                    <CTableDataCell>
                                                        <CTooltip content="Delete">
                                                            <CButton 
                                                                style={{ fontSize: '10px', padding: '6px 10px' }}
                                                                onClick={() => this.handleDeleteEmail(emailObj.id)}
                                                            >
                                                                <CIcon icon={cilTrash} />
                                                            </CButton>
                                                        </CTooltip>
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

                <CModal visible={modalVisible} onClose={() => this.setState({ modalVisible: false })}>
                    <CModalHeader onClose={() => this.setState({ modalVisible: false })}>
                        <CModalTitle>Add Email</CModalTitle>
                    </CModalHeader>
                    <CModalBody>
                        <CFormInput
                            type="email"
                            id="newEmail"
                            name="newEmail"
                            placeholder="Enter new email"
                            value={newEmail}
                            onChange={(e) => this.setState({ newEmail: e.target.value })}
                        />
                    </CModalBody>
                    <CModalFooter>
                        <CButton color="secondary" onClick={() => this.setState({ modalVisible: false })}>Cancel</CButton>
                        <CButton color="primary" onClick={this.handleAdd}>Add</CButton>
                    </CModalFooter>
                </CModal>
            </>
        );
    }
}

export default SettingData;