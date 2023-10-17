import React, { useEffect, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add'
import CustomizedDialogs from '../../components/dialog';
import AddLeave from '../../forms/add_leave/AddLeave';
import { Box,Switch,styled} from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme, leaveStatus }) => ({
  width: 42,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor:
          leaveStatus === 'Approved'
            ? 'green'
            : leaveStatus === 'Disapproved'
            ? 'red'
            : theme.palette.mode === 'dark'
            ? '#2ECA45'
            : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity:
          leaveStatus === 'Pending'
            ? theme.palette.mode === 'light'
              ? 0.7
              : 0.3
            : 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color:
        leaveStatus === 'Approved'
          ? 'green'
          : leaveStatus === 'Disapproved'
          ? 'red'
          : '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        leaveStatus === 'Pending'
          ? theme.palette.mode === 'light'
            ? theme.palette.grey[300] // Grey color for pending
            : theme.palette.grey[700]
          : leaveStatus === 'Approved'
          ? 'green'
          : 'red',
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity:
        leaveStatus === 'Pending'
          ? theme.palette.mode === 'light'
            ? 0.7
            : 0.3
          : 0.5,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor:
      leaveStatus === 'Approved'
        ? 'green'
        : leaveStatus === 'Disapproved'
        ? 'red'
        : theme.palette.mode === 'light'
        ? '#E9E9EA'
        : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

  const LeavesList = () => {
      const [data, setData] = useState({
        loading: true,
        rows: [],
        // totalRows: 0,
        // rowsPerPageOptions: [5,10,20,50,100],
        pageSize: 10,
        page: 1
      });
    // const [filterModel, setFilterModel] = useState({items: [{columnField: '',operatorValue: '',value: '',},],});
    const [users,setUsers] = useState([]);
    const [showDialog,setShowDialog] = useState(false)
    const updateData = (k, v) => setData((prev) => ({ ...prev, [k]: v }));
    // const navigate = useNavigate();
    var userRecords = [];

    // Extract the value of LocalStorage.getItem('role') to a variable
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    // updateData('loading', true);
      refreshUsersList()
          refreshLeavesList()
  }, [data.page,data.pageSize]);

  const refreshUsersList = () => {
          // api call for users list START
          axios({
            method: 'get',
            url:'user_list',
            headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),
          }
          })
            .then(function (response) {
                response.data.user_info.forEach(element => {
                    userRecords.push({'id':element.bio_ref_id,'uname':element.fname + ' ' + element.lname , 'email':element.email,
                    'password':element.password, 'sitename':element.site_name, 'contact':element.contact, 'address':element.address,
                  'empType':element.type_of_employee, 'consultant':element.consultant, 'empSec':element.section_name,'empField':element.field_name,
                'empRole':element.role_name,})
                });
                setUsers(userRecords);
            })
            .catch(error => {});// api call for users list END
  }

  const refreshLeavesList = () => {
    setShowDialog(false)
    let leaveRows = [];

    axios({
      method: 'get',
      url:'leaves_list/'+localStorage.getItem('role')+'/'+localStorage.getItem('bio_id'),
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      data: {
        pageSize: data.pageSize,
        page: data.page,
        role: localStorage.getItem('role'),
        emp_id: localStorage.getItem('bio_id')
        // filters: filterModel
        // pass filterModel to the server,
      },
    })
    .then(function (response) {
                    // setTotalRows(response.total_rows);
                    if (response.data.leave_info) {
                      response.data.leave_info.forEach((element,index) => {
                        leaveRows.push({
                          id: element.id,
                          name: element.full_name,
                          leave_type: element.leave_type_readable,
                          leave_start: element.readable_start_date,
                          leave_end: element.readable_end_date,
                          leave_add: element.add_date,
                          leave_status: element.leave_status_readable,
                          weekend_count: element.weekend_count,
                          saturdays: element.saturdays,
                          sundays: element.sundays,
                          reason: element.reason,
                          time: element.readable_add_date,
                          key: index
                        });
                      });
                    } else {
                      // navigate('/');
                    }

            setTimeout(() => {
              const rows = leaveRows;
              // updateData("totalRows", response.data.total_rows);
                  setTimeout(() => {
                    updateData("loading", false);
                  }, 100);
                  updateData("rows", rows);
            }, 100);
    })
    .catch(error => { console.log(error); })
}

