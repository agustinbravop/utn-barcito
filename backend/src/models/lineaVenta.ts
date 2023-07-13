import { Producto } from "./producto";

export type LineaVenta = {
  linea: number;
  cantidad: number;
  precioUnitario: number;
  producto: Producto;
};
