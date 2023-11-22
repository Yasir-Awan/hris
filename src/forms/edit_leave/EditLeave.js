import React, { useState } from 'react';
import axios from 'axios';
import { Grid, TextField, Button, Card, CardContent, MenuItem} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ToastContainer, toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';

function EditLeave( props ) {
    const navigate = useNavigate();
    const [EditLeaveFormData, setEditLeaveFormData] = useState({ emp_id: props.EditData.emp_id,emp_name:props.EditData.emp_name,leave_id:props.EditData.leave_id, leave_type: props.EditData.leave_type, leave_start: props.EditData.leave_start, leave_end: props.EditData.leave_end,leave_reason:props.EditData.leave_reason });
    const [isShortLeave, setIsShortLeave] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const formSubmit = (event) => {
    event.preventDefault();
    let sendingData ;
    if(localStorage.getItem('role')==='3'){
        sendingData = {
            user_bio_id : EditLeaveFormData.emp_id,
            leave_id : props.EditData.leave_id,
            leave_type: EditLeaveFormData.leave_type,
            start_date: EditLeaveFormData.leave_start,
            end_date: EditLeaveFormData.leave_end,
            leave_status: props.EditData.leave_status,
            leave_reason: EditLeaveFormData.leave_reason
            }
    }
    if(localStorage.getItem('role')!=='3'){
        sendingData = {
            user_bio_id : localStorage.getItem('bio_id'),
            leave_id : props.EditData.leave_id,
            leave_type: EditLeaveFormData.leave_type,
            start_date: EditLeaveFormData.leave_start,
            end_date: EditLeaveFormData.leave_end,
            leave_status: props.EditData.leave_status,
            leave_reason: EditLeaveFormData.leave_reason
            }
    }

    axios({
                method: 'post',
                url: 'update_leave',
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
                data: sendingData,
            })
            .then(
                function (response) {
                    if(response.data.status==='200'){
                                    toast.success('Leave Updated', {
                                                    position:'top-right',
                                                    autoClose:1000,
                                                    onClose: () => {
                                                        props.refreshList();
                                                    }
                                                });
                    }else{
                                    toast.success('leave not added', {
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
        const { name, value } = event.target;
        if (name==='leave_type' && value ==='1'){
            setIsShortLeave(true)
        }else{
            setIsShortLeave(false)
        }

        setEditLeaveFormData((preValue) => {
            console.log(preValue);
            return {
            ...preValue,
            [name]: value
            };
        })
    }

    const handleStartTimeChange = (time) => {
        const date = new Date(time);
        // Adjust for time zone offset
        const offset = date.getTimezoneOffset();
        const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);

        const year = adjustedDate.getUTCFullYear();
        const month = adjustedDate.getUTCMonth() + 1;
        const day = adjustedDate.getUTCDate();
        const hours = adjustedDate.getUTCHours();
        const minutes = adjustedDate.getUTCMinutes();
        const seconds = adjustedDate.getUTCSeconds();

        const reArrangedDateTime = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        setEditLeaveFormData({ ...EditLeaveFormData, leave_start: null });                                    
        setEditLeaveFormData((preValue) => {
            return {
            ...preValue,
            leave_start: reArrangedDateTime,
            };
        });
        };

        const handleEndTimeChange = (time) => {
            const date = new Date(time);
            // Adjust for time zone offset
            const offset = date.getTimezoneOffset();
            const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);

            const year = adjustedDate.getUTCFullYear();
            const month = adjustedDate.getUTCMonth() + 1;
            const day = adjustedDate.getUTCDate();
            const hours = adjustedDate.getUTCHours();
            const minutes = adjustedDate.getUTCMinutes();
            const seconds = adjustedDate.getUTCSeconds();

            const reArrangedDateTime = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            setEditLeaveFormData({ ...EditLeaveFormData, leave_end: null });
            setEditLeaveFormData((preValue) => {
                return {
                ...preValue,
                leave_end: reArrangedDateTime,
                };
            });
    };

    const handleStartDateChange = (time) => {
                const date = new Date(time);
                // Adjust for time zone offset
                const offset = date.getTimezoneOffset();
                const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);

                const year = adjustedDate.getUTCFullYear();
                const month = adjustedDate.getUTCMonth() + 1;
                const day = adjustedDate.getUTCDate();
                const hours = adjustedDate.getUTCHours();
                const minutes = adjustedDate.getUTCMinutes();
                const seconds = adjustedDate.getUTCSeconds();
                const reArrangedDateTime = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                setStartDate(reArrangedDateTime);
                setEditLeaveFormData({ ...EditLeaveFormData, leave_start: null });
                setStartDate(null);
                setEditLeaveFormData((preValue) => {
                    return {
                    ...preValue,
                    leave_start: reArrangedDateTime,
                    };
                });
        };

        const handleEndDateChange = (time) => {
            const date = new Date(time);
            // Adjust for time zone offset
            const offset = date.getTimezoneOffset();
            const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);

            const year = adjustedDate.getUTCFullYear();
            const month = adjustedDate.getUTCMonth() + 1;
            const day = adjustedDate.getUTCDate();
            const hours = adjustedDate.getUTCHours();
            const minutes = adjustedDate.getUTCMinutes();
            const seconds = adjustedDate.getUTCSeconds();

            const reArrangedDateTime = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')} ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            setEndDate(reArrangedDateTime);
            setEditLeaveFormData({ ...EditLeaveFormData, leave_end: null });
            setEndDate(null);
            setEditLeaveFormData((preValue) => {
                return {
                ...preValue,
                leave_end: reArrangedDateTime,
                };
            });
    };

    return (
    <>
    <div className="App">
        <Grid>
        <Card style={{ width: "auto", margin: "auto" }}>
            <CardContent>
            <form onSubmit={formSubmit}>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                            <Grid xs={12} item sx={{ mt: 2}}>
                                            <TextField  name='emp_name' onChange={inputEvent} value={EditLeaveFormData.emp_name} variant="outlined" sx={{ width: "100%" }} disabled
                                            >
                                            </TextField>
                                        </Grid>
                <Grid xs={12} item sx={{ mt: 2 , mb:2}}>
                    <TextField label="Select leave type" name='leave_type' onChange={inputEvent} select value={EditLeaveFormData.leave_type} variant="outlined" sx={{ width: "100%" }} required
                    SelectProps={{
                        multiple: false
                    }}>
                    <MenuItem value="1">Short Leave</MenuItem>
                    <MenuItem value="2">Casual Leave</MenuItem>
                    <MenuItem value="3">Medical Leave</MenuItem>
                    </TextField>
                </Grid>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} item>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                {isShortLeave ? (
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 0, sm: 2, md: 3 }} item>
                    <Grid xs={6} item>
                        <DateTimePicker
                                label="Leave Start"
                                name='leave_start'
                                value={EditLeaveFormData.leave_start}
                                onChange={(handleStartTimeChange)}
                                variant='outlined'
                                sx={{ width: "100%" }}
                                PopperProps={{ disablePortal: true }} // Disable portal to prevent issues with Popper
                                required
                                renderInput={(params) => <TextField {...params} />}
                                />
                                </Grid>
                        <Grid xs={6} item>
                        <DateTimePicker
                                label="Leave End"
                                name='leave_end'
                                value={EditLeaveFormData.leave_end}
                                onChange={handleEndTimeChange}
                                variant='outlined'
                                sx={{ width: "100%"}}
                                PopperProps={{ disablePortal: true }} // Disable portal to prevent issues with Popper
                                required
                                renderInput={(params) => <TextField {...params} />}
                                />
                    </Grid>
                    </Grid>
                ) : (
                    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} item>
                    <Grid xs={6} item>
                        <DatePicker
                                label="Leave Start"
                                name='leave_start'
                                value={startDate ?? EditLeaveFormData.leave_start ?? null}
                                onChange={(handleStartDateChange)}
                                variant='outlined'
                                sx={{ width: "100%" }}
                                PopperProps={{ disablePortal: true }} // Disable portal to prevent issues with Popper
                                renderInput={(params) => <TextField {...params} required/>}
                                inputFormat="YYYY-MM-DD"
                                outputFormat="YYYY-MM-DD"
                                />
                                </Grid>
                            <Grid xs={6} item>
                                <DatePicker
                                    label="Leave End"
                                    name="leave_end"
                                    value={endDate ?? EditLeaveFormData.leave_end ?? null}
                                    onChange={handleEndDateChange}
                                    variant='outlined'
                                    sx={{ width: "100%"}}
                                    PopperProps={{ disablePortal: true }} // Disable portal to prevent issues with Popper
                                    renderInput={(params) => <TextField {...params} required/>}
                                    inputFormat="YYYY-MM-DD"
                                    outputFormat="YYYY-MM-DD"
                                />
                                </Grid>
                    </Grid>
                )}
                </LocalizationProvider>
                </Grid>
                <Grid xs={12} item sx={{ mt: 2 }}>
                    <TextField label="Reason for leave" name='leave_reason' onChange={inputEvent} value={EditLeaveFormData.leave_reason} variant="outlined" sx={{ width: "100%" }} required
                    multiline
                    maxRows={2}
                    />
                </Grid>
                <Grid item xs={12} sx={{ mt: 2 }}>
                    <Button type="submit" variant="contained" color="primary" sx={{ width: "100%" }} >Update</Button>
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

export default EditLeave;