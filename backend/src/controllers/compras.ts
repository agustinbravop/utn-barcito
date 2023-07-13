import { CompraService } from "../services/compras.js";
import { Request, RequestHandler } from "express";
import Joi from "joi";
import { ApiError } from "../utils/apierrors.js";
import { Compra } from "../models/compra.js";
import { LineaCompra } from "../models/lineaCompra.js";

export class CompraController {
  service: CompraService;

  reqSchema = Joi.object<Compra>({
    id: Joi.number().integer().positive(),
    fecha: Joi.date(),
    proveedor: Joi.string().allow(""),
    lineas: Joi.array()
      .required()
      .items(
        Joi.object<LineaCompra>({
          linea: Joi.number().integer().positive().required(),
          precioUnitario: Joi.number().required(),
          cantidad: Joi.number().integer().positive().required(),
          producto: Joi.object({
            id: Joi.number().integer().positive().required(),
          }).required(),
        })
      ),
  });

  constructor(service: CompraService) {
    this.service = service;
  }

  updateByID(): RequestHandler {
    return async (req, res) => {
      const id = parseInt(req.params.id);
      if (Number.isNaN(id) || id !== req.body.id) {
        res.status(400).json(new ApiError(400, "id inválido"));
        return;
      }

      const compra = this.validateBody(req.body);
      if (compra === null) {
        res.status(400).json(new ApiError(400, "body inválido"));
        return;
      }

      const compraRes = await this.service.update(compra);
      compraRes.match(
        (compraUpdated) => res.json(compraUpdated),
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

      const compraResult = await this.service.getByID(id);
      compraResult.match(
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

      const compraDeleted = await this.service.deleteByID(id);
      compraDeleted.match(
        (_) => res.status(204).send(),
        (error) => res.status(error.status).json(error)
      );
    };
  }

  create(): RequestHandler {
    return async (req, res) => {
      const compra = this.validateBody(req.body);
      if (compra === null) {
        res.status(400).json(new ApiError(400, "body inválido"));
        return;
      }

      const compraRes = await this.service.create(compra);
      compraRes.match(
        (compra) => res.status(201).json(compra),
        (err) => res.status(err.status).json(err)
      );
    };
  }

  getAll(): RequestHandler {
    return async (_req, res) => {
      const comprasResult = await this.service.getAll();
      comprasResult.match(
        (compras) => res.json(compras),
        (err) => res.status(err.status).json(err)
      );
    };
  }

  private validateBody(body: any): Compra | null {
    try {
      return Joi.attempt(body, this.reqSchema);
    } catch (err) {
      return null;
    }
  }
}
