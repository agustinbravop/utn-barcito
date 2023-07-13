import { VentaService } from "../services/ventas.js";
import { Request, RequestHandler, Response } from "express";
import Joi from "joi";
import { ApiError } from "../utils/apierrors.js";
import { Venta } from "../models/venta.js";
import { LineaVenta } from "../models/lineaVenta.js";

export class VentaController {
  service: VentaService;

  reqSchema = Joi.object<Venta>({
    id: Joi.number().integer().positive(),
    fecha: Joi.date(),
    cliente: Joi.string().allow("").optional(),
    lineas: Joi.array().items(
      Joi.object<LineaVenta>({
        linea: Joi.number().integer().positive().required(),
        cantidad: Joi.number().integer().positive().required(),
        precioUnitario: Joi.number().required(),
        producto: Joi.object({
          id: Joi.number().integer().positive().required(),
        }).required(),
      })
    ),
  });

  constructor(service: VentaService) {
    this.service = service;
  }

  updateByID(): RequestHandler {
    return async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      if (Number.isNaN(id) || id !== req.body.id) {
        res.status(400).json(new ApiError(400, "ID inválido"));
        return;
      }

      const venta = this.validateBody(req.body);
      if (venta === null) {
        res.status(400).json(new ApiError(400, "Body inválido"));
        return;
      }

      const ventaRes = await this.service.update(venta);
      ventaRes.match(
        (ventaUpdated) => res.json(ventaUpdated),
        (err) => res.status(err.status).json(err)
      );
    };
  }

  getByID(): RequestHandler {
    return async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      if (Number.isNaN(id)) {
        res.status(400).json(new ApiError(400, "ID inválido"));
        return;
      }

      const ventaResult = await this.service.getByID(id);
      ventaResult.match(
        (venta) => res.json(venta),
        (err) => res.status(err.status).json(err)
      );
    };
  }

  deleteByID(): RequestHandler {
    return async (req: Request, res: Response) => {
      const id = parseInt(req.params.id);
      if (Number.isNaN(id)) {
        res.status(400).json(new ApiError(400, "ID inválido"));
        return;
      }

      const ventaDeleted = await this.service.deleteByID(id);
      ventaDeleted.match(
        (_) => res.status(204).send(),
        (error) => res.status(error.status).json(error)
      );
    };
  }

  create(): RequestHandler {
    return async (req: Request, res: Response) => {
      const venta = this.validateBody(req.body);
      if (venta === null) {
        res.status(400).json(new ApiError(400, "Body inválido"));
        return;
      }

      const ventaRes = await this.service.create(venta);
      ventaRes.match(
        (venta) => res.status(201).json(venta),
        (err) => res.status(err.status).json(err)
      );
    };
  }

  getAll(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const ventasResult = await this.service.getAll();
      ventasResult.match(
        (ventas) => res.json(ventas),
        (err) => res.status(err.status).json(err)
      );
    };
  }

  private validateBody(body: any): Venta | null {
    try {
      return Joi.attempt(body, this.reqSchema);
    } catch (err) {
      return null;
    }
  }
}
