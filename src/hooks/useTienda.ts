import { useState, useContext } from 'react';
import { TiendaContext } from '../context/TiendaContext';

export function useTienda() {
  const {
    productos,
    cargandoCatalogo,
    usuarioActual,
    login,
    logout,
    carrito,
    agregarAlCarrito,
    cambiarCantidadCarrito,
    vaciarCarrito,
    mostrarToast,
  } = useContext(TiendaContext);

  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');
  const [orden, setOrden] = useState('');
  const [soloDisponibles, setSoloDisponibles] = useState(false);

  const productosFiltrados = productos
    .filter((p) => {
      const coincideTexto =
        p.modelo.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
        p.descripcion.toLowerCase().includes(busqueda.toLowerCase());
      const coincideCategoria = categoria === '' || p.categoria === categoria;
      const coincideStock = !soloDisponibles || p.stock > 0;
      return coincideTexto && coincideCategoria && coincideStock;
    })
    .sort((a, b) => {
      if (orden === 'precio-asc') return a.precio - b.precio;
      if (orden === 'precio-desc') return b.precio - a.precio;
      if (orden === 'marca-asc') return a.marca.localeCompare(b.marca);
      return 0;
    });

  const limpiarFiltros = () => {
    setBusqueda('');
    setCategoria('');
    setOrden('');
    setSoloDisponibles(false);
  };

  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return {
    busqueda,
    setBusqueda,
    categoria,
    setCategoria,
    orden,
    setOrden,
    soloDisponibles,
    setSoloDisponibles,
    limpiarFiltros,
    productosFiltrados,
    cargandoCatalogo,
    carrito,
    cantidadTotal,
    handleAgregarCarrito: agregarAlCarrito,
    handleCambiarCantidad: cambiarCantidadCarrito,
    vaciarCarrito,
    usuarioActual,
    login,
    logout,
    mostrarToast,
  };
}