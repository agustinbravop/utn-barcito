import express, { Application } from "express";
import morgan from "morgan";
import cors from "cors";
import { productosRouter } from "./routes/productos.js";
import { comprasRouter } from "./routes/compras.js";
import { ventasRouter } from "./routes/ventas.js";
import { PrismaClient } from "@prisma/client";
import { informesRouter } from "./routes/informes.js";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const prismaClient = new PrismaClient();

app.use("/productos", productosRouter(prismaClient));
app.use("/compras", comprasRouter(prismaClient));
app.use("/ventas", ventasRouter(prismaClient));
app.use("/informes", informesRouter(prismaClient));

app.listen(process.env.PORT || 3001, () => {
  console.log(
    `Server listening at http://localhost:${process.env.PORT || 3001}`
  );
});
