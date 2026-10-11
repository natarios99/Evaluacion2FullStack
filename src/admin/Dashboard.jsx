import React from 'react';

export default function Dashboard({ products, setCurrentView }) {
  const stockCritico = products.filter(p => p.stock <= 5);

  return (
    <div className="container-fluid py-4">
      <h2>Dashboard Administrador</h2>
      <p className="text-muted">Resumen de las actividades diarias</p>

      {/* Tarjetas Superiores */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card bg-primary text-white p-3">
            <h5>Compras</h5>
            <h3>1,234</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success text-white p-3">
            <h5>Productos Totales</h5>
            <h3>{products.length}</h3>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-dark p-3">
            <h5>Stock Crítico</h5>
            <h3>{stockCritico.length}</h3>
          </div>
        </div>
      </div>

      {/* Grid de Accesos Directos */}
      <div className="row g-3">
        <div className="col-md-4">
          <button className="card w-100 p-3 text-start shadow-sm btn btn-light" onClick={() => setCurrentView('admin-productos')}>
            <h5>📦 Productos</h5>
            <p className="text-muted m-0">Administrar inventario y detalles</p>
          </button>
        </div>
        <div className="col-md-4">
          <button className="card w-100 p-3 text-start shadow-sm btn btn-light" onClick={() => setCurrentView('admin-ordenes')}>
            <h5>🧾 Órdenes / Boletas</h5>
            <p className="text-muted m-0">Gestión de órdenes de compra</p>
          </button>
        </div>
        <div className="col-md-4">
          <button className="card w-100 p-3 text-start shadow-sm btn btn-light" onClick={() => setCurrentView('home')}>
            <h5>🏪 Ver Tienda</h5>
            <p className="text-muted m-0">Visualiza la tienda en tiempo real</p>
          </button>
        </div>
      </div>
    </div>
  );
}