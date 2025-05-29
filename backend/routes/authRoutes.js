const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

router.post("/login", (req, res) => {
  const { usuario, clave } = req.body;
  console.log("Intento de login:", usuario, clave);

  const dataPath = path.join(__dirname, "../data/users.json");
  const data = fs.readFileSync(dataPath, "utf8");
  const usuarios = JSON.parse(data);

  const usuarioValido = usuarios.find(
    (u) => u.usuario === usuario && u.clave === clave
  );

  if (usuarioValido) {
    return res.status(200).json({ success: true });
  } else {
    return res
      .status(401)
      .json({ success: false, message: "Credenciales inválidas" });
  }
});

module.exports = router;
