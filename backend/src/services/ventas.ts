import { Result, err } from "neverthrow";
import { ApiError } from "../utils/apierrors.js";
import { Venta } from "../models/venta.js";
import { VentaRepository } from "../repositories/ventas.js";
import { Producto } from "../models/producto.js";
import { ProductoService } from "./productos.js";

export interface VentaService {
  getAll(): Promise<Result<Venta[], ApiError>>;
  getByID(id: number): Promise<Result<Venta, ApiError>>;
  create(venta: Venta): Promise<Result<Venta, ApiError>>;
  deleteByID(id: number): Promise<Result<Venta, ApiError>>;
  update(venta: Venta): Promise<Result<Venta, ApiError>>;
}

export class VentaServiceImpl implements VentaService {
  repository: VentaRepository;
  prodService: ProductoService;

  constructor(repository: VentaRepository, prodRepo: ProductoService) {
    this.repository = repository;
    this.prodService = prodRepo;
  }

  async update(venta: Venta): Promise<Result<Venta, ApiError>> {
    return this.repository.update(venta);
  }

  async deleteByID(id: number): Promise<Result<Venta, ApiError>> {
    return this.repository.deleteByID(id);
  }

  async getByID(id: number): Promise<Result<Venta, ApiError>> {
    return this.repository.getByID(id);
  }

  async getAll(): Promise<Result<Venta[], ApiError>> {
    return this.repository.getAll();
  }

  async create(venta: Venta): Promise<Result<Venta, ApiError>> {
    if (venta.id) {
      return err(new ApiError(400, "El id de la venta no debe estar definido"));
    }

    // Por cada linea de la venta, se descuenta el stock del producto asociado.
    for (let linea of venta.lineas) {
      const prodResult = await this.descontarStock(
        linea.producto.id,
        linea.cantidad
      );
      if (prodResult.isErr()) {
        return err(prodResult._unsafeUnwrapErr());
      }
    }
    venta.fecha = new Date();
    return await this.repository.create(venta);
  }

  private async descontarStock(
    idProd: number,
    cant: number
  ): Promise<Result<Producto, ApiError>> {
    const prodResult = await this.prodService.getByID(idProd);
    if (prodResult.isErr()) {
      return prodResult;
    }
    const prod = prodResult._unsafeUnwrap();

    if (prod.stock < cant) {
      return err(
        new ApiError(409, `El stock de '${prod.nombre}' es insuficiente`)
      );
    }
    prod.stock -= cant;

    return await this.prodService.update(prod);
  }
}
