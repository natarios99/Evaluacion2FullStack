import React from 'react';

export default function Navbar({ cartCount, cartTotal, currentView, setCurrentView }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm sticky-top">
      <div className="container">
        <button className="navbar-brand btn btn-link fw-bold text-dark text-decoration-none" onClick={() => setCurrentView('home')}>
          MiTienda
        </button>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <button className={`nav-link btn ${currentView === 'home' ? 'fw-bold' : ''}`} onClick={() => setCurrentView('home')}>Home</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link btn ${currentView === 'categorias' ? 'fw-bold' : ''}`} onClick={() => setCurrentView('categorias')}>Categorías</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link btn ${currentView === 'ofertas' ? 'fw-bold' : ''}`} onClick={() => setCurrentView('ofertas')}>Ofertas</button>
            </li>
            <li className="nav-item">
              <button className={`nav-link btn ${currentView === 'admin' ? 'fw-bold text-primary' : ''}`} onClick={() => setCurrentView('admin')}>Panel Admin</button>
            </li>
          </ul>
          <div className="d-flex align-items-center gap-2">
            <button className="btn btn-success" onClick={() => setCurrentView('carrito')}>
              🛒 Carrito ({cartCount}) - ${cartTotal.toLocaleString('es-CL')}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}