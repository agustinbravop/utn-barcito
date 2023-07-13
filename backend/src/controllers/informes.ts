import { RequestHandler } from "express";
import { InformeService } from "../services/informes.js";

export class InformeController {
  service: InformeService;

  constructor(service: InformeService) {
    this.service = service;
  }

  getProductosVendidosPorCategoria(): RequestHandler {
    return async (req, res) => {
      const desde = req.query.desde
        ? new Date(req.query.desde as string)
        : undefined;
      const hasta = req.query.hasta
        ? new Date(req.query.hasta as string)
        : undefined;

      const informeResult = await this.service.getProductosVendidosPorCategoria(
        desde,
        hasta
      );

      informeResult.match(
        (informe) => res.json(informe),
        (err) => res.status(err.status).json(err)
      );
    };
  }

  getIngresosYEgresos(): RequestHandler {
    return async (req, res) => {
      const desde = req.query.desde
        ? new Date(req.query.desde as string)
        : undefined;
      const hasta = req.query.hasta
        ? new Date(req.query.hasta as string)
        : undefined;

      const informeResult = await this.service.getIngresosYEgresos(
        desde,
        hasta
      );

      informeResult.match(
        (informe) => res.json(informe),
        (err) => res.status(err.status).json(err)
      );
    };
  }
}
