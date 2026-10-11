// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Petición a tu servidor Backend Express
    fetch('http://localhost:3000/api/productos') // Ajusta la URL de tu API
      .then((res) => res.json())
      .then((data) => {
        setProductos(data);
        setCargando(false);
      })
      .catch((err) => console.error('Error al cargar productos:', err));
  }, []);

  if (cargando) return <p>Cargando productos...</p>;

  return (
    <div className="contenedor-productos">
      <h1>Nuestros Productos</h1>
      <div className="grid-productos">
        {productos.map((producto) => (
          <div key={producto.id} className="card-producto">
            <img src={`/img/${producto.imagen}`} alt={producto.nombre} />
            <h3>{producto.nombre}</h3>
            <p>${producto.precio}</p>
            <Link to={`/producto/${producto.id}`}>Ver Detalle</Link>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;