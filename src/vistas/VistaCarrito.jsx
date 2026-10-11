import React from 'react';

export default function CartView({ cart, onUpdateQuantity, onRemove, onProceedToCheckout }) {
  const total = cart.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

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
                      <td><img src={item.img || 'https://via.placeholder.com/50x50'} alt={item.nombre} width="50" /></td>
                      <td>{item.nombre}</td>
                      <td>${item.precio.toLocaleString('es-CL')}</td>
                      <td>
                        <input 
                          type="number" 
                          min="1" 
                          value={item.cantidad} 
                          className="form-control w-50"
                          onChange={(e) => onUpdateQuantity(item.id, parseInt(e.target.value))}
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
                <button className="btn btn-success btn-lg" onClick={onProceedToCheckout}>
                  Comprar ahora
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}