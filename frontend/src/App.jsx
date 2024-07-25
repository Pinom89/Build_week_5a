import './App.css';
import Navbar from './Components/Navbar';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
/*
import '@fortawesome/fontawesome-free/css/all.min.css';*/
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OtherProfile from './Pages/OtherProfile';
import NotFound from './Pages/NotFound';
import MyFooter from './Components/MyFooter';
import Login from './Pages/Login';
import {AuthProvider} from './Context/AuthProvider'
import Register from './Pages/Register';
import Home from './Pages/Home';

function App() {
  // const token = process.env.TOKEN;
  // console.log(token)

  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
            <Route 
              path="/" 
              element={<Login />} 
            />
          <Route
              path="/profile/:_id"
              element={<OtherProfile />}
            />
            <Route
            path='*'
            element={<NotFound/>}
          />
           <Route
            path="/register"
            element={<Register />}
          />
          <Route 
           path="/home" 
           element={<Home />} 
          />
          </Routes>
        </Router>
        <MyFooter/>
    </AuthProvider>
  );
} 

export default App