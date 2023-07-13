import { LineaVenta } from "./lineaVenta";

export type Venta = {
  id: number;
  fecha: Date;
  cliente: string | null;
  lineas: LineaVenta[];
};
