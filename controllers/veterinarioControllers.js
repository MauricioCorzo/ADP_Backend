// carpeta que se usa para definir constantes para desp pasarselas a las rutas y que el archivo sea mas limpio

import Veterinario from "../models/Veterinario.js" 
import generarJWT from "../helpers/generarJwebToken.js"
import generarId from "../helpers/generarId.js"
import emailRegistro from "../helpers/emailRegistro.js"
import emailOlvidePassword from "../helpers/emailOlvidePassword.js"


const registrar = async (req,res) => {
    // console.log(req.body)
     const { email , nombre} = req.body // extraemos la la propiedad del objeto json que necesitamos del request.body porque nose llega desde ahi


    // Prevenir usuarios duplicados
    const existeUsuario = await Veterinario.findOne({email}) // consultamos la base de datos si existe el usuario. Se usa el await por si es mu grande la base de datos

    if(existeUsuario){
        const error = new Error("Usuario ya registrado")
        return res.status(400).json({msg : error.message}) // mostramos un msj 404 de tipo json diciendo que el ya esta registrado ese usuario y hacemos el return para que no se quede ejecutando
    }


    try{
        // Guardar un nuevo veterinario en la base de datos
        const veterinario = new Veterinario(req.body)  // creamos una nueva instacia de veterinario que es el Schema que definimos con la info del req.body
        const veterinarioGuardado = await veterinario.save()  // y aqui la almacenamos en la base de datos. El .save() es un metodo de mongoose

        //Enviar Email
        emailRegistro({email,nombre,token:veterinarioGuardado.token})

        res.json(veterinarioGuardado) // el .json manda una respuesta de tipo json para poder consumir esa info mas adelante y mandamos como respuesta el veterinario con su info guardada
    }
     catch (error){
        console.log(error)
    }

}

const perfil = (req,res) => {
    const { veterinario } = req  // pq en el midellware de checkAuth a la info del veterinario la guardamos dentro de req

    res.json(veterinario)
}

const confirmar = async (req,res) => {
    const {token} = req.params

    const usuarioConfirmar = await Veterinario.findOne({token})   // consulto en mis base de datos si tengo el token pasado por params
    if(!usuarioConfirmar){
        let error = new Error("Token no valido")
        return res.status(404).json({msg : error.message})         // si no se encontro muestro un msj de error
    }

    try { // el try hace que si hay algun error en alguna de las lineas, pase al catch
        usuarioConfirmar.token = null
        usuarioConfirmar.confirmado = true                  // modificamos la base de datos para confirmar el usuario, lo almacenamos con el .save 
        await usuarioConfirmar.save()                       // y mostramos un msj de que se confirmo correctamente

        res.json({msg : "Usuario confirmado correctamente"})
    } catch (error) {
        console.log(error)
    }

}

const autenticar = async (req,res) => {
        // console.log(req.body)
        const {email, password} = req.body

        // Compruebo si existe
        let usuario = await Veterinario.findOne({email})

        if(!usuario){
            let error = new Error("Usuario no existe")
            return res.status(404).json({msg : error.message})        
        }
        
        // Compruebo si el usuario esta confirmado 
        if(!usuario.confirmado){
            const error = new Error("Tu cuenta no ha sido confirmada")
            res.status(403).json({msg : error.message})
        }
        // Revisar el password
        if(await usuario.comprobarPassword(password)){
        // Autenticar  
        res.json({
        _id : usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        token: generarJWT(usuario.id)   
        })

        } else {
            let error = new Error("El password es incorrecto")
            return res.status(404).json({msg : error.message}) 
        }

     }

const olvidePassword = async (req,res) =>{
        const {email} = req.body

        const existeVeterinario = await Veterinario.findOne({email})
        if(!existeVeterinario) {
            const error = new Error("El usuario no existe")
            return res.status(400).json({msg: error.message})
        }

        try {
            existeVeterinario.token = generarId()
            await existeVeterinario.save()

            //Enviar Email con instrucciones
            emailOlvidePassword({
                email,
                nombre: existeVeterinario.nombre,
                token: existeVeterinario.token
            })

            res.json({msg: "Hemos enviado un email con las instrucciones"})
        } catch (error) {
            console.log(error)
        }
     }



const comprobarToken = async (req,res) =>{

        const {token} = req.params

        const tokenValido = await Veterinario.findOne({token})
        if(tokenValido){
            res.json({msg: "Token valido y el usuario existe"})
        } else{
            const error = new Error("Token no valido")
            return res.status(400).json({msg: error.message})
        }
     }



const nuevoPassword = async (req,res) =>{
        const {token} = req.params
        const {password} = req.body

        const veterinario = await Veterinario.findOne({token})
        if(!veterinario){
            const error = new Error("Hubo un error")
            return res.status(400).json({msg: error.message})
        }
        try {
            veterinario.token = null
            veterinario.password = password
            await veterinario.save()
            res.json({msg:"Password modificado correctamente"})
        } catch (error) {
            console.log(error)
        }
     }
     
const actualizarPerfil = async (req, res) => {
    const { id } = req.params

    const veterinario = await Veterinario.findByid(id)
    if(!veterinario){
        const error = new Error ("Hubo un error")
        return res.status(400).json({ msg : error.message})
    }

    if(veterinario.email !== req.body.email){
        const { email } = req.body
        const existeEmail = await Veterinario.findOne(email)
        if(existeEmail){
            const error = new Error ("Ese email ya esta en uso")
            return res.status(400).json({ msg : error.message})
        }

    }

    try {
        veterinario.nombre = req.body.nombre 
        veterinario.email = req.body.email 
        veterinario.web = req.body.web 
        veterinario.telefono = req.body.telefono 

        const veterinarioActualizado = await veterinario.save()
        res.json(veterinarioActualizado)

    } catch (error) {
        console.log(error)
    }

    }

const actualizarPassword = async (req,res) => {
    // Leer los datos
    const { id } = req.veterinario
    const { password_actual , password_nuevo} = req.body
    // Comprobar que el veterinario exista
    const veterinario = await Veterinario.findById(id)
    if(!veterinario){
        const error = new Error ("Hubo un error")
        return res.status(400).json({ msg : error.message})
    }
    // Comprobar su password
    if(await veterinario.comprobarPassword(password_actual)){
        // Almacenar su nuevo password
        veterinario.password = password_nuevo
        await veterinario.save()
        res.json({msg:"Password Almacenado Correctamente"})
    } else {
        const error = new Error ("Password actual es Incorrecto")
        return res.status(400).json({msg : error.message})
    }
    
}

      
export  {
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword
}