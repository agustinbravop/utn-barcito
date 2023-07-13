import { VStack } from "@chakra-ui/react";
import { Venta } from "../../models/types";
import CardVenta from "./CardVenta";

interface CardVentaListProps {
  ventas: Venta[];
}

export default function CardVentaList({ ventas }: CardVentaListProps) {
  return (
    <VStack spacing="10px" justify="center">
      {ventas.map((venta) => (
        <CardVenta {...venta} key={venta.id} />
      ))}
    </VStack>
  );
}
