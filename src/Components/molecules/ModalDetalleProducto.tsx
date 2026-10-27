import Boton from '../atoms/Boton';
import type { producto } from '../../types';

interface ModalProps {
  producto: producto;
  onClose: () => void;
  onAgregarCarrito: (prod: producto) => void;
}

export default function ModalDetalleProducto({ producto, onClose, onAgregarCarrito }: ModalProps) {
  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }} tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0">
            <h5 className="modal-title fw-bold fs-4">{producto.modelo}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Cerrar"></button>
          </div>
          <div className="modal-body text-center px-4">
            <img src={producto.imagen} alt={producto.modelo} className="img-fluid mb-4 rounded shadow-sm" style={{ maxHeight: '250px' }} />
            <div className="text-start bg-light p-3 rounded">
              <p className="mb-1"><strong>Marca:</strong> {producto.marca}</p>
              <p className="mb-1"><strong>Categoría:</strong> {producto.categoria}</p>
              <p className="mb-1"><strong>Stock:</strong> {producto.stock} unidades disponibles</p>
              <p className="mb-0 mt-2 text-muted">{producto.descripcion}</p>
            </div>
            <h3 className="fw-bold mt-4 mb-0">${producto.precio.toLocaleString('es-CL')}</h3>
          </div>
          <div className="modal-footer border-0">
            <Boton 
              onClick={() => { onAgregarCarrito(producto); onClose(); }} 
              disabled={producto.stock === 0} 
              className="w-100"
            >
              Agregar al Carrito
            </Boton>
          </div>
        </div>
      </div>
    </div>
  );
}