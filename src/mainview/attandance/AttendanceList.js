import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import './AttendanceList.css';

  const AttendanceList = (props) => {
      const [customFilter,setCustomFilter] = useState({filterType: props.filterType,dateRange: props.lockedValues,site: props.selectedSite,designation: props.selectedDesignation,day: props.selectedDay});
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
      // Inside the useEffect, create a variable to store the updated custom filter
      let formattedStartDate = null;
      let formattedEndDate = null;
      let formattedSelectedDay = null;
      if(props.filterType==='1'){
        if(props.lockedValues.startDate!==null||props.lockedValues.endDate!==null){
        let stDate = new Date(props.lockedValues.startDate); // Assuming the input is in UTC
        let enDate = new Date(props.lockedValues.endDate); // Assuming the input is in UTC
            // Adjust for the time zone offset for userStartDate
        const offsetStartDate = stDate.getTimezoneOffset();
        const adjustedStartDate = new Date(stDate.getTime() - offsetStartDate * 60 * 1000);
              formattedStartDate = adjustedStartDate.toISOString().split('T')[0];

        // Adjust for the time zone offset for userEndDate
        const offsetEndDate = enDate.getTimezoneOffset();
        const adjustedEndDate = new Date(enDate.getTime() - offsetEndDate * 60 * 1000);
              formattedEndDate = adjustedEndDate.toISOString().split('T')[0];
        }
      }

      if(props.filterType==='2'){
        if(props.selectedDay!==null){
        let slctDate = new Date(props.selectedDay); // Assuming the input is in UTC
        // Adjust for the time zone offset for userStartDate
        const offsetSelectedDate = slctDate.getTimezoneOffset();
        const adjustedSelectedDate = new Date(slctDate.getTime() - offsetSelectedDate * 60 * 1000);
              formattedSelectedDay = adjustedSelectedDate.toISOString().split('T')[0];

        }
      }

      const updatedDateRange = {
        ...customFilter.dateRange,
        startDate:formattedStartDate,
        endDate:formattedEndDate
      }
      const updatedCustomFilter = {
        ...customFilter,
        filterType: props.filterType,
        site:props.selectedSite,
        designation:props.selectedDesignation,
        day:formattedSelectedDay,
        dateRange: updatedDateRange,
      };

      // Update the state with the new custom filter
      setCustomFilter(updatedCustomFilter);
      let counter = 1;
      axios({
        method: 'post',
        url: 'attendance_list',
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
        data: {
          pageSize: data.pageSize,
          page: data.page,
          customFilter:updatedCustomFilter,
          filters: filterModel, // pass filterModel to the server,
          designation: localStorage.getItem('designation'),
          emp_id: localStorage.getItem('bio_id'),
          employees: JSON.parse(localStorage.getItem('employees'))
        },
      })
      .then(function (response) {
                      if (response.data.attendance_rows) {
                        response.data.attendance_rows.forEach((element) => {
                          attendanceRows.push({
                            id: counter,
                            fullname: element.fullname,
                            site_name: element.site_name,
                            designation_name: element.designation_name,
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

              // setTimeout(() => {
                const rows = attendanceRows;
                updateData("totalRows", response.data.total_rows);
                    // setTimeout(() => {
                      updateData("rows", rows);
                      updateData("loading", false);
                    // }, 0.0001);
              // }, 200);
      })
      .catch(error => {
        console.error(error);// Handle errors or show a user-friendly message
      });
  }, [data.page, data.pageSize,filterModel,props.selectedSite,props.lockedValues,props.selectedDay,props.selectedDesignation]);


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
    { field: 'designation_name', headerName: 'Designation', width: 180,hide: userRole !== '3',...columnStyles, },
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