import './App.css';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
/*
import '@fortawesome/fontawesome-free/css/all.min.css';*/
import 'bootstrap-icons/font/bootstrap-icons.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OtherProfile from './Pages/OtherProfile';
import NotFound from './Pages/NotFound';
import MyFooter from './Components/MyFooter';


function App() {
  const token = process.env.TOKEN;
  console.log(token)

  return (
    <Router>

      <Navbar />
     

      <Routes>
          <Route 
            path="/" 
            element={<Home />} 
          />
         <Route
            path="/profiles/:_id"
            element={<OtherProfile />}
          />
          <Route
          path='*'
          element={<NotFound/>}
         />
        </Routes>
        <MyFooter></MyFooter>




      </Router>
    
  );
};

export default App;
