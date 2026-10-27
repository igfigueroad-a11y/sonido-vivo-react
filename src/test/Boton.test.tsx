import { render, screen, fireEvent } from '@testing-library/react';
import Boton from '../Components/atoms/Boton';

describe('Átomo: Boton', () => {
  it('Renderiza el texto correctamente', () => {
    render(<Boton>Haz clic</Boton>);
    expect(screen.getByText('Haz clic')).toBeTruthy();
  });

  it('Llama a la función onClick al ser presionado', () => {
    const mockOnClick = jasmine.createSpy('onClick');
    render(<Boton onClick={mockOnClick}>Comprar</Boton>);
    fireEvent.click(screen.getByRole('button', { name: /comprar/i }));
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('Aplica la variante outline-minimal correctamente', () => {
    render(<Boton variante="outline-minimal">Secundario</Boton>);
    expect(screen.getByRole('button').className).toContain('btn-outline-minimal');
  });
});