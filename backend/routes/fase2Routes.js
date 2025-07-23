// backend/routes/fase2Routes.js

module.exports = function (db) {
  const express = require("express");
  const router = express.Router();

  router.post("/guardar-fase2", (req, res) => {
    const datos = req.body;

    if (!Array.isArray(datos) || datos.length === 0) {
      return res.status(400).json({ success: false, message: "Datos inválidos o vacíos" });
    }

    const valores = datos.map((d) => [
      d.documento,
      d.responsable,
      d.fecha_entrega,
      d.formato_entrega,
      d.realizado,
      d.observaciones
    ]);

    const sql = `
     INSERT INTO inmobiliaria.fase2_documentos
  (documento, responsable, fecha_entrega, formato_entrega, realizado, observaciones)
      VALUES ?
    `;

    db.query(sql, [valores], (err, result) => {
      if (err) {
        console.error("❌ Error en la base de datos:", err);
        return res.status(500).json({ success: false, message: "Error en la base de datos" });
      }

      res.json({ success: true, message: "✅ Documentos guardados correctamente" });
    });
  });

  return router;
};
