import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from 'axios';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'name', headerName: 'Name', width: 150 },
  { field: 'leave_type', headerName: 'Leave Type', width: 150 },
  { field: 'leave_start', headerName: 'Leave Start', width: 200 },
  { field: 'leave_end', headerName: 'Leave End', width: 200 },
  { field: 'weekend_count', headerName: 'WeekEnd', width: 150 },
  { field: 'reason', headerName: 'Reason', width: 150 },
  { field: 'time', headerName: 'Time', width: 150 },
];

  const LeavesList = () => {
      const [data, setData] = useState({
        loading: true,
        rows: [],
        totalRows: 0,
        rowsPerPageOptions: [5,10,20,50,100],
        pageSize: 10,
        page: 1
      });
    const [filterModel, setFilterModel] = useState({items: [{columnField: '',operatorValue: '',value: '',},],});

    const updateData = (k, v) => setData((prev) => ({ ...prev, [k]: v }));
    const navigate = useNavigate();
    let attendanceRows = [];

  useEffect(() => {
      updateData('loading', true);
      // console.log('filterModel:', filterModel);
      // add this line to check filterModel value
      axios({
        method: 'get',
        url: 'leaves_list',
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
        data: {
          pageSize: data.pageSize,
          page: data.page,
          filters: filterModel // pass filterModel to the server,
        },
      })
      .then(function (response) {
                      // setTotalRows(response.total_rows);
                      if (response.data.leave_info) {
                        response.data.leave_info.forEach((element) => {
                          attendanceRows.push({
                            id: element.id,
                            name: element.fname+' '+element.lname,
                            leave_type: element.leave_type,
                            leave_start: element.start_date,
                            leave_end: element.end_date,
                            weekend_count: element.weekend_count,
                            reason: element.reason,
                            time: element.time
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
                density="compact"
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

export default LeavesList