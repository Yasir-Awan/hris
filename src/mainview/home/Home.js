import React,{useState} from 'react'
import { useNavigate,useLocation,useParams} from 'react-router-dom';
import { AppBar, Toolbar,IconButton,Typography, Tabs, Tab,useMediaQuery,useTheme } from "@mui/material";
// import ThreePIcon from '@mui/icons-material/ThreeP';
import DrawerComp from '../drawer/DrawerComp';
import ContainerResponsive from '../container/ContainerResponsive';
import Remarks from '../remarks/Remarks';
import Teams from '../teams/Teams';
import Projects from '../projects/Projects';
import AccountMenu from '../../components/Menu';
import NhaLogo from '../../assets/icons/nha_logo.png'

const Home = props => {

  const { page } = useParams();

  const tabNameToIndex = {

    0: "schedules",
    1 : "leaves",
    2: "attendance",
    3: "monthly_summary",
    4 : "employees",
    5 : "shifts",
    6: "remarks",
    7: "teams",
    8: "projects"
  }
  const  indexToTabName = {
      "schedules":0,
      "leaves":1,
      "attendance":2,
      "monthly_summary":3,
      "employees":4,
      "shifts":5,
      "remarks":6,
      "teams":7,
      "projects":8}
  const navigate = useNavigate();
  const location = useLocation();
  const [SelectedTab,setSelectedTab] = useState(indexToTabName[page])

  const handleChange = (event, newValue) => {
    navigate(`/home/${tabNameToIndex[newValue]}`);
    setSelectedTab(newValue);
  };

  const theme = useTheme();
  const scheduleData = location.state && location.state.scheduleData;
  const isMatch = useMediaQuery(theme.breakpoints.down('md'));

  const ConditionalComponent = ({ role }) => {
    if (role ==='3') {
      return <Tabs textColor='inherit' value={SelectedTab} onChange={handleChange} indicatorColor='secondary' sx={{ marginLeft: 'auto', marginRight: 'auto' }}>
      <Tab label="Schedules"/>
      <Tab label="Leaves"/>
      <Tab label="Attendance"/>
      <Tab label="Summary"/>
      <Tab label="Employees"/>
      <Tab label="Shifts"/>
      <Tab label="Remarks"/>
      <Tab label="Teams"/>
      <Tab label="Projects"/>
    </Tabs>;
    } else {
      return <Tabs textColor='inherit' value={SelectedTab} onChange={handleChange} indicatorColor='secondary' sx={{ marginLeft: 'auto', marginRight: 'auto' }}>
      <Tab label="Schedules"/>
      <Tab label="Leaves"/>
      <Tab label="Attendance"/>
      <Tab label="Summary"/>
      {/* <Tab label="Employees"/>
      <Tab label="Shifts"/>
      <Tab label="Remarks"/>
      <Tab label="Teams"/>
      <Tab label="Projects"/> */}
    </Tabs>;
    }
  }

  if (scheduleData) {
    return (
      <>
        {/* Render the ScheduleList component inside the Home component */}
        <Tabs textColor='inherit' value={SelectedTab} onChange={handleChange} indicatorColor='secondary'>
                    <Tab key={0} label={'Schedules'} />
        </Tabs>
        <ContainerResponsive name={3}></ContainerResponsive>
      </>
    );
  }else{
    return (
      <>
          <AppBar position='static' sx={{background:'#063970'}}>
            <Toolbar>
              <IconButton size='large' edge='start' color='inherit' aria-label='Logo'>
              <img src={NhaLogo} alt="Pic" width="65" height="45"/>
                {/* <ThreePIcon/> */}
              </IconButton>
              {
                isMatch ? (
                  <>
                  <Typography sx={{fontSize:'1.5rem', paddingLeft:'10%'}}>HR APP</Typography>
                  {/* <DrawerComp/> */}
                  </>
                ):
                (
                  <>
                  <Typography variant='h5' component='div'>
                    HRIS
                  </Typography>

              <ConditionalComponent role={localStorage.getItem('role')}/>
              <AccountMenu/>
              {/* <Button sx={{marginLeft:"auto"}} onClick={()=>navigate('/')} variant='contained'>Logout</Button> */}
                  </>
                )
              }
            </Toolbar>
          </AppBar>

          { SelectedTab === 0 && <ContainerResponsive name={SelectedTab}></ContainerResponsive>}
          { SelectedTab === 1 && <ContainerResponsive name={SelectedTab}></ContainerResponsive>}
          { SelectedTab === 2 && <ContainerResponsive name={SelectedTab}></ContainerResponsive>}
          { SelectedTab === 3 && <ContainerResponsive name={SelectedTab}></ContainerResponsive>}
          { SelectedTab === 4 && <ContainerResponsive name={SelectedTab}></ContainerResponsive>}
          { SelectedTab === 5 && <ContainerResponsive name={SelectedTab}></ContainerResponsive>}
          { SelectedTab === 6 && <Remarks/>}
          { SelectedTab === 7 && <Teams/>}
          { SelectedTab === 8 && <Projects/>}
      </>
    )
    }
}

export default Home