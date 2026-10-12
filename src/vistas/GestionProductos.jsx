import React, { useState } from 'react';

export default function GestionProductos({ productos = [], recargarProductosDesdeMySQL, URL_API }) {
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '',
    precio: '',
    categoria: 'Calzado',
    stock: '',
    imagen: '/Zapatillasrunning.webp', // Imagen por defecto en carpeta public
    oferta: 0
  });

  const guardarProductoEnMySQL = async (e) => {
    e.preventDefault();

    // Validar campos obligatorios
    if (!nuevoProducto.nombre || !nuevoProducto.precio || !nuevoProducto.stock) {
      alert('Por favor, completa todos los campos obligatorios.');
      return;
    }

    try {
      const respuesta = await fetch(`${URL_API}/productos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: nuevoProducto.nombre,
          precio: parseInt(nuevoProducto.precio, 10),
          categoria: nuevoProducto.categoria,
          stock: parseInt(nuevoProducto.stock, 10),
          imagen: nuevoProducto.imagen.trim() || '/Zapatillasrunning.webp',
          oferta: parseInt(nuevoProducto.oferta, 10)
        })
      });

      if (respuesta.ok) {
        alert('¡Producto agregado con éxito a MySQL!');
        // Limpiar formulario
        setNuevoProducto({
          nombre: '',
          precio: '',
          categoria: 'Calzado',
          stock: '',
          imagen: '/Zapatillasrunning.webp',
          oferta: 0
        });
        // Recargar la lista de productos desde la base de datos a nivel global
        if (recargarProductosDesdeMySQL) {
          await recargarProductosDesdeMySQL();
        }
      } else {
        const datosError = await respuesta.json().catch(() => ({}));
        alert(`Error al guardar: ${datosError.error || 'Intenta de nuevo'}`);
      }
    } catch (error) {
      console.error('Error de red al guardar producto:', error);
      alert('No se pudo conectar con el servidor.');
    }
  };

  // Asegura que la lista siempre sea iterable
  const listaProductos = Array.isArray(productos) ? productos : [];

  return (
    <div className="container-fluid py-4">
      <h2>Panel Administrativo - Inventario de Productos</h2>

      {/* Formulario para Crear Producto */}
      <div className="card p-4 my-4 shadow-sm bg-light">
        <h4>Agregar Nuevo Producto Deportivo</h4>
        <form onSubmit={guardarProductoEnMySQL} className="row g-3">
          <div className="col-md-4">
            <label className="form-label fw-bold">Nombre del Producto *</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Ej: Balón de Baloncesto" 
              value={nuevoProducto.nombre} 
              onChange={e => setNuevoProducto({...nuevoProducto, nombre: e.target.value})} 
              required 
            />
          </div>

          <div className="col-md-2">
            <label className="form-label fw-bold">Precio ($) *</label>
            <input 
              type="number" 
              className="form-control" 
              placeholder="Ej: 29990" 
              value={nuevoProducto.precio} 
              onChange={e => setNuevoProducto({...nuevoProducto, precio: e.target.value})} 
              required 
            />
          </div>

          <div className="col-md-2">
            <label className="form-label fw-bold">Stock Inicial *</label>
            <input 
              type="number" 
              className="form-control" 
              placeholder="Ej: 15" 
              value={nuevoProducto.stock} 
              onChange={e => setNuevoProducto({...nuevoProducto, stock: e.target.value})} 
              required 
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-bold">Categoría</label>
            <select 
              className="form-select" 
              value={nuevoProducto.categoria} 
              onChange={e => setNuevoProducto({...nuevoProducto, categoria: e.target.value})}
            >
              <option value="Calzado">Calzado</option>
              <option value="Ropa">Ropa</option>
              <option value="Fútbol">Fútbol</option>
              <option value="Fitness">Fitness</option>
              <option value="Tenis">Tenis</option>
              <option value="Suplementos">Suplementos</option>
              <option value="Ciclismo">Ciclismo</option>
              <option value="Accesorios">Accesorios</option>
            </select>
          </div>

          <div className="col-md-8">
            <label className="form-label fw-bold">Ruta de Imagen / URL Web</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Ej: /Balonfutbol.webp o https://sitio.com/foto.jpg" 
              value={nuevoProducto.imagen} 
              onChange={e => setNuevoProducto({...nuevoProducto, imagen: e.target.value})} 
            />
          </div>

          <div className="col-md-4">
            <label className="form-label fw-bold">¿En Oferta?</label>
            <select 
              className="form-select" 
              value={nuevoProducto.oferta} 
              onChange={e => setNuevoProducto({...nuevoProducto, oferta: e.target.value})}
            >
              <option value="0">No</option>
              <option value="1">Sí (Mostrar badge OFERTA)</option>
            </select>
          </div>

          <div className="col-12 mt-3">
            <button type="submit" className="btn btn-success btn-lg">
              Guardar en Base de Datos
            </button>
          </div>
        </form>
      </div>

      {/* Tabla de Productos Existentes */}
      <h4>Productos en Base de Datos ({listaProductos.length})</h4>
      <table className="table table-striped align-middle">
        <thead>
          <tr>
            <th>ID</th>
            <th>Imagen</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
          </tr>
        </thead>
        <tbody>
          {listaProductos.length > 0 ? (
            listaProductos.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>
                  <img 
                    src={p.imagen || p.img || '/Zapatillasrunning.webp'} 
                    alt={p.nombre} 
                    width="50" 
                    height="50" 
                    style={{ objectFit: 'cover' }} 
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/50'; }} 
                  />
                </td>
                <td>{p.nombre}</td>
                <td>{p.categoria}</td>
                <td>${(p.precio || 0).toLocaleString('es-CL')}</td>
                <td>
                  <span className={`badge ${p.stock <= 5 ? 'bg-danger' : 'bg-success'}`}>
                    {p.stock} unidades
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4 text-muted">
                No hay productos guardados o no se pudo cargar la base de datos.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}