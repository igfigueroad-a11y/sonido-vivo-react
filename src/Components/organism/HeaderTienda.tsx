interface HeaderTiendaProps {
  cantidadCarrito: number;
}

export default function HeaderTienda({ cantidadCarrito }: HeaderTiendaProps) {
  return (
    <header className="py-3 header-fijo">
      <div className="container d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div>
          <h1 className="h4 text-dark fw-bold mb-0">SONIDO VIVO</h1>
          <small className="text-secondary">Tienda de Instrumentos Musicales</small>
        </div>

        <div className="d-flex gap-2 align-items-center">
          <button
            type="button"
            className="btn btn-outline-minimal"
            onClick={() => alert('Próximamente: Navegación al Login')}
          >
            <i className="bi bi-person-circle me-1" aria-hidden="true" />
            Iniciar Sesión
          </button>

          <div className="dropdown">
            <button
              type="button"
              className="btn btn-minimal dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <i className="bi bi-book me-1" aria-hidden="true" />
              Recursos
            </button>
            <ul className="dropdown-menu dropdown-menu-end">
              <li><a className="dropdown-item" href="recursos.html" target="_blank" rel="noopener noreferrer"><i className="bi bi-play-circle me-2"></i> Videos y consejos</a></li>
              <li><a className="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#modalInformacion"><i className="bi bi-info-circle me-2"></i> Información de la tienda</a></li>
              <li><hr className="dropdown-divider" /></li>
              <li><a className="dropdown-item" href="https://www.youtube.com/results?search_query=consejos+para+elegir+un+instrumento+musical" target="_blank" rel="noopener noreferrer"><i className="bi bi-youtube me-2"></i> Ver videos externos</a></li>
            </ul>
          </div>

          <button
            type="button"
            className="btn btn-minimal"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasCart"
          >
            <i className="bi bi-cart3 me-1" aria-hidden="true" />
            Carrito ({cantidadCarrito})
          </button>

          <button
            type="button"
            className="btn btn-outline-minimal"
            aria-label="Cerrar sesión"
          >
            <i className="bi bi-box-arrow-right" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  )
}