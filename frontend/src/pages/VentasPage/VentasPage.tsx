import { useQuery } from "@tanstack/react-query";
import { getVentas } from "../../utils/api/ventas";
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
import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import CardVentaList from "../../components/venta/CardVentaList";

interface SearchState {
  cliente: string;
  from?: Date;
  to?: Date;
}

interface VentasListProps {
  search: SearchState;
}

function VentasList({ search }: VentasListProps) {
  const { data, isLoading, isError } = useQuery(["ventas"], getVentas);
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

  const ventas = data
    ?.filter((v) =>
      v.cliente?.toLowerCase().includes(search.cliente.toLowerCase())
    )
    .filter((v) => !search.from || v.fecha >= search.from)
    // Los cálculos con fecha hacen inclusivo al rango [from, to].
    .filter(
      (c) => !search.to || c.fecha.toJSON().split("T")[0] <= search.to.toJSON()
    )
    .sort((a, b) => b.fecha.valueOf() - a.fecha.valueOf());

  return <CardVentaList ventas={ventas} />;
}

export default function VentasPage() {
  const [search, setSearch] = useState<SearchState>({
    cliente: "",
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
      <Link to="nueva">
        <Button colorScheme="green" size="lg">
          Nueva venta
        </Button>
      </Link>
      <Heading textAlign="center" fontSize="3rem" size="xl">
        Ventas
      </Heading>
      <HStack margin="20px 80px 20px 80px" gap="10px">
        <Heading size="sm">Filtros</Heading>
        <FormControl
          id="cliente"
          variant="floating"
          onChange={handleSearchChange}
          maxWidth="300px"
        >
          <Input backgroundColor="white" placeholder="Cliente" name="cliente" />

          <FormLabel>Cliente</FormLabel>
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
      <VentasList search={search} />
    </>
  );
}
