import { CardBody, Stack, Heading, Text, Card } from "@chakra-ui/react";
import { Producto } from "../../models/types";
import { useHover } from "../../hooks/useHover";
import ModalEditarProducto from "./ModalEditarProducto";

interface CardProductoProps {
  producto: Producto;
  puedeEditar?: boolean;
  onClick?: (prod: Producto) => void;
}
export default function CardProducto({
  producto,
  puedeEditar = false,
  onClick,
}: CardProductoProps) {
  const { hoverRef, isHovering } = useHover<HTMLDivElement>();

  return (
    <Card
      maxW="13rem"
      minW="13rem"
      flexDirection="row"
      border="transparent solid 1px"
      ref={hoverRef}
      _hover={{ border: "green solid 1px", cursor: onClick && "pointer" }}
      onClick={onClick && ((_) => onClick(producto))}
    >
      <CardBody>
        <Stack margin="1" spacing="2" justify="center">
          <Heading size="md" textAlign="center" lineHeight="10">
            <Color nombre={producto.nombre} stock={producto.stock} />{" "}
            {puedeEditar && (
              <ModalEditarProducto
                producto={producto}
                visibility={isHovering ? "visible" : "hidden"}
              />
            )}
          </Heading>
          <Text size="sm" color="darkgray" align="center">
            {producto.categoria}
          </Text>
          <Text align="center">{producto.precio} $</Text>
          <Text align="center">Stock: {producto.stock}</Text>
        </Stack>
      </CardBody>
    </Card>
  );
}

function Color({ nombre, stock }: { nombre: string; stock: number }) {
  if (stock === 0) {
    return <span style={{ color: "red" }}>{nombre}</span>;
  } else {
    return <span>{nombre}</span>;
  }
}
