import React from 'react';

export default function PaymentError({ onRetry }) {
  return (
    <div className="container my-5 text-center" style={{ maxWidth: '600px' }}>
      <div className="card p-4 shadow border-danger">
        <div className="text-danger mb-3" style={{ fontSize: '3rem' }}>☒</div>
        <h3 className="text-danger">No se pudo realizar el pago</h3>
        <p className="text-muted">Ocurrió un inconveniente al procesar tu transacción.</p>
        <div className="my-4">
          <button className="btn btn-success btn-lg w-100" onClick={onRetry}>
            VOLVER A REALIZAR EL PAGO
          </button>
        </div>
      </div>
    </div>
  );
}