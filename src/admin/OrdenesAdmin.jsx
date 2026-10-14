import React, { useState, useEffect } from 'react';

const URL_API = 'http://localhost:3000/api';

export default function OrdenesAdmin() {
  const [ordenes, setOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarOrdenes = async () => {
    try {
      const res = await fetch(`${URL_API}/ordenes`);
      if (res.ok) {
        const data = await res.json();
        setOrdenes(data);
      }
    } catch (error) {
      console.error('Error al cargar órdenes:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarOrdenes();
  }, []);

  if (cargando) return <p>Cargando historial de pedidos...</p>;

  return (
    <div className="container py-4">
      <h3>Historial de Pedidos / Órdenes</h3>
      <p className="text-muted">Compras realizadas en la tienda</p>

      {ordenes.length === 0 ? (
        <div className="alert alert-info">No hay pedidos registrados en la base de datos.</div>
      ) : (
        <div className="table-responsive bg-white shadow-sm rounded p-3">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID Orden</th>
                <th>ID Usuario</th>
                <th>Total ($)</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {ordenes.map((orden) => (
                <tr key={orden.id}>
                  <td>#{orden.id}</td>
                  <td>{orden.usuario_id || 'Cliente Invitado'}</td>
                  <td className="fw-bold text-success">${Number(orden.total).toLocaleString()}</td>
                  <td>{orden.fecha ? new Date(orden.fecha).toLocaleString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}