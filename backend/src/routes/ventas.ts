import express from "express";
import { VentaController } from "../controllers/ventas.js";
import { VentaServiceImpl } from "../services/ventas.js";
import { PrismaVentaRepository } from "../repositories/ventas.js";
import { PrismaProductoRepository } from "../repositories/productos.js";
import { ProductoServiceImpl } from "../services/productos.js";
import { PrismaClient } from "@prisma/client";

export function ventasRouter(prismaClient: PrismaClient) {
  const router = express.Router();

  const prodRepository = new PrismaProductoRepository(prismaClient);
  const prodService = new ProductoServiceImpl(prodRepository);

  const repository = new PrismaVentaRepository(prismaClient);
  const service = new VentaServiceImpl(repository, prodService);
  const controller = new VentaController(service);

  router.get("/", controller.getAll());
  router.post("/", controller.create());
  router.get("/:id", controller.getByID());
  router.delete("/:id", controller.deleteByID());
  router.put("/:id", controller.updateByID());

  return router;
}
