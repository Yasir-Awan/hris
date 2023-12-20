import React,{useState} from 'react'
import { useNavigate,useLocation,useParams} from 'react-router-dom';
import { AppBar, Toolbar,IconButton,Typography, Tabs, Tab,useMediaQuery,useTheme} from "@mui/material";
// import ThreePIcon from '@mui/icons-material/ThreeP';
// import DrawerComp from '../drawer/DrawerComp';
import ContainerResponsive from '../container/ContainerResponsive';
import Remarks from '../remarks/Remarks';
import Teams from '../teams/Teams';
import Projects from '../projects/Projects';
import AccountMenu from '../../components/Menu';
import NhaLogo from '../../assets/icons/nha_logo.png'

const Home = props => {

  const { page } = useParams();

  const tabNameToIndex = {
    1: "schedules",
    2 : "leaves",
    3: "attendance",
    4: "monthly_summary",
    5 : "employees",
    6 : "shifts",
    7: "remarks",
    8: "teams",
    9: "projects"
  }
  const  indexToTabName = {
      "schedules":1,
      "leaves":2,
      "attendance":3,
      "monthly_summary":4,
      "employees":5,
      "shifts":6,
      "remarks":7,
      "teams":8,
      "projects":9}
  const navigate = useNavigate();
  const location = useLocation();
  console.log(location);
  const [SelectedTab,setSelectedTab] = useState(indexToTabName[page])

  const handleChange = (event, newValue) => {
    navigate(`/home/${tabNameToIndex[newValue]}`);
    setSelectedTab(newValue);
  };

  const theme = useTheme();
  const scheduleData = location.state && location.state.scheduleData;
  const isMatch = useMediaQuery(theme.breakpoints.down('md'));

  const ConditionalComponent = ({ designation }) => {
    const tabGradientBackground = 'linear-gradient(135deg, #388E3C, #4CAF50)'; // Gradient background for the tabs
    if (designation ==='3') {
      return <Tabs textColor='inherit' value={SelectedTab} onChange={handleChange} indicatorColor='secondary' 
                sx={{ marginLeft: 'auto',
                      marginRight: 'auto', 
                      color: 'white',
                      background: tabGradientBackground,
                      borderRadius: '8px', // Add some border-radius for a softer look
                      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Add a subtle shadow
                      }}>
      <Tab style={{ display: 'none' }}  disabled label="" /> 
      <Tab label="Schedules" sx={{ fontFamily: 'Quicksand, sans-serif',fontWeight: 'bold', }}/>
      <Tab label="Leaves" sx={{ fontFamily: 'Quicksand, sans-serif',fontWeight: 'bold', }}/>
      <Tab label="Attendance" sx={{ fontFamily: 'Quicksand, sans-serif',fontWeight: 'bold', }}/>
      <Tab label="Summary" sx={{ fontFamily: 'Quicksand, sans-serif',fontWeight: 'bold', }}/>
      <Tab label="Employees" sx={{ fontFamily: 'Quicksand, sans-serif',fontWeight: 'bold', }}/>
      <Tab label="Shifts" sx={{ fontFamily: 'Quicksand, sans-serif',fontWeight: 'bold', }}/>
      <Tab label="Remarks" sx={{ fontFamily: 'Quicksand, sans-serif',fontWeight: 'bold', }}/>
      <Tab label="Teams" sx={{ fontFamily: 'Quicksand, sans-serif',fontWeight: 'bold', }}/>
      <Tab label="Projects" sx={{ fontFamily: 'Quicksand, sans-serif',fontWeight: 'bold', }}/>
    </Tabs>;
    } else {
      return <Tabs textColor='inherit' value={SelectedTab} onChange={handleChange} indicatorColor='secondary' 
                  sx={{ marginLeft: 'auto',
                        marginRight: 'auto', 
                        color: 'white', 
                        background: tabGradientBackground,
                        borderRadius: '8px', // Add some border-radius for a softer look
                        boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', // Add a subtle shadow
                        }}>
      <Tab style={{ display: 'none' }}  disabled label="" /> 
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
        <ContainerResponsive name={2}></ContainerResponsive>
      </>
    );
  }else{
    return (
      <>
          <AppBar position='static' sx={{background:'linear-gradient(135deg, #388E3C, #4CAF50)'}}>
            <Toolbar>
              <IconButton size='large' edge='start' color='inherit' aria-label='Logo'>
              <img src={NhaLogo} alt="Pic" width="65" height="60"/>
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
                  <Typography variant='h4' component='div' sx={{fontFamily: 'Quicksand, sans-serif', ml: 2, color: 'white', fontWeight: 'bold', letterSpacing: 1 }}>
                    HRIS
                  </Typography>

              <ConditionalComponent designation={localStorage.getItem('designation')}/>
              <AccountMenu/>
              {/* <Button sx={{marginLeft:"auto"}} onClick={()=>navigate('/')} variant='contained'>Logout</Button> */}
                  </>
                )
              }
            </Toolbar>
          </AppBar>

          { SelectedTab === 1 && <ContainerResponsive name={SelectedTab}></ContainerResponsive>}
          { SelectedTab === 2 && <ContainerResponsive name={SelectedTab}></ContainerResponsive>}
          { SelectedTab === 3 && <ContainerResponsive name={SelectedTab}></ContainerResponsive>}
          { SelectedTab === 4 && <ContainerResponsive name={SelectedTab}></ContainerResponsive>}
          { SelectedTab === 5 && <ContainerResponsive name={SelectedTab}></ContainerResponsive>}
          { SelectedTab === 6 && <ContainerResponsive name={SelectedTab}></ContainerResponsive>}
          { SelectedTab === 7 && <Remarks/>}
          { SelectedTab === 8 && <Teams/>}
          { SelectedTab === 9 && <Projects/>}
      </>
    )
    }
}

export default Home