import { PrismaClient } from "@prisma/client";
import express from "express";
import { InformeController } from "../controllers/informes.js";
import { PrismaProductoRepository } from "../repositories/productos.js";
import { PrismaVentaRepository } from "../repositories/ventas.js";
import { InformeServiceImpl } from "../services/informes.js";
import { VentaServiceImpl } from "../services/ventas.js";
import { PrismaCompraRepository } from "../repositories/compras.js";
import { CompraServiceImpl } from "../services/compras.js";

export function informesRouter(prismaClient: PrismaClient) {
  const router = express.Router();

  const prodRepository = new PrismaProductoRepository(prismaClient);

  const ventaRepository = new PrismaVentaRepository(prismaClient);
  const ventaService = new VentaServiceImpl(ventaRepository, prodRepository);

  const compraRepository = new PrismaCompraRepository(prismaClient);
  const compraService = new CompraServiceImpl(compraRepository, prodRepository);

  const service = new InformeServiceImpl(ventaService, compraService);
  const controller = new InformeController(service);

  router.get(
    "/productosVendidosPorCategoria",
    controller.getProductosVendidosPorCategoria()
  );
  router.get("/ingresosYEgresos", controller.getIngresosYEgresos());

  return router;
}
