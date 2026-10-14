import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import PagoError from '../vistas/PagoError';

describe('Pruebas para PagoError.jsx', () => {

  it('muestra el mensaje de error de pago correctamente', () => {
    render(<PagoError onRetry={() => {}} />);

    expect(screen.getByText(/no se pudo realizar el pago/i)).toBeInTheDocument();
    expect(screen.getByText(/ocurrio un inconveniente al procesar tu transaccion/i)).toBeInTheDocument();
  });

  it('ejecuta la función onRetry al hacer clic en el botón', () => {
    const fnReintentar = vi.fn(); 
    render(<PagoError onRetry={fnReintentar} />);

    const boton = screen.getByRole('button', { name: /volver a realizar el pago/i });
    fireEvent.click(boton);

    // Confirma que la función se ejecutó
    expect(fnReintentar).toHaveBeenCalledTimes(1);
  });

});
