import { API_URL, get, post, put } from ".";
import { Producto } from "../../models/types";

export async function getProductos(): Promise<Producto[]> {
  return get<Producto[]>(`${API_URL}/productos`).then((prods) => {
    return prods.map((p) => ({
      ...p,
      fechaActualizacion: new Date(p.fechaActualizacion || ""),
    }));
  });
}

export async function getProductoByID(id: number): Promise<Producto> {
  return get<Producto>(`${API_URL}/productos/${id}`).then((prod) => ({
    ...prod,
    fechaActualizacion: new Date(prod.fechaActualizacion || ""),
  }));
}

interface CreateProductoParams {
  nombre: string;
  stock: number;
  precio: number;
  categoria?: string | undefined;
}

export async function createProducto(
  createReq: CreateProductoParams
): Promise<Producto> {
  return post<Producto>(`${API_URL}/productos`, createReq, 201).then(
    (prod) => ({
      ...prod,
      fechaActualizacion: new Date(prod.fechaActualizacion || ""),
    })
  );
}

export async function updateProducto(producto: Producto): Promise<Producto> {
  return put<Producto>(
    `${API_URL}/productos/${producto.id}`,
    producto,
    200
  ).then((prod) => ({
    ...prod,
    fechaActualizacion: new Date(prod.fechaActualizacion || ""),
  }));
}
