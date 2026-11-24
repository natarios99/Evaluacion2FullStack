import React, { useState } from 'react';

export default function IniciarSesion({ cambiarVista, onLoginSuccess, URL_API = 'http://localhost:8081/api/v1' }) {
  const [credenciales, setCredenciales] = useState({
    email: '',
    password: ''
  });
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(false);

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

        localStorage.setItem('token', datos.token);
        localStorage.setItem('rol', datos.rol);
        localStorage.setItem('usuarioNombre', datos.nombre || datos.email);
        localStorage.setItem('usuarioEmail', datos.email || credenciales.email);

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