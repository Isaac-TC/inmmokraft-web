const express = require("express");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer"); // 📦 Librería para enviar correos

const router = express.Router();

// 📌 Ruta: Iniciar sesión
router.post("/login", (req, res) => {
  const { usuario, clave } = req.body;
  console.log("🔐 Intento de login:", usuario, clave);

  const dataPath = path.join(__dirname, "../data/users.json");

  try {
    const data = fs.readFileSync(dataPath, "utf8");
    const usuarios = JSON.parse(data);

    // 🔍 Buscar usuario que coincida con credenciales
    const usuarioValido = usuarios.find(
      (u) => u.usuario === usuario && u.clave === clave
    );

    if (usuarioValido) {
      return res.status(200).json({ success: true });
    } else {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }
  } catch (err) {
    console.error("❌ Error leyendo usuarios:", err);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor",
    });
  }
});

// 📌 Ruta: Recuperar contraseña y enviar correo real
router.post("/recuperar", async (req, res) => {
  const { correo } = req.body;
  console.log("📩 Solicitud de recuperación para:", correo);

  if (!correo) {
    return res.status(400).json({
      success: false,
      message: "El campo correo es obligatorio",
    });
  }

  const dataPath = path.join(__dirname, "../data/users.json");

  try {
    const data = fs.readFileSync(dataPath, "utf8");
    const usuarios = JSON.parse(data);

    const usuarioEncontrado = usuarios.find((u) => u.correo === correo);

    if (!usuarioEncontrado) {
      return res.status(404).json({
        success: false,
        message: "Correo no encontrado",
      });
    }

    // 📤 Configuración de nodemailer para enviar correo real
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "iseduardot92@gmail.com",       // Reemplazar con tu correo Gmail
        pass: "uvcu ihlr urrz dacp"         // Contraseña de aplicación de Gmail
      }
    });

    // 📨 Contenido del correo
    const mailOptions = {
      from: "Inmobiliaria Inmmokraft <TUCORREO@gmail.com>",
      to: correo,
      subject: "Restablecimiento de contraseña",
      html: `
        <h3>Hola ${usuarioEncontrado.usuario},</h3>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <p><a href="http://localhost:3000/restablecer.html">Haz clic aquí para cambiarla</a></p>
        <p>Si no fuiste tú, ignora este mensaje.</p>
      `
    };

    // 📨 Enviar el correo
    const info = await transporter.sendMail(mailOptions);
    console.log("📬 Correo enviado:", info.response);

    return res.status(200).json({
      success: true,
      message: "Correo enviado correctamente"
    });

  } catch (err) {
    console.error("❌ Error al enviar correo:", err);
    return res.status(500).json({
      success: false,
      message: "Error al enviar el correo"
    });
  }
});

// 📌 Ruta: Restablecer contraseña (modifica el archivo JSON)
router.put("/restablecer", (req, res) => {
  const { correo, nuevaClave } = req.body;
  const dataPath = path.join(__dirname, "../data/users.json");

  if (!correo || !nuevaClave) {
    return res.status(400).json({
      success: false,
      message: "Datos incompletos"
    });
  }

  try {
    const data = fs.readFileSync(dataPath, "utf8");
    let usuarios = JSON.parse(data);

    // 🔍 Buscar usuario por correo
    const index = usuarios.findIndex((u) => u.correo === correo);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Correo no encontrado"
      });
    }

    // 🔐 Actualizar la contraseña
    usuarios[index].clave = nuevaClave;

    // 💾 Guardar cambios en el archivo
    fs.writeFileSync(dataPath, JSON.stringify(usuarios, null, 2));

    console.log(`🔁 Contraseña actualizada para ${correo}`);
    return res.status(200).json({
      success: true,
      message: "Contraseña actualizada"
    });

  } catch (err) {
    console.error("❌ Error al actualizar contraseña:", err);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });
  }
});

module.exports = router;
