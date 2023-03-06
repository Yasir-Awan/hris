import React, { useState } from 'react';
import './add_user/AddUser.css';
import axios from 'axios';
import { Grid, TextField, Button, Card, CardContent, MenuItem } from '@mui/material';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function AddSchedule() {
    const [addScheduleFormData, setaddScheduleFormData] = useState({ user_bio_id: '', from_date: null, to_date: null,shift_id: '',leave_status: '' });
    const formSubmit = (event) => {
        event.preventDefault();
        console.log(addScheduleFormData);
        axios.post('', addScheduleFormData)
          .then(function (response) {
            console.log(response);
            window.location.reload(); 
          })
          .catch(function (error) {
            console.log(error);
          });
      }
    
      const inputEvent = (event) => {
        console.log(event.target.value);
        console.log(event.target.name);
    
        const { name, value } = event.target;
    
        setaddScheduleFormData((preValue) => {
          console.log(preValue);
          return {
            ...preValue,
            [name]: value
          };
        })
      }
      const handleStartDateChange = (date) => {
        setaddScheduleFormData((preValue) => {
          return {
            ...preValue,
            from_date: date
          };
        });
      }
    
      const handleEndDateChange = (date) => {
        setaddScheduleFormData((preValue) => {
          return {
            ...preValue,
            to_date: date
          };
        });
      }
      return (
        <div className="App">
          <Grid>
            <Card style={{ maxWidth: 450, padding: "20px 5px", margin: "0 auto" }}>
              <CardContent>
                <form onSubmit={formSubmit}>
                  <Grid container spacing={-4}>
                    <Grid xs={12} item>
                      <TextField placeholder='Scan User Bio Id' label="scan User Bio Id " name='user_bio_id' onChange={inputEvent} value={addScheduleFormData.user_bio_id} variant='outlined' sx={{ width: "100%" }} required />
                    </Grid>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={2}>
                          <Grid>
                            <DatePicker
                                    label="Start Date "
                                    value={addScheduleFormData.from_date}
                                    onChange={(handleStartDateChange)}
                                    variant='outlined'
                                    sx={{ width: "100%" }}
                                    required
                                    renderInput={(params) => <TextField {...params} />}
                                  />
                            </Grid>
                            <DatePicker
                                      label="End Date"
                                      value={addScheduleFormData.to_date}
                                      onChange={handleEndDateChange}
                                      variant='outlined'
                                      sx={{ width: "150%"}}
                                      required
                                      renderInput={(params) => <TextField {...params} />}
                                    />
         
                        </Stack>
                    </LocalizationProvider>
                    <Grid xs={12} item>
                      <TextField placeholder='Add Shift ID' label="Add Shift ID " name='shift_id' onChange={inputEvent} value={addScheduleFormData.shift_id} variant='outlined' sx={{ width: "100%" }} required />
                    </Grid>
                    <Grid xs={12} item>
                      <TextField label="Select Leave Status" name='leave_status' onChange={inputEvent} select value={addScheduleFormData.leave_status} variant="outlined" sx={{ width: "100%" }} required
                        SelectProps={{
                          multiple: false
                        }}>
                        <MenuItem value="1">1=Yes</MenuItem>
                        <MenuItem value="2">2=No</MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <Button type="submit" variant="contained" color="primary" sx={{ width: "100%" }} >Add</Button>
                    </Grid>
    
                  </Grid>
                </form>
              </CardContent>
            </Card>
          </Grid>
        </div>
      );
    }
export default AddSchedule