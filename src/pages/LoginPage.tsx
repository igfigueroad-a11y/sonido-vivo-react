import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div className="container py-5 text-center">
      <h2>Iniciar Sesión</h2>
      <p>Página de login en construcción...</p>
      <Link to="/tienda" className="btn btn-minimal mt-3">Volver a la tienda</Link>
    </div>
  );
}