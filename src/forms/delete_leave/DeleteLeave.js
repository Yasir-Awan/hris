import React from 'react';
import { Button } from '@mui/material';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import {useNavigate} from 'react-router-dom';

function DeleteLeave(props){
    const navigate = useNavigate();
    const deleterow = () => {
        let sendingData ;
        if(localStorage.getItem('role')==='3'){
            sendingData = {
                user_bio_id : props.DeleteData.emp_id,
                leave_id : props.DeleteData.leave_id,
                leave_type: props.DeleteData.leave_type,
                start_date: props.DeleteData.leave_start,
                end_date: props.DeleteData.leave_end,
                leave_status: props.DeleteData.leave_status,
                leave_reason: props.DeleteData.leave_reason
                }
        }
        if(localStorage.getItem('role')!=='3'){
            sendingData = {
                user_bio_id : localStorage.getItem('bio_id'),
                leave_id : props.DeleteData.leave_id,
                leave_type: props.DeleteData.leave_type,
                start_date: props.DeleteData.leave_start,
                end_date: props.DeleteData.leave_end,
                leave_status: props.DeleteData.leave_status,
                leave_reason: props.DeleteData.leave_reason
                }
        }
    
        axios({
                    method: 'post',
                    url: 'delete_leave',
                    headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
                    data: sendingData,
                })
                .then(
                    function (response) {
                        if(response.data.status==='200'){
                                        toast.success('Leave Deleted', {
                                                        position:'top-right',
                                                        autoClose:1000,
                                                        onClose: () => {
                                                            props.refreshList();
                                                        }
                                                    });
                        }else{
                                        toast.success('leave not added', {
                                            position:'top-right',
                                            autoClose:1000,
                                            onClose: () => navigate('/home')
                                        });
                        }
                    }
                )
                .catch(error => console.error(error));
    };
    const closepopup = () => {props.refreshList();};
  return (
    <>
    <div className="App" >
        <Button sx={{ width: '200px' }} onClick={deleterow}>confirm</Button>
        <Button sx={{ width: '200px' }} onClick={closepopup}>cancel</Button>
    </div>
    <ToastContainer/>
    </>
  );
}

export default DeleteLeave;