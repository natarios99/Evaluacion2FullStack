const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const aplicacion = express();
aplicacion.use(cors());
aplicacion.use(express.json());

const baseDeDatos = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'deportes_db',
  waitForConnections: true,
  connectionLimit: 10
});

baseDeDatos.getConnection()
  .then((conexion) => {
    console.log('Conexión exitosa a la base de datos MySQL (deportes_db)');
    conexion.release();
  })
  .catch((err) => {
    console.error('Error al conectar con MySQL:', err.message);
  });

aplicacion.get('/api/productos', async (peticion, respuesta) => {
  try {
    const [filas] = await baseDeDatos.query('SELECT * FROM productos ORDER BY id DESC');
    respuesta.json(filas);
  } catch (error) {
    console.error('Error exacto de MySQL en GET /api/productos:', error.message);
    respuesta.status(500).json({ error: 'Error interno del servidor: ' + error.message });
  }
});

aplicacion.post('/api/productos', async (peticion, respuesta) => {
  const { nombre, precio, categoria, stock, imagen, img, oferta } = peticion.body;

  if (!nombre || precio === undefined) {
    return respuesta.status(400).json({ error: 'Nombre y precio son obligatorios.' });
  }

  try {
    const consultaSQL = `
      INSERT INTO productos (nombre, precio, categoria, stock, imagen, oferta)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

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
    console.error('Error al insertar en MySQL:', error.message);
    respuesta.status(500).json({ error: 'Error en la base de datos: ' + error.message });
  }
});

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
    console.error('Error al actualizar el stock en MySQL:', error.message);
    respuesta.status(500).json({ error: 'Error al descontar stock en el servidor.' });
  }
});

aplicacion.get('/api/admin/stats', async (req, res) => {
  try {
    const [productosResult] = await baseDeDatos.query(
      'SELECT COUNT(*) AS total, COALESCE(SUM(stock), 0) AS inventario FROM productos'
    );

    let totalCompras = 0;
    let totalUsuarios = 0;

    try {
      const [comprasResult] = await baseDeDatos.query('SELECT COUNT(*) AS total FROM ordenes');
      totalCompras = comprasResult[0].total;
    } catch (e) {
      console.log('Tabla ordenes no encontrada, enviando 0 por defecto.');
    }

    try {
      const [usuariosResult] = await baseDeDatos.query('SELECT COUNT(*) AS total FROM usuarios');
      totalUsuarios = usuariosResult[0].total;
    } catch (e) {
      console.log('Tabla usuarios no encontrada, enviando 0 por defecto.');
    }

    res.json({
      compras: totalCompras,
      probabilidadAumento: 20,
      productos: productosResult[0].total || 0,
      inventarioActual: Number(productosResult[0].inventario) || 0,
      usuarios: totalUsuarios,
      nuevosUsuariosMes: 0
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error.message);
    res.status(500).json({ error: 'Error en la base de datos: ' + error.message });
  }
});

aplicacion.get('/api/usuarios', async (peticion, respuesta) => {
  try {
    const [filas] = await baseDeDatos.query('SELECT * FROM usuarios ORDER BY id DESC');
    respuesta.json(filas);
  } catch (error) {
    console.error('Error al obtener usuarios:', error.message);
    respuesta.status(500).json({ error: 'Error al consultar usuarios.' });
  }
});

aplicacion.get('/api/ordenes', async (peticion, respuesta) => {
  try {
    const [filas] = await baseDeDatos.query('SELECT * FROM ordenes ORDER BY id DESC');
    respuesta.json(filas);
  } catch (error) {
    console.error('Error al obtener órdenes:', error.message);
    respuesta.status(500).json({ error: 'Error al consultar órdenes.' });
  }
});

aplicacion.post('/api/usuarios', async (peticion, respuesta) => {
  const { nombre, email } = peticion.body;

  if (!email) {
    return respuesta.status(400).json({ error: 'El correo electrónico es obligatorio.' });
  }

  try {
    const consultaSQL = 'INSERT INTO usuarios (nombre, email) VALUES (?, ?)';
    const [resultado] = await baseDeDatos.query(consultaSQL, [nombre || 'Usuario', email]);

    respuesta.status(201).json({
      mensaje: 'Usuario registrado con éxito',
      id: resultado.insertId,
      nombre,
      email
    });
  } catch (error) {
    console.error('Error exacto al registrar usuario en MySQL:', error.message);
    respuesta.status(500).json({ error: 'Error en la base de datos: ' + error.message });
  }
});

aplicacion.post('/api/ordenes', async (peticion, respuesta) => {
  const { usuario_id, total, carrito } = peticion.body;

  if (!total || total <= 0) {
    return respuesta.status(400).json({ error: 'El total de la orden debe ser mayor a 0.' });
  }

  try {
    const consultaOrden = 'INSERT INTO ordenes (usuario_id, total) VALUES (?, ?)';
    const [resultadoOrden] = await baseDeDatos.query(consultaOrden, [usuario_id || null, Number(total)]);

    if (carrito && Array.isArray(carrito) && carrito.length > 0) {
      for (const producto of carrito) {
        const consultaStock = 'UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?';
        await baseDeDatos.query(consultaStock, [producto.cantidad, producto.id, producto.cantidad]);
      }
    }

    respuesta.status(201).json({
      mensaje: 'Orden de compra guardada',
      orden_id: resultadoOrden.insertId,
      total
    });
  } catch (error) {
    console.error('Error al registrar la orden en MySQL:', error.message);
    respuesta.status(500).json({ error: 'Error al guardar la orden: ' + error.message });
  }
});

aplicacion.post('/api/login', async (peticion, respuesta) => {
  const { email } = peticion.body;

  if (!email) {
    return respuesta.status(400).json({ error: 'El correo electrónico es obligatorio.' });
  }

  try {
    const [filas] = await baseDeDatos.query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (filas.length === 0) {
      return respuesta.status(401).json({ error: 'El usuario no está registrado en la base de datos.' });
    }

    respuesta.json(filas[0]);
  } catch (error) {
    console.error('Error al verificar usuario:', error.message);
    respuesta.status(500).json({ error: 'Error interno del servidor.' });
  }
});

const PUERTO = process.env.PUERTO || 3000;
aplicacion.listen(PUERTO, () => {
  console.log(`Servidor Node.js corriendo en http://localhost:${PUERTO}`);
});