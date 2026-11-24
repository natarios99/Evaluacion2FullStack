import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

export default function IniciarSesion({ cambiarVista, onLoginSuccess, URL_API = 'http://localhost:8081/api/v1' }) {
  const [credenciales, setCredenciales] = useState({
    email: '',
    password: ''
  });
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(false);

  const guardarSesionYRedirigir = (datos, correoFallback = '') => {
    localStorage.setItem('token', datos.token);
    localStorage.setItem('rol', datos.rol);
    localStorage.setItem('usuarioNombre', datos.nombre || datos.email);
    localStorage.setItem('usuarioEmail', datos.email || correoFallback);

    if (onLoginSuccess) {
      onLoginSuccess(datos);
    }

    const rolNormalizado = (datos.rol || '').toUpperCase();
    if (cambiarVista) {
      if (rolNormalizado === 'ADMIN' || rolNormalizado === 'VENDEDOR') {
        cambiarVista('admin-productos');
      } else {
        cambiarVista('inicio');
      }
    }
  };

  const manejarCambio = (e) => {
    setCredenciales({
      ...credenciales,
      [e.target.name]: e.target.value
    });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setCargando(true);

    try {
      const respuesta = await fetch(`${URL_API}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credenciales)
      });

      if (respuesta.ok) {
        const datos = await respuesta.json();
        guardarSesionYRedirigir(datos, credenciales.email);
      } else {
        const errorData = await respuesta.json().catch(() => ({}));
        setMensaje({
          tipo: 'danger',
          texto: errorData.error || errorData.message || 'Correo o contraseña incorrectos.'
        });
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setMensaje({
        tipo: 'danger',
        texto: 'No se pudo conectar con el servidor. Verifica que el backend esté activo.'
      });
    } finally {
      setCargando(false);
    }
  };

  const manejarLoginGoogle = async (credentialResponse) => {
    setMensaje(null);
    setCargando(true);

    try {
      const respuesta = await fetch(`${URL_API}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential })
      });

      if (respuesta.ok) {
        const datos = await respuesta.json();
        guardarSesionYRedirigir(datos);
      } else {
        const errorData = await respuesta.json().catch(() => ({}));
        setMensaje({
          tipo: 'danger',
          texto: errorData.error || 'No se pudo autenticar la cuenta de Google.'
        });
      }
    } catch (error) {
      console.error('Error en login con Google:', error);
      setMensaje({
        tipo: 'danger',
        texto: 'Error de conexión con el servidor al validar Google.'
      });
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: '450px' }}>
      <div className="card p-4 shadow-sm">
        <h3 className="text-center mb-4">Iniciar Sesión</h3>

        {mensaje && (
          <div className={`alert alert-${mensaje.tipo} py-2`} role="alert">
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={manejarEnvio}>
          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="ejemplo@correo.cl"
              value={credenciales.email}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="••••••••"
              value={credenciales.password}
              onChange={manejarCambio}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="d-flex align-items-center my-3">
          <hr className="flex-grow-1" />
          <span className="px-2 text-muted small">o continúa con</span>
          <hr className="flex-grow-1" />
        </div>

        <div className="d-flex justify-content-center">
          <GoogleLogin
            onSuccess={manejarLoginGoogle}
            onError={() =>
              setMensaje({ tipo: 'danger', texto: 'Error al conectar con Google.' })
            }
            text="continue_with"
            shape="rectangular"
            width="380"
          />
        </div>

        <div className="text-center mt-3">
          <small className="text-muted">
            ¿No tienes cuenta?{' '}
            <button
              type="button"
              className="btn btn-link p-0 align-baseline"
              onClick={() => cambiarVista && cambiarVista('registro')}
            >
              Regístrate aquí
            </button>
          </small>
        </div>
      </div>
    </div>
  );
}