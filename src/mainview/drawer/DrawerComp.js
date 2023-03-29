import React,{useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { Drawer,IconButton,List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
import ContainerResponsive from '../container/ContainerResponsive';
import Remarks from '../remarks/Remarks';
import Teams from '../teams/Teams';
import Projects from '../projects/Projects';
// import UserList from '../users/UserList';
// import AttandanceList from '../attandance/AttandanceList';
import Box from '@mui/material/Box';
const PAGES = ["Users","Attendance","Remarks","Teams","Projects","Shift", "Schedule"]

const DrawerComp = () => {
    const navigate = useNavigate();
    // const [value,setValue] = useState(0);
    const [openDrawer, setopenDrawer] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);
    const handleClick = (value) => {
        setSelectedTab(value);
        // render other component based on value
        // e.g. if value is 'Page 1', render <Page1Component />
      };

return (
    <>
    <Box sx={{flexGrow:1}}>
    <Drawer open={openDrawer}
    onClose={()=>setopenDrawer(false)}>
        <List value={selectedTab}
    onChange={(e,value)=>{setSelectedTab(value)}}>

            {
                PAGES.map((page,index)=>(
                    <ListItemButton key={index} onClick={() => handleClick(page)}>
                    <ListItemIcon>
                        <ListItemText>
                           {page}
                        </ListItemText>
                    </ListItemIcon>
                </ListItemButton>
                ))
            }
        </List>
    </Drawer>
    <IconButton
            onClick={() =>setopenDrawer(!openDrawer)}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2,marginLeft:'auto',paddingLeft:'90%'}}>
            <MenuIcon/>
        </IconButton>
        </Box>
        { selectedTab === 0 && <ContainerResponsive name={selectedTab}></ContainerResponsive> }
      { selectedTab === 1 && <ContainerResponsive name={selectedTab}></ContainerResponsive>}
      { selectedTab === 2 && <Remarks/>}
      { selectedTab === 3 && <Teams/>}
      { selectedTab === 4 && <Projects/>}
      {selectedTab === 5 && <ContainerResponsive name={selectedTab}></ContainerResponsive>}
      {selectedTab === 6 && <ContainerResponsive name={selectedTab}></ContainerResponsive>}
    

    </>
    )
}

export default DrawerComp