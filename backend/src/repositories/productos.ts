import { PrismaClient, producto } from "@prisma/client";
import { Result, ok, err } from "neverthrow";
import { ApiError } from "../utils/apierrors.js";
import { Producto } from "../models/producto.js";

export interface ProductoRepository {
  getByID(id: number): Promise<Result<Producto, ApiError>>;
  getAll(): Promise<Result<Producto[], ApiError>>;
  create(producto: Producto): Promise<Result<Producto, ApiError>>;
  deleteByID(id: number): Promise<Result<Producto, ApiError>>;
  update(producto: Producto): Promise<Result<Producto, ApiError>>;
}

export class PrismaProductoRepository implements ProductoRepository {
  private prisma: PrismaClient;
  constructor(client: PrismaClient) {
    this.prisma = client;
  }

  async getAll(): Promise<Result<Producto[], ApiError>> {
    try {
      const prods = await this.prisma.producto.findMany();
      return ok(prods.map((p) => toModel(p)));
    } catch (e) {
      return err(new ApiError(500, "Error al intentar buscar los productos"));
    }
  }

  async create(producto: Producto): Promise<Result<Producto, ApiError>> {
    try {
      const createdProd = await this.prisma.producto.create({
        data: { ...producto, fechaActualizacion: undefined },
      });
      return ok(toModel(createdProd));
    } catch (e) {
      return err(new ApiError(500, "Error al intentar crear el producto"));
    }
  }

  async update(producto: Producto): Promise<Result<Producto, ApiError>> {
    {
      return awaitQuery(
        this.prisma.producto.update({
          where: {
            id: producto.id,
          },
          data: { ...producto, fechaActualizacion: undefined },
        }),
        "No existe producto con id: " + producto.id,
        "Error al intentar actualizar el producto"
      );
    }
  }

  async deleteByID(id: number): Promise<Result<Producto, ApiError>> {
    return awaitQuery(
      this.prisma.producto.delete({
        where: { id: id },
      }),
      "No existe producto con id: " + id,
      "Error al intentar eliminar el producto"
    );
  }

  async getByID(id: number): Promise<Result<Producto, ApiError>> {
    return awaitQuery(
      this.prisma.producto.findUnique({
        where: {
          id: id,
        },
      }),
      "No existe Producto con id: " + id,
      "Error al intentar buscar el producto"
    );
  }
}

function toModel(producto: producto): Producto {
  return {
    ...producto,
    precio: producto.precio.toNumber(),
  };
}

async function awaitQuery(
  promise: Promise<producto | null>,
  notFoundMsg: string,
  errorMsg: string
) {
  try {
    const prod = await promise;
    if (!prod) {
      return err(new ApiError(404, notFoundMsg));
    }
    return ok(toModel(prod));
  } catch (e) {
    return err(new ApiError(500, errorMsg));
  }
}
