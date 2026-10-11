import React from 'react';

export default function Ofertas({ productos, agregarAlCarrito }) {
  const productosEnOferta = productos.filter(p => p.oferta === 1);

  return (
    <div className="container my-4">
      <div className="alert alert-danger text-center fw-bold fs-4">
        🔥 SECCIÓN DE OFERTAS Y DESCUENTOS DEPORTIVOS
      </div>

      <div className="row g-4">
        {productosEnOferta.map((producto) => (
          <div key={producto.id} className="col-12 col-sm-6 col-md-4">
            <div className="card h-100 shadow-sm border-danger">
              <span className="badge bg-danger position-absolute top-0 end-0 m-2 px-3 py-2">OFERTA</span>
              <img src={producto.imagen} className="card-img-top" alt={producto.nombre} style={{ height: '220px', objectFit: 'cover' }} />
              <div className="card-body d-flex flex-column">
                <h5>{producto.nombre}</h5>
                <p className="text-primary fw-bold fs-4">${producto.precio.toLocaleString('es-CL')}</p>
                <p className="small text-muted">Stock restante: {producto.stock} unidades</p>
                <button className="btn btn-dark mt-auto w-100" onClick={() => agregarAlCarrito(producto)} disabled={producto.stock <= 0}>
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