import {
  createContext,
  useState,
  type ReactNode,
  type Dispatch,
  type SetStateAction,
} from 'react';

import { productosIniciales } from '../data/productosDb';
import type { producto } from '../types';

interface UsuarioSesion {
  nombre: string;
  rol: 'admin' | 'cliente';
}

interface TiendaContextType {
  productos: producto[];
  setProductos: Dispatch<SetStateAction<producto[]>>;
  usuarioActual: UsuarioSesion | null;
  login: (datosUsuario: UsuarioSesion) => void;
  logout: () => void;
}

export const TiendaContext = createContext<TiendaContextType>(
  {} as TiendaContextType,
);

export function TiendaProvider({ children }: { children: ReactNode }) {
  const [productos, setProductos] =
    useState<producto[]>(productosIniciales);

  const [usuarioActual, setUsuarioActual] =
    useState<UsuarioSesion | null>(() => {
      const nombre = localStorage.getItem('usuarioAutenticado');
      const rol = localStorage.getItem('rolUsuario');

      if (!nombre || (rol !== 'admin' && rol !== 'cliente')) {
        return null;
      }

      return { nombre, rol };
    });

  const login = (datosUsuario: UsuarioSesion) => {
    localStorage.setItem(
      'usuarioAutenticado',
      datosUsuario.nombre,
    );

    localStorage.setItem('rolUsuario', datosUsuario.rol);

    setUsuarioActual(datosUsuario);
  };

  const logout = () => {
    localStorage.removeItem('usuarioAutenticado');
    localStorage.removeItem('rolUsuario');

    setUsuarioActual(null);
  };

  return (
    <TiendaContext.Provider
      value={{
        productos,
        setProductos,
        usuarioActual,
        login,
        logout,
      }}
    >
      {children}
    </TiendaContext.Provider>
  );
}