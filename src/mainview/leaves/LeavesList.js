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
))(({ theme, leavestatus }) => ({
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
          leavestatus === 'Approved'
            ? 'green'
            : leavestatus === 'Disapproved'
            ? 'red'
            : theme.palette.mode === 'dark'
            ? '#2ECA45'
            : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity:
          leavestatus === 'Pending'
            ? theme.palette.mode === 'light'
              ? 0.7
              : 0.3
            : 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color:
        leavestatus === 'Approved'
          ? 'green'
          : leavestatus === 'Disapproved'
          ? 'red'
          : '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        leavestatus === 'Pending'
          ? theme.palette.mode === 'light'
            ? theme.palette.grey[300] // Grey color for pending
            : theme.palette.grey[700]
          : leavestatus === 'Approved'
          ? 'green'
          : 'red',
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity:
        leavestatus === 'Pending'
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
      leavestatus === 'Approved'
        ? 'green'
        : leavestatus === 'Disapproved'
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
        totalRows: 0,
        rowsPerPageOptions: [5,10,20,50,100],
        pageSize: 10,
        page: 1
      });
    const [filterModel, setFilterModel] = useState({items: [{columnField: '',operatorValue: '',value: '',},],});
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
  }, [data.page,data.pageSize,filterModel]);

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
    let counter = 1;
    let leaveRows = [];

    axios({
      method: 'post',
      url:'leaves_list',
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      data: {
        pageSize: data.pageSize,
        page: data.page,
        filters: filterModel, // pass filterModel to the server,
        role: localStorage.getItem('role'),
        emp_id: localStorage.getItem('bio_id')
      },
    })
    .then(function (response) {
                    // setTotalRows(response.total_rows);
                    if (response.data.leave_rows) {
                      response.data.leave_rows.forEach((element,index) => {
                        leaveRows.push({
                          id: counter,
                          full_name: element.full_name,
                          leave_type_readable: element.leave_type_readable,
                          leave_start: element.readable_start_date,
                          leave_end: element.readable_end_date,
                          leave_add: element.add_date,
                          leave_status: element.leave_status_readable,
                          weekend_count: element.weekend_count,
                          saturdays: element.saturdays,
                          sundays: element.sundays,
                          reason: element.reason,
                          time: element.readable_add_date,
                          page:response.data.page,
                          pagesize:response.data.pagesize,
                          leave_id:element.id,
                          key: index
                        });
                        counter++;
                      });
                    } else {
                      // navigate('/');
                    }

            setTimeout(() => {
              const rows = leaveRows;
              updateData("totalRows", response.data.total_rows);
                  setTimeout(() => {
                    updateData("loading", false);
                  }, 100);
                  updateData("rows", rows);
            }, 100);
    })
    .catch(error => { console.log(error); })
}

const handleToggleLeaveApproval = (leaveId, currentStatus,rowId) => {
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
        row.id === rowId ? { ...row, leave_status: newStatus } : row
      );
      setData((prevData) => ({ ...prevData, rows: updatedRows }));
    })
    .catch((error) => console.error(error));
};

const columns = [
  { field: 'id', headerName: 'ID',width:80,headerAlign:'center',align:'center',
  filterable: false,
  renderCell: (value) => {
    
    const currentPage = value.row.page;
    const pageSize = value.row.pagesize;
    const rowNumber = (currentPage - 1) * pageSize + value.api.getRowIndex(value.row.id) + 1;
    console.log(currentPage)
    console.log(pageSize)
    console.log(rowNumber)
    return <div>{rowNumber}</div>;
  },
  },
  { field: 'full_name', headerName: 'Name', width: 170 ,headerAlign:'center',align:'center'},
  { field: 'leave_type_readable', headerName: 'Leave Type', width: 90 ,headerAlign:'center',align:'center'},
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
  { field: 'leave_status', headerName: 'status', width: 100 ,headerAlign:'center',align:'center'},
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
          onChange={() => handleToggleLeaveApproval(params.row.leave_id, params.row.leave_status,params.row.id)}
          leavestatus={params.row.leave_status}
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
                rowsPerPageOptions={data.rowsPerPageOptions}
                pagination
                page={data.page-1}
                pageSize={data.pageSize}
                paginationMode="server"
                onPageChange={(newpage) => {
                  updateData("page", newpage+1);
                }}
                onPageSizeChange={(newPageSize) => {
                  updateData("page", 1);
                  updateData("pageSize", newPageSize);
                }}
                rowCount={data.totalRows}
                rows={data.rows}
                columns={columns}
                // filterMode="client"
                // enable server-side filtering
                // onFilterModelChange={
                //   (newFilterModel) => setFilterModel(newFilterModel)
                // }
                //  handle filter changes made by the user
                // filterModel={filterModel}
                // pass filterModel state to the DataGrid component
              />
          </div>
          <ToastContainer/>
        </>
      )
}

export default LeavesList