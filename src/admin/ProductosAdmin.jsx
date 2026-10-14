import React, { useState } from 'react';

const URL_API = 'http://localhost:3000/api';

export default function ProductosAdmin({ cargarProductosDesdeMySQL }) {
  const [producto, setProducto] = useState({
    nombre: '',
    precio: '',
    categoria: '',
    stock: '',
    imagen: ''
  });

  const cambiosFormulario = (e) => {
    const { name, value } = e.target;
    setProducto({
      ...producto,
      [name]: value
    });
  };

  const guardarProducto = async (nuevoProducto) => {
    try {
      const respuesta = await fetch(`${URL_API}/productos`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(nuevoProducto)
      });

      if (respuesta.ok) {
        alert('Producto guardado con éxito');
        if (cargarProductosDesdeMySQL) {
          await cargarProductosDesdeMySQL(); // 
        }
        // Limpiar los campos del formulario tras guardar con éxito
        setProducto({
          nombre: '',
          precio: '',
          categoria: '',
          stock: '',
          imagen: ''
        });
      } else {
        const errorData = await respuesta.json();
        console.error('Respuesta de error del servidor:', errorData);
        alert('Error al intentar guardar el producto.');
      }
    } catch (error) {
      console.error('Error de red/conexión:', error);
      alert('Error de conexión con el servidor.');
    }
  };

  // Maneja el evento onSubmit del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    guardarProducto(producto);
  };

  return (
    <div className="container py-4">
      <h3>Administración de Productos</h3>
      <p className="text-muted">Agrega un nuevo producto a la base de datos MySQL</p>

      <div className="card p-4 shadow-sm" style={{ maxWidth: '600px' }}>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-bold">Nombre del Producto</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              value={producto.nombre}
              onChange={cambiosFormulario}
              placeholder="Ej. Zapatillas Running"
              required
            />
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Precio ($)</label>
              <input
                type="number"
                name="precio"
                className="form-control"
                value={producto.precio}
                onChange={cambiosFormulario}
                placeholder="29990"
                required
              />
            </div>

            <div className="col-md-6 mb-3">
              <label className="form-label fw-bold">Stock</label>
              <input
                type="number"
                name="stock"
                className="form-control"
                value={producto.stock}
                onChange={cambiosFormulario}
                placeholder="10"
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Categoría</label>
            <input
              type="text"
              name="categoria"
              className="form-control"
              value={producto.categoria}
              onChange={cambiosFormulario}
              placeholder="Ej. Calzado, Accesorios"
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-bold">Imagen (Nombre o Ruta)</label>
            <input
              type="text"
              name="imagen"
              className="form-control"
              value={producto.imagen}
              onChange={cambiosFormulario}
              placeholder="/Zapatillasrunning.webp"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-bold">
            Guardar en MySQL
          </button>
        </form>
      </div>
    </div>
  );
}