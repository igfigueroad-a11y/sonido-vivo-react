import { useState, type FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Boton from '../Components/atoms/Boton';
// import { useTienda } from '../hooks/useTienda'; 

export default function CheckoutPage() {
  const navigate = useNavigate();
  // const { vaciarCarrito } = useTienda(); 
  
  const [datos, setDatos] = useState({ 
    nombre: '', correo: '', direccion: '', tarjeta: '', vencimiento: '', cvv: '' 
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDatos({ ...datos, [e.target.name]: e.target.value });
    setError('');
  };

  const procesarPago = (e: FormEvent) => {
    e.preventDefault();
    
    if (Object.values(datos).some(valor => valor.trim() === '')) {
      setError('Por favor, completa todos los campos para procesar el pago.');
      return;
    }
    
    alert(`¡Pago exitoso, ${datos.nombre}! Tu comprobante ha sido enviado a ${datos.correo}.`);
    // vaciarCarrito(); 
    navigate('/tienda'); 
  };

  return (
    <div className="container py-5" style={{ maxWidth: '900px' }}>
      <div className="text-center mb-5">
        <h2 className="fw-bold display-6 text-dark">Finalizar Compra</h2>
        <p className="text-muted fs-5">Estás a un paso de llevarte el mejor sonido.</p>
      </div>
      
      {error && (
        <div className="alert alert-danger shadow-sm border-0 bg-danger text-white rounded-3">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
        </div>
      )}

      <form onSubmit={procesarPago} className="row g-4" noValidate>
        {/* Datos de Envío */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100 bg-light p-4 rounded-4">
            <h5 className="fw-bold mb-4 border-bottom pb-3 text-dark">
              <i className="bi bi-box-seam me-2"></i>Datos de Envío
            </h5>
            <div className="mb-3">
              <label className="form-label text-muted small fw-bold text-uppercase">Nombre Completo</label>
              <input type="text" name="nombre" className="form-control form-control-lg border-0 shadow-sm" value={datos.nombre} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label text-muted small fw-bold text-uppercase">Correo Electrónico</label>
              <input type="email" name="correo" className="form-control form-control-lg border-0 shadow-sm" value={datos.correo} onChange={handleChange} />
            </div>
            <div className="mb-3">
              <label className="form-label text-muted small fw-bold text-uppercase">Dirección de Envío</label>
              <input type="text" name="direccion" className="form-control form-control-lg border-0 shadow-sm" placeholder="Calle, Número, Comuna" value={datos.direccion} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Datos de Pago */}
        <div className="col-md-6">
          <div className="card shadow-sm border-0 h-100 bg-white p-4 rounded-4">
            <h5 className="fw-bold mb-4 border-bottom pb-3 text-dark">
              <i className="bi bi-credit-card-2-front me-2"></i>Método de Pago
            </h5>
            <div className="mb-3">
              <label className="form-label text-muted small fw-bold text-uppercase">Número de Tarjeta</label>
              <div className="input-group input-group-lg shadow-sm">
                <span className="input-group-text bg-white border-0 text-muted"><i className="bi bi-credit-card"></i></span>
                <input type="text" name="tarjeta" className="form-control border-0" placeholder="0000 0000 0000 0000" maxLength={16} value={datos.tarjeta} onChange={handleChange} />
              </div>
            </div>
            <div className="row">
              <div className="col-6 mb-4">
                <label className="form-label text-muted small fw-bold text-uppercase">Vencimiento</label>
                <input type="text" name="vencimiento" className="form-control form-control-lg border-0 shadow-sm" placeholder="MM/YY" maxLength={5} value={datos.vencimiento} onChange={handleChange} />
              </div>
              <div className="col-6 mb-4">
                <label className="form-label text-muted small fw-bold text-uppercase">CVV</label>
                <input type="password" name="cvv" className="form-control form-control-lg border-0 shadow-sm" placeholder="123" maxLength={3} value={datos.cvv} onChange={handleChange} />
              </div>
            </div>
            
            <div className="mt-auto d-flex flex-column gap-2 pt-3 border-top">
              <Boton type="submit" variante="dark" className="w-100 py-3 fw-bold fs-5 shadow">
                Confirmar y Pagar
              </Boton>
              <Link to="/tienda" className="btn btn-light w-100 py-2 border-0 text-muted fw-semibold">
                <i className="bi bi-arrow-left me-2"></i> Volver y seguir comprando
              </Link>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}