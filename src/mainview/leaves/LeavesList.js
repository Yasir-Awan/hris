import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add'
import CustomizedDialogs from '../../components/dialog';
import AddLeave from '../../forms/add_leave/AddLeave';
import { Box } from '@mui/material';
import axios from 'axios';

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
  { field: 'time', headerName: 'Adding Time', width: 220 ,headerAlign:'center',align:'center'},
];

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
                          time: element.readable_add_date
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
        </>
      )
}

export default LeavesList