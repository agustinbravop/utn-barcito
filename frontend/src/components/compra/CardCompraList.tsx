import { VStack } from "@chakra-ui/react";
import { Compra } from "../../models/types";
import CardCompra from "./CardCompra";

interface CardCompraListProps {
  compras: Compra[];
}

export default function CardCompraList({ compras }: CardCompraListProps) {
  return (
    <VStack spacing="10px" justify="center">
      {compras.map((compra) => (
        <CardCompra {...compra} key={compra.id} />
      ))}
    </VStack>
  );
}
