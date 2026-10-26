import type { producto } from '../../types';
import Boton from '../atoms/Boton'; 

interface ProductoCardProps {
  producto: producto;
  onAgregarCarrito: (prod: producto) => void;
}

export default function ProductoCard({ producto, onAgregarCarrito }: ProductoCardProps) {
  return (
    <div className="col">
      <div className="card card-minimal h-100">
        <div className="card-body d-flex flex-column">
          <span className="badge badge-minimal text-uppercase mb-2 align-self-start" style={{ fontSize: '0.7rem' }}>
            {producto.categoria}
          </span>
          <img src={producto.imagen} className="card-img-top mb-3" alt={producto.modelo} />
          <h5 className="card-title fw-bold text-dark mb-1">{producto.modelo}</h5>
          <h6 className="card-subtitle text-secondary mb-2 fs-6">{producto.marca}</h6>
          <p className="card-text text-muted small flex-grow-1">{producto.descripcion}</p>
          <div className="pt-3 border-top d-flex justify-content-between align-items-center">
            <div>
              <span className="fs-5 fw-bold text-dark me-1">${producto.precio.toLocaleString('es-CL')}</span>
              <small className="text-muted d-block">(Stock: {producto.stock})</small>
            </div>
            
            <Boton 
              variante="minimal"
              className="btn-sm px-3" 
              onClick={() => onAgregarCarrito(producto)}
              disabled={producto.stock <= 0}
            >
              <i className="bi bi-cart-plus me-1"></i> {producto.stock <= 0 ? "Sin stock" : "Agregar"}
            </Boton>
            
          </div>
        </div>
      </div>
    </div>
  );
}