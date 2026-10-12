import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Ofertas from '../vistas/Ofertas';

const productosEjemplo = [
  { id: 1, nombre: 'Zapatillas', precio: 50000, stock: 5, oferta: 1, imagen: '' },
  { id: 2, nombre: 'Polera', precio: 15000, stock: 0, oferta: 1, imagen: '' },
  { id: 3, nombre: 'Pelota', precio: 20000, stock: 10, oferta: 0, imagen: '' }
];

describe('Pruebas para Ofertas.jsx', () => {

  it('muestra solo productos que tienen oferta === 1', () => {
    render(<Ofertas productos={productosEjemplo} agregarAlCarrito={() => {}} />);

    expect(screen.getByText('Zapatillas')).toBeInTheDocument();
    expect(screen.getByText('Polera')).toBeInTheDocument();
    expect(screen.queryByText('Pelota')).not.toBeInTheDocument();
  });

  it('ejecuta agregarAlCarrito al pulsar el botón', () => {
    const fnAgregar = vi.fn();
    render(<Ofertas productos={productosEjemplo} agregarAlCarrito={fnAgregar} />);

    const boton = screen.getByText('Añadir al Carrito');
    fireEvent.click(boton);

    expect(fnAgregar).toHaveBeenCalledWith(productosEjemplo[0]);
  });

  it('muestra "Sin Stock" y inhabilita el botón si no hay unidades', () => {
    render(<Ofertas productos={productosEjemplo} agregarAlCarrito={() => {}} />);

    const botonSinStock = screen.getByText('Sin Stock');
    expect(botonSinStock).toBeDisabled();
  });

});