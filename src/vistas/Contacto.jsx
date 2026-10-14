import React, { useState } from 'react';
import '/css/contacto.css';

export default function Contacto() {
  const [formulario, setFormulario] = useState({ nombre: '', email: '', mensaje: '' });

  const enviarContacto = (e) => {
    e.preventDefault();
    alert(`Gracias ${formulario.nombre}, tu mensaje ha sido enviado correctamente.`);
    setFormulario({ nombre: '', email: '', mensaje: '' });
  };

  return (
    <div className="contacto-contenedor">
      <h2 className="contacto-titulo">Contacto & Soporte</h2>
      <form onSubmit={enviarContacto} className="contacto-tarjeta">
        <div className="contacto-grupo">
          <label className="contacto-etiqueta">Nombre Completo</label>
          <input 
            type="text" 
            className="contacto-input" 
            value={formulario.nombre} 
            onChange={e => setFormulario({...formulario, nombre: e.target.value})} 
            required 
          />
        </div>

        <div className="contacto-grupo">
          <label className="contacto-etiqueta">Correo Electrónico</label>
          <input 
            type="email" 
            className="contacto-input" 
            value={formulario.email} 
            onChange={e => setFormulario({...formulario, email: e.target.value})} 
            required 
          />
        </div>

        <div className="contacto-grupo">
          <label className="contacto-etiqueta">Mensaje o Consulta</label>
          <textarea 
            className="contacto-textarea" 
            rows="4" 
            value={formulario.mensaje} 
            onChange={e => setFormulario({...formulario, mensaje: e.target.value})} 
            required
          ></textarea>
        </div>

        <button type="submit" className="contacto-boton">Enviar Mensaje</button>
      </form>
    </div>
  );
}