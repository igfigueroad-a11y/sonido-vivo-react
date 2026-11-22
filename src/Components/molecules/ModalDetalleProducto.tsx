import { useState, useEffect, useContext, type FormEvent } from 'react';
import Boton from '../atoms/Boton';
import { IMAGEN_RESPALDO } from './ProductoCard';
import { TiendaContext } from '../../context/TiendaContext';
import type { producto } from '../../types';

interface ResenaItem {
  id: number;
  codigoProducto: string;
  autorNombre: string;
  puntuacion: number;
  comentario: string;
  fechaCreacion: string;
}

interface ModalProps {
  producto: producto;
  onClose: () => void;
  onAgregarCarrito: (prod: producto) => void;
}

const API_RESENAS = 'http://localhost:8085/api/resenas';

export default function ModalDetalleProducto({
  producto,
  onClose,
  onAgregarCarrito,
}: ModalProps) {
  const { usuarioActual, mostrarToast } = useContext(TiendaContext);

  const [resenas, setResenas] = useState<ResenaItem[]>([]);
  const [cargandoResenas, setCargandoResenas] = useState(true);
  const [autor, setAutor] = useState(usuarioActual?.nombre || '');
  const [puntuacion, setPuntuacion] = useState<number>(5);
  const [comentario, setComentario] = useState('');
  const [errorResena, setErrorResena] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    let activo = true;
    const cargarResenas = async () => {
      setCargandoResenas(true);
      try {
        const res = await fetch(
          `${API_RESENAS}/producto/${encodeURIComponent(producto.codigo)}`,
        );
        if (res.ok && activo) {
          const data: ResenaItem[] = await res.json();
          setResenas(data);
        }
      } catch (err) {
        console.error('Error cargando reseñas:', err);
      } finally {
        if (activo) setCargandoResenas(false);
      }
    };

    cargarResenas();
    return () => {
      activo = false;
    };
  }, [producto.codigo]);

  const promedioEstrellas =
    resenas.length > 0
      ? (
          resenas.reduce((acc, r) => acc + r.puntuacion, 0) / resenas.length
        ).toFixed(1)
      : null;

  const handlePublicarResena = async (e: FormEvent) => {
    e.preventDefault();

    if (autor.trim().length < 2) {
      setErrorResena('Ingresa tu nombre (mínimo 2 caracteres).');
      return;
    }

    if (comentario.trim().length < 5) {
      setErrorResena('Escribe un comentario de al menos 5 caracteres.');
      return;
    }

    setErrorResena('');
    setEnviando(true);

    try {
      const res = await fetch(API_RESENAS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          codigoProducto: producto.codigo,
          autorNombre: autor.trim(),
          puntuacion,
          comentario: comentario.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        mostrarToast(data.mensaje || 'No se pudo publicar la reseña.', 'error');
        return;
      }

      setResenas((prev) => [data, ...prev]);
      setComentario('');
      setPuntuacion(5);
      mostrarToast('¡Gracias por dejar tu reseña del instrumento!', 'success');
    } catch (err) {
      console.error('Error publicando reseña:', err);
      mostrarToast('No se pudo conectar con ms-resenas (puerto 8085).', 'error');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: 'rgba(0,0,0,0.6)', zIndex: 1050 }}
      tabIndex={-1}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header border-bottom">
            <div>
              <span className="badge badge-minimal mb-1">{producto.codigo}</span>
              <h5 className="modal-title fw-bold fs-4">
                {producto.marca} {producto.modelo}
              </h5>
              <small className="text-muted">
                <i className="bi bi-star-fill text-warning me-1"></i>
                {promedioEstrellas
                  ? `${promedioEstrellas} / 5 (${resenas.length} ${
                      resenas.length === 1 ? 'reseña' : 'reseñas'
                    })`
                  : 'Sin calificaciones aún'}
              </small>
            </div>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Cerrar"
            ></button>
          </div>

          <div className="modal-body px-4">
            <div className="row g-4 align-items-center mb-4">
              <div className="col-md-5 text-center">
                <img
                  src={producto.imagen || IMAGEN_RESPALDO}
                  alt={producto.modelo}
                  className="img-fluid rounded"
                  style={{ maxHeight: '220px', objectFit: 'contain' }}
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = IMAGEN_RESPALDO;
                  }}
                />
              </div>
              <div className="col-md-7">
                <div className="bg-light p-3 rounded border">
                  <p className="mb-1">
                    <strong>Marca:</strong> {producto.marca}
                  </p>
                  <p className="mb-1">
                    <strong>Categoría:</strong> {producto.categoria}
                  </p>
                  <p className="mb-1">
                    <strong>Disponibilidad:</strong>{' '}
                    {producto.stock > 0
                      ? `${producto.stock} unidades en stock`
                      : 'Sin stock'}
                  </p>
                  <p className="mb-0 mt-2 text-secondary small">{producto.descripcion}</p>
                </div>
                <h3 className="fw-bold mt-3 mb-0">
                  ${producto.precio.toLocaleString('es-CL')}
                </h3>
              </div>
            </div>

            {/* Sección de Reseñas del Instrumento */}
            <div className="border-top pt-4">
              <h6 className="fw-bold mb-3">
                <i className="bi bi-chat-square-quote me-2"></i>Opiniones de Músicos
              </h6>

              <form
                onSubmit={handlePublicarResena}
                className="bg-light p-3 rounded border mb-4"
                noValidate
              >
                <div className="row g-2 mb-2">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold mb-1">Tu Nombre</label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      placeholder="Ej. Camila Rojas"
                      value={autor}
                      onChange={(e) => {
                        setAutor(e.target.value);
                        setErrorResena('');
                      }}
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold mb-1">Calificación</label>
                    <div className="d-flex gap-1 pt-1">
                      {[1, 2, 3, 4, 5].map((estrella) => (
                        <button
                          key={estrella}
                          type="button"
                          className={`btn btn-sm ${
                            puntuacion >= estrella ? 'btn-warning' : 'btn-outline-secondary'
                          }`}
                          onClick={() => setPuntuacion(estrella)}
                        >
                          <i className="bi bi-star-fill"></i>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mb-2">
                  <label className="form-label small fw-bold mb-1">Comentario</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    placeholder="¿Cómo suena, qué tal su terminación o comodidad?"
                    value={comentario}
                    onChange={(e) => {
                      setComentario(e.target.value);
                      setErrorResena('');
                    }}
                  />
                </div>

                {errorResena && (
                  <div className="text-danger small fw-semibold mb-2">{errorResena}</div>
                )}

                <button
                  type="submit"
                  className="btn btn-sm btn-minimal px-3"
                  disabled={enviando}
                >
                  {enviando ? 'Publicando...' : 'Publicar Reseña'}
                </button>
              </form>

              {cargandoResenas ? (
                <p className="text-muted small">Cargando reseñas...</p>
              ) : resenas.length === 0 ? (
                <p className="text-muted small mb-0">
                  Este instrumento aún no tiene reseñas. ¡Sé el primero en opinar!
                </p>
              ) : (
                <div className="d-flex flex-column gap-2">
                  {resenas.map((r) => (
                    <div key={r.id} className="p-3 rounded border bg-white">
                      <div className="d-flex justify-content-between align-items-center mb-1">
                        <strong className="small text-dark">{r.autorNombre}</strong>
                        <span className="text-warning small">
                          {'★'.repeat(r.puntuacion)}
                          {'☆'.repeat(5 - r.puntuacion)}
                        </span>
                      </div>
                      <p className="mb-0 small text-secondary">{r.comentario}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="modal-footer border-top">
            <button type="button" className="btn btn-outline-minimal" onClick={onClose}>
              Cerrar
            </button>
            <Boton
              onClick={() => {
                onAgregarCarrito(producto);
                onClose();
              }}
              disabled={producto.stock === 0}
              className="flex-grow-1"
            >
              <i className="bi bi-cart-plus me-2"></i>
              {producto.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
            </Boton>
          </div>
        </div>
      </div>
    </div>
  );
}