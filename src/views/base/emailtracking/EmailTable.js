import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { cilTrash } from '@coreui/icons';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CNav,
  CNavItem,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CTooltip,
  CFormCheck
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import BaseURL from 'src/assets/contants/BaseURL';

const EmailTable = () => {
  const [emails, setEmails] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredEmails, setFilteredEmails] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchEmails();
    const interval = setInterval(fetchEmails, 3000);
    return () => clearInterval(interval);
  }, []);

  const fetchEmails = async () => {
    try {
      const response = await axios.get(BaseURL + "emailtracking/inbox/", {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      });
      const reversedEmails = response.data.reverse();
      setEmails(reversedEmails);
      setFilteredEmails(reversedEmails);
    } catch (error) {
      console.error('Error fetching emails:', error);
    }
  };

  const handleSearch = () => {
    const filtered = emails.filter((email) =>
      email.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      email.time.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEmails(filtered);
  };

  const handleRowClick = (email) => {
    setSelectedEmail(email);
    setModalVisible(true);
  };

  const deleteEmail = async (emailId) => {
    try {
      await axios.delete(`${BaseURL}emailtracking/inbox/${emailId}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      });
      setEmails(emails.filter(email => email.id !== emailId));
      setFilteredEmails(filteredEmails.filter(email => email.id !== emailId));
      setSelectedEmails(selectedEmails.filter(id => id !== emailId));
      setSuccessMessage('Email deleted successfully.');
    } catch (error) {
      console.error('Error deleting email:', error);
    }
  };
  
  const deleteSelectedEmails = async () => {
    try {
      await Promise.all(selectedEmails.map(emailId => axios.delete(`${BaseURL}emailtracking/inbox/${emailId}/`, {
        headers: {
          Authorization: `Token ${localStorage.getItem('token')}`
        }
      })));
      setEmails(emails.filter(email => !selectedEmails.includes(email.id)));
      setFilteredEmails(filteredEmails.filter(email => !selectedEmails.includes(email.id)));
      setSelectedEmails([]);
      setSuccessMessage('Selected emails deleted successfully.');
    } catch (error) {
      console.error('Error deleting emails:', error);
    }
  };

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedEmails(filteredEmails.map(email => email.id));
    } else {
      setSelectedEmails([]);
    }
  };

  const handleSelectEmail = (emailId) => {
    if (selectedEmails.includes(emailId)) {
      setSelectedEmails(selectedEmails.filter(id => id !== emailId));
    } else {
      setSelectedEmails([...selectedEmails, emailId]);
    }
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
            <CCardHeader className="d-flex justify-content-between align-items-center">
              <strong>E-Mail box</strong>
              <CNav>
                <CNavItem className="mx-2 position-relative">
                      <CTooltip content="Delete Selected">
                        <CButton type="button" color="primary" size="sm" onClick={(e) => { e.stopPropagation(); deleteSelectedEmails(); }}>
                            Delete Selected
                        </CButton>
                      </CTooltip>
                </CNavItem>
              </CNav>
            </CCardHeader>
            <CCardBody>
              <CCol md={4}>
                <CInputGroup className="flex-nowrap mt-3 mb-4">
                  <CFormInput
                    placeholder="Search by Subject, Message or date-time"
                    aria-label="Search"
                    aria-describedby="addon-wrapping"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <CButton type="button" color="secondary" id="button-addon2" onClick={handleSearch}>
                    Search
                  </CButton>
                </CInputGroup>
              </CCol>
              <CTable striped hover>
                <CTableHead color='dark'>
                  <CTableRow>
                    <CTableHeaderCell scope="col">
                      <CFormCheck
                        id="selectAll"
                        checked={selectedEmails.length === emails.length}
                        onChange={handleSelectAll}
                      />
                    </CTableHeaderCell>
                    <CTableHeaderCell scope="col">Sl.No</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Time</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Subject</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Message</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredEmails.length === 0 ? (
                    <CTableRow>
                      <CTableDataCell colSpan="7" className="text-center">No data available</CTableDataCell>
                    </CTableRow>
                  ) : (
                    filteredEmails.map((email, index) => (
                      <CTableRow key={email.id}>
                        <CTableDataCell>
                          <CFormCheck
                            id={`selectEmail${email.id}`}
                            checked={selectedEmails.includes(email.id)}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleSelectEmail(email.id);
                            }}
                          />
                        </CTableDataCell>
                        <CTableHeaderCell scope="row">{index + 1}</CTableHeaderCell>
                        <CTableDataCell style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email.date}</CTableDataCell>
                        <CTableDataCell>{email.time}</CTableDataCell>
                        <CTableDataCell>{email.subject}</CTableDataCell>
                        <CTooltip placement="top" content="Click to view full Inbox.">
                          <CTableDataCell onClick={() => handleRowClick(email)} style={{ cursor: 'pointer' }}>{email.message}</CTableDataCell>
                        </CTooltip>
                        <CTableDataCell className="text-end">
                          <CTooltip content="Delete">
                            <CButton style={{ fontSize: '10px', padding: '6px 10px' }} onClick={(e) => { e.stopPropagation(); deleteEmail(email.id); }}>
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
      <CModal size='lg' visible={modalVisible} onClose={() => setModalVisible(false)} backdrop="static" keyboard={false}>
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle>E-Mail Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedEmail ? (
            <>
              <CRow className="mb-3">
                <CFormLabel htmlFor="fromEmail" className="col-sm-3 col-form-label"><strong>From Email:</strong></CFormLabel>
                <CCol sm={9}>
                  <CFormInput type="text" id="fromEmail" value={selectedEmail.from_email} readOnly plainText />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="toEmail" className="col-sm-3 col-form-label"><strong>To Email:</strong></CFormLabel>
                <CCol sm={9}>
                  <CFormInput type="text" id="toEmail" value={selectedEmail.to_email} readOnly plainText />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="subject" className="col-sm-3 col-form-label"><strong>Subject:</strong></CFormLabel>
                <CCol sm={9}>
                  <CFormInput type="text" id="subject" value={selectedEmail.subject} readOnly plainText />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="datetime" className="col-sm-3 col-form-label"><strong>Date-Time:</strong></CFormLabel>
                <CCol sm={9}>
                  <CFormInput type="text" id="datetime" value={`${selectedEmail.date} - ${selectedEmail.time}`} readOnly plainText />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CFormLabel htmlFor="message" className="col-sm-3 col-form-label"><strong>Message:</strong></CFormLabel>
                <CCol sm={9}>
                  <CFormTextarea as="textarea" id="message" value={selectedEmail.message} readOnly rows="15" />
                </CCol>
              </CRow>
            </>
          ) : (
            <p></p>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default EmailTable;