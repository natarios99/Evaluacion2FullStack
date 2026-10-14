import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import Inicio from '../vistas/Inicio';

describe('Pruebas simples para la vista de Inicio', () => {
  const funcionVistaSimulada = vi.fn();

  test('debe cargar el banner principal de bienvenida', () => {
    render(<Inicio cambiarVista={funcionVistaSimulada} />);

    const tituloBanner = screen.getByRole('heading', { name: /equípate para el rendimiento/i });

    
    expect(tituloBanner).toBeInTheDocument();
  });

  test('debe mostrar las tarjetas de accesos rápidos', () => {
    render(<Inicio cambiarVista={funcionVistaSimulada} />);

    const tarjetaCalzado = screen.getByRole('heading', { name: /calzado deportivo/i });
    expect(tarjetaCalzado).toBeInTheDocument();

    const botonOfertas = screen.getByRole('button', { name: /ver ofertas/i });
    expect(botonOfertas).toBeInTheDocument();
  });
});
