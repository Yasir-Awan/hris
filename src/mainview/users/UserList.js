import React,{useEffect,useState} from 'react';
import { DataGrid} from '@mui/x-data-grid';
import { Box,Select } from '@mui/material';
import axios from 'axios';

const SelectEditInputCell = ({ id, value, field, row, onSave, }) => {
  const [editedValue, setEditedValue] = useState(value);
  const [roles, setRoles] = useState([]);

  useEffect(() => {

    axios({
      method: 'get',
      url: 'roles_list_dropdown',
      headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') },
    })
      .then(function (response) {
        if (response.data.roles_dropdown_info) {
          setRoles(response.data.roles_dropdown_info)
        }
      })
      .catch(error => {
        console.log(error);
      })
  }, []);

  const handleChange = (event) => {
    setEditedValue(event.target.value);
    console.log(roles)
  };

  const handleSave = () => {
    const selectedRole = roles.find(item => item.id === editedValue);
    console.log(selectedRole)
    onSave(id, field, row.emp_bio_id, selectedRole.name, editedValue);
  };

  return (
    <Select
      value={editedValue}
      onChange={handleChange}
      onBlur={handleSave} // Save on blur
      size="small"
      sx={{ height: 1, width: "100%" }}
      native
      autoFocus
      disabled={localStorage.getItem('edit_permission') !== '1'}
    >
      {roles.map((role, index) => (
        <option key={index} value={role.id}>
          {role.name}
        </option>
      ))}
    </Select>
  );
};

const UserList = () => {

const [data, setData] = useState({
  loading: true,
  rows: [],
  totalRows: 0,
  rowsPerPageOptions: [5,10,20,50,100],
  pageSize: 5,
  page: 1
});
const [filterModel, setFilterModel] = useState({items: [{columnField: '',operatorValue: '',value: '',},],});

const updateData = (k, v) => setData((prev) => ({ ...prev, [k]: v }));

const editPermission = localStorage.getItem('edit_permission');

  useEffect(() => {
    updateData("loading", true);
    refreshUsersList()

    },[data.page,data.pageSize,filterModel])

    const refreshUsersList = () => {
      let counter = 1;
          let epmloyeeRecords = [];
          axios({
            method: 'post',
            url: 'user_list',
            headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),},
            data: {
              pageSize: data.pageSize,
              page: data.page,
              filters: filterModel, // pass filterModel to the server,
              role: localStorage.getItem('role'),
              emp_id: localStorage.getItem('bio_id'),
              employees: JSON.parse(localStorage.getItem('employees'))
            },
          }
          )
            .then(function (response) {
              if(response.data.employees_rows){
                response.data.employees_rows.forEach(element => {
                    epmloyeeRecords.push({'id':counter,'fullname':element.fullname , 'email':element.email,
                    'password':element.password, 'site_name':element.site_name, 'contact':element.contact, 'address':element.address,
                    'type_of_employee':element.type_of_employee, 'consultant':element.consultant, 'section_name':element.section_name,'role_name':element.role_name,
                    'designation_name':element.designation_name,'emp_bio_id':element.bio_ref_id,
                page:response.data.page,
                pagesize:response.data.pagesize,
              });
                counter++;
                }
              );
              }
              else{}
              // setTimeout(() => {
                const rows = epmloyeeRecords;
                updateData("totalRows", response.data.total_rows);
                    // setTimeout(() => {
                      updateData("loading", false);
                    // }, 100);
                    updateData("rows", rows);
              // }, 100);
            })
            .catch(error => {
              console.log(error);
                })
    }

    const handleCellEdit = (rowId, field, emp_bio_id, selectedRoleName, editedValue) => {
      // Make the API call
      axios({
        method: 'post',
        url: 'update_employee_role',
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
        data: {
          bio_id: emp_bio_id,
          hr_role: editedValue,
        },
      })
        .then(function (response) {
          console.log("success");
          // Refresh the users list after successful update
          refreshUsersList();
        })
        .catch((error) => {
          console.error(error);
          // Handle error if needed
        });
    };    

    const columns = [
      { field: 'id', headerName: 'Id', width: 20,headerAlign:'center',align:'center',
        filterable: false,
        renderCell: (value) => {
          const currentPage = value.row.page;
          const pageSize = value.row.pagesize;
          const rowNumber = (currentPage - 1) * pageSize + value.api.getRowIndex(value.row.id) + 1;
          return <div>{rowNumber}</div>;
        },
      },
      { field: 'fullname', headerName: 'Employee', width: 200,headerAlign:'center',align:'center'},
      { field: 'designation_name', headerName: 'Designation', width: 180,headerAlign:'center',align:'center'},
      { field: 'site_name', headerName: 'Site', width: 180,headerAlign:'center',align:'center'},
      { field: 'email', headerName: 'Email', width: 300,headerAlign:'center',align:'center'},
      { field: 'contact', headerName: 'Contact', width: 180,headerAlign:'center',align:'center'},
      { field: 'section_name', headerName: 'Section', width: 180,headerAlign:'center',align:'center'},
      { field: 'role_name', headerName: 'Permission', width: 180,headerAlign:'center',align:'center',
      renderEditCell: (params) => (
        // console.log(params)
        <SelectEditInputCell {...params} onSave={handleCellEdit} disabled={editPermission}/>
      ),
      editable: true,
      },
  ];

    return (
    <>
  <div style={{height:'auto', width: '100%', marginBottom:'2px' }}>
  <Box sx={{marginLeft:'97%', position: "absolute",top:'80px',right:'22px'}}>
    </Box>
    <DataGrid
        density="standard"
        autoHeight
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
        filterMode="server"
        // enable server-side filtering
        onFilterModelChange={
          (newFilterModel) => setFilterModel(newFilterModel)
        }
        //  handle filter changes made by the user
        filterModel={filterModel}
    />
  </div>
    </>
  )
}

export default UserList