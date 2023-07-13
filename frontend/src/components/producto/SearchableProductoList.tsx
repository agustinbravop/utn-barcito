import { Producto } from "../../models/types";
import { useQuery } from "@tanstack/react-query";
import { getProductos } from "../../utils/api/productos";
import { useProductoList } from "../../hooks/useProductoList";
import React, { useEffect } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  FormControl,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import CardProductoList from "./CardProductoList";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

interface SearchableProductoListProps {
  onProductoClick: (prod: Producto) => void;
}

export default function SearchableProductoList({
  onProductoClick,
}: SearchableProductoListProps) {
  const { data, isLoading, isError } = useQuery(["productos"], getProductos);
  const { productos, newProductos, setSearch } = useProductoList();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const handleProductoClick = (prod: Producto) => {
    onProductoClick(prod);
  };

  useEffect(() => {
    if (data) {
      newProductos(data);
    }
  }, [data, newProductos]);

  return (
    <>
      <FormControl
        id="search"
        variant="floating"
        margin="15px auto 15px auto"
        paddingRight="30px"
        maxWidth="400px"
        onChange={handleSearchChange}
      >
        <Input
          backgroundColor="white"
          placeholder="Producto..."
          name="search"
        />
        <FormLabel>Buscar producto</FormLabel>
      </FormControl>
      {isLoading ? (
        <LoadingSpinner />
      ) : isError ? (
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            No fue posible obtener los productos
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            Ocurrió un error inesperado. Intente de nuevo.
          </AlertDescription>
        </Alert>
      ) : (
        <CardProductoList productos={productos} onClick={handleProductoClick} />
      )}
    </>
  );
}
