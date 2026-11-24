import React, { useState, useEffect } from 'react';
import '/css/admin.css';

const URL_API = 'http://localhost:8081/api/v1';

export default function Admin({ setCurrentView }) {
  const rolUsuario = localStorage.getItem('rol') || 'CLIENTE';
  const esAdmin = rolUsuario === 'ADMIN';

  const [activeTab, setActiveTab] = useState(esAdmin ? 'dashboard' : 'productos');
  
  const [stats, setStats] = useState({
    compras: 0,
    probabilidadAumento: 20,
    productos: 0,
    inventarioActual: 0,
    usuarios: 0,
    nuevosUsuariosMes: 0
  });
  
  const [listaProductos, setListaProductos] = useState([]);
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [listaOrdenes, setListaOrdenes] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: '',
    categoria: 'Zapatillas',
    stock: '',
    imagen: ''
  });

  const obtenerHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${localStorage.getItem('token')}`
  });

  const cargarDatos = async () => {
    try {
      const headers = obtenerHeaders();

      const resProds = await fetch(`${URL_API}/productos`, { headers });
      if (resProds.ok) {
        const dataProds = await resProds.json();
        setListaProductos(dataProds);
      }

      try {
        const resOrders = await fetch(`${URL_API}/boletas`, { headers });
        if (resOrders.ok) {
          const dataOrders = await resOrders.json();
          setListaOrdenes(dataOrders);
        }
      } catch (e) {
        console.log('No se pudo cargar la lista de boletas.');
      }

      if (esAdmin) {
        try {
          const resUsers = await fetch(`${URL_API}/usuarios`, { headers });
          if (resUsers.ok) {
            const dataUsers = await resUsers.json();
            setListaUsuarios(dataUsers);
          }
        } catch (e) {
          console.log('No se pudo cargar la lista de usuarios.');
        }
      }

    } catch (err) {
      console.error('Error cargando datos del servidor:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    setStats({
      compras: listaOrdenes.length,
      probabilidadAumento: 20,
      productos: listaProductos.length,
      inventarioActual: listaProductos.reduce((acc, p) => acc + (Number(p.stock) || 0), 0),
      usuarios: listaUsuarios.length,
      nuevosUsuariosMes: listaUsuarios.length
    });
  }, [listaProductos, listaOrdenes, listaUsuarios]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const agregarProducto = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${URL_API}/productos`, {
        method: 'POST',
        headers: obtenerHeaders(),
        body: JSON.stringify({
          nombre: nuevoProducto.nombre,
          precio: Number(nuevoProducto.precio),
          stock: Number(nuevoProducto.stock),
          imagen: nuevoProducto.imagen
        })
      });

      if (res.ok) {
        alert('Producto agregado con exito');
        setNuevoProducto({ nombre: '', precio: '', categoria: 'Zapatillas', stock: '', imagen: '' });
        cargarDatos(); 
      } else {
        alert('Error al guardar el producto. Verifica tus permisos.');
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      alert('Error de conexion con el servidor.');
    }
  };

  const handleCerrarSesion = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('rol');
    if (setCurrentView) {
      setCurrentView('inicio');
    } else {
      window.location.href = '/';
    }
  };

  if (cargando) {
    return <div style={{ padding: '20px', textAlign: 'center' }}><p>Cargando panel...</p></div>;
  }

  return (
    <div className="admin-contenedor">
      <aside className="admin-sidebar">
        <h4 className="admin-sidebar-titulo">
          {esAdmin ? 'Panel Admin' : 'Panel Vendedor'}
        </h4>
        <div className="admin-menu">
          {esAdmin && (
            <button 
              className={`admin-btn-tab ${activeTab === 'dashboard' ? 'activo' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              Dashboard
            </button>
          )}
          <button 
            className={`admin-btn-tab ${activeTab === 'productos' ? 'activo' : ''}`}
            onClick={() => setActiveTab('productos')}
          >
            Productos
          </button>
          <button 
            className={`admin-btn-tab ${activeTab === 'ordenes' ? 'activo' : ''}`}
            onClick={() => setActiveTab('ordenes')}
          >
            Ordenes
          </button>
          {esAdmin && (
            <button 
              className={`admin-btn-tab ${activeTab === 'usuarios' ? 'activo' : ''}`}
              onClick={() => setActiveTab('usuarios')}
            >
              Usuarios
            </button>
          )}
        </div>

        <hr className="admin-divider" />

        <div className="admin-sidebar-acciones">
          <button className="admin-btn-tienda" onClick={() => setCurrentView ? setCurrentView('inicio') : (window.location.href = '/')}>
            Ir a Tienda
          </button>
          <button className="admin-btn-logout" onClick={handleCerrarSesion}>
            Cerrar Sesion
          </button>
        </div>
      </aside>

      <main className="admin-contenido">
        {esAdmin && activeTab === 'dashboard' && (
          <div>
            <h2>Dashboard</h2>
            <p style={{ color: '#6c757d' }}>Resumen de las actividades diarias</p>

            <div className="admin-grid-stats">
              <div className="admin-card-stat compras">
                <h5>Compras</h5>
                <h2 className="admin-stat-numero">{stats.compras.toLocaleString()}</h2>
                <small>Probabilidad de aumento: {stats.probabilidadAumento}%</small>
              </div>
              <div className="admin-card-stat productos">
                <h5>Productos Totales</h5>
                <h2 className="admin-stat-numero">{stats.productos}</h2>
                <small>Inventario actual: {stats.inventarioActual}</small>
              </div>
              <div className="admin-card-stat usuarios">
                <h5>Usuarios Registrados</h5>
                <h2 className="admin-stat-numero">{stats.usuarios}</h2>
                <small>Nuevos usuarios este mes: {stats.nuevosUsuariosMes}</small>
              </div>
            </div>

            <div className="admin-grid-accesos">
              <div className="admin-card-acceso" onClick={() => setActiveTab('productos')}>
                <h5>Productos</h5>
                <p style={{ fontSize: '12px', color: '#6c757d', margin: 0 }}>Administrar inventario y catalogo</p>
              </div>
              <div className="admin-card-acceso" onClick={() => setActiveTab('ordenes')}>
                <h5>Ordenes</h5>
                <p style={{ fontSize: '12px', color: '#6c757d', margin: 0 }}>Gestion de compras realizadas</p>
              </div>
              <div className="admin-card-acceso" onClick={() => setActiveTab('usuarios')}>
                <h5>Usuarios</h5>
                <p style={{ fontSize: '12px', color: '#6c757d', margin: 0 }}>Administrar cuentas registradas</p>
              </div>
              <div className="admin-card-acceso" onClick={() => setCurrentView ? setCurrentView('inicio') : (window.location.href = '/')}>
                <h5>Ver Tienda</h5>
                <p style={{ fontSize: '12px', color: '#6c757d', margin: 0 }}>Visualizar la web publica</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'productos' && (
          <div>
            <h2>{esAdmin ? 'Gestion de Productos' : 'Lista de Productos'}</h2>
            <div className="admin-grid-gestion">
              {esAdmin && (
                <div className="admin-col-formulario">
                  <div className="admin-card">
                    <h4>Agregar Producto</h4>
                    <form onSubmit={agregarProducto}>
                      <div className="admin-campo">
                        <label>Nombre</label>
                        <input 
                          type="text" 
                          className="admin-input" 
                          value={nuevoProducto.nombre} 
                          onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})} 
                          required 
                        />
                      </div>
                      <div className="admin-campo">
                        <label>Precio ($)</label>
                        <input 
                          type="number" 
                          className="admin-input" 
                          value={nuevoProducto.precio} 
                          onChange={(e) => setNuevoProducto({...nuevoProducto, precio: e.target.value})} 
                          required 
                        />
                      </div>
                      <div className="admin-campo">
                        <label>Categoria</label>
                        <input 
                          type="text" 
                          className="admin-input" 
                          value={nuevoProducto.categoria} 
                          onChange={(e) => setNuevoProducto({...nuevoProducto, categoria: e.target.value})} 
                        />
                      </div>
                      <div className="admin-campo">
                        <label>Stock</label>
                        <input 
                          type="number" 
                          className="admin-input" 
                          value={nuevoProducto.stock} 
                          onChange={(e) => setNuevoProducto({...nuevoProducto, stock: e.target.value})} 
                          required 
                        />
                      </div>
                      <div className="admin-campo">
                        <label>Imagen (Ruta)</label>
                        <input 
                          type="text" 
                          className="admin-input" 
                          placeholder="/Zapatillasrunning.webp"
                          value={nuevoProducto.imagen} 
                          onChange={(e) => setNuevoProducto({...nuevoProducto, imagen: e.target.value})} 
                        />
                      </div>
                      <button type="submit" className="admin-btn-guardar">Guardar en Base de Datos</button>
                    </form>
                  </div>
                </div>
              )}

              <div className="admin-col-tabla">
                <div className="admin-card">
                  <h4>Inventario Actual ({listaProductos.length})</h4>
                  <div className="admin-tabla-contenedor">
                    <table className="admin-tabla">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Precio</th>
                          <th>Stock</th>
                          <th>Categoria</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listaProductos.map((p) => (
                          <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.nombre}</td>
                            <td>${Number(p.precio).toLocaleString()}</td>
                            <td>
                              <span className={`admin-badge-stock ${p.stock <= 5 ? 'bajo' : 'ok'}`}>
                                {p.stock}
                              </span>
                            </td>
                            <td>{p.categoria?.nombre || p.categoria || 'Sin categoria'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'ordenes' && (
          <div>
            <h2>{esAdmin ? 'Gestion de Ordenes' : 'Lista de Ordenes'}</h2>
            <div className="admin-card" style={{ marginTop: '16px' }}>
              {listaOrdenes.length === 0 ? (
                <div className="admin-alerta-vacio">No hay ordenes registradas.</div>
              ) : (
                <div className="admin-tabla-contenedor">
                  <table className="admin-tabla">
                    <thead>
                      <tr>
                        <th>ID Boleta</th>
                        <th>Cliente</th>
                        <th>Total</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listaOrdenes.map((o) => (
                        <tr key={o.id}>
                          <td>#{o.id}</td>
                          <td>{o.usuario?.nombre || o.usuario_id || 'Invitado'}</td>
                          <td>${Number(o.total).toLocaleString()}</td>
                          <td>{o.fecha ? new Date(o.fecha).toLocaleString() : 'N/A'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {esAdmin && activeTab === 'usuarios' && (
          <div>
            <h2>Gestion de Usuarios</h2>
            <div className="admin-card" style={{ marginTop: '16px' }}>
              {listaUsuarios.length === 0 ? (
                <div className="admin-alerta-vacio">No hay usuarios registrados.</div>
              ) : (
                <div className="admin-tabla-contenedor">
                  <table className="admin-tabla">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listaUsuarios.map((u) => (
                        <tr key={u.id}>
                          <td>{u.id}</td>
                          <td>{u.nombre}</td>
                          <td>{u.email}</td>
                          <td>{u.rol}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}