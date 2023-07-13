import {
  Card,
  CardHeader,
  CardBody,
  Text,
  Badge,
  HStack,
  CardFooter,
  Tooltip,
  useDisclosure,
  Button,
  Collapse,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Heading,
} from "@chakra-ui/react";
import { Avatar } from "@chakra-ui/react";
import { ChevronDownIcon, ChevronUpIcon } from "@chakra-ui/icons";
import { LineaCompra, Compra } from "../../models/types";

function TrLineaCompra({
  linea,
  precioUnitario,
  cantidad,
  producto,
}: LineaCompra) {
  const precioTotal = precioUnitario * cantidad;
  return (
    <Tr>
      <Td isNumeric>{linea}</Td>
      <Td fontWeight="bold">{producto.nombre}</Td>
      <Td isNumeric>{cantidad}</Td>
      <Td isNumeric>{precioUnitario} $</Td>
      <Td isNumeric>{precioTotal.toFixed(2)} $</Td>
    </Tr>
  );
}

export default function CardCompra({ id, fecha, lineas, proveedor }: Compra) {
  const { isOpen, onToggle } = useDisclosure();
  const precioTotal = lineas.reduce((total, linea) => {
    return total + linea.cantidad * linea.precioUnitario;
  }, 0);

  return (
    <Card size="sm" width="100%" maxWidth="700px">
      <HStack>
        <CardHeader textAlign="center" width="20%">
          <HStack>
            <Tooltip label={proveedor || "N/A"}>
              <Avatar name={proveedor} bg="black" size="sm" />
            </Tooltip>
            <Heading size="xs">{proveedor}</Heading>
          </HStack>
        </CardHeader>
        <CardBody>
          <HStack justify="space-between">
            <Text colorScheme="gray">N° {id}</Text>
            <Text>{new Date(fecha).toLocaleString()}</Text>
            <Badge fontSize="md">Total: {precioTotal.toFixed(2)} $</Badge>
          </HStack>
        </CardBody>
        <CardFooter>
          <Button onClick={onToggle} variant="outline">
            Detalles {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Button>
        </CardFooter>
      </HStack>

      <Collapse in={isOpen}>
        <TableContainer width="80%" margin="0 auto 15px auto">
          <Table size="sm" variant="striped">
            <Thead>
              <Tr>
                <Th isNumeric>Linea</Th>
                <Th>Producto</Th>
                <Th isNumeric>Cantidad</Th>
                <Th isNumeric>Precio u.</Th>
                <Th isNumeric>Total</Th>
              </Tr>
            </Thead>
            <Tbody>
              {lineas.map((linea) => (
                <TrLineaCompra {...linea} />
              ))}
              <Tr>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td></Td>
                <Td isNumeric>{precioTotal.toFixed(2)}$</Td>
              </Tr>
            </Tbody>
          </Table>
        </TableContainer>
      </Collapse>
    </Card>
  );
}
