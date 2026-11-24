import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

export default function IniciarSesion({ cambiarVista, onLoginSuccess, URL_API = 'http://localhost:8081/api/v1' }) {
  const [credenciales, setCredenciales] = useState({ email: '', password: '' });
  const [cargando, setCargando] = useState(false);

  const manejarInicio = async (e) => {
    e.preventDefault();
    setCargando(true);
  

    try {
      const respuesta = await fetch(`${URL_API}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credenciales)
      });

      if (respuesta.ok) {
        const usuario = await respuesta.json();
        localStorage.setItem('token', datos.token);
        localStorage.setItem('rol', datos.rol);
        alert(`¡Bienvenido de nuevo, ${usuario.nombre || usuario.email}!`);
        
        if (onLoginSuccess) {
          onLoginSuccess(usuario);
        }
        
        if (cambiarVista) {
          cambiarVista('categorias');
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

  // Función que se ejecuta cuando el usuario se autentica con Google de forma exitosa
  const manejarExitoGoogle = async (credentialResponse) => {
    try {
      // Enviamos el token (credential) que nos da Google hacia nuestro propio backend
      const respuesta = await fetch(`${URL_API}/login-google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: credentialResponse.credential })
      });

      if (respuesta.ok) {
        const usuario = await respuesta.json();
        alert(`¡Bienvenido con Google, ${usuario.nombre || usuario.email}!`);
        
        if (onLoginSuccess) {
          onLoginSuccess(usuario);
        }
        
        if (cambiarVista) {
          cambiarVista('categorias');
        }
      } else {
        const errorData = await respuesta.json().catch(() => ({}));
        alert(`Error en el servidor con Google: ${errorData.error || 'No se pudo iniciar sesión'}`);
      }
    } catch (error) {
      console.error('Error al verificar token con el backend:', error);
      alert('Error de conexión al procesar la autenticación de Google.');
    }
  };

  const manejarErrorGoogle = () => {
    console.error('Fallo en la autenticación inicial de Google desde el navegador.');
    alert('No se pudo iniciar sesión con Google.');
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

        {/* Separador visual elegante para la opción alternativa */}
        <div className="text-center my-3 text-muted position-relative">
          <hr />
          <span className="position-absolute top-50 start-50 translate-middle bg-white px-2 small text-uppercase">
            O bien
          </span>
        </div>

        {/* Contenedor del Botón de Google centrado */}
        <div className="d-flex justify-content-center w-100">
          <GoogleLogin
            onSuccess={manejarExitoGoogle}
            onError={manejarErrorGoogle}
            theme="filled_blue"
            text="signin_with"
            shape="rectangular"
          />
        </div>

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