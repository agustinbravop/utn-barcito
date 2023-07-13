import { Result, err } from "neverthrow";
import { ApiError } from "../utils/apierrors.js";
import { Compra } from "../models/compra.js";
import { CompraRepository } from "../repositories/compras.js";
import { ProductoService } from "./productos.js";
import { Producto } from "../models/producto.js";

export interface CompraService {
  getAll(): Promise<Result<Compra[], ApiError>>;
  getByID(id: number): Promise<Result<Compra, ApiError>>;
  create(compra: Compra): Promise<Result<Compra, ApiError>>;
  deleteByID(id: number): Promise<Result<Compra, ApiError>>;
  update(compra: Compra): Promise<Result<Compra, ApiError>>;
}

export class CompraServiceImpl implements CompraService {
  repository: CompraRepository;
  prodService: ProductoService;

  constructor(repository: CompraRepository, prodService: ProductoService) {
    this.repository = repository;
    this.prodService = prodService;
  }

  async update(compra: Compra): Promise<Result<Compra, ApiError>> {
    return await this.repository.update(compra);
  }

  async deleteByID(id: number): Promise<Result<Compra, ApiError>> {
    return await this.repository.deleteByID(id);
  }

  async getByID(id: number): Promise<Result<Compra, ApiError>> {
    return await this.repository.getByID(id);
  }

  async getAll(): Promise<Result<Compra[], ApiError>> {
    return await this.repository.getAll();
  }

  async create(compra: Compra): Promise<Result<Compra, ApiError>> {
    if (compra.id) {
      return err(
        new ApiError(400, "El id de la compra no debe estar definido")
      );
    }

    // Por cada linea de la compra, se aumenta el stock del producto asociado.
    for (let linea of compra.lineas) {
      const prodResult = await this.aumentarStock(
        linea.producto.id,
        linea.cantidad
      );
      if (prodResult.isErr()) {
        return err(prodResult._unsafeUnwrapErr());
      }
    }
    compra.fecha = new Date();
    return await this.repository.create(compra);
  }

  private async aumentarStock(
    idProd: number,
    cant: number
  ): Promise<Result<Producto, ApiError>> {
    const prodResult = await this.prodService.getByID(idProd);
    if (prodResult.isErr()) {
      return prodResult;
    }
    const prod = prodResult._unsafeUnwrap();
    prod.stock += cant;

    return await this.prodService.update(prod);
  }
}
