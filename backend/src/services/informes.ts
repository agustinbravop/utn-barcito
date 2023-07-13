import { Result, err, ok } from "neverthrow";
import { CompraService } from "./compras.js";
import { VentaService } from "./ventas.js";
import { ApiError } from "../utils/apierrors.js";
import { getDateString } from "../utils/dates.js";

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

export interface InformeService {
  getProductosVendidosPorCategoria(
    desde?: Date,
    hasta?: Date
  ): Promise<Result<ProductosVendidosPorCategoria, ApiError>>;
  getIngresosYEgresos(
    desde?: Date,
    hasta?: Date
  ): Promise<Result<IngresosYEgresos, ApiError>>;
}

export class InformeServiceImpl implements InformeService {
  ventaService: VentaService;
  compraService: CompraService;

  constructor(ventaService: VentaService, compraService: CompraService) {
    this.ventaService = ventaService;
    this.compraService = compraService;
  }

  async getProductosVendidosPorCategoria(
    desde?: Date,
    hasta?: Date
  ): Promise<Result<ProductosVendidosPorCategoria, ApiError>> {
    const ventasResult = await this.ventaService.getAll();
    if (ventasResult.isErr()) {
      return err(ventasResult._unsafeUnwrapErr());
    }
    let ventas = ventasResult._unsafeUnwrap();

    // Filtra las ventas según parámetros del informe.
    if (desde) {
      ventas = ventas.filter((v) => v.fecha > desde);
    }
    if (hasta) {
      ventas = ventas.filter((v) => v.fecha < hasta);
    }

    // Acumula las cantidades vendidas por categoría del producto.
    const categorias = new Map<string, number>();
    ventas.forEach((v) =>
      v.lineas.forEach(({ cantidad, producto: { categoria } }) => {
        const previo = categorias.get(categoria || "Varios") || 0;
        categorias.set(categoria || "Varios", previo + cantidad);
      })
    );

    // Estructura los datos obtenidos.
    let total = 0;
    const data = Array.from(categorias.entries()).map(([nombre, cantidad]) => {
      total += cantidad;
      return {
        nombre,
        cantidad,
      };
    });

    return ok({
      total,
      categorias: data,
    });
  }

  async getIngresosYEgresos(
    desde?: Date,
    hasta?: Date
  ): Promise<Result<IngresosYEgresos, ApiError>> {
    const ventasResult = await this.ventaService.getAll();
    if (ventasResult.isErr()) {
      return err(ventasResult._unsafeUnwrapErr());
    }
    let ventas = ventasResult._unsafeUnwrap();

    // Filtra las ventas según parámetros del informe.
    if (desde) {
      ventas = ventas.filter((v) => v.fecha > desde);
    }
    if (hasta) {
      ventas = ventas.filter((v) => v.fecha < hasta);
    }

    const comprasResult = await this.compraService.getAll();
    if (comprasResult.isErr()) {
      return err(comprasResult._unsafeUnwrapErr());
    }
    let compras = comprasResult._unsafeUnwrap();

    // Filtra las compras según parámetros del informe.
    if (desde) {
      compras = compras.filter((v) => v.fecha > desde);
    }
    if (hasta) {
      compras = compras.filter((v) => v.fecha < hasta);
    }

    // Acumula los ingresos por día.
    const fechasIngresos = new Map<string, number>();
    ventas.forEach((v) => {
      const ingresos = v.lineas.reduce(
        (sum, l) => sum + l.cantidad * l.precioUnitario,
        0
      );
      const previo = fechasIngresos.get(getDateString(v.fecha)) || 0;
      fechasIngresos.set(getDateString(v.fecha), previo + ingresos);
    });

    // Acumula los egresos por día.
    const fechasEgresos = new Map<string, number>();
    compras.forEach((c) => {
      const egresos = c.lineas.reduce(
        (sum, l) => sum + l.cantidad * l.precioUnitario,
        0
      );
      const previo = fechasEgresos.get(getDateString(c.fecha)) || 0;
      fechasEgresos.set(getDateString(c.fecha), previo + egresos);
    });

    // Estructura los datos calculados para retornarlos.
    const total = {
      ingresos: 0,
      egresos: 0,
      margen: 0,
    };
    const data = Array.from(fechasIngresos.keys()).map((fecha) => {
      const ingresos = fechasIngresos.get(fecha) || 0;
      const egresos = fechasEgresos.get(fecha) || 0;
      const margen = ingresos - egresos;
      total.ingresos += ingresos;
      total.egresos += egresos;
      total.margen += margen;
      return { fecha, ingresos, egresos, margen };
    });
    return ok({ fechas: data, total });
  }
}
