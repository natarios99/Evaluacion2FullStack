import React from 'react';
import '/css/pagoExitoso.css';

export default function PagoError({ onRetry }) {
  return (
    <div className="pago-contenedor">
      <div className="pago-tarjeta">
        <h3 className="pago-titulo error">No se pudo realizar el pago</h3>
        <p className="pago-cuerpo">Ocurrio un inconveniente al procesar tu transaccion.</p>
        
        <div className="pago-detalles">
          <h5>Estado de la transaccion</h5>
          <p><strong>Estado:</strong> Rechazado / Fallido</p>
          <p><strong>Motivo:</strong> Error de comunicacion o datos invalidos</p>
          <p><strong>Sugerencia:</strong> Revisa tu tarjeta o intenta nuevamente</p>
        </div>

        <div className="pago-total">Total a pagar: $0</div>

        <button className="pago-boton" onClick={onRetry}>
          Volver a realizar el pago
        </button>
      </div>
    </div>
  );
}