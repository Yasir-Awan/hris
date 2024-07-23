import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, FormGroup, FormControlLabel, Switch } from '@mui/material';
import AttendanceReportingCard from './AttendanceReportingCard';
import SummaryReportingCard from './SummaryReportingCard';
import { styled } from '@mui/material/styles';
import attendanceIcon from '../../../assets/icons/calendar.png';
import summaryIcon from '../../../assets/icons/summary.png';
import ReportList from '../../report/ReportList';

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  '& .MuiSwitch-switchBase': {
    margin: 1,
    padding: 0,
    transform: 'translateX(6px)',
    '&.Mui-checked': {
      color: '#fff',
      transform: 'translateX(22px)',
      '& .MuiSwitch-thumb:before': {
        backgroundImage: `url(${summaryIcon})`,
        backgroundSize: 'contain', // Adjust to 'cover' or 'contain' as needed
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      },
      '& + .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
      },
    },
  },
  '& .MuiSwitch-thumb': {
    backgroundColor: theme.palette.mode === 'dark' ? 'transparent' : 'transparent',
    width: 32,
    height: 32,
    '&::before': {
      content: "''",
      position: 'absolute',
      width: '100%',
      height: '100%',
      left: 0,
      top: 0,
      backgroundSize: 'contain', // Adjust to 'cover' or 'contain' as needed
      backgroundPosition: 'center',
      backgroundImage: `url(${attendanceIcon})`,
    },
  },
  '& .MuiSwitch-track': {
    opacity: 1,
    backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
    borderRadius: 20 / 2,
  },
}));

const ReportWrapperCard = () => {
  const [isChecked, setIsChecked] = useState(false);
  const [dataFromChild, setDataFromChild] = useState('');


  const handleDataFromChild = (data) => {
    console.log(data); // Verify the received data
  //   const childData = (
  //       data.filterType,
  //       data.selectedSite,
  //       data.selectedEmployee,
  //       data.dateRange,
  // );
    setDataFromChild(data);
  };

  const handleChange = (event) => {
    setIsChecked(event.target.checked);
  };

  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={1.5}>
            <Typography variant="h5" component="div" sx={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 'bold', color: '#4CAF50', textShadow: '0 0 10px rgba(33, 150, 243, 0.4)', letterSpacing: '1px', paddingTop: '0.2rem' }}>
              Reporting
            </Typography>
          </Grid>
          <Grid item xs={0.5} sx={{ visibility: 'hidden' }}>
            <FormGroup>
              <FormControlLabel
                control={<MaterialUISwitch checked={isChecked} onChange={handleChange} hide />}
              />
            </FormGroup>
          </Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={9}>
            {isChecked ? <SummaryReportingCard onSendData={handleDataFromChild} /> : <AttendanceReportingCard onSendData={handleDataFromChild} />}
          </Grid>
        </Grid>
        {dataFromChild && (
          <ReportList
            filterType={dataFromChild.filterType}
            dateRange={dataFromChild.dateRange}
            selectedSite={dataFromChild.selectedSite}
            selectedDesignation={dataFromChild.selectedDesignation}
            selectedDay={dataFromChild.selectedDay}
          />
        )}
      </CardContent>
    </Card>
  );
};


export default ReportWrapperCard;
