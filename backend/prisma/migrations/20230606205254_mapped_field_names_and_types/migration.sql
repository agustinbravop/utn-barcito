/*
  Warnings:

  - The primary key for the `linea_compras` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idCompra` on the `linea_compras` table. All the data in the column will be lost.
  - You are about to drop the column `idProducto` on the `linea_compras` table. All the data in the column will be lost.
  - You are about to drop the column `precioUnitario` on the `linea_compras` table. All the data in the column will be lost.
  - The primary key for the `linea_ventas` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `idProducto` on the `linea_ventas` table. All the data in the column will be lost.
  - You are about to drop the column `idVenta` on the `linea_ventas` table. All the data in the column will be lost.
  - You are about to drop the column `precioUnitario` on the `linea_ventas` table. All the data in the column will be lost.
  - You are about to drop the column `fechaActualizacion` on the `productos` table. All the data in the column will be lost.
  - Added the required column `id_compra` to the `linea_compras` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_producto` to the `linea_compras` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precio_unitario` to the `linea_compras` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_producto` to the `linea_ventas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_venta` to the `linea_ventas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `precio_unitario` to the `linea_ventas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `linea_compras` DROP FOREIGN KEY `linea_compras_idCompra_fkey`;

-- DropForeignKey
ALTER TABLE `linea_compras` DROP FOREIGN KEY `linea_compras_idProducto_fkey`;

-- DropForeignKey
ALTER TABLE `linea_ventas` DROP FOREIGN KEY `linea_ventas_idProducto_fkey`;

-- DropForeignKey
ALTER TABLE `linea_ventas` DROP FOREIGN KEY `linea_ventas_idVenta_fkey`;

-- AlterTable
ALTER TABLE `compras` MODIFY `fecha` TIMESTAMP(0) NOT NULL;

-- AlterTable
ALTER TABLE `linea_compras` DROP PRIMARY KEY,
    DROP COLUMN `idCompra`,
    DROP COLUMN `idProducto`,
    DROP COLUMN `precioUnitario`,
    ADD COLUMN `id_compra` INTEGER NOT NULL,
    ADD COLUMN `id_producto` INTEGER NOT NULL,
    ADD COLUMN `precio_unitario` DECIMAL(12, 2) NOT NULL,
    ADD PRIMARY KEY (`linea`, `id_compra`);

-- AlterTable
ALTER TABLE `linea_ventas` DROP PRIMARY KEY,
    DROP COLUMN `idProducto`,
    DROP COLUMN `idVenta`,
    DROP COLUMN `precioUnitario`,
    ADD COLUMN `id_producto` INTEGER NOT NULL,
    ADD COLUMN `id_venta` INTEGER NOT NULL,
    ADD COLUMN `precio_unitario` DECIMAL(12, 2) NOT NULL,
    ADD PRIMARY KEY (`linea`, `id_venta`);

-- AlterTable
ALTER TABLE `productos` DROP COLUMN `fechaActualizacion`,
    ADD COLUMN `fecha_actualizacion` TIMESTAMP(0) NULL;

-- AlterTable
ALTER TABLE `ventas` MODIFY `fecha` TIMESTAMP(0) NOT NULL;

-- AddForeignKey
ALTER TABLE `linea_compras` ADD CONSTRAINT `linea_compras_id_compra_fkey` FOREIGN KEY (`id_compra`) REFERENCES `compras`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `linea_compras` ADD CONSTRAINT `linea_compras_id_producto_fkey` FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `linea_ventas` ADD CONSTRAINT `linea_ventas_id_venta_fkey` FOREIGN KEY (`id_venta`) REFERENCES `ventas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `linea_ventas` ADD CONSTRAINT `linea_ventas_id_producto_fkey` FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
