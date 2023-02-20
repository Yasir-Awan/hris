import React,{useState} from 'react';
import axios from 'axios';
import './AddUser.css';
import { Grid, TextField, Button, Card, CardContent,InputAdornment,MenuItem} from '@mui/material';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import TollIcon from '@mui/icons-material/Toll';
import PhoneIcon from '@mui/icons-material/Phone';
// import HomeIcon from '@mui/icons-material/Home';
// import { Textarea } from '@mui/joy';

function AddUser() {

  const [addUserFormData, setAddUserFormData] = useState({fname:'',lname:'',email:'',site:'',password:'',contact:'',empType:'',consultant:'',empSec:'',empField:'',empRole:'',address:''});
  // const [isConsultant, setIsConsultant] = useState(false);
  const formSubmit = (event) => {
    event.preventDefault();
    console.log(addUserFormData);
    axios.post('http://58.27.166.43:80/hris/add_user', addUserFormData)
    .then(function (response) {
      console.log(response);
      window.location.reload();
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  const inputEvent = (event) => {
    console.log(event.target.value);
    console.log(event.target.name);

    const {name,value} = event.target;

    setAddUserFormData((preValue)=>{
      console.log(preValue);
      return {
        ...preValue,
        [name] : value
      };
    })
  }

  return (
    <div className="App">
      <Grid>
        <Card style={{ maxWidth: 450, padding: "20px 5px", margin: "0 auto" }}>
          <CardContent>
            <form onSubmit={formSubmit}>
              <Grid container spacing={1}>
              <Grid xs={12} item>
                  <TextField placeholder='enter first name' label="firstname" name='fname' onChange={inputEvent} value={addUserFormData.fname} variant='outlined' sx={{width:"100%"}} required InputProps={{startAdornment: <InputAdornment position= "start">
                  <AccessibilityIcon/>
                  </InputAdornment>}}/>
                </Grid>
                <Grid xs={12} item>
                  <TextField placeholder='enter last name' label="lastname" name='lname' onChange={inputEvent} value={addUserFormData.lname} variant='outlined' sx={{width:"100%"}} required InputProps={{startAdornment: <InputAdornment position= "start">
                  <AccessibilityIcon/>
                  </InputAdornment>}}/>
                </Grid>
                <Grid xs={12} item>
                  <TextField placeholder='enter Email ' label="email" name='email' onChange={inputEvent} value={addUserFormData.email} variant='outlined' sx={{width:"100%"}} required InputProps={{startAdornment: <InputAdornment position= "start">
                  <EmailIcon/>
                  </InputAdornment>}}/>
                </Grid>
                <Grid xs={12} item>
                <TextField label="password" placeholder='enter password' name='password' onChange={inputEvent} variant='outlined'
                InputProps={{startAdornment: <InputAdornment position= "start">
                <KeyIcon/>
                </InputAdornment>}} value={addUserFormData.password}
                 sx={{width:"100%"}} required
                />
                 </Grid>
                {/* <Grid xs={12} item>
                <TextField label="confirm password" placeholder='confirm password' name='confirmPassword' onChange={inputEvent} variant='outlined'
                InputProps={{startAdornment: <InputAdornment position= "start">
                <KeyIcon/>
                </InputAdornment>}} value={addUserFormData.confirmPassword}
                 sx={{width:"100%"}} required
                />
                </Grid> */}

                <Grid item xs={12}>
                  <TextField type="number" label="Phone" placeholder="Enter phone number" name='contact' onChange={inputEvent} value={addUserFormData.contact} variant="outlined" sx={{width:"100%"}} required
                  InputProps={{startAdornment: <InputAdornment position= "start"><PhoneIcon/></InputAdornment>}}/>
                </Grid>
                <Grid item xs={12}>
                  <TextField type="address" label="adress" placeholder="Enter your address" name='address' onChange={inputEvent} value={addUserFormData.address} variant="outlined" sx={{width:"100%"}} required
                 />
                </Grid>
                <Grid xs={12} item>
                  <TextField label="sitename" name='site' onChange={inputEvent} select value={addUserFormData.site} variant='outlined' sx={{width:"100%"}} required
                  SelectProps={{
                   multiple: false
                  }}>
                    <MenuItem value="1">1=National Engineers</MenuItem>
                    <MenuItem value="2">2=Sangjani</MenuItem>
                    <MenuItem value="3">3=Harro</MenuItem>
                    <MenuItem value="4">4=Iqbal Shaheed</MenuItem>
                    <MenuItem value="5">5=NHA-HQ</MenuItem>
                    <MenuItem value="6">6=Mandra</MenuItem>
                    <MenuItem value="7">7=Terraki</MenuItem>
                    <MenuItem value="8">8=Jhelum</MenuItem>
                    <MenuItem value="9">9=Chenab</MenuItem>
                    <MenuItem value="12">12=IMDCW OLD</MenuItem>
                    <MenuItem value="13">14=IMDCW</MenuItem>
                    <MenuItem value="14">14=Qutbal</MenuItem>
                    <MenuItem value="15">15=Harrapa</MenuItem>
                    <MenuItem value="16">16=Khanbella</MenuItem>
                    <MenuItem value="17">17=Okara</MenuItem>
                    <MenuItem value="18">18=Gujranwalla</MenuItem>
                    </TextField>
                </Grid>
                {/* <Grid xs={12} item>
                  <TextField placeholder='enter your consultant name ' label="consultant-name" name='consultant' onChange={inputEvent} value={addUserFormData.consultant} variant='outlined' fullWidth required/>
                </Grid> */}
                <Grid xs={12} item>
                  <TextField name='empType' onChange={inputEvent} select value={addUserFormData.empType} label="Select employee type" variant="outlined" sx={{width:"100%"}} required
                  SelectProps={{
                    multiple:false
                  }}>
                <MenuItem value="1">1=Regular</MenuItem>
                <MenuItem value="2">2=NHA Trainee</MenuItem>
                <MenuItem value="3">3=NHA Contract</MenuItem>
                <MenuItem value="4">4=Consultant</MenuItem>
                </TextField>
                {/* {addUserFormData=== '4' &&(
                                    // <TextField placeholder='enter your consultant name ' label="consultant-name" name='consultant' onChange={inputEvent} value={addUserFormData.consultant} variant='outlined' fullWidth required/>

                )} */}
                </Grid>

                {addUserFormData.empType === '4' &&(
                  <Grid xs={12} item>
                  <TextField placeholder='enter your consultant name ' label="consultant-name" name='consultant' onChange={inputEvent} value={addUserFormData.consultant} variant='outlined' sx={{width:"100%"}} required/>
                </Grid>
                ) }


                <Grid xs={12} item>
                  <TextField label="Select employee section" name='empSec' onChange={inputEvent} select value={addUserFormData.empSec} variant="outlined" sx={{width:"100%"}} required
                  SelectProps={{
                    multiple:false
                  }}>
                <MenuItem value="1">1=MIS</MenuItem>
                <MenuItem value="2">2=ETTM</MenuItem>
                <MenuItem value="3">3=ITS</MenuItem>
                </TextField>
                </Grid>
                <Grid xs={12} item>
                  <TextField label="Select employee field" name='empField' onChange={inputEvent} select value={addUserFormData.empField} variant="outlined" sx={{width:"100%"}} required
                  SelectProps={{
                    multiple:false
                  }}>
                <MenuItem value="1">1=Programming</MenuItem>
                <MenuItem value="2">2=HR</MenuItem>
                <MenuItem value="3">3=Networking</MenuItem>
                <MenuItem value="4">4=Accounting</MenuItem>
                <MenuItem value="5">5=Traffic Counting</MenuItem>
                <MenuItem value="6">6=Engineering</MenuItem>
                </TextField>
                </Grid>
                <Grid xs={12} item>
                  <TextField label="Select employee role" name='empRole' onChange={inputEvent} select value={addUserFormData.empRole} variant="outlined" sx={{width:"100%"}} required
                  SelectProps={{
                    multiple:false
                  }}>
                <MenuItem value="1">1=Technical Manager</MenuItem>
                <MenuItem value="2">2=HR Manager</MenuItem>
                <MenuItem value="3">3=Ops Manager</MenuItem>
                <MenuItem value="4"> 4=Network Manager</MenuItem>
                <MenuItem value="5">5=Programming Manager</MenuItem>
                <MenuItem value="6">6=Traffic Counting Manager</MenuItem>
                <MenuItem value="7">7=Inventory Manager</MenuItem>
                <MenuItem value="8">8=Team Member</MenuItem>
                </TextField>
                </Grid>
                {/* <Grid xs={12} item>
                  <TextField label="Select employee team" name='empTeam' onChange={inputEvent} select value={addUserFormData.empTeam} variant="outlined" sx={{width:"100%"}} required
                  SelectProps={{
                    multiple:false
                  }}>
                <MenuItem value="1">1=tecnical team</MenuItem>
                <MenuItem value="2">2=web development</MenuItem>
                <MenuItem value="3">3=Hr team</MenuItem>
                </TextField>
                </Grid> */}
                {/* <Grid xs={12} item>
                  <TextField label="Select status" name='status' onChange={inputEvent} select value={addUserFormData.status} variant="outlined" sx={{width:"100%"}} required
                  SelectProps={{
                    multiple:false
                  }}>
                <MenuItem value="1">0= Status Off</MenuItem>
                <MenuItem value="2"> 1= Status on</MenuItem>
                     </TextField>
                </Grid> */}
                {/* <Grid item xs={12}>
                  <TextField type="email" placeholder="Enter email" label="Email" variant="outlined" sx={{width:"100%"}} required />
                </Grid> */}

                {/* <Grid item xs={12}>
                  <TextField label="Address" multiline rows={4} placeholder="Type your address here" onChange={inputEvent} value={addUserFormData.contact} variant="outlined" sx={{width:"100%"}} required />
                </Grid> */}
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" sx={{width:"100%"}} >Add</Button>
                </Grid>

              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
}

export default AddUser;