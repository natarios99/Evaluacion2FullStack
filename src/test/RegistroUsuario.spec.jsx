import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import RegistroUsuario from '../vistas/RegistroUsuario';

describe('Pruebas para RegistroUsuario.jsx', () => {

  beforeEach(() => {
    vi.spyOn(window, 'alert').mockImplementation(() => {});
  });

  it('renderiza correctamente el formulario de registro', () => {
    render(<RegistroUsuario cambiarVista={() => {}} />);

    expect(screen.getByText('Crear Cuenta')).toBeInTheDocument();
    expect(screen.getByText('Nombre Completo')).toBeInTheDocument();
    expect(screen.getByText('Correo Electrónico')).toBeInTheDocument();
  });

  it('muestra una alerta si las contraseñas no coinciden', () => {
    const { container } = render(<RegistroUsuario cambiarVista={() => {}} />);
    const inputs = container.querySelectorAll('input');

    fireEvent.change(inputs[0], { target: { value: 'Juan' } });
    fireEvent.change(inputs[1], { target: { value: 'juan@test.com' } });
    fireEvent.change(inputs[2], { target: { value: '123456' } });
    fireEvent.change(inputs[3], { target: { value: '999999' } });

    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));

    expect(window.alert).toHaveBeenCalledWith('Las contraseñas no coinciden.');
  });

  it('registra con éxito y llama a cambiarVista cuando los datos son correctos', () => {
    const fnCambiarVista = vi.fn();
    const { container } = render(<RegistroUsuario cambiarVista={fnCambiarVista} />);
    const inputs = container.querySelectorAll('input');

    fireEvent.change(inputs[0], { target: { value: 'Juan' } });
    fireEvent.change(inputs[1], { target: { value: 'juan@test.com' } });
    fireEvent.change(inputs[2], { target: { value: '123456' } });
    fireEvent.change(inputs[3], { target: { value: '123456' } });

    fireEvent.click(screen.getByRole('button', { name: 'Registrarse' }));

    expect(window.alert).toHaveBeenCalledWith('¡Cuenta creada con éxito para Juan!');
    expect(fnCambiarVista).toHaveBeenCalledWith('iniciar-sesion');
  });

  it('llama a cambiarVista("iniciar-sesion") al hacer clic en el enlace inferior', () => {
    const fnCambiarVista = vi.fn();
    render(<RegistroUsuario cambiarVista={fnCambiarVista} />);

    fireEvent.click(screen.getByText('Inicia Sesión aquí'));

    expect(fnCambiarVista).toHaveBeenCalledWith('iniciar-sesion');
  });

});