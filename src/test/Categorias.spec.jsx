import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import Categorias from '../vistas/Categorias';

describe('Pruebas nivel estudiante para la vista de <Categorias />', () => {
  const productosSimulados = [
    {
      id: 1,
      nombre: 'Zapatillas de Running Deportivas',
      precio: 49990,
      categoria: 'Calzado',
      stock: 10,
      oferta: 0,
      imagen: ''
    }
  ];

  const funcionCarritoSimulada = vi.fn();

  test('debe mostrar el título principal de la tienda', () => {
    render(<Categorias productos={productosSimulados} agregarAlCarrito={funcionCarritoSimulada} />);

    const titulo = screen.getByRole('heading', { name: /tienda de deportes & performance/i });
    expect(titulo).toBeInTheDocument();
  });

  test('debe listar correctamente los nombres de los productos en pantalla', () => {
    render(<Categorias productos={productosSimulados} agregarAlCarrito={funcionCarritoSimulada} />);

    const nombreProducto = screen.getByRole('heading', { name: /zapatillas de running deportivas/i });
    expect(nombreProducto).toBeInTheDocument();
  });
});
