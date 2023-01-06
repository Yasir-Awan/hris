import React,{useState} from 'react';
// import {useHistory} from 'react-router-dom';
// import Home from '../../mainview/home/Home';
import axios from 'axios';
import './AddUser.css';
// import './App.css';
import { Grid, TextField, Button, Card, CardContent} from '@mui/material';


function AddUser() {
  const [frmData, setFormData] = useState({fName:'',lName:'',contact:'',empType:'',empField:'',empRole:'',address:''});
  // let history = useHistory();
  const formSubmit = (event) => {
    event.preventDefault();
    console.log(frmData);
    axios.post('http://localhost:80/hris/add_user', frmData)
    .then(function (response) {
      console.log(response);
      window.location.reload();
      // history.go;
      // location.reload();
    })
    .catch(function (error) {
      console.log(error);
    });
  }
  const inputEvent = (event) => {
    console.log(event.target.value);
    console.log(event.target.name);

    // const value = event.target.value;
    // const name = event.target.name;
    const {name,value} = event.target;

    setFormData((preValue)=>{
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
                <Grid xs={12} sm={6} item>
                  <TextField placeholder="Enter first name" name='fName' onChange={inputEvent} value={frmData.fname} label="First Name" variant="outlined" fullWidth required />
                </Grid>
                <Grid xs={12} sm={6} item>
                  <TextField placeholder="Enter last name" label="Last Name" name='lName' onChange={inputEvent} value={frmData.lname} variant="outlined" fullWidth required />
                </Grid>
                <Grid xs={12} sm={6} item>
                  <TextField placeholder="Employee Type" label="employee type" name='empType' onChange={inputEvent} value={frmData.empType} variant="outlined" fullWidth required />
                </Grid>
                <Grid xs={12} sm={6} item>
                  <TextField placeholder="Employee Field" label="employee Field" name='empField' onChange={inputEvent} value={frmData.empField} variant="outlined" fullWidth required />
                </Grid>
                <Grid xs={12} sm={6} item>
                  <TextField placeholder="Employee Role" label="employee role" name='empRole' onChange={inputEvent} value={frmData.empRole} variant="outlined" fullWidth required />
                </Grid>
                {/* <Grid item xs={12}>
                  <TextField type="email" placeholder="Enter email" label="Email" variant="outlined" fullWidth required />
                </Grid> */}
                <Grid item xs={12}>
                  <TextField type="number" placeholder="Enter phone number" label="Phone" name='contact' onChange={inputEvent} value={frmData.contact} variant="outlined" fullWidth required />
                </Grid>
                {/* <Grid item xs={12}>
                  <TextField label="Address" multiline rows={4} placeholder="Type your address here" onChange={inputEvent} value={frmData.contact} variant="outlined" fullWidth required />
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