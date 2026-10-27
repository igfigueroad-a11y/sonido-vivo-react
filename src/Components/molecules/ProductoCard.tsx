import { useState } from 'react';
import Boton from '../atoms/Boton';
import ModalDetalleProducto from './ModalDetalleProducto';
import type { producto } from '../../types';

interface Props {
  producto: producto;
  onAgregarCarrito: (prod: producto) => void;
}

export default function ProductoCard({ producto, onAgregarCarrito }: Props) {
  const [verModal, setVerModal] = useState(false);

  return (
    <>
      <div className="card h-100 shadow-sm border-0 bg-white">
        <img src={producto.imagen} className="card-img-top p-3" alt={producto.modelo} style={{ height: '220px', objectFit: 'contain' }} />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title fw-bold text-dark">{producto.modelo}</h5>
          <p className="text-muted small mb-2">{producto.marca} | {producto.categoria}</p>
          <h4 className="fw-bold mb-3">${producto.precio.toLocaleString('es-CL')}</h4>
          
          <div className="mt-auto d-flex gap-2">
            <Boton onClick={() => onAgregarCarrito(producto)} disabled={producto.stock === 0} className="w-50">
              {producto.stock > 0 ? 'Comprar' : 'Agotado'}
            </Boton>
            <Boton variante="outline-minimal" onClick={() => setVerModal(true)} className="w-50">
              Ver Detalle
            </Boton>
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