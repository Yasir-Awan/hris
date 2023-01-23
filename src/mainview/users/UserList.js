import React,{useEffect,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box,Button } from '@mui/material';
import CustomizedDialogs from '../../components/dialog';
import CustomizedDialogs_edit from '../../components/dialog_edit';
import AddUser from '../../forms/add_user/AddUser';
import EditUser from '../../forms/EditUser';
import axios from 'axios';
// const rows: GridRowsProp = [
//   { id: 1, col1: 'Hello', col2: 'World' },
//   { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
//   { id: 3, col1: 'MUI', col2: 'is Amazing' },
// ];

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'uname', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 150 },
    { field: 'password', headerName: 'password', width: 150 },
    { field: 'site', headerName: 'site_Name', width: 150 },
    { field: 'contact', headerName: 'Contact', width: 150 },
    { field: 'address', headerName: 'address', width: 150 },
    { field: 'empType', headerName: 'Emp_Type', width: 150 },
    { field: 'consultant', headerName: 'consultant', width: 150 },
    { field: 'empSec', headerName: 'Emp_Sec', width: 150 },
    { field: 'empField', headerName: 'Emp_Field', width: 150 },
    { field: 'empRole', headerName: 'Emp_Role', width: 150 },
    { field: 'empTeam', headerName: 'Emp_Team', width: 150 },
    { field: 'status', headerName: 'status', width: 150 },
    { field: 'action', headerName: 'Action', width: 150, renderCell:(value) => {
      return (
        <CustomizedDialogs_edit size='small'>
        <EditUser uname={value.row.uname} email={value.row.email} password={value.row.password} 
         site={value.row.site} contact={value.row.contact} address={value.row.address} empType={value.row.empType}
         consultant={value.row.consultant} empSec={value.row.empSec} empField={value.row.empField} empRole={value.row.empRole}
         empTeam={value.row.empTeam} status={value.row.status}/>
        </CustomizedDialogs_edit>
      );
    }, }
];

// const [state, setstate] = useState({data:""})
// console.log(ID)
// const changeState = () => {  
//   setstate({data:ID}); 
//  };
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
            if(element.employee_type === '4'){
              nietos.push({'id':element.id,'uname':element.fname+ ' '+ element.lname,'email':element.email, 
              'password':element.password, 'sitename':element.site, 'contact':element.contact, 'address':element.address,
            'empType':element.empType, 'consultant':element.consultant, 'empSec':element.empSec,'empField':element.empField,
          'empRole':element.empRole, 'empTeam':element.empTeam, 'status':element.status})
            }
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
  <Box sx={{marginLeft:'97%', position: "absolute",bottom:'500px',right:'22px'}}></Box>
  <Box sx={{marginLeft:'97%', position: "absolute",bottom:'550px',right:'22px'}}>
      <CustomizedDialogs size='small'>
      <AddUser/>
      </CustomizedDialogs>
    </Box>
    
    <DataGrid rows={tableData} columns={columns} />
  </div>
    </>
  )
}

export default UserList