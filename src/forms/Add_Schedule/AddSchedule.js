import React, {useState,} from 'react';
import {useNavigate} from 'react-router-dom';
import './AddSchedule.css';
import axios from 'axios';
import { 
          Grid, TextField, Button, Card,
          CardContent, MenuItem,Box,Radio,
          RadioGroup,FormControlLabel,FormLabel,FormControl
        } from '@mui/material';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import dayjs from 'dayjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CloseIcon from '@mui/icons-material/Close';
import { pink } from '@mui/material/colors';

const bull = (<Box component="span" sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}>•</Box>);

function AddSchedule(props) {

    const navigate = useNavigate();
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [usersList,setUserList] = useState([]);
    const [blockedLeaveDates, setBlockedLeaveDates] = useState([]);
    const [blockedScheduleDates, setBlockedScheduleDates] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [leaveStartDate, setLeaveStartDate] = useState(null);
    const [EndDate, setEndDate] = useState(null);
    const [viewedMonth, setViewedMonth] = useState(dayjs().month()); // initialize with the current month
    const [addScheduleFormData, setAddScheduleFormData] = useState({
                                                                      user_selection:'',user_bio_id: '',
                                                                      from_date: null, to_date: null,shift_id:'',
                                                                      leave_status: '',users:usersList
                                                                    });
    const [publicHolidays, setPublicHolidays] = useState(0);
    const [publicHolidaysCount, setPublicHolidaysCount] = useState(0);
    const [publicHolidayReason, setPublicHolidaysReason] = useState(null);

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
                      usersRecord.push({'id':element.bio_ref_id,'name':element.fname + ' ' + element.lname ,})
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

    const getDates = (startDate, stopDate) => {
        let dateArray = [];
        let currentDate = startDate;
        while (currentDate <= stopDate) {
            var formattedDate = currentDate.toISOString().slice(0, 10);
            dateArray.push(formattedDate);
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return dateArray;
    }

    const inputEvent = (event) => {
        setBlockedLeaveDates([])
        setBlockedScheduleDates([])
        setAddScheduleFormData((preValue) => {
          return {
                    ...preValue,
                    from_date: null
                  };
        })
        setStartDate(null)
        setViewedMonth(dayjs().month())
        const { name, value } = event.target;
                // api call for Blocked Dates list START
                axios({
                  method: 'post',
                  url:'start_schedule_blocked_dates',
                  headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),},
                  data: {
                    user_id: value,
                  },
                })
                  .then(function (response) {
                    // if(response.data.blocked_info.leaveCount > 0 ){
                    //             let startDateString = response.data.blocked_info.leaveDates[0].start_date;
                    //             let stopDateString = response.data.blocked_info.leaveDates[0].end_date;

                    //             let startDateParts = startDateString.split(/[- :]/);
                    //             let stopDateParts = stopDateString.split(/[- :]/);

                    //             let startDate = new Date(Date.UTC(startDateParts[0], startDateParts[1]-1, startDateParts[2], startDateParts[3], startDateParts[4], startDateParts[5]));
                    //             let stopDate = new Date(Date.UTC(stopDateParts[0], stopDateParts[1]-1, stopDateParts[2], stopDateParts[3], stopDateParts[4], stopDateParts[5]));

                    //             let dateArray = getDates(startDate, stopDate);
                    //             setBlockedLeaveDates(dateArray);
                    // }
                    if(response.data.blocked_info.scheduleCount > 0){
                                    let scheduleDates = response.data.blocked_info.scheduleDates;
                                    let shapackArray = scheduleDates.map(schedule => {
                                    let startDateString = schedule.from_date;
                                    let stopDateString = schedule.to_date;

                                    let formattedStartDateString = startDateString + " 00:00:00";
                                    let formattedStopDateString = stopDateString + " 00:00:00";

                                    let startDateParts = formattedStartDateString.split(/[- :]/);
                                    let stopDateParts = formattedStopDateString.split(/[- :]/);

                                    let startDate = new Date(Date.UTC(startDateParts[0], startDateParts[1]-1, startDateParts[2], startDateParts[3], startDateParts[4], startDateParts[5]));
                                    let stopDate = new Date(Date.UTC(stopDateParts[0], stopDateParts[1]-1, stopDateParts[2], stopDateParts[3], stopDateParts[4], stopDateParts[5]));

                                    return getDates(startDate, stopDate);
                                });

                                const mergedArray = shapackArray.reduce((acc, curr) => {
                                  return [...acc, ...curr];
                                }, []);
                                setBlockedScheduleDates(mergedArray);
                              // api call for Blocked Dates list END
                    }
                    setAddScheduleFormData((preValue) => {
                                    return {
                                            ...preValue,
                                            [name]: value
                                          };
                    })
                })
    }

    const handleMonthChange = (date) => {
      // setSelectedDate(date);
      setViewedMonth(date.month());
    };

    const handlePublicHolidaysCount = (event) => {
      console.log(event.target.value)
      const newValue = event.target.value.replace(/[^0-9]/g, '');
      const limitedValue = Math.min(newValue, 10); // Limit value to 10
      setPublicHolidaysCount(limitedValue);
      // setPublicHolidaysCount(newValue)
    };

    const handlePublicHolidays = (event) => {
      // const { name,value } = event.target;
      const newValue = event.target.value.replace(/[^0-9]/g, '');
      setPublicHolidays(newValue)
      if(newValue === '0'){
        alert();
        setPublicHolidaysCount(0)
        setPublicHolidaysReason(null)
      }
    };

    const HandlePublicHolidayReason = (event) => {
      // const { name,value } = event.target;
      const newValue = event.target.value;
      setPublicHolidaysReason(newValue)
    };

    // const handleDayHover = (employeeName) => {
    //       setHoveredDateEmployeeName(employeeName);
    // };

    // const handleClose = () => {
    // datePickerRef.current.close();
    // };
    const handleStartDateChange = (date) => {
              setStartDate(date);
              setOpenDatePicker(false)
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
                                    // // if(response.data.status==='200'){
                                    //           const sdate = new Date(response.data.rdAbleStart.date);
                                    //           const edate = new Date(response.data.rdAbleEnd.date);
                                    //           const humanReadableStartDate = sdate.toLocaleDateString();
                                    //           const humanReadableEndDate = edate.toLocaleDateString();
                                    //           setAddScheduleFormData((preValue) => {
                                    //             return {
                                    //                       ...preValue,
                                    //                       [addScheduleFormData.from_date]: null
                                    //                     };
                                    //           });
                                    //           setStartDate(null);
                                    //           // setOpenDatePicker(false)
                                    //           toast(
                                    //             <div
                                    //               style={{
                                    //                 height: "100%",
                                    //                 borderLeft: "5px solid yellow",
                                    //                 display: "flex",
                                    //                 alignItems: "center",
                                    //                 paddingLeft: 5
                                    //               }}
                                    //             >
                                    //               <CloseIcon color={"red"} height="25px" width="25px" />
                                    //               {"   "}
                                    //               <span style={{ marginLeft: 5,fontWeight: "bold", color: "#000" }}>User on leave</span>
                                    //               <span style={{ marginLeft: 50 }}>{humanReadableStartDate} <br /> {bull}{bull} to{bull}{bull} <br /> {humanReadableEndDate}.</span>
                                    //             </div>
                                    //           )
                                    //           // setSelectedDate(null);
                                    //         }
                                    //         else{
                                              // let leaveStartingDate = new Date(response.data.startDate_leaveInfo[0].start_date);
                                              // leaveStartingDate.setDate(leaveStartingDate.getDate() - 1);
                                              // setLeaveStartDate(leaveStartingDate)
                                                      setAddScheduleFormData((preValue) => {
                                                            return {
                                                                      ...preValue,
                                                                      from_date: date
                                                                    };
                                                        });
                                                      // toast.success('not on leave', {
                                                      //       position:'top-right',
                                                      //       autoClose:1000,
                                                      //       // onClose: () => navigate('/home')
                                                      //   });
                                                        // setSelectedDate(null);
                                                        // setOpenDatePicker(false)
                                              // }
                            }
                  )
                  .catch(error => console.error(error));
        }

    const renderDay = (date, _selectedDate, dayInCurrentMonth, dayComponent) => {
          const isBlockedLeaveDate = blockedLeaveDates.some(
              (blockedDate) => dayjs(blockedDate).isSame(date, "day")
          );
          const isBlockedScheduleDate = blockedScheduleDates.some(
            (blockedDate) => dayjs(blockedDate).isSame(date, "day")
        );

          const isCurrentMonth = date.month() === viewedMonth;
          const isDisabled = !isCurrentMonth || isBlockedLeaveDate || isBlockedScheduleDate;

          // Get the employee names for the blocked dates that match the current date
          // const employeeNames = blockedLeaveDates
          //   .filter((blockedDate) => dayjs(blockedDate.date).isSame(date, "day"))
          //   .map((blockedDate) => blockedDate.employeeName);

          // Customize the appearance of each day cell using the PickersDay component
          return (
            <PickersDay
              key={date.format("YYYY-MM-DD")}
              day={date}
              disableMargin
              disabled={isDisabled}
              outsideCurrentMonth={!isCurrentMonth}
              selected={startDate?.isSame(date, "day")}
              today={dayjs().isSame(date, "day")}
              onClick={() => handleStartDateChange(date)}
              onDaySelect={() => setStartDate(date)}
              // onMouseEnter={() => handleDayHover(employeeNames)}
              className={`${isBlockedLeaveDate ? 'blocked-leave-date' : ''} ${
                isBlockedScheduleDate ? 'blocked-schedule-date' : ''
              }`}
              showDaysOutsideCurrentMonth={true}
            >
              {dayjs(date).format("DD")}
            </PickersDay>
          );
    };


    const handleEndDateChange = (date) => {
      setEndDate(date);
      const eDate = new Date(date);
      const eDateString = eDate.toLocaleString('en-US', { timeZone: 'Asia/Karachi', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const newSDate = new Date(startDate);
      const newSDateString = newSDate.toLocaleString('en-US', { timeZone: 'Asia/Karachi', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });

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
                                // if(response.data.status==='200'){
                                //   const sdate = new Date(response.data.rdAbleStart.date);
                                //   const edate = new Date(response.data.rdAbleEnd.date);
                                //   const humanReadableStartDate = sdate.toLocaleDateString();
                                //   const humanReadableEndDate = edate.toLocaleDateString();
                                //   setAddScheduleFormData((preValue) => {
                                //     return {
                                //               ...preValue,
                                //               [addScheduleFormData.to_date]: null
                                //             };
                                //   });
                                //   setEndDate(null);
                                //   toast(
                                //     <div
                                //       style={{
                                //         height: "100%",
                                //         borderLeft: "5px solid yellow",
                                //         display: "flex",
                                //         alignItems: "center",
                                //         paddingLeft: 5
                                //       }}
                                //     >
                                //       <CloseIcon color={"red"} height="25px" width="25px" />
                                //       {"   "}
                                //       <span style={{ marginLeft: 5,fontWeight: "bold", color: "#000" }}>User on leave</span>
                                //       <span style={{ marginLeft: 50 }}>{humanReadableStartDate} <br /> {bull}{bull} to{bull}{bull} <br /> {humanReadableEndDate}.</span>
                                //     </div>
                                //   )
                                // }
                                // else{
                                          setAddScheduleFormData((preValue) => {
                                                return {
                                                          ...preValue,
                                                          to_date: date
                                                        };
                                            });
                                          // toast.success('not on leave', {
                                          //       position:'top-right',
                                          //       autoClose:1000,
                                          //       // onClose: () => navigate('/home')
                                          //   });
                                  // }
                        }
              )
              .catch(error => console.error(error));
    }

    const formSubmit = (event) => {
        event.preventDefault();
        const sDate = new Date(addScheduleFormData.from_date);
        const sDateString = sDate.toLocaleString('en-US', { timeZone: 'Asia/Karachi', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
        const eDate = new Date(addScheduleFormData.to_date);
        const eDateString = eDate.toLocaleString('en-US', { timeZone: 'Asia/Karachi', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
        console.log(sDateString+' '+eDateString); 
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

        axios({
                method: 'post',
                url: 'add_schedule',
                headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
                data: {
                  user_id: addScheduleFormData.user_bio_id,
                  from_date: sDateString,
                  to_date: eDateString,
                  shift_id: addScheduleFormData.shift_id,
                  p_h_c: publicHolidaysCount,
                  p_h_r: publicHolidayReason
                },
        })
        .then(
                function (response) {
                  if(response.data.status==='200'){
                                  toast.success('Schedule Added', {
                                                    position:'top-right',
                                                    autoClose:1000,
                                                    onClose: () => {
                                                      props.refreshList();
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
                                    <MenuItem value="2">2=Group by Site</MenuItem>
                                  </TextField>
                                </Grid>
                                {usersList.length > 0 ? (
                                <Grid xs={12} item sx={{ mt: 2}}>
                                    <TextField label="Select Employee" name='user_bio_id' onChange={inputEvent} select value={addScheduleFormData.user_bio_id} variant="outlined" sx={{ width: "100%" }} required
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
                                    {console.log('function Call')}
                                    <DatePicker
                                            label="Start Date "
                                            open={openDatePicker}
                                            value={startDate ?? addScheduleFormData.from_date ?? null}
                                            onMonthChange={(handleMonthChange)}
                                            renderDay={renderDay}
                                            onChange={(handleStartDateChange)}
                                            variant='outlined'
                                            sx={{ width: "100%" }}
                                            renderInput={(params) => <TextField {...params} required />}
                                            // renderDay={renderDay}
                                            inputFormat="YYYY-MM-DD"
                                            outputFormat="YYYY-MM-DD"
                                            onBlur={event => this.focousOut(event.target.value)}
                                            onOpen={() => setOpenDatePicker(true)}
                                            onClose={() => setOpenDatePicker(false)}
                                            minDate={dayjs().month(3).startOf('month')}
                                            // disablePast={true}
                                          />
                                    </Grid>
                                    <DatePicker
                                              label="End Date"
                                              value={EndDate ?? addScheduleFormData.to_date ?? null}
                                              onChange={handleEndDateChange}
                                              variant='outlined'
                                              sx={{ width: "100%"}}
                                              renderInput={(params) => <TextField {...params} required/>}
                                              inputFormat="YYYY-MM-DD"
                                              outputFormat="YYYY-MM-DD"
                                              minDate={startDate}
                                              maxDate={leaveStartDate}
                                            />
                                </Stack>
                            </LocalizationProvider>
                            <Grid xs={12} item>
                            <FormControl>
                              <FormLabel id="demo-controlled-radio-buttons-group" sx={{mt:1.5}}>Public Holidays</FormLabel>
                              <RadioGroup
                                row
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={publicHolidays}
                                onChange={handlePublicHolidays}
                              >
                                <FormControlLabel value="1" control={<Radio required/>} label="Yes" />
                                <FormControlLabel value="0" control={<Radio required sx={{
                                      color: pink[800],
                                      '&.Mui-checked': {
                                        color: pink[600],
                                      },
                                    }} />} label="No" />
                              </RadioGroup>
                            </FormControl>
                            </Grid>

                            {publicHolidays > 0 ? (
                                <Grid xs={12} item sx={{ mt: 2}}>
          
                                    <TextField label="Holidays Count" name='public_holiday_count' onChange={handlePublicHolidaysCount}
                                      value={publicHolidaysCount} variant="outlined" sx={{ width: "100%" }} required inputProps={{
                                        max: 10, // Set the maximum value
                                      }} >
                                    </TextField>
                                    <Grid xs={12} item sx={{ mt: 2 }}>
                                          <TextField label="Reason for Public Holiday" name='p_h_reason' onChange={HandlePublicHolidayReason} value={publicHolidayReason} variant="outlined" sx={{ width: "100%" }} required
                                          multiline
                                          maxRows={2}
                                          />
                                      </Grid>
                                </Grid>) : (<div></div>)
                                }

                            <Grid xs={12} item sx={{ mt: 1 }}>
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