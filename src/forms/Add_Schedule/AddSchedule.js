import React, { useState, useEffect } from 'react';
// import './AddSchedule.css'
import axios from 'axios';
import { Grid, TextField, Button, Card, CardContent, MenuItem } from '@mui/material';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

function AddSchedule(props) {
    const [usersList,setUserList] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [EndDate, setEndDate] = useState(null);
    const [addScheduleFormData, setAddScheduleFormData] = useState({ user_selection:'',user_bio_id: '',
                  from_date: null, to_date: null,shift_id:'',leave_status: '',users:usersList});
    console.log(props.name)

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

        setAddScheduleFormData((preValue) => {
          console.log(preValue);
          const updatedValue = {
            ...preValue,
            [name]: value
          };
          // console.log(updatedValue);
          return updatedValue;
        })
      }
      console.log(addScheduleFormData);


      const UserSelection = (event) => {
        console.log(event.target.value);
        console.log(event.target.name);

        // api call for users list START
        // console.log(usersList.length );
        axios({
          method: 'get',
          url:'user_list',
          headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),
        }
        })
          .then(function (response) {
            let usersRecord = [];
              response.data.user_info.forEach(element => {
                usersRecord.push({'id':element.id,'name':element.fname + ' ' + element.lname ,})
              });

              // setUserList([]);
              // setUserList((prevProducts) => [ ...prevProducts, []]);
              setUserList(usersRecord);
              setAddScheduleFormData(preValue => ({
                ...preValue,
                users: usersRecord
              }))

                console.log(usersRecord.length );
                console.log(usersRecord);
                console.log(addScheduleFormData);
          })
          .catch(error => {});// api call for users list END

          setAddScheduleFormData(preValue => ({
            ...preValue,
            users: usersList
          }));
          const { name, value } = event.target;
          setAddScheduleFormData((preValue) => {
            console.log(preValue);
            return {
              ...preValue,
              [name]: value
            };
          })
      }

      const handleStartDateChange = (date) => {
        setStartDate(date);
        setAddScheduleFormData((preValue) => {
          return {
            ...preValue,
            from_date: date
          };
        });
        axios({
          method: 'post',
          url: '',
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
          data: {
            user_id: addScheduleFormData.user_bio_id,
            from_date: date,
          },
        })
        .then(response => console.log(response.data)
        )
        .catch(error => console.error(error));
      }

      const handleEndDateChange = (date) => {
        setEndDate(date);
        setAddScheduleFormData((preValue) => {
          return {
            ...preValue,
            to_date: date
          };
        });
        axios({
          method: 'post',
          url: '',
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
          data: {
            user_id: addScheduleFormData.user_bio_id,
            from_date: startDate,
            to_date: date,
          },
        })
        .then(response => console.log(response.data)
        )
        .catch(error => console.error(error));
      }
      return (
        <div className="App">
          <Grid>
            <Card style={{ maxWidth: 450, padding: "20px 5px", margin: "0 auto" }}>
              <CardContent>
                <form onSubmit={formSubmit}>
                  <Grid>
                    <Grid xs={12} item>
                    <TextField label="Select User" name='user_selection' onChange={UserSelection} select value={addScheduleFormData.user_selection} variant="outlined" sx={{ width: "100%" }} required
                    SelectProps={{
                      multiple: false
                    }}>
                    <MenuItem value="1">1=Single User</MenuItem>
                    <MenuItem value="2">2=Group by Role</MenuItem>
                  </TextField>
                  {/* <TextField label="Select shift type" name='user_bio_id' onChange={inputEvent} select value={addScheduleFormData.user_bio_id.shift_type} variant="outlined" sx={{ width: "100%" }} required
                    SelectProps={{
                      multiple: false
                    }}>
                    <MenuItem value="1">1=Standard</MenuItem>
                    <MenuItem value="2">2=Custom</MenuItem>
                  </TextField> */}
                      {/* <TextField placeholder='Scan User Bio Id' label="scan User Bio Id " name='user_bio_id'
                        onChange={inputEvent}
                        value={addScheduleFormData.user_bio_id}
                         variant='outlined' sx={{ width: "100%" }} required /> */}
                    </Grid>
                    {usersList.length > 0 ? (
                                            <Grid xs={12} sx={{ mt: 2 }} item>
                                            {/* <TextField label="Select User" name='user_selection' onChange={UserSelection} select value={addScheduleFormData.user_selection} variant="outlined" sx={{ width: "100%" }} required
                                            SelectProps={{
                                              multiple: false
                                            }}>
                                            <MenuItem value="1">1=Single User</MenuItem>
                                            <MenuItem value="2">2=Group by Role</MenuItem>
                                          </TextField> */}
                                          <TextField label="Select shift type" name='user_bio_id' onChange={inputEvent} select value={addScheduleFormData.user_bio_id} variant="outlined" sx={{ width: "100%" }} required
                                            SelectProps={{
                                              multiple: false
                                            }}>
                                              {
                                                usersList.map((user,index) => (
                                                  <MenuItem key={user.id} value={user.id}>
                                                  {user.name}
                                                </MenuItem>
                                                ))
                                              }
                                          </TextField>
                                              {/* <TextField placeholder='Scan User Bio Id' label="scan User Bio Id " name='user_bio_id'
                                                onChange={inputEvent}
                                                value={addScheduleFormData.user_bio_id}
                                                 variant='outlined' sx={{ width: "100%" }} required /> */}
                                            </Grid>
                      ) : (
                        <div>
                        </div>
                      )}

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <Stack spacing={2}>
                          <Grid sx={{ mt: 2 }}>
                            <DatePicker
                                    label="Start Date "
                                    value={startDate ?? addScheduleFormData.from_date ?? null}
                                    onChange={(handleStartDateChange)}
                                    variant='outlined'
                                    sx={{ width: "100%" }}
                                    required
                                    renderInput={(params) => <TextField {...params} />}
                                  />
                            </Grid>
                            <DatePicker
                                      label="End Date"
                                      value={EndDate ?? addScheduleFormData.to_date ?? null}
                                      onChange={handleEndDateChange}
                                      variant='outlined'
                                      sx={{ width: "150%"}}
                                      required
                                      renderInput={(params) => <TextField {...params} />}
                                    />
                        </Stack>
                    </LocalizationProvider>
                    <Grid xs={12} item sx={{ mt: 2 }}>
                    {
<TextField
  label="Shift ID"
  name="shift_id"
  select
  value={addScheduleFormData.shift_id}
  onChange={(event) => setAddScheduleFormData((prev) => ({ ...prev, shift_id: event.target.value }))}
  variant="outlined"
  sx={{ width: "100%" }}
  required
  SelectProps={{
    multiple: false
  }}
>
  {
    props.name.map((shift,index) => (
      <MenuItem key={shift.id} value={shift.id}>
      {shift.name}
    </MenuItem>
    ))
  }
</TextField>

                        }
                    </Grid>

                    <Grid xs={12} item sx={{ mt: 2 }}>
                      {/* <TextField label="Select Leave Status" name='leave_status' onChange={inputEvent} select value={addScheduleFormData.leave_status} variant="outlined" sx={{ width: "100%" }} required
                        SelectProps={{
                          multiple: false
                        }}>
                        <MenuItem value="1">1=Yes</MenuItem>
                        <MenuItem value="2">2=No</MenuItem>
                      </TextField> */}
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
      );
    }
export default AddSchedule