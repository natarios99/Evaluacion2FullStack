import React, { useState } from 'react';

export default function IniciarSesion({ cambiarVista, onLoginSuccess, URL_API = 'http://localhost:8081/api/v1' }) {
  const [credenciales, setCredenciales] = useState({ email: '', password: '' });
  const [cargando, setCargando] = useState(false);

  const manejarInicio = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      const respuesta = await fetch(`${URL_API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credenciales)
      });

      if (respuesta.ok) {
        const datos = await respuesta.json();
        
        localStorage.setItem('token', datos.token);
        localStorage.setItem('rol', datos.rol);

        alert(`¡Bienvenido de nuevo, ${datos.nombre || datos.email}!`);
        
        if (onLoginSuccess) {
          onLoginSuccess(datos);
        }
        
        if (cambiarVista) {
          if (datos.rol === 'ADMIN' || datos.rol === 'VENDEDOR') {
            cambiarVista('admin-productos');
          } else {
            cambiarVista('categorias');
          }
        }
      } else {
        const errorData = await respuesta.json().catch(() => ({}));
        alert(`Error al iniciar sesión: ${errorData.error || 'Credenciales incorrectas'}`);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      alert('No se pudo conectar con el servidor backend.');
    } finally {
      setCargando(false);
    }
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
          <button type="submit" className="btn btn-success w-100" disabled={cargando}>
            {cargando ? 'Verificando...' : 'Entrar'}
          </button>
        </form>
        <p className="text-center mt-3 mb-0 small">
          ¿No tienes cuenta?{' '}
          <button className="btn btn-link p-0" onClick={() => cambiarVista && cambiarVista('registro')}>
            Crea una cuenta aquí
          </button>
        </p>
      </div>
    </div>
  );
}