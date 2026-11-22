import { useState, useContext, type FormEvent } from 'react';
import HeaderTienda from '../Components/organism/HeaderTienda';
import FooterTienda from '../Components/organism/FooterTienda';
import CartOffcanvas from '../Components/organism/CartOffcanvas';
import { TiendaContext } from '../context/TiendaContext';

const API_CONTACTOS = 'http://localhost:8084/api/contactos';

interface ErroresContacto {
  nombre?: string;
  email?: string;
  fechaPrueba?: string;
  mensaje?: string;
}

interface ConsultaUsuario {
  id: number;
  ticket: string;
  nombre: string;
  email: string;
  tipoConsulta: string;
  instrumentoInteres: string;
  fechaPrueba: string;
  mensaje: string;
  respuestaAdmin?: string;
  estado: 'PENDIENTE' | 'RESPONDIDA';
  fechaCreacion: string;
  fechaRespuesta?: string;
}

export default function ContactoPage() {
  const { productos, usuarioActual, carrito, cambiarCantidadCarrito, mostrarToast } =
    useContext(TiendaContext);

  const [contacto, setContacto] = useState({
    nombre: usuarioActual?.nombre || '',
    email: '',
    tipoConsulta: 'Cotización / Consulta general',
    instrumentoInteres: '',
    fechaPrueba: '',
    mensaje: '',
  });

  const [errores, setErrores] = useState<ErroresContacto>({});
  const [enviando, setEnviando] = useState(false);
  const [ticketGenerado, setTicketGenerado] = useState<string | null>(null);

  // Estados para que el usuario revise sus consultas y respuestas del admin
  const [correoConsulta, setCorreoConsulta] = useState('');
  const [errorCorreoConsulta, setErrorCorreoConsulta] = useState('');
  const [misConsultas, setMisConsultas] = useState<ConsultaUsuario[]>([]);
  const [buscandoConsultas, setBuscandoConsultas] = useState(false);
  const [busquedaRealizada, setBusquedaRealizada] = useState(false);

  const validarFormulario = (): boolean => {
    const nuevosErrores: ErroresContacto = {};
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (contacto.nombre.trim().length < 3) {
      nuevosErrores.nombre = 'Ingresa tu nombre completo (mínimo 3 caracteres).';
    }

    if (!regexEmail.test(contacto.email.trim())) {
      nuevosErrores.email = 'Ingresa un correo electrónico válido (ej. usuario@dominio.cl).';
    }

    if (
      contacto.tipoConsulta === 'Agendar prueba en sala' &&
      contacto.fechaPrueba.trim() === ''
    ) {
      nuevosErrores.fechaPrueba = 'Selecciona una fecha para agendar tu prueba en sala.';
    }

    if (contacto.mensaje.trim().length < 10) {
      nuevosErrores.mensaje = 'Escribe un mensaje de al menos 10 caracteres.';
    }

    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const consultarMisTickets = async (correoAconsultar: string) => {
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(correoAconsultar.trim())) {
      setErrorCorreoConsulta('Ingresa el correo con el que enviaste tu consulta.');
      return;
    }

    setErrorCorreoConsulta('');
    setBuscandoConsultas(true);

    try {
      const res = await fetch(
        `${API_CONTACTOS}?email=${encodeURIComponent(correoAconsultar.trim())}`,
      );
      if (res.ok) {
        const data: ConsultaUsuario[] = await res.json();
        setMisConsultas(data);
        setBusquedaRealizada(true);
      } else {
        mostrarToast('No se pudieron consultar tus tickets.', 'error');
      }
    } catch (error) {
      console.error('Error consultando tickets:', error);
      mostrarToast('No se pudo conectar con ms-contacto (puerto 8084).', 'error');
    } finally {
      setBuscandoConsultas(false);
    }
  };

  const handleEnviarContacto = async (e: FormEvent) => {
    e.preventDefault();

    if (!validarFormulario()) {
      mostrarToast('Revisa los campos marcados antes de enviar.', 'warning');
      return;
    }

    setEnviando(true);

    try {
      const correoEnviado = contacto.email.trim();
      const res = await fetch(API_CONTACTOS, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: contacto.nombre.trim(),
          email: correoEnviado,
          tipoConsulta: contacto.tipoConsulta,
          instrumentoInteres: contacto.instrumentoInteres,
          fechaPrueba:
            contacto.tipoConsulta === 'Agendar prueba en sala' ? contacto.fechaPrueba : '',
          mensaje: contacto.mensaje.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        mostrarToast(data.mensaje || 'No se pudo enviar la solicitud.', 'error');
        return;
      }

      setTicketGenerado(data.ticket);
      setCorreoConsulta(correoEnviado);
      await consultarMisTickets(correoEnviado);

      mostrarToast(`¡Solicitud registrada con éxito! Ticket #${data.ticket}`, 'success');

      setContacto({
        nombre: usuarioActual?.nombre || '',
        email: '',
        tipoConsulta: 'Cotización / Consulta general',
        instrumentoInteres: '',
        fechaPrueba: '',
        mensaje: '',
      });
      setErrores({});
    } catch (error) {
      console.error('Error conectando con ms-contacto:', error);
      mostrarToast('No se pudo conectar con ms-contacto (puerto 8084).', 'error');
    } finally {
      setEnviando(false);
    }
  };

  const handleBuscarTickets = (e: FormEvent) => {
    e.preventDefault();
    consultarMisTickets(correoConsulta);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      <HeaderTienda />

      <section
        className="py-5 text-white mb-5"
        style={{ backgroundColor: '#172554', borderBottom: '4px solid #0f172a' }}
      >
        <div className="container text-center">
          <span className="badge bg-light text-dark mb-2 px-3 py-2">
            Centro de Soporte y Atención
          </span>
          <h2 className="fw-bold display-6 text-white mb-2">Contacto y Ayuda al Músico</h2>
          <p className="text-white-50 mb-0 mx-auto" style={{ maxWidth: '650px' }}>
            Envía tu consulta o agenda una prueba en sala, y revisa aquí mismo el estado y la
            respuesta de nuestro equipo.
          </p>
        </div>
      </section>

      <main className="container mb-5">
        <div className="row g-4 mb-5">
          {/* Canales Directos */}
          <div className="col-lg-4 d-flex flex-column gap-3">
            <div className="card card-minimal p-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-headset me-2"></i>Canales Directos
              </h5>
              <div className="d-flex flex-column gap-3">
                <div className="info-tienda-item">
                  <i className="bi bi-geo-alt-fill"></i>
                  <div>
                    <strong className="d-block small">Tienda y Sala de Pruebas</strong>
                    <span className="text-muted small">
                      Av. Providencia 2145, Local 12, Santiago
                    </span>
                  </div>
                </div>
                <div className="info-tienda-item">
                  <i className="bi bi-clock-fill"></i>
                  <div>
                    <strong className="d-block small">Horario de Atención</strong>
                    <span className="text-muted small">
                      Lunes a Sábado: 10:00 a 19:30 hrs
                    </span>
                  </div>
                </div>
                <div className="info-tienda-item">
                  <i className="bi bi-whatsapp"></i>
                  <div>
                    <strong className="d-block small">Teléfono / WhatsApp</strong>
                    <span className="text-muted small">+56 9 8765 4321</span>
                  </div>
                </div>
                <div className="info-tienda-item">
                  <i className="bi bi-envelope-fill"></i>
                  <div>
                    <strong className="d-block small">Correo de Soporte</strong>
                    <span className="text-muted small">contacto@sonidovivo.cl</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Formulario Nueva Consulta */}
          <div className="col-lg-8">
            <div className="card card-minimal p-4">
              <h4 className="fw-bold mb-1">Envíanos tu consulta</h4>
              <p className="text-muted small mb-4">
                Completa los datos y recibirás un código de ticket para seguir tu solicitud.
              </p>

              {ticketGenerado && (
                <div className="alert alert-success d-flex justify-content-between align-items-center">
                  <span>
                    <i className="bi bi-check-circle-fill me-2"></i>
                    Solicitud registrada con el código <strong>#{ticketGenerado}</strong>. Puedes ver
                    su estado más abajo.
                  </span>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setTicketGenerado(null)}
                  ></button>
                </div>
              )}

              <form onSubmit={handleEnviarContacto} noValidate>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Nombre Completo</label>
                    <input
                      type="text"
                      className={`form-control ${errores.nombre ? 'is-invalid' : ''}`}
                      placeholder="Ej. Ignacio Figueroa"
                      value={contacto.nombre}
                      onChange={(e) => {
                        setContacto({ ...contacto, nombre: e.target.value });
                        setErrores({ ...errores, nombre: undefined });
                      }}
                    />
                    {errores.nombre && (
                      <div className="invalid-feedback d-block">{errores.nombre}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Correo Electrónico</label>
                    <input
                      type="text"
                      inputMode="email"
                      className={`form-control ${errores.email ? 'is-invalid' : ''}`}
                      placeholder="tucorreo@ejemplo.cl"
                      value={contacto.email}
                      onChange={(e) => {
                        setContacto({ ...contacto, email: e.target.value });
                        setErrores({ ...errores, email: undefined });
                      }}
                    />
                    {errores.email && (
                      <div className="invalid-feedback d-block">{errores.email}</div>
                    )}
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold">Motivo de Consulta</label>
                    <select
                      className="form-select"
                      value={contacto.tipoConsulta}
                      onChange={(e) =>
                        setContacto({ ...contacto, tipoConsulta: e.target.value })
                      }
                    >
                      <option value="Cotización / Consulta general">
                        Cotización / Consulta general
                      </option>
                      <option value="Agendar prueba en sala">Agendar prueba en sala</option>
                      <option value="Servicio técnico / Luthier">
                        Servicio técnico / Luthier
                      </option>
                      <option value="Estado de despacho o garantía">
                        Estado de despacho o garantía
                      </option>
                    </select>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label small fw-bold">
                      Instrumento de interés (Opcional)
                    </label>
                    <select
                      className="form-select"
                      value={contacto.instrumentoInteres}
                      onChange={(e) =>
                        setContacto({ ...contacto, instrumentoInteres: e.target.value })
                      }
                    >
                      <option value="">Ninguno en específico</option>
                      {productos.map((p) => (
                        <option key={p.codigo} value={`${p.marca} ${p.modelo}`}>
                          {p.marca} {p.modelo}
                        </option>
                      ))}
                    </select>
                  </div>

                  {contacto.tipoConsulta === 'Agendar prueba en sala' && (
                    <div className="col-12">
                      <label className="form-label small fw-bold">
                        Fecha preferida para probar el instrumento
                      </label>
                      <input
                        type="date"
                        className={`form-control ${errores.fechaPrueba ? 'is-invalid' : ''}`}
                        value={contacto.fechaPrueba}
                        onChange={(e) => {
                          setContacto({ ...contacto, fechaPrueba: e.target.value });
                          setErrores({ ...errores, fechaPrueba: undefined });
                        }}
                      />
                      {errores.fechaPrueba && (
                        <div className="invalid-feedback d-block">{errores.fechaPrueba}</div>
                      )}
                    </div>
                  )}

                  <div className="col-12">
                    <label className="form-label small fw-bold">Mensaje o Detalle</label>
                    <textarea
                      className={`form-control ${errores.mensaje ? 'is-invalid' : ''}`}
                      rows={4}
                      placeholder="Describe tu consulta, duda técnica o requerimiento..."
                      value={contacto.mensaje}
                      onChange={(e) => {
                        setContacto({ ...contacto, mensaje: e.target.value });
                        setErrores({ ...errores, mensaje: undefined });
                      }}
                    ></textarea>
                    {errores.mensaje && (
                      <div className="invalid-feedback d-block">{errores.mensaje}</div>
                    )}
                  </div>

                  <div className="col-12">
                    <button
                      type="submit"
                      className="btn btn-minimal w-100 py-2 fw-semibold"
                      disabled={enviando}
                    >
                      <i className="bi bi-send me-2"></i>
                      {enviando ? 'Enviando consulta...' : 'Enviar Solicitud'}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Seguimiento de Consultas y Respuestas del Administrador */}
        <section className="card card-minimal p-4 mb-5">
          <h4 className="fw-bold mb-1">
            <i className="bi bi-envelope-check me-2"></i>Revisar Estado y Respuesta de Mis Consultas
          </h4>
          <p className="text-muted small mb-3">
            Ingresa el correo electrónico que usaste al enviar tu consulta para ver si fue
            respondida y leer el comentario del equipo.
          </p>

          <form onSubmit={handleBuscarTickets} className="row g-2 mb-4" noValidate>
            <div className="col-md-8">
              <input
                type="text"
                inputMode="email"
                className={`form-control ${errorCorreoConsulta ? 'is-invalid' : ''}`}
                placeholder="Ingresa tu correo electrónico..."
                value={correoConsulta}
                onChange={(e) => {
                  setCorreoConsulta(e.target.value);
                  setErrorCorreoConsulta('');
                }}
              />
              {errorCorreoConsulta && (
                <div className="invalid-feedback d-block">{errorCorreoConsulta}</div>
              )}
            </div>
            <div className="col-md-4 d-grid">
              <button
                type="submit"
                className="btn btn-minimal"
                disabled={buscandoConsultas}
              >
                <i className="bi bi-search me-2"></i>
                {buscandoConsultas ? 'Buscando...' : 'Ver Mis Consultas'}
              </button>
            </div>
          </form>

          {busquedaRealizada && (
            misConsultas.length === 0 ? (
              <div className="text-center py-4 text-muted bg-light rounded border">
                No se encontraron consultas asociadas a <strong>{correoConsulta}</strong>.
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {misConsultas.map((c) => (
                  <div key={c.id} className="p-3 rounded border bg-white">
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-2">
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge bg-dark">{c.ticket}</span>
                        <strong className="small">{c.tipoConsulta}</strong>
                        {c.instrumentoInteres && (
                          <span className="badge badge-minimal">{c.instrumentoInteres}</span>
                        )}
                      </div>
                      {c.estado === 'RESPONDIDA' ? (
                        <span className="badge bg-success">
                          <i className="bi bi-check-circle me-1"></i>RESPONDIDA
                        </span>
                      ) : (
                        <span className="badge bg-warning text-dark">
                          <i className="bi bi-clock me-1"></i>PENDIENTE
                        </span>
                      )}
                    </div>

                    <p className="mb-2 small text-secondary">
                      <strong>Tu consulta:</strong> {c.mensaje}
                    </p>

                    {c.respuestaAdmin ? (
                      <div className="p-3 rounded bg-light border-start border-4 border-success">
                        <strong className="small text-success d-block mb-1">
                          <i className="bi bi-reply-fill me-1"></i>Respuesta de SONIDO VIVO:
                        </strong>
                        <p className="mb-0 small text-dark">{c.respuestaAdmin}</p>
                      </div>
                    ) : (
                      <small className="text-muted fst-italic">
                        Aún sin respuesta del equipo de soporte.
                      </small>
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </section>

        {/* Preguntas Frecuentes */}
        <section className="card card-minimal p-4">
          <h4 className="fw-bold mb-3">
            <i className="bi bi-question-circle me-2"></i>Preguntas Frecuentes (Ayuda Rápida)
          </h4>
          <div className="accordion" id="accordionAyuda">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faq1"
                >
                  ¿Cuánto demora el despacho y cuándo es gratis?
                </button>
              </h2>
              <div id="faq1" className="accordion-collapse collapse show" data-bs-parent="#accordionAyuda">
                <div className="accordion-body text-secondary">
                  En Santiago el despacho demora de 24 a 48 horas hábiles, y a regiones de 2 a 5
                  días hábiles según zona Starken. Todas las compras superiores a{' '}
                  <strong>$150.000 CLP</strong> tienen envío gratuito.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faq2"
                >
                  ¿Qué garantía tienen los instrumentos musicales?
                </button>
              </h2>
              <div id="faq2" className="accordion-collapse collapse" data-bs-parent="#accordionAyuda">
                <div className="accordion-body text-secondary">
                  Todos nuestros instrumentos nuevos cuentan con <strong>6 meses de garantía legal</strong>{' '}
                  y revisión de calibración previa antes del despacho.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#faq3"
                >
                  ¿Puedo probar una guitarra o amplificador antes de comprar?
                </button>
              </h2>
              <div id="faq3" className="accordion-collapse collapse" data-bs-parent="#accordionAyuda">
                <div className="accordion-body text-secondary">
                  Sí. Selecciona <strong>"Agendar prueba en sala"</strong> en el formulario de
                  arriba, indica el modelo que deseas probar y te reservaremos un bloque en nuestra
                  sucursal de Providencia.
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FooterTienda />
      <CartOffcanvas carrito={carrito} onCambiarCantidad={cambiarCantidadCarrito} />
    </div>
  );
}