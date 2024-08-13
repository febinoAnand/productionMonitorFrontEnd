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
import axios from 'axios';
import BaseURL from 'src/assets/contants/BaseURL';


const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Authorization': `Token ${token}`,
    'Content-Type': 'application/json'
  };
};
const handleAuthError = (error) => {
  if (error.response && error.response.status === 401) {
    
    localStorage.removeItem('token');
    
    window.location.href = '/login'; 
  } else {
    
    console.error("An error occurred:", error);
  }
};
const Listachievement = () => {
  const [data, setData] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({});
  const [shiftHeaders, setShiftHeaders] = useState([]);
  const [groupedData, setGroupedData] = useState({});

  useEffect(() => {
    
    const fetchData = async () => {
      console.log('Fetching data...');
      try {
        const response = await axios.get(`${BaseURL}data/achievements/`, { headers: getAuthHeaders() });
        console.log('Data fetched:', response.data);
        const { achievements } = response.data;

       
        const newGroupedData = {};
        const dates = achievements.flatMap(group => group.dates);
        const shifts = dates.flatMap(date => date.shifts);
        const uniqueShifts = Array.from(new Set(shifts.map(shift => shift.shift_no)))
                                  .sort((a, b) => a - b);
        setShiftHeaders(uniqueShifts);

        dates.forEach(date => {
          const groupName = achievements.find(group => group.dates.includes(date))?.group_name || 'Unknown';
          if (!newGroupedData[groupName]) {
            newGroupedData[groupName] = [];
          }

          newGroupedData[groupName].push({
            date: date.date,
            shifts: date.shifts.reduce((acc, shift) => {
              acc[`shift${shift.shift_no}`] = shift.total_production_count;
              return acc;
            }, {})
          });
        });

       
        const reversedGroupedData = Object.keys(newGroupedData).reverse().reduce((acc, key) => {
          acc[key] = newGroupedData[key];
          return acc;
        }, {});

        setGroupedData(reversedGroupedData);
      } catch (error) {
        handleAuthError(error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const applyHeaderStyles = () => {
      const headerCells = document.querySelectorAll('.custom-table-header th');
      headerCells.forEach((cell) => {
        cell.style.backgroundColor = '#047BC4';
        cell.style.color = 'white';
      });
    };

    applyHeaderStyles();
  }, [data, shiftHeaders]);

  const handleEdit = (item) => {
    setCurrentItem(item);
    setFormData({ ...item });
    setModalVisible(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    const updatedData = data.map(item =>
      item.date === currentItem.date ? formData : item
    );
    setData(updatedData);
    setModalVisible(false);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      const updatedData = data.filter(item => item.date !== id);
      setData(updatedData);
    }
  };

  const calculateTotal = (shifts) => {
    return shiftHeaders.reduce((total, shift) => {
      return total + (shifts[`shift${shift}`] || 0);
    }, 0);
  };

  return (
    <>
      <CRow>
        <CCol xs={12}>
          {Object.keys(groupedData).map((groupName, index) => (
            <CCard className="mb-4" style={{ marginTop: '40px' }} key={index}>
              <CCardHeader><h5>{groupName}</h5></CCardHeader>
              <CCardBody style={{ marginTop: '10px' }}>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                <CTable striped hover>
                  <CTableHead color='dark' className="custom-table-header">
                    <CTableRow>
                      <CTableHeaderCell scope="col">Date</CTableHeaderCell>
                      {shiftHeaders.map((shift, index) => (
                        <CTableHeaderCell key={index} scope="col">{`Shift ${shift}`}</CTableHeaderCell>
                      ))}
                      <CTableHeaderCell scope="col">Total</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {groupedData[groupName].length > 0 ? (
                      groupedData[groupName].map((item, idx) => (
                        <CTableRow key={idx}>
                          <CTableDataCell>{item.date}</CTableDataCell>
                          {shiftHeaders.map((shift, i) => (
                            <CTableDataCell key={i}>{item.shifts[`shift${shift}`] || 0}</CTableDataCell>
                          ))}
                          <CTableDataCell style={{fontWeight: 'bold', color: '#007bff' }}>{calculateTotal(item.shifts)}</CTableDataCell>
                          <CTableDataCell>
                            <CButton color="primary" size="sm" className="me-2" onClick={() => handleEdit(item)}>
                              <CIcon icon={cilPen} />
                            </CButton>
                            <CButton color="primary" size="sm" onClick={() => handleDelete(item.date)}>
                              <CIcon icon={cilTrash} />
                            </CButton>
                          </CTableDataCell>
                        </CTableRow>
                      ))
                    ) : (
                      <CTableRow>
                        <CTableDataCell colSpan={shiftHeaders.length + 2} className="text-center">
                          No data available
                        </CTableDataCell>
                      </CTableRow>
                    )}
                  </CTableBody>
                </CTable>
                </div>
              </CCardBody>
            </CCard>
          ))}
        </CCol>
      </CRow>

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
                <CFormLabel htmlFor="groupName">Group Name</CFormLabel>
                <CFormInput
                  id="groupName"
                  name="groupName"
                  type="text"
                  value={formData.groupName || ''}
                  onChange={handleChange}
                />
              </CForm>
            </CCol>
            {shiftHeaders.map((shift, index) => (
              <CCol key={index} xs={12} sm={6} md={3}>
                <CForm>
                  <CFormLabel htmlFor={`shift${shift}`}>{`Shift ${shift}`}</CFormLabel>
                  <CFormInput
                    id={`shift${shift}`}
                    name={`shift${shift}`}
                    type="number"
                    value={formData[`shift${shift}`] || ''}
                    onChange={handleChange}
                  />
                </CForm>
              </CCol>
            ))}
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
