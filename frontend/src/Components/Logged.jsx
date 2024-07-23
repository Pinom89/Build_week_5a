import React, { useContext } from 'react'
import {  useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchWithAuth from '../services/fetchWithAuth';
import { Image, Button } from 'react-bootstrap';
import './logged.css';
import {AuthContext} from "../Context/AuthContext"



export default function Logged() {

  const { authorLogin, setAuthorLogin } = useContext(AuthContext);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const navigate = useNavigate();


    useEffect(() => {
        // Controlla se esiste un token nel localStorage
        const checkLoginStatus = async () => {
          const token = localStorage.getItem('token');
          setIsLoggedIn(!!token);
          console.log(isLoggedIn);
        };
    
        // Controlla lo stato di login all'avvio
        checkLoginStatus();
    
        // Aggiungi un event listener per controllare lo stato di login
        window.addEventListener('storage', checkLoginStatus);

       
       

    
        // Rimuovi l'event listener quando il componente viene smontato
        return () => {
          window.removeEventListener('storage', checkLoginStatus);
        };
      }, [isLoggedIn, navigate]);

      const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
        setIsLoggedIn(false);
        window.dispatchEvent(new Event('storage'));
      };
      

      useEffect(() => {
       
        const fetchAuthor = async () => {
          try {
            const userData = await fetchWithAuth('http://localhost:5000/auth/me');
            setAuthorLogin(userData);
            console.log(userData);
      
          } catch (error) {
            console.error('Errore nel recupero dei dati utente:', error);
            navigate('/login');
          }}
           
          if (isLoggedIn) {
            fetchAuthor();
          }
          }, [isLoggedIn, navigate]);

  return (
    <div className='d-column justify-content-center align-items-center'>
      <h5 style={{color:'white'}}>
      {isLoggedIn ? `Benvenuto ${authorLogin.nome}` : ''}
    

     
    </h5>
      <div className='d-flex justify-content-center align-items-center gap-3'>
          {isLoggedIn ? (<Image src={authorLogin.avatar} roundedCircle className='imgprofile' />) : (<Image src="https://plus.unsplash.com/premium_photo-1677252438425-e4125f74fbbe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D" roundedCircle className='imgprofile' />) }
      
        <Button 
        variant= {isLoggedIn ? 'outline-danger' : 'outline-secondary'}
        onClick={() => isLoggedIn ? handleLogout() : navigate('/')}
        >
          {isLoggedIn ? 'Logout' : 'Login'}
        </Button>
      </div>
    </div>
  )
}