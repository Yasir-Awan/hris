import React, { useState } from 'react';
import {Card,CardContent,Typography,Grid,} from '@mui/material';
import UserList from '../users/UserList';
import ShiftsList from '../shift/ShiftsList';
import RolesList from '../roles/RolesList';
import ScheduleList from '../schedule/ScheduleList';
import LeavesList from '../leaves/LeavesList';
import AttendanceCard from './AttendanceCard';
import SummaryCard from './SummaryCard';

export default function BasicCard(props) {
  const [filterType] = useState('');
  const [selectedSite] = useState('');
  const [selectedDesignation] = useState('');
  const [selectedDay] = useState(null);
  const [selectedMonth] = useState(null);
  const [lockedValues] = useState({startDate: null,endDate: null,});

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
    <AttendanceCard filterType={filterType} lockedValues={lockedValues} selectedSite={selectedSite} selectedDesignation={selectedDesignation} 
    selectedDay={selectedDay}/>
  );

  const renderSummaryCard = () => (
    <SummaryCard filterType={filterType} selectedMonth={selectedMonth} selectedSite={selectedSite} selectedDesignation={selectedDesignation} 
    selectedDay={selectedDay}/>
  );

  switch (props.name) {
    case 1:
      return renderCard('Schedules List', <ScheduleList />);
    case 2:
      return renderCard('Leaves List', <LeavesList />);
    case 3:
      return renderAttendanceCard();
    case 4:
      return renderSummaryCard();
    case 5:
      return renderCard('Employees List', <UserList />);
    case 9:
      return renderCard('Roles List', <RolesList />);
    default:
      return null;
  }
}