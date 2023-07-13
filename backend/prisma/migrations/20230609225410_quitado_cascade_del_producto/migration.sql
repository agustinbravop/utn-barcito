-- DropForeignKey
ALTER TABLE `linea_compras` DROP FOREIGN KEY `linea_compras_id_producto_fkey`;

-- AddForeignKey
ALTER TABLE `linea_compras` ADD CONSTRAINT `linea_compras_id_producto_fkey` FOREIGN KEY (`id_producto`) REFERENCES `productos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
