import React from 'react';
import Home from './mainview/home/Home';
import Login from './forms/login/Login';
import Error from './mainview/error/Error';
import Profile from './mainview/profile/Profile';
import './App.css';
import {Route,Routes,Navigate} from 'react-router-dom';

function App(props) {
  return (
    <>
    <Routes>
    <Route
        path="/home"
        element={<Navigate to="/home/schedules" replace />}
    />
      <Route exact path='/home/:page?' element={<Home {...props}/>} />
      <Route exact path='/' element={<Login/>} />
      <Route exact path='/profile' element={<Profile/>} />
      <Route exact path='*' element={<Error/>} />
    </Routes>
    </>
  );
}

export default App;
