import React from 'react';
import axios from 'axios';

import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CCol,
    CFormLabel,
    CFormInput,
    CRow,
} from '@coreui/react';
import BaseURL from 'src/assets/contants/BaseURL';

class Setting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            imageUrl: '',
        };
    }

    handleInputChange = (event) => {
        this.setState({ name: event.target.value });
    };

    handleBrowseClick = () => {
        axios.get(BaseURL + "settings/", {
            params: { name: this.state.name }
        })
        .then(response => {
            const images = response.data;
            const image = images.find(img => img.logo_path.includes(this.state.name));
            if (image) {
                this.setState({ imageUrl: image.logo_url });
            } else {
                console.error('Image not found in response');
            }
        })
        .catch(error => {
            console.error('Error fetching the image:', error);
        });
    };

    render() {
        return (
            <>
                <CRow>
                    <CCol xs={12}>
                        <CCard className="mb-4">
                            <CCardHeader>
                                <strong>SETTING</strong>
                            </CCardHeader>
                            <CCardBody>
                                <CRow className="mb-3">
                                    <CFormLabel htmlFor="name" className="col-sm-2 col-form-label">Image</CFormLabel>
                                    <CCol md={6}>
                                        <CFormInput type="text" id="name" name="name" value={this.state.name} onChange={this.handleInputChange}/>
                                    </CCol>
                                    <CCol xs={1}>
                                        <div className='d-grid gap-2'>
                                            <CButton color="primary" type="button" onClick={this.handleBrowseClick} >
                                                Browse
                                            </CButton>
                                        </div>
                                    </CCol>
                                </CRow>
                                {this.state.imageUrl && (
                                    <CRow>
                                        <CCol xs={12}>
                                            <img src={this.state.imageUrl} alt="Selected" style={{ maxWidth: '100%' }} />
                                        </CCol>
                                    </CRow>
                                )}
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </>
        );
    }
}

export default Setting;