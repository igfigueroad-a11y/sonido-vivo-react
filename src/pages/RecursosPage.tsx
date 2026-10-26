import { Link } from 'react-router-dom';
import FooterTienda from '../Components/organism/FooterTienda'; // Reutilizamos tu footer

export default function RecursosPage() {
  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh' }}>
      
      <header className="py-3 header-fijo">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h4 text-white fw-bold mb-0">SONIDO VIVO</h1>
            <small className="text-white-50">Recursos para músicos</small>
          </div>

          <div className="d-flex gap-2 align-items-center">
            <Link to="/tienda" className="btn btn-outline-minimal text-white border-white">
              <i className="bi bi-house me-1"></i>
              Tienda
            </Link>
            <Link to="/login" className="btn btn-minimal">
              <i className="bi bi-person me-1"></i>
              Iniciar sesión
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="container text-center my-5">
          <h2 className="fw-bold">Videos y consejos musicales</h2>
          <p className="text-secondary">Aprende a elegir, utilizar y cuidar tus instrumentos musicales.</p>
        </section>

        <section className="container mb-5">
          <div className="row g-4">
            <div className="col-md-6">
              <article className="card card-minimal h-100 p-3">
                <h3 className="h5 fw-bold">
                  <i className="bi bi-play-circle me-2"></i>
                  Cómo elegir tu instrumento
                </h3>
                <p className="text-secondary">
                  Conoce algunos aspectos importantes que debes considerar antes de comprar un instrumento musical.
                </p>
                <div className="ratio ratio-16x9">
                  <iframe 
                    width="560" 
                    height="315" 
                    src="https://www.youtube.com/embed/ggPCGvsa4iY?si=UDQ03LVlAwa_ilK6" 
                    title="YouTube video player" 
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowFullScreen>
                  </iframe>
                </div>
              </article>
            </div>

            <div className="col-md-6">
              <article className="card card-minimal h-100 p-3">
                <h3 className="h5 fw-bold">
                  <i className="bi bi-music-note-list me-2"></i>
                  Consejos para principiantes
                </h3>
                <p className="text-secondary">
                  Revisa recomendaciones básicas para comenzar a practicar y cuidar correctamente tu instrumento.
                </p>
                <div className="ratio ratio-16x9">
                  <iframe
                    src="https://www.youtube.com/embed/3tE78JZ_6Lg"
                    title="Consejos musicales para principiantes"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen>
                  </iframe>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section className="container mb-5">
          <div className="card card-minimal p-4">
            <h2 className="h4 fw-bold mb-4">
              <i className="bi bi-lightbulb me-2"></i>
              Recomendaciones para elegir un instrumento
            </h2>
            <div className="row g-4">
              <div className="col-md-4">
                <div className="text-center">
                  <i className="bi bi-person-check fs-1"></i>
                  <h3 className="h5 fw-bold mt-3">Considera tu nivel</h3>
                  <p className="text-secondary">Elige un instrumento que sea adecuado para tu experiencia y objetivos musicales.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center">
                  <i className="bi bi-wallet2 fs-1"></i>
                  <h3 className="h5 fw-bold mt-3">Define tu presupuesto</h3>
                  <p className="text-secondary">Revisa diferentes alternativas y busca una opción que se ajuste a tus necesidades.</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center">
                  <i className="bi bi-tools fs-1"></i>
                  <h3 className="h5 fw-bold mt-3">Considera los accesorios</h3>
                  <p className="text-secondary">Algunos instrumentos necesitan cables, fundas, soportes, afinadores o amplificadores.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mb-5">
          <div className="accordion" id="accordionRecursos">
            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#cuidadosInstrumentos" aria-expanded="true" aria-controls="cuidadosInstrumentos">
                  <i className="bi bi-shield-check me-2"></i>
                  Cuidados básicos de los instrumentos
                </button>
              </h2>
              <div id="cuidadosInstrumentos" className="accordion-collapse collapse show">
                <div className="accordion-body">
                  Mantén tu instrumento limpio y guárdalo en un lugar seco. Evita exponerlo a cambios extremos de temperatura o humedad. También revisa periódicamente sus cuerdas, cables, conectores y accesorios.
                </div>
              </div>
            </div>

            <div className="accordion-item">
              <h2 className="accordion-header">
                <button className="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#compraCorrecta" aria-expanded="false" aria-controls="compraCorrecta">
                  <i className="bi bi-check-circle me-2"></i>
                  ¿Qué considerar antes de comprar?
                </button>
              </h2>
              <div id="compraCorrecta" className="accordion-collapse collapse">
                <div className="accordion-body">
                  Considera tu nivel de experiencia, el estilo musical que quieres practicar, el espacio disponible, tu presupuesto y los accesorios necesarios para utilizar correctamente el producto.
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container text-center mb-5">
          <Link to="/tienda" className="btn btn-minimal btn-lg">
            <i className="bi bi-grid me-2"></i>
            Explorar catálogo
          </Link>
        </section>
      </main>

      <FooterTienda />
    </div>
  );
}