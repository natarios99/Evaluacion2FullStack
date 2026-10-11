import React, { useState } from 'react';

export default function GestionProductos({ productos, recargarProductosDesdeMySQL, URL_API }) {
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: '', precio: '', categoria: 'Calzado', stock: '', imagen: '', oferta: 0
  });

  const guardarProductoEnMySQL = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await fetch(`${URL_API}/productos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoProducto)
      });

      if (respuesta.ok) {
        alert('Producto agregado con éxito a MySQL');
        setNuevoProducto({ nombre: '', precio: '', categoria: 'Calzado', stock: '', imagen: '', oferta: 0 });
        await recargarProductosDesdeMySQL();
      }
    } catch (error) {
      console.error('Error al guardar producto:', error);
    }
  };

  return (
    <div className="container-fluid py-4">
      <h2>Panel Administrativo - Inventario de Productos</h2>

      {/* Formulario de Alta */}
      <div className="card p-3 my-3 bg-light">
        <h4>Agregar Nuevo Producto Deportivo</h4>
        <form onSubmit={guardarProductoEnMySQL} className="row g-3">
          <div className="col-md-4">
            <input type="text" className="form-control" placeholder="Nombre producto" value={nuevoProducto.nombre} onChange={e => setNuevoProducto({...nuevoProducto, nombre: e.target.value})} required />
          </div>
          <div className="col-md-2">
            <input type="number" className="form-control" placeholder="Precio ($)" value={nuevoProducto.precio} onChange={e => setNuevoProducto({...nuevoProducto, precio: e.target.value})} required />
          </div>
          <div className="col-md-2">
            <input type="number" className="form-control" placeholder="Stock Inicial" value={nuevoProducto.stock} onChange={e => setNuevoProducto({...nuevoProducto, stock: e.target.value})} required />
          </div>
          <div className="col-md-2">
            <select className="form-select" value={nuevoProducto.categoria} onChange={e => setNuevoProducto({...nuevoProducto, categoria: e.target.value})}>
              <option value="Calzado">Calzado</option>
              <option value="Ropa">Ropa</option>
              <option value="Fútbol">Fútbol</option>
              <option value="Fitness">Fitness</option>
            </select>
          </div>
          <div className="col-md-12">
            <input type="url" className="form-control" placeholder="URL Imagen (https://...)" value={nuevoProducto.imagen} onChange={e => setNuevoProducto({...nuevoProducto, imagen: e.target.value})} required />
          </div>
          <div className="col-md-12">
            <button type="submit" className="btn btn-success">Guardar en Base de Datos</button>
          </div>
        </form>
      </div>

      {/* Tabla de Productos Existentes */}
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
          {productos.map(p => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td><img src={p.imagen} alt={p.nombre} width="50" height="50" style={{ objectFit: 'cover' }} /></td>
              <td>{p.nombre}</td>
              <td>{p.categoria}</td>
              <td>${p.precio.toLocaleString('es-CL')}</td>
              <td>
                <span className={`badge ${p.stock <= 5 ? 'bg-danger' : 'bg-success'}`}>
                  {p.stock} unidades
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}