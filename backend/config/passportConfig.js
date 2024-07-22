import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import {Strategy as GitHubStrategy} from "passport-github2" 
import User from "../models/User.js"

// Configuro la strategia di autenticazione Google
passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                //inserisco URL di reindirizzamento dopo autenticazione
            callbackURL: "/auth/google/callback",
            scope: ['profile', 'email'] // specifica le informazioni che richiediamo a Google (profilo e email)
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Cerco esistenza dell'user con ID Google
                let user = await User.findOne({ googleId: profile.id });
                // imposto condizione se l'user Google esiste
                if (!user) {
                    user = new User( {
                        googleId: profile.id, // id univoco fornito da Google
                        nome: profile.name.givenName, // Nome dell'utente
                        cognome: profile.name.familyName, //Cognome dell'utente
                        email: profile.emails[0].value, // Email dell'utente
                        datadinascita: null,// Data di nascita dell'utente
                        avatar: profile.photos[0].value, // Immagine dell'utente
                        
                    })
                        
                    // Salvo il nuovo utente nel DB
                    await user.save();
                }
                
                    // Passiamo l'autore al middleware di Passport
                    // Il primo argomento null indica che non ci sono errori
                    done(null, user);
                     } catch (error) {  
                    // Se si verifica un errore, lo passiamo a Passport
                    done(error, null);
                }
            }
        )
    )

// Serializzazione dell'utente per la sessione
// Questa funzione determina quali dati dell'utente devono essere memorizzati nella sessione
passport.serializeUser((user, done) => {
    // Memorizziamo solo l'ID dell'utente nella sessione
    done(null, user.id);
  });

// Deserializzazione dell'utente per la sessione
// Questa funzione viene usata per recuperare l'intero oggetto utente basandosi sull'ID memorizzato
passport.deserializeUser(async(id, done) => {
    try {
        // Cerchiamo l'utente nel database usando l'ID 
        let user = await User.findById(id);
        // Passiamo l'utente al middleware di Passport
        done(null, user);
    } catch (error) {
        // Se si verifica un errore, lo passiamo a Passport
        done(error, null);
    }
});



passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: '/auth/github/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ githubId: profile.id });
  
          if (!user) {
            const [nome, ...congnomeParts] = (profile.displayName || profile.username || '').split(' ');
            const cognome = cognomeParts.join(' ');
  
            let email;
            if (profile.emails && profile.emails.length > 0) {
              email = profile.emails.find((e) => e.primary || e.verified)?.value;
              if (!email) 
                email = profile.emails[0].value;
            }
  
            if (!email) {
              email = `${profile.id}@github.example.com`;
              console.log(`Email non disponibile per utente ${profile.id} - usiamo mail di fallback`);
            }
  
            author = new Author({
              githubId: profile.id,
              nome: nome || 'Github User',
              cognome: cognome,
              email: email,
            });
  
            await user.save();
          }
  
          done(null, user);
        } catch (error) {
          done(error, null);
        }
      }
    )
  );

//////////////////////////////////////////////////////////
/*passport.use(
    new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: "/auth/github/callback",

    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ githubId: profile.id });
            if (!user) {
              const [nome, ...cognomeParts] = (profile.displayName || profile.username || "").split(" ");
              const cognome = cognomeParts.join(" ");
                }
             // Gestiamo la mail
             let email;
             if (profile.emails && profile.emails.length>0) {
                email = profile.emails.find((e) =>e.primary || e.verified)?.value;
                // se non trovi profile.emails.find(e =>e.primary || e.verified, email diventa undefinded
          
                if (!email) {
                    email =  profile.emails[0].value;
                }
                if (!email) {
                    email = `${profile.id}@github.example.com`;
                    console.log(`Email non disponibile per utente ${profile.id} -usiamo mail di fallback`);
                }
                
                user = new User({
                    githubId: profile.id,
                    nome: nome || "Github User",
                    cognome: cognome,
                    email: email,
             }
            );
                await user.save();
            }
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    })
) */


export default passport