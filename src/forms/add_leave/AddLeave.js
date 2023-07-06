import React, { useState } from 'react';
// import './Addshift.css';
import axios from 'axios';
import { Grid, TextField, Button, Card, CardContent, MenuItem,Stack } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { ToastContainer, toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';

function AddLeave( props ) {
    console.log(props.employees)
    const navigate = useNavigate();
    const [AddLeaveFormData, setAddLeaveFormData] = useState({ emp_id: '', leave_type: '', leave_start: null, leave_end: null,leave_reason:'' });
    const formSubmit = (event) => {
    event.preventDefault();
    console.log(AddLeaveFormData);

    axios({
                method: 'post',
                url: 'add_leave',
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
                data: {
                user_bio_id : AddLeaveFormData.emp_id,
                leave_type: AddLeaveFormData.leave_type,
                start_date: AddLeaveFormData.leave_start,
                end_date: AddLeaveFormData.leave_end,
                leave_reason: AddLeaveFormData.leave_reason
                },
            })
            .then(
                function (response) {
                    if(response.data.status==='200'){
                                    toast.success('Leave Added', {
                                                    position:'top-right',
                                                    autoClose:1000,
                                                    onClose: () => {
                                                      props.refreshList();
                                                     //navigate('/home/leaves'); // Redirect to Schedule component
                                                      //window.location.reload(); // Refresh the page
                                                    }
                                                });
                    }
                    else{
                                    toast.success('not on leave', {
                                        position:'top-right',
                                        autoClose:1000,
                                        onClose: () => navigate('/home')
                                    });
                    }
                }
            )
            .catch(error => console.error(error));
    }

    const inputEvent = (event) => {
    console.log(event.target.value);
    console.log(event.target.name);

    const { name, value } = event.target;

    setAddLeaveFormData((preValue) => {
        console.log(preValue);
        return {
        ...preValue,
        [name]: value
        };
    })
    }

    const handleStartTimeChange = (time) => {
    const date = new Date(time);
    const datetimeStr = date.toLocaleString('en-US', { hour12: false });
    // const datetimeStr = "4/18/2023, 19:30:00";
    const dateStr = datetimeStr.split(", ")[0];
    const timeStr = datetimeStr.split(", ")[1]; // split the string by comma and get the second part
    const timeParts = timeStr.split(":");
    const dateParts = dateStr.split("/");
    const reArrangedDate = dateParts[2]+'-'+dateParts[0].padStart(2, '0')+'-'+dateParts[1].padStart(2, '0')
    const reArrangedDateTime = reArrangedDate+' '+timeStr
    console.log(reArrangedDateTime)
    const start = new Date();
    start.setHours(parseInt(timeParts[0]));
    start.setMinutes(parseInt(timeParts[1]));
    start.setSeconds(parseInt(timeParts[2]));
    console.log(timeStr); // output: "19:30:00"
    console.log(start)

    setAddLeaveFormData((preValue) => {
        return {
        ...preValue,
        leave_start: reArrangedDateTime
        };
    });
    }

    const handleEndTimeChange = (time) => {
        console.log(time)
    const date = new Date(time);
    const datetimeStr = date.toLocaleString('en-US', { hour12: false });
    // const datetimeStr = "4/18/2023, 19:30:00";
    console.log(datetimeStr)
    const dateStr = datetimeStr.split(", ")[0];
    const timeStr = datetimeStr.split(", ")[1]; // split the string by comma and get the second part
    const timeParts = timeStr.split(":");
    const dateParts = dateStr.split("/");
    const reArrangedDate = dateParts[2]+'-'+dateParts[0].padStart(2, '0')+'-'+dateParts[1].padStart(2, '0')
    const reArrangedDateTime = reArrangedDate+' '+timeStr
    console.log(reArrangedDateTime)
    const end = new Date();
    end.setHours(parseInt(timeParts[0]));
    end.setMinutes(parseInt(timeParts[1]));
    end.setSeconds(parseInt(timeParts[2]));
    console.log(timeStr); // output: "19:30:00"
    console.log(end)
    setAddLeaveFormData((preValue) => {
        return {
        ...preValue,
        leave_end: reArrangedDateTime
        };
    });
    }

    return (
    <>
    <div className="App">
        <Grid>
        <Card style={{ maxWidth: 450, padding: "0px 0px", margin: "0 auto" }}>
            <CardContent>
            <form onSubmit={formSubmit}>
                <Grid >
                {props.employees.length > 0 ? (
                                <Grid xs={12} item sx={{ mt: 2}}>
                                    <TextField label="Select Employee" name='emp_id' onChange={inputEvent} select value={AddLeaveFormData.emp_id} variant="outlined" sx={{ width: "100%" }} required
                                      SelectProps={{
                                        multiple: false
                                      }}>
                                        {
                                          props.employees.map((user,index) => (
                                            <MenuItem key={user.id} value={user.id}>
                                            {user.uname}
                                          </MenuItem>
                                          ))
                                        }
                                    </TextField>
                                  </Grid>) : (<div></div>)
                                }
                <Grid xs={12} item sx={{ mt: 2 }}>
                    <TextField label="Select leave type" name='leave_type' onChange={inputEvent} select value={AddLeaveFormData.leave_type} variant="outlined" sx={{ width: "100%" }} required
                    SelectProps={{
                        multiple: false
                    }}>
                    <MenuItem value="1">1=Short Leave</MenuItem>
                    <MenuItem value="2">2=Casual Leave</MenuItem>
                    <MenuItem value="3">3=Medical Leave</MenuItem>
                    </TextField>
                </Grid>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={2} sx={{mt:2}}>
                        <DateTimePicker
                                label="Leave Start"
                                value={AddLeaveFormData.leave_start}
                                onChange={(handleStartTimeChange)}
                                variant='outlined'
                                sx={{ width: "100%" }}
                                required
                                renderInput={(params) => <TextField {...params} />}
                                />

                        <DateTimePicker
                                label="Leave End"
                                value={AddLeaveFormData.leave_end}
                                onChange={handleEndTimeChange}
                                variant='outlined'
                                sx={{ width: "150%"}}
                                required
                                renderInput={(params) => <TextField {...params} />}
                                />

                    </Stack>
                </LocalizationProvider>
                <Grid xs={12} item sx={{ mt: 2 }}>
                    <TextField label="Reason for leave" name='leave_reason' onChange={inputEvent} value={AddLeaveFormData.leave_reason} variant="outlined" sx={{ width: "100%" }} required
                    multiline
                    maxRows={2}
                    />

                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <Button type="submit" variant="contained" color="primary" sx={{ width: "100%" }} >Add</Button>
                </Grid>

                </Grid>
            </form>
            </CardContent>
        </Card>
        </Grid>
    </div>
    <ToastContainer/>
    </>
    );
}

export default AddLeave;