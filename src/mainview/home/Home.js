import React,{useState} from 'react'
import { useNavigate,useLocation,useParams} from 'react-router-dom';
import { AppBar, Toolbar,IconButton,Typography, Tabs, Tab,useMediaQuery,useTheme} from "@mui/material";
// import ThreePIcon from '@mui/icons-material/ThreeP';
// import DrawerComp from '../drawer/DrawerComp';
import ContainerResponsive from '../container/ContainerResponsive';
// import ReportList from '../report/ReportList';
import Teams from '../teams/Teams';
import Projects from '../projects/Projects';
import AccountMenu from '../../components/Menu';
import NhaLogo from '../../assets/icons/nha_logo.png'

const Home = props => {

  const { page } = useParams();

  const tabNameToIndex = JSON.parse(localStorage.getItem('tabNameToIndex'))
  const  indexToTabName = JSON.parse(localStorage.getItem('indexToTabName'))
  const navigate = useNavigate();
  const location = useLocation();
  const [SelectedTab,setSelectedTab] = useState(indexToTabName[page])

  // Convert object to array of objects
  const tabsConfig = Object.keys(tabNameToIndex).map(key => ({
    key,
    value: tabNameToIndex[key]
  }));

  console.log(tabsConfig)

  const keys = tabsConfig.map(entry => parseInt(entry.key));
  const minKey = Math.min(...keys);
  const maxKey = Math.max(...keys);

  const resultArray = Array.from({ length: maxKey - minKey + 1 }, (_, index) => {
    const key = String(minKey + index);
    const existingEntry = tabsConfig.find(entry => entry.key === key);

    return existingEntry ? { ...existingEntry } : { key, value: "" };
  });

  // const indexofTab = (naam) => {
  //   return indexToTabName[naam]
  // }

  const handleChange = (event, newValue) => {
    console.log(event.target.innerText.toLowerCase())
  //     let tabu = indexofTab(event.target.innerText.toLowerCase());
  //       console.log(tabu)
  // //   const selectedTabKey = tabsConfig.find((tab) => tab.value === newValue)?.key;
  // //   console.log(selectedTabKey);
    setSelectedTab(newValue);
     // alert(newValue)
    navigate(`/home/${tabNameToIndex[newValue]}`);
     // setSelectedTab(newValue);
  };

  const theme = useTheme();
  const scheduleData = location.state && location.state.scheduleData;
  const isMatch = useMediaQuery(theme.breakpoints.down('md'));

  const getTabs = () => {
    return resultArray.map((tab) => (
      tab.value ? (  // Use ternary operator for conditional rendering
                      <Tab
                        key={tab.key}
                        label={tab.value}
                        sx={{ fontFamily: 'Quicksand, sans-serif', fontWeight: 'bold',color:'#582a1d' }}
                      />
                    ) : (
                      <Tab style={{ display: 'none' }}  disabled label="" />
                    )
    ));
  };

  const TabsComponent = () => {
    const tabs = getTabs();
    return (
      <Tabs
        textColor='inherit'
        value={SelectedTab}
        onChange={(event, newValue) => handleChange(event, newValue, tabsConfig)}
        indicatorColor='secondary'
        sx={{
          marginLeft: 'auto',
          marginRight: 'auto',
          color: 'white',
          background: '#f1f1f1', // Subdued gray background
          borderRadius: '8px',
          boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
          "& .MuiTabs-indicator": {
            backgroundColor: '#ff5722', // Vibrant orange indicator color
          },
          "& .MuiTab-root": {
            "&:hover": {
              color: '#ff5722',
              backgroundColor: '#f9f9f9', // Slightly lighter gray on hover
              fontWeight: 'bold',
            },
          },
        }}
      >
        <Tab style={{ display: 'none' }} disabled label="" />
        {tabs}
      </Tabs>
    );
  };



  const renderContent = (selectedTab) => {
    switch (selectedTab) {
      case 1:
        return <ContainerResponsive name={selectedTab} />;
      case 2:
        return <ContainerResponsive name={selectedTab} />;
      case 3:
        return <ContainerResponsive name={selectedTab} />;
      case 4:
        return <ContainerResponsive name={selectedTab} />;
      case 5:
        return <ContainerResponsive name={selectedTab} />;
      case 6:
        return <ContainerResponsive name={selectedTab} />;
      case 7:
        return <Teams />;
      case 8:
        return <Projects />;
      case 9:
        return <ContainerResponsive name={selectedTab} />;
      default:
        return null;
    }
  };


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
                    NTOC HRIS
                  </Typography>
              <TabsComponent/>
              <AccountMenu/>
              {/* <Button sx={{marginLeft:"auto"}} onClick={()=>navigate('/')} variant='contained'>Logout</Button> */}
                  </>
                )
              }
            </Toolbar>
          </AppBar>

          {renderContent(SelectedTab)}
      </>
    )
    }
}

export default Home