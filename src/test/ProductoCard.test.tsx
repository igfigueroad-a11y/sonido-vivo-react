/// <reference types="jasmine" />
import { render, screen, fireEvent } from '@testing-library/react';
import ProductoCard from '../Components/molecules/ProductoCard';

describe('Molécula: ProductoCard', () => {
  const productoBase = {
    codigo: 'P01', categoria: 'Guitarras', modelo: 'Stratocaster',
    marca: 'Fender', stock: 5, precio: 500000, descripcion: 'Guitarra', imagen: 'img.jpg'
  };

  it('Renderiza la información del producto', () => {
    render(<ProductoCard producto={productoBase} onAgregarCarrito={()=>{}} />);
    expect(screen.getByText('Stratocaster')).toBeTruthy();
    expect(screen.getByText('$500.000')).toBeTruthy();
  });

  it('Permite agregar al carrito si hay stock', () => {
    const mockAdd = jasmine.createSpy('onAgregarCarrito');
    render(<ProductoCard producto={productoBase} onAgregarCarrito={mockAdd} />);
    
    // Buscamos el botón "Comprar" exacto de tu componente
    fireEvent.click(screen.getByRole('button', { name: /Comprar/i }));
    expect(mockAdd).toHaveBeenCalledWith(productoBase);
  });

  it('Deshabilita el botón si el stock es cero', () => {
    const productoSinStock = { ...productoBase, stock: 0 };
    render(<ProductoCard producto={productoSinStock} onAgregarCarrito={()=>{}} />);
    
    // Buscamos el botón "Agotado"
    const botonAgotado = screen.getByRole('button', { name: /Agotado/i }) as HTMLButtonElement;
    expect(botonAgotado.disabled).toBe(true);
  });
});