import jwt from "jsonwebtoken" // me permite crear y comprobar token.
import Veterinario from "../models/Veterinario.js"

const checkAutenticacion = async (req,res,next) => { 
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){ // en este objeto nos llega el token que configuramos y guardamos en postman en headers y Bearer Token
        try {
            token = req.headers.authorization.split(" ")[1] // tomamos solamente el token porque asi nos llega, junto con el Bearer. Lo separamos en el espacio y tomamos la posicion del array 1 donde va a estar el token
            const decodificar = jwt.verify(token, process.env.JWT_SECRET) // decodifica el token y lo transforma nuevamente al id del usuario con el que se habia generado el token
            
            req.veterinario = await Veterinario.findById(decodificar.id).select("-password")  // le agregamos al objeto req la propiedad veterinario sin el password y

            return next()

        } catch (error) {
            const e = new Error("Token no valido")
            return res.status(403).json({msg : e.message})
        } 
    }
    if(!token){
    const error = new Error("Token no valido o inexistente")
    res.status(403).json({msg : error.message})
    }
    next()

}


export default checkAutenticacion