import express from 'express';
import Profile from '../models/profile.js';
import { generateJWT } from '../utils/jwt.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import passport from '../config/passportConfig.js';
import "dotenv/config";


const router = express.Router();
// POST /login => restituisce token di accesso
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const profile = await Profile.findOne({ email });

    if (!profile) {
      return res.status(401).json({ message: 'Credenziali non valide...' });
    }

    const isMatch = await profile.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Credenziali non trovate...' });
    }

    const token = await generateJWT({ id: profile._id });
    res.json({ token, message: 'Login effettuato con successo' });
  } catch (error) {
    console.error('Errore nel login:', error);
    res.status(500).json({ message: 'Errore nel server' });
  }
});

// GET /me => restituisce il profilo collegato al token di accesso
router.get('/me', authMiddleware, (req, res) => {
  try {
    const profileData = req.profile.toObject();
    delete profileData.password;
    res.json(profileData);
  } catch (error) {
    console.error('Errore nel recupero dell\'autore:', error);
    res.status(500).json({ message: 'Errore nel server' });
  }
});


// Definisci l'URL del frontend usando una variabile d'ambiente
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173/';


router.get(
  "/google/callback",
  // Passport tenta di autenticare l'utente con le credenziali Google
  passport.authenticate("google", { failureRedirect: "/" }),
  // Se l'autenticazione fallisce, l'utente viene reindirizzato alla pagina di login
  async (req, res) => {
    try {
      // A questo punto, l'utente è autenticato con successo
      // req.user contiene i dati dell'utente forniti da Passport

      // Genera un JWT (JSON Web Token) per l'utente autenticato
      // Usiamo l'ID dell'utente dal database come payload del token
      const token = await generateJWT({ id: req.user._id });

      // Reindirizza l'utente al frontend, passando il token come parametro URL
      // Il frontend può quindi salvare questo token e usarlo per le richieste autenticate
      res.redirect(`http://localhost:5173/?token=${token}`);
    } catch (error) {
      // Se c'è un errore nella generazione del token, lo logghiamo
      console.error("Errore nella generazione del token:", error);
      // E reindirizziamo l'utente alla pagina di login con un messaggio di errore
      res.redirect("/?error=auth_failed");
    }
  }
);

export default router;