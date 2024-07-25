import express from "express"; // Importa il pacchetto Express
import cloudinaryUploader from "../config/claudinaryConfig.js";
//import { v2 as cloudinary } from "cloudinary";  // per la cancellazione da cloudinary
import Profile from "../models/profile.js";
// import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router(); // Crea un'istanza di Express.Router

// mostra tutte le esperienze di un singolo utente
router.get("/:id/experiences", async (req, res) => {
        try {
            const profile = await Profile.findById(req.params.id); // Trova un utente per ID
            if (!profile) {
                return res.status(404).json({ message:"Esperienza non trovato" }); // Se l'utente non esiste, risponde con un errore 404
            }
            res.json(profile.experiences); // Risponde con i dati dell'utente in formato JSON
        }  catch (err) {
    res.status(500).json({ message: err.message }); // Gestisce errori e risponde con un messaggio di errore
    }
});

// rotta per visualizzare esperienza dell'utente loggato    
router.get("/me/experiences", async (req, res) => {
    try {   
        if (!req.profile) { 
            return res.status(404).json({ message: "Profilo non trovato" });
        }
        const profileData = req.profile.toObject();
        if (!profileData.experiences || profileData.experiences.length === 0) {
            return res.status(404).json({ message: "Nessuna esperienza trovata" });
        }
        res.json(profileData.experiences);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});

// rotta per creare una nuova esperienza
router.post("/:id/experiences", cloudinaryUploader.single("image"), async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: "Profilo non trovato" });
        }
        const experience = req.body;
        if (req.file) {
            experience.image = req.file.path;
        }
        profile.experiences.push(experience);
        await profile.save();
        res.json(profile);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

//  rotta per modificare l'immagine dell'esperienza
router.patch("/:id/experiences/:experienceId/image", cloudinaryUploader.single("image"), async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: "Profilo non trovato" });
        }
        const experience = profile.experiences.id(req.params.experienceId);
        if (!experience) {
            return res.status(404).json({ message: "Esperienza non trovata" });
        }
        if (req.file) {
            experience.image = req.file.path;
        }
        await profile.save();
        res.json(profile);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

// rotta per modificare l'esperienza del singolo profilo
router.patch("/:id/experiences/:experienceId",  cloudinaryUploader.single("image"), async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: "Profilo non trovato" });
        }
        const experience = profile.experiences.id(req.params.experienceId);
        if (!experience) {
            return res.status(404).json({ message: "Esperienza non trovata" });
        }
        if (req.file) {
            experience.image = req.file.path;
        }
        if (req.body) {
            experience.role = req.body.role;
            experience.company = req.body.company;
            experience.startDate = req.body.startDate;
            experience.endDate = req.body.endDate;
            experience.area = req.body.area;
            experience.description = req.body.description;
        }
        await profile.save();
        res.json(profile)
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})

//  rotta per cancellare l'esperienza del singolo profilo
router.delete("/:id/experiences/:experienceId", async (req, res) => {
    try {
        const profile = await Profile.findById(req.params.id);
        if (!profile) {
            return res.status(404).json({ message: "Profilo non trovato" });
        }
        const experience = profile.experiences.id(req.params.experienceId);
        if (!experience) {
            return res.status(404).json({ message: "Esperienza non trovata" });
        }
        profile.experiences.pull({_id: req.params.experienceId});
        await profile.save();
        res.json({profile, message: "Esperienza cancellata correttamente"});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
})


export default router