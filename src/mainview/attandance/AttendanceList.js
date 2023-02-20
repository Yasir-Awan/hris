import React,{useEffect,useState} from 'react';
import {useNavigate} from 'react-router-dom';
// import ServerPaginationGrid from './ServerPaginationGrid';
// import { createFakeServer } from '@mui/x-data-grid-generator';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
// import { Box } from '@mui/material';
// import CustomizedDialogs from '../../components/dialog';
// import CustomizedDialogsEdit from '../../components/dialog_edit';
// import AddUser from '../../forms/add_user/AddUser';
// import EditUser from '../../forms/EditUser';
import axios from 'axios';
// const rows: GridRowsProp = [
//   { id: 1, col1: 'Hello', col2: 'World' },
//   { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
//   { id: 3, col1: 'MUI', col2: 'is Amazing' },
// ];

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'uname', headerName: 'Name', width: 150 },
    { field: 'attendance_date', headerName: 'Date', width: 150 },
    { field: 'checkin', headerName: 'CheckIN', width: 150 },
    { field: 'checkout', headerName: 'CheckOut', width: 150 },
    { field: 'time', headerName: 'TIME', width: 150 },
    { field: 'early_sitting', headerName: 'Early Sitting', width: 150 },
    { field: 'late_sitting', headerName: 'Late Sitting', width: 150 },
    { field: 'extra_time', headerName: 'Extra Time', width: 150 },
    { field: 'acceptable_time', headerName: 'Acceptable Time', width: 150 },
    // { field: 'minutes', headerName: 'Minutes', width: 150 },
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
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(5);
  var attendanceRows = [];
  let isLoading = false
  let pageInfo = {
    "totalRowCount": page,
    "pageSize": pageSize
  }
  const navigate = useNavigate();
  const [tableData, setTableData] = useState([]);
  const [rowCountState, setRowCountState] = React.useState(
    pageInfo?.totalRowCount || 0,
  );

  const load_data = () => {
        axios({
          method: 'post',
          url: 'attendance_list',
          headers: {
            'Authorization': 'Bearer '+localStorage.getItem('token'),
          },
          data:{'pageSize':100 , 'totalRowCount':200}
        })
        .then(function (response) {
          console.log(response.data);
          if(response.data.attendance_info){
            response.data.attendance_info.forEach(element => {
                attendanceRows.push({'id':element.id,'uname':element.user_name,'attendance_date':element.attendance_date,
                'checkin':element.checkin, 'checkout':element.checkout, 'time':element.time, 'minutes':element.minutes})
                });
          }else{
            navigate('/');
          }
          setTableData(attendanceRows);
        })
        .catch(error => {
          console.log(error);
        })
  }

useEffect(load_data, [])


  React.useEffect(
    () => {
      // other code
     // eslint-disable-next-line react-hooks/exhaustive-deps
      setRowCountState((prevRowCountState) =>
        pageInfo?.totalRowCount !== undefined
          ? pageInfo?.totalRowCount
          : prevRowCountState,
      );
    }
  , [pageInfo?.totalRowCount, setRowCountState]
  );


    return (
    <>
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid
        rows={tableData}
        rowCount={rowCountState}
        loading={isLoading}
        rowsPerPageOptions={[5,10,20,50,100]}
        pagination
        page={page}
        pageSize={pageSize}
        paginationMode="server"
        onPageChange={(newPage) =>{ setPage(newPage); load_data()}}
        onPageSizeChange={(newPageSize) => {setPageSize(newPageSize); load_data()}}
        columns={columns}
      />
    </div>
  <div style={{height:500, width: '100%', marginBottom:'2px'}}>

    {/* <DataGrid rows={tableData} columns={columns} /> */}
  </div>
    </>
  )
}

export default AttendanceList