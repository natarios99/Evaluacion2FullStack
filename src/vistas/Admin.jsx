import React, { useState, useEffect } from 'react';
import '/css/admin.css';

const URL_API = 'http://localhost:3000/api';

export default function Admin({ setCurrentView }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  
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

  const cargarDatos = async () => {
    try {
      const resStats = await fetch(`${URL_API}/admin/stats`);
      if (resStats.ok) {
        const dataStats = await resStats.json();
        setStats(dataStats);
      }

      const resProds = await fetch(`${URL_API}/productos`);
      if (resProds.ok) {
        const dataProds = await resProds.json();
        setListaProductos(dataProds);
      }

      try {
        const resUsers = await fetch(`${URL_API}/usuarios`);
        if (resUsers.ok) {
          const dataUsers = await resUsers.json();
          setListaUsuarios(dataUsers);
        }
      } catch (e) {
        console.log('No se pudo cargar la lista de usuarios.');
      }

      try {
        const resOrders = await fetch(`${URL_API}/ordenes`);
        if (resOrders.ok) {
          const dataOrders = await resOrders.json();
          setListaOrdenes(dataOrders);
        }
      } catch (e) {
        console.log('No se pudo cargar la lista de órdenes.');
      }

    } catch (err) {
      console.error('Error cargando datos del servidor:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const agregarProducto = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${URL_API}/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto)
      });

      if (res.ok) {
        alert('Producto agregado con exito a MySQL');
        setNuevoProducto({ nombre: '', precio: '', categoria: 'Zapatillas', stock: '', imagen: '' });
        cargarDatos(); 
      } else {
        alert('Error al guardar el producto.');
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      alert('Error de conexion con el servidor.');
    }
  };

  if (cargando) {
    return <div style={{ padding: '20px', textAlign: 'center' }}><p>Cargando panel de administracion...</p></div>;
  }

  return (
    <div className="admin-contenedor">
      <aside className="admin-sidebar">
        <h4 className="admin-sidebar-titulo">Panel Admin</h4>
        <div className="admin-menu">
          <button 
            className={`admin-btn-tab ${activeTab === 'dashboard' ? 'activo' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
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
          <button 
            className={`admin-btn-tab ${activeTab === 'usuarios' ? 'activo' : ''}`}
            onClick={() => setActiveTab('usuarios')}
          >
            Usuarios
          </button>
        </div>

        <hr className="admin-divider" />

        <div className="admin-sidebar-acciones">
          <button className="admin-btn-tienda" onClick={() => setCurrentView ? setCurrentView('home') : (window.location.href = '/')}>
            Ir a Tienda
          </button>
          <button className="admin-btn-logout" onClick={() => alert('Cerrando sesion...')}>
            Cerrar Sesion
          </button>
        </div>
      </aside>

      <main className="admin-contenido">
        {activeTab === 'dashboard' && (
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
              <div className="admin-card-acceso" onClick={() => setCurrentView ? setCurrentView('home') : (window.location.href = '/')}>
                <h5>Ver Tienda</h5>
                <p style={{ fontSize: '12px', color: '#6c757d', margin: 0 }}>Visualizar la web publica</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'productos' && (
          <div>
            <h2>Gestion de Productos</h2>
            <div className="admin-grid-gestion">
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
                    <button type="submit" className="admin-btn-guardar">Guardar en MySQL</button>
                  </form>
                </div>
              </div>

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
                            <td>{p.categoria || 'Sin categoria'}</td>
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
            <h2>Gestion de Ordenes</h2>
            <div className="admin-card" style={{ marginTop: '16px' }}>
              {listaOrdenes.length === 0 ? (
                <div className="admin-alerta-vacio">No hay ordenes registradas.</div>
              ) : (
                <div className="admin-tabla-contenedor">
                  <table className="admin-tabla">
                    <thead>
                      <tr>
                        <th>ID Orden</th>
                        <th>ID Usuario</th>
                        <th>Total</th>
                        <th>Fecha</th>
                      </tr>
                    </thead>
                    <tbody>
                      {listaOrdenes.map((o) => (
                        <tr key={o.id}>
                          <td>#{o.id}</td>
                          <td>{o.usuario_id || 'Invitado'}</td>
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

        {activeTab === 'usuarios' && (
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
                      </tr>
                    </thead>
                    <tbody>
                      {listaUsuarios.map((u) => (
                        <tr key={u.id}>
                          <td>{u.id}</td>
                          <td>{u.nombre}</td>
                          <td>{u.email}</td>
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