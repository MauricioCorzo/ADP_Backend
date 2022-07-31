import nodemailer from "nodemailer"

const emailRegistro = async(datos) => {
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
        subject: "Compruemba tu cuenta en APV",
        text: "Comprueba tu cuenta en APV",
        html: `<p>Hola: ${nombre}, comprueba tu cuenta en APV.</p>
        <p> Tu cuenta ya esta lista, solo debes comprobarla en el siguiente enlace:
        <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar Cuenta</a> </p>

        <p> Si tu no creaste esta cuenta puedes ignorar este mensaje</p>
        
        `
      })
      console.log("Mensaje enviado: %s", info.messageId)
}

export default emailRegistro