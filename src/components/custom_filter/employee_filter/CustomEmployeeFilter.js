import React, { useState,useEffect } from 'react';
import axios from 'axios';
import Chip from '@mui/material/Chip';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import './CustomEmployeeFilter.css';

export default function CustomEmployeeFilter() {
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [employeesList,setEmployeesList] = useState([]);

  var employees = [];
  useEffect(() => {
    axios({
      method: 'get',
      url: 'user_list',
      headers: {
        'Authorization': 'Bearer '+localStorage.getItem('token'),
      }
    }
    )
      .then(function (response) {
        if(response.data.user_info){
          response.data.user_info.forEach(element => {
              employees.push({id:element.bio_ref_id,name:element.fname + ' ' + element.lname , sitename:element.site_name})
          }
            );
        }
        else{
          // navigate('/');
        }
        setEmployeesList(employees);
      })
      .catch(error => {
        console.log(error);
          })
    },[])

  const handleOnChange = (event, values) => {
    setSelectedEmployees(values);
  };

  return (
    <Stack spacing={1} sx={{ width: 300, mt: -1, mb: 1 }} >
      <Autocomplete
        multiple
        id="tags-outlined"
        options={employeesList}
        getOptionLabel={(option) => (option && option.name) || ''}
        value={selectedEmployees} // Use the value prop instead of defaultValue
        filterSelectedOptions
        onChange={handleOnChange} // Set the onChange event handler
        renderInput={(params) => (
          <TextField
            className="custom-textfield"
            {...params}
            label="Search Employee"
            placeholder="EMPLOYEE"
          />
        )}
      />
      {/* Display the selected values */}
      {selectedEmployees.map((value, index) => (
        <Chip key={index} label={value.name} />
      ))}
    </Stack>
  );
}