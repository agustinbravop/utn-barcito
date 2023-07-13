import { ProductoService } from "../services/productos.js";
import { Request, RequestHandler } from "express";
import Joi from "joi";
import { Producto } from "../models/producto.js";
import { ApiError } from "../utils/apierrors.js";

export class ProductoController {
  service: ProductoService;

  reqSchema = Joi.object<Producto>({
    id: Joi.number().integer().positive(),
    nombre: Joi.string().required(),
    stock: Joi.number().integer().required(),
    precio: Joi.number().required(),
    categoria: Joi.string(),
    fechaActualizacion: Joi.date(),
  });

  constructor(service: ProductoService) {
    this.service = service;
  }

  updateByID(): RequestHandler {
    return async (req, res) => {
      const id = parseInt(req.params.id);
      if (Number.isNaN(id) || id !== req.body.id) {
        res.status(400).json(new ApiError(400, "id inválido"));
        return;
      }

      const prod = this.validateBody(req.body);
      if (prod === null) {
        res.status(400).json(new ApiError(400, "body inválido"));
        return;
      }
      const prodRes = await this.service.update(prod);
      prodRes.match(
        (updatedProd) => res.json(updatedProd),
        (err) => res.status(err.status).json(err)
      );
    };
  }

  getByID(): RequestHandler {
    return async (req, res) => {
      const id = parseInt(req.params.id);
      if (Number.isNaN(id)) {
        res.status(400).json(new ApiError(400, "id inválido"));
        return;
      }

      const prodResult = await this.service.getByID(id);
      prodResult.match(
        (prod) => res.json(prod),
        (err) => res.status(err.status).json(err)
      );
    };
  }

  deleteByID(): RequestHandler {
    return async (req: Request, res) => {
      const id = parseInt(req.params.id);
      if (Number.isNaN(id)) {
        res.status(400).json(new ApiError(400, "id inválido"));
        return;
      }

      const prodDeleted = await this.service.deleteByID(id);
      prodDeleted.match(
        (_) => res.status(204).send(),
        (error) => res.status(error.status).json(error)
      );
    };
  }

  create(): RequestHandler {
    return async (req, res) => {
      const prod = this.validateBody(req.body);
      if (prod === null) {
        res.status(400).json(new ApiError(400, "body inválido"));
        return;
      }

      const prodRes = await this.service.create(prod);
      prodRes.match(
        (prod) => res.status(201).json(prod),
        (err) => res.status(err.status).json(err)
      );
    };
  }

  getAll(): RequestHandler {
    return async (_req, res) => {
      const prodsResult = await this.service.getAll();
      prodsResult.match(
        (prods) => res.json(prods),
        (err) => res.status(err.status).json(err)
      );
    };
  }

  private validateBody(body: any): Producto | null {
    try {
      return Joi.attempt(body, this.reqSchema);
    } catch (err) {
      return null;
    }
  }
}
