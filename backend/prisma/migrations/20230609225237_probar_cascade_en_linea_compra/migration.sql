-- DropForeignKey
ALTER TABLE `linea_compras` DROP FOREIGN KEY `linea_compras_id_compra_fkey`;

-- DropForeignKey
ALTER TABLE `linea_compras` DROP FOREIGN KEY `linea_compras_id_producto_fkey`;

-- AddForeignKey
ALTER TABLE `linea_compras` ADD CONSTRAINT `linea_compras_id_compra_fkey` FOREIGN KEY (`id_compra`) REFERENCES `compras`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `linea_compras` ADD CONSTRAINT `linea_compras_id_producto_fkey` FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
