import nodemailer from "nodemailer"

const emailOlvidePassword = async(datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      // Enviar Email
      const {email,nombre,token} = datos
      const info = await transport.sendMail({   // objeto con la configuracion del email, lo que mandamos por el email
        from: "APV - Administrador de Veterinaria",
        to: email,
        subject: "Restablece tu Password",
        text: "Restablece tu Password",
        html: `<p>Hola: ${nombre}, has solicitado reestablecer tu password.</p>

        <p>Sigue el siguiente enlace para reestablecer tu password:
        <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a> </p>

        <p> Si tu no creaste esta cuenta puedes ignorar este mensaje</p>
        
        `
      })
      console.log("Mensaje enviado: %s", info.messageId)
}

export default emailOlvidePassword 