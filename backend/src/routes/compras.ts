import express from "express";
import { CompraController } from "../controllers/compras.js";
import { CompraServiceImpl } from "../services/compras.js";
import { PrismaCompraRepository } from "../repositories/compras.js";
import { PrismaProductoRepository } from "../repositories/productos.js";
import { ProductoServiceImpl } from "../services/productos.js";
import { PrismaClient } from "@prisma/client";

export function comprasRouter(prismaClient: PrismaClient) {
  const router = express.Router();

  const prodRepository = new PrismaProductoRepository(prismaClient);
  const prodService = new ProductoServiceImpl(prodRepository);

  const repository = new PrismaCompraRepository(prismaClient);
  const service = new CompraServiceImpl(repository, prodService);
  const controller = new CompraController(service);

  router.get("/", controller.getAll());
  router.post("/", controller.create());
  router.get("/:id", controller.getByID());
  router.delete("/:id", controller.deleteByID());
  router.put("/:id", controller.updateByID());

  return router;
}
