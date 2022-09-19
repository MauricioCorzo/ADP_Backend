import Paciente from "../models/Paciente.js"


const agregarPaciente = async (req,res) => {
    // console.log(req.body)
     const paciente = new Paciente(req.body) // nos genera un paciente con los datos que le mandamos el metodo POST, y se genera un id gracias a mongoDB
    // console.log(paciente)
    paciente.veterinario = req.veterinario._id 

    try {
        // console.log(req.veterinario._id)  // cuando se autentica lo almacena en el request como . veterinario (fijarse en el middelweare la funcion autenticadora)
        // console.log(paciente)
        const pacienteGuardado = await paciente.save()
        res.json(pacienteGuardado)
    } catch (error) {
        console.log(error)
    }
}

const obtenerPacientes = async (req,res) => {
    const pacientes = await Paciente.find().where("veterinario").equals(req.veterinario) // casi igual a la forma de sequelize

    res.json(pacientes)
}

const obtenerPaciente = async (req,res) => {
    const {id} = req.params
    const paciente = await Paciente.findById(id)
    // console.log(paciente)
    if(!paciente){
        return res.status(404).json({msg: "No Encontrado"})
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){  // los pasamos a strings porque son objetos con propiedades iguales pero los objetos siempre van a ser distintos
       return res.json({msg: "Accion no valida"})
    }
    if(paciente){
        res.json(paciente)
    } 
}

const actualizarPaciente = async (req,res) => {
    const {id} = req.params
    const paciente = await Paciente.findById(id)
    // console.log(paciente)
    if(!paciente){
        return res.status(404).json({msg: "No Encontrado"})
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){  // los pasamos a strings porque son objetos con propiedades iguales pero los objetos siempre van a ser distintos
       return res.json({msg: "Accion no valida"})
    }
    if(paciente){
       // Actualizar paciente y le agregamos el or (||) para que si no cambia ciertos campos, se queden con la info que ya tenian
       paciente.nombre = req.body.nombre || paciente.nombre
       paciente.propietario = req.body.propietario || paciente.propietario
       paciente.email = req.body.email || paciente.email
       paciente.fecha = req.body.fecha || paciente.fecha
       paciente.sintomas = req.body.sintomas || paciente.sintomas

       try {
        const pacienteActualizado = await paciente.save()
        res.json(pacienteActualizado)
       } catch (error) {
        console.log(error)
       }
    } 
}

const eliminarPaciente = async (req,res) => {
    const {id} = req.params
    const paciente = await Paciente.findById(id)
    
    if(!paciente){
        return res.status(404).json({msg: "No Encontrado"})
    }

    if(paciente.veterinario._id.toString() !== req.veterinario._id.toString()){  // los pasamos a strings porque son objetos con propiedades iguales pero los objetos siempre van a ser distintos
       return res.json({msg: "Accion no valida"})
    }
    if(paciente){
        try {
            await paciente.deleteOne()
            res.json({msg: "Paciente Eliminado"})
        } catch (error) {
            console.log(error)
        }
    }
}

export {
    agregarPaciente,
    obtenerPacientes,
    obtenerPaciente,
    actualizarPaciente,
    eliminarPaciente,
}
