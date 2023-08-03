import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add'
import CustomizedDialogs from '../../components/dialog';
import AddLeave from '../../forms/add_leave/AddLeave';
import { Box,Switch,styled} from '@mui/material';
import { alpha } from '@mui/material';
import { pink } from '@mui/material/colors';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
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
        backgroundColor: theme.palette.mode === 'dark' ? '#2ECA45' : '#65C466',
        opacity: 1,
        border: 0,
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#33cf4d',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color:
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[600],
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: theme.palette.mode === 'light' ? 0.7 : 0.3,
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 22,
    height: 22,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: theme.palette.mode === 'light' ? '#E9E9EA' : '#39393D',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
  },
}));

const PinkSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: pink[600],
    '&:hover': {
      backgroundColor: alpha(pink[600], theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: pink[600],
  },
}));

  const LeavesList = () => {
      const [data, setData] = useState({
        loading: true,
        rows: [],
        // totalRows: 0,
        // rowsPerPageOptions: [5,10,20,50,100],
        // pageSize: 10,
        // page: 1
      });
    // const [filterModel, setFilterModel] = useState({items: [{columnField: '',operatorValue: '',value: '',},],});
    const [users,setUsers] = useState([]);
    const [showDialog,setShowDialog] = useState(false)
    const updateData = (k, v) => setData((prev) => ({ ...prev, [k]: v }));
    const navigate = useNavigate();
    let leaveRows = [];
    var userRecords = [];

    // Extract the value of LocalStorage.getItem('role') to a variable
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    // updateData('loading', true);
      refreshUsersList()
          refreshLeavesList()
  }, []);

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
                      response.data.leave_info.forEach((element) => {
                        leaveRows.push({
                          id: element.id,
                          name: element.full_name,
                          leave_type: element.leave_type_readable,
                          leave_start: element.readable_start_date,
                          leave_end: element.readable_end_date,
                          leave_status: element.leave_status_readable,
                          weekend_count: element.weekend_count,
                          saturday_count: element.saturday_count,
                          sunday_count: element.sunday_count,
                          reason: element.reason,
                          time: element.readable_add_date,
                        });
                      });
                    } else {
                      navigate('/');
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

const handleApprovalToggle = (leaveId) => {
  // Send an API request to update the leave status to "Approved" for the given leaveId.
  axios({
    method: 'post',
    url: 'approve_leave',
    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
    data: {
      leave_id : leaveId
    },
})
.then(
    function (response) {
      if(response.data.status==='200'){
                      toast.success('Leave Approved', {
                                        position:'top-right',
                                        autoClose:1000,
                                        onClose: () => {
                                          // refreshList();
                                         // navigate('/home/shifts'); // Redirect to Schedule component
                                          //window.location.reload(); // Refresh the page
                                      }
                                    });
      }
      else{
                      toast.success('not on leave', {
                            position:'top-right',
                            autoClose:1000,
                            // onClose: () => navigate('/home')
                        });
        }
    }
)
.catch(error => console.error(error));
  // After successful API response, you can update the state to reflect the change.
  // For example:
  const updatedRows = data.rows.map((row) =>
    row.id === leaveId ? { ...row, leave_status: 'Approved' } : row
  );
  setData((prevData) => ({ ...prevData, rows: updatedRows }));
};

const handleDisapprovalToggle = (leaveId) => {
  // Send an API request to update the leave status to "Disapproved" for the given leaveId.
  axios({
    method: 'post',
    url: 'disapprove_leave',
    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
    data: {
      leave_id : leaveId
    },
})
.then(
    function (response) {
      if(response.data.status==='200'){
                      toast.success('Leave Disapproved', {
                                        position:'top-right',
                                        autoClose:1000,
                                        onClose: () => {
                                          // refreshList();
                                         // navigate('/home/shifts'); // Redirect to Schedule component
                                          //window.location.reload(); // Refresh the page
                                      }
                                    });
      }
      else{
                      toast.success('not on leave', {
                            position:'top-right',
                            autoClose:1000,
                            // onClose: () => navigate('/home')
                        });
        }
    }
)
.catch(error => console.error(error));
  // After successful API response, you can update the state to reflect the change.
  // For example:
  const updatedRows = data.rows.map((row) =>
    row.id === leaveId ? { ...row, leave_status: 'Disapproved' } : row
  );
  setData((prevData) => ({ ...prevData, rows: updatedRows }));
};

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID',width:80,headerAlign:'center',align:'center'},
  { field: 'name', headerName: 'Name', width: 150 ,headerAlign:'center',align:'center'},
  { field: 'leave_type', headerName: 'Leave Type', width: 90 ,headerAlign:'center',align:'center'},
  { field: 'leave_start', headerName: 'Leave Start', width: 200 ,headerAlign:'center',align:'center'},
  { field: 'leave_end', headerName: 'Leave End', width: 200 ,headerAlign:'center',align:'center'},
  { field: 'leave_status', headerName: 'Leave Status', width: 100 ,headerAlign:'center',align:'center'},
  { field: 'weekend_count', headerName: 'WeekEnd', width: 80 ,headerAlign:'center',align:'center'},
  { field: 'saturday_count', headerName: 'Saturday', width: 80 ,headerAlign:'center',align:'center'},
  { field: 'sunday_count', headerName: 'Sunday', width: 80 ,headerAlign:'center',align:'center'},
  { field: 'reason', headerName: 'Reason', width: 210 ,headerAlign:'center',align:'center'},
  {
    field: 'action',
    headerName: 'Action',
    width: 200,
    hide: userRole !== '3',
    renderCell: (params) => (
      <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <IOSSwitch
          color="primary"
          checked={params.row.leave_status === 'Approved'}
          label="iOS style"
          onChange={() => handleApprovalToggle(params.row.id)}
        />
        </Box>
        <Box>
        <PinkSwitch
          color="secondary"
          checked={params.row.leave_status === 'Disapproved'}
          onChange={() => handleDisapprovalToggle(params.row.id)}
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
                    <AddLeave employees={users} refreshList = { refreshLeavesList }/>
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