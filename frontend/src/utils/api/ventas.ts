import { API_URL, get, post } from ".";
import { Venta } from "../../models/types";

export async function getVentas(): Promise<Venta[]> {
  return get<Venta[]>(`${API_URL}/ventas`).then((ventas) => {
    return ventas.map((venta) => ({
      ...venta,
      fecha: new Date(venta.fecha),
    }));
  });
}

export async function getVentaByID(id: number): Promise<Venta> {
  return get<Venta>(`${API_URL}/ventas/${id}`).then((venta) => ({
    ...venta,
    fecha: new Date(venta.fecha),
  }));
}

interface CreateVentaParams {
  cliente?: string;
  lineas: {
    linea: number;
    precioUnitario: number;
    cantidad: number;
    producto: {
      id: number;
    };
  }[];
}

export async function createVenta(ventaReq: CreateVentaParams): Promise<Venta> {
  return post<Venta>(`${API_URL}/ventas`, ventaReq, 201).then((venta) => ({
    ...venta,
    fecha: new Date(venta.fecha),
  }));
}
