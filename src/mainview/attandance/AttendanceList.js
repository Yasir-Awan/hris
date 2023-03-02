import React,{useState} from 'react';
import {useNavigate} from 'react-router-dom';
// import ServerPaginationGrid from './ServerPaginationGrid';
import { createFakeServer } from '@mui/x-data-grid-generator';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';
// import { EnhancedEncryptionTwoTone } from '@mui/icons-material';
// import { passFilterLogic } from '@mui/x-data-grid/internals';
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
// const SERVER_OPTIONS = {
//   useCursorPagination: false,
// };
// const {useQuery} = createFakeServer({}, SERVER_OPTIONS);
const AttendanceList = () => {
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(5);
  // const queryOptions = React.useMemo(
  //   () => ({
  //     page,
  //     pageSize,
  //   }),
  //   [page, pageSize],
  // );

  // const {isLoading, pageInfo } = useQuery(queryOptions);
  var attendance_rows = [];
  let isLoading = false
var pageInfo = {
  "totalRowCount": page,
  "pageSize": pageSize
}
const navigate = useNavigate();
const [tableData, setTableData] = useState([])
isLoading=true
const load_data = () => {
  axios({
    method: 'post',
    url: 'attendance_list?',
    headers: {
      'Authorization': 'Bearer '+localStorage.getItem('token'),
    },
    data: {'pageSize':pageSize, 'page':page},
  }
  )
    .then(function (response) {
      isLoading=false
      console.log(response);
      // if (response.pageInfo){
      //   var pageInfo = response.pageInfo
      // }
      if(response.data.attendance_rows){
        response.data.attendance_rows.forEach(element => {

          attendance_rows.push({'id':element.id,'uname':element.user_name,'attendance_date':element.attendance_date,
            'checkin':element.checkin, 'checkout':element.checkout, 'hours':element.hours, 'minutes':element.minutes})
        }
          );
      }
      else{
        navigate('/');
      }
      setTableData(attendance_rows);
    })
    .catch(error => {
      console.log(error);
  })

  }
// useEffect(, [])
// useEffect(load_data, []);
const [rowCountState, setRowCountState] = React.useState(
  pageInfo.totalRowCount || 0,
  );

  React.useEffect(() => 
  {
    setRowCountState((prevRowCountState) =>
    pageInfo.totalRowCount !== undefined ? 
    pageInfo.totalRowCount : prevRowCountState,
    );

  }, [load_data, pageInfo.totalRowCount,setRowCountState]);


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
  <div style={{height:500, width: '100%', marginBottom:'2px' }}>

    {/* <DataGrid rows={tableData} columns={columns} /> */}
  </div>
    </>
  )
}

export default AttendanceList