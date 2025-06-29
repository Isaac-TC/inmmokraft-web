const express = require('express');
const router = express.Router();
const db = require('../db'); // tu conexión mysql

router.post('/guardar-fase2', (req, res) => {
  const datos = req.body;

  const valores = datos.map(d => [
    d.documento,
    d.responsable,
    d.fecha_entrega,
    d.formato_entrega,
    d.realizado,
    d.observaciones
  ]);

  const sql = `
    INSERT INTO fase2_documentos 
    (documento, responsable, fecha_entrega, formato_entrega, realizado, observaciones)
    VALUES ?
  `;

  db.query(sql, [valores], (err, result) => {
    if (err) {
      console.error('Error al guardar:', err);
      return res.status(500).json({ success: false, message: 'Error al guardar' });
    }
    res.json({ success: true, message: 'Datos guardados' });
  });
});

module.exports = router;
