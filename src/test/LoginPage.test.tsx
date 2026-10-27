import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';

describe('Página: LoginPage', () => {
  const renderConRouter = () => render(<BrowserRouter><LoginPage /></BrowserRouter>);

  it('Renderiza por defecto la vista de iniciar sesión', () => {
    renderConRouter();
    expect(screen.getByRole('button', { name: 'ENTRAR' })).toBeTruthy();
    expect(screen.queryByLabelText(/Correo Electrónico/i)).toBeNull();
  });

  it('Cambia a modo registro al hacer clic en "Crear cuenta"', () => {
    renderConRouter();
    fireEvent.click(screen.getByRole('button', { name: /Crear cuenta/i }));
    expect(screen.getByRole('button', { name: 'REGISTRARSE' })).toBeTruthy();
    expect(screen.getByLabelText(/Correo Electrónico/i)).toBeTruthy();
  });
});