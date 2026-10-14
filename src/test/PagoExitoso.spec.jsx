import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PagoExitoso from '../vistas/PagoExitoso';

// Datos falsos de la orden para la prueba
const ordenMock = {
  id: '12345',
  nombre: 'Juan Pérez',
  correo: 'juan@example.com',
  calle: 'Av. Siempre Viva 123',
  comuna: 'Santiago',
  total: 45000
};

describe('Pruebas para PagoExitoso.jsx', () => {

  it('muestra los datos de la orden y del cliente correctamente', () => {
    render(<PagoExitoso orderData={ordenMock} onBackHome={() => {}} />);

    // Verifica que se muestre el código, datos del cliente y total
    expect(screen.getByText(/#12345/i)).toBeInTheDocument();
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('juan@example.com')).toBeInTheDocument();
    expect(screen.getByText(/45\.000/i)).toBeInTheDocument();
  });

  it('ejecuta la función onBackHome al hacer clic en el botón', () => {
    const fnVolver = vi.fn();
    render(<PagoExitoso orderData={ordenMock} onBackHome={fnVolver} />);

    // Busca el botón y hace clic
    const boton = screen.getByText('Volver a la tienda');
    fireEvent.click(boton);

    // Confirma que la función fue ejecutada
    expect(fnVolver).toHaveBeenCalledTimes(1);
  });

});