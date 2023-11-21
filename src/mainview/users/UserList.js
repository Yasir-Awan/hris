import React,{useEffect,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { DataGrid} from '@mui/x-data-grid';
import { Box } from '@mui/material';
import CustomizedDialogs from '../../components/dialog';
// import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import AddUser from '../../forms/add_user/AddUser';
import EditUser from '../../forms/EditUser';
// import DeleteUser from '../../forms/DeleteUser';
import axios from 'axios';

const UserList = () => {

const navigate = useNavigate();
const [showDialog,setShowDialog] = useState(false)
const [data, setData] = useState({
  loading: true,
  rows: [],
  totalRows: 0,
  rowsPerPageOptions: [5,10,20,50,100],
  pageSize: 10,
  page: 1
});
const [filterModel, setFilterModel] = useState({items: [{columnField: '',operatorValue: '',value: '',},],});
// const [users,setUsers] = useState([]);
// const [showDialog,setShowDialog] = useState(false)
const updateData = (k, v) => setData((prev) => ({ ...prev, [k]: v }));

  useEffect(() => {

    let counter = 1;
    let epmloyeeRecords = [];
    // setLoading(true)
    axios({
      method: 'post',
      url: 'user_list',
      headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),},
      data: {
        pageSize: data.pageSize,
        page: data.page,
        filters: filterModel, // pass filterModel to the server,
        role: localStorage.getItem('role'),
        emp_id: localStorage.getItem('bio_id')
      },
    }
    )
      .then(function (response) {
        console.log(response.data);
        if(response.data.employees_rows){
          response.data.employees_rows.forEach(element => {
              epmloyeeRecords.push({'id':counter,'fullname':element.fullname , 'email':element.email,
              'password':element.password, 'site_name':element.site_name, 'contact':element.contact, 'address':element.address,
              'type_of_employee':element.type_of_employee, 'consultant':element.consultant, 'section_name':element.section_name,'field_name':element.field_name,
              'role_name':element.role_name,
          page:response.data.page,
          pagesize:response.data.pagesize,
        });
          counter++;
          }
            );
        }
        else{
          // navigate('/');
        }
        setTimeout(() => {
          const rows = epmloyeeRecords;
          updateData("totalRows", response.data.total_rows);
              setTimeout(() => {
                updateData("loading", false);
              }, 100);
              updateData("rows", rows);
        }, 100);
      })
      .catch(error => {
        console.log(error);
          })

    },[data.page,data.pageSize,filterModel])


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
      { field: 'role_name', headerName: 'Role', width: 180,headerAlign:'center',align:'center'},
      { field: 'site_name', headerName: 'Site', width: 180,headerAlign:'center',align:'center'},
      { field: 'email', headerName: 'Email', width: 300,headerAlign:'center',align:'center'},
      { field: 'contact', headerName: 'Contact', width: 180,headerAlign:'center',align:'center'},
      // { field: 'address', headerName: 'Address', width: 200,headerAlign:'center',align:'center'},
      // { field: 'type_of_employee', headerName: 'Type', width: 120,headerAlign:'center',align:'center'},
      // { field: 'consultant', headerName: 'CONSULTANT', width: 190,headerAlign:'center',align:'center'},
      { field: 'section_name', headerName: 'Section', width: 180,headerAlign:'center',align:'center'},
      { field: 'field_name', headerName: 'Field', width: 180,headerAlign:'center',align:'center'},
      // { field: 'empTeam', headerName: 'EmpolyeeTeam', width: 150 },
      // { field: 'status', headerName: 'status', width: 150 },
      { field: 'action', headerName: 'Action', width: 75, renderCell:(value) => {
        return (
          <>
          <CustomizedDialogs size='small' title="Edit User" icon={<EditIcon />} showDialog = { showDialog } setShowDialog = { v => setShowDialog(v) }>
          <EditUser uname={value.row.uname} email={value.row.email} password={value.row.password}
            site={value.row.site} contact={value.row.contact} address={value.row.address} empType={value.row.empType}
            consultant={value.row.consultant} empSec={value.row.empSec} empField={value.row.empField} empRole={value.row.empRole}/>
          </CustomizedDialogs>
          </>
        );
      },  headerAlign:'center',align:'center'}
  ];

    return (
    <>
  <div style={{height:'auto', width: '100%', marginBottom:'2px' }}>
  <Box sx={{marginLeft:'97%', position: "absolute",top:'80px',right:'22px'}}>
      {/* <CustomizedDialogs size='small' title= "Add New User" icon={<AddIcon />}>
      <AddUser/>
      </CustomizedDialogs> */}
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