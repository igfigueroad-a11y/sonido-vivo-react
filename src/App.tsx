import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TiendaProvider } from './context/TiendaContext';

import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import TiendaPage from './pages/TiendaPage';
import RecursosPage from './pages/RecursosPage'; 
import CheckoutPage from './pages/CheckoutPage';

export default function App() {
  return (
    <TiendaProvider>
      <BrowserRouter>
        <Routes>
          {/* Redirige la ruta base directamente a la tienda pública */}
          <Route path="/" element={<Navigate to="/tienda" replace />} />
          
          {/* Rutas de la aplicación */}
          <Route path="/tienda" element={<TiendaPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/recursos" element={<RecursosPage />} /> 
          <Route path="/checkout" element={<CheckoutPage />} />
        </Routes>
      </BrowserRouter>
    </TiendaProvider>
  );
}