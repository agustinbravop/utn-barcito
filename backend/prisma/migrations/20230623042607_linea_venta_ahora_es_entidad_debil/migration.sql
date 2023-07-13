-- DropForeignKey
ALTER TABLE `linea_ventas` DROP FOREIGN KEY `linea_ventas_id_venta_fkey`;

-- AddForeignKey
ALTER TABLE `linea_ventas` ADD CONSTRAINT `linea_ventas_id_venta_fkey` FOREIGN KEY (`id_venta`) REFERENCES `ventas`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
