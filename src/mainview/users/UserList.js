import React,{useEffect,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box,Button } from '@mui/material';
import CustomizedDialogs from '../../components/dialog';
import CustomizedDialogs_edit from '../../components/dialog_edit';
import CustomizedDialogs_delete from '../../components/dialog_delete';
import AddUser from '../../forms/add_user/AddUser';
import EditUser from '../../forms/EditUser';
import DeleteUser from '../../forms/DeleteUser';
import axios from 'axios';
// const rows: GridRowsProp = [
//   { id: 1, col1: 'Hello', col2: 'World' },
//   { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
//   { id: 3, col1: 'MUI', col2: 'is Amazing' },
// ];

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'uname', headerName: 'Full Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 150 },
    { field: 'site', headerName: 'Site', width: 150 },
    { field: 'contact', headerName: 'Contact', width: 150 },
    { field: 'address', headerName: 'Address', width: 150 },
    { field: 'empType', headerName: 'Empolyee Type', width: 150 },
    { field: 'consultant', headerName: 'Consultant', width: 150 },
    { field: 'empSec', headerName: 'Empolyee Section', width: 150 },
    { field: 'empField', headerName: 'Empolyee Field', width: 150 },
    { field: 'empRole', headerName: 'Empolyee Role', width: 150 },
    // { field: 'empTeam', headerName: 'EmpolyeeTeam', width: 150 },
    // { field: 'status', headerName: 'status', width: 150 },
    { field: 'action', headerName: 'Action', width: 150, renderCell:(value) => {
      return (
        <>
        <CustomizedDialogs_edit size='small'>
        <EditUser fname={value.row.fname} lname={value.row.lname} email={value.row.email} password={value.row.password} 
         site={value.row.site} contact={value.row.contact} address={value.row.address} empType={value.row.empType}
         consultant={value.row.consultant} empSec={value.row.empSec} empField={value.row.empField} empRole={value.row.empRole}
         />
        </CustomizedDialogs_edit>
        <CustomizedDialogs_delete size='small'>
          <DeleteUser id={value.id}/>
        </CustomizedDialogs_delete>
        </>
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
              nietos.push({'id':element.id,'uname':element.fname + ' ' + element.lname , 'email':element.email, 
              'password':element.password, 'sitename':element.site, 'contact':element.contact, 'address':element.address,
            'empType':element.empType, 'consultant':element.consultant, 'empSec':element.empSec,'empField':element.empField,
          'empRole':element.empRole,})
            
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