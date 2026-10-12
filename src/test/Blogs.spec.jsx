import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import Blogs from '../vistas/Blogs';

describe('Pruebas básicas para la vista de <Blogs />', () => {
  test('debe mostrar el título principal del blog', () => {
    // Se abre la pantalla de Blogs en el test
    render(<Blogs />);

    // Busca el título en la pantalla
    const tituloPrincipal = screen.getByRole('heading', { name: /blog de deporte y vida sana/i });
    
    // Verificamos que esté ahí presente
    expect(tituloPrincipal).toBeInTheDocument();
  });

  test('debe mostrar los títulos de los artículos disponibles', () => {
    render(<Blogs />);

    const tituloArticulo = screen.getByRole('heading', { name: /cómo elegir las zapatillas de running ideales/i });
    
    expect(tituloArticulo).toBeInTheDocument();
  });
});
