import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';
import RegistroUsuario from '../vistas/RegistroUsuario';

it('registra con éxito y llama a cambiarVista cuando los datos son correctos', async () => {
  const fnCambiarVista = vi.fn();
  const alertMock = vi.spyOn(window, 'alert').mockImplementation(() => {});

  vi.stubGlobal('fetch', vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ success: true }),
    })
  ));

  const { container } = render(<RegistroUsuario cambiarVista={fnCambiarVista} />); 

  const inputsConst = container.querySelectorAll('input');
  const inputNombre = inputsConst[0];
  const inputEmail = inputsConst[1];
  const inputPassword = inputsConst[2];
  const inputConfirmar = inputsConst[3];

  fireEvent.change(inputNombre, { target: { value: 'Juan Pérez' } });
  fireEvent.change(inputEmail, { target: { value: 'juan@correo.com' } });
  fireEvent.change(inputPassword, { target: { value: '123456' } });
  fireEvent.change(inputConfirmar, { target: { value: '123456' } });

  const botonRegistro = screen.getByRole('button', { name: /registrarse/i });
  fireEvent.click(botonRegistro);

  await vi.waitFor(() => {
    expect(fnCambiarVista).toHaveBeenCalledWith('iniciar-sesion');
  });

  expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('Cuenta creada con éxito'));

  vi.unstubAllGlobals();
  alertMock.mockRestore();
});
