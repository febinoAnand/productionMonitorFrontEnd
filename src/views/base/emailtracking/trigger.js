import React from 'react';
import axios from 'axios';
import { cilTrash, cilPen } from '@coreui/icons';
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CModal,
  CModalHeader,
  CModalBody,
  CTooltip,
  CFormSwitch,
  CFormTextarea,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import BaseURL from 'src/assets/contants/BaseURL';

class Trigger extends React.Component {
  state = {
    newfilterlist:[],   //my state
    allfiledlist:[],   //my state
    listingFieldUsers:[],
    newTriggerData:{
      // group_to_send: null,
      trigger_field: null,
      trigger_name: "",
      notification_message: "",
      trigger_switch: false,
      send_sms: false,
      send_notification: false,
      parameter_filter_list: [],
      users_to_send: []
    },    //my state

    visibleUpdate: false,
    visibleAdd: false,
    triggers: [],
    parameterFields: [],
    selectedUsers: [],
    selectedTrigger: null,
    operator: '',
    value: '',
    logicalOperator: '',
    filters: [],
    newfilter: [],
    newlyAddedFilters: [],
    parameterFilterDetails: [],
    newTrigger:'',
    selectedUsers: [],
    newTrigger: {
      parameter_filter_list_details: {
        operator: '',
        value: '',
        logical_operator: '',
      },
    },
  };

  //my function 
  updateGroupList = (name)=>{
    this.setState({
      newTriggerData:{
        ...this.state.newTriggerData,
        parameter_filter_list:[]
      }
    })

    let userlistArray = []
    let valueCatched = this.state.allfiledlist.find(filterdata =>{
      if(filterdata.alias == name){
        // console.log("found filter",filterdata);
        filterdata.group_details.map((userslist=>{
          userslist.user_list.map(users=>{
            userlistArray.push(users)
            
          })
        }))
        return filterdata;
      }
    })
    this.setState({
      listingFieldUsers:userlistArray
    })
    // console.log("foundData",valueCatched)
  }



  handleChangeUser = (event) => {
    const selectedValues = Array.from(event.target.options)
      .filter((option) => option.selected)
      .map((option) => parseInt(option.value));
    this.setState((prevState) => ({
      newTrigger: {
        ...prevState.newTrigger,
        user_to_send: selectedValues,
      },
    }));
    console.log(selectedValues);
};

  handleChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
        newTrigger: {
            ...prevState.newTrigger,
            parameter_filter_list_details: {
                ...prevState.newTrigger.parameter_filter_list_details,
                [name]: value,
            },
        },
    }));
}

