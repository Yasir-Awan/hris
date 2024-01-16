import React,{useState, useEffect} from "react";
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import { Box,Typography } from '@mui/material';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import { blue } from '@mui/material/colors';
import './Roles.css';

    const RolesList = () => {
    const [rolesList,setRolesList] = useState([])
    const [loading,setLoading] = useState(true)

    useEffect(() => {
        refreshRolesList();
    }, []);

    const refreshRolesList = () => {
        let rolesRecords =[];
        // api call for roles list START
        axios({
            method: 'get',
            url:'roles_list',
            headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),
        }
        })
            .then(function (response) {
                response.data.role_info.forEach(element => {
                    rolesRecords.push({
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
                                    })
                });
                setLoading(true)
                setRolesList(rolesRecords)
                setLoading(false)
            })
            .catch(error => {});// api call for roles list END
    }

    const handleDeleteModule = (chipToDelete, rowId) => () => {
        axios({
            method: 'post',
            url: 'delete_module_from_pivot',
            headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),},
            data: {
                module_id: chipToDelete.module_id,
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
                                    modules: role.modules.filter((data) => data !== chipToDelete)
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

    const handleDeleteEmployee = (chipToDelete, rowId) => () => {
        console.log(rowId)
        console.log(chipToDelete)

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
                            <Avatar sx={{ width: 20, height: 20, bgcolor: blue[700] }} style={{ color: '#ffff' }}>
                                <Typography variant="body2" sx={{ fontSize: 12 }}>
                                    {index + 1}
                                </Typography>
                            </Avatar>
                        );
                        // if (data.length > 0) {
                            return data && data.module_name ? (  // Use ternary operator for conditional rendering
                        <Chip
                            key={index}
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
                            icon = <Avatar sx={{  width: 20, height: 20, bgcolor: blue[700], }} style={{ color: '#ffff' }}>
                                                    <Typography variant="body2" sx={{ fontSize: 12 }}>
                                                        {index + 1}
                                                    </Typography>
                                                    </Avatar>;
                        return data && data.employee_name ? (
                            <Chip
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
                            icon = <Avatar sx={{  width: 20, height: 20, bgcolor: blue[700], }} style={{ color: '#ffff' }}>
                                                    <Typography variant="body2" sx={{ fontSize: 12 }}>
                                                        {index + 1}
                                                    </Typography>
                                                    </Avatar>;
                        return data && data.site_name ? (
                            <Chip
                            key={index}
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