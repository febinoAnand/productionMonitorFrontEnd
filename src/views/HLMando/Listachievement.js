import React, { useState, useEffect } from 'react';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CForm,
  CFormInput,
  CFormLabel
} from '@coreui/react';
import { cilPen, cilTrash } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

// Constant data
const initialData = [
  {
    id: 1,
    date: '05-Aug-2024',
    lineId: 'MCLMI',
    shift1: 123,
    shift2: 123,
    shift3: 123,
    total: 369
  },
  {
    id: 2,
    date: '06-Aug-2024',
    lineId: 'CRRMI 1',
    shift1: 98,
    shift2: 110,
    shift3: 105,
    total: 313
  },
  {
    id: 3,
    date: '06-Aug-2024',
    lineId: 'MCLM 3',
    shift1: 115,
    shift2: 120,
    shift3: 130,
    total: 365
  },
  {
    id: 4,
    date: '06-Aug-2024',
    lineId: 'MCLM 2',
    shift1: 142,
    shift2: 135,
    shift3: 128,
    total: 405
  },
  {
    id: 5,
    date: '06-Aug-2024',
    lineId: 'MCLM 1',
    shift1: 110,
    shift2: 123,
    shift3: 117,
    total: 350
  },
  {
    id: 6,
    date: '06-Aug-2024',
    lineId: 'CALPI',
    shift1: 125,
    shift2: 130,
    shift3: 140,
    total: 395
  },
  {
    id: 7,
    date: '06-Aug-2024',
    lineId: 'CRRMI',
    shift1: 98,
    shift2: 105,
    shift3: 102,
    total: 305
  },
  {
    id: 8,
    date: '06-Aug-2024',
    lineId: 'HSMGI',
    shift1: 112,
    shift2: 119,
    shift3: 125,
    total: 356
  },
  {
    id: 9,
    date: '06-Aug-2024',
    lineId: 'TEST',
    shift1: 120,
    shift2: 126,
    shift3: 132,
    total: 378
  }
];


const Listachievement = () => {
  const [data, setData] = useState(initialData);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const headerCells = document.querySelectorAll('.custom-table-header th');
    headerCells.forEach((cell) => {
      cell.style.backgroundColor = '#047BC4';
      cell.style.color = 'white';
    });
  }, []);

  // Open the edit modal
  const handleEdit = (item) => {
    setCurrentItem(item);
    setFormData({ ...item });
    setModalVisible(true);
  };

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Save edited item
  const handleSave = () => {
    const updatedData = data.map(item =>
      item.id === currentItem.id ? formData : item
    );
    setData(updatedData);
    setModalVisible(false);
  };

  // Delete function
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const updatedData = data.filter(item => item.id !== id);
      setData(updatedData);
    }
  };

  return (
    <>
      {/* First Table */}
      <CRow>
        <CCol xs={12}>
          <CCard className="mb-4"style={{
        marginTop: '40px',
      }}>
            <CCardHeader><h5>List Achievement</h5></CCardHeader>
            <CCardBody style={{ marginTop: '10px' }}> 
              <CTable striped hover>
                <CTableHead color='dark' className="custom-table-header">
                  <CTableRow>
                    <CTableHeaderCell scope="col">#</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Line ID</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Shift 1</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Shift 2</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Shift 3</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                    <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {data.length > 0 ? (
                    data.map((item) => (
                      <CTableRow key={item.id}>
                        <CTableDataCell>{item.id}</CTableDataCell>
                        <CTableDataCell>{item.date}</CTableDataCell>
                        <CTableDataCell>{item.lineId}</CTableDataCell>
                        <CTableDataCell>{item.shift1}</CTableDataCell>
                        <CTableDataCell>{item.shift2}</CTableDataCell>
                        <CTableDataCell>{item.shift3}</CTableDataCell>
                        <CTableDataCell>{item.total}</CTableDataCell>
                        <CTableDataCell>
                          <CButton color="primary" size="sm" className="me-2" onClick={() => handleEdit(item)}>
                            <CIcon icon={cilPen} />
                          </CButton>
                          <CButton color="primary" size="sm" onClick={() => handleDelete(item.id)}>
                            <CIcon icon={cilTrash} />
                          </CButton>
                        </CTableDataCell>
                      </CTableRow>
                    ))
                  ) : (
                    <CTableRow>
                      <CTableDataCell colSpan="8" className="text-center">
                        No data available
                      </CTableDataCell>
                    </CTableRow>
                  )}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Edit Modal */}
      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader>
          <CModalTitle>Edit Achievement</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol xs={12} sm={6} md={5}>
              <CForm>
                <CFormLabel htmlFor="date">Date</CFormLabel>
                <CFormInput
                  id="date"
                  name="date"
                  type="text"
                  value={formData.date || ''}
                  onChange={handleChange}
                />
              </CForm>
            </CCol>
            <CCol xs={12} sm={6} md={3}>
              <CForm>
                <CFormLabel htmlFor="lineId">Line ID</CFormLabel>
                <CFormInput
                  id="lineId"
                  name="lineId"
                  type="text"
                  value={formData.lineId || ''}
                  onChange={handleChange}
                />
              </CForm>
            </CCol>
            <CCol xs={12} sm={6} md={3}>
              <CForm>
                <CFormLabel htmlFor="shift1">Shift 1</CFormLabel>
                <CFormInput
                  id="shift1"
                  name="shift1"
                  type="number"
                  value={formData.shift1 || ''}
                  onChange={handleChange}
                />
              </CForm>
            </CCol>
            <CCol xs={12} sm={6} md={3}>
              <CForm>
                <CFormLabel htmlFor="shift2">Shift 2</CFormLabel>
                <CFormInput
                  id="shift2"
                  name="shift2"
                  type="number"
                  value={formData.shift2 || ''}
                  onChange={handleChange}
                />
              </CForm>
            </CCol>
            <CCol xs={12} sm={6} md={3}>
              <CForm>
                <CFormLabel htmlFor="shift3">Shift 3</CFormLabel>
                <CFormInput
                  id="shift3"
                  name="shift3"
                  type="number"
                  value={formData.shift3 || ''}
                  onChange={handleChange}
                />
              </CForm>
            </CCol>
            <CCol xs={12} sm={6} md={3}>
              <CForm>
                <CFormLabel htmlFor="total">Total</CFormLabel>
                <CFormInput
                  id="total"
                  name="total"
                  type="number"
                  value={formData.total || ''}
                  onChange={handleChange}
                  readOnly
                />
              </CForm>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={() => setModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleSave}>
            Save Changes
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Listachievement;
