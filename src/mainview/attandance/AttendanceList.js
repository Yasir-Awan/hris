import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID' , width: 70},
  { field: 'fullname', headerName: 'EMPLOYEE', width: 150 },
  { field: 'attendance_date', headerName: 'DATE', width: 120 },
  { field: 'checkin', headerName: 'CHECKIN', width: 120 },
  { field: 'checkout', headerName: 'CHECKOUT', width: 120 },
  { field: 'time', headerName: 'TOTAL TIME', width: 130 },
  { field: 'early_sitting', headerName: 'EARLY', width: 130 },
  { field: 'late_sitting', headerName: 'LATE', width: 130 },
  { field: 'extra_time', headerName: 'EXTRA TIME', width: 150 },
  { field: 'acceptable_time', headerName: 'ACCEPTED TIME', width: 150 },
];

  const AttendanceList = () => {
      const [data, setData] = useState({loading: true,rows: [],totalRows: 0,rowsPerPageOptions: [5,10,20,50,100],pageSize: 5,page: 1});
      const [filterModel, setFilterModel] = useState({items: [{columnField: '',operatorValue: '',value: '',},],});
      const updateData = (k, v) => setData((prev) => ({ ...prev, [k]: v }));
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
                            fullname: element.fullname,
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
                        // navigate('/');
                      }

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

  }, [data.page, data.pageSize,filterModel]);

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
                filterMode="server" // enable server-side filtering
                onFilterModelChange={
                  (newFilterModel) => setFilterModel(newFilterModel)
                } // handle filter changes made by the user
                filterModel={filterModel} // pass filterModel state to the DataGrid component
              />
          </div>
        </>
      )
}

export default AttendanceList