import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import DetalleProducto from '../vistas/DetalleProducto';

describe('Pruebas para la vista de Detalle de Producto', () => {
  const funcionCarritoSimulada = vi.fn();
  const funcionVistaSimulada = vi.fn();

  test('Caso 1: Debe avisar al usuario si no hay ningún producto seleccionado', () => {
    render(
      <DetalleProducto 
        producto={null} 
        agregarAlCarrito={funcionCarritoSimulada} 
        cambiarVista={funcionVistaSimulada} 
      />
    );

    const aviso = screen.getByRole('heading', { name: /no se seleccionó ningún producto/i });
    
    expect(aviso).toBeInTheDocument();
  });

  test('Caso 2: Debe cargar los datos reales si se le envía un producto', () => {
    // 1. Inventamos un producto ficticio
    const productoSimulado = {
      id: 99,
      nombre: 'Mancuernas Deportivas 10kg',
      precio: 29990,
      categoria: 'Fitness',
      stock: 5,
      imagen: ''
    };

    render(
      <DetalleProducto 
        producto={productoSimulado} 
        agregarAlCarrito={funcionCarritoSimulada} 
        cambiarVista={funcionVistaSimulada} 
      />
    );

    // 2. Comprobamos que el nombre aparezca
    const tituloProducto = screen.getByRole('heading', { name: /mancuernas deportivas 10kg/i });
    expect(tituloProducto).toBeInTheDocument();

    // 3. Comprobamos que el botón para comprar esté activo y visible
    const botonAñadir = screen.getByRole('button', { name: /añadir al carrito/i });
    expect(botonAñadir).toBeInTheDocument();
  });
});
