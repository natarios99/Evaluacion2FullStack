import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import Admin from '../vistas/Admin';

describe('Pruebas básicas para la vista de Administración', () => {
  test('debe mostrar el formulario de productos en la pantalla', () => {
    // Se abre la vista de Admin en el test
    render(<Admin />);

    // Revisa que aparezca el título
    const titulo = screen.getByRole('heading', { name: /administración de productos/i });
    expect(titulo).toBeInTheDocument();

    // Revisa el botón para guardar
    const boton = screen.getByRole('button', { name: /guardar producto/i });
    expect(boton).toBeInTheDocument();
  });
});
