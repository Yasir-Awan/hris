import React, { useState } from 'react';
import {
  Grid,
  MenuItem,
  IconButton,
  TextField,
  createTheme,
  ThemeProvider,
  Box,
  OutlinedInput,
  InputLabel,
  FormControl,
  Select,
  Chip,
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import axios from 'axios';
import { useTheme } from '@mui/material/styles';

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

const AttendanceReportingCard = ({ onSendData }) => {
  const theme = useTheme();
  const [filterType, setFilterType] = useState('');
  const [selectedSite, setSelectedSite] = useState('');
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [dateRange, setDateRange] = useState({
    startDate: null,
    endDate: null,
  });
  const [sites, setSites] = useState([]);
  const [employees, setEmployees] = useState([]);

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  const resetFilters = () => {
    setSelectedSite('');
    setSelectedEmployees([]);
  };

  const handleFilterChange = (newFilterValues) => {
    resetFilters();
    setDateRange(newFilterValues);
  };

  const handleSiteChange = (event) => {
    resetFilters();
    const { value } = event.target;
    setSelectedSite(value);
  };

  const handleEmployeeChange = (event) => {
    const { value } = event.target;
    setSelectedEmployees(value);
  };

  const sendDataToParent = () => {
    const data = {
      filterType,
      selectedSite,
      selectedEmployees,
      dateRange,
    };
    onSendData(data);
  };

  const getSites = () => {
    axios({
      method: 'post',
      url: 'sites_list',
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      data: { sites: JSON.parse(localStorage.getItem('sites')) },
    })
      .then(function (response) {
        let sitesRecord = [];
        response.data.sites_info.forEach((element) => {
          sitesRecord.push({ id: element.id, name: element.name });
        });
        setSites(sitesRecord);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getEmployees = () => {
    axios({
      method: 'post',
      url: 'employees_list_for_filters',
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      data: { sites: JSON.parse(localStorage.getItem('employees')) },
    })
      .then(function (response) {
        // console.log(response.data)
        let employeesRecord = [];
        response.data.user_info.forEach((element) => {
          employeesRecord.push({ id: element.bio_ref_id, name: element.fullname });
        });
        setEmployees(employeesRecord);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleFilterTypeChange = (event) => {
    const { value } = event.target;
    setFilterType(value);
    if (value === '1') {
      getSites();
    }
    if (value === '2') {
      getEmployees();
    }
  };

  function getEmployeesStyles(name, selectedEmployees, theme) {
    return {
      fontWeight:
        selectedEmployees.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

  // Helper function to find employee name with corresponding id
  const getEmployeeNameById = (employeeId) => {
    const selectedEmployee = employees.find((employee) => employee.id === employeeId);
    return selectedEmployee ? selectedEmployee.name : '';
  };

  const datePickerStyles = {
    root: {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: customTheme.palette.primary.main,
      },
      '& .MuiInputLabel-root': {
        color: customTheme.palette.primary.main,
        transform: 'translate(0, 30%)',
        background: 'white',
        '&.MuiInputLabel-shrink': {
          transform: 'translate(0, -40%)',
        },
      },
      '& .MuiInputBase-root': {
        color: customTheme.palette.primary.main,
        height: '40px',
        width: '100%',
      },
    },
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  const customSelectStyles = {
    root: {
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: customTheme.palette.primary.main,
      },
      '& .MuiInputLabel-root': {
        color: customTheme.palette.primary.main,
        transform: 'translate(0, 30%)',
        background: 'white',
        '&.MuiInputLabel-shrink': {
          transform: 'translate(0, -40%)',
        },
      },
      '& .MuiInputBase-root': {
        color: customTheme.palette.primary.main,
        height: '40px',
        width: '100%',
      },
    },
  };

  return (
    <>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={0.5}></Grid>
        <Grid item xs={1.45} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '0.25rem' }}>
          <ThemeProvider theme={customTheme}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <TextField
                label="Filter By"
                name="filter_type"
                onChange={handleFilterTypeChange}
                select
                value={filterType}
                variant="outlined"
                sx={{ ...datePickerStyles.root, minWidth: '130px' }}
                required
                SelectProps={{ multiple: false }}
              >
                <MenuItem key="1" value="1">
                  Date Range & Site
                </MenuItem>
                <MenuItem key="2" value="2">
                  Date Range & Employees
                </MenuItem>
              </TextField>
            </div>
          </ThemeProvider>
        </Grid>
        {filterType === '1' && (
          <Grid item xs={6} sx={datePickerStyles.container}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '0.25rem' }}>
                <ThemeProvider theme={customTheme}>
                  <Grid item xs={1.5}></Grid>
                  <DatePicker
                    label="Start Date"
                    name="start_date"
                    value={dateRange.startDate}
                    onChange={(date) => handleFilterChange({ ...dateRange, startDate: date })}
                    renderInput={(params) => <TextField {...params} sx={{ ...datePickerStyles.root, width: '80%' }} />}
                  />
                  <Grid item xs={0.5}></Grid>
                  <DatePicker
                    label="End Date"
                    name="end_date"
                    value={dateRange.endDate}
                    onChange={(date) => handleFilterChange({ ...dateRange, endDate: date })}
                    renderInput={(params) => <TextField {...params} sx={{ ...datePickerStyles.root, width: '80%' }} />}
                  />
                </ThemeProvider>
              </div>
            </LocalizationProvider>
            <Grid item xs={6} sx={{ ...datePickerStyles.container, paddingBottom: '0.25rem' }}>
              <ThemeProvider theme={customTheme}>
                <TextField
                  label="Select Site"
                  name="site"
                  onChange={handleSiteChange}
                  select
                  value={selectedSite}
                  variant="outlined"
                  sx={{ ...datePickerStyles.root, width: '80%' }}
                  required
                  SelectProps={{ multiple: false }}
                >
                  {sites.map((site, index) => (
                    <MenuItem key={index} value={site.id}>
                      {site.name}
                    </MenuItem>
                  ))}
                </TextField>
              </ThemeProvider>
            </Grid>
            <Grid item xs={1}>
              <IconButton onClick={sendDataToParent} color="primary" sx={{ position: 'relative', left: '-5px', top: '-5px' }}>
                <FilterAltIcon />
              </IconButton>
            </Grid>
          </Grid>
        )}

        {filterType === '2' && (
          <Grid item xs={6} sx={datePickerStyles.container}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '0.25rem' }}>
                <ThemeProvider theme={customTheme}>
                  <Grid item xs={3}></Grid>
                  <DatePicker
                    label="Start Date"
                    name="start_date"
                    value={dateRange.startDate}
                    onChange={(date) => handleFilterChange({ ...dateRange, startDate: date })}
                    renderInput={(params) => <TextField {...params} sx={{ ...datePickerStyles.root, width: '80%' }} />}
                  />
                  <Grid item xs={0.5}></Grid>
                  <DatePicker
                    label="End Date"
                    name="end_date"
                    value={dateRange.endDate}
                    onChange={(date) => handleFilterChange({ ...dateRange, endDate: date })}
                    renderInput={(params) => <TextField {...params} sx={{ ...datePickerStyles.root, width: '80%' }} />}
                  />
                </ThemeProvider>
              </div>
            </LocalizationProvider>
            <Grid item xs={6} sx={{ ...datePickerStyles.container, paddingBottom: '0.25rem' }}>
              <Grid item xs={0.5}></Grid>
              <FormControl sx={{ width: '95%' }}>
                <ThemeProvider theme={customTheme}>
                  <InputLabel id="demo-multiple-chip-label" sx={customSelectStyles.root}>
                    Employees
                  </InputLabel>
                  <Select
                    labelId="demo-multiple-chip-label"
                    id="demo-multiple-chip"
                    multiple
                    value={selectedEmployees}
                    onChange={handleEmployeeChange}
                    input={<OutlinedInput id="select-multiple-chip" label="Employees" />}
                    renderValue={(selected) => (
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {selected.map((value) => (
                          <Chip key={value} label={getEmployeeNameById(value)} />
                        ))}
                      </Box>
                    )}
                    MenuProps={MenuProps}
                    sx={customSelectStyles.root}
                  >
                    {employees.map((user, index) => (
                      <MenuItem key={index} value={user.id} style={getEmployeesStyles(user.name, selectedEmployees, theme)}>
                        {user.name}
                      </MenuItem>
                    ))}
                  </Select>
                </ThemeProvider>
              </FormControl>
            </Grid>
            <Grid item xs={0.5}>
              <IconButton onClick={sendDataToParent} color="primary" sx={{ position: 'relative', padding: 'unset', top: '-5px' }}>
                <FilterAltIcon />
              </IconButton>
            </Grid>
          </Grid>
        )}
        <Grid item xs={1.5}></Grid>
      </Grid>
    </>
  );
};

export default AttendanceReportingCard;
