import React, {useState,useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import './AddSchedule.css';
import axios from 'axios';
import { 
          Grid, TextField, Button, Card,Box,Checkbox,
          CardContent, MenuItem,Radio,FormGroup,
          RadioGroup,FormControlLabel,FormLabel,FormControl
        } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import dayjs from 'dayjs';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { pink } from '@mui/material/colors';

function AddSchedule(props) {
    const navigate = useNavigate();
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [usersList,setUserList] = useState([]);
    const [filteredUsersList,setFilteredUsersList] = useState([]);
    const [selectedSite,setSelectedSite] = useState('');
    const [selectedRole,setSelectedRole] = useState('');
    const [rolesList,setRolesList] = useState([]);
    const [sites,setSites] = useState([]);
    const [blockedLeaveDates, setBlockedLeaveDates] = useState([]);
    const [blockedScheduleDates, setBlockedScheduleDates] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [gridWidth, setGridWidth] = useState(12);
    const [inpuWidth, setInputWidth] = useState('95%');
    const [leaveStartDate] = useState(null);
    const [EndDate, setEndDate] = useState(null);
    const [viewedMonth, setViewedMonth] = useState(dayjs().month()); // initialize with the current month
    const [addScheduleFormData, setAddScheduleFormData] = useState({  option_selection:'',user_bio_id: '',site_id:selectedSite,
                                                                      from_date: null, to_date: null,shift_id:'',
                                                                      leave_status: '',users:usersList  });
    const [publicHolidays, setPublicHolidays] = useState(0);
    const [publicHolidaysCount, setPublicHolidaysCount] = useState(0);
    const [publicHolidayReason, setPublicHolidaysReason] = useState(null);
    const [filterBySite,setFilterBySite] = useState(false);  
     // Handle checkbox states
  const [checkboxStatus, setCheckboxStatus] = useState({});
  const [selectedUsers, setSelectedUsers] = useState([]); // New state for selected users

  // Function to handle checkbox change
  const handleCheckboxChange = (userId) => {
    setCheckboxStatus((prevStatus) => ({
      ...prevStatus,
      [userId]: !prevStatus[userId],
    }));
  
    setSelectedUsers((prevSelectedUsers) => {
      if (checkboxStatus[userId]) {
        // If the checkbox is checked, add the user to selectedUsers if not already present
        if (prevSelectedUsers.includes(userId)) {
          return prevSelectedUsers.filter((id) => id !== userId);
          
        }
      } else {
        return [...prevSelectedUsers, userId];
      }
      return prevSelectedUsers;
    });
  };

  // Fetch filteredUsersList when selectedSite or selectedRole changes
  // useEffect(() => {
  //   console.log('selectedUsers has changed:', selectedUsers);
  //    // Your API calls for filteredUsersList based on selectedSite and selectedRole
  // }, [selectedSite, selectedRole,selectedUsers]);

    const OptionSelection = (event) => {
      const { name, value } = event.target;
      setSelectedSite('')
      setAddScheduleFormData((preValue) => {
        return {
                  ...preValue,
                  user_bio_id: ''
                };
      })
      setCheckboxStatus({})
      setFilterBySite(false)
      setFilteredUsersList([])
      setSelectedUsers([])
      setGridWidth(6);
      setInputWidth('90%')
      setRolesList([])
              if(value === '1'){
                // api call for users list START
                axios({
                        method: 'get',
                        url:'employees_list_for_filters',
                        headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),}
                      })
                    .then(function (response) {
                          let usersRecord = [];
                              response.data.user_info.forEach(element => {
                              usersRecord.push({'id':element.bio_ref_id,'name':element.fullname ,})
                            });
                            setUserList(usersRecord);
                        })
                    .catch(error => {});// api call for users list END

                    setAddScheduleFormData(preValue => ({ ...preValue,
                                                          users: usersList  }));
              }
              if(value === '2'){
                setUserList([])
                setFilterBySite(true)
                    // api call for sites list START
                    axios({
                        method: 'get',
                        url:'sites_list',
                        headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),}
                      })
                    .then(function (response) {
                          let sitesRecord = [];
                              response.data.sites_info.forEach(element => {
                              sitesRecord.push({'id':element.id,'name':element.name})
                            });
                            setSites(sitesRecord);
                        })
                    .catch(error => {});// api call for users list END

                    setAddScheduleFormData(preValue => ({ ...preValue,
                                                          users: usersList  }));
              }
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
        setCheckboxStatus({})
        setSelectedUsers([])
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

    const handleSiteChange = (event) => {
      const { name, value } = event.target;
      setSelectedRole('')
      setCheckboxStatus({})
      setSelectedSite('')
      setRolesList([])
      setSelectedUsers([])
      setFilteredUsersList([])
      setSelectedSite(value)
                // api call for site_users list START
                axios({
                        method: 'get',
                        url:'site_employees/'+value,
                        headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),},
                      })
                    .then(function (response) {
                          let siteEmployeesRecord = [];
                              response.data.site_employees.forEach(element => {
                              siteEmployeesRecord.push({'id':element.bio_ref_id,'name':element.fullname ,})
                            });
                            setFilteredUsersList(siteEmployeesRecord);
                        })
                    .catch(error => {console.log(error)});// api call for site_users list END
                                    // api call for site_roles list START
                axios({
                  method: 'get',
                  url:'site_roles/'+value,
                  headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),},
                })
              .then(function (response) {
                    let siteRolesRecord = [];
                        response.data.site_roles.forEach(element => {
                        siteRolesRecord.push({'id':element.role,'name':element.role_name,})
                      });
                      setRolesList(siteRolesRecord);
                  })
              .catch(error => {});
              // api call for site_roles list END

                    setAddScheduleFormData(preValue => ({ ...preValue,
                                                          users: usersList  }));
              setAddScheduleFormData((preValue) => {
                return {
                  ...preValue,
                  [name]: value
                };
              })
            }

            const handleRoleChange = (event) => {
              const { name, value } = event.target;
              setSelectedRole('')
              setCheckboxStatus({})
              setSelectedUsers([])
              setFilteredUsersList([])
              setSelectedRole(value)
              // api call for site_users list START
              axios({
                method: 'get',
                url:'site_role_employees/'+selectedSite+'/'+value,
                headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),},
                data: {
                  role: selectedRole,
                  site:selectedSite
                },
              })
            .then(function (response) {
                  let siteEmployeesRecord = [];
                      response.data.site_role_employees.forEach(element => {
                      siteEmployeesRecord.push({'id':element.bio_ref_id,'name':element.fullname ,})
                    });
                    setFilteredUsersList(siteEmployeesRecord)
                })
            .catch(error => {});// api call for site_users list END
            };

    const handleMonthChange = (date) => {
      setViewedMonth(date.month());
    };

    const handlePublicHolidaysCount = (event) => {
      const newValue = event.target.value.replace(/[^0-9]/g, '');
      const limitedValue = Math.min(newValue, 10); // Limit value to 10
      setPublicHolidaysCount(limitedValue);
    };

    const handlePublicHolidays = (event) => {
      const newValue = event.target.value.replace(/[^0-9]/g, '');
      setPublicHolidays(newValue)
      if(newValue === '0'){
        setPublicHolidaysCount(0)
        setPublicHolidaysReason(null)
      }
    };

    const HandlePublicHolidayReason = (event) => {
      const newValue = event.target.value;
      setPublicHolidaysReason(newValue)
    };

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
                                                      setAddScheduleFormData((preValue) => {
                                                            return {
                                                                      ...preValue,
                                                                      from_date: date
                                                                    };
                                                        });
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

          // Customize the appearance of each day cell using the PickersDay component
          return (
            <Grid xs={12} item>
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
              className={`${isBlockedLeaveDate ? 'blocked-leave-date' : ''} ${
                isBlockedScheduleDate ? 'blocked-schedule-date' : ''
              }`}
              showDaysOutsideCurrentMonth={true}
            >
              {dayjs(date).format("DD")}
            </PickersDay>
            </Grid>
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
                                          setAddScheduleFormData((preValue) => {
                                                return {
                                                          ...preValue,
                                                          to_date: date
                                                        };
                                            });
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
                  selected_users:selectedUsers,
                  from_date: sDateString,
                  to_date: eDateString,
                  shift_id: addScheduleFormData.shift_id,
                  p_h_c: publicHolidaysCount,
                  p_h_r: publicHolidayReason
                },
        })
        .then(
                function (response) {
                  console.log(response.data)
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
                    <Card style={{ width: "auto", margin: "auto" }}>
                      <CardContent>
                        <form onSubmit={formSubmit}>
                          <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                                <Grid xs={gridWidth} item>
                                    <TextField label="Choose Option" name='option_selection' onChange={OptionSelection} select value={addScheduleFormData.option_selection} variant="outlined" sx={{ width: inpuWidth }} required
                                    SelectProps={{
                                      multiple: false
                                    }}>
                                    <MenuItem value="1">Single Employee</MenuItem>
                                    <MenuItem value="2">Group by Site</MenuItem>
                                  </TextField>
                                </Grid>
                                {usersList.length > 0 ? (
                                <Grid xs={6} item >
                                    <TextField label="Select Employee" name='user_bio_id' onChange={inputEvent} select value={addScheduleFormData.user_bio_id} variant="outlined" sx={{ width: "90%" }} required
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
                                {filterBySite ? (
                                <Grid xs={6} item>
                                    <TextField label="Select Site" name='site_id' onChange={handleSiteChange} select value={addScheduleFormData.site_id} variant="outlined" sx={{ width: "90%" }} required
                                      SelectProps={{
                                        multiple: false
                                      }}>
                                        {
                                          sites.map((site,index) => (
                                            <MenuItem key={index} value={site.id}>
                                            {site.name}
                                          </MenuItem>
                                          ))
                                        }
                                    </TextField>
                                  </Grid>) : (<div></div>)
                                }
                                { rolesList.length > 0 ? (
                                <Grid xs={12} item >
                                    <TextField label="Select Role" name='role_id' onChange={handleRoleChange} select value={selectedRole} variant="outlined" sx={{ width: "95%" }} 
                                      SelectProps={{
                                        multiple: false
                                      }}>
                                        {
                                          rolesList.map((role,index) => (
                                            <MenuItem key={index} value={role.id}>
                                            {role.name}
                                          </MenuItem>
                                          ))
                                        }
                                    </TextField>
                                  </Grid>) : (<div></div>)
                                }
                                {filteredUsersList.length > 0 ? (
                                  <Box sx={{ display: 'flex' }}>
                                  <FormControl sx={{ m: 3 ,paddingLeft:5}} component="fieldset" variant="standard">
                                    <FormLabel component="legend">Filtered Employees</FormLabel>
                                    <FormGroup row >
                                    {
                                          filteredUsersList.map((user,index) => (
                                            <FormControlLabel
                                            key={index}
                                            control={
                                              <Checkbox  checked={!!checkboxStatus[user.id]}
                                              onChange={() => handleCheckboxChange(user.id)} name={user.name} />
                                            }
                                            label={user.name}
                                          />
                                          ))
                                        }
                                      
                                    </FormGroup>
                                  </FormControl>
                                </Box>):(<div></div>)
                                }
                                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} item>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <Grid xs={6} item >
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
                                            inputFormat="YYYY-MM-DD"
                                            outputFormat="YYYY-MM-DD"
                                            onBlur={event => this.focousOut(event.target.value)}
                                            onOpen={() => setOpenDatePicker(true)}
                                            onClose={() => setOpenDatePicker(false)}
                                            minDate={dayjs().month(3).startOf('month')}
                                          />
                                          </Grid>
                                  <Grid xs={6} item>
                                    <DatePicker
                                              label="End Date"
                                              value={EndDate ?? addScheduleFormData.to_date ?? null}
                                              onChange={handleEndDateChange}
                                              variant='outlined'
                                              sx={{ width: "80%"}}
                                              renderInput={(params) => <TextField {...params} required/>}
                                              inputFormat="YYYY-MM-DD"
                                              outputFormat="YYYY-MM-DD"
                                              minDate={startDate}
                                              maxDate={leaveStartDate}
                                            />
                                            </Grid>
                            </LocalizationProvider>
                                </Grid>
                            <Grid xs={12} item>
                            <FormControl>
                              <FormLabel id="demo-controlled-radio-buttons-group" sx={{mt:1.5,widht:"100%"}}>Public Holidays</FormLabel>
                              <RadioGroup
                              sx={{ width: "100%" }}
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
                              <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} item>
                                <Grid xs={6} item sx={{ mt: 2}}>
                                    <TextField label="Holidays Count" name='public_holiday_count' onChange={handlePublicHolidaysCount}
                                      value={publicHolidaysCount} variant="outlined" sx={{ width: "90%" }} required inputProps={{
                                        max: 10, // Set the maximum value
                                      }} >
                                    </TextField>
                                </Grid>
                                <Grid xs={6} item sx={{ mt: 2 }}>
                                    <TextField label="Reason for Public Holiday" name='p_h_reason' onChange={HandlePublicHolidayReason} value={publicHolidayReason} variant="outlined" sx={{ width: "90%" }} required
                                    multiline
                                    maxRows={2}/>
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
                                    sx={{ width: "95%" }}
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
                              <Button type="submit" variant="contained" color="primary" sx={{ width: "95%" }} >Add</Button>
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