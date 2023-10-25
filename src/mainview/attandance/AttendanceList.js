import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';

  const AttendanceList = (props) => {
      // const [filterVals,setFilterVals] = useState([props.filterValues])
      const [data, setData] = useState({loading: true,rows: [],totalRows: 0,rowsPerPageOptions: [5,10,20,50,100],pageSize: 10,page: 1});
      const [filterModel, setFilterModel] = useState({items: [
        { columnField: '', operatorValue: '', value: '' },
      ]});
      const updateData = (k, v) => setData((prev) => ({ ...prev, [k]: v }));
      const userRole = localStorage.getItem('role');
      // const navigate = useNavigate();
      let attendanceRows = [];

  useEffect(() => {
      updateData('loading', true);
      console.log('filterModel:', filterModel); // add this line to check filterModel value
      // console.log(filterVals);
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
                            site: element.site_name,
                            role: element.role_name,
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

  const columns = [

    { field: 'id', headerName: 'Serial No' , width: 80 ,
        filterable: false,
        renderCell: (value) => {
          const currentPage = value.row.page;
          const pageSize = value.row.pagesize;
          const rowNumber = (currentPage - 1) * pageSize + value.api.getRowIndex(value.row.id) + 1;
          return <div>{rowNumber}</div>;
        },
      headerAlign:'center',align:'center'},
    { field: 'fullname', headerName: 'Employee', width: 180,headerAlign:'center',align:'center'},
    { field: 'site', headerName: 'Site', width: 150,hide: userRole !== '3', headerAlign:'center',align:'center'},
    { field: 'role', headerName: 'Role', width: 180,hide: userRole !== '3',headerAlign:'center',align:'center'},
    {
      field: 'attendance_date',
      headerName: 'Date',
      width: 180,
      headerAlign: 'center',
      align: 'center',
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
    { field: 'checkin', headerName: 'CheckIn', width: 200,headerAlign:'center',align:'center',
    renderCell: (value) => {
      console.log('Shift Type:', value.row.shift_type);
      if(value.value!==null){
        const inputDateTime = value.value; // Get the date and time string from your data
        const dateValue = new Date(inputDateTime); // Parse the date and time string into a Date object
  
        if (value.row.shift_type === '1') {
           // If shift_type is 1, render only the time part
          const timeString = dateValue.getHours().toString().padStart(2, '0') + ':' +
                              dateValue.getMinutes().toString().padStart(2, '0') + ':' +
                              dateValue.getSeconds().toString().padStart(2, '0');
                  return <div>{timeString}</div>;
        } else {
          // If shift_type is 2, render both date and time
          // Define options for formatting
                  const options = {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false, // Use 24-hour format
                  };
                  // Format the date and time as a human-readable string
                  const formattedDateTime = dateValue.toLocaleDateString('en-US', options);
                  return <div>{formattedDateTime}</div>;
        }
      }
    },
  },
    { field: 'checkout', headerName: 'CheckOut', width: 200,headerAlign:'center',align:'center',
    renderCell: (value) => {
          if(value.value !== null){
            const inputDateTime = value.value; // Get the date and time string from your data
            const dateValue = new Date(inputDateTime); // Parse the date and time string into a Date object
  
            if (value.row.shift_type === '1') {
              // If shift_type is 1, render only the time part
              const timeString = dateValue.getHours().toString().padStart(2, '0') + ':' +
                                dateValue.getMinutes().toString().padStart(2, '0') + ':' +
                                dateValue.getSeconds().toString().padStart(2, '0');
                    return <div>{timeString}</div>;
          } else {
             // If shift_type is 2, render both date and time
             // Define options for formatting
                    const options = {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                       hour12: false, // Use 24-hour format
                    };
                     // Format the date and time as a human-readable string
                    const formattedDateTime = dateValue.toLocaleDateString('en-US', options);
                    return <div>{formattedDateTime}</div>;
          }
          }
    },
  },
    { field: 'time', headerName: 'Total Time', width: 130,headerAlign:'center',align:'center'},
    { field: 'early_sitting', headerName: 'Early Sitting',hide: userRole === '3', width: 130,headerAlign:'center',align:'center'},
    { field: 'late_sitting', headerName: 'Late Sitting',hide: userRole === '3', width: 130,headerAlign:'center',align:'center'},
    // { field: 'extra_time', headerName: 'Extra Sitting',hide: userRole === '3', width: 135,headerAlign:'center',align:'center'},
    { field: 'acceptable_time', headerName: 'Accepted Time', width: 135,headerAlign:'center',align:'center'},
  ];

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