const handleToggleLeaveApproval = (leaveId, currentStatus) => {
  // Determine the new status based on the current status
  let newStatus;
  if (currentStatus === 'Pending') {
    newStatus = 'Approved';
  } else if (currentStatus === 'Approved') {
    newStatus = 'Disapproved';
  } else if (currentStatus === 'Disapproved') {
    newStatus = 'Approved';
  }

  // Send an API request to update the leave status
  axios({
    method: 'post',
    url: newStatus === 'Approved' ? 'approve_leave' : 'disapprove_leave',
    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
    data: {
      leave_id: leaveId,
    },
  })
    .then(function (response) {
      if (response.data.status === '200') {
        toast.success(`Leave ${newStatus}`, {
          position: 'top-right',
          autoClose: 1000,
          onClose: () => {
            // Handle any redirection or page refresh if needed
          },
        });
      } else {
        toast.error('Failed to update leave status', {
          position: 'top-right',
          autoClose: 1000,
        });
      }

      // After a successful API response, update the state to reflect the change.
      const updatedRows = data.rows.map((row) =>
        row.id === leaveId ? { ...row, leave_status: newStatus } : row
      );
      setData((prevData) => ({ ...prevData, rows: updatedRows }));
    })
    .catch((error) => console.error(error));
};

const columns = [
  { field: 'id', headerName: 'ID',width:80,headerAlign:'center',align:'center'},
  { field: 'name', headerName: 'Name', width: 170 ,headerAlign:'center',align:'center'},
  { field: 'leave_type', headerName: 'Leave Type', width: 90 ,headerAlign:'center',align:'center'},
  { field: 'leave_start', headerName: 'Start', width: 200 ,headerAlign:'center',align:'center'},
  { field: 'leave_end', headerName: 'End', width: 200 ,headerAlign:'center',align:'center'},
  { field: 'leave_add', headerName: 'Add', width: 200 ,headerAlign:'center',align:'center',
  renderCell: (value) => {
    const inputDateTime = value.value; // Get the date and time string from your data
    const dateValue = new Date(inputDateTime); // Parse the date and time string into a Date object

    // Define options for formatting
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false, // Use 24-hour format
    };

    // Format the date and time as a human-readable string
    const formattedDateTime = dateValue.toLocaleDateString('en-US', options);

    return <div>{formattedDateTime}</div>;
  }},
  { field: 'leave_status', headerName: 'Status', width: 100 ,headerAlign:'center',align:'center'},
  // { field: 'weekend_count', headerName: 'WeekEnd', width: 100 ,headerAlign:'center',align:'center'},
  // { field: 'saturdays', headerName: 'Saturday', width: 100 ,headerAlign:'center',align:'center'},
  // { field: 'sundays', headerName: 'Sunday', width: 100 ,headerAlign:'center',align:'center'},
  { field: 'reason', headerName: 'Reason', width: 210 ,headerAlign:'center',align:'center'},
  {
    field: 'action',
    headerName: 'Action',
    width: 175,
    hide: userRole !== '3',
    renderCell: (params) => (
      <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <IOSSwitch
          color="primary"
          checked={params.row.leave_status === 'Approved'}
          onChange={() => handleToggleLeaveApproval(params.row.id, params.row.leave_status)}
          leaveStatus={params.row.leave_status}
        />
        </Box>
      </>
    ),
    headerAlign: 'center',
    align: 'center',
  },
  { field: 'time', headerName: 'Adding Time',hide: userRole === '3', width: 220 ,headerAlign:'center',align:'center'},
];

    return (
        <>
          <div style={{ height: 'auto', width: '100%' }}>
          <Box sx={{marginLeft:'97%', position: "absolute",top:'72px',right:'20px'}}>
                <CustomizedDialogs size='small' title= "Add New Leave" icon={<AddIcon />} showDialog = { showDialog } setShowDialog = { v => setShowDialog(v) }>
                    <AddLeave employees={users} refreshList = {refreshLeavesList }/>
                </CustomizedDialogs>
            </Box>
              <DataGrid
                density="compact"
                autoHeight
                // rowHeight={50}
                loading={data.loading}
                // rowsPerPageOptions={data.rowsPerPageOptions}
                // pagination
                // page={data.page-1}
                // pageSize={data.pageSize}
                // paginationMode="server"
                // onPageChange={(newpage) => {
                //   updateData("page", newpage+1);
                // }}
                // onPageSizeChange={(newPageSize) => {
                //   updateData("page", 1);
                //   updateData("pageSize", newPageSize);
                // }}
                rowCount={data.totalRows}
                rows={data.rows}
                columns={columns}
                // filterMode="server"
                // enable server-side filtering
                // onFilterModelChange={
                //   (newFilterModel) => setFilterModel(newFilterModel)
                // }
                 // handle filter changes made by the user
                // filterModel={filterModel}
                // pass filterModel state to the DataGrid component
              />
          </div>
          <ToastContainer/>
        </>
      )
}

export default LeavesList