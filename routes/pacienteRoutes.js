import express from "express"
const router = express.Router()
import { agregarPaciente , obtenerPacientes, obtenerPaciente, actualizarPaciente, eliminarPaciente } from "../controllers/pacienteControllers.js"
import checkAutenticacion from "../midellware/authMidellware.js"


router.route("/")
    .post(checkAutenticacion, agregarPaciente)
    .get(checkAutenticacion, obtenerPacientes)

router.route("/:id")
    .get(checkAutenticacion, obtenerPaciente)
    .put(checkAutenticacion, actualizarPaciente)
    .delete(checkAutenticacion, eliminarPaciente)


export default router