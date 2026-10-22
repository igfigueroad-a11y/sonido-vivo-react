export default function FooterTienda() {
  return (
    <footer className="bg-dark text-light py-4 mt-5">
      <div className="container text-center">
        <p className="mb-0">
          &copy; 2026 SONIDO VIVO. Todos los derechos reservados.
        </p>
        <p className="mb-0">Síguenos en nuestras redes sociales:</p>
        <div className="d-flex justify-content-center gap-3 mt-2">
          <a
            href="https://www.facebook.com/SoundAdvisors.cl/?locale=es_LA"
            target="_blank"
            rel="noopener noreferrer"
            className="text-light"
          >
            <i className="bi bi-facebook"></i>
          </a>
          <a
            href="https://www.instagram.com/audiomusica/?hl=es"
            target="_blank"
            rel="noopener noreferrer"
            className="text-light"
          >
            <i className="bi bi-instagram"></i>
          </a>
          <a
            href="https://www.youtube.com/studiomusiccl"
            target="_blank"
            rel="noopener noreferrer"
            className="text-light"
          >
            <i className="bi bi-youtube"></i>
          </a>
        </div>
      </div>
    </footer>
  );
}