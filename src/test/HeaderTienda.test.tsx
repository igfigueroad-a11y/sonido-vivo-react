import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import HeaderTienda from '../Components/organism/HeaderTienda';

describe('Organismo: HeaderTienda', () => {
  const renderConRouter = (cantidad: number) => {
    render(<BrowserRouter><HeaderTienda cantidadCarrito={cantidad} /></BrowserRouter>);
  };

  it('Muestra el título principal de la tienda', () => {
    renderConRouter(0);
    expect(screen.getByText('SONIDO VIVO')).toBeTruthy();
  });

  it('Muestra la cantidad de items en el carrito dinámicamente', () => {
    renderConRouter(3);
    expect(screen.getByText(/Carrito \(3\)/i)).toBeTruthy();
  });
});