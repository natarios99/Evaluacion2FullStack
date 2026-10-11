import React from 'react';

export default function PaymentSuccess({ orderData, onBackHome }) {
  return (
    <div className="container my-5 text-center" style={{ maxWidth: '600px' }}>
      <div className="card p-4 shadow">
        <div className="text-success mb-3" style={{ fontSize: '3rem' }}>✓</div>
        <h3 className="text-success">Se ha realizado la compra</h3>
        <p className="fw-bold">Código de Orden: #{orderData?.id || '20240705'}</p>
        
        <div className="text-start bg-light p-3 rounded mb-3">
          <h5>Detalles del cliente</h5>
          <p className="mb-1"><strong>Nombre:</strong> {orderData?.nombre || 'Pedro Hacker'}</p>
          <p className="mb-1"><strong>Email:</strong> {orderData?.correo || 'pedro@example.com'}</p>
          <p className="mb-1"><strong>Dirección:</strong> {orderData?.calle}, {orderData?.comuna}</p>
        </div>

        <h4 className="my-3">Total pagado: ${orderData?.total?.toLocaleString('es-CL')}</h4>
        <button className="btn btn-primary" onClick={onBackHome}>Volver a la tienda</button>
      </div>
    </div>
  );
}