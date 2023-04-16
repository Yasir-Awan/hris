import React,{useState} from 'react'
import { useNavigate,useLocation } from 'react-router-dom';
import { AppBar, Toolbar,IconButton,Typography, Tabs, Tab, Button, useMediaQuery,useTheme } from "@mui/material";
import ThreePIcon from '@mui/icons-material/ThreeP';
import DrawerComp from '../drawer/DrawerComp';
import ContainerResponsive from '../container/ContainerResponsive';
import Remarks from '../remarks/Remarks';
import Teams from '../teams/Teams';
import Projects from '../projects/Projects';

const PAGES = ["Employees","Shifts","Leaves","Schedules","Attendance","Remarks","Teams","Projects"]

const Home = () => {

  const navigate = useNavigate();
  const location = useLocation();
  const [value,setValue] = useState(0);

  const theme = useTheme();
  const scheduleData = location.state && location.state.scheduleData;
  console.log(theme);
  const isMatch = useMediaQuery(theme.breakpoints.down('md'));

  console.log(isMatch);
  if (scheduleData) {
    return (
      <>
        {/* Render the ScheduleList component inside the Home component */}
        <Tabs textColor='inherit' value={value} onChange={(e,value)=>setValue(value)} indicatorColor='secondary'>
                    <Tab key={6} label={'Schedule'} />
              </Tabs>
        <ContainerResponsive name={6}></ContainerResponsive>
      </>
    );
  }else{
    return (
      <>
          <AppBar position='static' sx={{background:'#063970'}}>
            <Toolbar>
              <IconButton size='large' edge='start' color='inherit' aria-label='Logo'>
                <ThreePIcon/>
              </IconButton>
              {
                isMatch ? (
                  <>
                  <Typography sx={{fontSize:'1.5rem', paddingLeft:'10%'}}>HR APP</Typography>
                  <DrawerComp/>
                  </>
                ):
                (
                  <>
                  <Typography variant='h6' component='div'>
                HR IS
              </Typography>
              <Tabs textColor='inherit' value={value} onChange={(e,value)=>setValue(value)} indicatorColor='secondary'>
                {
                  PAGES.map((page,index) => (
                    <Tab key={index} label={page} />
                  ))
                }
              </Tabs>
              <Button sx={{marginLeft:"auto"}} onClick={()=>navigate('/')} variant='contained'>Logout</Button>
                  </>
                )
              }
            </Toolbar>
          </AppBar>
          { value === 0 && <ContainerResponsive name={value}></ContainerResponsive>}
        { value === 1 && <ContainerResponsive name={value}></ContainerResponsive>}
        {value === 2 && <ContainerResponsive name={value}></ContainerResponsive>}
        {value === 3 && <ContainerResponsive name={value}></ContainerResponsive>}
        {value === 4 && <ContainerResponsive name={value}></ContainerResponsive>}
        { value === 5 && <Remarks/>}
        { value === 6 && <Teams/>}
        { value === 7 && <Projects/>}
      </>
    )
    }
}

export default Home