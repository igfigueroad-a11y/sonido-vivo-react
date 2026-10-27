/// <reference types="jasmine" />
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CheckoutPage from '../pages/CheckoutPage';

describe('Página: CheckoutPage', () => {
  const renderizar = () => render(
    <BrowserRouter>
      <CheckoutPage />
    </BrowserRouter>
  );

  it('Renderiza las secciones de Envío y Pago', () => {
    renderizar();
    expect(screen.getByText(/Datos de Envío/i)).toBeTruthy();
    expect(screen.getByText(/Método de Pago/i)).toBeTruthy();
  });

  it('Permite escribir el nombre del cliente', () => {
    const { container } = renderizar();
    // Seleccionamos el input por su atributo "name" en lugar de "role"
    const inputNombre = container.querySelector('input[name="nombre"]') as HTMLInputElement;
    fireEvent.change(inputNombre, { target: { value: 'Juan Pérez' } });
    expect(inputNombre.value).toBe('Juan Pérez');
  });
});