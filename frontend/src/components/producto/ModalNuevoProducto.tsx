import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { Producto } from "../../models/types";
import { ApiError } from "../../utils/api";
import { createProducto } from "../../utils/api/productos";

interface FormState {
  nombre: string;
  precio: number;
  categoria?: string;
}
export default function ModalNuevoProducto() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [state, setState] = useState<FormState>({
    nombre: "",
    precio: 0,
    categoria: "",
  });

  const toast = useToast();
  const queryClient = useQueryClient();
  const { mutate, isLoading } = useMutation<Producto, ApiError, FormState>({
    mutationFn: (prod) => createProducto({ ...prod, stock: 0 }),
    onSuccess: (prod) => {
      toast({
        title: "Producto creado.",
        description: `'${prod.nombre}' guardado correctamente.`,
        status: "success",
        duration: 6000,
        isClosable: true,
      });
      queryClient.refetchQueries(["productos"]);
      onClose();
    },
    onError: () => {
      toast({
        title: "Error al crear el producto.",
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
    mutate(state);
  };

  return (
    <>
      <Button onClick={onOpen} size="lg" variant="outline" colorScheme="green">
        Agregar producto nuevo
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar producto nuevo</ModalHeader>
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
                  <Input placeholder="Nombre" name="nombre" />
                  <FormLabel>Nombre</FormLabel>
                </FormControl>
                <HStack>
                  <FormControl
                    id="precio"
                    variant="floating"
                    isRequired
                    onChange={handleChange}
                  >
                    <Input placeholder="0" name="precio" type="number" />
                    <FormLabel>Precio</FormLabel>
                  </FormControl>
                  <FormControl
                    id="categoria"
                    variant="floating"
                    onChange={handleChange}
                  >
                    <Input placeholder="Categoria" name="categoria" />
                    <FormLabel>Categoria</FormLabel>
                  </FormControl>
                </HStack>
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
                Crear
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
}
