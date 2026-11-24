import React, { useState, useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

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
import Perfil from './vistas/Perfil';
import '/css/admin.css';

const URL_API = 'http://localhost:8081/api/v1';
const GOOGLE_CLIENT_ID = '363954419431-udb0unt0hpmbh00g4qhj9rtu0cbl1a3b.apps.googleusercontent.com';

export default function Aplicacion() {
  const [vistaActual, setVistaActual] = useState('inicio');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [ultimaBoleta, setUltimaBoleta] = useState(null);
  const [avisoGlobal, setAvisoGlobal] = useState(null);

  const tokenActual = localStorage.getItem('token');
  const estaAutenticado = Boolean(tokenActual || usuarioActual);
  const nombreUsuario = usuarioActual?.nombre || localStorage.getItem('usuarioNombre') || 'Mi Perfil';
  const rolActual = (usuarioActual?.rol || localStorage.getItem('rol') || 'INVITADO').toUpperCase();
  const puedeVerPanel = rolActual === 'ADMIN' || rolActual === 'VENDEDOR';

  const mostrarAviso = (texto, tipo = 'warning') => {
    setAvisoGlobal({ texto, tipo });
    setTimeout(() => setAvisoGlobal(null), 3000);
  };

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

  const actualizarCantidad = (id, nuevaCantidad) => {
    if (nuevaCantidad <= 0) {
      setCarrito(carrito.filter((item) => item.id !== id));
      return;
    }
    setCarrito(
      carrito.map((item) =>
        item.id === id ? { ...item, cantidad: Math.min(nuevaCantidad, item.stock) } : item
      )
    );
  };

  const eliminarDelCarrito = (id) => {
    setCarrito(carrito.filter((item) => item.id !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  const manejarLoginExitoso = (datosUsuario) => {
    setUsuarioActual(datosUsuario);
    const rol = (datosUsuario.rol || '').toUpperCase();
    if (rol === 'ADMIN' || rol === 'VENDEDOR') {
      setVistaActual('admin-productos');
    } else {
      setVistaActual('categorias');
    }
  };

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    localStorage.removeItem('usuarioNombre');
    localStorage.removeItem('usuarioEmail');
    setUsuarioActual(null);
    setVistaActual('inicio');
  };

  const agregarAlCarrito = (producto) => {
    if (producto.stock <= 0) {
      mostrarAviso('Este producto está agotado.', 'danger');
      return;
    }
    const existente = carrito.find((item) => item.id === producto.id);
    if (existente) {
      if (existente.cantidad >= producto.stock) {
        mostrarAviso(`Stock máximo disponible: ${producto.stock} unidades.`, 'warning');
        return;
      }
      setCarrito(
        carrito.map((item) =>
          item.id === producto.id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const verDetalleProducto = (producto) => {
    setProductoSeleccionado(producto);
    setVistaActual('detalle');
  };

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <div>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
          <div className="container">
            <button
              className="navbar-brand btn btn-link text-white fw-bold text-decoration-none"
              onClick={() => setVistaActual('inicio')}
            >
              Tienda NATO SPORTS
            </button>

            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#menuNavegacion"
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="menuNavegacion">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <button
                    className={`nav-link btn ${vistaActual === 'inicio' ? 'active fw-bold' : ''}`}
                    onClick={() => setVistaActual('inicio')}
                  >
                    Inicio
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn ${vistaActual === 'categorias' ? 'active fw-bold' : ''}`}
                    onClick={() => setVistaActual('categorias')}
                  >
                    Categorías
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn ${vistaActual === 'ofertas' ? 'active fw-bold' : ''}`}
                    onClick={() => setVistaActual('ofertas')}
                  >
                    Ofertas
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn ${vistaActual === 'blogs' ? 'active fw-bold' : ''}`}
                    onClick={() => setVistaActual('blogs')}
                  >
                    Blog
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link btn ${vistaActual === 'contacto' ? 'active fw-bold' : ''}`}
                    onClick={() => setVistaActual('contacto')}
                  >
                    Contacto
                  </button>
                </li>
                {puedeVerPanel && (
                  <li className="nav-item border-start ps-2 ms-2">
                    <button
                      className={`nav-link btn text-warning ${vistaActual === 'admin-productos' ? 'fw-bold' : ''}`}
                      onClick={() => setVistaActual('admin-productos')}
                    >
                      {rolActual === 'ADMIN' ? 'Panel Admin' : 'Panel Vendedor'}
                    </button>
                  </li>
                )}
              </ul>

              <div className="d-flex gap-2">
                {!estaAutenticado ? (
                  <>
                    <button
                      className="btn btn-outline-light btn-sm"
                      onClick={() => setVistaActual('iniciar-sesion')}
                    >
                      Iniciar Sesión
                    </button>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => setVistaActual('registro')}
                    >
                      Registro
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={`btn btn-sm ${vistaActual === 'perfil' ? 'btn-light text-dark fw-bold' : 'btn-outline-light'}`}
                      onClick={() => setVistaActual('perfil')}
                    >
                      {nombreUsuario}
                    </button>
                    <button className="btn btn-outline-danger btn-sm" onClick={cerrarSesion}>
                      Salir
                    </button>
                  </>
                )}

                <button
                  className="btn btn-success ms-2"
                  onClick={() => setVistaActual('carrito')}
                >
                  ({carrito.reduce((acc, item) => acc + item.cantidad, 0)}) - $
                  {carrito
                    .reduce((acc, item) => acc + item.precio * item.cantidad, 0)
                    .toLocaleString('es-CL')}
                </button>
              </div>
            </div>
          </div>
        </nav>

        {avisoGlobal && (
          <div className="container mt-3">
            <div className={`alert alert-${avisoGlobal.tipo} py-2 mb-0`} role="alert">
              {avisoGlobal.texto}
            </div>
          </div>
        )}

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

          {vistaActual === 'ofertas' && (
            <Ofertas productos={productos} agregarAlCarrito={agregarAlCarrito} />
          )}
          {vistaActual === 'blogs' && <Blogs />}
          {vistaActual === 'contacto' && <Contacto URL_API={URL_API} />}

          {vistaActual === 'registro' && (
            <RegistroUsuario
              cambiarVista={setVistaActual}
              onLoginSuccess={manejarLoginExitoso}
              URL_API={URL_API}
            />
          )}

          {vistaActual === 'iniciar-sesion' && (
            <IniciarSesion
              cambiarVista={setVistaActual}
              onLoginSuccess={manejarLoginExitoso}
              URL_API={URL_API}
            />
          )}

          {vistaActual === 'perfil' && (
            <Perfil
              cambiarVista={setVistaActual}
              onLogout={cerrarSesion}
              URL_API={URL_API}
            />
          )}

          {vistaActual === 'carrito' && (
            <VistaCarrito
              carrito={carrito}
              actualizarCantidad={actualizarCantidad}
              eliminarDelCarrito={eliminarDelCarrito}
              vaciarCarrito={vaciarCarrito}
              cambiarVista={setVistaActual}
              URL_API={URL_API}
              onCompraExitosa={async (boletaCreada) => {
                setUltimaBoleta(boletaCreada);
                await cargarProductosDesdeMySQL();
              }}
            />
          )}

          {vistaActual === 'pago-exitoso' && (
            <PagoExitoso
              boleta={ultimaBoleta}
              usuario={usuarioActual}
              cambiarVista={setVistaActual}
            />
          )}

          {vistaActual === 'pago-error' && (
            <PagoError onRetry={() => setVistaActual('carrito')} />
          )}

          {vistaActual === 'admin-productos' && puedeVerPanel && (
            <Admin
              setCurrentView={(vista) => {
                if (!localStorage.getItem('token')) setUsuarioActual(null);
                setVistaActual(vista);
              }}
              onProductChange={cargarProductosDesdeMySQL}
            />
          )}
        </main>
      </div>
    </GoogleOAuthProvider>
  );
}