import { Link } from 'react-router-dom';

export default function SeccionInformacion() {
  return (
    <section id="informacion" className="mb-5">
      <div className="accordion" id="accordionPanelsStayOpenExample">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button accordion-empresa-titulo"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseOne"
              aria-expanded="true"
              aria-controls="panelsStayOpen-collapseOne"
            >
              <span className="d-flex align-items-center gap-3">
                <span className="icono-empresa">
                  <i className="bi bi-music-note-beamed"></i>
                </span>
                <span>
                  <strong className="d-block">¿Quiénes somos?</strong>
                  <small className="text-secondary">
                    Conoce la historia y el propósito de SONIDO VIVO
                  </small>
                </span>
              </span>
            </button>
          </h2>
          <div id="panelsStayOpen-collapseOne" className="accordion-collapse collapse show">
            <div className="accordion-body p-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-shop me-2"></i> SONIDO VIVO
              </h5>
              <p>
                <strong>SONIDO VIVO</strong> es una tienda especializada en instrumentos musicales,
                equipos de audio y accesorios para músicos de todos los niveles.
              </p>
              <p className="mb-0">
                Trabajamos para que cada cliente pueda encontrar el instrumento o equipo que mejor
                se adapte a su estilo, necesidades y presupuesto.
              </p>
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed accordion-empresa-titulo"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseTwo"
              aria-expanded="false"
              aria-controls="panelsStayOpen-collapseTwo"
            >
              <span className="d-flex align-items-center gap-3">
                <span className="icono-empresa">
                  <i className="bi bi-truck"></i>
                </span>
                <span>
                  <strong className="d-block">Compra y envíos</strong>
                  <small className="text-secondary">
                    Envío gratis en compras sobre $150.000 CLP a todo Chile
                  </small>
                </span>
              </span>
            </button>
          </h2>
          <div id="panelsStayOpen-collapseTwo" className="accordion-collapse collapse">
            <div className="accordion-body p-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-bag-check me-2"></i> Compra online en SONIDO VIVO
              </h5>
              <p className="mb-0">
                Despachamos a todo Chile con embalaje reforzado para instrumentos musicales. Todas
                las compras superiores a <strong>$150.000</strong> cuentan con despacho gratuito.
              </p>
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header">
            <button
              className="accordion-button collapsed accordion-empresa-titulo"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseThree"
              aria-expanded="false"
              aria-controls="panelsStayOpen-collapseThree"
            >
              <span className="d-flex align-items-center gap-3">
                <span className="icono-empresa">
                  <i className="bi bi-headset"></i>
                </span>
                <span>
                  <strong className="d-block">¿Necesitas ayuda o probar un instrumento?</strong>
                  <small className="text-secondary">
                    Agenda una prueba en sala o envíanos tu consulta técnica
                  </small>
                </span>
              </span>
            </button>
          </h2>
          <div id="panelsStayOpen-collapseThree" className="accordion-collapse collapse">
            <div className="accordion-body p-4 d-flex justify-content-between align-items-center flex-wrap gap-3">
              <p className="mb-0">
                ¿Tienes dudas sobre un modelo o quieres agendar visita en nuestra sucursal de Santiago?
              </p>
              <Link to="/contacto" className="btn btn-minimal">
                <i className="bi bi-chat-dots me-2"></i> Ir a Contacto y Ayuda
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}