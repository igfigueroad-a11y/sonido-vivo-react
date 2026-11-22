import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TiendaProvider } from './context/TiendaContext';

import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import TiendaPage from './pages/TiendaPage';
import RecursosPage from './pages/RecursosPage';
import ContactoPage from './pages/ContactoPage';
import CheckoutPage from './pages/CheckoutPage';
import MisPedidosPage from './pages/MisPedidosPage';

export default function App() {
  return (
    <TiendaProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/tienda" replace />} />
          <Route path="/tienda" element={<TiendaPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/recursos" element={<RecursosPage />} />
          <Route path="/contacto" element={<ContactoPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/mis-pedidos" element={<MisPedidosPage />} />
        </Routes>
      </BrowserRouter>
    </TiendaProvider>
  );
}