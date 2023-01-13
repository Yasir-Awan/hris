import React,{useState} from 'react'
import { Drawer,IconButton,List, ListItemButton, ListItemIcon, ListItemText } from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu';
// import UserList from '../users/UserList';
// import AttandanceList from '../attandance/AttandanceList';
import Box from '@mui/material/Box';
const PAGES = ["Users","Attendance","Remarks","Teams","Projects","Login","Logout"]

const DrawerComp = () => {
    const [openDrawer, setopenDrawer] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);

return (
    <>
    <Box sx={{flexGrow:1}}>
    <Drawer open={openDrawer}
    onClose={()=>setopenDrawer(false)}
    value={selectedTab}
    onChange={(e,value)=>setSelectedTab(value)}
    >
        <List>
            {
                PAGES.map((page,index)=>(
                    <ListItemButton key={index}>
                    <ListItemIcon>
                        <ListItemText>{page}</ListItemText>
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
    </>
    )
}

export default DrawerComp