import { useContext, useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TiendaContext } from '../context/TiendaContext';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();
const { login } = useContext(TiendaContext);
const handleSubmit = (e: FormEvent) => {
  e.preventDefault();

  const nombreUsuario = usuario.trim();

  if (nombreUsuario === '' || password.trim() === '') {
    alert('Por favor, completa los campos obligatorios.');
    return;
  }

  const ingresar = (
    rol: 'admin' | 'cliente',
    esRegistro = false,
  ) => {
    login({
      nombre: nombreUsuario,
      rol,
    });

    alert(
      esRegistro
        ? `¡Cuenta creada con éxito! Bienvenido/a, ${nombreUsuario}.`
        : `¡Ingresaste correctamente! Hola, ${nombreUsuario}.`,
    );

    navigate(rol === 'admin' ? '/admin' : '/tienda');
  };

  if (isLogin) {
    if (
      nombreUsuario === 'admin' &&
      password === 'admin123'
    ) {
      ingresar('admin');
      return;
    }

    if (
      nombreUsuario === 'usuario' &&
      password === '1234'
    ) {
      ingresar('cliente');
      return;
    }

    const guardadoPassword = localStorage.getItem(
      `user_${nombreUsuario}`,
    );

    if (
      guardadoPassword !== null &&
      guardadoPassword === password
    ) {
      ingresar('cliente');
      return;
    }

    alert('Usuario o contraseña incorrectos. Inténtalo de nuevo.');
    return;
  }

  if (email.trim() === '') {
    alert('Por favor, ingresa un correo electrónico.');
    return;
  }

  const usuarioExiste =
    nombreUsuario === 'admin' ||
    nombreUsuario === 'usuario' ||
    localStorage.getItem(`user_${nombreUsuario}`) !== null;

  if (usuarioExiste) {
    alert('Ese nombre de usuario ya está registrado. Elige otro.');
    return;
  }

  // Conservamos el registro local de tu prototipo.
  localStorage.setItem(`user_${nombreUsuario}`, password);

  ingresar('cliente', true);
};
  const toggleMode = () => {
    setIsLogin(!isLogin);
    setUsuario('');
    setPassword('');
    setEmail('');
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="card card-minimal p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <div className="card-body">
          
          <div className="text-center mb-4">
            <h1 className="h3 fw-bold text-dark mb-1">SONIDO VIVO</h1>
            <p className="text-muted fs-6">
              {isLogin ? 'Iniciar Sesión' : 'Crear nueva cuenta'}
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate>
            
            {!isLogin && (
              <div className="mb-3">
                <label htmlFor="email" className="form-label fw-bold small text-secondary">Correo Electrónico</label>
                <div className="input-group">
                  <span className="input-group-text"><i className="bi bi-envelope"></i></span>
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
              <label htmlFor="usuario" className="form-label fw-bold small text-secondary">Usuario</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-person"></i></span>
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
              <label htmlFor="password" className="form-label fw-bold small text-secondary">Contraseña</label>
              <div className="input-group">
                <span className="input-group-text"><i className="bi bi-lock"></i></span>
                <input 
                  type="password" 
                  id="password" 
                  className="form-control" 
                  placeholder="Ingresa tu contraseña" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn btn-minimal w-100 py-2 mb-3">
              {isLogin ? 'ENTRAR' : 'REGISTRARSE'}
            </button>
          </form>

          <div className="text-center border-top pt-3">
            <p className="small text-muted mb-2">
              {isLogin ? '¿No tienes una cuenta?' : '¿Ya tienes una cuenta?'}
            </p>
            <button 
              type="button" 
              className="btn btn-outline-minimal btn-sm w-100 mb-2"
              onClick={toggleMode}
            >
              {isLogin ? 'Crear cuenta' : 'Iniciar sesión en su lugar'}
            </button>
            <Link to="/tienda" className="text-decoration-none small" style={{ color: 'var(--accent-dark)' }}>
              <i className="bi bi-arrow-left me-1"></i> Volver a la tienda
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}