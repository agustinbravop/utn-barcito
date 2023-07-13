export type Producto = {
  id: number;
  nombre: string;
  stock: number;
  precio: number;
  categoria: string | null;
  fechaActualizacion: Date | null;
};
