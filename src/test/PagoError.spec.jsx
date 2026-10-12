import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PagoError from '../vistas/PagoError';

describe('Pruebas para PagoError.jsx', () => {

  it('muestra el mensaje de error de pago correctamente', () => {
    render(<PagoError onRetry={() => {}} />);

    // Verifica que el título y mensaje estén en pantalla
    expect(screen.getByText('No se pudo realizar el pago')).toBeInTheDocument();
    expect(screen.getByText('Ocurrió un inconveniente al procesar tu transacción.')).toBeInTheDocument();
  });

  it('ejecuta la función onRetry al hacer clic en el botón', () => {
    const fnReintentar = vi.fn(); // Función falsa
    render(<PagoError onRetry={fnReintentar} />);

    // Busca el botón y le da clic
    const boton = screen.getByText('VOLVER A REALIZAR EL PAGO');
    fireEvent.click(boton);

    // Confirma que la función se ejecutó
    expect(fnReintentar).toHaveBeenCalledTimes(1);
  });

});