const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const aplicacion = express();
aplicacion.use(cors());
aplicacion.use(express.json());

// Configuración de la base de datos MySQL
const baseDeDatos = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234', // Tu clave de MySQL
  database: 'deportes_db',
  waitForConnections: true,
  connectionLimit: 10
});

// Probar la conexión a la base de datos al iniciar el servidor
baseDeDatos.getConnection()
  .then((conexion) => {
    console.log('✅ Conexión exitosa a la base de datos MySQL (deportes_db)');
    conexion.release();
  })
  .catch((err) => {
    console.error('❌ Error al conectar con MySQL:', err.message);
  });

// 1. Ruta GET: Obtener todos los productos deportivos desde MySQL
aplicacion.get('/api/productos', async (peticion, respuesta) => {
  try {
    const [filas] = await baseDeDatos.query('SELECT * FROM productos ORDER BY id DESC');
    respuesta.json(filas);
  } catch (error) {
    console.error('❌ Error exacto de MySQL en GET /api/productos:', error.message);
    respuesta.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
});

// 2. Ruta POST: Agregar un nuevo producto a la base de datos
aplicacion.post('/api/productos', async (peticion, respuesta) => {
  const { nombre, precio, categoria, stock, imagen, img, oferta } = peticion.body;

  // Validaciones de campos obligatorios
  if (!nombre || precio === undefined) {
    return respuesta.status(400).json({ error: 'Nombre y precio son obligatorios.' });
  }

  try {
    const consultaSQL = `
      INSERT INTO productos (nombre, precio, categoria, stock, imagen, oferta)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    // Permite recibir tanto 'imagen' como 'img' desde React
    const rutaImagen = imagen || img || '/Zapatillasrunning.webp';
    const esOferta = oferta ? 1 : 0;

    const [resultado] = await baseDeDatos.query(consultaSQL, [
      nombre,
      Number(precio),
      categoria || 'Accesorios',
      Number(stock) || 0,
      rutaImagen,
      esOferta
    ]);

    respuesta.status(201).json({
      id: resultado.insertId,
      nombre,
      precio: Number(precio),
      categoria: categoria || 'Accesorios',
      stock: Number(stock) || 0,
      imagen: rutaImagen,
      oferta: esOferta
    });
  } catch (error) {
    console.error('❌ Error al insertar en MySQL:', error.message);
    respuesta.status(500).json({ error: 'Error en la base de datos: ' + error.message });
  }
});

// 3. Ruta POST: Procesar pago y descontar stock en MySQL
aplicacion.post('/api/comprar', async (peticion, respuesta) => {
  const { carrito } = peticion.body;

  if (!carrito || !Array.isArray(carrito) || carrito.length === 0) {
    return respuesta.status(400).json({ error: 'El carrito está vacío o tiene un formato no válido.' });
  }

  try {
    for (const producto of carrito) {
      const consultaSQL = `
        UPDATE productos 
        SET stock = stock - ? 
        WHERE id = ? AND stock >= ?
      `;

      await baseDeDatos.query(consultaSQL, [
        producto.cantidad,
        producto.id,
        producto.cantidad
      ]);
    }

    respuesta.status(200).json({ mensaje: '¡Compra procesada y stock descontado exitosamente!' });
  } catch (error) {
    console.error('❌ Error al actualizar el stock en MySQL:', error.message);
    respuesta.status(500).json({ error: 'Error al descontar stock en el servidor.' });
  }
});

// Iniciar servidor en el puerto 5000
const PUERTO = process.env.PUERTO || 5000;
aplicacion.listen(PUERTO, () => {
  console.log(`🚀 Servidor Node.js corriendo en http://localhost:${PUERTO}`);
});