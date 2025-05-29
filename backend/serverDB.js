const express = require('express');
const mysql = require('mysql2');

const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Conexión a la base de datos
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: 'root',
  password: 'isaac1992',
  database: 'inmobiliaria'
});

db.connect(err => {
  if (err) throw err;
  console.log('✅ Conectado a la base de datos');
});

// Ruta para registrar propiedad
app.post('/api/registrar', (req, res) => {
  const { codigo, tipoOperacion, direccion, vendedor, comprador, agente, estado } = req.body;

  const sql = 'INSERT INTO propiedades (codigo, tipo_operacion, direccion, vendedor, comprador, agente, estado) VALUES (?, ?, ?, ?, ?, ?, ?)';
  const values = [codigo, tipoOperacion, direccion, vendedor, comprador, agente, estado];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error al insertar:', err);
      res.status(500).send('Error en el servidor');
    } else {
      res.status(200).send('Propiedad registrada correctamente');
    }
  });
});

app.listen(port, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
});
