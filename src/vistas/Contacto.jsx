import React, { useState } from 'react';

export default function Contacto() {
  const [formulario, setFormulario] = useState({ nombre: '', email: '', mensaje: '' });

  const enviarContacto = (e) => {
    e.preventDefault();
    alert(`Gracias ${formulario.nombre}, tu mensaje ha sido enviado correctamente.`);
    setFormulario({ nombre: '', email: '', mensaje: '' });
  };

  return (
    <div className="container my-4" style={{ maxWidth: '600px' }}>
      <h2>Contacto & Soporte</h2>
      <form onSubmit={enviarContacto} className="card p-4 shadow-sm mt-3">
        <div className="mb-3">
          <label className="form-label">Nombre Completo</label>
          <input type="text" className="form-control" value={formulario.nombre} onChange={e => setFormulario({...formulario, nombre: e.target.value})} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Correo Electrónico</label>
          <input type="email" className="form-control" value={formulario.email} onChange={e => setFormulario({...formulario, email: e.target.value})} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Mensaje o Consulta</label>
          <textarea className="form-control" rows="4" value={formulario.mensaje} onChange={e => setFormulario({...formulario, mensaje: e.target.value})} required></textarea>
        </div>
        <button type="submit" className="btn btn-dark w-100">Enviar Mensaje</button>
      </form>
    </div>
  );
}