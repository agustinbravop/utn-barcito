/*
  Warnings:

  - You are about to drop the `compra` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lineacompra` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lineaventa` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `pokemon` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `producto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `venta` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `lineacompra` DROP FOREIGN KEY `LineaCompra_idCompra_fkey`;

-- DropForeignKey
ALTER TABLE `lineacompra` DROP FOREIGN KEY `LineaCompra_idProducto_fkey`;

-- DropForeignKey
ALTER TABLE `lineaventa` DROP FOREIGN KEY `LineaVenta_idProducto_fkey`;

-- DropForeignKey
ALTER TABLE `lineaventa` DROP FOREIGN KEY `LineaVenta_idVenta_fkey`;

-- DropTable
DROP TABLE `compra`;

-- DropTable
DROP TABLE `lineacompra`;

-- DropTable
DROP TABLE `lineaventa`;

-- DropTable
DROP TABLE `pokemon`;

-- DropTable
DROP TABLE `producto`;

-- DropTable
DROP TABLE `venta`;

-- CreateTable
CREATE TABLE `productos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(20) NOT NULL,
    `stock` INTEGER NOT NULL DEFAULT 0,
    `precio` DECIMAL(12, 2) NOT NULL,
    `categoria` VARCHAR(20) NULL,
    `fechaActualizacion` DATETIME(3) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `compras` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(3) NOT NULL,
    `proveedor` VARCHAR(50) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `linea_compras` (
    `linea` INTEGER NOT NULL,
    `idCompra` INTEGER NOT NULL,
    `idProducto` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `precioUnitario` DECIMAL(12, 2) NOT NULL,

    PRIMARY KEY (`linea`, `idCompra`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ventas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `fecha` DATETIME(3) NOT NULL,
    `cliente` VARCHAR(50) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `linea_ventas` (
    `linea` INTEGER NOT NULL,
    `idVenta` INTEGER NOT NULL,
    `idProducto` INTEGER NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `precioUnitario` DECIMAL(12, 2) NOT NULL,

    PRIMARY KEY (`linea`, `idVenta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `linea_compras` ADD CONSTRAINT `linea_compras_idCompra_fkey` FOREIGN KEY (`idCompra`) REFERENCES `compras`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `linea_compras` ADD CONSTRAINT `linea_compras_idProducto_fkey` FOREIGN KEY (`idProducto`) REFERENCES `productos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `linea_ventas` ADD CONSTRAINT `linea_ventas_idVenta_fkey` FOREIGN KEY (`idVenta`) REFERENCES `ventas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `linea_ventas` ADD CONSTRAINT `linea_ventas_idProducto_fkey` FOREIGN KEY (`idProducto`) REFERENCES `productos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
