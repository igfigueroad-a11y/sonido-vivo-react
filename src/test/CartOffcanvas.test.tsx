import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

import CartOffcanvas from '../Components/organism/CartOffcanvas';
import type { ItemCarrito } from '../types';

describe('Organismo: CartOffcanvas', () => {
  const mockCambiar = jasmine.createSpy('onCambiarCantidad');
  const mockFinalizar = jasmine.createSpy('onFinalizarCompra');

  beforeEach(() => {
    mockCambiar.calls.reset();
    mockFinalizar.calls.reset();
  });

  it('Muestra mensaje de carrito vacío', () => {
    render(
      <CartOffcanvas
        carrito={[]}
        onCambiarCantidad={mockCambiar}
        onFinalizarCompra={mockFinalizar}
      />,
      { wrapper: MemoryRouter },
    );

    expect(
      screen.getByText('El carrito está vacío.'),
    ).toBeTruthy();
  });

  it('Calcula y renderiza el total correctamente', () => {
    const items: ItemCarrito[] = [
      {
        codigo: '1',
        modelo: 'Guitarra',
        precio: 1000,
        cantidad: 2,
        marca: '',
        categoria: '',
        stock: 10,
        descripcion: '',
        imagen: '',
      },
    ];

    render(
      <CartOffcanvas
        carrito={items}
        onCambiarCantidad={mockCambiar}
        onFinalizarCompra={mockFinalizar}
      />,
      { wrapper: MemoryRouter },
    );

    const total = screen.getByText('$2.000', {
      selector: 'span',
    });

    expect(total).toBeTruthy();
  });
});