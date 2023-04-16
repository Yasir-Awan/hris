import React,{useState} from 'react'
import { useNavigate,useLocation,useParams} from 'react-router-dom';
import { AppBar, Toolbar,IconButton,Typography, Tabs, Tab, Button, useMediaQuery,useTheme } from "@mui/material";
import ThreePIcon from '@mui/icons-material/ThreeP';
import DrawerComp from '../drawer/DrawerComp';
import ContainerResponsive from '../container/ContainerResponsive';
import Remarks from '../remarks/Remarks';
import Teams from '../teams/Teams';
import Projects from '../projects/Projects';

// const PAGES = ["Employees","Shifts","Leaves","Schedules","Attendance","Remarks","Teams","Projects"]

const Home = props => {

  const { page } = useParams();

  const tabNameToIndex = {
    0 : "employees",
    1 : "shifts",
    2 : "leaves",
    3: "schedules",
    4: "attendance",
    5: "remarks",
    6: "teams",
    7: "projects"
  }
  const  indexToTabName = {
      "employees":0,
      "shifts":1,
      "leaves":2,
      "schedules":3,
      "attendance":4,
      "remarks":5,
      "teams":6,
      "projects":7}
  const navigate = useNavigate();
  const location = useLocation();
  const [SelectedTab,setSelectedTab] = useState(indexToTabName['employees']);

  if(!page==='undefined'){
    setSelectedTab(indexToTabName[page])
  }

  const handleChange = (event, newValue) => {
    navigate(`/home/${tabNameToIndex[newValue]}`);
    setSelectedTab(newValue);
  };

  const theme = useTheme();
  const scheduleData = location.state && location.state.scheduleData;
  console.log(theme);
  const isMatch = useMediaQuery(theme.breakpoints.down('md'));

  console.log(isMatch);
  if (scheduleData) {
    return (
      <>
        {/* Render the ScheduleList component inside the Home component */}
        <Tabs textColor='inherit' value={SelectedTab} onChange={handleChange} indicatorColor='secondary'>
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
                  <Typography variant='h5' component='div'>
                HR IS
              </Typography>
              <Tabs textColor='inherit' value={SelectedTab} onChange={handleChange} indicatorColor='secondary' sx={{ marginLeft: 'auto', marginRight: 'auto' }}>
                <Tab label="Employees"/>
                <Tab label="Shifts"/>
                <Tab label="Leaves"/>
                <Tab label="Schedules"/>
                <Tab label="Attendance"/>
                <Tab label="Remarks"/>
                <Tab label="Teams"/>
                <Tab label="Projects"/>
              </Tabs>
              <Button sx={{marginLeft:"auto"}} onClick={()=>navigate('/')} variant='contained'>Logout</Button>
                  </>
                )
              }
            </Toolbar>
          </AppBar>
          { SelectedTab === 0 && <ContainerResponsive name={SelectedTab}></ContainerResponsive>}
        { SelectedTab === 1 && <ContainerResponsive name={SelectedTab}></ContainerResponsive>}
        {SelectedTab === 2 && <ContainerResponsive name={SelectedTab}></ContainerResponsive>}
        {SelectedTab === 3 && <ContainerResponsive name={SelectedTab}></ContainerResponsive>}
        {SelectedTab === 4 && <ContainerResponsive name={SelectedTab}></ContainerResponsive>}
        { SelectedTab === 5 && <Remarks/>}
        { SelectedTab === 6 && <Teams/>}
        { SelectedTab === 7 && <Projects/>}
      </>
    )
    }
}

export default Home