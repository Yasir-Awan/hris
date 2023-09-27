import React,{useEffect,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import CustomizedDialogs from '../../components/dialog';
// import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import AddUser from '../../forms/add_user/AddUser';
import EditUser from '../../forms/EditUser';
// import DeleteUser from '../../forms/DeleteUser';
import axios from 'axios';

const columns = [
    { field: 'id', headerName: 'Id', width: 20,headerAlign:'center',align:'center'},
    { field: 'uname', headerName: 'Employee', width: 200,headerAlign:'center',align:'center'},
    { field: 'email', headerName: 'Email', width: 300,headerAlign:'center',align:'center'},
    { field: 'sitename', headerName: 'Site', width: 120,headerAlign:'center',align:'center'},
    { field: 'contact', headerName: 'Contact', width: 120,headerAlign:'center',align:'center'},
    { field: 'address', headerName: 'Address', width: 100,headerAlign:'center',align:'center'},
    { field: 'empType', headerName: 'Type', width: 90,headerAlign:'center',align:'center'},
    // { field: 'consultant', headerName: 'CONSULTANT', width: 190,headerAlign:'center',align:'center'},
    { field: 'empSec', headerName: 'Section', width: 85,headerAlign:'center',align:'center'},
    { field: 'empField', headerName: 'Field', width: 155,headerAlign:'center',align:'center'},
    { field: 'empRole', headerName: 'Role', width: 170,headerAlign:'center',align:'center'},
    // { field: 'empTeam', headerName: 'EmpolyeeTeam', width: 150 },
    // { field: 'status', headerName: 'status', width: 150 },
    { field: 'action', headerName: 'Action', width: 75, renderCell:(value) => {
      return (
        <>
        <CustomizedDialogs size='small' title="Edit User" icon={<EditIcon />}>
        <EditUser uname={value.row.uname} email={value.row.email} password={value.row.password}
          site={value.row.site} contact={value.row.contact} address={value.row.address} empType={value.row.empType}
          consultant={value.row.consultant} empSec={value.row.empSec} empField={value.row.empField} empRole={value.row.empRole}/>
        </CustomizedDialogs>
        {/* <CustomizedDialogs size='small' title="Delete User" icon={<DeleteIcon />}>
          <DeleteUser id={value.id}/>
        </CustomizedDialogs> */}
        </>
      );
    },  headerAlign:'center',align:'center'}
];

const UserList = () => {

const navigate = useNavigate();
const [tableData, setTableData] = useState([])
const [loading,setLoading] = useState(true)

  var nietos = [];
  useEffect(() => {
    setLoading(true)
    axios({
      method: 'get',
      url: 'user_list',
      headers: {
        'Authorization': 'Bearer '+localStorage.getItem('token'),
      }
    }
    )
      .then(function (response) {
        console.log(response.data);
        if(response.data.user_info){
          response.data.user_info.forEach(element => {
              nietos.push({'id':element.id,'uname':element.fname + ' ' + element.lname , 'email':element.email,
              'password':element.password, 'sitename':element.site_name, 'contact':element.contact, 'address':element.address,
            'empType':element.type_of_employee, 'consultant':element.consultant, 'empSec':element.section_name,'empField':element.field_name,
          'empRole':element.role_name,})
          }
            );
        }
        else{
          navigate('/');
        }
        setTableData(nietos);
        setLoading(false)
      })
      .catch(error => {
        console.log(error);
          })

    },[])

    console.log(tableData)
    return (
    <>
  <div style={{height:'auto', width: '100%', marginBottom:'2px' }}>
  <Box sx={{marginLeft:'97%', position: "absolute",top:'80px',right:'22px'}}>
      {/* <CustomizedDialogs size='small' title= "Add New User" icon={<AddIcon />}>
      <AddUser/>
      </CustomizedDialogs> */}
    </Box>

    <DataGrid
    autoHeight
    density='compact'
    loading={loading}
    // rowHeight={50}
    rows={tableData} columns={columns} />
  </div>
    </>
  )
}

export default UserList