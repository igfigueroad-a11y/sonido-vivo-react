import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ItemCarrito } from '../../types';
import { TiendaContext } from '../../context/TiendaContext';// Asegúrate de ajustar la ruta de importación si es necesario

interface CartProps {
  carrito: ItemCarrito[];
  onCambiarCantidad: (codigo: string, cambio: number) => void;
  onFinalizarCompra?: () => void; 
}

export default function CartOffcanvas({ carrito, onCambiarCantidad, onFinalizarCompra }: CartProps) {
  const navigate = useNavigate();
  const { usuarioActual } = useContext(TiendaContext); // Consumimos el estado del usuario global
  const precioTotal = carrito.reduce((acc, item) => acc + (item.precio * item.cantidad), 0);

  const handleCheckout = () => {
    // Validamos si NO hay un usuario autenticado (invitado)
    if (!usuarioActual) {
      alert('Debes ingresar como un usuario existente o crear una cuenta para finalizar la compra.');
      navigate('/login');
      return;
    }

    if (onFinalizarCompra) {
      onFinalizarCompra();
    }
    navigate('/checkout'); 
  };

  return (
    <div className="offcanvas offcanvas-end" tabIndex={-1} id="offcanvasCart" aria-labelledby="offcanvasCartLabel">
      <div className="offcanvas-header">
        <h5 className="offcanvas-title text-dark fw-bold" id="offcanvasCartLabel">
          <i className="bi bi-cart3 me-2"></i> Tu Carrito
        </h5>
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
      </div>

      <div className="offcanvas-body d-flex flex-column">
        <div id="cart-items" className="flex-grow-1 overflow-auto pe-2">
          {carrito.length === 0 ? (
            <p className="text-center text-muted mt-4">El carrito está vacío.</p>
          ) : (
            carrito.map(item => (
              <div key={item.codigo} className="card mb-3 card-minimal">
                <div className="card-body p-3 d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0 fw-bold text-dark">{item.modelo}</h6>
                    <small className="text-dark fw-bold">${(item.precio * item.cantidad).toLocaleString('es-CL')}</small>
                  </div>
                  <div className="btn-group btn-group-sm" role="group">
                    <button className="btn btn-outline-minimal px-2" onClick={() => onCambiarCantidad(item.codigo, -1)}>-</button>
                    <span className="btn btn-light disabled text-dark fw-bold px-3">{item.cantidad}</span>
                    <button className="btn btn-outline-minimal px-2" onClick={() => onCambiarCantidad(item.codigo, 1)}>+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-top pt-3 mt-auto">
          <div className="d-flex justify-content-between h5 fw-bold mb-3 text-dark">
            <span>Total:</span>
            <span>${precioTotal.toLocaleString('es-CL')}</span>
          </div>
          <button 
            className="btn btn-minimal btn-lg w-100" 
            onClick={handleCheckout}
            data-bs-dismiss="offcanvas" 
            disabled={carrito.length === 0} 
          >
            Finalizar Compra
          </button>
        </div>
      </div>
    </div>
  );
}