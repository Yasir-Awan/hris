import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { AppBar, Toolbar,IconButton,Typography, Tabs, Tab, Button, useMediaQuery,useTheme } from "@mui/material";
import ThreePIcon from '@mui/icons-material/ThreeP';
import DrawerComp from '../drawer/DrawerComp';
import ContainerResponsive from '../container/ContainerResponsive';
import Remarks from '../remarks/Remarks';
import Teams from '../teams/Teams';
import Projects from '../projects/Projects';

const PAGES = ["Users","Attendance","Remarks","Teams","Projects","Shift", "Schedule"]

const Home = () => {

  const navigate = useNavigate();
  const [value,setValue] = useState(0);

  const theme = useTheme();
  console.log(theme);
  const isMatch = useMediaQuery(theme.breakpoints.down('md'));
  console.log(isMatch);
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
              HR APP
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
        { value === 0 && <ContainerResponsive name={value}></ContainerResponsive> }
      { value === 1 && <ContainerResponsive name={value}></ContainerResponsive>}
      { value === 2 && <Remarks/>}
      { value === 3 && <Teams/>}
      { value === 4 && <Projects/>}
      {value === 5 && <ContainerResponsive name={value}></ContainerResponsive>}
      {value === 6 && <ContainerResponsive name={value}></ContainerResponsive>}
    </>
  )
}

export default Home