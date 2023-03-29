import React, { useState } from 'react';
// import './Addshift.css';
import axios from 'axios';
import { Grid, TextField, Button, Card, CardContent, MenuItem } from '@mui/material';
import Stack from '@mui/material/Stack';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';

function Addshift() {
  const [addShiftFormData, setaddShiftFormData] = useState({ shift_name: '', shift_type: '', start: null, end: null });

  const formSubmit = (event) => {
    event.preventDefault();
    console.log(addShiftFormData);
    axios.post('', addShiftFormData)
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

    const { name, value } = event.target;

    setaddShiftFormData((preValue) => {
      console.log(preValue);
      return {
        ...preValue,
        [name]: value
      };
    })
  }

  const handleStartTimeChange = (time) => {
    setaddShiftFormData((preValue) => {
      return {
        ...preValue,
        start: time
      };
    });
  }

  const handleEndTimeChange = (time) => {
    setaddShiftFormData((preValue) => {
      return {
        ...preValue,
        end: time
      };
    });
  }

  return (
    <div className="App">
      <Grid>
        <Card style={{ maxWidth: 450, padding: "0px 0px", margin: "0 auto" }}>
          <CardContent>
            <form onSubmit={formSubmit}>
              <Grid >
                <Grid xs={12} item>
                  <TextField placeholder='enter shift name' label="ShiftName " name='shift_name' onChange={inputEvent} value={addShiftFormData.shift_name} variant='outlined' sx={{ width: "100%" }} required />
                </Grid>
                <Grid xs={12} item sx={{ mt: 2 }}>
                  <TextField label="Select shift type" name='shift_type' onChange={inputEvent} select value={addShiftFormData.shift_type} variant="outlined" sx={{ width: "100%" }} required
                    SelectProps={{
                      multiple: false
                    }}>
                    <MenuItem value="1">1=Standard</MenuItem>
                    <MenuItem value="2">2=Custom</MenuItem>
                  </TextField>
                </Grid>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <Stack spacing={2}>
                      <Grid sx={{ mt: 2 }}>
                        <DesktopTimePicker
                                label="Start Time"
                                value={addShiftFormData.start}
                                onChange={(handleStartTimeChange)}
                                variant='outlined'
                                sx={{ width: "100%" }}
                                required
                                renderInput={(params) => <TextField {...params} />}
                              />
                        </Grid>
                        <DesktopTimePicker
                                  label="End Time"
                                  value={addShiftFormData.end}
                                  onChange={handleEndTimeChange}
                                  variant='outlined'
                                  sx={{ width: "150%"}}
                                  required
                                  renderInput={(params) => <TextField {...params} />}
                                />

                    </Stack>
                </LocalizationProvider>
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Button type="submit" variant="contained" color="primary" sx={{ width: "100%" }} >Add</Button>
                </Grid>

              </Grid>
            </form>
          </CardContent>
        </Card>
      </Grid>
    </div>
  );
}

export default Addshift;