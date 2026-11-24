import React, { useState } from 'react';

export default function Contacto({ URL_API = 'http://localhost:8081/api/v1' }) {
  const [formulario, setFormulario] = useState({
    nombre: localStorage.getItem('usuarioNombre') || '',
    email: localStorage.getItem('usuarioEmail') || '',
    mensaje: ''
  });

  const [notificacion, setNotificacion] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const manejarCambio = (e) => {
    const { name, value } = e.target;
    setFormulario((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    setNotificacion(null);
    setEnviando(true);

    try {
      const respuesta = await fetch(`${URL_API}/contactos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: formulario.nombre.trim(),
          email: formulario.email.trim(),
          mensaje: formulario.mensaje.trim()
        })
      });

      if (respuesta.ok) {
        setNotificacion({
          tipo: 'success',
          texto: '¡Mensaje enviado! Tu consulta quedó registrada en soporte.'
        });
        setFormulario((prev) => ({
          ...prev,
          mensaje: ''
        }));
      } else {
        const errorData = await respuesta.json().catch(() => ({}));
        setNotificacion({
          tipo: 'danger',
          texto: errorData.error || `Error ${respuesta.status}: No se pudo guardar el mensaje.`
        });
      }
    } catch (error) {
      console.error('Error al enviar contacto:', error);
      setNotificacion({
        tipo: 'danger',
        texto: 'Error de conexión con el servidor (puerto 8081).'
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="container my-5" style={{ maxWidth: '650px' }}>
      <div className="card p-4 shadow-sm">
        <h2 className="mb-2">Contacto y Soporte</h2>
        <p className="text-muted mb-4">
          ¿Tienes dudas sobre tu pedido, envíos o productos? Escríbenos y te responderemos a la brevedad.
        </p>

        {notificacion && (
          <div className={`alert alert-${notificacion.tipo} py-2`} role="alert">
            {notificacion.texto}
          </div>
        )}

        <form onSubmit={manejarEnvio}>
          <div className="mb-3">
            <label htmlFor="contacto-nombre" className="form-label">Nombre Completo</label>
            <input
              id="contacto-nombre"
              type="text"
              name="nombre"
              className="form-control"
              placeholder="Ej: Juan Pérez"
              value={formulario.nombre}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="contacto-email" className="form-label">Correo Electrónico</label>
            <input
              id="contacto-email"
              type="email"
              name="email"
              className="form-control"
              placeholder="tu@correo.cl"
              value={formulario.email}
              onChange={manejarCambio}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="contacto-mensaje" className="form-label">Mensaje o Consulta</label>
            <textarea
              id="contacto-mensaje"
              name="mensaje"
              rows="4"
              className="form-control"
              placeholder="Escribe aquí tu consulta o problema..."
              value={formulario.mensaje}
              onChange={manejarCambio}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={enviando}>
            {enviando ? 'Enviando mensaje...' : 'Enviar Mensaje'}
          </button>
        </form>
      </div>
    </div>
  );
} 