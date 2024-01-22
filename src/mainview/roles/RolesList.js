import React,{useState, useEffect} from "react";
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import { Box,Typography,Switch,styled } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import {IconButton} from '@mui/material'
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import {green } from '@mui/material/colors';
import './Roles.css';

// Styling part of toogle button  which is used for approval and disapproval of leaves START
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
  //END Styling part of toogle button  which is used for approval and disapproval of leaves

    const RolesList = () => {
    const [rolesList,setRolesList] = useState([])
    const [loading,setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                await refreshRolesList();
            } catch (error) {
                console.error('Error fetching roles list:', error);
            }
        };

        fetchData();
        // refreshRolesList();
    }, []);

    const refreshRolesList = async () => {
        try {
            const response = await axios.get('roles_list', {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
            });

            const rolesRecords = response.data.role_info.map(element => ({
                'id':element.id,
                'name':element.name,
                'read_permission':element.read_permission,
                'write_permission':element.write_permission,
                'edit_permission':element.edit_permission,
                'approval_permission':element.approval_permission,
                'delete_permission':element.delete_permission,
                'modules':element.modules,
                'employees': element.employees,
                'sites': element.sites,
            }));

            setRolesList(rolesRecords);
            setLoading(false);
        } catch (error) {
            console.error('Error refreshing roles list:', error);
        }
    };

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
                  const updatedRows = rolesList.map((row) =>
                    row.id === rowId ? { ...row, leave_status: newStatus } : row
                  );
                  setRolesList((prevData) => ({ ...prevData, rows: updatedRows }));
                })
                .catch((error) => console.error(error));
        };


    const handleDeleteModule = (chipToDelete, rowId) => () => {
        axios({
            method: 'post',
            url: 'delete_module_from_pivot',
            headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),},
            data: {
                module_id: chipToDelete.module_id,
                role_id: chipToDelete.id
            },
            })
            .then(function (response) {
                if(response.data.status === '200'){
                    setRolesList((prevRolesList) =>
                    prevRolesList.map((role) =>
                        role.id === rowId
                            ?   {
                                    ...role,
                                    modules: role.modules.filter((data) => data !== chipToDelete)
                                }
                            : role
                    ));
                }
                else{ console.error('module could not deleted') }
            })
            .catch(error => {
                console.log(error);
                })
    };

    const handleDeleteEmployee = (chipToDelete, rowId) => () => {

        axios({
            method: 'post',
            url: 'delete_employee_from_pivot',
            headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),},
            data: {
                emp_id: chipToDelete.emp_id,
                role_id: chipToDelete.id
            },
            }
            )
            .then(function (response) {
                if(response.data.status === '200'){
                setRolesList((prevRolesList) =>
                prevRolesList.map((role) =>
                    role.id === rowId
                        ?   {
                                ...role,
                                employees: role.employees.filter((data) => data !== chipToDelete)
                            }
                        : role
                )
                );
                }
                else{ console.error('employees could not deleted') }
            })
            .catch(error => {
                console.log(error);
                })
    };

    const handleDeleteSite = (chipToDelete, rowId) => () => {
        axios({
            method: 'post',
            url: 'delete_site_from_pivot',
            headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),},
            data: {
                site_id: chipToDelete.site_id,
                role_id: chipToDelete.id
            },
            }
            )
            .then(function (response) {
                if(response.data.status === '200'){
                    setRolesList((prevRolesList) =>
                    prevRolesList.map((role) =>
                        role.id === rowId
                            ?   {
                                    ...role,
                                    sites: role.sites.filter((data) => data !== chipToDelete)
                                }
                            : role
                    )
                );
                }
                else{ console.error('module could not deleted') }
            })
            .catch(error => {
                console.log(error);
                })
    };

    const columns = [
        { field: 'id', headerName: 'ID',headerAlign:'center',align:'center' },
        { field: 'name', headerName: 'Role Name', width: 200,headerAlign:'center',align:'center' },
        // { field: 'read_permission', headerName: 'Read', width: 80,headerAlign:'center',align:'center' },
        { field: 'write_permission', headerName: 'Write', width: 80,headerAlign:'center',align:'center' },
        { field: 'edit_permission', headerName: 'Edit', width: 80,headerAlign:'center',align:'center' },
        { field: 'approval_permission', headerName: 'Apporval', width: 80,headerAlign:'center',align:'center' },
        { field: 'delete_permission', headerName: 'Delete', width: 80,headerAlign:'center',align:'center' },
        { field: 'modules', headerName: 'Modules', width: '340' , headerAlign:'center',
        renderCell: (params) => (
            <>
                <div className="modules-cell">
                    {params.row.modules.map((data, index) => {
                        let icon;
                        icon = (
                            <Avatar sx={{ width: 20, height: 20, bgcolor: green[700] }} style={{ color: '#ffff' }}>
                                <Typography variant="body2" sx={{ fontSize: 12 }}>
                                    {index + 1}
                                </Typography>
                            </Avatar>
                        );
                        // if (data.length > 0) {
                            return data && data.module_name ? (  // Use ternary operator for conditional rendering
                        <Chip
                            key={index}
                            style={{ color: green[700] }}
                            size="small"
                            icon={icon}
                            label={data.module_name}
                            onDelete={params.row.name === 'Individual' ? undefined : handleDeleteModule(data, params.row.id)}
                        />
                    ) : null;
                        // }
                        // return null; // Add this line to satisfy ESLint
                    })}
                </div>
            </>
        ),

        },

        { field: 'employees', headerName: 'Employees', width: '340' , headerAlign:'center',
        renderCell: (params) => (
            <>
            <div className="modules-cell" >
                        {
                        params.row.employees.map((data,index) => {
                        let icon;
                            icon = <Avatar sx={{  width: 20, height: 20, bgcolor: green[700], }} style={{ color: '#ffff' }}>
                                                    <Typography variant="body2" sx={{ fontSize: 12 }}>
                                                        {index + 1}
                                                    </Typography>
                                                    </Avatar>;
                        return data && data.employee_name ? (
                            <Chip
                            style={{ color: green[700] }}
                            key={index}
                            size="small"
                            icon={icon}
                            label={data.employee_name}
                            onDelete={params.row.name === 'Individual' ? undefined : handleDeleteEmployee(data,params.row.id)}
                            />
                        ) : null;
                        })
                        }
                    </div>
                </>
            ),
        },
        { field: 'sites', headerName: 'Sites', width: '340' , headerAlign:'center',
        renderCell: (params) => (
            <>
            <div className="modules-cell" >
                        {
                        params.row.sites.map((data,index) => {
                        let icon;
                            icon = <Avatar sx={{  width: 20, height: 20, bgcolor: green[700], }} style={{ color: '#ffff' }}>
                                                    <Typography variant="body2" sx={{ fontSize: 12 }}>
                                                        {index + 1}
                                                    </Typography>
                                                    </Avatar>;
                        return data && data.site_name ? (
                            <Chip
                            key={index}
                            style={{ color: green[700] }}
                            size="small"
                            icon={icon}
                            label={data.site_name}
                            onDelete={params.row.name === 'Individual' ? undefined : handleDeleteSite(data,params.row.id)}
                            />
                        ) : null;
                        })
                        }
                    </div>
                </>
            ),
        },
        // { field: 'end', headerName: 'End Time', width: 150 },
    ];

    return (
        <div style={{height:'auto', width: '100%', marginBottom:'2px' }}>
            <Box sx={{marginLeft:'97%', position: "absolute",top:'72px',right:'20px'}}>
                {/* <CustomizedDialogs size='small' title= "Add New Shift" icon={<AddIcon />} showDialog = { showDialog } setShowDialog = { v => setShowDialog(v) }>
                    <AddShift refreshList = { refreshShiftsList } />
                </CustomizedDialogs> */}
            </Box>
            <DataGrid density="standard" loading={loading} autoHeight rows={rolesList} columns={columns}/>
        </div>
    )
}

export default RolesList