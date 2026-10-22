export default function ModalInformacion() {
  return (
    <div
      className="modal fade"
      id="modalInformacion"
      tabIndex={-1}
      aria-labelledby="modalInformacionLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h2 className="modal-title h5 fw-bold" id="modalInformacionLabel">
              <i className="bi bi-info-circle me-2"></i>
              Información de SONIDO VIVO
            </h2>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>

          <div className="modal-body">
            <div className="mb-4">
              <h3 className="h5 fw-bold">
                <i className="bi bi-shop me-2"></i>
                ¿Quiénes somos?
              </h3>
              <p>
                <strong>SONIDO VIVO</strong> es una tienda online especializada en instrumentos musicales, equipos de audio y accesorios para músicos de todos los niveles.
              </p>
              <p className="mb-0">
                Nuestro objetivo es ofrecer productos de calidad y una experiencia de compra simple, clara y confiable.
              </p>
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <div className="info-tienda-item">
                  <i className="bi bi-geo-alt-fill"></i>
                  <div>
                    <h3 className="h6 fw-bold mb-1">Ubicación</h3>
                    <p className="mb-0 text-secondary">Providencia, Santiago, Chile.</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="info-tienda-item">
                  <i className="bi bi-laptop"></i>
                  <div>
                    <h3 className="h6 fw-bold mb-1">Modalidad de compra</h3>
                    <p className="mb-0 text-secondary">Compras online con despacho a todo Chile.</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="info-tienda-item">
                  <i className="bi bi-clock"></i>
                  <div>
                    <h3 className="h6 fw-bold mb-1">Horario de atención</h3>
                    <p className="mb-0 text-secondary">Lunes a viernes, de 10:00 a 18:00 horas.</p>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="info-tienda-item">
                  <i className="bi bi-headset"></i>
                  <div>
                    <h3 className="h6 fw-bold mb-1">Atención al cliente</h3>
                    <p className="mb-0 text-secondary">Te ayudamos a encontrar el producto adecuado.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="alert alert-light border mt-4 mb-0">
              <i className="bi bi-check-circle me-2"></i>
              Explora nuestro catálogo y encuentra el instrumento ideal.
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-minimal"
              data-bs-dismiss="modal"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}