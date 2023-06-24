import React,{useState, useEffect} from "react";
import { DataGrid, GridColDef,GridToolbar } from '@mui/x-data-grid';
import axios from "axios";

const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID' },
    { field: 'name', headerName: 'Employee', width: 200 },
    { field: 'schedule_from', headerName: 'Schedule From', width: 200 },
    { field: 'schedule_to', headerName: 'Schedule to', width: 200 },
    { field: 'required_hrs_normal', headerName: 'Required Hours', width: 200 },
    { field: 'required_hrs_including_weekends', headerName: 'Required Hours Leave weekend Excluded', width: 200 },
    { field: 'working_time', headerName: 'Working Time', width: 200 },
    { field: 'acceptable_time', headerName: 'Acceptable Time', width: 150 },
];

    const MonthlySummary = () => {
    // const navigate = useNavigate();
    // const [tableData, setTableData] = useState([])
    const [monthlySummary,setMonthlySummary] = useState([])
    const [loading,setLoading] = useState(true)

    useEffect(() => {
        let summaryRecords = []
            // api call for shifts list START
            setLoading(true)
            axios({
                method: 'get',
                url:'monthly_summary',
                headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),
            }
            })
                .then(function (response) {
                    response.data.monthly_summary.forEach(element => {
                        summaryRecords.push({
                                            'id':element.id,
                                            'name':element.fullname,
                                            'schedule_from':element.from_date_readable,
                                            'schedule_to':element.to_date_readable,
                                            'required_hrs_normal':element.required_hrs_normal,
                                            'required_hrs_including_weekends':element.required_hrs_excluding_weekends,
                                            'working_time':element.total_time,
                                            'acceptable_time':element.total_acceptable_time,

                                        })
                    });
                    setMonthlySummary(summaryRecords);
                    setLoading(false)
                })
                .catch(error => {});// api call for shifts list END
    }, []);

    // const refreshShiftsList = () => {
    //     setShowDialog(false)
    //     let shiftRecords =[];
    //     // api call for shifts list START
    //     axios({
    //         method: 'get',
    //         url:'shift_list',
    //         headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),
    //     }
    //     })
    //         .then(function (response) {
    //             response.data.shift_info.forEach(element => {
    //                 shiftRecords.push({
    //                                     'id':element.id,
    //                                     'name':element.shift_name,
    //                                     'shift_type_name':element.shift_type_name,
    //                                     'start':element.start,
    //                                     'end':element.end,
    //                                 })
    //             });


    //         setLoading(true)

    //     setShiftsList(shiftRecords);
    //             setLoading(false)
    //             // console.log(shifts);
    //         })
    //         .catch(error => {});// api call for shifts list END
    // }

    return (
        <div style={{height:'auto', width: '100%', marginBottom:'2px' }}>
            <DataGrid
                loading={loading}
                autoHeight
                rows={monthlySummary}
                columns={columns}
                components={{Toolbar: GridToolbar}}
                density='compact'
                />
        </div>

    )
}


export default MonthlySummary