import React, { useState } from 'react';
import '/css/categorias.css';

export default function Categorias({ productos, agregarAlCarrito, verDetalle }) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

  const listaCategorias = ['Todas', 'Calzado', 'Ropa', 'Fútbol', 'Fitness', 'Tenis', 'Suplementos', 'Ciclismo', 'Accesorios'];

  const productosFiltrados = categoriaSeleccionada === 'Todas' 
    ? productos 
    : productos.filter(p => p.categoria === categoriaSeleccionada);

  return (
    <div className="categorias-contenedor">
      <h2 className="categorias-titulo-principal">Tienda de Deportes & Performance</h2>
      
      <div className="categorias-botones">
        {listaCategorias.map((cat, idx) => (
          <button 
            key={idx}
            className={`boton-categoria ${categoriaSeleccionada === cat ? 'activo' : ''}`}
            onClick={() => setCategoriaSeleccionada(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <h3 className="categorias-subtitulo">{categoriaSeleccionada}</h3>

      <div className="grid-productos">
        {productosFiltrados.map((producto) => (
          <div key={producto.id} className="tarjeta-producto">
            
            {producto.oferta === 1 && (
              <span className="badge-oferta">
                ¡OFERTA!
              </span>
            )}

            <img 
              src={producto.imagen || producto.img} 
              alt={producto.nombre} 
              className="imagen-producto"
              onClick={() => verDetalle && verDetalle(producto)}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen'; }}
            />

            <div className="info-producto">
              <span className="categoria-etiqueta">{producto.categoria}</span>
              <h5 className="nombre-producto" onClick={() => verDetalle && verDetalle(producto)}>
                {producto.nombre}
              </h5>
              <p className="precio-producto">
                ${producto.precio.toLocaleString('es-CL')}
              </p>

              <p className={producto.stock > 5 ? 'stock-alto' : producto.stock > 0 ? 'stock-bajo' : 'stock-agotado'}>
                {producto.stock > 5 
                  ? `Stock: ${producto.stock} unidades` 
                  : producto.stock > 0 
                    ? `¡Últimas ${producto.stock} unidades!` 
                    : 'Agotado'}
              </p>

              <button 
                className="boton-agregar" 
                onClick={() => agregarAlCarrito(producto)}
                disabled={producto.stock <= 0}
              >
                {producto.stock > 0 ? 'Añadir al Carrito' : 'Sin Stock'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}