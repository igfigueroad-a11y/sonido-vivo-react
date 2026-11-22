import { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import HeaderTienda from '../Components/organism/HeaderTienda';
import FooterTienda from '../Components/organism/FooterTienda';
import CartOffcanvas from '../Components/organism/CartOffcanvas';
import { IMAGEN_RESPALDO } from '../Components/molecules/ProductoCard';
import { TiendaContext } from '../context/TiendaContext';

interface ItemOrden {
  id: number;
  codigoProducto: string;
  marca: string;
  modelo: string;
  imagen: string;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

interface OrdenCompra {
  id: number;
  numeroOrden: string;
  usuarioNombre: string;
  clienteNombre: string;
  clienteCorreo: string;
  tipoEntrega: 'RETIRO_TIENDA' | 'ENVIO_STARKEN';
  sucursalRetiro: string;
  regionEnvio: string;
  comunaEnvio: string;
  direccionEnvio: string;
  tiempoEstimado: string;
  cuotas: string;
  subtotal: number;
  costoEnvio: number;
  total: number;
  estado: string;
  fechaCreacion: string;
  items: ItemOrden[];
}

export default function MisPedidosPage() {
  const { usuarioActual, carrito, cambiarCantidadCarrito, mostrarToast } =
    useContext(TiendaContext);
  const location = useLocation();
  const navigate = useNavigate();

  const nuevaOrdenRecienCreada = (location.state as { nuevaOrden?: OrdenCompra } | null)
    ?.nuevaOrden;

  const [ordenes, setOrdenes] = useState<OrdenCompra[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (!usuarioActual) {
      navigate('/login');
      return;
    }

    const cargarPedidos = async () => {
      setCargando(true);
      try {
        const res = await fetch(
          `http://localhost:8083/api/ordenes/usuario/${encodeURIComponent(usuarioActual.nombre)}`,
        );
        if (res.ok) {
          const data: OrdenCompra[] = await res.json();
          setOrdenes(data);
        } else {
          mostrarToast('No se pudo cargar tu historial de pedidos.', 'error');
        }
      } catch (error) {
        console.error('Error conectando con ms-ventas:', error);
        mostrarToast('No se pudo conectar con ms-ventas (puerto 8083).', 'error');
      } finally {
        setCargando(false);
      }
    };

    cargarPedidos();
  }, [usuarioActual, navigate, mostrarToast]);

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      <HeaderTienda />

      <main className="container py-5" style={{ maxWidth: '1000px' }}>
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
          <div>
            <h2 className="fw-bold text-dark mb-1">
              <i className="bi bi-receipt-cutoff me-2"></i>Mis Pedidos y Compras
            </h2>
            <p className="text-muted mb-0">
              Revisa el detalle de tus instrumentos adquiridos, modalidad de entrega y plazos.
            </p>
          </div>
          <Link to="/tienda" className="btn btn-minimal">
            <i className="bi bi-shop me-2"></i>Seguir Comprando
          </Link>
        </div>

        {/* Banner destacado si viene recién pagando desde Checkout */}
        {nuevaOrdenRecienCreada && (
          <div className="alert alert-success border-0 shadow-sm p-4 rounded-4 mb-4">
            <div className="d-flex align-items-center gap-3">
              <i className="bi bi-check-circle-fill fs-2"></i>
              <div>
                <h5 className="fw-bold mb-1">
                  ¡Gracias por tu compra! Orden #{nuevaOrdenRecienCreada.numeroOrden}
                </h5>
                <p className="mb-0 small">
                  Hemos enviado el comprobante a{' '}
                  <strong>{nuevaOrdenRecienCreada.clienteCorreo}</strong>. Entrega estimada:{' '}
                  <strong>{nuevaOrdenRecienCreada.tiempoEstimado}</strong>.
                </p>
              </div>
            </div>
          </div>
        )}

        {cargando ? (
          <div className="card card-minimal p-5 text-center text-muted">
            <div className="spinner-border mx-auto mb-3" role="status"></div>
            <p className="mb-0">Cargando tus pedidos desde el servidor...</p>
          </div>
        ) : ordenes.length === 0 ? (
          <div className="card card-minimal p-5 text-center">
            <i className="bi bi-bag-x fs-1 text-muted mb-3"></i>
            <h4 className="fw-bold">Aún no has realizado compras</h4>
            <p className="text-muted mb-4">
              Cuando completes tu primera compra, aquí verás el detalle completo y el seguimiento.
            </p>
            <div>
              <Link to="/tienda" className="btn btn-minimal px-4 py-2">
                Explorar Catálogo
              </Link>
            </div>
          </div>
        ) : (
          <div className="d-flex flex-column gap-4">
            {ordenes.map((orden) => {
              const esReciente = nuevaOrdenRecienCreada?.numeroOrden === orden.numeroOrden;
              return (
                <div
                  key={orden.id}
                  className={`card card-minimal p-4 ${
                    esReciente ? 'border-success border-2 shadow' : ''
                  }`}
                >
                  {/* Cabecera de la Orden */}
                  <div className="d-flex justify-content-between align-items-start flex-wrap gap-3 border-bottom pb-3 mb-3">
                    <div>
                      <div className="d-flex align-items-center gap-2 mb-1">
                        <span className="badge bg-dark px-3 py-2">{orden.numeroOrden}</span>
                        <span className="badge bg-success">{orden.estado}</span>
                        {esReciente && (
                          <span className="badge bg-warning text-dark">Recién comprada</span>
                        )}
                      </div>
                      <small className="text-muted">
                        Realizada el{' '}
                        {new Date(orden.fechaCreacion).toLocaleDateString('es-CL', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </small>
                    </div>

                    <div className="text-md-end">
                      <span className="text-muted small d-block">Total Pagado</span>
                      <span className="h4 fw-bold text-dark mb-0">
                        ${orden.total.toLocaleString('es-CL')}
                      </span>
                      <small className="text-muted d-block">{orden.cuotas}</small>
                    </div>
                  </div>

                  {/* Información de Entrega (Retiro vs Starken) */}
                  <div className="bg-light p-3 rounded border mb-3">
                    {orden.tipoEntrega === 'RETIRO_TIENDA' ? (
                      <div className="d-flex align-items-start gap-3">
                        <i className="bi bi-shop fs-4 text-dark"></i>
                        <div>
                          <strong className="d-block text-dark">
                            Retiro en Tienda • Listo en {orden.tiempoEstimado}
                          </strong>
                          <span className="small text-secondary">{orden.sucursalRetiro}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="d-flex align-items-start gap-3">
                        <i className="bi bi-truck fs-4 text-dark"></i>
                        <div>
                          <strong className="d-block text-dark">
                            Envío a Domicilio vía Starken • Plazo estimado: {orden.tiempoEstimado}
                          </strong>
                          <span className="small text-secondary">
                            {orden.direccionEnvio}, {orden.comunaEnvio} ({orden.regionEnvio})
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Lista de Productos Comprados */}
                  <div className="d-flex flex-column gap-2 mb-3">
                    {orden.items.map((item) => (
                      <div
                        key={item.id}
                        className="d-flex align-items-center justify-content-between gap-3 py-2 border-bottom"
                      >
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={item.imagen || IMAGEN_RESPALDO}
                            alt={item.modelo}
                            style={{ width: '52px', height: '52px', objectFit: 'contain' }}
                            onError={(e) => {
                              e.currentTarget.onerror = null;
                              e.currentTarget.src = IMAGEN_RESPALDO;
                            }}
                          />
                          <div>
                            <h6 className="mb-0 fw-bold text-dark">
                              {item.marca} {item.modelo}
                            </h6>
                            <small className="text-muted">
                              Código: {item.codigoProducto} • Cantidad: {item.cantidad} x $
                              {item.precioUnitario.toLocaleString('es-CL')}
                            </small>
                          </div>
                        </div>
                        <span className="fw-bold text-dark">
                          ${item.subtotal.toLocaleString('es-CL')}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Desglose Final */}
                  <div className="d-flex justify-content-end gap-4 small text-muted">
                    <span>
                      Subtotal: <strong>${orden.subtotal.toLocaleString('es-CL')}</strong>
                    </span>
                    <span>
                      Despacho:{' '}
                      <strong className={orden.costoEnvio === 0 ? 'text-success' : 'text-dark'}>
                        {orden.costoEnvio === 0
                          ? 'GRATIS'
                          : `$${orden.costoEnvio.toLocaleString('es-CL')}`}
                      </strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <FooterTienda />
      <CartOffcanvas carrito={carrito} onCambiarCantidad={cambiarCantidadCarrito} />
    </div>
  );
}