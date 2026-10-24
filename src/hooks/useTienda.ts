import { useState, useContext } from 'react';
import { TiendaContext } from '../context/TiendaContext';
import type { producto, ItemCarrito } from '../types';

export function useTienda() {
  // Consumimos los productos desde el estado global
  const { productos, setProductos } = useContext(TiendaContext);
  
  const [busqueda, setBusqueda] = useState('');
  const [categoria, setCategoria] = useState('');
  const [carrito, setCarrito] = useState<ItemCarrito[]>([]);

  const productosFiltrados = productos.filter((p) => {
    const coincideTexto = 
      p.modelo.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoria === '' || p.categoria === categoria;
    return coincideTexto && coincideCategoria;
  });

  const handleAgregarCarrito = (prod: producto) => {
    if (prod.stock <= 0) return;
    setProductos(prev => prev.map(p => p.codigo === prod.codigo ? { ...p, stock: p.stock - 1 } : p));
    setCarrito(prev => {
      const existe = prev.find(item => item.codigo === prod.codigo);
      if (existe) return prev.map(item => item.codigo === prod.codigo ? { ...item, cantidad: item.cantidad + 1 } : item);
      return [...prev, { ...prod, cantidad: 1 }];
    });
  };

  const handleCambiarCantidad = (codigo: string, cambio: number) => {
    const productoBase = productos.find(p => p.codigo === codigo);
    const itemCarrito = carrito.find(i => i.codigo === codigo);
    
    if (!productoBase || !itemCarrito) return;
    if (cambio > 0 && productoBase.stock <= 0) {
      alert("Stock máximo alcanzado.");
      return;
    }

    setProductos(prev => prev.map(p => p.codigo === codigo ? { ...p, stock: p.stock - cambio } : p));
    setCarrito(prev => prev.map(item => {
      if (item.codigo === codigo) return { ...item, cantidad: item.cantidad + cambio };
      return item;
    }).filter(item => item.cantidad > 0));
  };

  const handleFinalizarCompra = () => {
    alert("¡Compra realizada con éxito!");
    setCarrito([]);
  };

  const cantidadTotal = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  return {
    busqueda, setBusqueda, categoria, setCategoria,
    productosFiltrados, carrito, cantidadTotal,
    handleAgregarCarrito, handleCambiarCantidad, handleFinalizarCompra
  };
}