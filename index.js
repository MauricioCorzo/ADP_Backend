import express from "express"
import dotenv from "dotenv"
import conectarDB from "./config/db.js"
import veterinarioRoutes from "./routes/veterinarioRoutes.js"
import pacienteRoutes from "./routes/pacienteRoutes.js"
import cors from 'cors'

const app = express()

app.use(express.json()) // es para que se entere la app que cuando hagamos un metodo POST va a ser de tipo json, sin esto nos marcaria undefined

dotenv.config()  // busca lo que hay en el archivo env. Este archivo sirve para guardar info que no queremos que sea publica. Se instala dotenv y se lo importa

conectarDB()

const dominiosPerimitidos = [process.env.FRONTEND_URL]
const corsOptions = {
    origin: function(origin,callback){
        if(dominiosPerimitidos.indexOf(origin) !== -1){
            callback(null,true)
        } else{
            callback(new Error("No permitido por Cors"))
        }
    }
}

app.use(cors(corsOptions))

app.use("/api/veterinarios", veterinarioRoutes) // se conecta en esta ruta con los metodos definidos en veterinarioRoutes
app.use("/api/pacientes", pacienteRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
    console.log(`Puerto funcionando en el puerto ${PORT}`)
})                                                               // para el backend usamos el 4000, para el frontend el 3000