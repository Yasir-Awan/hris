import React, { useState } from 'react';
import {Grid,MenuItem,Card,CardContent,Typography,TextField,createTheme,ThemeProvider,} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import axios from 'axios';
import MonthlySummary from '../monthly_summary/MonthlySummary';

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

const SummaryCard = (props) => {
  // ... (copy the content of renderAttendanceCard here)
    const [filterType, setFilterType] = useState('');
    const [selectedSite, setSelectedSite] = useState('');
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedDesignation, setSelectedDesignation] = useState('');

    const [selectedDay, setSelectedDay] = useState(null);
    const [sites,setSites] = useState([]);
    const [sessionSites,setSessionSites] = useState([]);
    const [designations,setDesignations] = useState([]);
  // Extract the value of LocalStorage.getItem('role') to a variable
    const userDesignation = localStorage.getItem('designation');

  // Extracted helper function to reset filters
    const resetFilters = () => {
    setSelectedMonth(null)
    setSelectedDesignation('');
    setSelectedSite('');
    setSelectedDay(null);
    };

  // Extracted helper function to handle site change
    const handleSiteChange = (event) => {
      // Using the resetFilters helper function
        resetFilters();
    const { value } = event.target;
                setSelectedSite(value)
            }

  // Extracted helper function to handle role change
    const handleDesignationChange = (event) => {
      // Using the resetFilters helper function
        resetFilters();
    const { value } = event.target;
                setSelectedDesignation(value)
            }

    const getSites = () => {
      // api call for sites list START
        axios({
        method: 'post',
        url:'sites_list',
        headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),},
        data:sessionSites,
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

    const getDesignations = () => {
    // api call for roles list START
    axios({
        method: 'get',
        url:'designations_list',
        headers: {'Authorization': 'Bearer '+localStorage.getItem('token'),}
    })
    .then(function (response) {
        let designationsRecord = [];
            response.data.designations_info.forEach(element => {
            designationsRecord.push({'id':element.id,'name':element.designation_name})
            });
            setDesignations(designationsRecord);
        })
    .catch(error => {console.error(error)});// api call for roles list END
};

  // Extracted helper function to handle filter type change
    const handleFilterTypeChange = (event) => {
    const { value } = event.target;
    setFilterType(value);
    if(value === '4'){
        setSessionSites(localStorage.getItem('sites'))
        getSites();
    }
    if(value === '5'){
        getDesignations();
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
    return (
    // ... (return the JSX content of the card)
    <>
    <Card sx={{ minWidth: 275 }}>
        <CardContent>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} >
            <Grid item xs={3}  >
                <Typography variant="h5" component="div" sx={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 'bold', color: '#4CAF50', textShadow: '0 0 10px rgba(33, 150, 243, 0.4)', letterSpacing: '1px', paddingTop:'0.2rem' }}>
                    Attendance Summary
                </Typography>
                </Grid>
                <Grid item xs={1}>
                </Grid>
                <Grid item xs={1.45} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom:'0.25rem'}}>
                <ThemeProvider theme={customTheme}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <TextField label="Filter By" name='filter_type' onChange={handleFilterTypeChange} select value={filterType} variant="outlined" sx={{ ...datePickerStyles.root,minWidth: '130px' }} required
                            SelectProps={{
                                multiple: false
                            }}>
                            <MenuItem value="3">Month</MenuItem>
                            {userDesignation === '3' ? [
                                <MenuItem key="4" value="4">Site</MenuItem>,
                                <MenuItem key="5" value="5">Designation</MenuItem>
                                ] : null}
                            </TextField>
                            </div>
                            </ThemeProvider>
                </Grid>
                {filterType === '3' && (
                <Grid item xs={2.55} sx={datePickerStyles.container}>
                        <LocalizationProvider dateAdapter={AdapterDayjs} >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom:'0.25rem'}}>
                        <ThemeProvider theme={customTheme}>
                        <DatePicker
                                    label="Select Month"
                                    name="month"
                                    value={selectedMonth}
                                    inputFormat="YYYY-MM"
                                    outputFormat="YYYY-MM"
                                    onChange={(date) => setSelectedMonth(date)}
                                    views={['year','month']}
                                    openTo="month"
                                    minDate={new Date('2023-09-01')}
                                    maxDate={new Date('2024-12-31')}
                                    renderInput={(params) => <TextField {...params} sx={{ ...datePickerStyles.root, width: '100%'}} />}
                                />
                        </ThemeProvider>
                        </div>
                                </LocalizationProvider>
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

                    {filterType === '5' && (
                    <Grid item xs={2.5} sx={{...datePickerStyles.container, paddingBottom:'0.25rem'}}>
                        <ThemeProvider theme={customTheme}>
                            <TextField label="Designation" name='designation' onChange={handleDesignationChange} select value={selectedDesignation} variant="outlined" sx={{ ...datePickerStyles.root, width: '80%'}} required
                                        SelectProps={{
                                        multiple: false
                                        }}>
                                        {
                                            designations.map((designation,index) => (
                                            <MenuItem key={index} value={designation.id}>
                                            {designation.name}
                                            </MenuItem>
                                            ))
                                        }
                                    </TextField>
                                    </ThemeProvider>
                        </Grid>
                    )}
                <Grid item xs={1.5}></Grid>
        </Grid>
        <MonthlySummary filterType={filterType} selectedMonth={selectedMonth} selectedSite={selectedSite} selectedDesignation={selectedDesignation} selectedDay={selectedDay}/>
        </CardContent>
    </Card>
    </>
    );
};

export default SummaryCard;