handleNewUpdateDelete = async (id) => {
  try {
      const response = await fetch(BaseURL + `emailtracking/filter/${id}/`, {
          method: 'DELETE',
      });

      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const updatedFilters = this.state.newfilter.filter(filter => filter.id !== id);
      this.setState({ newfilter: updatedFilters });
  } catch (error) {
      console.error('Error:', error);
  }
}

  handleAddInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const { newTrigger } = this.state;
    const updatedTrigger = { ...newTrigger };

    if (name === 'operator' || name === 'logical_operator') {
        updatedTrigger[name] = value;
    } else if (name.startsWith('selectedTrigger.parameter_filter_list[0]')) {
        const nestedProperty = name.split('.').slice(2);
        let currentObj = updatedTrigger;
        for (let key of nestedProperty.slice(0, -1)) {
            if (!currentObj[key]) {
                currentObj[key] = {};
            }
            currentObj = currentObj[key];
        }
        currentObj[nestedProperty[nestedProperty.length - 1]] = type === 'checkbox' ? checked : value;
    } else {
        updatedTrigger[name] = type === 'checkbox' ? checked : value;
    }
    this.setState({ newTrigger: updatedTrigger });
};

  handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const { selectedTrigger } = this.state;
  
    if (!selectedTrigger) return;
  
    const updatedTrigger = { ...selectedTrigger };

    if (name.startsWith('selectedTrigger.parameter_filter_list[0]')) {
        const nestedProperty = name.split('.').slice(2);
        
        if (!updatedTrigger.parameter_filter_list_details || !updatedTrigger.parameter_filter_list_details[0]) {
            updatedTrigger.parameter_filter_list_details = [{}];
        }
        let currentProperty = updatedTrigger.parameter_filter_list_details[0];
        for (let i = 0; i < nestedProperty.length - 1; i++) {
            if (!currentProperty[nestedProperty[i]]) {
                currentProperty[nestedProperty[i]] = {};
            }
            currentProperty = currentProperty[nestedProperty[i]];
        }
        
        if (type === 'checkbox') {
            currentProperty[nestedProperty[nestedProperty.length - 1]] = checked;
        } else {
            currentProperty[nestedProperty[nestedProperty.length - 1]] = value;
        }
    } else {
        const nestedProperties = name.split('.');
        let currentProperty = updatedTrigger;
        for (let i = 0; i < nestedProperties.length - 1; i++) {
            if (!currentProperty[nestedProperties[i]]) {
                currentProperty[nestedProperties[i]] = {};
            }
            currentProperty = currentProperty[nestedProperties[i]];
        }
        currentProperty[nestedProperties[nestedProperties.length - 1]] = type === 'checkbox' ? checked : value;
    }
  
    this.setState({ selectedTrigger: updatedTrigger });
};

  handleMultiSelectChange = (e) => {
    const { name, options } = e.target;
    console.log(e.target);
    const selectedValues = Array.from(options)
      .filter((option) => option.selected)
      .map((option) => option.value);

    this.setState((prevState) => ({
      selectedTrigger: {
        ...prevState.selectedTrigger,
        [name]: selectedValues,
      },
    }));
  };

  componentDidMount() {
    this.fetchData();
    this.fetchParameterFields();
  }

  fetchData = async () => {
    try {
      const response = await axios.get(BaseURL + 'emailtracking/trigger/');
      this.setState({ triggers: response.data.reverse() });
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  fetchParameterFields = async () => {
    try {
      const response = await axios.get(BaseURL + 'emailtracking/parameter/');
      console.log("Parameter==>",response.data);
      this.setState({
        allfiledlist: response.data
      })
      const parameterFields = response.data.map((field) => field.field);
      this.setState({ parameterFields });
    } catch (error) {
      console.error('Error fetching parameter fields:', error);
    }
  };

  fetchFilters = async (triggerId) => {
    try {
      const response = await axios.get(`${BaseURL}emailtracking/trigger/${triggerId}/`);
      this.setState({ selectedTrigger: response.data });
    } catch (error) {
      console.error('Error fetching trigger data:', error);
    }
  };

  toggleUpdateModal = async (trigger = null) => {
    if (trigger) {
      await this.fetchFilters(trigger.id);
      const triggerFieldDetails = this.state.allfiledlist.find(field => field.field === trigger.trigger_field);
  
      if (triggerFieldDetails) {
        const allUsers = [];
        triggerFieldDetails.group_details.forEach(group => {
          group.user_list.forEach(user => {
            if (!allUsers.some(u => u.id === user.id)) {
              allUsers.push(user);
            }
          });
        });
  
        const parameterFilterDetails = trigger.parameter_filter_list_details.map(detail => ({
          id: detail.id || null,
          operator: detail.operator,
          value: detail.value,
          logical_operator: detail.logical_operator
        }));
  
        this.setState({
          listingFieldUsers: allUsers,
          selectedTrigger: trigger,
          visibleUpdate: true,
          parameterFilterDetails,
          newlyAddedFilters: [],
        });
      }
    } else {
      this.setState({
        visibleUpdate: false,
        selectedTrigger: null,
        parameterFilterDetails: [],
        newlyAddedFilters: []
      });
    }
  };  

  toggleAddModal = () => {
    this.setState(prevState => ({
      visibleAdd: !prevState.visibleAdd,
      newTriggerData: {
        trigger_field: null,
        trigger_name: "",
        notification_message: "",
        trigger_switch: false,
        send_sms: false,
        send_notification: false,
        parameter_filter_list: [],
        users_to_send: []
      },
      newTrigger: {
        trigger_name: '',
        user_to_send: [],
        trigger_field: '',
        notification_message: '',
        trigger_switch: false,
        send_sms: false,
        send_notification: false,
        parameter_filter_list: [{
          operator: '',
          value: '',
          logical_operator: ''
        }]
      }
    }));
  };
  
  handleFinalSave = async () => {
    const { newTrigger } = this.state;
    try {
        const response = await axios.get(BaseURL + 'emailtracking/trigger/');
        const triggers = response.data;
        if (triggers.length > 0) {
            const defaultGroupToSend = triggers[0].group_to_send;
            newTrigger.group_to_send = defaultGroupToSend;
        }
    } catch (error) {
        console.error('Error fetching trigger data:', error);
    }

    const triggerData = {
        group_to_send: newTrigger.group_to_send,
        trigger_field: newTrigger.trigger_field,
        trigger_name: newTrigger.trigger_name,
        notification_message: newTrigger.notification_message,
        trigger_switch: newTrigger.trigger_switch,
        send_sms: newTrigger.send_sms,
        send_notification: newTrigger.send_notification,
        parameter_filter_list: newTrigger.parameter_filter_list,
        users_to_send: this.state.newTrigger.user_to_send,
    };

    try {
        console.log("Sent Data -->", this.state.newTriggerData);
        const response = await fetch(BaseURL + 'emailtracking/trigger/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(this.state.newTriggerData),
        });

        if (response.ok) {
            console.log('Trigger data saved successfully', this.state.newTriggerData);
            this.setState({visibleAdd:false})
            this.fetchData();
            window.location.reload();
        } else {
            console.error('Failed to save trigger data', triggerData);
        }
    } catch (error) {
        console.error('An error occurred while saving trigger data', error);
    }
};

handleUpdateSave = async () => {
  const { selectedTrigger } = this.state;

  if (!selectedTrigger) return;

  try {
    const updatedFilters = [];

    for (const item of selectedTrigger.parameter_filter_list_details) {
      if (typeof item === 'object') {
        const { operator, value, logical_operator } = item;
        const newFilter = {
          operator,
          value,
          logical_operator
        };

        const response = await fetch(BaseURL + 'emailtracking/filter/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newFilter),
        });

        if (!response.ok) {
          throw new Error('Failed to add new filter');
        }

        const responseData = await response.json();
        const generatedId = responseData.id;

        updatedFilters.push({
          id: generatedId,
          operator,
          value,
          logical_operator
        });

        break;
      }
    }
    const updatedTrigger = {
      ...selectedTrigger,
      parameter_filter_list: [...selectedTrigger.parameter_filter_list, ...updatedFilters.map(filter => filter.id)]
    };
    this.setState({
      selectedTrigger: updatedTrigger,
      newlyAddedFilters: [...this.state.newlyAddedFilters, ...updatedFilters]
    });

    console.log("Filters updated successfully.");
  } catch (error) {
    console.error("Error adding new filter:", error);
  }
};

  testhandleNewUpdateSave = async()=>{
    console.log("listing users=>",this.state.listingFieldUsers)
    console.log("paramter data =>", this.state.allfiledlist)
    console.log("New trigger data =>", this.state.newTriggerData)
    // const tempdata = this.state.newfilterlist
    // if(tempdata.length>0){
    //   for(let i = 0 ;i<tempdata.length;i++){
    //     console.log(tempdata[i].operator)
    //   }
    // }
  }

  handleNewUpdateSave = async () => {
    const { newTrigger, newfilter } = this.state;

    const payload = {
        operator: newTrigger.parameter_filter_list_details?.operator || null,
        value: newTrigger.parameter_filter_list_details?.value || "",
        logical_operator: newTrigger.parameter_filter_list_details?.logical_operator || null,
    };

    try {
        const response = await fetch(BaseURL + 'emailtracking/filter/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log('Success:', data);
        this.setState( filters => ({ 
          newTriggerData:{
            ...filters.newTriggerData,
            parameter_filter_list:[...filters.newTriggerData.parameter_filter_list,data.id]
          },
          newfilterlist:[...filters.newfilterlist, data]
        }))

        console.log("New filter list", this.state.newfilterlist)

        const updatedTrigger = { ...newTrigger };
        updatedTrigger.parameter_filter_list = [...newfilter, data.id];

        this.setState({ 
            newTrigger: updatedTrigger,
            updatedTrigger: updatedTrigger,
            newfilter: [...newfilter, data.id]
        });

        console.log('Trigger updated successfully:', updatedTrigger);

    } catch (error) {
        console.error('Error:', error);
    }
}

handleUpdateDelete = async (id) => {
  try {
      const response = await fetch(`${BaseURL}emailtracking/filter/${id}/`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json',
          },
      });
      
      if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to delete the filter: ${errorText}`);
      }
      
      console.log('Filter deleted from server:', id);
      const updatedParameterFilters = this.state.parameterFilterDetails.filter(filter => filter.id !== id);
      const updatedNewlyAddedFilters = this.state.newlyAddedFilters.filter(filter => filter.id !== id);
      this.setState({ 
          parameterFilterDetails: updatedParameterFilters,
          newlyAddedFilters: updatedNewlyAddedFilters 
      }, () => {
          console.log('Filters updated successfully.');
      });
  } catch (error) {
      console.error('Error deleting filter:', error);
  }
};

handleSave = async () => {
  const { selectedTrigger } = this.state;

  if (!selectedTrigger) {
    console.error('No trigger selected.');
    return;
  }

  try {
    console.log('Updating trigger:', selectedTrigger);

    const response = await axios.put(`${BaseURL}emailtracking/trigger/${selectedTrigger.id}/`, selectedTrigger);

    if (response.status === 200) {
      console.log('Trigger updated successfully:', response.data);
      this.fetchData();
    } else {
      console.error('Failed to update trigger:', response.statusText);
    }
  } catch (error) {
    console.error('Error updating trigger:', error);
  } finally {
    this.setState({
      visibleUpdate: false,
      selectedTrigger: null,
      parameterFilterDetails: [],
      newlyAddedFilters: [],
    });
  }
};


  handleDeleteTrigger = async (triggerId) => {
    try {
      await axios.delete(`${BaseURL}emailtracking/trigger/${triggerId}/`);
      this.setState({ visibleUpdate: false });
      this.fetchData();
    } catch (error) {
      console.error('Error deleting trigger:', error);
    }
  };

  render() {
    const { triggers,visibleAdd, visibleUpdate, selectedTrigger, parameterFields, newTrigger, selectedUsers, parameterFilterDetails, newlyAddedFilters } = this.state;
    const uniqueUsers = new Set();

    return (
      <>
        <CRow>
          <CCol xs={12}>
            <CCard className="mb-4">
              <CCardHeader>
                <strong>Rules</strong>
              </CCardHeader>
              <CCardBody>
                <CTooltip content="Add new Rule">
                  <CButton type="button" color="primary" className="mb-3" onClick={this.toggleAddModal}>
                    Create
                  </CButton>
                </CTooltip>
                <CTable striped hover>
                  <CTableHead>
                    <CTableRow color="dark">
                      <CTableHeaderCell scope="col">Sl.No</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Rule Name</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Field</CTableHeaderCell>
                      {/* <CTableHeaderCell scope="col">Group</CTableHeaderCell> */}
                      <CTableHeaderCell scope="col">Notification Message</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                      <CTableHeaderCell scope="col">Action</CTableHeaderCell>
                    </CTableRow>
                  </CTableHead>
                  <CTableBody>
                    {triggers.map((trigger, index) => (
                      <CTableRow key={trigger.id}>
                        <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                        <CTableDataCell>{trigger.trigger_name}</CTableDataCell>
                        <CTableDataCell>
                          <span
                            style={{
                              display: 'inline-block',
                              padding: '5px 10px',
                              borderRadius: '12px',
                              backgroundColor: trigger.trigger_field_details.color,
                              color: 'white',
                              fontWeight: 'bold',
                            }}
                          >
                            {trigger.trigger_field}
                          </span>
                        </CTableDataCell>
                        {/* <CTableDataCell>{trigger.group_to_send}</CTableDataCell> */}
                        <CTableDataCell>{trigger.notification_message}</CTableDataCell>
                        <CTableDataCell>
                          <span style={{ fontWeight: trigger.trigger_switch ? 'bold' : 'bold', color: trigger.trigger_switch ? 'green' : 'red' }}>
                        {trigger.trigger_switch ? 'Active' : 'Inactive'}
                        </span>
                        </CTableDataCell>
                        <CTableDataCell>
                          <div className="d-flex gap-2">
                            <CTooltip content="Edit">
                              <CButton style={{ fontSize: '10px', padding: '6px 10px' }} onClick={() => this.toggleUpdateModal(trigger)}>
                                <CIcon icon={cilPen} />
                              </CButton>
                            </CTooltip>
                            <CTooltip content="Delete">
                              <CButton style={{ fontSize: '10px', padding: '6px 10px' }} onClick={(e) => { e.stopPropagation(); this.handleDeleteTrigger(trigger.id); }}>
                                <CIcon icon={cilTrash} />
                              </CButton>
                            </CTooltip>
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
        <CModal
          size="lg"
          visible={visibleUpdate}
          backdrop="static"
          keyboard={false}
          onClose={() => this.toggleUpdateModal()}
          aria-labelledby="UpdateModalLabel"
        >
          <CModalHeader>
            <strong>Update Rule Engine</strong>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <CRow className="mb-3">
                <CCol sm={2}>
                  <CFormLabel htmlFor="trigger_name" className="col-form-label"><strong>Rule Name</strong></CFormLabel>
                </CCol>
                <CCol md={4}>
                <CFormInput
                  type="text"
                  id="trigger_name"
                  name="trigger_name"
                  value={selectedTrigger ? selectedTrigger.trigger_name : ''}
                  onChange={this.handleInputChange}
                />
                </CCol>
                <CCol sm={2}>
                  <CFormLabel htmlFor="user_name" className="col-form-label"><strong>Group User</strong></CFormLabel>
                </CCol>
                <CCol md={4}>
                <CFormSelect
                  id="user_to_send"
                  name="user_to_send"
                  multiple
                  value={selectedTrigger ? selectedTrigger.users_to_send : ''}
                  onChange={(e) => {
                    console.log(e.target);
                    let multipleOptions = e.target.options;
                    let allItem = this.state.listingFieldUsers;
                    let value = [];
                    let selectedItems = [];

                    for (let i = 0; i < multipleOptions.length; i++) {
                      if (multipleOptions[i].selected) {
                        value.push(multipleOptions[i].value);
                        console.log("value-->", parseInt(value));
                        for (let j = 0; j < allItem.length; j++) {
                          if (allItem[j].id === parseInt(multipleOptions[i].value)) {
                            selectedItems.push(allItem[j].id);
                          }
                        }
                      }
                    }

                    this.setState({
                      selectedTrigger: {
                        ...this.state.selectedTrigger,
                        users_to_send: selectedItems,
                      },
                    });
                  }}
                >
                  {this.state.listingFieldUsers.map((users) => {
                    const isSelected = selectedTrigger && selectedTrigger.users_to_send.includes(users.id);
                    return (
                      <option key={users.id} value={users.id} selected={isSelected}>
                        {users.username}
                      </option>
                    );
                  })}
                </CFormSelect>
                </CCol>
              </CRow>
              <CRow className="mb-3">
              <CCol sm={2}>
                <CFormLabel htmlFor="trigger_field" className="col-form-label"><strong>Field</strong></CFormLabel>
              </CCol>
              <CCol md={4}>
              {selectedTrigger && selectedTrigger.trigger_field && (
                <CFormSelect
                  id="trigger_field"
                  name="selectedTrigger.parameter_filter_list[0].trigger_field"
                  value={selectedTrigger.trigger_field || ''}
                  onChange={(e)=>{
                    this.updateGroupList(e.target.value);
                    this.setState({
                      selectedTrigger:{
                        ...this.state.selectedTrigger,
                        trigger_field:e.target.value
                      }
                    })
                  }}
                >
                  <option value=""></option>
                  {parameterFields.map((field, index) => (
                    <option key={index} value={field}>
                      {field}
                    </option>
                  ))}
                </CFormSelect>
              )}
              </CCol>
              <CCol sm={2}>
                  <CFormLabel htmlFor="Group_name" className="col-form-label"><strong>Group Name</strong></CFormLabel>
                </CCol>
                <CCol md={4}>
                <CFormInput
                  type="text"
                  id="Group_name"
                  name="Group_name"
                  value={selectedTrigger ? selectedTrigger.trigger_field_details.group_details[0].name : ''}
                  onChange={this.handleInputChange}
                />
              </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol sm={2}>
                  <CFormLabel htmlFor="notification_message" className="col-form-label"><strong>Notification Message</strong></CFormLabel>
                </CCol>
                <CCol md={10}>
                  <CFormTextarea
                    type="text"
                    id="notification_message"
                    name="notification_message"
                    rows={5}
                    value={selectedTrigger ? selectedTrigger.notification_message : ''}
                    onChange={this.handleInputChange}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol sm={2}>
                  <CFormLabel htmlFor="trigger_switch" className="col-form-label"><strong>Active Status</strong></CFormLabel>
                </CCol>
                <CCol md={2}>
                  <CFormSwitch
                    id="trigger_switch"
                    name="trigger_switch"
                    checked={selectedTrigger ? selectedTrigger.trigger_switch : false}
                    onChange={this.handleInputChange}
                  />
                </CCol>
                <CCol sm={2}>
                  <CFormLabel htmlFor="send_sms" className="col-form-label"><strong>SMS</strong></CFormLabel>
                </CCol>
                <CCol md={2}>
                  <CFormSwitch
                    id="send_sms"
                    name="send_sms"
                    checked={selectedTrigger ? selectedTrigger.send_sms : false}
                    onChange={this.handleInputChange}
                  />
                </CCol>
                <CCol sm={2}>
                  <CFormLabel htmlFor="send_notification" className="col-form-label"><strong>Notify</strong></CFormLabel>
                </CCol>
                <CCol md={2}>
                  <CFormSwitch
                    id="send_notification"
                    name="send_notification"
                    checked={selectedTrigger ? selectedTrigger.send_notification : false}
                    onChange={this.handleInputChange}
                  />
                </CCol>
              </CRow>
            </CForm>
            <CForm>
              <CRow className="mb-3">
                <CCol sm={2}>
                  <CFormLabel htmlFor="operator" className="col-form-label"><strong>Operator</strong></CFormLabel>
                </CCol>
                <CCol md={4}>
                  <CFormSelect
                    id="operator"
                    name="selectedTrigger.parameter_filter_list[0].operator"
                    value={selectedTrigger?.parameter_filter_list_details[0]?.operator || ''}
                    onChange={this.handleInputChange}
                  >
                    <option></option>
                    <option>greater than</option>
                    <option>greater than or equal</option>
                    <option>less than or equal</option>
                    <option>less than</option>
                    <option>equals</option>
                    <option>not equals</option>
                    <option>is exist</option>
                  </CFormSelect>
                </CCol>
                <CCol sm={2}>
                  <CFormLabel htmlFor="value" className="col-sm-2 col-form-label"><strong>Value</strong></CFormLabel>
                </CCol>
                <CCol md={4}>
                  <CFormInput
                    type="text"
                    id="value"
                    name="selectedTrigger.parameter_filter_list[0].value"
                    value={selectedTrigger?.parameter_filter_list_details[0]?.value || ''}
                    onChange={this.handleInputChange}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol sm={2}>
                  <CFormLabel htmlFor="logicalOperator" className="col-form-label"><strong>Logical Operator</strong></CFormLabel>
                </CCol>
                <CCol md={10}>
                  <CFormSelect
                    id="logicalOperator"
                    name="selectedTrigger.parameter_filter_list[0].logical_operator"
                    value={selectedTrigger?.parameter_filter_list_details[0]?.logical_operator || ''}
                    onChange={this.handleInputChange}
                  >
                    <option></option>
                    <option>AND</option>
                    <option>OR</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow className="justify-content-center">
                  <CCol xs={1}>
                  <div className='d-grid gap-2'>
                  <CButton className="mt-2" color="primary" onClick={this.handleUpdateSave}>
                    Save
                  </CButton>
                  </div>
                </CCol>
              </CRow>
            </CForm>
          </CModalBody>
          <CRow>
        <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>FILTERS</strong>
          </CCardHeader>
          <CCardBody>
          <CTable striped hover>
            <CTableHead>
              <CTableRow color="dark">
                <CTableHeaderCell scope="col">Sl.No</CTableHeaderCell>
                <CTableHeaderCell scope="col">And / Or</CTableHeaderCell>
                <CTableHeaderCell scope="col">Operation</CTableHeaderCell>
                <CTableHeaderCell scope="col">Value</CTableHeaderCell>
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>

            {/* {this.state.newlyAddedFilters.map((filter, index) => (
                <CTableRow key={index}>
                  <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                  <CTableDataCell>{filter.logical_operator}</CTableDataCell>
                  <CTableDataCell>{filter.operator}</CTableDataCell>
                  <CTableDataCell>{filter.value}</CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex gap-2">
                      <CTooltip content="Delete">
                        <CButton style={{ fontSize: '10px', padding: '6px 10px' }} onClick={() => this.handleUpdateDelete(filter.id)}>
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTooltip>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))} */}


              {parameterFilterDetails.map((filter, index) => (
                <CTableRow key={index + 1}>
                  <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                  <CTableDataCell>{filter.logical_operator}</CTableDataCell>
                  <CTableDataCell>{filter.operator}</CTableDataCell>
                  <CTableDataCell>{filter.value}</CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex gap-2">
                      <CTooltip content="Delete">
                        <CButton style={{ fontSize: '10px', padding: '6px 10px' }} onClick={() => this.handleUpdateDelete(filter.id)}>
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTooltip>
                    </div>
                  </CTableDataCell>
                </CTableRow>
              ))}
              {newlyAddedFilters.map((filter, index) => (
                <CTableRow key={index + parameterFilterDetails.length + 1}>
                  <CTableHeaderCell>{index + parameterFilterDetails.length + 1}</CTableHeaderCell>
                  <CTableDataCell>{filter.logical_operator}</CTableDataCell>
                  <CTableDataCell>{filter.operator}</CTableDataCell>
                  <CTableDataCell>{filter.value}</CTableDataCell>
                  <CTableDataCell>
                    <div className="d-flex gap-2">
                      <CTooltip content="Delete">
                        <CButton style={{ fontSize: '10px', padding: '6px 10px' }} onClick={() => this.handleUpdateDelete(filter.id)}>
                          <CIcon icon={cilTrash} />
                        </CButton>
                      </CTooltip>
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
      <CRow className="justify-content-center">
          <CCol xs={1}>
            <div className='d-grid gap-2'>
               <CButton color="primary" type="submit" onClick={this.handleSave}>Save</CButton>
            </div>
          </CCol>
       </CRow>
      <br />
        </CModal>
        <CModal
          size="lg"
          visible={visibleAdd}
          backdrop="static"
          keyboard={false}
          onClose={() => this.toggleAddModal()}
          aria-labelledby="AddModalLabel"
        >
          <CModalHeader>
            <strong>Add Rule Engine</strong>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <CRow className="mb-3">
                <CCol sm={2}>
                  <CFormLabel htmlFor="trigger_name" className="col-form-label"><strong>Rule Name</strong></CFormLabel>
                </CCol>
                <CCol md={4}>
                {/* <CFormInput
                  type="text"
                  id="trigger_name"
                  name="trigger_name"
                  value={newTrigger ? newTrigger.trigger_name : ''}
                  onChange={this.handleAddInputChange}
                /> */}
                <CFormInput
                  type="text"
                  id="trigger_name"
                  name="trigger_name"
                  value={this.state.newTriggerData.trigger_name}
                  onChange={(text)=>{
                    this.setState({
                      newTriggerData:{
                        ...this.state.newTriggerData,
                        trigger_name: text.target.value
                      }
                    })
                  }}
                />
                </CCol>
                <CCol sm={2}>
                  <CFormLabel htmlFor="user_name" className="col-form-label"><strong>Group User</strong></CFormLabel>
                </CCol>
                <CCol md={4}>
                {/* <CFormSelect
                    id="user_to_send"
                    name="user_to_send"
                    multiple
                    value={selectedUsers}
                    onChange={this.handleChangeUser}
                >
                    {triggers.map((trigger, index) => (
                        <React.Fragment key={index}>
                            {trigger.trigger_field_details.group_details?.flatMap(group =>
                                group?.user_list?.map(user => {
                                    if (!uniqueUsers.has(user.id)) {
                                        uniqueUsers.add(user.id);
                                        return (
                                            <option key={user.id} value={user.id} selected={selectedUsers.includes(user.id)}>
                                                {user.username}
                                            </option>
                                        );
                                    }
                                    return null;
                                })
                            )}
                        </React.Fragment>
                    ))}
                </CFormSelect> */}
                <CFormSelect
                    id="user_to_send"
                    name="user_to_send"
                    multiple
                    value={this.state.newTriggerData.users_to_send}
                    onChange={e=>{
                      console.log(e.target)
                      let multipleOptions = e.target.options;
                      let allItem = this.state.listingFieldUsers;
                      let value = [];
                      let selectedItems = [];

                      for(let i = 0;i<multipleOptions.length;i++){
                        if(multipleOptions[i].selected){
                          value.push(multipleOptions[i].value)
                          console.log("value-->",parseInt(value))
                          for(let j = 0;j<allItem.length;j++){
                            if(allItem[j].id === parseInt(multipleOptions[i].value)){
                              selectedItems.push(allItem[j].id)
                            }
                          }
                        }
                      }

                      this.setState({
                        newTriggerData:{
                          ...this.state.newTriggerData,
                          users_to_send:selectedItems
                        }
                      },
                      // ()=>{console.log("selected->",selectedItems)}
                    )


                      // this.setState({
                      //   newTriggerData:{
                      //     ...this.state.newTriggerData,
                      //     users_to_send:[...this.state.newTriggerData.users_to_send, e.target.value]
                      //   }
                      // })
                    }}
                >
                  
                  {this.state.listingFieldUsers.map(users=>{
                      
                      return(
                        <option key={users.id} value={users.id}>{users.username}</option>
                      )
                  })}
                  
                    
                </CFormSelect>
                </CCol>
              </CRow>
              <CRow className="mb-3">
              <CCol sm={2}>
                <CFormLabel htmlFor="trigger_field" className="col-form-label"><strong>Field</strong></CFormLabel>
              </CCol>
              {/* <CCol md={10}>
                <CFormSelect
                  id="trigger_field"
                  name="selectedTrigger.parameter_filter_list[0].trigger_field"
                  onChange={this.handleAddInputChange}
                >
                  <option value=""></option>
                  {parameterFields.map((field, index) => (
                    <option key={index} value={field}>
                      {field}
                    </option>
                  ))}
                </CFormSelect>
              </CCol> */}
              <CCol md={10}>
                <CFormSelect
                  id="trigger_field"
                  name="selectedTrigger.parameter_filter_list[0].trigger_field"
                  onChange={(e)=>{
                    // console.log("Field->",e.target.value)
                    this.updateGroupList(e.target.value);
                    this.setState({
                      newTriggerData:{
                        ...this.state.newTriggerData,
                        trigger_field:e.target.value
                      }
                    })
                  }}
                >
                  <option value=""></option>
                  {parameterFields.map((field, index) => (
                    <option key={index} value={field}>
                      {field}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol sm={2}>
                  <CFormLabel htmlFor="notification_message" className="col-form-label"><strong>Notification Message</strong></CFormLabel>
                </CCol>
                <CCol md={10}>
                  <CFormTextarea
                    type="text"
                    id="notification_message"
                    name="notification_message"
                    rows={5}
                    value={this.state.newTriggerData.notification_message}
                    onChange={e => {
                      this.setState({
                        newTriggerData:{
                          ...this.state.newTriggerData,
                          notification_message: e.target.value
                        }
                      })
                    }}
                  />
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol sm={2}>
                  <CFormLabel htmlFor="trigger_switch" className="col-form-label"><strong>Active Status</strong></CFormLabel>
                </CCol>
                <CCol md={2}>
                  <CFormSwitch
                    id="trigger_switch"
                    name="trigger_switch"
                    checked={this.state.newTriggerData.trigger_switch}
                    onChange={e=>{
                      this.setState({
                        newTriggerData:{
                          ...this.state.newTriggerData,
                          trigger_switch:e.target.checked
                        }
                      })
                    }}
                  />
                </CCol>
                <CCol sm={2}>
                  <CFormLabel htmlFor="send_sms" className="col-form-label"><strong>SMS</strong></CFormLabel>
                </CCol>
                <CCol md={2}>
                  <CFormSwitch
                    id="send_sms"
                    name="send_sms"
                    checked={this.state.newTriggerData.send_sms}
                    onChange={e=>{
                      this.setState({
                        newTriggerData:{
                          ...this.state.newTriggerData,
                          send_sms:e.target.checked
                        }
                      })
                    }}
                  />
                </CCol>
                <CCol sm={2}>
                  <CFormLabel htmlFor="send_notification" className="col-form-label"><strong>Notify</strong></CFormLabel>
                </CCol>
                <CCol md={2}>
                  <CFormSwitch
                    id="send_notification"
                    name="send_notification"
                    checked={this.state.newTriggerData.send_notification}
                    onChange={e=>{
                      this.setState({
                        newTriggerData:{
                          ...this.state.newTriggerData,
                          send_notification: e.target.checked
                        }
                      })
                    }}
                  />
                </CCol>
              </CRow>
            </CForm>
            <CForm>
            <CRow className="mb-3">
                <CCol sm={2}>
                    <CFormLabel htmlFor="operator" className="col-form-label"><strong>Operator</strong></CFormLabel>
                </CCol>
                <CCol md={4}>
                    <CFormSelect
                        id="operator"
                        name="operator"
                        value={newTrigger.parameter_filter_list_details?.operator || ''}
                        onChange={this.handleChange}
                    >
                        <option></option>
                        <option>greater than</option>
                        <option>greater than or equal</option>
                        <option>less than or equal</option>
                        <option>less than</option>
                        <option>equals</option>
                        <option>not equals</option>
                        <option>is exist</option>
                    </CFormSelect>
                </CCol>
                <CCol sm={2}>
                    <CFormLabel htmlFor="value" className="col-form-label"><strong>Value</strong></CFormLabel>
                </CCol>
                <CCol md={4}>
                    <CFormInput
                        type="text"
                        id="value"
                        name="value"
                        value={newTrigger.parameter_filter_list_details?.value || ''}
                        onChange={this.handleChange}
                    />
                </CCol>
            </CRow>
            <CRow className="mb-3">
                <CCol sm={2}>
                    <CFormLabel htmlFor="logicalOperator" className="col-form-label"><strong>Logical Operator</strong></CFormLabel>
                </CCol>
                <CCol md={10}>
                    <CFormSelect
                        id="logicalOperator"
                        name="logical_operator"
                        value={newTrigger.parameter_filter_list_details?.logical_operator || ''}
                        onChange={this.handleChange}
                    >
                        <option></option>
                        <option>AND</option>
                        <option>OR</option>
                    </CFormSelect>
                </CCol>
            </CRow>
            <CRow className="justify-content-center">
                <CCol xs={1}>
                    <div className='d-grid gap-2'>
                        <CButton className="mt-2" color="primary" onClick={this.handleNewUpdateSave}>
                            Save
                        </CButton>
                    </div>
                </CCol>
            </CRow>
            {/* <CRow className="justify-content-center">
                <CCol xs={1}>
                    <div className='d-grid gap-2'>
                        <CButton className="mt-2" color="primary" onClick={this.testhandleNewUpdateSave}>
                            Test
                        </CButton>
                    </div>
                </CCol>
            </CRow> */}
        </CForm>
          </CModalBody>
          <CRow>
        <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>FILTERS</strong>
          </CCardHeader>
          <CCardBody>
          <CTable striped hover>
            <CTableHead>
              <CTableRow color="dark">
                <CTableHeaderCell scope="col">Sl.No</CTableHeaderCell>
                <CTableHeaderCell scope="col">And / Or</CTableHeaderCell>
                <CTableHeaderCell scope="col">Operation</CTableHeaderCell>
                <CTableHeaderCell scope="col">Value</CTableHeaderCell>
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
            {/* {this.state.newfilter.map((filter, index) => (
                <CTableRow key={index}>
                    <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{filter.logical_operator}</CTableDataCell>
                    <CTableDataCell>{filter.operator}</CTableDataCell>
                    <CTableDataCell>{filter.value}</CTableDataCell>
                    <CTableDataCell>
                        <div className="d-flex gap-2">
                            <CTooltip content="Delete">
                                <CButton style={{ fontSize: '10px', padding: '6px 10px' }} onClick={() => this.handleNewUpdateDelete(filter.id)}>
                                    <CIcon icon={cilTrash} />
                                </CButton>
                            </CTooltip>
                        </div>
                    </CTableDataCell>
                </CTableRow>
            ))} */}
            {this.state.newfilterlist.map((filter, index) => (
                <CTableRow key={index}>
                    <CTableHeaderCell>{index + 1}</CTableHeaderCell>
                    <CTableDataCell>{filter.logical_operator}</CTableDataCell>
                    <CTableDataCell>{filter.operator}</CTableDataCell>
                    <CTableDataCell>{filter.value}</CTableDataCell>
                    <CTableDataCell>
                        <div className="d-flex gap-2">
                            <CTooltip content="Delete">
                                <CButton style={{ fontSize: '10px', padding: '6px 10px' }} onClick={() => this.handleNewUpdateDelete(filter.id)}>
                                    <CIcon icon={cilTrash} />
                                </CButton>
                            </CTooltip>
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
      <CRow className="justify-content-center">
          <CCol xs={1}>
            <div className='d-grid gap-2'>
               <CButton color="primary" type="submit" onClick={this.handleFinalSave}>Save</CButton>
            </div>
          </CCol>
       </CRow>
      <br />
        </CModal>
      </>
    );
  }
}

export default Trigger;