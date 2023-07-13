import express from "express";
import { ProductoController } from "../controllers/productos.js";
import { ProductoServiceImpl } from "../services/productos.js";
import { PrismaProductoRepository } from "../repositories/productos.js";
import { PrismaClient } from "@prisma/client";

export function productosRouter(prismaClient: PrismaClient) {
  const router = express.Router();

  const repository = new PrismaProductoRepository(prismaClient);
  const service = new ProductoServiceImpl(repository);
  const controller = new ProductoController(service);

  router.get("/", controller.getAll());
  router.post("/", controller.create());
  router.get("/:id", controller.getByID());
  router.delete("/:id", controller.deleteByID());
  router.put("/:id", controller.updateByID());

  return router;
}
