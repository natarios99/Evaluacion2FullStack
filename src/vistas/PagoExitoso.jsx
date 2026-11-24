import React from 'react';
import '/css/pago.css';

export default function PagoExitoso({ boleta, cambiarVista }) {
  const nombreComprador =
    boleta?.usuario?.nombre ||
    localStorage.getItem('usuarioNombre') ||
    'Cliente Registrado';

  const emailComprador =
    boleta?.usuario?.email ||
    localStorage.getItem('usuarioEmail') ||
    'No especificado';

  return (
    <div className="container my-5" style={{ maxWidth: '600px' }}>
      <div className="card p-4 shadow-sm text-center">
        <div className="mb-3 text-success" style={{ fontSize: '3rem' }}>
          ✓
        </div>
        <h2 className="text-success mb-2">¡Compra Realizada con Éxito!</h2>
        <p className="text-muted mb-4">
          Gracias por tu preferencia en <strong>Tienda NATO SPORTS</strong>.
        </p>

        <div className="bg-light p-3 rounded text-start mb-4 border">
          <h5 className="border-bottom pb-2 mb-3">Comprobante de Pago</h5>
          <p className="mb-1">
            <strong>N° de Boleta:</strong> #{boleta?.id || 'Generada'}
          </p>
          <p className="mb-1">
            <strong>Comprador:</strong> {nombreComprador}
          </p>
          <p className="mb-1">
            <strong>Correo de la cuenta:</strong> {emailComprador}
          </p>
          <p className="mb-1">
            <strong>Fecha:</strong>{' '}
            {boleta?.fecha
              ? new Date(boleta.fecha).toLocaleString('es-CL')
              : new Date().toLocaleString('es-CL')}
          </p>
          <p className="mb-0 fs-5 mt-2 pt-2 border-top">
            <strong>Total Pagado:</strong>{' '}
            <span className="text-success fw-bold">
              ${Number(boleta?.total || 0).toLocaleString('es-CL')}
            </span>
          </p>
        </div>

        <div className="d-flex justify-content-center gap-2">
          <button
            className="btn btn-primary"
            onClick={() => cambiarVista && cambiarVista('categorias')}
          >
            Seguir Comprando
          </button>
          <button
            className="btn btn-outline-secondary"
            onClick={() => cambiarVista && cambiarVista('perfil')}
          >
            Ver Mi Perfil y Compras
          </button>
        </div>
      </div>
    </div>
  );
}