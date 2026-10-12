import React, { useState, useEffect } from 'react';

// Importación de Vistas
import Inicio from './vistas/Inicio';
import Categorias from './vistas/Categorias';
import DetalleProducto from './vistas/DetalleProducto';
import Ofertas from './vistas/Ofertas';
import Blogs from './vistas/Blogs';
import Contacto from './vistas/Contacto';
import RegistroUsuario from './vistas/RegistroUsuario';
import IniciarSesion from './vistas/IniciarSesion';
import GestionProductos from './vistas/GestionProductos';

const URL_API = 'http://localhost:5000/api';

export default function Aplicacion() {
  // ESTADOS DE NAVEGACIÓN Y DATOS
  const [vistaActual, setVistaActual] = useState('inicio');
  const [productoSeleccionado, setProductoSeleccionado] = useState(null);
  
  const [productos, setProductos] = useState([]);
  const [carrito, setCarrito] = useState([]);

  // Cargar productos de MySQL
  const cargarProductosDesdeMySQL = async () => {
    try {
      const respuesta = await fetch(`${URL_API}/productos`);
      const datos = await respuesta.json();
      setProductos(datos);
    } catch (error) {
      console.error('Error al conectar con la base de datos:', error);
    }
  };

  useEffect(() => {
    cargarProductosDesdeMySQL();
  }, []);

  // Lógica del Carrito
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

  // Función para ir a la vista de detalle de un producto específico
  const verDetalleProducto = (producto) => {
    setProductoSeleccionado(producto);
    setVistaActual('detalle');
  };
  const procesarPagoYDescontarStock = async () => {
  if (carrito.length === 0) {
    alert('El carrito está vacío.');
    return;
  }

  try {
    const respuesta = await fetch(`${URL_API}/comprar`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json' 
      },
      // Debe enviarse como { carrito: [...] }
      body: JSON.stringify({ carrito })
    });

    if (respuesta.ok) {
      alert('¡Pago realizado con éxito! El stock ha sido actualizado en MySQL.');
      setCarrito([]);
      await cargarProductosDesdeMySQL(); // Recargar el stock actualizado
    } else {
      const errorServidor = await respuesta.json();
      alert(`Error al procesar el pago: ${errorServidor.error || 'Intente nuevamente'}`);
    }
  } catch (error) {
    console.error('Error al procesar la compra:', error);
  }
};  

  const totalPagar = carrito.reduce((suma, item) => suma + item.precio * item.cantidad, 0);

  return (
    <div>
      {/* BARRA DE NAVEGACIÓN GLOBAL */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark sticky-top shadow-sm">
        <div className="container">
          <button className="navbar-brand btn btn-link text-white fw-bold text-decoration-none" onClick={() => setVistaActual('inicio')}>
            ⚽ Tienda Deportiva
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

            {/* BOTONES DE SESIÓN Y CARRITO */}
            <div className="d-flex gap-2">
              <button className="btn btn-outline-light btn-sm" onClick={() => setVistaActual('iniciar-sesion')}>Iniciar Sesión</button>
              <button className="btn btn-primary btn-sm" onClick={() => setVistaActual('registro')}>Registro</button>
              <button className="btn btn-success btn-sm ms-2">
                🛒 ({carrito.length}) - ${totalPagar.toLocaleString('es-CL')}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* RENDERIZADO CONDICIONAL DE VISTAS */}
      <main>
        {vistaActual === 'inicio' && <Inicio cambiarVista={setVistaActual} />}
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
        {vistaActual === 'registro' && <RegistroUsuario cambiarVista={setVistaActual} />}
        {vistaActual === 'iniciar-sesion' && <IniciarSesion cambiarVista={setVistaActual} />}
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