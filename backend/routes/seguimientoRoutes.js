module.exports = (db) => {
  const express = require("express");
  const router = express.Router();
  const enviarCorreo = require("../utils/notificador"); // 👈 Importa el notificador

  router.post("/", async (req, res) => {
    const { tarea, realizado, fechaSolicitud, dias, fechaPlazo, alerta } = req.body;

    // Validación básica de fecha
    if (!fechaSolicitud || !fechaPlazo || isNaN(Date.parse(fechaSolicitud)) || isNaN(Date.parse(fechaPlazo))) {
      return res.status(400).json({ error: "❌ Fechas inválidas. Verifica antes de guardar." });
    }

    const sql = `
      INSERT INTO seguimientos 
      (tarea, realizado, fechaSolicitud, dias, fechaPlazo, alerta)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const values = [tarea, realizado, fechaSolicitud, dias, fechaPlazo, alerta];

    db.query(sql, values, async (err, result) => {
      if (err) {
        console.error("❌ Error al guardar seguimiento:", err);
        return res.status(500).json({ error: "Error al guardar" });
      }

      // ✅ Enviar correo si es alerta crítica
      if (alerta.includes("Atrasado") || alerta.includes("Pendiente")) {
        try {
          await enviarCorreo(
            "iseduardot92@ejemplo.com", // 💌 Tu correo aquí
            `⚠️ Seguimiento: ${tarea} - ${alerta}`,
            `La tarea "${tarea}" está marcada como "${alerta}". Revisa la plataforma para tomar acción.`
          );
          console.log(`📧 Correo enviado para alerta: ${alerta}`);
        } catch (e) {
          console.error("❌ Error al enviar correo:", e);
        }
      }

      res.status(201).json({ mensaje: "✅ Seguimiento guardado" });
    });
  });

  router.get("/", (req, res) => {
    db.query("SELECT * FROM seguimientos", (err, rows) => {
      if (err) {
        console.error("❌ Error al consultar seguimientos:", err);
        return res.status(500).json({ error: "Error al consultar" });
      }
      res.json(rows);
    });
  });

  return router;
};
