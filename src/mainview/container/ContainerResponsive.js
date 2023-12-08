import React, { useState } from 'react';
import {Card,CardContent,Typography,Grid,} from '@mui/material';
import UserList from '../users/UserList';
import MonthlySummary from '../monthly_summary/MonthlySummary';
import ShiftsList from '../shift/ShiftsList';
import ScheduleList from '../schedule/ScheduleList';
import LeavesList from '../leaves/LeavesList';
import AttendanceCard from './AttendanceCard';

export default function BasicCard(props) {
  const [filterType] = useState('');
  const [selectedSite] = useState('');
  const [selectedRole] = useState('');
  const [selectedDay] = useState(null);
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
    <AttendanceCard filterType={filterType} lockedValues={lockedValues} selectedSite={selectedSite} selectedRole={selectedRole} 
    selectedDay={selectedDay}/>
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