import {
  createContext,
  useState,
  useEffect,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react';

import { productosIniciales } from '../data/productosDb';
import type { producto, ItemCarrito } from '../types';

export interface UsuarioSesion {
  id?: number;
  nombre: string;
  email?: string;
  rol: 'admin' | 'cliente';
  token?: string;
}

export type TipoToast = 'success' | 'error' | 'warning' | 'info';

interface ToastMensaje {
  id: number;
  texto: string;
  tipo: TipoToast;
}

interface TiendaContextType {
  productos: producto[];
  setProductos: Dispatch<SetStateAction<producto[]>>;
  cargandoCatalogo: boolean;
  recargarProductos: () => Promise<void>;
  usuarioActual: UsuarioSesion | null;
  token: string | null;
  login: (datosUsuario: UsuarioSesion) => void;
  logout: () => void;
  carrito: ItemCarrito[];
  agregarAlCarrito: (prod: producto) => void;
  cambiarCantidadCarrito: (codigo: string, cambio: number) => void;
  vaciarCarrito: (restaurarStock?: boolean) => void;
  mostrarToast: (texto: string, tipo?: TipoToast) => void;
}

export const TiendaContext = createContext<TiendaContextType>(
  {} as TiendaContextType,
);

export function TiendaProvider({ children }: { children: ReactNode }) {
  const [productos, setProductos] = useState<producto[]>(productosIniciales);
  const [cargandoCatalogo, setCargandoCatalogo] = useState<boolean>(true);
  const [toasts, setToasts] = useState<ToastMensaje[]>([]);

  const [carrito, setCarrito] = useState<ItemCarrito[]>(() => {
    try {
      const guardado = localStorage.getItem('sonidovivo_carrito');
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('sonidovivo_carrito', JSON.stringify(carrito));
  }, [carrito]);

  const mostrarToast = (texto: string, tipo: TipoToast = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, texto, tipo }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const recargarProductos = async () => {
    setCargandoCatalogo(true);
    try {
      const res = await fetch('http://localhost:8082/api/productos');
      if (res.ok) {
        const data: producto[] = await res.json();
        const carritoLocal: ItemCarrito[] = JSON.parse(
          localStorage.getItem('sonidovivo_carrito') || '[]',
        );
        const sincronizados = data.map((prod) => {
          const enCarrito = carritoLocal.find((i) => i.codigo === prod.codigo);
          return enCarrito
            ? { ...prod, stock: Math.max(0, prod.stock - enCarrito.cantidad) }
            : prod;
        });
        setProductos(sincronizados);
      }
    } catch (error) {
      console.error('Error cargando catálogo desde ms-catalogo:', error);
    } finally {
      setCargandoCatalogo(false);
    }
  };

  useEffect(() => {
    recargarProductos();
  }, []);

  const [usuarioActual, setUsuarioActual] =
    useState<UsuarioSesion | null>(() => {
      const nombre = localStorage.getItem('usuarioAutenticado');
      const rol = localStorage.getItem('rolUsuario');
      const tokenGuardado = localStorage.getItem('tokenJWT') || undefined;
      const emailGuardado = localStorage.getItem('emailUsuario') || undefined;

      if (!nombre || (rol !== 'admin' && rol !== 'cliente')) {
        return null;
      }

      return { nombre, rol, token: tokenGuardado, email: emailGuardado };
    });

  const login = (datosUsuario: UsuarioSesion) => {
    localStorage.setItem('usuarioAutenticado', datosUsuario.nombre);
    localStorage.setItem('rolUsuario', datosUsuario.rol);
    if (datosUsuario.email) {
      localStorage.setItem('emailUsuario', datosUsuario.email);
    }
    if (datosUsuario.token) {
      localStorage.setItem('tokenJWT', datosUsuario.token);
    }
    setUsuarioActual(datosUsuario);
  };

  const logout = () => {
    localStorage.removeItem('usuarioAutenticado');
    localStorage.removeItem('rolUsuario');
    localStorage.removeItem('emailUsuario');
    localStorage.removeItem('tokenJWT');
    setUsuarioActual(null);
    mostrarToast('Sesión cerrada correctamente.', 'info');
  };

  const agregarAlCarrito = (prod: producto) => {
    if (usuarioActual?.rol === 'admin') {
      mostrarToast(
        'No puedes comprar con una cuenta de administrador. Crea una cuenta personal de cliente para realizar compras.',
        'warning',
      );
      return;
    }

    if (prod.stock <= 0) {
      mostrarToast('Producto sin stock disponible.', 'warning');
      return;
    }

    setProductos((prev) =>
      prev.map((p) => (p.codigo === prod.codigo ? { ...p, stock: p.stock - 1 } : p)),
    );

    setCarrito((prev) => {
      const existe = prev.find((item) => item.codigo === prod.codigo);
      if (existe) {
        return prev.map((item) =>
          item.codigo === prod.codigo ? { ...item, cantidad: item.cantidad + 1 } : item,
        );
      }
      return [...prev, { ...prod, cantidad: 1 }];
    });

    mostrarToast(`${prod.marca} ${prod.modelo} agregado al carrito.`, 'success');
  };

  const cambiarCantidadCarrito = (codigo: string, cambio: number) => {
    const productoBase = productos.find((p) => p.codigo === codigo);
    const itemCarrito = carrito.find((i) => i.codigo === codigo);

    if (!productoBase || !itemCarrito) return;

    if (cambio > 0 && productoBase.stock <= 0) {
      mostrarToast('Has alcanzado el stock máximo disponible.', 'warning');
      return;
    }

    setProductos((prev) =>
      prev.map((p) => (p.codigo === codigo ? { ...p, stock: p.stock - cambio } : p)),
    );

    setCarrito((prev) =>
      prev
        .map((item) =>
          item.codigo === codigo ? { ...item, cantidad: item.cantidad + cambio } : item,
        )
        .filter((item) => item.cantidad > 0),
    );
  };

  const vaciarCarrito = (restaurarStock = false) => {
    if (restaurarStock && carrito.length > 0) {
      setProductos((prev) =>
        prev.map((prod) => {
          const item = carrito.find((i) => i.codigo === prod.codigo);
          return item ? { ...prod, stock: prod.stock + item.cantidad } : prod;
        }),
      );
    }
    setCarrito([]);
    localStorage.removeItem('sonidovivo_carrito');
  };

  const obtenerEstiloToast = (tipo: TipoToast) => {
    switch (tipo) {
      case 'success':
        return { bg: 'bg-dark text-white border-start border-4 border-success', icono: 'bi-check-circle-fill text-success' };
      case 'error':
        return { bg: 'bg-danger text-white', icono: 'bi-x-circle-fill text-white' };
      case 'warning':
        return { bg: 'bg-dark text-white border-start border-4 border-warning', icono: 'bi-exclamation-triangle-fill text-warning' };
      default:
        return { bg: 'bg-dark text-white border-start border-4 border-info', icono: 'bi-info-circle-fill text-info' };
    }
  };

  return (
    <TiendaContext.Provider
      value={{
        productos,
        setProductos,
        cargandoCatalogo,
        recargarProductos,
        usuarioActual,
        token: usuarioActual?.token || localStorage.getItem('tokenJWT'),
        login,
        logout,
        carrito,
        agregarAlCarrito,
        cambiarCantidadCarrito,
        vaciarCarrito,
        mostrarToast,
      }}
    >
      {children}

      {/* Contenedor Global de Notificaciones Toast */}
      <div
        className="position-fixed bottom-0 end-0 p-3 d-flex flex-column gap-2"
        style={{ zIndex: 1090 }}
      >
        {toasts.map((t) => {
          const estilo = obtenerEstiloToast(t.tipo);
          return (
            <div
              key={t.id}
              className={`toast-flotante-item p-3 d-flex align-items-center justify-content-between gap-3 ${estilo.bg}`}
              role="alert"
            >
              <div className="d-flex align-items-center gap-2 small fw-medium">
                <i className={`bi ${estilo.icono} fs-5`}></i>
                <span>{t.texto}</span>
              </div>
              <button
                type="button"
                className="btn-close btn-close-white btn-sm"
                aria-label="Cerrar"
                onClick={() => setToasts((prev) => prev.filter((item) => item.id !== t.id))}
              ></button>
            </div>
          );
        })}
      </div>
    </TiendaContext.Provider>
  );
}