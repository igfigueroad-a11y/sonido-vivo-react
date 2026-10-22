export default function CarruselHero() {
  return (
    <div
      id="carouselExampleCaptions"
      className="carousel slide mb-5"
      data-bs-ride="carousel"
      data-bs-interval="3000"
    >
      <div className="carousel-indicators">
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="0"
          className="active"
          aria-current="true"
          aria-label="Slide 1"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="1"
          aria-label="Slide 2"
        ></button>
        <button
          type="button"
          data-bs-target="#carouselExampleCaptions"
          data-bs-slide-to="2"
          aria-label="Slide 3"
        ></button>
      </div>

      <div className="carousel-inner">
        <div className="carousel-item active">
          <img
            src="/imagenes/carrusel fotos/como-montar-un-equipo-de-sonido-profesional-completo-guia-pas.jpg"
            className="d-block w-100 carrusel-img-borde"
            alt="Equipo de sonido profesional"
          />
          <div className="carousel-caption d-none d-md-block texto-carrusel-oscuro">
            <h5>Todo tipo de Productos</h5>
            <p>Busca tu instrumento ideal entre nuestra amplia selección.</p>
          </div>
        </div>

        <div className="carousel-item">
          <img
            src="/imagenes/carrusel fotos/Foto_bundle_para_el_banner_shopify.webp"
            className="d-block w-100 carrusel-img-borde"
            alt="Bundle de instrumentos musicales"
          />
          <div className="carousel-caption d-none d-md-block texto-carrusel-claro">
            <h5>Bundle de Instrumentos Musicales</h5>
            <p>Descubre nuestras ofertas especiales en bundles de instrumentos.</p>
          </div>
        </div>

        <div className="carousel-item">
          <img
            src="/imagenes/carrusel fotos/foto guitarras.jpg"
            className="d-block w-100 carrusel-img-borde"
            alt="Guitarras"
          />
          <div className="carousel-caption d-none d-md-block texto-carrusel-oscuro">
            <h5>Guitarras</h5>
            <p>Descubre nuestra amplia selección de guitarras de diferentes tipos y estilos.</p>
          </div>
        </div>
      </div>

      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#carouselExampleCaptions"
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );
}