import React,{useState} from 'react';

function DeleteUser(props){
    const [addUserFormData, setaddUserFormData] = useState(props);
    const formdelete = (event) => {
        event.preventDefault();
        console.log(addUserFormData)
        }
  return (
    console.log(addUserFormData)

  );
}

export default DeleteUser;
