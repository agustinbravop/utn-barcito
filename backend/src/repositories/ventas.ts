import { PrismaClient, lineaVenta, producto, venta } from "@prisma/client";
import { Result, ok, err } from "neverthrow";
import { ApiError } from "../utils/apierrors.js";
import { Venta } from "../models/venta.js";

export interface VentaRepository {
  getByID(id: number): Promise<Result<Venta, ApiError>>;
  getAll(): Promise<Result<Venta[], ApiError>>;
  create(venta: Venta): Promise<Result<Venta, ApiError>>;
  deleteByID(id: number): Promise<Result<Venta, ApiError>>;
  update(venta: Venta): Promise<Result<Venta, ApiError>>;
}

export class PrismaVentaRepository implements VentaRepository {
  private prisma: PrismaClient;

  constructor(client: PrismaClient) {
    this.prisma = client;
  }

  async getByID(id: number): Promise<Result<Venta, ApiError>> {
    return awaitQuery(
      this.prisma.venta.findUnique({
        include: {
          lineas: {
            include: {
              producto: true,
            },
          },
        },
        where: {
          id: id,
        },
      }),
      "No existe una venta con ID: " + id,
      "Error al intentar buscar la venta"
    );
  }

  async getAll(): Promise<Result<Venta[], ApiError>> {
    try {
      const ventas = await this.prisma.venta.findMany({
        include: {
          lineas: {
            include: {
              producto: true,
            },
          },
        },
      });
      return ok(ventas.map((v) => toModel(v)));
    } catch (e) {
      return err(new ApiError(500, "Error al intentar buscar las ventas"));
    }
  }

  async create(venta: Venta): Promise<Result<Venta, ApiError>> {
    try {
      const createdVenta = await this.prisma.venta.create({
        data: {
          fecha: venta.fecha,
          cliente: venta.cliente,
          lineas: {
            create: venta.lineas.map((linea) => ({
              linea: linea.linea,
              cantidad: linea.cantidad,
              precioUnitario: linea.precioUnitario,
              idProducto: linea.producto.id,
            })),
          },
        },
        include: {
          lineas: {
            include: {
              producto: true,
            },
          },
        },
      });

      return ok(toModel(createdVenta));
    } catch (e) {
      return err(new ApiError(500, "Error al intentar crear la venta"));
    }
  }

  async update(venta: Venta): Promise<Result<Venta, ApiError>> {
    return awaitQuery(
      this.prisma.venta.update({
        where: {
          id: venta.id,
        },
        data: {
          fecha: venta.fecha,
          cliente: venta.cliente,
          lineas: {
            updateMany: venta.lineas.map((linea) => ({
              where: { linea: linea.linea },
              data: {
                cantidad: linea.cantidad,
                precioUnitario: linea.precioUnitario,
                idProducto: linea.producto.id,
              },
            })),
          },
        },
        include: {
          lineas: {
            include: {
              producto: true,
            },
          },
        },
      }),
      "No existe una venta con ID: " + venta.id,
      "Error al intentar actualizar la venta"
    );
  }

  async deleteByID(id: number): Promise<Result<Venta, ApiError>> {
    return awaitQuery(
      this.prisma.venta.delete({
        where: { id: id },
        include: {
          lineas: {
            include: {
              producto: true,
            },
          },
        },
      }),
      "No existe una venta con id " + id,
      "Error al intentar eliminar la venta"
    );
  }
}

function toModel(
  compra: venta & { lineas: (lineaVenta & { producto: producto })[] }
): Venta {
  return {
    ...compra,
    lineas: compra.lineas.map((lc) => ({
      ...lc,
      precioUnitario: lc.precioUnitario.toNumber(),
      producto: { ...lc.producto, precio: lc.producto.precio.toNumber() },
    })),
  };
}

type ventaDB = venta & { lineas: (lineaVenta & { producto: producto })[] };

async function awaitQuery(
  promise: Promise<ventaDB | null>,
  notFoundMsg: string,
  errorMsg: string
): Promise<Result<Venta, ApiError>> {
  try {
    const venta = await promise;
    if (!venta) {
      return err(new ApiError(404, notFoundMsg));
    }
    return ok(toModel(venta));
  } catch (e) {
    return err(new ApiError(500, errorMsg));
  }
}
