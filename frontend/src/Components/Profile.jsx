// Importa lo stile CSS personalizzato
import "../style/Profile.css";

import React, { useContext, useState, useEffect } from "react";
// Importa i componenti necessari da react-bootstrap
import {
  Alert,
  Col,
  Container,
  Row,
  Spinner,
  Button,
  ProgressBar,
} from "react-bootstrap";
// Importa i componenti per le varie sezioni del profilo utente
import Advised from "./infoProfile/Advised";
import Analyses from "./infoProfile/Analyses";
import Resources from "./infoProfile/Resources";
import Activity from "./infoProfile/Activity";
import Experiences from "./infoProfile/Experiences";
import Skills from "./infoProfile/Skills";

// Importa il componente UpdateProfile
import UpdateProfile from "./UpdateProfile";

import { AuthContext } from "../Context/AuthContext";

function Profile() {
  const { authorLogin, setAuthorLogin } = useContext(AuthContext);
  const { isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  //console.log(authorLogin._id);

  const handleProfileUpdate = (updatedProfile) => {
    setAuthorLogin((prevState) => ({ ...prevState, ...updatedProfile }));
  };

  return (
    <>
      {/* Mostra lo spinner di caricamento se isEnableSpinner è true
      {isEnableSpinner && <div className='text-center mt-5'><Spinner animation='grow' /></div>}
      {/* Mostra un messaggio di errore se isError è true */}
      {/* {isError && <div className='text-center mt-5'><Alert variant='danger'>Error loading...</Alert></div>} */}

      <Container className="pb-2 border-0 content__card content__profile">
        {/* Sezione background del profilo */}
        <Row className="profile__bg">
          <img
            src="https://media.licdn.com/dms/image/C4D16AQH3Fs7tJvTAbg/profile-displaybackgroundimage-shrink_350_1400/0/1625442218069?e=1724284800&v=beta&t=nl44PVgE69kZ53-JtB_5NDes4bVAvNJe84KSTVN8B3o"
            alt="Image background profile"
          />
        </Row>
        {/* Sezione immagine del profilo */}
        <Row className="profile__image">
          <img
            className="image__user"
            src={authorLogin.image}
            alt={authorLogin.name}
          />
        </Row>
        <div className="d-flex justify-content-end ">
          {/* Componente per aggiornare il profilo */}
          {isLoggedIn && authorLogin && (
            <UpdateProfile
              authorLogin={authorLogin}
              onProfileUpdate={handleProfileUpdate}
            />
          )}
          {/* <button className='upgrade__profile p-0'><i className='fa-solid fa-pen'></i></button> */}
        </div>
        <Row className="user__detail">
          <Col xs={12} md={8}>
            <h4 className="name mb-0 justify-content-start mt-3">
              {authorLogin.name} {authorLogin.surname}
            </h4>
            <p className="my-0 occupation">{authorLogin.title}</p>
            <p className="my-0 location text-muted">
              {authorLogin.area} •{" "}
              <span className="connections">Informazioni di contatto</span>
            </p>

            <p className="my-2 connections">5 collegamenti</p>
            <div className="d-column justify-content-start">
              <button className="profile__button open__to__btn mx-3 mt-3">
                Disponibile per
              </button>
              <button variant="outline-primary" className="add__btn mx-3 mt-3">
                Aggiungi sezione profilo
              </button>
              <button
                variant="outline-secondary"
                className="btn__altro mx-3 mt-3"
              >
                Altro
              </button>
            </div>
          </Col>
          <Col xs={12} md={4}>
            <ul>
              <li className="education mb-1">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT9bSdmyPGsBkS5WQ7fjHWoPIcYcHnOUlJ1cQ&s"
                  alt="Logo Epicode"
                  className="mr-2"
                />
                Epicode
              </li>

              <li className="education">
                <img
                  src="https://cdn.stocksnap.io/img-thumbs/960w/woman-developer_HMPNPRBUJ7.jpg"
                  alt="Logo FullStack Web Developer"
                  className="mr-2"
                />
                FullStack Web Developer
              </li>
            </ul>
          </Col>

          <div className="d-flex justify-content-center gap-4 p-4">
            <div className="content__info_1 w-75 p-2">
              <Col>
                <p className="my-0 occupation">Disponibile a lavorare</p>
                <p className="my-0 occupation">Ruoli Developer</p>
                <a className="connections">Mostra dettagli</a>
              </Col>
            </div>
            <div className="content__info_2 w-75 p-2">
              <Col>
                <p className="my-0 occupation">
                  Fai sapere che stai facendo selezione e attrai candidati
                  qualificati
                </p>
                <a className="connections">Inizia</a>
              </Col>
            </div>
          </div>
        </Row>
      </Container>

      {/* Sezione "Consigliato per te" */}
      <Advised />

      {/* Sezione "Analisi" */}
      <Analyses />

      {/* Sezione "Risorse" */}
      <Resources />

      {/* Sezione "Attività" */}
      <Activity />

      {/* Sezione "Esperienze" */}
      <Experiences profile={authorLogin} />

      {/* Sezione "Competenze" */}
      <Skills />
    </>
  );
}

export default Profile;
