import React, { useState } from 'react';

export default function DetalleProducto({ producto, agregarAlCarrito, cambiarVista }) {
  const [cantidad, setCantidad] = useState(1);

  if (!producto) {
    return (
      <div className="container my-5 text-center">
        <h3>No se seleccionó ningún producto.</h3>
        <button className="btn btn-primary mt-3" onClick={() => cambiarVista('categorias')}>Volver al catálogo</button>
      </div>
    );
  }

  const manejarAgregar = () => {
    for (let i = 0; i < cantidad; i++) {
      agregarAlCarrito(producto);
    }
  };

  return (
    <div className="container my-5">
      <button className="btn btn-outline-secondary mb-4" onClick={() => cambiarVista('categorias')}>
        ← Volver a Categorías
      </button>

      <div className="row g-4">
        {/* Imagen del producto */}
        <div className="col-md-6">
          <img 
            src={producto.imagen || 'https://via.placeholder.com/500x400'} 
            className="img-fluid rounded shadow" 
            alt={producto.nombre} 
            style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
          />
        </div>

        {/* Detalles del producto */}
        <div className="col-md-6 d-flex flex-column">
          <span className="badge bg-secondary w-25 mb-2">{producto.categoria}</span>
          <h2>{producto.nombre}</h2>
          <h3 className="text-primary my-3">${producto.precio?.toLocaleString('es-CL')}</h3>

          <p className="text-muted">
            Equipamiento deportivo de alto rendimiento fabricado con materiales de primera calidad. Diseñado para ofrecer durabilidad y máximo confort durante tu entrenamiento.
          </p>

          <p className={`fw-bold ${producto.stock > 0 ? 'text-success' : 'text-danger'}`}>
            {producto.stock > 0 ? `Stock disponible: ${producto.stock} unidades` : 'Producto Agotado'}
          </p>

          {producto.stock > 0 && (
            <div className="d-flex align-items-center gap-3 my-3">
              <label className="fw-bold">Cantidad:</label>
              <input 
                type="number" 
                min="1" 
                max={producto.stock} 
                value={cantidad} 
                className="form-control w-25" 
                onChange={(e) => setCantidad(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
          )}

          <button 
            className="btn btn-dark btn-lg mt-auto" 
            onClick={manejarAgregar} 
            disabled={producto.stock <= 0}
          >
            {producto.stock > 0 ? 'Añadir al Carrito' : 'Sin Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}