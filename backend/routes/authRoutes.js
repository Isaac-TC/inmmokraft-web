const express = require("express");
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");

const router = express.Router();

// 📌 Ruta: Iniciar sesión con roles
router.post("/login", (req, res) => {
  const { usuario, clave } = req.body;
  console.log("🔐 Intento de login:", usuario, clave);

  const dataPath = path.join(__dirname, "../data/users.json");

  try {
    const data = fs.readFileSync(dataPath, "utf8");
    const usuarios = JSON.parse(data);

    const usuarioValido = usuarios.find(
      (u) => u.usuario === usuario && u.clave === clave
    );

    if (usuarioValido) {
      // Retorna el rol también
      return res.status(200).json({
        success: true,
        usuario: usuarioValido.usuario,
        rol: usuarioValido.rol // "admin" o "usuario"
      });
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

    // 📤 Configuración de nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "iseduardot92@gmail.com",
        pass: "uvcu ihlr urrz dacp"
      }
    });

    const mailOptions = {
      from: "Inmobiliaria Inmmokraft <iseduardot92@gmail.com>",
      to: correo,
      subject: "Restablecimiento de contraseña",
      html: `
        <h3>Hola ${usuarioEncontrado.usuario},</h3>
        <p>Recibimos una solicitud para restablecer tu contraseña.</p>
        <p><a href="http://localhost:3000/restablecer.html">Haz clic aquí para cambiarla</a></p>
        <p>Si no fuiste tú, ignora este mensaje.</p>
      `
    };

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

    const index = usuarios.findIndex((u) => u.correo === correo);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        message: "Correo no encontrado"
      });
    }

    usuarios[index].clave = nuevaClave;

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

// 📌 Registrar nuevo usuario con rol
router.post("/registrarUsuario", (req, res) => {
  const { usuario, correo, clave, rol } = req.body;
  const dataPath = path.join(__dirname, "../data/users.json");

  try {
    let data = fs.readFileSync(dataPath, "utf8");
    const usuarios = JSON.parse(data);

    if (usuarios.find((u) => u.usuario === usuario || u.correo === correo)) {
      return res.status(400).json({ success: false, message: "Usuario o correo ya existen" });
    }

    usuarios.push({ usuario, correo, clave, rol });
    fs.writeFileSync(dataPath, JSON.stringify(usuarios, null, 2));

    return res.status(201).json({ success: true, message: "Usuario registrado correctamente" });
  } catch (err) {
    console.error("❌ Error al registrar usuario:", err);
    return res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
});

// 📌 Obtener usuarios registrados
router.get("/usuarios", (req, res) => {
  const dataPath = path.join(__dirname, "../data/users.json");

  try {
    const data = fs.readFileSync(dataPath, "utf8");
    const usuarios = JSON.parse(data);

    return res.status(200).json(usuarios);
  } catch (err) {
    console.error("❌ Error al leer usuarios:", err);
    return res.status(500).json({ message: "Error al obtener usuarios" });
  }
});

// 📌 Ruta: Eliminar usuario por índice
router.delete("/usuarios/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const dataPath = path.join(__dirname, "../data/users.json");

  try {
    const data = fs.readFileSync(dataPath, "utf8");
    let usuarios = JSON.parse(data);

    if (index < 0 || index >= usuarios.length) {
      return res.status(400).json({ success: false, message: "Índice inválido" });
    }

    // 🗑️ Eliminar usuario
    usuarios.splice(index, 1);

    fs.writeFileSync(dataPath, JSON.stringify(usuarios, null, 2));
    console.log(`🗑️ Usuario en posición ${index} eliminado.`);

    return res.status(200).json({ success: true, message: "Usuario eliminado correctamente" });
  } catch (err) {
    console.error("❌ Error al eliminar usuario:", err);
    return res.status(500).json({ success: false, message: "Error al eliminar usuario" });
  }
});
// 📌 Ruta: Editar usuario por índice
router.put("/usuarios/:index", (req, res) => {
  const index = parseInt(req.params.index);
  const { usuario, correo, clave, rol } = req.body;
  const dataPath = path.join(__dirname, "../data/users.json");

  try {
    const data = fs.readFileSync(dataPath, "utf8");
    const usuarios = JSON.parse(data);

    if (index < 0 || index >= usuarios.length) {
      return res.status(404).json({ success: false, message: "Índice inválido" });
    }

    usuarios[index] = { usuario, correo, clave, rol };

    fs.writeFileSync(dataPath, JSON.stringify(usuarios, null, 2));
    console.log(`✏️ Usuario actualizado en la posición ${index}`);
    return res.status(200).json({ success: true, message: "Usuario actualizado correctamente" });
  } catch (err) {
    console.error("❌ Error al editar usuario:", err);
    return res.status(500).json({ success: false, message: "Error al editar usuario" });
  }
});
