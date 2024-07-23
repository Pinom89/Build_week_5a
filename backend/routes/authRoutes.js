import express from 'express';
import Profile from '../models/profile.js';
import { generateJWT } from '../utils/jwt.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
//import passport from '../config/passportConfig.js';


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