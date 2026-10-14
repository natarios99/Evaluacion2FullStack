import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import Contacto from '../vistas/Contacto';

describe('Pruebas básicas para la vista de <Contacto />', () => {
  test('debe mostrar el título principal de la sección', () => {
    render(<Contacto />);

    const titulo = screen.getByRole('heading', { name: /contacto & soporte/i });
    
    expect(titulo).toBeInTheDocument();
  });

  test('debe mostrar las etiquetas del formulario correctamente', () => {
    render(<Contacto />);

    expect(screen.getByText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByText(/mensaje o consulta/i)).toBeInTheDocument();

    const botonEnviar = screen.getByRole('button', { name: /enviar mensaje/i });
    expect(botonEnviar).toBeInTheDocument();
  });
});
