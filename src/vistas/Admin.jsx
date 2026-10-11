// src/pages/Admin.jsx
import { useState } from 'react';

function Admin() {
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Producto agregado con éxito');
        setFormData({ nombre: '', precio: '', descripcion: '' });
      }
    } catch (error) {
      console.error('Error enviando formulario:', error);
    }
  };

  return (
    <div className="admin-container">
      <h2>Administración de Productos</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="nombre"
          placeholder="Nombre del producto"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={formData.precio}
          onChange={handleChange}
          required
        />
        <textarea
          name="descripcion"
          placeholder="Descripción"
          value={formData.descripcion}
          onChange={handleChange}
        />
        <button type="submit">Guardar Producto</button>
      </form>
    </div>
  );
}

export default Admin;