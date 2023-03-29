import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
// import './AddSchedule.css'
import axios from 'axios';
import { Grid, TextField, Button, Card, CardContent, MenuItem,Box} from '@mui/material';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';


const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

function AddSchedule(props) {
    const [usersList,setUserList] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [EndDate, setEndDate] = useState(null);
    const [addScheduleFormData, setAddScheduleFormData] = useState({ user_selection:'',user_bio_id: '',
              from_date: null, to_date: null,shift_id:'',leave_status: '',users:usersList});
    const navigate = useNavigate();
    const formSubmit = (event) => {
        event.preventDefault();
        if (addScheduleFormData.from_date===null) {
          alert("Please select a start date");
          return;
        }
        if (addScheduleFormData.to_date===null) {
          alert("Please select a End date");
          return;
        }

        const sDate = new Date(addScheduleFormData.from_date);
        const sDateString = sDate.toLocaleString('en-US', { timeZone: 'Asia/Karachi', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const eDate = new Date(addScheduleFormData.to_date);
        const eDateString = eDate.toLocaleString('en-US', { timeZone: 'Asia/Karachi', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setAddScheduleFormData((preValue) => {
          return {
            ...preValue,
            [addScheduleFormData.from_date]: sDateString
          };
        })
        setAddScheduleFormData((preValue) => {
          return {
            ...preValue,
            [addScheduleFormData.to_date]: eDateString
          };
        })
        console.log(addScheduleFormData);

        axios({
          method: 'post',
          url: 'add_schedule',
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
          data: {
            user_id: addScheduleFormData.user_bio_id,
            from_date: sDateString,
            to_date: eDateString,
            shift_id: addScheduleFormData.shift_id
          },
        })
        .then(
          function (response) {
            console.log(response.data.status);
            if(response.data.status==='200'){

              toast.success('Schedule Added', {
                position:'top-right',
                autoClose:1000,
                onClose: () => window.location.reload() // Redirect to Schedule component
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
        const { name, value } = event.target;
        setAddScheduleFormData((preValue) => {
          return {
            ...preValue,
            [name]: value
          };
        })
      }

      const UserSelection = (event) => {
        // api call for users list START
        axios({
          method: 'get',
          url:'user_list',
          headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),}
        })
          .then(function (response) {
            let usersRecord = [];
              response.data.user_info.forEach(element => {
                usersRecord.push({'id':element.id,'name':element.fname + ' ' + element.lname ,})
              });
              setUserList(usersRecord);
          })
          .catch(error => {});// api call for users list END

          setAddScheduleFormData(preValue => ({
            ...preValue,
            users: usersList
          }));
          const { name, value } = event.target;
          setAddScheduleFormData((preValue) => {
            return {
              ...preValue,
              [name]: value
            };
          })
      }

      // const ShiftSelection = (event) => {

      //     const { name, value } = event.target;
      //     setAddScheduleFormData((preValue) => {
      //       return {
      //         ...preValue,
      //         [name]: value
      //       };
      //     })
      // }

        const handleStartDateChange = (date) => {
        setStartDate(date);
        const sDate = new Date(date);
        const sDateString = sDate.toLocaleString('en-US', { timeZone: 'Asia/Karachi', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });


        axios({
          method: 'post',
          url: 'startdate_leavestatus',
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
          data: {
            user_id: addScheduleFormData.user_bio_id,
            from_date: sDateString,
          },
        })
        .then(
          function (response) {
            console.log(response.data.status);
            if(response.data.status==='200'){
              console.log(response.data.rdAbleStart.date);
              const sdate = new Date(response.data.rdAbleStart.date);
              const edate = new Date(response.data.rdAbleEnd.date);
              const humanReadableStartDate = sdate.toLocaleDateString();
              const humanReadableEndDate = edate.toLocaleDateString();
              setAddScheduleFormData((preValue) => {
                return {
                  ...preValue,
                  [addScheduleFormData.from_date]: null
                };
              });
              setStartDate(null);
              console.log(addScheduleFormData);
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
                  <CloseIcon color={"red"} height="25px" width="25px" />
                  {"   "}
                  <span style={{ marginLeft: 5,fontWeight: "bold", color: "#000" }}>User on leave</span>

                  <span style={{ marginLeft: 50 }}>{humanReadableStartDate} <br /> {bull}{bull} to{bull}{bull} <br /> {humanReadableEndDate}.</span>
                </div>
              )
            }
            else{
                      setAddScheduleFormData((preValue) => {
                            return {
                              ...preValue,
                              from_date: date
                            };
                        });
                      toast.success('not on leave', {
                            position:'top-right',
                            autoClose:1000,
                            // onClose: () => navigate('/home')
                        });
              }
          }

        )
        .catch(error => console.error(error));

      }


      const handleEndDateChange = (date) => {
        console.log(date);
        setEndDate(date);
        const eDate = new Date(date);
        const eDateString = eDate.toLocaleString('en-US', { timeZone: 'Asia/Karachi', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const newSDate = new Date(startDate);
        const newSDateString = newSDate.toLocaleString('en-US', { timeZone: 'Asia/Karachi', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
        // setAddScheduleFormData((preValue) => {
        //   return {
        //     ...preValue,
        //     to_date: date
        //   };
        // });
        axios({
          method: 'post',
          url: 'enddate_leavestatus',
          headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
          data: {
            user_id: addScheduleFormData.user_bio_id,
            from_date: newSDateString,
            to_date: eDateString,
          },
        })
        .then(
          function (response) {
            console.log(response.data.status);
            if(response.data.status==='200'){
              console.log(response.data.rdAbleStart.date);
              const sdate = new Date(response.data.rdAbleStart.date);
              const edate = new Date(response.data.rdAbleEnd.date);
              const humanReadableStartDate = sdate.toLocaleDateString();
              const humanReadableEndDate = edate.toLocaleDateString();
              setAddScheduleFormData((preValue) => {
                return {
                  ...preValue,
                  [addScheduleFormData.to_date]: null
                };
              });
              setEndDate(null);
              console.log(addScheduleFormData);
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
                  <CloseIcon color={"red"} height="25px" width="25px" />
                  {"   "}
                  <span style={{ marginLeft: 5,fontWeight: "bold", color: "#000" }}>User on leave</span>

                  <span style={{ marginLeft: 50 }}>{humanReadableStartDate} <br /> {bull}{bull} to{bull}{bull} <br /> {humanReadableEndDate}.</span>
                </div>
              )
            }
            else{
                      setAddScheduleFormData((preValue) => {
                            return {
                              ...preValue,
                              to_date: date
                            };
                        });
                      toast.success('not on leave', {
                            position:'top-right',
                            autoClose:1000,
                            // onClose: () => navigate('/home')
                        });
              }
          }
        )
        .catch(error => console.error(error));
      }
      return (
        <>
        <div className="App">
          <Grid>
            <Card style={{ maxWidth: 450, padding: "", margin: "0 auto" }}>
              <CardContent>
                <form onSubmit={formSubmit}>
                  <Grid>
                        <Grid xs={12} item>
                            <TextField label="Choose Option" name='user_selection' onChange={UserSelection} select value={addScheduleFormData.user_selection} variant="outlined" sx={{ width: "100%" }} required
                            SelectProps={{
                              multiple: false
                            }}>
                            <MenuItem value="1">1=Single User</MenuItem>
                            <MenuItem value="2">2=Group by Role</MenuItem>
                          </TextField>
                        </Grid>
                    {usersList.length > 0 ? (
                        <Grid xs={12} item sx={{ mt: 2}}>
                            <TextField label="Select User" name='user_bio_id' onChange={inputEvent} select value={addScheduleFormData.user_bio_id} variant="outlined" sx={{ width: "100%" }} required
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
                          </Grid>) : (<div></div>)
                      }

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
                                    onBlur={event => this.focousOut(event.target.value)}
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
                            label="Choose Shift"
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
export default AddSchedule