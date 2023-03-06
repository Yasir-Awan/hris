import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'user_name', headerName: 'Name', width: 150 },
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
    rowsPerPageOptions: [5, 10, 20, 50, 100],
    pageSize: 5,
    page: 1,
    // filterModel: {}, // add filterModel state
    });
  const [filterModel, setFilterModel] = useState({
    items: [
      {
        columnField: '',
        operatorValue: '',
        value: '',
      },
    ],
  });
  const updateData = (k, v) => setData((prev) => ({ ...prev, [k]: v }));
   // const [page, setPage] = useState(0);
  // const [pageSize, setPageSize] = useState(5);
  // const [totalRows, setTotalRows] = useState();
  // const [tableData, setTableData] = useState([]);
  // const handleFilterModelChange = (model) => {
  //   updateData('page', 1);
  //   updateData('filterModel', model);
  // };
  const navigate = useNavigate();
  let attendanceRows = [];

  useEffect(() => {
    updateData('loading', true);
      console.log('filterModel:', filterModel); // add this line to check filterModel value
    axios({
      method: 'post',
      url: 'attendance_list',
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      data: {
        pageSize: data.pageSize,
        page: data.page,
        filters: filterModel // pass filterModel to the server,
      },
    })
      .then(function (response) {
                      // setTotalRows(response.total_rows);

        if (response.data.attendance_rows) {
          response.data.attendance_rows.forEach((element) => {
            attendanceRows.push({
              id: element.id,
              user_name: element.user_name,
              attendance_date: element.attendance_date,
              checkin: element.checkin,
              checkout: element.checkout,
              time: element.time,
              early_sitting: element.early_sitting,
              late_sitting: element.late_sitting,
              extra_time: element.extra_time,
              acceptable_time: element.acceptable_time,

            });
          });
        } else {
          navigate('/');
        }

        setTimeout(() => {
          const rows = attendanceRows;

          updateData('totalRows', response.data.total_rows);

          setTimeout(() => {
            updateData('rows', rows);
            updateData('loading', false);
          }, 100);
        }, 500);
      })
      .catch((error) => {
        console.log(error);
      });
      // setData((d) => ({
      //   ...d,
      //   rowCount: dummyColorsDB.length,
      //   rows,
      //   loading: false
      // }));
  }, [data.page, data.pageSize, filterModel]);
  console.log(filterModel)

  return (
    <>
      <div style={{ height: 'auto', width: '100%' }}>
        <DataGrid
          autoHeight
          rowHeight={50}
          loading={data.loading}
          rowsPerPageOptions={data.rowsPerPageOptions}
          pagination
          page={data.page - 1}
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
          filterMode="server" // enable server-side filtering
        onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)} // handle filter changes made by the user
        filterModel={ filterModel} // pass filterModel state to the DataGrid component
              />
          </div>
        </>
      )
}

export default AttendanceList