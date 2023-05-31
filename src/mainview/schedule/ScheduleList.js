import React,{useState, useEffect} from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from "axios";
import './ScheduleList.css';
import {useNavigate} from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CustomizedDialogs from '../../components/dialog';
import { Box } from '@mui/material';
import AddSchedule from "../../forms/add_schedule/AddSchedule";
// import Shift from "../Shift/Shift";

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID' ,headerAlign:'center',align:'center'},
    // { field: 'user_bio_id', headerName: 'User Bio ID', width: 150 },
    { field: 'fullname', headerName: 'EMPLOYEE', width: 180,headerAlign:'center',align:'center'},
    // { field: 'user_name', headerName: 'User Name', width: 150 },
    { field: 'from_date', headerName: 'FROM', width: 150,headerAlign:'center',align:'center'},
    { field: 'to_date', headerName: 'TO', width: 150,headerAlign:'center',align:'center'},
    { field: 'shift_name', headerName: 'SHIFT', width: 170,headerAlign:'center',align:'center'},
    { field: 'shift_start', headerName: 'SHIFT START', width: 150,headerAlign:'center',align:'center'},
    { field: 'shift_end', headerName: 'SHIFT END', width: 150,headerAlign:'center',align:'center'},
    // { field: 'leave_status', headerName: 'Leave Status', width: 150 },
];
const ScheduleList = () => {
    const navigate = useNavigate();
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
    var mydata =[];
    var shiftRecords = [];
    useEffect(() => {
      updateData('loading', true);
      refreshSchedulesList();

// api call for shifts list START
axios({
  method: 'get',
  url:'shift_list',
  headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),
}
})
  .then(function (response) {
      response.data.shift_info.forEach(element => {
          shiftRecords.push({'id':element.id,'name':element.shift_name,})
      });
      setShifts(shiftRecords);
        console.log(shifts);

  })
  .catch(error => {});// api call for shifts list END

    }, [tableData.page, tableData.pageSize,filterModel]);

    const refreshSchedulesList = () => {
          setShowDialog(false)
          // let shiftRecords =[];
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
              filters: filterModel // pass filterModel to the server,
            },
          }
          )
            .then(function (response) {
              console.log(response.data);
              if(response.data.schedule_rows){
                response.data.schedule_rows.forEach(element => {
                    mydata.push({id:element.id,fullname:element.fname + ' ' + element.lname ,user_name:element.user_name ,
                    from_date:element.from_date_readable, to_date:element.to_date_readable, shift_name:element.shift_name,
                    shift_start:element.shift_start,shift_end:element.shift_end
                  })
                }
                  );
              }
              else{
                navigate('/');
              }
              // setTableData(mydata);
              setTimeout(() => {
                const rows = mydata;
                updateData("totalRows", response.data.total_rows);
                    setTimeout(() => {
                      updateData("rows", rows);
                      updateData("loading", false);
                    }, 100);
              }, 500);
            })
            .catch(error => {
              console.log(error);
                })
                  // api call for schedule list END
      }

    return (
      <>
        <div style={{height:'auto', width: '100%', marginBottom:'2px' }}>
            <Box sx={{marginLeft:'97%', position: "absolute",top:'80px',right:'20px'}}>
                <CustomizedDialogs size='small' title= "Add New Schedule" icon={<AddIcon />} showDialog = { showDialog } setShowDialog = { v => setShowDialog(v) }>
                    <AddSchedule name={shifts} refreshList = { refreshSchedulesList }/>
                </CustomizedDialogs>
            </Box>
            <DataGrid
                autoHeight
                // rowHeight={50}
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