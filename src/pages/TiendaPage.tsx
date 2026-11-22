import HeaderTienda from '../Components/organism/HeaderTienda';
import FiltrosCatalogo from '../Components/molecules/FiltrosCatalogos';
import CarruselHero from '../Components/molecules/CarruselHero';
import SeccionInformacion from '../Components/organism/SeccionInformacion';
import FooterTienda from '../Components/organism/FooterTienda';
import ModalInformacion from '../Components/organism/ModalInformacion';
import ProductoCard from '../Components/molecules/ProductoCard';
import CartOffcanvas from '../Components/organism/CartOffcanvas';
import { useTienda } from '../hooks/useTienda';

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

  return (
    <>
      <HeaderTienda cantidadCarrito={cantidadTotal} />

      <main className="container py-4">
   <CarruselHero
          categoriaActiva={categoria}
          onSeleccionarCategoria={setCategoria}
        />
        <FiltrosCatalogo
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
          categoria={categoria}
          onCategoriaChange={setCategoria}
          orden={orden}
          onOrdenChange={setOrden}
          soloDisponibles={soloDisponibles}
          onSoloDisponiblesChange={setSoloDisponibles}
          onLimpiar={limpiarFiltros}
          totalResultados={productosFiltrados.length}
        />

        <section id="catalogo" className="mb-5">
          <h2 className="h4 fw-bold mb-3">Catálogo de instrumentos</h2>

          {cargandoCatalogo ? (
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
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
            <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
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
      </main>

      <FooterTienda />
      <ModalInformacion />

      <CartOffcanvas
        carrito={carrito}
        onCambiarCantidad={handleCambiarCantidad}
      />
    </>
  );
}