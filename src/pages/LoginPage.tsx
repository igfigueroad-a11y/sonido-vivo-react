import { useContext, useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TiendaContext } from '../context/TiendaContext';

const API_URL = 'http://localhost:8081/api/auth';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [verPassword, setVerPassword] = useState(false);
  const [cargando, setCargando] = useState(false);

  const navigate = useNavigate();
  const { login, mostrarToast } = useContext(TiendaContext);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const nombreUsuario = usuario.trim();

    if (nombreUsuario === '' || password.trim() === '') {
      mostrarToast('Por favor, completa todos los campos obligatorios.', 'warning');
      return;
    }

    if (!isLogin && email.trim() === '') {
      mostrarToast('Por favor, ingresa un correo electrónico.', 'warning');
      return;
    }

    setCargando(true);

    try {
      if (!isLogin) {
        const resRegistro = await fetch(`${API_URL}/registro`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nombre: nombreUsuario,
            email: email.trim(),
            password,
          }),
        });

        const dataRegistro = await resRegistro.json();
        if (!resRegistro.ok) {
          mostrarToast(
            dataRegistro.mensaje || 'No se pudo registrar la cuenta. Verifica los datos.',
            'error',
          );
          return;
        }
      }

      const respuesta = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: nombreUsuario, password }),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        mostrarToast(data.mensaje || 'Credenciales incorrectas o datos inválidos.', 'error');
        return;
      }

      login({
        id: data.id,
        nombre: data.nombre,
        email: data.email,
        rol: data.rol,
        token: data.token,
      });

      mostrarToast(
        isLogin
          ? `¡Bienvenido de vuelta, ${data.nombre}!`
          : `¡Cuenta creada con éxito! Bienvenido/a, ${data.nombre}.`,
        'success',
      );

      navigate(data.rol === 'admin' ? '/admin' : '/tienda');
    } catch (error) {
      console.error('Error de conexión con ms-usuarios:', error);
      mostrarToast(
        'No se pudo conectar con el servidor de usuarios (puerto 8081).',
        'error',
      );
    } finally {
      setCargando(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setUsuario('');
    setPassword('');
    setEmail('');
    setVerPassword(false);
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100 px-3"
      style={{ backgroundColor: 'var(--bg-main)' }}
    >
      <div className="card card-minimal p-4 shadow-sm" style={{ maxWidth: '420px', width: '100%' }}>
        <div className="card-body">
          <div className="text-center mb-4">
            <span className="icono-empresa mb-2">
              <i className="bi bi-soundwave"></i>
            </span>
            <h1 className="h3 fw-bold text-dark mb-1">SONIDO VIVO</h1>
            <p className="text-muted fs-6 mb-0">
              {isLogin ? 'Iniciar Sesión' : 'Crear nueva cuenta'}
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            {!isLogin && (
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-bold small text-secondary">
                  Correo Electrónico
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="tucorreo@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div className="mb-3">
              <label htmlFor="usuario" className="form-label fw-bold small text-secondary">
                Usuario
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-person"></i>
                </span>
                <input
                  type="text"
                  id="usuario"
                  className="form-control"
                  placeholder="Ingresa tu usuario"
                  value={usuario}
                  onChange={(e) => setUsuario(e.target.value)}
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="form-label fw-bold small text-secondary">
                Contraseña
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type={verPassword ? 'text' : 'password'}
                  id="password"
                  className="form-control border-end-0"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-outline-minimal border-start-0"
                  onClick={() => setVerPassword(!verPassword)}
                  tabIndex={-1}
                  title={verPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                >
                  <i className={`bi ${verPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-minimal w-100 py-2 mb-3" disabled={cargando}>
              {cargando ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  PROCESANDO...
                </>
              ) : isLogin ? (
                'ENTRAR'
              ) : (
                'REGISTRARSE'
              )}
            </button>
          </form>

          <div className="text-center border-top pt-3">
            <p className="small text-muted mb-2">
              {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
            </p>
            <button
              type="button"
              className="btn btn-outline-minimal btn-sm w-100 mb-3"
              onClick={toggleMode}
              disabled={cargando}
            >
              {isLogin ? 'Crear cuenta' : 'Iniciar sesión en su lugar'}
            </button>
            <Link
              to="/tienda"
              className="text-decoration-none small fw-medium"
              style={{ color: 'var(--accent-dark)' }}
            >
              <i className="bi bi-arrow-left me-1"></i> Volver a la tienda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}