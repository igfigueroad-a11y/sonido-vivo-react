import { useState, useEffect, type FormEvent, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { TiendaContext } from '../context/TiendaContext';
import { IMAGEN_RESPALDO } from '../Components/molecules/ProductoCard';
import type { producto } from '../types';

const API_PRODUCTOS = 'http://localhost:8082/api/productos';
const API_USUARIOS = 'http://localhost:8081/api/usuarios';
const API_CONTACTOS = 'http://localhost:8084/api/contactos';
const API_RESENAS = 'http://localhost:8085/api/resenas';

interface TicketContacto {
  id: number;
  ticket: string;
  nombre: string;
  email: string;
  tipoConsulta: string;
  instrumentoInteres: string;
  fechaPrueba: string;
  mensaje: string;
  respuestaAdmin?: string;
  estado: 'PENDIENTE' | 'RESPONDIDA' | 'APROBADA' | 'DESAPROBADA';
  fechaCreacion: string;
}

interface UsuarioRegistrado {
  id: number;
  nombre: string;
  email: string;
  rol: 'admin' | 'cliente';
}

interface ResenaAdmin {
  id: number;
  codigoProducto: string;
  autorNombre: string;
  puntuacion: number;
  comentario: string;
  fechaCreacion: string;
}

export default function AdminPage() {
  const navigate = useNavigate();
  const { productos, setProductos, usuarioActual, token, logout, mostrarToast } =
    useContext(TiendaContext);

  const [tabActiva, setTabActiva] = useState<
    'catalogo' | 'usuarios' | 'tickets' | 'resenas'
  >('catalogo');

  // Helper de cabeceras con Token JWT
  const getAuthHeaders = (conJson = false): HeadersInit => {
    const jwt = token || localStorage.getItem('tokenJWT') || '';
    return {
      ...(conJson ? { 'Content-Type': 'application/json' } : {}),
      ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
    };
  };

  // Estados de Catálogo
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [productoAEliminar, setProductoAEliminar] = useState<producto | null>(null);
  const [formData, setFormData] = useState<producto>({
    codigo: '',
    categoria: '',
    modelo: '',
    marca: '',
    stock: 0,
    precio: 0,
    descripcion: '',
    imagen: '',
  });

  // Estados de Usuarios
  const [usuarios, setUsuarios] = useState<UsuarioRegistrado[]>([]);
  const [cargandoUsuarios, setCargandoUsuarios] = useState(false);
  const [busquedaUsuario, setBusquedaUsuario] = useState('');
  const [usuarioAEliminar, setUsuarioAEliminar] = useState<UsuarioRegistrado | null>(null);

  // Estados de Consultas y Soporte (ms-contacto)
  const [tickets, setTickets] = useState<TicketContacto[]>([]);
  const [cargandoTickets, setCargandoTickets] = useState(false);
  const [ticketAResponder, setTicketAResponder] = useState<TicketContacto | null>(null);
  const [textoRespuesta, setTextoRespuesta] = useState('');
  const [errorRespuesta, setErrorRespuesta] = useState('');
  const [enviandoRespuesta, setEnviandoRespuesta] = useState(false);

  // Estados de Reseñas (ms-resenas)
  const [resenas, setResenas] = useState<ResenaAdmin[]>([]);
  const [cargandoResenas, setCargandoResenas] = useState(false);
  const [resenaAEliminar, setResenaAEliminar] = useState<ResenaAdmin | null>(null);

  useEffect(() => {
    if (localStorage.getItem('rolUsuario') !== 'admin') {
      navigate('/login');
    }
  }, [navigate]);

  const cargarUsuarios = async () => {
    setCargandoUsuarios(true);
    try {
      const res = await fetch(API_USUARIOS, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data: UsuarioRegistrado[] = await res.json();
        setUsuarios(data);
      } else if (res.status === 401 || res.status === 403) {
        mostrarToast('Sesión expirada o sin permisos JWT. Vuelve a iniciar sesión.', 'warning');
      } else {
        mostrarToast('No se pudo cargar la lista de usuarios.', 'error');
      }
    } catch (error) {
      console.error('Error conectando con ms-usuarios:', error);
      mostrarToast('Enciende ms-usuarios (puerto 8081) para gestionar cuentas.', 'warning');
    } finally {
      setCargandoUsuarios(false);
    }
  };

  const cargarTickets = async () => {
    setCargandoTickets(true);
    try {
      const res = await fetch(API_CONTACTOS, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data: TicketContacto[] = await res.json();
        setTickets(data);
      } else {
        mostrarToast('No se pudieron cargar las consultas de soporte.', 'error');
      }
    } catch (error) {
      console.error('Error conectando con ms-contacto:', error);
      mostrarToast('Enciende ms-contacto (puerto 8084) para ver las consultas.', 'warning');
    } finally {
      setCargandoTickets(false);
    }
  };

  const cargarResenas = async () => {
    setCargandoResenas(true);
    try {
      const res = await fetch(API_RESENAS, {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const data: ResenaAdmin[] = await res.json();
        setResenas(data);
      } else {
        mostrarToast('No se pudieron cargar las reseñas.', 'error');
      }
    } catch (error) {
      console.error('Error conectando con ms-resenas:', error);
      mostrarToast('Enciende ms-resenas (puerto 8085) para moderar reseñas.', 'warning');
    } finally {
      setCargandoResenas(false);
    }
  };

  useEffect(() => {
    if (tabActiva === 'usuarios') cargarUsuarios();
    if (tabActiva === 'tickets') cargarTickets();
    if (tabActiva === 'resenas') cargarResenas();
  }, [tabActiva]);

  const cerrarSesion = () => {
    logout();
    navigate('/login');
  };

  const productosFiltrados = productos.filter((p) => {
    const coincideTexto =
      p.modelo.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtroCategoria === '' || p.categoria === filtroCategoria;
    return coincideTexto && coincideCategoria;
  });

  const usuariosFiltrados = usuarios.filter(
    (u) =>
      u.nombre.toLowerCase().includes(busquedaUsuario.toLowerCase()) ||
      u.email.toLowerCase().includes(busquedaUsuario.toLowerCase()),
  );

  const total = productos.length;
  const stockTotal = productos.reduce((acc, p) => acc + p.stock, 0);
  const categoriasCount = new Set(productos.map((p) => p.categoria)).size;
  const valorInventario = productos.reduce((acc, p) => acc + p.precio * p.stock, 0);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'stock' || name === 'precio' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const abrirModalNuevo = () => {
    setIsEditing(false);
    setFormData({
      codigo: '',
      categoria: '',
      modelo: '',
      marca: '',
      stock: 0,
      precio: 0,
      descripcion: '',
      imagen: '',
    });
    setShowModal(true);
  };

  const abrirModalEditar = (prod: producto) => {
    setIsEditing(true);
    setFormData(prod);
    setShowModal(true);
  };

  const guardarProducto = async (e: FormEvent) => {
    e.preventDefault();

    if (
      String(formData.codigo).trim() === '' ||
      String(formData.categoria).trim() === '' ||
      String(formData.modelo).trim() === '' ||
      String(formData.marca).trim() === '' ||
      String(formData.descripcion).trim() === '' ||
      String(formData.stock).trim() === '' ||
      String(formData.precio).trim() === ''
    ) {
      mostrarToast('Por favor, completa todos los campos obligatorios.', 'warning');
      return;
    }

    if (Number(formData.stock) < 0 || Number(formData.precio) < 0) {
      mostrarToast('El stock y el precio no pueden ser negativos.', 'warning');
      return;
    }

    setGuardando(true);

    try {
      const url = isEditing ? `${API_PRODUCTOS}/${formData.codigo}` : API_PRODUCTOS;
      const respuesta = await fetch(url, {
        method: isEditing ? 'PUT' : 'POST',
        headers: getAuthHeaders(true),
        body: JSON.stringify({
          ...formData,
          codigo: formData.codigo.trim().toUpperCase(),
          stock: Number(formData.stock),
          precio: Number(formData.precio),
        }),
      });

      if (respuesta.status === 401 || respuesta.status === 403) {
        mostrarToast('Token JWT inválido o expirado. Inicia sesión nuevamente.', 'error');
        return;
      }

      const data = await respuesta.json();

      if (!respuesta.ok) {
        mostrarToast(data.mensaje || 'Error al guardar el producto.', 'error');
        return;
      }

      if (isEditing) {
        setProductos((prev) => prev.map((p) => (p.codigo === data.codigo ? data : p)));
        mostrarToast(`Producto ${data.codigo} actualizado correctamente.`, 'success');
      } else {
        setProductos((prev) => [...prev, data]);
        mostrarToast(`Producto ${data.marca} ${data.modelo} creado en catálogo.`, 'success');
      }

      setShowModal(false);
    } catch (error) {
      console.error('Error conectando con ms-catalogo:', error);
      mostrarToast('No se pudo conectar con ms-catalogo en el puerto 8082.', 'error');
    } finally {
      setGuardando(false);
    }
  };

  const confirmarEliminacion = async () => {
    if (!productoAEliminar) return;

    try {
      const respuesta = await fetch(`${API_PRODUCTOS}/${productoAEliminar.codigo}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!respuesta.ok) {
        mostrarToast('No se pudo eliminar el producto (verifica tu sesión JWT).', 'error');
        return;
      }

      setProductos((prev) => prev.filter((p) => p.codigo !== productoAEliminar.codigo));
      mostrarToast(
        `${productoAEliminar.marca} ${productoAEliminar.modelo} eliminado del catálogo.`,
        'info',
      );
      setProductoAEliminar(null);
    } catch (error) {
      console.error('Error eliminando producto:', error);
      mostrarToast('Error de conexión con ms-catalogo.', 'error');
    }
  };

  const cambiarRolUsuario = async (user: UsuarioRegistrado) => {
    const nuevoRol = user.rol === 'admin' ? 'cliente' : 'admin';

    try {
      const respuesta = await fetch(`${API_USUARIOS}/${user.id}/rol?rol=${nuevoRol}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
      });

      if (!respuesta.ok) {
        mostrarToast('No se pudo actualizar el rol del usuario.', 'error');
        return;
      }

      const actualizado: UsuarioRegistrado = await respuesta.json();
      setUsuarios((prev) => prev.map((u) => (u.id === actualizado.id ? actualizado : u)));
      mostrarToast(`Rol de ${actualizado.nombre} cambiado a ${actualizado.rol}.`, 'success');
    } catch (error) {
      console.error('Error cambiando rol:', error);
      mostrarToast('Error de conexión con ms-usuarios.', 'error');
    }
  };

  const confirmarEliminarUsuario = async () => {
    if (!usuarioAEliminar) return;

    try {
      const respuesta = await fetch(`${API_USUARIOS}/${usuarioAEliminar.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!respuesta.ok) {
        mostrarToast('No se pudo eliminar la cuenta del usuario.', 'error');
        return;
      }

      setUsuarios((prev) => prev.filter((u) => u.id !== usuarioAEliminar.id));
      mostrarToast(`Cuenta de ${usuarioAEliminar.nombre} eliminada.`, 'info');
      setUsuarioAEliminar(null);
    } catch (error) {
      console.error('Error eliminando usuario:', error);
      mostrarToast('Error de conexión con ms-usuarios.', 'error');
    }
  };

  const abrirModalResponder = (ticket: TicketContacto) => {
    setTicketAResponder(ticket);
    setTextoRespuesta(ticket.respuestaAdmin || '');
    setErrorRespuesta('');
  };

  const resolverConsulta = async (nuevoEstado: 'APROBADA' | 'DESAPROBADA') => {
    if (!ticketAResponder) return;

    if (textoRespuesta.trim().length < 5) {
      setErrorRespuesta(
        nuevoEstado === 'APROBADA'
          ? 'Escribe un comentario de confirmación (mínimo 5 caracteres).'
          : 'Indica el motivo por el cual se desaprueba la consulta (mínimo 5 caracteres).',
      );
      return;
    }

    setEnviandoRespuesta(true);
    try {
      const res = await fetch(`${API_CONTACTOS}/${ticketAResponder.id}/estado`, {
        method: 'PATCH',
        headers: getAuthHeaders(true),
        body: JSON.stringify({
          estado: nuevoEstado,
          respuesta: textoRespuesta.trim(),
        }),
      });

      if (!res.ok) {
        mostrarToast('No se pudo actualizar el estado de la consulta.', 'error');
        return;
      }

      const data: TicketContacto = await res.json();
      setTickets((prev) => prev.map((t) => (t.id === data.id ? data : t)));
      mostrarToast(
        nuevoEstado === 'APROBADA'
          ? `Consulta #${data.ticket} APROBADA correctamente.`
          : `Consulta #${data.ticket} DESAPROBADA.`,
        nuevoEstado === 'APROBADA' ? 'success' : 'warning',
      );
      setTicketAResponder(null);
      setTextoRespuesta('');
    } catch (error) {
      console.error('Error actualizando ticket:', error);
      mostrarToast('Error de conexión con ms-contacto.', 'error');
    } finally {
      setEnviandoRespuesta(false);
    }
  };

  const confirmarEliminarResena = async () => {
    if (!resenaAEliminar) return;

    try {
      const res = await fetch(`${API_RESENAS}/${resenaAEliminar.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (!res.ok) {
        mostrarToast('No se pudo eliminar la reseña.', 'error');
        return;
      }

      setResenas((prev) => prev.filter((r) => r.id !== resenaAEliminar.id));
      mostrarToast('Reseña eliminada correctamente.', 'info');
      setResenaAEliminar(null);
    } catch (error) {
      console.error('Error eliminando reseña:', error);
      mostrarToast('Error de conexión con ms-resenas.', 'error');
    }
  };

  const renderBadgeEstadoTicket = (estado: TicketContacto['estado']) => {
    switch (estado) {
      case 'APROBADA':
        return <span className="badge bg-success">APROBADA</span>;
      case 'DESAPROBADA':
        return <span className="badge bg-danger">DESAPROBADA</span>;
      case 'RESPONDIDA':
        return <span className="badge bg-info text-dark">RESPONDIDA</span>;
      default:
        return <span className="badge bg-warning text-dark">PENDIENTE</span>;
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '3rem' }}>
      <header className="py-3 mb-4 header-fijo">
        <div className="container d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div>
            <h1 className="h4 text-white fw-bold mb-0">
              <i className="bi bi-soundwave me-2"></i>SONIDO VIVO
            </h1>
            <small className="text-white-50">
              Panel de Administración {usuarioActual ? `• ${usuarioActual.nombre}` : ''}
            </small>
          </div>
          <div className="d-flex gap-2">
            <Link to="/tienda" className="btn btn-outline-minimal">
              <i className="bi bi-shop me-1"></i> Ir a la Tienda
            </Link>
            <button className="btn btn-outline-danger" onClick={cerrarSesion}>
              <i className="bi bi-box-arrow-right me-1"></i> Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="container">
        <ul className="nav nav-pills mb-4 gap-2">
          <li className="nav-item">
            <button
              className={`nav-link fw-semibold ${
                tabActiva === 'catalogo' ? 'btn-minimal text-white' : 'bg-white text-dark border'
              }`}
              onClick={() => setTabActiva('catalogo')}
            >
              <i className="bi bi-box-seam me-2"></i>Catálogo e Inventario ({total})
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link fw-semibold ${
                tabActiva === 'usuarios' ? 'btn-minimal text-white' : 'bg-white text-dark border'
              }`}
              onClick={() => setTabActiva('usuarios')}
            >
              <i className="bi bi-people me-2"></i>Usuarios Registrados
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link fw-semibold ${
                tabActiva === 'tickets' ? 'btn-minimal text-white' : 'bg-white text-dark border'
              }`}
              onClick={() => setTabActiva('tickets')}
            >
              <i className="bi bi-chat-left-text me-2"></i>Consultas y Soporte
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link fw-semibold ${
                tabActiva === 'resenas' ? 'btn-minimal text-white' : 'bg-white text-dark border'
              }`}
              onClick={() => setTabActiva('resenas')}
            >
              <i className="bi bi-star me-2"></i>Reseñas
            </button>
          </li>
        </ul>

        {tabActiva === 'catalogo' && (
          <>
            <section className="row g-3 mb-4">
              <div className="col-6 col-md-3">
                <div className="card card-minimal p-3 text-center h-100">
                  <span className="text-secondary small">Total productos</span>
                  <span className="h3 fw-bold mb-0">{total}</span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="card card-minimal p-3 text-center h-100">
                  <span className="text-secondary small">Unidades en stock</span>
                  <span className="h3 fw-bold mb-0">{stockTotal}</span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="card card-minimal p-3 text-center h-100">
                  <span className="text-secondary small">Categorías</span>
                  <span className="h3 fw-bold mb-0">{categoriasCount}</span>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div className="card card-minimal p-3 text-center h-100">
                  <span className="text-secondary small">Valor inventario</span>
                  <span className="h5 fw-bold mb-0">
                    ${valorInventario.toLocaleString('es-CL')}
                  </span>
                </div>
              </div>
            </section>

            <section className="row g-3 mb-4 align-items-center">
              <div className="col-md-7">
                <div className="input-group input-group-lg">
                  <span className="input-group-text">
                    <i className="bi bi-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Buscar por modelo, marca o código..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                  />
                </div>
              </div>
              <div className="col-md-3">
                <select
                  className="form-select form-select-lg"
                  value={filtroCategoria}
                  onChange={(e) => setFiltroCategoria(e.target.value)}
                >
                  <option value="">Todas las categorías</option>
                  <option value="Guitarras Acústicas">Guitarras Acústicas</option>
                  <option value="Guitarras Eléctricas">Guitarras Eléctricas</option>
                  <option value="Bajos Eléctricos">Bajos Eléctricos</option>
                  <option value="Baterías">Baterías</option>
                  <option value="Teclados y Pianos">Teclados y Pianos</option>
                  <option value="Amplificadores">Amplificadores</option>
                  <option value="Micrófonos">Micrófonos</option>
                  <option value="Pedales de Efectos">Pedales de Efectos</option>
                  <option value="Accesorios">Accesorios</option>
                </select>
              </div>
              <div className="col-md-2 d-grid">
                <button className="btn btn-minimal btn-lg" onClick={abrirModalNuevo}>
                  <i className="bi bi-plus-lg me-1"></i> Nuevo
                </button>
              </div>
            </section>

            <section className="card card-minimal p-3 mb-5">
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Código</th>
                      <th>Marca</th>
                      <th>Categoría</th>
                      <th className="text-end">Stock</th>
                      <th className="text-end">Precio</th>
                      <th className="text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center text-secondary py-4">
                          No se encontraron productos.
                        </td>
                      </tr>
                    ) : (
                      productosFiltrados.map((p) => (
                        <tr key={p.codigo}>
                          <td>
                            <div className="d-flex align-items-center gap-2">
                              <img
                                src={p.imagen || IMAGEN_RESPALDO}
                                alt={p.modelo}
                                style={{ width: '40px', height: '40px', objectFit: 'contain' }}
                                onError={(e) => {
                                  e.currentTarget.onerror = null;
                                  e.currentTarget.src = IMAGEN_RESPALDO;
                                }}
                              />
                              <span className="fw-medium">{p.modelo}</span>
                            </div>
                          </td>
                          <td className="fw-semibold">{p.codigo}</td>
                          <td>{p.marca}</td>
                          <td>{p.categoria}</td>
                          <td className="text-end">
                            {p.stock === 0 ? (
                              <span className="badge bg-danger">Sin stock</span>
                            ) : (
                              <span className="badge badge-minimal">{p.stock}</span>
                            )}
                          </td>
                          <td className="text-end">${p.precio.toLocaleString('es-CL')}</td>
                          <td className="text-center">
                            <button
                              className="btn btn-sm btn-outline-minimal me-1"
                              title="Editar"
                              onClick={() => abrirModalEditar(p)}
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              title="Eliminar"
                              onClick={() => setProductoAEliminar(p)}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          </>
        )}

        {tabActiva === 'usuarios' && (
          <section className="card card-minimal p-4">
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
              <div>
                <h5 className="fw-bold mb-1">Cuentas Registradas en MySQL</h5>
                <small className="text-muted">
                  Administra permisos de acceso o elimina cuentas registradas.
                </small>
              </div>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar usuario o correo..."
                  value={busquedaUsuario}
                  onChange={(e) => setBusquedaUsuario(e.target.value)}
                />
                <button
                  className="btn btn-outline-minimal"
                  onClick={cargarUsuarios}
                  title="Recargar lista"
                >
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
              </div>
            </div>

            {cargandoUsuarios ? (
              <div className="text-center py-5 text-muted">
                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                Cargando usuarios desde ms-usuarios...
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Usuario</th>
                      <th>Correo Electrónico</th>
                      <th>Rol Actual</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usuariosFiltrados.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-secondary py-4">
                          No hay usuarios para mostrar.
                        </td>
                      </tr>
                    ) : (
                      usuariosFiltrados.map((u) => {
                        const esUsuarioActual = u.nombre === usuarioActual?.nombre;
                        return (
                          <tr key={u.id}>
                            <td className="text-muted">#{u.id}</td>
                            <td className="fw-bold">
                              {u.nombre}{' '}
                              {esUsuarioActual && (
                                <span className="badge bg-secondary ms-1">Tú</span>
                              )}
                            </td>
                            <td>{u.email}</td>
                            <td>
                              {u.rol === 'admin' ? (
                                <span className="badge bg-dark">ADMIN</span>
                              ) : (
                                <span className="badge badge-minimal">CLIENTE</span>
                              )}
                            </td>
                            <td className="text-end">
                              <div className="d-inline-flex gap-2">
                                <button
                                  className="btn btn-sm btn-outline-minimal"
                                  disabled={esUsuarioActual}
                                  onClick={() => cambiarRolUsuario(u)}
                                >
                                  <i className="bi bi-arrow-left-right me-1"></i>
                                  Cambiar a {u.rol === 'admin' ? 'Cliente' : 'Admin'}
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  disabled={esUsuarioActual}
                                  title="Eliminar cuenta"
                                  onClick={() => setUsuarioAEliminar(u)}
                                >
                                  <i className="bi bi-trash me-1"></i>Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {tabActiva === 'tickets' && (
          <section className="card card-minimal p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="fw-bold mb-1">Consultas y Reservas de Sala (ms-contacto)</h5>
                <small className="text-muted">
                  Aprueba, desaprueba y responde las consultas enviadas por los usuarios.
                </small>
              </div>
              <button className="btn btn-outline-minimal btn-sm" onClick={cargarTickets}>
                <i className="bi bi-arrow-clockwise me-1"></i>Actualizar
              </button>
            </div>

            {cargandoTickets ? (
              <div className="text-center py-4 text-muted">
                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                Cargando tickets...
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-4 text-muted">No hay consultas registradas aún.</div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Ticket</th>
                      <th>Cliente</th>
                      <th>Motivo</th>
                      <th>Consulta y Respuesta</th>
                      <th>Estado</th>
                      <th className="text-end">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((t) => (
                      <tr key={t.id}>
                        <td className="fw-bold">{t.ticket}</td>
                        <td>
                          <strong className="d-block">{t.nombre}</strong>
                          <small className="text-muted">{t.email}</small>
                        </td>
                        <td>
                          <span className="badge badge-minimal d-block mb-1">{t.tipoConsulta}</span>
                          {t.instrumentoInteres && (
                            <small className="text-dark d-block">{t.instrumentoInteres}</small>
                          )}
                          {t.fechaPrueba && (
                            <small className="text-primary d-block">Fecha: {t.fechaPrueba}</small>
                          )}
                        </td>
                        <td style={{ maxWidth: '320px' }}>
                          <small className="text-secondary d-block mb-1">
                            <strong>Consulta:</strong> {t.mensaje}
                          </small>
                          {t.respuestaAdmin && (
                            <small
                              className={`d-block bg-light p-2 rounded border ${
                                t.estado === 'DESAPROBADA' ? 'text-danger' : 'text-success'
                              }`}
                            >
                              <strong>Respuesta Admin:</strong> {t.respuestaAdmin}
                            </small>
                          )}
                        </td>
                        <td>{renderBadgeEstadoTicket(t.estado)}</td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-minimal"
                            onClick={() => abrirModalResponder(t)}
                          >
                            <i className="bi bi-check2-square me-1"></i>
                            {t.estado === 'PENDIENTE' ? 'Revisar / Resolver' : 'Editar Resolución'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}

        {tabActiva === 'resenas' && (
          <section className="card card-minimal p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h5 className="fw-bold mb-1">Moderación de Reseñas (ms-resenas)</h5>
                <small className="text-muted">
                  Revisa los comentarios de los clientes y elimina los que no correspondan.
                </small>
              </div>
              <button className="btn btn-outline-minimal btn-sm" onClick={cargarResenas}>
                <i className="bi bi-arrow-clockwise me-1"></i>Actualizar
              </button>
            </div>

            {cargandoResenas ? (
              <div className="text-center py-4 text-muted">
                <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                Cargando reseñas...
              </div>
            ) : resenas.length === 0 ? (
              <div className="text-center py-4 text-muted">No hay reseñas registradas aún.</div>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle mb-0">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Autor</th>
                      <th>Calificación</th>
                      <th>Comentario</th>
                      <th className="text-end">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resenas.map((r) => (
                      <tr key={r.id}>
                        <td className="fw-bold">{r.codigoProducto}</td>
                        <td>{r.autorNombre}</td>
                        <td className="text-warning">
                          {'★'.repeat(r.puntuacion)}
                          {'☆'.repeat(5 - r.puntuacion)}{' '}
                          <span className="text-muted small">({r.puntuacion}/5)</span>
                        </td>
                        <td style={{ maxWidth: '340px' }}>
                          <small className="text-secondary">{r.comentario}</small>
                        </td>
                        <td className="text-end">
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setResenaAEliminar(r)}
                          >
                            <i className="bi bi-trash me-1"></i>Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        )}
      </main>

      {/* Modal Aprobar / Desaprobar Consulta al Usuario */}
      {ticketAResponder && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1055 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  Gestionar Consulta #{ticketAResponder.ticket}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setTicketAResponder(null)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="bg-light p-3 rounded border mb-3 small">
                  <div className="mb-1">
                    <strong>Cliente:</strong> {ticketAResponder.nombre} ({ticketAResponder.email})
                  </div>
                  <div className="mb-1">
                    <strong>Tipo:</strong> {ticketAResponder.tipoConsulta}
                  </div>
                  <div>
                    <strong>Consulta:</strong> {ticketAResponder.mensaje}
                  </div>
                </div>

                <label className="form-label small fw-bold">
                  Respuesta o motivo de resolución para el usuario
                </label>
                <textarea
                  className={`form-control ${errorRespuesta ? 'is-invalid' : ''}`}
                  rows={4}
                  placeholder="Escribe aquí la confirmación o el motivo de rechazo..."
                  value={textoRespuesta}
                  onChange={(e) => {
                    setTextoRespuesta(e.target.value);
                    setErrorRespuesta('');
                  }}
                ></textarea>
                {errorRespuesta && (
                  <div className="invalid-feedback d-block">{errorRespuesta}</div>
                )}
              </div>
              <div className="modal-footer justify-content-between">
                <button
                  type="button"
                  className="btn btn-outline-minimal"
                  onClick={() => setTicketAResponder(null)}
                  disabled={enviandoRespuesta}
                >
                  Cancelar
                </button>
                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-danger"
                    disabled={enviandoRespuesta}
                    onClick={() => resolverConsulta('DESAPROBADA')}
                  >
                    <i className="bi bi-x-circle me-1"></i>Desaprobar
                  </button>
                  <button
                    type="button"
                    className="btn btn-success"
                    disabled={enviandoRespuesta}
                    onClick={() => resolverConsulta('APROBADA')}
                  >
                    <i className="bi bi-check-circle me-1"></i>Aprobar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación de Usuario */}
      {usuarioAEliminar && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold text-danger">
                  <i className="bi bi-person-x-fill me-2"></i>Eliminar Cuenta de Usuario
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setUsuarioAEliminar(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-1">
                  ¿Estás seguro de que deseas eliminar permanentemente la cuenta de{' '}
                  <strong>{usuarioAEliminar.nombre}</strong> ({usuarioAEliminar.email})?
                </p>
                <small className="text-muted">
                  Esta acción eliminará el usuario de la base de datos en MySQL y no se puede deshacer.
                </small>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-outline-minimal"
                  onClick={() => setUsuarioAEliminar(null)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmarEliminarUsuario}
                >
                  Sí, eliminar cuenta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Crear / Editar Producto */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  {isEditing ? 'Editar Producto' : 'Nuevo Producto'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={guardarProducto} noValidate>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Código</label>
                      <input
                        type="text"
                        name="codigo"
                        className="form-control"
                        value={formData.codigo}
                        onChange={handleInputChange}
                        disabled={isEditing}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Categoría</label>
                      <select
                        name="categoria"
                        className="form-select"
                        value={formData.categoria}
                        onChange={handleInputChange}
                      >
                        <option value="">Selecciona una categoría</option>
                        <option value="Guitarras Acústicas">Guitarras Acústicas</option>
                        <option value="Guitarras Eléctricas">Guitarras Eléctricas</option>
                        <option value="Bajos Eléctricos">Bajos Eléctricos</option>
                        <option value="Baterías">Baterías</option>
                        <option value="Teclados y Pianos">Teclados y Pianos</option>
                        <option value="Amplificadores">Amplificadores</option>
                        <option value="Micrófonos">Micrófonos</option>
                        <option value="Pedales de Efectos">Pedales de Efectos</option>
                        <option value="Accesorios">Accesorios</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Modelo</label>
                      <input
                        type="text"
                        name="modelo"
                        className="form-control"
                        value={formData.modelo}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Marca</label>
                      <input
                        type="text"
                        name="marca"
                        className="form-control"
                        value={formData.marca}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Stock</label>
                      <input
                        type="number"
                        name="stock"
                        className="form-control"
                        value={formData.stock}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label">Precio (CLP)</label>
                      <input
                        type="number"
                        name="precio"
                        className="form-control"
                        value={formData.precio}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Ruta de imagen</label>
                      <input
                        type="text"
                        name="imagen"
                        className="form-control"
                        value={formData.imagen}
                        onChange={handleInputChange}
                        placeholder="/imagenes/producto.jpg"
                      />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Descripción</label>
                      <textarea
                        name="descripcion"
                        className="form-control"
                        rows={3}
                        value={formData.descripcion}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-minimal"
                    onClick={() => setShowModal(false)}
                    disabled={guardando}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-minimal" disabled={guardando}>
                    {guardando ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación de Producto */}
      {productoAEliminar && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold text-danger">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>Eliminar Producto
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setProductoAEliminar(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-1">
                  ¿Estás seguro de que deseas eliminar permanentemente{' '}
                  <strong>
                    {productoAEliminar.marca} {productoAEliminar.modelo}
                  </strong>{' '}
                  ({productoAEliminar.codigo})?
                </p>
                <small className="text-muted">
                  Esta acción eliminará el registro de la base de datos en MySQL.
                </small>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-outline-minimal"
                  onClick={() => setProductoAEliminar(null)}
                >
                  Cancelar
                </button>
                <button type="button" className="btn btn-danger" onClick={confirmarEliminacion}>
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Confirmar Eliminación de Reseña */}
      {resenaAEliminar && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold text-danger">
                  <i className="bi bi-trash me-2"></i>Eliminar Reseña
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setResenaAEliminar(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-1">
                  ¿Deseas eliminar la reseña de <strong>{resenaAEliminar.autorNombre}</strong> para{' '}
                  <strong>{resenaAEliminar.codigoProducto}</strong>?
                </p>
                <small className="text-muted">"{resenaAEliminar.comentario}"</small>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-outline-minimal"
                  onClick={() => setResenaAEliminar(null)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={confirmarEliminarResena}
                >
                  Sí, eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}