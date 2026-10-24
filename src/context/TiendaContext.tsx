import { createContext, useState, type ReactNode } from 'react';
import { productosIniciales } from '../data/productosDb';
import type { producto } from '../types';

interface TiendaContextType {
  productos: producto[];
  setProductos: React.Dispatch<React.SetStateAction<producto[]>>;
}

export const TiendaContext = createContext<TiendaContextType>({} as TiendaContextType);

export function TiendaProvider({ children }: { children: ReactNode }) {
  // Este estado ahora vivirá en lo más alto de la aplicación
  const [productos, setProductos] = useState<producto[]>(productosIniciales);

  return (
    <TiendaContext.Provider value={{ productos, setProductos }}>
      {children}
    </TiendaContext.Provider>
  );
}