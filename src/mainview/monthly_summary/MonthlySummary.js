import React,{useState, useEffect} from "react";
import { DataGrid,GridToolbar } from '@mui/x-data-grid';
import axios from "axios";
import './MonthlySummary.css';

    const MonthlySummary = (props) => {
        const [customFilter,setCustomFilter] = useState({filterType: props.filterType,month: props.selectedMonth,site: props.selectedSite,role: props.selectedRole});
        const [data, setData] = useState({loading: true,rows: [],totalRows: 0,rowsPerPageOptions: [5,10,20,50,100],pageSize: 5,page: 1});
        const [filterModel, setFilterModel] = useState({items: [{ columnField: '', operatorValue: '', value: '' }, ]});
        const updateData = (k, v) => setData((prev) => ({ ...prev, [k]: v }));
        const userRole = localStorage.getItem('role');
        const userSite = localStorage.getItem('site');

        const fetchSummaryData = async () => {
                    // api call for summary list START
            try {
                const response = await axios.post('monthly_summary', {
                    pageSize: data.pageSize,
                    page: data.page,
                    customFilter:customFilter,
                    filters: filterModel,
                    role: localStorage.getItem('role'),
                    emp_id: localStorage.getItem('bio_id'),
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
        
                const summaryRecords = response.data.summary_rows.map((element, index) => ({
                                            id:index+1,
                                            fullname:element.fullname,
                                            site_name:element.site_name,
                                            role_name:element.role_name,
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
                }));
        
                setTimeout(() => {
                    const rows = summaryRecords;
                    updateData("totalRows", response.data.total_rows);
                    updateData("rows", rows);
                    updateData("loading", false);
                }, 100);
                
            } catch (error) {
                console.error('API Error:', error);
            }
                            // api call for summary list END
        };

        useEffect(() => {
            let formattedMonth = null;
        
            if (props.filterType === '3') {
                if (props.selectedMonth !== null) {
                    // Create a Date object from the string
                    let dateObject = new Date(props.selectedMonth);

                    // Extract year and month
                    const year = dateObject.getFullYear();
                    const month = (dateObject.getMonth() + 1).toString().padStart(2, '0'); // Adding 1 because months are zero-indexed

                    // Form the "yyyy-mm" format
                     formattedMonth = year + '-' + month;
                    // const offsetSelectedDate = slctMonth.getTimezoneOffset();
                    // const adjustedSelectedDate = new Date(slctMonth.getTime() - offsetSelectedDate * 60 * 1000);
                    // formattedSelectedMonth = new Date(slctMonth.getMonth())
                    // adjustedSelectedDate.toISOString().split('T')[0];
                }
            }

            setCustomFilter((prevCustomFilter) => ({
                ...prevCustomFilter,
                filterType: props.filterType,
                site: props.selectedSite,
                role: props.selectedRole,
                month: formattedMonth,
            }));
        }, [props.selectedMonth, props.selectedSite, props.selectedRole]);

        useEffect(()=>{
            updateData('loading', true);
            fetchSummaryData();
        },[customFilter.month,customFilter.site,customFilter.role, data.page, data.pageSize, filterModel])
        

    // Define a separate styles object
        const columnStyles = {
            headerAlign: 'center',
            align: 'center',
        };

    const columns = [
        { field: 'id', headerName: 'ID' ,...columnStyles, // Apply common styles
        width:80,filterable: false,
        renderCell: (value) => {
            const currentPage = value.row.page;
            const pageSize = value.row.pagesize;
            const rowNumber = (currentPage - 1) * pageSize + value.api.getRowIndex(value.row.id) + 1;
            return <div>{rowNumber}</div>;
        },
        },
    { field: 'fullname', headerName: 'Employee', width: 180 ,...columnStyles,},
        { field: 'site_name', headerName: 'Site', width: 130,hide: userRole !== '3' ,...columnStyles,},
        { field: 'role_name', headerName: 'Role', width: 175,hide: userRole !== '3' ,...columnStyles, },
        { field: 'schedule_from', headerName: 'Schedule Start', width: 180 ,...columnStyles, // Apply common styles
        filterable: false,
        renderCell: (value) => {
            const dateValue = new Date(value.value); // Parse the date string into a Date object
            const formattedDate = dateValue.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            return <div>{formattedDate}</div>;
            },
        },
        { field: 'schedule_to', headerName: 'Schedule End', width: 180 ,...columnStyles, // Apply common styles
        filterable: false,
        renderCell: (value) => {
            const dateValue = new Date(value.value); // Parse the date string into a Date object
            const formattedDate = dateValue.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            return <div>{formattedDate}</div>;
            },
        },
        { field: 'hq_hrs', headerName: 'HQ Hours', width: 135, hide: (userSite !== '12' && userRole !== '3') ,...columnStyles, // Apply common styles
        filterable: false,
        renderCell: (value) => { return <div>{value.row.hq_hrs}</div>; },
        },
        { field: 'total_hrs', headerName: 'Site Hours', width: 135, hide: (userSite === '12' && userRole !== '3') ,...columnStyles,filterable: false,},
        { field: 'working_time', headerName: 'Working Hours', width: 135 ,...columnStyles, filterable: false,},
        { field: 'acceptable_time', headerName: 'Acceptable Hours', width: 135 ,...columnStyles, filterable: false,},
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
                onPageChange={(newpage) => { updateData("page", newpage+1); }}
                onPageSizeChange={(newPageSize) => {
                updateData("page", 1);
                updateData("pageSize", newPageSize);
                }}
                rowCount={data.totalRows}
                rows={data.rows}
                columns={columns}
                filterMode="server" // enable server-side filtering
                onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)} // handle filter changes made by the user
                 filterModel={filterModel} // pass filterModel state to the DataGrid component
                components={{Toolbar: GridToolbar}}
                />
        </div>
        </>
    )
}

export default MonthlySummary