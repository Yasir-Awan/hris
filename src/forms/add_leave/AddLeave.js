import React, { useState } from 'react';
// import './Addshift.css';
import axios from 'axios';
import { Grid, TextField, Button, Card, CardContent, MenuItem,Stack } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ToastContainer, toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';

function AddLeave( props ) {
    console.log(props.employees)
    const navigate = useNavigate();
    const [AddLeaveFormData, setAddLeaveFormData] = useState({ emp_id: '', leave_type: '', leave_start: null, leave_end: null,leave_reason:'' });
    const [isShortLeave, setIsShortLeave] = useState(false);
    const formSubmit = (event) => {
    event.preventDefault();

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
        <Card style={{ maxWidth: 450, padding: "0px 0px", margin: "0 auto" }}>
            <CardContent>
            <form onSubmit={formSubmit}>
                <Grid >
                {localStorage.getItem('role') === '3' ? (
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
                                </Grid>) : (
                                            <Grid xs={12} item sx={{ mt: 2}}>
                                            <TextField label="Select Employee" name='emp_id' onChange={inputEvent} select value={AddLeaveFormData.emp_id} variant="outlined" sx={{ width: "100%" }} required
                                            SelectProps={{
                                                multiple: false
                                            }}>
                                                {
                                                    <MenuItem selected key={localStorage.getItem('bio_id')} value={localStorage.getItem('bio_id')}>
                                                    {localStorage.getItem('fname')+' '+localStorage.getItem('lname')}
                                                    </MenuItem>
                                                }
                                            </TextField>
                                        </Grid>)
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
                {isShortLeave ? (
                    <Stack spacing={2} sx={{mt:2}}>
                        <DateTimePicker
                                label="Leave Start"
                                name='leave_start'
                                value={AddLeaveFormData.leave_start}
                                onChange={(handleStartTimeChange)}
                                variant='outlined'
                                sx={{ width: "100%" }}
                                required
                                renderInput={(params) => <TextField {...params} />}
                                />
                        <DateTimePicker
                                label="Leave End"
                                name='leave_end'
                                value={AddLeaveFormData.leave_end}
                                onChange={handleEndTimeChange}
                                variant='outlined'
                                sx={{ width: "150%"}}
                                required
                                renderInput={(params) => <TextField {...params} />}
                                />
                    </Stack>
                ) : (
                    <Stack spacing={2} sx={{mt:2}}>
                        <DatePicker
                                label="Leave Start"
                                name='leave_start'
                                value={AddLeaveFormData.leave_start}
                                onChange={(handleStartDateChange)}
                                variant='outlined'
                                sx={{ width: "100%" }}
                                renderInput={(params) => <TextField {...params} required/>}
                                inputFormat="YYYY-MM-DD"
                                outputFormat="YYYY-MM-DD"
                                />
                                <DatePicker
                                    label="Leave End"
                                    name="leave_end"
                                    value={AddLeaveFormData.leave_end}
                                    onChange={handleEndDateChange}
                                    variant='outlined'
                                    sx={{ width: "100%"}}
                                    renderInput={(params) => <TextField {...params} required/>}
                                    inputFormat="YYYY-MM-DD"
                                    outputFormat="YYYY-MM-DD"
                                />
                    </Stack>
                )}
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