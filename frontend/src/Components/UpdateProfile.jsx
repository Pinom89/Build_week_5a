// Importa i componenti Form e Modal da react-bootstrap
import { Form, Modal } from "react-bootstrap";
// Importa le funzioni useState e useEffect da React
import { useState, useEffect } from "react";
import fetchWithAuth from "../services/fetchWithAuth";
function UpdateProfile({ authorLogin, onProfileUpdate }) {
  // Stampa il profilo attuale nella console
  console.log("Il mio profilo: ", authorLogin);

  const API = import.meta.env.VITE_API_URL ||"http://localhost:5000";
  if (!authorLogin) {
    return null;
  }

  // Recupera il token di autorizzazione dalle variabili d'ambiente
  // const Token = process.env.TOKEN;
  // URL dell'API per aggiornare il profilo
  const url = `${API}/profile/${authorLogin._id}`;
  // Definizione degli stati locali
  const [show, setShow] = useState(false); // Stato per controllare la visualizzazione del modal
  const [formDataProfile, setFormDataProfile] = useState({
    name: "",
    surname: "",
    email: "",
    username: "",
    area: "",
    title: "",
    bio: "",
  
  });
  const [image, setImage] = useState(null);

  // Effettua il popolamento dei dati del modulo quando il profilo cambia
  useEffect(() => {
    if (authorLogin) {
      setFormDataProfile({
        name: authorLogin.name || "",
        surname: authorLogin.surname || "",
        email: authorLogin.email || "",
        username: authorLogin.username || "",
        area: authorLogin.area || "",
        title: authorLogin.title || "",
        bio: authorLogin.bio || "",
      });
    }
  }, [authorLogin]);





  // Funzione per chiudere il modal
  const handleClose = () => setShow(false);
  // Funzione per aprire il modal
  const handleShow = () => setShow(true);

  // Gestisce i cambiamenti nei campi del modulo
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setFormDataProfile({
      ...formDataProfile,
      [name]: value,
    });
  };


  // Gestisce i cambiamenti dell'immagine
  const handleFileChange = (e) => {
    setImage(e.target.files[0])
  };
  // Gestisce l'aggiornamento del profilo inviando i dati al server

  const handleUpdateProfile = async (e) => {
    e.preventDefault(); // Evita l'invio del prevent
  // Crea un oggetto FormData per inviare i dati del patch al server.
    const formData = new FormData();
    formData.append('name', formDataProfile.name);
    formData.append('surname', formDataProfile.surname);
    formData.append('username', formDataProfile.username);
    formData.append('area', formDataProfile.area);
    formData.append('title', formDataProfile.title);
    formData.append('bio', formDataProfile.bio);
   
  
    if (image) {
      formData.append('image', image);
    }
  

    if (!url) {
      console.error("URL non valido per l'aggiornamento del profilo");
      return;
    }
    try {
      const updatedProfile = await fetchWithAuth(url, {
        method: "PATCH",    
        body: formData,
      });

      onProfileUpdate(updatedProfile); // Chiamata alla funzione di callback
      // console.log(data);

      setFormDataProfile(updatedProfile);
    } catch (error) {
      console.error("Errore durante l'aggiornamento del profilo:", error);
      // Qui puoi aggiungere la gestione dell'errore, come mostrare un messaggio all'utente
    } finally {
      handleClose(); // Chiude il modal
    }
  };

  return (
    <>
      {/* Bottone per aprire il modal */}
      <button
        variant="primary"
        className="upgrade__profile p-0"
        onClick={handleShow}
      >
        <i className="fa-solid fa-pen"></i>
      </button>

      {/* Modal per aggiornare il profilo */}
      <Modal size="lg" show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Aggiorna Profilo Utente</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Campo Nome */}
            <Form.Group className="mb-3">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={formDataProfile.name}
                onChange={handleProfileChange}
                autoFocus
              />
            </Form.Group>
            {/* Campo Cognome */}
            <Form.Group className="mb-3">
              <Form.Label>Cognome</Form.Label>
              <Form.Control
                type="text"
                name="surname"
                value={formDataProfile.surname}
                onChange={handleProfileChange}
              />
            </Form.Group>
            {/* Campo Email */}
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formDataProfile.email}
                onChange={handleProfileChange}
              />
            </Form.Group>
            {/* Campo Username */}
            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formDataProfile.username}
                onChange={handleProfileChange}
              />
            </Form.Group>
            {/* Campo Luogo */}
            <Form.Group className="mb-3">
              <Form.Label>Luogo</Form.Label>
              <Form.Control
                type="text"
                name="area"
                value={formDataProfile.area}
                onChange={handleProfileChange}
              />
            </Form.Group>
            {/* Campo Titolo */}
            <Form.Group className="mb-3">
              <Form.Label>Titolo</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formDataProfile.title}
                onChange={handleProfileChange}
              />
            </Form.Group>
            {/* Campo Biografia */}
            <Form.Group className="mb-3">
              <Form.Label>Biografia</Form.Label>
              <Form.Control
                type="text"
                name="bio"
                value={formDataProfile.bio}
                onChange={handleProfileChange}
              />
            </Form.Group>
            {/* Campo Immagine Profilo */}
            <Form.Group className="mb-3">
              <Form.Label>Immagine profilo</Form.Label>
              <Form.Control
                type="file"
                name="image"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {/* Bottone per chiudere il modal */}
          <button
            variant="secondary"
            className="btn__altro"
            onClick={handleClose}
          >
            Chiudi
          </button>
          {/* Bottone per aggiornare il profilo */}
          <button
            variant="outline-primary"
            className="add__btn"
            onClick={handleUpdateProfile}
          >
            Aggiorna Profilo
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default UpdateProfile;
