import React, { useState } from 'react';
import axios from 'axios';
import { Grid, TextField, Button, Card, CardContent, MenuItem,Box } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ToastContainer, toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';

const bull = (<Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>•</Box>);

function AddLeave( props ) {
    const navigate = useNavigate();
    const [AddLeaveFormData, setAddLeaveFormData] = useState({ emp_id: '', leave_type: '', leave_start: null, leave_end: null,leave_reason:'' });
    const [isShortLeave, setIsShortLeave] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const formSubmit = (event) => {
    event.preventDefault();
    let sendingData ;
    if(localStorage.getItem('role')==='4'){
        sendingData = {
            user_bio_id : AddLeaveFormData.emp_id,
            leave_type: AddLeaveFormData.leave_type,
            start_date: AddLeaveFormData.leave_start,
            end_date: AddLeaveFormData.leave_end,
            leave_reason: AddLeaveFormData.leave_reason
            }
    }
    if(localStorage.getItem('role')!=='4'){
        sendingData = {
            user_bio_id : localStorage.getItem('bio_id'),
            leave_type: AddLeaveFormData.leave_type,
            start_date: AddLeaveFormData.leave_start,
            end_date: AddLeaveFormData.leave_end,
            leave_reason: AddLeaveFormData.leave_reason
            }
    }

    axios({
                method: 'post',
                url: 'add_leave',
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
                data: sendingData,
            })
            .then(
                function (response) {
                    if(response.data.status==='200'){
                                    toast.success('Leave Added', {
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

        setAddLeaveFormData((preValue) => {
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

                axios({
                        method: 'post',
                        url: 'check_leave_start_date',
                        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
                        data: {
                                user_id: AddLeaveFormData.emp_id,
                                from_date: reArrangedDateTime,
                            },
                    })
                    .then(
                            function (response) {
                                    if(response.data.status==='200'){
                                            const leaveStart = new Date(response.data.rdAbleStart.date);
                                            const leaveEnd = new Date(response.data.rdAbleEnd.date);
                                            const humanReadableStartDate = leaveStart.toLocaleDateString();
                                            const humanReadableEndDate = leaveEnd.toLocaleDateString();
                                            setAddLeaveFormData({ ...AddLeaveFormData, leave_start: null });
                                            toast(
                                                <div
                                                style={{
                                                    height: "100%",
                                                    borderLeft: "5px solid yellow",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    paddingLeft: 5
                                                }}
                                                >
                                                {"   "}
                                                <span style={{ marginLeft: 5,fontWeight: "bold", color: "#000" }}>This Employee already on leave</span>
                                                <span style={{ marginLeft: 50 }}>{humanReadableStartDate} <br /> {bull}{bull} to{bull}{bull} <br /> {humanReadableEndDate}.</span>
                                                </div>
                                            )
                                            }
                                            else{}
                            }
                    )
                    .catch(error => console.error(error));
        setAddLeaveFormData((preValue) => {
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

                axios({
                        method: 'post',
                        url: 'check_leave_end_date',
                        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
                        data: {
                                user_id: AddLeaveFormData.emp_id,
                                to_date: reArrangedDateTime,
                            },
                    })
                    .then(
                            function (response) {
                                    if(response.data.status==='200'){
                                            const leaveStart = new Date(response.data.rdAbleStart.date);
                                            const leaveEnd = new Date(response.data.rdAbleEnd.date);
                                            const humanReadableStartDate = leaveStart.toLocaleDateString();
                                            const humanReadableEndDate = leaveEnd.toLocaleDateString();
                                            setAddLeaveFormData({ ...AddLeaveFormData, leave_end: null });
                                            toast(
                                                <div
                                                style={{
                                                    height: "100%",
                                                    borderLeft: "5px solid yellow",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    paddingLeft: 5
                                                }}
                                                >
                                                {"   "}
                                                <span style={{ marginLeft: 5,fontWeight: "bold", color: "#000" }}>This Employee already on leave</span>
                                                <span style={{ marginLeft: 50 }}>{humanReadableStartDate} <br /> {bull}{bull} to{bull}{bull} <br /> {humanReadableEndDate}.</span>
                                                </div>
                                            )
                                            }
                                            else{}
                            }
                    )
                    .catch(error => console.error(error));
            setAddLeaveFormData((preValue) => {
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

                axios({
                        method: 'post',
                        url: 'check_leave_start_date',
                        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
                        data: {
                                user_id: AddLeaveFormData.emp_id,
                                from_date: reArrangedDateTime,
                            },
                    })
                    .then(
                            function (response) {
                                    if(response.data.status==='200'){
                                            const leaveStart = new Date(response.data.rdAbleStart.date);
                                            const leaveEnd = new Date(response.data.rdAbleEnd.date);
                                            const humanReadableStartDate = leaveStart.toLocaleDateString();
                                            const humanReadableEndDate = leaveEnd.toLocaleDateString();
                                            setAddLeaveFormData({ ...AddLeaveFormData, leave_start: null });
                                            setStartDate(null);
                                            toast(
                                                <div
                                                style={{
                                                    height: "100%",
                                                    borderLeft: "5px solid yellow",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    paddingLeft: 5
                                                }}
                                                >
                                                {"   "}
                                                <span style={{ marginLeft: 5,fontWeight: "bold", color: "#000" }}>This Employee already on leave</span>
                                                <span style={{ marginLeft: 50 }}>{humanReadableStartDate} <br /> {bull}{bull} to{bull}{bull} <br /> {humanReadableEndDate}.</span>
                                                </div>
                                            )
                                            }
                                            else{}
                            }
                    )
                    .catch(error => console.error(error));
                setAddLeaveFormData((preValue) => {
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

                axios({
                        method: 'post',
                        url: 'check_leave_end_date',
                        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
                        data: {
                                user_id: AddLeaveFormData.emp_id,
                                to_date: reArrangedDateTime,
                            },
                    })
                    .then(
                            function (response) {
                                    if(response.data.status==='200'){
                                            const leaveStart = new Date(response.data.rdAbleStart.date);
                                            const leaveEnd = new Date(response.data.rdAbleEnd.date);
                                            const humanReadableStartDate = leaveStart.toLocaleDateString();
                                            const humanReadableEndDate = leaveEnd.toLocaleDateString();
                                            setAddLeaveFormData({ ...AddLeaveFormData, leave_end: null });
                                            setEndDate(null);
                                            toast(
                                                <div
                                                style={{
                                                    height: "100%",
                                                    borderLeft: "5px solid yellow",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    paddingLeft: 5
                                                }}
                                                >
                                                {"   "}
                                                <span style={{ marginLeft: 5,fontWeight: "bold", color: "#000" }}>This Employee already on leave</span>
                                                <span style={{ marginLeft: 50 }}>{humanReadableStartDate} <br /> {bull}{bull} to{bull}{bull} <br /> {humanReadableEndDate}.</span>
                                                </div>
                                            )
                                            }
                                            else{}
                            }
                    )
                    .catch(error => console.error(error));

            setAddLeaveFormData((preValue) => {
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
                {localStorage.getItem('role') === '3' || localStorage.getItem('role') === '2' ? (
                                <Grid xs={12} item sx={{ mt: 2}}>
                                    <TextField label="Select Employee" name='emp_id' onChange={inputEvent} select value={AddLeaveFormData.emp_id} variant="outlined" sx={{ width: "100%" }} required
                                    SelectProps={{
                                        multiple: false
                                    }}>
                                        {
                                        props.employees.map((user,index) => (
                                            <MenuItem key={index} value={user.id}>
                                            {user.fullname}
                                            </MenuItem>
                                            ))
                                        }
                                    </TextField>
                                </Grid>) : (
                                            <Grid xs={12} item sx={{ mt: 2}}>
                                            <TextField label={localStorage.getItem('fname')+' '+localStorage.getItem('lname')} name='emp_id' onChange={inputEvent} value={AddLeaveFormData.emp_id} variant="outlined" sx={{ width: "100%" }} disabled
                                            >
                                            </TextField>
                                        </Grid>)
                                }
                <Grid xs={12} item sx={{ mt: 2 , mb:2}}>
                    <TextField label="Select leave type" name='leave_type' onChange={inputEvent} select value={AddLeaveFormData.leave_type} variant="outlined" sx={{ width: "100%" }} required
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
                                value={AddLeaveFormData.leave_start}
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
                                value={AddLeaveFormData.leave_end}
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
                                    value={startDate ?? AddLeaveFormData.leave_start ?? null}
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
                                        value={endDate ?? AddLeaveFormData.leave_end ?? null}
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