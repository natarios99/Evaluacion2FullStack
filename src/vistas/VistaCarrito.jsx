import React, { useState } from 'react';

export default function VistaCarrito({
  carrito = [],
  actualizarCantidad,
  eliminarDelCarrito,
  vaciarCarrito,
  cambiarVista,
  onCompraExitosa,
  URL_API = 'http://localhost:8081/api/v1'
}) {
  const [procesando, setProcesando] = useState(false);

  const totalCompra = carrito.reduce(
    (acc, item) => acc + Number(item.precio) * Number(item.cantidad),
    0
  );

  const manejarCompra = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Debes iniciar sesión para finalizar tu compra.');
      if (cambiarVista) cambiarVista('iniciar-sesion');
      return;
    }

    if (carrito.length === 0) return;

    setProcesando(true);
    try {
      const payload = {
        total: totalCompra,
        detalles: carrito.map((item) => ({
          productoId: item.id,
          cantidad: item.cantidad,
          precioUnitario: item.precio
        }))
      };

      const respuesta = await fetch(`${URL_API}/boletas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (respuesta.ok) {
        const boletaCreada = await respuesta.json();
        if (vaciarCarrito) vaciarCarrito();
        if (onCompraExitosa) await onCompraExitosa(boletaCreada);
        if (cambiarVista) cambiarVista('pago-exitoso');
      } else {
        const errorData = await respuesta.json().catch(() => ({}));
        alert(`No se pudo procesar la compra: ${errorData.error || errorData.message || 'Stock insuficiente o sesión expirada'}`);
        if (cambiarVista) cambiarVista('pago-error');
      }
    } catch (error) {
      console.error('Error al registrar la boleta:', error);
      alert('Error de conexión con el servidor al procesar el pago.');
      if (cambiarVista) cambiarVista('pago-error');
    } finally {
      setProcesando(false);
    }
  };

  if (carrito.length === 0) {
    return (
      <div className="container my-5 text-center">
        <div className="card p-5 shadow-sm">
          <h3>Tu carrito está vacío</h3>
          <p className="text-muted">Agrega productos desde nuestro catálogo para comenzar tu compra.</p>
          <div>
            <button
              className="btn btn-primary mt-2"
              onClick={() => cambiarVista && cambiarVista('categorias')}
            >
              Ir a Categorías
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">Carrito de Compras</h2>
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="card shadow-sm p-3">
            <div className="table-responsive">
              <table className="table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th style={{ width: '140px' }}>Cantidad</th>
                    <th>Subtotal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={item.imagen || item.img || '/Zapatillasrunning.webp'}
                            alt={item.nombre}
                            style={{ width: '55px', height: '55px', objectFit: 'cover', borderRadius: '6px' }}
                          />
                          <div>
                            <strong>{item.nombre}</strong>
                            <div className="small text-muted">
                              {item.categoria?.nombre || item.categoria || 'Deportes'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>${Number(item.precio).toLocaleString('es-CL')}</td>
                      <td>
                        <div className="input-group input-group-sm">
                          <button
                            className="btn btn-outline-secondary"
                            onClick={() => actualizarCantidad && actualizarCantidad(item.id, item.cantidad - 1)}
                          >
                            -
                          </button>
                          <span className="input-group-text bg-white">{item.cantidad}</span>
                          <button
                            className="btn btn-outline-secondary"
                            disabled={item.cantidad >= item.stock}
                            onClick={() => actualizarCantidad && actualizarCantidad(item.id, item.cantidad + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="fw-bold">
                        ${(Number(item.precio) * Number(item.cantidad)).toLocaleString('es-CL')}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => eliminarDelCarrito && eliminarDelCarrito(item.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="card shadow-sm p-4">
            <h4 className="mb-3">Resumen de Compra</h4>
            <div className="d-flex justify-content-between mb-2">
              <span>Productos ({carrito.reduce((acc, i) => acc + i.cantidad, 0)}):</span>
              <span>${totalCompra.toLocaleString('es-CL')}</span>
            </div>
            <div className="d-flex justify-content-between mb-3">
              <span>Envío:</span>
              <span className="text-success fw-bold">Gratis</span>
            </div>
            <hr />
            <div className="d-flex justify-content-between fs-5 fw-bold mb-4">
              <span>Total a Pagar:</span>
              <span>${totalCompra.toLocaleString('es-CL')}</span>
            </div>

            <button
              className="btn btn-success w-100 mb-2"
              onClick={manejarCompra}
              disabled={procesando}
            >
              {procesando ? 'Procesando pago...' : 'Comprar ahora'}
            </button>

            <button
              className="btn btn-outline-danger w-100"
              onClick={() => cambiarVista && cambiarVista('pago-error')}
              disabled={procesando}
            >
              Simular Error de Pago
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}