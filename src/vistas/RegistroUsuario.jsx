import React, { useState } from 'react';

export default function RegistroUsuario({ cambiarVista }) {
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: '',
    email: '',
    password: '',
    confirmarPassword: ''
  });

  const manejarRegistro = (e) => {
    e.preventDefault();
    if (datosFormulario.password !== datosFormulario.confirmarPassword) {
      alert('Las contraseñas no coinciden.');
      return;
    }
    alert(`¡Cuenta creada con éxito para ${datosFormulario.nombre}!`);
    cambiarVista('iniciar-sesion');
  };

  return (
    <div className="container my-5" style={{ maxWidth: '500px' }}>
      <div className="card p-4 shadow-sm">
        <h3 className="text-center mb-4">Crear Cuenta</h3>
        <form onSubmit={manejarRegistro}>
          <div className="mb-3">
            <label className="form-label">Nombre Completo</label>
            <input 
              type="text" 
              className="form-control" 
              value={datosFormulario.nombre} 
              onChange={e => setDatosFormulario({...datosFormulario, nombre: e.target.value})} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input 
              type="email" 
              className="form-control" 
              value={datosFormulario.email} 
              onChange={e => setDatosFormulario({...datosFormulario, email: e.target.value})} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input 
              type="password" 
              className="form-control" 
              value={datosFormulario.password} 
              onChange={e => setDatosFormulario({...datosFormulario, password: e.target.value})} 
              required 
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Confirmar Contraseña</label>
            <input 
              type="password" 
              className="form-control" 
              value={datosFormulario.confirmarPassword} 
              onChange={e => setDatosFormulario({...datosFormulario, confirmarPassword: e.target.value})} 
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Registrarse</button>
        </form>
        <p className="text-center mt-3 mb-0 small">
          ¿Ya tienes cuenta? <button className="btn btn-link p-0" onClick={() => cambiarVista('iniciar-sesion')}>Inicia Sesión aquí</button>
        </p>
      </div>
    </div>
  );
}