import { API_URL, get, post } from ".";
import { Compra } from "../../models/types";

export async function getCompras(): Promise<Compra[]> {
  return get<Compra[]>(`${API_URL}/compras`).then((compras) => {
    return compras.map((compra) => ({
      ...compra,
      fecha: new Date(compra.fecha),
    }));
  });
}

export async function getCompraByID(id: number): Promise<Compra> {
  return get<Compra>(`${API_URL}/compras/${id}`).then((compra) => ({
    ...compra,
    fecha: new Date(compra.fecha),
  }));
}

interface CreateCompraParams {
  proveedor?: string;
  lineas: {
    linea: number;
    precioUnitario: number;
    cantidad: number;
    producto: {
      id: number;
    };
  }[];
}

export async function createCompra(
  compra: CreateCompraParams
): Promise<Compra> {
  return post<Compra>(`${API_URL}/compras`, compra, 201).then((compra) => ({
    ...compra,
    fecha: new Date(compra.fecha),
  }));
}
