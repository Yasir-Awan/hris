import React from 'react';
// import logo from './logo.svg';
import Home from './mainview/home/Home';
import Login from './forms/login/Login';
// import ScheduleList from './mainview/schedule/ScheduleList';
import Error from './mainview/error/Error';
// import UserList from './mainview/users/UserList';
import './App.css';
import {Route,Routes} from 'react-router-dom';

function App() {
  return (
    <>
    <Routes>
      <Route exact path='/home' element={<Home/>} />
      <Route exact path='/' element={<Login/>} />
      <Route exact path='*' element={<Error/>} />
    </Routes>
    </>
  );
}

export default App;
