import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import IniciarSesion from '../vistas/IniciarSesion';

describe('Pruebas simples para la vista de Iniciar Sesión', () => {
  const funcionVistaSimulada = vi.fn();

  test('debe mostrar el título y los campos del formulario de ingreso', () => {

    render(<IniciarSesion cambiarVista={funcionVistaSimulada} />);

    const titulo = screen.getByRole('heading', { name: /iniciar sesión/i });
    expect(titulo).toBeInTheDocument();

    expect(screen.getByText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByText(/contraseña/i)).toBeInTheDocument();

    const botonEntrar = screen.getByRole('button', { name: /entrar/i });
    expect(botonEntrar).toBeInTheDocument();
  });
});
