import { useState, useContext, useEffect, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import HeaderTienda from '../Components/organism/HeaderTienda';
import FooterTienda from '../Components/organism/FooterTienda';
import Boton from '../Components/atoms/Boton';
import { TiendaContext } from '../context/TiendaContext';

interface TarifaRegion {
  region: string;
  zona: string;
  precioBase: number;
  tiempo: string;
}

const TARIFAS_STARKEN: TarifaRegion[] = [
  { region: 'Región Metropolitana', zona: 'RM', precioBase: 4990, tiempo: '1 a 2 días hábiles' },
  { region: 'Valparaíso', zona: 'Zona Centro', precioBase: 6990, tiempo: '2 a 3 días hábiles' },
  { region: "O'Higgins", zona: 'Zona Centro', precioBase: 6990, tiempo: '2 a 3 días hábiles' },
  { region: 'Maule', zona: 'Zona Centro', precioBase: 6990, tiempo: '2 a 3 días hábiles' },
  { region: 'Coquimbo', zona: 'Zona Centro', precioBase: 6990, tiempo: '2 a 3 días hábiles' },
  { region: 'Ñuble', zona: 'Zona Sur', precioBase: 8990, tiempo: '3 a 4 días hábiles' },
  { region: 'Biobío', zona: 'Zona Sur', precioBase: 8990, tiempo: '3 a 4 días hábiles' },
  { region: 'La Araucanía', zona: 'Zona Sur', precioBase: 8990, tiempo: '3 a 4 días hábiles' },
  { region: 'Los Ríos', zona: 'Zona Sur', precioBase: 8990, tiempo: '3 a 4 días hábiles' },
  { region: 'Los Lagos', zona: 'Zona Sur', precioBase: 8990, tiempo: '3 a 4 días hábiles' },
  { region: 'Atacama', zona: 'Norte Grande', precioBase: 10990, tiempo: '3 a 5 días hábiles' },
  { region: 'Antofagasta', zona: 'Norte Grande', precioBase: 10990, tiempo: '3 a 5 días hábiles' },
  { region: 'Tarapacá', zona: 'Norte Grande', precioBase: 10990, tiempo: '3 a 5 días hábiles' },
  { region: 'Arica y Parinacota', zona: 'Norte Grande', precioBase: 10990, tiempo: '3 a 5 días hábiles' },
  { region: 'Aysén', zona: 'Zona Austral', precioBase: 14990, tiempo: '5 a 7 días hábiles' },
  { region: 'Magallanes y Antártica Chilena', zona: 'Zona Austral', precioBase: 14990, tiempo: '5 a 7 días hábiles' },
];

const SUCURSALES_RETIRO = [
  'Sucursal Providencia — Av. Providencia 2145, Local 12, Santiago',
  'Sucursal Huechuraba — Av. Américo Vespucio 1737 (Mall Plaza Norte), Local 42',
];

interface ErroresCheckout {
  nombre?: string;
  correo?: string;
  sucursalRetiro?: string;
  region?: string;
  comuna?: string;
  direccion?: string;
  tarjeta?: string;
  vencimiento?: string;
  cvv?: string;
}

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { carrito, usuarioActual, vaciarCarrito, recargarProductos, mostrarToast } =
    useContext(TiendaContext);

  const [tipoEntrega, setTipoEntrega] = useState<'RETIRO_TIENDA' | 'ENVIO_STARKEN'>('ENVIO_STARKEN');

  const [datos, setDatos] = useState({
    nombre: usuarioActual?.nombre || '',
    correo: '',
    sucursalRetiro: SUCURSALES_RETIRO[0],
    region: 'Región Metropolitana',
    comuna: '',
    direccion: '',
    cuotas: '1 cuota sin interés',
    tarjeta: '',
    vencimiento: '',
    cvv: '',
  });

  const [errores, setErrores] = useState<ErroresCheckout>({});
  const [procesando, setProcesando] = useState(false);

  useEffect(() => {
    if (!usuarioActual) {
      mostrarToast('Inicia sesión para completar tu compra.', 'warning');
      navigate('/login');
      return;
    }
    if (usuarioActual.rol === 'admin') {
      mostrarToast(
        'No puedes realizar compras como administrador. Crea una cuenta personal de cliente.',
        'warning',
      );
      navigate('/tienda');
    }
  }, [usuarioActual, navigate, mostrarToast]);

  const subtotal = carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);

  const tarifaSeleccionada =
    TARIFAS_STARKEN.find((t) => t.region === datos.region) || TARIFAS_STARKEN[0];

  const envioGratisPorMonto = subtotal >= 150000;
  const costoEnvio =
    tipoEntrega === 'RETIRO_TIENDA'
      ? 0
      : envioGratisPorMonto
        ? 0
        : tarifaSeleccionada.precioBase;

  const tiempoEstimado =
    tipoEntrega === 'RETIRO_TIENDA' ? '2 días hábiles' : tarifaSeleccionada.tiempo;

  const totalFinal = subtotal + costoEnvio;

  const handleTarjetaChange = (valor: string) => {
    const soloDigitos = valor.replace(/\D/g, '').slice(0, 16);
    const formateado = soloDigitos.replace(/(\d{4})(?=\d)/g, '$1 ');
    setDatos({ ...datos, tarjeta: formateado });
    setErrores({ ...errores, tarjeta: undefined });
  };

  const handleVencimientoChange = (valor: string) => {
    const soloDigitos = valor.replace(/\D/g, '').slice(0, 4);
    const formateado =
      soloDigitos.length >= 3
        ? `${soloDigitos.slice(0, 2)}/${soloDigitos.slice(2)}`
        : soloDigitos;
    setDatos({ ...datos, vencimiento: formateado });
    setErrores({ ...errores, vencimiento: undefined });
  };

  const handleCvvChange = (valor: string) => {
    const soloDigitos = valor.replace(/\D/g, '').slice(0, 3);
    setDatos({ ...datos, cvv: soloDigitos });
    setErrores({ ...errores, cvv: undefined });
  };

  const validarCheckout = (): boolean => {
    const nuevosErrores: ErroresCheckout = {};
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const digitosTarjeta = datos.tarjeta.replace(/\s/g, '');

    if (datos.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'Ingresa tu nombre completo (mínimo 3 caracteres).';
    }

    if (!regexEmail.test(datos.correo.trim())) {
      nuevosErrores.correo = 'Ingresa un correo electrónico válido.';
    }

    if (tipoEntrega === 'RETIRO_TIENDA') {
      if (!datos.sucursalRetiro.trim()) {
        nuevosErrores.sucursalRetiro = 'Selecciona una sucursal de retiro.';
      }
    } else {
      if (!datos.region.trim()) {
        nuevosErrores.region = 'Selecciona una región.';
      }
      if (datos.comuna.trim().length < 3) {
        nuevosErrores.comuna = 'Ingresa tu comuna de despacho.';
      }
      if (datos.direccion.trim().length < 5) {
        nuevosErrores.direccion = 'Ingresa una dirección válida con calle y número.';
      }
    }

    if (digitosTarjeta.length !== 16) {
      nuevosErrores.tarjeta = 'El número de tarjeta debe tener 16 dígitos.';
    }

    const partesFecha = datos.vencimiento.split('/');
    const mes = Number(partesFecha[0]);
    const anio = Number(partesFecha[1]);
    if (
      datos.vencimiento.length !== 5 ||
      Number.isNaN(mes) ||
      mes < 1 ||
      mes > 12 ||
      Number.isNaN(anio) ||
      anio < 26
    ) {
      nuevosErrores.vencimiento = 'Ingresa una fecha válida (MM/AA, ej. 08/28).';
    }

    if (datos.cvv.length !== 3) {
      nuevosErrores.cvv = 'El código CVV debe tener 3 dígitos.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const detectarMarcaTarjeta = () => {
    if (datos.tarjeta.startsWith('4')) return 'VISA';
    if (datos.tarjeta.startsWith('5')) return 'MASTERCARD';
    return 'TARJETA';
  };

  const procesarPago = async (e: FormEvent) => {
    e.preventDefault();

    if (!usuarioActual || usuarioActual.rol === 'admin') {
      mostrarToast('Debes ingresar con una cuenta de cliente para comprar.', 'warning');
      return;
    }

    if (!validarCheckout()) {
      mostrarToast('Revisa los campos marcados en rojo antes de pagar.', 'warning');
      return;
    }

    setProcesando(true);

    try {
      const payloadOrden = {
        usuarioNombre: usuarioActual.nombre,
        clienteNombre: datos.nombre.trim(),
        clienteCorreo: datos.correo.trim(),
        tipoEntrega,
        sucursalRetiro: tipoEntrega === 'RETIRO_TIENDA' ? datos.sucursalRetiro : '',
        regionEnvio: tipoEntrega === 'ENVIO_STARKEN' ? datos.region : '',
        comunaEnvio: tipoEntrega === 'ENVIO_STARKEN' ? datos.comuna.trim() : '',
        direccionEnvio: tipoEntrega === 'ENVIO_STARKEN' ? datos.direccion.trim() : '',
        tiempoEstimado,
        cuotas: datos.cuotas,
        subtotal,
        costoEnvio,
        total: totalFinal,
        items: carrito.map((item) => ({
          codigoProducto: item.codigo,
          marca: item.marca,
          modelo: item.modelo,
          imagen: item.imagen,
          cantidad: item.cantidad,
          precioUnitario: item.precio,
        })),
      };

      const respuesta = await fetch('http://localhost:8083/api/ordenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payloadOrden),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        mostrarToast(data.mensaje || 'No se pudo registrar la orden de compra.', 'error');
        setProcesando(false);
        return;
      }

      vaciarCarrito(false);
      await recargarProductos();

      mostrarToast(`¡Compra confirmada! Orden #${data.numeroOrden} generada.`, 'success');
      navigate('/mis-pedidos', { state: { nuevaOrden: data } });
    } catch (err) {
      console.error('Error conectando con ms-ventas:', err);
      mostrarToast(
        'No se pudo conectar con ms-ventas (puerto 8083) o ms-catalogo (puerto 8082).',
        'error',
      );
    } finally {
      setProcesando(false);
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      <HeaderTienda mostrarCarrito={false} />

      <main className="container py-5" style={{ maxWidth: '1120px' }}>
        {carrito.length === 0 ? (
          <div className="card card-minimal p-5 text-center">
            <i className="bi bi-cart-x fs-1 text-muted mb-3"></i>
            <h4 className="fw-bold">No tienes productos en tu carrito</h4>
            <p className="text-muted mb-4">Agrega instrumentos desde el catálogo antes de pagar.</p>
            <div>
              <Link to="/tienda" className="btn btn-minimal px-4 py-2">
                Volver a la tienda
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-4">
              <span className="badge badge-minimal mb-2 px-3 py-2">
                <i className="bi bi-shield-lock-fill text-success me-1"></i> Pasarela de Pago Segura
              </span>
              <h2 className="fw-bold text-dark mb-1">Finalizar Compra</h2>
              <p className="text-muted">Elige tu modalidad de entrega y completa los datos de pago.</p>
            </div>

            <form onSubmit={procesarPago} className="row g-4" noValidate>
              {/* Columna Izquierda */}
              <div className="col-lg-7 d-flex flex-column gap-4">
                {/* 1. Datos del Comprador y Modalidad de Entrega */}
                <div className="card card-minimal p-4">
                  <h5 className="fw-bold mb-3 border-bottom pb-2 text-dark">
                    <i className="bi bi-person-vcard me-2"></i>1. Datos del Cliente y Entrega
                  </h5>

                  <div className="row g-3 mb-4">
                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold">Nombre Completo</label>
                      <input
                        type="text"
                        className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                        placeholder="Nombre y apellido"
                        value={datos.nombre}
                        onChange={(e) => {
                          setDatos({ ...datos, nombre: e.target.value });
                          setErrores({ ...errores, nombre: undefined });
                        }}
                      />
                      {errores.nombre && (
                        <div className="invalid-feedback d-block">{errores.nombre}</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label text-muted small fw-bold">Correo Electrónico</label>
                      <input
                        type="text"
                        inputMode="email"
                        className={`form-control ${errores.correo ? 'is-invalid' : ''}`}
                        placeholder="cliente@correo.cl"
                        value={datos.correo}
                        onChange={(e) => {
                          setDatos({ ...datos, correo: e.target.value });
                          setErrores({ ...errores, correo: undefined });
                        }}
                      />
                      {errores.correo && (
                        <div className="invalid-feedback d-block">{errores.correo}</div>
                      )}
                    </div>
                  </div>

                  {/* Selector Retiro en Tienda vs Envío Starken */}
                  <label className="form-label text-muted small fw-bold d-block mb-2">
                    Modalidad de Entrega
                  </label>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <button
                        type="button"
                        className={`w-100 text-start p-3 rounded-3 border ${
                          tipoEntrega === 'ENVIO_STARKEN'
                            ? 'border-dark bg-light shadow-sm'
                            : 'bg-white'
                        }`}
                        onClick={() => setTipoEntrega('ENVIO_STARKEN')}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-bold text-dark">
                            <i className="bi bi-truck me-2"></i>Envío Starken
                          </span>
                          <span className="badge bg-dark">A domicilio</span>
                        </div>
                        <small className="text-muted d-block">
                          Reparto a todo Chile según región
                        </small>
                      </button>
                    </div>

                    <div className="col-md-6">
                      <button
                        type="button"
                        className={`w-100 text-start p-3 rounded-3 border ${
                          tipoEntrega === 'RETIRO_TIENDA'
                            ? 'border-dark bg-light shadow-sm'
                            : 'bg-white'
                        }`}
                        onClick={() => setTipoEntrega('RETIRO_TIENDA')}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <span className="fw-bold text-dark">
                            <i className="bi bi-shop me-2"></i>Retiro en Tienda
                          </span>
                          <span className="badge bg-success">GRATIS</span>
                        </div>
                        <small className="text-muted d-block">
                          Listo para retiro en 2 días hábiles
                        </small>
                      </button>
                    </div>
                  </div>

                  {/* Campos dinámicos según tipo de entrega */}
                  {tipoEntrega === 'RETIRO_TIENDA' ? (
                    <div className="bg-light p-3 rounded border">
                      <label className="form-label small fw-bold text-dark">
                        Selecciona la tienda para retirar tu pedido
                      </label>
                      <select
                        className={`form-select ${errores.sucursalRetiro ? 'is-invalid' : ''}`}
                        value={datos.sucursalRetiro}
                        onChange={(e) => {
                          setDatos({ ...datos, sucursalRetiro: e.target.value });
                          setErrores({ ...errores, sucursalRetiro: undefined });
                        }}
                      >
                        {SUCURSALES_RETIRO.map((sucursal) => (
                          <option key={sucursal} value={sucursal}>
                            {sucursal}
                          </option>
                        ))}
                      </select>
                      <div className="mt-2 small text-success fw-semibold">
                        <i className="bi bi-clock-history me-1"></i>
                        Tiempo de preparación: <strong>2 días hábiles</strong> (Sin costo de envío).
                      </div>
                    </div>
                  ) : (
                    <div className="bg-light p-3 rounded border">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label small fw-bold text-dark">Región de Destino</label>
                          <select
                            className={`form-select ${errores.region ? 'is-invalid' : ''}`}
                            value={datos.region}
                            onChange={(e) => {
                              setDatos({ ...datos, region: e.target.value });
                              setErrores({ ...errores, region: undefined });
                            }}
                          >
                            {TARIFAS_STARKEN.map((t) => (
                              <option key={t.region} value={t.region}>
                                {t.region} (${t.precioBase.toLocaleString('es-CL')})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-6">
                          <label className="form-label small fw-bold text-dark">Comuna</label>
                          <input
                            type="text"
                            className={`form-control ${errores.comuna ? 'is-invalid' : ''}`}
                            placeholder="Ej. Providencia, Viña del Mar..."
                            value={datos.comuna}
                            onChange={(e) => {
                              setDatos({ ...datos, comuna: e.target.value });
                              setErrores({ ...errores, comuna: undefined });
                            }}
                          />
                          {errores.comuna && (
                            <div className="invalid-feedback d-block">{errores.comuna}</div>
                          )}
                        </div>

                        <div className="col-12">
                          <label className="form-label small fw-bold text-dark">
                            Dirección de Entrega
                          </label>
                          <input
                            type="text"
                            className={`form-control ${errores.direccion ? 'is-invalid' : ''}`}
                            placeholder="Calle, número, depto o referencia"
                            value={datos.direccion}
                            onChange={(e) => {
                              setDatos({ ...datos, direccion: e.target.value });
                              setErrores({ ...errores, direccion: undefined });
                            }}
                          />
                          {errores.direccion && (
                            <div className="invalid-feedback d-block">{errores.direccion}</div>
                          )}
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-top d-flex justify-content-between align-items-center flex-wrap gap-2 small">
                        <span className="text-secondary">
                          <i className="bi bi-truck me-1"></i>
                          Transporte: <strong>Starken ({tarifaSeleccionada.zona})</strong> • Plazo:{' '}
                          <strong>{tarifaSeleccionada.tiempo}</strong>
                        </span>
                        <span className="fw-bold text-dark">
                          {envioGratisPorMonto ? (
                            <>
                              <span className="text-decoration-line-through text-muted me-2">
                                ${tarifaSeleccionada.precioBase.toLocaleString('es-CL')}
                              </span>
                              <span className="text-success">GRATIS (+$150.000)</span>
                            </>
                          ) : (
                            `$${tarifaSeleccionada.precioBase.toLocaleString('es-CL')}`
                          )}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 2. Método de Pago */}
                <div className="card card-minimal p-4">
                  <h5 className="fw-bold mb-3 border-bottom pb-2 text-dark">
                    <i className="bi bi-credit-card-2-front me-2"></i>2. Método de Pago
                  </h5>

                  <div
                    className="p-4 rounded-4 text-white mb-4 shadow mx-auto"
                    style={{
                      maxWidth: '390px',
                      background: 'linear-gradient(135deg, #172554 0%, #0f172a 100%)',
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <div
                        className="rounded"
                        style={{
                          width: '42px',
                          height: '30px',
                          background: 'linear-gradient(135deg, #facc15, #ca8a04)',
                        }}
                      ></div>
                      <span className="fw-bold tracking-wider small opacity-75">
                        {detectarMarcaTarjeta()}
                      </span>
                    </div>
                    <div className="fs-5 fw-semibold mb-4" style={{ letterSpacing: '2px' }}>
                      {datos.tarjeta || '•••• •••• •••• ••••'}
                    </div>
                    <div className="d-flex justify-content-between small text-uppercase">
                      <div>
                        <span className="d-block opacity-50" style={{ fontSize: '0.65rem' }}>
                          Titular
                        </span>
                        <span>{datos.nombre || 'NOMBRE TITULAR'}</span>
                      </div>
                      <div className="text-end">
                        <span className="d-block opacity-50" style={{ fontSize: '0.65rem' }}>
                          Vence
                        </span>
                        <span>{datos.vencimiento || 'MM/AA'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="row g-3">
                    <div className="col-md-8">
                      <label className="form-label text-muted small fw-bold">
                        Número de Tarjeta (16 dígitos)
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        className={`form-control ${errores.tarjeta ? 'is-invalid' : ''}`}
                        placeholder="0000 0000 0000 0000"
                        value={datos.tarjeta}
                        onChange={(e) => handleTarjetaChange(e.target.value)}
                      />
                      {errores.tarjeta && (
                        <div className="invalid-feedback d-block">{errores.tarjeta}</div>
                      )}
                    </div>

                    <div className="col-md-4">
                      <label className="form-label text-muted small fw-bold">Cuotas</label>
                      <select
                        className="form-select"
                        value={datos.cuotas}
                        onChange={(e) => setDatos({ ...datos, cuotas: e.target.value })}
                      >
                        <option value="1 cuota sin interés">1 cuota sin interés</option>
                        <option value="3 cuotas precio contado">3 cuotas precio contado</option>
                        <option value="6 cuotas precio contado">6 cuotas precio contado</option>
                      </select>
                    </div>

                    <div className="col-6">
                      <label className="form-label text-muted small fw-bold">Vencimiento</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        className={`form-control ${errores.vencimiento ? 'is-invalid' : ''}`}
                        placeholder="MM/AA"
                        value={datos.vencimiento}
                        onChange={(e) => handleVencimientoChange(e.target.value)}
                      />
                      {errores.vencimiento && (
                        <div className="invalid-feedback d-block">{errores.vencimiento}</div>
                      )}
                    </div>

                    <div className="col-6">
                      <label className="form-label text-muted small fw-bold">Código CVV</label>
                      <input
                        type="text"
                        inputMode="numeric"
                        className={`form-control ${errores.cvv ? 'is-invalid' : ''}`}
                        placeholder="123"
                        value={datos.cvv}
                        onChange={(e) => handleCvvChange(e.target.value)}
                      />
                      {errores.cvv && (
                        <div className="invalid-feedback d-block">{errores.cvv}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Resumen de Orden */}
              <div className="col-lg-5">
                <div className="card card-minimal p-4 position-sticky" style={{ top: '95px' }}>
                  <h5 className="fw-bold mb-3 border-bottom pb-2 text-dark">
                    <i className="bi bi-receipt me-2"></i>Resumen de Compra
                  </h5>

                  <div className="d-flex flex-column gap-2 mb-3">
                    {carrito.map((item) => (
                      <div
                        key={item.codigo}
                        className="d-flex justify-content-between align-items-center small"
                      >
                        <span>
                          <strong>{item.cantidad}x</strong> {item.marca} {item.modelo}
                        </span>
                        <span className="fw-semibold">
                          ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="border-top pt-3 d-flex flex-column gap-2 small">
                    <div className="d-flex justify-content-between text-muted">
                      <span>Subtotal:</span>
                      <span>${subtotal.toLocaleString('es-CL')}</span>
                    </div>
                    <div className="d-flex justify-content-between text-muted">
                      <span>
                        {tipoEntrega === 'RETIRO_TIENDA'
                          ? 'Retiro en Tienda:'
                          : `Starken (${datos.region}):`}
                      </span>
                      <span className={costoEnvio === 0 ? 'text-success fw-bold' : ''}>
                        {costoEnvio === 0 ? 'GRATIS' : `$${costoEnvio.toLocaleString('es-CL')}`}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between text-muted">
                      <span>Tiempo estimado:</span>
                      <span className="fw-semibold text-dark">{tiempoEstimado}</span>
                    </div>
                    <div className="d-flex justify-content-between text-muted">
                      <span>Modalidad pago:</span>
                      <span>{datos.cuotas}</span>
                    </div>
                    <div className="d-flex justify-content-between h5 fw-bold text-dark border-top pt-2 mt-1">
                      <span>Total a Pagar:</span>
                      <span>${totalFinal.toLocaleString('es-CL')}</span>
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-2 mt-4">
                    <Boton
                      type="submit"
                      variante="dark"
                      className="w-100 py-3 fw-bold fs-6"
                      disabled={procesando}
                    >
                      {procesando
                        ? 'Registrando pedido...'
                        : `Pagar $${totalFinal.toLocaleString('es-CL')}`}
                    </Boton>
                    <Link to="/tienda" className="btn btn-outline-minimal w-100 py-2">
                      <i className="bi bi-arrow-left me-2"></i> Volver a la tienda
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </>
        )}
      </main>

      <FooterTienda />
    </div>
  );
}