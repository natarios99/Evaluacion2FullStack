import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import React from 'react';
import GestionProductos from '../vistas/GestionProductos';

describe('Pruebas simples para la vista de Gestión de Productos', () => {
  
  test('debe mostrar el formulario de registro y el botón de guardado', async () => {
    const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});
    vi.stubGlobal('fetch', vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      })
    ));

    const productosMock = [
      { id: 1, nombre: 'Pelota de Fútbol Profesional', categoria: 'Fútbol', precio: 19990, stock: 12, imagen: 'https://placeholder.com' }
    ];

    render(
      <GestionProductos 
        productos={productosMock} 
        recargarProductosDesdeMySQL={vi.fn()} 
      />
    );

    const tituloPrincipal = screen.getByRole('heading', { name: /panel administrativo/i });
    expect(tituloPrincipal).toBeInTheDocument();

    const subtituloFormulario = screen.getByRole('heading', { name: /agregar nuevo producto deportivo/i });
    expect(subtituloFormulario).toBeInTheDocument();

    const botonGuardar = screen.getByRole('button', { name: /guardar en base de datos/i });
    expect(botonGuardar).toBeInTheDocument();

    vi.unstubAllGlobals();
    alertMock.mockRestore();
  });

});
