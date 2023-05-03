import React, { useState } from 'react';
// import './AddShift.css';
import axios from 'axios';
import { Grid, TextField, Button, Card, CardContent, MenuItem } from '@mui/material';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import { ToastContainer, toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';

function AddShift() {
  const navigate = useNavigate();
  const [addShiftFormData, setAddShiftFormData] = useState({ shift_name: '', shift_type: '', start: null, end: null });

  const formSubmit = (event) => {
    event.preventDefault();
    console.log(addShiftFormData);

    const startDate = new Date(addShiftFormData.start);
    const startDatetimeStr = startDate.toLocaleString('en-US', { hour12: false });
    const startTimeStr = startDatetimeStr.split(", ")[1]; // split the string by comma and get the second part

    const endDate = new Date(addShiftFormData.end);
    const endDatetimeStr = endDate.toLocaleString('en-US', { hour12: false });
    const endTimeStr = endDatetimeStr.split(", ")[1]; // split the string by comma and get the second part

    axios({
                method: 'post',
                url: 'add_shift',
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
                data: {
                  shift_name : addShiftFormData.shift_name,
                  shift_type: addShiftFormData.shift_type,
                  start: startTimeStr,
                  end: endTimeStr
                },
          })
          .then(
                function (response) {
                  if(response.data.status==='200'){
                                  toast.success('Shift Added', {
                                                    position:'top-right',
                                                    autoClose:1000,
                                                    onClose: () => {
                                                      navigate('/home/schedules'); // Redirect to Schedule component
                                                      window.location.reload(); // Refresh the page
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

    setAddShiftFormData((preValue) => {
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
    const timeStr = datetimeStr.split(", ")[1]; // split the string by comma and get the second part
    const timeParts = timeStr.split(":");
    const start = new Date();
    start.setHours(parseInt(timeParts[0]));
    start.setMinutes(parseInt(timeParts[1]));
    start.setSeconds(parseInt(timeParts[2]));
console.log(timeStr); // output: "19:30:00"
console.log(start)

    setAddShiftFormData((preValue) => {
      return {
        ...preValue,
        start: time
      };
    });
  }

  const handleEndTimeChange = (time) => {
    const date = new Date(time);
    const datetimeStr = date.toLocaleString('en-US', { hour12: false });
    // const datetimeStr = "4/18/2023, 19:30:00";
    const timeStr = datetimeStr.split(", ")[1]; // split the string by comma and get the second part
    const timeParts = timeStr.split(":");
    const end = new Date();
    end.setHours(parseInt(timeParts[0]));
    end.setMinutes(parseInt(timeParts[1]));
    end.setSeconds(parseInt(timeParts[2]));
console.log(timeStr); // output: "19:30:00"
console.log(end)
    setAddShiftFormData((preValue) => {
      return {
        ...preValue,
        end: time
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
                <Grid xs={12} item>
                  <TextField placeholder='enter shift name' label="ShiftName " name='shift_name' onChange={inputEvent} value={addShiftFormData.shift_name} variant='outlined' sx={{ width: "100%" }} required />
                </Grid>
                <Grid xs={12} item sx={{ mt: 2 }}>
                  <TextField label="Select shift type" name='shift_type' onChange={inputEvent} select value={addShiftFormData.shift_type} variant="outlined" sx={{ width: "100%" }} required
                    SelectProps={{
                      multiple: false
                    }}>
                    <MenuItem value="1">1=Standard</MenuItem>
                    <MenuItem value="2">2=Custom</MenuItem>
                  </TextField>
                </Grid>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={2}>
                      <Grid sx={{ mt: 2 }}>
                        <TimePicker
                                label="Start Time"
                                value={addShiftFormData.start}
                                onChange={(handleStartTimeChange)}
                                variant='outlined'
                                sx={{ width: "100%" }}
                                required
                                renderInput={(params) => <TextField {...params} />}
                              />
                        </Grid>
                        <TimePicker
                                  label="End Time"
                                  value={addShiftFormData.end}
                                  onChange={handleEndTimeChange}
                                  variant='outlined'
                                  sx={{ width: "150%"}}
                                  required
                                  renderInput={(params) => <TextField {...params} />}
                                />

                    </Stack>
                </LocalizationProvider>
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

export default AddShift;