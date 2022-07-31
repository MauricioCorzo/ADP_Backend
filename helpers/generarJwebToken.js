import jwt from "jsonwebtoken" // generamos el Json web token


const generarJWT = (id) => {
 return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d"
 })
}

export default generarJWT