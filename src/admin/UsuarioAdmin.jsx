import React, { useState, useEffect } from 'react';

const URL_API = 'http://localhost:3000/api';

export default function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarUsuarios = async () => {
    try {
      const res = await fetch(`${URL_API}/usuarios`);
      if (res.ok) {
        const data = await res.json();
        setUsuarios(data);
      }
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  if (cargando) return <p>Cargando lista de usuarios...</p>;

  return (
    <div className="container py-4">
      <h3>Lista de Usuarios</h3>
      <p className="text-muted">Usuarios registrados en la base de datos</p>

      {usuarios.length === 0 ? (
        <div className="alert alert-info">No hay usuarios registrados aún.</div>
      ) : (
        <div className="table-responsive bg-white shadow-sm rounded p-3">
          <table className="table table-hover align-middle">
            <thead className="table-dark">
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Fecha Registro</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.nombre || 'Sin nombre'}</td>
                  <td>{user.email || 'Sin correo'}</td>
                  <td>{user.fecha_registro ? new Date(user.fecha_registro).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}