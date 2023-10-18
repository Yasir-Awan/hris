import React,{useState, useEffect} from "react";
import { DataGrid,GridToolbar } from '@mui/x-data-grid';
import axios from "axios";

const columns = [
    { field: 'id', headerName: 'ID' ,headerAlign:'center',align:'center',
    filterable: false,
    renderCell: (value) => {
        const currentPage = value.row.page;
        const pageSize = value.row.pagesize;
        const rowNumber = (currentPage - 1) * pageSize + value.api.getRowIndex(value.row.id) + 1;
        return <div>{rowNumber}</div>;
    },
    },
    { field: 'fullname', headerName: 'Employee', width: 200 ,headerAlign:'center',align:'center'},
    { field: 'schedule_from', headerName: 'Schedule Start', width: 200 ,headerAlign:'center',align:'center',
    filterable: false,
    renderCell: (value) => {
        const dateValue = new Date(value.value); // Parse the date string into a Date object
        const formattedDate = dateValue.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        return <div>{formattedDate}</div>;
        },
    },
    { field: 'schedule_to', headerName: 'Schedule End', width: 200 ,headerAlign:'center',align:'center',
    filterable: false,
    renderCell: (value) => {
        const dateValue = new Date(value.value); // Parse the date string into a Date object
        const formattedDate = dateValue.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        return <div>{formattedDate}</div>;
        },
    },
    { field: 'hq_hrs', headerName: 'HQ Hours', width: 200 ,headerAlign:'center',align:'center',
    filterable: false,
    renderCell: (value) => {    
            // if (value.row.shift_type === '2' || value.row.shift_type === '3') {
            //  // If shift_type is 1, render only the time part
            //         return <div>{value.row.total_hrs}</div>;
            // } else {
            return <div>{value.row.hq_hrs}</div>;
            // }
        },
    },
    { field: 'site_hrs', headerName: 'Site Hours', width: 200 ,headerAlign:'center',align:'center',filterable: false,},
    { field: 'working_time', headerName: 'Working Time', width: 200 ,headerAlign:'center',align:'center',filterable: false,},
    { field: 'acceptable_time', headerName: 'Acceptable Time', width: 150 ,headerAlign:'center',align:'center',filterable: false,},
];

    const MonthlySummary = () => {
        const [data, setData] = useState({loading: true,rows: [],totalRows: 0,rowsPerPageOptions: [5,10,20,50,100],pageSize: 10,page: 1});
        const [filterModel, setFilterModel] = useState({items: [
          { columnField: '', operatorValue: '', value: '' },
        ]});
        const updateData = (k, v) => setData((prev) => ({ ...prev, [k]: v }));

    useEffect(() => {
        let summaryRecords = []
        let counter = 1;
            // api call for summary list START
            axios({
                method: 'post',
                url:'monthly_summary',
                headers: {'Authorization': 'Bearer '+localStorage.getItem('token')},
                data: {
                    pageSize: data.pageSize,
                    page: data.page,
                    filters: filterModel, // pass filterModel to the server,
                    role: localStorage.getItem('role'),
                    emp_id: localStorage.getItem('bio_id')
                    },
            
            })
                .then(function (response) {
                    console.log(response.data)
                    response.data.summary_rows.forEach(element => {
                        summaryRecords.push({
                                            id:counter,
                                            fullname:element.fullname,
                                            schedule_from:element.schedule_start_date,
                                            schedule_to:element.schedule_end_date,
                                            shift_type:element.shift_type,
                                            total_hrs:element.total_hrs,
                                            hq_hrs:element.hq_hrs,
                                            site_hrs:element.site_hrs,
                                            working_time:element.total_time,
                                            acceptable_time:element.total_acceptable_time,
                                            page:response.data.page,
                                            pagesize:response.data.pagesize,
                                        });
                                        counter++;
                    });
                    setTimeout(() => {
                        const rows = summaryRecords;
                        updateData("totalRows", response.data.total_rows);
                            setTimeout(() => {
                              updateData("rows", rows);
                              updateData("loading", false);
                            }, 100);
                      }, 200);
                })
                .catch(error => {});// api call for summary list END
    }, [data.page, data.pageSize,filterModel]);

    return (
        <div style={{height:'auto', width: '100%', marginBottom:'2px' }}>
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
                    (newFilterModel) => setFilterModel(newFilterModel)
                  } 
                 // handle filter changes made by the user
                 filterModel={filterModel} // pass filterModel state to the DataGrid component
                 components={{Toolbar: GridToolbar}}
                />
        </div>
    )
}

export default MonthlySummary