export interface producto {
  codigo: string;
  categoria: string;
  modelo: string;
  marca: string;
  stock: number;
  precio: number;
  descripcion: string;
  imagen: string;
}

export interface ItemCarrito extends producto {
  cantidad: number;
}