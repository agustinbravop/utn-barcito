export type Producto = {
  id: number;
  nombre: string;
  stock: number;
  precio: number;
  categoria?: string;
  fechaActualizacion?: Date;
};

export type Compra = {
  id: number;
  fecha: Date;
  proveedor?: string;
  lineas: LineaCompra[];
};

export type LineaCompra = {
  linea: number;
  precioUnitario: number;
  cantidad: number;
  producto: Producto;
};

export type Venta = {
  id: number;
  fecha: Date;
  cliente?: string;
  lineas: LineaVenta[];
};

export type LineaVenta = {
  linea: number;
  precioUnitario: number;
  cantidad: number;
  producto: Producto;
};
