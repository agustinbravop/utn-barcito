import { Result, err } from "neverthrow";
import { ApiError } from "../utils/apierrors.js";
import { Producto } from "../models/producto.js";
import { ProductoRepository } from "../repositories/productos.js";

export interface ProductoService {
  getAll(): Promise<Result<Producto[], ApiError>>;
  getByID(id: number): Promise<Result<Producto, ApiError>>;
  create(producto: Producto): Promise<Result<Producto, ApiError>>;
  deleteByID(id: number): Promise<Result<Producto, ApiError>>;
  update(producto: Producto): Promise<Result<Producto, ApiError>>;
}

export class ProductoServiceImpl implements ProductoService {
  repository: ProductoRepository;

  constructor(repository: ProductoRepository) {
    this.repository = repository;
  }
  async update(producto: Producto): Promise<Result<Producto, ApiError>> {
    return await this.repository.update(producto);
  }

  async deleteByID(id: number): Promise<Result<Producto, ApiError>> {
    return await this.repository.deleteByID(id);
  }

  async getByID(id: number): Promise<Result<Producto, ApiError>> {
    return await this.repository.getByID(id);
  }

  async getAll(): Promise<Result<Producto[], ApiError>> {
    return await this.repository.getAll();
  }

  async create(producto: Producto): Promise<Result<Producto, ApiError>> {
    if (producto.id) {
      return err(new ApiError(400, "id del producto no debe estar definido"));
    }
    return await this.repository.create(producto);
  }
}
