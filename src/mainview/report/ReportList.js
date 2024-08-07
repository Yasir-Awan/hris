import React, { useEffect, useState } from 'react';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import axios from 'axios';
import './ReportList.css';

const ReportList = (props) => {
  const [customFilter, setCustomFilter] = useState({
    filterType: props.filterType,
    dateRange: props.dateRange,
    site: props.selectedSite,
  });
  const [data, setData] = useState({
    loading: true,
    rows: [],
    totalRows: 0,
    rowsPerPageOptions: [5, 10, 20, 50, 100],
    pageSize: 5,
    page: 1,
  });
  const [filterModel, setFilterModel] = useState({
    items: [{ columnField: '', operatorValue: '', value: '' }],
  });

  const updateData = (k, v) => setData((prev) => ({ ...prev, [k]: v }));

  const userRole = localStorage.getItem('role');
  let attendanceRows = [];

  const transformAttendanceData = (data, startDate, endDate) => {
    const transformedData = [];
    const groupedData = {};

    data.forEach((record) => {
      const { fullname, site_name } = record;
      const employee = `${fullname}`;
      if (!groupedData[employee]) {
        groupedData[employee] = {
          site_name: site_name,
          records: [],
        };
      }
      groupedData[employee].records.push(record);
    });

    const addEmptyDates = (dateRow, checkinRow, counter) => {
      while (counter < 10) {
        dateRow[`col${counter + 1}`] = '';
        checkinRow[`col${counter + 1}`] = '';
        counter++;
      }
    };

    const generateDatesBetween = (start, end) => {
      const dates = [];
      let currentDate = new Date(start);
      while (currentDate <= end) {
        dates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return dates;
    };

    const allDates = generateDatesBetween(new Date(startDate), new Date(endDate));

    Object.entries(groupedData).forEach(([employee, { site_name,records }], index) => {
      const employeeRows = [];
      let dateRow = { id: `${index}-date` };
      let checkinRow = { id: `${index}-checkin` };
      let counter = 0;

      console.log('Employee:', employee);
      console.log('Site Name:', site_name);

      // employeeRows.push({ id: `${index}-name`, col5: employee });
      employeeRows.push({
        id: `${index}-name`,
        col5: `${employee}`,
        col6: `(${site_name})`, // Include site_name dynamically here
      });

      const dateToRecordMap = {};
      records.forEach((record) => {
        dateToRecordMap[record.attendance_date] = record;
      });

      allDates.forEach((date, i) => {
        const formattedDate = date.toLocaleDateString('en-US', {
          day: '2-digit',
          weekday: 'short',
        });
        if (counter === 10) {
          addEmptyDates(dateRow, checkinRow, counter);
          employeeRows.push(dateRow);
          employeeRows.push(checkinRow);

          dateRow = { id: `${index}-date-${i}` };
          checkinRow = { id: `${index}-checkin-${i}` };
          counter = 0;
        }

        dateRow[`col${counter + 1}`] = formattedDate;
        if (dateToRecordMap[date.toISOString().split('T')[0]]) {
          const record = dateToRecordMap[date.toISOString().split('T')[0]];
          checkinRow[`col${counter + 1}`] = `${renderFormattedDateTime(record.checkin)} - ${renderFormattedDateTime(record.checkout)}`;
        } else {
          checkinRow[`col${counter + 1}`] = '';
        }
        counter++;
      });

      if (counter > 0) {
        addEmptyDates(dateRow, checkinRow, counter);
        employeeRows.push(dateRow);
        employeeRows.push(checkinRow);
      }

      transformedData.push(...employeeRows);
    });

    return transformedData;
  };

  useEffect(() => {
    updateData('loading', true);
    let formattedStartDate = null;
    let formattedEndDate = null;
    let formattedSelectedDay = null;
    if (props.filterType === '1') {
      if (props.dateRange.startDate !== null || props.dateRange.endDate !== null) {
        let stDate = new Date(props.dateRange.startDate);
        let enDate = new Date(props.dateRange.endDate);
        const offsetStartDate = stDate.getTimezoneOffset();
        const adjustedStartDate = new Date(stDate.getTime() - offsetStartDate * 60 * 1000);
        formattedStartDate = adjustedStartDate.toISOString().split('T')[0];

        const offsetEndDate = enDate.getTimezoneOffset();
        const adjustedEndDate = new Date(enDate.getTime() - offsetEndDate * 60 * 1000);
        formattedEndDate = adjustedEndDate.toISOString().split('T')[0];
      }
    }

    if (props.filterType === '2') {
      if (props.dateRange.startDate !== null || props.dateRange.endDate !== null) {
        let stDate = new Date(props.dateRange.startDate);
        let enDate = new Date(props.dateRange.endDate);
        const offsetStartDate = stDate.getTimezoneOffset();
        const adjustedStartDate = new Date(stDate.getTime() - offsetStartDate * 60 * 1000);
        formattedStartDate = adjustedStartDate.toISOString().split('T')[0];

        const offsetEndDate = enDate.getTimezoneOffset();
        const adjustedEndDate = new Date(enDate.getTime() - offsetEndDate * 60 * 1000);
        formattedEndDate = adjustedEndDate.toISOString().split('T')[0];
      }
    }

    const updatedDateRange = {
      ...customFilter.dateRange,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };
    const updatedCustomFilter = {
      ...customFilter,
      filterType: props.filterType,
      site: props.selectedSite,
      designation: props.selectedDesignation,
      day: formattedSelectedDay,
      dateRange: updatedDateRange,
      employees: props.selectedEmployees,
    };

    setCustomFilter(updatedCustomFilter);

    console.log(updatedCustomFilter);

    axios({
      method: 'post',
      url: 'report_list',
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      data: {
        pageSize: data.pageSize,
        page: data.page,
        customFilter: updatedCustomFilter,
        filters: filterModel,
        designation: localStorage.getItem('designation'),
        emp_id: localStorage.getItem('bio_id'),
        employees: JSON.parse(localStorage.getItem('employees')),
      },
    })
      .then(function (response) {
        if (response.data.attendance_rows) {
          attendanceRows = transformAttendanceData(response.data.attendance_rows, updatedDateRange.startDate, updatedDateRange.endDate);
        }

        updateData('totalRows', attendanceRows.length);
        updateData('rows', attendanceRows);
        updateData('loading', false);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [
    data.pageSize,
    filterModel,
    props.selectedSite,
    props.dateRange,
    props.selectedDay,
    props.selectedDesignation,
    props.selectedEmployees,
  ]);

  const renderFormattedDateTime = (dateTime) => {
    if (dateTime) {
      const dateValue = new Date(dateTime);
      const hours = dateValue.getHours().toString().padStart(2, '0');
      const minutes = dateValue.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    }
    return '';
  };

  const columnStyles = {
    headerAlign: 'center',
    align: 'center',
  };

  const columns = [
    { field: 'id', headerName: 'ID', hide: true },
    { field: 'col1', headerName: 'Col1', width: 150, ...columnStyles },
    { field: 'col2', headerName: 'Col2', width: 150, ...columnStyles },
    { field: 'col3', headerName: 'Col3', width: 150, ...columnStyles },
    { field: 'col4', headerName: 'Col4', width: 150, ...columnStyles },
    { field: 'col5', headerName: 'Col5', width: 150, ...columnStyles },
    { field: 'col6', headerName: 'Col6', width: 150, ...columnStyles },
    { field: 'col7', headerName: 'Col7', width: 150, ...columnStyles },
    { field: 'col8', headerName: 'Col8', width: 150, ...columnStyles },
    { field: 'col9', headerName: 'Col9', width: 150, ...columnStyles },
    { field: 'col10', headerName: 'Col10', width: 150, ...columnStyles },
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
          page={data.page - 1}
          pageSize={data.pageSize}
          paginationMode="client"
          onPageChange={(newpage) => {
            updateData('page', newpage + 1);
          }}
          onPageSizeChange={(newPageSize) => {
            updateData('page', 1);
            updateData('pageSize', newPageSize);
          }}
          rowCount={data.totalRows}
          rows={data.rows}
          columns={columns}
          filterMode="client"
          onFilterModelChange={(newFilterModel) =>
            setFilterModel(newFilterModel)
          }
          filterModel={filterModel}
          components={{ Toolbar: GridToolbar }}
          getCellClassName={(params) => {
            if (params.field === 'col1' || params.field === 'col2' || params.field === 'col3' || params.field === 'col4' || params.field === 'col5' || params.field === 'col6' || params.field === 'col7' || params.field === 'col8' || params.field === 'col9' || params.field === 'col10') {
              if (params.row.col5) {
                return 'employee-name-cell';
              }
            }
            return '';
          }}
          getRowClassName={(params) => {
            return params.row.col5 ? 'employee-row' : '';
          }}
        />
      </div>
    </>
  );
};

export default ReportList;
