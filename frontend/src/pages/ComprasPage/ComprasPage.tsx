import React, { useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Heading,
  Input,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCompras } from "../../utils/api/compras";
import CardCompraList from "../../components/compra/CardCompraList";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import { useCurrentUser } from "../../hooks/useCurrentUser";

interface SearchState {
  proveedor: string;
  from?: Date;
  to?: Date;
}

interface ComprasListProps {
  search: SearchState;
}

function ComprasList({ search }: ComprasListProps) {
  const { data, isLoading, isError } = useQuery(["compras"], getCompras);
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return (
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
          No fue posible obtener las ventas
        </AlertTitle>
        <AlertDescription maxWidth="sm">
          Ocurrió un error inesperado. Intente de nuevo.
        </AlertDescription>
      </Alert>
    );
  }

  const compras = data
    ?.filter((c) =>
      c.proveedor?.toLowerCase().includes(search.proveedor.toLowerCase())
    )
    .filter((c) => !search.from || c.fecha >= search.from)
    // Los cálculos con fecha hacen inclusivo al rango [from, to].
    .filter(
      (c) => !search.to || c.fecha.toJSON().split("T")[0] <= search.to.toJSON()
    )
    .sort((a, b) => b.fecha.valueOf() - a.fecha.valueOf());

  return <CardCompraList compras={compras} />;
}

export default function ComprasPage() {
  const { isAdmin } = useCurrentUser();
  const [search, setSearch] = useState<SearchState>({
    proveedor: "",
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "from" || name === "to") {
      setSearch({
        ...search,
        [name]:
          value !== ""
            ? new Date(new Date(value).toISOString().slice(0, -1))
            : undefined,
      });
    } else {
      setSearch({ ...search, [name]: value });
    }
  };

  return (
    <>
      {isAdmin && (
        <Link to="nueva">
          <Button colorScheme="green" size="lg">
            Nueva compra
          </Button>
        </Link>
      )}
      <Heading textAlign="center" fontSize="3rem" size="xl">
        Compras
      </Heading>
      <HStack margin="20px 80px 20px 80px" gap="10px">
        <Heading size="sm">Filtros</Heading>
        <FormControl
          id="proveedor"
          variant="floating"
          onChange={handleSearchChange}
          maxWidth="300px"
        >
          <Input
            backgroundColor="white"
            placeholder="Proveedor"
            name="proveedor"
          />

          <FormLabel>Proveedor</FormLabel>
        </FormControl>
        <FormControl
          id="from"
          variant="floating"
          onChange={handleSearchChange}
          maxWidth="300px"
        >
          <Input
            placeholder="Fecha"
            backgroundColor="white"
            name="from"
            type="date"
          />
          <FormLabel>Desde</FormLabel>
        </FormControl>
        <FormControl
          id="to"
          variant="floating"
          onChange={handleSearchChange}
          maxWidth="300px"
        >
          <Input
            placeholder="Fecha"
            backgroundColor="white"
            name="to"
            type="date"
          />
          <FormLabel>Hasta</FormLabel>
        </FormControl>
      </HStack>
      <ComprasList search={search} />
    </>
  );
}
