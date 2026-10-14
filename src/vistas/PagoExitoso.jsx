import React from 'react';
import '/css/pagoExitoso.css';

export default function PagoExitoso({ orderData, onBackHome }) {
  return (
    <div className="pago-contenedor">
      <div className="pago-tarjeta">
        <h3 className="pago-titulo exito">Se ha realizado la compra</h3>
        <p className="pago-cuerpo">Codigo de Orden: #{orderData?.id || '20240705'}</p>
        
        <div className="pago-detalles">
          <h5>Detalles del cliente</h5>
          <p><strong>Nombre:</strong> {orderData?.nombre || 'Cliente Invitado'}</p>
          <p><strong>Email:</strong> {orderData?.email || orderData?.correo || 'cliente@ejemplo.com'}</p>
          <p><strong>Direccion:</strong> {orderData?.calle ? `${orderData.calle}, ${orderData.comuna}` : 'Santiago, Chile'}</p>
        </div>

        <div className="pago-total">Total pagado: ${orderData?.total?.toLocaleString('es-CL')}</div>
        
        <button className="pago-boton" onClick={onBackHome}>
          Volver a la tienda
        </button>
      </div>
    </div>
  );
}