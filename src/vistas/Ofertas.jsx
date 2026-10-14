import React from 'react';
import '/css/ofertas.css';

export default function Ofertas({ productos, agregarAlCarrito }) {
  const productosEnOferta = productos.filter(p => p.oferta === 1);

  return (
    <div className="ofertas-contenedor">
      <div className="ofertas-banner">
        🔥 SECCIÓN DE OFERTAS Y DESCUENTOS DEPORTIVOS
      </div>

      <div className="ofertas-grid">
        {productosEnOferta.map((producto) => (
          <div key={producto.id} className="oferta-tarjeta">
            <span className="oferta-badge">OFERTA</span>
            
            <img 
              src={producto.imagen || producto.img} 
              className="oferta-imagen" 
              alt={producto.nombre} 
              onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Sin+Imagen'; }}
            />
            
            <div className="oferta-info">
              <h5 className="oferta-titulo">{producto.nombre}</h5>
              <p className="oferta-precio">${producto.precio.toLocaleString('es-CL')}</p>
              <p className="oferta-stock">Stock restante: {producto.stock} unidades</p>
              
              <button 
                className="oferta-boton" 
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