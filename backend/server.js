const expres = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const aplicacion = expres();
aplicacion.use(cors());
aplicacion.use(expres.json());

// Configuración de la base de datos MySQL
const baseDeDatos = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '1234', // Cambia esto por tu clave de MySQL
  database: 'deportes_db',
  waitForConnections: true,
  connectionLimit: 10
});

// Ruta GET: Obtener todos los productos deportivos desde MySQL
aplicacion.get('/api/productos', async (peticion, respuesta) => {
  try {
    const [filas] = await baseDeDatos.query('SELECT * FROM productos ORDER BY id DESC');
    respuesta.json(filas);
  } catch (error) {
    console.error('Error al obtener productos:', error);
    respuesta.status(500).json({ error: 'Error al consultar la base de datos' });
  }
});

// Ruta POST: Descontar stock al procesar una compra
aplicacion.post('/api/comprar', async (peticion, respuesta) => {
  const { carrito } = peticion.body; // Arreglo de elementos en el carrito

  try {
    for (const producto of carrito) {
      await baseDeDatos.query(
        'UPDATE productos SET stock = stock - ? WHERE id = ? AND stock >= ?',
        [producto.cantidad, producto.id, producto.cantidad]
      );
    }
    respuesta.json({ mensaje: 'Compra procesada exitosamente y stock actualizado' });
  } catch (error) {
    console.error('Error al actualizar el stock:', error);
    respuesta.status(500).json({ error: 'Error al procesar la compra' });
  }
});

const PUERTO = 5000;
aplicacion.listen(PUERTO, () => {
  console.log(`Servidor backend corriendo en http://localhost:${PUERTO}`);
});