import express from "express"; // Importa il pacchetto Express
import cloudinaryUploader from "../config/claudinaryConfig.js";
//import { v2 as cloudinary } from "cloudinary";  // per la cancellazione da cloudinary
import { authMiddleware } from "../middleware/authMiddleware.js";
import Profile from "../models/profile.js";



const router = express.Router(); // Crea un'istanza di Express.Router


router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Estrae il numero di pagina dalla query, default a 1 se non specificato
    const limit = parseInt(req.query.limit) || 12; // Estrae il limite di risultati per pagina, default a 10
    const sort = req.query.sort || "name"; // Determina il campo per l'ordinamento, default a "name"
    const sortDirection = req.query.sortDirection === "desc" ? -1 : 1; // Determina la direzione dell'ordinamento (1 per ascendente, -1 per discendente)
    const skip = (page - 1) * limit; // Calcola quanti documenti saltare per arrivare alla pagina richiesta

      // Esegue la query al database con paginazione, ordinamento e limite
    const profiles = await Profile.find({}) // Trova tutti gli utenti nel database
      .sort({ [sort]: sortDirection }) // Ordina i risultati
      .skip(skip) // Salta i documenti delle pagine precedenti
      .limit(limit); // Limita il numero di risultati

      // Conta il numero totale di utenti nel database
      const total = await Profile.countDocuments();

    res.json({
      profiles, // Array degli utenti per la pagina corrente
      currentPage: page, // Numero della pagina corrente
      totalPages: Math.ceil(total / limit), // Calcola il numero totale di pagine
      totalProfiles: total, // Numero totale di utenti nel database
    }); // Risponde con i dati degli utenti in formato JSON
  } catch (err) {
    res.status(500).json({ message: err.message }); // Gestisce errori e risponde con un messaggio di errore
  }
});
// Rotta per creare un nuovo Post
router.post("/", cloudinaryUploader.single("image"), async (req, res) => {
  // Crea un nuovo utente con i dati dal corpo della richiesta
    try { 
      const profile =  req.body;
      if (req.file) {
        profile.image = req.file.path; // Cloudinary restituirà direttamente il suo url
      }
      const newProfile = new Profile(profile); // Crea un nuovo utente con i dati forniti
      await newProfile.save(); // Salva il nuovo utente nel database
  
  
      res.status(201).json(newProfile); // Risponde con i dati del nuovo utente e uno status 201 (Created)
    } catch (err) {
      res.status(400).json({ message: err.message }); // Gestisce errori di validazione e risponde con un messaggio di errore
    }
  });
  

 // NEW! Proteggi le altre rotte con il middleware di autenticazione
   router.use(authMiddleware);


// Rotta per ottenere un singolo Post
router.get("/:id", async (req, res) => {
  try {
    const profiles = await Profile.findById(req.params.id); // Trova un utente per ID
    if (!profiles) {
      return res.status(404).json({ message:"Profilo non trovato" }); // Se l'utente non esiste, risponde con un errore 404
    }
    res.json(profiles); // Risponde con i dati dell'utente in formato JSON
  } catch (err) {
    res.status(500).json({ message: err.message }); // Gestisce errori e risponde con un messaggio di errore
  }
});





// Rotta per aggiornare un il profilo
router.patch("/:id", cloudinaryUploader.single("image"), async (req, res) => {
  try {
    const updateData = {...req.body};
    if (req.file) {
      updateData.image = req.file.path;
    }

    const upgradeProfile = await Profile.findByIdAndUpdate(
      req.params.id, 
      updateData, 
       {
      new: true, // Restituisce il documento aggiornato anziché quello vecchio
      });
    if (!upgradeProfile) {
      // Se il blog post non viene trovato, invia una risposta 404
      return res.status(404).json({ message: "Profilo non trovato" });
    }
    res.json(upgradeProfile); // Risponde con i dati dell'utente aggiornato in formato JSON
  } catch (err) {
    res.status(400).json({ message: err.message }); // Gestisce errori di validazione e risponde con un messaggio di errore
  }
});

router.patch("/:id/image", cloudinaryUploader.single("image"), async (req, res) => {
  try {
      if (!req.file) {
      return res.status(400).json({ message: "Nessun file caricato" });
      }
      const profile = await Profile.findById(req.params.id);
      if (!profile) {
      return res.status(404).json({ message: "Profilo non trovato" });
      }
      profile.image = req.file.path;
  await profile.save();
  

  res.status(200).json({ message: "Immagine profilo aggiornata con successo", profile });
  } catch (err) {
      res.status(400).json({ message: err.message }); // Gestisce errori di validazione e risponde con un messaggio di errore
  }
});

export default router;