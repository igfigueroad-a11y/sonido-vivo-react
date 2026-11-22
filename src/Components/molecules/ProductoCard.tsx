import { useState, useContext } from 'react';
import Boton from '../atoms/Boton';
import ModalDetalleProducto from './ModalDetalleProducto';
import { TiendaContext } from '../../context/TiendaContext';
import type { producto } from '../../types';

export const IMAGEN_RESPALDO =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='220' viewBox='0 0 300 220'><rect width='300' height='220' fill='%23f8fafc'/><text x='50%25' y='46%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='36' fill='%2394a3b8'>🎵</text><text x='50%25' y='64%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='13' fill='%2364748b'>SONIDO VIVO</text></svg>";

interface Props {
  producto: producto;
  onAgregarCarrito: (prod: producto) => void;
}

export default function ProductoCard({ producto, onAgregarCarrito }: Props) {
  const [verModal, setVerModal] = useState(false);
  const { usuarioActual } = useContext(TiendaContext);
  const esAdmin = usuarioActual?.rol === 'admin';

  return (
    <>
      <div className="col">
        <div className="card h-100 producto-card-pro">
          <div className="producto-img-wrapper">
            <img
              src={producto.imagen || IMAGEN_RESPALDO}
              alt={`${producto.marca} ${producto.modelo}`}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = IMAGEN_RESPALDO;
              }}
            />

            {producto.stock === 0 ? (
              <span className="badge bg-danger badge-stock-flotante">Agotado</span>
            ) : producto.stock <= 3 ? (
              <span className="badge bg-warning text-dark badge-stock-flotante">
                ¡Últimas {producto.stock} unid.!
              </span>
            ) : (
              <span className="badge badge-minimal badge-stock-flotante">
                Stock: {producto.stock}
              </span>
            )}
          </div>

          <div className="card-body d-flex flex-column p-4">
            <span className="text-uppercase small fw-semibold text-secondary mb-1">
              {producto.marca} • {producto.categoria}
            </span>
            <h5 className="card-title fw-bold text-dark mb-2">{producto.modelo}</h5>
            <p className="text-muted small mb-3 text-truncate">{producto.descripcion}</p>

            <h4 className="fw-bold mb-3 mt-auto text-dark">
              ${producto.precio.toLocaleString('es-CL')}
            </h4>

            <div className="d-flex gap-2">
              <Boton
                onClick={() => onAgregarCarrito(producto)}
                disabled={producto.stock === 0}
                className="w-50"
              >
                {producto.stock === 0 ? (
                  'Agotado'
                ) : esAdmin ? (
                  <>
                    <i className="bi bi-lock me-1"></i> Solo Clientes
                  </>
                ) : (
                  <>
                    <i className="bi bi-cart-plus me-1"></i> Comprar
                  </>
                )}
              </Boton>
              <Boton
                variante="outline-minimal"
                onClick={() => setVerModal(true)}
                className="w-50"
              >
                Ver Detalle
              </Boton>
            </div>
          </div>
        </div>
      </div>

      {verModal && (
        <ModalDetalleProducto
          producto={producto}
          onClose={() => setVerModal(false)}
          onAgregarCarrito={onAgregarCarrito}
        />
      )}
    </>
  );
}