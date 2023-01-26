import React,{useEffect,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';
import CustomizedDialogs from '../../components/dialog';
import CustomizedDialogsEdit from '../../components/dialog_edit';
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
    { field: 'uname', headerName: 'Full Name', width: 150 },
    { field: 'attendance_date', headerName: 'Date', width: 150 },
    { field: 'checkin', headerName: 'CheckIN', width: 150 },
    { field: 'checkout', headerName: 'CheckOut', width: 150 },
    { field: 'hours', headerName: 'Hours', width: 150 },
    { field: 'minutes', headerName: 'Minutes', width: 150 },
    // { field: 'empTeam', headerName: 'EmpolyeeTeam', width: 150 },
    // { field: 'status', headerName: 'status', width: 150 },
    // { field: 'action', headerName: 'Action', width: 150, renderCell:(value) => {
    //   return (
    //     <CustomizedDialogsEdit size='small'>
    //     <EditUser uname={value.row.uname} email={value.row.email} password={value.row.password}
    //      site={value.row.site} contact={value.row.contact} address={value.row.address} empType={value.row.empType}
    //      consultant={value.row.consultant} empSec={value.row.empSec} empField={value.row.empField} empRole={value.row.empRole}
    //      empTeam={value.row.empTeam} status={value.row.status}/>
    //     </CustomizedDialogsEdit>
    //   );
    // }, }
];

// const [state, setstate] = useState({data:""})
// console.log(ID)
// const changeState = () => {
//   setstate({data:ID});
//  };
const AttendanceList = () => {

const navigate = useNavigate();
const [tableData, setTableData] = useState([])

  var attendanceRows = [];
  useEffect(() => {
    axios({
      method: 'get',
      url: 'attendance_list',
      headers: {
        'Authorization': 'Bearer '+localStorage.getItem('token'),
      }
    }
    )
      .then(function (response) {
        console.log(response.data);
        if(response.data.attendance_info){
          response.data.attendance_info.forEach(element => {

            attendanceRows.push({'id':element.id,'uname':element.user_name,'attendance_date':element.attendance_date,
              'checkin':element.checkin, 'checkout':element.checkout, 'hours':element.hours, 'minutes':element.minutes})

          }
            );
        }
        else{
          navigate('/');
        }
        setTableData(attendanceRows);
      })
      .catch(error => {
        console.log(error);
    })

    },[])

    console.log(tableData)
    return (
    <>
  <div style={{height:500, width: '100%', marginBottom:'2px' }}>

    <DataGrid rows={tableData} columns={columns} />
  </div>
    </>
  )
}

export default AttendanceList