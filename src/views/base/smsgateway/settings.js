import React, { Component } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CForm,
    CFormInput,
    CFormLabel,
    CRow,
    CFormCheck
} from '@coreui/react';
import BaseURL from 'src/assets/contants/BaseURL';

class Settings extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: '',
            sid: '',
            auth_token: '',
            is_active: false,
            successMessage: ''
        };
    }

    componentDidMount() {
        this.fetchSettings();
    }

    fetchSettings = () => {
        const token = localStorage.getItem('token');
        axios.get(BaseURL + 'smsgateway/setting/', {
            headers: {
                'Authorization': `Token ${token}`
            }
        })
        .then(response => {
            const settings = response.data[0];
            if (settings) {
                const { id, sid, auth_token, is_active } = settings;
                this.setState({ id, sid, auth_token, is_active });
            } else {
                console.error('Empty response data.');
                toast.error('Failed to fetch settings: Empty response data.');
            }
        })
        .catch(error => {
            console.error('Error fetching settings:', error);
            toast.error('Failed to fetch settings.');
        });
    }

    handleSubmit = async (event) => {
        event.preventDefault();

        const { id, sid, auth_token, is_active } = this.state;
        const token = localStorage.getItem('token');

        try {
            const response = await axios.put(`${BaseURL}smsgateway/setting/${id}/`, { sid, auth_token, is_active }, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });
            console.log(response);
            this.setState({ successMessage: 'Settings updated successfully!' });
            setTimeout(() => {
                this.setState({ successMessage: '' });
            }, 5000);
        } catch (error) {
            console.error('Error updating settings:', error);
            toast.error('Failed to update settings.');
        }
    }

    render() {
        const { sid, auth_token, is_active, successMessage } = this.state;

        return (
            <CRow>
                {successMessage && ( 
                    <div className="alert alert-success" role="alert">
                        {successMessage}
                    </div>
                )}
                <CCol xs={12}>
                    <CCard className="mb-4">
                        <CCardHeader>
                            <strong>Settings</strong>
                        </CCardHeader>
                        <CCardBody>
                            <CForm onSubmit={this.handleSubmit}>
                                <CRow className="mb-3">
                                    <CFormLabel htmlFor="sid" className="col-sm-2 col-form-label">SID</CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput type="text" id="sid" name="sid" value={sid} onChange={(e) => this.setState({ sid: e.target.value })} />
                                        <div className="form-text" style={{ fontSize: 12 }}>* Note : SID is required</div>
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CFormLabel htmlFor="authToken" className="col-sm-2 col-form-label">Auth-Token</CFormLabel>
                                    <CCol sm={10}>
                                        <CFormInput type="text" id="authToken" name="authToken" value={auth_token} onChange={(e) => this.setState({ auth_token: e.target.value })} />
                                        <div className="form-text" style={{ fontSize: 12 }}>* Note : Auth Token is required</div>
                                    </CCol>
                                </CRow>
                                <CRow className="mb-3">
                                    <CCol sm="10" className="offset-sm-2">
                                        <CFormCheck
                                            id="isActive"
                                            name="isActive"
                                            label="Is Active"
                                            checked={is_active}
                                            onChange={(e) => this.setState({ is_active: e.target.checked })}
                                        />
                                    </CCol>
                                </CRow>
                                <CRow className="justify-content-center">
                                    <CCol md="auto">
                                        <CButton color="primary" type="submit">Update</CButton>
                                    </CCol>
                                </CRow>
                            </CForm>
                        </CCardBody>
                    </CCard>
                </CCol>
            </CRow>
        );
    }
}

export default Settings;