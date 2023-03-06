import React from 'react';
import { Button } from '@mui/material';

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