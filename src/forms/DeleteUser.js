import React,{useState} from 'react';
import { Button } from '@mui/material';
import { ConstructionOutlined } from '@mui/icons-material';

function DeleteUser(props){
    const id = props.id;
    const deleterow = () => {console.log(id);};
    const closepopup = () => {window.location.reload();};
  return (
    <div className="App">
        <Button onClick={deleterow}>confirm</Button>
        <Button onClick={closepopup}>cancel</Button>
    </div>

  );
}

export default DeleteUser;