import React, { useState } from 'react';

export default function IniciarSesion({ cambiarVista }) {
  const [credenciales, setCredenciales] = useState({ email: '', password: '' });

  const manejarInicio = (e) => {
    e.preventDefault();
    alert(`Sesión iniciada con: ${credenciales.email}`);
    cambiarVista('categorias');
  };

  return (
    <div className="container my-5" style={{ maxWidth: '450px' }}>
      <div className="card p-4 shadow-sm">
        <h3 className="text-center mb-4">Iniciar Sesión</h3>
        <form onSubmit={manejarInicio}>
          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input 
              type="email" 
              className="form-control" 
              value={credenciales.email} 
              onChange={e => setCredenciales({...credenciales, email: e.target.value})} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="form-control" 
              value={credenciales.password} 
              onChange={e => setCredenciales({...credenciales, password: e.target.value})} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-success w-100">Entrar</button>
        </form>
        <p className="text-center mt-3 mb-0 small">
          ¿No tienes cuenta? <button className="btn btn-link p-0" onClick={() => cambiarVista('registro')}>Crea una cuenta aquí</button>
        </p>
      </div>
    </div>
  );
}