import React, { useState, useEffect } from 'react';
import { TextField, Button } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function EditUser() {
  // Use the useParams hook to get the ID from the URL
  let { id } = useParams();

  // Use the useState hook to store the user data
  const [user, setUser] = useState({});

  // Use the useEffect hook to fetch the user data from the database
  useEffect(() => {
    axios.get(`http://localhost:3000/users/${id}`)
      .then(response => setUser(response.data))
      .catch(error => console.log(error));
  }, [id]);

  return (
    <div>
      <TextField label="Name" value={user.name} />
      <TextField label="Email" value={user.email} />
      <TextField label="Age" value={user.age} />
      <Button variant="contained">Save</Button>
    </div>
  );
}

export default EditUser;
