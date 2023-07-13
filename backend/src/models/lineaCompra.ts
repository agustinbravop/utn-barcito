import { Producto } from "./producto";

export type LineaCompra = {
  linea: number;
  cantidad: number;
  precioUnitario: number;
  producto: Producto;
};
