import React, { useState } from 'react';
import { Button, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import fetchWithAuth from '../services/fetchWithAuth';

export default function Register() {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL ||"http://localhost:5000";
  const PROFILE_URL = "/profile/";

  const [register, setRegister] = useState({
    name: '',
    surname: '',
    email: '',
    username: '',
    password: ''
  });

  const handleRegisterInputChange = (e) => {
    const { name, value } = e.target;
    setRegister(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
  
    console.log('Dati inviati:', register);
    alert("Sono pronto a postare i dati");

    try {
      const result = await fetchWithAuth(API + PROFILE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(register),
      });
      console.log('Risultato:', result);
      alert("Registrazione completata con successo!");
      navigate('/');
    } catch (error) {
      console.error('Errore durante la registrazione:', error);
      alert("Si è verificato un errore durante la registrazione. Riprova.");
    }
  };

  const handleReset = () => {
    setRegister({
      name: "",
      surname: "",
      email: "",
      username: "",
      password: ""
    });
  };

  return (
    <Container>
  <Row>
    <Col>
      <h2 className='mt-3'>Registra il tuo utente</h2>
      <h5>
        Sei registrato accedi alla piattaforma{" "}
        <Link style={{ cursor: "pointer", color: "blue" }} to="/">
          qui
        </Link>
      </h5>
      <Form onSubmit={handleRegisterSubmit}>
        <InputGroup className="mb-3 mt-5">
          <Form.Control
            placeholder="Nome"
            name="name"
            aria-label="Nome"
            aria-describedby="basic-addon1"
            type='text'
            required
            value={register.name}
            onChange={handleRegisterInputChange}
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Cognome"
            name="surname"
            aria-label="Cognome"
            aria-describedby="basic-addon2"
            type='text'
            required
            value={register.surname}
            onChange={handleRegisterInputChange}
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Email"
            name="email"
            aria-label="Email"
            aria-describedby="basic-addon2"
            type='email'
            required
            value={register.email}
            onChange={handleRegisterInputChange}
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Username"
            name="username"
            aria-label="Username"
            aria-describedby="basic-addon2"
            type='text'
            required
            value={register.username}
            onChange={handleRegisterInputChange}
          />
        </InputGroup>

        <InputGroup className="mb-3">
          <Form.Control
            placeholder="Password"
            name="password"
            aria-label="password"
            aria-describedby="basic-addon2"
            type='password'
            required
            onChange={handleRegisterInputChange}
          />
        </InputGroup>

        <Button
          variant="dark"
          type="submit"
           className="add__btn mx-3 mt-3"
        >
          Crea Nuovo Utente
        </Button>
        <Button
          variant="outline-dark"
          onClick={() => handleReset({
            name: "",
            surname: "",
            email: "",
            username: "",
            password: ""
          })}
          className="btn__altro mx-3 mt-3"
        > 
          Resetta
        </Button>
      </Form>
    </Col>
  </Row>
</Container>
  );
}