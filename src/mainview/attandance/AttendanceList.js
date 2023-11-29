import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import './AttendanceList.css';

  const AttendanceList = (props) => {
      const [data, setData] = useState({loading: true,rows: [],totalRows: 0,rowsPerPageOptions: [5,10,20,50,100],pageSize: 5,page: 1});
      const [filterModel, setFilterModel] = useState({items: [
        { columnField: '', operatorValue: '', value: '' },
      ]});
      const updateData = (k, v) => setData((prev) => ({ ...prev, [k]: v }));
      // Extract the value of LocalStorage.getItem('role') to a variable
      const userRole = localStorage.getItem('role');
      let attendanceRows = [];

  useEffect(() => {
      updateData('loading', true);
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
                      if (response.data.attendance_rows) {
                        response.data.attendance_rows.forEach((element) => {
                          attendanceRows.push({
                            id: counter,
                            fullname: element.fullname,
                            site_name: element.site_name,
                            role_name: element.role_name,
                            attendance_date: element.attendance_date,
                            shift_type: element.shift_type,
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
                      } else {}

              setTimeout(() => {
                const rows = attendanceRows;
                updateData("totalRows", response.data.total_rows);
                    setTimeout(() => {
                      updateData("rows", rows);
                      updateData("loading", false);
                    }, 100);
              }, 200);
      })
      .catch(error => {
        console.error(error);// Handle errors or show a user-friendly message
      });
  }, [data.page, data.pageSize,filterModel]);

  const renderFormattedDateTime = (dateTime, shiftType) => {
    if (dateTime !== null) {
      const dateValue = new Date(dateTime);

      if (shiftType === '1') {
        const timeString = dateValue.getHours().toString().padStart(2, '0') + ':' +
                            dateValue.getMinutes().toString().padStart(2, '0') + ':' +
                            dateValue.getSeconds().toString().padStart(2, '0');
        return <div>{timeString}</div>;
      } else {
        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        };
        const formattedDateTime = dateValue.toLocaleDateString('en-US', options);
        return <div>{formattedDateTime}</div>;
      }
    }
  };

  // Define a separate styles object
  const columnStyles = {
    headerAlign: 'center',
    align: 'center',
  };

  const columns = [

    { field: 'id', headerName: 'Serial No' , width: 80 ,
        filterable: false,
        renderCell: (value) => {
          const currentPage = value.row.page;
          const pageSize = value.row.pagesize;
          const rowNumber = (currentPage - 1) * pageSize + value.api.getRowIndex(value.row.id) + 1;
          return <div>{rowNumber}</div>;
        },
        ...columnStyles, // Apply common styles
      },
    { field: 'fullname', headerName: 'Employee', width: 200,...columnStyles, },
    { field: 'site_name', headerName: 'Site', width: 150,hide: userRole !== '3', ...columnStyles, },
    { field: 'role_name', headerName: 'Role', width: 180,hide: userRole !== '3',...columnStyles, },
    {
      field: 'attendance_date',
      headerName: 'Date',
      width: 180,
      ...columnStyles, // Apply common styles
      renderCell: (value) => {
        if(value.value !== null){
          const dateValue = new Date(value.value); // Parse the date string into a Date object
          const formattedDate = dateValue.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'long', day: 'numeric' })
          return <div>{formattedDate}</div>;
        }else{
          return <div></div>;
        }
      },
    },
    { field: 'checkin', headerName: 'CheckIn', width: 225,...columnStyles,renderCell: (value) => renderFormattedDateTime(value.value, value.row.shift_type)},
    { field: 'checkout', headerName: 'CheckOut', width: 225,...columnStyles, // Apply common styles
    renderCell: (value) => renderFormattedDateTime(value.value, value.row.shift_type),
  },
    { field: 'time', headerName: 'Total Time', width: 130,...columnStyles, },
    { field: 'acceptable_time', headerName: 'Accepted Time', width: 135,...columnStyles, },
    { field: 'early_sitting', headerName: 'Early Sitting',hide: userRole === '3', width: 135,...columnStyles, },
    { field: 'late_sitting', headerName: 'Late Sitting',hide: userRole === '3', width: 135,...columnStyles,},
  ];

    return (
        <>
          <div className="container">
              <DataGrid
                density="standard"
                autoHeight
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