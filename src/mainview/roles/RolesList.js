import React,{useState, useEffect} from "react";
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import CustomizedDialogs from '../../components/dialog';
import AddRole from "../../forms/add_role/AddRole";
import { Box,Typography,Switch,styled } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';

import AddIcon from '@mui/icons-material/Add'
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import './RolesList.css';

// Styling part of toogle button  which is used for approval and disapproval of leaves START
const IOSSwitch = styled((props: SwitchProps) => (
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
  //END Styling part of toogle button  which is used for approval and disapproval of leaves

    const RolesList = () => {
    const [rolesList,setRolesList] = useState([])
    const [loading,setLoading] = useState(true)
    // const [dialogMode, setDialogMode] = useState('add');
    // const [users,setUsers] = useState([]);
    const [showDialog,setShowDialog] = useState(false)
    const approvalPermission = localStorage.getItem('approval_permission');
    const writePermission = localStorage.getItem('write_permission');
    // const userRole = localStorage.getItem('role');

    useEffect(() => {
        const fetchRoles = async () => {
            try {
                await refreshRolesList();
            } catch (error) {
                console.error('Error fetching roles list:', error);
            }
        };

        // const fetchEmployees = async () => {
        //     try {
        //         await refreshUsersList();
        //     } catch (error) {
        //         console.error('Error fetching roles list:', error);
        //     }
        // };

        fetchRoles();
        // fetchEmployees();
    }, []);

//     const refreshUsersList = () => {
//         let userRecords = [];
//         // api call for users list START
//               axios({
//                 method: 'post',
//                 url:'employees_list_for_filters',
//                 headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),},
//                 data: { employees: JSON.parse(localStorage.getItem('employees'))},
//               })
//                 .then(function (response) {
//                     response.data.user_info.forEach(element => {
//                         userRecords.push({'id':element.bio_ref_id,'fullname':element.fullname , 'email':element.email,
//                         'password':element.password, 'sitename':element.site_name, 'contact':element.contact, 'address':element.address,
//                       'empType':element.type_of_employee, 'consultant':element.consultant, 'empSec':element.section_name,'empField':element.field_name,
//                     'empRole':element.role_name,})
//                     });
//                     setUsers(userRecords);
//                 })
//                 .catch(error => {});// api call for users list END
// }

    const refreshRolesList = async () => {
      setShowDialog(false)
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

    const handleToggleWritePermission = (roleId, currentStatus,rowId) => {
        // Determine the new status based on the current status
        let newStatus;
        if (currentStatus === '0') {
          newStatus = '1';
        } else if (currentStatus === '1') {
          newStatus = '0';
        }
        // } else if (currentStatus === 'Disapproved') {
        //   newStatus = 'Approved';
        // }
              // Send an API request to update the leave status
              axios({
                method: 'post',
                url: 'toggle_write_permission',
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
                data: {
                  role_id: roleId,
                },
              })
                .then(function (response) {
                  if (response.data.status === '200') {
                    toast.success(`Write Permission Updated`, { position: 'top-right', autoClose: 1000, onClose: () => { /* Handle any redirection or page refresh if needed */ },});
                  } else {
                    toast.error('Failed to update leave status', { position: 'top-right', autoClose: 1000, });
                  }
                  // After a successful API response, update the state to reflect the change.
                  const updatedRows = rolesList.map((row) =>
                    row.id === rowId ? { ...row, write_permission: newStatus } : row
                  );
                  setRolesList(updatedRows);
                })
                .catch((error) => console.error(error));

    };

    const handleToggleEditPermission = (roleId, currentStatus,rowId) => {
        // Determine the new status based on the current status
        let newStatus;
        if (currentStatus === '0') {
          newStatus = '1';
        } else if (currentStatus === '1') {
          newStatus = '0';
        }
        // } else if (currentStatus === 'Disapproved') {
        //   newStatus = 'Approved';
        // }
              // Send an API request to update the leave status
              axios({
                method: 'post',
                url: 'toggle_edit_permission',
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
                data: {
                  role_id: roleId,
                },
              })
                .then(function (response) {
                  if (response.data.status === '200') {
                    toast.success(`Edit Permission Updated`, {position: 'top-right',autoClose: 1000,onClose: () => {/* Handle any redirection or page refresh if needed */}, });
                  } else {
                    toast.error('Failed to update Role', {position: 'top-right', autoClose: 1000, });
                  }
                  // After a successful API response, update the state to reflect the change.
                  const updatedRows = rolesList.map((row) =>
                    row.id === rowId ? { ...row, edit_permission: newStatus } : row
                  );
                  setRolesList(updatedRows);
                })
                .catch((error) => console.error(error));

    };

    const handleToggleApprovePermission = (roleId, currentStatus,rowId) => {
        // Determine the new status based on the current status
        let newStatus;
        if (currentStatus === '0') {
          newStatus = '1';
        } else if (currentStatus === '1') {
          newStatus = '0';
        }
              // Send an API request to update the leave status
              axios({
                method: 'post',
                url: 'toggle_approve_permission',
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
                data: {
                  role_id: roleId,
                },
              })
                .then(function (response) {
                  if (response.data.status === '200') {
                    toast.success(`Approve Permission Updated`, {
                      position: 'top-right',
                      autoClose: 1000,
                      onClose: () => {
                        // Handle any redirection or page refresh if needed
                      },
                    });
                  } else {
                    toast.error('Failed to update Approve Permission', {
                      position: 'top-right',
                      autoClose: 1000,
                    });
                  }
                  // After a successful API response, update the state to reflect the change.
                  const updatedRows = rolesList.map((row) =>
                    row.id === rowId ? { ...row, approval_permission: newStatus } : row
                  );
                  setRolesList(updatedRows);
                })
                .catch((error) => console.error(error));
    };

    const handleToggleDeletePermission = (roleId, currentStatus,rowId) => {
        // Determine the new status based on the current status
        let newStatus;
        if (currentStatus === '0') {
          newStatus = '1';
        } else if (currentStatus === '1') {
          newStatus = '0';
        }
              // Send an API request to update the leave status
              axios({
                method: 'post',
                url: 'toggle_delete_permission',
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
                data: {
                  role_id: roleId,
                },
              })
                .then(function (response) {
                  if (response.data.status === '200') {
                    toast.success(`Delelte Permission Updated`, {
                      position: 'top-right',
                      autoClose: 1000,
                      onClose: () => {
                        // Handle any redirection or page refresh if needed
                      },
                    });
                  } else {
                    toast.error('Failed to update Delete Permission', {
                      position: 'top-right',
                      autoClose: 1000,
                    });
                  }
                  // After a successful API response, update the state to reflect the change.
                  const updatedRows = rolesList.map((row) =>
                    row.id === rowId ? { ...row, delete_permission: newStatus } : row
                  );
                  setRolesList(updatedRows);
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

    const ConditionalComponent = ({ role }) => {
        if (role ==='4') {
          return <Box sx={{marginLeft:'97%', position: "absolute",top:'80px',right:'20px'}}>
                  </Box>;
        } else {
          return <Box sx={{marginLeft:'97%', position: "absolute",top:'100px',right:'20px'}}>
                      <CustomizedDialogs size='small' title= "Add New Role" icon={<AddIcon />} showDialog = { showDialog } setShowDialog = { (v) => setShowDialog(v) } refreshList={refreshRolesList}>
                          <AddRole  refreshList = { refreshRolesList }/>
                      </CustomizedDialogs>
                  </Box>
        }
      }

    const columns = [
        { field: 'id', headerName: 'ID',headerAlign:'center',align:'center' },
        { field: 'name', headerName: 'Role Name', width: 200,headerAlign:'center',align:'center' },
        // { field: 'read_permission', headerName: 'Read', width: 80,headerAlign:'center',align:'center' },
        { field: 'write_permission', headerName: 'Write', width: 85, hide: approvalPermission !== '1',headerAlign: 'center', align: 'center',
        renderCell: (params) => (
            <>
            <Box display="flex" justifyContent="space-between" alignItems="center">
            <IOSSwitch
                color="primary"
                checked={params.row.write_permission === '1'}
                onChange={() => handleToggleWritePermission(params.row.id, params.row.write_permission,params.row.id)}
                status={params.row.write_permission}
                disabled={writePermission !== '1'} // Disable for non-admin users
            />
            </Box>
            </>
        ),
        },
        { field: 'edit_permission', headerName: 'Edit', width: 85, hide: approvalPermission !== '1',headerAlign: 'center', align: 'center',
                renderCell: (params) => (
                <>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <IOSSwitch
                    color="primary"
                    checked={params.row.edit_permission === '1'}
                    onChange={() => handleToggleEditPermission(params.row.id, params.row.edit_permission,params.row.id)}
                    status={params.row.edit_permission}
                    disabled={approvalPermission !== '1'} // Disable for non-admin users
                    />
                    </Box>
                </>
                ), },
        { field: 'approval_permission', headerName: 'Apporve', width: 85, hide: approvalPermission !== '1',headerAlign: 'center', align: 'center',
        renderCell: (params) => (
        <>
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <IOSSwitch
            color="primary"
            checked={params.row.approval_permission === '1'}
            onChange={() => handleToggleApprovePermission(params.row.id, params.row.approval_permission,params.row.id)}
            status={params.row.approval_permission}
            disabled={approvalPermission !== '1'} // Disable for non-admin users
            />
            </Box>
        </>
        ), },
        { field: 'delete_permission', headerName: 'Delete', width: 85 ,hide: approvalPermission !== '1',headerAlign: 'center', align: 'center',
        renderCell: (params) => (
        <>
        <Box display="flex" justifyContent="space-between" alignItems="center">
            <IOSSwitch
            color="primary"
            checked={params.row.delete_permission === '1'}
            onChange={() => handleToggleDeletePermission(params.row.id, params.row.delete_permission,params.row.id)}
            status={params.row.delete_permission}
            disabled={approvalPermission !== '1'} // Disable for non-admin users
            />
            </Box>
        </>
        ), },
        { field: 'modules', headerName: 'Modules', width: '340' , headerAlign:'center',
        renderCell: (params) => (
            <>
                <div className="modules-cell">
                    {params.row.modules.map((data, index) => {
                        let icon;
                        icon = (
                            <Avatar sx={{ width: 20, height: 20, bgcolor: '#582a1d' }} style={{ color: '#ffff' }}>
                                <Typography variant="body2" sx={{ fontSize: 12 }}>
                                    {index + 1}
                                </Typography>
                            </Avatar>
                        );
                        // if (data.length > 0) {
                            return data && data.module_name ? (  // Use ternary operator for conditional rendering
                        <Chip
                            key={index}
                            style={{ color: '#582a1d' }}
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
                            icon = <Avatar sx={{  width: 20, height: 20, bgcolor: '#582a1d', }} style={{ color: '#ffff' }}>
                                                    <Typography variant="body2" sx={{ fontSize: 12 }}>
                                                        {index + 1}
                                                    </Typography>
                                                    </Avatar>;
                        return data && data.employee_name ? (
                            <Chip
                            style={{ color: '#582a1d' }}
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
                            icon = <Avatar sx={{  width: 20, height: 20, bgcolor: '#582a1d', }} style={{ color: '#ffff' }}>
                                                    <Typography variant="body2" sx={{ fontSize: 12 }}>
                                                        {index + 1}
                                                    </Typography>
                                                    </Avatar>;
                        return data && data.site_name ? (
                            <Chip
                            key={index}
                            style={{ color: '#582a1d' }}
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
            <ConditionalComponent role={localStorage.getItem('role')}/>
            <DataGrid density="standard" loading={loading} autoHeight rows={rolesList} columns={columns}/>
            <ToastContainer/>
        </div>
    )
}

export default RolesList