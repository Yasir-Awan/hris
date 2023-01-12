import React,{useState} from 'react';
import axios from 'axios';
import './AddUser.css';
import { Grid, TextField, Button, Card, CardContent,InputAdornment,MenuItem} from '@mui/material';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import PasswordIcon from '@mui/icons-material/Accessibility';



function AddUser() {
  const [ETypes, setETypes] = useState("");
  const [ESection, setESection] = useState("");
  const [addUserFormData, setAddUserFormData] = useState({uname:'',email:'',site:'',password:'',contact:'',address:'',empType:'',consultant:'',empSec:'',empField:'',empRole:'',address:''});
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
    setETypes(event.target.value)
    setESection(event.target.value)
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
                  <TextField placeholder='enter full name' label="username" name='uname' onChange={inputEvent} value={addUserFormData.uname} variant='outlined' fullWidth required InputProps={{startAdornment: <InputAdornment position= "start">
                  <AccessibilityIcon/>
                  </InputAdornment>}}/>
                </Grid>
                <Grid xs={12} item>
                  <TextField placeholder='enter Email ' label="email" name='email' onChange={inputEvent} value={addUserFormData.email} variant='outlined' fullWidth required InputProps={{startAdornment: <InputAdornment position= "start">
                  <AccessibilityIcon/>
                  </InputAdornment>}}/>
                </Grid>
                <Grid xs={12} item>
                <TextField label="password" placeholder='enter password' name='password' onChange={inputEvent} variant='outlined' 
                InputProps={{startAdornment: <InputAdornment position= "start">
                <PasswordIcon/>
                </InputAdornment>}} value={addUserFormData.password}
                 fullWidth required
                />
                </Grid>
                <Grid xs={12} item>
                <TextField label="password" placeholder='confirm password' name='password' onChange={inputEvent} variant='outlined' 
                InputProps={{startAdornment: <InputAdornment position= "start">
                <PasswordIcon/>
                </InputAdornment>}} value={addUserFormData.password}
                 fullWidth required
                />
                </Grid>
                <Grid xs={12} item>
                  <TextField placeholder='enter site name' label="sitename" name='site' onChange={inputEvent} value={addUserFormData.site} variant='outlined' fullWidth required InputProps={{startAdornment: <InputAdornment position= "start">
                  <AccessibilityIcon/>
                  </InputAdornment>}}/>
                </Grid>
                <Grid item xs={12}>
                  <TextField type="number" placeholder="Enter phone number" label="Phone" name='contact' onChange={inputEvent} value={addUserFormData.contact} variant="outlined" fullWidth required
                  InputProps={{startAdornment: <InputAdornment position= "start"><PasswordIcon/></InputAdornment>}}/>
                </Grid>
                <Grid item xs={12}>
                  <TextField type="address" placeholder="Enter your address" label="adress" name='address' onChange={inputEvent} value={addUserFormData.address} variant="outlined" fullWidth required
                  InputProps={{startAdornment: <InputAdornment position= "start"><PasswordIcon/></InputAdornment>}}/>
                </Grid>
                <Grid xs={12} item>
                  <TextField label="Select employee type" name='empType' onChange={inputEvent} select value={ETypes} variant="outlined" fullWidth required
                  SelectProps={{
                    multiple:false
                  }}>
                <MenuItem value="1">1=Regular</MenuItem>
                <MenuItem value="2">2=NHA Trainee</MenuItem>
                <MenuItem value="3">3=NHA Contract</MenuItem>
                <MenuItem value="3">4=Consultant</MenuItem>
                </TextField>
                </Grid>
                <Grid xs={12} item>
                  <TextField placeholder='enter your consultant name ' label="consultant-name" name='consultant' onChange={inputEvent} value={addUserFormData.consultant} variant='outlined' fullWidth required/>
                </Grid>
                <Grid xs={12} item>
                  <TextField label="Select employee section" name='empSec' onChange={inputEvent} select value={ESection} variant="outlined" fullWidth required
                  SelectProps={{
                    multiple:false
                  }}>
                <MenuItem value="1">1=MIS</MenuItem>
                <MenuItem value="2">2=ETTM</MenuItem>
                <MenuItem value="3">3=ITS</MenuItem>
                <MenuItem value="3">4=Consultant</MenuItem>
                </TextField>
                </Grid>
                <Grid xs={12} item>
                  <TextField placeholder="Employee Role" label="employee role" name='empRole' onChange={inputEvent} value={addUserFormData.empRole} variant="outlined" fullWidth required />
                </Grid>
                {/* <Grid item xs={12}>
                  <TextField type="email" placeholder="Enter email" label="Email" variant="outlined" fullWidth required />
                </Grid> */}
                
                {/* <Grid item xs={12}>
                  <TextField label="Address" multiline rows={4} placeholder="Type your address here" onChange={inputEvent} value={addUserFormData.contact} variant="outlined" fullWidth required />
                </Grid> */}
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" fullWidth >Add</Button>
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