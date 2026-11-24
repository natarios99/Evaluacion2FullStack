import React, { useState, useEffect } from 'react';

export default function Perfil({ cambiarVista, onLogout, URL_API = 'http://localhost:8081/api/v1' }) {
  const nombre = localStorage.getItem('usuarioNombre') || 'Usuario';
  const email = localStorage.getItem('usuarioEmail') || '';
  const rol = (localStorage.getItem('rol') || 'CLIENTE').toUpperCase();
  const token = localStorage.getItem('token');

  const [misBoletas, setMisBoletas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarMisCompras = async () => {
      if (!token) {
        setCargando(false);
        return;
      }
      try {
        const res = await fetch(`${URL_API}/boletas`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (res.ok) {
          const todas = await res.json();
          const filtradas = todas.filter(
            (b) => b.usuario?.email?.toLowerCase() === email.toLowerCase()
          );
          setMisBoletas(filtradas);
        }
      } catch (error) {
        console.error('Error al cargar historial de compras:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarMisCompras();
  }, [email, token, URL_API]);

  const manejarCerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('usuarioEmail');
    if (onLogout) onLogout();
    if (cambiarVista) cambiarVista('inicio');
  };

  return (
    <div className="container my-5" style={{ maxWidth: '850px' }}>
      <div className="card shadow-sm p-4 mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <span className="badge bg-primary mb-2">{rol}</span>
            <h3 className="mb-1">{nombre}</h3>
            <p className="text-muted mb-0">{email}</p>
          </div>
          <div className="d-flex gap-2">
            {(rol === 'ADMIN' || rol === 'VENDEDOR') && (
              <button
                className="btn btn-warning"
                onClick={() => cambiarVista && cambiarVista('admin-productos')}
              >
                {rol === 'ADMIN' ? 'Ir a Panel Admin' : 'Ir a Panel Vendedor'}
              </button>
            )}
            <button className="btn btn-outline-danger" onClick={manejarCerrarSesion}>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>

      <div className="card shadow-sm p-4">
        <h4 className="mb-3">Mis Compras Realizadas</h4>
        {cargando ? (
          <p className="text-muted">Cargando historial...</p>
        ) : misBoletas.length === 0 ? (
          <div className="alert alert-light border text-center mb-0">
            Aún no tienes compras registradas con esta cuenta.
          </div>
        ) : (
          <div className="table-responsive">
            <table className="table align-middle mb-0">
              <thead>
                <tr>
                  <th>N° Boleta</th>
                  <th>Fecha</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {misBoletas.map((b) => (
                  <tr key={b.id}>
                    <td><strong>#{b.id}</strong></td>
                    <td>{b.fecha ? new Date(b.fecha).toLocaleString('es-CL') : 'N/A'}</td>
                    <td className="text-success fw-bold">
                      ${Number(b.total).toLocaleString('es-CL')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}