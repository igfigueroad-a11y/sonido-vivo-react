import HeaderTienda from '../Components/organism/HeaderTienda';
import CarruselHero from '../Components/molecules/CarruselHero';
import SeccionInformacion from '../Components/organism/SeccionInformacion';
import FooterTienda from '../Components/organism/FooterTienda';
import ModalInformacion from '../Components/organism/ModalInformacion';
import ProductoCard from '../Components/molecules/ProductoCard';
import CartOffcanvas from '../Components/organism/CartOffcanvas';
import { useTienda } from '../hooks/useTienda';

const CATEGORIAS_SIDEBAR = [
  { nombre: 'Guitarras Eléctricas', icono: 'bi-lightning-charge' },
  { nombre: 'Guitarras Acústicas', icono: 'bi-music-note' },
  { nombre: 'Bajos Eléctricos', icono: 'bi-soundwave' },
  { nombre: 'Baterías', icono: 'bi-disc' },
  { nombre: 'Teclados y Pianos', icono: 'bi-grid-3x3' },
  { nombre: 'Amplificadores', icono: 'bi-speaker' },
  { nombre: 'Micrófonos', icono: 'bi-mic' },
  { nombre: 'Pedales de Efectos', icono: 'bi-sliders' },
  { nombre: 'Accesorios', icono: 'bi-plug' },
];

