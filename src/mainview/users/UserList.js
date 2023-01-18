import React,{useEffect,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box,Button } from '@mui/material';
import CustomizedDialogs from '../../components/dialog';
import AddUser from '../../forms/add_user/AddUser';
import axios from 'axios';
// const rows: GridRowsProp = [
//   { id: 1, col1: 'Hello', col2: 'World' },
//   { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
//   { id: 3, col1: 'MUI', col2: 'is Amazing' },
// ];

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'fname', headerName: 'Fname', width: 100 },
    { field: 'lname', headerName: 'LName', width: 150 },
    { field: 'contact', headerName: 'Contact', width: 150 },
    { field: 'action', headerName: 'Action', width: 150, renderCell:(value) => {
      return (
        <Button
          variant="contained"
          color="primary"
          // className={classes.button}
          // onClick={}
        >
          Edit
        </Button>
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
            if(element.employee_type === '4'){
              nietos.push({'id':element.id,'fname':element.fname,'lname':element.lname,'contact':element.contact})
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
  <Box sx={{marginLeft:'97%', position: "absolute",bottom:'600px',right:'22px'}}>
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