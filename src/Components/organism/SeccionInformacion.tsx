export default function SeccionInformacion() {
  return (
    <section id="informacion" className="mb-5">
      <div className="accordion" id="accordionPanelsStayOpenExample">
        {/* Quiénes somos */}
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
          <div
            id="panelsStayOpen-collapseOne"
            className="accordion-collapse collapse show"
          >
            <div className="accordion-body p-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-shop me-2"></i>SONIDO VIVO
              </h5>
              <p>
                <strong>SONIDO VIVO</strong> es una tienda especializada en instrumentos musicales, equipos de audio y accesorios para músicos de todos los niveles. Nuestro propósito es acercar la música a estudiantes, aficionados, bandas y profesionales mediante una selección de productos de calidad y una experiencia de compra simple y confiable.
              </p>
              <p>
                En nuestro catálogo encontrarás guitarras acústicas y eléctricas, bajos, baterías, teclados, amplificadores, micrófonos, pedales de efectos y accesorios esenciales para crear, practicar, grabar y presentarte en vivo.
              </p>
              <p className="mb-0">
                Trabajamos para que cada cliente pueda encontrar el instrumento o equipo que mejor se adapte a su estilo, necesidades y presupuesto. En SONIDO VIVO creemos que cada persona tiene una forma única de expresarse, y queremos acompañarte en cada etapa de tu camino musical.
              </p>
            </div>
          </div>
        </div>

        {/* Compra y envíos */}
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
                    Compra online de forma simple, rápida y segura
                  </small>
                </span>
              </span>
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseTwo"
            className="accordion-collapse collapse"
          >
            <div className="accordion-body p-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-bag-check me-2"></i>Compra online en SONIDO VIVO
              </h5>
              <p>
                Puedes revisar nuestro catálogo, agregar tus productos al carrito y realizar tu compra de forma online desde cualquier lugar de Chile.
              </p>
              <div className="border-top pt-3 mt-3">
                <p className="mb-2">
                  <i className="bi bi-check-circle-fill me-2"></i>Compra online desde cualquier lugar.
                </p>
                <p className="mb-2">
                  <i className="bi bi-check-circle-fill me-2"></i>Catálogo con instrumentos, equipos de audio y accesorios.
                </p>
                <p className="mb-0">
                  <i className="bi bi-check-circle-fill me-2"></i>Confirmación del pedido al finalizar la compra.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Dónde estamos */}
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
                  <i className="bi bi-geo-alt-fill"></i>
                </span>
                <span>
                  <strong className="d-block">¿Dónde estamos?</strong>
                  <small className="text-secondary">
                    Encuéntranos en Santiago y compra online desde todo Chile
                  </small>
                </span>
              </span>
            </button>
          </h2>
          <div
            id="panelsStayOpen-collapseThree"
            className="accordion-collapse collapse"
          >
            <div className="accordion-body p-4">
              <h5 className="fw-bold mb-3">
                <i className="bi bi-pin-map-fill me-2"></i>Nuestra ubicación
              </h5>
              <p>
                <strong>Dirección referencial:</strong><br />
                Avenida Nueva Providencia 1234, Local 15, Providencia, Santiago.
              </p>
              <div className="border-top pt-3 mt-3">
                <p className="mb-2">
                  <i className="bi bi-geo-alt me-2"></i>Providencia, Santiago, Chile.
                </p>
                <p className="mb-2">
                  <i className="bi bi-laptop me-2"></i>Compras online para clientes de todo Chile.
                </p>
                <p className="mb-0">
                  <i className="bi bi-clock me-2"></i>Atención online: lunes a viernes, de 10:00 a 18:00 hrs.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}