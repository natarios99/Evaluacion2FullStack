import React, { useState } from 'react';

export default function Checkout({ cart, onCompleteOrder }) {
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    correo: '',
    calle: '',
    comuna: 'Cerrillos',
    region: 'Región Metropolitana de Santiago',
    indicaciones: ''
  });

  const total = cart.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const cambioForm = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const alertaRegistro = (e) => {
    e.preventDefault();
    if (!formData.nombre || !formData.correo || !formData.calle) {
      alert('Por favor complete los campos obligatorios');
      return;
    }
    onCompleteOrder(formData, total);
  };

  return (
    <div className="container my-4">
      <h2 className="mb-4">Carrito de compra</h2>
      <div className="row">
        <div className="col-md-8">
          <div className="card p-3 mb-4">
            <h4>Información del clientee</h4>
            <form onSubmit={alertaRegistro}>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Nombre *</label>
                  <input type="text" className="form-control" name="nombre" value={formData.nombre} onChange={cambioForm} required />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Apellidos</label>
                  <input type="text" className="form-control" name="apellidos" value={formData.apellidos} onChange={cambioForm} />
                </div>
                <div className="col-12">
                  <label className="form-label">Correo *</label>
                  <input type="email" className="form-control" name="correo" value={formData.correo} onChange={cambioForm} required />
                </div>
                <h5 className="mt-4">Dirección de entrega</h5>
                <div className="col-md-8">
                  <label className="form-label">Calle *</label>
                  <input type="text" className="form-control" name="calle" value={formData.calle} onChange={cambioForm} required />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Departamento (Opcional)</label>
                  <input type="text" className="form-control" name="depto" placeholder="Ej: 603" />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Comuna</label>
                  <select className="form-select" name="comuna" value={formData.comuna} onChange={cambioForm}>
                    <option value="Cerrillos">Cerrillos</option>
                    <option value="Maipú">Maipú</option>
                    <option value="Santiago">Santiago</option>
                  </select>
                </div>
                <div className="col-12 mt-3">
                  <button type="submit" className="btn btn-success w-100 btn-lg">
                    Pagar ahora ${total.toLocaleString('es-CL')}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>

        {/* Resumen del Pedido */}
        <div className="col-md-4">
          <div className="card p-3">
            <h5>Resumen de productos</h5>
            <ul className="list-group list-group-flush">
              {cart.map((item) => (
                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                  <div>
                    <h6>{item.nombre}</h6>
                    <small className="text-muted">Cant: {item.cantidad}</small>
                  </div>
                  <span>${(item.precio * item.cantidad).toLocaleString('es-CL')}</span>
                </li>
              ))}
            </ul>
            <div className="card-footer d-flex justify-content-between fw-bold">
              <span>Total:</span>
              <span>${total.toLocaleString('es-CL')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}