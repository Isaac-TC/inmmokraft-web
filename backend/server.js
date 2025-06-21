const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const authRoutes = require("./routes/authRoutes");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Conexión a base de datos
const db = mysql.createConnection({
  host: "127.0.0.1",
  user: "root",
  password: "isaac1992",
  database: "inmobiliaria"
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error de conexión:", err);
    return;
  }
  console.log("✅ Conectado a la base de datos");
});

// Rutas
app.use("/api", authRoutes);

// Rutas de seguimiento
const seguimientoRoutes = require("./routes/seguimientoRoutes")(db);
app.use("/api/seguimiento", seguimientoRoutes);

// Ruta para registrar propiedad
app.post("/api/registrar", (req, res) => {
  const { tipo_operacion, direccion, vendedor, comprador, agente, estado, documentos } = req.body;
  console.log("📩 Datos del formulario recibidos:", req.body);

  const {
    escritura = false,
    gravamenes = false,
    impuestos = false,
    catastral = false,
    papeleta = false,
    notarizacion = false
  } = documentos;

  const sqlUltimo = "SELECT codigo FROM propiedades WHERE codigo LIKE 'PROP-%' ORDER BY id DESC LIMIT 1";

  db.query(sqlUltimo, (err, results) => {
    if (err) {
      console.error("❌ Error al buscar último código:", err);
      return res.status(500).send("Error al generar código");
    }

    let nuevoCodigo = "PROP-001";

    if (results.length > 0 && results[0].codigo) {
      const ultimo = results[0].codigo;
      const numero = parseInt(ultimo.split("-")[1]) + 1;
      nuevoCodigo = `PROP-${numero.toString().padStart(3, "0")}`;
    }

    const sqlInsert = `
      INSERT INTO propiedades (
        codigo, tipo_operacion, direccion, vendedor, comprador, agente, estado,
        escritura, gravamenes, impuestos, catastral, papeleta, notarizacion
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      nuevoCodigo,
      tipo_operacion,
      direccion,
      vendedor,
      comprador,
      agente,
      estado,
      escritura,
      gravamenes,
      impuestos,
      catastral,
      papeleta,
      notarizacion
    ];

    db.query(sqlInsert, values, (err, result) => {
      if (err) {
        console.error("❌ Error al insertar propiedad:", err);
        return res.status(500).send("Error al registrar propiedad");
      }

      res.send(`✅ Propiedad registrada con código: ${nuevoCodigo}`);
    });
  });
});

// Obtener todas las propiedades
app.get("/api/propiedades", (req, res) => {
  db.query("SELECT * FROM propiedades", (err, results) => {
    if (err) {
      console.error("❌ Error al obtener propiedades:", err);
      return res.status(500).send("Error al obtener propiedades");
    }
    res.json(results);
  });
});

// Obtener una propiedad por código
app.get("/api/propiedades/:codigo", (req, res) => {
  const codigo = req.params.codigo;
  db.query("SELECT * FROM propiedades WHERE codigo = ?", [codigo], (err, results) => {
    if (err) {
      console.error("❌ Error al obtener propiedad:", err);
      return res.status(500).send("Error al obtener propiedad");
    }
    if (results.length === 0) {
      return res.status(404).send("Propiedad no encontrada");
    }
    res.json(results[0]);
  });
});

// Actualizar una propiedad
app.put("/api/propiedades/:codigo", (req, res) => {
  const codigo = req.params.codigo;
  const { tipo_operacion, direccion, vendedor, comprador, agente, estado } = req.body;

  const sql = `
    UPDATE propiedades SET
    tipo_operacion = ?,
    direccion = ?,
    vendedor = ?,
    comprador = ?,
    agente = ?,
    estado = ?
    WHERE codigo = ?
  `;

  const values = [tipo_operacion, direccion, vendedor, comprador, agente, estado, codigo];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("❌ Error al actualizar propiedad:", err);
      return res.status(500).send("Error al actualizar propiedad");
    }
    res.send("✅ Propiedad actualizada correctamente");
  });
});

// Eliminar una propiedad
app.delete("/api/propiedades/:codigo", (req, res) => {
  const codigo = req.params.codigo;
  db.query("DELETE FROM propiedades WHERE codigo = ?", [codigo], (err, result) => {
    if (err) {
      console.error("❌ Error al eliminar propiedad:", err);
      return res.status(500).send("Error al eliminar propiedad");
    }
    res.send("🗑️ Propiedad eliminada correctamente");
  });
});

// Ruta raíz
app.get("/", (req, res) => {
  res.send("Servidor backend funcionando correctamente 🎉");
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
