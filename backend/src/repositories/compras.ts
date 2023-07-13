import { PrismaClient, compra, lineaCompra, producto } from "@prisma/client";
import { Result, ok, err } from "neverthrow";
import { ApiError } from "../utils/apierrors.js";
import { Compra } from "../models/compra.js";

export interface CompraRepository {
  getByID(id: number): Promise<Result<Compra, ApiError>>;
  getAll(): Promise<Result<Compra[], ApiError>>;
  create(compra: Compra): Promise<Result<Compra, ApiError>>;
  deleteByID(id: number): Promise<Result<Compra, ApiError>>;
  update(compra: Compra): Promise<Result<Compra, ApiError>>;
}

export class PrismaCompraRepository implements CompraRepository {
  private prisma: PrismaClient;
  constructor(client: PrismaClient) {
    this.prisma = client;
  }

  async getAll(): Promise<Result<Compra[], ApiError>> {
    try {
      const compras = await this.prisma.compra.findMany({
        include: {
          lineas: {
            include: {
              producto: true,
            },
          },
        },
      });
      return ok(compras.map((c) => toModel(c)));
    } catch (e) {
      return err(new ApiError(500, "Error al intentar buscar las compras"));
    }
  }
  async getByID(id: number): Promise<Result<Compra, ApiError>> {
    return awaitQuery(
      this.prisma.compra.findUnique({
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
      "No existe una compra con id: " + id,
      "Error al intentar buscar la compra"
    );
  }

  async create(compra: Compra): Promise<Result<Compra, ApiError>> {
    try {
      const compraCreada = await this.prisma.compra.create({
        data: {
          fecha: compra.fecha,
          proveedor: compra.proveedor,
          lineas: {
            create: compra.lineas.map((l) => ({
              linea: l.linea,
              precioUnitario: l.precioUnitario,
              cantidad: l.cantidad,
              idProducto: l.producto.id,
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

      return ok(toModel(compraCreada));
    } catch (error) {
      return err(new ApiError(500, "Error al crear la compra"));
    }
  }

  async deleteByID(id: number): Promise<Result<Compra, ApiError>> {
    return awaitQuery(
      this.prisma.compra.delete({
        where: { id: id },
        include: {
          lineas: {
            include: {
              producto: true,
            },
          },
        },
      }),
      "No existe una compra con id " + id,
      "Error al intentar eliminar la compra"
    );
  }

  async update(compra: Compra): Promise<Result<Compra, ApiError>> {
    return awaitQuery(
      this.prisma.compra.update({
        where: {
          id: compra.id,
        },
        data: {
          fecha: compra.fecha,
          proveedor: compra.proveedor,
          lineas: {
            updateMany: compra.lineas.map((linea) => ({
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
      "No existe la compra con id: " + compra.id,
      "Error al intentar actualizar la compra"
    );
  }
}

function toModel(
  compra: compra & { lineas: (lineaCompra & { producto: producto })[] }
): Compra {
  return {
    ...compra,
    lineas: compra.lineas.map((lc) => ({
      ...lc,
      precioUnitario: lc.precioUnitario.toNumber(),
      producto: { ...lc.producto, precio: lc.producto.precio.toNumber() },
    })),
  };
}

type compraDB = compra & { lineas: (lineaCompra & { producto: producto })[] };

async function awaitQuery(
  promise: Promise<compraDB | null>,
  notFoundMsg: string,
  errorMsg: string
): Promise<Result<Compra, ApiError>> {
  try {
    const compra = await promise;
    if (!compra) {
      return err(new ApiError(404, notFoundMsg));
    }
    return ok(toModel(compra));
  } catch (e) {
    return err(new ApiError(500, errorMsg));
  }
}
