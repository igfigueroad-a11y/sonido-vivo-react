import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import type { ItemCarrito } from '../../types';
import { TiendaContext } from '../../context/TiendaContext';
import { IMAGEN_RESPALDO } from '../molecules/ProductoCard';

interface CartProps {
  carrito: ItemCarrito[];
  onCambiarCantidad: (codigo: string, cambio: number) => void;
}

const META_ENVIO_GRATIS = 150000;

export default function CartOffcanvas({ carrito, onCambiarCantidad }: CartProps) {
  const navigate = useNavigate();
  const { usuarioActual, vaciarCarrito, mostrarToast } = useContext(TiendaContext);

  const precioTotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  const faltanteEnvioGratis = Math.max(0, META_ENVIO_GRATIS - precioTotal);
  const porcentajeEnvio = Math.min(100, (precioTotal / META_ENVIO_GRATIS) * 100);

const handleCheckout = () => {
    if (!usuarioActual) {
      mostrarToast('Inicia sesión o regístrate para finalizar tu compra.', 'warning');
      navigate('/login');
      return;
    }

    if (usuarioActual.rol === 'admin') {
      mostrarToast(
        'No puedes realizar compras como administrador. Crea una cuenta personal de cliente.',
        'warning',
      );
      return;
    }

    navigate('/checkout');
  };
  return (
    <div
      className="offcanvas offcanvas-end"
      tabIndex={-1}
      id="offcanvasCart"
      aria-labelledby="offcanvasCartLabel"
    >
      <div className="offcanvas-header">
        <h5 className="offcanvas-title text-dark fw-bold" id="offcanvasCartLabel">
          <i className="bi bi-cart3 me-2"></i> Tu Carrito
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>

      <div className="offcanvas-body d-flex flex-column">
        {/* Barra de progreso Envío Gratis */}
        {carrito.length > 0 && (
          <div className="p-3 mb-3 rounded bg-light border">
            <div className="small fw-semibold mb-1 text-dark">
              {faltanteEnvioGratis === 0 ? (
                <span className="text-success">
                  <i className="bi bi-truck me-1"></i> ¡Tienes envío gratis en tu pedido!
                </span>
              ) : (
                <span>
                  Te faltan <strong>${faltanteEnvioGratis.toLocaleString('es-CL')}</strong> para{' '}
                  <strong>envío gratis</strong>
                </span>
              )}
            </div>
            <div className="progress" style={{ height: '6px' }}>
              <div
                className={`progress-bar ${faltanteEnvioGratis === 0 ? 'bg-success' : 'bg-dark'}`}
                style={{ width: `${porcentajeEnvio}%` }}
              ></div>
            </div>
          </div>
        )}

        <div id="cart-items" className="flex-grow-1 overflow-auto pe-1">
          {carrito.length === 0 ? (
            <div className="text-center text-muted mt-5">
              <i className="bi bi-bag-x fs-1 d-block mb-2"></i>
              <p className="mb-1 fw-semibold">Tu carrito está vacío</p>
              <small>Explora el catálogo y agrega tus instrumentos favoritos.</small>
            </div>
          ) : (
            carrito.map((item) => (
              <div key={item.codigo} className="card mb-2 card-minimal">
                <div className="card-body p-2 d-flex align-items-center gap-2">
                  <img
                    src={item.imagen || IMAGEN_RESPALDO}
                    alt={item.modelo}
                    style={{ width: '48px', height: '48px', objectFit: 'contain' }}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = IMAGEN_RESPALDO;
                    }}
                  />
                  <div className="flex-grow-1 overflow-hidden">
                    <h6 className="mb-0 fw-bold text-dark text-truncate">{item.modelo}</h6>
                    <small className="text-muted d-block">{item.marca}</small>
                    <small className="text-dark fw-bold">
                      ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                    </small>
                  </div>
                  <div className="btn-group btn-group-sm" role="group">
                    <button
                      className="btn btn-outline-minimal px-2"
                      onClick={() => onCambiarCantidad(item.codigo, -1)}
                    >
                      -
                    </button>
                    <span className="btn btn-light disabled text-dark fw-bold px-2">
                      {item.cantidad}
                    </span>
                    <button
                      className="btn btn-outline-minimal px-2"
                      onClick={() => onCambiarCantidad(item.codigo, 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="border-top pt-3 mt-auto">
          {carrito.length > 0 && (
            <div className="d-flex justify-content-end mb-2">
              <button
                type="button"
                className="btn btn-link btn-sm text-danger text-decoration-none p-0"
                onClick={() => {
                  vaciarCarrito(true);
                  mostrarToast('Carrito vaciado.', 'info');
                }}
              >
                <i className="bi bi-trash me-1"></i> Vaciar carrito
              </button>
            </div>
          )}

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