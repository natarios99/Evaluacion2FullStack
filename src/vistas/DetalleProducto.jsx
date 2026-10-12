import React from 'react';

export default function DetalleProducto({ producto, agregarAlCarrito, cambiarVista }) {
  if (!producto) return null;

  return (
    <div className="container my-5">
      <button className="btn btn-outline-secondary mb-4" onClick={() => cambiarVista('categorias')}>
        ← Volver a Categorías
      </button>

      <div className="row g-4">
        <div className="col-md-6">
          <img 
            src={producto.imagen} 
            className="img-fluid rounded shadow" 
            alt={producto.nombre} 
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
            onError={(e) => { e.target.src = 'https://via.placeholder.com/500x400?text=Sin+Imagen'; }}
          />
        </div>

        <div className="col-md-6 d-flex flex-column">
          <span className="badge bg-secondary w-25 mb-2">{producto.categoria}</span>
          <h2>{producto.nombre}</h2>
          <h3 className="text-primary my-3">${producto.precio?.toLocaleString('es-CL')}</h3>
          <p className={`fw-bold ${producto.stock > 0 ? 'text-success' : 'text-danger'}`}>
            {producto.stock > 0 ? `Stock disponible: ${producto.stock} unidades` : 'Producto Agotado'}
          </p>

          <button 
            className="btn btn-dark btn-lg mt-auto" 
            onClick={() => agregarAlCarrito(producto)} 
            disabled={producto.stock <= 0}
          >
            {producto.stock > 0 ? 'Añadir al Carrito' : 'Sin Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}