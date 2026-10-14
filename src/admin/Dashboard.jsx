import React, { useState, useEffect } from 'react';

export default function Dashboard({ setCurrentView }) {
  const [stats, setStats] = useState({
    compras: 0,
    probabilidadAumento: 0,
    productos: 0,
    inventarioActual: 0,
    usuarios: 0,
    nuevosUsuariosMes: 0
  });

  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    fetch('http://localhost:3000/api/admin/stats')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setCargando(false);
      })
      .catch((err) => {
        console.error('Error al conectar con la base de datos:', err);
        setCargando(false);
      });
  }, []);

  if (cargando) {
    return <div className="container-fluid py-4"><p>Cargando datos desde la base de datos...</p></div>;
  }

  return (
    <div className="container-fluid py-4">
      <h2>Dashboard Administrador</h2>
      <p className="text-muted">Resumen de las actividades diarias</p>

      {/* Tarjetas Superiores */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white p-3">
            <h5>Compras</h5>
            <h3>{stats.compras.toLocaleString()}</h3>
            <small>Probabilidad de aumento: {stats.probabilidadAumento}%</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white p-3">
            <h5>Productos Totales</h5>
            <h3>{stats.productos}</h3>
            <small>Inventario actual: {stats.inventarioActual}</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-dark p-3">
            <h5>Usuarios Registrados</h5>
            <h3>{stats.usuarios}</h3>
            <small>Nuevos usuarios este mes: {stats.nuevosUsuariosMes}</small>
          </div>
        </div>
      </div>


      <div className="row g-3">
        <div className="col-md-4">
          <button 
            className="card w-100 p-3 text-start shadow-sm btn btn-light" 
            onClick={() => setCurrentView('admin-productos')}
          >
            <h5>Productos</h5>
            <p className="text-muted m-0">Administrar inventario y detalles</p>
          </button>
        </div>
        <div className="col-md-4">
          <button 
            className="card w-100 p-3 text-start shadow-sm btn btn-light" 
            onClick={() => setCurrentView('admin-ordenes')}
          >
            <h5>Órdenes / Boletas</h5>
            <p className="text-muted m-0">Gestión de órdenes de compra</p>
          </button>
        </div>
        <div className="col-md-4">
          <button 
            className="card w-100 p-3 text-start shadow-sm btn btn-light" 
            onClick={() => setCurrentView('home')}
          >
            <h5>Ver Tienda</h5>
            <p className="text-muted m-0">Visualiza la tienda en tiempo real</p>
          </button>
        </div>
      </div>
    </div>
  );
}