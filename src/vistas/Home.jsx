// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Petición al servidor Express en puerto 3000
    fetch('http://localhost:3000/api/productos')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Error al conectar con el servidor backend.');
        }
        return res.json();
      })
      .then((data) => {
        console.log('Productos obtenidos de MySQL:', data);
        setProductos(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error('Error al cargar productos:', err);
        setError(err.message);
        setCargando(false);
      });
  }, []);

  if (cargando) return <div className="p-4 text-center">Cargando productos desde MySQL...</div>;
  if (error) return <div className="p-4 text-center text-danger">Error: {error}</div>;

  if (productos.length === 0) {
    return (
      <div className="contenedor-productos p-4 text-center">
        <h1>Nuestros Productos</h1>
        <p>No hay productos registrados en la base de datos (deportes_db).</p>
      </div>
    );
  }

  return (
    <div className="contenedor-productos p-4">
      <h1>Nuestros Productos</h1>
      <div className="grid-productos d-flex flex-wrap gap-3 mt-3">
        {productos.map((producto) => {
          // Detectar la propiedad correcta de la imagen (imagen o img)
          const rutaImagen = producto.imagen || producto.img || '/Zapatillasrunning.webp';
          
          // Si la ruta ya incluye '/', la usamos directo; si no, le agregamos '/img/'
          const srcFinal = rutaImagen.startsWith('/') ? rutaImagen : `/img/${rutaImagen}`;

          return (
            <div key={producto.id} className="card-producto card p-3" style={{ width: '18rem' }}>
              <img 
                src={srcFinal} 
                alt={producto.nombre} 
                className="card-img-top"
                style={{ height: '180px', objectFit: 'contain' }} 
              />
              <div className="card-body">
                <h3 className="card-title h5">{producto.nombre}</h3>
                <p className="card-text fw-bold text-success">${Number(producto.precio).toLocaleString()}</p>
                <p className="card-text text-muted mb-2">Stock: {producto.stock}</p>
                <Link to={`/producto/${producto.id}`} className="btn btn-primary w-100">
                  Ver Detalle
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Home;