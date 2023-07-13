import { LineaCompra } from "./lineaCompra";

export type Compra = {
  id: number;
  fecha: Date;
  proveedor: string | null;
  lineas: LineaCompra[];
};