export default function TiendaPage() {
  const {
    busqueda,
    setBusqueda,
    categoria,
    setCategoria,
    orden,
    setOrden,
    soloDisponibles,
    setSoloDisponibles,
    limpiarFiltros,
    productosFiltrados,
    cargandoCatalogo,
    carrito,
    cantidadTotal,
    handleAgregarCarrito,
    handleCambiarCantidad,
  } = useTienda();

  const hayFiltrosActivos =
    busqueda.trim() !== '' || categoria !== '' || soloDisponibles || orden !== 'destacados';

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      <HeaderTienda cantidadCarrito={cantidadTotal} />

      <main className="container-fluid px-3 px-xl-5 py-4" style={{ maxWidth: '1480px' }}>
        <div className="row g-4 align-items-start">
          {/* Panel Lateral Izquierdo */}
          <aside className="col-12 col-lg-3 col-xl-2">
            <div
              className="p-3 rounded-4 position-sticky"
              style={{
                top: '90px',
                backgroundColor: '#f3f5f8',
                border: '1px solid #e2e8f0',
              }}
            >
              <div className="d-flex justify-content-between align-items-center mb-3 pb-2 border-bottom border-secondary-subtle">
                <span className="fw-bold small text-uppercase text-secondary">
                  <i className="bi bi-funnel me-1"></i>Categorías
                </span>
                {hayFiltrosActivos && (
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 text-decoration-none text-muted"
                    onClick={limpiarFiltros}
                  >
                    Limpiar
                  </button>
                )}
              </div>

              {/* Lista Vertical de Categorías */}
              <div className="d-flex flex-column gap-1 mb-3">
                <button
                  type="button"
                  onClick={() => setCategoria('')}
                  className="btn btn-sm text-start d-flex align-items-center gap-2 py-2 px-3 rounded-3 border-0"
                  style={{
                    backgroundColor: categoria === '' ? '#e2e8f0' : 'transparent',
                    color: categoria === '' ? '#0f172a' : '#475569',
                    fontWeight: categoria === '' ? 600 : 400,
                  }}
                >
                  <i className="bi bi-grid"></i>
                  <span>Todas</span>
                </button>

                {CATEGORIAS_SIDEBAR.map((cat) => {
                  const activa = categoria === cat.nombre;
                  return (
                    <button
                      key={cat.nombre}
                      type="button"
                      onClick={() => setCategoria(activa ? '' : cat.nombre)}
                      className="btn btn-sm text-start d-flex align-items-center gap-2 py-2 px-3 rounded-3 border-0"
                      style={{
                        backgroundColor: activa ? '#e2e8f0' : 'transparent',
                        color: activa ? '#0f172a' : '#475569',
                        fontWeight: activa ? 600 : 400,
                      }}
                    >
                      <i className={`bi ${cat.icono}`}></i>
                      <span className="text-truncate">{cat.nombre}</span>
                    </button>
                  );
                })}
              </div>

              <hr className="my-3 text-secondary opacity-25" />

              {/* Ordenamiento */}
              <div className="mb-3">
                <label className="form-label small fw-semibold text-secondary mb-1">
                  Ordenar por
                </label>
                <select
                  className="form-select form-select-sm bg-white border-secondary-subtle text-secondary"
                  value={orden}
                  onChange={(e) => setOrden(e.target.value)}
                >
                  <option value="destacados">Destacados</option>
                  <option value="precio-asc">Precio: menor a mayor</option>
                  <option value="precio-desc">Precio: mayor a menor</option>
                  <option value="nombre-asc">Nombre: A - Z</option>
                </select>
              </div>

              {/* Switch Solo Stock Disponible */}
              <div className="form-check form-switch mb-3">
                <input
                  className="form-check-input"
                  type="checkbox"
                  role="switch"
                  id="switchStockSidebar"
                  checked={soloDisponibles}
                  onChange={(e) => setSoloDisponibles(e.target.checked)}
                />
                <label
                  className="form-check-label small text-secondary"
                  htmlFor="switchStockSidebar"
                >
                  Solo con stock
                </label>
              </div>

              <div className="pt-2 border-top border-secondary-subtle text-center">
                <small className="text-muted">
                  Mostrando <strong>{productosFiltrados.length}</strong> instrumentos
                </small>
              </div>
            </div>
          </aside>

          {/* Columna Central: Búsqueda Arriba + Cuadrado al Medio + Catálogo */}
          <div className="col-12 col-lg-9 col-xl-10">
            <div className="mx-auto" style={{ maxWidth: '1060px' }}>
              {/* Barra de Búsqueda Arriba del Cuadrado */}
              <div className="mb-3">
                <div
                  className="input-group input-group-lg shadow-sm rounded-3 overflow-hidden"
                  style={{ border: '1px solid #e2e8f0', backgroundColor: '#ffffff' }}
                >
                  <span className="input-group-text bg-white border-0 text-muted ps-3">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-0 shadow-none"
                    placeholder="Buscar modelo, marca o descripción..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                  {busqueda && (
                    <button
                      type="button"
                      className="btn bg-white border-0 text-muted pe-3"
                      title="Limpiar búsqueda"
                      onClick={() => setBusqueda('')}
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  )}
                </div>
              </div>

              {/* Cuadrado Principal Centrado */}
              <CarruselHero
                categoriaActiva={categoria}
                onSeleccionarCategoria={setCategoria}
              />

              {/* Grilla de Instrumentos */}
              <section id="catalogo" className="mb-5 mt-4">
                <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
                  <h2 className="h4 fw-bold mb-0">
                    {categoria ? categoria : 'Catálogo de instrumentos'}
                  </h2>
                  {categoria && (
                    <span className="badge bg-light text-dark border px-3 py-2">
                      Filtro: {categoria}{' '}
                      <button
                        type="button"
                        className="btn-close ms-2"
                        style={{ fontSize: '0.6rem' }}
                        aria-label="Quitar categoría"
                        onClick={() => setCategoria('')}
                      ></button>
                    </span>
                  )}
                </div>

                {cargandoCatalogo ? (
                  <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <div className="col" key={n}>
                        <div className="card card-minimal p-4 h-100 placeholder-glow">
                          <div
                            className="placeholder col-12 mb-3 rounded"
                            style={{ height: '180px' }}
                          ></div>
                          <span className="placeholder col-6 mb-2"></span>
                          <span className="placeholder col-8 mb-3"></span>
                          <span className="placeholder col-12 py-3 rounded"></span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
                    {productosFiltrados.length > 0 ? (
                      productosFiltrados.map((producto) => (
                        <ProductoCard
                          key={producto.codigo}
                          producto={producto}
                          onAgregarCarrito={handleAgregarCarrito}
                        />
                      ))
                    ) : (
                      <div className="col-12 text-center text-muted py-5 card card-minimal">
                        <i className="bi bi-search fs-1"></i>
                        <p className="mt-2 fs-5 mb-3">
                          No se encontraron instrumentos con esos filtros.
                        </p>
                        <div>
                          <button className="btn btn-minimal" onClick={limpiarFiltros}>
                            Ver todo el catálogo
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </section>

              <SeccionInformacion />
            </div>
          </div>
        </div>
      </main>

      <FooterTienda />
      <ModalInformacion />

      <CartOffcanvas
        carrito={carrito}
        onCambiarCantidad={handleCambiarCantidad}
      />
    </div>
  );
}