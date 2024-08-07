import React,{useState, useEffect} from "react";
import { DataGrid } from '@mui/x-data-grid';
import axios from "axios";
import './ScheduleList.css';
import AddIcon from '@mui/icons-material/Add';
import CustomizedDialogs from '../../components/dialog';
import { Box } from '@mui/material';
import AddSchedule from "../../forms/add_schedule/AddSchedule";

    const ScheduleList = () => {
    const [showDialog,setShowDialog] = useState(false)
    const [shifts,setShifts] = useState([]);
    const [tableData, setTableData] = useState({
      loading: true,
      rows: [],
      totalRows: 0,
      rowsPerPageOptions: [5,10,20,50,100],
      pageSize: 5,
      page: 1
    });
    const [filterModel, setFilterModel] = useState({items: [{columnField: '',operatorValue: '',value: '',},],});
    const updateData = (k, v) => setTableData((prev) => ({ ...prev, [k]: v }));
    var shiftRecords = [];
    useEffect(() => {
      updateData('loading', true);
      refreshSchedulesList();

      // api call for shifts list START
      axios({
        method: 'get',
        url:'shift_list',
        headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),}
      })
        .then(function (response) {
            response.data.shift_info.forEach(element => {
                shiftRecords.push({'id':element.id,'name':element.shift_name,})
            });
            setShifts(shiftRecords);
        })
        .catch(error => {});// api call for shifts list END
    }, [tableData.page, tableData.pageSize,filterModel]);

    const refreshSchedulesList = () => {
          let mydata =[];
          setShowDialog(false)
          let counter = 1;
          // api call for schedule List START
          axios({
            method: 'post',
            url: 'schedule_list',
            headers: {
              'Authorization': 'Bearer '+localStorage.getItem('token'),
            },
            data: {
              pageSize: tableData.pageSize,
              page: tableData.page,
              filters: filterModel, // pass filterModel to the server,
              role: localStorage.getItem('role'),
              emp_id: localStorage.getItem('bio_id'),
              employees: JSON.parse(localStorage.getItem('employees'))
            },
          }
          )
            .then(function (response) {
              if(response.data.schedule_rows){
                response.data.schedule_rows.forEach(element => {
                    mydata.push({id:counter,fullname:element.fullname,site_name:element.site_name,designation_name:element.designation_name,
                    from_date:element.from_date_readable, to_date:element.to_date_readable, shift_name:element.shift_name,
                    shift_start:element.shift_start,shift_end:element.shift_end,page:response.data.page,
                    pagesize:response.data.pagesize
                  })
                  counter++;
                }
                );
              }
              else{}
                const rows = mydata;
                updateData("totalRows", response.data.total_rows);
                      updateData("rows", rows);
                      updateData("loading", false);
            })
            .catch(error => {
              console.log(error);
                })
                  // api call for schedule list END
      }

      const ConditionalComponent = ({ role }) => {
        if (role ==='4') {
          return <Box sx={{marginLeft:'97%', position: "absolute",top:'80px',right:'20px'}}>
                  </Box>;
        } else {
          return <Box sx={{marginLeft:'97%', position: "absolute",top:'100px',right:'20px'}}>
                      <CustomizedDialogs size='small' title= "Add New Schedule" icon={<AddIcon />} showDialog = { showDialog } setShowDialog = { v => setShowDialog(v) } refreshList={refreshSchedulesList}>
                          <AddSchedule name={shifts} refreshList = { refreshSchedulesList }/>
                      </CustomizedDialogs>
                  </Box>
        }
      }

      const columns = [
        { field: 'id', headerName: 'Serial No' , width: 90 ,
              filterable: false,
              renderCell: (value) => {
                const currentPage = value.row.page;
                const pageSize = value.row.pagesize;
                const rowNumber = ((currentPage - 1) * pageSize) + (value.api.getRowIndex(value.row.id) + 1);
                return <div>{rowNumber}</div>;
              },
            headerAlign:'center',align:'center'},
          { field: 'fullname', headerName: 'Employee', width: 180,headerAlign:'center',align:'center'},
          { field: 'site_name', headerName: 'Site', width: 150,headerAlign:'center',align:'center'},
          { field: 'designation_name', headerName: 'Designation', width: 180,headerAlign:'center',align:'center'},
          { field: 'from_date', headerName: 'Schedule Start', width: 160,headerAlign:'center',align:'center'},
          { field: 'to_date', headerName: 'Schedule End', width: 160,headerAlign:'center',align:'center'},
          { field: 'shift_name', headerName: 'Shift', width: 220,headerAlign:'center',align:'center'},
          { field: 'shift_start', headerName: 'Shift Start', width: 140,headerAlign:'center',align:'center'},
          { field: 'shift_end', headerName: 'Shift End', width: 140,headerAlign:'center',align:'center'},
      ];

    return (
      <>
        <div className="container">
            <ConditionalComponent role={localStorage.getItem('role')}/>
            <DataGrid
                autoHeight
                density="standard"
                loading={tableData.loading}
                rowsPerPageOptions={tableData.rowsPerPageOptions}
                pagination
                page={tableData.page-1}
                pageSize={tableData.pageSize}
                paginationMode="server"
                onPageChange={(newpage) => {
                  updateData("page", newpage+1);
                }}
                onPageSizeChange={(newPageSize) => {
                  updateData("page", 1);
                  updateData("pageSize", newPageSize);
                }}
                rowCount={tableData.totalRows}
                rows={tableData.rows}
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
export default ScheduleList