import React from 'react';


function obtenerEmailDesdeToken() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payloadBase64 = token.split('.')[1];
    const payload = JSON.parse(atob(payloadBase64));
    return payload.sub || payload.email || null;
  } catch {
    return null;
  }
}

export default function PagoExitoso({ boleta, usuario, cambiarVista }) {
  const numeroBoleta = boleta?.id ?? boleta?.idBoleta ?? 'Sin ID';

  return (
    <div className="container my-5" style={{ maxWidth: '600px' }}>
      <div className="card p-4 shadow-sm text-center">
        <h2 className="text-success mb-2">¡Compra Realizada con Éxito!</h2>

        <div className="bg-light p-3 rounded text-start mb-4 border">
          <h5 className="border-bottom pb-2 mb-3">Comprobante de Pago</h5>
          <p className="mb-1">
            <strong>N° de Boleta:</strong> #{numeroBoleta}
          </p>
          <p className="mb-1">
            <strong>Comprador:</strong>{' '}
            {boleta?.usuario?.nombre || localStorage.getItem('usuarioNombre') || 'Cliente'}
          </p>
          <p className="mb-1">
            <strong>Correo:</strong>{' '}
            {boleta?.usuario?.email || localStorage.getItem('usuarioEmail') || 'No especificado'}
          </p>
          <p className="mb-0 fs-5 mt-2 pt-2 border-top">
            <strong>Total Pagado:</strong>{' '}
            <span className="text-success fw-bold">
              ${Number(boleta?.total || 0).toLocaleString('es-CL')}
            </span>
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => cambiarVista && cambiarVista('categorias')}
        >
          Seguir Comprando
        </button>
      </div>
    </div>
  );
}