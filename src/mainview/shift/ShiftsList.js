import React,{useState, useEffect} from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import axios from "axios";
// import {useNavigate} from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import CustomizedDialogs from '../../components/dialog';
import { Box } from '@mui/material';
import AddShift from "../../forms/add_shift/AddShift";

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Shift Name', width: 150 },
    { field: 'shift_type_name', headerName: 'Shift Type', width: 150 },
    { field: 'start', headerName: 'Start Time', width: 150 },
    { field: 'end', headerName: 'End Time', width: 150 },
];

    const ShiftsList = () => {
    // const navigate = useNavigate();
    // const [tableData, setTableData] = useState([])
    const [shiftsList,setShiftsList] = useState([])
    const [loading,setLoading] = useState(true)
    const [showDialog,setShowDialog] = useState(false)
    // let shiftRecords =[];
    useEffect(() => {
        refreshShiftsList();
            // api call for shifts list START
            // axios({
            //     method: 'get',
            //     url:'shift_list',
            //     headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),
            // }
            // })
            //     .then(function (response) {
            //         response.data.shift_info.forEach(element => {
            //             shiftRecords.push({
            //                                 'id':element.id,
            //                                 'name':element.shift_name,
            //                                 'shift_type_name':element.shift_type_name,
            //                                 'start':element.start,
            //                                 'end':element.end,
            //                             })
            //         });
            //         setShiftsList(shiftRecords);
            //         // console.log(shifts);
            //     })
            //     .catch(error => {});// api call for shifts list END
    }, []);

    const refreshShiftsList = () => {
        setShowDialog(false)
        let shiftRecords =[];
        // api call for shifts list START
        axios({
            method: 'get',
            url:'shift_list',
            headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),
        }
        })
            .then(function (response) {
                response.data.shift_info.forEach(element => {
                    shiftRecords.push({
                                        'id':element.id,
                                        'name':element.shift_name,
                                        'shift_type_name':element.shift_type_name,
                                        'start':element.start,
                                        'end':element.end,
                                    })
                });


            setLoading(true)

        setShiftsList(shiftRecords);
                setLoading(true)
                // console.log(shifts);
            })
            .catch(error => {});// api call for shifts list END
    }

    return (
        <div style={{height:'auto', width: '100%', marginBottom:'2px' }}>
            <Box sx={{marginLeft:'97%', position: "absolute",top:'80px',right:'20px'}}>
                <CustomizedDialogs size='small' title= "Add New Shift" icon={<AddIcon />} showDialog = { showDialog } setShowDialog = { v => setShowDialog(v) }>
                    <AddShift refreshList = { refreshShiftsList } />
                </CustomizedDialogs>
            </Box>
            <DataGrid loading={loading} autoHeight rows={shiftsList} columns={columns}/>
        </div>

    )
}


export default ShiftsList