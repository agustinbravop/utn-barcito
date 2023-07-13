import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
  useToast,
} from "@chakra-ui/react";
import { LineaVenta, Producto, Venta } from "../../models/types";
import { ApiError } from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { ProductoListProvider } from "../../hooks/useProductoList";
import { createVenta } from "../../utils/api/ventas";
import SearchableProductoList from "../../components/producto/SearchableProductoList";

interface FormState {
  cliente?: string;
  lineas: LineaVenta[];
}

interface LineaVentaInputProps {
  linea: LineaVenta;
  onChange: (linea: LineaVenta) => void;
}

function LineaVentaInput({ linea, onChange }: LineaVentaInputProps) {
  return (
    <Tr>
      <Td fontWeight="bold">{linea.producto.nombre}</Td>
      <Td isNumeric>{linea.precioUnitario}$</Td>
      <Td isNumeric>{linea.cantidad}</Td>
      <Td>
        <Button
          marginRight="10px"
          onClick={() =>
            onChange({
              ...linea,
              cantidad: linea.cantidad === 0 ? 0 : linea.cantidad - 1,
            })
          }
        >
          -
        </Button>
        <Button
          onClick={() =>
            onChange({
              ...linea,
              cantidad:
                linea.cantidad < linea.producto.stock
                  ? linea.cantidad + 1
                  : linea.cantidad,
            })
          }
        >
          +
        </Button>
      </Td>
    </Tr>
  );
}

export default function NuevaVentaPage() {
  const [state, setState] = useState<FormState>({
    cliente: "",
    lineas: [],
  });
  const navigate = useNavigate();

  const toast = useToast();
  const { mutate, isLoading } = useMutation<Venta, ApiError, FormState>({
    mutationFn: ({ cliente, lineas }) =>
      createVenta({
        cliente,
        lineas: lineas.map((l) => ({ ...l, producto: { id: l.producto.id } })),
      }),
    onSuccess: () => {
      toast({
        title: "Venta realizada.",
        description: `Venta registrada correctamente.`,
        status: "success",
        duration: 6000,
        isClosable: true,
      });
      navigate(-1);
    },
    onError: () => {
      toast({
        title: "Error al crear la venta.",
        description: `Intente de nuevo.`,
        status: "error",
        duration: 6000,
        isClosable: true,
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState({ ...state, [name]: value });
  };

  const handleProductoClick = (prod: Producto) => {
    const lineas = [...state.lineas];
    const linea = lineas.find((l) => l.producto.id === prod.id);
    if (linea) {
      if (linea.cantidad < linea.producto.stock) {
        linea.cantidad += 1;
      }
      setState({
        ...state,
        lineas,
      });
    } else {
      setState({
        ...state,
        lineas: [
          ...lineas,
          {
            linea: state.lineas.length + 1,
            precioUnitario: prod.precio,
            cantidad: 1,
            producto: prod,
          },
        ],
      });
    }
  };

  const handleLineaChange = (linea: LineaVenta) => {
    const lineas = [...state.lineas];

    if (linea.cantidad === 0) {
      lineas.splice(linea.linea - 1, 1);
    } else {
      lineas[linea.linea - 1] = linea;
    }

    setState({
      ...state,
      lineas,
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(state);
  };

  const precioTotal = state.lineas.reduce(
    (acum, l) => acum + l.precioUnitario * l.cantidad,
    0
  );

  return (
    <ProductoListProvider>
      <Card>
        <CardHeader>
          <Heading size="lg" fontSize="3rem" textAlign="center">
            Nueva Venta
          </Heading>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit}>
            <VStack
              spacing="4"
              width="70%"
              justifyContent="center"
              margin="auto"
            >
              <FormControl
                id="cliente"
                variant="floating"
                onChange={handleChange}
                maxWidth="300px"
              >
                <Input placeholder="Cliente" name="cliente" />
                <FormLabel>Cliente</FormLabel>
              </FormControl>
              <TableContainer>
                <Table size="sm">
                  <Thead>
                    <Tr>
                      <Th>Producto</Th>
                      <Th isNumeric>Precio u.</Th>
                      <Th isNumeric>Cantidad</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {state.lineas.map((l) => (
                      <LineaVentaInput
                        linea={l}
                        key={l.linea}
                        onChange={handleLineaChange}
                      />
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
              <Text alignSelf="flex-start" marginLeft="60px">
                Precio total: {precioTotal.toFixed(2)} $
              </Text>
              <HStack>
                <Button variant="secondary" onClick={() => navigate(-1)}>
                  Cancelar
                </Button>
                <Button
                  marginLeft="10px"
                  type="submit"
                  colorScheme="green"
                  isLoading={isLoading}
                >
                  Crear
                </Button>
              </HStack>
            </VStack>
          </form>
        </CardBody>
      </Card>

      <SearchableProductoList onProductoClick={handleProductoClick} />
    </ProductoListProvider>
  );
}
