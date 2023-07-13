import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Producto } from "../../models/types";
import { ApiError } from "../../utils/api";
import { updateProducto } from "../../utils/api/productos";
import { EditIcon } from "@chakra-ui/icons";

interface FormState {
  nombre: string;
  precio: number;
  categoria?: string;
}

interface ModalEditarProductoProps {
  producto: Producto;
  visibility?: "hidden" | "visible";
}

export default function ModalEditarProducto({
  producto: { id, nombre, precio, categoria, stock, fechaActualizacion },
  visibility = "hidden",
}: ModalEditarProductoProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [state, setState] = useState<FormState>({
    nombre: nombre,
    precio: precio,
    categoria: categoria,
  });
  const toast = useToast();

  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation<Producto, ApiError, Producto>({
    mutationFn: (prod) => updateProducto({ ...prod }),
    onSuccess: (prod) => {
      toast({
        title: "Producto actualizado.",
        description: `'${prod.nombre}' actualizado correctamente.`,
        status: "success",
        duration: 6000,
        isClosable: true,
      });
      queryClient.refetchQueries(["productos"]);
      onClose();
    },
    onError: () => {
      toast({
        title: "Error al actualizar el producto.",
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate({ ...state, stock, fechaActualizacion, id });
  };

  return (
    <>
      <IconButton
        size="sm"
        icon={<EditIcon />}
        aria-label="editar"
        position="absolute"
        top="7"
        right="5"
        onClick={onOpen}
        visibility={visibility}
      />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Modificar producto</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack
                spacing="4"
                width="400px"
                justifyContent="center"
                margin="auto"
              >
                <FormControl
                  id="nombre"
                  variant="floating"
                  isRequired
                  onChange={handleChange}
                >
                  <Input
                    placeholder="Nombre"
                    value={state.nombre}
                    name="nombre"
                  />
                  <FormLabel>Nombre</FormLabel>
                </FormControl>
                <HStack>
                  <FormControl
                    id="precio"
                    variant="floating"
                    isRequired
                    onChange={handleChange}
                  >
                    <Input
                      placeholder="0"
                      value={state.precio}
                      name="precio"
                      type="number"
                    />
                    <FormLabel>Precio</FormLabel>
                  </FormControl>
                  <FormControl
                    id="categoria"
                    variant="floating"
                    onChange={handleChange}
                  >
                    <Input
                      placeholder="Categoria"
                      value={state.categoria}
                      name="categoria"
                    />
                    <FormLabel>Categoria</FormLabel>
                  </FormControl>
                </HStack>
                "
                <Text alignSelf="flex-start" marginLeft="1">
                  Stock: {stock}
                </Text>
                <Text alignSelf="flex-start" marginLeft="1">
                  Última actualización:{" "}
                  {fechaActualizacion?.toLocaleString("es-AR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </Text>
              </VStack>
            </ModalBody>

            <ModalFooter justifyContent="center">
              <Button variant="secondary" onClick={onClose}>
                Cancelar
              </Button>
              <Button
                marginLeft="10px"
                type="submit"
                colorScheme="green"
                isLoading={isLoading}
              >
                Guardar
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
