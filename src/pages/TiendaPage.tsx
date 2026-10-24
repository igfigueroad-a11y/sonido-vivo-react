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
    busqueda, setBusqueda, categoria, setCategoria,
    productosFiltrados, carrito, cantidadTotal,
    handleAgregarCarrito, handleCambiarCantidad, handleFinalizarCompra
  } = useTienda();

  return (
    <>
      <HeaderTienda cantidadCarrito={cantidadTotal} />

      <main className="container py-4">
        <FiltrosCatalogo
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
          categoria={categoria}
          onCategoriaChange={setCategoria}
        />

        <CarruselHero />

        <section id="catalogo" className="mb-5">
          <h2 className="h4 mb-3">Catálogo de instrumentos</h2>
          
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
              <div className="col-12 text-center text-muted py-5">
                <i className="bi bi-search fs-1"></i>
                <p className="mt-2 fs-5">No se encontraron productos.</p>
              </div>
            )}
          </div>
        </section>

        <SeccionInformacion />
      </main>

      <FooterTienda />
      <ModalInformacion />
      
      <CartOffcanvas 
        carrito={carrito} 
        onCambiarCantidad={handleCambiarCantidad} 
        onFinalizarCompra={handleFinalizarCompra} 
      />
    </>
  );
}