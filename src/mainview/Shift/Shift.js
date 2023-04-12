import React,{useState, useEffect} from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from "axios";
import {useNavigate} from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CustomizedDialogs from '../../components/dialog';
import { Box } from '@mui/material';
import Addshift from "../../forms/add_shift/Addshift";


const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'shift_name', headerName: 'Shift Name', width: 150 },
    { field: 'shift_type', headerName: 'Shift Type', width: 150 },
    { field: 'start', headerName: 'Start Time', width: 150 },
    { field: 'end', headerName: 'End Time', width: 150 },
];
const Shift = () => {
    const navigate = useNavigate();
    const [tableData, setTableData] = useState([])
    // var mydata =[];
    // useEffect(() => {
    //     axios({
    //         method: 'get',
    //         url: 'shift',
    //         headers: {
    //           'Authorization': 'Bearer '+localStorage.getItem('token'),
    //         }
    //       }
    //     )
    //     .then(function (response) {
    //         console.log(response.data);
    //         if(response.data.shift){
    //           response.data.shift.forEach(element => {
    //               mydata.push({'id':element.id, 'shift_name':element.shift_name,
    //               'shift_type':element.shift_type, 'start':element.start, 'end':element.end,})
    //           }
    //             );
    //         }
    //         else{
    //           navigate('/');
    //         }
    //         setTableData(mydata);
    //       })
    //       .catch(error => {
    //         console.log(error);
    //           })
    // }, []);

    return (
        <div style={{height:500, width: '100%', marginBottom:'2px' }}>
            <Box sx={{marginLeft:'97%', position: "absolute",top:'80px',right:'20px'}}>
                <CustomizedDialogs size='small' title= "Add New Shift" icon={<AddIcon />}>
                    <Addshift/>
                </CustomizedDialogs>
            </Box>
            <DataGrid rows={tableData} columns={columns}/>
        </div>

    )
}
export default Shift