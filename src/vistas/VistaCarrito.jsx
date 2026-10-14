import React, { useState } from 'react';

export default function VistaCarrito({ 
  cart, 
  onUpdateQuantity, 
  onRemove, 
  onProceedToCheckout, 
  onSimulateError,
  usuarioId = null, 
  onClearCart, 
  URL_API = 'http://localhost:3000/api' 
}) {
  const [procesando, setProcesando] = useState(false);
  const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  const manejarCompra = async () => {
    if (cart.length === 0) return;

    setProcesando(true);

    try {
      const respuesta = await fetch(`${URL_API}/ordenes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          usuario_id: usuarioId, 
          total: total,
          carrito: cart
        })
      });

      if (respuesta.ok) {


        if (onClearCart) {
          onClearCart();
        }

        if (onProceedToCheckout) {
          onProceedToCheckout();
        }
      } else {
        const errorData = await respuesta.json().catch(() => ({}));
        alert(`Error al procesar la compra: ${errorData.error || 'Inténtalo de nuevo'}`);
      }
    } catch (error) {
      console.error('Error de red al procesar la compra:', error);
      alert('No se pudo conectar con el servidor.');
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div className="container my-4">
      <div className="row">
        <div className="col-md-12">
          <h2>Carrito de Compras</h2>
          {cart.length === 0 ? (
            <div className="alert alert-info">El carrito está vacío.</div>
          ) : (
            <div className="table-responsive">
              <table className="table align-middle">
                <thead>
                  <tr>
                    <th>Imagen</th>
                    <th>Nombre</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map(item => (
                    <tr key={item.id}>
                      <td>
                        <img 
                          src={item.imagen || item.img || 'https://via.placeholder.com/50x50'} 
                          alt={item.nombre} 
                          width="50" 
                          height="50"
                          style={{ objectFit: 'cover' }}
                        />
                      </td>
                      <td>{item.nombre}</td>
                      <td>${item.precio.toLocaleString('es-CL')}</td>
                      <td>
                        <input 
                          type="number" 
                          min="1" 
                          value={item.cantidad} 
                          className="form-control w-50"
                          onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value) || 1)}
                        />
                      </td>
                      <td>${(item.precio * item.cantidad).toLocaleString('es-CL')}</td>
                      <td>
                        <button className="btn btn-danger btn-sm" onClick={() => onRemove(item.id)}>Eliminar</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="d-flex justify-content-between align-items-center mt-3">
                <h4>Total: ${total.toLocaleString('es-CL')}</h4>
                <div className="d-flex gap-2">
                  <button 
                    className="btn btn-outline-danger btn-lg" 
                    onClick={onSimulateError}
                  >
                    Simular Error de Pago
                  </button>
                  <button 
                    className="btn btn-success btn-lg" 
                    onClick={manejarCompra}
                    disabled={procesando}
                  >
                    {procesando ? 'Procesando...' : 'Comprar ahora'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}