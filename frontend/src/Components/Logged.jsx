import React, { useContext } from 'react'
import {  useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import fetchWithAuth from '../services/fetchWithAuth';
import { Image, Button, NavLink, NavDropdown } from 'react-bootstrap';
import './logged.css';
import {AuthContext} from "../Context/AuthContext"


export default function Logged() {

  const { authorLogin, setAuthorLogin } = useContext(AuthContext);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);

  const navigate = useNavigate();

  useEffect(() => {
    // Funzione per controllare se l'utente è loggato basandosi sulla presenza del token
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          // Se il token è presente, l'utente è considerato loggato
          setIsLoggedIn(true);
        } catch (error) {
          // Se c'è un errore con il token, rimuovilo e considera l'utente come non loggato
          console.error('Token non valido', error);
          localStorage.removeItem('token');
          setIsLoggedIn(false);
        }
      } else {
        // Se il token non è presente, l'utente non è loggato
        setIsLoggedIn(false);
      }
    };

    // Verifica lo stato di login all'avvio
    checkLoginStatus();
    
    // Aggiungi eventi per rilevare modifiche nel localStorage e nello stato di login
    window.addEventListener('storage', checkLoginStatus);
    window.addEventListener('loginStateChange', checkLoginStatus);

    // Rimuovi gli eventi quando il componente viene smontato per evitare perdite di memoria
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      window.removeEventListener('loginStateChange', checkLoginStatus);
    };
  }, [setIsLoggedIn]);

  useEffect(() => {
    // Funzione per recuperare i dati dell'autore loggato
    const fetchAuthor = async () => {
      try {
        // Richiedi i dati dell'autore utilizzando il token di autenticazione
        const userData = await fetchWithAuth('http://localhost:5000/auth/me');
        setAuthorLogin(userData); // Aggiorna il contesto dell'autore con i dati ricevuti
      } catch (error) {
        // Se c'è un errore nel recupero dei dati, mostra un errore e reindirizza alla pagina di login
        console.error('Errore nel recupero dei dati utente:', error);
        navigate('/login'); // Redirige l'utente alla pagina di login in caso di errore
      }
    };

    // Recupera i dati dell'autore solo se l'utente è loggato
    if (isLoggedIn) {
      fetchAuthor();
    }
  }, [isLoggedIn, navigate, setAuthorLogin]);

  // Funzione per gestire il logout dell'utente
  const handleLogout = () => {
    localStorage.removeItem('token'); // Rimuove il token di autenticazione dal localStorage
    setIsLoggedIn(false); // Aggiorna lo stato di login a falso
    navigate('/'); // Reindirizza alla homepage
    window.dispatchEvent(new Event('storage')); // Notifica ad altri ascoltatori che il logout è avvenuto
  };


  return (
    <div className='d-column justify-content-center align-items-center'>
      <div className='d-flex justify-content-center align-items-center gap-3'>
          {/* {isLoggedIn ? (<Image src={authorLogin.avatar} roundedCircle className='imgprofile' />) : (<Image src="https://plus.unsplash.com/premium_photo-1677252438425-e4125f74fbbe?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dXNlciUyMHByb2ZpbGV8ZW58MHx8MHx8fDA%3D" roundedCircle className='imgprofile' />) } */}
      
        <NavDropdown.Item  
        variant= {isLoggedIn ? 'outline-danger' : 'outline-secondary'}
        onClick={() => isLoggedIn ? handleLogout() : navigate('/')}
        >
          {isLoggedIn ? 'Logout' : 'Login'}
        </NavDropdown.Item>
      </div>
    </div>
  )
}