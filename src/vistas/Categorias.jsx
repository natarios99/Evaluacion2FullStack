import React, { useState } from 'react';

export default function Categorias({ productos, agregarAlCarrito }) {
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todas');

  // Lista de categorías de deportes disponibles
  const listaCategorias = ['Todas', 'Calzado', 'Ropa', 'Fútbol', 'Fitness', 'Tenis', 'Suplementos'];

  // Filtrar la lista según la categoría elegida
  const productosFiltrados = categoriaSeleccionada === 'Todas' 
    ? productos 
    : productos.filter(producto => producto.categoria === categoriaSeleccionada);

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Tienda de Deportes & Performance</h2>
      
      {/* Botones de selección de categoría */}
      <div className="d-flex flex-wrap gap-2 justify-content-center mb-4">
        {listaCategorias.map((categoria, indice) => (
          <button 
            key={indice}
            className={`btn ${categoriaSeleccionada === categoria ? 'btn-primary' : 'btn-outline-dark'}`}
            onClick={() => setCategoriaSeleccionada(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>

      <h3 className="mb-3 border-bottom pb-2">{categoriaSeleccionada}</h3>

      {/* Cuadrícula de Productos */}
      <div className="row g-4">
        {productosFiltrados.map((producto) => (
          <div key={producto.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="card h-100 shadow-sm position-relative">
              
              {/* Etiqueta si el producto está en oferta */}
              {producto.oferta === 1 && (
                <span className="badge bg-danger position-absolute top-0 end-0 m-2 px-3 py-2">
                  ¡OFERTA!
                </span>
              )}

              {/* Imagen leída directamente desde MySQL */}
              <img 
                src={producto.imagen || 'https://via.placeholder.com/400x300'} 
                className="card-img-top" 
                alt={producto.nombre}
                style={{ height: '200px', objectFit: 'cover' }}
              />

              <div className="card-body d-flex flex-column">
                <span className="text-uppercase text-muted small fw-bold">{producto.categoria}</span>
                <h5 className="card-title mt-1">{producto.nombre}</h5>
                <p className="card-text text-primary fs-5 fw-bold mb-1">
                  ${producto.precio.toLocaleString('es-CL')}
                </p>

                {/* Nivel de Stock en MySQL */}
                <p className={`card-text small mb-3 ${producto.stock > 5 ? 'text-success' : producto.stock > 0 ? 'text-warning fw-bold' : 'text-danger fw-bold'}`}>
                  {producto.stock > 5 
                    ? `Stock: ${producto.stock} unidades` 
                    : producto.stock > 0 
                      ? `¡Últimas ${producto.stock} unidades!` 
                      : 'Agotado'}
                </p>

                <button 
                  className="btn btn-dark mt-auto w-100" 
                  onClick={() => agregarAlCarrito(producto)}
                  disabled={producto.stock <= 0}
                >
                  {producto.stock > 0 ? 'Añadir al Carrito' : 'Sin Stock'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}