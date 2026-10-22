export default function HeaderTienda() {
  return (
    <header className="py-3 header-fijo">
      <div className="container d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h1 className="h4 text-dark fw-bold mb-0">
            SONIDO VIVO
          </h1>

          <small className="text-secondary">
            Tienda de Instrumentos Musicales
          </small>
        </div>

        <div className="d-flex gap-2 align-items-center">
          <button
            type="button"
            className="btn btn-minimal"
            disabled
          >
            <i className="bi bi-book me-1" aria-hidden="true" />
            Recursos
          </button>

          <button
            type="button"
            className="btn btn-minimal"
            disabled
          >
            <i className="bi bi-cart3 me-1" aria-hidden="true" />
            Carrito (0)
          </button>

          <button
            type="button"
            className="btn btn-outline-minimal"
            aria-label="Cerrar sesión"
            disabled
          >
            <i
              className="bi bi-box-arrow-right"
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </header>
  )
}