import React, { useState, useEffect } from 'react';

import Inicio from './vistas/Inicio';
import Categorias from './vistas/Categorias';
import DetalleProducto from './vistas/DetalleProducto';
import Ofertas from './vistas/Ofertas';
import Blogs from './vistas/Blogs';
import Contacto from './vistas/Contacto';
import RegistroUsuario from './vistas/RegistroUsuario';
import IniciarSesion from './vistas/IniciarSesion';
import Admin from './vistas/Admin';
import VistaCarrito from './vistas/VistaCarrito';
import PagoExitoso from './vistas/PagoExitoso';
import PagoError from './vistas/PagoError';
import ReactDOM from 'react-dom/client';
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from './App';
import AdminProductos from './vistas/Admin';


const URL_API = 'http://localhost:8081/api/v1';

export default function Aplicacion() {
  const [vistaActual, setVistaActual] = useState('inicio');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [ultimoPedido, setUltimoPedido] = useState(null);
  const [usuarioActual, setUsuarioActual] = useState(null);

  const rolActual = usuarioActual?.rol || localStorage.getItem('rol') || 'INVITADO';
  const puedeVerPanel = rolActual === 'ADMIN' || rolActual === 'VENDEDOR';

  const cargarProductosDesdeMySQL = async () => {
    try {
      const respuesta = await fetch(`${URL_API}/productos`);
      if (respuesta.ok) {
        const datos = await respuesta.json();
        setProductos(datos);
      }
    } catch (error) {
      console.error('Error al conectar con la base de datos:', error);
    }
  };

  useEffect(() => {
    cargarProductosDesdeMySQL();
  }, []);

  const manejarLoginExitoso = (datosUsuario) => {
    setUsuarioActual(datosUsuario);
    if (datosUsuario.rol === 'ADMIN' || datosUsuario.rol === 'VENDEDOR') {
      setVistaActual('admin-productos');
    } else {
      setVistaActual('categorias');
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    setUsuarioActual(null);
    setVistaActual('inicio');
  };

  const agregarAlCarrito = (producto) => {
    if (producto.stock <= 0) {
      alert('Producto agotado');
      return;
    }
    const existente = carrito.find(item => item.id === producto.id);
    if (existente) {
      if (existente.cantidad >= producto.stock) {
        alert(`Stock máximo disponible: ${producto.stock}`);
        return;
      }
      setCarrito(carrito.map(item => item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item));
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const actualizarCantidadCarrito = (id, nuevaCantidad) => {
    setCarrito(carrito.map(item => item.id === id ? { ...item, cantidad: nuevaCantidad } : item));
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter(item => item.id !== id));
  };

  const verDetalleProducto = (producto) => {
    setProductoSeleccionado(producto);
    setVistaActual('detalle');
  };

  const manejarCompraExitosa = async (boletaCreada) => {
    setUltimoPedido({
      id: boletaCreada.id,
      nombre: usuarioActual?.nombre || 'Cliente Registrado',
      correo: usuarioActual?.email || 'cliente@ejemplo.com',
      total: boletaCreada.total
    });

    await cargarProductosDesdeMySQL();
    setVistaActual('pago-exitoso');
  };

  const totalPagar = carrito.reduce((suma, item) => suma + (item.precio || 0) * (item.cantidad || 0), 0);
  const totalItemsCarrito = carrito.reduce((suma, item) => suma + (item.cantidad || 0), 0);

    return (
    <GoogleOAuthProvider clientId="363954419431-udb0unt0hpmbh00g4qhj9rtu0cbl1a3b.apps.googleusercontent.com">
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
          <div className="container">
            <button className="navbar-brand btn btn-link text-white fw-bold text-decoration-none" onClick={() => setVistaActual('inicio')}>
               Tienda NATO SPORTS
            </button>
            
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#menuNavegacion">
              <span className="navbar-toggler-icon"></span>
            </button>

          <div className="collapse navbar-collapse" id="menuNavegacion">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <button className={`nav-link btn ${vistaActual === 'inicio' ? 'active fw-bold' : ''}`} onClick={() => setVistaActual('inicio')}>Inicio</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link btn ${vistaActual === 'categorias' ? 'active fw-bold' : ''}`} onClick={() => setVistaActual('categorias')}>Categorías</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link btn ${vistaActual === 'ofertas' ? 'active fw-bold' : ''}`} onClick={() => setVistaActual('ofertas')}>Ofertas</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link btn ${vistaActual === 'blogs' ? 'active fw-bold' : ''}`} onClick={() => setVistaActual('blogs')}>Blog</button>
              </li>
              <li className="nav-item">
                <button className={`nav-link btn ${vistaActual === 'contacto' ? 'active fw-bold' : ''}`} onClick={() => setVistaActual('contacto')}>Contacto</button>
              </li>
              <li className="nav-item border-start ps-2 ms-2">
                <button className={`nav-link btn text-warning ${vistaActual === 'admin-productos' ? 'fw-bold' : ''}`} onClick={() => setVistaActual('admin-productos')}>Panel Admin</button>
              </li>
            </ul>

            <div className="d-flex gap-2">
              <button className="btn btn-outline-light btn-sm" onClick={() => setVistaActual('iniciar-sesion')}>Iniciar Sesión</button>
              <button className="btn btn-primary btn-sm" onClick={() => setVistaActual('registro')}>Registro</button>
              
              <button className="btn btn-success btn-sm ms-2" onClick={() => setVistaActual('carrito')}>
                 ({totalItemsCarrito}) - ${totalPagar.toLocaleString('es-CL')}
              </button>
            </div>
          </div>
        </div>
      </nav>

        <main>
          {vistaActual === 'inicio' && (
            <Inicio 
              cambiarVista={setVistaActual} 
              agregarAlCarrito={agregarAlCarrito} 
              verDetalle={verDetalleProducto} 
            />
          )}
          
          {vistaActual === 'categorias' && (
            <Categorias 
              productos={productos} 
              agregarAlCarrito={agregarAlCarrito} 
              verDetalle={verDetalleProducto} 
            />
          )}

          {vistaActual === 'detalle' && (
            <DetalleProducto 
              producto={productoSeleccionado} 
              agregarAlCarrito={agregarAlCarrito} 
              cambiarVista={setVistaActual} 
            />
          )}

        {vistaActual === 'ofertas' && <Ofertas productos={productos} agregarAlCarrito={agregarAlCarrito} />}
        {vistaActual === 'blogs' && <Blogs />}
        {vistaActual === 'contacto' && <Contacto />}
        
        {vistaActual === 'registro' && <RegistroUsuario cambiarVista={setVistaActual} URL_API={URL_API} />}
        {vistaActual === 'iniciar-sesion' && <IniciarSesion cambiarVista={setVistaActual} URL_API={URL_API} />}
        
        {vistaActual === 'carrito' && (
          <VistaCarrito 
            cart={carrito}
            onUpdateQuantity={actualizarCantidadCarrito}
            onRemove={eliminarDelCarrito}
            onProceedToCheckout={procesarPagoYDescontarStock}
            onSimulateError={() => setVistaActual('pago-error')}
            URL_API={URL_API}
          />
        )}

        {vistaActual === 'pago-exitoso' && (
          <PagoExitoso 
            orderData={ultimoPedido} 
            onBackHome={() => setVistaActual('inicio')} 
          />
        )}

        {vistaActual === 'pago-error' && (
          <PagoError 
            onRetry={() => setVistaActual('carrito')} 
          />
        )}

        {vistaActual === 'admin-productos' && (
          <GestionProductos 
            productos={productos} 
            recargarProductosDesdeMySQL={cargarProductosDesdeMySQL} 
            URL_API={URL_API} 
          />
        )}
      </main>
    </div>
  );
}
