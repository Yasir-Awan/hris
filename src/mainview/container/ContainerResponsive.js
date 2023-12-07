import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  MenuItem,
  IconButton,
  TextField,
  createTheme,
  ThemeProvider,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FilterIcon from '@mui/icons-material/FilterList';

import UserList from '../users/UserList';
import AttendanceList from '../attandance/AttendanceList';
import MonthlySummary from '../monthly_summary/MonthlySummary';
import ShiftsList from '../shift/ShiftsList';
import ScheduleList from '../schedule/ScheduleList';
import LeavesList from '../leaves/LeavesList';
import axios from 'axios';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

const customTheme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
    },
    secondary: {
      main: '#2196F3',
    },
  },
  typography: {
    fontFamily: 'Quicksand, sans-serif',
  },
});

export default function BasicCard(props) {
  const [filterType, setFilterType] = useState('');
  const [selectedSite, setSelectedSite] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [selectedDay, setSelectedDay] = useState(null);
  const [lockedValues, setLockedValues] = useState({
    startDate: null,
    endDate: null,
  });
  const [sites,setSites] = useState([]);
  const [roles,setRoles] = useState([]);
  // Extract the value of LocalStorage.getItem('role') to a variable
  const userRole = localStorage.getItem('role');

  // Extracted helper function to reset filters
  const resetFilters = () => {
    setDateRange({ startDate: null, endDate: null });
    setLockedValues({ startDate: null, endDate: null });
    setSelectedRole('');
    setSelectedSite('');
    setSelectedDay(null);
  };

  const handleFilterChange = (newFilterValues) => {
      // Using the resetFilters helper function
      // resetFilters();
    setDateRange(newFilterValues);
  };

  const handleApplyFilters = () => {
      // Using the resetFilters helper function
      resetFilters();
    setLockedValues(dateRange)
    console.log('Filters Applied:', dateRange);
  };

  // Extracted helper function to handle site change
  const handleSiteChange = (event) => {
      // Using the resetFilters helper function
      resetFilters();
    const { value } = event.target;
              setSelectedSite(value)
          }

  // Extracted helper function to handle role change
  const handleRoleChange = (event) => {
      // Using the resetFilters helper function
      resetFilters();
    const { value } = event.target;
              setSelectedRole(value)
          }

  const getSites = () => {
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
      .catch(error => {console.error(error)});// api call for users list END
  };

  const getRoles = () => {
    // api call for roles list START
    axios({
      method: 'get',
      url:'roles_list',
      headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),}
    })
    .then(function (response) {
        let rolesRecord = [];
            response.data.roles_info.forEach(element => {
            rolesRecord.push({'id':element.id,'name':element.role_name})
          });
          setRoles(rolesRecord);
      })
    .catch(error => {console.error(error)});// api call for roles list END
};

  // Extracted helper function to handle filter type change
  const handleFilterTypeChange = (event) => {
    const { value } = event.target;
    setFilterType(value);
    if(value === '4'){
      getSites();
    }
    if(value === '5'){
      getRoles();
    }
  };


  const datePickerStyles = {
    root: {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: customTheme.palette.primary.main, // Match the primary color from your theme
      },
      '& .MuiInputLabel-root': {
        color: customTheme.palette.primary.main, // Match the primary color from your theme
        transform: 'translate(0, 30%)', // Adjust this value to move the label position
        background: 'white', // Optionally, add a background color for better visibility
        // Ensure the label shrinks and moves to the top-left corner when input has content
        '&.MuiInputLabel-shrink': {
          transform: 'translate(0, -40%)',
        },
      },
      '& .MuiInputBase-root': {
        color: customTheme.palette.primary.main, // Match the primary color from your theme
        height: '40px',
        width: '100%'
      },
    },
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center', // Adjust this property to control horizontal spacing
      // marginTop:'-10px'
    },
  };

  const renderCard = (title, component) => (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
            <Grid item xs={2.5} sx={{py:1}} >
              <Typography variant="h5" component="div" sx={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 'bold', color: '#4CAF50', textShadow: '0 0 10px rgba(33, 150, 243, 0.4)', letterSpacing: '1px' }}>
                {title}
              </Typography>
            </Grid>
        </Grid>
        {component}
      </CardContent>
    </Card>
  );

  const renderAttendanceCard = () => (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} >
            <Grid item xs={2}  >
                <Typography variant="h5" component="div" sx={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 'bold', color: '#4CAF50', textShadow: '0 0 10px rgba(33, 150, 243, 0.4)', letterSpacing: '1px', paddingTop:'0.2rem' }}>
                    Attendance{bull}Daily
                  </Typography>
                </Grid>
                <Grid item xs={1.5}>
                    {/* <Tags fieldName='attendance_date' header='Date'/> */}
                </Grid>
                <Grid item xs={1.45} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom:'0.25rem'}}>
                <ThemeProvider theme={customTheme}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                
                <TextField label="Filter By" name='filter_type' onChange={handleFilterTypeChange} select value={filterType} variant="outlined" sx={{ ...datePickerStyles.root,minWidth: '130px' }} required
                          SelectProps={{
                              multiple: false
                          }}>
                          {/* <MenuItem value="6">Select Filter</MenuItem> */}
                          <MenuItem key='1' value="1">Date Range</MenuItem>
                          <MenuItem key='2' value="2">Day</MenuItem>
                          {/* <MenuItem value="3">Month</MenuItem> */}
                          {userRole === '3' ? [
                                <MenuItem key="4" value="4">Site</MenuItem>,
                                <MenuItem key="5" value="5">Role</MenuItem>
                              ] : null}
                          </TextField>
                          </div>
                          </ThemeProvider>
                </Grid>
                {filterType === '1' && (
                <Grid item xs={4.55} sx={datePickerStyles.container}>
                      <LocalizationProvider dateAdapter={AdapterDayjs} >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom:'0.25rem'}}>
                      <ThemeProvider theme={customTheme}>
                      <DatePicker
                        label="Start Date"
                        name="start_date"
                        value={dateRange.startDate}
                        onChange={(date) => handleFilterChange({ ...dateRange, startDate: date })}
                        renderInput={(params) => <TextField {...params}sx={{ ...datePickerStyles.root, width: '80%'}} />}
                      />
                        <Grid item xs={0.5}></Grid>
                        <DatePicker
                        label="End Date"
                        name="end_date"
                        value={dateRange.endDate}
                        onChange={(date) => handleFilterChange({ ...dateRange, endDate: date })}
                        renderInput={(params) => <TextField {...params} sx={{ ...datePickerStyles.root, width: '80%'}}/>}
                        />
                        </ThemeProvider>
                        </div>
                              </LocalizationProvider>
                              <Grid item xs={1}>
                      <IconButton onClick={handleApplyFilters} color="primary">
                          <FilterIcon />
                        </IconButton>
                      </Grid>
                  </Grid>
                  )}
                  {filterType === '4' && (
                    <Grid item xs={2.5} sx={{...datePickerStyles.container, paddingBottom:'0.25rem'}}>
                      <ThemeProvider theme={customTheme}>
                          <TextField label="Select Site" name='site' onChange={handleSiteChange} select value={selectedSite} variant="outlined" sx={{ ...datePickerStyles.root, width: '80%'}} required
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
                                    </ThemeProvider>
                      </Grid>
                  )}
                  {filterType === '2' && (
                    <Grid item xs={2.5} sx={{...datePickerStyles.container, paddingBottom:'0.2rem'}}>
                      <LocalizationProvider dateAdapter={AdapterDayjs} >
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <ThemeProvider theme={customTheme}>
                            <DatePicker
                                  label="Select Date"
                                  name="day"
                                  value={selectedDay}
                                  onChange={(date) => setSelectedDay(date)}
                                  renderInput={(params) => <TextField {...params}sx={{ ...datePickerStyles.root, width: '100%'}} />}
                            />
                            </ThemeProvider>
                          </div>
                      </LocalizationProvider>
                      </Grid>
                  )}
                  {filterType === '5' && (
                    <Grid item xs={2.5} sx={{...datePickerStyles.container, paddingBottom:'0.25rem'}}>
                      <ThemeProvider theme={customTheme}>
                          <TextField label="Select Role" name='role' onChange={handleRoleChange} select value={selectedRole} variant="outlined" sx={{ ...datePickerStyles.root, width: '80%'}} required
                                      SelectProps={{
                                        multiple: false
                                      }}>
                                        {
                                          roles.map((role,index) => (
                                            <MenuItem key={index} value={role.id}>
                                            {role.name}
                                          </MenuItem>
                                          ))
                                        }
                                    </TextField>
                                    </ThemeProvider>
                      </Grid>
                  )}

                <Grid item xs={1.5}>
                    {/* <Tags fieldName='attendance_date' header='Date'/> */}
                </Grid>
        </Grid>
        <AttendanceList filterType={filterType} 
                    lockedValues={lockedValues} 
                    selectedSite={selectedSite} 
                    selectedRole={selectedRole} 
                    selectedDay={selectedDay}/>
      </CardContent>
    </Card>
  );

  switch (props.name) {
    case 0:
      return renderCard('Schedules List', <ScheduleList />);
    case 1:
      return renderCard('Leaves List', <LeavesList />);
    case 2:
      return renderAttendanceCard();
    case 3:
      return renderCard('Attendance Summary', <MonthlySummary />);
    case 4:
      return renderCard('Employees List', <UserList />);
    case 5:
      return renderCard('Shifts List', <ShiftsList />);
    default:
      return null;
  }
}