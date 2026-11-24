interface HeroProps {
  categoriaActiva: string;
  onSeleccionarCategoria: (categoria: string) => void;
}

const CATEGORIAS_RAPIDAS = [
  { nombre: 'Guitarras Eléctricas', icono: 'bi-lightning-charge' },
  { nombre: 'Guitarras Acústicas', icono: 'bi-music-note' },
  { nombre: 'Bajos Eléctricos', icono: 'bi-soundwave' },
  { nombre: 'Baterías', icono: 'bi-disc' },
  { nombre: 'Teclados y Pianos', icono: 'bi-grid-3x3-gap' },
  { nombre: 'Amplificadores', icono: 'bi-speaker' },
  { nombre: 'Micrófonos', icono: 'bi-mic' },
  { nombre: 'Pedales de Efectos', icono: 'bi-sliders' },
  { nombre: 'Accesorios', icono: 'bi-plug' },
];

export default function CarruselHero({
  categoriaActiva,
  onSeleccionarCategoria,
}: HeroProps) {
  const handleClickCategoria = (cat: string) => {
    onSeleccionarCategoria(categoriaActiva === cat ? '' : cat);
    const seccionCatalogo = document.getElementById('catalogo');
    if (seccionCatalogo) {
      seccionCatalogo.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="mb-4">
      <div
        className="rounded-4 p-4 p-md-5 text-white shadow-sm mb-3"
        style={{
          background: 'linear-gradient(135deg, #172554 0%, #0f172a 100%)',
          border: '1px solid #1e293b',
        }}
      >
        <div className="row align-items-center g-4">
          <div className="col-lg-8">
            <span className="badge bg-warning text-dark fw-bold mb-3 px-3 py-2">
              <i className="bi bi-truck me-1"></i> Despacho Starken a todo Chile • Gratis sobre $150.000
            </span>
            <h2 className="display-6 fw-bold text-white mb-3">
              El sonido que buscas, listo para tu próximo ensayo o escenario
            </h2>
            <p className="text-white-50 mb-4 fs-6" style={{ maxWidth: '620px' }}>
              Instrumentos calibrados, amplificación y accesorios con garantía de 6 meses y retiro
              en tienda en 2 días hábiles.
            </p>
            <div className="d-flex flex-wrap gap-2">
              <a href="#catalogo" className="btn btn-light text-dark fw-bold px-4 py-2">
                <i className="bi bi-grid me-2"></i>Explorar Catálogo
              </a>
              <a href="/contacto" className="btn btn-outline-light px-4 py-2">
                <i className="bi bi-calendar-check me-2"></i>Agendar Prueba en Sala
              </a>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="bg-white bg-opacity-10 rounded-3 p-3 d-flex flex-column gap-3 border border-white border-opacity-10">
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-box-seam fs-4 text-warning"></i>
                <div>
                  <strong className="d-block small text-white">Envíos Starken a todo Chile</strong>
                  <small className="text-white-50">Cálculo automático por región y plazo estimado</small>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-shop fs-4 text-warning"></i>
                <div>
                  <strong className="d-block small text-white">Retiro en Tienda Gratis</strong>
                  <small className="text-white-50">Listo en 2 días hábiles en sucursal</small>
                </div>
              </div>
              <div className="d-flex align-items-center gap-3">
                <i className="bi bi-shield-check fs-4 text-warning"></i>
                <div>
                  <strong className="d-block small text-white">Compra Segura y Garantía</strong>
                  <small className="text-white-50">6 meses de garantía legal en todo el catálogo</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

        
    </section>
  );
}