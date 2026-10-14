import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import CartView from '../vistas/VistaCarrito';

const carritoMock = [
  { id: 1, nombre: 'Zapatillas', precio: 30000, cantidad: 2, img: '' },
  { id: 2, nombre: 'Polera', precio: 10000, cantidad: 1, img: '' }
];

describe('Pruebas para CartView / VistaCarrito', () => {

  it('muestra el mensaje de carrito vacío cuando no hay productos', () => {
    render(
      <CartView 
        cart={[]} 
        onUpdateQuantity={() => {}} 
        onRemove={() => {}} 
        onProceedToCheckout={() => {}} 
      />
    );

    expect(screen.getByText('El carrito está vacío.')).toBeInTheDocument();
  });

  it('muestra la lista de productos y calcula el total correctamente', () => {
    render(
      <CartView 
        cart={carritoMock} 
        onUpdateQuantity={() => {}} 
        onRemove={() => {}} 
        onProceedToCheckout={() => {}} 
      />
    );

    expect(screen.getByText('Zapatillas')).toBeInTheDocument();
    expect(screen.getByText('Polera')).toBeInTheDocument();
    expect(screen.getByText(/Total: \$70\.000/i)).toBeInTheDocument();
  });

  it('llama a onUpdateQuantity al cambiar la cantidad del input', () => {
    const fnUpdate = vi.fn();
    render(
      <CartView 
        cart={carritoMock} 
        onUpdateQuantity={fnUpdate} 
        onRemove={() => {}} 
        onProceedToCheckout={() => {}} 
      />
    );

    const inputs = screen.getAllByRole('spinbutton');
    fireEvent.change(inputs[0], { target: { value: '3' } });

    expect(fnUpdate).toHaveBeenCalledWith(1, 3);
  });

  it('llama a onRemove al hacer clic en el botón Eliminar', () => {
    const fnRemove = vi.fn();
    render(
      <CartView 
        cart={carritoMock} 
        onUpdateQuantity={() => {}} 
        onRemove={fnRemove} 
        onProceedToCheckout={() => {}} 
      />
    );

    const botonesEliminar = screen.getAllByText('Eliminar');
    fireEvent.click(botonesEliminar[0]);

    expect(fnRemove).toHaveBeenCalledWith(1);
  });

  it('llama a onProceedToCheckout al hacer clic en Comprar ahora', async () => {
    const fnCheckout = vi.fn();
    
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ mensaje: 'Compra procesada con éxito' }),
      })
    ));

    render(
      <CartView 
        cart={carritoMock} 
        onUpdateQuantity={() => {}} 
        onRemove={() => {}} 
        onProceedToCheckout={fnCheckout} 
      />
    );

    const botonComprar = screen.getByText('Comprar ahora');
    fireEvent.click(botonComprar);

    await vi.waitFor(() => {
      expect(fnCheckout).toHaveBeenCalledTimes(1);
    });

    vi.unstubAllGlobals(); 
  });

});
