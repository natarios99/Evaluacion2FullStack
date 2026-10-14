import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, test, expect, vi } from 'vitest';
import Checkout from '../vistas/Checkout';

describe('Pruebas unitarias para la vista de <Checkout />', () => {
  const carritoSimulado = [
    { id: 1, nombre: 'Producto de Prueba', precio: 10000, cantidad: 2 }
  ];

  const funcionCompletarSimulada = vi.fn();

  test('debe renderizar los títulos de la vista correctamente', () => {
    render(<Checkout cart={carritoSimulado} onCompleteOrder={funcionCompletarSimulada} />);

    expect(screen.getByRole('heading', { name: /carrito de compra/i })).toBeInTheDocument();
    
    expect(screen.getByRole('heading', { name: /información del cliente/i })).toBeInTheDocument();
  });

  test('debe mostrar los campos obligatorios del formulario', () => {
    render(<Checkout cart={carritoSimulado} onCompleteOrder={funcionCompletarSimulada} />);

    expect(screen.getByText(/nombre \*/i)).toBeInTheDocument();
    expect(screen.getByText(/correo \*/i)).toBeInTheDocument();
    expect(screen.getByText(/calle \*/i)).toBeInTheDocument();
  });

  test('debe calcular el total correctamente basado en los productos del carrito', () => {
    render(<Checkout cart={carritoSimulado} onCompleteOrder={funcionCompletarSimulada} />);

    const botonPagar = screen.getByRole('button', { name: /pagar ahora \$20\.000/i });
    expect(botonPagar).toBeInTheDocument();
  });
});
