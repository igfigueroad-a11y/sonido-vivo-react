import { useContext } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { TiendaContext } from '../../context/TiendaContext';

interface HeaderTiendaProps {
  cantidadCarrito?: number;
  mostrarCarrito?: boolean;
}

export default function HeaderTienda({
  cantidadCarrito = 0,
  mostrarCarrito = true,
}: HeaderTiendaProps) {
  const { usuarioActual, carrito, logout, mostrarToast } = useContext(TiendaContext);
  const navigate = useNavigate();

  const totalItems =
    cantidadCarrito || carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const handleLogout = () => {
    logout();
    navigate('/tienda');
  };

  const handleClickCarritoAdmin = () => {
    mostrarToast(
      'Las cuentas de administrador no pueden realizar compras. Crea una cuenta personal para comprar.',
      'warning',
    );
  };

  return (
    <header className="py-3 header-fijo">
      <div className="container d-flex justify-content-between align-items-center flex-wrap gap-3">
        <div className="d-flex align-items-center gap-4 flex-wrap">
          <Link to="/tienda" className="text-decoration-none">
            <h1 className="h4 text-white fw-bold mb-0">
              <i className="bi bi-soundwave me-2"></i>SONIDO VIVO
            </h1>
            <small className="text-white-50">Tienda de Instrumentos Musicales</small>
          </Link>

          <nav className="d-flex gap-2 align-items-center flex-wrap">
            <NavLink
              to="/tienda"
              className={({ isActive }) =>
                `btn btn-sm ${isActive ? 'btn-light text-dark fw-bold' : 'btn-outline-minimal'}`
              }
            >
              <i className="bi bi-shop me-1"></i> Tienda
            </NavLink>
            <NavLink
              to="/recursos"
              className={({ isActive }) =>
                `btn btn-sm ${isActive ? 'btn-light text-dark fw-bold' : 'btn-outline-minimal'}`
              }
            >
              <i className="bi bi-play-circle me-1"></i> Recursos
            </NavLink>
            <NavLink
              to="/contacto"
              className={({ isActive }) =>
                `btn btn-sm ${isActive ? 'btn-light text-dark fw-bold' : 'btn-outline-minimal'}`
              }
            >
              <i className="bi bi-chat-dots me-1"></i> Contacto y Ayuda
            </NavLink>

            {usuarioActual?.rol === 'cliente' && (
              <NavLink
                to="/mis-pedidos"
                className={({ isActive }) =>
                  `btn btn-sm ${isActive ? 'btn-light text-dark fw-bold' : 'btn-outline-minimal'}`
                }
              >
                <i className="bi bi-receipt-cutoff me-1"></i> Mis Pedidos
              </NavLink>
            )}
          </nav>
        </div>

        <div className="d-flex gap-2 align-items-center flex-wrap">
          {usuarioActual ? (
            <span className="text-white fw-semibold d-flex align-items-center gap-2 me-1 small">
              <i className="bi bi-person-circle fs-5" aria-hidden="true" />
              Hola, {usuarioActual.nombre}
              {usuarioActual.rol === 'admin' && (
                <span className="badge bg-warning text-dark">ADMIN</span>
              )}
            </span>
          ) : (
            <Link to="/login" className="btn btn-outline-minimal btn-sm py-2 px-3">
              <i className="bi bi-person-circle me-1" aria-hidden="true" />
              Iniciar Sesión
            </Link>
          )}

          {usuarioActual?.rol === 'admin' && (
            <Link to="/admin" className="btn btn-warning btn-sm fw-bold text-dark px-3 py-2">
              <i className="bi bi-speedometer2 me-1"></i>
              Panel Admin
            </Link>
          )}

          {mostrarCarrito &&
            (usuarioActual?.rol === 'admin' ? (
              <button
                type="button"
                className="btn btn-outline-minimal btn-sm py-2 px-3 opacity-75"
                onClick={handleClickCarritoAdmin}
                title="Los administradores no pueden comprar"
              >
                <i className="bi bi-lock me-1"></i> Carrito bloqueado
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-minimal btn-sm py-2 px-3"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasCart"
              >
                <i className="bi bi-cart3 me-1" aria-hidden="true" />
                Carrito
                <span className="badge bg-white text-dark ms-2">{totalItems}</span>
              </button>
            ))}

          {usuarioActual && (
            <button
              type="button"
              className="btn btn-outline-danger btn-sm py-2"
              aria-label="Cerrar sesión"
              title="Cerrar sesión"
              onClick={handleLogout}
            >
              <i className="bi bi-box-arrow-right" aria-hidden="true" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}