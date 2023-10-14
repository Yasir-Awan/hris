import React,{useState, useEffect} from "react";
import { DataGrid,GridToolbar } from '@mui/x-data-grid';
import axios from "axios";

const columns = [
    { field: 'id', headerName: 'ID' ,headerAlign:'center',align:'center'},
    { field: 'name', headerName: 'Employee', width: 200 ,headerAlign:'center',align:'center'},
    { field: 'schedule_from', headerName: 'Schedule Start', width: 200 ,headerAlign:'center',align:'center',
    renderCell: (value) => {
        const dateValue = new Date(value.value); // Parse the date string into a Date object
        const formattedDate = dateValue.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        return <div>{formattedDate}</div>;
      },
    },
    { field: 'schedule_to', headerName: 'Schedule End', width: 200 ,headerAlign:'center',align:'center',
    renderCell: (value) => {
        const dateValue = new Date(value.value); // Parse the date string into a Date object
        const formattedDate = dateValue.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        return <div>{formattedDate}</div>;
      },
    },
    { field: 'hq_hrs', headerName: 'HQ Hours', width: 200 ,headerAlign:'center',align:'center'},
    { field: 'site_hrs', headerName: 'Site Hours', width: 200 ,headerAlign:'center',align:'center'},
    { field: 'working_time', headerName: 'Working Time', width: 200 ,headerAlign:'center',align:'center'},
    { field: 'acceptable_time', headerName: 'Acceptable Time', width: 150 ,headerAlign:'center',align:'center'},
];

    const MonthlySummary = () => {
    // const navigate = useNavigate();
    // const [tableData, setTableData] = useState([])
    const [monthlySummary,setMonthlySummary] = useState([])
    const [loading,setLoading] = useState(true)
    // let rowsPerPageOptions = [5,10,20,50,100]

    useEffect(() => {
        let summaryRecords = []
        let counter = 1;
            // api call for shifts list START
            setLoading(true)
            axios({
                method: 'get',
                url:'monthly_summary/'+localStorage.getItem('role')+'/'+localStorage.getItem('bio_id'),
                headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),
            }
            })
                .then(function (response) {
                    response.data.monthly_summary.forEach(element => {
                        summaryRecords.push({
                                            'id':element.id,
                                            'name':element.fullname,
                                            'schedule_from':element.schedule_start_date,
                                            'schedule_to':element.schedule_end_date,
                                            'hq_hrs':element.hq_hrs,
                                            'site_hrs':element.site_hrs,
                                            'working_time':element.total_time,
                                            'acceptable_time':element.total_acceptable_time,
                                        });
                                        counter++;
                    });
                    setLoading(false)
                    setMonthlySummary(summaryRecords);
                })
                .catch(error => {});// api call for shifts list END
    }, []);

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