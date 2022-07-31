import mongoose from "mongoose";


const PacienteSchema = mongoose.Schema({
    nombre :{
        type: String,
        required: true,
    },
    propietario:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true
    },
    fecha:{
        type: Date,
        required: true,
        default: Date.now()
    },
    sintomas:{
        type: String,
        required: true,
    },
    veterinario :{
        type: mongoose.Schema.Types.ObjectId,  // para vincular al veterinario con el numero de id del mismo
        ref: "Veterinario",
    },
},{
    timestamps: true
})

const Paciente = mongoose.model("Paciente" , PacienteSchema);

export default Paciente; 