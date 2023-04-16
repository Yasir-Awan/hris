import React,{useEffect,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import CustomizedDialogs from '../../components/dialog';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddUser from '../../forms/add_user/AddUser';
import EditUser from '../../forms/EditUser';
import DeleteUser from '../../forms/DeleteUser';
import axios from 'axios';

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 30 },
    { field: 'uname', headerName: 'EMPLOYEE', width: 130 },
    { field: 'email', headerName: 'EMAIL', width: 200 },
    { field: 'sitename', headerName: 'SITE', width: 80 },
    { field: 'contact', headerName: 'CONTACT', width: 120 },
    { field: 'address', headerName: 'ADDRESS', width: 100 },
    { field: 'empType', headerName: 'TYPE', width: 90 },
    { field: 'consultant', headerName: 'CONSULTANT', width: 190 },
    { field: 'empSec', headerName: 'SECTION', width: 70 },
    { field: 'empField', headerName: 'FIELD', width: 160 },
    { field: 'empRole', headerName: 'ROLE', width: 170 },
    // { field: 'empTeam', headerName: 'EmpolyeeTeam', width: 150 },
    // { field: 'status', headerName: 'status', width: 150 },
    { field: 'action', headerName: 'ACTION', width: 75, renderCell:(value) => {
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
    }, }
];

const UserList = () => {

const navigate = useNavigate();
const [tableData, setTableData] = useState([])

  var nietos = [];
  useEffect(() => {
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
      })
      .catch(error => {
        console.log(error);
          })

    },[])

    console.log(tableData)
    return (
    <>
  <div style={{height:500, width: '100%', marginBottom:'2px' }}>
  <Box sx={{marginLeft:'97%', position: "absolute",top:'80px',right:'22px'}}>
      {/* <CustomizedDialogs size='small' title= "Add New User" icon={<AddIcon />}>
      <AddUser/>
      </CustomizedDialogs> */}
    </Box>

    <DataGrid rows={tableData} columns={columns} />
  </div>
    </>
  )
}

export default UserList