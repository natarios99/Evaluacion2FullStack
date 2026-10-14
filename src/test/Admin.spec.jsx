import { render, screen, fireEvent } from '@testing-library/react'; // Corregido: usamos fireEvent
import { describe, test, expect, vi, beforeEach } from 'vitest';
import Admin from '../vistas/Admin';

describe('Pruebas básicas para la vista de Administración', () => {
  
  beforeEach(() => {
    global.fetch = vi.fn((url) => {
      if (url.includes('/admin/stats')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ compras: 10, probabilidadAumento: 20, productos: 5, inventarioActual: 50, usuarios: 2, nuevosUsuariosMes: 1 }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
    });
  });

  test('debe mostrar el formulario de productos en la pantalla', async () => {
    render(<Admin />);

    const tituloDashboard = await screen.findByRole('heading', { name: /dashboard/i });
    expect(tituloDashboard).toBeInTheDocument();

    const botonTabProductos = screen.getByRole('button', { name: /productos/i });
    fireEvent.click(botonTabProductos);

    const tituloGestion = await screen.findByRole('heading', { name: /gestion de productos/i });
    expect(tituloGestion).toBeInTheDocument();

    const tituloFormulario = screen.getByRole('heading', { name: /agregar producto/i });
    expect(tituloFormulario).toBeInTheDocument();
  });
});

