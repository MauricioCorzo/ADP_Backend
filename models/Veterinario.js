import mongoose from "mongoose";
import bcrypt from "bcrypt"  // dependencia de hasheo de passwords
import generarId from "../helpers/generarId.js"


const veterinarioSchema = mongoose.Schema({   // mongoDB le agrega un id  a cada veterinario por eso no es necesario ponerlo aqui
    nombre :{
        type: String,
        required : true,
        trim : true
    },

    password : {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },

    telefono: {
        type: String,
        default: null,
        trim: true
    },
    web: {
        type: String,
        default: null,
    },
    token: {
        type: String,
        default: generarId()
    },
    confirmado: {
        type: Boolean,
        default: false
    }

});

veterinarioSchema.pre("save", async function (next){     // antes de almacenar en la base de datos. No usamos arrow function pq necesitamos el this
     if(!this.isModified("password")){                   // es para que un password que este hasheado no lo vuelva a hashear
        next()                                           // midellwear. cuando termina va al siguiente
     }           
    let salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
}) 

veterinarioSchema.methods.comprobarPassword = async function(passwordFormulario){ // con .methods le inyecto un metodo al modelo de Veterinario
    return await bcrypt.compare(passwordFormulario, this.password)                    // Comprueba el password que le pasamos con el password hasheado que tenemos en la base de datos
}


const Veterinario = mongoose.model("Veterinario" , veterinarioSchema);

export default Veterinario;