import { API_URL, get } from ".";

type ProductosVendidosPorCategoria = {
  total: number;
  categorias: {
    nombre: string;
    cantidad: number;
  }[];
};

type IngresosYEgresos = {
  total: {
    ingresos: number;
    egresos: number;
    margen: number;
  };
  fechas: {
    fecha: string;
    ingresos: number;
    egresos: number;
    margen: number;
  }[];
};

export async function getProductosVendidosPorCategoria(
  desde?: Date,
  hasta?: Date
): Promise<ProductosVendidosPorCategoria> {
  let url = `${API_URL}/informes/productosVendidosPorCategoria?`;
  if (desde) {
    url += `desde=${desde?.toISOString()}`;
  }
  if (hasta) {
    url += `&hasta=${hasta?.toISOString()}`;
  }
  return get<ProductosVendidosPorCategoria>(url);
}

export async function getIngresosYEgresos(
  desde?: Date,
  hasta?: Date
): Promise<IngresosYEgresos> {
  let url = `${API_URL}/informes/ingresosYEgresos?`;
  if (desde) {
    url += `desde=${desde?.toISOString()}`;
  }
  if (hasta) {
    url += `&hasta=${hasta?.toISOString()}`;
  }
  return get<IngresosYEgresos>(url);
}
