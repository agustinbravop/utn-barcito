import { Wrap, WrapItem } from "@chakra-ui/react";
import CardProducto from "./CardProducto";
import { Producto } from "../../models/types";

interface CardProductoListProps {
  productos: Producto[];
  puedeEditar?: boolean;
  onClick?: (prod: Producto) => void;
}

export default function CardProductoList({
  productos,
  puedeEditar = false,
  onClick,
}: CardProductoListProps) {
  return (
    <Wrap spacing="20px" justify="center">
      {productos.map((producto) => (
        <WrapItem key={producto.id}>
          <CardProducto
            producto={producto}
            puedeEditar={puedeEditar}
            onClick={onClick}
          />
        </WrapItem>
      ))}
    </Wrap>
  );
}
