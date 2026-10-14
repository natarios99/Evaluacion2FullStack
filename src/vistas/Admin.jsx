
import React, { useState, useEffect } from 'react';

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

  // FFORMULARIO PARA AGREGAR PRODUCTO
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: '',
    categoria: 'Zapatillas',
    stock: '',
    imagen: ''
  });

  // Carga los datos de la base de datos al correrlo
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

  // Guarda el porducto en la bd
  const agregarProducto = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${URL_API}/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto)
      });

      if (res.ok) {
        alert('✅ Producto agregado con éxito a MySQL');
        setNuevoProducto({ nombre: '', precio: '', categoria: 'Zapatillas', stock: '', imagen: '' });
        cargarDatos(); 
      } else {
        alert(' Error al guardar el producto.');
      }
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      alert('Error de conexión con el servidor.');
    }
  };

  if (cargando) {
    return <div className="p-4 text-center"><p>Cargando panel de administración...</p></div>;
  }

  return (
    <div className="d-flex" style={{ minHeight: '85vh' }}>
      {/* Sidebar Lateral */}
      <aside className="bg-dark text-white p-3" style={{ width: '230px' }}>
        <h4 className="mb-4 text-center border-bottom pb-2">Company name</h4>
        <div className="nav flex-column nav-pills gap-2">
          <button 
            className={`btn text-start ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-outline-light'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`btn text-start ${activeTab === 'productos' ? 'btn-primary' : 'btn-outline-light'}`}
            onClick={() => setActiveTab('productos')}
          >
            Productos
          </button>
          <button 
            className={`btn text-start ${activeTab === 'ordenes' ? 'btn-primary' : 'btn-outline-light'}`}
            onClick={() => setActiveTab('ordenes')}
          >
            Órdenes
          </button>
          <button 
            className={`btn text-start ${activeTab === 'usuarios' ? 'btn-primary' : 'btn-outline-light'}`}
            onClick={() => setActiveTab('usuarios')}
          >
            Usuarios
          </button>
        </div>

        <hr className="bg-secondary my-4" />

        <div className="d-grid gap-2">
          <button className="btn btn-secondary" onClick={() => setCurrentView ? setCurrentView('home') : (window.location.href = '/')}>
            🏪 Ir a Tienda
          </button>
          <button className="btn btn-danger" onClick={() => alert('Cerrando sesión...')}>
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Área Principal */}
      <main className="flex-grow-1 p-4 bg-light">
        {/* PESTAÑA 1: DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div>
            <h2>Dashboard</h2>
            <p className="text-muted">Resumen de las actividades diarias</p>

            <div className="row g-3 mb-4">
              <div className="col-md-4">
                <div className="card bg-primary text-white p-3 shadow-sm">
                  <h5>Compras</h5>
                  <h2 className="my-2">{stats.compras.toLocaleString()}</h2>
                  <small>Probabilidad de aumento: {stats.probabilidadAumento}%</small>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card bg-success text-white p-3 shadow-sm">
                  <h5>Productos Totales</h5>
                  <h2 className="my-2">{stats.productos}</h2>
                  <small>Inventario actual: {stats.inventarioActual}</small>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card bg-warning text-dark p-3 shadow-sm">
                  <h5>Usuarios Registrados</h5>
                  <h2 className="my-2">{stats.usuarios}</h2>
                  <small>Nuevos usuarios este mes: {stats.nuevosUsuariosMes}</small>
                </div>
              </div>
            </div>

            <div className="row g-3">
              <div className="col-md-3">
                <div className="card p-3 text-center shadow-sm" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('productos')}>
                  <h5>📦 Productos</h5>
                  <p className="text-muted small m-0">Administrar inventario y catálogo</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card p-3 text-center shadow-sm" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('ordenes')}>
                  <h5>🧾 Órdenes</h5>
                  <p className="text-muted small m-0">Gestión de compras realizadas</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card p-3 text-center shadow-sm" style={{ cursor: 'pointer' }} onClick={() => setActiveTab('usuarios')}>
                  <h5>👥 Usuarios</h5>
                  <p className="text-muted small m-0">Administrar cuentas registradas</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card p-3 text-center shadow-sm" style={{ cursor: 'pointer' }} onClick={() => setCurrentView ? setCurrentView('home') : (window.location.href = '/')}>
                  <h5>🏪 Ver Tienda</h5>
                  <p className="text-muted small m-0">Visualizar la web pública</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PESTAÑA 2: PRODUCTOS */}
        {activeTab === 'productos' && (
          <div>
            <h2>Gestión de Productos</h2>
            <div className="row mt-3">
              {/* Formulario para agregar producto */}
              <div className="col-md-4">
                <div className="card p-3 shadow-sm">
                  <h4>Agregar Producto</h4>
                  <form onSubmit={agregarProducto} className="mt-2">
                    <div className="mb-2">
                      <label className="form-label small">Nombre</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={nuevoProducto.nombre} 
                        onChange={(e) => setNuevoProducto({...nuevoProducto, nombre: e.target.value})} 
                        required 
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label small">Precio ($)</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={nuevoProducto.precio} 
                        onChange={(e) => setNuevoProducto({...nuevoProducto, precio: e.target.value})} 
                        required 
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label small">Categoría</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        value={nuevoProducto.categoria} 
                        onChange={(e) => setNuevoProducto({...nuevoProducto, categoria: e.target.value})} 
                      />
                    </div>
                    <div className="mb-2">
                      <label className="form-label small">Stock</label>
                      <input 
                        type="number" 
                        className="form-control" 
                        value={nuevoProducto.stock} 
                        onChange={(e) => setNuevoProducto({...nuevoProducto, stock: e.target.value})} 
                        required 
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small">Imagen (Ruta)</label>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="/Zapatillasrunning.webp"
                        value={nuevoProducto.imagen} 
                        onChange={(e) => setNuevoProducto({...nuevoProducto, imagen: e.target.value})} 
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-100">Guardar en MySQL</button>
                  </form>
                </div>
              </div>

              {/* Tabla de Productos */}
              <div className="col-md-8">
                <div className="card p-3 shadow-sm">
                  <h4>Inventario Actual ({listaProductos.length})</h4>
                  <div className="table-responsive mt-2">
                    <table className="table table-hover align-middle">
                      <thead className="table-dark">
                        <tr>
                          <th>ID</th>
                          <th>Nombre</th>
                          <th>Precio</th>
                          <th>Stock</th>
                          <th>Categoría</th>
                        </tr>
                      </thead>
                      <tbody>
                        {listaProductos.map((p) => (
                          <tr key={p.id}>
                            <td>{p.id}</td>
                            <td>{p.nombre}</td>
                            <td>${Number(p.precio).toLocaleString()}</td>
                            <td>
                              <span className={`badge ${p.stock <= 5 ? 'bg-danger' : 'bg-success'}`}>
                                {p.stock}
                              </span>
                            </td>
                            <td>{p.categoria || 'Sin categoría'}</td>
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

        {/* PESTAÑA 3: ÓRDENES */}
        {activeTab === 'ordenes' && (
          <div>
            <h2>Gestión de Órdenes</h2>
            <div className="card p-3 shadow-sm mt-3">
              {listaOrdenes.length === 0 ? (
                <div className="alert alert-info mb-0">No hay órdenes registradas.</div>
              ) : (
                <table className="table table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>ID Órden</th>
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
              )}
            </div>
          </div>
        )}

        {/* PESTAÑA 4: USUARIOS */}
        {activeTab === 'usuarios' && (
          <div>
            <h2>Gestión de Usuarios</h2>
            <div className="card p-3 shadow-sm mt-3">
              {listaUsuarios.length === 0 ? (
                <div className="alert alert-info mb-0">No hay usuarios registrados.</div>
              ) : (
                <table className="table table-hover">
                  <thead className="table-dark">
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
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}