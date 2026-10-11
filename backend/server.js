require('dotenv').config(); 
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // leer peticiones JSON


// ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY '1234';
// FLUSH PRIVILEGES;
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('¡Conectado exitosamente a MySQL Workbench!');
});
// Debe ser POST y la URL '/api/usuarios' exactos
app.post('/api/usuarios', async (req, res) => {
  const { nombre, email } = req.body;
  
  try {
    const [result] = await db.query(
      'INSERT INTO usuarios (nombre, email) VALUES (?, ?)',
      [nombre, email]
    );
    res.status(201).json({ id: result.insertId, nombre, email });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al insertar usuario' });
  }
});
app.delete('/api/usuarios/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query('DELETE FROM usuarios WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ mensaje: 'Usuario eliminado correctamente' });
  } catch (error) {
    console.error('Error en DELETE:', error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

// Ejemplo de una ruta (Endpoint) para obtener datos
app.get('/api/usuarios', (req, res) => {
  const sql = "SELECT * FROM usuarios";
  db.query(sql, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.json(data);
  });
});

app.listen(5000, () => {
  console.log('Servidor backend corriendo en el puerto 5000');
});