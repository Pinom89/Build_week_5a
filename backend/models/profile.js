import { Schema, model} from 'mongoose';
import bcrypt from 'bcrypt';

const experianceSchema  = new Schema(
    {
        role: {
            type: String,
            required: true
        },
        company: {
            type: String,
        },
        startDate: {
            type: Date,
        },
        endDate: {
            type: Date,
        },
        description: {
            type: String,
        },
        area: {
            type: String,
        },
        image: {
            type: String,
        },
    },
    {
        timestamps: true,
        _id: true
    }
)
const profileSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        surname: {
            type: String,
        },
        email: {
            type: String,
            unique: true,
        },
        username: {
            type: String,
            unique: true,
        },
        area: {
            type: String,

        },
        title: {
            type: String,
        },
        bio: {
            type: String,
        },
        image: {
            type: String,
        },
        password: {
            type: String,
            required: true
        },
        googleId: {
            type: String
        },
        experiences: [experianceSchema],

    },
    {
        timestamps: true,
        collection: 'profiles'
    }
)




// Metodo per confrontare le password
profileSchema.methods.comparePassword =  function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
  };
  
  // Middleware per l'hashing della password prima del salvataggio 
  profileSchema.pre("save", async function (next) {
    // Esegui l'hashing solo se la password è stata modifica (o è nuova)
    if (!this.isModified("password")) return next();
  
    try {
      // Genera un salt e hash la password
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      next();
    } 
    catch (error) {
      next(error);
    }
  });
    
  
  
  
  // Esporta il modello 'User' utilizzando il metodo model di Mongoose
  // Il modello 'User' sarà basato sullo schema 'userSchema' definito sopra
  const Profile = model("Profiles", profileSchema);
  export default Profile;