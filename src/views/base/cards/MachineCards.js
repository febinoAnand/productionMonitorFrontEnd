import React from 'react'
import {
    // CButton,
    CCard,
    CCardBody,
    // CCardFooter,
    // CCardGroup,
    // CCardHeader,
    CCardImage,
    CCardLink,
    // CCardSubtitle,
    CCardText,
    CCardTitle,
    // CListGroup,
    // CListGroupItem,
    // CNav,
    // CNavItem,
    // CNavLink,
    CCol,
    // CRow,
  } from '@coreui/react'

  import ReactImg from 'src/assets/images/react.jpg'

const MachineCard = () => {
    return (
        <CCol sm={2} lg={3}>
            <CCard style={{ width: '18rem' }} className="mb-4" > 
            <CCardImage orientation="top" src={ReactImg} />
                <CCardBody>
                    <CCardTitle>Card title</CCardTitle>
                        <CCardText>
                            Some quick example text to build on the card title and make up the bulk of the
                            card&#39;s content.
                        </CCardText>
                </CCardBody>
                
                <CCardBody>
                    <CCardLink href="#">Card link</CCardLink>
                    <CCardLink href="#">Another link</CCardLink>
                </CCardBody>
            </CCard>
        </CCol>
    )
}

export default MachineCard