import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import ProductCard from '../components/ProductCard';

describe('Pruebas Unitarias Componente ProductCard (Jasmine)', () => {

  const dummyProduct = {
    id: 1,
    nombre: 'Zelda Tears of the Kingdom',
    precio: 59990,
    oferta: true
  };

  // 1. Prueba de Renderizado
  it('Debe renderizar correctamente el nombre del producto', () => {
    render(<ProductCard product={dummyProduct} onAddToCart={() => {}} />);
    expect(screen.getByText('Zelda Tears of the Kingdom')).toBeTruthy();
  });

  // 2. Prueba de Renderizado Condicional
  it('Debe mostrar la insignia de Oferta solo si el producto esta en oferta', () => {
    render(<ProductCard product={dummyProduct} onAddToCart={() => {}} />);
    expect(screen.getByText('OFERTA')).toBeTruthy();
  });

  // 3. Prueba de Eventos
  it('Debe llamar a la función onAddToCart al hacer clic en el botón', () => {
    const handleClick = jasmine.createSpy('handleClick');
    render(<ProductCard product={dummyProduct} onAddToCart={handleClick} />);
    
    const btn = screen.getByText('Añadir al carrito');
    fireEvent.click(btn);

    expect(handleClick).toHaveBeenCalledWith(dummyProduct);
  });
});