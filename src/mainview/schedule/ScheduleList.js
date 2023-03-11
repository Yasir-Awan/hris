import React,{useState, useEffect} from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CustomizedDialogs from '../../components/dialog';
import { Box } from '@mui/material';
import AddSchedule from "../../forms/Add_Schedule/AddSchedule";
// import Shift from "../Shift/Shift";

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'user_bio_id', headerName: 'User Bio ID', width: 150 },
    { field: 'from_date', headerName: 'From Date', width: 150 },
    { field: 'to_date', headerName: 'To Date', width: 150 },
    { field: 'shift_id', headerName: 'Shift ID', width: 150 },
    { field: 'leave_status', headerName: 'Leave Status', width: 150 },
];
const ScheduleList = () => {
    const navigate = useNavigate();
    const [tableData, setTableData] = useState([])
    var mydata =[];
    var shifts = [];
    useEffect(() => {
      // api call for schedule List START
        axios({
            method: 'get',
            url: 'schedule',
            headers: {
              'Authorization': 'Bearer '+localStorage.getItem('token'),
            }
          })
        .then(function (response) {
            console.log(response.data);
            if(response.data.schedule){
              response.data.schedule.forEach(element => {
                  mydata.push({'id':element.id, 'user_bio_id':element.user_bio_id,
                  'from_date':element.from_date, 'to_date':element.to_date, 'shift_id':element.shift_id, 'leave_status':element.leave_status})
              });
            }
            else{
              navigate('/');
            }
            setTableData(mydata);
          })
          .catch(error => {
            console.log(error);
              }) // api call for schedule list END

// api call for shifts list START
axios({
  method: 'get',
  url:'shift_list',
  headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),
}
})
  .then(function (response) {
      response.data.shift_info.forEach(element => {
          shifts.push({'id':element.id,'name':element.shift_name,})
      });
        console.log(shifts);

  })
  .catch(error => {});// api call for shifts list END

    }, []);

    return (
      <>
        <div style={{height:500, width: '100%', marginBottom:'2px' }}>
            <Box sx={{marginLeft:'97%', position: "absolute",top:'80px',right:'20px'}}>
                <CustomizedDialogs size='small' title= "Add New Schedule" icon={<AddIcon />}>
                    <AddSchedule name={shifts}/>
                </CustomizedDialogs>
            </Box>
            <DataGrid rows={tableData} columns={columns}/>
        </div>
        </>
    )
}
export default ScheduleList