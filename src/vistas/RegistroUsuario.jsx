import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

export default function RegistroUsuario({ cambiarVista, onLoginSuccess, URL_API = 'http://localhost:8081/api/v1' }) {
  const [formulario, setFormulario] = useState({
    nombre: '',
    email: '',
    password: ''
  });
  const [mensaje, setMensaje] = useState(null);
  const [cargando, setCargando] = useState(false);

  const manejarCambio = (e) => {
    setFormulario({
      ...formulario,
      [e.target.name]: e.target.value
    });
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setCargando(true);

    try {
      const respuesta = await fetch(`${URL_API}/auth/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: formulario.nombre,
          email: formulario.email,
          password: formulario.password,
          rol: 'CLIENTE'
        })
      });

      if (respuesta.ok) {
        setMensaje({
          tipo: 'success',
          texto: 'Cuenta creada con éxito. Redirigiendo al inicio de sesión...'
        });
        setFormulario({ nombre: '', email: '', password: '' });

        setTimeout(() => {
          if (cambiarVista) cambiarVista('iniciar-sesion');
        }, 1500);
      } else {
        const errorData = await respuesta.json().catch(() => ({}));
        setMensaje({
          tipo: 'danger',
          texto: errorData.error || errorData.message || 'No se pudo completar el registro. El correo ya podría estar en uso.'
        });
      }
    } catch (error) {
      console.error('Error al registrar usuario:', error);
      setMensaje({
        tipo: 'danger',
        texto: 'Error de conexión con el servidor.'
      });
    } finally {
      setCargando(false);
    }
  };

  const manejarRegistroGoogle = async (credentialResponse) => {
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

        localStorage.setItem('token', datos.token);
        localStorage.setItem('rol', datos.rol);
        localStorage.setItem('usuarioNombre', datos.nombre || datos.email);
        localStorage.setItem('usuarioEmail', datos.email);

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
          texto: errorData.error || 'No se pudo completar el registro con Google.'
        });
      }
    } catch (error) {
      console.error('Error al registrar con Google:', error);
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
        <h3 className="text-center mb-4">Crear Cuenta</h3>

        {mensaje && (
          <div className={`alert alert-${mensaje.tipo} py-2`} role="alert">
            {mensaje.texto}
          </div>
        )}

        <form onSubmit={manejarEnvio}>
          <div className="mb-3">
            <label className="form-label">Nombre Completo</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              placeholder="Ej: Tomás Porras"
              value={formulario.nombre}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Correo Electrónico</label>
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="ejemplo@correo.cl"
              value={formulario.email}
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
              placeholder="Mínimo 6 caracteres"
              minLength={6}
              value={formulario.password}
              onChange={manejarCambio}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100" disabled={cargando}>
            {cargando ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div className="d-flex align-items-center my-3">
          <hr className="flex-grow-1" />
          <span className="px-2 text-muted small">o regístrate con</span>
          <hr className="flex-grow-1" />
        </div>

        <div className="d-flex justify-content-center">
          <GoogleLogin
            onSuccess={manejarRegistroGoogle}
            onError={() =>
              setMensaje({ tipo: 'danger', texto: 'Error al conectar con Google.' })
            }
            text="signup_with"
            shape="rectangular"
            width="380"
          />
        </div>

        <div className="text-center mt-3">
          <small className="text-muted">
            ¿Ya tienes una cuenta?{' '}
            <button
              type="button"
              className="btn btn-link p-0 align-baseline"
              onClick={() => cambiarVista && cambiarVista('iniciar-sesion')}
            >
              Inicia sesión
            </button>
          </small>
        </div>
      </div>
    </div>
  );
}