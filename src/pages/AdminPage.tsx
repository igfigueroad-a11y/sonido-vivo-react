import { useState, useEffect, FormEvent, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { TiendaContext } from '../context/TiendaContext';
import type { producto } from '../types';

export default function AdminPage() {
  const navigate = useNavigate();
  
  const { productos, setProductos } = useContext(TiendaContext);
  
  const [busqueda, setBusqueda] = useState('');
  const [filtroCategoria, setFiltroCategoria] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<producto>({
    codigo: '', categoria: '', modelo: '', marca: '', stock: 0, precio: 0, descripcion: '', imagen: ''
  });

  useEffect(() => {
    if (localStorage.getItem("rolUsuario") !== "admin") {
      navigate('/login');
    }
  }, [navigate]);

  const cerrarSesion = () => {
    localStorage.removeItem("usuarioAutenticado");
    localStorage.removeItem("rolUsuario");
    navigate('/login');
  };

  const productosFiltrados = productos.filter(p => {
    const coincideTexto = 
      p.modelo.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = filtroCategoria === "" || p.categoria === filtroCategoria;
    return coincideTexto && coincideCategoria;
  });

  const total = productos.length;
  const stockTotal = productos.reduce((acc, p) => acc + p.stock, 0);
  const categoriasCount = new Set(productos.map(p => p.categoria)).size;
  const valorInventario = productos.reduce((acc, p) => acc + (p.precio * p.stock), 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: (name === 'stock' || name === 'precio') ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const abrirModalNuevo = () => {
    setIsEditing(false);
    setFormData({ codigo: '', categoria: '', modelo: '', marca: '', stock: 0, precio: 0, descripcion: '', imagen: '' });
    setShowModal(true);
  };

  const abrirModalEditar = (prod: producto) => {
    setIsEditing(true);
    setFormData(prod);
    setShowModal(true);
  };

  const guardarProducto = (e: FormEvent) => {
    e.preventDefault();
    
    // 1. VALIDACIÓN MANUAL DE CAMPOS VACÍOS
    if (
      String(formData.codigo).trim() === '' || 
      String(formData.categoria).trim() === '' || 
      String(formData.modelo).trim() === '' || 
      String(formData.marca).trim() === '' || 
      String(formData.descripcion).trim() === '' || 
      String(formData.stock).trim() === '' || 
      String(formData.precio).trim() === ''
    ) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    // 2. VALIDACIÓN DE NÚMEROS NEGATIVOS
    if (Number(formData.stock) < 0 || Number(formData.precio) < 0) {
      alert("El stock y el precio no pueden ser negativos.");
      return;
    }

    if (isEditing) {
      setProductos(prev => prev.map(p => p.codigo === formData.codigo ? formData : p));
    } else {
      if (productos.some(p => p.codigo === formData.codigo)) {
        alert("Ya existe un producto con ese código.");
        return;
      }
      setProductos(prev => [...prev, formData]);
    }
    setShowModal(false);
  };

  const eliminarProducto = (codigo: string, marca: string, modelo: string) => {
    if (window.confirm(`¿Seguro que deseas eliminar "${marca} ${modelo}" (${codigo})?`)) {
      setProductos(prev => prev.filter(p => p.codigo !== codigo));
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-main)', minHeight: '100vh', paddingBottom: '2rem' }}>
      <header className="py-3 mb-4 bg-white border-bottom">
        <div className="container d-flex justify-content-between align-items-center">
          <div>
            <h1 className="h4 text-dark fw-bold mb-0">SONIDO VIVO</h1>
            <small className="text-secondary">Panel de Administración</small>
          </div>
          <button className="btn btn-outline-minimal" onClick={cerrarSesion}>
            <i className="bi bi-box-arrow-right me-1"></i> Cerrar sesión
          </button>
        </div>
      </header>

      <main className="container">
        <section className="row g-3 mb-4">
          <div className="col-6 col-md-3">
            <div className="card card-minimal p-3 text-center h-100">
              <span className="text-secondary small">Total productos</span>
              <span className="h3 fw-bold mb-0">{total}</span>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div className="card card-minimal p-3 text-center h-100">
              <span className="text-secondary small">Stock</span>
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
              <span className="h5 fw-bold mb-0">${valorInventario.toLocaleString("es-CL")}</span>
            </div>
          </div>
        </section>

        <section className="row g-3 mb-4 align-items-center">
          <div className="col-md-7">
            <input 
              type="text" 
              className="form-control form-control-lg" 
              placeholder="Buscar por modelo, marca o código..." 
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
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
                  <th>Código</th>
                  <th>Modelo</th>
                  <th>Marca</th>
                  <th>Categoría</th>
                  <th className="text-end">Stock</th>
                  <th className="text-end">Precio</th>
                  <th className="text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.length === 0 ? (
                  <tr><td colSpan={7} className="text-center text-secondary py-4">No se encontraron productos.</td></tr>
                ) : (
                  productosFiltrados.map(p => (
                    <tr key={p.codigo}>
                      <td className="fw-semibold">{p.codigo}</td>
                      <td>{p.modelo}</td>
                      <td>{p.marca}</td>
                      <td>{p.categoria}</td>
                      <td className="text-end">
                        {p.stock === 0 ? <span className="badge bg-danger">Sin stock</span> : <span className="badge badge-minimal">{p.stock}</span>}
                      </td>
                      <td className="text-end">${p.precio.toLocaleString("es-CL")}</td>
                      <td className="text-center">
                        <button className="btn btn-sm btn-outline-minimal me-1" onClick={() => abrirModalEditar(p)}>
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button className="btn btn-sm btn-outline-minimal" onClick={() => eliminarProducto(p.codigo, p.marca, p.modelo)}>
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
      </main>

      {showModal && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">{isEditing ? 'Editar Producto' : 'Nuevo Producto'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={guardarProducto} noValidate>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Código</label>
                      <input type="text" name="codigo" className="form-control" value={formData.codigo} onChange={handleInputChange} disabled={isEditing} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Categoría</label>
                      <select name="categoria" className="form-select" value={formData.categoria} onChange={handleInputChange}>
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
                      <input type="text" name="modelo" className="form-control" value={formData.modelo} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Marca</label>
                      <input type="text" name="marca" className="form-control" value={formData.marca} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Stock</label>
                      <input type="number" name="stock" className="form-control" value={formData.stock} onChange={handleInputChange} />
                    </div>
                    <div className="col-md-8">
                      <label className="form-label">Precio (CLP)</label>
                      <input type="number" name="precio" className="form-control" value={formData.precio} onChange={handleInputChange} />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Ruta de imagen</label>
                      <input type="text" name="imagen" className="form-control" value={formData.imagen} onChange={handleInputChange} placeholder="imagenes/producto.jpg" />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Descripción</label>
                      <textarea name="descripcion" className="form-control" rows={3} value={formData.descripcion} onChange={handleInputChange}></textarea>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-outline-minimal" onClick={() => setShowModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-minimal">Guardar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}