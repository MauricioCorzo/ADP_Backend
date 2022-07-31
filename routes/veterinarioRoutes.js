import express from "express"
import { registrar, perfil, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword, actualizarPerfil , actualizarPassword} from "../controllers/veterinarioControllers.js" // constantes que definen las acciones de las rutas
import checkAutenticacion from "../midellware/authMidellware.js"

const veterinarioRoutes = express.Router()
//Area Publica
veterinarioRoutes.post("/", registrar)  // metodo POST sirve para enviar informacion nueva a la base de datos

veterinarioRoutes.get("/confirmar/:token", confirmar) // el:token es un parametro dinamico

veterinarioRoutes.post("/login", autenticar)

veterinarioRoutes.post("/olvide-password", olvidePassword)

veterinarioRoutes.get("/olvide-password/:token", comprobarToken)

veterinarioRoutes.post("/olvide-password/:token", nuevoPassword)

//Area Privada
veterinarioRoutes.get ("/perfil", checkAutenticacion, perfil)

veterinarioRoutes.put ("/perfil/:id" , checkAutenticacion , actualizarPerfil)

veterinarioRoutes.put ("/actualizar-password", checkAutenticacion, actualizarPassword)

export default veterinarioRoutes