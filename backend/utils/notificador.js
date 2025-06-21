const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "iseduardot92@gmail.com",
    pass: "fwkh zawx pujj fnwm"
  }
});

function enviarCorreo(destinatario, asunto, mensaje) {
  const mailOptions = {
    from: "iseduardot92@gmail.com",
    to: destinatario,
    subject: asunto,
    text: mensaje
  };

  return transporter.sendMail(mailOptions);
}

module.exports = enviarCorreo;
