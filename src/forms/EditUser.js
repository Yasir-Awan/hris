import React,{useState} from 'react';
import axios from 'axios';
import './add_user/AddUser.css';
import { Grid, TextField, Button, Card, CardContent,InputAdornment,MenuItem} from '@mui/material';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import EmailIcon from '@mui/icons-material/Email';
import KeyIcon from '@mui/icons-material/Key';
import TollIcon from '@mui/icons-material/Toll';
import PhoneIcon from '@mui/icons-material/Phone';
// import HomeIcon from '@mui/icons-material/Home';
// import { Textarea } from '@mui/joy';

function EditUser(props) {

  const [addUserFormData, setAddUserFormData] = useState({...props});
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
                  <TextField placeholder='enter full name' label="username" name='uname' onChange={inputEvent} value={addUserFormData.uname} variant='outlined' sx={{width:"100%"}} required InputProps={{startAdornment: <InputAdornment position= "start">
                  <AccessibilityIcon/>
                  </InputAdornment>}}/>
                </Grid>

                <Grid item xs={12}>
                  <TextField type="number" label="Phone" placeholder="Enter phone number" name='contact' onChange={inputEvent} value={addUserFormData.contact} variant="outlined" sx={{width:"100%"}} required
                  InputProps={{startAdornment: <InputAdornment position= "start"><PhoneIcon/></InputAdornment>}}/>
                </Grid>
                
                <Grid item xs={12}>
                  <Button type="submit" variant="contained" color="primary" sx={{width:"100%"}} >Edit</Button>
                </Grid>

              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
}

export default EditUser;