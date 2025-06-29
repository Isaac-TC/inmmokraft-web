module.exports = (db) => {
  const express = require("express");
  const router = express.Router();
  const enviarCorreo = require("../utils/notificador"); // 👈 Notificador de correo

  router.post("/", async (req, res) => {
    const {
      tarea,
      realizado,
      fechaSolicitud,
      dias,
      fechaPlazo,
      alerta,
      asesor,         // 👈 Nuevo campo
      contacto        // 👈 Nuevo campo
    } = req.body;

    // Validación básica
    if (
      !fechaSolicitud || !fechaPlazo ||
      isNaN(Date.parse(fechaSolicitud)) || isNaN(Date.parse(fechaPlazo)) ||
      !asesor || !contacto
    ) {
      return res.status(400).json({ error: "❌ Datos inválidos. Verifica antes de guardar." });
    }

    const sql = `
      INSERT INTO seguimientos 
      (tarea, realizado, fechaSolicitud, dias, fechaPlazo, alerta, asesor, contacto)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [tarea, realizado, fechaSolicitud, dias, fechaPlazo, alerta, asesor, contacto];

    db.query(sql, values, async (err, result) => {
      if (err) {
        console.error("❌ Error al guardar seguimiento:", err);
        return res.status(500).json({ error: "Error al guardar" });
      }

      if (alerta.includes("Atrasado") || alerta.includes("Pendiente")) {
        try {
          await enviarCorreo(
            "iseduardot92@ejemplo.com",
            `⚠️ Seguimiento: ${tarea} - ${alerta}`,
            `La tarea "${tarea}" está marcada como "${alerta}". Revisa la plataforma para tomar acción.\n\nAsesor: ${asesor}\nContacto: ${contacto}`
          );
          console.log(`📧 Correo enviado para ${tarea}`);
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
