import React from 'react';

export default function Inicio({ cambiarVista }) {
  return (
    <div className="container my-4">
      {/* Banner Principal */}
      <div className="p-5 mb-4 bg-dark text-white rounded-3 text-center">
        <h1 className="display-4 fw-bold">EQUÍPATE PARA EL RENDIMIENTO</h1>
        <p className="fs-4">Encuentra el mejor calzado, ropa y accesorios deportivos al mejor precio.</p>
        <button className="btn btn-primary btn-lg mt-3" onClick={() => cambiarVista('categorias')}>
          Ver Catálogo Completo
        </button>
      </div>

      {/* Tarjetas de Accesos Rápidos */}
      <div className="row g-4 text-center">
        <div className="col-md-4">
          <div className="card p-4 shadow-sm h-100">
            <h3>👟 Calzado Deportivo</h3>
            <p className="text-muted">Zapatillas para running, fútbol y entrenamiento.</p>
            <button className="btn btn-outline-dark mt-auto" onClick={() => cambiarVista('categorias')}>Ver Calzado</button>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-4 shadow-sm h-100">
            <h3>🔥 Ofertas Especiales</h3>
            <p className="text-muted">Descuentos exclusivos en equipamiento seleccionado.</p>
            <button className="btn btn-outline-danger mt-auto" onClick={() => cambiarVista('ofertas')}>Ver Ofertas</button>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card p-4 shadow-sm h-100">
            <h3>📰 Blog Deportivo</h3>
            <p className="text-muted">Consejos de entrenamiento, nutrición y rendimiento.</p>
            <button className="btn btn-outline-dark mt-auto" onClick={() => cambiarVista('blogs')}>Leer Artículos</button>
          </div>
        </div>
      </div>
    </div>
  );
}