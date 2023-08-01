import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import UserList from '../users/UserList';
import AttendanceList from '../attandance/AttendanceList';
import MonthlySummary from '../monthly_summary/MonthlySummary';
import ShiftsList from '../shift/ShiftsList';
import ScheduleList from '../schedule/ScheduleList';
import LeavesList from '../leaves/LeavesList';
import CustomEmployeeFilter from '../../components/custom_filter/employee_filter/CustomEmployeeFilter';
import CustomDayFilter from '../../components/custom_filter/day_filter/CustomDayFilter';
import { Grid  } from '@mui/material';

const bull = (
  <Box
    component="span"
    sx={{ display: 'inline-block', mx: '2px', transform: 'scale(0.8)' }}
  >
    •
  </Box>
);

export default function BasicCard(props) {

  const [filterVals, setFilterVals] = React.useState([]);
  console.log(props);
  if(props.name === 0){
    return(
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    Schedules{bull}List
                  </Typography>
                  <ScheduleList/>
                </CardContent>
                {/* <CardActions>
                  <Button size="small">Learn More</Button>
                </CardActions> */}
              </Card>
    )
  }
  if(props.name === 1){
    return (
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    Leaves{bull}List
                  </Typography>
                  <LeavesList/>
                </CardContent>
                {/* <CardActions>
                  <Button size="small">Learn More</Button>
                </CardActions> */}
              </Card>
    );
  }
  if(props.name === 2){
    return(
    <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Grid container spacing={0} >
          <Grid item xs={2} sx={{py:1}} >
          <Typography variant="h5" component="div" >
              Attendance{bull}List
            </Typography>
          </Grid>
          <Grid item xs={1.45}></Grid>
          <Grid item xs={2.55}><CustomEmployeeFilter fieldName='fullname' header='Employee' onChange={(values)=>setFilterVals(values)}/></Grid>
          <Grid item xs={2}><CustomDayFilter onChange={(values)=>setFilterVals(values)}/></Grid>
          <Grid item xs={1}></Grid>
          <Grid item xs={3}>
              {/* <Tags fieldName='attendance_date' header='Date'/> */}
          </Grid>
          </Grid>
          <AttendanceList filterValues={()=>setFilterVals(filterVals)}/>
        </CardContent>
      </Card>
    )
  }
  if(props.name === 3){
    return(
            <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography variant="h5" component="div" gutterBottom>
                    Attendance{bull}Summary
                  </Typography>
                  <MonthlySummary/>
                </CardContent>
                {/* <CardActions>
                  <Button size="small">Learn More</Button>
                </CardActions> */}
              </Card>
    )
  }
  if(props.name===4){
    return (
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="h5" component="div" gutterBottom>
            Employees{bull}List
          </Typography>
          <UserList/>
        </CardContent>
        {/* <CardActions>
          <Button size="small">Learn More</Button>
        </CardActions> */}
      </Card>
    );
  }
  if(props.name===5){
    return (
          <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Typography variant="h5" component="div" gutterBottom>
                  Shifts{bull}List
                </Typography>
                <ShiftsList/>
              </CardContent>
              {/* <CardActions>
                <Button size="small">Learn More</Button>
              </CardActions> */}
            </Card>
    );
  }
}