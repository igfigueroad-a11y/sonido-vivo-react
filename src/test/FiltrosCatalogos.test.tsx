import { render, screen, fireEvent } from '@testing-library/react';
import FiltrosCatalogo from '../Components/molecules/FiltrosCatalogos';

describe('Molécula: FiltrosCatalogo', () => {
  const setup = () => {
    const mockBusqueda = jasmine.createSpy('onBusquedaChange');
    const mockCategoria = jasmine.createSpy('onCategoriaChange');
    render(
      <FiltrosCatalogo 
        busqueda="" onBusquedaChange={mockBusqueda} 
        categoria="" onCategoriaChange={mockCategoria} 
      />
    );
    return { mockBusqueda, mockCategoria };
  };

  it('Renderiza el input de búsqueda y el select', () => {
    setup();
    expect(screen.getByPlaceholderText(/Buscar por modelo/i)).toBeTruthy();
    expect(screen.getByRole('combobox')).toBeTruthy();
  });

  it('Llama a onBusquedaChange al escribir en el buscador', () => {
    const { mockBusqueda } = setup();
    fireEvent.change(screen.getByPlaceholderText(/Buscar por modelo/i), { target: { value: 'Fender' } });
    expect(mockBusqueda).toHaveBeenCalledWith('Fender');
  });

  it('Llama a onCategoriaChange al seleccionar una opción', () => {
    const { mockCategoria } = setup();
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Guitarras Eléctricas' } });
    expect(mockCategoria).toHaveBeenCalledWith('Guitarras Eléctricas');
  });
});