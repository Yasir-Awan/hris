import React, { useEffect, useState } from 'react';
import { DataGrid, GridColDef,GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';

const columns: GridColDef[] = [

  { field: 'id', headerName: 'Serial No' , width: 90 ,
      filterable: false,
      renderCell: (value) => {
        const currentPage = value.row.page;
        const pageSize = value.row.pagesize;
        const rowNumber = (currentPage - 1) * pageSize + value.api.getRowIndex(value.row.id) + 1;
        return <div>{rowNumber}</div>;
      },
    headerAlign:'center',align:'center'},
  { field: 'fullname', headerName: 'Employee', width: 180,headerAlign:'center',align:'center'},
  { field: 'attendance_date', headerName: 'Date', width: 120,headerAlign:'center',align:'center'},
  { field: 'checkin', headerName: 'CheckIn', width: 180,headerAlign:'center',align:'center'},
  { field: 'checkout', headerName: 'CheckOut', width: 180,headerAlign:'center',align:'center'},
  { field: 'time', headerName: 'Total Time', width: 130,headerAlign:'center',align:'center'},
  { field: 'early_sitting', headerName: 'Early', width: 130,headerAlign:'center',align:'center'},
  { field: 'late_sitting', headerName: 'Late', width: 130,headerAlign:'center',align:'center'},
  { field: 'extra_time', headerName: 'Extra Time', width: 150,headerAlign:'center',align:'center'},
  { field: 'acceptable_time', headerName: 'Accepted Time', width: 150,headerAlign:'center',align:'center'},
];


  const AttendanceList = (props) => {
      const [filterVals,setFilterVals] = useState([props.filterValues])
      const [data, setData] = useState({loading: true,rows: [],totalRows: 0,rowsPerPageOptions: [5,10,20,50,100],pageSize: 10,page: 1});
      const [filterModel, setFilterModel] = useState({items: [
        { columnField: '', operatorValue: '', value: '' },
      ]});
      const updateData = (k, v) => setData((prev) => ({ ...prev, [k]: v }));
      // const navigate = useNavigate();
      let attendanceRows = [];

  useEffect(() => {
      updateData('loading', true);
      console.log('filterModel:', filterModel); // add this line to check filterModel value
      console.log(filterVals);
      let counter = 1;
      axios({
        method: 'post',
        url: 'attendance_list',
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
        data: {
          pageSize: data.pageSize,
          page: data.page,
          filters: filterModel, // pass filterModel to the server,
          role: localStorage.getItem('role'),
          emp_id: localStorage.getItem('bio_id')
        },
      })
      .then(function (response) {
                      // setTotalRows(response.total_rows);
                      if (response.data.attendance_rows) {
                        response.data.attendance_rows.forEach((element) => {
                          attendanceRows.push({
                            id: counter,
                            fullname: element.fullname,
                            attendance_date: element.attendance_date,
                            checkin: element.checkin,
                            checkout: element.checkout,
                            time: element.time,
                            early_sitting: element.early_sitting,
                            late_sitting: element.late_sitting,
                            extra_time: element.extra_time,
                            acceptable_time: element.acceptable_time,
                            page:response.data.page,
                            pagesize:response.data.pagesize
                          });
                          counter++;
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
              }, 200);
      })
      .catch(error => { console.log(error); })
  }, [data.page, data.pageSize,filterModel]);

    return (
        <>
          <div style={{ height: 'auto', width: '100%' }}>
              <DataGrid
                density="compact"
                autoHeight
                // rowHeight={50}
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
                // getRowId={getRowId}
                // pagination
                filterMode="server" // enable server-side filtering
                onFilterModelChange={
                  (newFilterModel) => {
                    // Remove any empty filter items
                    const nonEmptyFilters = newFilterModel.items.filter(
                      (filter) => filter.columnField && filter.operatorValue && filter.value
                    );
                    setFilterModel({ items: nonEmptyFilters });
                  }
                } // handle filter changes made by the user
                filterModel={filterModel} // pass filterModel state to the DataGrid component
                components={{Toolbar: GridToolbar}}
              />
          </div>
        </>
      )
}

export default AttendanceList