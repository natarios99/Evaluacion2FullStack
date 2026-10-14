import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import GestionProductos from '../vistas/GestionProductos';

describe('Pruebas simples para la vista de Gestión de Productos', () => {
  // Datos falsos
  const listaProductosFalsos = [
    {
      id: 1,
      nombre: 'Pelota de Fútbol Profesional',
      precio: 19990,
      categoria: 'Fútbol',
      stock: 12,
      imagen: 'https://placeholder.com'
    }
  ];

  // Simulamos las funciones obligatorias
  const funcionRecargarSimulada = vi.fn();
  const urlApiSimulada = 'http://localhost:3000/api';

  test('debe mostrar el formulario de registro y el botón de guardado', () => {
    render(
      <GestionProductos 
        productos={listaProductosFalsos} 
        recargarProductosDesdeMySQL={funcionRecargarSimulada} 
        URL_API={urlApiSimulada} 
      />
    );

    const tituloPanel = screen.getByRole('heading', { name: /panel administrativo - inventario de productos/i });
    expect(tituloPanel).toBeInTheDocument();

    const botonGuardar = screen.getByRole('button', { name: /guardar en base de datos/i });
    expect(botonGuardar).toBeInTheDocument();
  });

  test('debe listar los productos existentes dentro de la tabla', () => {
    render(
      <GestionProductos 
        productos={listaProductosFalsos} 
        recargarProductosDesdeMySQL={funcionRecargarSimulada} 
        URL_API={urlApiSimulada} 
      />
    );

const celdaProducto = screen.getByText('Pelota de Fútbol Profesional');

    expect(celdaProducto).toBeInTheDocument();
  });
});
