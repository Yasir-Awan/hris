import React,{useEffect,useState} from 'react';
import {useNavigate} from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';

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
];

const AttendanceList = () => {
  const [data, setData] = useState({
    loading: true,
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [5,10,20,50,100],
    pageSize: 5,
    page: 1
  });

  const updateData = (k, v) => setData((prev) => ({ ...prev, [k]: v }));
  const navigate = useNavigate();
  let attendanceRows = [];

  useEffect(() => {
    updateData("loading", true);
      axios({
        method: 'post',
        url: 'attendance_list',
        headers: {'Authorization': 'Bearer '+localStorage.getItem('token')},
        data: {'pageSize':data.pageSize, 'page':data.page},
      })
      .then(function (response) {
              // setTotalRows(response.total_rows);
              if(response.data.attendance_rows){
                  response.data.attendance_rows.forEach(element => {
                    attendanceRows.push({'id':element.id,'uname':element.user_name,'attendance_date':element.attendance_date,
                      'checkin':element.checkin, 'checkout':element.checkout, 'hours':element.hours, 'minutes':element.minutes, 'time':element.time,
                      'early_sitting':element.early_sitting,'late_sitting':element.late_sitting,'extra_time':element.extra_time, 'acceptable_time':element.acceptable_time})
                  }
                );
              }else{
                navigate('/');
              }

              console.log(attendanceRows);
              setTimeout(() => {

                const rows = attendanceRows;
                updateData("totalRows", response.data.total_rows);

                setTimeout(() => {
                  updateData("rows", rows);
                  updateData("loading", false);
                }, 100);

              }, 500);
        })
        .catch(error => { console.log(error); })

  }, [data.page, data.pageSize]);

  return (
      <>
        <div style={{ height: 'auto', width: '100%' }}>
            <DataGrid
              // density="compact"
              autoHeight
              rowHeight={50}
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
            />
        </div>
      </>
    )
}

export default AttendanceList